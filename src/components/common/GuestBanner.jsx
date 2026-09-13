import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sparkles, X } from "lucide-react";

import "./GuestBanner.css";

/*
|--------------------------------------------------------------------------
| Guest Banner
|--------------------------------------------------------------------------
|
| Shown at the top of pages that guests are allowed to browse
| (Earn, Trivia, Wallet). Lets a visitor know they're looking at
| a preview and nudges them toward creating a free account,
| without blocking them from exploring the page itself.
|
*/

function GuestBanner({
    message =
        "You're browsing as a guest. Create a free account to start earning for real.",
    ctaLabel = "Create free account",
}) {
    const navigate = useNavigate();
    const location = useLocation();

    const [dismissed, setDismissed] =
        useState(false);

    if (dismissed) {
        return null;
    }

    const goToSignup = () => {
        navigate("/signup", {
            state: {
                from: location.pathname,
            },
        });
    };

    const goToLogin = () => {
        navigate("/login", {
            state: {
                from: location.pathname,
            },
        });
    };

    return (
        <div className="guest-banner">
            <div className="guest-banner-icon">
                <Sparkles size={16} />
            </div>

            <div className="guest-banner-copy">
                <strong>Guest preview</strong>
                <span>{message}</span>
            </div>

            <div className="guest-banner-actions">
                <button
                    type="button"
                    className="guest-banner-login"
                    onClick={goToLogin}
                >
                    Sign in
                </button>

                <button
                    type="button"
                    className="guest-banner-signup"
                    onClick={goToSignup}
                >
                    {ctaLabel}
                </button>
            </div>

            <button
                type="button"
                className="guest-banner-dismiss"
                aria-label="Dismiss"
                onClick={() =>
                    setDismissed(true)
                }
            >
                <X size={15} />
            </button>
        </div>
    );
}

export default GuestBanner;
