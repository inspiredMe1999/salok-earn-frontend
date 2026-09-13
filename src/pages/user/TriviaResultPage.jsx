import { useEffect, useState } from "react";
import {
    ArrowLeft,
    ArrowRight,
    Award,
    CheckCircle2,
    CircleAlert,
    Coins,
    Flame,
    RotateCcw,
    Sparkles,
    Trophy,
    XCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import {
    completeTriviaSession,
    getTriviaResult,
    startTriviaRound,
} from "../../services/mock/triviaService";

import "./trivia.css";

export default function TriviaResultPage() {
    const navigate = useNavigate();
    const { sessionId } = useParams();

    const [result, setResult] = useState(null);
    const [loading, setLoading] =
        useState(true);
    const [startingAgain, setStartingAgain] =
        useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let mounted = true;

        async function loadResult() {
            try {
                setLoading(true);
                setError("");

                /*
                 * First check whether this session has
                 * already been completed.
                 *
                 * This makes refreshing the Results page
                 * safe.
                 */
                let sessionResult =
                    await getTriviaResult(
                        sessionId
                    );

                /*
                 * The game page sends us here before
                 * explicitly completing the session.
                 *
                 * Complete it now if necessary.
                 */
                if (!sessionResult) {
                    sessionResult =
                        await completeTriviaSession(
                            sessionId
                        );
                }

                if (mounted) {
                    setResult(sessionResult);
                }
            } catch (err) {
                if (mounted) {
                    setError(
                        err?.message ||
                        "Unable to load your trivia result."
                    );
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        loadResult();

        return () => {
            mounted = false;
        };
    }, [sessionId]);

    const handlePlayAgain = async () => {
        if (!result?.categoryId) {
            return;
        }

        try {
            setStartingAgain(true);

            const session =
                await startTriviaRound(
                    result.categoryId
                );

            navigate(
                `/trivia/play/${session.id}`
            );
        } catch (err) {
            toast.error(
                err?.message ||
                "Unable to start another round."
            );
        } finally {
            setStartingAgain(false);
        }
    };

    const getPerformance = () => {
        if (!result) {
            return {
                title: "Round complete",
                message:
                    "Your trivia round has been completed.",
            };
        }

        if (result.accuracy >= 90) {
            return {
                title: "Outstanding!",
                message:
                    "You absolutely crushed this round.",
            };
        }

        if (result.accuracy >= 70) {
            return {
                title: "Great work!",
                message:
                    "You showed strong knowledge this round.",
            };
        }

        if (result.accuracy >= 50) {
            return {
                title: "Nice effort!",
                message:
                    "You're making good progress. Keep going.",
            };
        }

        return {
            title: "Keep practicing!",
            message:
                "Every round is a chance to improve your score.",
        };
    };

    if (loading) {
        return (
            <div className="trivia-result-loading">
                <div className="trivia-loading-spinner">
                    <Sparkles size={22} />
                </div>

                <h2>
                    Calculating your result...
                </h2>

                <p>
                    We're putting together your
                    trivia performance.
                </p>
            </div>
        );
    }

    if (error || !result) {
        return (
            <div className="trivia-result-error">
                <div className="trivia-result-error-icon">
                    <CircleAlert size={25} />
                </div>

                <h2>
                    Result unavailable
                </h2>

                <p>
                    {error ||
                        "We couldn't find this trivia result."}
                </p>

                <button
                    type="button"
                    className="trivia-primary-button"
                    onClick={() =>
                        navigate("/trivia")
                    }
                >
                    <ArrowLeft size={18} />
                    Back to Trivia
                </button>
            </div>
        );
    }

    const performance =
        getPerformance();

    return (
        <div className="trivia-result-page">
            <div className="trivia-result-topbar">
                <button
                    type="button"
                    className="trivia-back-button"
                    onClick={() =>
                        navigate("/trivia")
                    }
                >
                    <ArrowLeft size={18} />
                    Back to Trivia
                </button>

                <span className="trivia-result-category">
                    {result.categoryName}
                </span>
            </div>

            <section className="trivia-result-hero">
                <div className="trivia-result-trophy">
                    <Trophy size={42} />
                </div>

                <span className="trivia-result-eyebrow">
                    ROUND COMPLETE
                </span>

                <h1>
                    {performance.title}
                </h1>

                <p>
                    {performance.message}
                </p>

                <div className="trivia-result-score">
                    <strong>
                        {result.score}
                    </strong>

                    <span>
                        / {result.totalQuestions}
                    </span>
                </div>

                <span className="trivia-result-score-label">
                    Correct answers
                </span>
            </section>

            <section className="trivia-result-stats">
                <div className="trivia-result-stat">
                    <div className="trivia-result-stat-icon">
                        <CheckCircle2
                            size={20}
                        />
                    </div>

                    <div>
                        <span>
                            Correct
                        </span>

                        <strong>
                            {result.correctAnswers}
                        </strong>
                    </div>
                </div>

                <div className="trivia-result-stat">
                    <div className="trivia-result-stat-icon">
                        <XCircle size={20} />
                    </div>

                    <div>
                        <span>
                            Incorrect
                        </span>

                        <strong>
                            {result.incorrectAnswers}
                        </strong>
                    </div>
                </div>

                <div className="trivia-result-stat">
                    <div className="trivia-result-stat-icon">
                        <Award size={20} />
                    </div>

                    <div>
                        <span>
                            Accuracy
                        </span>

                        <strong>
                            {result.accuracy}%
                        </strong>
                    </div>
                </div>

                <div className="trivia-result-stat">
                    <div className="trivia-result-stat-icon">
                        <Flame size={20} />
                    </div>

                    <div>
                        <span>
                            Energy used
                        </span>

                        <strong>
                            {result.energyUsed}
                        </strong>
                    </div>
                </div>
            </section>

            <section className="trivia-reward-card">
                <div className="trivia-reward-left">
                    <div className="trivia-reward-icon">
                        <Coins size={24} />
                    </div>

                    <div>
                        <span>
                            Round reward
                        </span>

                        <strong>
                            +{result.reward}{" "}
                            {result.currency}
                        </strong>
                    </div>
                </div>

                <div className="trivia-reward-badge">
                    <Sparkles size={15} />
                    Earned
                </div>
            </section>

            <section className="trivia-result-actions">
                <button
                    type="button"
                    className="trivia-primary-button"
                    onClick={
                        handlePlayAgain
                    }
                    disabled={
                        startingAgain
                    }
                >
                    {startingAgain ? (
                        <>
                            <RotateCcw
                                size={18}
                                className="trivia-button-spinner"
                            />
                            Starting...
                        </>
                    ) : (
                        <>
                            Play Again
                            <ArrowRight
                                size={18}
                            />
                        </>
                    )}
                </button>

                <button
                    type="button"
                    className="trivia-secondary-button"
                    onClick={() =>
                        navigate(
                            "/leaderboard"
                        )
                    }
                >
                    <Trophy size={18} />
                    View Leaderboard
                </button>
            </section>

            <p className="trivia-result-note">
                Rewards shown here are mock values for
                the frontend review build. Real reward
                validation will be connected to the
                backend later.
            </p>
        </div>
    );
}