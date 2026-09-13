import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    motion,
    useInView,
} from "framer-motion";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

import {
    ArrowRight,
    Check,
    ChevronDown,
    Coins,
    Gift,
    Link2,
    LockKeyhole,
    Menu,
    ShieldCheck,
    Sparkles,
    TrendingUp,
    Users,
    Wallet,
    X,
    Zap,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import Button from "../../components/common/Button";
import Container from "../../components/common/Container";
import ThemeToggle from "../../components/common/ThemeToggle";

import "../../styles/landing.css";

import logo from "../../assets/brand/salok-earn-logo.png";

/* =========================================================
   ILLUSTRATIONS (storyset / undraw style SVGs)
   ========================================================= */

import earningIllustration from "../../assets/illustrations/earning.svg";
import secureIllustration from "../../assets/illustrations/secure.svg";
import communityIllustration from "../../assets/illustrations/community.svg";
import financeIllustration from "../../assets/illustrations/Finance app-cuate.svg";
import coinsGif from "../../assets/illustrations/Coins.gif";

/* =========================================================
   LOTTIE ANIMATIONS
   ========================================================= */

import heroLottie from "../../assets/animations/hero-earn.lottie?url";
import rewardLottie from "../../assets/animations/reward-hero.lottie?url";
import trophyLottie from "../../assets/animations/Trophy.lottie?url";

import walletLordicon from "../../assets/lordicons/wallet.json?url";
import gameLordicon from "../../assets/lordicons/game.json?url";
import taskLordicon from "../../assets/lordicons/task.json?url";
import referralLordicon from "../../assets/lordicons/referral.json?url";


/* =========================================================
   DATA
   ========================================================= */

const EARNING_METHODS = [
    {
        number: "01",
        icon: Wallet,
        lordicon: walletLordicon,
        title: "Offerwalls",
        description:
            "Complete surveys, app offers and partner activities.",
        tag: "Earn",
    },
    {
        number: "02",
        icon: Sparkles,
        lordicon: gameLordicon,
        title: "Trivia",
        description:
            "Answer quick questions and turn knowledge into rewards.",
        tag: "Play",
    },
    {
        number: "03",
        icon: Zap,
        lordicon: taskLordicon,
        title: "Tasks",
        description:
            "Take on simple tasks and build your Salokoin balance.",
        tag: "Complete",
    },
    {
        number: "04",
        icon: Gift,
        lordicon: referralLordicon,
        title: "Referrals",
        description:
            "Invite friends and unlock additional earning opportunities.",
        tag: "Invite",
    },
];


const HOW_IT_WORKS = [
    {
        number: "01",
        title: "Create your account",
        description:
            "Sign up and set up your earning profile.",
    },
    {
        number: "02",
        title: "Choose an activity",
        description:
            "Pick an earning method that fits your time.",
    },
    {
        number: "03",
        title: "Complete & earn",
        description:
            "Finish eligible activities and collect rewards.",
    },
    {
        number: "04",
        title: "Withdraw",
        description:
            "Reach the required balance and request your payout.",
    },
];


const TRUST_ITEMS = [
    "Reward activity tracking",
    "Secure account protection",
    "Transparent earning history",
    "Supported payout methods",
];


const REWARD_NETWORKS = [
    "Timewall",
    "Wannads",
    "CPX Research",
    "TheoremReach",
];


/* =========================================================
   ANIMATION VARIANTS
   ========================================================= */

const fadeUp = {
    hidden: {
        opacity: 0,
        y: 28,
    },

    visible: {
        opacity: 1,
        y: 0,

        transition: {
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};


const stagger = {
    hidden: {},

    visible: {
        transition: {
            staggerChildren: 0.09,
        },
    },
};


/* The connecting path drawn behind the "How it works" steps.
   Anchor x-positions (12.5 / 37.5 / 62.5 / 87.5) line up with the
   centers of a 4-column equal grid, so the curve tracks the step
   nodes at any viewport width. */
const connectorDraw = {
    hidden: {
        pathLength: 0,
        opacity: 0,
    },

    visible: {
        pathLength: 1,
        opacity: 1,

        transition: {
            duration: 1.7,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};


/* =========================================================
   HERO APP VISUAL
   ========================================================= */

function HeroAppVisual() {
    return (
        <div className="hero-app-visual">

            <div className="hero-orbit hero-orbit-one" />
            <div className="hero-orbit hero-orbit-two" />

            <motion.div
                className="hero-glow"
                animate={{
                    scale: [1, 1.08, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Big hero lottie — floats behind the dashboard card
                as the animated centerpiece of the whole visual. */}

            <motion.div
                className="hero-lottie-stage"
                initial={{
                    opacity: 0,
                    scale: 0.85,
                }}
                animate={{
                    opacity: 1,
                    scale: 1,
                }}
                transition={{
                    duration: 1.1,
                    ease: [0.22, 1, 0.36, 1],
                }}
            >
                <DotLottieReact
                    src={heroLottie}
                    loop
                    autoplay
                />
            </motion.div>

            {/* Main application card */}

            <motion.div
                className="hero-dashboard-card"
                initial={{
                    opacity: 0,
                    scale: 0.88,
                    y: 25,
                }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                }}
                transition={{
                    duration: 0.9,
                    delay: 0.2,
                    ease: [0.22, 1, 0.36, 1],
                }}
            >

                <div className="hero-dashboard-top">

                    <div>
                        <span>
                            Available balance
                        </span>

                        <strong>
                            $248.40
                        </strong>
                    </div>

                    <div className="hero-wallet-icon">
                        <Wallet size={20} />
                    </div>

                </div>


                <div className="hero-chart">

                    <div className="chart-bars">
                        <span style={{ height: "35%" }} />
                        <span style={{ height: "52%" }} />
                        <span style={{ height: "42%" }} />
                        <span style={{ height: "68%" }} />
                        <span style={{ height: "57%" }} />
                        <span style={{ height: "82%" }} />
                        <span style={{ height: "96%" }} />
                    </div>

                </div>


                <div className="hero-dashboard-footer">

                    <div>
                        <small>
                            This month
                        </small>

                        <strong className="positive">
                            +18.4%
                        </strong>
                    </div>

                    <div className="hero-mini-status">
                        <span />
                        Earning active
                    </div>

                </div>

            </motion.div>


            {/* Reward notification — the icon is a tiny looping
                lottie instead of a static glyph. */}

            <motion.div
                className="hero-floating-card reward-card"
                animate={{
                    y: [0, -8, 0],
                }}
                transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >

                <div className="floating-icon lottie-icon">
                    <DotLottieReact
                        src={rewardLottie}
                        loop
                        autoplay
                    />
                </div>

                <div>
                    <small>
                        Reward unlocked
                    </small>

                    <strong>
                        +250 SAK
                    </strong>
                </div>

            </motion.div>


            {/* Withdrawal notification */}

            <motion.div
                className="hero-floating-card withdrawal-card"
                animate={{
                    y: [0, 9, 0],
                }}
                transition={{
                    duration: 4.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                }}
            >

                <div className="floating-icon success-icon">
                    <Check size={17} />
                </div>

                <div>
                    <small>
                        Withdrawal approved
                    </small>

                    <strong>
                        $12.50
                    </strong>
                </div>

            </motion.div>


            {/* Activity card */}

            <motion.div
                className="hero-activity-card"
                animate={{
                    rotate: [0, 1, 0, -1, 0],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >

                <div className="activity-icon">
                    <TrendingUp size={17} />
                </div>

                <div>
                    <small>
                        Today's earning
                    </small>

                    <strong>
                        +1,420 SAK
                    </strong>
                </div>

            </motion.div>

        </div>
    );
}


/* =========================================================
   SECTION REVEAL
   ========================================================= */

function Reveal({
    children,
    className = "",
}) {
    const ref = useRef(null);

    const isInView = useInView(
        ref,
        {
            once: true,
            margin: "-80px",
        }
    );

    return (
        <motion.div
            ref={ref}
            className={className}
            variants={fadeUp}
            initial="hidden"
            animate={
                isInView
                    ? "visible"
                    : "hidden"
            }
        >
            {children}
        </motion.div>
    );
}


/* =========================================================
   HOW IT WORKS CONNECTOR
   A single SVG path that "draws" itself in as the section
   scrolls into view, linking each step node with a flowing
   gold curve instead of a plain straight border.
   ========================================================= */

function ProcessConnector() {
    const ref = useRef(null);

    const isInView = useInView(
        ref,
        {
            once: true,
            margin: "-100px",
        }
    );

    return (
        <svg
            ref={ref}
            className="process-connector"
            viewBox="0 0 100 20"
            preserveAspectRatio="none"
            aria-hidden="true"
        >
            <defs>
                <linearGradient
                    id="processConnectorGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                >
                    <stop offset="0%" stopColor="var(--gold-300)" />
                    <stop offset="50%" stopColor="var(--gold-500)" />
                    <stop offset="100%" stopColor="var(--gold-300)" />
                </linearGradient>
            </defs>

            <path
                className="process-connector-track"
                d="M12.5,10 C20,-2 30,-2 37.5,10 C45,22 55,22 62.5,10 C70,-2 80,-2 87.5,10"
            />

            <motion.path
                className="process-connector-line"
                d="M12.5,10 C20,-2 30,-2 37.5,10 C45,22 55,22 62.5,10 C70,-2 80,-2 87.5,10"
                stroke="url(#processConnectorGradient)"
                variants={connectorDraw}
                initial="hidden"
                animate={
                    isInView
                        ? "visible"
                        : "hidden"
                }
            />

            {[12.5, 37.5, 62.5, 87.5].map(
                (x) => (
                    <circle
                        key={x}
                        className="process-connector-node"
                        cx={x}
                        cy="10"
                        r="1.7"
                    />
                )
            )}
        </svg>
    );
}


/* =========================================================
   LANDING PAGE
   ========================================================= */

export default function LandingPage() {

    const navigate = useNavigate();

    const [
        mobileOpen,
        setMobileOpen,
    ] = useState(false);


    useEffect(() => {

        document.title =
            "Salok Earn — Turn Your Time Into Rewards";

    }, []);


    const closeMobile = () => {
        setMobileOpen(false);
    };


    const navigateTo = (path) => {
        closeMobile();

        navigate(path);
    };


    const scrollTo = (id) => {

        closeMobile();

        document
            .getElementById(id)
            ?.scrollIntoView({
                behavior: "smooth",
            });
    };


    return (
        <main className="landing-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <header className="landing-header">

                <Container>

                    <div className="landing-header-inner">

                        {/* Brand */}

                        <button
                            type="button"
                            className="brand-button"
                            onClick={() =>
                                navigateTo("/")
                            }
                        >

                            <img
                                src={logo}
                                alt="Salok Earn"
                                className="brand-logo"
                            />

                            <span className="brand-text">
                                <strong>
                                    Salok
                                </strong>

                                <small>
                                    EARN
                                </small>
                            </span>

                        </button>


                        {/* Desktop navigation */}

                        <nav className="desktop-navigation">

                            <button
                                className="desktop-nav-link active"
                                onClick={() =>
                                    scrollTo("home")
                                }
                            >
                                Home
                            </button>

                            <button
                                className="desktop-nav-link"
                                onClick={() =>
                                    navigateTo("/earn")
                                }
                            >
                                Earn
                            </button>

                            <button
                                className="desktop-nav-link"
                                onClick={() =>
                                    navigateTo("/trivia")
                                }
                            >
                                Trivia
                            </button>

                            <button
                                className="desktop-nav-link"
                                onClick={() =>
                                    navigateTo("/wallet")
                                }
                            >
                                Wallet
                            </button>

                            <button
                                className="desktop-nav-link protected-link"
                                onClick={() =>
                                    navigateTo("/leaderboard")
                                }
                            >
                                Leaderboard
                                <LockKeyhole
                                    size={12}
                                />
                            </button>

                        </nav>


                        {/* Header actions */}

                        <div className="header-actions">

                            <ThemeToggle />

                            <button
                                type="button"
                                className="header-signin"
                                onClick={() =>
                                    navigateTo("/login")
                                }
                            >
                                Sign in
                            </button>

                            <Button
                                size="medium"
                                onClick={() =>
                                    navigateTo("/signup")
                                }
                            >
                                Get started
                            </Button>


                            <button
                                type="button"
                                className="mobile-menu-button"
                                aria-label={
                                    mobileOpen
                                        ? "Close menu"
                                        : "Open menu"
                                }
                                onClick={() =>
                                    setMobileOpen(
                                        (current) =>
                                            !current
                                    )
                                }
                            >

                                {mobileOpen ? (
                                    <X size={22} />
                                ) : (
                                    <Menu size={22} />
                                )}

                            </button>

                        </div>

                    </div>

                </Container>


                {/* Mobile navigation */}

                {mobileOpen && (
                    <>

                        <button
                            className="mobile-navigation-backdrop"
                            aria-label="Close navigation"
                            onClick={closeMobile}
                        />

                        <motion.aside
                            className="mobile-navigation"
                            initial={{
                                x: "100%",
                            }}
                            animate={{
                                x: 0,
                            }}
                            exit={{
                                x: "100%",
                            }}
                            transition={{
                                duration: 0.28,
                                ease: [
                                    0.22,
                                    1,
                                    0.36,
                                    1,
                                ],
                            }}
                        >

                            <div className="mobile-navigation-header">

                                <div className="mobile-brand">

                                    <img
                                        src={logo}
                                        alt="Salok Earn"
                                    />

                                    <div>
                                        <strong>
                                            Salok
                                        </strong>

                                        <span>
                                            EARN
                                        </span>
                                    </div>

                                </div>


                                <button
                                    type="button"
                                    onClick={
                                        closeMobile
                                    }
                                    className="mobile-close"
                                >
                                    <X size={20} />
                                </button>

                            </div>


                            <div className="mobile-nav-links">

                                <button
                                    onClick={() =>
                                        scrollTo("home")
                                    }
                                >
                                    Home
                                </button>

                                <button
                                    onClick={() =>
                                        navigateTo(
                                            "/earn"
                                        )
                                    }
                                >
                                    Earn
                                </button>

                                <button
                                    onClick={() =>
                                        navigateTo(
                                            "/trivia"
                                        )
                                    }
                                >
                                    Trivia
                                </button>

                                <button
                                    onClick={() =>
                                        navigateTo(
                                            "/wallet"
                                        )
                                    }
                                >
                                    Wallet
                                </button>

                                <button
                                    onClick={() =>
                                        navigateTo(
                                            "/leaderboard"
                                        )
                                    }
                                >
                                    Leaderboard
                                    <LockKeyhole
                                        size={14}
                                    />
                                </button>

                                <button
                                    onClick={() =>
                                        scrollTo(
                                            "how-it-works"
                                        )
                                    }
                                >
                                    How it works
                                </button>

                            </div>


                            <div className="mobile-navigation-actions">

                                <button
                                    className="mobile-login"
                                    onClick={() =>
                                        navigateTo(
                                            "/login"
                                        )
                                    }
                                >
                                    Sign in
                                </button>

                                <Button
                                    fullWidth
                                    onClick={() =>
                                        navigateTo(
                                            "/signup"
                                        )
                                    }
                                >
                                    Get started
                                </Button>

                            </div>


                            <div className="mobile-navigation-footer">

                                <span />

                                Premium rewards experience

                            </div>

                        </motion.aside>

                    </>
                )}

            </header>


            {/* =================================================
                HERO
            ================================================= */}

            <section
                id="home"
                className="landing-hero"
            >

                <div
                    className="hero-background-grid"
                    aria-hidden="true"
                />

                <div
                    className="hero-background-glow"
                    aria-hidden="true"
                />

                <div
                    className="hero-blob hero-blob-one"
                    aria-hidden="true"
                />

                <div
                    className="hero-blob hero-blob-two"
                    aria-hidden="true"
                />


                <Container>

                    <div className="hero-layout">

                        {/* Hero copy */}

                        <motion.div
                            className="hero-copy"
                            initial="hidden"
                            animate="visible"
                            variants={stagger}
                        >

                            <motion.div
                                className="hero-eyebrow"
                                variants={fadeUp}
                            >

                                <Sparkles size={15} />

                                <span>
                                    A smarter way to earn online
                                </span>

                            </motion.div>


                            <motion.h1
                                variants={fadeUp}
                            >

                                Turn your time

                                <br />

                                into{" "}
                                <span className="hero-shimmer-text">
                                    rewards.
                                </span>

                            </motion.h1>


                            <motion.p
                                className="hero-description"
                                variants={fadeUp}
                            >

                                Earn through trivia,
                                offers, tasks and
                                referrals — all in
                                one simple platform.

                            </motion.p>


                            <motion.div
                                className="hero-actions"
                                variants={fadeUp}
                            >

                                <Button
                                    size="large"
                                    onClick={() =>
                                        navigateTo(
                                            "/signup"
                                        )
                                    }
                                >
                                    Start earning
                                </Button>


                                <button
                                    className="hero-secondary-action"
                                    onClick={() =>
                                        scrollTo(
                                            "how-it-works"
                                        )
                                    }
                                >

                                    See how it works

                                    <ArrowRight
                                        size={17}
                                    />

                                </button>

                            </motion.div>


                            <motion.div
                                className="hero-trust"
                                variants={fadeUp}
                            >

                                <div className="hero-trust-avatars">

                                    <span>
                                        S
                                    </span>

                                    <span>
                                        A
                                    </span>

                                    <span>
                                        K
                                    </span>

                                    <span>
                                        +
                                    </span>

                                </div>

                                <div>

                                    <div className="trust-stars">
                                        ★★★★★
                                    </div>

                                    <p>
                                        Built for simple,
                                        transparent rewards
                                    </p>

                                </div>

                                <div className="hero-rate-chip">

                                    <img
                                        src={coinsGif}
                                        alt=""
                                        className="hero-rate-coin"
                                    />

                                    <span>
                                        <strong>
                                            100 SAK
                                        </strong>
                                        {" "}= $1.00
                                    </span>

                                </div>

                            </motion.div>

                        </motion.div>


                        {/* Hero visual */}

                        <motion.div
                            className="hero-visual-wrap"
                            initial={{
                                opacity: 0,
                                scale: 0.9,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                            }}
                            transition={{
                                duration: 0.9,
                                delay: 0.15,
                                ease: [
                                    0.22,
                                    1,
                                    0.36,
                                    1,
                                ],
                            }}
                        >

                            <HeroAppVisual />

                        </motion.div>

                    </div>

                </Container>


                <div
                    className="hero-scroll-indicator"
                    aria-hidden="true"
                >

                    <ChevronDown
                        size={17}
                    />

                </div>

            </section>


            {/* =================================================
                TRUSTED REWARD NETWORKS
            ================================================= */}

            <section
                className="landing-section network-section"
                aria-label="Trusted reward networks"
            >

                <Container>

                    <Reveal className="network-heading">

                        <span className="section-label">
                            POWERED BY TRUSTED NETWORKS
                        </span>

                        <p>
                            Salok Earn connects you to the
                            reward networks behind every offer,
                            survey and task — including{" "}
                            <strong>Timewall</strong>,{" "}
                            <strong>Wannads</strong>,{" "}
                            <strong>CPX Research</strong> and{" "}
                            <strong>TheoremReach</strong>.
                        </p>

                    </Reveal>

                </Container>


                <div
                    className="network-marquee"
                    aria-hidden="true"
                >

                    <div className="network-track">

                        {[
                            ...REWARD_NETWORKS,
                            ...REWARD_NETWORKS,
                        ].map(
                            (name, index) => (

                                <div
                                    className="network-chip"
                                    key={`${name}-${index}`}
                                >

                                    <Link2 size={14} />

                                    {name}

                                </div>

                            )
                        )}

                    </div>

                </div>


                <Container>

                    <div className="network-rate-banner">

                        <div className="network-rate-icon">
                            <Coins size={20} />
                        </div>

                        <div>

                            <strong>
                                100 SAK = $1.00
                            </strong>

                            <span>
                                A simple, transparent
                                conversion rate across
                                every earning method.
                            </span>

                        </div>

                    </div>

                </Container>

            </section>


            {/* =================================================
                WAYS TO EARN
            ================================================= */}

            <section
                id="ways-to-earn"
                className="landing-section earning-section"
            >

                <Container>

                    <Reveal>

                        <div className="section-heading earning-heading">

                            <div>

                                <span className="section-label">
                                    WAYS TO EARN
                                </span>

                                <h2>
                                    More ways to earn.
                                    <span>
                                        {" "}More reasons to stay.
                                    </span>
                                </h2>

                                <p className="earning-heading-copy">
                                    Pick what fits your
                                    time. Salok keeps
                                    everything in one place.
                                </p>

                            </div>

                            <img
                                src={earningIllustration}
                                alt=""
                                className="earning-heading-illustration"
                            />

                        </div>

                    </Reveal>


                    <motion.div
                        className="earning-grid"
                        variants={stagger}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{
                            once: true,
                            margin: "-70px",
                        }}
                    >

                        {EARNING_METHODS.map(
                            (item) => {

                                const Icon =
                                    item.icon;

                                return (
                                    <motion.article
                                        key={
                                            item.number
                                        }
                                        className="earning-card"
                                        variants={fadeUp}
                                        whileHover={{
                                            y: -7,
                                        }}
                                    >

                                        <div className="earning-card-top">

                                            <span className="earning-number">
                                                {item.number}
                                            </span>

                                            <div className="earning-card-icon">
                                                {item.lordicon ? (
                                                    <DotLottieReact
                                                        src={
                                                            item.lordicon
                                                        }
                                                        loop
                                                        autoplay
                                                    />
                                                ) : (
                                                    <Icon
                                                        size={21}
                                                    />
                                                )}
                                            </div>

                                        </div>


                                        <div>

                                            <span className="earning-card-tag">
                                                {item.tag}
                                            </span>

                                            <h3>
                                                {item.title}
                                            </h3>

                                            <p>
                                                {
                                                    item.description
                                                }
                                            </p>

                                        </div>


                                        <div className="earning-card-arrow">
                                            <ArrowRight
                                                size={17}
                                            />
                                        </div>

                                    </motion.article>
                                );
                            }
                        )}

                    </motion.div>

                </Container>

            </section>


            {/* =================================================
                HOW IT WORKS
            ================================================= */}

            <section
                id="how-it-works"
                className="landing-section process-section"
            >

                <Container>

                    <Reveal>

                        <div className="centered-section-heading">

                            <span className="section-label">
                                HOW IT WORKS
                            </span>

                            <h2>
                                Start earning in
                                <span>
                                    {" "}four simple steps.
                                </span>
                            </h2>

                            <p>
                                No complicated setup.
                                Choose an activity,
                                complete it and keep
                                moving.
                            </p>

                        </div>

                    </Reveal>


                    <div className="process-timeline-wrap">

                        <ProcessConnector />

                        <div className="process-timeline">

                            {HOW_IT_WORKS.map(
                                (step) => (

                                    <Reveal
                                        key={
                                            step.number
                                        }
                                        className="process-step-reveal"
                                    >

                                        <article className="process-step">

                                            <div className="process-step-number">
                                                {step.number}
                                            </div>

                                            <div>

                                                <h3>
                                                    {step.title}
                                                </h3>

                                                <p>
                                                    {
                                                        step.description
                                                    }
                                                </p>

                                            </div>

                                        </article>

                                    </Reveal>

                                )
                            )}

                        </div>

                    </div>

                </Container>

            </section>


            {/* =================================================
                APP PREVIEW
            ================================================= */}

            <section className="landing-section app-preview-section">

                <Container>

                    <div className="app-preview-layout">

                        <Reveal>

                            <div className="app-preview-copy">

                                <span className="section-label">
                                    INSIDE SALOK EARN
                                </span>

                                <h2>
                                    Everything you need.
                                    <span>
                                        {" "}One clear view.
                                    </span>
                                </h2>

                                <p>
                                    Your dashboard brings
                                    your balance, activity,
                                    rewards and progress
                                    together.
                                </p>


                                <div className="preview-check-list">

                                    {TRUST_ITEMS.map(
                                        (item) => (

                                            <div
                                                key={item}
                                            >

                                                <span>
                                                    <Check
                                                        size={14}
                                                    />
                                                </span>

                                                {item}

                                            </div>

                                        )
                                    )}

                                </div>


                                <Button
                                    variant="outline"
                                    size="large"
                                    onClick={() =>
                                        navigateTo(
                                            "/login"
                                        )
                                    }
                                >
                                    Explore the app
                                </Button>

                            </div>

                        </Reveal>


                        <Reveal>

                            <div className="app-preview">

                                <img
                                    src={financeIllustration}
                                    alt=""
                                    className="app-preview-illustration"
                                />

                                <div className="preview-window">

                                    <div className="preview-window-header">

                                        <div className="preview-dots">
                                            <span />
                                            <span />
                                            <span />
                                        </div>

                                        <span>
                                            Salok Earn
                                        </span>

                                    </div>


                                    <div className="preview-content">

                                        <div className="preview-welcome">

                                            <div>

                                                <small>
                                                    Welcome back
                                                </small>

                                                <strong>
                                                    Your earning
                                                    overview
                                                </strong>

                                            </div>

                                            <div className="preview-avatar">
                                                S
                                            </div>

                                        </div>


                                        <div className="preview-balance-card">

                                            <div>

                                                <span>
                                                    Total balance
                                                </span>

                                                <strong>
                                                    $248.40
                                                </strong>

                                            </div>

                                            <div className="preview-balance-icon">
                                                <Wallet
                                                    size={19}
                                                />
                                            </div>

                                        </div>


                                        <div className="preview-stat-grid">

                                            <div>

                                                <small>
                                                    Today's earnings
                                                </small>

                                                <strong>
                                                    +1,420
                                                    <span>
                                                        SAK
                                                    </span>
                                                </strong>

                                            </div>

                                            <div>

                                                <small>
                                                    Activities
                                                </small>

                                                <strong>
                                                    12
                                                </strong>

                                            </div>

                                        </div>


                                        <div className="preview-activity">

                                            <div className="preview-activity-header">

                                                <strong>
                                                    Recent activity
                                                </strong>

                                                <span>
                                                    View all
                                                </span>

                                            </div>


                                            <div className="preview-activity-row">

                                                <div className="preview-activity-icon">
                                                    <Gift
                                                        size={15}
                                                    />
                                                </div>

                                                <div>
                                                    <strong>
                                                        Reward unlocked
                                                    </strong>

                                                    <small>
                                                        Offerwall
                                                    </small>
                                                </div>

                                                <b>
                                                    +250
                                                </b>

                                            </div>


                                            <div className="preview-activity-row">

                                                <div className="preview-activity-icon">
                                                    <Zap
                                                        size={15}
                                                    />
                                                </div>

                                                <div>
                                                    <strong>
                                                        Trivia reward
                                                    </strong>

                                                    <small>
                                                        Trivia round
                                                    </small>
                                                </div>

                                                <b>
                                                    +120
                                                </b>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </Reveal>

                    </div>

                </Container>

            </section>


            {/* =================================================
                TRUST
            ================================================= */}

            <section className="landing-section trust-section">

                <Container>

                    <div className="trust-layout">

                        <Reveal>

                            <div className="trust-visual">

                                <img
                                    src={secureIllustration}
                                    alt=""
                                    className="trust-illustration"
                                />

                                <div className="trust-orbit" />

                                <motion.div
                                    className="trust-shield"
                                    animate={{
                                        y: [0, -8, 0],
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                >
                                    <ShieldCheck
                                        size={58}
                                    />
                                </motion.div>


                                <div className="trust-status-card">

                                    <span className="status-dot" />

                                    <div>

                                        <small>
                                            Platform status
                                        </small>

                                        <strong>
                                            Protected
                                        </strong>

                                    </div>

                                </div>

                            </div>

                        </Reveal>


                        <Reveal>

                            <div className="trust-copy">

                                <span className="section-label">
                                    BUILT FOR TRUST
                                </span>

                                <h2>
                                    Your rewards
                                    should feel
                                    <span>
                                        {" "}safe.
                                    </span>
                                </h2>

                                <p>
                                    Salok is designed
                                    around clear activity
                                    tracking, account
                                    protection and a
                                    transparent earning
                                    experience.
                                </p>


                                <div className="trust-list">

                                    {TRUST_ITEMS.map(
                                        (item) => (

                                            <div
                                                key={item}
                                            >

                                                <Check
                                                    size={16}
                                                />

                                                <span>
                                                    {item}
                                                </span>

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>

                        </Reveal>

                    </div>

                </Container>

            </section>


            {/* =================================================
                COMMUNITY
            ================================================= */}

            <section className="landing-section community-section">

                <div
                    className="community-glow"
                    aria-hidden="true"
                />

                <Container>

                    <div className="community-layout">

                        <Reveal className="community-visual">

                            <img
                                src={communityIllustration}
                                alt=""
                                className="community-illustration"
                            />

                        </Reveal>


                        <Reveal>

                            <div className="community-copy">

                                <span className="section-label">
                                    JOIN THE MOVEMENT
                                </span>

                                <h2>
                                    You're not earning
                                    <span>
                                        {" "}alone.
                                    </span>
                                </h2>

                                <p>
                                    Chat, compete and
                                    celebrate wins with
                                    thousands of other
                                    members inside the
                                    Salok community.
                                </p>

                                <Button
                                    size="large"
                                    icon={
                                        <Users size={17} />
                                    }
                                    iconPosition="left"
                                    onClick={() =>
                                        navigateTo(
                                            "/signup"
                                        )
                                    }
                                >
                                    Join the community
                                </Button>

                            </div>

                        </Reveal>

                    </div>

                </Container>

            </section>


            {/* =================================================
                FINAL CTA
            ================================================= */}

            <section className="final-cta-section">

                <div className="final-cta-glow" />

                <div className="final-cta-trophy" aria-hidden="true">
                    <DotLottieReact
                        src={trophyLottie}
                        loop
                        autoplay
                    />
                </div>

                <Container>

                    <Reveal>

                        <div className="final-cta">

                            <span className="section-label">
                                YOUR NEXT REWARD IS WAITING
                            </span>

                            <h2>
                                Make your spare time
                                <span>
                                    {" "}worth more.
                                </span>
                            </h2>

                            <p>
                                Create your account,
                                choose an activity and
                                start earning.
                            </p>

                            <Button
                                size="large"
                                onClick={() =>
                                    navigateTo(
                                        "/signup"
                                    )
                                }
                            >
                                Get started
                            </Button>

                        </div>

                    </Reveal>

                </Container>

            </section>


            {/* =================================================
                FOOTER
            ================================================= */}

            <footer className="landing-footer">

                <Container>

                    <div className="footer-main">

                        <div className="footer-brand">

                            <button
                                className="brand-button footer-brand-button"
                                onClick={() =>
                                    navigateTo("/")
                                }
                            >

                                <img
                                    src={logo}
                                    alt="Salok Earn"
                                    className="brand-logo footer-brand-logo"
                                />

                                <span className="brand-text">
                                    <strong>
                                        Salok
                                    </strong>

                                    <small>
                                        EARN
                                    </small>
                                </span>

                            </button>


                            <p>
                                A modern rewards
                                experience built
                                around your time.
                            </p>

                        </div>


                        <div className="footer-column">

                            <strong>
                                Explore
                            </strong>

                            <button
                                onClick={() =>
                                    navigateTo(
                                        "/earn"
                                    )
                                }
                            >
                                Earn
                            </button>

                            <button
                                onClick={() =>
                                    navigateTo(
                                        "/trivia"
                                    )
                                }
                            >
                                Trivia
                            </button>

                            <button
                                onClick={() =>
                                    navigateTo(
                                        "/leaderboard"
                                    )
                                }
                            >
                                Leaderboard
                            </button>

                            <button
                                onClick={() =>
                                    scrollTo(
                                        "how-it-works"
                                    )
                                }
                            >
                                How it works
                            </button>

                        </div>


                        <div className="footer-column">

                            <strong>
                                Account
                            </strong>

                            <button
                                onClick={() =>
                                    navigateTo(
                                        "/login"
                                    )
                                }
                            >
                                Sign in
                            </button>

                            <button
                                onClick={() =>
                                    navigateTo(
                                        "/signup"
                                    )
                                }
                            >
                                Create account
                            </button>

                            <button
                                onClick={() =>
                                    navigateTo(
                                        "/wallet"
                                    )
                                }
                            >
                                Wallet
                            </button>

                        </div>


                        <div className="footer-column">

                            <strong>
                                Trust
                            </strong>

                            <span>
                                Secure account
                            </span>

                            <span>
                                Reward tracking
                            </span>

                            <span>
                                Transparent activity
                            </span>

                        </div>

                    </div>


                    <div className="footer-bottom">

                        <span>
                            ©{" "}
                            {new Date().getFullYear()}
                            {" "}
                            Salok World.
                            All rights reserved.
                        </span>

                        <span className="footer-status">

                            <span />

                            Systems operational

                        </span>

                    </div>


                    <div className="footer-attribution">

                        Animated icons by Lordicon.com
                        {" · "}
                        Illustrations by Storyset

                    </div>

                </Container>

            </footer>

        </main>
    );
}