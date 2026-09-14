import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Link,
    Navigate,
} from "react-router-dom";

import {
    ArrowRight,
    Brain,
    Check,
    Clock3,
    Coins,
    ListTodo,
    Lock,
    MessageSquareText,
    ShieldCheck,
    Sparkles,
    Store,
    TrendingUp,
    Zap,
} from "lucide-react";

import { getEarnPageData } from "../../services/mock/earnService";
import { triviaCategories } from "../../data/triviaData";

import useAuth from "../../hooks/useAuth";
import { useAuthGate } from "../../context/AuthGateContext";

import "./home.css";

import Loader from "../../components/common/Loader";

const typeIcons = {
    surveys: MessageSquareText,
    tasks: ListTodo,
    offers: Sparkles,
};

const triviaCategoryIcons = {
    general: Brain,
    science: Zap,
    history: Clock3,
    technology: Sparkles,
    entertainment: Sparkles,
    sports: TrendingUp,
};

const REWARD_NETWORKS = [
    {
        name: "Timewall",
        description:
            "Surveys, app installs and quick offers.",
    },
    {
        name: "Wannads",
        description:
            "App trials and everyday partner offers.",
    },
    {
        name: "CPX Research",
        description:
            "Paid survey panels matched to your profile.",
    },
    {
        name: "TheoremReach",
        description:
            "Academic and market research surveys.",
    },
];

const HOW_IT_WORKS = [
    {
        number: "01",
        title: "Create your account",
        description:
            "Takes less than a minute, free to join.",
    },
    {
        number: "02",
        title: "Pick a live activity",
        description:
            "Trivia, a task, a survey or an offerwall — your call.",
    },
    {
        number: "03",
        title: "Complete it",
        description:
            "Everything below is the real thing, not a mockup.",
    },
    {
        number: "04",
        title: "Withdraw your reward",
        description:
            "Once you hit the minimum, cash out to your payout method.",
    },
];

function formatReward(amount, currency) {
    return `${Number(amount).toLocaleString("en-US")} ${currency}`;
}

