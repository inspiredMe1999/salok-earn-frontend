import {
    activityData,
    activitySummary,
    mockActivityUser,
    activityPageData,
} from "../../data/activityData";

const MOCK_DELAY = 500;

function delay(ms = MOCK_DELAY) {
    return new Promise((resolve) =>
        setTimeout(resolve, ms)
    );
}

function cloneData(data) {
    return JSON.parse(JSON.stringify(data));
}

export async function getActivities(options = {}) {
    await delay();

    let activities = cloneData(activityData);

    const {
        type = "all",
        searchTerm = "",
    } = options;

    if (type && type !== "all") {
        activities = activities.filter(
            (activity) =>
                activity.type === type
        );
    }

    const normalizedSearch =
        searchTerm.trim().toLowerCase();

    if (normalizedSearch) {
        activities = activities.filter(
            (activity) => {
                const searchableText = [
                    activity.title,
                    activity.description,
                    activity.reference,
                    activity.type,
                    activity.status,
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();

                return searchableText.includes(
                    normalizedSearch
                );
            }
        );
    }

    return {
        success: true,
        data: activities,
        total: activities.length,
    };
}

export async function getActivity(id) {
    await delay();

    const activity =
        activityData.find(
            (item) => item.id === id
        );

    if (!activity) {
        return {
            success: false,
            message: "Activity not found.",
            data: null,
        };
    }

    return {
        success: true,
        data: cloneData(activity),
    };
}

export async function getActivitySummary() {
    await delay();

    return {
        success: true,
        data: cloneData(
            activitySummary
        ),
    };
}

export async function getActivityUser() {
    await delay();

    return {
        success: true,
        data: cloneData(
            mockActivityUser
        ),
    };
}

export async function getActivityPageData() {
    await delay();

    return {
        success: true,
        data: cloneData(
            activityPageData
        ),
    };
}

export async function searchActivities(
    searchTerm,
    type = "all"
) {
    return getActivities({
        searchTerm,
        type,
    });
}

export async function getActivityStats() {
    await delay();

    const activities =
        cloneData(activityData);

    const earnings =
        activities.filter(
            (item) =>
                item.direction === "credit"
        );

    const withdrawals =
        activities.filter(
            (item) =>
                item.type === "withdrawals"
        );

    return {
        success: true,
        data: {
            totalActivities:
                activities.length,

            earningsCount:
                earnings.length,

            withdrawalCount:
                withdrawals.length,

            pendingCount:
                activities.filter(
                    (item) =>
                        item.status ===
                        "pending"
                ).length,
        },
    };
}

export default {
    getActivities,
    getActivity,
    getActivitySummary,
    getActivityUser,
    getActivityPageData,
    searchActivities,
    getActivityStats,
};