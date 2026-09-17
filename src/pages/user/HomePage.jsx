import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    Link,
    Navigate,
} from "react-router-dom";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

import {
    ArrowRight,
    Award,
    Brain,
    Check,
    Clock3,
    Coins,
    Gamepad2,
    Gift,
    Globe2,
    Landmark,
    ListTodo,
    Lock,
    MessageSquareText,
    Medal,
    MousePointerClick,
    Rocket,
    ShieldCheck,
    Sparkles,
    Star,
    Store,
    Target,
    TrendingUp,
    Trophy,
    Users,
    Wallet,
    Zap,
} from "lucide-react";

import { getEarnPageData } from "../../services/mock/earnService";
import { triviaCategories } from "../../data/triviaData";

import useAuth from "../../hooks/useAuth";
import { useAuthGate } from "../../context/AuthGateContext";

import Loader from "../../components/common/Loader";

import "./home.css";

import trophyAnimation from "../../assets/animations/Trophy.lottie?url";
import communityIllustration from "../../assets/illustrations/community.svg";
import secureIllustration from "../../assets/illustrations/secure.svg";
import coinsAnimation from "../../assets/illustrations/Coins.gif";

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
    entertainment: Gamepad2,
    sports: TrendingUp,
};

const REWARD_NETWORKS = [
    {
        name: "Timewall",
        description: "Surveys, app installs and quick activities.",
        accent: "gold",
    },
    {
        name: "Wannads",
        description: "App trials and everyday partner offers.",
        accent: "purple",
    },
    {
        name: "CPX Research",
        description: "Survey opportunities matched to your profile.",
        accent: "blue",
    },
    {
        name: "TheoremReach",
        description: "Market research and opinion surveys.",
        accent: "green",
    },
];

const HOW_IT_WORKS = [
    {
        number: "01",
        icon: Users,
        title: "Create your account",
        description:
            "Join Salok Earn for free and set up your member profile.",
    },
    {
        number: "02",
        icon: Target,
        title: "Choose an activity",
        description:
            "Explore trivia, tasks, surveys and partner offerwalls.",
    },
    {
        number: "03",
        icon: Rocket,
        title: "Complete and collect",
        description:
            "Finish eligible activities and receive Salokoins in your balance.",
    },
    {
        number: "04",
        icon: Wallet,
        title: "Enjoy your rewards",
        description:
            "Track your earnings and request a payout when eligible.",
    },
];

const WAYS_TO_EARN = [
    {
        icon: Brain,
        title: "Trivia and games",
        description:
            "Test your knowledge, play quick rounds and earn from correct answers.",
        label: "Play and earn",
    },
    {
        icon: ListTodo,
        title: "Tasks",
        description:
            "Complete simple activities and discover new ways to grow your balance.",
        label: "Complete tasks",
    },
    {
        icon: MessageSquareText,
        title: "Surveys",
        description:
            "Share your opinions through short surveys from research partners.",
        label: "Share opinions",
    },
    {
        icon: Store,
        title: "Offerwalls",
        description:
            "Explore app trials, sign ups and partner offers in one place.",
        label: "Explore offers",
    },
    {
        icon: Gift,
        title: "Referrals",
        description:
            "Invite friends and grow your rewards through the referral programme.",
        label: "Invite friends",
    },
];

const LEADERBOARD_PREVIEW = [
    {
        rank: 1,
        username: "RewardMaster",
        earned: "48,920",
        badge: "Top earner",
    },
    {
        rank: 2,
        username: "TriviaQueen",
        earned: "36,480",
        badge: "Rising star",
    },
    {
        rank: 3,
        username: "TaskHunter",
        earned: "29,760",
        badge: "Active member",
    },
    {
        rank: 4,
        username: "SurveyPilot",
        earned: "24,310",
        badge: "Consistent",
    },
    {
        rank: 5,
        username: "OfferExplorer",
        earned: "19,850",
        badge: "Explorer",
    },
];

function formatReward(amount, currency) {
    return `${Number(amount).toLocaleString("en-US")} ${currency}`;
}

/*
|--------------------------------------------------------------------------
| Reveal
|--------------------------------------------------------------------------
|
| Fades + slides its children up the first time they scroll into view,
| then leaves them alone (no re-triggering on scroll back up/down —
| that reads as flickery on a page this long). Falls back to showing
| content immediately if IntersectionObserver isn't available.
|
*/

