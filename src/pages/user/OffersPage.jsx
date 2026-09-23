import { useEffect, useMemo, useState } from "react";

import {
    ArrowRight,
    Clock3,
    ExternalLink,
    Lock,
    ShieldCheck,
    Sparkles,
    Store,
} from "lucide-react";

import { getEarnPageData } from "../../services/mock/earnService";

import useAuth from "../../hooks/useAuth";
import { useAuthGate } from "../../context/AuthGateContext";
import GuestBanner from "../../components/common/GuestBanner";

import "./offerwalls.css";

import Loader from "../../components/common/Loader";

function formatReward(amount, currency) {
    return `${Number(amount).toLocaleString("en-US")} ${currency}`;
}

const REWARD_NETWORKS = [
    {
        name: "Timewall",
        description:
            "One of the largest offerwalls — surveys, app installs and quick offers refreshed daily.",
        tag: "Most offers",
    },
    {
        name: "Wannads",
        description:
            "App trials and everyday partner offers, usually completed in a few minutes.",
        tag: "Fast payouts",
    },
    {
        name: "CPX Research",
        description:
            "Paid survey panels matched to your profile for higher completion rates.",
        tag: "Surveys",
    },
    {
        name: "TheoremReach",
        description:
            "Academic and market research surveys from real research partners.",
        tag: "Research",
    },
];

function OffersPage() {
    const { isAuthenticated } = useAuth();
    const { openAuthGate } = useAuthGate();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        async function loadData() {
            try {
                setLoading(true);

                const result = await getEarnPageData();

                if (mounted) {
                    setData(result);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        loadData();

        return () => {
            mounted = false;
        };
    }, []);

    const offers = useMemo(() => {
        if (!data) {
            return [];
        }

        return data.opportunities.filter(
            (item) => item.type === "offers"
        );
    }, [data]);

    const handleNetworkClick = (network) => {
        openAuthGate({
            title: `Sign up to explore ${network.name}`,
            message:
                "Create a free account to open this offerwall and start earning from its offers.",
            redirectTo: "/offerwalls",
        });
    };

    const handleOfferClick = (offer) => {
        if (isAuthenticated) {
            return;
        }

        openAuthGate({
            title: "Sign up to start this offer",
            message: `Create a free account to start "${offer.title}" and collect the reward.`,
            redirectTo: `/earn/${offer.id}`,
        });
    };

    return (
        <div className="offerwalls-page">
            {/* =================================================
                HEADER
               ================================================= */}

            <section className="offerwalls-header">
                <span className="offerwalls-eyebrow">
                    <Store size={13} />
                    OFFERWALLS
                </span>

                <h1>
                    Every trusted offer network,
                    <span> in one place.</span>
                </h1>

                <p>
                    An offerwall is a collection of offers
                    from a third-party network app installs,
                    sign-ups, quick surveys and trials. Complete
                    one through Salok and the reward lands in
                    your wallet automatically.
                </p>
            </section>

            {!isAuthenticated && (
                <GuestBanner message="You can look through every network and offer below. Create a free account to actually open one and start earning." />
            )}

            {/* =================================================
                NETWORKS
               ================================================= */}

            <section className="offerwalls-section">
                <div className="offerwalls-section-heading">
                    <span className="offerwalls-section-label">
                        SUPPORTED NETWORKS
                    </span>

                    <h2>Pick a network to explore</h2>
                </div>

                <div className="offerwalls-network-grid">
                    {REWARD_NETWORKS.map((network) => (
                        <article
                            key={network.name}
                            className="offerwalls-network-card"
                        >
                            <div className="offerwalls-network-top">
                                <div className="offerwalls-network-icon">
                                    <Store size={20} />
                                </div>

                                <span className="offerwalls-network-tag">
                                    {network.tag}
                                </span>
                            </div>

                            <h3>{network.name}</h3>
                            <p>{network.description}</p>

                            <button
                                type="button"
                                className="offerwalls-network-button"
                                onClick={() =>
                                    handleNetworkClick(network)
                                }
                            >
                                Explore offers
                                {isAuthenticated ? (
                                    <ExternalLink size={14} />
                                ) : (
                                    <Lock size={13} />
                                )}
                            </button>
                        </article>
                    ))}
                </div>
            </section>

            {/* =================================================
                LIVE OFFERS
               ================================================= */}

            <section className="offerwalls-section">
                <div className="offerwalls-section-heading">
                    <span className="offerwalls-section-label">
                        LIVE RIGHT NOW
                    </span>

                    <h2>Offers available today</h2>

                    <p>
                        A real, live sample pulled from the
                        same list members see — rewards and
                        time estimates included.
                    </p>
                </div>

                {loading || !data ? (
                    <div className="offerwalls-loading">
                        <Loader
                            size="md"
                            label="Loading live offers..."
                        />
                    </div>
                ) : offers.length === 0 ? (
                    <div className="offerwalls-empty">
                        <Sparkles size={22} />
                        <p>
                            No offers are live right this
                            moment — check back shortly.
                        </p>
                    </div>
                ) : (
                    <div className="offerwalls-offer-grid">
                        {offers.map((offer) => (
                            <article
                                key={offer.id}
                                className="offerwalls-offer-card"
                            >
                                <div className="offerwalls-offer-top">
                                    <div className="offerwalls-offer-icon">
                                        <Sparkles size={18} />
                                    </div>

                                    <span>
                                        {offer.difficulty}
                                    </span>
                                </div>

                                <h3>{offer.title}</h3>
                                <p>{offer.description}</p>

                                <div className="offerwalls-offer-meta">
                                    <span>
                                        <Clock3 size={12} />
                                        {
                                            offer.estimatedMinutes
                                        }{" "}
                                        min
                                    </span>
                                </div>

                                <div className="offerwalls-offer-footer">
                                    <div>
                                        <span>Reward</span>

                                        <strong>
                                            +
                                            {formatReward(
                                                offer.reward,
                                                offer.currency
                                            )}
                                        </strong>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleOfferClick(
                                                offer
                                            )
                                        }
                                    >
                                        {isAuthenticated ? (
                                            <>
                                                Start
                                                <ArrowRight
                                                    size={14}
                                                />
                                            </>
                                        ) : (
                                            <>
                                                Sign up
                                                <Lock
                                                    size={12}
                                                />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            {/* =================================================
                TRUST NOTE
               ================================================= */}

            <section className="offerwalls-trust">
                <div className="offerwalls-trust-icon">
                    <ShieldCheck size={20} />
                </div>

                <p>
                    Every network above is vetted before
                    it's added, and every reward amount is
                    shown up front — what you see is what
                    you get credited once an offer is
                    verified complete.
                </p>
            </section>
        </div>
    );
}

export default OffersPage;