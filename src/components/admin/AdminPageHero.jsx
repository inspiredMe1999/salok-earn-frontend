import { Link } from "react-router-dom";

import "./AdminPageHero.css";

/*
|--------------------------------------------------------------------------
| Admin Page Hero
|--------------------------------------------------------------------------
|
| The one intro section every admin page should open with. Before this
| existed, each page built its own — different classNames, different
| spacing, different fonts, a breadcrumb here but not there. This
| component is the fix: every page passes it content, not markup, so
| every page's hero is structurally identical and only the content
| changes.
|
| Three things it can show, stacked in this order:
|
| 1. Identity row — icon, eyebrow, title, description, and a trailing
|    `actions` slot for page-specific controls (buttons, selects,
|    a refresh icon, a "mock data" pill...). Always shown.
|
| 2. Metric — one dominant, feature-worthy number (platform earnings,
|    pending payout total...) with a change badge and an optional
|    sparkline. Pass `metric` only on the handful of pages that have
|    a single figure worth featuring; omit it everywhere else.
|
| 3. Stat rail — a row of smaller supporting figures underneath, each
|    optionally clickable to act as a filter (see AdminUsersPage).
|    Pass `stats` as an array; omit it if a page has none.
|
| Usage:
|
|   <AdminPageHero
|       icon={LayoutDashboard}
|       eyebrow="Control center"
|       title="Overview"
|       description="Monitor platform activity, users, earnings and
|           account operations."
|       actions={<button className="admin-hero-button">Refresh</button>}
|       metric={{
|           label: "Total platform earnings",
|           value: "$128,400",
|           period: "Last 30 days",
|           change: { direction: "up", value: "12.4%" },
|           sparkline: [12, 18, 14, 22, 19, 27, 31],
|       }}
|       stats={[
|           { icon: Users, label: "Total users", value: "4,208", tone: "neutral" },
|           { icon: UserCheck, label: "Active", value: "3,940", tone: "success",
|             pressed: true, onClick: () => {} },
|       ]}
|   />
|
|--------------------------------------------------------------------------
*/

function Sparkline({ data }) {
    if (!data || data.length < 2) {
        return null;
    }

    const width = 240;
    const height = 56;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((value, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - ((value - min) / range) * height;

        return [x, y];
    });

    const linePath = points
        .map(([x, y], index) =>
            `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`
        )
        .join(" ");

    const areaPath =
        `${linePath} L${width},${height} L0,${height} Z`;

    return (
        <svg
            className="admin-hero-sparkline"
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            aria-hidden="true"
        >
            <defs>
                <linearGradient
                    id="adminHeroSparklineFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                >
                    <stop
                        offset="0%"
                        stopColor="var(--gold-400)"
                        stopOpacity="0.35"
                    />
                    <stop
                        offset="100%"
                        stopColor="var(--gold-400)"
                        stopOpacity="0"
                    />
                </linearGradient>
            </defs>

            <path
                d={areaPath}
                fill="url(#adminHeroSparklineFill)"
                stroke="none"
            />

            <path
                d={linePath}
                fill="none"
                stroke="var(--gold-400)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function HeroStat({
    icon: Icon,
    label,
    value,
    meta,
    tone = "neutral",
    pressed,
    onClick,
    loading,
}) {
    const content = (
        <>
            <span
                className="admin-hero-stat-icon"
                data-tone={tone}
                aria-hidden="true"
            >
                {Icon && <Icon size={17} />}
            </span>

            <span className="admin-hero-stat-body">
                <span className="admin-hero-stat-label">
                    {label}
                </span>

                <strong className="admin-hero-stat-value">
                    {loading ? (
                        <span className="admin-hero-shimmer" />
                    ) : (
                        value ?? "—"
                    )}
                </strong>

                {meta && !loading && (
                    <span className="admin-hero-stat-meta">
                        {meta}
                    </span>
                )}
            </span>
        </>
    );

    if (onClick) {
        return (
            <button
                type="button"
                className="admin-hero-stat is-interactive"
                onClick={onClick}
                aria-pressed={Boolean(pressed)}
            >
                {content}
            </button>
        );
    }

    return (
        <div className="admin-hero-stat">
            {content}
        </div>
    );
}

