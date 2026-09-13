// src/pages/user/NotificationsPage.jsx

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowDownLeft,
    ArrowRight,
    Bell,
    Brain,
    Check,
    CheckCircle2,
    Clock3,
    Search,
    Shield,
    Sparkles,
    Trophy,
    Users,
    Wallet,
    Zap,
} from "lucide-react";
import { toast } from "sonner";

import notificationService from "../../services/mock/notificationService";
import {
    notificationTypes,
} from "../../data/notificationData";

import "./notifications.css";

const iconMap = {
    wallet: Wallet,
    brain: Brain,
    "arrow-down-left": ArrowDownLeft,
    users: Users,
    "check-circle": CheckCircle2,
    sparkles: Sparkles,
    shield: Shield,
    zap: Zap,
};

function formatNumber(value) {
    return new Intl.NumberFormat("en-US").format(
        value
    );
}

function formatAmount(value) {
    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(value);
}

function formatNotificationDate(dateString) {
    const date = new Date(dateString);

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(date);
}

function getRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();

    const difference =
        Math.floor(
            (now.getTime() - date.getTime()) /
            1000
        );

    if (difference < 60) {
        return "Just now";
    }

    const minutes = Math.floor(
        difference / 60
    );

    if (minutes < 60) {
        return `${minutes}m ago`;
    }

    const hours = Math.floor(
        minutes / 60
    );

    if (hours < 24) {
        return `${hours}h ago`;
    }

    const days = Math.floor(
        hours / 24
    );

    if (days < 7) {
        return `${days}d ago`;
    }

    return formatNotificationDate(
        dateString
    );
}

function getTypeLabel(type) {
    const found = notificationTypes.find(
        (item) => item.id === type
    );

    return found?.label || "Notification";
}

function NotificationIcon({ type }) {
    const Icon =
        iconMap[type] || Bell;

    return (
        <div
            className={`notification-icon notification-icon-${type}`}
        >
            <Icon size={20} />
        </div>
    );
}

function NotificationItem({
    notification,
    onRead,
}) {
    const handleMarkRead = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (notification.isRead) {
            return;
        }

        const response =
            await notificationService.markNotificationAsRead(
                notification.id
            );

        if (response.success) {
            onRead(notification.id);
        }
    };

    return (
        <article
            className={`notification-item ${!notification.isRead
                    ? "is-unread"
                    : ""
                }`}
        >
            <NotificationIcon
                type={notification.icon}
            />

            <div className="notification-main">
                <div className="notification-top">
                    <div className="notification-heading">
                        <h3>
                            {notification.title}
                        </h3>

                        {!notification.isRead && (
                            <span className="unread-dot" />
                        )}
                    </div>

                    <span className="notification-time">
                        {getRelativeTime(
                            notification.createdAt
                        )}
                    </span>
                </div>

                <p className="notification-message">
                    {notification.message}
                </p>

                <p className="notification-description">
                    {notification.description}
                </p>

                <div className="notification-footer">
                    <span
                        className={`notification-type notification-type-${notification.type}`}
                    >
                        {getTypeLabel(
                            notification.type
                        )}
                    </span>

                    {notification.amount !==
                        null &&
                        notification.amount !==
                        undefined && (
                            <span className="notification-amount">
                                +
                                {formatAmount(
                                    notification.amount
                                )}{" "}
                                {
                                    notification.currency
                                }
                            </span>
                        )}

                    <div className="notification-actions">
                        {!notification.isRead && (
                            <button
                                type="button"
                                className="notification-read-button"
                                onClick={
                                    handleMarkRead
                                }
                            >
                                <Check
                                    size={14}
                                />
                                Mark read
                            </button>
                        )}

                        {notification.actionPath && (
                            <Link
                                to={
                                    notification.actionPath
                                }
                                className="notification-action-link"
                                onClick={
                                    handleMarkRead
                                }
                            >
                                {
                                    notification.actionLabel
                                }
                                <ArrowRight
                                    size={14}
                                />
                            </Link>
                        )}
                    </div>
                </div>
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
        <div className="notification-summary-card">
            <div className="notification-summary-icon">
                <Icon size={19} />
            </div>

            <div>
                <span>
                    {label}
                </span>

                <strong>
                    {value}
                </strong>

                <small>
                    {description}
                </small>
            </div>
        </div>
    );
}

