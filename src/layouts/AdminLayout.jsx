import { useState } from "react";
import { Outlet } from "react-router-dom";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";

import "../components/admin/AdminLayout.css";

function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

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