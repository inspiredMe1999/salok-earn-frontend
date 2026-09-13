/*
|--------------------------------------------------------------------------
| Leaderboard Mock Data
|--------------------------------------------------------------------------
|
| This file contains temporary leaderboard data for the frontend.
|
| IMPORTANT:
| This is MOCK DATA only.
|
| Later, this file will be replaced by data coming from Firebase /
| the real backend.
|
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| Leaderboard Periods
|--------------------------------------------------------------------------
*/

export const LEADERBOARD_PERIODS = [
    {
        id: "global",
        name: "Global",
        description: "Top earners across Salok Earn",
    },
    {
        id: "weekly",
        name: "Weekly",
        description: "Top earners this week",
    },
    {
        id: "daily",
        name: "Daily",
        description: "Top earners today",
    },
    {
        id: "regional",
        name: "Regional",
        description: "Top earners in your region",
    },
];


/*
|--------------------------------------------------------------------------
| Available Regions
|--------------------------------------------------------------------------
*/

export const leaderboardRegions = [
    {
        id: "ng",
        name: "Nigeria",
    },
    {
        id: "gh",
        name: "Ghana",
    },
    {
        id: "ke",
        name: "Kenya",
    },
    {
        id: "za",
        name: "South Africa",
    },
    {
        id: "us",
        name: "United States",
    },
    {
        id: "gb",
        name: "United Kingdom",
    },
    {
        id: "in",
        name: "India",
    },
];


/*
|--------------------------------------------------------------------------
| Global Leaderboard
|--------------------------------------------------------------------------
*/

export const globalLeaderboard = [
    {
        rank: 1,
        uid: "user-001",
        username: "AlexMorgan",
        displayName: "Alex Morgan",
        initials: "AM",
        region: "United States",
        regionCode: "us",
        score: 98450,
        earnings: 9845.0,
        trend: 2,
    },
    {
        rank: 2,
        uid: "user-002",
        username: "SarahK",
        displayName: "Sarah King",
        initials: "SK",
        region: "United Kingdom",
        regionCode: "gb",
        score: 92180,
        earnings: 9218.0,
        trend: 1,
    },
    {
        rank: 3,
        uid: "user-003",
        username: "DavidChen",
        displayName: "David Chen",
        initials: "DC",
        region: "Singapore",
        regionCode: "sg",
        score: 88760,
        earnings: 8876.0,
        trend: -1,
    },
    {
        rank: 4,
        uid: "user-004",
        username: "MayaStone",
        displayName: "Maya Stone",
        initials: "MS",
        region: "Canada",
        regionCode: "ca",
        score: 84250,
        earnings: 8425.0,
        trend: 3,
    },
    {
        rank: 5,
        uid: "user-005",
        username: "JamesWilson",
        displayName: "James Wilson",
        initials: "JW",
        region: "United States",
        regionCode: "us",
        score: 81640,
        earnings: 8164.0,
        trend: -2,
    },
    {
        rank: 6,
        uid: "user-006",
        username: "EmmaGrace",
        displayName: "Emma Grace",
        initials: "EG",
        region: "Australia",
        regionCode: "au",
        score: 78920,
        earnings: 7892.0,
        trend: 4,
    },
    {
        rank: 7,
        uid: "user-007",
        username: "DanielO",
        displayName: "Daniel Okafor",
        initials: "DO",
        region: "Nigeria",
        regionCode: "ng",
        score: 75480,
        earnings: 7548.0,
        trend: 1,
    },
    {
        rank: 8,
        uid: "user-008",
        username: "SophiaLee",
        displayName: "Sophia Lee",
        initials: "SL",
        region: "Malaysia",
        regionCode: "my",
        score: 72890,
        earnings: 7289.0,
        trend: -3,
    },
    {
        rank: 9,
        uid: "user-009",
        username: "MichaelBrown",
        displayName: "Michael Brown",
        initials: "MB",
        region: "United States",
        regionCode: "us",
        score: 69420,
        earnings: 6942.0,
        trend: 2,
    },
    {
        rank: 10,
        uid: "user-010",
        username: "GraceAdams",
        displayName: "Grace Adams",
        initials: "GA",
        region: "Ghana",
        regionCode: "gh",
        score: 67150,
        earnings: 6715.0,
        trend: 5,
    },
    {
        rank: 11,
        uid: "user-011",
        username: "NoahWilliams",
        displayName: "Noah Williams",
        initials: "NW",
        region: "United Kingdom",
        regionCode: "gb",
        score: 64880,
        earnings: 6488.0,
        trend: -1,
    },
    {
        rank: 12,
        uid: "user-012",
        username: "OliviaJames",
        displayName: "Olivia James",
        initials: "OJ",
        region: "South Africa",
        regionCode: "za",
        score: 62140,
        earnings: 6214.0,
        trend: 2,
    },
    {
        rank: 13,
        uid: "user-013",
        username: "EthanCole",
        displayName: "Ethan Cole",
        initials: "EC",
        region: "Kenya",
        regionCode: "ke",
        score: 59820,
        earnings: 5982.0,
        trend: -2,
    },
    {
        rank: 14,
        uid: "user-014",
        username: "AvaTaylor",
        displayName: "Ava Taylor",
        initials: "AT",
        region: "India",
        regionCode: "in",
        score: 57460,
        earnings: 5746.0,
        trend: 3,
    },
    {
        rank: 15,
        uid: "user-015",
        username: "LiamScott",
        displayName: "Liam Scott",
        initials: "LS",
        region: "Australia",
        regionCode: "au",
        score: 55210,
        earnings: 5521.0,
        trend: 1,
    },
    {
        rank: 24,
        uid: "mock-user-001",
        username: "SalokUser",
        displayName: "Salok User",
        initials: "SU",
        region: "Nigeria",
        regionCode: "ng",
        score: 42180,
        earnings: 4218.0,
        trend: 4,
        isCurrentUser: true,
    },
];