function NotificationsPage() {
    const [notifications, setNotifications] =
        useState([]);

    const [summary, setSummary] =
        useState({
            total: 0,
            unread: 0,
            read: 0,
        });

    const [activeType, setActiveType] =
        useState("all");

    const [searchTerm, setSearchTerm] =
        useState("");

    const [unreadOnly, setUnreadOnly] =
        useState(false);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [
        markingAllRead,
        setMarkingAllRead,
    ] = useState(false);

    useEffect(() => {
        loadNotifications();
    }, [
        activeType,
        unreadOnly,
        searchTerm,
    ]);

    async function loadNotifications() {
        try {
            setLoading(true);
            setError("");

            const [
                notificationResponse,
                summaryResponse,
            ] = await Promise.all([
                notificationService.getNotifications(
                    {
                        type: activeType,
                        unreadOnly,
                        searchTerm,
                    }
                ),
                notificationService.getNotificationSummary(),
            ]);

            if (
                !notificationResponse?.success
            ) {
                throw new Error(
                    notificationResponse?.message ||
                    "Unable to load notifications."
                );
            }

            if (
                !summaryResponse?.success
            ) {
                throw new Error(
                    summaryResponse?.message ||
                    "Unable to load notification summary."
                );
            }

            setNotifications(
                Array.isArray(
                    notificationResponse.data
                )
                    ? notificationResponse.data
                    : []
            );

            setSummary(
                summaryResponse.data || {
                    total: 0,
                    unread: 0,
                    read: 0,
                }
            );
        } catch (err) {
            console.error(
                "Failed to load notifications:",
                err
            );

            setError(
                err?.message ||
                "We couldn't load your notifications."
            );

            setNotifications([]);
        } finally {
            setLoading(false);
        }
    }

    function handleNotificationRead(
        notificationId
    ) {
        setNotifications(
            (current) =>
                current.map(
                    (notification) =>
                        notification.id ===
                            notificationId
                            ? {
                                ...notification,
                                isRead: true,
                            }
                            : notification
                )
        );

        setSummary(
            (current) => ({
                ...current,
                unread: Math.max(
                    0,
                    current.unread - 1
                ),
                read: current.read + 1,
            })
        );

        toast.success(
            "Notification marked as read."
        );
    }

    async function handleMarkAllRead() {
        if (
            summary.unread === 0 ||
            markingAllRead
        ) {
            return;
        }

        try {
            setMarkingAllRead(true);

            const response =
                await notificationService.markAllNotificationsAsRead();

            if (!response.success) {
                throw new Error(
                    response.message ||
                    "Unable to mark notifications as read."
                );
            }

            setNotifications(
                (current) =>
                    current.map(
                        (notification) => ({
                            ...notification,
                            isRead: true,
                        })
                    )
            );

            setSummary(
                (current) => ({
                    ...current,
                    unread: 0,
                    read: current.total,
                })
            );

            toast.success(
                "All notifications marked as read."
            );
        } catch (err) {
            console.error(err);

            toast.error(
                err?.message ||
                "Unable to mark notifications as read."
            );
        } finally {
            setMarkingAllRead(false);
        }
    }

    const filteredCount = useMemo(
        () => notifications.length,
        [notifications]
    );

    return (
        <div className="notifications-page">
            <div className="notifications-container">
                <header className="notifications-header">
                    <div>
                        {/* <Link
                            to="/dashboard"
                            className="notifications-back"
                        >
                            ← Dashboard
                        </Link> */}

                        <div className="notifications-title-row">
                            <div className="notifications-title-icon">
                                <Bell size={22} />
                            </div>

                            <div>
                                <h1>
                                    Notifications
                                </h1>

                                <p>
                                    Stay updated on
                                    your activity,
                                    rewards and
                                    account.
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="notifications-mark-all"
                        onClick={
                            handleMarkAllRead
                        }
                        disabled={
                            summary.unread ===
                            0 ||
                            markingAllRead
                        }
                    >
                        <CheckCircle2
                            size={17}
                        />

                        {markingAllRead
                            ? "Updating..."
                            : "Mark all as read"}
                    </button>
                </header>

                <section className="notifications-summary-grid">
                    <SummaryCard
                        icon={Bell}
                        label="Total"
                        value={formatNumber(
                            summary.total
                        )}
                        description="All notifications"
                    />

                    <SummaryCard
                        icon={Clock3}
                        label="Unread"
                        value={formatNumber(
                            summary.unread
                        )}
                        description="Need your attention"
                    />

                    <SummaryCard
                        icon={CheckCircle2}
                        label="Read"
                        value={formatNumber(
                            summary.read
                        )}
                        description="Already reviewed"
                    />

                    <SummaryCard
                        icon={Trophy}
                        label="Showing"
                        value={formatNumber(
                            filteredCount
                        )}
                        description="Current results"
                    />
                </section>

                <section className="notifications-toolbar">
                    <div className="notification-tabs">
                        {notificationTypes.map(
                            (type) => (
                                <button
                                    key={
                                        type.id
                                    }
                                    type="button"
                                    className={
                                        activeType ===
                                            type.id
                                            ? "active"
                                            : ""
                                    }
                                    onClick={() =>
                                        setActiveType(
                                            type.id
                                        )
                                    }
                                >
                                    {
                                        type.label
                                    }

                                    {type.id ===
                                        "all" &&
                                        summary.unread >
                                        0 && (
                                            <span>
                                                {
                                                    summary.unread
                                                }
                                            </span>
                                        )}
                                </button>
                            )
                        )}
                    </div>

                    <div className="notifications-tools">
                        <label className="notifications-search">
                            <Search
                                size={17}
                            />

                            <input
                                type="text"
                                placeholder="Search notifications..."
                                value={
                                    searchTerm
                                }
                                onChange={(
                                    event
                                ) =>
                                    setSearchTerm(
                                        event
                                            .target
                                            .value
                                    )
                                }
                            />
                        </label>

                        <label className="notifications-unread-toggle">
                            <input
                                type="checkbox"
                                checked={
                                    unreadOnly
                                }
                                onChange={(
                                    event
                                ) =>
                                    setUnreadOnly(
                                        event
                                            .target
                                            .checked
                                    )
                                }
                            />

                            <span>
                                Unread only
                            </span>
                        </label>
                    </div>
                </section>

                <section className="notifications-list-section">
                    <div className="notifications-list-heading">
                        <div>
                            <span className="section-eyebrow">
                                YOUR ACTIVITY
                            </span>

                            <h2>
                                Recent notifications
                            </h2>
                        </div>

                        {!loading &&
                            !error && (
                                <span className="notifications-count">
                                    {
                                        notifications.length
                                    }{" "}
                                    result
                                    {notifications.length !==
                                        1
                                        ? "s"
                                        : ""}
                                </span>
                            )}
                    </div>

                    {loading && (
                        <div className="notifications-loading">
                            {Array.from({
                                length: 5,
                            }).map(
                                (_, index) => (
                                    <div
                                        className="notification-skeleton"
                                        key={
                                            index
                                        }
                                    >
                                        <div className="skeleton-circle" />

                                        <div className="skeleton-content">
                                            <div className="skeleton-line skeleton-line-short" />
                                            <div className="skeleton-line" />
                                            <div className="skeleton-line skeleton-line-small" />
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    )}

                    {!loading && error && (
                        <div className="notifications-state notifications-error">
                            <div className="notifications-state-icon">
                                <Bell size={25} />
                            </div>

                            <h3>
                                Something went
                                wrong
                            </h3>

                            <p>
                                {error}
                            </p>

                            <button
                                type="button"
                                onClick={
                                    loadNotifications
                                }
                            >
                                Try again
                            </button>
                        </div>
                    )}

                    {!loading &&
                        !error &&
                        notifications.length ===
                        0 && (
                            <div className="notifications-state">
                                <div className="notifications-state-icon">
                                    <Bell
                                        size={27}
                                    />
                                </div>

                                <h3>
                                    No notifications
                                </h3>

                                <p>
                                    {unreadOnly
                                        ? "You have no unread notifications right now."
                                        : searchTerm
                                            ? "No notifications match your search."
                                            : "You're all caught up."}
                                </p>

                                {(searchTerm ||
                                    unreadOnly ||
                                    activeType !==
                                    "all") && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSearchTerm(
                                                    ""
                                                );
                                                setUnreadOnly(
                                                    false
                                                );
                                                setActiveType(
                                                    "all"
                                                );
                                            }}
                                        >
                                            Clear filters
                                        </button>
                                    )}
                            </div>
                        )}

                    {!loading &&
                        !error &&
                        notifications.length >
                        0 && (
                            <div className="notifications-list">
                                {notifications.map(
                                    (
                                        notification
                                    ) => (
                                        <NotificationItem
                                            key={
                                                notification.id
                                            }
                                            notification={
                                                notification
                                            }
                                            onRead={
                                                handleNotificationRead
                                            }
                                        />
                                    )
                                )}
                            </div>
                        )}
                </section>
            </div>
        </div>
    );
}

export default NotificationsPage;