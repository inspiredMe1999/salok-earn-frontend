import { useEffect } from "react";

import {
    ArrowRight,
    Coins,
    LogIn,
    ShieldCheck,
    Sparkles,
    X,
    Zap,
} from "lucide-react";

import { useAuthGate } from "../../context/AuthGateContext";

import "./AuthGateModal.css";

const REASSURANCES = [
    {
        icon: Zap,
        text: "Takes less than a minute",
    },
    {
        icon: Coins,
        text: "Free to join, no card required",
    },
    {
        icon: ShieldCheck,
        text: "Your progress up to now isn't lost",
    },
];

/*
|--------------------------------------------------------------------------
| Auth Gate Modal
|--------------------------------------------------------------------------
|
| Rendered once, near the root of the app (see App.jsx), so any page can
| trigger it via useAuthGate().openAuthGate(). It never navigates away
| on its own — it only opens once the visitor chooses "Create free
| account" or "Sign in", at which point control hands off to the real
| auth pages.
|
|--------------------------------------------------------------------------
*/

function AuthGateModal() {
    const {
        gate,
        isOpen,
        closeAuthGate,
        goToSignup,
        goToLogin,
    } = useAuthGate();

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                closeAuthGate();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener(
                "keydown",
                handleKeyDown
            );

            document.body.style.overflow = "";
        };
    }, [isOpen, closeAuthGate]);

    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="auth-gate-backdrop"
            role="presentation"
            onClick={closeAuthGate}
        >
            <div
                className="auth-gate-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="auth-gate-title"
                onClick={(event) => event.stopPropagation()}
            >
                <button
                    type="button"
                    className="auth-gate-close"
                    aria-label="Close"
                    onClick={closeAuthGate}
                >
                    <X size={18} />
                </button>

                <div className="auth-gate-icon">
                    <Sparkles size={22} />
                </div>

                <span className="auth-gate-eyebrow">
                    ACCOUNT REQUIRED
                </span>

                <h2 id="auth-gate-title">
                    {gate?.title}
                </h2>

                <p>
                    {gate?.message}
                </p>

                <div className="auth-gate-reassurances">
                    {REASSURANCES.map((item) => {
                        const Icon = item.icon;

                        return (
                            <div key={item.text}>
                                <Icon size={13} />
                                <span>{item.text}</span>
                            </div>
                        );
                    })}
                </div>

                <div className="auth-gate-actions">
                    <button
                        type="button"
                        className="auth-gate-primary"
                        onClick={goToSignup}
                    >
                        Create free account
                        <ArrowRight size={16} />
                    </button>

                    <button
                        type="button"
                        className="auth-gate-secondary"
                        onClick={goToLogin}
                    >
                        <LogIn size={15} />
                        I already have an account
                    </button>
                </div>

                <button
                    type="button"
                    className="auth-gate-dismiss"
                    onClick={closeAuthGate}
                >
                    Keep browsing as a guest
                </button>
            </div>
        </div>
    );
}

export default AuthGateModal;