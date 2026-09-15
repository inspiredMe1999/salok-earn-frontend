import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    Link,
    useLocation,
    useNavigate,
} from "react-router-dom";

import {
    Menu,
    Bell,
    ChevronDown,
    UserRound,
    Settings,
    Wallet,
    LogOut,
} from "lucide-react";

import ThemeToggle from "../common/ThemeToggle";
import Button from "../common/Button";

import logo from "../../assets/brand/salok-earn-logo.png";

import {
    getCurrentUser,
    logout,
} from "../../services/mock/authService";

import "./Header.css";

const pageNames = {
    "/dashboard": "Dashboard",
    "/earn": "Earn",
    "/trivia": "Trivia",
    "/leaderboard": "Leaderboard",
    "/referrals": "Referrals",
    "/wallet": "Wallet",
    "/activity": "Activity",
    "/notifications": "Notifications",
    "/community": "Community",
    "/profile": "Profile",
    "/settings": "Settings",
};

function Header({
    onMenuClick,
    isGuest = false,
}) {
    const location = useLocation();
    const navigate = useNavigate();

    const profileMenuRef = useRef(null);

    const [profileOpen, setProfileOpen] =
        useState(false);

    const [user, setUser] = useState(
        () => getCurrentUser()
    );

    const currentPage =
        pageNames[location.pathname] ||
        "Salok Earn";

    /*
    |--------------------------------------------------------------------------
    | Refresh mock user information
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        setUser(getCurrentUser());
    }, [location.pathname]);

    /*
    |--------------------------------------------------------------------------
    | Close the profile menu on Escape
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const handleKeyboard = (event) => {
            if (event.key === "Escape") {
                setProfileOpen(false);
            }
        };

        window.addEventListener(
            "keydown",
            handleKeyboard
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyboard
            );
        };
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Close profile menu when clicking outside
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const handleOutsideClick = (
            event
        ) => {
            if (
                profileMenuRef.current &&
                !profileMenuRef.current.contains(
                    event.target
                )
            ) {
                setProfileOpen(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );
        };
    }, []);

    const handleLogout = async () => {
        await logout();

        setProfileOpen(false);

        navigate("/login");
    };

    const displayName =
        user?.displayName ||
        [
            user?.firstName,
            user?.lastName,
        ]
            .filter(Boolean)
            .join(" ") ||
        "Salok User";

    const firstLetter =
        displayName
            .charAt(0)
            .toUpperCase() || "S";

    return (
        <header className="app-header">
            {/* =================================================
                LEFT
               ================================================= */}

            <div className="header-left">
                <button
                    type="button"
                    className="mobile-menu-button"
                    onClick={onMenuClick}
                    aria-label="Open navigation"
                >
                    <Menu size={21} />
                </button>

                <div className="header-context">
                    <span>
                        Workspace
                    </span>

                    <strong>
                        {currentPage}
                    </strong>
                </div>

                <Link
                    to={
                        isGuest
                            ? "/"
                            : "/dashboard"
                    }
                    className="header-logo"
                    aria-label="Salok Earn — Home"
                >
                    <img
                        src={logo}
                        alt="Salok Earn"
                    />
                </Link>
            </div>

            {/* =================================================
                RIGHT
               ================================================= */}

            <div className="header-right">
                <ThemeToggle />

                {isGuest ? (
                    <>
                        <button
                            type="button"
                            className="header-signin"
                            onClick={() =>
                                navigate(
                                    "/login",
                                    {
                                        state: {
                                            from: location.pathname,
                                        },
                                    }
                                )
                            }
                        >
                            Sign in
                        </button>

                        <Button
                            size="small"
                            icon={false}
                            onClick={() =>
                                navigate(
                                    "/signup",
                                    {
                                        state: {
                                            from: location.pathname,
                                        },
                                    }
                                )
                            }
                        >
                            Get started
                        </Button>
                    </>
                ) : (
                    <>
                        <Link
                            to="/notifications"
                            className="header-icon-button notification-button"
                            aria-label="Notifications"
                        >
                            <Bell
                                size={19}
                                strokeWidth={2}
                            />

                            <span className="notification-dot" />
                        </Link>

                        <div className="header-divider" />

                        {/* ---------------------------------------------
                            Profile
                           --------------------------------------------- */}

                        <div
                            className="header-profile-wrapper"
                            ref={profileMenuRef}
                        >
                            <button
                                type="button"
                                className={`header-profile ${profileOpen
                                    ? "profile-open"
                                    : ""
                                    }`}
                                onClick={() =>
                                    setProfileOpen(
                                        (current) =>
                                            !current
                                    )
                                }
                                aria-expanded={
                                    profileOpen
                                }
                                aria-haspopup="menu"
                            >
                                <div className="header-avatar">
                                    {firstLetter}
                                </div>

                                <div className="header-user-info">
                                    <strong>
                                        {displayName}
                                    </strong>

                                    <span>
                                        Member
                                    </span>
                                </div>

                                <ChevronDown
                                    size={16}
                                    className={`header-profile-chevron ${profileOpen
                                        ? "chevron-open"
                                        : ""
                                        }`}
                                />
                            </button>

                            {profileOpen && (
                                <div
                                    className="profile-dropdown"
                                    role="menu"
                                >
                                    <div className="profile-dropdown-header">
                                        <div className="profile-dropdown-avatar">
                                            {firstLetter}
                                        </div>

                                        <div>
                                            <strong>
                                                {displayName}
                                            </strong>

                                            <span>
                                                {user?.email ||
                                                    "Member account"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="profile-dropdown-divider" />

                                    <Link
                                        to="/profile"
                                        className="profile-dropdown-item"
                                        onClick={() =>
                                            setProfileOpen(
                                                false
                                            )
                                        }
                                    >
                                        <UserRound
                                            size={17}
                                        />

                                        <span>
                                            Profile
                                        </span>
                                    </Link>

                                    <Link
                                        to="/wallet"
                                        className="profile-dropdown-item"
                                        onClick={() =>
                                            setProfileOpen(
                                                false
                                            )
                                        }
                                    >
                                        <Wallet
                                            size={17}
                                        />

                                        <span>
                                            Wallet
                                        </span>
                                    </Link>

                                    <Link
                                        to="/settings"
                                        className="profile-dropdown-item"
                                        onClick={() =>
                                            setProfileOpen(
                                                false
                                            )
                                        }
                                    >
                                        <Settings
                                            size={17}
                                        />

                                        <span>
                                            Settings
                                        </span>
                                    </Link>

                                    <div className="profile-dropdown-divider" />

                                    <button
                                        type="button"
                                        className="profile-dropdown-item logout-item"
                                        onClick={
                                            handleLogout
                                        }
                                    >
                                        <LogOut
                                            size={17}
                                        />

                                        <span>
                                            Sign out
                                        </span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </header>
    );
}

export default Header;