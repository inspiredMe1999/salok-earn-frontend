import { useEffect, useMemo, useState } from "react";
import {
    Activity as ActivityIcon,
    ArrowDownLeft,
    Clock3,
    ArrowLeft,
    ArrowUpRight,
    Brain,
    CheckCircle2,
    ClipboardList,
    Copy,
    Gift,
    RefreshCw,
    Search,
    User,
    UserPlus,
    Users,
    Wallet,
    UserCheck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
    ACTIVITY_TYPES,
} from "../../data/activityData";

import activityService from "../../services/mock/activityService";

import "./wallet.css";
import "./activity.css";

const TYPE_ICONS = {
    earnings: Wallet,
    trivia: Brain,
    surveys: ClipboardList,
    tasks: CheckCircle2,
    offers: Gift,
    referrals: Users,
    withdrawals: ArrowDownLeft,
    account: User,
};

function formatSAK(amount) {
    return `${Number(amount || 0).toLocaleString(
        undefined,
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }
    )} SAK`;
}

function formatDate(date) {
    if (!date) {
        return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "—";
    }

    return parsedDate.toLocaleDateString(
        undefined,
        {
            day: "numeric",
            month: "short",
            year: "numeric",
        }
    );
}

function formatTime(date) {
    if (!date) {
        return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "—";
    }

    return parsedDate.toLocaleTimeString(
        undefined,
        {
            hour: "numeric",
            minute: "2-digit",
        }
    );
}

function getTypeLabel(type) {
    return (
        ACTIVITY_TYPES[type] ||
        "Activity"
    );
}

function getStatusClass(status) {
    return `activity-status activity-status--${status || "completed"
        }`;
}

function getActivityIcon(activity) {
    return (
        TYPE_ICONS[activity?.type] ||
        ActivityIcon
    );
}

function ActivityRow({
    activity,
    onCopyReference,
}) {
    const Icon =
        getActivityIcon(activity);

    const isCredit =
        activity?.direction === "credit";

    const isDebit =
        activity?.direction === "debit";

    return (
        <article className="activity-row">
            <div className="activity-row__icon">
                <Icon size={18} />
            </div>

            <div className="activity-row__content">
                <div className="activity-row__title">
                    <h3>
                        {activity?.title}
                    </h3>

                    <span className={getStatusClass(
                        activity?.status
                    )}>
                        {activity?.status ||
                            "completed"}
                    </span>
                </div>

                <p>
                    {activity?.description}
                </p>

                <div className="activity-row__meta">
                    <span>
                        {getTypeLabel(
                            activity?.type
                        )}
                    </span>

                    <span>•</span>

                    <span>
                        {formatDate(
                            activity?.date
                        )}
                    </span>

                    <span>•</span>

                    <span>
                        {formatTime(
                            activity?.date
                        )}
                    </span>
                </div>
            </div>

            <div
                className={`activity-row__amount activity-row__amount--${activity?.direction ||
                    "neutral"
                    }`}
            >
                {isCredit && (
                    <ArrowUpRight size={14} />
                )}

                {isDebit && (
                    <ArrowDownLeft size={14} />
                )}

                <strong>
                    {activity?.amount
                        ? `${isCredit ? "+" : isDebit ? "-" : ""}${formatSAK(
                            activity.amount
                        )}`
                        : "—"}
                </strong>
            </div>

            <div className="activity-row__reference">
                <span>
                    Reference
                </span>

                <button
                    type="button"
                    onClick={() =>
                        onCopyReference(
                            activity?.reference
                        )
                    }
                >
                    <code>
                        {activity?.reference ||
                            "—"}
                    </code>

                    <Copy size={13} />
                </button>
            </div>
        </article>
    );
}

