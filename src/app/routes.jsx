import {
    BrowserRouter,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";
import SignupPage from "../pages/auth/SignupPage";
import CompleteSignupPage from "../pages/auth/CompleteSignupPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";

import AppLayout from "../layouts/AppLayout";
import ProtectedRoute from "../components/auth/ProtectedRoute";

import { AuthGateProvider } from "../context/AuthGateContext";
import AuthGateModal from "../components/auth/AuthGateModal";
import FloatingChat from "../components/community/FloatingChat";

import HomePage from "../pages/user/HomePage";
import OffersPage from "../pages/user/OffersPage";
import DashboardPage from "../pages/user/DashboardPage";
import EarnPage from "../pages/user/EarnPage";
import TriviaPage from "../pages/user/TriviaPage";
import TriviaPlayPage from "../pages/user/TriviaPlayPage";
import TriviaResultPage from "../pages/user/TriviaResultPage";
import LeaderboardPage from "../pages/user/LeaderboardPage";
import ReferralsPage from "../pages/user/ReferralsPage";
import WalletGate from "../pages/user/WalletGate";
import WithdrawPage from "../pages/user/WithdrawPage";
import PayoutMethodsPage from "../pages/user/PayoutMethodsPage";
import WithdrawalsPage from "../pages/user/WithdrawalsPage";
import WithdrawalDetailsPage from "../pages/user/WithdrawalDetailsPage";
import ActivityPage from "../pages/user/ActivityPage";
import NotificationsPage from "../pages/user/NotificationsPage";
import CommunityPage from "../pages/user/CommunityPage";
import ProfilePage from "../pages/user/ProfilePage";
import SettingsPage from "../pages/user/SettingsPage";
import SecurityPage from "../pages/user/SecurityPage";

import AdminLoginPage from "../pages/auth/AdminLoginPage";
import AdminProtectedRoute from "../components/admin/AdminProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminUsersPage from "../pages/admin/AdminUsersPage";
import AdminUserDetailsPage from "../pages/admin/AdminUserDetailsPage";
import AdminWithdrawalsPage from "../pages/admin/AdminWithdrawalsPage";
import AdminEarningsPage from "../pages/admin/AdminEarningsPage";
import AdminTriviaPage from "../pages/admin/AdminTriviaPage";
import AdminCommunityPage from "../pages/admin/AdminCommunityPage";
import AdminReferralsPage from "../pages/admin/AdminReferralsPage";
import AdminNotificationsPage from "../pages/admin/AdminNotificationsPage";
import AdminSettingsPage from "../pages/admin/AdminSettingsPage";
import AdminTasksPage from "../pages/admin/AdminTasksPage";
import AdminDevicesPage from "../pages/admin/AdminDevicesPage";
import AdminBroadcastsPage from "../pages/admin/AdminBroadcastsPage";
import AdminAuditPage from "../pages/admin/AdminAuditPage";
import AdminSystemPage from "../pages/admin/AdminSystemPage";

function PlaceholderPage({
    title,
}) {
    return (
        <div
            style={{
                minHeight: "60vh",
                display: "grid",
                placeItems: "center",
                color: "var(--color-text)",
                fontFamily:
                    "var(--font-body)",
            }}
        >
            <div
                style={{
                    textAlign: "center",
                }}
            >
                <h1>{title}</h1>

                <p
                    style={{
                        color: "var(--color-text-muted)",
                    }}
                >
                    This page is coming next.
                </p>
            </div>
        </div>
    );
}

function GlobalFloatingChat() {
    const location = useLocation();

    const isAdminRoute =
        location.pathname === "/admin" ||
        location.pathname.startsWith("/admin/");

    if (isAdminRoute) {
        return null;
    }

    return <FloatingChat />;
}

export function AppRouter() {
    return (
        <BrowserRouter>
            <AuthGateProvider>
                <Routes>
                    {/* =================================================
                        AUTHENTICATION
                       ================================================= */}

                    <Route
                        path="/login"
                        element={
                            <LoginPage />
                        }
                    />

                    <Route
                        path="/signup"
                        element={
                            <SignupPage />
                        }
                    />

                    <Route
                        path="/signup/complete"
                        element={
                            <CompleteSignupPage />
                        }
                    />

                    <Route
                        path="/forgot-password"
                        element={
                            <ForgotPasswordPage />
                        }
                    />

                    {/* =================================================
                        APPLICATION SHELL
                        (Homepage + Offerwalls are open to guests too —
                        the pre-auth experience uses the same dashboard
                        shell as the real app instead of a separate
                        marketing page. See AppLayout for how the
                        sidebar/header adapt for guests.)
                       ================================================= */}

                    <Route
                        element={
                            <AppLayout />
                        }
                    >
                        {/* -----------------------------------------------
                            Guest-browsable — visitors can look around,
                            but any real action still requires an account.
                           ----------------------------------------------- */}

                        <Route
                            path="/"
                            element={
                                <HomePage />
                            }
                        />

                        <Route
                            path="/offerwalls"
                            element={
                                <OffersPage />
                            }
                        />

                        <Route
                            path="/earn"
                            element={
                                <EarnPage />
                            }
                        />

                        <Route
                            path="/trivia"
                            element={<TriviaPage />}
                        />

                        <Route
                            path="/wallet"
                            element={<WalletGate />}
                        />

                        {/* -----------------------------------------------
                            Members only — requires an authenticated session.
                           ----------------------------------------------- */}

                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <DashboardPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/earn/surveys"
                            element={
                                <ProtectedRoute>
                                    <PlaceholderPage
                                        title="Surveys"
                                    />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/earn/tasks"
                            element={
                                <ProtectedRoute>
                                    <PlaceholderPage
                                        title="Tasks"
                                    />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/earn/offers"
                            element={
                                <ProtectedRoute>
                                    <PlaceholderPage
                                        title="Offers"
                                    />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/earn/:id"
                            element={
                                <ProtectedRoute>
                                    <PlaceholderPage
                                        title="Earning Opportunity"
                                    />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/trivia/play/:sessionId"
                            element={
                                <ProtectedRoute>
                                    <TriviaPlayPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/trivia/result/:sessionId"
                            element={
                                <ProtectedRoute>
                                    <TriviaResultPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/leaderboard"
                            element={
                                <ProtectedRoute>
                                    <LeaderboardPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/referrals"
                            element={
                                <ProtectedRoute>
                                    <ReferralsPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/wallet/withdraw"
                            element={
                                <ProtectedRoute>
                                    <WithdrawPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/wallet/payout-methods"
                            element={
                                <ProtectedRoute>
                                    <PayoutMethodsPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/wallet/withdrawals"
                            element={
                                <ProtectedRoute>
                                    <WithdrawalsPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/wallet/withdrawals/:id"
                            element={
                                <ProtectedRoute>
                                    <WithdrawalDetailsPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/activity"
                            element={
                                <ProtectedRoute>
                                    <ActivityPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/notifications"
                            element={
                                <ProtectedRoute>
                                    <NotificationsPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/community"
                            element={
                                <ProtectedRoute>
                                    <CommunityPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <ProfilePage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/settings"
                            element={
                                <ProtectedRoute>
                                    <SettingsPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/security"
                            element={
                                <ProtectedRoute>
                                    <SecurityPage />
                                </ProtectedRoute>
                            }
                        />
                    </Route>

                    <Route
                        path="/admin/login"
                        element={<AdminLoginPage />}
                    />

                    <Route element={<AdminProtectedRoute />}>
                        <Route element={<AdminLayout />}>
                            <Route
                                path="/admin"
                                element={<AdminDashboardPage />}
                            />

                            <Route
                                path="/admin/users"
                                element={<AdminUsersPage />}
                            />
                            <Route
                                path="/admin/users/:uid"
                                element={<AdminUserDetailsPage />}
                            />
                            <Route
                                path="/admin/withdrawals"
                                element={<AdminWithdrawalsPage />}
                            />
                            <Route
                                path="/admin/earnings"
                                element={<AdminEarningsPage />}
                            />
                            <Route
                                path="/admin/trivia"
                                element={<AdminTriviaPage />}
                            />
                            <Route
                                path="/admin/community"
                                element={<AdminCommunityPage />}
                            />
                            <Route
                                path="/admin/referrals"
                                element={<AdminReferralsPage />}
                            />
                            <Route
                                path="/admin/notifications"
                                element={<AdminNotificationsPage />}
                            />
                            <Route
                                path="/admin/tasks"
                                element={<AdminTasksPage />}
                            />
                            <Route
                                path="/admin/devices"
                                element={<AdminDevicesPage />}
                            />
                            <Route
                                path="/admin/settings"
                                element={<AdminSettingsPage />}
                            />
                            <Route
                                path="/admin/broadcasts"
                                element={<AdminBroadcastsPage />}
                            />
                            <Route
                                path="/admin/audit"
                                element={<AdminAuditPage />}
                            />
                            <Route
                                path="/admin/system"
                                element={<AdminSystemPage />}
                            />
                        </Route>
                    </Route>
                </Routes>

                {/* -------------------------------------------------
                    Rendered on every route (landing, auth, and the
                    authenticated app alike) so the community chat is
                    always reachable. The component itself hides on
                    /community, where the full chat experience already
                    lives, and gates sending behind the shared account
                    gate (useAuthGate) rather than the app's own auth
                    check, so guests get the same modal used elsewhere.
                   ------------------------------------------------- */}

                <GlobalFloatingChat />

                <AuthGateModal />
            </AuthGateProvider>
        </BrowserRouter>
    );
}