/*
|--------------------------------------------------------------------------
| Weekly Leaderboard
|--------------------------------------------------------------------------
*/

export const weeklyLeaderboard = [
    {
        rank: 1,
        uid: "weekly-001",
        username: "SarahK",
        displayName: "Sarah King",
        initials: "SK",
        region: "United Kingdom",
        regionCode: "gb",
        score: 18240,
        earnings: 1824.0,
        trend: 3,
    },
    {
        rank: 2,
        uid: "weekly-002",
        username: "DanielO",
        displayName: "Daniel Okafor",
        initials: "DO",
        region: "Nigeria",
        regionCode: "ng",
        score: 16980,
        earnings: 1698.0,
        trend: 5,
    },
    {
        rank: 3,
        uid: "weekly-003",
        username: "AlexMorgan",
        displayName: "Alex Morgan",
        initials: "AM",
        region: "United States",
        regionCode: "us",
        score: 15870,
        earnings: 1587.0,
        trend: -1,
    },
    {
        rank: 4,
        uid: "weekly-004",
        username: "MayaStone",
        displayName: "Maya Stone",
        initials: "MS",
        region: "Canada",
        regionCode: "ca",
        score: 14620,
        earnings: 1462.0,
        trend: 2,
    },
    {
        rank: 5,
        uid: "weekly-005",
        username: "GraceAdams",
        displayName: "Grace Adams",
        initials: "GA",
        region: "Ghana",
        regionCode: "gh",
        score: 13980,
        earnings: 1398.0,
        trend: 4,
    },
    {
        rank: 6,
        uid: "weekly-006",
        username: "DavidChen",
        displayName: "David Chen",
        initials: "DC",
        region: "Singapore",
        regionCode: "sg",
        score: 13150,
        earnings: 1315.0,
        trend: -2,
    },
    {
        rank: 7,
        uid: "weekly-007",
        username: "EmmaGrace",
        displayName: "Emma Grace",
        initials: "EG",
        region: "Australia",
        regionCode: "au",
        score: 12640,
        earnings: 1264.0,
        trend: 1,
    },
    {
        rank: 8,
        uid: "weekly-008",
        username: "MichaelBrown",
        displayName: "Michael Brown",
        initials: "MB",
        region: "United States",
        regionCode: "us",
        score: 11820,
        earnings: 1182.0,
        trend: -1,
    },
    {
        rank: 9,
        uid: "weekly-009",
        username: "OliviaJames",
        displayName: "Olivia James",
        initials: "OJ",
        region: "South Africa",
        regionCode: "za",
        score: 11090,
        earnings: 1109.0,
        trend: 2,
    },
    {
        rank: 10,
        uid: "weekly-010",
        username: "SalokUser",
        displayName: "Salok User",
        initials: "SU",
        region: "Nigeria",
        regionCode: "ng",
        score: 10480,
        earnings: 1048.0,
        trend: 6,
        isCurrentUser: true,
    },
];


