/*
|--------------------------------------------------------------------------
| Salok Earn - Referral Mock Service
|--------------------------------------------------------------------------
|
| This service acts as the temporary data layer for the Referrals feature.
|
| IMPORTANT:
| - This does NOT connect to Firebase.
| - This does NOT modify production data.
| - It behaves asynchronously so that later Firebase integration is easier.
|
| Later, we can create a Firebase referral service with the same methods
| and simply switch the data source.
|
|--------------------------------------------------------------------------
*/

import {
    referralConfig,
    referralSummary,
    referralProgress,
    referralHistory,
    referralMilestones,
    referralSteps,
    mockReferralUser,
    referralPageData,
} from "../../data/referralData";


/*
|--------------------------------------------------------------------------
| Mock Network Delay
|--------------------------------------------------------------------------
|
| Real Firebase requests take a little time.
| We simulate that here so the frontend behaves more like the real app.
|
*/

const MOCK_DELAY = 500;


/*
|--------------------------------------------------------------------------
| Delay Helper
|--------------------------------------------------------------------------
*/

function delay(milliseconds = MOCK_DELAY) {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}


/*
|--------------------------------------------------------------------------
| Clone Data
|--------------------------------------------------------------------------
|
| Prevents components from accidentally modifying our original mock data.
|
*/

function cloneData(data) {
    return JSON.parse(JSON.stringify(data));
}


/*
|--------------------------------------------------------------------------
| Get Referral Configuration
|--------------------------------------------------------------------------
*/

export async function getReferralConfig() {
    await delay();

    return {
        success: true,

        config: cloneData(referralConfig),
    };
}


/*
|--------------------------------------------------------------------------
| Get Referral Summary
|--------------------------------------------------------------------------
*/

export async function getReferralSummary() {
    await delay();

    return {
        success: true,

        summary: cloneData(referralSummary),
    };
}


/*
|--------------------------------------------------------------------------
| Get Referral Progress
|--------------------------------------------------------------------------
*/

export async function getReferralProgress() {
    await delay();

    return {
        success: true,

        progress: cloneData(referralProgress),
    };
}


/*
|--------------------------------------------------------------------------
| Get Referral History
|--------------------------------------------------------------------------
*/

export async function getReferralHistory() {
    await delay();

    return {
        success: true,

        history: cloneData(referralHistory),
    };
}


/*
|--------------------------------------------------------------------------
| Get Referral Milestones
|--------------------------------------------------------------------------
*/

export async function getReferralMilestones() {
    await delay();

    return {
        success: true,

        milestones: cloneData(referralMilestones),
    };
}


/*
|--------------------------------------------------------------------------
| Get Referral Steps
|--------------------------------------------------------------------------
*/

export async function getReferralSteps() {
    await delay();

    return {
        success: true,

        steps: cloneData(referralSteps),
    };
}


/*
|--------------------------------------------------------------------------
| Get Current Referral User
|--------------------------------------------------------------------------
*/

export async function getReferralUser() {
    await delay();

    return {
        success: true,

        user: cloneData(mockReferralUser),
    };
}


/*
|--------------------------------------------------------------------------
| Get Complete Referral Page Data
|--------------------------------------------------------------------------
|
| This is the main method the Referrals page will use.
|
*/

export async function getReferralPageData() {
    await delay();

    return {
        success: true,

        data: cloneData(referralPageData),
    };
}


/*
|--------------------------------------------------------------------------
| Copy Referral Link
|--------------------------------------------------------------------------
|
| This method copies the referral link to the user's clipboard.
|
| It is intentionally kept inside the service layer so the page does not
| need to know how the referral link is generated.
|
*/

export async function copyReferralLink() {
    await delay(200);

    const referralLink = referralConfig.referralLink;

    if (
        typeof navigator !== "undefined" &&
        navigator.clipboard
    ) {
        await navigator.clipboard.writeText(referralLink);
    }

    return {
        success: true,

        referralLink,

        message: "Referral link copied successfully.",
    };
}


