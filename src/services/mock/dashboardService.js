/*
|--------------------------------------------------------------------------
| Dashboard Mock Service
|--------------------------------------------------------------------------
|
| This service deliberately sits between the Dashboard UI and the data.
|
| Later:
|
| DashboardPage
|      ↓
| dashboardService
|      ↓
| Firebase service
|
| For now:
|
| DashboardPage
|      ↓
| dashboardService
|      ↓
| mock data
|
|--------------------------------------------------------------------------
*/

import {
    dashboardSummary,
    recentActivity,
    earningsChart,
    earningOptions,
} from "../../data/dashboardData";

/**
 * Get dashboard summary.
 */
export async function getDashboardSummary() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(dashboardSummary);
        }, 350);
    });
}

/**
 * Get recent user activity.
 */
export async function getRecentActivity() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(recentActivity);
        }, 300);
    });
}

/**
 * Get earnings chart data.
 */
export async function getEarningsChart() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(earningsChart);
        }, 300);
    });
}

/**
 * Get quick earning destinations.
 */
export async function getEarningOptions() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(earningOptions);
        }, 250);
    });
}

/**
 * Get everything required by the dashboard.
 */
export async function getDashboardData() {
    const [
        summary,
        activity,
        chart,
        earningAreas,
    ] = await Promise.all([
        getDashboardSummary(),
        getRecentActivity(),
        getEarningsChart(),
        getEarningOptions(),
    ]);

    return {
        summary,
        activity,
        chart,
        earningAreas,
    };
}