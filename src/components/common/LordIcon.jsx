import { Player } from "@lordicon/react";

export default function LordIcon({
    icon,
    size = 64,
    colorize,
}) {
    return (
        <Player
            icon={icon}
            size={size}
            colorize={colorize}
            state="morph"
            colors="primary:#D6A94A,secondary:#F4D27A"
        />
    );
}