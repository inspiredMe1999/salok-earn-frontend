import { useState } from "react";
import {
    Link,
    useNavigate,
} from "react-router-dom";

import {
    ArrowLeft,
    ArrowRight,
    Check,
    Eye,
    EyeOff,
    KeyRound,
    LoaderCircle,
    LockKeyhole,
    ShieldCheck,
} from "lucide-react";

import { toast } from "sonner";

import AuthLayout from "../../components/auth/AuthLayout";
import { resetPassword } from "../../services/mock/authService";
import logo from "../../assets/brand/salok-earn-logo.png";

export default function ResetPasswordPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [loading, setLoading] = useState(false);

    const [success, setSuccess] =
        useState(false);

    const handleChange = (event) => {
        const {
            name,
            value,
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const getPasswordStrength = () => {
        const password = formData.password;

        if (!password) {
            return {
                score: 0,
                label: "",
            };
        }

        let score = 0;

        if (password.length >= 8) {
            score++;
        }

        if (/[A-Z]/.test(password)) {
            score++;
        }

        if (/[a-z]/.test(password)) {
            score++;
        }

        if (/[0-9]/.test(password)) {
            score++;
        }

        if (/[^A-Za-z0-9]/.test(password)) {
            score++;
        }

        if (score <= 2) {
            return {
                score,
                label: "Weak",
            };
        }

        if (score <= 3) {
            return {
                score,
                label: "Fair",
            };
        }

        if (score <= 4) {
            return {
                score,
                label: "Good",
            };
        }

        return {
            score,
            label: "Strong",
        };
    };

    const passwordStrength =
        getPasswordStrength();

    const passwordsMatch =
        formData.confirmPassword &&
        formData.password ===
        formData.confirmPassword;

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!formData.password) {
            toast.error(
                "Please enter a new password."
            );

            return;
        }

        if (formData.password.length < 8) {
            toast.error(
                "Your password must contain at least 8 characters."
            );

            return;
        }

        if (!formData.confirmPassword) {
            toast.error(
                "Please confirm your new password."
            );

            return;
        }

        if (
            formData.password !==
            formData.confirmPassword
        ) {
            toast.error(
                "Your passwords do not match."
            );

            return;
        }

        try {
            setLoading(true);

            await resetPassword(
                formData.password
            );

            setSuccess(true);

            toast.success(
                "Your password has been changed."
            );
        } catch (error) {
            toast.error(
                error?.message ||
                "Unable to reset your password."
            );
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <AuthLayout
                eyebrow="PASSWORD UPDATED"
                title={
                    <>
                        You're all
                        <span> set.</span>
                    </>
                }
                description="Your password has been updated. Sign back in to continue earning with Salok Earn."
                points={[
                    "Your account is fully secure",
                    "Sign in anytime, anywhere",
                    "Continue earning right away",
                ]}
            >
                <div className="auth-mobile-brand">
                    <div className="auth-brand-logo">
                        <img
                            src={logo}
                            alt="Salok Earn"
                            className="auth-logo-mark"
                        />

                        <span>
                            Salok Earn
                        </span>
                    </div>
                </div>

                <div className="recovery-success reset-success">
                    <div className="recovery-success-icon">
                        <Check size={30} />
                    </div>

                    <span className="auth-form-eyebrow">
                        PASSWORD UPDATED
                    </span>

                    <h2>
                        You're all
                        <span> set.</span>
                    </h2>

                    <p>
                        Your password has been
                        successfully changed. You
                        can now sign in with your
                        new password.
                    </p>

                    <button
                        type="button"
                        className="auth-submit-button recovery-login-button"
                        onClick={() =>
                            navigate("/login")
                        }
                    >
                        Continue to sign in
                        <ArrowRight size={19} />
                    </button>

                    <div className="recovery-note">
                        <ShieldCheck
                            size={17}
                        />

                        <span>
                            Your account security
                            remains protected.
                        </span>
                    </div>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            eyebrow="SECURE YOUR ACCOUNT"
            title={
                <>
                    Choose a strong
                    <span> new password.</span>
                </>
            }
            description="Create a new password to keep your account, your earnings and your data protected."
            points={[
                "Encrypted and secure",
                "Use 8+ characters",
                "Avoid reusing old passwords",
            ]}
        >
            <div className="auth-mobile-brand">
                <div className="auth-brand-logo">
                    <img
                        src={logo}
                        alt="Salok Earn"
                        className="auth-logo-mark"
                    />

                    <span>
                        Salok Earn
                    </span>
                </div>
            </div>

            <Link
                to="/forgot-password"
                className="auth-back-link"
            >
                <ArrowLeft size={17} />
                Back
            </Link>

            <div className="auth-recovery-icon">
                <KeyRound size={25} />
            </div>

            <div className="auth-heading forgot-password-heading">
                <span className="auth-form-eyebrow">
                    CREATE NEW PASSWORD
                </span>

                <h2>
                    Secure your
                    <span> account.</span>
                </h2>

                <p>
                    Choose a strong new password
                    that you will use the next time
                    you sign in.
                </p>
            </div>

            <form
                className="auth-form recovery-form"
                onSubmit={handleSubmit}
            >
                <div className="auth-field">
                    <label htmlFor="password">
                        New password
                    </label>

                    <div className="auth-input-wrapper">
                        <LockKeyhole
                            size={19}
                            strokeWidth={1.8}
                        />

                        <input
                            id="password"
                            name="password"
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            placeholder="Create a new password"
                            value={
                                formData.password
                            }
                            onChange={
                                handleChange
                            }
                            autoComplete="new-password"
                        />

                        <button
                            type="button"
                            className="auth-password-toggle"
                            onClick={() =>
                                setShowPassword(
                                    (previous) =>
                                        !previous
                                )
                            }
                            aria-label={
                                showPassword
                                    ? "Hide password"
                                    : "Show password"
                            }
                        >
                            {showPassword ? (
                                <EyeOff
                                    size={19}
                                />
                            ) : (
                                <Eye
                                    size={19}
                                />
                            )}
                        </button>
                    </div>

                    {formData.password && (
                        <div className="password-strength">
                            <div className="password-strength-top">
                                <span>
                                    Password strength
                                </span>

                                <strong>
                                    {
                                        passwordStrength.label
                                    }
                                </strong>
                            </div>

                            <div className="password-strength-bars">
                                {[1, 2, 3, 4, 5].map(
                                    (level) => (
                                        <span
                                            key={
                                                level
                                            }
                                            className={
                                                level <=
                                                    passwordStrength.score
                                                    ? "active"
                                                    : ""
                                            }
                                        />
                                    )
                                )}
                            </div>

                            <p>
                                Use 8+ characters
                                with a mix of
                                letters, numbers
                                and symbols.
                            </p>
                        </div>
                    )}
                </div>

                <div className="auth-field">
                    <label htmlFor="confirmPassword">
                        Confirm new password
                    </label>

                    <div className="auth-input-wrapper">
                        <LockKeyhole
                            size={19}
                            strokeWidth={1.8}
                        />

                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={
                                showConfirmPassword
                                    ? "text"
                                    : "password"
                            }
                            placeholder="Repeat your new password"
                            value={
                                formData.confirmPassword
                            }
                            onChange={
                                handleChange
                            }
                            autoComplete="new-password"
                        />

                        <button
                            type="button"
                            className="auth-password-toggle"
                            onClick={() =>
                                setShowConfirmPassword(
                                    (previous) =>
                                        !previous
                                )
                            }
                            aria-label={
                                showConfirmPassword
                                    ? "Hide password"
                                    : "Show password"
                            }
                        >
                            {showConfirmPassword ? (
                                <EyeOff
                                    size={19}
                                />
                            ) : (
                                <Eye
                                    size={19}
                                />
                            )}
                        </button>
                    </div>

                    {formData.confirmPassword && (
                        <div
                            className={
                                passwordsMatch
                                    ? "password-match success"
                                    : "password-match error"
                            }
                        >
                            <span>
                                {passwordsMatch
                                    ? "✓"
                                    : "!"}
                            </span>

                            {passwordsMatch
                                ? "Passwords match"
                                : "Passwords do not match"}
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    className="auth-submit-button"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <LoaderCircle
                                size={19}
                                className="auth-spinner"
                            />

                            Updating password...
                        </>
                    ) : (
                        <>
                            Update password
                            <ArrowRight
                                size={19}
                            />
                        </>
                    )}
                </button>
            </form>

            <div className="recovery-help">
                <ShieldCheck size={18} />

                <span>
                    Choose a password that you
                    don't use on other websites.
                </span>
            </div>
        </AuthLayout>
    );
}