import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowRight,
    ArrowLeft,
    Check,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    User,
    LoaderCircle,
} from "lucide-react";
import { toast } from "sonner";

import AuthLayout from "../../components/auth/AuthLayout";
import { register } from "../../services/mock/authService";
import logo from "../../assets/brand/salok-earn-logo.png";

export default function SignupPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [acceptTerms, setAcceptTerms] =
        useState(false);

    const [loading, setLoading] =
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

    const passwordStrength = useMemo(() => {
        const password =
            formData.password;

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

        if (/[0-9]/.test(password)) {
            score++;
        }

        if (/[^A-Za-z0-9]/.test(password)) {
            score++;
        }

        if (score <= 1) {
            return {
                score,
                label: "Weak",
            };
        }

        if (score === 2) {
            return {
                score,
                label: "Fair",
            };
        }

        if (score === 3) {
            return {
                score,
                label: "Good",
            };
        }

        return {
            score,
            label: "Strong",
        };
    }, [formData.password]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const firstName =
            formData.firstName.trim();

        const lastName =
            formData.lastName.trim();

        const email =
            formData.email.trim();

        if (!firstName) {
            toast.error(
                "Please enter your first name."
            );

            return;
        }

        if (!lastName) {
            toast.error(
                "Please enter your last name."
            );

            return;
        }

        if (!email) {
            toast.error(
                "Please enter your email address."
            );

            return;
        }

        if (!formData.password) {
            toast.error(
                "Please create a password."
            );

            return;
        }

        if (formData.password.length < 8) {
            toast.error(
                "Your password must contain at least 8 characters."
            );

            return;
        }

        if (
            formData.password !==
            formData.confirmPassword
        ) {
            toast.error(
                "Passwords do not match."
            );

            return;
        }

        if (!acceptTerms) {
            toast.error(
                "Please accept the Terms of Service to continue."
            );

            return;
        }

        try {
            setLoading(true);

            await register({
                firstName,
                lastName,
                email,
                password:
                    formData.password,
            });

            toast.success(
                "Account created successfully!"
            );

            navigate("/signup/complete");
        } catch (error) {
            toast.error(
                error?.message ||
                "Unable to create your account."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            eyebrow="JOIN SALOK EARN"
            title={
                <>
                    Turn your time
                    <span> into rewards.</span>
                </>
            }
            description="Create your free account and discover simple, everyday ways to earn real rewards online."
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

            {/* Back home */}
                    <Link
                        to="/"
                        className="auth-back-home"
                    >
                        <ArrowLeft
                            size={17}
                            strokeWidth={2}
                        />
            
                        <span>Back home</span>
                    </Link>

            <div className="auth-heading auth-signup-heading">
                <span className="auth-form-eyebrow">
                    GET STARTED
                </span>

                <h2>
                    Create your
                    <span> account.</span>
                </h2>

                <p>
                    Join Salok Earn and start turning
                    your time into rewards.
                </p>
            </div>

            <form
                className="auth-form signup-form"
                onSubmit={handleSubmit}
            >

                <div className="auth-name-grid">

                    <div className="auth-field">
                        <label htmlFor="firstName">
                            First name
                        </label>

                        <div className="auth-input-wrapper">
                            <User
                                size={18}
                                strokeWidth={1.8}
                            />

                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                placeholder="First name"
                                value={
                                    formData.firstName
                                }
                                onChange={
                                    handleChange
                                }
                                autoComplete="given-name"
                            />
                        </div>
                    </div>

                    <div className="auth-field">
                        <label htmlFor="lastName">
                            Last name
                        </label>

                        <div className="auth-input-wrapper">
                            <User
                                size={18}
                                strokeWidth={1.8}
                            />

                            <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                placeholder="Last name"
                                value={
                                    formData.lastName
                                }
                                onChange={
                                    handleChange
                                }
                                autoComplete="family-name"
                            />
                        </div>
                    </div>

                </div>

                <div className="auth-field">
                    <label htmlFor="signup-email">
                        Email address
                    </label>

                    <div className="auth-input-wrapper">
                        <Mail
                            size={18}
                            strokeWidth={1.8}
                        />

                        <input
                            id="signup-email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            value={
                                formData.email
                            }
                            onChange={
                                handleChange
                            }
                            autoComplete="email"
                        />
                    </div>
                </div>

                <div className="auth-field">
                    <label htmlFor="signup-password">
                        Password
                    </label>

                    <div className="auth-input-wrapper">
                        <LockKeyhole
                            size={18}
                            strokeWidth={1.8}
                        />

                        <input
                            id="signup-password"
                            name="password"
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            placeholder="Create a password"
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
                                <EyeOff size={18} />
                            ) : (
                                <Eye size={18} />
                            )}
                        </button>
                    </div>

                    {formData.password && (
                        <div className="password-strength">

                            <div className="password-strength-top">
                                <span>
                                    Password strength
                                </span>

                                <strong
                                    className={`strength-${passwordStrength.score}`}
                                >
                                    {
                                        passwordStrength.label
                                    }
                                </strong>
                            </div>

                            <div className="password-strength-bars">
                                {[1, 2, 3, 4].map(
                                    (bar) => (
                                        <span
                                            key={bar}
                                            className={
                                                bar <=
                                                    passwordStrength.score
                                                    ? "active"
                                                    : ""
                                            }
                                        />
                                    )
                                )}
                            </div>

                        </div>
                    )}
                </div>

                <div className="auth-field">
                    <label htmlFor="confirmPassword">
                        Confirm password
                    </label>

                    <div className="auth-input-wrapper">
                        <LockKeyhole
                            size={18}
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
                            placeholder="Repeat your password"
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
                                <EyeOff size={18} />
                            ) : (
                                <Eye size={18} />
                            )}
                        </button>
                    </div>

                    {formData.confirmPassword &&
                        formData.password ===
                        formData.confirmPassword && (
                            <div className="password-match">
                                <Check size={14} />
                                Passwords match
                            </div>
                        )}
                </div>

                <label className="auth-checkbox terms-checkbox">

                    <input
                        type="checkbox"
                        checked={acceptTerms}
                        onChange={(event) =>
                            setAcceptTerms(
                                event.target.checked
                            )
                        }
                    />

                    <span className="auth-checkbox-box">
                        ✓
                    </span>

                    <span>
                        I agree to the
                        <Link to="/terms">
                            Terms of Service
                        </Link>
                        and
                        <Link to="/privacy">
                            Privacy Policy
                        </Link>
                    </span>

                </label>

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

                            Creating account...
                        </>
                    ) : (
                        <>
                            Create account

                            <ArrowRight
                                size={19}
                            />
                        </>
                    )}
                </button>

            </form>

            <p className="auth-switch signup-switch">
                Already have an account?

                <Link to="/login">
                    Sign in
                </Link>
            </p>

        </AuthLayout>
    );
}