import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";

import { useLocation, useNavigate } from "react-router-dom";

/*
|--------------------------------------------------------------------------
| Auth Gate Context
|--------------------------------------------------------------------------
|
| A single, app-wide way to intercept an unauthenticated visitor's click
| on anything that requires an account — starting a trivia round, opening
| an offer, tapping a locked sidebar link, and so on.
|
| Call `openAuthGate()` from anywhere with `useAuthGate()`. It shows a
| sign-in / registration modal instead of immediately redirecting away,
| so guests never lose the page they were exploring. The modal itself
| still uses the existing /login and /signup pages under the hood — it
| just adds a lightweight barrier in front of them.
|
|--------------------------------------------------------------------------
*/

const AuthGateContext = createContext(null);

export function AuthGateProvider({ children }) {
    const navigate = useNavigate();
    const location = useLocation();

    const [gate, setGate] = useState(null);
    /*
     * gate shape when open:
     * {
     *   title?: string,
     *   message?: string,
     *   redirectTo?: string,
     * }
     * null when closed.
     */

    const openAuthGate = useCallback(
        (options = {}) => {
            setGate({
                title:
                    options.title ||
                    "Create a free account to continue",
                message:
                    options.message ||
                    "Sign up in seconds to unlock this and start earning for real.",
                redirectTo:
                    options.redirectTo ||
                    location.pathname,
            });
        },
        [location.pathname]
    );

    const closeAuthGate = useCallback(() => {
        setGate(null);
    }, []);

    const goToSignup = useCallback(() => {
        const redirectTo = gate?.redirectTo || location.pathname;

        setGate(null);

        navigate("/signup", {
            state: {
                from: redirectTo,
            },
        });
    }, [gate, location.pathname, navigate]);

    const goToLogin = useCallback(() => {
        const redirectTo = gate?.redirectTo || location.pathname;

        setGate(null);

        navigate("/login", {
            state: {
                from: redirectTo,
            },
        });
    }, [gate, location.pathname, navigate]);

    const value = useMemo(
        () => ({
            gate,
            isOpen: Boolean(gate),
            openAuthGate,
            closeAuthGate,
            goToSignup,
            goToLogin,
        }),
        [gate, openAuthGate, closeAuthGate, goToSignup, goToLogin]
    );

    return (
        <AuthGateContext.Provider value={value}>
            {children}
        </AuthGateContext.Provider>
    );
}

export function useAuthGate() {
    const context = useContext(AuthGateContext);

    if (!context) {
        throw new Error(
            "useAuthGate must be used within an AuthGateProvider."
        );
    }

    return context;
}