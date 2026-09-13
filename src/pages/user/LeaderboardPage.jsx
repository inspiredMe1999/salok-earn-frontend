/*
|--------------------------------------------------------------------------
| Leaderboard Page
|--------------------------------------------------------------------------
|
| Displays:
| - Top 3 leaderboard podium
| - Global / Weekly / Daily / Regional rankings
| - Current user's position
| - Search
| - Region filter
| - Full leaderboard
| - Loading and empty states
|
| This page currently uses the mock leaderboard service.
|
|--------------------------------------------------------------------------
*/

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    Award,
    ChevronDown,
    ChevronUp,
    Crown,
    Globe2,
    Medal,
    Search,
    Sparkles,
    Trophy,
    TrendingDown,
    TrendingUp,
    Users,
} from "lucide-react";

import {
    LEADERBOARD_PERIODS,
} from "../../data/leaderboardData";

import leaderboardService from "../../services/mock/leaderboardService";

import "./leaderboard.css";


/*
|--------------------------------------------------------------------------
| Format Number
|--------------------------------------------------------------------------
*/

function formatNumber(value) {
    return new Intl.NumberFormat("en-US").format(
        Number(value || 0)
    );
}


/*
|--------------------------------------------------------------------------
| Format SAK
|--------------------------------------------------------------------------
*/

function formatSAK(value) {
    return `${Number(value || 0).toLocaleString(
        "en-US",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }
    )} SAK`;
}


/*
|--------------------------------------------------------------------------
| Get Rank Class
|--------------------------------------------------------------------------
*/

function getRankClass(rank) {
    if (rank === 1) return "leaderboard-rank--first";
    if (rank === 2) return "leaderboard-rank--second";
    if (rank === 3) return "leaderboard-rank--third";

    return "";
}


/*
|--------------------------------------------------------------------------
| Get Period Description
|--------------------------------------------------------------------------
*/

function getPeriodDescription(period) {
    const descriptions = {
        global:
            "See who's leading the Salok Earn community worldwide.",
        weekly:
            "See the top earners competing this week.",
        daily:
            "See today's highest-performing earners.",
        regional:
            "See how you rank against earners in your region.",
    };

    return (
        descriptions[period] ||
        descriptions.global
    );
}


/*
|--------------------------------------------------------------------------
| Trend Indicator
|--------------------------------------------------------------------------
*/

function TrendIndicator({ trend }) {
    if (!trend) {
        return (
            <span className="leaderboard-trend leaderboard-trend--neutral">
                —
            </span>
        );
    }

    if (trend > 0) {
        return (
            <span className="leaderboard-trend leaderboard-trend--up">
                <TrendingUp size={13} />
                {trend}
            </span>
        );
    }

    return (
        <span className="leaderboard-trend leaderboard-trend--down">
            <TrendingDown size={13} />
            {Math.abs(trend)}
        </span>
    );
}


/*
|--------------------------------------------------------------------------
| User Avatar
|--------------------------------------------------------------------------
*/

function UserAvatar({
    initials,
    rank,
}) {
    return (
        <div
            className={`leaderboard-avatar ${getRankClass(
                rank
            )}`}
        >
            {initials}
        </div>
    );
}


/*
|--------------------------------------------------------------------------
| Podium Card
|--------------------------------------------------------------------------
*/

