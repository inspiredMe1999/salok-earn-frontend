export default function Container({
    children,
    className = "",
}) {
    return (
        <div
            className={[
                "se-container",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {children}
        </div>
    );
}