function SummaryCard({
    icon: Icon,
    label,
    value,
    description,
}) {
    return (
        <article className="activity-summary-card">
            <div className="activity-summary-card__icon">
                <Icon size={18} />
            </div>

            <div>
                <strong>
                    {value}
                </strong>

                <span>
                    {label}
                </span>

                {description && (
                    <small>
                        {description}
                    </small>
                )}
            </div>
        </article>
    );
}

function LoadingState() {
    return (
        <div className="activity-loading">
            <div className="activity-spinner" />

            <p>
                Loading your activity...
            </p>
        </div>
    );
}

function EmptyState({ filtered }) {
    return (
        <div className="activity-empty">
            <div className="activity-empty__icon">
                <ActivityIcon size={27} />
            </div>

            <h3>
                {filtered
                    ? "No matching activity"
                    : "No activity yet"}
            </h3>

            <p>
                {filtered
                    ? "Try changing your search or activity filter."
                    : "Your earning and account activity will appear here."}
            </p>

            {!filtered && (
                <Link
                    to="/earn"
                    className="wallet-primary-button"
                >
                    Start earning
                </Link>
            )}
        </div>
    );
}

function ErrorState({
    message,
    onRetry,
}) {
    return (
        <div className="activity-error">
            <ActivityIcon size={25} />

            <h3>
                Unable to load activity
            </h3>

            <p>
                {message ||
                    "Something went wrong while loading your activity."}
            </p>

            <button
                type="button"
                className="wallet-primary-button"
                onClick={onRetry}
            >
                <RefreshCw size={16} />
                Try again
            </button>
        </div>
    );
}

