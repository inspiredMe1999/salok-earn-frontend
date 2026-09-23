import { useState } from "react";
import {
Link,
useNavigate,
useLocation,
} from "react-router-dom";

import {
Eye,
EyeOff,
Mail,
LockKeyhole,
ArrowRight,
ArrowLeft,
LoaderCircle,
} from "lucide-react";
import { toast } from "sonner";

import AuthLayout from "../../components/auth/AuthLayout";
import useAuth from "../../hooks/useAuth";
import logo from "../../assets/brand/salok-earn-logo.png";

export default function LoginPage() {
const navigate = useNavigate();

 
const {
    login,
} = useAuth();

const location =
    useLocation();

const [formData, setFormData] = useState({
    email: "",
    password: "",
});

const [showPassword, setShowPassword] = useState(false);
const [rememberMe, setRememberMe] = useState(false);
const [loading, setLoading] = useState(false);

const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
        ...previous,
        [name]: value,
    }));
};

const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.email.trim()) {
        toast.error("Please enter your email address.");
        return;
    }

    if (!formData.password) {
        toast.error("Please enter your password.");
        return;
    }

    try {
        setLoading(true);

        await login(
            formData.email,
            formData.password
        );

        if (rememberMe) {
            localStorage.setItem(
                "salok_remember_login",
                "true"
            );
        }

        toast.success("Welcome back!");

        const destination =
            location.state?.from ||
            "/dashboard";

        navigate(destination, {
            replace: true,
        });

    } catch (error) {
        toast.error(
            error?.message ||
            "Unable to sign in. Please try again."
        );
    } finally {
        setLoading(false);
    }
};

return (
    <AuthLayout
        eyebrow="WELCOME BACK"
        title={
            <>
                Pick up right
                <span> where you left off.</span>
            </>
        }
        description="Sign in to track your earnings, complete tasks and cash out your rewards whenever you're ready."
    >

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

        <div className="auth-mobile-brand">
            <div className="auth-brand-logo">
                <img
                    src={logo}
                    alt="Salok Earn"
                    className="auth-logo-mark"
                />

                <span>Salok Earn</span>
            </div>
        </div>

        <div className="auth-heading">

            <span className="auth-form-eyebrow">
                WELCOME BACK
            </span>

            <h2>
                Sign in to your
                <span> account.</span>
            </h2>

            <p>
                Enter your details below to continue
                earning with Salok Earn.
            </p>
        </div>

        <form
            className="auth-form"
            onSubmit={handleSubmit}
        >

            <div className="auth-field">
                <label htmlFor="email">
                    Email address
                </label>

                <div className="auth-input-wrapper">
                    <Mail
                        size={19}
                        strokeWidth={1.8}
                    />

                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        autoComplete="email"
                    />
                </div>
            </div>

            <div className="auth-field">
                <div className="auth-label-row">
                    <label htmlFor="password">
                        Password
                    </label>

                    <Link to="/forgot-password">
                        Forgot password?
                    </Link>
                </div>

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
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                    />

                    <button
                        type="button"
                        className="auth-password-toggle"
                        onClick={() =>
                            setShowPassword(
                                (previous) => !previous
                            )
                        }
                        aria-label={
                            showPassword
                                ? "Hide password"
                                : "Show password"
                        }
                    >
                        {showPassword ? (
                            <EyeOff size={19} />
                        ) : (
                            <Eye size={19} />
                        )}
                    </button>
                </div>
            </div>

            <label className="auth-checkbox">
                <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) =>
                        setRememberMe(
                            event.target.checked
                        )
                    }
                />

                <span className="auth-checkbox-box">
                    ✓
                </span>

                <span>
                    Remember me
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

                        Signing you in...
                    </>
                ) : (
                    <>
                        Sign in

                        <ArrowRight size={19} />
                    </>
                )}
            </button>

        </form>

        <div className="auth-divider">
            <span>OR</span>
        </div>

        <p className="auth-switch">
            Don't have an account?

            <Link to="/signup">
                Create an account
            </Link>
        </p>

        <p className="auth-terms">
            By continuing, you agree to Salok Earn's
            <Link to="/terms">
                Terms of Service
            </Link>
            and
            <Link to="/privacy">
                Privacy Policy
            </Link>.
        </p>

    </AuthLayout>
);
 

}