function HomePage() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const { openAuthGate } = useAuthGate();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        async function loadData() {
            try {
                setLoading(true);

                const result = await getEarnPageData();

                if (mounted) {
                    setData(result);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        loadData();

        return () => {
            mounted = false;
        };
    }, []);

    const tasksAndSurveys = useMemo(() => {
        if (!data) {
            return [];
        }

        return data.opportunities
            .filter(
                (item) =>
                    item.type === "tasks" ||
                    item.type === "surveys"
            )
            .slice(0, 4);
    }, [data]);

    const featuredOffers = useMemo(() => {
        if (!data) {
            return [];
        }

        return data.opportunities
            .filter((item) => item.type === "offers")
            .slice(0, 3);
    }, [data]);

    /*
    |--------------------------------------------------------------------------
    | Signed-in members already have a personalized dashboard — this page
    | is specifically the guest-facing / pre-auth homepage, so send members
    | straight there instead of showing them a duplicate, generic view.
    |--------------------------------------------------------------------------
    */

    if (!authLoading && isAuthenticated) {
        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }

    const handleGuestAction = (options) => {
        openAuthGate(options);
    };

    return (
        <div className="home-page">
            {/* =================================================
                HERO
               ================================================= */}

            <section className="home-hero">
                <div className="home-hero-copy">
                    <span className="home-eyebrow">
                        <Sparkles size={13} />
                        LIVE PLATFORM — NOT A DEMO
                    </span>

                    <h1>
                        Everything below is
                        <span> the real thing.</span>
                    </h1>

                    <p>
                        Salok Earn pays you for trivia,
                        tasks, surveys and offerwalls.
                        What you see on this page is the
                        actual, live app — browse freely,
                        and create a free account whenever
                        you're ready to start collecting
                        rewards for real.
                    </p>

                    <div className="home-hero-actions">
                        <button
                            type="button"
                            className="home-primary-button"
                            onClick={() =>
                                handleGuestAction({
                                    title:
                                        "Create a free account",
                                    message:
                                        "Sign up to start earning from everything you see on this page.",
                                    redirectTo: "/earn",
                                })
                            }
                        >
                            Start earning free
                            <ArrowRight size={17} />
                        </button>

                        <Link
                            to="/earn"
                            className="home-secondary-action"
                        >
                            Browse all opportunities
                        </Link>
                    </div>
                </div>

                <div className="home-hero-stats">
                    <div>
                        <strong>
                            {loading || !data
                                ? "—"
                                : data.opportunities.length}
                        </strong>
                        <span>Live opportunities</span>
                    </div>

                    <div>
                        <strong>
                            {triviaCategories.length}
                        </strong>
                        <span>Trivia categories</span>
                    </div>

                    <div>
                        <strong>
                            {REWARD_NETWORKS.length}+
                        </strong>
                        <span>Offerwall networks</span>
                    </div>
                </div>
            </section>

            {/* =================================================
                HOW IT WORKS
               ================================================= */}

            <section className="home-how-it-works">
                <div className="home-section-heading">
                    <span className="home-section-label">
                        HOW IT WORKS
                    </span>

                    <h2>Four steps, no surprises.</h2>
                </div>

                <div className="home-steps-grid">
                    {HOW_IT_WORKS.map((step) => (
                        <div
                            key={step.number}
                            className="home-step-card"
                        >
                            <span className="home-step-number">
                                {step.number}
                            </span>

                            <h3>{step.title}</h3>
                            <p>{step.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* =================================================
                TRIVIA & GAMES
               ================================================= */}

            <section className="home-section">
                <div className="home-section-heading">
                    <div>
                        <span className="home-section-label">
                            TRIVIA &amp; GAMES
                        </span>

                        <h2>
                            Answer a few questions,
                            earn instantly.
                        </h2>

                        <p>
                            Pick a category below and play
                            a quick round. Correct answers
                            earn rewards on the spot —
                            these are the same categories
                            and questions signed-in members
                            play.
                        </p>
                    </div>

                    <Link
                        to="/trivia"
                        className="home-section-link"
                    >
                        See all categories
                        <ArrowRight size={15} />
                    </Link>
                </div>

                <div className="home-trivia-grid">
                    {triviaCategories
                        .slice(0, 4)
                        .map((category) => {
                            const Icon =
                                triviaCategoryIcons[
                                category.id
                                ] || Brain;

                            return (
                                <article
                                    key={category.id}
                                    className="home-trivia-card"
                                >
                                    <div className="home-trivia-icon">
                                        <Icon size={20} />
                                    </div>

                                    <h3>{category.name}</h3>

                                    <p>
                                        {category.description}
                                    </p>

                                    <div className="home-trivia-footer">
                                        <span>
                                            {
                                                category.questionsAvailable
                                            }{" "}
                                            questions
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleGuestAction({
                                                    title:
                                                        "Sign up to start playing Trivia",
                                                    message: `Create a free account to play "${category.name}" and start earning rewards for correct answers.`,
                                                    redirectTo:
                                                        "/trivia",
                                                })
                                            }
                                        >
                                            Play now
                                            <Lock size={12} />
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                </div>
            </section>

            {/* =================================================
                TASKS & SURVEYS
               ================================================= */}

            <section className="home-section">
                <div className="home-section-heading">
                    <div>
                        <span className="home-section-label">
                            TASKS &amp; SURVEYS
                        </span>

                        <h2>
                            Short activities,
                            real rewards.
                        </h2>

                        <p>
                            Quick surveys and simple tasks
                            that pay out once completed.
                            Rewards, time estimates and
                            difficulty are shown up front
                            — no guesswork.
                        </p>
                    </div>

                    <Link
                        to="/earn"
                        className="home-section-link"
                    >
                        See all opportunities
                        <ArrowRight size={15} />
                    </Link>
                </div>

                {loading || !data ? (
                    <div className="home-loading">
                        <Loader
                            size="md"
                            label="Loading live opportunities..."
                        />
                    </div>
                ) : (
                    <div className="home-opportunity-grid">
                        {tasksAndSurveys.map(
                            (opportunity) => {
                                const Icon =
                                    typeIcons[
                                    opportunity.type
                                    ] || Coins;

                                return (
                                    <article
                                        key={opportunity.id}
                                        className="home-opportunity-card"
                                    >
                                        <div className="home-opportunity-top">
                                            <div className="home-opportunity-icon">
                                                <Icon size={18} />
                                            </div>

                                            <span>
                                                {opportunity.type}
                                            </span>
                                        </div>

                                        <h3>
                                            {opportunity.title}
                                        </h3>

                                        <p>
                                            {
                                                opportunity.description
                                            }
                                        </p>

                                        <div className="home-opportunity-meta">
                                            <span>
                                                <Clock3
                                                    size={12}
                                                />
                                                {
                                                    opportunity.estimatedMinutes
                                                }{" "}
                                                min
                                            </span>

                                            <span>
                                                {
                                                    opportunity.difficulty
                                                }
                                            </span>
                                        </div>

                                        <div className="home-opportunity-footer">
                                            <div>
                                                <span>
                                                    Reward
                                                </span>

                                                <strong>
                                                    +
                                                    {formatReward(
                                                        opportunity.reward,
                                                        opportunity.currency
                                                    )}
                                                </strong>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleGuestAction({
                                                        title:
                                                            "Sign up to start this opportunity",
                                                        message: `Create a free account to start "${opportunity.title}" and collect the reward.`,
                                                        redirectTo: `/earn/${opportunity.id}`,
                                                    })
                                                }
                                            >
                                                Start
                                                <Lock size={12} />
                                            </button>
                                        </div>
                                    </article>
                                );
                            }
                        )}
                    </div>
                )}
            </section>

            {/* =================================================
                OFFERWALLS
               ================================================= */}

            <section className="home-section">
                <div className="home-section-heading">
                    <div>
                        <span className="home-section-label">
                            OFFERWALLS
                        </span>

                        <h2>
                            Partner networks,
                            all in one place.
                        </h2>

                        <p>
                            Offerwalls are collections of
                            offers from trusted third-party
                            networks — app installs, sign-ups
                            and short surveys, all paying out
                            through your Salok balance.
                        </p>
                    </div>

                    <Link
                        to="/offerwalls"
                        className="home-section-link"
                    >
                        View all offerwalls
                        <ArrowRight size={15} />
                    </Link>
                </div>

                <div className="home-network-grid">
                    {REWARD_NETWORKS.map((network) => (
                        <button
                            type="button"
                            key={network.name}
                            className="home-network-card"
                            onClick={() =>
                                handleGuestAction({
                                    title: `Sign up to explore ${network.name}`,
                                    message:
                                        "Create a free account to open this offerwall and start earning.",
                                    redirectTo: "/offerwalls",
                                })
                            }
                        >
                            <div className="home-network-icon">
                                <Store size={17} />
                            </div>

                            <strong>{network.name}</strong>
                            <span>{network.description}</span>
                        </button>
                    ))}
                </div>

                {featuredOffers.length > 0 && (
                    <div className="home-featured-offers">
                        <span className="home-featured-offers-label">
                            EXAMPLE OFFERS LIVE RIGHT NOW
                        </span>

                        <div className="home-featured-offers-list">
                            {featuredOffers.map((offer) => (
                                <div
                                    key={offer.id}
                                    className="home-featured-offer-row"
                                >
                                    <span>{offer.title}</span>

                                    <strong>
                                        +
                                        {formatReward(
                                            offer.reward,
                                            offer.currency
                                        )}
                                    </strong>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            {/* =================================================
                TRUST
               ================================================= */}

            <section className="home-trust">
                <div className="home-trust-icon">
                    <ShieldCheck size={22} />
                </div>

                <div className="home-trust-copy">
                    <h3>Built for trust</h3>

                    <div className="home-trust-list">
                        <span>
                            <Check size={13} />
                            Transparent reward amounts
                        </span>

                        <span>
                            <Check size={13} />
                            Every activity logged and trackable
                        </span>

                        <span>
                            <Check size={13} />
                            Multiple payout methods
                        </span>
                    </div>
                </div>
            </section>

            {/* =================================================
                FINAL CTA
               ================================================= */}

            <section className="home-final-cta">
                <h2>Ready to make it count?</h2>

                <p>
                    Create your free account and
                    everything you just browsed
                    starts earning for real.
                </p>

                <button
                    type="button"
                    className="home-primary-button"
                    onClick={() =>
                        handleGuestAction({
                            title: "Create a free account",
                            message:
                                "Sign up to start earning from everything you see on this page.",
                            redirectTo: "/earn",
                        })
                    }
                >
                    Get started free
                    <ArrowRight size={17} />
                </button>
            </section>
        </div>
    );
}

export default HomePage;