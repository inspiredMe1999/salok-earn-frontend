import "./Loader.css";

import logo from "../../assets/brand/salok-earn-logo.png";

/*
|--------------------------------------------------------------------------
| Loader
|--------------------------------------------------------------------------
|
| The single, standard loading indicator for the whole platform: the
| Salok Earn mark at the center, a rotating gold gradient ring
| sweeping around it, a soft pulsing glow behind it, and a few gold
| sparks orbiting the ring. Use this anywhere a page or section needs
| to show a loading state instead of a one-off spinner, so the whole
| product feels like it comes from one place.
|
| Props:
| - size        "sm" | "md" | "lg"   (default "md")
| - label       optional message shown beneath the mark
| - fullScreen  renders as a fixed, full-viewport overlay — use this
|               only for app-level gates (auth/session checks), not
|               for loading states inside a page's own layout
|
*/

function Loader({
    size = "md",
    label,
    fullScreen = false,
}) {
    const stage = (
        <div className={`se-loader se-loader--${size}`}>
            <div className="se-loader-stage">
                <span
                    className="se-loader-glow"
                    aria-hidden="true"
                />

                <span
                    className="se-loader-ring"
                    aria-hidden="true"
                />

                <span
                    className="se-loader-orbit"
                    aria-hidden="true"
                >
                    <span
                        className="se-loader-dot"
                        style={{ "--dot-angle": "0deg" }}
                    />

                    <span
                        className="se-loader-dot"
                        style={{ "--dot-angle": "120deg" }}
                    />

                    <span
                        className="se-loader-dot"
                        style={{ "--dot-angle": "240deg" }}
                    />
                </span>

                <span className="se-loader-mark">
                    <img
                        src={logo}
                        alt=""
                        className="se-loader-logo"
                    />
                </span>
            </div>

            {label && (
                <p className="se-loader-label">
                    {label}
                </p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div
                className="se-loader-screen"
                role="status"
                aria-live="polite"
            >
                {stage}
            </div>
        );
    }

    return (
        <div role="status" aria-live="polite">
            {stage}
        </div>
    );
}

export default Loader;
