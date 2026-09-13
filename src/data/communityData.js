// src/data/communityData.js

export const communityInfo = {
    id: "global",
    name: "Salok Community",
    description:
        "Connect, share ideas and celebrate your earning journey.",
    memberCount: 12840,
    onlineCount: 428,
    status: "online",
};

export const communityRules = [
    "Be respectful and helpful to other members.",
    "Do not share passwords, private keys or sensitive information.",
    "Avoid spam, scams and misleading earning claims.",
    "Keep conversations relevant to the community.",
];

export const communityMembers = [
    {
        id: "member-001",
        username: "SarahK",
        displayName: "Sarah K.",
        initials: "SK",
        status: "online",
        role: "Top Earner",
        earnings: 8420,
    },
    {
        id: "member-002",
        username: "DavidM",
        displayName: "David M.",
        initials: "DM",
        status: "online",
        role: "Member",
        earnings: 6540,
    },
    {
        id: "member-003",
        username: "AdaTech",
        displayName: "Ada Tech",
        initials: "AT",
        status: "online",
        role: "Member",
        earnings: 5210,
    },
    {
        id: "member-004",
        username: "MikeEarns",
        displayName: "Mike E.",
        initials: "ME",
        status: "away",
        role: "Member",
        earnings: 4875,
    },
    {
        id: "member-005",
        username: "GraceO",
        displayName: "Grace O.",
        initials: "GO",
        status: "online",
        role: "Member",
        earnings: 3910,
    },
    {
        id: "member-006",
        username: "ChrisP",
        displayName: "Chris P.",
        initials: "CP",
        status: "offline",
        role: "Member",
        earnings: 2750,
    },
];

export const communityMessages = [
    {
        id: "message-001",
        userId: "member-001",
        username: "SarahK",
        displayName: "Sarah K.",
        initials: "SK",
        role: "Top Earner",
        message:
            "Good morning everyone! Hope you're all having a great earning day.",
        timestamp: "2026-09-12T00:15:00",
        reactions: [
            {
                emoji: "❤️",
                count: 8,
                reacted: false,
            },
            {
                emoji: "🔥",
                count: 5,
                reacted: false,
            },
        ],
    },

    {
        id: "message-002",
        userId: "member-002",
        username: "DavidM",
        displayName: "David M.",
        initials: "DM",
        role: "Member",
        message:
            "Morning Sarah! Trivia has been really fun today.",
        timestamp: "2026-09-12T00:18:00",
        reactions: [
            {
                emoji: "👍",
                count: 4,
                reacted: false,
            },
        ],
    },

    {
        id: "message-003",
        userId: "mock-user-001",
        username: "SalokUser",
        displayName: "Salok User",
        initials: "SU",
        role: "Member",
        message:
            "Same here! I just completed a General Knowledge round.",
        timestamp: "2026-09-12T00:20:00",
        reactions: [
            {
                emoji: "🎯",
                count: 3,
                reacted: true,
            },
        ],
    },

    {
        id: "message-004",
        userId: "member-003",
        username: "AdaTech",
        displayName: "Ada Tech",
        initials: "AT",
        role: "Member",
        message:
            "Nice! How many did you get correct?",
        timestamp: "2026-09-12T00:22:00",
        reactions: [],
    },

    {
        id: "message-005",
        userId: "mock-user-001",
        username: "SalokUser",
        displayName: "Salok User",
        initials: "SU",
        role: "Member",
        message:
            "4 out of 5. Not bad 😄",
        timestamp: "2026-09-12T00:23:00",
        reactions: [
            {
                emoji: "👏",
                count: 6,
                reacted: false,
            },
        ],
    },

    {
        id: "message-006",
        userId: "member-005",
        username: "GraceO",
        displayName: "Grace O.",
        initials: "GO",
        role: "Member",
        message:
            "That's actually pretty good. I'm trying to improve my score every day.",
        timestamp: "2026-09-12T00:27:00",
        reactions: [
            {
                emoji: "💪",
                count: 7,
                reacted: false,
            },
        ],
    },

    {
        id: "message-007",
        userId: "member-001",
        username: "SarahK",
        displayName: "Sarah K.",
        initials: "SK",
        role: "Top Earner",
        message:
            "Consistency is the key. Small rewards really add up over time.",
        timestamp: "2026-09-12T00:30:00",
        reactions: [
            {
                emoji: "💯",
                count: 11,
                reacted: false,
            },
        ],
    },

    {
        id: "message-008",
        userId: "member-004",
        username: "MikeEarns",
        displayName: "Mike E.",
        initials: "ME",
        role: "Member",
        message:
            "Absolutely. I usually check the Earn page in the morning and evening.",
        timestamp: "2026-09-12T00:33:00",
        reactions: [],
    },

    {
        id: "message-009",
        userId: "mock-user-001",
        username: "SalokUser",
        displayName: "Salok User",
        initials: "SU",
        role: "Member",
        message:
            "That's a good strategy. I'll try that too.",
        timestamp: "2026-09-12T00:36:00",
        reactions: [
            {
                emoji: "👍",
                count: 2,
                reacted: true,
            },
        ],
    },

    {
        id: "message-010",
        userId: "member-002",
        username: "DavidM",
        displayName: "David M.",
        initials: "DM",
        role: "Member",
        message:
            "Good luck everyone. Let's have a productive day!",
        timestamp: "2026-09-12T00:40:00",
        reactions: [
            {
                emoji: "🔥",
                count: 9,
                reacted: false,
            },
        ],
    },
];

export const communitySummary = {
    totalMessages: communityMessages.length,
    totalMembers: communityInfo.memberCount,
    onlineMembers: communityInfo.onlineCount,
};

export const mockCommunityUser = {
    uid: "mock-user-001",
    username: "SalokUser",
    displayName: "Salok User",
    initials: "SU",
    role: "Member",
};

export const communityPageData = {
    info: communityInfo,
    rules: communityRules,
    members: communityMembers,
    messages: communityMessages,
    summary: communitySummary,
    user: mockCommunityUser,
};