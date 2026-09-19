import { useCallback, useEffect, useState } from "react";

import {
    CalendarClock,
    CheckCircle2,
    ChevronDown,
    Clock3,
    Eye,
    Mail,
    MailCheck,
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
    createAdminBroadcast,
    deleteAdminBroadcast,
    getAdminBroadcast,
    getAdminBroadcastAudiences,
    getAdminBroadcastStatuses,
    getAdminBroadcasts,
    getAdminBroadcastSummary,
    sendAdminBroadcastTest,
} from "../../services/mock/adminService";

import "./admin-broadcasts.css";

function formatDate(value) {
    if (!value) return "—";

    return new Intl.DateTimeFormat("en", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
}

function getStatusLabel(status) {
    return (
        {
            sent: "Sent",
            scheduled: "Scheduled",
            draft: "Draft",
            failed: "Failed",
        }[status] || status
    );
}

function StatusBadge({ status }) {
    const Icon =
        status === "sent"
            ? CheckCircle2
            : status === "scheduled"
                ? CalendarClock
                : status === "failed"
                    ? X
                    : Clock3;

    return (
        <span
            className={`broadcast-status-badge ${status}`}
        >
            <Icon size={13} />
            {getStatusLabel(status)}
        </span>
    );
}

export default function AdminBroadcastsPage() {
    const [summary, setSummary] = useState(null);
    const [audiences, setAudiences] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [broadcasts, setBroadcasts] = useState([]);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [composerOpen, setComposerOpen] =
        useState(false);

    const [previewOpen, setPreviewOpen] =
        useState(false);

    const [detailsOpen, setDetailsOpen] =
        useState(false);

    const [selectedBroadcast, setSelectedBroadcast] =
        useState(null);

    const [testEmail, setTestEmail] =
        useState("");

    const [actionLoading, setActionLoading] =
        useState(false);

    const [form, setForm] = useState({
        subject: "",
        audienceId: "all-users",
        body: "",
    });

    const loadData = useCallback(
        async (showRefresh = false) => {
            try {
                if (showRefresh) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                const [
                    summaryData,
                    audienceData,
                    statusData,
                    broadcastData,
                ] = await Promise.all([
                    getAdminBroadcastSummary(),
                    getAdminBroadcastAudiences(),
                    getAdminBroadcastStatuses(),
                    getAdminBroadcasts({
                        search,
                        status,
                    }),
                ]);

                setSummary(summaryData);
                setAudiences(audienceData);
                setStatuses(statusData);
                setBroadcasts(broadcastData);
            } catch (error) {
                console.error(error);

                toast.error(
                    "Unable to load broadcast data."
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [search, status]
    );

    useEffect(() => {
        loadData();
    }, [loadData]);

    const updateForm = (field, value) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const selectedAudience =
        audiences.find(
            (audience) =>
                audience.id === form.audienceId
        );

    const openDetails = async (id) => {
        const broadcast =
            await getAdminBroadcast(id);

        if (!broadcast) {
            toast.error(
                "Broadcast could not be found."
            );
            return;
        }

        setSelectedBroadcast(broadcast);
        setDetailsOpen(true);
    };

    const handleTestEmail = async () => {
        try {
            setActionLoading(true);

            const result =
                await sendAdminBroadcastTest({
                    ...form,
                    email: testEmail,
                });

            if (!result.success) {
                toast.error(result.message);
                return;
            }

            toast.success(result.message);
            setTestEmail("");
        } catch {
            toast.error(
                "Unable to send test email."
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleCreate = async (action) => {
        try {
            setActionLoading(true);

            const result =
                await createAdminBroadcast({
                    ...form,
                    action,
                });

            if (!result.success) {
                toast.error(result.message);
                return;
            }

            toast.success(result.message);

            setComposerOpen(false);

            setForm({
                subject: "",
                audienceId: "all-users",
                body: "",
            });

            await loadData(true);
        } catch {
            toast.error(
                "Unable to create broadcast."
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Delete this broadcast?"
        );

        if (!confirmed) return;

        try {
            setActionLoading(true);

            const result =
                await deleteAdminBroadcast(id);

            if (!result.success) {
                toast.error(result.message);
                return;
            }

            toast.success(result.message);

            setDetailsOpen(false);
            setSelectedBroadcast(null);

            await loadData(true);
        } catch {
            toast.error(
                "Unable to delete broadcast."
            );
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <section className="admin-broadcasts-page">
            <div className="admin-broadcasts-header">
                <div>
                    <div className="admin-page-eyebrow">
                        Communications
                    </div>

                    <h1>Broadcasts</h1>

                    <p>
                        Create and manage email
                        communications sent to platform
                        users.
                    </p>
                </div>

                <div className="broadcast-header-actions">
                    <button
                        type="button"
                        className="broadcast-refresh-btn"
                        onClick={() =>
                            loadData(true)
                        }
                        disabled={refreshing}
                    >
                        <RefreshCw
                            size={17}
                            className={
                                refreshing
                                    ? "broadcast-spin"
                                    : ""
                            }
                        />

                        Refresh
                    </button>

                    <button
                        type="button"
                        className="broadcast-create-btn"
                        onClick={() =>
                            setComposerOpen(true)
                        }
                    >
                        <Plus size={17} />
                        New broadcast
                    </button>
                </div>
            </div>

            <div className="admin-broadcast-notice">
                <MailCheck size={18} />

                <div>
                    <strong>
                        Mock broadcast mode
                    </strong>

                    <span>
                        Emails are not actually sent.
                        Broadcast actions currently
                        update local mock data only.
                    </span>
                </div>
            </div>

            <div className="admin-broadcast-stats">
                <div className="broadcast-stat-card">
                    <div className="broadcast-stat-icon">
                        <Mail size={19} />
                    </div>

                    <div>
                        <span>
                            Total broadcasts
                        </span>

                        <strong>
                            {summary?.totalBroadcasts ??
                                "—"}
                        </strong>
                    </div>
                </div>

                <div className="broadcast-stat-card">
                    <div className="broadcast-stat-icon success">
                        <MailCheck size={19} />
                    </div>

                    <div>
                        <span>
                            Sent
                        </span>

                        <strong>
                            {summary?.sentBroadcasts ??
                                "—"}
                        </strong>
                    </div>
                </div>

                <div className="broadcast-stat-card">
                    <div className="broadcast-stat-icon">
                        <CalendarClock size={19} />
                    </div>

                    <div>
                        <span>
                            Scheduled
                        </span>

                        <strong>
                            {summary?.scheduledBroadcasts ??
                                "—"}
                        </strong>
                    </div>
                </div>

                <div className="broadcast-stat-card">
                    <div className="broadcast-stat-icon warning">
                        <Clock3 size={19} />
                    </div>

                    <div>
                        <span>
                            Drafts
                        </span>

                        <strong>
                            {summary?.draftBroadcasts ??
                                "—"}
                        </strong>
                    </div>
                </div>

                <div className="broadcast-stat-card">
                    <div className="broadcast-stat-icon">
                        <Users size={19} />
                    </div>

                    <div>
                        <span>
                            Total recipients
                        </span>

                        <strong>
                            {summary?.totalRecipients?.toLocaleString() ??
                                "—"}
                        </strong>
                    </div>
                </div>

                <div className="broadcast-stat-card">
                    <div className="broadcast-stat-icon success">
                        <CheckCircle2 size={19} />
                    </div>

                    <div>
                        <span>
                            Delivered
                        </span>

                        <strong>
                            {summary?.emailsDelivered?.toLocaleString() ??
                                "—"}
                        </strong>
                    </div>
                </div>
            </div>

            <div className="admin-broadcast-panel">
                <div className="admin-broadcast-toolbar">
                    <div className="broadcast-search">
                        <Search size={17} />

                        <input
                            type="search"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search broadcasts..."
                        />
                    </div>

                    <div className="broadcast-filter">
                        <select
                            value={status}
                            onChange={(event) =>
                                setStatus(
                                    event.target.value
                                )
                            }
                        >
                            {statuses.map((item) => (
                                <option
                                    key={item.id}
                                    value={item.id}
                                >
                                    {item.name}
                                </option>
                            ))}
                        </select>

                        <ChevronDown size={15} />
                    </div>
                </div>

                <div className="broadcast-table-wrap">
                    {loading ? (
                        <div className="broadcast-loading">
                            <div className="broadcast-spinner" />
                            <span>
                                Loading broadcasts...
                            </span>
                        </div>
                    ) : broadcasts.length === 0 ? (
                        <div className="broadcast-empty">
                            <Mail size={34} />

                            <h3>
                                No broadcasts found
                            </h3>

                            <p>
                                Try another search or
                                status filter.
                            </p>
                        </div>
                    ) : (
                        <table className="broadcast-table">
                            <thead>
                                <tr>
                                    <th>
                                        Broadcast
                                    </th>
                                    <th>
                                        Audience
                                    </th>
                                    <th>
                                        Recipients
                                    </th>
                                    <th>
                                        Delivered
                                    </th>
                                    <th>
                                        Status
                                    </th>
                                    <th>
                                        Date
                                    </th>
                                    <th />
                                </tr>
                            </thead>

                            <tbody>
                                {broadcasts.map(
                                    (broadcast) => (
                                        <tr
                                            key={
                                                broadcast.id
                                            }
                                        >
                                            <td>
                                                <div className="broadcast-identity">
                                                    <div className="broadcast-mail-icon">
                                                        <Mail
                                                            size={
                                                                17
                                                            }
                                                        />
                                                    </div>

                                                    <div>
                                                        <strong>
                                                            {
                                                                broadcast.subject
                                                            }
                                                        </strong>

                                                        <span>
                                                            {
                                                                broadcast.id
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                <span className="broadcast-audience">
                                                    {
                                                        broadcast.audience
                                                    }
                                                </span>
                                            </td>

                                            <td>
                                                <span className="broadcast-number">
                                                    {broadcast.recipientCount.toLocaleString()}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="broadcast-delivery">
                                                    <strong>
                                                        {broadcast.deliveredCount.toLocaleString()}
                                                    </strong>

                                                    {broadcast.recipientCount >
                                                        0 &&
                                                        broadcast.deliveredCount >
                                                            0 && (
                                                            <span>
                                                                {Math.round(
                                                                    (broadcast.deliveredCount /
                                                                        broadcast.recipientCount) *
                                                                        100
                                                                )}
                                                                %
                                                            </span>
                                                        )}
                                                </div>
                                            </td>

                                            <td>
                                                <StatusBadge
                                                    status={
                                                        broadcast.status
                                                    }
                                                />
                                            </td>

                                            <td>
                                                <span className="broadcast-date">
                                                    {formatDate(
                                                        broadcast.createdAt
                                                    )}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="broadcast-row-actions">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openDetails(
                                                                broadcast.id
                                                            )
                                                        }
                                                        title="View broadcast"
                                                    >
                                                        <Eye
                                                            size={
                                                                16
                                                            }
                                                        />
                                                    </button>

                                                    {broadcast.status ===
                                                        "draft" && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    broadcast.id
                                                                )
                                                            }
                                                            title="Delete draft"
                                                        >
                                                            <Trash2
                                                                size={
                                                                    16
                                                                }
                                                            />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {!loading &&
                    broadcasts.length > 0 && (
                        <div className="broadcast-table-footer">
                            Showing{" "}
                            {broadcasts.length} broadcast
                            {broadcasts.length === 1
                                ? ""
                                : "s"}
                        </div>
                    )}
            </div>

            {composerOpen && (
                <div
                    className="broadcast-modal-backdrop"
                    onMouseDown={() =>
                        setComposerOpen(false)
                    }
                >
                    <div
                        className="broadcast-composer-modal"
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="broadcast-modal-header">
                            <div>
                                <span>
                                    New communication
                                </span>

                                <h2>
                                    Create broadcast
                                </h2>
                            </div>

                            <button
                                type="button"
                                className="broadcast-close-btn"
                                onClick={() =>
                                    setComposerOpen(
                                        false
                                    )
                                }
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="broadcast-composer-grid">
                            <div className="broadcast-form-area">
                                <label>
                                    Subject
                                </label>

                                <input
                                    type="text"
                                    value={
                                        form.subject
                                    }
                                    onChange={(event) =>
                                        updateForm(
                                            "subject",
                                            event.target
                                                .value
                                        )
                                    }
                                    placeholder="Enter email subject..."
                                />

                                <label>
                                    Audience
                                </label>

                                <div className="broadcast-audience-select">
                                    <select
                                        value={
                                            form.audienceId
                                        }
                                        onChange={(event) =>
                                            updateForm(
                                                "audienceId",
                                                event.target
                                                    .value
                                            )
                                        }
                                    >
                                        {audiences.map(
                                            (audience) => (
                                                <option
                                                    key={
                                                        audience.id
                                                    }
                                                    value={
                                                        audience.id
                                                    }
                                                >
                                                    {
                                                        audience.name
                                                    }{" "}
                                                    —{" "}
                                                    {audience.recipientCount.toLocaleString()}{" "}
                                                    recipients
                                                </option>
                                            )
                                        )}
                                    </select>

                                    <ChevronDown
                                        size={15}
                                    />
                                </div>

                                {selectedAudience && (
                                    <div className="selected-audience-info">
                                        <Users size={15} />

                                        <div>
                                            <strong>
                                                {
                                                    selectedAudience.name
                                                }
                                            </strong>

                                            <span>
                                                {
                                                    selectedAudience.description
                                                }
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <label>
                                    Message
                                </label>

                                <textarea
                                    value={form.body}
                                    onChange={(event) =>
                                        updateForm(
                                            "body",
                                            event.target
                                                .value
                                        )
                                    }
                                    rows={12}
                                    placeholder="Write your broadcast message..."
                                />

                                <div className="broadcast-form-footer">
                                    <span>
                                        {
                                            form.body.length
                                        }{" "}
                                        characters
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setPreviewOpen(
                                                true
                                            )
                                        }
                                    >
                                        <Eye size={15} />
                                        Preview
                                    </button>
                                </div>

                                <div className="broadcast-test-row">
                                    <input
                                        type="email"
                                        value={
                                            testEmail
                                        }
                                        onChange={(event) =>
                                            setTestEmail(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        placeholder="Test email address"
                                    />

                                    <button
                                        type="button"
                                        onClick={
                                            handleTestEmail
                                        }
                                        disabled={
                                            actionLoading
                                        }
                                    >
                                        <Send size={15} />
                                        Send test
                                    </button>
                                </div>
                            </div>

                            <div className="broadcast-composer-side">
                                <div className="composer-side-card">
                                    <div className="composer-side-icon">
                                        <Users size={18} />
                                    </div>

                                    <span>
                                        Recipients
                                    </span>

                                    <strong>
                                        {selectedAudience?.recipientCount?.toLocaleString() ??
                                            "0"}
                                    </strong>

                                    <small>
                                        Estimated eligible
                                        recipients
                                    </small>
                                </div>

                                <div className="composer-side-card">
                                    <div className="composer-side-icon">
                                        <Mail size={18} />
                                    </div>

                                    <span>
                                        Delivery
                                    </span>

                                    <strong>
                                        Email
                                    </strong>

                                    <small>
                                        Platform broadcast
                                        channel
                                    </small>
                                </div>

                                <div className="composer-side-tip">
                                    <strong>
                                        Before sending
                                    </strong>

                                    <p>
                                        Review the audience,
                                        subject and message
                                        carefully. Broadcast
                                        sends should be
                                        treated as
                                        administrative actions.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="broadcast-modal-actions">
                            <button
                                type="button"
                                className="broadcast-secondary-btn"
                                onClick={() =>
                                    setComposerOpen(
                                        false
                                    )
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="broadcast-secondary-btn"
                                onClick={() =>
                                    handleCreate(
                                        "draft"
                                    )
                                }
                                disabled={
                                    actionLoading
                                }
                            >
                                Save draft
                            </button>

                            <button
                                type="button"
                                className="broadcast-send-btn"
                                onClick={() =>
                                    handleCreate(
                                        "send"
                                    )
                                }
                                disabled={
                                    actionLoading
                                }
                            >
                                <Send size={15} />
                                Send broadcast
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {previewOpen && (
                <div
                    className="broadcast-modal-backdrop"
                    onMouseDown={() =>
                        setPreviewOpen(false)
                    }
                >
                    <div
                        className="broadcast-preview-modal"
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="broadcast-modal-header">
                            <div>
                                <span>
                                    Email preview
                                </span>

                                <h2>
                                    {form.subject ||
                                        "Untitled broadcast"}
                                </h2>
                            </div>

                            <button
                                type="button"
                                className="broadcast-close-btn"
                                onClick={() =>
                                    setPreviewOpen(
                                        false
                                    )
                                }
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="broadcast-email-preview">
                            <div className="preview-brand">
                                Salok Earn
                            </div>

                            <div className="preview-content">
                                <h3>
                                    {form.subject ||
                                        "Your broadcast subject"}
                                </h3>

                                <p>
                                    {form.body ||
                                        "Your broadcast message will appear here."}
                                </p>
                            </div>

                            <div className="preview-footer">
                                You are receiving this
                                message because you are
                                part of the selected
                                Salok Earn audience.
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {detailsOpen &&
                selectedBroadcast && (
                    <div
                        className="broadcast-modal-backdrop"
                        onMouseDown={() =>
                            setDetailsOpen(false)
                        }
                    >
                        <div
                            className="broadcast-details-modal"
                            onMouseDown={(event) =>
                                event.stopPropagation()
                            }
                        >
                            <div className="broadcast-modal-header">
                                <div>
                                    <span>
                                        Broadcast details
                                    </span>

                                    <h2>
                                        {
                                            selectedBroadcast.subject
                                        }
                                    </h2>
                                </div>

                                <button
                                    type="button"
                                    className="broadcast-close-btn"
                                    onClick={() =>
                                        setDetailsOpen(
                                            false
                                        )
                                    }
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="broadcast-detail-summary">
                                <div>
                                    <span>
                                        Status
                                    </span>

                                    <StatusBadge
                                        status={
                                            selectedBroadcast.status
                                        }
                                    />
                                </div>

                                <div>
                                    <span>
                                        Audience
                                    </span>

                                    <strong>
                                        {
                                            selectedBroadcast.audience
                                        }
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Recipients
                                    </span>

                                    <strong>
                                        {selectedBroadcast.recipientCount.toLocaleString()}
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Delivered
                                    </span>

                                    <strong>
                                        {selectedBroadcast.deliveredCount.toLocaleString()}
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Opened
                                    </span>

                                    <strong>
                                        {selectedBroadcast.openedCount.toLocaleString()}
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Created
                                    </span>

                                    <strong>
                                        {formatDate(
                                            selectedBroadcast.createdAt
                                        )}
                                    </strong>
                                </div>
                            </div>

                            <div className="broadcast-detail-message">
                                <span>
                                    Message
                                </span>

                                <div>
                                    {selectedBroadcast.body ||
                                        "No message body is stored in this mock historical record."}
                                </div>
                            </div>

                            <div className="broadcast-detail-actions">
                                {selectedBroadcast.status ===
                                    "draft" && (
                                    <button
                                        type="button"
                                        className="broadcast-delete-btn"
                                        onClick={() =>
                                            handleDelete(
                                                selectedBroadcast.id
                                            )
                                        }
                                        disabled={
                                            actionLoading
                                        }
                                    >
                                        <Trash2
                                            size={15}
                                        />
                                        Delete draft
                                    </button>
                                )}

                                <button
                                    type="button"
                                    className="broadcast-secondary-btn"
                                    onClick={() =>
                                        setDetailsOpen(
                                            false
                                        )
                                    }
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
        </section>
    );
}