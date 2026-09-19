export const adminSettingsSections = [
    {
        id: "general",
        label: "General",
        description:
            "Basic platform identity and operational settings.",
    },
    {
        id: "earning",
        label: "Earning",
        description:
            "Configure general earning behaviour and limits.",
    },
    {
        id: "withdrawal",
        label: "Withdrawals",
        description:
            "Configure withdrawal-related display and limits.",
    },
    {
        id: "referral",
        label: "Referrals",
        description:
            "Configure referral rewards and milestone behaviour.",
    },
    {
        id: "trivia",
        label: "Trivia",
        description:
            "Configure trivia energy, rewards and answer limits.",
    },
    {
        id: "community",
        label: "Community",
        description:
            "Configure community participation and moderation settings.",
    },
    {
        id: "maintenance",
        label: "Maintenance",
        description:
            "Control temporary platform maintenance behaviour.",
    },
];

export const adminSettings = {
    general: {
        platformName: "Salok Earn",
        platformCode: "SAK",
        supportEmail: "support@salok.world",
        defaultTimezone: "Africa/Lagos",
        registrationEnabled: true,
        newUserBonus: 0,
    },

    earning: {
        earningCurrency: "SAK",
        minimumOfferReward: 10,
        maximumOfferReward: 5000,
        dailyEarningLimit: 100000,
        earningHistoryDays: 90,
        showEstimatedRewards: true,
    },

    withdrawal: {
        minimumWithdrawal: 500,
        maximumWithdrawal: 100000,
        dailyWithdrawalLimit: 100000,
        processingFee: 0,
        withdrawalsEnabled: true,
        manualReviewEnabled: true,
    },

    referral: {
        referralReward: 100,
        milestoneReward: 500,
        milestoneTarget: 5,
        referralsEnabled: true,
        requireQualifiedReferral: true,
        maximumReferralBonus: 5000,
    },

    trivia: {
        dailyAnswerLimit: 150,
        categoryAnswerLimit: 30,
        maximumEnergy: 10,
        roundEnergyCost: 1,
        rewardPerCorrectAnswer: 20,
        triviaEnabled: true,
    },

    community: {
        communityEnabled: true,
        imageUploadsEnabled: true,
        repliesEnabled: true,
        maximumMessageLength: 500,
        maximumImageSizeMb: 5,
        moderationEnabled: true,
    },

    maintenance: {
        maintenanceMode: false,
        maintenanceTitle: "We'll be back soon",
        maintenanceMessage:
            "Salok Earn is temporarily unavailable while we perform maintenance.",
        allowAdminAccess: true,
    },
};

export const adminSettingsPageData = {
    sections: adminSettingsSections,
    settings: adminSettings,
};