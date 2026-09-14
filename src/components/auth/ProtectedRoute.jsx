import {
    Navigate,
    useLocation,
} from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import Loader from "../common/Loader";

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
            <Loader
                fullScreen
                size="lg"
                label="Checking your session..."
            />
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