import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
    Activity,
    BadgeCheck,
    BarChart3,
    Building2,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Eye,
    Filter,
    Layers3,
    PauseCircle,
    PlayCircle,
    RefreshCw,
    Search,
    Sparkles,
    Star,
    Tag,
    Trash2,
    TrendingUp,
    Users,
    WalletCards,
    X,
} from "lucide-react";

import adminService from "../../services/mock/adminService";
import "./admin-earnings.css";

function formatNumber(value) {
    return new Intl.NumberFormat("en-US").format(value || 0);
}

function formatReward(value, currency = "SAK") {
    return `${formatNumber(value)} ${currency}`;
}

function formatDate(value) {
    if (!value) return "—";

    return new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function formatCategory(value) {
    if (!value) return "—";

    return value
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getCategoryIcon(category) {
    if (category === "surveys") return BarChart3;
    if (category === "tasks") return Layers3;
    return Sparkles;
}

function getCategoryLabel(category) {
    if (category === "surveys") return "Survey";
    if (category === "tasks") return "Task";
    return "Offer";
}

function AdminEarningsPage() {
    const [opportunities, setOpportunities] = useState([]);
    const [summary, setSummary] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [category, setCategory] = useState("all");
    const [status, setStatus] = useState("all");

    const [selectedOpportunity, setSelectedOpportunity] = useState(null);

    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState("");

    async function loadData() {
        try {
            setLoading(true);
            setError("");

            const [opportunitiesResponse, summaryResponse] =
                await Promise.all([
                    adminService.getAdminEarningOpportunities({
                        searchTerm,
                        category,
                        status,
                    }),
                    adminService.getAdminEarningSummary(),
                ]);

            if (!opportunitiesResponse.success) {
                throw new Error(
                    opportunitiesResponse.message ||
                        "Unable to load earning opportunities."
                );
            }

            if (!summaryResponse.success) {
                throw new Error(
                    summaryResponse.message ||
                        "Unable to load earning summary."
                );
            }

            setOpportunities(
                Array.isArray(opportunitiesResponse.data)
                    ? opportunitiesResponse.data
                    : []
            );

            setSummary(summaryResponse.data);
        } catch (err) {
            console.error(err);
            setError(
                err.message ||
                    "Unable to load earning opportunities."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, [searchTerm, category, status]);

    useEffect(() => {
        if (!selectedOpportunity) return undefined;

        const previousOverflow = document.body.style.overflow;

        function handleKeyDown(event) {
            if (event.key === "Escape") {
                setSelectedOpportunity(null);
            }
        }

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedOpportunity]);

    const visibleStats = useMemo(() => {
        const featuredCount = opportunities.filter(
            (item) => item.featured
        ).length;

        const averageReward = opportunities.length
            ? Math.round(
                  opportunities.reduce(
                      (total, item) =>
                          total + Number(item.reward || 0),
                      0
                  ) / opportunities.length
              )
            : 0;

        const averageCompletionTime = opportunities.length
            ? Math.round(
                  opportunities.reduce(
                      (total, item) =>
                          total +
                          Number(item.estimatedMinutes || 0),
                      0
                  ) / opportunities.length
              )
            : 0;

        const categoryCounts = opportunities.reduce(
            (counts, item) => {
                counts[item.category] =
                    (counts[item.category] || 0) + 1;
                return counts;
            },
            {}
        );

        return {
            activeRate: summary?.totalOpportunities
                ? Math.round(
                      (summary.activeOpportunities /
                          summary.totalOpportunities) *
                          100
                  )
                : 0,
            featuredCount,
            averageReward,
            averageCompletionTime,
            categoryCounts,
        };
    }, [opportunities, summary]);

    async function toggleOpportunity(opportunity) {
        try {
            setProcessing(true);

            const response =
                await adminService.toggleAdminEarningOpportunity(
                    opportunity.id
                );

            if (!response.success) {
                throw new Error(
                    response.message ||
                        "Unable to update opportunity."
                );
            }

            toast.success(response.message);
            setSelectedOpportunity(null);
            await loadData();
        } catch (err) {
            toast.error(
                err.message || "Unable to update opportunity."
            );
        } finally {
            setProcessing(false);
        }
    }

    async function removeOpportunity(opportunity) {
        const confirmed = window.confirm(
            `Remove "${opportunity.title}" from the mock catalogue?`
        );

        if (!confirmed) return;

        try {
            setProcessing(true);

            const response =
                await adminService.deleteAdminEarningOpportunity(
                    opportunity.id
                );

            if (!response.success) {
                throw new Error(
                    response.message ||
                        "Unable to remove opportunity."
                );
            }

            toast.success(response.message);
            setSelectedOpportunity(null);
            await loadData();
        } catch (err) {
            toast.error(
                err.message || "Unable to remove opportunity."
            );
        } finally {
            setProcessing(false);
        }
    }

    function resetFilters() {
        setSearchTerm("");
        setCategory("all");
        setStatus("all");
    }

    return (
        <section className="admin-earnings-page">
            <header className="admin-earnings-heading">
                <div className="admin-earnings-heading-copy">
                    <div className="admin-earnings-eyebrow">
                        <span className="admin-earnings-eyebrow-icon">
                            <WalletCards size={14} />
                        </span>
                        Earning operations
                    </div>

                    <h1>Earnings control center</h1>

                    <p>
                        Monitor your earning catalogue, reward exposure,
                        availability and opportunity performance from one
                        place.
                    </p>
                </div>

                <div className="admin-earnings-heading-actions">
                    <span className="admin-earnings-environment">
                        <span className="admin-earnings-environment-dot" />
                        Mock environment
                    </span>

                    <button
                        type="button"
                        className="admin-earnings-refresh"
                        onClick={loadData}
                        disabled={loading}
                    >
                        <RefreshCw
                            size={16}
                            className={loading ? "is-spinning" : ""}
                        />
                        Refresh data
                    </button>
                </div>
            </header>

            {summary && (
                <section className="admin-earnings-kpi-grid">
                    <article className="admin-earnings-kpi admin-earnings-kpi-primary">
                        <div className="admin-earnings-kpi-topline">
                            <span className="admin-earnings-kpi-icon">
                                <WalletCards size={18} />
                            </span>
                            <span className="admin-earnings-kpi-caption">
                                Total rewards issued
                            </span>
                        </div>

                        <strong>
                            {formatReward(summary.totalRewards)}
                        </strong>

                        <div className="admin-earnings-kpi-footer">
                            <span>
                                <TrendingUp size={13} />
                                Mock rewards issued
                            </span>
                            <span className="admin-earnings-kpi-accent">
                                Lifetime
                            </span>
                        </div>
                    </article>

                    <article className="admin-earnings-kpi">
                        <div className="admin-earnings-kpi-topline">
                            <span className="admin-earnings-kpi-icon blue">
                                <Layers3 size={18} />
                            </span>
                            <span className="admin-earnings-kpi-caption">
                                Total opportunities
                            </span>
                        </div>

                        <strong>
                            {formatNumber(summary.totalOpportunities)}
                        </strong>

                        <div className="admin-earnings-progress-track">
                            <span
                                style={{
                                    width: `${visibleStats.activeRate}%`,
                                }}
                            />
                        </div>

                        <div className="admin-earnings-kpi-footer">
                            <span>
                                {visibleStats.activeRate}% active rate
                            </span>
                            <span>
                                {formatNumber(
                                    summary.inactiveOpportunities
                                )} inactive
                            </span>
                        </div>
                    </article>

                    <article className="admin-earnings-kpi">
                        <div className="admin-earnings-kpi-topline">
                            <span className="admin-earnings-kpi-icon green">
                                <CheckCircle2 size={18} />
                            </span>
                            <span className="admin-earnings-kpi-caption">
                                Active inventory
                            </span>
                        </div>

                        <strong>
                            {formatNumber(summary.activeOpportunities)}
                        </strong>

                        <div className="admin-earnings-kpi-footer">
                            <span>
                                <Activity size={13} />
                                Live in catalogue
                            </span>
                            <span className="admin-earnings-positive">
                                Available
                            </span>
                        </div>
                    </article>

                    <article className="admin-earnings-kpi">
                        <div className="admin-earnings-kpi-topline">
                            <span className="admin-earnings-kpi-icon purple">
                                <Users size={18} />
                            </span>
                            <span className="admin-earnings-kpi-caption">
                                Completions
                            </span>
                        </div>

                        <strong>
                            {formatNumber(summary.totalCompletions)}
                        </strong>

                        <div className="admin-earnings-kpi-footer">
                            <span>Across all opportunities</span>
                            <span>Lifetime</span>
                        </div>
                    </article>

                    <article className="admin-earnings-kpi">
                        <div className="admin-earnings-kpi-topline">
                            <span className="admin-earnings-kpi-icon amber">
                                <Star size={18} />
                            </span>
                            <span className="admin-earnings-kpi-caption">
                                Featured
                            </span>
                        </div>

                        <strong>
                            {formatNumber(visibleStats.featuredCount)}
                        </strong>

                        <div className="admin-earnings-kpi-footer">
                            <span>Shown with priority</span>
                            <span>Curated</span>
                        </div>
                    </article>
                </section>
            )}

            <section className="admin-earnings-insights">
                <div className="admin-earnings-insight-intro">
                    <span className="admin-earnings-section-kicker">
                        <BarChart3 size={14} />
                        Catalogue insights
                    </span>
                    <h2>Understand the inventory at a glance</h2>
                    <p>
                        These figures update with the catalogue currently
                        visible below, making filtered reviews easier to scan.
                    </p>
                </div>

                <div className="admin-earnings-insight-metrics">
                    <div className="admin-earnings-insight-metric">
                        <span className="admin-earnings-metric-icon">
                            <Tag size={15} />
                        </span>
                        <div>
                            <small>Average reward</small>
                            <strong>
                                {formatReward(visibleStats.averageReward)}
                            </strong>
                        </div>
                    </div>

                    <div className="admin-earnings-insight-metric">
                        <span className="admin-earnings-metric-icon">
                            <Clock3 size={15} />
                        </span>
                        <div>
                            <small>Average completion time</small>
                            <strong>
                                {visibleStats.averageCompletionTime} min
                            </strong>
                        </div>
                    </div>

                    <div className="admin-earnings-insight-metric">
                        <span className="admin-earnings-metric-icon">
                            <Activity size={15} />
                        </span>
                        <div>
                            <small>Results in view</small>
                            <strong>
                                {formatNumber(opportunities.length)}
                            </strong>
                        </div>
                    </div>

                    <div className="admin-earnings-insight-metric">
                        <span className="admin-earnings-metric-icon">
                            <Layers3 size={15} />
                        </span>
                        <div>
                            <small>Inventory mix</small>
                            <strong>
                                {formatNumber(
                                    visibleStats.categoryCounts.surveys || 0
                                )} survey · {formatNumber(
                                    visibleStats.categoryCounts.tasks || 0
                                )} task · {formatNumber(
                                    visibleStats.categoryCounts.offers || 0
                                )} offer
                            </strong>
                        </div>
                    </div>
                </div>
            </section>

            <section className="admin-earnings-workspace">
                <div className="admin-earnings-toolbar">
                    <div className="admin-earnings-toolbar-heading">
                        <span className="admin-earnings-section-kicker">
                            <Layers3 size={14} />
                            Opportunity catalogue
                        </span>
                        <h2>Manage earning opportunities</h2>
                        <p>
                            Search, review availability and inspect individual
                            opportunities before taking action.
                        </p>
                    </div>

                    <div className="admin-earnings-toolbar-controls">
                        <label className="admin-earnings-search">
                            <Search size={17} />
                            <input
                                type="search"
                                value={searchTerm}
                                onChange={(event) =>
                                    setSearchTerm(event.target.value)
                                }
                                placeholder="Search title, provider or ID..."
                                aria-label="Search earning opportunities"
                            />
                        </label>

                        <label className="admin-earnings-select-wrap">
                            <Filter size={15} />
                            <select
                                value={category}
                                onChange={(event) =>
                                    setCategory(event.target.value)
                                }
                                aria-label="Filter by category"
                            >
                                <option value="all">
                                    All categories
                                </option>
                                <option value="surveys">Surveys</option>
                                <option value="tasks">Tasks</option>
                                <option value="offers">Offers</option>
                            </select>
                        </label>

                        <select
                            className="admin-earnings-status-select"
                            value={status}
                            onChange={(event) =>
                                setStatus(event.target.value)
                            }
                            aria-label="Filter by status"
                        >
                            <option value="all">All statuses</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>

                        <button
                            type="button"
                            className="admin-earnings-reset"
                            onClick={resetFilters}
                        >
                            Reset
                        </button>
                    </div>
                </div>

                {!loading && !error && opportunities.length > 0 && (
                    <div className="admin-earnings-table-head">
                        <span>Opportunity</span>
                        <span>Performance</span>
                        <span>Reward</span>
                        <span>Status</span>
                        <span className="align-right">Actions</span>
                    </div>
                )}

                {loading ? (
                    <div className="admin-earnings-state">
                        <span className="admin-earnings-state-spinner" />
                        <strong>Loading earning inventory</strong>
                        <p>
                            Preparing the latest catalogue data for this view.
                        </p>
                    </div>
                ) : error ? (
                    <div className="admin-earnings-state error">
                        <span className="admin-earnings-state-icon">
                            <Activity size={19} />
                        </span>
                        <strong>Unable to load earnings</strong>
                        <p>{error}</p>
                        <button
                            type="button"
                            onClick={loadData}
                            className="admin-earnings-inline-action"
                        >
                            Try again
                        </button>
                    </div>
                ) : opportunities.length === 0 ? (
                    <div className="admin-earnings-state empty">
                        <span className="admin-earnings-state-icon">
                            <Search size={19} />
                        </span>
                        <strong>No opportunities found</strong>
                        <p>
                            Your current filters do not match any earning
                            opportunities.
                        </p>
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="admin-earnings-inline-action"
                        >
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <div className="admin-earnings-list">
                        {opportunities.map((opportunity) => {
                            const CategoryIcon = getCategoryIcon(
                                opportunity.category
                            );

                            return (
                                <article
                                    key={opportunity.id}
                                    className="admin-earning-row"
                                >
                                    <div className="admin-earning-identity">
                                        <div
                                            className={`admin-earning-category-icon ${opportunity.category}`}
                                        >
                                            <CategoryIcon size={19} />
                                        </div>

                                        <div className="admin-earning-copy">
                                            <div className="admin-earning-title-line">
                                                <h3>{opportunity.title}</h3>

                                                {opportunity.featured && (
                                                    <span className="admin-earning-featured">
                                                        <Star size={11} />
                                                        Featured
                                                    </span>
                                                )}
                                            </div>

                                            <p>{opportunity.description}</p>

                                            <div className="admin-earning-meta">
                                                <span>
                                                    <Building2 size={12} />
                                                    {opportunity.provider}
                                                </span>
                                                <span>
                                                    <Tag size={12} />
                                                    {getCategoryLabel(
                                                        opportunity.category
                                                    )}
                                                </span>
                                                <span>
                                                    <CalendarDays size={12} />
                                                    Updated {" "}
                                                    {formatDate(
                                                        opportunity.updatedAt
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="admin-earning-performance">
                                        <div className="admin-earning-performance-top">
                                            <span>
                                                {formatNumber(
                                                    opportunity.completions
                                                )}
                                            </span>
                                            <small>completions</small>
                                        </div>
                                        <div className="admin-earning-mini-bar">
                                            <span
                                                style={{
                                                    width: `${Math.min(
                                                        100,
                                                        Math.max(
                                                            10,
                                                            (opportunity.completions /
                                                                Math.max(
                                                                    1,
                                                                    summary?.totalCompletions ||
                                                                        opportunity.completions
                                                                )) *
                                                                100
                                                        )
                                                    )}%`,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="admin-earning-reward-block">
                                        <strong>
                                            {formatReward(
                                                opportunity.reward,
                                                opportunity.currency
                                            )}
                                        </strong>
                                        <span>
                                            <Clock3 size={12} />
                                            {opportunity.estimatedMinutes} min
                                        </span>
                                    </div>

                                    <span
                                        className={`admin-earning-status ${opportunity.status}`}
                                    >
                                        <span className="status-dot" />
                                        {opportunity.status}
                                    </span>

                                    <div className="admin-earning-actions">
                                        <button
                                            type="button"
                                            className="admin-earning-view-button"
                                            onClick={() =>
                                                setSelectedOpportunity(
                                                    opportunity
                                                )
                                            }
                                        >
                                            <Eye size={15} />
                                            View
                                        </button>

                                        <button
                                            type="button"
                                            className="admin-earning-icon-action"
                                            onClick={() =>
                                                toggleOpportunity(opportunity)
                                            }
                                            disabled={processing}
                                            aria-label={
                                                opportunity.status ===
                                                "active"
                                                    ? "Deactivate opportunity"
                                                    : "Activate opportunity"
                                            }
                                            title={
                                                opportunity.status ===
                                                "active"
                                                    ? "Deactivate"
                                                    : "Activate"
                                            }
                                        >
                                            {opportunity.status === "active" ? (
                                                <PauseCircle size={16} />
                                            ) : (
                                                <PlayCircle size={16} />
                                            )}
                                        </button>

                                        <button
                                            type="button"
                                            className="admin-earning-icon-action danger"
                                            onClick={() =>
                                                removeOpportunity(opportunity)
                                            }
                                            disabled={processing}
                                            aria-label="Delete opportunity"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>

            <div className="admin-earnings-demo-note">
                <BadgeCheck size={14} />
                <span>
                    This admin view is currently powered by mock data only.
                    Real earning providers, balances and catalogue mutations
                    will remain server-authoritative when Firebase integration
                    is connected.
                </span>
            </div>

            {selectedOpportunity && (
                <div
                    className="admin-earning-modal-backdrop"
                    role="presentation"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setSelectedOpportunity(null);
                        }
                    }}
                >
                    <section
                        className="admin-earning-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="admin-earning-modal-title"
                        onMouseDown={(event) => event.stopPropagation()}
                    >
                        <div className="admin-earning-modal-topline">
                            <div className="admin-earning-modal-branding">
                                <div
                                    className={`admin-earning-modal-icon ${selectedOpportunity.category}`}
                                >
                                    {(() => {
                                        const ModalIcon = getCategoryIcon(
                                            selectedOpportunity.category
                                        );
                                        return <ModalIcon size={22} />;
                                    })()}
                                </div>

                                <div>
                                    <span className="admin-earnings-section-kicker">
                                        Opportunity details
                                    </span>
                                    <p>{selectedOpportunity.id}</p>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="admin-earning-modal-close"
                                onClick={() =>
                                    setSelectedOpportunity(null)
                                }
                                aria-label="Close opportunity details"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="admin-earning-modal-title-row">
                            <div>
                                <div className="admin-earning-modal-title-badges">
                                    <span
                                        className={`admin-earning-status ${selectedOpportunity.status}`}
                                    >
                                        <span className="status-dot" />
                                        {selectedOpportunity.status}
                                    </span>

                                    {selectedOpportunity.featured && (
                                        <span className="admin-earning-featured">
                                            <Star size={11} />
                                            Featured
                                        </span>
                                    )}
                                </div>

                                <h2 id="admin-earning-modal-title">
                                    {selectedOpportunity.title}
                                </h2>

                                <p>
                                    {selectedOpportunity.description}
                                </p>
                            </div>
                        </div>

                        <div className="admin-earning-modal-highlight">
                            <div>
                                <span>Reward</span>
                                <strong>
                                    {formatReward(
                                        selectedOpportunity.reward,
                                        selectedOpportunity.currency
                                    )}
                                </strong>
                                <small>
                                    Reward shown to the frontend user
                                </small>
                            </div>

                            <div className="admin-earning-modal-highlight-divider" />

                            <div>
                                <span>Completions</span>
                                <strong>
                                    {formatNumber(
                                        selectedOpportunity.completions
                                    )}
                                </strong>
                                <small>Recorded catalogue activity</small>
                            </div>
                        </div>

                        <div className="admin-earning-detail-section">
                            <div className="admin-earning-detail-section-title">
                                <span className="admin-earnings-section-kicker">
                                    <Layers3 size={13} />
                                    Opportunity profile
                                </span>
                            </div>

                            <div className="admin-earning-detail-grid">
                                <div>
                                    <span>Provider</span>
                                    <strong>
                                        <Building2 size={14} />
                                        {selectedOpportunity.provider}
                                    </strong>
                                </div>

                                <div>
                                    <span>Category</span>
                                    <strong>
                                        <Tag size={14} />
                                        {formatCategory(
                                            selectedOpportunity.category
                                        )}
                                    </strong>
                                </div>

                                <div>
                                    <span>Estimated time</span>
                                    <strong>
                                        <Clock3 size={14} />
                                        {selectedOpportunity.estimatedMinutes} minutes
                                    </strong>
                                </div>

                                <div>
                                    <span>Record status</span>
                                    <strong>
                                        <CheckCircle2 size={14} />
                                        {formatCategory(
                                            selectedOpportunity.status
                                        )}
                                    </strong>
                                </div>
                            </div>
                        </div>

                        <div className="admin-earning-detail-section">
                            <div className="admin-earning-detail-section-title">
                                <span className="admin-earnings-section-kicker">
                                    <CalendarDays size={13} />
                                    Record timeline
                                </span>
                            </div>

                            <div className="admin-earning-timeline">
                                <div>
                                    <span>Created</span>
                                    <strong>
                                        {formatDate(
                                            selectedOpportunity.createdAt
                                        )}
                                    </strong>
                                </div>
                                <div>
                                    <span>Last updated</span>
                                    <strong>
                                        {formatDate(
                                            selectedOpportunity.updatedAt
                                        )}
                                    </strong>
                                </div>
                            </div>
                        </div>

                        <div className="admin-earning-modal-actions">
                            <button
                                type="button"
                                className="admin-earning-toggle"
                                onClick={() =>
                                    toggleOpportunity(selectedOpportunity)
                                }
                                disabled={processing}
                            >
                                {selectedOpportunity.status === "active" ? (
                                    <>
                                        <PauseCircle size={16} />
                                        Deactivate opportunity
                                    </>
                                ) : (
                                    <>
                                        <PlayCircle size={16} />
                                        Activate opportunity
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                className="admin-earning-delete"
                                onClick={() =>
                                    removeOpportunity(selectedOpportunity)
                                }
                                disabled={processing}
                            >
                                <Trash2 size={16} />
                                Remove opportunity
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </section>
    );
}

export default AdminEarningsPage;
