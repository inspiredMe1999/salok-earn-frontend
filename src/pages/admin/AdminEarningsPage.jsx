import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
    CheckCircle2,
    Clock3,
    Eye,
    Filter,
    PauseCircle,
    PlayCircle,
    RefreshCw,
    Search,
    Star,
    Trash2,
    X,
} from "lucide-react";

import adminService from "../../services/mock/adminService";
import "./admin-earnings.css";

function formatNumber(value) {
    return new Intl.NumberFormat("en-US").format(value);
}

function formatReward(value, currency = "SAK") {
    return `${formatNumber(value)} ${currency}`;
}

function formatDate(value) {
    if (!value) return "—";

    return new Date(value).toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric",
        }
    );
}

function AdminEarningsPage() {
    const [opportunities, setOpportunities] =
        useState([]);

    const [summary, setSummary] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [category, setCategory] = useState("all");
    const [status, setStatus] = useState("all");

    const [selectedOpportunity, setSelectedOpportunity] =
        useState(null);

    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState("");

    async function loadData() {
        try {
            setLoading(true);
            setError("");

            const [
                opportunitiesResponse,
                summaryResponse,
            ] = await Promise.all([
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
                Array.isArray(
                    opportunitiesResponse.data
                )
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

    async function toggleOpportunity(
        opportunity
    ) {
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
                err.message ||
                    "Unable to update opportunity."
            );
        } finally {
            setProcessing(false);
        }
    }

    async function removeOpportunity(
        opportunity
    ) {
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
                err.message ||
                    "Unable to remove opportunity."
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
            <div className="admin-page-heading">
                <div>
                    <span className="admin-eyebrow">
                        Earning operations
                    </span>

                    <h1>Earning opportunities</h1>

                    <p>
                        Manage the mock opportunities displayed
                        throughout the Salok Earn frontend.
                    </p>
                </div>

                <div className="admin-heading-actions">
                    <span className="admin-demo-badge">
                        Mock data only
                    </span>

                    <button
                        type="button"
                        className="admin-secondary-button"
                        onClick={loadData}
                        disabled={loading}
                    >
                        <RefreshCw size={16} />
                        Refresh
                    </button>
                </div>
            </div>

            {summary && (
                <div className="admin-earnings-summary">
                    <div className="admin-earnings-stat">
                        <span>Total opportunities</span>
                        <strong>
                            {formatNumber(
                                summary.totalOpportunities
                            )}
                        </strong>
                        <small>
                            Catalogue size
                        </small>
                    </div>

                    <div className="admin-earnings-stat success">
                        <span>Active</span>
                        <strong>
                            {formatNumber(
                                summary.activeOpportunities
                            )}
                        </strong>
                        <small>
                            Currently available
                        </small>
                    </div>

                    <div className="admin-earnings-stat warning">
                        <span>Inactive</span>
                        <strong>
                            {formatNumber(
                                summary.inactiveOpportunities
                            )}
                        </strong>
                        <small>
                            Temporarily unavailable
                        </small>
                    </div>

                    <div className="admin-earnings-stat">
                        <span>Completions</span>
                        <strong>
                            {formatNumber(
                                summary.totalCompletions
                            )}
                        </strong>
                        <small>
                            Mock lifetime count
                        </small>
                    </div>

                    <div className="admin-earnings-stat">
                        <span>Total rewards</span>
                        <strong>
                            {formatReward(
                                summary.totalRewards
                            )}
                        </strong>
                        <small>
                            Mock rewards issued
                        </small>
                    </div>
                </div>
            )}

            <div className="admin-earnings-toolbar">
                <div className="admin-earnings-search">
                    <Search size={17} />

                    <input
                        type="search"
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(
                                event.target.value
                            )
                        }
                        placeholder="Search opportunities..."
                    />
                </div>

                <div className="admin-earnings-filter">
                    <Filter size={15} />

                    <select
                        value={category}
                        onChange={(event) =>
                            setCategory(
                                event.target.value
                            )
                        }
                    >
                        <option value="all">
                            All categories
                        </option>

                        <option value="surveys">
                            Surveys
                        </option>

                        <option value="tasks">
                            Tasks
                        </option>

                        <option value="offers">
                            Offers
                        </option>
                    </select>
                </div>

                <select
                    className="admin-earnings-select"
                    value={status}
                    onChange={(event) =>
                        setStatus(event.target.value)
                    }
                >
                    <option value="all">
                        All statuses
                    </option>

                    <option value="active">
                        Active
                    </option>

                    <option value="inactive">
                        Inactive
                    </option>
                </select>

                <button
                    type="button"
                    className="admin-text-button"
                    onClick={resetFilters}
                >
                    Reset
                </button>
            </div>

            <div className="admin-panel">
                <div className="admin-panel-heading">
                    <div>
                        <h2>Opportunity catalogue</h2>

                        <p>
                            {opportunities.length} opportunity
                            (ies) displayed
                        </p>
                    </div>

                    <span className="admin-panel-label">
                        Earning catalogue
                    </span>
                </div>

                {loading ? (
                    <div className="admin-loading-state">
                        Loading opportunities...
                    </div>
                ) : error ? (
                    <div className="admin-error-state">
                        <p>{error}</p>

                        <button
                            type="button"
                            onClick={loadData}
                        >
                            Try again
                        </button>
                    </div>
                ) : opportunities.length === 0 ? (
                    <div className="admin-empty-state">
                        No earning opportunities match your
                        filters.
                    </div>
                ) : (
                    <div className="admin-earnings-list">
                        {opportunities.map(
                            (opportunity) => (
                                <article
                                    key={opportunity.id}
                                    className="admin-earning-card"
                                >
                                    <div className="admin-earning-icon">
                                        {opportunity.category ===
                                            "surveys"
                                            ? "S"
                                            : opportunity.category ===
                                                "tasks"
                                                ? "T"
                                                : "O"}
                                    </div>

                                    <div className="admin-earning-main">
                                        <div className="admin-earning-title-row">
                                            <h3>
                                                {
                                                    opportunity.title
                                                }
                                            </h3>

                                            {opportunity.featured && (
                                                <span className="admin-featured">
                                                    <Star
                                                        size={
                                                            12
                                                        }
                                                    />
                                                    Featured
                                                </span>
                                            )}
                                        </div>

                                        <p>
                                            {
                                                opportunity.description
                                            }
                                        </p>

                                        <div className="admin-earning-meta">
                                            <span>
                                                {
                                                    opportunity.category
                                                }
                                            </span>

                                            <span>
                                                {
                                                    opportunity.provider
                                                }
                                            </span>

                                            <span>
                                                <Clock3
                                                    size={
                                                        13
                                                    }
                                                />
                                                {
                                                    opportunity.estimatedMinutes
                                                }{" "}
                                                min
                                            </span>

                                            <span>
                                                {
                                                    formatNumber(
                                                        opportunity.completions
                                                    )
                                                }{" "}
                                                completions
                                            </span>
                                        </div>
                                    </div>

                                    <div className="admin-earning-reward">
                                        <strong>
                                            {formatReward(
                                                opportunity.reward,
                                                opportunity.currency
                                            )}
                                        </strong>

                                        <span>
                                            {formatDate(
                                                opportunity.updatedAt
                                            )}
                                        </span>
                                    </div>

                                    <span
                                        className={`admin-earning-status ${opportunity.status}`}
                                    >
                                        {opportunity.status}
                                    </span>

                                    <div className="admin-earning-actions">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setSelectedOpportunity(
                                                    opportunity
                                                )
                                            }
                                        >
                                            <Eye
                                                size={15}
                                            />
                                            View
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                toggleOpportunity(
                                                    opportunity
                                                )
                                            }
                                            disabled={
                                                processing
                                            }
                                        >
                                            {opportunity.status ===
                                            "active" ? (
                                                <>
                                                    <PauseCircle
                                                        size={
                                                            15
                                                        }
                                                    />
                                                    Disable
                                                </>
                                            ) : (
                                                <>
                                                    <PlayCircle
                                                        size={
                                                            15
                                                        }
                                                    />
                                                    Enable
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </article>
                            )
                        )}
                    </div>
                )}
            </div>

            {selectedOpportunity && (
                <div
                    className="admin-earning-modal-backdrop"
                    onClick={() =>
                        setSelectedOpportunity(null)
                    }
                >
                    <div
                        className="admin-earning-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="admin-earning-modal-header">
                            <div>
                                <span className="admin-eyebrow">
                                    Opportunity details
                                </span>

                                <h2>
                                    {
                                        selectedOpportunity.title
                                    }
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedOpportunity(
                                        null
                                    )
                                }
                            >
                                <X size={19} />
                            </button>
                        </div>

                        <div className="admin-earning-detail-grid">
                            <div>
                                <span>Opportunity ID</span>
                                <strong>
                                    {
                                        selectedOpportunity.id
                                    }
                                </strong>
                            </div>

                            <div>
                                <span>Category</span>
                                <strong>
                                    {
                                        selectedOpportunity.category
                                    }
                                </strong>
                            </div>

                            <div>
                                <span>Provider</span>
                                <strong>
                                    {
                                        selectedOpportunity.provider
                                    }
                                </strong>
                            </div>

                            <div>
                                <span>Reward</span>
                                <strong>
                                    {formatReward(
                                        selectedOpportunity.reward,
                                        selectedOpportunity.currency
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>Estimated time</span>
                                <strong>
                                    {
                                        selectedOpportunity.estimatedMinutes
                                    }{" "}
                                    minutes
                                </strong>
                            </div>

                            <div>
                                <span>Completions</span>
                                <strong>
                                    {formatNumber(
                                        selectedOpportunity.completions
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>Status</span>
                                <strong>
                                    {
                                        selectedOpportunity.status
                                    }
                                </strong>
                            </div>

                            <div>
                                <span>Featured</span>
                                <strong>
                                    {selectedOpportunity.featured
                                        ? "Yes"
                                        : "No"}
                                </strong>
                            </div>
                        </div>

                        <div className="admin-earning-description">
                            <span>Description</span>

                            <p>
                                {
                                    selectedOpportunity.description
                                }
                            </p>
                        </div>

                        <div className="admin-earning-modal-actions">
                            <button
                                type="button"
                                className="admin-earning-toggle"
                                disabled={processing}
                                onClick={() =>
                                    toggleOpportunity(
                                        selectedOpportunity
                                    )
                                }
                            >
                                {selectedOpportunity.status ===
                                "active" ? (
                                    <>
                                        <PauseCircle
                                            size={16}
                                        />
                                        Disable opportunity
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2
                                            size={16}
                                        />
                                        Enable opportunity
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                className="admin-earning-delete"
                                disabled={processing}
                                onClick={() =>
                                    removeOpportunity(
                                        selectedOpportunity
                                    )
                                }
                            >
                                <Trash2 size={16} />
                                Remove
                            </button>
                        </div>

                        <p className="admin-earning-demo-note">
                            This is a frontend mock-management
                            interface. Changes do not modify
                            Firebase or real earning providers.
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
}

export default AdminEarningsPage;