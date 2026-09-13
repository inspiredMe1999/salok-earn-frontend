/*
|--------------------------------------------------------------------------
| Salok Earn - Referrals Page
|--------------------------------------------------------------------------
|
| This page currently uses the mock referral service.
|
| Firebase integration will be added later without changing the overall
| page structure.
|
|--------------------------------------------------------------------------
*/

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import {
    ArrowRight,
    Check,
    CheckCircle2,
    ChevronRight,
    Clipboard,
    Clock3,
    Copy,
    Gift,
    Link2,
    Loader2,
    Share2,
    Sparkles,
    Target,
    TrendingUp,
    Trophy,
    Users,
    WalletCards,
    XCircle,
} from "lucide-react";

import { toast } from "sonner";

import referralService from "../../services/mock/referralService";

import "./referrals.css";


/*
|--------------------------------------------------------------------------
| Format Numbers
|--------------------------------------------------------------------------
*/

function formatNumber(value = 0) {
    return new Intl.NumberFormat("en-US").format(value);
}


/*
|--------------------------------------------------------------------------
| Format SAK
|--------------------------------------------------------------------------
*/

function formatSAK(value = 0) {
    return `${Number(value).toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })} SAK`;
}


/*
|--------------------------------------------------------------------------
| Format Date
|--------------------------------------------------------------------------
*/

function formatDate(dateString) {
    if (!dateString) {
        return "—";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return dateString;
    }

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);
}


/*
|--------------------------------------------------------------------------
| Referral Status
|--------------------------------------------------------------------------
*/

function ReferralStatus({ status }) {
    if (status === "successful") {
        return (
            <span className="referral-status referral-status-success">
                <CheckCircle2 size={14} />
                Successful
            </span>
        );
    }

    if (status === "pending") {
        return (
            <span className="referral-status referral-status-pending">
                <Clock3 size={14} />
                Pending
            </span>
        );
    }

    return (
        <span className="referral-status referral-status-expired">
            <XCircle size={14} />
            Expired
        </span>
    );
}


/*
|--------------------------------------------------------------------------
| Statistic Card
|--------------------------------------------------------------------------
*/

