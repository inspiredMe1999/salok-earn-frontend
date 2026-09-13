import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import {
    getCurrentUser,
    login as mockLogin,
    logout as mockLogout,
} from "../services/mock/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    /*
     * Check whether a mock user already exists
     * when the application first loads.
     */
    useEffect(() => {
        const initializeAuth = () => {
            try {
                const currentUser =
                    getCurrentUser();

                setUser(currentUser);
            } catch (error) {
                console.error(
                    "Unable to initialize authentication:",
                    error
                );

                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    /*
     * Login
     */
    const login = async (
        email,
        password
    ) => {
        const authenticatedUser =
            await mockLogin(
                email,
                password
            );

        setUser(authenticatedUser);

        return authenticatedUser;
    };

    /*
     * Logout
     */
    const logout = async () => {
        await mockLogout();

        setUser(null);
    };

    /*
     * Refresh the current user from storage.
     */
    const refreshUser = () => {
        const currentUser =
            getCurrentUser();

        setUser(currentUser);

        return currentUser;
    };

    const value = {
        user,
        loading,
        isAuthenticated: Boolean(user),
        login,
        logout,
        refreshUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context =
        useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside an AuthProvider"
        );
    }

    return context;
}