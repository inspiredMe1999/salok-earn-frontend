import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Link,
    useSearchParams,
} from "react-router-dom";

import {
    ArrowRight,
    Clock3,
    Coins,
    Filter,
    ListTodo,
    LoaderCircle,
    Lock,
    MessageSquareText,
    Search,
    Sparkles,
} from "lucide-react";

import {
    getEarnPageData,
} from "../../services/mock/earnService";

import useAuth from "../../hooks/useAuth";
import { useAuthGate } from "../../context/AuthGateContext";
import GuestBanner from "../../components/common/GuestBanner";

import "./earn.css";

const typeIcons = {
    surveys: MessageSquareText,
    tasks: ListTodo,
    offers: Sparkles,
};

function formatReward(
    amount,
    currency
) {
    return `${Number(amount).toLocaleString(
        "en-US"
    )} ${currency}`;
}

function EarnPage() {
    const { isAuthenticated } = useAuth();
    const { openAuthGate } = useAuthGate();

    const [
        searchParams,
        setSearchParams,
    ] = useSearchParams();

    const [data, setData] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [search, setSearch] =
        useState(
            searchParams.get(
                "search"
            ) || ""
        );

    const [
        activeCategory,
        setActiveCategory,
    ] = useState(
        searchParams.get(
            "category"
        ) || "all"
    );

    const [
        sortBy,
        setSortBy,
    ] = useState("recommended");

    useEffect(() => {
        let mounted = true;

        async function loadData() {
            try {
                setLoading(true);

                const result =
                    await getEarnPageData();

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

    /*
    |--------------------------------------------------------------------------
    | Update URL when filters change
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const params = {};

        if (
            activeCategory !==
            "all"
        ) {
            params.category =
                activeCategory;
        }

        if (search.trim()) {
            params.search =
                search.trim();
        }

        setSearchParams(
            params,
            {
                replace: true,
            }
        );
    }, [
        activeCategory,
        search,
        setSearchParams,
    ]);

    const filteredOpportunities =
        useMemo(() => {
            if (!data) {
                return [];
            }

            let results =
                [...data.opportunities];

            /*
            |--------------------------------------------------------------------------
            | Category
            |--------------------------------------------------------------------------
            */

            if (
                activeCategory !==
                "all"
            ) {
                results =
                    results.filter(
                        (item) =>
                            item.type ===
                            activeCategory
                    );
            }

            /*
            |--------------------------------------------------------------------------
            | Search
            |--------------------------------------------------------------------------
            */

            const searchTerm =
                search
                    .trim()
                    .toLowerCase();

            if (searchTerm) {
                results =
                    results.filter(
                        (item) =>
                            item.title
                                .toLowerCase()
                                .includes(
                                    searchTerm
                                ) ||
                            item.description
                                .toLowerCase()
                                .includes(
                                    searchTerm
                                ) ||
                            item.tags.some(
                                (tag) =>
                                    tag
                                        .toLowerCase()
                                        .includes(
                                            searchTerm
                                        )
                            )
                    );
            }

            /*
            |--------------------------------------------------------------------------
            | Sorting
            |--------------------------------------------------------------------------
            */

            if (
                sortBy ===
                "highest"
            ) {
                results.sort(
                    (
                        a,
                        b
                    ) =>
                        b.reward -
                        a.reward
                );
            }

            if (
                sortBy ===
                "quickest"
            ) {
                results.sort(
                    (
                        a,
                        b
                    ) =>
                        a.estimatedMinutes -
                        b.estimatedMinutes
                );
            }

            return results;
        }, [
            data,
            activeCategory,
            search,
            sortBy,
        ]);

    if (loading || !data) {
        return (
            <div className="earn-loading">
                <LoaderCircle
                    size={27}
                    className="earn-loading-spinner"
                />

                <span>
                    Loading earning opportunities...
                </span>
            </div>
        );
    }

    return (
        <div className="earn-page">
            {isAuthenticated ? null : (
                <GuestBanner
                    message="You're browsing available earning opportunities as a guest. Create a free account to start completing them and collecting real rewards."
                />
            )}

            {/* =================================================
                PAGE INTRO
               ================================================= */}

            <section className="earn-intro">
                <div>
                    <span className="earn-eyebrow">
                        EARN REWARDS
                    </span>

                    <h1>
                        Find your next
                        <span>
                            {" "}
                            opportunity.
                        </span>
                    </h1>

                    <p>
                        Explore available ways
                        to earn rewards and
                        choose what works for
                        you.
                    </p>
                </div>

                {isAuthenticated ? (
                    <div className="earn-balance">
                        <Coins
                            size={17}
                        />

                        <div>
                            <span>
                                Available balance
                            </span>

                            <strong>
                                1,250.75 SAK
                            </strong>
                        </div>
                    </div>
                ) : (
                    <Link
                        to="/signup"
                        className="earn-balance earn-balance-guest"
                    >
                        <Lock
                            size={15}
                        />

                        <div>
                            <span>
                                Sign up to earn
                            </span>

                            <strong>
                                Create free account
                            </strong>
                        </div>
                    </Link>
                )}
            </section>

            {/* =================================================
                CATEGORY NAVIGATION
               ================================================= */}

            <section className="earn-toolbar">
                <div className="earn-category-tabs">
                    {data.categories.map(
                        (category) => (
                            <button
                                key={
                                    category.id
                                }
                                type="button"
                                className={
                                    activeCategory ===
                                        category.id
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    setActiveCategory(
                                        category.id
                                    )
                                }
                            >
                                {
                                    category.label
                                }
                            </button>
                        )
                    )}
                </div>

                <div className="earn-controls">
                    <div className="earn-search">
                        <Search
                            size={16}
                        />

                        <input
                            type="search"
                            value={
                                search
                            }
                            onChange={(
                                event
                            ) =>
                                setSearch(
                                    event
                                        .target
                                        .value
                                )
                            }
                            placeholder="Search opportunities..."
                            aria-label="Search earning opportunities"
                        />
                    </div>

                    <div className="earn-sort">
                        <Filter
                            size={15}
                        />

                        <select
                            value={
                                sortBy
                            }
                            onChange={(
                                event
                            ) =>
                                setSortBy(
                                    event
                                        .target
                                        .value
                                )
                            }
                            aria-label="Sort opportunities"
                        >
                            <option value="recommended">
                                Recommended
                            </option>

                            <option value="highest">
                                Highest reward
                            </option>

                            <option value="quickest">
                                Quickest
                            </option>
                        </select>
                    </div>
                </div>
            </section>

            {/* =================================================
                RESULTS
               ================================================= */}

            <section className="earn-results">
                <div className="earn-results-heading">
                    <div>
                        <span>
                            AVAILABLE NOW
                        </span>

                        <h2>
                            {filteredOpportunities.length}{" "}
                            opportunities
                        </h2>
                    </div>
                </div>

                {filteredOpportunities.length >
                    0 ? (
                    <div className="earn-opportunities-grid">
                        {filteredOpportunities.map(
                            (
                                opportunity
                            ) => {
                                const Icon =
                                    typeIcons[
                                    opportunity
                                        .type
                                    ] ||
                                    Coins;

                                return (
                                    <article
                                        key={
                                            opportunity.id
                                        }
                                        className="earn-opportunity-card"
                                    >
                                        <div className="earn-card-top">
                                            <div className="earn-card-icon">
                                                <Icon
                                                    size={
                                                        20
                                                    }
                                                />
                                            </div>

                                            <span className="earn-card-type">
                                                {
                                                    opportunity
                                                        .type
                                                }
                                            </span>
                                        </div>

                                        <div className="earn-card-content">
                                            <h3>
                                                {
                                                    opportunity.title
                                                }
                                            </h3>

                                            <p>
                                                {
                                                    opportunity.description
                                                }
                                            </p>
                                        </div>

                                        <div className="earn-card-meta">
                                            <span>
                                                <Clock3
                                                    size={
                                                        13
                                                    }
                                                />

                                                {
                                                    opportunity.estimatedMinutes
                                                }{" "}
                                                min
                                            </span>

                                            <span>
                                                {
                                                    opportunity.difficulty
                                                }
                                            </span>
                                        </div>

                                        <div className="earn-card-footer">
                                            <div>
                                                <span>
                                                    Reward
                                                </span>

                                                <strong>
                                                    +
                                                    {formatReward(
                                                        opportunity.reward,
                                                        opportunity.currency
                                                    )}
                                                </strong>
                                            </div>

                                            <Link
                                                to={
                                                    isAuthenticated
                                                        ? `/earn/${opportunity.id}`
                                                        : "#"
                                                }
                                                onClick={(event) => {
                                                    if (
                                                        isAuthenticated
                                                    ) {
                                                        return;
                                                    }

                                                    event.preventDefault();

                                                    openAuthGate({
                                                        title:
                                                            "Sign up to start this opportunity",
                                                        message: `Create a free account to start "${opportunity.title}" and collect the reward.`,
                                                        redirectTo: `/earn/${opportunity.id}`,
                                                    });
                                                }}
                                                className="earn-card-button"
                                            >
                                                {isAuthenticated ? (
                                                    <>
                                                        Start

                                                        <ArrowRight
                                                            size={
                                                                15
                                                            }
                                                        />
                                                    </>
                                                ) : (
                                                    <>
                                                        Sign up to start

                                                        <Lock
                                                            size={
                                                                13
                                                            }
                                                        />
                                                    </>
                                                )}
                                            </Link>
                                        </div>
                                    </article>
                                );
                            }
                        )}
                    </div>
                ) : (
                    <div className="earn-empty">
                        <div className="earn-empty-icon">
                            <Search
                                size={
                                    21
                                }
                            />
                        </div>

                        <h3>
                            No opportunities
                            found
                        </h3>

                        <p>
                            Try changing your
                            search or category
                            filter.
                        </p>

                        <button
                            type="button"
                            onClick={() => {
                                setSearch(
                                    ""
                                );

                                setActiveCategory(
                                    "all"
                                );
                            }}
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
}

export default EarnPage;