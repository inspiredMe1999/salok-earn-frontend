import { useNavigate } from "react-router-dom";

import {
    ArrowUpRight,
    CheckCircle2,
    Clock3,
    Landmark,
    Lock,
    ShieldCheck,
    Sparkles,
    Wallet as WalletIcon,
} from "lucide-react";

import Button from "../../components/common/Button";

import "./wallet-preview.css";

const SAMPLE_TRANSACTIONS = [
    {
        title: "Offerwall reward",
        description: "Survey completed",
        amount: 250,
        status: "completed",
    },
    {
        title: "Trivia round reward",
        description: "General knowledge",
        amount: 120,
        status: "completed",
    },
    {
        title: "Referral bonus",
        description: "Friend joined Salok Earn",
        amount: 500,
        status: "pending",
    },
];

const WALLET_FEATURES = [
    {
        icon: WalletIcon,
        title: "One balance, every activity",
        description:
            "Rewards from trivia, offers, tasks and referrals land in a single, easy-to-track balance.",
    },
    {
        icon: Landmark,
        title: "Multiple payout methods",
        description:
            "Withdraw to your bank, mobile money or preferred payout method once you hit the minimum.",
    },
    {
        icon: ShieldCheck,
        title: "Secure & transparent",
        description:
            "Every credit and withdrawal is logged, timestamped and easy to review at any time.",
    },
];

function WalletPreview() {
    const navigate = useNavigate();

    const goToSignup = () => {
        navigate("/signup", {
            state: {
                from: "/wallet",
            },
        });
    };

    const goToLogin = () => {
        navigate("/login", {
            state: {
                from: "/wallet",
            },
        });
    };

    return (
        <div className="wallet-preview-page">
            {/* =================================================
                LOCKED HERO
               ================================================= */}

            <section className="wallet-preview-hero">
                <div className="wallet-preview-hero-copy">
                    <span className="wallet-preview-eyebrow">
                        <Lock size={12} />
                        GUEST PREVIEW
                    </span>

                    <h1>
                        Your wallet is waiting.
                    </h1>

                    <p>
                        Create a free account to
                        unlock your real balance,
                        track every reward and
                        request payouts.
                    </p>

                    <div className="wallet-preview-hero-actions">
                        <Button
                            size="large"
                            onClick={goToSignup}
                        >
                            Create free account
                        </Button>

                        <button
                            type="button"
                            className="wallet-preview-signin"
                            onClick={goToLogin}
                        >
                            Already have an account? Sign in
                        </button>
                    </div>
                </div>

                <div className="wallet-preview-balance-card">
                    <div className="wallet-preview-balance-top">
                        <span>
                            Available balance
                        </span>

                        <WalletIcon size={18} />
                    </div>

                    <strong className="wallet-preview-blurred">
                        0,000.00 SAK
                    </strong>

                    <div className="wallet-preview-balance-lock">
                        <Lock size={13} />
                        Sign in to reveal
                    </div>
                </div>
            </section>

            {/* =================================================
                FEATURES
               ================================================= */}

            <section className="wallet-preview-features">
                {WALLET_FEATURES.map((feature) => {
                    const Icon = feature.icon;

                    return (
                        <article
                            key={feature.title}
                            className="wallet-preview-feature-card"
                        >
                            <div className="wallet-preview-feature-icon">
                                <Icon size={19} />
                            </div>

                            <h3>
                                {feature.title}
                            </h3>

                            <p>
                                {feature.description}
                            </p>
                        </article>
                    );
                })}
            </section>

            {/* =================================================
                SAMPLE ACTIVITY (BLURRED)
               ================================================= */}

            <section className="wallet-preview-activity">
                <div className="wallet-preview-activity-header">
                    <div>
                        <span>
                            WHAT YOUR ACTIVITY COULD LOOK LIKE
                        </span>

                        <h2>
                            Recent transactions
                        </h2>
                    </div>

                    <Sparkles size={18} />
                </div>

                <div className="wallet-preview-activity-list">
                    {SAMPLE_TRANSACTIONS.map(
                        (transaction, index) => (
                            <div
                                key={index}
                                className="wallet-preview-transaction-row"
                            >
                                <div className="wallet-preview-transaction-icon">
                                    <ArrowUpRight
                                        size={16}
                                    />
                                </div>

                                <div className="wallet-preview-transaction-main">
                                    <strong>
                                        {transaction.title}
                                    </strong>

                                    <span>
                                        {transaction.description}
                                    </span>
                                </div>

                                <div className="wallet-preview-transaction-right">
                                    <span className="wallet-preview-transaction-amount">
                                        +{transaction.amount} SAK
                                    </span>

                                    <span className="wallet-preview-transaction-status">
                                        {transaction.status ===
                                            "completed" ? (
                                            <CheckCircle2
                                                size={12}
                                            />
                                        ) : (
                                            <Clock3
                                                size={12}
                                            />
                                        )}
                                        {transaction.status}
                                    </span>
                                </div>
                            </div>
                        )
                    )}

                    <div className="wallet-preview-activity-overlay">
                        <Lock size={18} />

                        <p>
                            Sign up to see your own
                            balance and transaction
                            history.
                        </p>

                        <Button
                            size="medium"
                            onClick={goToSignup}
                        >
                            Get started
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default WalletPreview;
