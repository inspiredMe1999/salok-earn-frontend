import { useEffect, useState } from "react";
import {
    Bell,
    Coins,
    CreditCard,
    Gamepad2,
    Globe2,
    Image,
    Info,
    MessageCircle,
    RefreshCw,
    RotateCcw,
    Save,
    Settings,
    ShieldCheck,
    Users,
    Wrench,
} from "lucide-react";
import { toast } from "sonner";

import {
    getAdminSettings,
    getAdminSettingsSections,
    resetAdminSettings,
    updateAdminSettings,
} from "../../services/mock/adminService";

import "./admin-settings.css";

const sectionIcons = {
    general: Globe2,
    earning: Coins,
    withdrawal: CreditCard,
    referral: Users,
    trivia: Gamepad2,
    community: MessageCircle,
    maintenance: Wrench,
};

function AdminSettingsPage() {
    const [sections, setSections] =
        useState([]);

    const [settings, setSettings] =
        useState({});

    const [activeSection, setActiveSection] =
        useState("general");

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [resetting, setResetting] =
        useState(false);

    const loadSettings = async () => {
        try {
            setLoading(true);

            const [
                sectionsResponse,
                settingsResponse,
            ] = await Promise.all([
                getAdminSettingsSections(),
                getAdminSettings(),
            ]);

            if (
                !sectionsResponse.success ||
                !settingsResponse.success
            ) {
                throw new Error(
                    "Unable to load admin settings."
                );
            }

            setSections(
                sectionsResponse.data
            );

            setSettings(
                settingsResponse.data
            );
        } catch (error) {
            console.error(error);

            toast.error(
                error.message ||
                    "Unable to load settings."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSettings();
    }, []);

    const currentSettings =
        settings[activeSection] || {};

    const updateField = (
        field,
        value
    ) => {
        setSettings((current) => ({
            ...current,
            [activeSection]: {
                ...current[activeSection],
                [field]: value,
            },
        }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);

            const response =
                await updateAdminSettings(
                    activeSection,
                    currentSettings
                );

            if (!response.success) {
                toast.error(
                    response.message ||
                        "Unable to save settings."
                );
                return;
            }

            setSettings((current) => ({
                ...current,
                [activeSection]:
                    response.data,
            }));

            toast.success(
                "Settings saved successfully."
            );
        } catch (error) {
            console.error(error);

            toast.error(
                "Unable to save settings."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleReset = async () => {
        const confirmed =
            window.confirm(
                "Restore this settings section to its default values?"
            );

        if (!confirmed) {
            return;
        }

        try {
            setResetting(true);

            const response =
                await resetAdminSettings(
                    activeSection
                );

            if (!response.success) {
                toast.error(
                    response.message ||
                        "Unable to reset settings."
                );
                return;
            }

            setSettings((current) => ({
                ...current,
                [activeSection]:
                    response.data,
            }));

            toast.success(
                response.message
            );
        } catch (error) {
            console.error(error);

            toast.error(
                "Unable to reset settings."
            );
        } finally {
            setResetting(false);
        }
    };

    const renderToggle = (
        label,
        description,
        field
    ) => (
        <div className="admin-setting-row">
            <div>
                <strong>{label}</strong>
                <span>{description}</span>
            </div>

            <button
                type="button"
                className={`admin-setting-toggle ${
                    currentSettings[field]
                        ? "is-on"
                        : ""
                }`}
                onClick={() =>
                    updateField(
                        field,
                        !currentSettings[field]
                    )
                }
                aria-label={`Toggle ${label}`}
            >
                <span />
            </button>
        </div>
    );

    const renderNumberInput = (
        label,
        description,
        field,
        suffix
    ) => (
        <label className="admin-setting-field">
            <span className="admin-setting-field-label">
                {label}
            </span>

            <span className="admin-setting-field-description">
                {description}
            </span>

            <div className="admin-setting-input-wrap">
                <input
                    type="number"
                    value={
                        currentSettings[field] ??
                        ""
                    }
                    onChange={(event) =>
                        updateField(
                            field,
                            Number(
                                event.target
                                    .value
                            )
                        )
                    }
                    min="0"
                />

                {suffix && (
                    <span>
                        {suffix}
                    </span>
                )}
            </div>
        </label>
    );

    const renderContent = () => {
        if (activeSection === "general") {
            return (
                <div className="admin-settings-form">
                    <div className="admin-settings-section-intro">
                        <div className="admin-settings-section-icon">
                            <Globe2 size={21} />
                        </div>

                        <div>
                            <h2>
                                General settings
                            </h2>

                            <p>
                                Configure the basic identity
                                and registration behaviour of
                                Salok Earn.
                            </p>
                        </div>
                    </div>

                    <div className="admin-settings-fields-grid">
                        <label className="admin-setting-field">
                            <span className="admin-setting-field-label">
                                Platform name
                            </span>

                            <span className="admin-setting-field-description">
                                The public platform name.
                            </span>

                            <input
                                type="text"
                                value={
                                    currentSettings.platformName ||
                                    ""
                                }
                                onChange={(event) =>
                                    updateField(
                                        "platformName",
                                        event.target.value
                                    )
                                }
                            />
                        </label>

                        <label className="admin-setting-field">
                            <span className="admin-setting-field-label">
                                Platform code
                            </span>

                            <span className="admin-setting-field-description">
                                Internal reward currency
                                symbol.
                            </span>

                            <input
                                type="text"
                                value={
                                    currentSettings.platformCode ||
                                    ""
                                }
                                onChange={(event) =>
                                    updateField(
                                        "platformCode",
                                        event.target.value
                                    )
                                }
                            />
                        </label>

                        <label className="admin-setting-field">
                            <span className="admin-setting-field-label">
                                Support email
                            </span>

                            <span className="admin-setting-field-description">
                                Primary support contact.
                            </span>

                            <input
                                type="email"
                                value={
                                    currentSettings.supportEmail ||
                                    ""
                                }
                                onChange={(event) =>
                                    updateField(
                                        "supportEmail",
                                        event.target.value
                                    )
                                }
                            />
                        </label>

                        <label className="admin-setting-field">
                            <span className="admin-setting-field-label">
                                Default timezone
                            </span>

                            <span className="admin-setting-field-description">
                                Default platform timezone.
                            </span>

                            <select
                                value={
                                    currentSettings.defaultTimezone ||
                                    ""
                                }
                                onChange={(event) =>
                                    updateField(
                                        "defaultTimezone",
                                        event.target.value
                                    )
                                }
                            >
                                <option value="Africa/Lagos">
                                    Africa/Lagos
                                </option>

                                <option value="UTC">
                                    UTC
                                </option>

                                <option value="Africa/Accra">
                                    Africa/Accra
                                </option>
                            </select>
                        </label>
                    </div>

                    {renderNumberInput(
                        "New user bonus",
                        "Optional starting bonus for newly registered users.",
                        "newUserBonus",
                        "SAK"
                    )}

                    {renderToggle(
                        "Registration enabled",
                        "Allow new users to create accounts.",
                        "registrationEnabled"
                    )}
                </div>
            );
        }

        if (activeSection === "earning") {
            return (
                <div className="admin-settings-form">
                    <div className="admin-settings-section-intro">
                        <div className="admin-settings-section-icon">
                            <Coins size={21} />
                        </div>

                        <div>
                            <h2>
                                Earning settings
                            </h2>

                            <p>
                                Configure general earning
                                values and presentation
                                limits.
                            </p>
                        </div>
                    </div>

                    <div className="admin-settings-fields-grid">
                        {renderNumberInput(
                            "Minimum offer reward",
                            "Lowest reward displayed for an earning opportunity.",
                            "minimumOfferReward",
                            "SAK"
                        )}

                        {renderNumberInput(
                            "Maximum offer reward",
                            "Highest reward displayed for an earning opportunity.",
                            "maximumOfferReward",
                            "SAK"
                        )}

                        {renderNumberInput(
                            "Daily earning limit",
                            "Maximum daily earning amount used by the mock configuration.",
                            "dailyEarningLimit",
                            "SAK"
                        )}

                        {renderNumberInput(
                            "History retention",
                            "Number of days of earning history shown.",
                            "earningHistoryDays",
                            "days"
                        )}
                    </div>

                    {renderToggle(
                        "Show estimated rewards",
                        "Display estimated reward amounts on earning opportunities.",
                        "showEstimatedRewards"
                    )}
                </div>
            );
        }

        if (activeSection === "withdrawal") {
            return (
                <div className="admin-settings-form">
                    <div className="admin-settings-section-intro">
                        <div className="admin-settings-section-icon">
                            <CreditCard size={21} />
                        </div>

                        <div>
                            <h2>
                                Withdrawal settings
                            </h2>

                            <p>
                                Configure the withdrawal
                                limits presented throughout
                                the application.
                            </p>
                        </div>
                    </div>

                    <div className="admin-settings-fields-grid">
                        {renderNumberInput(
                            "Minimum withdrawal",
                            "Minimum amount a user can request.",
                            "minimumWithdrawal",
                            "SAK"
                        )}

                        {renderNumberInput(
                            "Maximum withdrawal",
                            "Maximum amount allowed per request.",
                            "maximumWithdrawal",
                            "SAK"
                        )}

                        {renderNumberInput(
                            "Daily withdrawal limit",
                            "Maximum total withdrawal amount per day.",
                            "dailyWithdrawalLimit",
                            "SAK"
                        )}

                        {renderNumberInput(
                            "Processing fee",
                            "Demo processing fee applied to withdrawals.",
                            "processingFee",
                            "SAK"
                        )}
                    </div>

                    {renderToggle(
                        "Withdrawals enabled",
                        "Allow users to submit withdrawal requests.",
                        "withdrawalsEnabled"
                    )}

                    {renderToggle(
                        "Manual review enabled",
                        "Require administrative review for applicable withdrawals.",
                        "manualReviewEnabled"
                    )}
                </div>
            );
        }

        if (activeSection === "referral") {
            return (
                <div className="admin-settings-form">
                    <div className="admin-settings-section-intro">
                        <div className="admin-settings-section-icon">
                            <Users size={21} />
                        </div>

                        <div>
                            <h2>
                                Referral settings
                            </h2>

                            <p>
                                Configure referral rewards and
                                qualification behaviour.
                            </p>
                        </div>
                    </div>

                    <div className="admin-settings-fields-grid">
                        {renderNumberInput(
                            "Referral reward",
                            "Base reward for a qualified referral.",
                            "referralReward",
                            "SAK"
                        )}

                        {renderNumberInput(
                            "Milestone reward",
                            "Reward attached to the configured milestone.",
                            "milestoneReward",
                            "SAK"
                        )}

                        {renderNumberInput(
                            "Milestone target",
                            "Number of qualified referrals needed for the milestone.",
                            "milestoneTarget",
                            "referrals"
                        )}

                        {renderNumberInput(
                            "Maximum referral bonus",
                            "Maximum cumulative referral bonus in this mock configuration.",
                            "maximumReferralBonus",
                            "SAK"
                        )}
                    </div>

                    {renderToggle(
                        "Referrals enabled",
                        "Allow referral activity on the platform.",
                        "referralsEnabled"
                    )}

                    {renderToggle(
                        "Require qualified referral",
                        "Only reward referrals after required qualification conditions are met.",
                        "requireQualifiedReferral"
                    )}
                </div>
            );
        }

        if (activeSection === "trivia") {
            return (
                <div className="admin-settings-form">
                    <div className="admin-settings-section-intro">
                        <div className="admin-settings-section-icon">
                            <Gamepad2 size={21} />
                        </div>

                        <div>
                            <h2>
                                Trivia settings
                            </h2>

                            <p>
                                Configure trivia usage,
                                energy and reward values.
                            </p>
                        </div>
                    </div>

                    <div className="admin-settings-fields-grid">
                        {renderNumberInput(
                            "Daily answer limit",
                            "Maximum trivia answers per user per day.",
                            "dailyAnswerLimit",
                            "answers"
                        )}

                        {renderNumberInput(
                            "Category answer limit",
                            "Maximum answers within one trivia category.",
                            "categoryAnswerLimit",
                            "answers"
                        )}

                        {renderNumberInput(
                            "Maximum energy",
                            "Maximum trivia energy available to a user.",
                            "maximumEnergy",
                            "energy"
                        )}

                        {renderNumberInput(
                            "Round energy cost",
                            "Energy consumed when starting a trivia round.",
                            "roundEnergyCost",
                            "energy"
                        )}

                        {renderNumberInput(
                            "Reward per correct answer",
                            "Mock reward granted for a correct trivia answer.",
                            "rewardPerCorrectAnswer",
                            "SAK"
                        )}
                    </div>

                    {renderToggle(
                        "Trivia enabled",
                        "Allow users to access trivia.",
                        "triviaEnabled"
                    )}
                </div>
            );
        }

        if (activeSection === "community") {
            return (
                <div className="admin-settings-form">
                    <div className="admin-settings-section-intro">
                        <div className="admin-settings-section-icon">
                            <MessageCircle
                                size={21}
                            />
                        </div>

                        <div>
                            <h2>
                                Community settings
                            </h2>

                            <p>
                                Configure community
                                participation and media
                                behaviour.
                            </p>
                        </div>
                    </div>

                    <div className="admin-settings-fields-grid">
                        {renderNumberInput(
                            "Maximum message length",
                            "Maximum number of characters in a community message.",
                            "maximumMessageLength",
                            "characters"
                        )}

                        {renderNumberInput(
                            "Maximum image size",
                            "Maximum uploaded image size.",
                            "maximumImageSizeMb",
                            "MB"
                        )}
                    </div>

                    {renderToggle(
                        "Community enabled",
                        "Allow users to access the community.",
                        "communityEnabled"
                    )}

                    {renderToggle(
                        "Image uploads",
                        "Allow users to attach images to community messages.",
                        "imageUploadsEnabled"
                    )}

                    {renderToggle(
                        "Replies enabled",
                        "Allow users to reply to specific messages.",
                        "repliesEnabled"
                    )}

                    {renderToggle(
                        "Moderation enabled",
                        "Enable moderation controls for community content.",
                        "moderationEnabled"
                    )}
                </div>
            );
        }

        if (activeSection === "maintenance") {
            return (
                <div className="admin-settings-form">
                    <div className="admin-settings-section-intro">
                        <div className="admin-settings-section-icon">
                            <Wrench size={21} />
                        </div>

                        <div>
                            <h2>
                                Maintenance settings
                            </h2>

                            <p>
                                Control the platform
                                maintenance experience.
                            </p>
                        </div>
                    </div>

                    <div className="admin-maintenance-warning">
                        <ShieldCheck size={20} />

                        <div>
                            <strong>
                                Use maintenance mode carefully
                            </strong>

                            <span>
                                In the real Firebase
                                implementation, maintenance
                                access should be enforced by
                                backend/server logic rather
                                than only by the frontend.
                            </span>
                        </div>
                    </div>

                    {renderToggle(
                        "Maintenance mode",
                        "Temporarily place the public platform into maintenance mode.",
                        "maintenanceMode"
                    )}

                    <label className="admin-setting-field">
                        <span className="admin-setting-field-label">
                            Maintenance title
                        </span>

                        <span className="admin-setting-field-description">
                            Main heading shown during
                            maintenance.
                        </span>

                        <input
                            type="text"
                            value={
                                currentSettings.maintenanceTitle ||
                                ""
                            }
                            onChange={(event) =>
                                updateField(
                                    "maintenanceTitle",
                                    event.target.value
                                )
                            }
                        />
                    </label>

                    <label className="admin-setting-field">
                        <span className="admin-setting-field-label">
                            Maintenance message
                        </span>

                        <span className="admin-setting-field-description">
                            Supporting message shown to
                            users.
                        </span>

                        <textarea
                            rows="4"
                            value={
                                currentSettings.maintenanceMessage ||
                                ""
                            }
                            onChange={(event) =>
                                updateField(
                                    "maintenanceMessage",
                                    event.target.value
                                )
                            }
                        />
                    </label>

                    {renderToggle(
                        "Allow admin access",
                        "Allow administrators to access the admin area during maintenance.",
                        "allowAdminAccess"
                    )}
                </div>
            );
        }

        return null;
    };

    if (loading) {
        return (
            <section className="admin-settings-page">
                <div className="admin-settings-loading">
                    <div className="admin-settings-spinner" />

                    <span>
                        Loading platform settings...
                    </span>
                </div>
            </section>
        );
    }

    return (
        <section className="admin-settings-page">
            <div className="admin-settings-container">
                <div className="admin-settings-header">
                    <div>
                        <div className="admin-settings-kicker">
                            <Settings size={15} />
                            Administration
                        </div>

                        <h1>
                            Platform Settings
                        </h1>

                        <p>
                            Configure the rules and behaviour
                            used throughout Salok Earn.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="admin-settings-refresh"
                        onClick={
                            loadSettings
                        }
                        disabled={loading}
                    >
                        <RefreshCw size={17} />
                        Refresh
                    </button>
                </div>

                <div className="admin-settings-demo-note">
                    <Info size={18} />

                    <div>
                        <strong>
                            Mock configuration mode
                        </strong>

                        <span>
                            These settings are currently
                            stored in the frontend mock
                            service. They do not change the
                            real Firebase backend.
                        </span>
                    </div>
                </div>

                <div className="admin-settings-layout">
                    <aside className="admin-settings-sidebar">
                        <div className="admin-settings-sidebar-title">
                            <span>
                                Configuration
                            </span>
                        </div>

                        <nav>
                            {sections.map(
                                (section) => {
                                    const Icon =
                                        sectionIcons[
                                            section.id
                                        ] ||
                                        Settings;

                                    return (
                                        <button
                                            type="button"
                                            key={
                                                section.id
                                            }
                                            className={
                                                activeSection ===
                                                section.id
                                                    ? "active"
                                                    : ""
                                            }
                                            onClick={() =>
                                                setActiveSection(
                                                    section.id
                                                )
                                            }
                                        >
                                            <Icon
                                                size={
                                                    18
                                                }
                                            />

                                            <span>
                                                {
                                                    section.label
                                                }
                                            </span>
                                        </button>
                                    );
                                }
                            )}
                        </nav>
                    </aside>

                    <main className="admin-settings-content">
                        {renderContent()}

                        <div className="admin-settings-footer">
                            <button
                                type="button"
                                className="admin-settings-reset"
                                onClick={
                                    handleReset
                                }
                                disabled={
                                    resetting ||
                                    saving
                                }
                            >
                                {resetting ? (
                                    <RefreshCw
                                        size={
                                            17
                                        }
                                        className="admin-settings-spin"
                                    />
                                ) : (
                                    <RotateCcw
                                        size={
                                            17
                                        }
                                    />
                                )}

                                Reset defaults
                            </button>

                            <button
                                type="button"
                                className="admin-settings-save"
                                onClick={
                                    handleSave
                                }
                                disabled={
                                    saving ||
                                    resetting
                                }
                            >
                                {saving ? (
                                    <RefreshCw
                                        size={
                                            17
                                        }
                                        className="admin-settings-spin"
                                    />
                                ) : (
                                    <Save
                                        size={
                                            17
                                        }
                                    />
                                )}

                                {saving
                                    ? "Saving..."
                                    : "Save changes"}
                            </button>
                        </div>
                    </main>
                </div>
            </div>
        </section>
    );
}

export default AdminSettingsPage;