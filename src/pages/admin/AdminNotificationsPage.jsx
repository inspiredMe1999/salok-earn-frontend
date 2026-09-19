import { useEffect, useMemo, useState } from "react";
import {
    Bell,
    CheckCircle2,
    Clock3,
    Edit3,
    Eye,
    Filter,
    Megaphone,
    Plus,
    RefreshCw,
    Search,
    Send,
    Trash2,
    Users,
    X,
} from "lucide-react";
import { toast } from "sonner";

import {
    createAdminNotification,
    deleteAdminNotification,
    getAdminNotification,
    getAdminNotifications,
    getAdminNotificationSummary,
    toggleAdminNotification,
    updateAdminNotification,
} from "../../services/mock/adminService";

import "./admin-notifications.css";

const initialForm = {
    title: "",
    message: "",
    type: "system",
    audience: "all",
    status: "draft",
    scheduledAt: "",
};

const typeLabels = {
    system: "System",
    earning: "Earnings",
    withdrawal: "Withdrawals",
    trivia: "Trivia",
    community: "Community",
    promotion: "Promotion",
};

const audienceLabels = {
    all: "All users",
    active_users: "Active users",
    withdrawal_users: "Withdrawal users",
    trivia_users: "Trivia users",
    referrers: "Referrers",
    wallet_users: "Wallet users",
};

function formatNumber(value) {
    return Number(value || 0).toLocaleString();
}

function formatDate(value) {
    if (!value) {
        return "—";
    }

    return new Date(value).toLocaleDateString(
        undefined,
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    );
}

function formatDateTime(value) {
    if (!value) {
        return "—";
    }

    return new Date(value).toLocaleString(
        undefined,
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }
    );
}

function getReadRate(notification) {
    const recipients = Number(
        notification?.recipients || 0
    );

    if (!recipients) {
        return 0;
    }

    return Math.round(
        (Number(notification.readCount || 0) /
            recipients) *
            100
    );
}