/*
|--------------------------------------------------------------------------
| Get Share Data
|--------------------------------------------------------------------------
|
| Used by the browser's native sharing feature when available.
|
*/

export async function getReferralShareData() {
    await delay(200);

    return {
        success: true,

        shareData: {
            title: "Join me on Salok Earn",

            text: referralConfig.shareMessage,

            url: referralConfig.referralLink,
        },
    };
}


/*
|--------------------------------------------------------------------------
| Share Referral Link
|--------------------------------------------------------------------------
|
| Uses the browser's Web Share API when supported.
|
| If sharing is not available, we return the referral link so the UI
| can fall back to copying it.
|
*/

export async function shareReferralLink() {
    await delay(200);

    const shareData = {
        title: "Join me on Salok Earn",

        text: referralConfig.shareMessage,

        url: referralConfig.referralLink,
    };


    /*
    |--------------------------------------------------------------------------
    | Browser Native Share
    |--------------------------------------------------------------------------
    */

    if (
        typeof navigator !== "undefined" &&
        typeof navigator.share === "function"
    ) {
        await navigator.share(shareData);

        return {
            success: true,

            shared: true,

            shareData,
        };
    }


    /*
    |--------------------------------------------------------------------------
    | Sharing Not Supported
    |--------------------------------------------------------------------------
    |
    | The page can use this information to fall back to copying the link.
    |
    */

    return {
        success: true,

        shared: false,

        fallback: "copy",

        shareData,
    };
}


/*
|--------------------------------------------------------------------------
| Search Referral History
|--------------------------------------------------------------------------
|
| This will be useful if we later add a search box to referral history.
|
*/

export async function searchReferralHistory(searchTerm = "") {
    await delay(300);

    const term = searchTerm
        .trim()
        .toLowerCase();


    /*
    |--------------------------------------------------------------------------
    | No Search Term
    |--------------------------------------------------------------------------
    */

    if (!term) {
        return {
            success: true,

            history: cloneData(referralHistory),
        };
    }


    /*
    |--------------------------------------------------------------------------
    | Filter Results
    |--------------------------------------------------------------------------
    */

    const filteredHistory = referralHistory.filter((referral) => {
        return (
            referral.name
                ?.toLowerCase()
                .includes(term) ||

            referral.username
                ?.toLowerCase()
                .includes(term) ||

            referral.status
                ?.toLowerCase()
                .includes(term)
        );
    });


    return {
        success: true,

        history: cloneData(filteredHistory),
    };
}


/*
|--------------------------------------------------------------------------
| Get Referral Page Statistics
|--------------------------------------------------------------------------
|
| A small convenience method for dashboard-style statistics.
|
*/

export async function getReferralStats() {
    await delay(300);

    return {
        success: true,

        stats: {
            totalReferrals: referralSummary.totalReferrals,

            successfulReferrals:
                referralSummary.successfulReferrals,

            pendingReferrals:
                referralSummary.pendingReferrals,

            referralEarnings:
                referralSummary.referralEarnings,

            bonusEarnings:
                referralSummary.bonusEarnings,

            totalEarned:
                referralSummary.totalEarned,

            conversionRate:
                referralSummary.conversionRate,
        },
    };
}


/*
|--------------------------------------------------------------------------
| Default Service Object
|--------------------------------------------------------------------------
|
| Having a single service object makes importing the service convenient:
|
| import referralService from "../../services/mock/referralService";
|
|--------------------------------------------------------------------------
*/

const referralService = {
    getReferralConfig,

    getReferralSummary,

    getReferralProgress,

    getReferralHistory,

    getReferralMilestones,

    getReferralSteps,

    getReferralUser,

    getReferralPageData,

    copyReferralLink,

    getReferralShareData,

    shareReferralLink,

    searchReferralHistory,

    getReferralStats,
};


export default referralService;