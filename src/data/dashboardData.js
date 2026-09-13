/*
|--------------------------------------------------------------------------
| Salok Earn — Dashboard Mock Data
|--------------------------------------------------------------------------
|
| IMPORTANT:
| This file contains presentation/demo data only.
|
| It does NOT communicate with Firebase.
|
| The structure is intentionally shaped around the concepts exposed by
| the audited Salok Earn backend so that the mock service can later be
| replaced by a Firebase service without redesigning the dashboard.
|
|--------------------------------------------------------------------------
*/

export const dashboardSummary = {
    wallet: {
        balance: 1250.75,
        pending: 180.25,
        totalEarned: 4875.5,
        withdrawable: 1250.75,
        currency: "SAK",
    },

    activity: {
        today: 175,
        thisWeek: 840,
        thisMonth: 2310.5,
    },

    trivia: {
        questionsAnsweredToday: 18,
        dailyLimit: 150,
        currentStreak: 4,
    },

    leaderboard: {
        position: 27,
        weeklyEarnings: 625.5,
    },

    referrals: {
        enabled: true,
        totalReferrals: 8,
        activeReferrals: 5,
        earned: 320,
    },

    account: {
        status: "active",
        verificationStatus: "verified",
    },
};

/*
|--------------------------------------------------------------------------
| Recent Activity
|--------------------------------------------------------------------------
*/

export const recentActivity = [
    {
        id: "activity-001",
        type: "trivia",
        title: "Trivia reward",
        description: "Completed a trivia round",
        amount: 25,
        currency: "SAK",
        direction: "credit",
        timestamp: "Today, 5:42 PM",
    },
    {
        id: "activity-002",
        type: "task",
        title: "Task completed",
        description: "Completed an available task",
        amount: 80,
        currency: "SAK",
        direction: "credit",
        timestamp: "Today, 3:18 PM",
    },
    {
        id: "activity-003",
        type: "survey",
        title: "Survey reward",
        description: "Completed a survey",
        amount: 45,
        currency: "SAK",
        direction: "credit",
        timestamp: "Today, 1:06 PM",
    },
    {
        id: "activity-004",
        type: "referral",
        title: "Referral reward",
        description: "Referral activity reward",
        amount: 25,
        currency: "SAK",
        direction: "credit",
        timestamp: "Yesterday, 7:34 PM",
    },
    {
        id: "activity-005",
        type: "withdrawal",
        title: "Withdrawal requested",
        description: "Withdrawal is being processed",
        amount: 500,
        currency: "SAK",
        direction: "debit",
        timestamp: "Yesterday, 2:20 PM",
    },
];

/*
|--------------------------------------------------------------------------
| Earnings Chart
|--------------------------------------------------------------------------
|
| This is only visual mock data.
| The Firebase implementation will eventually obtain the real values
| from the appropriate backend-controlled data.
|
|--------------------------------------------------------------------------
*/

export const earningsChart = [
    {
        day: "Mon",
        earnings: 85,
    },
    {
        day: "Tue",
        earnings: 120,
    },
    {
        day: "Wed",
        earnings: 95,
    },
    {
        day: "Thu",
        earnings: 160,
    },
    {
        day: "Fri",
        earnings: 135,
    },
    {
        day: "Sat",
        earnings: 210,
    },
    {
        day: "Sun",
        earnings: 175,
    },
];

/*
|--------------------------------------------------------------------------
| Quick earning areas
|--------------------------------------------------------------------------
|
| These represent frontend destinations.
| They do not imply that the frontend itself awards money.
|
|--------------------------------------------------------------------------
*/

export const earningOptions = [
    {
        id: "surveys",
        title: "Surveys",
        description: "Share your opinions",
        path: "/earn/surveys",
        type: "survey",
    },
    {
        id: "tasks",
        title: "Tasks",
        description: "Complete available tasks",
        path: "/earn/tasks",
        type: "task",
    },
    {
        id: "trivia",
        title: "Trivia",
        description: "Answer questions",
        path: "/trivia",
        type: "trivia",
    },
    {
        id: "offers",
        title: "Offers",
        description: "Explore available offers",
        path: "/earn/offers",
        type: "offer",
    },
];