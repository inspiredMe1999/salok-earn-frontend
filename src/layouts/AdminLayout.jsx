import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";

import "../components/admin/AdminLayout.css";
import "../styles/admin-theme.css";

/*
|--------------------------------------------------------------------------
| Force dark mode for the admin section
|--------------------------------------------------------------------------
|
| The admin module intentionally ships with only one theme, regardless
| of whatever light/dark preference the signed-in person's own frontend
| account has stored. This reuses the exact same [data-theme] attribute
| and --color-* variables index.css already defines for the public
| site — it does not invent a second theme system — so it stays on
| whatever the person's real preference is for the rest of the app, and
| an admin light mode later is a small, additive change rather than a
| rewrite (see the comment at the top of admin-theme.css).
|--------------------------------------------------------------------------
*/

function useForceDarkAdminTheme() {
    useEffect(() => {
        const root = document.documentElement;
        const previousTheme = root.getAttribute("data-theme");

        root.setAttribute("data-theme", "dark");

        return () => {
            if (previousTheme) {
                root.setAttribute(
                    "data-theme",
                    previousTheme
                );
            } else {
                root.removeAttribute("data-theme");
            }
        };
    }, []);
}

function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useForceDarkAdminTheme();

    function openSidebar() {
        setSidebarOpen(true);
    }

    function closeSidebar() {
        setSidebarOpen(false);
    }

    return (
        <div className="admin-layout">
            <AdminSidebar
                isOpen={sidebarOpen}
                onClose={closeSidebar}
            />

            <div className="admin-main">
                <AdminHeader
                    onMenuClick={openSidebar}
                />

                <main className="admin-content">
                    <Outlet />
                </main>
            </div>

            {sidebarOpen && (
                <button
                    type="button"
                    className="admin-sidebar-overlay"
                    onClick={closeSidebar}
                    aria-label="Close admin sidebar"
                />
            )}
        </div>
    );
}

export default AdminLayout;