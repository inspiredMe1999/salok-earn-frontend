import {
    Navigate,
    useLocation,
} from "react-router-dom";

import useAuth from "../../hooks/useAuth";

export default function ProtectedRoute({
    children,
}) {
    const {
        user,
        loading,
    } = useAuth();

    const location =
        useLocation();

    /*
     * While authentication is being
     * initialized, don't redirect yet.
     */
    if (loading) {
        return (
            <div className="auth-loading-screen">
                <div className="auth-loading-card">
                    <div className="auth-loading-spinner" />

                    <div>
                        <strong>
                            Salok Earn
                        </strong>

                        <span>
                            Checking your session...
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    /*
     * User is not authenticated.
     *
     * Send them to login and remember
     * the page they originally requested.
     */
    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location.pathname,
                }}
            />
        );
    }

    return children;
}