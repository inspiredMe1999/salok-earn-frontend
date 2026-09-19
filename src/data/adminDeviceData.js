export const adminDeviceSummary = {
    flaggedAccounts: 18,
    deviceClusters: 9,
    blockedDevices: 6,
    highRiskAccounts: 11,
    recentScans: 42,
};

export const adminDeviceRiskLevels = [
    {
        id: "all",
        name: "All Risk Levels",
    },
    {
        id: "low",
        name: "Low Risk",
    },
    {
        id: "medium",
        name: "Medium Risk",
    },
    {
        id: "high",
        name: "High Risk",
    },
    {
        id: "critical",
        name: "Critical Risk",
    },
];

export const adminDeviceStatuses = [
    {
        id: "all",
        name: "All Statuses",
    },
    {
        id: "clear",
        name: "Clear",
    },
    {
        id: "flagged",
        name: "Flagged",
    },
    {
        id: "blocked",
        name: "Blocked",
    },
];

export const adminDeviceCountries = [
    "All Countries",
    "Nigeria",
    "Ghana",
    "Kenya",
    "South Africa",
    "United States",
    "United Kingdom",
];

export const adminDeviceRecords = [
    {
        id: "device-001",
        deviceFingerprint: "dfp_7F2A91C4E8",
        deviceInstallId: "install_A81F29",
        riskLevel: "critical",
        status: "flagged",
        country: "Nigeria",

        accountCount: 4,

        accounts: [
            {
                uid: "user_001",
                username: "john_earn",
                email: "john@example.com",
                status: "active",
                createdAt: "2026-08-22",
            },
            {
                uid: "user_018",
                username: "jane_rewards",
                email: "jane@example.com",
                status: "active",
                createdAt: "2026-08-24",
            },
            {
                uid: "user_034",
                username: "quickcoins",
                email: "quickcoins@example.com",
                status: "blocked",
                createdAt: "2026-08-25",
            },
            {
                uid: "user_041",
                username: "sakmaster",
                email: "sakmaster@example.com",
                status: "active",
                createdAt: "2026-08-26",
            },
        ],

        indicators: [
            "Multiple accounts detected on the same device",
            "Shared device fingerprint",
            "Similar signup metadata",
        ],

        lastScanAt: "2026-09-15T14:25:00Z",
        flaggedAt: "2026-09-15T14:30:00Z",
        flaggedBy: "admin",
        flagReason:
            "Multiple accounts share the same device fingerprint.",
    },

    {
        id: "device-002",
        deviceFingerprint: "dfp_4B8D2A17C9",
        deviceInstallId: "install_B19D52",
        riskLevel: "high",
        status: "flagged",
        country: "Ghana",

        accountCount: 3,

        accounts: [
            {
                uid: "user_062",
                username: "rewardhunter",
                email: "rewardhunter@example.com",
                status: "active",
                createdAt: "2026-08-30",
            },
            {
                uid: "user_074",
                username: "sakfinder",
                email: "sakfinder@example.com",
                status: "active",
                createdAt: "2026-09-01",
            },
            {
                uid: "user_083",
                username: "earnfast",
                email: "earnfast@example.com",
                status: "active",
                createdAt: "2026-09-03",
            },
        ],

        indicators: [
            "Three linked accounts",
            "Shared installation identifier",
        ],

        lastScanAt: "2026-09-15T12:10:00Z",
        flaggedAt: "2026-09-15T12:15:00Z",
        flaggedBy: "admin",
        flagReason:
            "Three active accounts were associated with the same installation.",
    },

    {
        id: "device-003",
        deviceFingerprint: "dfp_91C7E4A2D1",
        deviceInstallId: "install_C72A11",
        riskLevel: "medium",
        status: "flagged",
        country: "Kenya",

        accountCount: 2,

        accounts: [
            {
                uid: "user_104",
                username: "kenyaearn",
                email: "kenyaearn@example.com",
                status: "active",
                createdAt: "2026-09-04",
            },
            {
                uid: "user_118",
                username: "bonusrunner",
                email: "bonusrunner@example.com",
                status: "active",
                createdAt: "2026-09-05",
            },
        ],

        indicators: [
            "Two accounts detected",
            "Shared device fingerprint",
        ],

        lastScanAt: "2026-09-14T18:40:00Z",
        flaggedAt: "2026-09-14T18:45:00Z",
        flaggedBy: "admin",
        flagReason:
            "Two accounts are associated with the same device.",
    },

    {
        id: "device-004",
        deviceFingerprint: "dfp_A72C91E4F3",
        deviceInstallId: "install_D52B18",
        riskLevel: "low",
        status: "clear",
        country: "Nigeria",

        accountCount: 1,

        accounts: [
            {
                uid: "user_137",
                username: "dailyworker",
                email: "dailyworker@example.com",
                status: "active",
                createdAt: "2026-09-06",
            },
        ],

        indicators: [
            "Single account detected",
        ],

        lastScanAt: "2026-09-15T10:20:00Z",
        flaggedAt: null,
        flaggedBy: null,
        flagReason: null,
    },

    {
        id: "device-005",
        deviceFingerprint: "dfp_62D8B4F19A",
        deviceInstallId: "install_E83C27",
        riskLevel: "critical",
        status: "blocked",
        country: "South Africa",

        accountCount: 5,

        accounts: [
            {
                uid: "user_151",
                username: "cashflow",
                email: "cashflow@example.com",
                status: "blocked",
                createdAt: "2026-08-11",
            },
            {
                uid: "user_154",
                username: "earnking",
                email: "earnking@example.com",
                status: "blocked",
                createdAt: "2026-08-12",
            },
            {
                uid: "user_159",
                username: "rewardpro",
                email: "rewardpro@example.com",
                status: "blocked",
                createdAt: "2026-08-14",
            },
            {
                uid: "user_166",
                username: "taskmaster",
                email: "taskmaster@example.com",
                status: "blocked",
                createdAt: "2026-08-15",
            },
            {
                uid: "user_171",
                username: "sakboss",
                email: "sakboss@example.com",
                status: "blocked",
                createdAt: "2026-08-16",
            },
        ],

        indicators: [
            "Five linked accounts",
            "Repeated signup metadata",
            "Device previously blocked",
        ],

        lastScanAt: "2026-09-13T09:05:00Z",
        flaggedAt: "2026-09-13T09:10:00Z",
        flaggedBy: "admin",
        flagReason:
            "Large multi-account cluster with repeated account creation patterns.",
    },

    {
        id: "device-006",
        deviceFingerprint: "dfp_83A6D1C94B",
        deviceInstallId: "install_F42A73",
        riskLevel: "high",
        status: "flagged",
        country: "United States",

        accountCount: 2,

        accounts: [
            {
                uid: "user_184",
                username: "surveyplus",
                email: "surveyplus@example.com",
                status: "active",
                createdAt: "2026-09-02",
            },
            {
                uid: "user_190",
                username: "offerloop",
                email: "offerloop@example.com",
                status: "active",
                createdAt: "2026-09-03",
            },
        ],

        indicators: [
            "Multiple accounts detected",
            "Matching device metadata",
        ],

        lastScanAt: "2026-09-12T16:30:00Z",
        flaggedAt: "2026-09-12T16:35:00Z",
        flaggedBy: "admin",
        flagReason:
            "Multiple accounts share device metadata.",
    },

    {
        id: "device-007",
        deviceFingerprint: "dfp_17C8A4D25E",
        deviceInstallId: "install_G31D82",
        riskLevel: "medium",
        status: "clear",
        country: "United Kingdom",

        accountCount: 1,

        accounts: [
            {
                uid: "user_203",
                username: "taskrunner",
                email: "taskrunner@example.com",
                status: "active",
                createdAt: "2026-09-07",
            },
        ],

        indicators: [
            "Single account detected",
            "No duplicate installation found",
        ],

        lastScanAt: "2026-09-11T11:10:00Z",
        flaggedAt: null,
        flaggedBy: null,
        flagReason: null,
    },

    {
        id: "device-008",
        deviceFingerprint: "dfp_54E1A8C73D",
        deviceInstallId: "install_H92C14",
        riskLevel: "high",
        status: "flagged",
        country: "Nigeria",

        accountCount: 3,

        accounts: [
            {
                uid: "user_224",
                username: "sakdaily",
                email: "sakdaily@example.com",
                status: "active",
                createdAt: "2026-09-08",
            },
            {
                uid: "user_229",
                username: "bonusdaily",
                email: "bonusdaily@example.com",
                status: "active",
                createdAt: "2026-09-08",
            },
            {
                uid: "user_235",
                username: "earnmore",
                email: "earnmore@example.com",
                status: "active",
                createdAt: "2026-09-09",
            },
        ],

        indicators: [
            "Three accounts detected",
            "Shared device fingerprint",
            "Similar installation metadata",
        ],

        lastScanAt: "2026-09-10T15:45:00Z",
        flaggedAt: "2026-09-10T15:50:00Z",
        flaggedBy: "admin",
        flagReason:
            "Multiple accounts detected with shared device identifiers.",
    },
];

export const adminDevicePageData = {
    summary: adminDeviceSummary,
    riskLevels: adminDeviceRiskLevels,
    statuses: adminDeviceStatuses,
    countries: adminDeviceCountries,
    devices: adminDeviceRecords,
};