export default function ActivityPage() {
    const navigate = useNavigate();

    const [activities, setActivities] =
        useState([]);

    const [summary, setSummary] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [activeType, setActiveType] =
        useState("all");

    const [searchTerm, setSearchTerm] =
        useState("");

    async function loadActivity() {
        try {
            setLoading(true);
            setError("");

            const [
                activitiesResponse,
                summaryResponse,
            ] = await Promise.all([
                activityService.getActivities(),
                activityService.getActivitySummary(),
            ]);

            if (
                !activitiesResponse?.success
            ) {
                throw new Error(
                    activitiesResponse?.message ||
                    "Unable to load activity."
                );
            }

            if (
                !summaryResponse?.success
            ) {
                throw new Error(
                    summaryResponse?.message ||
                    "Unable to load activity summary."
                );
            }

            setActivities(
                Array.isArray(
                    activitiesResponse.data
                )
                    ? activitiesResponse.data
                    : []
            );

            setSummary(
                summaryResponse.data || null
            );
        } catch (err) {
            console.error(
                "Failed to load activity:",
                err
            );

            setError(
                err?.message ||
                "We couldn't load your activity."
            );

            setActivities([]);
            setSummary(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadActivity();
    }, []);

    async function handleCopyReference(
        reference
    ) {
        if (!reference) {
            return;
        }

        try {
            if (
                navigator.clipboard &&
                window.isSecureContext
            ) {
                await navigator.clipboard.writeText(
                    reference
                );
            } else {
                const textarea =
                    document.createElement(
                        "textarea"
                    );

                textarea.value = reference;

                document.body.appendChild(
                    textarea
                );

                textarea.select();

                document.execCommand("copy");

                document.body.removeChild(
                    textarea
                );
            }

            toast.success(
                "Reference copied."
            );
        } catch (err) {
            console.error(
                "Copy failed:",
                err
            );

            toast.error(
                "Unable to copy reference."
            );
        }
    }

    const filteredActivities =
        useMemo(() => {
            const search =
                searchTerm
                    .trim()
                    .toLowerCase();

            return activities.filter(
                (activity) => {
                    const matchesType =
                        activeType ===
                        "all" ||
                        activity?.type ===
                        activeType;

                    if (!matchesType) {
                        return false;
                    }

                    if (!search) {
                        return true;
                    }

                    const text = [
                        activity?.title,
                        activity?.description,
                        activity?.reference,
                        activity?.type,
                        activity?.status,
                    ]
                        .filter(Boolean)
                        .join(" ")
                        .toLowerCase();

                    return text.includes(
                        search
                    );
                }
            );
        }, [
            activities,
            activeType,
            searchTerm,
        ]);

    const hasFilters =
        activeType !== "all" ||
        searchTerm.trim() !== "";

    const filterEntries =
        Object.entries(
            ACTIVITY_TYPES
        );

    return (
        <div className="activity-page">
            <header className="wallet-page-header">
                <div>
                    {/* <button
                        type="button"
                        className="wallet-back-button"
                        onClick={() =>
                            navigate(
                                "/dashboard"
                            )
                        }
                    >
                        <ArrowLeft size={17} />
                        Back to Dashboard
                    </button> */}

                    <div className="wallet-page-title">
                        <span className="wallet-page-eyebrow">
                            Account
                        </span>

                        <h1>
                            Activity
                        </h1>

                        <p>
                            Keep track of your
                            earnings, withdrawals
                            and account activity.
                        </p>
                    </div>
                </div>

                <Link
                    to="/earn"
                    className="wallet-primary-button"
                >
                    Start earning
                </Link>
            </header>

            <div className="activity-summary-grid">
                <SummaryCard
                    icon={ActivityIcon}
                    label="Total activity"
                    value={
                        summary?.totalActivities ||
                        0
                    }
                    description="Recorded events"
                />

                <SummaryCard
                    icon={ArrowUpRight}
                    label="Total earned"
                    value={formatSAK(
                        summary?.totalEarned
                    )}
                    description="From earning activities"
                />

                <SummaryCard
                    icon={ArrowDownLeft}
                    label="Total withdrawn"
                    value={formatSAK(
                        summary?.totalWithdrawn
                    )}
                    description="Wallet withdrawals"
                />

                <SummaryCard
                    icon={Clock3}
                    label="Pending"
                    value={
                        summary?.pendingActivities ||
                        0
                    }
                    description="Awaiting completion"
                />
            </div>

            <section className="activity-section">
                <div className="activity-section__header">
                    <div>
                        <span>
                            History
                        </span>

                        <h2>
                            Recent activity
                        </h2>
                    </div>

                    <span className="activity-count">
                        {
                            filteredActivities.length
                        }{" "}
                        records
                    </span>
                </div>

                <div className="activity-toolbar">
                    <div className="activity-search">
                        <Search size={17} />

                        <input
                            type="search"
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(
                                    event.target
                                        .value
                                )
                            }
                            placeholder="Search activity..."
                        />
                    </div>

                    <div className="activity-filters">
                        {filterEntries.map(
                            ([
                                id,
                                label,
                            ]) => (
                                <button
                                    type="button"
                                    key={id}
                                    className={
                                        activeType ===
                                            id
                                            ? "is-active"
                                            : ""
                                    }
                                    onClick={() =>
                                        setActiveType(
                                            id
                                        )
                                    }
                                >
                                    {label}
                                </button>
                            )
                        )}
                    </div>
                </div>

                {loading && (
                    <LoadingState />
                )}

                {!loading && error && (
                    <ErrorState
                        message={error}
                        onRetry={
                            loadActivity
                        }
                    />
                )}

                {!loading &&
                    !error &&
                    filteredActivities.length ===
                    0 && (
                        <EmptyState
                            filtered={
                                hasFilters
                            }
                        />
                    )}

                {!loading &&
                    !error &&
                    filteredActivities.length >
                    0 && (
                        <div className="activity-list">
                            {filteredActivities.map(
                                (
                                    activity
                                ) => (
                                    <ActivityRow
                                        key={
                                            activity.id
                                        }
                                        activity={
                                            activity
                                        }
                                        onCopyReference={
                                            handleCopyReference
                                        }
                                    />
                                )
                            )}
                        </div>
                    )}
            </section>
        </div>
    );
}