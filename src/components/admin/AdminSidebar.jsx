import {
    Activity,
    BarChart3,
    ClipboardList,
    FileText,
    Flag,
    LayoutDashboard,
    MonitorSmartphone,
    Settings,
    ShieldCheck,
    Users,
    Brain,
    Wallet,
    MessageSquare,
    Bell,
    Server,
    X,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import "./AdminLayout.css";

const adminNavigation = [
    {
        label: "Overview",
        path: "/admin",
        icon: LayoutDashboard,
    },
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
    {
        label: "Tasks",
        path: "/admin/tasks",
        icon: ClipboardList,
    },
    {
        label: "Trivia",
        icon: Brain,
        path: "/admin/trivia",
    },
    {
        label: "Community",
        icon: MessageSquare,
        path: "/admin/community",
    },
    {
        label: "Referrals",
        icon: Users,
        path: "/admin/referrals",
    },
    {
        label: "Notifications",
        icon: Bell,
        path: "/admin/notifications",
    },
    {
        label: "Broadcasts",
        path: "/admin/broadcasts",
        icon: FileText,
    },
    {
        label: "Audit Logs",
        path: "/admin/audit",
        icon: Activity,
    },
    {
        label: "Settings",
        icon: Settings,
        path: "/admin/settings",
    },
    {
        label: "System",
        path: "/admin/system",
        icon: Server,
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
                    <div className="admin-brand-icon">
                        <ShieldCheck size={22} />
                    </div>

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

            <div className="admin-sidebar-label">
                Management
            </div>

            <nav className="admin-navigation">
                {adminNavigation.map((item) => {
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