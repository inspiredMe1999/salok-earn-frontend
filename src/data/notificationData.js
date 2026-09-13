// src/data/notificationData.js

export const NOTIFICATION_TYPES = {
    all: "all",
    earnings: "earnings",
    trivia: "trivia",
    withdrawals: "withdrawals",
    referrals: "referrals",
    system: "system",
    security: "security",
};

export const notificationTypes = [
    {
        id: "all",
        label: "All",
    },
    {
        id: "earnings",
        label: "Earnings",
    },
    {
        id: "trivia",
        label: "Trivia",
    },
    {
        id: "withdrawals",
        label: "Withdrawals",
    },
    {
        id: "referrals",
        label: "Referrals",
    },
    {
        id: "system",
        label: "System",
    },
    {
        id: "security",
        label: "Security",
    },
];

export const notifications = [
    {
        id: "notification-001",
        type: "earnings",
        title: "You earned 80 SAK",
        message:
            "You completed a trivia round and earned 80 SAK.",
        description:
            "Your reward has been added to your available balance.",
        amount: 80,
        currency: "SAK",
        isRead: false,
        createdAt: "2026-09-12T00:35:00",
        actionLabel: "View wallet",
        actionPath: "/wallet",
        icon: "wallet",
    },

    {
        id: "notification-002",
        type: "trivia",
        title: "Trivia round completed",
        message:
            "Nice work! You completed a General Knowledge trivia round.",
        description:
            "You answered 4 out of 5 questions correctly.",
        amount: 80,
        currency: "SAK",
        isRead: false,
        createdAt: "2026-09-11T22:10:00",
        actionLabel: "View results",
        actionPath: "/trivia",
        icon: "brain",
    },

    {
        id: "notification-003",
        type: "withdrawals",
        title: "Withdrawal is being processed",
        message:
            "Your 1,500 SAK withdrawal is currently being processed.",
        description:
            "We will notify you when the withdrawal has been completed.",
        amount: 1500,
        currency: "SAK",
        isRead: false,
        createdAt: "2026-09-11T18:42:00",
        actionLabel: "View withdrawal",
        actionPath: "/wallet/withdrawals",
        icon: "arrow-down-left",
    },

    {
        id: "notification-004",
        type: "referrals",
        title: "Referral milestone reached",
        message:
            "You've reached 5 successful referrals.",
        description:
            "You've unlocked the next referral milestone in your mock account.",
        amount: 500,
        currency: "SAK",
        isRead: true,
        createdAt: "2026-09-11T15:20:00",
        actionLabel: "View referrals",
        actionPath: "/referrals",
        icon: "users",
    },

    {
        id: "notification-005",
        type: "earnings",
        title: "Task reward received",
        message:
            "You earned 65 SAK from a completed task.",
        description:
            "The reward has been added to your wallet.",
        amount: 65,
        currency: "SAK",
        isRead: true,
        createdAt: "2026-09-11T11:30:00",
        actionLabel: "View wallet",
        actionPath: "/wallet",
        icon: "check-circle",
    },

    {
        id: "notification-006",
        type: "system",
        title: "New earning opportunities available",
        message:
            "Fresh surveys, tasks and offers are now available.",
        description:
            "Check the Earn section to see what's available.",
        amount: null,
        currency: "SAK",
        isRead: true,
        createdAt: "2026-09-10T16:45:00",
        actionLabel: "Start earning",
        actionPath: "/earn",
        icon: "sparkles",
    },

    {
        id: "notification-007",
        type: "security",
        title: "New sign-in detected",
        message:
            "A new sign-in was detected on your account.",
        description:
            "This is a mock security notification for the frontend preview.",
        amount: null,
        currency: null,
        isRead: true,
        createdAt: "2026-09-10T09:15:00",
        actionLabel: "Review security",
        actionPath: "/security",
        icon: "shield",
    },

    {
        id: "notification-008",
        type: "trivia",
        title: "Your trivia energy is recovering",
        message:
            "You have 9 out of 10 trivia energy available.",
        description:
            "Keep playing while staying within your daily limits.",
        amount: null,
        currency: null,
        isRead: true,
        createdAt: "2026-09-09T20:30:00",
        actionLabel: "Play trivia",
        actionPath: "/trivia",
        icon: "zap",
    },

    {
        id: "notification-009",
        type: "withdrawals",
        title: "Withdrawal completed",
        message:
            "Your 2,000 SAK withdrawal was completed successfully.",
        description:
            "The withdrawal has been marked as completed in your mock account.",
        amount: 2000,
        currency: "SAK",
        isRead: true,
        createdAt: "2026-09-09T14:05:00",
        actionLabel: "View withdrawals",
        actionPath: "/wallet/withdrawals",
        icon: "check-circle",
    },

    {
        id: "notification-010",
        type: "earnings",
        title: "Survey reward received",
        message:
            "You earned 120 SAK from a completed survey.",
        description:
            "Your survey reward has been added to your wallet.",
        amount: 120,
        currency: "SAK",
        isRead: true,
        createdAt: "2026-09-08T12:40:00",
        actionLabel: "View wallet",
        actionPath: "/wallet",
        icon: "wallet",
    },

    {
        id: "notification-011",
        type: "system",
        title: "Welcome to Salok Earn",
        message:
            "Your account is ready. Start exploring ways to earn.",
        description:
            "Complete tasks, answer trivia and explore available opportunities.",
        amount: null,
        currency: null,
        isRead: true,
        createdAt: "2026-09-07T10:00:00",
        actionLabel: "Explore earning",
        actionPath: "/earn",
        icon: "sparkles",
    },
];

export const notificationSummary = {
    total: notifications.length,
    unread: notifications.filter(
        (notification) => !notification.isRead
    ).length,
    read: notifications.filter(
        (notification) => notification.isRead
    ).length,
};

export const mockNotificationUser = {
    uid: "mock-user-001",
    username: "SalokUser",
    displayName: "Salok User",
};

export const notificationPageData = {
    notifications,
    summary: notificationSummary,
    user: mockNotificationUser,
};