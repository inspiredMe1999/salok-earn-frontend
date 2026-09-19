export const adminSystemSummary = {
    systemStatus: "operational",
    maintenanceMode: false,
    lastLeaderboardRepair: "2026-09-15T21:30:00Z",
    lastSystemCheck: "2026-09-16T02:45:00Z",
};

export const adminSystemSections = [
    {
        id: "health",
        name: "System Health",
        description:
            "Review the current state of important platform services.",
    },
    {
        id: "leaderboards",
        name: "Leaderboard Repairs",
        description:
            "Run administrative repair operations for leaderboard data.",
    },
    {
        id: "maintenance",
        name: "Maintenance",
        description:
            "Control maintenance-related platform behavior.",
    },
];

export const adminSystemHealth = [
    {
        id: "firebase",
        name: "Firebase Services",
        status: "operational",
        description:
            "Authentication, Firestore and backend services are available.",
    },
    {
        id: "authentication",
        name: "Authentication",
        status: "operational",
        description:
            "User authentication services are responding normally.",
    },
    {
        id: "firestore",
        name: "Firestore",
        status: "operational",
        description:
            "Database service is operating normally.",
    },
    {
        id: "storage",
        name: "Storage",
        status: "operational",
        description:
            "File storage service is available.",
    },
    {
        id: "functions",
        name: "Cloud Functions",
        status: "operational",
        description:
            "Backend function infrastructure is available.",
    },
];

export const adminSystemRepairs = [
    {
        id: "repair-weekly",
        name: "Repair Weekly Leaderboard",
        code: "repairWeeklyLeaderboard",
        description:
            "Rebuild the current weekly leaderboard from its underlying ranking data.",
        risk: "medium",
        estimatedTime: "Usually under a minute",
        requiresConfirmation: true,
    },
    {
        id: "repair-weekly-since",
        name: "Repair Weekly Leaderboard From Date",
        code: "repairWeeklySince",
        description:
            "Recalculate weekly leaderboard data beginning from a specified date.",
        risk: "high",
        estimatedTime: "May take several minutes",
        requiresConfirmation: true,
        requiresDate: true,
    },
    {
        id: "repair-leaderboards-since",
        name: "Repair Leaderboards From Date",
        code: "repairLeaderboardsSince",
        description:
            "Recalculate leaderboard data across supported periods from a specified date.",
        risk: "high",
        estimatedTime: "May take several minutes",
        requiresConfirmation: true,
        requiresDate: true,
    },
];

export const adminSystemMaintenance = {
    maintenanceMode: false,
    maintenanceTitle: "Salok Earn is under maintenance",
    maintenanceMessage:
        "We are currently performing scheduled maintenance. Please check back shortly.",
    allowAdminAccess: true,
};

export const adminSystemPageData = {
    summary: adminSystemSummary,
    sections: adminSystemSections,
    health: adminSystemHealth,
    repairs: adminSystemRepairs,
    maintenance: adminSystemMaintenance,
};