function AdminPageHero({
    icon: Icon,
    eyebrow,
    title,
    description,
    breadcrumb,
    actions,
    metric,
    stats,
    loading = false,
}) {
    return (
        <section className="admin-page-hero">
            <span
                className="admin-page-hero-glow"
                aria-hidden="true"
            />

            <div className="admin-page-hero-top">
                <div className="admin-page-hero-identity">
                    {breadcrumb && breadcrumb.length > 0 && (
                        <nav
                            aria-label="Breadcrumb"
                            className="admin-hero-breadcrumb"
                        >
                            {breadcrumb.map((crumb, index) => {
                                const isLast =
                                    index === breadcrumb.length - 1;

                                return (
                                    <span
                                        key={`${crumb.label}-${index}`}
                                        className="admin-hero-breadcrumb-item"
                                    >
                                        {!isLast && crumb.to ? (
                                            <Link to={crumb.to}>
                                                {crumb.label}
                                            </Link>
                                        ) : (
                                            <span
                                                aria-current={
                                                    isLast
                                                        ? "page"
                                                        : undefined
                                                }
                                            >
                                                {crumb.label}
                                            </span>
                                        )}

                                        {!isLast && (
                                            <span aria-hidden="true">
                                                /
                                            </span>
                                        )}
                                    </span>
                                );
                            })}
                        </nav>
                    )}

                    <div className="admin-page-hero-heading">
                        {Icon && (
                            <span className="admin-page-hero-icon">
                                <Icon size={20} />
                            </span>
                        )}

                        <div className="admin-page-hero-text">
                            {eyebrow && (
                                <span className="admin-page-hero-eyebrow">
                                    {eyebrow}
                                </span>
                            )}

                            <h1>{title}</h1>

                            {description && (
                                <p>{description}</p>
                            )}
                        </div>
                    </div>
                </div>

                {actions && (
                    <div className="admin-page-hero-actions">
                        {actions}
                    </div>
                )}
            </div>

            {metric && (
                <div className="admin-page-hero-metric">
                    <div className="admin-hero-metric-primary">
                        <div className="admin-hero-metric-head">
                            <span className="admin-hero-metric-label">
                                {metric.label}
                            </span>

                            {metric.period && (
                                <span className="admin-hero-period-pill">
                                    {metric.period}
                                </span>
                            )}
                        </div>

                        {loading ? (
                            <span className="admin-hero-shimmer admin-hero-shimmer-value" />
                        ) : (
                            <strong className="admin-hero-metric-value">
                                {metric.value}
                            </strong>
                        )}

                        {(metric.change || metric.note) && !loading && (
                            <div className="admin-hero-metric-meta">
                                {metric.change && (
                                    <span
                                        className={`admin-hero-change ${metric.change.direction === "down"
                                                ? "is-down"
                                                : "is-up"
                                            }`}
                                    >
                                        {metric.change.direction === "down"
                                            ? "▼"
                                            : "▲"}
                                        {" "}
                                        {metric.change.value}
                                    </span>
                                )}

                                {metric.note && (
                                    <span className="admin-hero-metric-note">
                                        {metric.note}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {metric.sparkline && !loading && (
                        <Sparkline data={metric.sparkline} />
                    )}
                </div>
            )}

            {stats && stats.length > 0 && (
                <div
                    className="admin-page-hero-stats"
                    role="group"
                    aria-label="Key figures"
                >
                    {stats.map((stat, index) => (
                        <HeroStat
                            key={`${stat.label}-${index}`}
                            {...stat}
                            loading={loading}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

export default AdminPageHero;
