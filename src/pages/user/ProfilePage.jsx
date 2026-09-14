import { useEffect, useRef, useState } from "react";
import {
    ArrowLeft,
    Camera,
    CheckCircle2,
    Edit3,
    Mail,
    MapPin,
    Save,
    ShieldCheck,
    User,
    X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import profileService from "../../services/mock/profileService";

import "./profile.css";

import Loader from "../../components/common/Loader";

function formatNumber(value) {
    return new Intl.NumberFormat(
        "en-US"
    ).format(value || 0);
}

function formatSAK(value) {
    return `${new Intl.NumberFormat(
        "en-US",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }
    ).format(value || 0)} SAK`;
}

function formatDate(date) {
    if (!date) return "—";

    return new Intl.DateTimeFormat(
        "en-US",
        {
            month: "long",
            day: "numeric",
            year: "numeric",
        }
    ).format(new Date(date));
}

function ProfilePage() {
    const fileInputRef =
        useRef(null);

    const [user, setUser] =
        useState(null);

    const [stats, setStats] =
        useState(null);

    const [formData, setFormData] =
        useState({
            displayName: "",
            username: "",
            email: "",
            bio: "",
            region: "",
        });

    const [imagePreview, setImagePreview] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [editing, setEditing] =
        useState(false);

    const [error, setError] =
        useState("");

    useEffect(() => {
        loadProfile();
    }, []);

    async function loadProfile() {
        try {
            setLoading(true);
            setError("");

            const response =
                await profileService.getProfilePageData();

            if (!response?.success) {
                throw new Error(
                    response?.message ||
                    "Unable to load profile."
                );
            }

            const {
                user: profileUser,
                stats: profileStats,
            } = response.data;

            setUser(profileUser);

            setStats(profileStats);

            setFormData({
                displayName:
                    profileUser.displayName ||
                    "",
                username:
                    profileUser.username ||
                    "",
                email:
                    profileUser.email ||
                    "",
                bio:
                    profileUser.bio ||
                    "",
                region:
                    profileUser.region ||
                    "",
            });
        } catch (err) {
            console.error(
                "Failed to load profile:",
                err
            );

            setError(
                err?.message ||
                "Unable to load profile."
            );
        } finally {
            setLoading(false);
        }
    }

    function handleChange(event) {
        const {
            name,
            value,
        } = event.target;

        setFormData(
            (current) => ({
                ...current,
                [name]: value,
            })
        );
    }

    async function handleImageSelected(
        event
    ) {
        const file =
            event.target.files?.[0];

        if (!file) return;

        const response =
            await profileService.uploadProfileImage(
                file
            );

        if (!response?.success) {
            toast.error(
                response?.message ||
                "Unable to select image."
            );

            return;
        }

        if (imagePreview) {
            profileService.revokeProfileImageUrl(
                imagePreview
            );
        }

        setImagePreview(
            response.data.url
        );

        toast.success(
            "Profile image selected."
        );

        event.target.value = "";
    }

    function removeImage() {
        if (imagePreview) {
            profileService.revokeProfileImageUrl(
                imagePreview
            );
        }

        setImagePreview("");
    }

    async function handleSave() {
        setSaving(true);

        try {
            const response =
                await profileService.updateProfile(
                    formData
                );

            if (!response?.success) {
                throw new Error(
                    response?.message ||
                    "Unable to update profile."
                );
            }

            setUser(response.data);

            setEditing(false);

            toast.success(
                "Profile updated successfully."
            );
        } catch (err) {
            toast.error(
                err?.message ||
                "Unable to update profile."
            );
        } finally {
            setSaving(false);
        }
    }

    function handleCancel() {
        setEditing(false);

        if (user) {
            setFormData({
                displayName:
                    user.displayName ||
                    "",
                username:
                    user.username ||
                    "",
                email:
                    user.email ||
                    "",
                bio:
                    user.bio ||
                    "",
                region:
                    user.region ||
                    "",
            });
        }
    }

    if (loading) {
        return (
            <div className="profile-page">
                <div className="profile-loading">
                    <Loader
                        size="lg"
                        label="Loading profile..."
                    />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="profile-page">
                <div className="profile-error">
                    <h2>
                        Unable to load
                        profile
                    </h2>

                    <p>{error}</p>

                    <button
                        type="button"
                        onClick={
                            loadProfile
                        }
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="profile-page-header">
                <div>
                    {/* <Link
                        to="/dashboard"
                        className="profile-back-button"
                    >
                        <ArrowLeft
                            size={17}
                        />
                        Dashboard
                    </Link> */}

                    <span className="profile-eyebrow">
                        Account
                    </span>

                    <h1>
                        Your Profile
                    </h1>

                    <p>
                        Manage your personal
                        information and see
                        your Salok progress.
                    </p>
                </div>

                {!editing ? (
                    <button
                        type="button"
                        className="profile-primary-button"
                        onClick={() =>
                            setEditing(
                                true
                            )
                        }
                    >
                        <Edit3 size={17} />
                        Edit profile
                    </button>
                ) : (
                    <div className="profile-header-actions">
                        <button
                            type="button"
                            className="profile-secondary-button"
                            onClick={
                                handleCancel
                            }
                        >
                            <X size={17} />
                            Cancel
                        </button>

                        <button
                            type="button"
                            className="profile-primary-button"
                            onClick={
                                handleSave
                            }
                            disabled={
                                saving
                            }
                        >
                            <Save
                                size={17}
                            />

                            {saving
                                ? "Saving..."
                                : "Save changes"}
                        </button>
                    </div>
                )}
            </div>

            <div className="profile-grid">
                <section className="profile-main-column">
                    <div className="profile-card profile-identity-card">
                        <div className="profile-cover">
                            <div className="profile-cover-glow" />
                        </div>

                        <div className="profile-identity-content">
                            <div className="profile-avatar-wrapper">
                                <div className="profile-avatar">
                                    {imagePreview ||
                                        user?.avatarUrl ? (
                                        <img
                                            src={
                                                imagePreview ||
                                                user.avatarUrl
                                            }
                                            alt={
                                                user.displayName
                                            }
                                        />
                                    ) : (
                                        <span>
                                            {
                                                user.initials
                                            }
                                        </span>
                                    )}
                                </div>

                                {editing && (
                                    <>
                                        <input
                                            ref={
                                                fileInputRef
                                            }
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            onChange={
                                                handleImageSelected
                                            }
                                        />

                                        <button
                                            type="button"
                                            className="profile-avatar-edit"
                                            onClick={() =>
                                                fileInputRef.current?.click()
                                            }
                                            title="Change profile image"
                                        >
                                            <Camera
                                                size={
                                                    16
                                                }
                                            />
                                        </button>
                                    </>
                                )}

                                {imagePreview &&
                                    editing && (
                                        <button
                                            type="button"
                                            className="profile-avatar-remove"
                                            onClick={
                                                removeImage
                                            }
                                        >
                                            <X
                                                size={
                                                    12
                                                }
                                            />
                                        </button>
                                    )}
                            </div>

                            <div className="profile-identity-details">
                                <div className="profile-name-row">
                                    <h2>
                                        {
                                            user.displayName
                                        }
                                    </h2>

                                    {user.verified && (
                                        <CheckCircle2
                                            size={
                                                18
                                            }
                                        />
                                    )}
                                </div>

                                <span>
                                    @
                                    {
                                        user.username
                                    }
                                </span>

                                <div className="profile-member-badge">
                                    <ShieldCheck
                                        size={
                                            13
                                        }
                                    />
                                    {user.role}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="profile-card">
                        <div className="profile-card-header">
                            <div>
                                <span className="profile-section-label">
                                    Personal
                                    information
                                </span>

                                <h2>
                                    About you
                                </h2>
                            </div>
                        </div>

                        <div className="profile-form-grid">
                            <div className="profile-form-field">
                                <label>
                                    Display name
                                </label>

                                {editing ? (
                                    <input
                                        name="displayName"
                                        value={
                                            formData.displayName
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />
                                ) : (
                                    <div className="profile-readonly-field">
                                        <User
                                            size={
                                                16
                                            }
                                        />

                                        {
                                            user.displayName
                                        }
                                    </div>
                                )}
                            </div>

                            <div className="profile-form-field">
                                <label>
                                    Username
                                </label>

                                {editing ? (
                                    <input
                                        name="username"
                                        value={
                                            formData.username
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />
                                ) : (
                                    <div className="profile-readonly-field">
                                        @
                                        {
                                            user.username
                                        }
                                    </div>
                                )}
                            </div>

                            <div className="profile-form-field">
                                <label>
                                    Email
                                </label>

                                <div className="profile-readonly-field">
                                    <Mail
                                        size={
                                            16
                                        }
                                    />

                                    {
                                        user.email
                                    }

                                    {user.emailVerified && (
                                        <span className="profile-verified-small">
                                            Verified
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="profile-form-field">
                                <label>
                                    Region
                                </label>

                                {editing ? (
                                    <select
                                        name="region"
                                        value={
                                            formData.region
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    >
                                        <option>
                                            Nigeria
                                        </option>

                                        <option>
                                            Ghana
                                        </option>

                                        <option>
                                            Kenya
                                        </option>

                                        <option>
                                            South Africa
                                        </option>

                                        <option>
                                            United
                                            States
                                        </option>

                                        <option>
                                            United
                                            Kingdom
                                        </option>
                                    </select>
                                ) : (
                                    <div className="profile-readonly-field">
                                        <MapPin
                                            size={
                                                16
                                            }
                                        />

                                        {
                                            user.region
                                        }
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="profile-form-field profile-bio-field">
                            <label>
                                Bio
                            </label>

                            {editing ? (
                                <textarea
                                    name="bio"
                                    rows="4"
                                    maxLength={
                                        300
                                    }
                                    value={
                                        formData.bio
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Tell the community a little about yourself..."
                                />
                            ) : (
                                <p className="profile-bio">
                                    {user.bio ||
                                        "No bio added yet."}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="profile-card">
                        <div className="profile-card-header">
                            <div>
                                <span className="profile-section-label">
                                    Account
                                </span>

                                <h2>
                                    Account
                                    details
                                </h2>
                            </div>
                        </div>

                        <div className="profile-detail-list">
                            <div>
                                <span>
                                    Member since
                                </span>

                                <strong>
                                    {formatDate(
                                        user.joinedAt
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Account
                                    status
                                </span>

                                <strong className="profile-status-active">
                                    Active
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Currency
                                </span>

                                <strong>
                                    SAK
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Email status
                                </span>

                                <strong>
                                    Verified
                                </strong>
                            </div>
                        </div>
                    </div>
                </section>

                <aside className="profile-side-column">
                    <div className="profile-card profile-stats-card">
                        <div className="profile-card-header">
                            <div>
                                <span className="profile-section-label">
                                    Your journey
                                </span>

                                <h2>
                                    Activity
                                    overview
                                </h2>
                            </div>
                        </div>

                        <div className="profile-stats-list">
                            <div>
                                <span>
                                    Total earned
                                </span>

                                <strong>
                                    {formatSAK(
                                        stats.totalEarned
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Total
                                    withdrawn
                                </span>

                                <strong>
                                    {formatSAK(
                                        stats.totalWithdrawn
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Trivia score
                                </span>

                                <strong>
                                    {formatNumber(
                                        stats.triviaScore
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Trivia
                                    rounds
                                </span>

                                <strong>
                                    {formatNumber(
                                        stats.triviaRounds
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Referrals
                                </span>

                                <strong>
                                    {formatNumber(
                                        stats.referrals
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Successful
                                    referrals
                                </span>

                                <strong>
                                    {
                                        stats.successfulReferrals
                                    }
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Activities
                                    completed
                                </span>

                                <strong>
                                    {formatNumber(
                                        stats.completedActivities
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Active days
                                </span>

                                <strong>
                                    {
                                        stats.daysActive
                                    }
                                </strong>
                            </div>
                        </div>
                    </div>

                    <div className="profile-card profile-security-card">
                        <div className="profile-security-icon">
                            <ShieldCheck
                                size={20}
                            />
                        </div>

                        <h3>
                            Keep your account
                            secure
                        </h3>

                        <p>
                            Review your login
                            protection and
                            account security
                            settings regularly.
                        </p>

                        <Link to="/security">
                            Security settings
                        </Link>
                    </div>

                    <div className="profile-card profile-settings-card">
                        <div className="profile-settings-icon">
                            <User size={19} />
                        </div>

                        <div>
                            <h3>
                                Account settings
                            </h3>

                            <p>
                                Manage preferences,
                                notifications and
                                privacy.
                            </p>

                            <Link to="/settings">
                                Open settings
                            </Link>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default ProfilePage;