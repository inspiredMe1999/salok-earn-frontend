import {
    NavLink,
    useNavigate,
} from "react-router-dom";

import {
    Home,
    Coins,
    Brain,
    Trophy,
    Users,
    Wallet,
    Activity,
    Bell,
    MessageCircle,
    UserRound,
    Settings,
    X,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Lock,
} from "lucide-react";

import logo from "../../assets/brand/salok-earn-logo.png";

import "./Sidebar.css";

const navigation = [
    {
        label: "Home",
        path: "/dashboard",
        guestPath: "/",
        icon: Home,
        guestAccessible: true,
    },
    {
        label: "Earn",
        path: "/earn",
        icon: Coins,
        guestAccessible: true,
    },
    {
        label: "Trivia",
        path: "/trivia",
        icon: Brain,
        guestAccessible: true,
    },
    {
        label: "Wallet",
        path: "/wallet",
        icon: Wallet,
        guestAccessible: true,
    },
    {
        label: "Leaderboard",
        path: "/leaderboard",
        icon: Trophy,
    },
    {
        label: "Referrals",
        path: "/referrals",
        icon: Users,
    },
    {
        label: "Activity",
        path: "/activity",
        icon: Activity,
    },
    {
        label: "Notifications",
        path: "/notifications",
        icon: Bell,
    },
    {
        label: "Community",
        path: "/community",
        icon: MessageCircle,
    },
];

const secondaryNavigation = [
    {
        label: "Profile",
        path: "/profile",
        icon: UserRound,
    },
    {
        label: "Settings",
        path: "/settings",
        icon: Settings,
    },
];

function Sidebar({
    isOpen,
    isCollapsed,
    onClose,
    onToggleCollapse,
    isGuest = false,
}) {
    const navigate = useNavigate();

    const handleLockedClick = (
        event,
        path
    ) => {
        event.preventDefault();

        onClose?.();

        navigate("/login", {
            state: {
                from: path,
            },
        });
    };
    return (
        <aside
            className={`app-sidebar ${isOpen
                    ? "sidebar-open"
                    : ""
                } ${isCollapsed
                    ? "sidebar-is-collapsed"
                    : ""
                }`}
        >
            {/* =================================================
                BRAND
               ================================================= */}

            <div className="sidebar-brand">
                <NavLink
                    to="/dashboard"
                    className="sidebar-logo"
                    onClick={onClose}
                    title="Salok Earn"
                >
                    <img
                        src={logo}
                        alt="Salok Earn"
                    />
                </NavLink>

                <button
                    type="button"
                    className="sidebar-close"
                    onClick={onClose}
                    aria-label="Close navigation"
                >
                    <X size={20} />
                </button>
            </div>

            {/* =================================================
                NAVIGATION
               ================================================= */}

            <nav className="sidebar-navigation">
                <div className="sidebar-section">
                    <span className="sidebar-section-title">
                        MENU
                    </span>

                    <div className="sidebar-links">
                        {navigation.map(
                            (item) => {
                                const Icon =
                                    item.icon;

                                const locked =
                                    isGuest &&
                                    !item.guestAccessible;

                                const targetPath =
                                    isGuest &&
                                        item.guestPath
                                        ? item.guestPath
                                        : item.path;

                                return (
                                    <NavLink
                                        key={
                                            item.path
                                        }
                                        to={
                                            targetPath
                                        }
                                        onClick={(
                                            event
                                        ) =>
                                            locked
                                                ? handleLockedClick(
                                                    event,
                                                    item.path
                                                )
                                                : onClose?.()
                                        }
                                        title={
                                            isCollapsed
                                                ? item.label
                                                : undefined
                                        }
                                        className={({
                                            isActive,
                                        }) =>
                                            `sidebar-link ${isActive &&
                                                !locked
                                                ? "active"
                                                : ""
                                            } ${locked
                                                ? "sidebar-link-locked"
                                                : ""
                                            }`
                                        }
                                    >
                                        <Icon
                                            size={19}
                                            strokeWidth={
                                                2
                                            }
                                        />

                                        <span>
                                            {
                                                item.label
                                            }
                                        </span>

                                        {locked && (
                                            <Lock
                                                size={13}
                                                className="sidebar-link-lock-icon"
                                            />
                                        )}
                                    </NavLink>
                                );
                            }
                        )}
                    </div>
                </div>

                <div className="sidebar-section">
                    <span className="sidebar-section-title">
                        ACCOUNT
                    </span>

                    <div className="sidebar-links">
                        {secondaryNavigation.map(
                            (item) => {
                                const Icon =
                                    item.icon;

                                const locked =
                                    isGuest;

                                return (
                                    <NavLink
                                        key={
                                            item.path
                                        }
                                        to={
                                            item.path
                                        }
                                        onClick={(
                                            event
                                        ) =>
                                            locked
                                                ? handleLockedClick(
                                                    event,
                                                    item.path
                                                )
                                                : onClose?.()
                                        }
                                        title={
                                            isCollapsed
                                                ? item.label
                                                : undefined
                                        }
                                        className={({
                                            isActive,
                                        }) =>
                                            `sidebar-link ${isActive &&
                                                !locked
                                                ? "active"
                                                : ""
                                            } ${locked
                                                ? "sidebar-link-locked"
                                                : ""
                                            }`
                                        }
                                    >
                                        <Icon
                                            size={19}
                                            strokeWidth={
                                                2
                                            }
                                        />

                                        <span>
                                            {
                                                item.label
                                            }
                                        </span>

                                        {locked && (
                                            <Lock
                                                size={13}
                                                className="sidebar-link-lock-icon"
                                            />
                                        )}
                                    </NavLink>
                                );
                            }
                        )}
                    </div>
                </div>
            </nav>

            {/* =================================================
                BOTTOM AREA
               ================================================= */}

            <div className="sidebar-bottom">
                {isGuest ? (
                    <button
                        type="button"
                        className="sidebar-guest-cta"
                        title={
                            isCollapsed
                                ? "Sign up to start earning"
                                : undefined
                        }
                        onClick={() => {
                            onClose?.();

                            navigate(
                                "/signup"
                            );
                        }}
                    >
                        <div className="sidebar-earning-icon">
                            <Coins size={18} />
                        </div>

                        <div className="sidebar-earning-content">
                            <span>
                                You're browsing as a guest
                            </span>

                            <strong>
                                Sign up to start earning
                            </strong>
                        </div>
                    </button>
                ) : (
                    <div
                        className="sidebar-earning-card"
                        title={
                            isCollapsed
                                ? "Available balance: 1,250.75 SAK"
                                : undefined
                        }
                    >
                        <div className="sidebar-earning-icon">
                            <Coins size={18} />
                        </div>

                        <div className="sidebar-earning-content">
                            <span>
                                Available balance
                            </span>

                            <strong>
                                1,250.75 SAK
                            </strong>
                        </div>
                    </div>
                )}

                <button
                    type="button"
                    className="sidebar-collapse"
                    onClick={
                        onToggleCollapse
                    }
                    aria-label={
                        isCollapsed
                            ? "Expand sidebar"
                            : "Collapse sidebar"
                    }
                    title={
                        isCollapsed
                            ? "Expand menu"
                            : "Collapse menu"
                    }
                >
                    {isCollapsed ? (
                        <ChevronRight
                            size={17}
                        />
                    ) : (
                        <ChevronLeft
                            size={17}
                        />
                    )}

                    <span>
                        {isCollapsed
                            ? "Expand menu"
                            : "Collapse menu"}
                    </span>
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;