function AdminNotificationsPage() {
    const [summary, setSummary] = useState(null);
    const [notifications, setNotifications] =
        useState([]);

    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] =
        useState("all");
    const [statusFilter, setStatusFilter] =
        useState("all");

    const [selectedNotification, setSelectedNotification] =
        useState(null);

    const [showComposer, setShowComposer] =
        useState(false);

    const [editingId, setEditingId] =
        useState(null);

    const [form, setForm] =
        useState(initialForm);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");

    const loadData = async (
        showRefreshState = false
    ) => {
        try {
            if (showRefreshState) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const [
                summaryResponse,
                notificationsResponse,
            ] = await Promise.all([
                getAdminNotificationSummary(),
                getAdminNotifications({
                    search,
                    type: typeFilter,
                    status: statusFilter,
                }),
            ]);

            if (!summaryResponse.success) {
                throw new Error(
                    summaryResponse.message ||
                        "Unable to load notification summary."
                );
            }

            if (!notificationsResponse.success) {
                throw new Error(
                    notificationsResponse.message ||
                        "Unable to load notifications."
                );
            }

            setSummary(summaryResponse.data);
            setNotifications(
                notificationsResponse.data
            );
        } catch (loadError) {
            console.error(loadError);

            setError(
                loadError.message ||
                    "Unable to load notifications."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [search, typeFilter, statusFilter]);

    const visibleStats = useMemo(() => {
        return [
            {
                label: "Total notifications",
                value: summary
                    ? formatNumber(
                          summary.totalNotifications
                      )
                    : "—",
                icon: Bell,
                tone: "gold",
            },
            {
                label: "Active",
                value: summary
                    ? formatNumber(
                          summary.activeNotifications
                      )
                    : "—",
                icon: CheckCircle2,
                tone: "green",
            },
            {
                label: "Drafts",
                value: summary
                    ? formatNumber(
                          summary.draftNotifications
                      )
                    : "—",
                icon: Edit3,
                tone: "blue",
            },
            {
                label: "Total recipients",
                value: summary
                    ? formatNumber(
                          summary.totalRecipients
                      )
                    : "—",
                icon: Users,
                tone: "purple",
            },
        ];
    }, [summary]);

    const handleFormChange = (event) => {
        const {
            name,
            value,
        } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const openCreateComposer = () => {
        setEditingId(null);
        setForm(initialForm);
        setShowComposer(true);
    };

    const openEditComposer = async (id) => {
        try {
            const response =
                await getAdminNotification(id);

            if (!response.success) {
                toast.error(
                    response.message ||
                        "Notification not found."
                );
                return;
            }

            const notification =
                response.data;

            setEditingId(notification.id);

            setForm({
                title: notification.title || "",
                message:
                    notification.message || "",
                type:
                    notification.type ||
                    "system",
                audience:
                    notification.audience ||
                    "all",
                status:
                    notification.status ===
                    "scheduled"
                        ? "scheduled"
                        : notification.status ===
                          "active"
                        ? "active"
                        : "draft",
                scheduledAt:
                    notification.scheduledAt
                        ? notification.scheduledAt.slice(
                              0,
                              16
                          )
                        : "",
            });

            setShowComposer(true);
        } catch (editError) {
            console.error(editError);

            toast.error(
                "Unable to open notification."
            );
        }
    };

    const closeComposer = () => {
        if (saving) {
            return;
        }

        setShowComposer(false);
        setEditingId(null);
        setForm(initialForm);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!form.title.trim()) {
            toast.error(
                "Please enter a notification title."
            );
            return;
        }

        if (!form.message.trim()) {
            toast.error(
                "Please enter a notification message."
            );
            return;
        }

        try {
            setSaving(true);

            const payload = {
                title: form.title,
                message: form.message,
                type: form.type,
                audience: form.audience,
                status: form.status,
                scheduledAt:
                    form.status === "scheduled" &&
                    form.scheduledAt
                        ? new Date(
                              form.scheduledAt
                          ).toISOString()
                        : null,
            };

            const response = editingId
                ? await updateAdminNotification(
                      editingId,
                      payload
                  )
                : await createAdminNotification(
                      payload
                  );

            if (!response.success) {
                toast.error(
                    response.message ||
                        "Unable to save notification."
                );
                return;
            }

            toast.success(
                response.message ||
                    "Notification saved successfully."
            );

            closeComposer();

            await loadData(true);
        } catch (submitError) {
            console.error(submitError);

            toast.error(
                "Unable to save notification."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleToggle = async (notification) => {
        try {
            const response =
                await toggleAdminNotification(
                    notification.id
                );

            if (!response.success) {
                toast.error(
                    response.message ||
                        "Unable to update notification."
                );
                return;
            }

            toast.success(response.message);

            await loadData(true);
        } catch (toggleError) {
            console.error(toggleError);

            toast.error(
                "Unable to update notification."
            );
        }
    };

    const handleDelete = async (notification) => {
        const confirmed = window.confirm(
            `Delete "${notification.title}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            const response =
                await deleteAdminNotification(
                    notification.id
                );

            if (!response.success) {
                toast.error(
                    response.message ||
                        "Unable to delete notification."
                );
                return;
            }

            toast.success(
                response.message ||
                    "Notification deleted."
            );

            setSelectedNotification(null);

            await loadData(true);
        } catch (deleteError) {
            console.error(deleteError);

            toast.error(
                "Unable to delete notification."
            );
        }
    };

    const handleView = async (id) => {
        try {
            const response =
                await getAdminNotification(id);

            if (!response.success) {
                toast.error(
                    response.message ||
                        "Notification not found."
                );
                return;
            }

            setSelectedNotification(
                response.data
            );
        } catch (viewError) {
            console.error(viewError);

            toast.error(
                "Unable to load notification."
            );
        }
    };

    return (
        <section className="admin-notifications-page">
            <div className="admin-notifications-container">
                <div className="admin-notifications-header">
                    <div>
                        <div className="admin-page-kicker">
                            <Bell size={15} />
                            Communication
                        </div>

                        <h1>
                            Notifications
                        </h1>

                        <p>
                            Manage platform notifications,
                            announcements and user messaging.
                        </p>
                    </div>

                    <div className="admin-notifications-header-actions">
                        <button
                            type="button"
                            className="admin-secondary-button"
                            onClick={() =>
                                loadData(true)
                            }
                            disabled={refreshing}
                        >
                            <RefreshCw
                                size={17}
                                className={
                                    refreshing
                                        ? "admin-spin"
                                        : ""
                                }
                            />
                            Refresh
                        </button>

                        <button
                            type="button"
                            className="admin-primary-button"
                            onClick={
                                openCreateComposer
                            }
                        >
                            <Plus size={18} />
                            New notification
                        </button>
                    </div>
                </div>

                <div className="admin-notification-stats">
                    {visibleStats.map(
                        (stat) => {
                            const Icon =
                                stat.icon;

                            return (
                                <div
                                    className={`admin-notification-stat stat-${stat.tone}`}
                                    key={
                                        stat.label
                                    }
                                >
                                    <div className="admin-notification-stat-icon">
                                        <Icon
                                            size={20}
                                        />
                                    </div>

                                    <div>
                                        <span>
                                            {
                                                stat.label
                                            }
                                        </span>

                                        <strong>
                                            {
                                                stat.value
                                            }
                                        </strong>
                                    </div>
                                </div>
                            );
                        }
                    )}
                </div>

                <div className="admin-notification-insight">
                    <div className="admin-notification-insight-icon">
                        <Megaphone size={20} />
                    </div>

                    <div>
                        <strong>
                            Notification overview
                        </strong>

                        <p>
                            {summary
                                ? `${formatNumber(
                                      summary.totalRead
                                  )} notifications have been read, while ${formatNumber(
                                      summary.unreadNotifications
                                  )} remain unread.`
                                : "Loading notification statistics..."}
                        </p>
                    </div>
                </div>

                <div className="admin-notification-toolbar">
                    <div className="admin-notification-search">
                        <Search size={18} />

                        <input
                            type="search"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target
                                        .value
                                )
                            }
                            placeholder="Search notifications..."
                        />
                    </div>

                    <div className="admin-notification-filter">
                        <Filter size={17} />

                        <select
                            value={typeFilter}
                            onChange={(event) =>
                                setTypeFilter(
                                    event.target
                                        .value
                                )
                            }
                        >
                            <option value="all">
                                All types
                            </option>

                            {Object.entries(
                                typeLabels
                            ).map(
                                ([
                                    value,
                                    label,
                                ]) => (
                                    <option
                                        key={
                                            value
                                        }
                                        value={
                                            value
                                        }
                                    >
                                        {label}
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    <div className="admin-notification-filter">
                        <Clock3 size={17} />

                        <select
                            value={
                                statusFilter
                            }
                            onChange={(event) =>
                                setStatusFilter(
                                    event.target
                                        .value
                                )
                            }
                        >
                            <option value="all">
                                All statuses
                            </option>
                            <option value="active">
                                Active
                            </option>
                            <option value="draft">
                                Draft
                            </option>
                            <option value="scheduled">
                                Scheduled
                            </option>
                            <option value="disabled">
                                Disabled
                            </option>
                        </select>
                    </div>
                </div>

                {error && (
                    <div className="admin-notification-error">
                        <strong>
                            Something went wrong
                        </strong>

                        <p>{error}</p>

                        <button
                            type="button"
                            onClick={() =>
                                loadData()
                            }
                        >
                            Try again
                        </button>
                    </div>
                )}

                <div className="admin-notification-table-card">
                    <div className="admin-notification-table-header">
                        <div>
                            <span>
                                Notification
                            </span>
                        </div>

                        <div>
                            <span>
                                Type
                            </span>
                        </div>

                        <div>
                            <span>
                                Audience
                            </span>
                        </div>

                        <div>
                            <span>
                                Reach
                            </span>
                        </div>

                        <div>
                            <span>
                                Status
                            </span>
                        </div>

                        <div>
                            <span>
                                Created
                            </span>
                        </div>

                        <div>
                            <span>
                                Actions
                            </span>
                        </div>
                    </div>

                    {loading ? (
                        <div className="admin-notification-loading">
                            <div className="admin-loading-spinner" />

                            <span>
                                Loading notifications...
                            </span>
                        </div>
                    ) : notifications.length ===
                      0 ? (
                        <div className="admin-notification-empty">
                            <div>
                                <Bell
                                    size={30}
                                />
                            </div>

                            <h3>
                                No notifications found
                            </h3>

                            <p>
                                Try changing your
                                search or filters.
                            </p>
                        </div>
                    ) : (
                        <div className="admin-notification-table-body">
                            {notifications.map(
                                (
                                    notification
                                ) => {
                                    const readRate =
                                        getReadRate(
                                            notification
                                        );

                                    return (
                                        <div
                                            className="admin-notification-row"
                                            key={
                                                notification.id
                                            }
                                        >
                                            <div className="admin-notification-main-cell">
                                                <div className="admin-notification-row-icon">
                                                    <Bell
                                                        size={
                                                            17
                                                        }
                                                    />
                                                </div>

                                                <div>
                                                    <strong>
                                                        {
                                                            notification.title
                                                        }
                                                    </strong>

                                                    <span>
                                                        {
                                                            notification.message
                                                        }
                                                    </span>
                                                </div>
                                            </div>

                                            <div>
                                                <span className="admin-notification-type">
                                                    {
                                                        typeLabels[
                                                            notification
                                                                .type
                                                        ] ||
                                                            notification.type
                                                    }
                                                </span>
                                            </div>

                                            <div>
                                                <span className="admin-notification-audience">
                                                    {
                                                        audienceLabels[
                                                            notification
                                                                .audience
                                                        ] ||
                                                            notification.audience
                                                    }
                                                </span>
                                            </div>

                                            <div className="admin-notification-reach">
                                                <strong>
                                                    {formatNumber(
                                                        notification.recipients
                                                    )}
                                                </strong>

                                                <div className="admin-notification-progress">
                                                    <span
                                                        style={{
                                                            width: `${readRate}%`,
                                                        }}
                                                    />
                                                </div>

                                                <small>
                                                    {readRate}%
                                                    read
                                                </small>
                                            </div>

                                            <div>
                                                <span
                                                    className={`admin-notification-status status-${notification.status}`}
                                                >
                                                    {
                                                        notification.status
                                                    }
                                                </span>
                                            </div>

                                            <div className="admin-notification-date">
                                                {
                                                    formatDate(
                                                        notification.createdAt
                                                    )
                                                }
                                            </div>

                                            <div className="admin-notification-actions">
                                                <button
                                                    type="button"
                                                    title="View"
                                                    onClick={() =>
                                                        handleView(
                                                            notification.id
                                                        )
                                                    }
                                                >
                                                    <Eye
                                                        size={
                                                            17
                                                        }
                                                    />
                                                </button>

                                                <button
                                                    type="button"
                                                    title="Edit"
                                                    onClick={() =>
                                                        openEditComposer(
                                                            notification.id
                                                        )
                                                    }
                                                >
                                                    <Edit3
                                                        size={
                                                            17
                                                        }
                                                    />
                                                </button>

                                                <button
                                                    type="button"
                                                    title={
                                                        notification.status ===
                                                        "active"
                                                            ? "Disable"
                                                            : "Enable"
                                                    }
                                                    onClick={() =>
                                                        handleToggle(
                                                            notification
                                                        )
                                                    }
                                                >
                                                    <CheckCircle2
                                                        size={
                                                            17
                                                        }
                                                    />
                                                </button>

                                                <button
                                                    type="button"
                                                    className="danger"
                                                    title="Delete"
                                                    onClick={() =>
                                                        handleDelete(
                                                            notification
                                                        )
                                                    }
                                                >
                                                    <Trash2
                                                        size={
                                                            17
                                                        }
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    )}
                </div>

                <div className="admin-notification-mobile-list">
                    {loading ? (
                        <div className="admin-notification-loading">
                            <div className="admin-loading-spinner" />
                            <span>
                                Loading notifications...
                            </span>
                        </div>
                    ) : (
                        notifications.map(
                            (notification) => (
                                <article
                                    className="admin-notification-mobile-card"
                                    key={
                                        notification.id
                                    }
                                >
                                    <div className="admin-notification-mobile-top">
                                        <div className="admin-notification-row-icon">
                                            <Bell
                                                size={
                                                    17
                                                }
                                            />
                                        </div>

                                        <div>
                                            <strong>
                                                {
                                                    notification.title
                                                }
                                            </strong>

                                            <span>
                                                {
                                                    notification.message
                                                }
                                            </span>
                                        </div>
                                    </div>

                                    <div className="admin-notification-mobile-meta">
                                        <span>
                                            {
                                                typeLabels[
                                                    notification
                                                        .type
                                                ]
                                            }
                                        </span>

                                        <span>
                                            {
                                                audienceLabels[
                                                    notification
                                                        .audience
                                                ]
                                            }
                                        </span>

                                        <span
                                            className={`admin-notification-status status-${notification.status}`}
                                        >
                                            {
                                                notification.status
                                            }
                                        </span>
                                    </div>

                                    <div className="admin-notification-mobile-reach">
                                        <div>
                                            <span>
                                                Recipients
                                            </span>
                                            <strong>
                                                {formatNumber(
                                                    notification.recipients
                                                )}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                Read
                                            </span>
                                            <strong>
                                                {getReadRate(
                                                    notification
                                                )}
                                                %
                                            </strong>
                                        </div>
                                    </div>

                                    <div className="admin-notification-mobile-actions">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleView(
                                                    notification.id
                                                )
                                            }
                                        >
                                            <Eye
                                                size={
                                                    16
                                                }
                                            />
                                            View
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                openEditComposer(
                                                    notification.id
                                                )
                                            }
                                        >
                                            <Edit3
                                                size={
                                                    16
                                                }
                                            />
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleToggle(
                                                    notification
                                                )
                                            }
                                        >
                                            <CheckCircle2
                                                size={
                                                    16
                                                }
                                            />
                                            {notification.status ===
                                            "active"
                                                ? "Disable"
                                                : "Enable"}
                                        </button>
                                    </div>
                                </article>
                            )
                        )
                    )}
                </div>
            </div>

            {selectedNotification && (
                <div
                    className="admin-notification-modal-backdrop"
                    onMouseDown={() =>
                        setSelectedNotification(
                            null
                        )
                    }
                >
                    <div
                        className="admin-notification-modal"
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="admin-notification-modal-header">
                            <div>
                                <span>
                                    Notification details
                                </span>

                                <h2>
                                    {
                                        selectedNotification.title
                                    }
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedNotification(
                                        null
                                    )
                                }
                                aria-label="Close"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="admin-notification-modal-body">
                            <div className="admin-notification-detail-message">
                                {
                                    selectedNotification.message
                                }
                            </div>

                            <div className="admin-notification-detail-grid">
                                <div>
                                    <span>
                                        Type
                                    </span>

                                    <strong>
                                        {
                                            typeLabels[
                                                selectedNotification
                                                    .type
                                            ]
                                        }
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Audience
                                    </span>

                                    <strong>
                                        {
                                            audienceLabels[
                                                selectedNotification
                                                    .audience
                                            ]
                                        }
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Status
                                    </span>

                                    <strong>
                                        {
                                            selectedNotification.status
                                        }
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Recipients
                                    </span>

                                    <strong>
                                        {formatNumber(
                                            selectedNotification.recipients
                                        )}
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Read
                                    </span>

                                    <strong>
                                        {formatNumber(
                                            selectedNotification.readCount
                                        )}
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Read rate
                                    </span>

                                    <strong>
                                        {getReadRate(
                                            selectedNotification
                                        )}
                                        %
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Created
                                    </span>

                                    <strong>
                                        {formatDateTime(
                                            selectedNotification.createdAt
                                        )}
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Sent
                                    </span>

                                    <strong>
                                        {formatDateTime(
                                            selectedNotification.sentAt
                                        )}
                                    </strong>
                                </div>
                            </div>
                        </div>

                        <div className="admin-notification-modal-footer">
                            <button
                                type="button"
                                className="admin-secondary-button"
                                onClick={() =>
                                    openEditComposer(
                                        selectedNotification.id
                                    )
                                }
                            >
                                <Edit3 size={17} />
                                Edit
                            </button>

                            <button
                                type="button"
                                className="admin-primary-button"
                                onClick={() =>
                                    handleToggle(
                                        selectedNotification
                                    )
                                }
                            >
                                <CheckCircle2
                                    size={17}
                                />
                                {selectedNotification.status ===
                                "active"
                                    ? "Disable"
                                    : "Enable"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showComposer && (
                <div
                    className="admin-notification-modal-backdrop"
                    onMouseDown={closeComposer}
                >
                    <form
                        className="admin-notification-composer"
                        onSubmit={
                            handleSubmit
                        }
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="admin-notification-modal-header">
                            <div>
                                <span>
                                    Notification composer
                                </span>

                                <h2>
                                    {editingId
                                        ? "Edit notification"
                                        : "Create notification"}
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={
                                    closeComposer
                                }
                                aria-label="Close"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="admin-notification-composer-body">
                            <label>
                                <span>
                                    Title
                                </span>

                                <input
                                    type="text"
                                    name="title"
                                    value={
                                        form.title
                                    }
                                    onChange={
                                        handleFormChange
                                    }
                                    placeholder="Enter notification title"
                                    maxLength={
                                        120
                                    }
                                />
                            </label>

                            <label>
                                <span>
                                    Message
                                </span>

                                <textarea
                                    name="message"
                                    value={
                                        form.message
                                    }
                                    onChange={
                                        handleFormChange
                                    }
                                    placeholder="Write the notification message..."
                                    rows={5}
                                    maxLength={
                                        500
                                    }
                                />
                            </label>

                            <div className="admin-notification-form-grid">
                                <label>
                                    <span>
                                        Type
                                    </span>

                                    <select
                                        name="type"
                                        value={
                                            form.type
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                    >
                                        {Object.entries(
                                            typeLabels
                                        ).map(
                                            ([
                                                value,
                                                label,
                                            ]) => (
                                                <option
                                                    key={
                                                        value
                                                    }
                                                    value={
                                                        value
                                                    }
                                                >
                                                    {
                                                        label
                                                    }
                                                </option>
                                            )
                                        )}
                                    </select>
                                </label>

                                <label>
                                    <span>
                                        Audience
                                    </span>

                                    <select
                                        name="audience"
                                        value={
                                            form.audience
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                    >
                                        {Object.entries(
                                            audienceLabels
                                        ).map(
                                            ([
                                                value,
                                                label,
                                            ]) => (
                                                <option
                                                    key={
                                                        value
                                                    }
                                                    value={
                                                        value
                                                    }
                                                >
                                                    {
                                                        label
                                                    }
                                                </option>
                                            )
                                        )}
                                    </select>
                                </label>

                                <label>
                                    <span>
                                        Status
                                    </span>

                                    <select
                                        name="status"
                                        value={
                                            form.status
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                    >
                                        <option value="draft">
                                            Draft
                                        </option>

                                        <option value="active">
                                            Active
                                        </option>

                                        <option value="scheduled">
                                            Scheduled
                                        </option>
                                    </select>
                                </label>

                                {form.status ===
                                    "scheduled" && (
                                    <label>
                                        <span>
                                            Schedule
                                            date
                                        </span>

                                        <input
                                            type="datetime-local"
                                            name="scheduledAt"
                                            value={
                                                form.scheduledAt
                                            }
                                            onChange={
                                                handleFormChange
                                            }
                                        />
                                    </label>
                                )}
                            </div>
                        </div>

                        <div className="admin-notification-composer-footer">
                            <button
                                type="button"
                                className="admin-secondary-button"
                                onClick={
                                    closeComposer
                                }
                                disabled={
                                    saving
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="admin-primary-button"
                                disabled={
                                    saving
                                }
                            >
                                {saving ? (
                                    <>
                                        <RefreshCw
                                            size={
                                                17
                                            }
                                            className="admin-spin"
                                        />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        {form.status ===
                                        "active" ? (
                                            <Send
                                                size={
                                                    17
                                                }
                                            />
                                        ) : (
                                            <Edit3
                                                size={
                                                    17
                                                }
                                            />
                                        )}

                                        {editingId
                                            ? "Save changes"
                                            : form.status ===
                                              "active"
                                            ? "Create & activate"
                                            : "Save notification"}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </section>
    );
}

export default AdminNotificationsPage;