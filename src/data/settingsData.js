// src/data/settingsData.js

export const defaultSettings = {
    theme: "system",

    language: "English",

    timezone: "Africa/Lagos",

    currency: "SAK",

    notifications: {
        earningAlerts: true,
        triviaReminders: true,
        withdrawalUpdates: true,
        communityActivity: true,
        marketing: false,
    },

    privacy: {
        showProfileToCommunity: true,
        showOnlineStatus: true,
        showEarningsOnProfile: false,
        allowCommunityMessages: true,
    },
};

export const settingsOptions = {
    languages: [
        "English",
    ],

    timezones: [
        "Africa/Lagos",
        "Africa/Accra",
        "Africa/Nairobi",
        "Africa/Johannesburg",
        "Europe/London",
        "America/New_York",
    ],

    currencies: [
        "SAK",
    ],

    themes: [
        {
            id: "system",
            name: "System",
            description: "Follow your device appearance.",
        },
        {
            id: "light",
            name: "Light",
            description: "Use a bright interface.",
        },
        {
            id: "dark",
            name: "Dark",
            description: "Use a darker interface.",
        },
    ],
};

export const settingsPageData = {
    settings: defaultSettings,
    options: settingsOptions,
};