/*
|--------------------------------------------------------------------------
| Daily Leaderboard
|--------------------------------------------------------------------------
*/

export const dailyLeaderboard = [
    {
        rank: 1,
        uid: "daily-001",
        username: "DanielO",
        displayName: "Daniel Okafor",
        initials: "DO",
        region: "Nigeria",
        regionCode: "ng",
        score: 3820,
        earnings: 382.0,
        trend: 4,
    },
    {
        rank: 2,
        uid: "daily-002",
        username: "AlexMorgan",
        displayName: "Alex Morgan",
        initials: "AM",
        region: "United States",
        regionCode: "us",
        score: 3540,
        earnings: 354.0,
        trend: -1,
    },
    {
        rank: 3,
        uid: "daily-003",
        username: "SarahK",
        displayName: "Sarah King",
        initials: "SK",
        region: "United Kingdom",
        regionCode: "gb",
        score: 3280,
        earnings: 328.0,
        trend: 2,
    },
    {
        rank: 4,
        uid: "daily-004",
        username: "GraceAdams",
        displayName: "Grace Adams",
        initials: "GA",
        region: "Ghana",
        regionCode: "gh",
        score: 3010,
        earnings: 301.0,
        trend: 5,
    },
    {
        rank: 5,
        uid: "daily-005",
        username: "MayaStone",
        displayName: "Maya Stone",
        initials: "MS",
        region: "Canada",
        regionCode: "ca",
        score: 2860,
        earnings: 286.0,
        trend: 1,
    },
    {
        rank: 6,
        uid: "daily-006",
        username: "SalokUser",
        displayName: "Salok User",
        initials: "SU",
        region: "Nigeria",
        regionCode: "ng",
        score: 2640,
        earnings: 264.0,
        trend: 7,
        isCurrentUser: true,
    },
    {
        rank: 7,
        uid: "daily-007",
        username: "EmmaGrace",
        displayName: "Emma Grace",
        initials: "EG",
        region: "Australia",
        regionCode: "au",
        score: 2480,
        earnings: 248.0,
        trend: -2,
    },
    {
        rank: 8,
        uid: "daily-008",
        username: "DavidChen",
        displayName: "David Chen",
        initials: "DC",
        region: "Singapore",
        regionCode: "sg",
        score: 2310,
        earnings: 231.0,
        trend: 3,
    },
    {
        rank: 9,
        uid: "daily-009",
        username: "OliviaJames",
        displayName: "Olivia James",
        initials: "OJ",
        region: "South Africa",
        regionCode: "za",
        score: 2190,
        earnings: 219.0,
        trend: -1,
    },
    {
        rank: 10,
        uid: "daily-010",
        username: "NoahWilliams",
        displayName: "Noah Williams",
        initials: "NW",
        region: "United Kingdom",
        regionCode: "gb",
        score: 2050,
        earnings: 205.0,
        trend: 2,
    },
];


