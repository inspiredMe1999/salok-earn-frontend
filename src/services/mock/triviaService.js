import {
    triviaCategories,
    triviaQuestions,
    mockTriviaUsage,
    TRIVIA_LIMITS,
} from "../../data/triviaData";

/*
|--------------------------------------------------------------------------
| Mock Trivia Service
|--------------------------------------------------------------------------
|
| This service simulates the future trivia backend.
|
| IMPORTANT:
| Data is persisted in localStorage so that:
|
| - Refreshing the page does not destroy trivia sessions.
| - Energy remains reduced after playing.
| - Results remain available after refreshing.
|
| Later this entire service can be replaced with Firebase/API calls.
|
|--------------------------------------------------------------------------
*/

const STORAGE_KEY =
    "salok_trivia_mock_state";

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function delay(milliseconds = 500) {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}

function clone(data) {
    return JSON.parse(
        JSON.stringify(data)
    );
}

function getCategory(categoryId) {
    return triviaCategories.find(
        (category) =>
            category.id === categoryId
    );
}

function getQuestionsForCategory(
    categoryId
) {
    return (
        triviaQuestions[categoryId] || []
    );
}

/*
|--------------------------------------------------------------------------
| Persistent Mock State
|--------------------------------------------------------------------------
*/

function getDefaultState() {
    return {
        usage: clone(
            mockTriviaUsage
        ),

        sessions: {},
    };
}

function loadState() {
    try {
        const stored =
            localStorage.getItem(
                STORAGE_KEY
            );

        if (!stored) {
            const defaultState =
                getDefaultState();

            saveState(defaultState);

            return defaultState;
        }

        const parsed =
            JSON.parse(stored);

        return {
            usage: {
                ...getDefaultState()
                    .usage,

                ...parsed.usage,
            },

            sessions:
                parsed.sessions || {},
        };
    } catch (error) {
        console.error(
            "Unable to load mock trivia state:",
            error
        );

        const defaultState =
            getDefaultState();

        saveState(defaultState);

        return defaultState;
    }
}

function saveState(state) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state)
    );
}

/*
|--------------------------------------------------------------------------
| Trivia Overview
|--------------------------------------------------------------------------
*/

export async function getTriviaOverview() {
    await delay(400);

    const state =
        loadState();

    const lastRound =
        state.usage.lastRound;

    const lastRoundCategory =
        lastRound
            ? getCategory(
                lastRound.categoryId
            )
            : null;

    return clone({
        energy: {
            current:
                state.usage.energy,

            max:
                TRIVIA_LIMITS.energyMax,
        },

        dailyAnswers: {
            current:
                state.usage.dailyAnswers,

            max:
                TRIVIA_LIMITS.dailyAnswers,
        },

        categories:
            triviaCategories.map(
                (category) => ({
                    ...category,

                    used:
                        state.usage
                            .categoryAnswers[
                        category.id
                        ] || 0,

                    limit:
                        TRIVIA_LIMITS.categoryAnswers,
                })
            ),

        lastRound: lastRound
            ? {
                ...lastRound,

                categoryName:
                    lastRoundCategory?.name ||
                    "Trivia",
            }
            : null,
    });
}

/*
|--------------------------------------------------------------------------
| Start Trivia Round
|--------------------------------------------------------------------------
*/

