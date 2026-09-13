/*
|--------------------------------------------------------------------------
| Salok Earn — Earn Mock Data
|--------------------------------------------------------------------------
|
| Presentation-only data.
|
| The structure represents earning opportunities that the frontend
| can display. The actual availability, completion and reward
| authorization will eventually come from the backend.
|
|--------------------------------------------------------------------------
*/

export const earnCategories = [
    {
        id: "all",
        label: "All",
    },
    {
        id: "surveys",
        label: "Surveys",
    },
    {
        id: "tasks",
        label: "Tasks",
    },
    {
        id: "offers",
        label: "Offers",
    },
];

export const earningOpportunities = [
    {
        id: "survey-001",
        type: "surveys",
        title: "Quick opinion survey",
        description:
            "Share your opinion on everyday products and services.",
        reward: 80,
        currency: "SAK",
        estimatedMinutes: 8,
        difficulty: "Easy",
        status: "available",
        provider: "Salok Surveys",
        tags: ["Survey", "Opinion"],
    },

    {
        id: "survey-002",
        type: "surveys",
        title: "Shopping habits survey",
        description:
            "Tell us about your recent shopping preferences.",
        reward: 120,
        currency: "SAK",
        estimatedMinutes: 12,
        difficulty: "Easy",
        status: "available",
        provider: "Salok Surveys",
        tags: ["Survey", "Shopping"],
    },

    {
        id: "survey-003",
        type: "surveys",
        title: "Technology preferences",
        description:
            "Answer questions about the technology you use.",
        reward: 150,
        currency: "SAK",
        estimatedMinutes: 15,
        difficulty: "Easy",
        status: "available",
        provider: "Salok Surveys",
        tags: ["Survey", "Technology"],
    },

    {
        id: "task-001",
        type: "tasks",
        title: "Complete your profile",
        description:
            "Review and complete the information on your profile.",
        reward: 50,
        currency: "SAK",
        estimatedMinutes: 5,
        difficulty: "Easy",
        status: "available",
        provider: "Salok Earn",
        tags: ["Task", "Profile"],
    },

    {
        id: "task-002",
        type: "tasks",
        title: "Daily engagement task",
        description:
            "Complete today's simple engagement activity.",
        reward: 65,
        currency: "SAK",
        estimatedMinutes: 6,
        difficulty: "Easy",
        status: "available",
        provider: "Salok Earn",
        tags: ["Task", "Daily"],
    },

    {
        id: "task-003",
        type: "tasks",
        title: "Community participation",
        description:
            "Take part in an eligible community activity.",
        reward: 100,
        currency: "SAK",
        estimatedMinutes: 10,
        difficulty: "Medium",
        status: "available",
        provider: "Salok Earn",
        tags: ["Task", "Community"],
    },

    {
        id: "offer-001",
        type: "offers",
        title: "Discover a new service",
        description:
            "Explore an available partner offer.",
        reward: 200,
        currency: "SAK",
        estimatedMinutes: 10,
        difficulty: "Easy",
        status: "available",
        provider: "Partner Offer",
        tags: ["Offer", "Partner"],
    },

    {
        id: "offer-002",
        type: "offers",
        title: "Try a featured experience",
        description:
            "Complete the requirements for this featured offer.",
        reward: 350,
        currency: "SAK",
        estimatedMinutes: 20,
        difficulty: "Medium",
        status: "available",
        provider: "Partner Offer",
        tags: ["Offer", "Featured"],
    },

    {
        id: "offer-003",
        type: "offers",
        title: "Premium partner offer",
        description:
            "Explore this higher-value partner opportunity.",
        reward: 500,
        currency: "SAK",
        estimatedMinutes: 25,
        difficulty: "Medium",
        status: "available",
        provider: "Partner Offer",
        tags: ["Offer", "High reward"],
    },
];