/*
|--------------------------------------------------------------------------
| Regional Leaderboard
|--------------------------------------------------------------------------
|
| Default regional leaderboard.
|
| For now we use Nigeria as the mock user's region.
|
|--------------------------------------------------------------------------
*/

export const regionalLeaderboard = [
    {
        rank: 1,
        uid: "region-001",
        username: "DanielO",
        displayName: "Daniel Okafor",
        initials: "DO",
        region: "Nigeria",
        regionCode: "ng",
        score: 75480,
        earnings: 7548.0,
        trend: 2,
    },
    {
        rank: 2,
        uid: "region-002",
        username: "ChikaM",
        displayName: "Chika Morgan",
        initials: "CM",
        region: "Nigeria",
        regionCode: "ng",
        score: 69820,
        earnings: 6982.0,
        trend: 4,
    },
    {
        rank: 3,
        uid: "region-003",
        username: "TundeA",
        displayName: "Tunde Adeyemi",
        initials: "TA",
        region: "Nigeria",
        regionCode: "ng",
        score: 64150,
        earnings: 6415.0,
        trend: -1,
    },
    {
        rank: 4,
        uid: "region-004",
        username: "AmakaE",
        displayName: "Amaka Emmanuel",
        initials: "AE",
        region: "Nigeria",
        regionCode: "ng",
        score: 59840,
        earnings: 5984.0,
        trend: 3,
    },
    {
        rank: 5,
        uid: "region-005",
        username: "IbrahimY",
        displayName: "Ibrahim Yusuf",
        initials: "IY",
        region: "Nigeria",
        regionCode: "ng",
        score: 55290,
        earnings: 5529.0,
        trend: 1,
    },
    {
        rank: 6,
        uid: "mock-user-001",
        username: "SalokUser",
        displayName: "Salok User",
        initials: "SU",
        region: "Nigeria",
        regionCode: "ng",
        score: 42180,
        earnings: 4218.0,
        trend: 4,
        isCurrentUser: true,
    },
    {
        rank: 7,
        uid: "region-007",
        username: "BlessingO",
        displayName: "Blessing Okoro",
        initials: "BO",
        region: "Nigeria",
        regionCode: "ng",
        score: 39850,
        earnings: 3985.0,
        trend: -2,
    },
    {
        rank: 8,
        uid: "region-008",
        username: "KelvinI",
        displayName: "Kelvin Isaac",
        initials: "KI",
        region: "Nigeria",
        regionCode: "ng",
        score: 37620,
        earnings: 3762.0,
        trend: 2,
    },
    {
        rank: 9,
        uid: "region-009",
        username: "EstherN",
        displayName: "Esther Nwosu",
        initials: "EN",
        region: "Nigeria",
        regionCode: "ng",
        score: 35240,
        earnings: 3524.0,
        trend: -1,
    },
    {
        rank: 10,
        uid: "region-010",
        username: "VictorC",
        displayName: "Victor Chukwu",
        initials: "VC",
        region: "Nigeria",
        regionCode: "ng",
        score: 33180,
        earnings: 3318.0,
        trend: 3,
    },
];


/*
|--------------------------------------------------------------------------
| Leaderboard Data Map
|--------------------------------------------------------------------------
|
| Makes it easy for the mock service to retrieve a leaderboard based
| on the selected period.
|
|--------------------------------------------------------------------------
*/

export const leaderboardData = {
    global: globalLeaderboard,
    weekly: weeklyLeaderboard,
    daily: dailyLeaderboard,
    regional: regionalLeaderboard,
};


/*
|--------------------------------------------------------------------------
| Current Mock User
|--------------------------------------------------------------------------
*/

export const mockLeaderboardUser = {
    uid: "mock-user-001",
    username: "SalokUser",
    displayName: "Salok User",
    initials: "SU",
    region: "Nigeria",
    regionCode: "ng",
};