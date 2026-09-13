import { useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    LoaderCircle,
    Mail,
} from "lucide-react";
import { toast } from "sonner";

import AuthLayout from "../../components/auth/AuthLayout";
import {
    sendPasswordReset,
} from "../../services/mock/authService";
import logo from "../../assets/brand/salok-earn-logo.png";

export default function ForgotPasswordPage() {
    const [email, setEmail] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [submitted, setSubmitted] =
        useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const cleanEmail =
            email.trim();

        if (!cleanEmail) {
            toast.error(
                "Please enter your email address."
            );

            return;
        }

        try {
            setLoading(true);

            await sendPasswordReset(
                cleanEmail
            );

            setSubmitted(true);

            toast.success(
                "Password reset instructions sent."
            );
        } catch (error) {
            toast.error(
                error?.message ||
                "Unable to send the reset link."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            eyebrow={
                submitted
                    ? "CHECK YOUR INBOX"
                    : "ACCOUNT RECOVERY"
            }
            title={
                submitted ? (
                    <>
                        Almost there —
                        <span> check your email.</span>
                    </>
                ) : (
                    <>
                        Forgotten your
                        <span> password?</span>
                    </>
                )
            }
            description={
                submitted
                    ? "We've sent recovery instructions to your inbox. Follow the link to choose a new password."
                    : "It happens to the best of us. Enter your email and we'll help you get back into your account safely."
            }
            points={[
                "Recover access in minutes",
                "Your account stays secure",
                "Support is here if you need it",
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

            {!submitted ? (
                <>
                    <Link
                        to="/login"
                        className="auth-back-link"
                    >
                        <ArrowLeft size={16} />

                        Back to sign in
                    </Link>

                    <div className="auth-heading forgot-password-heading">

                        <div className="auth-recovery-icon">
                            <Mail size={23} />
                        </div>

                        <span className="auth-form-eyebrow">
                            ACCOUNT RECOVERY
                        </span>

                        <h2>
                            Forgot your
                            <span> password?</span>
                        </h2>

                        <p>
                            No worries. Enter the email
                            address associated with your
                            account and we'll help you get
                            back in.
                        </p>

                    </div>

                    <form
                        className="auth-form recovery-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="auth-field">

                            <label htmlFor="recovery-email">
                                Email address
                            </label>

                            <div className="auth-input-wrapper">

                                <Mail
                                    size={19}
                                    strokeWidth={1.8}
                                />

                                <input
                                    id="recovery-email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(
                                            event.target.value
                                        )
                                    }
                                    autoComplete="email"
                                />

                            </div>

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

                                    Sending reset link...
                                </>
                            ) : (
                                <>
                                    Send reset link

                                    <ArrowRight
                                        size={19}
                                    />
                                </>
                            )}
                        </button>

                    </form>

                    <div className="recovery-help">
                        <span>
                            Remember your password?
                        </span>

                        <Link to="/login">
                            Sign in
                        </Link>
                    </div>
                </>
            ) : (
                <div className="recovery-success">

                    <div className="recovery-success-icon">
                        <CheckCircle2
                            size={38}
                        />
                    </div>

                    <span className="auth-form-eyebrow">
                        CHECK YOUR INBOX
                    </span>

                    <h2>
                        Reset link
                        <span> sent.</span>
                    </h2>

                    <p>
                        We've sent password reset
                        instructions to:
                    </p>

                    <strong className="recovery-email">
                        {email}
                    </strong>

                    <p className="recovery-note">
                        Check your inbox and follow
                        the instructions to reset your
                        password. Don't forget to check
                        your spam folder if you don't see
                        the email.
                    </p>

                    <Link
                        to="/login"
                        className="auth-submit-button recovery-login-button"
                    >
                        Back to sign in

                        <ArrowRight size={19} />
                    </Link>

                    <button
                        type="button"
                        className="recovery-resend"
                        onClick={() =>
                            setSubmitted(false)
                        }
                    >
                        Use a different email
                    </button>

                </div>
            )}

        </AuthLayout>
    );
}