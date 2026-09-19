import {
    Bell,
    ChevronDown,
    LogOut,
    Menu,
    ShieldCheck,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

import adminAuthService from "../../services/mock/adminAuthService";

import "./AdminLayout.css";

function AdminHeader({ onMenuClick }) {
    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);

    async function handleLogout() {
        await adminAuthService.adminLogout();

        toast.success("Administrator logged out.");

        navigate("/admin/login", {
            replace: true,
        });
    }

    return (
        <header className="admin-header">
            <div className="admin-header-left">
                <button
                    type="button"
                    className="admin-menu-button"
                    onClick={onMenuClick}
                    aria-label="Open admin navigation"
                >
                    <Menu size={21} />
                </button>

                <div>
                    <span className="admin-header-label">
                        Control center
                    </span>

                    <h1>Administration</h1>
                </div>
            </div>

            <div className="admin-header-actions">
                <button
                    type="button"
                    className="admin-icon-button"
                    aria-label="Notifications"
                    onClick={() =>
                        toast.info(
                            "Admin notifications are currently mocked."
                        )
                    }
                >
                    <Bell size={19} />
                    <span className="admin-notification-dot" />
                </button>

                <div className="admin-user-menu">
                    <button
                        type="button"
                        className="admin-user-trigger"
                        onClick={() =>
                            setMenuOpen((current) => !current)
                        }
                    >
                        <span className="admin-user-avatar">
                            SA
                        </span>

                        <span className="admin-user-details">
                            <strong>Salok Admin</strong>
                            <small>Administrator</small>
                        </span>

                        <ChevronDown size={16} />
                    </button>

                    {menuOpen && (
                        <div className="admin-user-dropdown">
                            <div className="admin-dropdown-heading">
                                <ShieldCheck size={17} />
                                Mock administrator
                            </div>

                            <button
                                type="button"
                                onClick={handleLogout}
                            >
                                <LogOut size={17} />
                                Sign out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default AdminHeader;