export async function startTriviaRound(
    categoryId
) {
    await delay(600);

    const state =
        loadState();

    const category =
        getCategory(categoryId);

    if (!category) {
        throw new Error(
            "The selected trivia category could not be found."
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Check energy
    |--------------------------------------------------------------------------
    */

    if (
        state.usage.energy <
        TRIVIA_LIMITS.roundEnergyCost
    ) {
        throw new Error(
            "You do not have enough energy to start this round."
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Check daily limit
    |--------------------------------------------------------------------------
    */

    if (
        state.usage.dailyAnswers >=
        TRIVIA_LIMITS.dailyAnswers
    ) {
        throw new Error(
            "You have reached your daily trivia answer limit."
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Check category limit
    |--------------------------------------------------------------------------
    */

    const categoryUsed =
        state.usage
            .categoryAnswers[
        categoryId
        ] || 0;

    if (
        categoryUsed >=
        TRIVIA_LIMITS.categoryAnswers
    ) {
        throw new Error(
            `You have reached today's ${category.name} question limit.`
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Get category questions
    |--------------------------------------------------------------------------
    */

    const questions =
        getQuestionsForCategory(
            categoryId
        );

    if (!questions.length) {
        throw new Error(
            "No trivia questions are available for this category."
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Consume energy
    |--------------------------------------------------------------------------
    */

    state.usage.energy -=
        TRIVIA_LIMITS.roundEnergyCost;

    /*
    |--------------------------------------------------------------------------
    | Create session
    |--------------------------------------------------------------------------
    */

    const sessionId =
        `trivia-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 8)}`;

    const session = {
        id: sessionId,

        categoryId,

        categoryName:
            category.name,

        currentIndex: 0,

        score: 0,

        correctAnswers: 0,

        totalQuestions:
            questions.length,

        energyUsed:
            TRIVIA_LIMITS.roundEnergyCost,

        completed: false,

        results: [],

        result: null,

        createdAt:
            new Date().toISOString(),
    };

    state.sessions[sessionId] =
        session;

    /*
    |--------------------------------------------------------------------------
    | Save everything
    |--------------------------------------------------------------------------
    */

    saveState(state);

    return clone({
        id: session.id,

        categoryId:
            session.categoryId,

        categoryName:
            session.categoryName,

        totalQuestions:
            session.totalQuestions,

        currentIndex:
            session.currentIndex,

        score:
            session.score,

        correctAnswers:
            session.correctAnswers,

        energyUsed:
            session.energyUsed,
    });
}

/*
|--------------------------------------------------------------------------
| Get Trivia Session
|--------------------------------------------------------------------------
*/

export async function getTriviaSession(
    sessionId
) {
    await delay(250);

    const state =
        loadState();

    const session =
        state.sessions[
        sessionId
        ];

    if (!session) {
        return null;
    }

    return clone(session);
}

/*
|--------------------------------------------------------------------------
| Get Trivia Question
|--------------------------------------------------------------------------
*/

export async function getTriviaQuestion(
    sessionId,
    questionIndex
) {
    await delay(350);

    const state =
        loadState();

    const session =
        state.sessions[
        sessionId
        ];

    if (!session) {
        throw new Error(
            "Trivia session not found."
        );
    }

    const questions =
        getQuestionsForCategory(
            session.categoryId
        );

    if (
        questionIndex < 0 ||
        questionIndex >= questions.length
    ) {
        throw new Error(
            "The requested trivia question does not exist."
        );
    }

    const originalQuestion =
        questions[questionIndex];

    /*
    |--------------------------------------------------------------------------
    | Never expose correct answer
    |--------------------------------------------------------------------------
    */

    const {
        correctAnswer,
        ...safeQuestion
    } = originalQuestion;

    return clone({
        ...safeQuestion,

        categoryId:
            session.categoryId,

        categoryName:
            session.categoryName,

        questionIndex,

        totalQuestions:
            questions.length,
    });
}

/*
|--------------------------------------------------------------------------
| Submit Trivia Answer
|--------------------------------------------------------------------------
*/

export async function submitTriviaAnswer(
    sessionId,
    questionId,
    answerId
) {
    await delay(650);

    const state =
        loadState();

    const session =
        state.sessions[
        sessionId
        ];

    if (!session) {
        throw new Error(
            "Trivia session not found."
        );
    }

    if (session.completed) {
        throw new Error(
            "This trivia round has already been completed."
        );
    }

    const questions =
        getQuestionsForCategory(
            session.categoryId
        );

    const question =
        questions.find(
            (item) =>
                item.id === questionId
        );

    if (!question) {
        throw new Error(
            "Trivia question not found."
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Validate answer
    |--------------------------------------------------------------------------
    */

    const correct =
        String(answerId) ===
        String(
            question.correctAnswer
        );

    /*
    |--------------------------------------------------------------------------
    | Find answers
    |--------------------------------------------------------------------------
    */

    const correctAnswerObject =
        question.answers.find(
            (answer) =>
                String(answer.id) ===
                String(
                    question.correctAnswer
                )
        );

    const selectedAnswerObject =
        question.answers.find(
            (answer) =>
                String(answer.id) ===
                String(answerId)
        );

    if (!selectedAnswerObject) {
        throw new Error(
            "The selected answer could not be found."
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Update score
    |--------------------------------------------------------------------------
    */

    if (correct) {
        session.score += 1;

        session.correctAnswers +=
            1;
    }

    /*
    |--------------------------------------------------------------------------
    | Update usage
    |--------------------------------------------------------------------------
    */

    state.usage.dailyAnswers += 1;

    state.usage.categoryAnswers[
        session.categoryId
    ] =
        (
            state.usage
                .categoryAnswers[
            session.categoryId
            ] || 0
        ) + 1;

    /*
    |--------------------------------------------------------------------------
    | Calculate next question
    |--------------------------------------------------------------------------
    */

    const currentQuestionIndex =
        session.currentIndex;

    const nextQuestionIndex =
        currentQuestionIndex + 1;

    const hasNextQuestion =
        nextQuestionIndex <
        questions.length;

    /*
    |--------------------------------------------------------------------------
    | Store answer result
    |--------------------------------------------------------------------------
    */

    session.results.push({
        questionId,

        selectedAnswerId:
            answerId,

        correctAnswerId:
            question.correctAnswer,

        correct,

        questionIndex:
            currentQuestionIndex,
    });

    /*
    |--------------------------------------------------------------------------
    | Move to next question
    |--------------------------------------------------------------------------
    */

    if (hasNextQuestion) {
        session.currentIndex =
            nextQuestionIndex;
    }

    /*
    |--------------------------------------------------------------------------
    | Save state
    |--------------------------------------------------------------------------
    */

    saveState(state);

    /*
    |--------------------------------------------------------------------------
    | Return result
    |--------------------------------------------------------------------------
    */

    return clone({
        correct,

        selectedAnswerId:
            answerId,

        correctAnswerId:
            question.correctAnswer,

        correctAnswerText:
            correctAnswerObject?.text ||
            "",

        selectedAnswerText:
            selectedAnswerObject.text,

        explanation:
            question.explanation ||
            (
                correct
                    ? "Correct answer!"
                    : `The correct answer is ${correctAnswerObject?.text || "not available"}.`
            ),

        currentQuestionIndex,

        nextQuestionIndex,

        currentScore:
            session.score,

        correctAnswers:
            session.correctAnswers,

        hasNextQuestion,
    });
}

/*
|--------------------------------------------------------------------------
| Complete Trivia Session
|--------------------------------------------------------------------------
*/

export async function completeTriviaSession(
    sessionId
) {
    await delay(500);

    const state =
        loadState();

    const session =
        state.sessions[
        sessionId
        ];

    if (!session) {
        throw new Error(
            "Trivia session not found."
        );
    }

    /*
    |--------------------------------------------------------------------------
    | If already completed, return existing result.
    |--------------------------------------------------------------------------
    */

    if (
        session.completed &&
        session.result
    ) {
        return clone(
            session.result
        );
    }

    const totalQuestions =
        session.totalQuestions;

    const correctAnswers =
        session.correctAnswers;

    const incorrectAnswers =
        Math.max(
            totalQuestions -
            correctAnswers,
            0
        );

    const accuracy =
        totalQuestions > 0
            ? Math.round(
                (
                    correctAnswers /
                    totalQuestions
                ) * 100
            )
            : 0;

    /*
    |--------------------------------------------------------------------------
    | Mock reward
    |--------------------------------------------------------------------------
    */

    const reward =
        correctAnswers * 20;

    const result = {
        sessionId,

        categoryId:
            session.categoryId,

        categoryName:
            session.categoryName,

        score:
            session.score,

        totalQuestions,

        correctAnswers,

        incorrectAnswers,

        accuracy,

        reward,

        currency: "SAK",

        energyUsed:
            session.energyUsed,

        completedAt:
            new Date().toISOString(),
    };

    /*
    |--------------------------------------------------------------------------
    | Mark session completed
    |--------------------------------------------------------------------------
    */

    session.completed =
        true;

    session.result =
        result;

    /*
    |--------------------------------------------------------------------------
    | Store last round
    |--------------------------------------------------------------------------
    */

    state.usage.lastRound = {
        categoryId:
            session.categoryId,

        score:
            session.score,

        totalQuestions,

        reward,
    };

    /*
    |--------------------------------------------------------------------------
    | Save
    |--------------------------------------------------------------------------
    */

    saveState(state);

    return clone(result);
}

/*
|--------------------------------------------------------------------------
| Get Trivia Result
|--------------------------------------------------------------------------
*/

export async function getTriviaResult(
    sessionId
) {
    await delay(250);

    const state =
        loadState();

    const session =
        state.sessions[
        sessionId
        ];

    if (
        !session ||
        !session.result
    ) {
        return null;
    }

    return clone(
        session.result
    );
}

/*
|--------------------------------------------------------------------------
| Report Trivia Question
|--------------------------------------------------------------------------
*/

export async function reportTriviaQuestion(
    questionId,
    reason
) {
    await delay(400);

    return {
        success: true,

        questionId,

        reason,

        reportedAt:
            new Date().toISOString(),
    };
}

/*
|--------------------------------------------------------------------------
| Refund Trivia Session
|--------------------------------------------------------------------------
*/

export async function refundTriviaSession(
    sessionId
) {
    await delay(400);

    const state =
        loadState();

    const session =
        state.sessions[
        sessionId
        ];

    if (!session) {
        throw new Error(
            "Trivia session not found."
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Restore energy
    |--------------------------------------------------------------------------
    */

    state.usage.energy =
        Math.min(
            state.usage.energy +
            session.energyUsed,

            TRIVIA_LIMITS.energyMax
        );

    /*
    |--------------------------------------------------------------------------
    | Remove session
    |--------------------------------------------------------------------------
    */

    delete state.sessions[
        sessionId
    ];

    saveState(state);

    return {
        success: true,
    };
}