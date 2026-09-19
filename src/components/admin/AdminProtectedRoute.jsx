import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

import adminAuthService from "../../services/mock/adminAuthService";

function AdminProtectedRoute() {
    const [loading, setLoading] = useState(true);
    const [admin, setAdmin] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function checkAdmin() {
            const response =
                await adminAuthService.getCurrentAdmin();

            if (!isMounted) {
                return;
            }

            setAdmin(response.data);
            setLoading(false);
        }

        checkAdmin();

        return () => {
            isMounted = false;
        };
    }, []);

    if (loading) {
        return (
            <div className="admin-route-loading">
                Checking administrator access...
            </div>
        );
    }

    if (!admin || admin.role !== "admin") {
        return (
            <Navigate
                to="/admin/login"
                replace
            />
        );
    }

    return <Outlet />;
}

export default AdminProtectedRoute;