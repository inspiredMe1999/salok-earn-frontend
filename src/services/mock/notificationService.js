// src/services/mock/notificationService.js

import {
    notifications,
    notificationSummary,
    mockNotificationUser,
} from "../../data/notificationData";

const MOCK_DELAY = 500;

function delay() {
    return new Promise((resolve) => {
        setTimeout(resolve, MOCK_DELAY);
    });
}

function cloneData(data) {
    return JSON.parse(JSON.stringify(data));
}

function matchesSearch(notification, searchTerm) {
    if (!searchTerm?.trim()) {
        return true;
    }

    const term = searchTerm.toLowerCase().trim();

    return (
        notification.title?.toLowerCase().includes(term) ||
        notification.message?.toLowerCase().includes(term) ||
        notification.description
            ?.toLowerCase()
            .includes(term)
    );
}

export async function getNotifications(options = {}) {
    await delay();

    const {
        type = "all",
        unreadOnly = false,
        searchTerm = "",
    } = options;

    let results = cloneData(notifications);

    if (type !== "all") {
        results = results.filter(
            (notification) =>
                notification.type === type
        );
    }

    if (unreadOnly) {
        results = results.filter(
            (notification) =>
                !notification.isRead
        );
    }

    results = results.filter((notification) =>
        matchesSearch(notification, searchTerm)
    );

    return {
        success: true,
        data: results,
        total: results.length,
    };
}

export async function getNotification(id) {
    await delay();

    const notification = notifications.find(
        (item) => item.id === id
    );

    if (!notification) {
        return {
            success: false,
            message: "Notification not found.",
            data: null,
        };
    }

    return {
        success: true,
        data: cloneData(notification),
    };
}

export async function getNotificationSummary() {
    await delay();

    const summary = {
        total: notifications.length,
        unread: notifications.filter(
            (notification) =>
                !notification.isRead
        ).length,
        read: notifications.filter(
            (notification) =>
                notification.isRead
        ).length,
    };

    return {
        success: true,
        data: cloneData(summary),
    };
}

export async function markNotificationAsRead(id) {
    await delay();

    const notification = notifications.find(
        (item) => item.id === id
    );

    if (!notification) {
        return {
            success: false,
            message: "Notification not found.",
        };
    }

    notification.isRead = true;

    return {
        success: true,
        message: "Notification marked as read.",
        data: cloneData(notification),
    };
}

export async function markAllNotificationsAsRead() {
    await delay();

    notifications.forEach((notification) => {
        notification.isRead = true;
    });

    return {
        success: true,
        message: "All notifications marked as read.",
    };
}

export async function getNotificationUser() {
    await delay();

    return {
        success: true,
        data: cloneData(mockNotificationUser),
    };
}

export async function getNotificationPageData() {
    await delay();

    const summary = {
        total: notifications.length,
        unread: notifications.filter(
            (notification) =>
                !notification.isRead
        ).length,
        read: notifications.filter(
            (notification) =>
                notification.isRead
        ).length,
    };

    return {
        success: true,
        data: {
            notifications: cloneData(notifications),
            summary: cloneData(summary),
            user: cloneData(mockNotificationUser),
        },
    };
}

export async function searchNotifications(
    searchTerm,
    type = "all"
) {
    return getNotifications({
        searchTerm,
        type,
    });
}

export default {
    getNotifications,
    getNotification,
    getNotificationSummary,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getNotificationUser,
    getNotificationPageData,
    searchNotifications,
};