import { useState } from "react";
import {
    ArrowRight,
    LockKeyhole,
    ShieldCheck,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import adminAuthService from "../../services/mock/adminAuthService";

import "./AdminLoginPage.css";

function AdminLoginPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (!formData.email || !formData.password) {
            toast.error("Enter your email and password.");
            return;
        }

        try {
            setLoading(true);

            const response =
                await adminAuthService.adminLogin(
                    formData.email,
                    formData.password
                );

            if (!response.success) {
                toast.error(response.message);
                return;
            }

            toast.success("Welcome to the admin control center.");

            navigate("/admin", {
                replace: true,
            });
        } catch (error) {
            console.error(
                "Admin login failed:",
                error
            );

            toast.error(
                "Unable to sign in. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="admin-login-page">
            <div className="admin-login-background-glow glow-one" />
            <div className="admin-login-background-glow glow-two" />

            <section className="admin-login-card">
                <div className="admin-login-brand">
                    <div className="admin-login-icon">
                        <ShieldCheck size={27} />
                    </div>

                    <div>
                        <strong>Salok Earn</strong>
                        <span>Admin Control Center</span>
                    </div>
                </div>

                <div className="admin-login-heading">
                    <span className="admin-login-eyebrow">
                        Restricted access
                    </span>

                    <h1>Welcome back, administrator.</h1>

                    <p>
                        Sign in to manage the Salok Earn
                        platform.
                    </p>
                </div>

                <form
                    className="admin-login-form"
                    onSubmit={handleSubmit}
                >
                    <label htmlFor="admin-email">
                        Administrator email
                    </label>

                    <input
                        id="admin-email"
                        name="email"
                        type="email"
                        placeholder="admin@salok.earn"
                        value={formData.email}
                        onChange={handleChange}
                        autoComplete="username"
                    />

                    <label htmlFor="admin-password">
                        Password
                    </label>

                    <div className="admin-password-field">
                        <LockKeyhole size={18} />

                        <input
                            id="admin-password"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="admin-login-submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Signing in..."
                            : "Sign in to admin"}

                        {!loading && (
                            <ArrowRight size={18} />
                        )}
                    </button>
                </form>

                <div className="admin-demo-credentials">
                    <strong>Mock login credentials</strong>

                    <span>
                        admin@salok.earn
                    </span>

                    <span>
                        admin123
                    </span>
                </div>

                <p className="admin-login-notice">
                    This is a frontend mock environment.
                    Real Firebase administrator verification
                    will be connected later.
                </p>
            </section>
        </main>
    );
}

export default AdminLoginPage;