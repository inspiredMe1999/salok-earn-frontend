// src/services/mock/settingsService.js

import {
    defaultSettings,
    settingsOptions,
} from "../../data/settingsData";

const STORAGE_KEY = "salok_settings_mock";

const MOCK_DELAY = 400;

function delay() {
    return new Promise((resolve) => {
        setTimeout(resolve, MOCK_DELAY);
    });
}

function cloneData(data) {
    return JSON.parse(JSON.stringify(data));
}

function loadStoredSettings() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);

        if (!stored) {
            return cloneData(defaultSettings);
        }

        const parsed = JSON.parse(stored);

        return {
            ...cloneData(defaultSettings),
            ...parsed,

            notifications: {
                ...cloneData(defaultSettings.notifications),
                ...(parsed.notifications || {}),
            },

            privacy: {
                ...cloneData(defaultSettings.privacy),
                ...(parsed.privacy || {}),
            },
        };
    } catch (error) {
        console.error(
            "Failed to load mock settings:",
            error
        );

        return cloneData(defaultSettings);
    }
}

function saveStoredSettings(settings) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(settings)
    );
}

export async function getSettings() {
    await delay();

    return {
        success: true,
        data: loadStoredSettings(),
    };
}

export async function getSettingsOptions() {
    await delay();

    return {
        success: true,
        data: cloneData(settingsOptions),
    };
}

export async function getSettingsPageData() {
    await delay();

    return {
        success: true,
        data: {
            settings: loadStoredSettings(),
            options: cloneData(settingsOptions),
        },
    };
}

export async function updateSettings(
    settingsData = {}
) {
    await delay();

    try {
        const currentSettings =
            loadStoredSettings();

        const updatedSettings = {
            ...currentSettings,
            ...settingsData,

            notifications: {
                ...currentSettings.notifications,
                ...(settingsData.notifications || {}),
            },

            privacy: {
                ...currentSettings.privacy,
                ...(settingsData.privacy || {}),
            },
        };

        saveStoredSettings(updatedSettings);

        return {
            success: true,
            message: "Settings saved successfully.",
            data: cloneData(updatedSettings),
        };
    } catch (error) {
        console.error(
            "Failed to update settings:",
            error
        );

        return {
            success: false,
            message:
                "Unable to save your settings.",
        };
    }
}

export async function resetSettings() {
    await delay();

    const settings =
        cloneData(defaultSettings);

    saveStoredSettings(settings);

    return {
        success: true,
        message: "Settings restored to default.",
        data: settings,
    };
}

export async function updateNotificationSettings(
    notificationData = {}
) {
    await delay();

    const currentSettings =
        loadStoredSettings();

    const updatedSettings = {
        ...currentSettings,

        notifications: {
            ...currentSettings.notifications,
            ...notificationData,
        },
    };

    saveStoredSettings(updatedSettings);

    return {
        success: true,
        message:
            "Notification settings updated.",
        data: cloneData(updatedSettings),
    };
}

export async function updatePrivacySettings(
    privacyData = {}
) {
    await delay();

    const currentSettings =
        loadStoredSettings();

    const updatedSettings = {
        ...currentSettings,

        privacy: {
            ...currentSettings.privacy,
            ...privacyData,
        },
    };

    saveStoredSettings(updatedSettings);

    return {
        success: true,
        message:
            "Privacy settings updated.",
        data: cloneData(updatedSettings),
    };
}

const settingsService = {
    getSettings,
    getSettingsOptions,
    getSettingsPageData,
    updateSettings,
    resetSettings,
    updateNotificationSettings,
    updatePrivacySettings,
};

export default settingsService;