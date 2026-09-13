import logo from "../../assets/brand/salok-earn-logo.png";
import "../../styles/auth.css";

const defaultPoints = [
    "Simple ways to earn",
    "Track your rewards",
    "Built with security in mind",
];

export default function AuthLayout({
    children,
    eyebrow = "EARN MORE. LIVE MORE.",
    title = (
        <>
            Turn your time
            <span> into rewards.</span>
        </>
    ),
    description =
        "Complete tasks, play games, answer questions and discover simple ways to earn rewards online.",
    points = defaultPoints,
}) {
    return (
        <main className="auth-page">
            <div className="auth-shell">
                <section className="auth-brand-section">
                    <div className="auth-brand-content">

                        <div className="auth-brand-logo">
                            <img
                                src={logo}
                                alt="Salok Earn"
                                className="auth-logo-mark"
                            />

                            <span>Salok Earn</span>
                        </div>

                        <div className="auth-brand-copy">
                            <span className="auth-eyebrow">
                                {eyebrow}
                            </span>

                            <h1>
                                {title}
                            </h1>

                            <p>
                                {description}
                            </p>
                        </div>

                        <div className="auth-brand-points">
                            {points.map((point) => (
                                <div key={point}>
                                    <span className="auth-point-icon">✓</span>
                                    <span>{point}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="auth-decoration auth-decoration-one" />
                    <div className="auth-decoration auth-decoration-two" />
                    <div className="auth-decoration auth-decoration-three" />

                    <div className="auth-glow auth-glow-one" />
                    <div className="auth-glow auth-glow-two" />
                </section>

                <section className="auth-form-section">
                    <div className="auth-form-container">
                        {children}
                    </div>
                </section>
            </div>
        </main>
    );
}