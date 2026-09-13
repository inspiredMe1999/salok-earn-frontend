// src/pages/user/SecurityPage.jsx

import {
    ArrowLeft,
    CheckCircle2,
    ChevronRight,
    KeyRound,
    Lock,
    Shield,
    Smartphone,
    UserCheck,
} from "lucide-react";

import { Link } from "react-router-dom";
import { toast } from "sonner";

import "./security.css";

function SecurityPage() {
    function handleComingSoon(feature) {
        toast.info(
            `${feature} will be connected to Firebase later.`
        );
    }

    return (
        <div className="security-page">
            {/* Header */}

            <div className="security-header">
                <div>
                    <Link
                        to="/settings"
                        className="security-back-link"
                    >
                        <ArrowLeft size={17} />

                        <span>
                            Back to settings
                        </span>
                    </Link>

                    <div className="security-heading">
                        <div className="security-heading-icon">
                            <Shield size={23} />
                        </div>

                        <div>
                            <h1>Security</h1>

                            <p>
                                Protect your account and
                                manage your login security.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="security-status">
                    <CheckCircle2 size={16} />

                    <span>
                        Account protected
                    </span>
                </div>
            </div>

            <div className="security-grid">
                <main className="security-main">
                    {/* Password */}

                    <section className="security-card">
                        <div className="security-card-header">
                            <div className="security-card-icon">
                                <KeyRound size={19} />
                            </div>

                            <div>
                                <h2>
                                    Password
                                </h2>

                                <p>
                                    Keep your password
                                    strong and secure.
                                </p>
                            </div>
                        </div>

                        <div className="security-action-row">
                            <div>
                                <strong>
                                    Account password
                                </strong>

                                <span>
                                    Your password is
                                    securely protected.
                                </span>
                            </div>

                            <button
                                type="button"
                                className="security-action-button"
                                onClick={() =>
                                    handleComingSoon(
                                        "Password management"
                                    )
                                }
                            >
                                Change password

                                <ChevronRight
                                    size={16}
                                />
                            </button>
                        </div>
                    </section>

                    {/* Two-factor authentication */}

                    <section className="security-card">
                        <div className="security-card-header">
                            <div className="security-card-icon">
                                <Lock size={19} />
                            </div>

                            <div>
                                <h2>
                                    Two-factor
                                    authentication
                                </h2>

                                <p>
                                    Add another layer of
                                    protection to your
                                    account.
                                </p>
                            </div>
                        </div>

                        <div className="security-feature">
                            <div className="security-feature-icon">
                                <Shield size={20} />
                            </div>

                            <div className="security-feature-content">
                                <strong>
                                    Two-factor
                                    authentication
                                </strong>

                                <span>
                                    Require an additional
                                    verification step when
                                    signing in.
                                </span>
                            </div>

                            <button
                                type="button"
                                className="security-toggle"
                                onClick={() =>
                                    handleComingSoon(
                                        "Two-factor authentication"
                                    )
                                }
                            >
                                <span />
                            </button>
                        </div>
                    </section>

                    {/* Login sessions */}

                    <section className="security-card">
                        <div className="security-card-header">
                            <div className="security-card-icon">
                                <Smartphone size={19} />
                            </div>

                            <div>
                                <h2>
                                    Login sessions
                                </h2>

                                <p>
                                    Review where your
                                    account is currently
                                    signed in.
                                </p>
                            </div>
                        </div>

                        <div className="security-session">
                            <div className="security-session-icon">
                                <Smartphone size={20} />
                            </div>

                            <div className="security-session-info">
                                <strong>
                                    Current browser
                                </strong>

                                <span>
                                    Windows · Chrome
                                </span>

                                <small>
                                    Active now
                                </small>
                            </div>

                            <div className="security-current-badge">
                                Current
                            </div>
                        </div>

                        <button
                            type="button"
                            className="security-full-button"
                            onClick={() =>
                                handleComingSoon(
                                    "Session management"
                                )
                            }
                        >
                            Manage login sessions

                            <ChevronRight
                                size={16}
                            />
                        </button>
                    </section>

                    {/* Account verification */}

                    <section className="security-card">
                        <div className="security-card-header">
                            <div className="security-card-icon">
                                <UserCheck size={19} />
                            </div>

                            <div>
                                <h2>
                                    Account verification
                                </h2>

                                <p>
                                    Review your account
                                    verification status.
                                </p>
                            </div>
                        </div>

                        <div className="verification-list">
                            <VerificationItem
                                title="Email address"
                                description="Your email address has been verified."
                                verified
                            />

                            <VerificationItem
                                title="Account status"
                                description="Your Salok Earn account is currently active."
                                verified
                            />
                        </div>
                    </section>
                </main>

                {/* Sidebar */}

                <aside className="security-sidebar">
                    <div className="security-security-card">
                        <div className="security-security-icon">
                            <Shield size={21} />
                        </div>

                        <h3>
                            Security tips
                        </h3>

                        <ul>
                            <li>
                                Use a strong and unique
                                password.
                            </li>

                            <li>
                                Never share your login
                                credentials.
                            </li>

                            <li>
                                Enable two-factor
                                authentication when
                                available.
                            </li>

                            <li>
                                Review unfamiliar login
                                activity.
                            </li>
                        </ul>
                    </div>

                    <div className="security-side-card">
                        <h3>
                            Account settings
                        </h3>

                        <p>
                            Manage your profile and
                            general preferences.
                        </p>

                        <Link
                            to="/profile"
                            className="security-side-link"
                        >
                            Manage profile

                            <ChevronRight
                                size={16}
                            />
                        </Link>

                        <Link
                            to="/settings"
                            className="security-side-link"
                        >
                            General settings

                            <ChevronRight
                                size={16}
                            />
                        </Link>
                    </div>
                </aside>
            </div>
        </div>
    );
}

function VerificationItem({
    title,
    description,
    verified,
}) {
    return (
        <div className="verification-item">
            <div>
                <strong>{title}</strong>

                <span>{description}</span>
            </div>

            {verified && (
                <div className="verified-badge">
                    <CheckCircle2 size={15} />

                    Verified
                </div>
            )}
        </div>
    );
}

export default SecurityPage;