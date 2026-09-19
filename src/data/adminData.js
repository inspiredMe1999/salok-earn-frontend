// src/data/adminData.js

export const adminOverview = {
    totalUsers: 12840,
    activeUsers: 9360,
    newUsersToday: 84,
    suspendedUsers: 126,

    totalEarnings: 2846500.75,
    totalWithdrawals: 834250.5,
    pendingWithdrawals: 18,
    pendingWithdrawalAmount: 42650,

    totalReports: 342,
    openReports: 27,
    flaggedAccounts: 14,
    activeDevices: 10890,
};

export const adminTrendData = [
    {
        day: "Mon",
        users: 120,
        earnings: 4200,
        withdrawals: 2100,
    },
    {
        day: "Tue",
        users: 180,
        earnings: 5600,
        withdrawals: 2800,
    },
    {
        day: "Wed",
        users: 145,
        earnings: 4900,
        withdrawals: 2400,
    },
    {
        day: "Thu",
        users: 220,
        earnings: 7200,
        withdrawals: 3400,
    },
    {
        day: "Fri",
        users: 260,
        earnings: 8500,
        withdrawals: 4200,
    },
    {
        day: "Sat",
        users: 310,
        earnings: 9800,
        withdrawals: 5100,
    },
    {
        day: "Sun",
        users: 280,
        earnings: 9100,
        withdrawals: 4700,
    },
];

export const adminRecentUsers = [
    {
        uid: "user-001",
        username: "AdaRewards",
        email: "ada@example.com",
        region: "Nigeria",
        status: "active",
        joinedAt: "2026-09-12T08:30:00",
        earnings: 2450.5,
    },
    {
        uid: "user-002",
        username: "BrightEarns",
        email: "bright@example.com",
        region: "Ghana",
        status: "active",
        joinedAt: "2026-09-12T07:45:00",
        earnings: 1840.25,
    },
    {
        uid: "user-003",
        username: "QuizMaster",
        email: "quiz@example.com",
        region: "Kenya",
        status: "pending",
        joinedAt: "2026-09-12T06:20:00",
        earnings: 620.0,
    },
    {
        uid: "user-004",
        username: "RewardHunter",
        email: "hunter@example.com",
        region: "Nigeria",
        status: "active",
        joinedAt: "2026-09-11T19:10:00",
        earnings: 3980.75,
    },
    {
        uid: "user-005",
        username: "DailyWinner",
        email: "winner@example.com",
        region: "South Africa",
        status: "suspended",
        joinedAt: "2026-09-11T17:40:00",
        earnings: 920.0,
    },
];

export const adminRecentActivities = [
    {
        id: "admin-activity-001",
        type: "user",
        title: "New user registration",
        description:
            "A new member joined the Salok Earn platform.",
        time: "5 minutes ago",
        status: "success",
    },
    {
        id: "admin-activity-002",
        type: "withdrawal",
        title: "Withdrawal awaiting review",
        description:
            "A withdrawal request requires administrator attention.",
        time: "18 minutes ago",
        status: "warning",
    },
    {
        id: "admin-activity-003",
        type: "security",
        title: "Account flagged",
        description:
            "A user account was flagged for additional review.",
        time: "32 minutes ago",
        status: "danger",
    },
    {
        id: "admin-activity-004",
        type: "task",
        title: "Task configuration updated",
        description:
            "An earning task was updated in the mock administration panel.",
        time: "1 hour ago",
        status: "info",
    },
    {
        id: "admin-activity-005",
        type: "user",
        title: "Profile verification completed",
        description:
            "A member completed their profile verification process.",
        time: "2 hours ago",
        status: "success",
    },
];

export const adminQuickActions = [
    {
        id: "users",
        title: "Manage users",
        description:
            "Search, review and manage member accounts.",
        path: "/admin/users",
    },
    {
        id: "withdrawals",
        title: "Review withdrawals",
        description:
            "Inspect pending withdrawal requests.",
        path: "/admin/withdrawals",
    },
    {
        id: "tasks",
        title: "Manage earning tasks",
        description:
            "Create and review earning opportunities.",
        path: "/admin/tasks",
    },
    {
        id: "broadcasts",
        title: "Send broadcast",
        description:
            "Prepare a message for platform members.",
        path: "/admin/broadcasts",
    },
];

export const adminPageData = {
    overview: adminOverview,
    trendData: adminTrendData,
    recentUsers: adminRecentUsers,
    recentActivities: adminRecentActivities,
    quickActions: adminQuickActions,
};