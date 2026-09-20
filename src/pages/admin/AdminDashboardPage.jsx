// src/pages/admin/AdminDashboardPage.jsx

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Activity,
    AlertTriangle,
    ArrowDownLeft,
    ArrowUpRight,
    BarChart3,
    ChevronRight,
    DollarSign,
    Flag,
    RefreshCw,
    ScrollText,
    ShieldAlert,
    UserPlus,
    Users,
    Wallet,
} from "lucide-react";

import { Link } from "react-router-dom";

import adminService from "../../services/mock/adminService";

import "./admin.css";

/* =========================================================
   FORMATTERS
   ========================================================= */

function formatNumber(value) {
    return new Intl.NumberFormat("en-US").format(Number(value) || 0);
}

function formatSAK(value) {
    return `${Number(value || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })} SAK`;
}

function formatCompact(value) {
    return new Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 1,
    }).format(Number(value) || 0);
}

function formatDate(dateValue) {
    return new Date(dateValue).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function formatTime(dateValue) {
    return dateValue.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

/* =========================================================
   CONFIG + HELPERS
   ========================================================= */

const RANGE_OPTIONS = [
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 90 days" },
];

/*
   The chart only offers metrics that actually exist on the
   trendData items. Today the mock provides `users`; add
   `earnings` and/or `withdrawals` to each item and the tabs
   appear automatically.
*/
const TREND_METRICS = [
    { key: "users", label: "Registrations", format: formatNumber },
    { key: "earnings", label: "Earnings", format: formatSAK },
    { key: "withdrawals", label: "Withdrawals", format: formatSAK },
];

const AVATAR_TONES = ["gold", "teal", "slate", "brown"];

function getAvatarTone(seed = "") {
    let hash = 0;

    for (let i = 0; i < seed.length; i += 1) {
        hash = (hash * 31 + seed.charCodeAt(i)) % 997;
    }

    return AVATAR_TONES[hash % AVATAR_TONES.length];
}

function getStatusClass(status) {
    return `admin-status admin-status-${status}`;
}

function getActivityCategory(type) {
    if (type === "withdrawal" || type === "security" || type === "task") {
        return type;
    }

    return "user";
}

const CATEGORY_LABELS = {
    user: "Users",
    withdrawal: "Finance",
    security: "Security",
    task: "Tasks",
};

function getActivityIcon(type) {
    const category = getActivityCategory(type);

    if (category === "withdrawal") return <Wallet size={15} />;
    if (category === "security") return <ShieldAlert size={15} />;
    if (category === "task") return <BarChart3 size={15} />;

    return <UserPlus size={15} />;
}

function getActionMeta(action) {
    const key = `${action.id} ${action.path}`.toLowerCase();

    if (key.includes("user")) {
        return { icon: <Users size={18} />, tone: "teal" };
    }

    if (key.includes("withdraw") || key.includes("payout")) {
        return { icon: <Wallet size={18} />, tone: "gold" };
    }

    if (
        key.includes("secur") ||
        key.includes("report") ||
        key.includes("flag")
    ) {
        return { icon: <ShieldAlert size={18} />, tone: "red" };
    }

    if (key.includes("audit") || key.includes("log")) {
        return { icon: <ScrollText size={18} />, tone: "blue" };
    }

    return { icon: <Activity size={18} />, tone: "gold" };
}

function niceMax(value) {
    if (value <= 0) return 1;

    const magnitude = 10 ** Math.floor(Math.log10(value));
    const normalized = value / magnitude;
    const steps = [1, 2, 2.5, 5, 10];
    const step = steps.find((s) => normalized <= s) || 10;

    return step * magnitude;
}

/* =========================================================
   PAGE
   ========================================================= */

function AdminDashboardPage() {
    const [pageData, setPageData] = useState(null);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const [range, setRange] = useState("7d");
    const [lastUpdated, setLastUpdated] = useState(null);

    const loadAdminDashboard = useCallback(
        async ({ silent = false } = {}) => {
            try {
                if (silent) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                setError("");

                // `range` is passed through so a real backend can honour it.
                const response = await adminService.getAdminPageData({
                    range,
                });

                if (!response?.success) {
                    throw new Error(
                        response?.message || "Unable to load admin dashboard."
                    );
                }

                setPageData(response.data);
                setLastUpdated(new Date());
            } catch (err) {
                console.error("Failed to load admin dashboard:", err);

                setError(
                    err?.message || "We couldn't load the admin dashboard."
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [range]
    );

    useEffect(() => {
        loadAdminDashboard({ silent: Boolean(pageData) });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadAdminDashboard]);

    if (loading) {
        return <DashboardSkeleton />;
    }

    if (error || !pageData) {
        return (
            <div className="admin-page">
                <div className="admin-error" role="alert">
                    <ShieldAlert size={30} />

                    <h2>Unable to load dashboard</h2>

                    <p>{error || "Something went wrong."}</p>

                    <button
                        type="button"
                        className="admin-primary-button"
                        onClick={() => loadAdminDashboard()}
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    const {
        overview,
        trendData = [],
        recentUsers = [],
        recentActivities = [],
        quickActions = [],
    } = pageData;

    const rangeLabel =
        RANGE_OPTIONS.find((option) => option.value === range)?.label ||
        "Last 7 days";

    const earningsChange =
        typeof overview.earningsChange === "number"
            ? overview.earningsChange
            : null;

    const earningsSeries = trendData
        .map((item) => item.earnings)
        .filter((value) => typeof value === "number");

    return (
        <div className="admin-page">
            {/* Header */}

            <header className="admin-header">
                <div className="admin-header-copy">
                    <h1>Admin overview</h1>

                    <p>
                        Monitor platform activity, users, earnings and account
                        operations.
                    </p>
                </div>

                <div className="admin-header-controls">
                    {lastUpdated && (
                        <span className="admin-updated">
                            Updated {formatTime(lastUpdated)}
                        </span>
                    )}

                    <label className="admin-select">
                        <span className="admin-sr-only">Date range</span>

                        <select
                            value={range}
                            onChange={(event) => setRange(event.target.value)}
                        >
                            {RANGE_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </label>

                    <button
                        type="button"
                        className={`admin-icon-button${
                            refreshing ? " is-spinning" : ""
                        }`}
                        onClick={() => loadAdminDashboard({ silent: true })}
                        disabled={refreshing}
                        aria-label="Refresh dashboard"
                        title="Refresh dashboard"
                    >
                        <RefreshCw size={16} />
                    </button>
                </div>
            </header>

            {/* Hero */}

            <section className="admin-hero" aria-label="Platform earnings">
                <div className="admin-hero-glow" aria-hidden="true" />

                <div className="admin-hero-top">
                    <div className="admin-hero-primary">
                        <div className="admin-hero-head">
                            <span className="admin-hero-icon">
                                <DollarSign size={18} />
                            </span>

                            <span className="admin-hero-label">
                                Total platform earnings
                            </span>

                            <span className="admin-period-pill">
                                {rangeLabel}
                            </span>
                        </div>

                        <strong className="admin-hero-value">
                            {formatSAK(overview.totalEarnings)}
                        </strong>

                        <div className="admin-hero-meta">
                            {earningsChange !== null && (
                                <span
                                    className={`admin-change ${
                                        earningsChange >= 0 ? "up" : "down"
                                    }`}
                                >
                                    <ArrowUpRight size={13} />
                                    {Math.abs(earningsChange).toFixed(1)}%
                                </span>
                            )}

                            <span className="admin-hero-detail">
                                {earningsChange !== null
                                    ? "vs previous period, across all earning activities"
                                    : "Across all earning activities on the platform"}
                            </span>
                        </div>
                    </div>

                    {earningsSeries.length > 1 && (
                        <Sparkline values={earningsSeries} />
                    )}
                </div>

                <div className="admin-hero-stats">
                    <HeroStat
                        icon={<Users size={16} />}
                        label="Total users"
                        value={formatNumber(overview.totalUsers)}
                        note={`+${formatNumber(overview.newUsersToday)} today`}
                        tone="positive"
                    />

                    <HeroStat
                        icon={<UserPlus size={16} />}
                        label="Active users"
                        value={formatNumber(overview.activeUsers)}
                        note={`${formatNumber(overview.suspendedUsers)} suspended`}
                    />

                    <HeroStat
                        icon={<Wallet size={16} />}
                        label="Pending withdrawals"
                        value={formatNumber(overview.pendingWithdrawals)}
                        note={formatSAK(overview.pendingWithdrawalAmount)}
                        tone="warning"
                    />
                </div>
            </section>

            {/* Main content */}

            <div className="admin-main-grid">
                <TrendPanel trendData={trendData} rangeLabel={rangeLabel} />

                <div className="admin-side-stack">
                    <AttentionPanel overview={overview} />

                    <section className="admin-panel">
                        <div className="admin-panel-header">
                            <div>
                                <h2>Quick actions</h2>
                                <p>Common administration tasks.</p>
                            </div>
                        </div>

                        <div className="admin-quick-actions">
                            {quickActions.map((action) => {
                                const meta = getActionMeta(action);

                                return (
                                    <Link
                                        to={action.path}
                                        className="admin-quick-action"
                                        key={action.id}
                                    >
                                        <span
                                            className={`admin-quick-icon tone-${meta.tone}`}
                                        >
                                            {meta.icon}
                                        </span>

                                        <span className="admin-quick-text">
                                            <strong>{action.title}</strong>
                                            <small>{action.description}</small>
                                        </span>

                                        <ChevronRight
                                            size={17}
                                            className="admin-quick-arrow"
                                        />
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                </div>
            </div>

            {/* Ledger strip */}

            <section
                className="admin-ledger"
                aria-label="Additional platform statistics"
            >
                <LedgerItem
                    icon={<ArrowDownLeft size={16} />}
                    label="Total withdrawn"
                    value={formatSAK(overview.totalWithdrawals)}
                />

                <LedgerItem
                    icon={<Flag size={16} />}
                    label="Flagged accounts"
                    value={formatNumber(overview.flaggedAccounts)}
                    tone="danger"
                />

                <LedgerItem
                    icon={<Activity size={16} />}
                    label="Active devices"
                    value={formatNumber(overview.activeDevices)}
                />

                <LedgerItem
                    icon={<ShieldAlert size={16} />}
                    label="Open reports"
                    value={formatNumber(overview.openReports)}
                    tone="warning"
                />
            </section>

            {/* Recent users and activity */}

            <div className="admin-bottom-grid">
                <section className="admin-panel">
                    <div className="admin-panel-header">
                        <div>
                            <h2>Recent users</h2>
                            <p>Latest accounts on the platform.</p>
                        </div>

                        <Link to="/admin/users" className="admin-panel-link">
                            View all
                            <ChevronRight size={15} />
                        </Link>
                    </div>

                    <div className="admin-users-list">
                        {recentUsers.map((user) => (
                            <div className="admin-user-row" key={user.uid}>
                                <div
                                    className={`admin-user-avatar tone-${getAvatarTone(
                                        user.username
                                    )}`}
                                >
                                    {user.username.slice(0, 2).toUpperCase()}
                                </div>

                                <div className="admin-user-info">
                                    <strong>{user.username}</strong>

                                    <span>{user.email}</span>

                                    <small>
                                        {user.region}
                                        <span className="admin-dot-sep" />
                                        {formatDate(user.joinedAt)}
                                    </small>
                                </div>

                                <div className="admin-user-meta">
                                    <strong className="admin-money">
                                        {formatSAK(user.earnings)}
                                    </strong>

                                    <span className={getStatusClass(user.status)}>
                                        <i aria-hidden="true" />
                                        {user.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <ActivityPanel activities={recentActivities} />
            </div>

            {/* Footer */}

            <footer className="admin-footer">
                <span>
                    {lastUpdated
                        ? `Last refreshed at ${formatTime(lastUpdated)}`
                        : "Not refreshed yet"}
                </span>

                <span>{rangeLabel}</span>
            </footer>
        </div>
    );
}

/* =========================================================
   TREND PANEL (dependency-free SVG area chart)
   ========================================================= */

function TrendPanel({ trendData, rangeLabel }) {
    const metrics = useMemo(
        () =>
            TREND_METRICS.filter((metric) =>
                trendData.some((item) => typeof item[metric.key] === "number")
            ),
        [trendData]
    );

    const [metricKey, setMetricKey] = useState(metrics[0]?.key || "users");
    const [activeIndex, setActiveIndex] = useState(null);

    const metric =
        metrics.find((item) => item.key === metricKey) || metrics[0];

    if (!metric || trendData.length === 0) {
        return (
            <section className="admin-panel admin-trend-panel">
                <div className="admin-panel-header">
                    <div>
                        <h2>Platform activity</h2>
                        <p>No activity data for this period.</p>
                    </div>
                </div>
            </section>
        );
    }

    const values = trendData.map((item) => Number(item[metric.key]) || 0);
    const total = values.reduce((sum, value) => sum + value, 0);
    const peak = Math.max(...values, 0);
    const maxValue = niceMax(peak);
    const count = values.length;

    const points = values.map((value, index) => ({
        x: ((index + 0.5) / count) * 100,
        y: 100 - (value / maxValue) * 100,
    }));

    const linePath = points.reduce((path, point, index) => {
        if (index === 0) return `M ${point.x} ${point.y}`;

        const prev = points[index - 1];
        const midX = (prev.x + point.x) / 2;

        return `${path} C ${midX} ${prev.y}, ${midX} ${point.y}, ${point.x} ${point.y}`;
    }, "");

    const areaPath = `${linePath} L ${points[count - 1].x} 100 L ${points[0].x} 100 Z`;

    const ticks = [1, 0.75, 0.5, 0.25, 0].map((ratio) => ({
        ratio,
        label: formatCompact(maxValue * ratio),
    }));

    const active = activeIndex !== null ? trendData[activeIndex] : null;

    return (
        <section className="admin-panel admin-trend-panel">
            <div className="admin-panel-header">
                <div>
                    <h2>Platform activity</h2>
                    <p>{rangeLabel}</p>
                </div>

                {metrics.length > 1 && (
                    <div className="admin-segmented" role="tablist">
                        {metrics.map((item) => (
                            <button
                                key={item.key}
                                type="button"
                                role="tab"
                                aria-selected={item.key === metric.key}
                                className={item.key === metric.key ? "active" : ""}
                                onClick={() => setMetricKey(item.key)}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="admin-trend-summary">
                <div>
                    <span>{metric.label} in period</span>
                    <strong>{metric.format(total)}</strong>
                </div>

                <div>
                    <span>Daily peak</span>
                    <strong>{metric.format(peak)}</strong>
                </div>
            </div>

            <div className="admin-chart2">
                <div className="admin-chart2-yaxis" aria-hidden="true">
                    {ticks.map((tick) => (
                        <span key={tick.ratio}>{tick.label}</span>
                    ))}
                </div>

                <div
                    className="admin-chart2-plot"
                    onMouseLeave={() => setActiveIndex(null)}
                >
                    {ticks.map((tick) => (
                        <div
                            key={tick.ratio}
                            className="admin-chart2-grid"
                            style={{ top: `${(1 - tick.ratio) * 100}%` }}
                            aria-hidden="true"
                        />
                    ))}

                    <svg
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        className="admin-chart2-svg"
                        role="img"
                        aria-label={`${metric.label} over ${rangeLabel.toLowerCase()}`}
                    >
                        <defs>
                            <linearGradient
                                id="adminAreaFill"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="0%"
                                    stopColor="var(--color-primary, #d8a83e)"
                                    stopOpacity="0.32"
                                />
                                <stop
                                    offset="100%"
                                    stopColor="var(--color-primary, #d8a83e)"
                                    stopOpacity="0"
                                />
                            </linearGradient>
                        </defs>

                        <path d={areaPath} fill="url(#adminAreaFill)" />

                        <path
                            d={linePath}
                            fill="none"
                            stroke="var(--color-primary, #d8a83e)"
                            strokeWidth="2"
                            strokeLinecap="round"
                            vectorEffect="non-scaling-stroke"
                        />
                    </svg>

                    {activeIndex !== null && (
                        <div
                            className="admin-chart2-cursor"
                            style={{ left: `${points[activeIndex].x}%` }}
                            aria-hidden="true"
                        />
                    )}

                    {points.map((point, index) => (
                        <span
                            key={trendData[index].day}
                            className={`admin-chart2-dot${
                                activeIndex === index ? " active" : ""
                            }`}
                            style={{
                                left: `${point.x}%`,
                                top: `${point.y}%`,
                            }}
                            aria-hidden="true"
                        />
                    ))}

                    {trendData.map((item, index) => (
                        <button
                            key={item.day}
                            type="button"
                            className="admin-chart2-hit"
                            style={{
                                left: `${(index / count) * 100}%`,
                                width: `${100 / count}%`,
                            }}
                            onMouseEnter={() => setActiveIndex(index)}
                            onFocus={() => setActiveIndex(index)}
                            onBlur={() => setActiveIndex(null)}
                            aria-label={`${item.day}: ${metric.format(values[index])}`}
                        />
                    ))}

                    {active && (
                        <div
                            className={`admin-chart2-tooltip${
                                points[activeIndex].x > 70 ? " flip" : ""
                            }`}
                            style={{
                                left: `${points[activeIndex].x}%`,
                                top: `${points[activeIndex].y}%`,
                            }}
                            role="status"
                        >
                            <span>{active.day}</span>
                            <strong>{metric.format(values[activeIndex])}</strong>
                        </div>
                    )}
                </div>

                <div className="admin-chart2-xaxis" aria-hidden="true">
                    {trendData.map((item) => (
                        <span key={item.day}>{item.day}</span>
                    ))}
                </div>
            </div>

            <div className="admin-chart-footer">
                <div>
                    <span className="admin-legend-dot" />
                    {metric.label}
                </div>

                <span>Hover a point for details</span>
            </div>
        </section>
    );
}

/* =========================================================
   NEEDS ATTENTION (derived only from real overview counts)
   ========================================================= */

function AttentionPanel({ overview }) {
    const items = [
        {
            id: "withdrawals",
            count: overview.pendingWithdrawals,
            text: "pending withdrawals",
            action: "Review",
            to: "/admin/withdrawals",
            tone: "warning",
        },
        {
            id: "flagged",
            count: overview.flaggedAccounts,
            text: "flagged accounts",
            action: "Inspect",
            to: "/admin/users",
            tone: "danger",
        },
        {
            id: "reports",
            count: overview.openReports,
            text: "open security reports",
            action: "Investigate",
            to: "/admin/reports",
            tone: "danger",
        },
    ].filter((item) => Number(item.count) > 0);

    return (
        <section className="admin-panel admin-attention">
            <div className="admin-panel-header">
                <div>
                    <h2>Needs attention</h2>
                    <p>
                        {items.length > 0
                            ? `${items.length} ${
                                  items.length === 1 ? "item" : "items"
                              } waiting for review`
                            : "Nothing is waiting for review."}
                    </p>
                </div>

                {items.length > 0 && (
                    <span className="admin-count-badge">{items.length}</span>
                )}
            </div>

            {items.length > 0 && (
                <ul className="admin-attention-list">
                    {items.map((item) => (
                        <li key={item.id}>
                            <span className={`admin-attention-icon ${item.tone}`}>
                                <AlertTriangle size={15} />
                            </span>

                            <span className="admin-attention-text">
                                <strong>{formatNumber(item.count)}</strong>{" "}
                                {item.text}
                            </span>

                            <Link to={item.to} className="admin-panel-link">
                                {item.action}
                                <ChevronRight size={14} />
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

/* =========================================================
   ACTIVITY TIMELINE
   ========================================================= */

function ActivityPanel({ activities }) {
    const [filter, setFilter] = useState("all");

    const categories = useMemo(() => {
        const present = new Set(
            activities.map((activity) => getActivityCategory(activity.type))
        );

        return ["user", "withdrawal", "security", "task"].filter((key) =>
            present.has(key)
        );
    }, [activities]);

    const visible =
        filter === "all"
            ? activities
            : activities.filter(
                  (activity) => getActivityCategory(activity.type) === filter
              );

    return (
        <section className="admin-panel">
            <div className="admin-panel-header">
                <div>
                    <h2>Recent activity</h2>
                    <p>Latest administration events.</p>
                </div>

                <Link to="/admin/audit" className="admin-panel-link">
                    Audit logs
                    <ChevronRight size={15} />
                </Link>
            </div>

            {categories.length > 1 && (
                <div className="admin-filter-row" role="tablist">
                    {["all", ...categories].map((key) => (
                        <button
                            key={key}
                            type="button"
                            role="tab"
                            aria-selected={filter === key}
                            className={filter === key ? "active" : ""}
                            onClick={() => setFilter(key)}
                        >
                            {key === "all" ? "All" : CATEGORY_LABELS[key]}
                        </button>
                    ))}
                </div>
            )}

            <div className="admin-activity-list">
                {visible.length === 0 && (
                    <p className="admin-empty">No events in this category.</p>
                )}

                {visible.map((activity) => (
                    <div className="admin-activity-row" key={activity.id}>
                        <div
                            className={`admin-activity-icon admin-activity-${activity.status}`}
                        >
                            {getActivityIcon(activity.type)}
                        </div>

                        <div className="admin-activity-content">
                            <div className="admin-activity-top">
                                <strong>{activity.title}</strong>

                                <em>
                                    {
                                        CATEGORY_LABELS[
                                            getActivityCategory(activity.type)
                                        ]
                                    }
                                </em>
                            </div>

                            <span>{activity.description}</span>

                            <small>{activity.time}</small>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

/* =========================================================
   SMALL COMPONENTS
   ========================================================= */

function Sparkline({ values }) {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;

    const points = values.map((value, index) => {
        const x = (index / (values.length - 1)) * 100;
        const y = 90 - ((value - min) / span) * 80;

        return `${x},${y}`;
    });

    return (
        <svg
            className="admin-sparkline"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
        >
            <polyline
                points={points.join(" ")}
                fill="none"
                stroke="var(--color-primary, #d8a83e)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    );
}

function HeroStat({ icon, label, value, note, tone }) {
    return (
        <div className="admin-hero-stat">
            <div className="admin-hero-stat-icon">{icon}</div>

            <div className="admin-hero-stat-body">
                <span>{label}</span>
                <strong>{value}</strong>
                <em className={`admin-hero-stat-note${tone ? ` ${tone}` : ""}`}>
                    {note}
                </em>
            </div>
        </div>
    );
}

function LedgerItem({ icon, label, value, tone }) {
    return (
        <div className="admin-ledger-item">
            <div className={`admin-ledger-icon${tone ? ` ${tone}` : ""}`}>
                {icon}
            </div>

            <div className="admin-ledger-body">
                <span>{label}</span>
                <strong>{value}</strong>
            </div>
        </div>
    );
}

function DashboardSkeleton() {
    return (
        <div
            className="admin-page"
            aria-busy="true"
            aria-label="Loading admin dashboard"
        >
            <div className="admin-skel-block admin-skel-title" />
            <div className="admin-skel-block admin-skel-sub" />

            <div className="admin-skel-block admin-skel-hero" />

            <div className="admin-main-grid">
                <div className="admin-skel-block admin-skel-panel tall" />
                <div className="admin-skel-block admin-skel-panel tall" />
            </div>

            <div className="admin-skel-block admin-skel-ledger" />

            <div className="admin-bottom-grid">
                <div className="admin-skel-block admin-skel-panel" />
                <div className="admin-skel-block admin-skel-panel" />
            </div>
        </div>
    );
}

export default AdminDashboardPage;