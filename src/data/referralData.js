/*
|--------------------------------------------------------------------------
| Salok Earn - Referral Mock Data
|--------------------------------------------------------------------------
|
| This file contains presentation/demo data for the Referrals page.
|
| IMPORTANT:
| This is MOCK DATA only.
| We are NOT connecting to Firebase yet.
|
| When Firebase integration is added later, this file will be replaced
| by data returned from the appropriate backend/Firebase services.
|
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| Referral Configuration
|--------------------------------------------------------------------------
|
| General information used throughout the referral system.
|
*/

export const referralConfig = {
    referralCode: "SALOKSU",

    referralLink: "https://earn.salok.world/signup?ref=SALOKSU",

    rewardPerSuccessfulReferral: 100,

    currency: "SAK",

    minimumReferralsForBonus: 5,

    bonusReward: 500,

    nextMilestone: 5,

    shareMessage:
        "Join me on Salok Earn and turn your time into rewards. Sign up using my referral link and start earning!",
};


/*
|--------------------------------------------------------------------------
| Referral Summary
|--------------------------------------------------------------------------
|
| These values represent the user's current referral performance.
|
*/

export const referralSummary = {
    totalReferrals: 12,

    successfulReferrals: 8,

    pendingReferrals: 4,

    referralEarnings: 800,

    bonusEarnings: 500,

    totalEarned: 1300,

    conversionRate: 66.7,
};


/*
|--------------------------------------------------------------------------
| Referral Progress
|--------------------------------------------------------------------------
|
| Used for the progress/milestone section on the referrals page.
|
*/

export const referralProgress = {
    current: 8,

    target: 10,

    reward: 1000,

    label: "10 successful referrals",

    description:
        "Reach 10 successful referrals to unlock your next referral bonus.",

    percentage: 80,
};


/*
|--------------------------------------------------------------------------
| Referral History
|--------------------------------------------------------------------------
|
| Mock referral records.
|
| status:
| - successful
| - pending
| - expired
|
*/

export const referralHistory = [
    {
        id: "ref-001",

        name: "Daniel O.",

        initials: "DO",

        username: "danielo",

        joinedAt: "2026-09-10",

        status: "successful",

        reward: 100,

        rewardStatus: "credited",
    },

    {
        id: "ref-002",

        name: "Grace M.",

        initials: "GM",

        username: "gracem",

        joinedAt: "2026-09-08",

        status: "successful",

        reward: 100,

        rewardStatus: "credited",
    },

    {
        id: "ref-003",

        name: "Michael A.",

        initials: "MA",

        username: "michaela",

        joinedAt: "2026-09-06",

        status: "successful",

        reward: 100,

        rewardStatus: "credited",
    },

    {
        id: "ref-004",

        name: "Sarah K.",

        initials: "SK",

        username: "sarahk",

        joinedAt: "2026-09-04",

        status: "pending",

        reward: 0,

        rewardStatus: "pending",
    },

    {
        id: "ref-005",

        name: "Victor E.",

        initials: "VE",

        username: "victore",

        joinedAt: "2026-09-02",

        status: "successful",

        reward: 100,

        rewardStatus: "credited",
    },

    {
        id: "ref-006",

        name: "Esther P.",

        initials: "EP",

        username: "estherp",

        joinedAt: "2026-08-30",

        status: "successful",

        reward: 100,

        rewardStatus: "credited",
    },

    {
        id: "ref-007",

        name: "James T.",

        initials: "JT",

        username: "jamest",

        joinedAt: "2026-08-28",

        status: "pending",

        reward: 0,

        rewardStatus: "pending",
    },

    {
        id: "ref-008",

        name: "Mary C.",

        initials: "MC",

        username: "maryc",

        joinedAt: "2026-08-26",

        status: "successful",

        reward: 100,

        rewardStatus: "credited",
    },

    {
        id: "ref-009",

        name: "Samuel B.",

        initials: "SB",

        username: "samuelb",

        joinedAt: "2026-08-23",

        status: "pending",

        reward: 0,

        rewardStatus: "pending",
    },

    {
        id: "ref-010",

        name: "Jennifer N.",

        initials: "JN",

        username: "jennifern",

        joinedAt: "2026-08-20",

        status: "successful",

        reward: 100,

        rewardStatus: "credited",
    },

    {
        id: "ref-011",

        name: "Peter W.",

        initials: "PW",

        username: "peterw",

        joinedAt: "2026-08-18",

        status: "pending",

        reward: 0,

        rewardStatus: "pending",
    },

    {
        id: "ref-012",

        name: "Linda A.",

        initials: "LA",

        username: "lindaa",

        joinedAt: "2026-08-15",

        status: "successful",

        reward: 100,

        rewardStatus: "credited",
    },
];


/*
|--------------------------------------------------------------------------
| Referral Milestones
|--------------------------------------------------------------------------
|
| These can be displayed as a progression/reward section.
|
*/

export const referralMilestones = [
    {
        id: "milestone-1",

        referralsRequired: 1,

        reward: 100,

        title: "First Referral",

        description:
            "Invite your first successful referral.",

        completed: true,
    },

    {
        id: "milestone-2",

        referralsRequired: 5,

        reward: 500,

        title: "Referral Starter",

        description:
            "Reach 5 successful referrals.",

        completed: true,
    },

    {
        id: "milestone-3",

        referralsRequired: 10,

        reward: 1000,

        title: "Referral Builder",

        description:
            "Reach 10 successful referrals.",

        completed: false,
    },

    {
        id: "milestone-4",

        referralsRequired: 25,

        reward: 2500,

        title: "Referral Champion",

        description:
            "Reach 25 successful referrals.",

        completed: false,
    },

    {
        id: "milestone-5",

        referralsRequired: 50,

        reward: 5000,

        title: "Referral Master",

        description:
            "Reach 50 successful referrals.",

        completed: false,
    },
];


/*
|--------------------------------------------------------------------------
| How Referrals Work
|--------------------------------------------------------------------------
|
| Short explanations for the referral information section.
|
*/

export const referralSteps = [
    {
        id: 1,

        title: "Share your link",

        description:
            "Copy your unique referral link and share it with friends, family or your community.",
    },

    {
        id: 2,

        title: "They join Salok Earn",

        description:
            "Your referral creates an account using your unique referral link.",
    },

    {
        id: 3,

        title: "They start earning",

        description:
            "Your referral completes eligible activities and becomes a successful referral.",
    },

    {
        id: 4,

        title: "You earn rewards",

        description:
            "Eligible referral rewards are added to your Salok Earn balance.",
    },
];


/*
|--------------------------------------------------------------------------
| Mock Referral User
|--------------------------------------------------------------------------
|
| Keep this consistent with the mock user used elsewhere in the project.
|
*/

export const mockReferralUser = {
    uid: "mock-user-001",

    username: "SalokUser",

    displayName: "Salok User",

    referralCode: referralConfig.referralCode,

    referralLink: referralConfig.referralLink,
};


/*
|--------------------------------------------------------------------------
| Complete Referral Page Data
|--------------------------------------------------------------------------
|
| Convenient object for the mock referral service.
|
*/

export const referralPageData = {
    config: referralConfig,

    summary: referralSummary,

    progress: referralProgress,

    history: referralHistory,

    milestones: referralMilestones,

    steps: referralSteps,

    user: mockReferralUser,
};