function PodiumCard({
    user,
    position,
}) {
    if (!user) return null;

    const isFirst = position === 1;

    const order =
        position === 1 ? 0 : position === 2 ? 1 : 2;

    return (
        <motion.div
            className={`leaderboard-podium-card leaderboard-podium-card--${position}`}
            initial={{ opacity: 0, y: 26, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                duration: 0.5,
                delay: 0.08 + order * 0.1,
                ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ y: -6 }}
        >
            <span
                className="leaderboard-podium-glow"
                aria-hidden="true"
            />

            {isFirst && (
                <div className="leaderboard-podium-crown">
                    <Crown size={20} fill="currentColor" />
                </div>
            )}

            <div className="leaderboard-podium-medal">
                {position === 1 && (
                    <Trophy size={22} />
                )}

                {position === 2 && (
                    <Medal size={21} />
                )}

                {position === 3 && (
                    <Award size={21} />
                )}
            </div>

            <UserAvatar
                initials={user.initials}
                rank={position}
            />

            <div className="leaderboard-podium-rank">
                #{position}
            </div>

            <h3 className="leaderboard-podium-name">
                {user.displayName}
            </h3>

            <p className="leaderboard-podium-username">
                @{user.username}
            </p>

            <div className="leaderboard-podium-score">
                <strong>
                    {formatNumber(user.score)}
                </strong>

                <span>points</span>
            </div>

            <div className="leaderboard-podium-earnings">
                {formatSAK(user.earnings)}
            </div>
        </motion.div>
    );
}


/*
|--------------------------------------------------------------------------
| Current User Card
|--------------------------------------------------------------------------
*/

function CurrentUserCard({
    user,
}) {
    if (!user) return null;

    return (
        <motion.section
            className="leaderboard-current-card"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <div className="leaderboard-current-icon">
                <Sparkles size={20} />
            </div>

            <div className="leaderboard-current-info">
                <span className="leaderboard-current-label">
                    Your current position
                </span>

                <strong>
                    #{user.rank}
                </strong>
            </div>

            <div className="leaderboard-current-divider" />

            <div className="leaderboard-current-stat">
                <span>Score</span>

                <strong>
                    {formatNumber(user.score)}
                </strong>
            </div>

            <div className="leaderboard-current-stat">
                <span>Earned</span>

                <strong>
                    {formatSAK(user.earnings)}
                </strong>
            </div>

            <div className="leaderboard-current-trend">
                <span>Movement</span>

                <TrendIndicator
                    trend={user.trend}
                />
            </div>
        </motion.section>
    );
}


/*
|--------------------------------------------------------------------------
| Leaderboard Row
|--------------------------------------------------------------------------
*/

