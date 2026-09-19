export const adminBroadcastSummary = {
    totalBroadcasts: 24,
    sentBroadcasts: 19,
    scheduledBroadcasts: 2,
    draftBroadcasts: 3,
    totalRecipients: 18420,
    emailsDelivered: 17864,
};

export const adminBroadcastAudiences = [
    {
        id: "all-users",
        name: "All Users",
        description:
            "All eligible registered users.",
        recipientCount: 12840,
    },
    {
        id: "active-users",
        name: "Active Users",
        description:
            "Users who have recently used the platform.",
        recipientCount: 8430,
    },
    {
        id: "new-users",
        name: "New Users",
        description:
            "Recently registered users.",
        recipientCount: 1260,
    },
    {
        id: "verified-users",
        name: "Verified Users",
        description:
            "Users with verified email addresses.",
        recipientCount: 10680,
    },
    {
        id: "earners",
        name: "Active Earners",
        description:
            "Users with recent earning activity.",
        recipientCount: 6240,
    },
];

export const adminBroadcastStatuses = [
    {
        id: "all",
        name: "All Statuses",
    },
    {
        id: "sent",
        name: "Sent",
    },
    {
        id: "scheduled",
        name: "Scheduled",
    },
    {
        id: "draft",
        name: "Draft",
    },
    {
        id: "failed",
        name: "Failed",
    },
];

export const adminBroadcastRecords = [
    {
        id: "broadcast-001",
        subject: "Welcome to a new week on Salok Earn",
        audience: "All Users",
        audienceId: "all-users",
        recipientCount: 12840,
        deliveredCount: 12492,
        openedCount: 7210,
        status: "sent",
        createdAt: "2026-09-15T08:30:00Z",
        sentAt: "2026-09-15T09:00:00Z",
        createdBy: "Admin",
    },
    {
        id: "broadcast-002",
        subject: "New earning opportunities are available",
        audience: "Active Earners",
        audienceId: "earners",
        recipientCount: 6240,
        deliveredCount: 6118,
        openedCount: 3814,
        status: "sent",
        createdAt: "2026-09-13T10:15:00Z",
        sentAt: "2026-09-13T11:00:00Z",
        createdBy: "Admin",
    },
    {
        id: "broadcast-003",
        subject: "Important account security reminder",
        audience: "Verified Users",
        audienceId: "verified-users",
        recipientCount: 10680,
        deliveredCount: 10422,
        openedCount: 5941,
        status: "sent",
        createdAt: "2026-09-10T13:20:00Z",
        sentAt: "2026-09-10T14:00:00Z",
        createdBy: "Admin",
    },
    {
        id: "broadcast-004",
        subject: "September rewards update",
        audience: "Active Users",
        audienceId: "active-users",
        recipientCount: 8430,
        deliveredCount: 0,
        openedCount: 0,
        status: "scheduled",
        createdAt: "2026-09-15T16:00:00Z",
        sentAt: "2026-09-18T09:00:00Z",
        createdBy: "Admin",
    },
    {
        id: "broadcast-005",
        subject: "New member tips",
        audience: "New Users",
        audienceId: "new-users",
        recipientCount: 1260,
        deliveredCount: 0,
        openedCount: 0,
        status: "draft",
        createdAt: "2026-09-14T12:10:00Z",
        sentAt: null,
        createdBy: "Admin",
    },
    {
        id: "broadcast-006",
        subject: "Weekend earning activities",
        audience: "Active Earners",
        audienceId: "earners",
        recipientCount: 6240,
        deliveredCount: 6182,
        openedCount: 3650,
        status: "sent",
        createdAt: "2026-09-06T07:45:00Z",
        sentAt: "2026-09-06T08:00:00Z",
        createdBy: "Admin",
    },
    {
        id: "broadcast-007",
        subject: "Platform maintenance notice",
        audience: "All Users",
        audienceId: "all-users",
        recipientCount: 12840,
        deliveredCount: 0,
        openedCount: 0,
        status: "failed",
        createdAt: "2026-09-03T17:30:00Z",
        sentAt: "2026-09-03T18:00:00Z",
        createdBy: "Admin",
    },
];

export const adminBroadcastPageData = {
    summary: adminBroadcastSummary,
    audiences: adminBroadcastAudiences,
    statuses: adminBroadcastStatuses,
    broadcasts: adminBroadcastRecords,
};