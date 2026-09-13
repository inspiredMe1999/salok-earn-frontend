// src/pages/user/SettingsPage.jsx

import { useEffect, useState } from "react";
import {
    ArrowLeft,
    Bell,
    Check,
    ChevronRight,
    Globe,
    KeyRound,
    Lock,
    Moon,
    Palette,
    RotateCcw,
    Save,
    Shield,
    Sun,
    Trash2,
    UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import settingsService from "../../services/mock/settingsService";

import "./settings.css";

function SettingsPage() {
    const [settings, setSettings] = useState(null);

    const [options, setOptions] = useState({
        languages: [],
        timezones: [],
        currencies: [],
        themes: [],
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [resetting, setResetting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        loadSettings();
    }, []);

    useEffect(() => {
        const savedTheme = localStorage.getItem(
            "salok_theme_preference"
        );

        if (savedTheme) {
            applyTheme(savedTheme);
        }
    }, []);

    async function loadSettings() {
        try {
            setLoading(true);
            setError("");

            const response =
                await settingsService.getSettingsPageData();

            if (!response?.success) {
                throw new Error(
                    response?.message ||
                    "Unable to load settings."
                );
            }

            const loadedSettings =
                response.data.settings;

            setSettings(loadedSettings);
            setOptions(response.data.options);

            applyTheme(
                loadedSettings.theme
            );
        } catch (err) {
            console.error(
                "Failed to load settings:",
                err
            );

            setError(
                err?.message ||
                "We couldn't load your settings."
            );
        } finally {
            setLoading(false);
        }
    }

    function updateSetting(key, value) {
        setSettings((current) => ({
            ...current,
            [key]: value,
        }));
    }

    function updateNotification(
        key,
        value
    ) {
        setSettings((current) => ({
            ...current,

            notifications: {
                ...current.notifications,
                [key]: value,
            },
        }));
    }

    function updatePrivacy(key, value) {
        setSettings((current) => ({
            ...current,

            privacy: {
                ...current.privacy,
                [key]: value,
            },
        }));
    }

    function applyTheme(theme) {
        const root = document.documentElement;

        if (theme === "dark") {
            root.classList.add("dark");
        }

        if (theme === "light") {
            root.classList.remove("dark");
        }

        if (theme === "system") {
            const prefersDark = window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;

            root.classList.toggle(
                "dark",
                prefersDark
            );
        }

        // Persist the theme preference.
        localStorage.setItem(
            "salok_theme_preference",
            theme
        );

        // Notify other theme-aware components.
        window.dispatchEvent(
            new CustomEvent(
                "salok-theme-change",
                {
                    detail: theme,
                }
            )
        );
    }

    function handleThemeChange(theme) {
        updateSetting("theme", theme);
        applyTheme(theme);
    }

    async function handleSave() {
        if (!settings) return;

        try {
            setSaving(true);

            const response =
                await settingsService.updateSettings(
                    settings
                );

            if (!response?.success) {
                throw new Error(
                    response?.message ||
                    "Unable to save settings."
                );
            }

            setSettings(response.data);

            applyTheme(
                response.data.theme
            );

            toast.success(
                "Settings saved successfully."
            );
        } catch (err) {
            console.error(
                "Failed to save settings:",
                err
            );

            toast.error(
                err?.message ||
                "Unable to save settings."
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleReset() {
        const confirmed =
            window.confirm(
                "Reset all settings to their default values?"
            );

        if (!confirmed) return;

        try {
            setResetting(true);

            const response =
                await settingsService.resetSettings();

            if (!response?.success) {
                throw new Error(
                    response?.message ||
                    "Unable to reset settings."
                );
            }

            setSettings(response.data);

            applyTheme(
                response.data.theme
            );

            toast.success(
                "Settings restored to default."
            );
        } catch (err) {
            console.error(
                "Failed to reset settings:",
                err
            );

            toast.error(
                err?.message ||
                "Unable to reset settings."
            );
        } finally {
            setResetting(false);
        }
    }

    if (loading) {
        return (
            <div className="settings-page">
                <div className="settings-loading">
                    <div className="settings-spinner" />

                    <p>
                        Loading your settings...
                    </p>
                </div>
            </div>
        );
    }

    if (error || !settings) {
        return (
            <div className="settings-page">
                <div className="settings-error">
                    <Shield size={30} />

                    <h2>
                        Unable to load settings
                    </h2>

                    <p>
                        {error ||
                            "Something went wrong while loading your settings."}
                    </p>

                    <button
                        type="button"
                        className="settings-primary-button"
                        onClick={loadSettings}
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="settings-page">
            {/* Header */}

            <div className="settings-header">
                <div>
                    <Link
                        to="/dashboard"
                        className="settings-back-link"
                    >
                        <ArrowLeft size={17} />

                        <span>
                            Back to dashboard
                        </span>
                    </Link>

                    <div className="settings-heading">
                        <div className="settings-heading-icon">
                            <Palette size={23} />
                        </div>

                        <div>
                            <h1>Settings</h1>

                            <p>
                                Manage your preferences,
                                notifications and privacy.
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    className="settings-save-button"
                    onClick={handleSave}
                    disabled={saving}
                >
                    <Save size={17} />

                    {saving
                        ? "Saving..."
                        : "Save changes"}
                </button>
            </div>

            <div className="settings-layout">
                <main className="settings-main">
                    {/* Appearance */}

                    <section className="settings-card">
                        <div className="settings-card-header">
                            <div className="settings-card-icon">
                                <Palette size={19} />
                            </div>

                            <div>
                                <h2>
                                    Appearance
                                </h2>

                                <p>
                                    Choose how Salok Earn
                                    looks on your device.
                                </p>
                            </div>
                        </div>

                        <div className="theme-options">
                            {options.themes.map(
                                (theme) => {
                                    const isActive =
                                        settings.theme ===
                                        theme.id;

                                    return (
                                        <button
                                            key={
                                                theme.id
                                            }
                                            type="button"
                                            className={`theme-option ${isActive
                                                ? "active"
                                                : ""
                                                }`}
                                            onClick={() =>
                                                handleThemeChange(
                                                    theme.id
                                                )
                                            }
                                        >
                                            <div className="theme-option-icon">
                                                {theme.id ===
                                                    "dark" && (
                                                        <Moon
                                                            size={
                                                                20
                                                            }
                                                        />
                                                    )}

                                                {theme.id ===
                                                    "light" && (
                                                        <Sun
                                                            size={
                                                                20
                                                            }
                                                        />
                                                    )}

                                                {theme.id ===
                                                    "system" && (
                                                        <Palette
                                                            size={
                                                                20
                                                            }
                                                        />
                                                    )}
                                            </div>

                                            <div className="theme-option-content">
                                                <strong>
                                                    {
                                                        theme.name
                                                    }
                                                </strong>

                                                <span>
                                                    {
                                                        theme.description
                                                    }
                                                </span>
                                            </div>

                                            <div className="theme-radio">
                                                {isActive && (
                                                    <Check
                                                        size={
                                                            14
                                                        }
                                                    />
                                                )}
                                            </div>
                                        </button>
                                    );
                                }
                            )}
                        </div>
                    </section>

                    {/* General Preferences */}

                    <section className="settings-card">
                        <div className="settings-card-header">
                            <div className="settings-card-icon">
                                <Globe size={19} />
                            </div>

                            <div>
                                <h2>
                                    General preferences
                                </h2>

                                <p>
                                    Customize your regional
                                    and display preferences.
                                </p>
                            </div>
                        </div>

                        <div className="settings-fields">
                            <div className="settings-field">
                                <label htmlFor="language">
                                    Language
                                </label>

                                <select
                                    id="language"
                                    value={
                                        settings.language
                                    }
                                    onChange={(event) =>
                                        updateSetting(
                                            "language",
                                            event.target
                                                .value
                                        )
                                    }
                                >
                                    {options.languages.map(
                                        (language) => (
                                            <option
                                                key={
                                                    language
                                                }
                                                value={
                                                    language
                                                }
                                            >
                                                {language}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div className="settings-field">
                                <label htmlFor="timezone">
                                    Timezone
                                </label>

                                <select
                                    id="timezone"
                                    value={
                                        settings.timezone
                                    }
                                    onChange={(event) =>
                                        updateSetting(
                                            "timezone",
                                            event.target
                                                .value
                                        )
                                    }
                                >
                                    {options.timezones.map(
                                        (timezone) => (
                                            <option
                                                key={
                                                    timezone
                                                }
                                                value={
                                                    timezone
                                                }
                                            >
                                                {timezone}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div className="settings-field">
                                <label htmlFor="currency">
                                    Display currency
                                </label>

                                <select
                                    id="currency"
                                    value={
                                        settings.currency
                                    }
                                    onChange={(event) =>
                                        updateSetting(
                                            "currency",
                                            event.target
                                                .value
                                        )
                                    }
                                >
                                    {options.currencies.map(
                                        (currency) => (
                                            <option
                                                key={
                                                    currency
                                                }
                                                value={
                                                    currency
                                                }
                                            >
                                                {currency}
                                            </option>
                                        )
                                    )}
                                </select>

                                <small>
                                    SAK is the current
                                    display currency in
                                    this mock build.
                                </small>
                            </div>
                        </div>
                    </section>

                    {/* Notifications */}

                    <section className="settings-card">
                        <div className="settings-card-header">
                            <div className="settings-card-icon">
                                <Bell size={19} />
                            </div>

                            <div>
                                <h2>
                                    Notifications
                                </h2>

                                <p>
                                    Decide which updates
                                    you want to receive.
                                </p>
                            </div>
                        </div>

                        <div className="settings-options-list">
                            <SettingToggle
                                title="Earning alerts"
                                description="Get notified when you earn rewards or complete an earning activity."
                                checked={
                                    settings
                                        .notifications
                                        .earningAlerts
                                }
                                onChange={(value) =>
                                    updateNotification(
                                        "earningAlerts",
                                        value
                                    )
                                }
                            />

                            <SettingToggle
                                title="Trivia reminders"
                                description="Receive reminders about trivia rounds and available challenges."
                                checked={
                                    settings
                                        .notifications
                                        .triviaReminders
                                }
                                onChange={(value) =>
                                    updateNotification(
                                        "triviaReminders",
                                        value
                                    )
                                }
                            />

                            <SettingToggle
                                title="Withdrawal updates"
                                description="Get updates when a withdrawal changes status."
                                checked={
                                    settings
                                        .notifications
                                        .withdrawalUpdates
                                }
                                onChange={(value) =>
                                    updateNotification(
                                        "withdrawalUpdates",
                                        value
                                    )
                                }
                            />

                            <SettingToggle
                                title="Community activity"
                                description="Stay informed about important community activity and interactions."
                                checked={
                                    settings
                                        .notifications
                                        .communityActivity
                                }
                                onChange={(value) =>
                                    updateNotification(
                                        "communityActivity",
                                        value
                                    )
                                }
                            />

                            <SettingToggle
                                title="Product and promotional updates"
                                description="Receive occasional news, announcements and promotional messages."
                                checked={
                                    settings
                                        .notifications
                                        .marketing
                                }
                                onChange={(value) =>
                                    updateNotification(
                                        "marketing",
                                        value
                                    )
                                }
                            />
                        </div>
                    </section>

                    {/* Privacy */}

                    <section className="settings-card">
                        <div className="settings-card-header">
                            <div className="settings-card-icon">
                                <Lock size={19} />
                            </div>

                            <div>
                                <h2>
                                    Privacy
                                </h2>

                                <p>
                                    Control what other
                                    community members can
                                    see.
                                </p>
                            </div>
                        </div>

                        <div className="settings-options-list">
                            <SettingToggle
                                title="Show my profile to the community"
                                description="Allow other members to view your public community profile."
                                checked={
                                    settings
                                        .privacy
                                        .showProfileToCommunity
                                }
                                onChange={(value) =>
                                    updatePrivacy(
                                        "showProfileToCommunity",
                                        value
                                    )
                                }
                            />

                            <SettingToggle
                                title="Show online status"
                                description="Let other community members know when you are online."
                                checked={
                                    settings
                                        .privacy
                                        .showOnlineStatus
                                }
                                onChange={(value) =>
                                    updatePrivacy(
                                        "showOnlineStatus",
                                        value
                                    )
                                }
                            />

                            <SettingToggle
                                title="Show earnings on profile"
                                description="Display selected earning information on your community profile."
                                checked={
                                    settings
                                        .privacy
                                        .showEarningsOnProfile
                                }
                                onChange={(value) =>
                                    updatePrivacy(
                                        "showEarningsOnProfile",
                                        value
                                    )
                                }
                            />

                            <SettingToggle
                                title="Allow community messages"
                                description="Allow other members to send you community messages."
                                checked={
                                    settings
                                        .privacy
                                        .allowCommunityMessages
                                }
                                onChange={(value) =>
                                    updatePrivacy(
                                        "allowCommunityMessages",
                                        value
                                    )
                                }
                            />
                        </div>
                    </section>

                    {/* Save */}

                    <div className="settings-bottom-actions">
                        <button
                            type="button"
                            className="settings-primary-button"
                            onClick={handleSave}
                            disabled={saving}
                        >
                            <Save size={17} />

                            {saving
                                ? "Saving..."
                                : "Save changes"}
                        </button>

                        <button
                            type="button"
                            className="settings-reset-button"
                            onClick={handleReset}
                            disabled={resetting}
                        >
                            <RotateCcw
                                size={17}
                            />

                            {resetting
                                ? "Resetting..."
                                : "Reset defaults"}
                        </button>
                    </div>
                </main>

                {/* Right sidebar */}

                <aside className="settings-sidebar">
                    <div className="settings-side-card">
                        <div className="settings-side-icon">
                            <Shield size={20} />
                        </div>

                        <h3>
                            Account security
                        </h3>

                        <p>
                            Keep your account protected
                            with security and login
                            controls.
                        </p>

                        <Link
                            to="/security"
                            className="settings-side-link"
                        >
                            <span>
                                Security settings
                            </span>

                            <ChevronRight
                                size={17}
                            />
                        </Link>
                    </div>

                    <div className="settings-side-card">
                        <div className="settings-side-icon">
                            <UserRound size={20} />
                        </div>

                        <h3>
                            Profile
                        </h3>

                        <p>
                            Update your personal
                            information, profile picture
                            and bio.
                        </p>

                        <Link
                            to="/profile"
                            className="settings-side-link"
                        >
                            <span>
                                Manage profile
                            </span>

                            <ChevronRight
                                size={17}
                            />
                        </Link>
                    </div>

                    <div className="settings-side-card">
                        <div className="settings-side-icon">
                            <KeyRound size={20} />
                        </div>

                        <h3>
                            Password
                        </h3>

                        <p>
                            Manage your account password
                            and authentication options.
                        </p>

                        <Link
                            to="/security"
                            className="settings-side-link"
                        >
                            <span>
                                Manage security
                            </span>

                            <ChevronRight
                                size={17}
                            />
                        </Link>
                    </div>

                    {/* Danger zone */}

                    <div className="settings-danger-card">
                        <div className="settings-danger-icon">
                            <Trash2 size={19} />
                        </div>

                        <h3>
                            Danger zone
                        </h3>

                        <p>
                            Account deletion is permanent
                            and should only be used when
                            you are sure.
                        </p>

                        <Link
                            to="/account/delete"
                            className="settings-danger-link"
                        >
                            Delete account
                        </Link>
                    </div>
                </aside>
            </div>
        </div>
    );
}

function SettingToggle({
    title,
    description,
    checked,
    onChange,
}) {
    return (
        <div className="settings-toggle-row">
            <div className="settings-toggle-content">
                <strong>{title}</strong>

                <span>{description}</span>
            </div>

            <button
                type="button"
                role="switch"
                aria-checked={checked}
                className={`settings-toggle ${checked ? "active" : ""
                    }`}
                onClick={() =>
                    onChange(!checked)
                }
            >
                <span className="settings-toggle-thumb" />
            </button>
        </div>
    );
}

export default SettingsPage;