function Reveal({
    children,
    as: Tag = "div",
    className = "",
    delay = 0,
}) {
    const ref = useRef(null);

    const [visible, setVisible] =
        useState(false);

    useEffect(() => {
        const node = ref.current;

        if (!node) return;

        if (
            typeof IntersectionObserver ===
            "undefined"
        ) {
            setVisible(true);

            return;
        }

        const observer =
            new IntersectionObserver(
                ([entry]) => {
                    if (
                        entry.isIntersecting
                    ) {
                        setVisible(true);

                        observer.disconnect();
                    }
                },
                {
                    threshold: 0.15,
                    rootMargin:
                        "0px 0px -60px 0px",
                }
            );

        observer.observe(node);

        return () =>
            observer.disconnect();
    }, []);

    return (
        <Tag
            ref={ref}
            className={`home-reveal ${visible
                ? "home-reveal-visible"
                : ""
                } ${className}`}
            style={
                delay
                    ? {
                        "--reveal-delay": `${delay}ms`,
                    }
                    : undefined
            }
        >
            {children}
        </Tag>
    );
}

/*
|--------------------------------------------------------------------------
| useCountUp
|--------------------------------------------------------------------------
|
| Animates a number counting up from 0 to `target` with an ease-out
| curve. Stays at 0 until `start` flips true, so stats that depend on
| async data only start counting once the real number is known.
|
*/

function useCountUp(
    target,
    { duration = 900, start = false } = {}
) {
    const [value, setValue] = useState(0);

    useEffect(() => {
        if (
            !start ||
            typeof target !== "number"
        ) {
            return;
        }

        let raf;

        const startTime =
            performance.now();

        function tick(now) {
            const progress = Math.min(
                1,
                (now - startTime) /
                duration
            );

            const eased =
                1 -
                Math.pow(1 - progress, 3);

            setValue(
                Math.round(
                    target * eased
                )
            );

            if (progress < 1) {
                raf =
                    requestAnimationFrame(
                        tick
                    );
            }
        }

        raf =
            requestAnimationFrame(tick);

        return () =>
            cancelAnimationFrame(raf);
    }, [target, start, duration]);

    return value;
}

