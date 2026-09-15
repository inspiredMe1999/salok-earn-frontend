import { useEffect, useState } from "react";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

import confettiLottie from "../../assets/animations/Confetti.json?url";

import "./ConfettiBurst.css";

/*
|--------------------------------------------------------------------------
| Confetti Burst
|--------------------------------------------------------------------------
|
| A one-shot confetti drop layered over whatever page mounts it —
| pointer-events are disabled so it never blocks the content
| underneath, and it unmounts itself once the animation finishes so
| it doesn't sit around as a dead, invisible layer.
|
| Usage: <ConfettiBurst /> — mount it once, right when the success
| state appears (an unconditionally-rendered instance won't replay;
| give it a fresh `key` if you need it to fire again).
|--------------------------------------------------------------------------
*/

function ConfettiBurst() {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        // Safety net in case the "complete" event never arrives.
        const timeoutId = setTimeout(() => {
            setVisible(false);
        }, 4500);

        return () => clearTimeout(timeoutId);
    }, []);

    if (!visible) {
        return null;
    }

    return (
        <div
            className="confetti-burst"
            aria-hidden="true"
        >
            <DotLottieReact
                src={confettiLottie}
                loop={false}
                autoplay
                dotLottieRefCallback={(instance) => {
                    if (!instance) {
                        return;
                    }

                    instance.addEventListener(
                        "complete",
                        () => setVisible(false)
                    );
                }}
            />
        </div>
    );
}

export default ConfettiBurst;