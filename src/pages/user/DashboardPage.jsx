import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Link,
} from "react-router-dom";

import {
    ArrowUpRight,
    ArrowRight,
    Activity,
    Brain,
    CheckCircle2,
    ChevronRight,
    Coins,
    ListTodo,
    MessageSquareText,
    Users,
    Wallet,
    Trophy,
    Clock3,
    CircleDollarSign,
} from "lucide-react";

import {
    getCurrentUser,
} from "../../services/mock/authService";

import {
    getDashboardData,
} from "../../services/mock/dashboardService";

import Loader from "../../components/common/Loader";

import "./dashboard.css";

const activityIcons = {
    trivia: Brain,
    task: ListTodo,
    survey: MessageSquareText,
    referral: Users,
    withdrawal: Wallet,
};

const earningIcons = {
    survey: MessageSquareText,
    task: ListTodo,
    trivia: Brain,
    offer: CircleDollarSign,
};

function formatAmount(
    amount,
    currency = "SAK"
) {
    return `${Number(amount).toLocaleString(
        "en-US",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }
    )} ${currency}`;
}

function DashboardPage() {
    const [data, setData] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const user = useMemo(
        () => getCurrentUser(),
        []
    );

    useEffect(() => {
        let mounted = true;

        async function loadDashboard() {
            try {
                setLoading(true);

                const result =
                    await getDashboardData();

                if (mounted) {
                    setData(result);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        loadDashboard();

        return () => {
            mounted = false;
        };
    }, []);

    if (loading || !data) {
        return (
            <div className="dashboard-loading">
                <Loader
                    size="lg"
                    label="Loading your dashboard..."
                />
            </div>
        );
    }

    const {
        summary,
        activity,
        chart,
        earningAreas,
    } = data;

    const firstName =
        user?.firstName ||
        user?.displayName?.split(
            " "
        )[0] ||
        "there";

    const chartMaximum = Math.max(
        ...chart.map(
            (item) => item.earnings
        )
    );

    return (
        <div className="dashboard-page">
            {/* =================================================
                WELCOME
               ================================================= */}

            <section className="dashboard-welcome">
                <div>
                    <span className="dashboard-eyebrow">
                        YOUR OVERVIEW
                    </span>

                    <h1>
                        Good evening,{" "}
                        <span>
                            {firstName}
                        </span>
                    </h1>

                    <p>
                        Here's a quick look at
                        your rewards and activity.
                    </p>
                </div>

                <Link
                    to="/earn"
                    className="dashboard-primary-action"
                >
                    Start earning

                    <ArrowRight
                        size={17}
                    />
                </Link>
            </section>

            {/* =================================================
                WALLET OVERVIEW
               ================================================= */}

            <section className="dashboard-balance-grid">
                <article className="dashboard-balance-card dashboard-balance-primary">
                    <div className="balance-card-top">
                        <div>
                            <span>
                                Available balance
                            </span>

                            <h2>
                                {formatAmount(
                                    summary.wallet.balance,
                                    summary.wallet.currency
                                )}
                            </h2>
                        </div>

                        <div className="balance-card-icon">
                            <Wallet
                                size={21}
                            />
                        </div>
                    </div>

                    <div className="balance-card-bottom">
                        <span>
                            Ready to withdraw
                        </span>

                        <Link
                            to="/wallet/withdraw"
                        >
                            Withdraw

                            <ArrowUpRight
                                size={15}
                            />
                        </Link>
                    </div>
                </article>

                <article className="dashboard-stat-card">
                    <div className="dashboard-stat-icon pending">
                        <Clock3
                            size={19}
                        />
                    </div>

                    <div>
                        <span>
                            Pending rewards
                        </span>

                        <strong>
                            {formatAmount(
                                summary.wallet.pending,
                                summary.wallet.currency
                            )}
                        </strong>

                        <small>
                            Currently processing
                        </small>
                    </div>
                </article>

                <article className="dashboard-stat-card">
                    <div className="dashboard-stat-icon earned">
                        <Coins
                            size={19}
                        />
                    </div>

                    <div>
                        <span>
                            Total earned
                        </span>

                        <strong>
                            {formatAmount(
                                summary.wallet.totalEarned,
                                summary.wallet.currency
                            )}
                        </strong>

                        <small>
                            Since joining
                        </small>
                    </div>
                </article>
            </section>

            {/* =================================================
                QUICK EARNING OPTIONS
               ================================================= */}

            <section className="dashboard-section">
                <div className="dashboard-section-heading">
                    <div>
                        <span>
                            EARN
                        </span>

                        <h2>
                            Ways to earn
                        </h2>
                    </div>

                    <Link
                        to="/earn"
                        className="dashboard-view-link"
                    >
                        View all

                        <ChevronRight
                            size={15}
                        />
                    </Link>
                </div>

                <div className="earning-options-grid">
                    {earningAreas.map(
                        (item) => {
                            const Icon =
                                earningIcons[
                                item.type
                                ] ||
                                Coins;

                            return (
                                <Link
                                    key={
                                        item.id
                                    }
                                    to={
                                        item.path
                                    }
                                    className="earning-option-card"
                                >
                                    <div className={`earning-option-icon earning-option-icon-${item.type}`}>
                                        <Icon
                                            size={
                                                20
                                            }
                                        />
                                    </div>

                                    <div className="earning-option-copy">
                                        <strong>
                                            {
                                                item.title
                                            }
                                        </strong>

                                        <span>
                                            {
                                                item.description
                                            }
                                        </span>
                                    </div>

                                    <ArrowRight
                                        size={16}
                                        className="earning-option-arrow"
                                    />
                                </Link>
                            );
                        }
                    )}
                </div>
            </section>

            {/* =================================================
                MAIN DASHBOARD GRID
               ================================================= */}

            <section className="dashboard-main-grid">
                {/* ---------------------------------------------
                    Earnings chart
                   --------------------------------------------- */}

                <article className="dashboard-panel earnings-panel">
                    <div className="dashboard-panel-heading">
                        <div>
                            <span>
                                PERFORMANCE
                            </span>

                            <h2>
                                Earnings overview
                            </h2>
                        </div>

                        <span className="panel-period">
                            This week
                        </span>
                    </div>

                    <div className="earnings-summary">
                        <strong>
                            {formatAmount(
                                activity.thisWeek,
                                summary.wallet.currency
                            )}
                        </strong>

                        <span>
                            <ArrowUpRight
                                size={13}
                            />

                            Weekly earnings
                        </span>
                    </div>

                    <div className="earnings-chart">
                        {chart.map(
                            (item) => {
                                const height =
                                    Math.max(
                                        10,
                                        (item.earnings /
                                            chartMaximum) *
                                        100
                                    );

                                return (
                                    <div
                                        key={
                                            item.day
                                        }
                                        className="chart-column"
                                    >
                                        <div className="chart-value">
                                            {item.earnings}
                                        </div>

                                        <div className="chart-bar-track">
                                            <div
                                                className="chart-bar"
                                                style={{
                                                    height: `${height}%`,
                                                }}
                                            />
                                        </div>

                                        <span>
                                            {
                                                item.day
                                            }
                                        </span>
                                    </div>
                                );
                            }
                        )}
                    </div>
                </article>

                {/* ---------------------------------------------
                    Progress
                   --------------------------------------------- */}

                <article className="dashboard-panel progress-panel">
                    <div className="dashboard-panel-heading">
                        <div>
                            <span>
                                ACTIVITY
                            </span>

                            <h2>
                                Your progress
                            </h2>
                        </div>
                    </div>

                    <div className="progress-items">
                        <div className="progress-item">
                            <div className="progress-item-icon">
                                <Brain
                                    size={18}
                                />
                            </div>

                            <div className="progress-item-content">
                                <div>
                                    <strong>
                                        Trivia today
                                    </strong>

                                    <span>
                                        {
                                            summary
                                                .trivia
                                                .questionsAnsweredToday
                                        }
                                        /
                                        {
                                            summary
                                                .trivia
                                                .dailyLimit
                                        }
                                    </span>
                                </div>

                                <div className="progress-track">
                                    <div
                                        className="progress-fill"
                                        style={{
                                            width: `${(summary
                                                .trivia
                                                .questionsAnsweredToday /
                                                summary
                                                    .trivia
                                                    .dailyLimit) *
                                                100
                                                }%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="progress-item">
                            <div className="progress-item-icon streak">
                                <CheckCircle2
                                    size={18}
                                />
                            </div>

                            <div className="progress-item-content">
                                <div>
                                    <strong>
                                        Trivia streak
                                    </strong>

                                    <span>
                                        {
                                            summary
                                                .trivia
                                                .currentStreak
                                        }{" "}
                                        days
                                    </span>
                                </div>

                                <div className="progress-note">
                                    Keep it going
                                </div>
                            </div>
                        </div>

                        <div className="progress-item">
                            <div className="progress-item-icon rank">
                                <Trophy
                                    size={18}
                                />
                            </div>

                            <div className="progress-item-content">
                                <div>
                                    <strong>
                                        Leaderboard
                                    </strong>

                                    <span>
                                        #
                                        {
                                            summary
                                                .leaderboard
                                                .position
                                        }
                                    </span>
                                </div>

                                <div className="progress-note">
                                    Weekly ranking
                                </div>
                            </div>
                        </div>
                    </div>

                    <Link
                        to="/leaderboard"
                        className="panel-footer-link"
                    >
                        View leaderboard

                        <ArrowRight
                            size={15}
                        />
                    </Link>
                </article>
            </section>

            {/* =================================================
                ACTIVITY + REFERRALS
               ================================================= */}

            <section className="dashboard-bottom-grid">
                <article className="dashboard-panel activity-panel">
                    <div className="dashboard-panel-heading">
                        <div>
                            <span>
                                HISTORY
                            </span>

                            <h2>
                                Recent activity
                            </h2>
                        </div>

                        <Link
                            to="/activity"
                            className="dashboard-view-link"
                        >
                            View all

                            <ChevronRight
                                size={15}
                            />
                        </Link>
                    </div>

                    <div className="activity-list">
                        {activity
                            .slice(0, 4)
                            .map(
                                (item) => {
                                    const Icon =
                                        activityIcons[
                                        item
                                            .type
                                        ] ||
                                        Activity;

                                    const isCredit =
                                        item.direction ===
                                        "credit";

                                    return (
                                        <div
                                            key={
                                                item.id
                                            }
                                            className="activity-row"
                                        >
                                            <div className={`activity-icon activity-icon-${item.type}`}>
                                                <Icon
                                                    size={
                                                        17
                                                    }
                                                />
                                            </div>

                                            <div className="activity-copy">
                                                <strong>
                                                    {
                                                        item.title
                                                    }
                                                </strong>

                                                <span>
                                                    {
                                                        item.description
                                                    }
                                                </span>
                                            </div>

                                            <div className="activity-meta">
                                                <strong
                                                    className={
                                                        isCredit
                                                            ? "credit"
                                                            : "debit"
                                                    }
                                                >
                                                    {isCredit
                                                        ? "+"
                                                        : "-"}
                                                    {
                                                        item.amount
                                                    }{" "}
                                                    {
                                                        item.currency
                                                    }
                                                </strong>

                                                <span>
                                                    {
                                                        item.timestamp
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    );
                                }
                            )}
                    </div>
                </article>

                <article className="dashboard-panel referral-panel">
                    <div className="dashboard-panel-heading">
                        <div>
                            <span>
                                REFERRALS
                            </span>

                            <h2>
                                Invite & earn
                            </h2>
                        </div>
                    </div>

                    {summary.referrals.enabled ? (
                        <>
                            <div className="referral-hero">
                                <div className="referral-icon">
                                    <Users
                                        size={22}
                                    />
                                </div>

                                <div>
                                    <strong>
                                        {
                                            summary
                                                .referrals
                                                .totalReferrals
                                        }
                                    </strong>

                                    <span>
                                        Total referrals
                                    </span>
                                </div>
                            </div>

                            <div className="referral-stats">
                                <div>
                                    <span>
                                        Active
                                    </span>

                                    <strong>
                                        {
                                            summary
                                                .referrals
                                                .activeReferrals
                                        }
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Earned
                                    </span>

                                    <strong>
                                        {formatAmount(
                                            summary
                                                .referrals
                                                .earned
                                        )}
                                    </strong>
                                </div>
                            </div>

                            <Link
                                to="/referrals"
                                className="referral-button"
                            >
                                Manage referrals

                                <ArrowRight
                                    size={15}
                                />
                            </Link>
                        </>
                    ) : (
                        <div className="feature-disabled">
                            <Users
                                size={22}
                            />

                            <strong>
                                Referrals are
                                currently
                                unavailable.
                            </strong>

                            <span>
                                Check back later for
                                updates.
                            </span>
                        </div>
                    )}
                </article>
            </section>
        </div>
    );
}

export default DashboardPage;