function HomePage() {
    const {
        isAuthenticated,
        loading: authLoading,
    } = useAuth();

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

    const activitiesCount = useCountUp(
        data?.opportunities.length ?? 0,
        { start: !loading && Boolean(data) }
    );

    const triviaCount = useCountUp(
        triviaCategories.length,
        { start: true, duration: 700 }
    );

    const networksCount = useCountUp(
        REWARD_NETWORKS.length,
        { start: true, duration: 700 }
    );

    if (!authLoading && isAuthenticated) {
        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }

    function handleGuestAction(options) {
        openAuthGate(options);
    }

    function handleStartEarning() {
        handleGuestAction({
            title: "Create your free account",
            message:
                "Join Salok Earn to unlock trivia, tasks, surveys, offerwalls and reward withdrawals.",
            redirectTo: "/earn",
        });
    }

    return (
        <div className="home-page">
            <section className="home-hero home-hero-premium">
                <div className="home-hero-background-glow" />

                <div className="home-hero-copy">
                    <span className="home-eyebrow">
                        <Sparkles size={14} />
                        YOUR TIME HAS VALUE
                    </span>

                    <h1>
                        Turn your time into
                        <span> real rewards.</span>
                    </h1>

                    <p>
                        Play trivia, complete tasks, answer surveys and
                        explore partner offers. Salok Earn brings multiple
                        ways to earn into one simple reward experience.
                    </p>

                    <div className="home-hero-actions">
                        <button
                            type="button"
                            className="home-primary-button"
                            onClick={handleStartEarning}
                        >
                            Start earning free
                            <ArrowRight size={17} />
                        </button>

                        <Link
                            to="/earn"
                            className="home-secondary-action"
                        >
                            Explore opportunities
                            <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="home-hero-trust-row">
                        <span>
                            <Check size={14} />
                            Free to join
                        </span>

                        <span>
                            <Check size={14} />
                            Multiple earning options
                        </span>

                        <span>
                            <Check size={14} />
                            Reward tracking
                        </span>
                    </div>
                </div>

                <div className="home-hero-visual">
                    <div className="home-hero-orbit orbit-one" />
                    <div className="home-hero-orbit orbit-two" />

                    <div className="home-hero-medallion">
                        <div className="home-hero-medallion-inner">
                            <Coins size={48} />
                            <strong>SAK</strong>
                            <span>Salokoins</span>
                        </div>
                    </div>

                    <div className="home-floating-card home-floating-card-top">
                        <div className="home-floating-icon">
                            <TrendingUp size={18} />
                        </div>

                        <div>
                            <span>Balance growth</span>
                            <strong>+2,480 SAK</strong>
                        </div>
                    </div>

                    <div className="home-floating-card home-floating-card-bottom">
                        <div className="home-floating-icon">
                            <Gift size={18} />
                        </div>

                        <div>
                            <span>New reward unlocked</span>
                            <strong>Well done</strong>
                        </div>
                    </div>

                    <div className="home-floating-card home-floating-card-side">
                        <div className="home-floating-icon">
                            <Trophy size={18} />
                        </div>

                        <div>
                            <span>Member status</span>
                            <strong>Active</strong>
                        </div>
                    </div>
                </div>

                <div className="home-hero-stats">
                    <div>
                        <strong>
                            {loading || !data
                                ? "..."
                                : activitiesCount}
                        </strong>
                        <span>Available activities</span>
                    </div>

                    <div>
                        <strong>
                            {triviaCount}
                        </strong>
                        <span>Trivia categories</span>
                    </div>

                    <div>
                        <strong>
                            {networksCount}+
                        </strong>
                        <span>Partner networks</span>
                    </div>

                    <div>
                        <strong>$1</strong>
                        <span>Minimum withdrawal</span>
                    </div>
                </div>
            </section>

            <Reveal as="section" className="home-welcome-strip">
                <div className="home-welcome-icon">
                    <Globe2 size={22} />
                </div>

                <div>
                    <strong>Discover your next reward</strong>
                    <p>
                        Browse the platform freely. When you are ready to
                        participate, create an account and unlock the full
                        experience.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleStartEarning}
                >
                    Join now
                    <ArrowRight size={15} />
                </button>
            </Reveal>

            <Reveal as="section" className="home-section home-ways-section">
                <div className="home-section-heading">
                    <div>
                        <span className="home-section-label">
                            WAYS TO EARN
                        </span>

                        <h2>
                            One platform.
                            <span> Many possibilities.</span>
                        </h2>

                        <p>
                            Find an earning style that fits your day.
                            Explore different activities and build your
                            rewards at your own pace.
                        </p>
                    </div>
                </div>

                <div className="home-ways-grid">
                    {WAYS_TO_EARN.map((way) => {
                        const Icon = way.icon;

                        return (
                            <article
                                key={way.title}
                                className="home-way-card"
                            >
                                <div className="home-way-icon">
                                    <Icon size={23} />
                                </div>

                                <span className="home-way-label">
                                    {way.label}
                                </span>

                                <h3>{way.title}</h3>

                                <p>{way.description}</p>

                                <button
                                    type="button"
                                    onClick={handleStartEarning}
                                >
                                    Explore
                                    <ArrowRight size={14} />
                                </button>
                            </article>
                        );
                    })}
                </div>
            </Reveal>

            <Reveal as="section" className="home-how-it-works">
                <div className="home-section-heading">
                    <div>
                        <span className="home-section-label">
                            HOW IT WORKS
                        </span>

                        <h2>
                            Start simple.
                            <span> Keep earning.</span>
                        </h2>

                        <p>
                            Getting started is straightforward. Choose an
                            activity, complete it and keep track of your
                            progress.
                        </p>
                    </div>
                </div>

                <div className="home-steps-wrap">
                    <svg
                        className="home-connector"
                        viewBox="0 0 100 20"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                    >
                        <path
                            className="home-connector-track"
                            d="M12.5,10 C20,2 30,2 37.5,10 C45,18 55,18 62.5,10 C70,2 80,2 87.5,10"
                        />

                        <path
                            className="home-connector-line"
                            pathLength="1"
                            d="M12.5,10 C20,2 30,2 37.5,10 C45,18 55,18 62.5,10 C70,2 80,2 87.5,10"
                        />

                        {[12.5, 37.5, 62.5, 87.5].map((x) => (
                            <circle
                                key={x}
                                className="home-connector-node"
                                cx={x}
                                cy="10"
                                r="1.7"
                            />
                        ))}
                    </svg>

                    <div className="home-steps-grid">
                        {HOW_IT_WORKS.map((step) => {
                            const Icon = step.icon;

                            return (
                                <div
                                    key={step.number}
                                    className="home-step-node"
                                >
                                    <span className="home-step-badge">
                                        {step.number}
                                    </span>

                                    <article className="home-step-card">
                                        <div className="home-step-top">
                                            <Icon size={21} />
                                        </div>

                                        <h3>{step.title}</h3>
                                        <p>{step.description}</p>
                                    </article>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Reveal>

            <Reveal as="section" className="home-section">
                <div className="home-section-heading">
                    <div>
                        <span className="home-section-label">
                            TRIVIA AND GAMES
                        </span>

                        <h2>
                            Challenge yourself.
                            <span> Collect rewards.</span>
                        </h2>

                        <p>
                            Pick a category, answer questions and enjoy
                            quick rounds designed to make earning more fun.
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
                                triviaCategoryIcons[category.id] ||
                                Brain;

                            return (
                                <article
                                    key={category.id}
                                    className="home-trivia-card"
                                >
                                    <div className="home-trivia-icon">
                                        <Icon size={22} />
                                    </div>

                                    <span className="home-card-kicker">
                                        QUICK ROUND
                                    </span>

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
                                                        "Sign up to start playing",
                                                    message: `Create an account to play ${category.name} trivia and earn rewards for correct answers.`,
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
            </Reveal>

            <Reveal as="section" className="home-section">
                <div className="home-section-heading">
                    <div>
                        <span className="home-section-label">
                            TASKS AND SURVEYS
                        </span>

                        <h2>
                            Small activities.
                            <span> Meaningful progress.</span>
                        </h2>

                        <p>
                            Browse available tasks and surveys with reward
                            amounts, estimated completion times and activity
                            details shown clearly.
                        </p>
                    </div>

                    <Link
                        to="/earn"
                        className="home-section-link"
                    >
                        View all activities
                        <ArrowRight size={15} />
                    </Link>
                </div>

                {loading || !data ? (
                    <div className="home-loading">
                        <Loader
                            size="md"
                            label="Loading available activities..."
                        />
                    </div>
                ) : (
                    <div className="home-opportunity-grid">
                        {tasksAndSurveys.map((opportunity) => {
                            const Icon =
                                typeIcons[opportunity.type] || Coins;

                            return (
                                <article
                                    key={opportunity.id}
                                    className="home-opportunity-card"
                                >
                                    <div className="home-opportunity-top">
                                        <div className="home-opportunity-icon">
                                            <Icon size={19} />
                                        </div>

                                        <span>
                                            {opportunity.type}
                                        </span>
                                    </div>

                                    <h3>{opportunity.title}</h3>

                                    <p>
                                        {opportunity.description}
                                    </p>

                                    <div className="home-opportunity-meta">
                                        <span>
                                            <Clock3 size={12} />
                                            {opportunity.estimatedMinutes}{" "}
                                            min
                                        </span>

                                        <span>
                                            {opportunity.difficulty}
                                        </span>
                                    </div>

                                    <div className="home-opportunity-footer">
                                        <div>
                                            <span>Reward</span>

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
                                                        "Unlock this activity",
                                                    message: `Create an account to start ${opportunity.title} and collect its reward.`,
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
                        })}
                    </div>
                )}
            </Reveal>

            <Reveal as="section" className="home-section">
                <div className="home-section-heading">
                    <div>
                        <span className="home-section-label">
                            OFFERWALLS
                        </span>

                        <h2>
                            More partners.
                            <span> More ways to explore.</span>
                        </h2>

                        <p>
                            Discover partner networks featuring app
                            activities, surveys, trials and other reward
                            opportunities.
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
                            className={`home-network-card network-${network.accent}`}
                            onClick={() =>
                                handleGuestAction({
                                    title: `Explore ${network.name}`,
                                    message:
                                        "Create a free account to open this partner network and start exploring its activities.",
                                    redirectTo: "/offerwalls",
                                })
                            }
                        >
                            <div className="home-network-icon">
                                <Store size={19} />
                            </div>

                            <span className="home-network-name">
                                {network.name}
                            </span>

                            <strong>
                                Explore partner offers
                            </strong>

                            <p>{network.description}</p>

                            <span className="home-network-action">
                                View network
                                <ArrowRight size={14} />
                            </span>
                        </button>
                    ))}
                </div>

                {featuredOffers.length > 0 && (
                    <div className="home-featured-offers">
                        <div className="home-featured-heading">
                            <div>
                                <span className="home-section-label">
                                    FEATURED ACTIVITIES
                                </span>

                                <h3>
                                    Opportunities worth exploring
                                </h3>
                            </div>

                            <Sparkles size={21} />
                        </div>

                        <div className="home-featured-offers-list">
                            {featuredOffers.map((offer) => (
                                <button
                                    type="button"
                                    key={offer.id}
                                    className="home-featured-offer-row"
                                    onClick={() =>
                                        handleGuestAction({
                                            title:
                                                "Unlock this featured activity",
                                            message:
                                                "Create an account to explore this offer and start earning rewards.",
                                            redirectTo: "/offerwalls",
                                        })
                                    }
                                >
                                    <span>{offer.title}</span>

                                    <strong>
                                        +
                                        {formatReward(
                                            offer.reward,
                                            offer.currency
                                        )}
                                    </strong>

                                    <ArrowRight size={15} />
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </Reveal>

            <Reveal as="section" className="home-leaderboard-section">
                <div className="home-section-heading">
                    <div>
                        <span className="home-section-label">
                            COMMUNITY LEADERBOARD
                        </span>

                        <h2>
                            Every activity brings you
                            <span> closer to the top.</span>
                        </h2>

                        <p>
                            See how active members are progressing and get
                            inspired to begin your own reward journey.
                        </p>
                    </div>

                    <div className="home-leaderboard-heading-icon">
                        <Trophy size={27} />
                    </div>
                </div>

                <div className="home-leaderboard-card">
                    <div
                        className="home-leaderboard-bg-lottie"
                        aria-hidden="true"
                    >
                        <DotLottieReact
                            src={trophyAnimation}
                            loop
                            autoplay
                            style={{
                                width: "100%",
                                height: "100%",
                            }}
                        />
                    </div>

                    <div className="home-leaderboard-top-three">
                        <div className="home-leaderboard-podium second">
                            <div className="home-leaderboard-avatar">
                                <Medal size={22} />
                            </div>

                            <span className="home-leaderboard-rank">
                                2
                            </span>

                            <strong>TriviaQueen</strong>
                            <span>36,480 SAK</span>
                        </div>

                        <div className="home-leaderboard-podium first">
                            <div className="home-leaderboard-crown">
                                <CrownIcon />
                            </div>

                            <div className="home-leaderboard-avatar">
                                <Trophy size={27} />
                            </div>

                            <span className="home-leaderboard-rank">
                                1
                            </span>

                            <strong>RewardMaster</strong>
                            <span>48,920 SAK</span>
                        </div>

                        <div className="home-leaderboard-podium third">
                            <div className="home-leaderboard-avatar">
                                <Award size={22} />
                            </div>

                            <span className="home-leaderboard-rank">
                                3
                            </span>

                            <strong>TaskHunter</strong>
                            <span>29,760 SAK</span>
                        </div>
                    </div>

                    <div className="home-leaderboard-list">
                        {LEADERBOARD_PREVIEW.slice(3).map((member) => (
                            <div
                                key={member.rank}
                                className="home-leaderboard-row"
                            >
                                <span className="home-leaderboard-row-rank">
                                    {member.rank}
                                </span>

                                <div className="home-leaderboard-row-user">
                                    <div className="home-leaderboard-small-avatar">
                                        <Users size={15} />
                                    </div>

                                    <div>
                                        <strong>{member.username}</strong>
                                        <span>{member.badge}</span>
                                    </div>
                                </div>

                                <strong>
                                    {member.earned} SAK
                                </strong>
                            </div>
                        ))}
                    </div>

                    <div className="home-leaderboard-note">
                        <Star size={15} />
                        <span>
                            Leaderboard values are preview data and will
                            connect to live member activity later.
                        </span>
                    </div>
                </div>
            </Reveal>

            <Reveal as="section" className="home-community-section">
                <div className="home-community-card">
                    <div className="home-community-copy">
                        <div className="home-community-icon">
                            <MessageSquareText size={22} />
                        </div>

                        <span className="home-section-label">
                            JOIN THE CONVERSATION
                        </span>

                        <h2>
                            Chat, share tips
                            <span> and grow together.</span>
                        </h2>

                        <p>
                            Jump into the Salok Earn community chat to swap
                            earning strategies, get help from other members
                            and hear about new activities first.
                        </p>

                        <div className="home-community-stats">
                            <div>
                                <strong>2,400+</strong>
                                <span>Active members</span>
                            </div>

                            <div>
                                <strong>24/7</strong>
                                <span>Community support</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="home-primary-button"
                            onClick={() =>
                                handleGuestAction({
                                    title: "Join the community",
                                    message:
                                        "Create a free account to join the Salok Earn community chat.",
                                    redirectTo: "/community",
                                })
                            }
                        >
                            Join the community chat
                            <ArrowRight size={16} />
                        </button>
                    </div>

                    <div className="home-community-visual">
                        <img
                            src={communityIllustration}
                            alt="Members chatting in the Salok Earn community"
                            className="home-community-illustration"
                        />
                    </div>
                </div>
            </Reveal>

            <Reveal as="section" className="home-trust">
                <div className="home-trust-visual">
                    <img
                        src={secureIllustration}
                        alt=""
                        className="home-trust-bg-illustration"
                        aria-hidden="true"
                    />

                    <div className="home-trust-visual-circle">
                        <ShieldCheck size={46} />
                    </div>
                </div>

                <div className="home-trust-copy">
                    <span className="home-section-label">
                        BUILT AROUND YOUR EXPERIENCE
                    </span>

                    <h2>
                        Clear activities.
                        <span> Visible progress.</span>
                    </h2>

                    <p>
                        Salok Earn is designed to make every step easy to
                        understand, from discovering an activity to tracking
                        your rewards.
                    </p>

                    <div className="home-trust-list">
                        <span>
                            <Check size={14} />
                            Clear reward information
                        </span>

                        <span>
                            <Check size={14} />
                            Trackable earning activity
                        </span>

                        <span>
                            <Check size={14} />
                            Multiple earning categories
                        </span>

                        <span>
                            <Check size={14} />
                            Flexible reward experience
                        </span>
                    </div>
                </div>
            </Reveal>

            <Reveal as="section" className="home-final-cta">
                <img
                    src={coinsAnimation}
                    alt=""
                    className="home-final-cta-coins"
                    aria-hidden="true"
                />

                <div className="home-final-cta-icon">
                    <Rocket size={28} />
                </div>

                <span className="home-section-label">
                    YOUR NEXT REWARD STARTS HERE
                </span>

                <h2>
                    Ready to make your time count?
                </h2>

                <p>
                    Join Salok Earn and discover a smarter way to play,
                    participate and collect rewards.
                </p>

                <button
                    type="button"
                    className="home-primary-button"
                    onClick={handleStartEarning}
                >
                    Get started free
                    <ArrowRight size={17} />
                </button>
            </Reveal>

            <footer className="home-footer">
                <div className="home-footer-main">
                    <div className="home-footer-brand">
                        <div className="home-footer-logo">
                            <Coins size={22} />
                        </div>

                        <strong>Salok Earn</strong>

                        <p>
                            A rewarding way to make your time count through
                            trivia, tasks, surveys and partner activities.
                        </p>
                    </div>

                    <div className="home-footer-column">
                        <h3>Explore</h3>

                        <Link to="/">Home</Link>
                        <Link to="/trivia">Trivia and games</Link>
                        <Link to="/earn">Tasks and surveys</Link>
                        <Link to="/offerwalls">Offerwalls</Link>
                    </div>

                    <div className="home-footer-column">
                        <h3>Account</h3>

                        <button
                            type="button"
                            onClick={handleStartEarning}
                        >
                            Create account
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                handleGuestAction({
                                    title: "Sign in to Salok Earn",
                                    message:
                                        "Sign in to access your account and continue earning.",
                                    redirectTo: "/login",
                                })
                            }
                        >
                            Sign in
                        </button>

                        <Link to="/wallet">Wallet</Link>
                        <Link to="/profile">Profile</Link>
                    </div>

                    <div className="home-footer-column">
                        <h3>Why Salok Earn</h3>

                        <span>
                            <ShieldCheck size={14} />
                            Clear reward tracking
                        </span>

                        <span>
                            <Target size={14} />
                            Multiple earning paths
                        </span>

                        <span>
                            <Landmark size={14} />
                            Reward focused design
                        </span>
                    </div>
                </div>

                <div className="home-footer-bottom">
                    <span>
                        © {new Date().getFullYear()} Salok Earn. All rights
                        reserved.
                    </span>

                    <div>
                        <Link to="/privacy">Privacy</Link>
                        <Link to="/terms">Terms</Link>
                        <Link to="/help">Help</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function CrownIcon() {
    return (
        <svg
            width="23"
            height="23"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="m3 7 4 4 5-7 5 7 4-4-2 12H5L3 7Z" />
            <path d="M5 19h14" />
        </svg>
    );
}

export default HomePage;