export const adminTaskSummary = {
    totalTasks: 18,
    activeTasks: 12,
    pausedTasks: 4,
    draftTasks: 2,
    completedToday: 284,
    totalRewardsIssued: 18450,
};

export const adminTaskCategories = [
    {
        id: "engagement",
        name: "Engagement",
    },
    {
        id: "profile",
        name: "Profile",
    },
    {
        id: "social",
        name: "Social",
    },
    {
        id: "survey",
        name: "Survey",
    },
    {
        id: "offer",
        name: "Offer",
    },
    {
        id: "partner",
        name: "Partner",
    },
];

export const adminTaskStatuses = [
    {
        id: "active",
        name: "Active",
    },
    {
        id: "paused",
        name: "Paused",
    },
    {
        id: "draft",
        name: "Draft",
    },
];

export const adminTaskRecords = [
    {
        id: "task-001",
        title: "Complete Your Profile",
        description:
            "Complete the required profile information to improve your account experience.",
        category: "profile",
        categoryName: "Profile",
        provider: "Salok Earn",
        reward: 50,
        currency: "SAK",
        status: "active",
        targetCountry: "All countries",
        completionLimit: 1,
        completedCount: 842,
        requirements: [
            "Complete your profile",
            "Provide required demographic information",
        ],
        createdAt: "2026-08-01T09:00:00.000Z",
        updatedAt: "2026-09-10T10:30:00.000Z",
    },

    {
        id: "task-002",
        title: "Daily Platform Engagement",
        description:
            "Complete the daily engagement activity and receive the configured reward.",
        category: "engagement",
        categoryName: "Engagement",
        provider: "Salok Earn",
        reward: 65,
        currency: "SAK",
        status: "active",
        targetCountry: "All countries",
        completionLimit: 1,
        completedCount: 3260,
        requirements: [
            "Complete today's activity",
            "Maintain an active account",
        ],
        createdAt: "2026-07-15T08:00:00.000Z",
        updatedAt: "2026-09-11T12:00:00.000Z",
    },

    {
        id: "task-003",
        title: "Community Participation",
        description:
            "Participate in the Salok Earn community and complete the required activity.",
        category: "social",
        categoryName: "Social",
        provider: "Salok Earn",
        reward: 100,
        currency: "SAK",
        status: "active",
        targetCountry: "Nigeria",
        completionLimit: 1,
        completedCount: 614,
        requirements: [
            "Be an active community member",
            "Complete the participation requirement",
        ],
        createdAt: "2026-08-12T14:00:00.000Z",
        updatedAt: "2026-09-08T15:00:00.000Z",
    },

    {
        id: "task-004",
        title: "Featured Partner Experience",
        description:
            "Visit the featured partner experience and complete the required steps.",
        category: "partner",
        categoryName: "Partner",
        provider: "Partner Network",
        reward: 250,
        currency: "SAK",
        status: "active",
        targetCountry: "Nigeria, Ghana, Kenya",
        completionLimit: 1,
        completedCount: 391,
        requirements: [
            "Open the partner experience",
            "Complete the required steps",
        ],
        createdAt: "2026-08-20T11:00:00.000Z",
        updatedAt: "2026-09-12T09:30:00.000Z",
    },

    {
        id: "task-005",
        title: "Technology Preferences",
        description:
            "Share your technology preferences through the available activity.",
        category: "survey",
        categoryName: "Survey",
        provider: "Survey Partner",
        reward: 150,
        currency: "SAK",
        status: "paused",
        targetCountry: "Nigeria",
        completionLimit: 1,
        completedCount: 128,
        requirements: [
            "Meet the survey eligibility requirements",
            "Complete the activity",
        ],
        createdAt: "2026-08-28T10:00:00.000Z",
        updatedAt: "2026-09-13T16:00:00.000Z",
    },

    {
        id: "task-006",
        title: "Discover a New Service",
        description:
            "Explore a featured service and complete the partner requirements.",
        category: "offer",
        categoryName: "Offer",
        provider: "Offer Partner",
        reward: 300,
        currency: "SAK",
        status: "active",
        targetCountry: "All countries",
        completionLimit: 1,
        completedCount: 742,
        requirements: [
            "Open the offer",
            "Complete the partner requirement",
        ],
        createdAt: "2026-09-01T12:00:00.000Z",
        updatedAt: "2026-09-14T09:00:00.000Z",
    },

    {
        id: "task-007",
        title: "Weekend Bonus Activity",
        description:
            "Complete this temporary weekend activity to earn the configured bonus.",
        category: "engagement",
        categoryName: "Engagement",
        provider: "Salok Earn",
        reward: 120,
        currency: "SAK",
        status: "paused",
        targetCountry: "All countries",
        completionLimit: 1,
        completedCount: 105,
        requirements: [
            "Complete the weekend activity",
        ],
        createdAt: "2026-09-02T08:00:00.000Z",
        updatedAt: "2026-09-13T18:00:00.000Z",
    },

    {
        id: "task-008",
        title: "New Member Welcome Task",
        description:
            "Complete the welcome activity available to newly registered members.",
        category: "engagement",
        categoryName: "Engagement",
        provider: "Salok Earn",
        reward: 75,
        currency: "SAK",
        status: "draft",
        targetCountry: "All countries",
        completionLimit: 1,
        completedCount: 0,
        requirements: [
            "New account",
            "Complete the welcome steps",
        ],
        createdAt: "2026-09-14T08:00:00.000Z",
        updatedAt: "2026-09-14T08:00:00.000Z",
    },
];

export const adminTaskPageData = {
    summary: adminTaskSummary,
    categories: adminTaskCategories,
    statuses: adminTaskStatuses,
    tasks: adminTaskRecords,
};