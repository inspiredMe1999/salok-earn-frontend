import { useCallback, useEffect, useRef } from "react";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

import moneyTransferLottie from "../../assets/animations/money-transfer.json?url";
import celebrationLottie from "../../assets/animations/Success celebration2.json?url";
import failedLottie from "../../assets/animations/Failed Status.json?url";

import "./WithdrawalStatusOverlay.css";

/*
|--------------------------------------------------------------------------
| Withdrawal Status Overlay
|--------------------------------------------------------------------------
|
| A full-screen sequence shown while a withdrawal request is being
| submitted:
|
|   "transferring" — the money-transfer animation loops while the
|                     request is actually sent, with a guaranteed
|                     minimum display time (enforced by the caller, see
|                     WithdrawPage) so it never feels like a flicker
|                     even on a fast response.
|
|   "celebrating"   — plays once when the request succeeds, then hands
|                      back to the page (which reveals the success view
|                      underneath, confetti included).
|
|   "failed"         — plays once if the request is rejected, then
|                       hands back to the form.
|
| Each non-looping phase calls `onComplete` both when its animation
| naturally finishes (via the DotLottie "complete" event) and after a
| fallback timeout, so the sequence can never get stuck if a phase's
| downloaded animation file loops, is trimmed, or fails to decode.
|
|--------------------------------------------------------------------------
*/

const PHASES = {
    transferring: {
        src: moneyTransferLottie,
        loop: true,
        fallbackMs: null,
        eyebrow: "PROCESSING",
        title: "Transferring your funds",
        message:
            "Sit tight — we're securely sending your withdrawal request.",
    },
    celebrating: {
        src: celebrationLottie,
        loop: false,
        fallbackMs: 3200,
        eyebrow: "SUCCESS",
        title: "You're all set!",
        message:
            "Your withdrawal has been submitted successfully.",
    },
    failed: {
        src: failedLottie,
        loop: false,
        fallbackMs: 2600,
        eyebrow: "SOMETHING WENT WRONG",
        title: "We couldn't process that",
        message:
            "No funds were moved — please try again in a moment.",
    },
};

function WithdrawalStatusOverlay({ phase, onComplete }) {
    const firedRef = useRef(false);

    const content = phase ? PHASES[phase] : null;

    const fireOnce = useCallback(() => {
        if (firedRef.current) {
            return;
        }

        firedRef.current = true;
        onComplete?.();
    }, [onComplete]);

    /*
     * Reset the "already fired" guard whenever a new phase starts,
     * and arm the fallback timer for phases that should self-advance
     * even if the "complete" event never reaches us.
     */
    useEffect(() => {
        firedRef.current = false;

        if (!content?.fallbackMs) {
            return undefined;
        }

        const timeoutId = setTimeout(
            fireOnce,
            content.fallbackMs
        );

        return () => clearTimeout(timeoutId);
    }, [phase, content, fireOnce]);

    const handleDotLottieRef = useCallback(
        (instance) => {
            if (!instance) {
                return;
            }

            instance.addEventListener(
                "complete",
                fireOnce
            );
        },
        [fireOnce]
    );

    if (!phase || !content) {
        return null;
    }

    return (
        <div
            className="withdrawal-status-overlay"
            role="status"
            aria-live="polite"
        >
            <div
                className={`withdrawal-status-card withdrawal-status-card--${phase}`}
            >
                <div className="withdrawal-status-lottie-stage">
                    <DotLottieReact
                        key={phase}
                        src={content.src}
                        loop={content.loop}
                        autoplay
                        dotLottieRefCallback={
                            content.loop
                                ? undefined
                                : handleDotLottieRef
                        }
                    />
                </div>

                <span className="withdrawal-status-eyebrow">
                    {content.eyebrow}
                </span>

                <h2>{content.title}</h2>
                <p>{content.message}</p>

                {phase === "transferring" && (
                    <div className="withdrawal-status-progress">
                        <span />
                    </div>
                )}
            </div>
        </div>
    );
}

export default WithdrawalStatusOverlay;