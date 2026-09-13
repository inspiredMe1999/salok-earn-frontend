/*
|--------------------------------------------------------------------------
| Salok Earn — Earn Mock Service
|--------------------------------------------------------------------------
|
| The page communicates with this service rather than directly with
| the data source.
|
| Later this service can be replaced with the Firebase implementation.
|
|--------------------------------------------------------------------------
*/

import {
    earnCategories,
    earningOpportunities,
} from "../../data/earnData";

/**
 * Get earning categories.
 */
export async function getEarnCategories() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(earnCategories);
        }, 200);
    });
}

/**
 * Get earning opportunities.
 */
export async function getEarningOpportunities() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(earningOpportunities);
        }, 450);
    });
}

/**
 * Get one earning opportunity.
 */
export async function getEarningOpportunity(
    opportunityId
) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const opportunity =
                earningOpportunities.find(
                    (item) =>
                        item.id ===
                        opportunityId
                );

            if (!opportunity) {
                reject(
                    new Error(
                        "Earning opportunity not found."
                    )
                );

                return;
            }

            resolve(opportunity);
        }, 350);
    });
}

/**
 * Get the complete Earn page data.
 */
export async function getEarnPageData() {
    const [
        categories,
        opportunities,
    ] = await Promise.all([
        getEarnCategories(),
        getEarningOpportunities(),
    ]);

    return {
        categories,
        opportunities,
    };
}