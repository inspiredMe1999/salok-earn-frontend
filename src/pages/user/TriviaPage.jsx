import { useEffect, useMemo, useState } from "react";
import {
    Brain,
    CheckCircle2,
    ChevronRight,
    Clock3,
    Cpu,
    FlaskConical,
    History,
    Lightbulb,
    LoaderCircle,
    Lock,
    Trophy,
    Zap,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";

import { getTriviaOverview, startTriviaRound } from "../../services/mock/triviaService";
import useAuth from "../../hooks/useAuth";
import { useAuthGate } from "../../context/AuthGateContext";
import GuestBanner from "../../components/common/GuestBanner";
import "./trivia.css";

import Loader from "../../components/common/Loader";

const categoryIcons = {
    general: Brain,
    science: FlaskConical,
    history: History,
    technology: Cpu,
    entertainment: Lightbulb,
    sports: Trophy,
};

const categoryDescriptions = {
    general: "Everyday knowledge and interesting facts.",
    science: "Science, nature, space and discovery.",
    history: "People, places and events from the past.",
    technology: "Computers, innovation and digital technology.",
    entertainment: "Music, movies, television and culture.",
    sports: "Sports, games, players and competitions.",
};

function ProgressBar({ value, max }) {
    const percentage =
        max > 0
            ? Math.min((value / max) * 100, 100)
            : 0;

    return (
        <div className="trivia-progress-track">
            <div
                className="trivia-progress-fill"
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
}

export default function TriviaPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const { isAuthenticated } = useAuth();
    const { openAuthGate } = useAuthGate();

    const [overview, setOverview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [startingCategory, setStartingCategory] = useState(null);

    useEffect(() => {
        let mounted = true;

        async function loadTrivia() {
            try {
                setLoading(true);

                const data =
                    await getTriviaOverview();

                if (mounted) {
                    setOverview(data);
                }
            } catch (error) {
                toast.error(
                    error?.message ||
                    "Unable to load Trivia."
                );
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        loadTrivia();

        return () => {
            mounted = false;
        };
    }, []);

    const handleStartRound = async (categoryId) => {
        if (!isAuthenticated) {
            openAuthGate({
                title: "Sign up to start playing Trivia",
                message:
                    "Create a free account to start this round and start collecting rewards for correct answers.",
                redirectTo: location.pathname,
            });

            return;
        }

        try {
            setStartingCategory(categoryId);

            const session =
                await startTriviaRound(
                    categoryId
                );

            navigate(
                `/trivia/play/${session.id}`
            );
        } catch (error) {
            toast.error(
                error?.message ||
                "Unable to start the trivia round."
            );
        } finally {
            setStartingCategory(null);
        }
    };

    const energyPercentage = useMemo(() => {
        if (!overview?.energy?.max) {
            return 0;
        }

        return Math.min(
            (overview.energy.current /
                overview.energy.max) *
            100,
            100
        );
    }, [overview]);

    if (loading) {
        return (
            <div className="trivia-loading">
                <Loader
                    size="lg"
                    label="Loading Trivia..."
                />
            </div>
        );
    }

    if (!overview) {
        return (
            <div className="trivia-empty-state">
                <div className="trivia-empty-icon">
                    <Brain size={25} />
                </div>

                <h2>
                    Trivia is unavailable
                </h2>

                <p>
                    We couldn't load the Trivia
                    section right now.
                </p>
            </div>
        );
    }

    return (
        <div className="trivia-page">
            {isAuthenticated ? null : (
                <GuestBanner
                    message="You're previewing Trivia as a guest. Create a free account to play rounds and start earning real rewards."
                />
            )}

            {/* -------------------------------------------------
                PAGE HEADER
            ------------------------------------------------- */}

            <section className="trivia-page-header">
                <div>
                    <span className="trivia-eyebrow">
                        KNOWLEDGE & REWARDS
                    </span>

                    <h1>
                        Test your <span>knowledge</span>.
                    </h1>

                    <p>
                        Answer questions, build your
                        score and earn rewards while
                        you play.
                    </p>
                </div>

                <div className="trivia-header-badge">
                    <Brain size={18} />

                    <span>
                        Trivia
                    </span>
                </div>
            </section>

            {/* -------------------------------------------------
                STATS
            ------------------------------------------------- */}

            {isAuthenticated ? (
                <section className="trivia-stats-grid">
                    <article className="trivia-stat-card trivia-energy-card">
                        <div className="trivia-stat-top">
                            <div className="trivia-stat-icon">
                                <Zap size={19} />
                            </div>

                            <span>
                                Energy
                            </span>
                        </div>

                        <div className="trivia-stat-value">
                            {overview.energy.current}
                            <small>
                                / {overview.energy.max}
                            </small>
                        </div>

                        <ProgressBar
                            value={
                                overview.energy
                                    .current
                            }
                            max={
                                overview.energy.max
                            }
                        />

                        <p>
                            {energyPercentage === 100
                                ? "Your energy is full."
                                : "Energy is used when you start a round."}
                        </p>
                    </article>

                    <article className="trivia-stat-card">
                        <div className="trivia-stat-top">
                            <div className="trivia-stat-icon">
                                <CheckCircle2
                                    size={19}
                                />
                            </div>

                            <span>
                                Today's answers
                            </span>
                        </div>

                        <div className="trivia-stat-value">
                            {
                                overview.dailyAnswers
                                    .current
                            }

                            <small>
                                /
                                {
                                    overview
                                        .dailyAnswers
                                        .max
                                }
                            </small>
                        </div>

                        <ProgressBar
                            value={
                                overview.dailyAnswers
                                    .current
                            }
                            max={
                                overview.dailyAnswers
                                    .max
                            }
                        />

                        <p>
                            Keep answering to
                            increase your daily
                            progress.
                        </p>
                    </article>

                    <article className="trivia-stat-card">
                        <div className="trivia-stat-top">
                            <div className="trivia-stat-icon">
                                <Trophy size={19} />
                            </div>

                            <span>
                                Last round
                            </span>
                        </div>

                        <div className="trivia-stat-value trivia-last-score">
                            {overview.lastRound?.score ??
                                0}

                            <small>
                                /
                                {
                                    overview.lastRound
                                        ?.totalQuestions
                                }
                            </small>
                        </div>

                        <p className="trivia-last-round-text">
                            {overview.lastRound
                                ?.categoryName ||
                                "No round completed yet"}
                        </p>
                    </article>
                </section>
            ) : (
                <section className="trivia-stats-grid trivia-stats-guest">
                    <article className="trivia-stat-card">
                        <div className="trivia-stat-top">
                            <div className="trivia-stat-icon">
                                <Zap size={19} />
                            </div>

                            <span>
                                Energy
                            </span>
                        </div>

                        <p>
                            Sign up to get a daily
                            energy allowance for
                            playing rounds.
                        </p>
                    </article>

                    <article className="trivia-stat-card">
                        <div className="trivia-stat-top">
                            <div className="trivia-stat-icon">
                                <CheckCircle2 size={19} />
                            </div>

                            <span>
                                Daily progress
                            </span>
                        </div>

                        <p>
                            Track how many questions
                            you've answered each day
                            once you have an account.
                        </p>
                    </article>

                    <article className="trivia-stat-card">
                        <div className="trivia-stat-top">
                            <div className="trivia-stat-icon">
                                <Trophy size={19} />
                            </div>

                            <span>
                                Your rounds
                            </span>
                        </div>

                        <p>
                            Your scores and rewards
                            will show up here after
                            you sign up and play.
                        </p>
                    </article>
                </section>
            )}

            {/* -------------------------------------------------
                ENERGY NOTICE
            ------------------------------------------------- */}

            <section className="trivia-energy-notice">
                <div className="trivia-energy-notice-icon">
                    <Zap size={20} />
                </div>

                <div>
                    <strong>
                        Every round uses 1 energy
                    </strong>

                    <span>
                        Choose a category below and
                        put your knowledge to the test.
                    </span>
                </div>
            </section>

            {/* -------------------------------------------------
                CATEGORIES
            ------------------------------------------------- */}

            <section className="trivia-categories-section">
                <div className="trivia-section-heading">
                    <div>
                        <span>
                            CHOOSE YOUR CHALLENGE
                        </span>

                        <h2>
                            Pick a category
                        </h2>
                    </div>

                    <p>
                        Each category has a daily
                        answer limit.
                    </p>
                </div>

                <div className="trivia-category-grid">
                    {overview.categories.map(
                        (category) => {
                            const Icon =
                                categoryIcons[
                                category.id
                                ] || Brain;

                            const used =
                                category.used || 0;

                            const limit =
                                category.limit;

                            const percentage =
                                limit > 0
                                    ? Math.min(
                                        (used /
                                            limit) *
                                        100,
                                        100
                                    )
                                    : 0;

                            const categoryLimitReached =
                                used >= limit;

                            const noEnergy =
                                overview.energy
                                    .current <
                                1;

                            const disabled =
                                categoryLimitReached ||
                                noEnergy;

                            return (
                                <article
                                    key={
                                        category.id
                                    }
                                    className={`trivia-category-card ${disabled
                                        ? "disabled"
                                        : ""
                                        }`}
                                >
                                    <div className="trivia-category-top">
                                        <div className={`trivia-category-icon trivia-category-icon-${category.id}`}>
                                            <Icon
                                                size={22}
                                            />
                                        </div>

                                        <span className="trivia-category-count">
                                            {
                                                category.questionsAvailable
                                            }+
                                            <small>
                                                questions
                                            </small>
                                        </span>
                                    </div>

                                    <div className="trivia-category-content">
                                        <h3>
                                            {
                                                category.name
                                            }
                                        </h3>

                                        <p>
                                            {categoryDescriptions[
                                                category
                                                    .id
                                            ] ||
                                                category.description}
                                        </p>
                                    </div>

                                    <div className="trivia-category-progress">
                                        <div className="trivia-category-progress-label">
                                            <span>
                                                Today's
                                                usage
                                            </span>

                                            <strong>
                                                {used} /{" "}
                                                {limit}
                                            </strong>
                                        </div>

                                        <ProgressBar
                                            value={
                                                used
                                            }
                                            max={
                                                limit
                                            }
                                        />

                                        <span className="trivia-category-progress-percent">
                                            {Math.round(
                                                percentage
                                            )}
                                            %
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        className="trivia-start-button"
                                        disabled={
                                            isAuthenticated &&
                                            (disabled ||
                                                startingCategory ===
                                                category.id)
                                        }
                                        onClick={() =>
                                            handleStartRound(
                                                category.id
                                            )
                                        }
                                    >
                                        {!isAuthenticated ? (
                                            <>
                                                Sign up to play

                                                <Lock
                                                    size={
                                                        15
                                                    }
                                                />
                                            </>
                                        ) : startingCategory ===
                                            category.id ? (
                                            <>
                                                <LoaderCircle
                                                    size={
                                                        17
                                                    }
                                                    className="trivia-button-spinner"
                                                />

                                                Starting...
                                            </>
                                        ) : categoryLimitReached ? (
                                            <>
                                                Daily limit
                                                reached
                                            </>
                                        ) : noEnergy ? (
                                            <>
                                                No energy
                                            </>
                                        ) : (
                                            <>
                                                Start round

                                                <ChevronRight
                                                    size={
                                                        17
                                                    }
                                                />
                                            </>
                                        )}
                                    </button>
                                </article>
                            );
                        }
                    )}
                </div>
            </section>

            {/* -------------------------------------------------
                LAST ROUND
            ------------------------------------------------- */}

            {overview.lastRound && isAuthenticated && (
                <section className="trivia-last-round">
                    <div className="trivia-last-round-icon">
                        <Trophy size={21} />
                    </div>

                    <div className="trivia-last-round-info">
                        <span>
                            YOUR LAST ROUND
                        </span>

                        <strong>
                            {
                                overview.lastRound
                                    .categoryName
                            }
                        </strong>
                    </div>

                    <div className="trivia-last-round-stat">
                        <strong>
                            {
                                overview.lastRound
                                    .score
                            }
                        </strong>

                        <span>
                            correct
                        </span>
                    </div>

                    <div className="trivia-last-round-stat">
                        <strong>
                            {
                                overview.lastRound
                                    .reward
                            }{" "}
                            SAK
                        </strong>

                        <span>
                            reward
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            handleStartRound(
                                overview.lastRound
                                    .categoryId
                            )
                        }
                    >
                        Play again
                        <ChevronRight
                            size={17}
                        />
                    </button>
                </section>
            )}

            {/* -------------------------------------------------
                FOOTNOTE
            ------------------------------------------------- */}

            <div className="trivia-footer-note">
                <Clock3 size={15} />

                <span>
                    Take your time, read each question
                    carefully and choose the answer
                    you think is correct.
                </span>
            </div>
        </div>
    );
}