function LeaderboardRow({
    user,
    index = 0,
}) {
    return (
        <motion.div
            className={`leaderboard-row ${user.isCurrentUser
                ? "leaderboard-row--current"
                : ""
                }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.35,
                delay: Math.min(index, 10) * 0.03,
                ease: "easeOut",
            }}
        >
            <div className="leaderboard-row-rank">
                <span
                    className={`leaderboard-rank-number ${getRankClass(
                        user.rank
                    )}`}
                >
                    {user.rank}
                </span>
            </div>

            <div className="leaderboard-row-user">
                <UserAvatar
                    initials={user.initials}
                    rank={user.rank}
                />

                <div className="leaderboard-row-user-info">
                    <div className="leaderboard-row-name">
                        {user.displayName}

                        {user.isCurrentUser && (
                            <span className="leaderboard-you-badge">
                                You
                            </span>
                        )}
                    </div>

                    <div className="leaderboard-row-username">
                        @{user.username}
                    </div>
                </div>
            </div>

            <div className="leaderboard-row-region">
                <Globe2 size={15} />

                <span>
                    {user.region}
                </span>
            </div>

            <div className="leaderboard-row-score">
                <strong>
                    {formatNumber(user.score)}
                </strong>

                <span>points</span>
            </div>

            <div className="leaderboard-row-earnings">
                <strong>
                    {formatSAK(user.earnings)}
                </strong>
            </div>

            <div className="leaderboard-row-trend">
                <TrendIndicator
                    trend={user.trend}
                />
            </div>
        </motion.div>
    );
}


/*
|--------------------------------------------------------------------------
| Loading State
|--------------------------------------------------------------------------
*/

function LeaderboardLoading() {
    return (
        <div className="leaderboard-loading">
            <div className="leaderboard-loading-podium">
                <div className="leaderboard-skeleton leaderboard-skeleton--podium leaderboard-skeleton--short" />
                <div className="leaderboard-skeleton leaderboard-skeleton--podium leaderboard-skeleton--tall" />
                <div className="leaderboard-skeleton leaderboard-skeleton--podium leaderboard-skeleton--short" />
            </div>

            <div className="leaderboard-loading-rows">
                {Array.from({ length: 5 }).map((_, index) => (
                    <div
                        key={index}
                        className="leaderboard-skeleton leaderboard-skeleton--row"
                    />
                ))}
            </div>
        </div>
    );
}


/*
|--------------------------------------------------------------------------
| Empty State
|--------------------------------------------------------------------------
*/

function LeaderboardEmpty() {
    return (
        <div className="leaderboard-empty">
            <div className="leaderboard-empty-icon">
                <Trophy size={30} />
            </div>

            <h3>
                No rankings found
            </h3>

            <p>
                There are no leaderboard entries
                matching your search.
            </p>
        </div>
    );
}


/*
|--------------------------------------------------------------------------
| Main Component
|--------------------------------------------------------------------------
*/

function LeaderboardPage() {
    const [activePeriod, setActivePeriod] =
        useState("global");

    const [leaderboard, setLeaderboard] =
        useState([]);

    const [currentUser, setCurrentUser] =
        useState(null);

    const [regions, setRegions] =
        useState([]);

    const [selectedRegion, setSelectedRegion] =
        useState("ng");

    const [searchTerm, setSearchTerm] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [showRegionFilter, setShowRegionFilter] =
        useState(false);


    /*
    |--------------------------------------------------------------------------
    | Load Leaderboard
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        let isMounted = true;

        async function loadLeaderboard() {
            try {
                setLoading(true);
                setError("");

                const [
                    leaderboardResponse,
                    userResponse,
                    regionResponse,
                ] = await Promise.all([
                    leaderboardService.getLeaderboard(
                        activePeriod,
                        {
                            regionCode:
                                activePeriod ===
                                    "regional"
                                    ? selectedRegion
                                    : undefined,
                        }
                    ),

                    leaderboardService.getCurrentUserRanking(
                        activePeriod
                    ),

                    leaderboardService.getLeaderboardRegions(),
                ]);

                if (!isMounted) return;

                setLeaderboard(
                    leaderboardResponse.entries ||
                    []
                );

                setCurrentUser(
                    userResponse.user || null
                );

                setRegions(
                    regionResponse.regions || []
                );
            } catch (err) {
                console.error(
                    "Leaderboard error:",
                    err
                );

                if (isMounted) {
                    setError(
                        "Unable to load the leaderboard. Please try again."
                    );
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadLeaderboard();

        return () => {
            isMounted = false;
        };
    }, [
        activePeriod,
        selectedRegion,
    ]);


    /*
    |--------------------------------------------------------------------------
    | Filter Search Results
    |--------------------------------------------------------------------------
    */

    const filteredLeaderboard =
        useMemo(() => {
            const normalizedSearch =
                searchTerm
                    .trim()
                    .toLowerCase();

            if (!normalizedSearch) {
                return leaderboard;
            }

            return leaderboard.filter(
                (user) => {
                    const name =
                        user.displayName
                            ?.toLowerCase() ||
                        "";

                    const username =
                        user.username
                            ?.toLowerCase() ||
                        "";

                    const region =
                        user.region
                            ?.toLowerCase() ||
                        "";

                    return (
                        name.includes(
                            normalizedSearch
                        ) ||
                        username.includes(
                            normalizedSearch
                        ) ||
                        region.includes(
                            normalizedSearch
                        )
                    );
                }
            );
        }, [
            leaderboard,
            searchTerm,
        ]);


    /*
    |--------------------------------------------------------------------------
    | Top Three
    |--------------------------------------------------------------------------
    */

    const topThree =
        useMemo(() => {
            return leaderboard
                .filter(
                    (user) =>
                        user.rank <= 3
                )
                .sort(
                    (a, b) =>
                        a.rank - b.rank
                );
        }, [leaderboard]);


    /*
    |--------------------------------------------------------------------------
    | Remaining Users
    |--------------------------------------------------------------------------
    */

    const remainingUsers =
        useMemo(() => {
            return filteredLeaderboard.filter(
                (user) =>
                    user.rank > 3
            );
        }, [
            filteredLeaderboard,
        ]);


    /*
    |--------------------------------------------------------------------------
    | Period Change
    |--------------------------------------------------------------------------
    */

    function handlePeriodChange(
        period
    ) {
        setActivePeriod(period);
        setSearchTerm("");
    }


    /*
    |--------------------------------------------------------------------------
    | Retry
    |--------------------------------------------------------------------------
    */

    function handleRetry() {
        setActivePeriod(
            (current) => current
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <div className="leaderboard-page">

            {/* ----------------------------------------------------------
                Page Header
            ----------------------------------------------------------- */}

            <motion.section
                className="leaderboard-page-header"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >

                <div className="leaderboard-heading">

                    <div className="leaderboard-heading-icon">
                        <Trophy size={22} />
                    </div>

                    <div>
                        <span className="leaderboard-eyebrow">
                            COMMUNITY RANKINGS
                        </span>

                        <h1>
                            Leaderboard
                        </h1>

                        <p>
                            {getPeriodDescription(
                                activePeriod
                            )}
                        </p>
                    </div>

                </div>


                <div className="leaderboard-participants">

                    <Users size={18} />

                    <div>
                        <strong>
                            {loading
                                ? "—"
                                : "12.8K+"}
                        </strong>

                        <span>
                            Active earners
                        </span>
                    </div>

                </div>

            </motion.section>


            {/* ----------------------------------------------------------
                Period Tabs
            ----------------------------------------------------------- */}

            <section className="leaderboard-tabs">

                {LEADERBOARD_PERIODS.map(
                    (period) => (
                        <button
                            key={period.id}
                            type="button"
                            className={`leaderboard-tab ${activePeriod ===
                                period.id
                                ? "leaderboard-tab--active"
                                : ""
                                }`}
                            onClick={() =>
                                handlePeriodChange(
                                    period.id
                                )
                            }
                        >
                            {activePeriod === period.id && (
                                <motion.span
                                    layoutId="leaderboard-tab-pill"
                                    className="leaderboard-tab-pill"
                                    transition={{
                                        type: "spring",
                                        stiffness: 420,
                                        damping: 34,
                                    }}
                                />
                            )}

                            <span className="leaderboard-tab-label">
                                {period.name}
                            </span>
                        </button>
                    )
                )}

            </section>


            {/* ----------------------------------------------------------
                Regional Filter
            ----------------------------------------------------------- */}

            {activePeriod ===
                "regional" && (
                    <section className="leaderboard-region-toolbar">

                        <div>
                            <span>
                                Regional ranking
                            </span>

                            <strong>
                                Compare earners by region
                            </strong>
                        </div>

                        <div className="leaderboard-region-select">

                            <button
                                type="button"
                                onClick={() =>
                                    setShowRegionFilter(
                                        (current) =>
                                            !current
                                    )
                                }
                            >
                                <Globe2 size={16} />

                                <span>
                                    {regions.find(
                                        (region) =>
                                            region.id ===
                                            selectedRegion
                                    )?.name ||
                                        "Nigeria"}
                                </span>

                                <ChevronDown
                                    size={16}
                                />
                            </button>

                            <AnimatePresence>
                                {showRegionFilter && (
                                    <motion.div
                                        className="leaderboard-region-menu"
                                        initial={{ opacity: 0, y: -6, scale: 0.97 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -6, scale: 0.97 }}
                                        transition={{ duration: 0.16, ease: "easeOut" }}
                                    >

                                        {regions.map(
                                            (region) => (
                                                <button
                                                    key={
                                                        region.id
                                                    }
                                                    type="button"
                                                    className={
                                                        selectedRegion ===
                                                            region.id
                                                            ? "active"
                                                            : ""
                                                    }
                                                    onClick={() => {
                                                        setSelectedRegion(
                                                            region.id
                                                        );

                                                        setShowRegionFilter(
                                                            false
                                                        );
                                                    }}
                                                >
                                                    {
                                                        region.name
                                                    }
                                                </button>
                                            )
                                        )}

                                    </motion.div>
                                )}
                            </AnimatePresence>

                        </div>

                    </section>
                )}


            {/* ----------------------------------------------------------
                Current User
            ----------------------------------------------------------- */}

            {!loading &&
                currentUser && (
                    <CurrentUserCard
                        user={currentUser}
                    />
                )}


            {/* ----------------------------------------------------------
                Error
            ----------------------------------------------------------- */}

            {error && (
                <div className="leaderboard-error">

                    <div>
                        {error}
                    </div>

                    <button
                        type="button"
                        onClick={handleRetry}
                    >
                        Try again
                    </button>

                </div>
            )}


            {/* ----------------------------------------------------------
                Main Content
            ----------------------------------------------------------- */}

            {loading ? (
                <LeaderboardLoading />
            ) : (
                <>
                    {/* --------------------------------------------------
                        Podium
                    --------------------------------------------------- */}

                    {topThree.length > 0 && (
                        <section className="leaderboard-podium">

                            <div className="leaderboard-section-heading">

                                <div>
                                    <span>
                                        TOP PERFORMERS
                                    </span>

                                    <h2>
                                        The leaders
                                    </h2>
                                </div>

                                <Sparkles
                                    size={20}
                                />

                            </div>

                            <div className="leaderboard-podium-grid">

                                <PodiumCard
                                    user={topThree.find(
                                        (user) =>
                                            user.rank ===
                                            2
                                    )}
                                    position={2}
                                />

                                <PodiumCard
                                    user={topThree.find(
                                        (user) =>
                                            user.rank ===
                                            1
                                    )}
                                    position={1}
                                />

                                <PodiumCard
                                    user={topThree.find(
                                        (user) =>
                                            user.rank ===
                                            3
                                    )}
                                    position={3}
                                />

                            </div>

                        </section>
                    )}


                    {/* --------------------------------------------------
                        Search + Rankings
                    --------------------------------------------------- */}

                    <section className="leaderboard-list-section">

                        <div className="leaderboard-list-header">

                            <div>
                                <span>
                                    FULL RANKINGS
                                </span>

                                <h2>
                                    All earners
                                </h2>
                            </div>

                            <div className="leaderboard-search">

                                <Search size={17} />

                                <input
                                    type="search"
                                    placeholder="Search earners..."
                                    value={
                                        searchTerm
                                    }
                                    onChange={(event) =>
                                        setSearchTerm(
                                            event.target
                                                .value
                                        )
                                    }
                                />

                            </div>

                        </div>


                        {filteredLeaderboard.length ===
                            0 ? (
                            <LeaderboardEmpty />
                        ) : (
                            <>

                                {/* Desktop headings */}

                                <div className="leaderboard-column-headings">

                                    <span>
                                        Rank
                                    </span>

                                    <span>
                                        Earner
                                    </span>

                                    <span>
                                        Region
                                    </span>

                                    <span>
                                        Score
                                    </span>

                                    <span>
                                        Earned
                                    </span>

                                    <span>
                                        Trend
                                    </span>

                                </div>


                                <div className="leaderboard-list">

                                    {remainingUsers.map(
                                        (user, index) => (
                                            <LeaderboardRow
                                                key={
                                                    user.uid
                                                }
                                                user={
                                                    user
                                                }
                                                index={
                                                    index
                                                }
                                            />
                                        )
                                    )}

                                </div>

                            </>
                        )}

                    </section>
                </>
            )}

        </div>
    );
}


export default LeaderboardPage;