// src/pages/admin/AdminDashboardPage.jsx

import { useEffect, useState } from "react";
import {
    Activity,
    ArrowDownLeft,
    ArrowUpRight,
    BarChart3,
    CheckCircle2,
    ChevronRight,
    Clock3,
    DollarSign,
    Flag,
    ShieldAlert,
    Users,
    UserPlus,
    Wallet,
} from "lucide-react";

import { Link } from "react-router-dom";

import adminService from "../../services/mock/adminService";

import "./admin.css";

function formatNumber(value) {
    return new Intl.NumberFormat("en-US").format(
        value
    );
}

function formatSAK(value) {
    return `${Number(value).toLocaleString(
        "en-US",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }
    )} SAK`;
}

function formatDate(dateValue) {
    return new Date(dateValue).toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric",
        }
    );
}

function getStatusClass(status) {
    return `admin-status admin-status-${status}`;
}

function getActivityIcon(type) {
    if (type === "withdrawal") {
        return <Wallet size={17} />;
    }

    if (type === "security") {
        return <ShieldAlert size={17} />;
    }

    if (type === "task") {
        return <BarChart3 size={17} />;
    }

    return <UserPlus size={17} />;
}

function AdminDashboardPage() {
    const [pageData, setPageData] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadAdminDashboard();
    }, []);

    async function loadAdminDashboard() {
        try {
            setLoading(true);
            setError("");

            const response =
                await adminService.getAdminPageData();

            if (!response?.success) {
                throw new Error(
                    response?.message ||
                        "Unable to load admin dashboard."
                );
            }

            setPageData(response.data);
        } catch (err) {
            console.error(
                "Failed to load admin dashboard:",
                err
            );

            setError(
                err?.message ||
                    "We couldn't load the admin dashboard."
            );
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="admin-page">
                <div className="admin-loading">
                    <div className="admin-spinner" />

                    <p>
                        Loading admin dashboard...
                    </p>
                </div>
            </div>
        );
    }

    if (error || !pageData) {
        return (
            <div className="admin-page">
                <div className="admin-error">
                    <ShieldAlert size={30} />

                    <h2>
                        Unable to load dashboard
                    </h2>

                    <p>
                        {error ||
                            "Something went wrong."}
                    </p>

                    <button
                        type="button"
                        className="admin-primary-button"
                        onClick={loadAdminDashboard}
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    const {
        overview,
        trendData,
        recentUsers,
        recentActivities,
        quickActions,
    } = pageData;

    return (
        <div className="admin-page">
            {/* Header */}

            <header className="admin-header">
                <div>
                    <div className="admin-eyebrow">
                        <ShieldAlert size={15} />

                        Administration
                    </div>

                    <h1>
                        Admin overview
                    </h1>

                    <p>
                        Monitor platform activity,
                        users, earnings and account
                        operations.
                    </p>
                </div>

                <div className="admin-header-status">
                    <span className="admin-live-dot" />

                    Mock environment
                </div>
            </header>

            {/* Summary cards */}

            <section className="admin-summary-grid">
                <AdminStatCard
                    icon={<Users size={20} />}
                    label="Total users"
                    value={formatNumber(
                        overview.totalUsers
                    )}
                    detail={`+${overview.newUsersToday} new today`}
                    trend="positive"
                />

                <AdminStatCard
                    icon={<UserPlus size={20} />}
                    label="Active users"
                    value={formatNumber(
                        overview.activeUsers
                    )}
                    detail={`${overview.suspendedUsers} suspended accounts`}
                    trend="positive"
                />

                <AdminStatCard
                    icon={<DollarSign size={20} />}
                    label="Total earnings"
                    value={formatSAK(
                        overview.totalEarnings
                    )}
                    detail="Across all earning activities"
                    trend="neutral"
                />

                <AdminStatCard
                    icon={<Wallet size={20} />}
                    label="Pending withdrawals"
                    value={formatNumber(
                        overview.pendingWithdrawals
                    )}
                    detail={formatSAK(
                        overview.pendingWithdrawalAmount
                    )}
                    trend="warning"
                />
            </section>

            {/* Main content */}

            <div className="admin-main-grid">
                <section className="admin-panel admin-trend-panel">
                    <div className="admin-panel-header">
                        <div>
                            <h2>
                                Platform activity
                            </h2>

                            <p>
                                Illustrative activity
                                for the past seven days.
                            </p>
                        </div>

                        <div className="admin-panel-icon">
                            <BarChart3 size={19} />
                        </div>
                    </div>

                    <div className="admin-chart">
                        {trendData.map((item) => (
                            <div
                                className="admin-chart-column"
                                key={item.day}
                            >
                                <div className="admin-chart-value">
                                    {item.users}
                                </div>

                                <div className="admin-chart-track">
                                    <div
                                        className="admin-chart-bar"
                                        style={{
                                            height: `${
                                                (item.users /
                                                    320) *
                                                100
                                            }%`,
                                        }}
                                    />
                                </div>

                                <span>
                                    {item.day}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="admin-chart-footer">
                        <div>
                            <span className="admin-legend-dot" />

                            New registrations
                        </div>

                        <span>
                            Mock weekly data
                        </span>
                    </div>
                </section>

                <section className="admin-panel">
                    <div className="admin-panel-header">
                        <div>
                            <h2>
                                Quick actions
                            </h2>

                            <p>
                                Common administration
                                tasks.
                            </p>
                        </div>

                        <Activity size={19} />
                    </div>

                    <div className="admin-quick-actions">
                        {quickActions.map(
                            (action) => (
                                <Link
                                    to={action.path}
                                    className="admin-quick-action"
                                    key={action.id}
                                >
                                    <div>
                                        <strong>
                                            {
                                                action.title
                                            }
                                        </strong>

                                        <span>
                                            {
                                                action.description
                                            }
                                        </span>
                                    </div>

                                    <ChevronRight
                                        size={17}
                                    />
                                </Link>
                            )
                        )}
                    </div>
                </section>
            </div>

            {/* Secondary statistics */}

            <section className="admin-secondary-grid">
                <AdminMiniStat
                    icon={<ArrowDownLeft size={18} />}
                    label="Total withdrawn"
                    value={formatSAK(
                        overview.totalWithdrawals
                    )}
                />

                <AdminMiniStat
                    icon={<Flag size={18} />}
                    label="Flagged accounts"
                    value={formatNumber(
                        overview.flaggedAccounts
                    )}
                />

                <AdminMiniStat
                    icon={<Activity size={18} />}
                    label="Active devices"
                    value={formatNumber(
                        overview.activeDevices
                    )}
                />

                <AdminMiniStat
                    icon={<ShieldAlert size={18} />}
                    label="Open reports"
                    value={formatNumber(
                        overview.openReports
                    )}
                />
            </section>

            {/* Recent users and activity */}

            <div className="admin-bottom-grid">
                <section className="admin-panel">
                    <div className="admin-panel-header">
                        <div>
                            <h2>
                                Recent users
                            </h2>

                            <p>
                                Latest accounts in the
                                platform.
                            </p>
                        </div>

                        <Link
                            to="/admin/users"
                            className="admin-panel-link"
                        >
                            View all
                            <ChevronRight size={15} />
                        </Link>
                    </div>

                    <div className="admin-users-list">
                        {recentUsers.map((user) => (
                            <div
                                className="admin-user-row"
                                key={user.uid}
                            >
                                <div className="admin-user-avatar">
                                    {user.username
                                        .slice(0, 2)
                                        .toUpperCase()}
                                </div>

                                <div className="admin-user-info">
                                    <strong>
                                        {
                                            user.username
                                        }
                                    </strong>

                                    <span>
                                        {user.email}
                                    </span>

                                    <small>
                                        {user.region} ·{" "}
                                        {formatDate(
                                            user.joinedAt
                                        )}
                                    </small>
                                </div>

                                <div className="admin-user-meta">
                                    <span
                                        className={getStatusClass(
                                            user.status
                                        )}
                                    >
                                        {user.status}
                                    </span>

                                    <strong>
                                        {formatSAK(
                                            user.earnings
                                        )}
                                    </strong>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="admin-panel">
                    <div className="admin-panel-header">
                        <div>
                            <h2>
                                Recent activity
                            </h2>

                            <p>
                                Latest administration
                                events.
                            </p>
                        </div>

                        <Link
                            to="/admin/audit"
                            className="admin-panel-link"
                        >
                            Audit logs
                            <ChevronRight size={15} />
                        </Link>
                    </div>

                    <div className="admin-activity-list">
                        {recentActivities.map(
                            (activity) => (
                                <div
                                    className="admin-activity-row"
                                    key={activity.id}
                                >
                                    <div
                                        className={`admin-activity-icon admin-activity-${activity.status}`}
                                    >
                                        {getActivityIcon(
                                            activity.type
                                        )}
                                    </div>

                                    <div className="admin-activity-content">
                                        <strong>
                                            {
                                                activity.title
                                            }
                                        </strong>

                                        <span>
                                            {
                                                activity.description
                                            }
                                        </span>

                                        <small>
                                            {
                                                activity.time
                                            }
                                        </small>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

function AdminStatCard({
    icon,
    label,
    value,
    detail,
    trend,
}) {
    return (
        <div className="admin-stat-card">
            <div className="admin-stat-top">
                <div className="admin-stat-icon">
                    {icon}
                </div>

                {trend === "positive" && (
                    <span className="admin-stat-trend positive">
                        <ArrowUpRight size={14} />
                    </span>
                )}

                {trend === "warning" && (
                    <span className="admin-stat-trend warning">
                        <Clock3 size={14} />
                    </span>
                )}
            </div>

            <span className="admin-stat-label">
                {label}
            </span>

            <strong className="admin-stat-value">
                {value}
            </strong>

            <span className="admin-stat-detail">
                {detail}
            </span>
        </div>
    );
}

function AdminMiniStat({
    icon,
    label,
    value,
}) {
    return (
        <div className="admin-mini-stat">
            <div className="admin-mini-icon">
                {icon}
            </div>

            <div>
                <span>{label}</span>

                <strong>{value}</strong>
            </div>
        </div>
    );
}

export default AdminDashboardPage;