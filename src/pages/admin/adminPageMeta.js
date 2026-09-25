import {
    Activity,
    BarChart3,
    Bell,
    Brain,
    ClipboardList,
    FileText,
    LayoutDashboard,
    MessageSquare,
    MonitorSmartphone,
    Server,
    Settings,
    ShieldCheck,
    UserCog,
    Users,
    Wallet,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| Admin page meta
|--------------------------------------------------------------------------
|
| The single source of truth for what the topbar shows on each admin
| page. Before this existed, every page rendered its own header block
| with its own markup, spacing and wording — this is why they all
| looked different. Now AdminHeader reads from here, so every page's
| header is pixel-identical in structure and only the content changes.
|
| Add a new admin route? Add one entry here and the topbar handles the
| rest — no per-page header markup needed.
|
*/

const ADMIN_PAGE_META = [
    {
        path: "/admin",
        exact: true,
        label: "Control center",
        title: "Overview",
        description:
            "A real-time snapshot of platform activity, revenue and growth.",
        icon: LayoutDashboard,
    },
    {
        path: "/admin/users",
        exact: true,
        label: "Management",
        title: "Users",
        description:
            "Search, review and manage every member account.",
        icon: Users,
    },
    {
        path: "/admin/users/",
        label: "Management",
        title: "User details",
        description:
            "Full profile, activity and moderation history for this member.",
        icon: UserCog,
    },
    {
        path: "/admin/devices",
        label: "Management",
        title: "Devices & Fraud",
        description:
            "Monitor device fingerprints and investigate suspicious activity.",
        icon: MonitorSmartphone,
    },
    {
        path: "/admin/withdrawals",
        label: "Management",
        title: "Withdrawals",
        description:
            "Review, approve and track member payout requests.",
        icon: Wallet,
    },
    {
        path: "/admin/earnings",
        label: "Management",
        title: "Earnings",
        description:
            "Platform revenue, payouts and financial performance.",
        icon: BarChart3,
    },
    {
        path: "/admin/tasks",
        label: "Engagement",
        title: "Tasks",
        description:
            "Manage the earning tasks members complete for rewards.",
        icon: ClipboardList,
    },
    {
        path: "/admin/trivia",
        label: "Engagement",
        title: "Trivia",
        description:
            "Manage trivia questions, categories and rounds.",
        icon: Brain,
    },
    {
        path: "/admin/community",
        label: "Engagement",
        title: "Community",
        description:
            "Moderate community chat and member interactions.",
        icon: MessageSquare,
    },
    {
        path: "/admin/referrals",
        label: "Engagement",
        title: "Referrals",
        description:
            "Track referral performance and reward payouts.",
        icon: Users,
    },
    {
        path: "/admin/notifications",
        label: "Communications",
        title: "Notifications",
        description:
            "Compose and manage platform notifications.",
        icon: Bell,
    },
    {
        path: "/admin/broadcasts",
        label: "Communications",
        title: "Broadcasts",
        description:
            "Send announcements to members platform-wide.",
        icon: FileText,
    },
    {
        path: "/admin/audit",
        label: "System",
        title: "Audit Logs",
        description:
            "A complete trail of administrator actions.",
        icon: Activity,
    },
    {
        path: "/admin/settings",
        label: "System",
        title: "Settings",
        description:
            "Configure platform-wide rules and preferences.",
        icon: Settings,
    },
    {
        path: "/admin/system",
        label: "System",
        title: "System",
        description:
            "Monitor system health, uptime and performance.",
        icon: Server,
    },
];

const DEFAULT_ADMIN_PAGE_META = {
    label: "Control center",
    title: "Administration",
    description: "",
    icon: ShieldCheck,
};

/*
|--------------------------------------------------------------------------
| Resolver
|--------------------------------------------------------------------------
|
| Exact-match entries win first; longest-prefix entries (like the user
| details drill-down) are checked next so "/admin/users/abc123" doesn't
| accidentally match the "/admin/users" list page.
|
*/

export function getAdminPageMeta(pathname) {
    const exactMatch = ADMIN_PAGE_META.find(
        (entry) => entry.exact && entry.path === pathname
    );

    if (exactMatch) {
        return exactMatch;
    }

    const prefixMatches = ADMIN_PAGE_META
        .filter(
            (entry) =>
                !entry.exact && pathname.startsWith(entry.path)
        )
        .sort((a, b) => b.path.length - a.path.length);

    if (prefixMatches.length > 0) {
        return prefixMatches[0];
    }

    return DEFAULT_ADMIN_PAGE_META;
}

export default ADMIN_PAGE_META;
