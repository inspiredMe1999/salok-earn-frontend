export const mockProfileUser = {
    uid: "mock-user-001",

    username: "SalokUser",

    displayName: "Salok User",

    email: "demo@salok.earn",

    initials: "SU",

    bio:
        "Exploring new ways to earn, learn and grow with Salok.",

    region: "Nigeria",

    countryCode: "NG",

    phone: "",

    dateOfBirth: "",

    joinedAt: "2026-01-15T10:30:00",

    avatarUrl: "",

    role: "Member",

    verified: true,

    emailVerified: true,

    accountStatus: "active",
};

export const profileStats = {
    totalEarned: 12840.25,

    totalWithdrawn: 8340,

    triviaScore: 42180,

    triviaRounds: 87,

    referrals: 12,

    successfulReferrals: 8,

    completedActivities: 143,

    daysActive: 62,
};

export const profilePreferences = {
    language: "English",

    timezone: "Africa/Lagos",

    currency: "SAK",

    showProfileToCommunity: true,

    allowCommunityMessages: true,

    showOnlineStatus: true,

    showEarningsOnProfile: false,
};

export const profilePageData = {
    user: mockProfileUser,

    stats: profileStats,

    preferences: profilePreferences,
};