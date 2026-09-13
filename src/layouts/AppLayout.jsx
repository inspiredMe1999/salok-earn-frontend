import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import useAuth from "../hooks/useAuth";

import "./AppLayout.css";

function AppLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    /*
    |--------------------------------------------------------------------------
    | Guest visitors can reach a handful of pages inside this layout
    | (Earn, Trivia, Wallet) without being signed in. When that's the
    | case the sidebar and header switch to a lighter, "browsing"
    | version that nudges toward creating an account instead of
    | assuming a signed-in member.
    |--------------------------------------------------------------------------
    */

    const {
        isAuthenticated,
        loading: authLoading,
    } = useAuth();

    const isGuest =
        !authLoading && !isAuthenticated;

    /*
    |--------------------------------------------------------------------------
    | Close mobile sidebar when screen becomes desktop-sized
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setSidebarOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener(
                "resize",
                handleResize
            );
        };
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Prevent background scrolling while mobile sidebar is open
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (sidebarOpen && window.innerWidth <= 768) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [sidebarOpen]);

    const toggleSidebar = () => {
        setSidebarOpen((current) => !current);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    const toggleSidebarCollapse = () => {
        setSidebarCollapsed((current) => !current);
    };

    return (
        <div
            className={`app-layout ${sidebarCollapsed
                ? "sidebar-collapsed"
                : ""
                }`}
        >
            <Sidebar
                isOpen={sidebarOpen}
                isCollapsed={sidebarCollapsed}
                onClose={closeSidebar}
                onToggleCollapse={
                    toggleSidebarCollapse
                }
                isGuest={isGuest}
            />

            <div className="app-main">
                <Header
                    onMenuClick={toggleSidebar}
                    isGuest={isGuest}
                />

                <main className="app-content">
                    <div className="app-content-inner">
                        <Outlet
                            context={{
                                isGuest,
                            }}
                        />
                    </div>
                </main>
            </div>

            {sidebarOpen && (
                <button
                    type="button"
                    className="sidebar-overlay"
                    onClick={closeSidebar}
                    aria-label="Close navigation"
                />
            )}
        </div>
    );
}

export default AppLayout;