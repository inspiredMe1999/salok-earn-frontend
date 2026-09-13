import { useEffect, useMemo, useState } from "react";
import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    Check,
    CheckCircle2,
    Flag,
    LoaderCircle,
    X,
    Zap,
} from "lucide-react";
import { toast } from "sonner";
import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    getTriviaQuestion,
    getTriviaSession,
    reportTriviaQuestion,
    submitTriviaAnswer,
} from "../../services/mock/triviaService";

import "./trivia.css";

export default function TriviaPlayPage() {
    const navigate = useNavigate();
    const { sessionId } = useParams();

    const [session, setSession] = useState(null);
    const [question, setQuestion] = useState(null);

    const [loading, setLoading] = useState(true);
    const [answerLoading, setAnswerLoading] =
        useState(false);

    const [selectedAnswer, setSelectedAnswer] =
        useState(null);

    const [answerResult, setAnswerResult] =
        useState(null);

    const [reporting, setReporting] =
        useState(false);

    const [error, setError] = useState("");

    /*
    |--------------------------------------------------------------------------
    | Load session and question
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        let mounted = true;

        async function loadSession() {
            try {
                setLoading(true);
                setError("");

                const sessionData =
                    await getTriviaSession(sessionId);

                if (!sessionData) {
                    throw new Error(
                        "This trivia session could not be found."
                    );
                }

                const questionData =
                    await getTriviaQuestion(
                        sessionId,
                        sessionData.currentIndex
                    );

                if (!questionData) {
                    throw new Error(
                        "Unable to load the trivia question."
                    );
                }

                if (mounted) {
                    setSession(sessionData);
                    setQuestion(questionData);
                }
            } catch (err) {
                if (mounted) {
                    setError(
                        err?.message ||
                        "Unable to load this trivia round."
                    );
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        if (sessionId) {
            loadSession();
        }

        return () => {
            mounted = false;
        };
    }, [sessionId]);

    /*
    |--------------------------------------------------------------------------
    | Normalize question data
    |--------------------------------------------------------------------------
    |
    | The mock service returns:
    |
    | {
    |     id,
    |     question,
    |     answers,
    |     categoryName,
    |     questionIndex,
    |     totalQuestions
    | }
    |
    | This keeps the component safe if the service shape changes slightly.
    |--------------------------------------------------------------------------
    */

    const questionText =
        question?.question ||
        question?.text ||
        "";

    const answers =
        Array.isArray(question?.answers)
            ? question.answers
            : Array.isArray(question?.question?.answers)
                ? question.question.answers
                : [];

    /*
    |--------------------------------------------------------------------------
    | Progress
    |--------------------------------------------------------------------------
    */

    const progress = useMemo(() => {
        if (
            !question ||
            !question.totalQuestions
        ) {
            return 0;
        }

        return Math.round(
            ((question.questionIndex + 1) /
                question.totalQuestions) *
            100
        );
    }, [question]);

    /*
    |--------------------------------------------------------------------------
    | Select answer
    |--------------------------------------------------------------------------
    */

    const handleSelectAnswer = (answerId) => {
        if (answerLoading || answerResult) {
            return;
        }

        setSelectedAnswer(answerId);
    };

    /*
    |--------------------------------------------------------------------------
    | Submit answer
    |--------------------------------------------------------------------------
    */

    const handleSubmitAnswer = async () => {
        if (!selectedAnswer) {
            toast.error(
                "Please select an answer first."
            );

            return;
        }

        if (!question) {
            return;
        }

        try {
            setAnswerLoading(true);

            const result =
                await submitTriviaAnswer(
                    sessionId,
                    question.id ||
                    question.question?.id,
                    selectedAnswer
                );

            setAnswerResult(result);

            /*
            |--------------------------------------------------------------------------
            | Update local session score
            |--------------------------------------------------------------------------
            */

            setSession((current) => {
                if (!current) {
                    return current;
                }

                return {
                    ...current,

                    currentIndex:
                        result.nextQuestionIndex ??
                        current.currentIndex,

                    correctAnswers:
                        result.currentScore ??
                        current.correctAnswers ??
                        0,
                };
            });
        } catch (err) {
            toast.error(
                err?.message ||
                "Unable to submit your answer."
            );
        } finally {
            setAnswerLoading(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Next question
    |--------------------------------------------------------------------------
    */

    const handleNextQuestion = async () => {
        if (!answerResult) {
            return;
        }

        if (!answerResult.hasNextQuestion) {
            navigate(
                `/trivia/result/${sessionId}`
            );

            return;
        }

        try {
            setLoading(true);

            const nextQuestion =
                await getTriviaQuestion(
                    sessionId,
                    answerResult.nextQuestionIndex
                );

            if (!nextQuestion) {
                throw new Error(
                    "Unable to load the next question."
                );
            }

            setQuestion(nextQuestion);
            setSelectedAnswer(null);
            setAnswerResult(null);
        } catch (err) {
            toast.error(
                err?.message ||
                "Unable to load the next question."
            );
        } finally {
            setLoading(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Report question
    |--------------------------------------------------------------------------
    */

    const handleReportQuestion = async () => {
        if (!question || reporting) {
            return;
        }

        try {
            setReporting(true);

            await reportTriviaQuestion(
                question.id ||
                question.question?.id,
                "Question may contain an error."
            );

            toast.success(
                "Thanks. The question has been reported."
            );
        } catch (err) {
            toast.error(
                err?.message ||
                "Unable to report this question."
            );
        } finally {
            setReporting(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Back
    |--------------------------------------------------------------------------
    */

    const handleBack = () => {
        navigate("/trivia");
    };

    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading && !question) {
        return (
            <div className="trivia-game-loading">
                <LoaderCircle
                    size={32}
                    className="trivia-spinner"
                />

                <p>
                    Preparing your trivia round...
                </p>
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Error
    |--------------------------------------------------------------------------
    */

    if (error && !question) {
        return (
            <div className="trivia-game-error">
                <div className="trivia-error-icon">
                    <AlertCircle size={25} />
                </div>

                <h2>
                    Trivia round unavailable
                </h2>

                <p>{error}</p>

                <button
                    type="button"
                    onClick={handleBack}
                >
                    <ArrowLeft size={17} />
                    Back to Trivia
                </button>
            </div>
        );
    }

    if (!question) {
        return null;
    }

    const isAnswerCorrect =
        answerResult?.correct === true;

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <div className="trivia-game-page">
            {/* -------------------------------------------------
                TOP BAR
            ------------------------------------------------- */}

            <div className="trivia-game-topbar">
                <button
                    type="button"
                    className="trivia-back-button"
                    onClick={handleBack}
                >
                    <ArrowLeft size={18} />

                    <span>
                        Back to Trivia
                    </span>
                </button>

                <div className="trivia-game-energy">
                    <Zap size={16} />

                    <span>
                        1 energy used
                    </span>
                </div>
            </div>

            {/* -------------------------------------------------
                GAME HEADER
            ------------------------------------------------- */}

            <section className="trivia-game-header">
                <div>
                    <span className="trivia-game-category">
                        {question.categoryName ||
                            "Trivia"}
                    </span>

                    <h1>
                        Question{" "}
                        {question.questionIndex +
                            1}{" "}
                        of{" "}
                        {question.totalQuestions}
                    </h1>
                </div>

                <div className="trivia-game-score">
                    <span>
                        SCORE
                    </span>

                    <strong>
                        {session?.correctAnswers ||
                            0}
                    </strong>
                </div>
            </section>

            {/* -------------------------------------------------
                PROGRESS
            ------------------------------------------------- */}

            <div className="trivia-game-progress">
                <div className="trivia-game-progress-label">
                    <span>
                        Round progress
                    </span>

                    <strong>
                        {progress}%
                    </strong>
                </div>

                <div className="trivia-game-progress-track">
                    <div
                        className="trivia-game-progress-fill"
                        style={{
                            width: `${progress}%`,
                        }}
                    />
                </div>
            </div>

            {/* -------------------------------------------------
                QUESTION CARD
            ------------------------------------------------- */}

            <main className="trivia-question-area">
                <div className="trivia-question-card">
                    <div className="trivia-question-number">
                        <span>
                            {String(
                                question.questionIndex +
                                1
                            ).padStart(2, "0")}
                        </span>
                    </div>

                    <h2>
                        {questionText}
                    </h2>

                    <p className="trivia-question-hint">
                        Select the answer you think
                        is correct.
                    </p>

                    {/* -------------------------------------------------
                        ANSWERS
                    ------------------------------------------------- */}

                    <div className="trivia-answer-list">
                        {answers.length > 0 ? (
                            answers.map(
                                (
                                    answer,
                                    index
                                ) => {
                                    const letter =
                                        String.fromCharCode(
                                            65 +
                                            index
                                        );

                                    const isSelected =
                                        selectedAnswer ===
                                        answer.id;

                                    const isCorrect =
                                        answerResult &&
                                        answerResult.correctAnswerId ===
                                        answer.id;

                                    const isWrongSelection =
                                        answerResult &&
                                        isSelected &&
                                        !answerResult.correct;

                                    let answerClass =
                                        "trivia-answer";

                                    if (
                                        isSelected
                                    ) {
                                        answerClass +=
                                            " selected";
                                    }

                                    if (
                                        isCorrect
                                    ) {
                                        answerClass +=
                                            " correct";
                                    }

                                    if (
                                        isWrongSelection
                                    ) {
                                        answerClass +=
                                            " incorrect";
                                    }

                                    return (
                                        <button
                                            type="button"
                                            key={
                                                answer.id
                                            }
                                            className={
                                                answerClass
                                            }
                                            disabled={
                                                answerLoading ||
                                                !!answerResult
                                            }
                                            onClick={() =>
                                                handleSelectAnswer(
                                                    answer.id
                                                )
                                            }
                                        >
                                            <span className="trivia-answer-letter">
                                                {
                                                    letter
                                                }
                                            </span>

                                            <span className="trivia-answer-text">
                                                {
                                                    answer.text
                                                }
                                            </span>

                                            <span className="trivia-answer-status">
                                                {isCorrect && (
                                                    <CheckCircle2
                                                        size={
                                                            19
                                                        }
                                                    />
                                                )}

                                                {isWrongSelection && (
                                                    <X
                                                        size={
                                                            19
                                                        }
                                                    />
                                                )}
                                            </span>
                                        </button>
                                    );
                                }
                            )
                        ) : (
                            <div className="trivia-game-error">
                                <div className="trivia-error-icon">
                                    <AlertCircle
                                        size={22}
                                    />
                                </div>

                                <p>
                                    No answer options
                                    are available
                                    for this
                                    question.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* -------------------------------------------------
                        FEEDBACK
                    ------------------------------------------------- */}

                    {answerResult && (
                        <div
                            className={`trivia-feedback ${isAnswerCorrect
                                    ? "correct"
                                    : "incorrect"
                                }`}
                        >
                            <div className="trivia-feedback-icon">
                                {isAnswerCorrect ? (
                                    <Check size={18} />
                                ) : (
                                    <X size={18} />
                                )}
                            </div>

                            <div>
                                <strong>
                                    {isAnswerCorrect
                                        ? "Correct!"
                                        : "Not quite."}
                                </strong>

                                <p>
                                    {
                                        answerResult.explanation
                                    }
                                </p>
                            </div>
                        </div>
                    )}

                    {/* -------------------------------------------------
                        ACTIONS
                    ------------------------------------------------- */}

                    <div className="trivia-question-actions">
                        <button
                            type="button"
                            className="trivia-report-button"
                            onClick={
                                handleReportQuestion
                            }
                            disabled={reporting}
                        >
                            {reporting ? (
                                <LoaderCircle
                                    size={15}
                                    className="trivia-button-spinner"
                                />
                            ) : (
                                <Flag size={15} />
                            )}

                            {reporting
                                ? "Reporting..."
                                : "Report question"}
                        </button>

                        {!answerResult ? (
                            <button
                                type="button"
                                className="trivia-submit-answer"
                                disabled={
                                    !selectedAnswer ||
                                    answerLoading ||
                                    answers.length ===
                                    0
                                }
                                onClick={
                                    handleSubmitAnswer
                                }
                            >
                                {answerLoading ? (
                                    <>
                                        <LoaderCircle
                                            size={
                                                17
                                            }
                                            className="trivia-button-spinner"
                                        />

                                        Checking...
                                    </>
                                ) : (
                                    <>
                                        Submit answer

                                        <ArrowRight
                                            size={
                                                17
                                            }
                                        />
                                    </>
                                )}
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="trivia-submit-answer"
                                onClick={
                                    handleNextQuestion
                                }
                            >
                                {answerResult.hasNextQuestion
                                    ? "Next question"
                                    : "View results"}

                                <ArrowRight
                                    size={17}
                                />
                            </button>
                        )}
                    </div>
                </div>
            </main>

            {/* -------------------------------------------------
                ROUND INFORMATION
            ------------------------------------------------- */}

            <div className="trivia-game-footer">
                <div>
                    <CheckCircle2 size={15} />

                    <span>
                        {session?.correctAnswers ||
                            0}{" "}
                        correct so far
                    </span>
                </div>

                <div>
                    <Zap size={15} />

                    <span>
                        1 energy is used for this
                        round
                    </span>
                </div>
            </div>
        </div>
    );
}