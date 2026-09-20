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
    Users,
    Wallet,
    X,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import logo from "../../assets/brand/salok-earn-logo.png";

import "./AdminLayout.css";

/*
|--------------------------------------------------------------------------
| Navigation groups
|--------------------------------------------------------------------------
|
| Grouped so a 14-item list reads as a handful of short, scannable
| sections instead of one long undifferentiated list — this also makes
| the sidebar naturally scrollable in chunks on short/mobile viewports.
|
*/

const adminNavigation = [
    {
        section: "Menu",
        items: [
            {
                label: "Overview",
                path: "/admin",
                icon: LayoutDashboard,
            },
        ],
    },
    {
        section: "Management",
        items: [
            {
                label: "Users",
                path: "/admin/users",
                icon: Users,
            },
            {
                label: "Devices & Fraud",
                path: "/admin/devices",
                icon: MonitorSmartphone,
            },
            {
                label: "Withdrawals",
                path: "/admin/withdrawals",
                icon: Wallet,
            },
            {
                label: "Earnings",
                path: "/admin/earnings",
                icon: BarChart3,
            },
        ],
    },
    {
        section: "Engagement",
        items: [
            {
                label: "Tasks",
                path: "/admin/tasks",
                icon: ClipboardList,
            },
            {
                label: "Trivia",
                path: "/admin/trivia",
                icon: Brain,
            },
            {
                label: "Community",
                path: "/admin/community",
                icon: MessageSquare,
            },
            {
                label: "Referrals",
                path: "/admin/referrals",
                icon: Users,
            },
        ],
    },
    {
        section: "Communications",
        items: [
            {
                label: "Notifications",
                path: "/admin/notifications",
                icon: Bell,
            },
            {
                label: "Broadcasts",
                path: "/admin/broadcasts",
                icon: FileText,
            },
        ],
    },
    {
        section: "System",
        items: [
            {
                label: "Audit Logs",
                path: "/admin/audit",
                icon: Activity,
            },
            {
                label: "Settings",
                path: "/admin/settings",
                icon: Settings,
            },
            {
                label: "System",
                path: "/admin/system",
                icon: Server,
            },
        ],
    },
];

function AdminSidebar({ isOpen, onClose }) {
    return (
        <aside
            className={`admin-sidebar ${isOpen ? "is-open" : ""
                }`}
        >
            <div className="admin-sidebar-header">
                <div className="admin-brand">
                    <img
                        src={logo}
                        alt="Salok Earn"
                        className="admin-brand-icon"
                    />

                    <div>
                        <strong>Salok Earn</strong>
                        <span>Administration</span>
                    </div>
                </div>

                <button
                    type="button"
                    className="admin-close-button"
                    onClick={onClose}
                    aria-label="Close admin navigation"
                >
                    <X size={20} />
                </button>
            </div>

            {/* -------------------------------------------------
                Only this region scrolls — the brand header above
                and the security badge below stay put, so a long
                nav list never gets clipped on short viewports.
               ------------------------------------------------- */}

            <div className="admin-sidebar-scroll">
                {adminNavigation.map((group) => (
                    <div
                        className="admin-nav-group"
                        key={group.section}
                    >
                        <div className="admin-sidebar-label">
                            {group.section}
                        </div>

                        <nav className="admin-navigation">
                            {group.items.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        end={item.path === "/admin"}
                                        onClick={onClose}
                                        className={({ isActive }) =>
                                            `admin-nav-link ${isActive
                                                ? "active"
                                                : ""
                                            }`
                                        }
                                    >
                                        <Icon size={18} />
                                        <span>{item.label}</span>
                                    </NavLink>
                                );
                            })}
                        </nav>
                    </div>
                ))}
            </div>

            <div className="admin-sidebar-footer">
                <div className="admin-security-badge">
                    <ShieldCheck size={18} />

                    <div>
                        <strong>Protected area</strong>
                        <span>Administrator access</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default AdminSidebar;