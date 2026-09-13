/*
|--------------------------------------------------------------------------
| Mock Leaderboard Service
|--------------------------------------------------------------------------
|
| This service acts like the real leaderboard API.
|
| IMPORTANT:
| This is MOCK DATA only.
|
| The UI will communicate with this service instead of directly accessing
| Firebase. Later, we can replace the implementation with the real
| Firebase/backend service without rebuilding the UI.
|
|--------------------------------------------------------------------------
*/

import {
    leaderboardData,
    leaderboardRegions,
    mockLeaderboardUser,
} from "../../data/leaderboardData";


/*
|--------------------------------------------------------------------------
| Mock Configuration
|--------------------------------------------------------------------------
*/

const MOCK_DELAY = 500;


/*
|--------------------------------------------------------------------------
| Utility: Simulate Network Delay
|--------------------------------------------------------------------------
*/

function delay(milliseconds = MOCK_DELAY) {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}


/*
|--------------------------------------------------------------------------
| Utility: Clone Data
|--------------------------------------------------------------------------
|
| Prevents the UI from accidentally modifying our original mock data.
|
|--------------------------------------------------------------------------
*/

function cloneData(data) {
    return JSON.parse(JSON.stringify(data));
}


/*
|--------------------------------------------------------------------------
| Get Leaderboard
|--------------------------------------------------------------------------
|
| Supported periods:
|
| - global
| - weekly
| - daily
| - regional
|
|--------------------------------------------------------------------------
*/

export async function getLeaderboard(
    period = "global",
    options = {}
) {
    await delay();

    const selectedPeriod = leaderboardData[period]
        ? period
        : "global";

    let entries = cloneData(
        leaderboardData[selectedPeriod]
    );

    /*
    |--------------------------------------------------------------------------
    | Optional Region Filter
    |--------------------------------------------------------------------------
    |
    | This is mainly useful for the regional leaderboard.
    |
    |--------------------------------------------------------------------------
    */

    if (
        options.regionCode &&
        selectedPeriod === "regional"
    ) {
        entries = entries.filter(
            (entry) =>
                entry.regionCode === options.regionCode
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Make sure the current user is correctly identified.
    |--------------------------------------------------------------------------
    */

    entries = entries.map((entry) => ({
        ...entry,
        isCurrentUser:
            entry.uid === mockLeaderboardUser.uid,
    }));

    return {
        success: true,

        period: selectedPeriod,

        entries,

        totalParticipants:
            selectedPeriod === "global"
                ? 12840
                : selectedPeriod === "weekly"
                    ? 4280
                    : selectedPeriod === "daily"
                        ? 920
                        : 680,

        updatedAt: new Date().toISOString(),
    };
}


/*
|--------------------------------------------------------------------------
| Get Current User Ranking
|--------------------------------------------------------------------------
|
| Finds the current mock user's position for a particular leaderboard.
|
|--------------------------------------------------------------------------
*/

export async function getCurrentUserRanking(
    period = "global"
) {
    await delay();

    const entries =
        leaderboardData[period] || [];

    const currentUser =
        entries.find(
            (entry) =>
                entry.uid ===
                mockLeaderboardUser.uid
        );

    /*
    |--------------------------------------------------------------------------
    | If the user isn't inside the visible leaderboard list,
    | return a realistic fallback ranking.
    |--------------------------------------------------------------------------
    */

    if (!currentUser) {
        const fallbackRanks = {
            global: 24,
            weekly: 10,
            daily: 6,
            regional: 6,
        };

        return {
            success: true,

            user: {
                ...cloneData(mockLeaderboardUser),

                rank:
                    fallbackRanks[period] || 24,

                score: 42180,

                earnings: 4218.0,

                trend: 4,

                isCurrentUser: true,
            },
        };
    }

    return {
        success: true,

        user: cloneData({
            ...currentUser,

            isCurrentUser: true,
        }),
    };
}


/*
|--------------------------------------------------------------------------
| Get Leaderboard Regions
|--------------------------------------------------------------------------
*/

export async function getLeaderboardRegions() {
    await delay(300);

    return {
        success: true,

        regions: cloneData(
            leaderboardRegions
        ),
    };
}


/*
|--------------------------------------------------------------------------
| Get Complete Leaderboard Page Data
|--------------------------------------------------------------------------
|
| This is useful when the page needs everything at once.
|
|--------------------------------------------------------------------------
*/

export async function getLeaderboardPageData(
    period = "global",
    options = {}
) {
    await delay();

    const leaderboard =
        await getLeaderboard(
            period,
            options
        );

    const currentUser =
        await getCurrentUserRanking(
            period
        );

    const regions =
        await getLeaderboardRegions();

    return {
        success: true,

        leaderboard,

        currentUser,

        regions,
    };
}


/*
|--------------------------------------------------------------------------
| Get Top Three
|--------------------------------------------------------------------------
|
| Used by the podium section of the leaderboard.
|
|--------------------------------------------------------------------------
*/

export async function getTopThree(
    period = "global"
) {
    await delay(250);

    const entries =
        leaderboardData[period] || [];

    return {
        success: true,

        entries: cloneData(
            entries
                .filter(
                    (entry) =>
                        entry.rank <= 3
                )
                .sort(
                    (a, b) =>
                        a.rank - b.rank
                )
        ),
    };
}


/*
|--------------------------------------------------------------------------
| Search Leaderboard
|--------------------------------------------------------------------------
|
| Searches users by username or display name.
|
|--------------------------------------------------------------------------
*/

export async function searchLeaderboard(
    searchTerm = "",
    period = "global"
) {
    await delay(350);

    const entries =
        leaderboardData[period] || [];

    const normalizedSearch =
        searchTerm
            .trim()
            .toLowerCase();

    if (!normalizedSearch) {
        return {
            success: true,

            entries: cloneData(entries),
        };
    }

    const results =
        entries.filter((entry) => {
            const username =
                entry.username
                    ?.toLowerCase() || "";

            const displayName =
                entry.displayName
                    ?.toLowerCase() || "";

            return (
                username.includes(
                    normalizedSearch
                ) ||
                displayName.includes(
                    normalizedSearch
                )
            );
        });

    return {
        success: true,

        entries: cloneData(results),
    };
}


/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
|
| Allows us to import the entire service as:
|
| import leaderboardService from "...";
|
|--------------------------------------------------------------------------
*/

const leaderboardService = {
    getLeaderboard,
    getCurrentUserRanking,
    getLeaderboardRegions,
    getLeaderboardPageData,
    getTopThree,
    searchLeaderboard,
};

export default leaderboardService;