function StatCard({
    icon: Icon,
    label,
    value,
    description,
    accent = "default",
    index = 0,
}) {
    return (
        <motion.div
            className={`referral-stat-card referral-stat-${accent}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
            whileHover={{ y: -3 }}
        >
            <div className="referral-stat-icon">
                <Icon size={20} />
            </div>

            <div className="referral-stat-content">
                <span className="referral-stat-label">
                    {label}
                </span>

                <strong className="referral-stat-value">
                    {value}
                </strong>

                {description && (
                    <span className="referral-stat-description">
                        {description}
                    </span>
                )}
            </div>
        </motion.div>
    );
}


/*
|--------------------------------------------------------------------------
| Milestone Card
|--------------------------------------------------------------------------
*/

function MilestoneCard({ milestone, currentReferrals }) {
    const progress = Math.min(
        (currentReferrals / milestone.referralsRequired) * 100,
        100
    );

    return (
        <motion.div
            className={`referral-milestone ${milestone.completed
                ? "referral-milestone-completed"
                : ""
                }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
        >
            <div className="referral-milestone-icon">
                {milestone.completed ? (
                    <Check size={18} />
                ) : (
                    <Target size={18} />
                )}
            </div>

            <div className="referral-milestone-body">
                <div className="referral-milestone-heading">
                    <div>
                        <h4>{milestone.title}</h4>

                        <p>{milestone.description}</p>
                    </div>

                    <strong>
                        {formatSAK(milestone.reward)}
                    </strong>
                </div>

                <div className="referral-milestone-progress">
                    <div className="referral-progress-track">
                        <motion.div
                            className="referral-progress-fill"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                        />
                    </div>

                    <span>
                        {Math.min(
                            currentReferrals,
                            milestone.referralsRequired
                        )}
                        /
                        {milestone.referralsRequired}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}


/*
|--------------------------------------------------------------------------
| Main Page
|--------------------------------------------------------------------------
*/

export default function ReferralsPage() {
    const [pageData, setPageData] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [copied, setCopied] = useState(false);

    const [sharing, setSharing] = useState(false);


    /*
    |--------------------------------------------------------------------------
    | Load Referral Data
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        let mounted = true;

        async function loadPage() {
            try {
                setLoading(true);

                setError("");

                const response =
                    await referralService.getReferralPageData();

                if (!mounted) {
                    return;
                }

                if (!response?.success) {
                    throw new Error(
                        "Unable to load referral information."
                    );
                }

                setPageData(response.data);
            } catch (err) {
                console.error(
                    "Referral page error:",
                    err
                );

                if (mounted) {
                    setError(
                        "We couldn't load your referral information. Please try again."
                    );
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        loadPage();

        return () => {
            mounted = false;
        };
    }, []);


    /*
    |--------------------------------------------------------------------------
    | Referral Values
    |--------------------------------------------------------------------------
    */

    const config = pageData?.config;

    const summary = pageData?.summary;

    const progress = pageData?.progress;

    const history = pageData?.history || [];

    const milestones = pageData?.milestones || [];

    const steps = pageData?.steps || [];


    /*
    |--------------------------------------------------------------------------
    | Current Milestone
    |--------------------------------------------------------------------------
    */

    const nextMilestone = useMemo(() => {
        return milestones.find(
            (milestone) => !milestone.completed
        );
    }, [milestones]);


    /*
    |--------------------------------------------------------------------------
    | Copy Referral Link
    |--------------------------------------------------------------------------
    */

    async function handleCopy() {
        try {
            await referralService.copyReferralLink();

            setCopied(true);

            toast.success(
                "Referral link copied!"
            );

            window.setTimeout(() => {
                setCopied(false);
            }, 2200);
        } catch (err) {
            console.error(
                "Copy referral link error:",
                err
            );

            toast.error(
                "Unable to copy referral link."
            );
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Share Referral Link
    |--------------------------------------------------------------------------
    */

    async function handleShare() {
        try {
            setSharing(true);

            const response =
                await referralService.shareReferralLink();

            if (response.shared) {
                toast.success(
                    "Referral link shared!"
                );

                return;
            }

            await referralService.copyReferralLink();

            setCopied(true);

            toast.success(
                "Sharing isn't available here, so the referral link was copied instead."
            );

            window.setTimeout(() => {
                setCopied(false);
            }, 2200);
        } catch (err) {
            /*
            |--------------------------------------------------------------------------
            | User cancelled native share
            |--------------------------------------------------------------------------
            |
            | Do not show an error when the user simply closes the
            | native sharing dialog.
            |
            */

            if (
                err?.name !==
                "AbortError"
            ) {
                console.error(
                    "Share referral error:",
                    err
                );

                toast.error(
                    "Unable to share referral link."
                );
            }
        } finally {
            setSharing(false);
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Loading State
    |--------------------------------------------------------------------------
    */

    if (loading) {
        return (
            <div className="referrals-page">
                <div className="referrals-loading">
                    <div className="referrals-loading-icon">
                        <Loader2
                            size={28}
                            className="referrals-spinner"
                        />
                    </div>

                    <h2>
                        Loading referrals
                    </h2>

                    <p>
                        Preparing your referral dashboard...
                    </p>
                </div>
            </div>
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Error State
    |--------------------------------------------------------------------------
    */

    if (error || !pageData) {
        return (
            <div className="referrals-page">
                <div className="referrals-error">
                    <div className="referrals-error-icon">
                        <XCircle size={28} />
                    </div>

                    <h2>
                        Something went wrong
                    </h2>

                    <p>
                        {error ||
                            "Referral information is unavailable."}
                    </p>

                    <button
                        type="button"
                        className="referral-primary-button"
                        onClick={() =>
                            window.location.reload()
                        }
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Main Render
    |--------------------------------------------------------------------------
    */

    return (
        <div className="referrals-page">

            {/* -------------------------------------------------------------- */}
            {/* Page Header                                                    */}
            {/* -------------------------------------------------------------- */}

            <header className="referrals-header">

                <div>
                    <div className="referrals-eyebrow">
                        <Users size={15} />

                        Referral program
                    </div>

                    <h1>
                        Grow your earnings
                        <span> by inviting others.</span>
                    </h1>

                    <p>
                        Share Salok Earn with your network and
                        earn rewards when your referrals become
                        active earners.
                    </p>
                </div>

                <div className="referrals-header-badge">
                    <Sparkles size={17} />

                    <span>
                        Earn more together
                    </span>
                </div>
            </header>


            {/* -------------------------------------------------------------- */}
            {/* Referral Hero                                                   */}
            {/* -------------------------------------------------------------- */}

            <motion.section
                className="referral-hero"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
            >

                <div className="referral-hero-glow referral-hero-glow-one" />

                <div className="referral-hero-glow referral-hero-glow-two" />

                <div className="referral-hero-content">

                    <div className="referral-hero-icon">
                        <Gift size={25} />
                    </div>

                    <span className="referral-hero-label">
                        YOUR REFERRAL REWARD
                    </span>

                    <h2>
                        {formatSAK(
                            config.rewardPerSuccessfulReferral
                        )}
                    </h2>

                    <p>
                        Earn for every eligible successful
                        referral.
                    </p>

                </div>


                {/* Referral Link Box */}

                <div className="referral-link-panel">

                    <div className="referral-link-heading">
                        <div>
                            <span>
                                Your referral link
                            </span>

                            <strong>
                                {config.referralCode}
                            </strong>
                        </div>

                        <Link2 size={20} />
                    </div>


                    <div className="referral-link-box">

                        <span>
                            {config.referralLink}
                        </span>

                        <motion.button
                            type="button"
                            onClick={handleCopy}
                            className="referral-copy-button"
                            title="Copy referral link"
                            whileTap={{ scale: 0.94 }}
                        >
                            {copied ? (
                                <Check size={18} />
                            ) : (
                                <Copy size={18} />
                            )}

                            <span>
                                {copied
                                    ? "Copied"
                                    : "Copy"}
                            </span>
                        </motion.button>

                    </div>


                    <button
                        type="button"
                        className="referral-share-button"
                        onClick={handleShare}
                        disabled={sharing}
                    >
                        {sharing ? (
                            <Loader2
                                size={18}
                                className="referrals-spinner"
                            />
                        ) : (
                            <Share2 size={18} />
                        )}

                        {sharing
                            ? "Preparing..."
                            : "Share referral link"}
                    </button>

                </div>

            </motion.section>


            {/* -------------------------------------------------------------- */}
            {/* Statistics                                                      */}
            {/* -------------------------------------------------------------- */}

            <section className="referral-stats-grid">

                <StatCard
                    icon={Users}
                    label="Total referrals"
                    value={formatNumber(
                        summary.totalReferrals
                    )}
                    description="People you've invited"
                    index={0}
                />

                <StatCard
                    icon={CheckCircle2}
                    label="Successful"
                    value={formatNumber(
                        summary.successfulReferrals
                    )}
                    description={`${summary.conversionRate}% conversion rate`}
                    accent="success"
                    index={1}
                />

                <StatCard
                    icon={Clock3}
                    label="Pending"
                    value={formatNumber(
                        summary.pendingReferrals
                    )}
                    description="Still becoming active"
                    accent="pending"
                    index={2}
                />

                <StatCard
                    icon={WalletCards}
                    label="Referral earnings"
                    value={formatSAK(
                        summary.totalEarned
                    )}
                    description="Total referral rewards"
                    accent="gold"
                    index={3}
                />

            </section>


            {/* -------------------------------------------------------------- */}
            {/* Main Content Grid                                               */}
            {/* -------------------------------------------------------------- */}

            <div className="referrals-main-grid">

                <div className="referrals-main-column">

                    {/* ------------------------------------------------------ */}
                    {/* Progress Card                                           */}
                    {/* ------------------------------------------------------ */}

                    <section className="referral-card referral-progress-card">

                        <div className="referral-section-header">

                            <div>
                                <span className="referral-section-kicker">
                                    NEXT MILESTONE
                                </span>

                                <h2>
                                    Keep the momentum going
                                </h2>
                            </div>

                            <div className="referral-section-icon">
                                <TrendingUp size={20} />
                            </div>

                        </div>


                        <div className="referral-big-progress">

                            <div className="referral-progress-top">

                                <div>
                                    <strong>
                                        {progress.current}
                                    </strong>

                                    <span>
                                        /
                                        {progress.target}
                                        {" "}
                                        successful referrals
                                    </span>
                                </div>

                                <strong className="referral-progress-percent">
                                    {progress.percentage}%
                                </strong>

                            </div>


                            <div className="referral-progress-track referral-progress-track-large">
                                <motion.div
                                    className="referral-progress-fill"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress.percentage}%` }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                />
                            </div>


                            <div className="referral-progress-bottom">

                                <p>
                                    {progress.description}
                                </p>

                                <span>
                                    Reward:{" "}
                                    <strong>
                                        {formatSAK(
                                            progress.reward
                                        )}
                                    </strong>
                                </span>

                            </div>

                        </div>

                    </section>


                    {/* ------------------------------------------------------ */}
                    {/* Milestones                                               */}
                    {/* ------------------------------------------------------ */}

                    <section className="referral-card">

                        <div className="referral-section-header">

                            <div>
                                <span className="referral-section-kicker">
                                    REWARDS
                                </span>

                                <h2>
                                    Referral milestones
                                </h2>
                            </div>

                            <Trophy
                                size={21}
                                className="referral-heading-icon"
                            />

                        </div>


                        <div className="referral-milestones">

                            {milestones.map(
                                (milestone) => (
                                    <MilestoneCard
                                        key={
                                            milestone.id
                                        }
                                        milestone={
                                            milestone
                                        }
                                        currentReferrals={
                                            summary.successfulReferrals
                                        }
                                    />
                                )
                            )}

                        </div>

                    </section>


                    {/* ------------------------------------------------------ */}
                    {/* Referral History                                         */}
                    {/* ------------------------------------------------------ */}

                    <section className="referral-card referral-history-card">

                        <div className="referral-section-header">

                            <div>
                                <span className="referral-section-kicker">
                                    ACTIVITY
                                </span>

                                <h2>
                                    Referral history
                                </h2>
                            </div>

                            <span className="referral-history-count">
                                {formatNumber(
                                    history.length
                                )}{" "}
                                referrals
                            </span>

                        </div>


                        <div className="referral-history">

                            {history.length > 0 ? (
                                history.map(
                                    (referral, index) => (
                                        <motion.div
                                            className="referral-history-row"
                                            key={
                                                referral.id
                                            }
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                duration: 0.3,
                                                delay: Math.min(index, 8) * 0.04,
                                                ease: "easeOut",
                                            }}
                                        >

                                            <div className="referral-person">

                                                <div className="referral-person-avatar">
                                                    {
                                                        referral.initials
                                                    }
                                                </div>

                                                <div>
                                                    <strong>
                                                        {
                                                            referral.name
                                                        }
                                                    </strong>

                                                    <span>
                                                        @
                                                        {
                                                            referral.username
                                                        }
                                                    </span>
                                                </div>

                                            </div>


                                            <div className="referral-history-date">
                                                {
                                                    formatDate(
                                                        referral.joinedAt
                                                    )
                                                }
                                            </div>


                                            <ReferralStatus
                                                status={
                                                    referral.status
                                                }
                                            />


                                            <div className="referral-history-reward">

                                                {referral.reward >
                                                    0 ? (
                                                    <>
                                                        <strong>
                                                            +
                                                            {formatSAK(
                                                                referral.reward
                                                            )}
                                                        </strong>

                                                        <span>
                                                            Credited
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <strong>
                                                            —
                                                        </strong>

                                                        <span>
                                                            Pending
                                                        </span>
                                                    </>
                                                )}

                                            </div>

                                        </motion.div>
                                    )
                                )
                            ) : (
                                <div className="referral-empty">
                                    <Users size={24} />

                                    <h3>
                                        No referrals yet
                                    </h3>

                                    <p>
                                        Share your referral
                                        link to get started.
                                    </p>
                                </div>
                            )}

                        </div>

                    </section>

                </div>


                {/* ---------------------------------------------------------- */}
                {/* Right Column                                                */}
                {/* ---------------------------------------------------------- */}

                <aside className="referrals-side-column">

                    {/* ------------------------------------------------------ */}
                    {/* Earnings Card                                            */}
                    {/* ------------------------------------------------------ */}

                    <section className="referral-card referral-earnings-card">

                        <div className="referral-side-icon">
                            <WalletCards size={21} />
                        </div>

                        <span className="referral-section-kicker">
                            REFERRAL EARNINGS
                        </span>

                        <h2>
                            {formatSAK(
                                summary.referralEarnings
                            )}
                        </h2>

                        <p>
                            Earned directly from successful
                            referrals.
                        </p>

                        <div className="referral-earnings-divider" />

                        <div className="referral-earnings-row">
                            <span>
                                Referral rewards
                            </span>

                            <strong>
                                {formatSAK(
                                    summary.referralEarnings
                                )}
                            </strong>
                        </div>

                        <div className="referral-earnings-row">
                            <span>
                                Bonus rewards
                            </span>

                            <strong>
                                {formatSAK(
                                    summary.bonusEarnings
                                )}
                            </strong>
                        </div>

                        <div className="referral-earnings-total">
                            <span>
                                Total
                            </span>

                            <strong>
                                {formatSAK(
                                    summary.totalEarned
                                )}
                            </strong>
                        </div>

                    </section>


                    {/* ------------------------------------------------------ */}
                    {/* Current Target                                           */}
                    {/* ------------------------------------------------------ */}

                    {nextMilestone && (
                        <section className="referral-card referral-target-card">

                            <div className="referral-target-icon">
                                <Target size={20} />
                            </div>

                            <span className="referral-section-kicker">
                                NEXT TARGET
                            </span>

                            <h3>
                                {
                                    nextMilestone.title
                                }
                            </h3>

                            <p>
                                {
                                    nextMilestone.description
                                }
                            </p>

                            <div className="referral-target-reward">
                                <Gift size={16} />

                                <span>
                                    Unlock{" "}
                                    <strong>
                                        {formatSAK(
                                            nextMilestone.reward
                                        )}
                                    </strong>
                                </span>
                            </div>

                        </section>
                    )}


                    {/* ------------------------------------------------------ */}
                    {/* How It Works                                             */}
                    {/* ------------------------------------------------------ */}

                    <section className="referral-card referral-how-card">

                        <div className="referral-section-header">

                            <div>
                                <span className="referral-section-kicker">
                                    SIMPLE STEPS
                                </span>

                                <h2>
                                    How it works
                                </h2>
                            </div>

                        </div>


                        <div className="referral-steps">

                            {steps.map(
                                (step, index) => (
                                    <div
                                        className="referral-step"
                                        key={step.id}
                                    >

                                        <div className="referral-step-number">
                                            {step.id}
                                        </div>

                                        <div className="referral-step-content">

                                            <h4>
                                                {
                                                    step.title
                                                }
                                            </h4>

                                            <p>
                                                {
                                                    step.description
                                                }
                                            </p>

                                        </div>

                                        {index <
                                            steps.length -
                                            1 && (
                                                <div className="referral-step-line" />
                                            )}

                                    </div>
                                )
                            )}

                        </div>

                    </section>


                    {/* ------------------------------------------------------ */}
                    {/* Quick Share                                             */}
                    {/* ------------------------------------------------------ */}

                    <section className="referral-share-card">

                        <div className="referral-share-card-icon">
                            <Share2 size={20} />
                        </div>

                        <div>
                            <strong>
                                Ready to share?
                            </strong>

                            <p>
                                Invite someone and start
                                growing your rewards.
                            </p>
                        </div>

                        <motion.button
                            type="button"
                            onClick={handleShare}
                            disabled={sharing}
                            aria-label="Share referral link"
                            whileTap={{ scale: 0.9 }}
                        >
                            <ArrowRight size={18} />
                        </motion.button>

                    </section>

                </aside>

            </div>

        </div>
    );
}