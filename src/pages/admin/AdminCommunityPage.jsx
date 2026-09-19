import { useEffect, useMemo, useState } from "react";
import {
    AlertTriangle,
    Ban,
    CheckCircle2,
    ChevronDown,
    Eye,
    FileImage,
    Flag,
    Image as ImageIcon,
    MessageSquare,
    RefreshCw,
    Search,
    Shield,
    Trash2,
    UserCheck,
    UserX,
    X,
} from "lucide-react";
import { toast } from "sonner";

import {
    getAdminCommunityMessages,
    getAdminCommunitySummary,
    moderateAdminCommunityMessage,
    toggleAdminCommunityUserBlock,
} from "../../services/mock/adminService";

import "./admin-community.css";


const initialFilters = {
    search: "",
    status: "all",
    type: "all",
    region: "all",
};


function formatDate(date) {
    if (!date) return "—";

    return new Intl.DateTimeFormat("en", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(date));
}


function getStatusLabel(status) {
    const labels = {
        visible: "Visible",
        hidden: "Hidden",
        reported: "Reported",
        removed: "Removed",
    };

    return labels[status] || status;
}


function getStatusClass(status) {
    return `admin-community-status admin-community-status-${status}`;
}


function AdminCommunityPage() {
    const [summary, setSummary] = useState(null);
    const [messages, setMessages] = useState([]);

    const [filters, setFilters] = useState(initialFilters);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [selectedMessage, setSelectedMessage] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const loadData = async (showRefresh = false) => {
        try {
            if (showRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const [summaryResult, messagesResult] =
                await Promise.all([
                    getAdminCommunitySummary(),
                    getAdminCommunityMessages(filters),
                ]);

            if (summaryResult.success) {
                setSummary(summaryResult.data);
            }

            if (messagesResult.success) {
                setMessages(messagesResult.data);
            }
        } catch (error) {
            console.error(error);
            toast.error("Unable to load community data.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };


    useEffect(() => {
        loadData();
    }, [
        filters.search,
        filters.status,
        filters.type,
        filters.region,
    ]);


    const regions = useMemo(() => {
        return [
            "all",
            ...new Set(
                messages.map((message) => message.senderRegion)
            ),
        ];
    }, [messages]);


    const handleFilterChange = (key, value) => {
        setFilters((current) => ({
            ...current,
            [key]: value,
        }));
    };


    const handleModeration = async (message, action) => {
        try {
            setActionLoading(true);

            const reason =
                action === "hide"
                    ? "Hidden during administrative moderation."
                    : action === "remove"
                        ? "Removed for violating community guidelines."
                        : "";

            const result =
                await moderateAdminCommunityMessage(
                    message.id,
                    action,
                    reason
                );

            if (!result.success) {
                toast.error(result.message);
                return;
            }

            toast.success(result.message);

            setSelectedMessage(null);

            await loadData(true);
        } catch (error) {
            console.error(error);
            toast.error("Moderation action failed.");
        } finally {
            setActionLoading(false);
        }
    };


    const handleBlockUser = async (message) => {
        try {
            setActionLoading(true);

            const result =
                await toggleAdminCommunityUserBlock(
                    message.senderUid
                );

            if (!result.success) {
                toast.error(result.message);
                return;
            }

            toast.success(result.message);

            setSelectedMessage((current) => {
                if (!current) return current;

                return {
                    ...current,
                    isBlocked: result.data.isBlocked,
                };
            });

            await loadData(true);
        } catch (error) {
            console.error(error);
            toast.error("Unable to update user access.");
        } finally {
            setActionLoading(false);
        }
    };


    const stats = [
        {
            label: "Total messages",
            value: summary?.totalMessages ?? "—",
            icon: MessageSquare,
            className: "messages",
        },
        {
            label: "Active members",
            value: summary?.activeMembers ?? "—",
            icon: UserCheck,
            className: "members",
        },
        {
            label: "Reported messages",
            value: summary?.reportedMessages ?? "—",
            icon: Flag,
            className: "reported",
        },
        {
            label: "Image messages",
            value: summary?.imageMessages ?? "—",
            icon: FileImage,
            className: "images",
        },
        {
            label: "Hidden messages",
            value: summary?.hiddenMessages ?? "—",
            icon: Eye,
            className: "hidden",
        },
        {
            label: "Blocked users",
            value: summary?.blockedUsers ?? "—",
            icon: Ban,
            className: "blocked",
        },
    ];


    return (
        <section className="admin-community-page">

            <div className="admin-community-header">

                <div>
                    <div className="admin-community-eyebrow">
                        <Shield size={15} />
                        Community operations
                    </div>

                    <h1>Community management</h1>

                    <p>
                        Moderate chat messages, review reports and
                        manage community access.
                    </p>
                </div>

                <div className="admin-community-header-actions">

                    <span className="admin-community-demo-badge">
                        Mock data only
                    </span>

                    <button
                        type="button"
                        className="admin-community-refresh"
                        onClick={() => loadData(true)}
                        disabled={refreshing}
                    >
                        <RefreshCw
                            size={17}
                            className={
                                refreshing
                                    ? "admin-community-spin"
                                    : ""
                            }
                        />

                        Refresh
                    </button>

                </div>

            </div>


            <div className="admin-community-stats">

                {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <div
                            className={`admin-community-stat-card ${stat.className}`}
                            key={stat.label}
                        >
                            <div className="admin-community-stat-icon">
                                <Icon size={19} />
                            </div>

                            <div>
                                <span>{stat.label}</span>
                                <strong>{stat.value}</strong>
                            </div>
                        </div>
                    );
                })}

            </div>


            <div className="admin-community-panel">

                <div className="admin-community-panel-heading">

                    <div>
                        <h2>Community messages</h2>
                        <p>
                            Review conversations and take moderation
                            actions when necessary.
                        </p>
                    </div>

                    <div className="admin-community-result-count">
                        {messages.length} messages
                    </div>

                </div>


                <div className="admin-community-toolbar">

                    <div className="admin-community-search">
                        <Search size={18} />

                        <input
                            type="search"
                            placeholder="Search messages or users..."
                            value={filters.search}
                            onChange={(event) =>
                                handleFilterChange(
                                    "search",
                                    event.target.value
                                )
                            }
                        />
                    </div>


                    <div className="admin-community-select">

                        <select
                            value={filters.status}
                            onChange={(event) =>
                                handleFilterChange(
                                    "status",
                                    event.target.value
                                )
                            }
                        >
                            <option value="all">
                                All statuses
                            </option>

                            <option value="visible">
                                Visible
                            </option>

                            <option value="reported">
                                Reported
                            </option>

                            <option value="hidden">
                                Hidden
                            </option>

                            <option value="removed">
                                Removed
                            </option>
                        </select>

                        <ChevronDown size={16} />

                    </div>


                    <div className="admin-community-select">

                        <select
                            value={filters.type}
                            onChange={(event) =>
                                handleFilterChange(
                                    "type",
                                    event.target.value
                                )
                            }
                        >
                            <option value="all">
                                All types
                            </option>

                            <option value="text">
                                Text
                            </option>

                            <option value="image">
                                Images
                            </option>
                        </select>

                        <ChevronDown size={16} />

                    </div>


                    <div className="admin-community-select">

                        <select
                            value={filters.region}
                            onChange={(event) =>
                                handleFilterChange(
                                    "region",
                                    event.target.value
                                )
                            }
                        >
                            <option value="all">
                                All regions
                            </option>

                            {regions
                                .filter(
                                    (region) => region !== "all"
                                )
                                .map((region) => (
                                    <option
                                        value={region}
                                        key={region}
                                    >
                                        {region}
                                    </option>
                                ))}
                        </select>

                        <ChevronDown size={16} />

                    </div>

                </div>


                {loading ? (
                    <div className="admin-community-state">
                        <RefreshCw
                            size={25}
                            className="admin-community-spin"
                        />

                        <span>
                            Loading community messages...
                        </span>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="admin-community-state">
                        <MessageSquare size={30} />

                        <strong>
                            No messages found
                        </strong>

                        <span>
                            Try changing your filters or search term.
                        </span>
                    </div>
                ) : (
                    <div className="admin-community-message-list">

                        {messages.map((message) => (
                            <article
                                className="admin-community-message"
                                key={message.id}
                            >

                                <div className="admin-community-avatar">
                                    {message.senderInitials}
                                </div>


                                <div className="admin-community-message-main">

                                    <div className="admin-community-message-top">

                                        <div className="admin-community-sender">

                                            <strong>
                                                {message.senderName}
                                            </strong>

                                            <span>
                                                {message.senderRegion}
                                            </span>

                                            {message.isBlocked && (
                                                <span className="admin-community-blocked-label">
                                                    Blocked
                                                </span>
                                            )}

                                        </div>


                                        <div className="admin-community-message-meta">

                                            <span
                                                className={getStatusClass(
                                                    message.status
                                                )}
                                            >
                                                {getStatusLabel(
                                                    message.status
                                                )}
                                            </span>

                                            {message.type === "image" && (
                                                <span className="admin-community-type">
                                                    <ImageIcon size={13} />
                                                    Image
                                                </span>
                                            )}

                                        </div>

                                    </div>


                                    {message.replyTo && (
                                        <div className="admin-community-reply-preview">

                                            <span>
                                                Replying to{" "}
                                                <strong>
                                                    {message.replyTo.senderName}
                                                </strong>
                                            </span>

                                            <p>
                                                {message.replyTo.text}
                                            </p>

                                        </div>
                                    )}


                                    <p className="admin-community-message-text">
                                        {message.text}
                                    </p>


                                    {message.type === "image" && (
                                        <div className="admin-community-image-preview">

                                            <div className="admin-community-image-icon">
                                                <ImageIcon size={25} />
                                            </div>

                                            <div>
                                                <strong>
                                                    {message.imageName}
                                                </strong>

                                                <span>
                                                    Mock image attachment
                                                </span>
                                            </div>

                                        </div>
                                    )}


                                    <div className="admin-community-message-footer">

                                        <span>
                                            {formatDate(
                                                message.createdAt
                                            )}
                                        </span>

                                        {message.reports?.length > 0 && (
                                            <span className="admin-community-report-count">
                                                <AlertTriangle size={14} />
                                                {message.reports.length}{" "}
                                                report
                                                {message.reports.length !== 1
                                                    ? "s"
                                                    : ""}
                                            </span>
                                        )}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setSelectedMessage(
                                                    message
                                                )
                                            }
                                        >
                                            <Eye size={15} />
                                            Review
                                        </button>

                                    </div>

                                </div>

                            </article>
                        ))}

                    </div>
                )}

            </div>


            {selectedMessage && (
                <div
                    className="admin-community-modal-backdrop"
                    onMouseDown={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            setSelectedMessage(null);
                        }
                    }}
                >

                    <div className="admin-community-modal">

                        <div className="admin-community-modal-header">

                            <div>
                                <span>
                                    Message moderation
                                </span>

                                <h2>
                                    Review community message
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedMessage(null)
                                }
                                aria-label="Close"
                            >
                                <X size={20} />
                            </button>

                        </div>


                        <div className="admin-community-modal-body">

                            <div className="admin-community-detail-user">

                                <div className="admin-community-avatar large">
                                    {selectedMessage.senderInitials}
                                </div>

                                <div>
                                    <strong>
                                        {selectedMessage.senderName}
                                    </strong>

                                    <span>
                                        {selectedMessage.senderUid}
                                    </span>

                                    <small>
                                        {selectedMessage.senderRegion}
                                    </small>
                                </div>

                            </div>


                            <div className="admin-community-detail-section">

                                <div className="admin-community-detail-heading">
                                    <span>Message</span>

                                    <span
                                        className={getStatusClass(
                                            selectedMessage.status
                                        )}
                                    >
                                        {getStatusLabel(
                                            selectedMessage.status
                                        )}
                                    </span>
                                </div>

                                <p className="admin-community-detail-message">
                                    {selectedMessage.text}
                                </p>

                            </div>


                            {selectedMessage.replyTo && (
                                <div className="admin-community-detail-section">

                                    <span className="admin-community-detail-label">
                                        Replying to
                                    </span>

                                    <div className="admin-community-reply-box">

                                        <strong>
                                            {selectedMessage.replyTo.senderName}
                                        </strong>

                                        <p>
                                            {selectedMessage.replyTo.text}
                                        </p>

                                    </div>

                                </div>
                            )}


                            {selectedMessage.type === "image" && (
                                <div className="admin-community-detail-section">

                                    <span className="admin-community-detail-label">
                                        Image attachment
                                    </span>

                                    <div className="admin-community-modal-image">

                                        <ImageIcon size={30} />

                                        <strong>
                                            {selectedMessage.imageName}
                                        </strong>

                                        <span>
                                            Mock image attachment
                                        </span>

                                    </div>

                                </div>
                            )}


                            {selectedMessage.reports?.length > 0 && (
                                <div className="admin-community-detail-section">

                                    <div className="admin-community-detail-heading">
                                        <span>
                                            Reports
                                        </span>

                                        <span className="admin-community-report-count">
                                            <Flag size={14} />
                                            {selectedMessage.reports.length}
                                        </span>
                                    </div>

                                    <div className="admin-community-report-list">

                                        {selectedMessage.reports.map(
                                            (report) => (
                                                <div
                                                    className="admin-community-report"
                                                    key={report.id}
                                                >
                                                    <div>
                                                        <strong>
                                                            {report.reason}
                                                        </strong>

                                                        <span>
                                                            Reported by{" "}
                                                            {report.reporter}
                                                        </span>
                                                    </div>

                                                    <time>
                                                        {formatDate(
                                                            report.createdAt
                                                        )}
                                                    </time>
                                                </div>
                                            )
                                        )}

                                    </div>

                                </div>
                            )}


                            <div className="admin-community-detail-grid">

                                <div>
                                    <span>Message ID</span>
                                    <strong>
                                        {selectedMessage.id}
                                    </strong>
                                </div>

                                <div>
                                    <span>Created</span>
                                    <strong>
                                        {formatDate(
                                            selectedMessage.createdAt
                                        )}
                                    </strong>
                                </div>

                                <div>
                                    <span>Type</span>
                                    <strong>
                                        {selectedMessage.type}
                                    </strong>
                                </div>

                                <div>
                                    <span>User access</span>
                                    <strong>
                                        {selectedMessage.isBlocked
                                            ? "Blocked"
                                            : "Active"}
                                    </strong>
                                </div>

                            </div>


                            {selectedMessage.moderationReason && (
                                <div className="admin-community-moderation-note">

                                    <AlertTriangle size={17} />

                                    <div>
                                        <strong>
                                            Moderation note
                                        </strong>

                                        <span>
                                            {
                                                selectedMessage.moderationReason
                                            }
                                        </span>
                                    </div>

                                </div>
                            )}

                        </div>


                        <div className="admin-community-modal-actions">

                            <button
                                type="button"
                                className="admin-community-action secondary"
                                onClick={() =>
                                    handleBlockUser(
                                        selectedMessage
                                    )
                                }
                                disabled={actionLoading}
                            >
                                {selectedMessage.isBlocked ? (
                                    <>
                                        <UserCheck size={16} />
                                        Unblock user
                                    </>
                                ) : (
                                    <>
                                        <UserX size={16} />
                                        Block user
                                    </>
                                )}
                            </button>


                            {selectedMessage.status === "hidden" ||
                                selectedMessage.status === "removed" ? (
                                <button
                                    type="button"
                                    className="admin-community-action success"
                                    onClick={() =>
                                        handleModeration(
                                            selectedMessage,
                                            "show"
                                        )
                                    }
                                    disabled={actionLoading}
                                >
                                    <CheckCircle2 size={16} />
                                    Restore message
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="admin-community-action warning"
                                    onClick={() =>
                                        handleModeration(
                                            selectedMessage,
                                            "hide"
                                        )
                                    }
                                    disabled={actionLoading}
                                >
                                    <Eye size={16} />
                                    Hide message
                                </button>
                            )}


                            <button
                                type="button"
                                className="admin-community-action danger"
                                onClick={() =>
                                    handleModeration(
                                        selectedMessage,
                                        "remove"
                                    )
                                }
                                disabled={actionLoading}
                            >
                                <Trash2 size={16} />
                                Remove
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </section>
    );
}


export default AdminCommunityPage;