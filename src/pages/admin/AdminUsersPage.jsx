import { useEffect, useState } from "react";

import {
    Ban,
    CheckCircle2,
    Eye,
    Flag,
    RefreshCw,
    Search,
    ShieldAlert,
    UserCheck,
    Users,
} from "lucide-react";

import { Link } from "react-router-dom";
import { toast } from "sonner";

import adminService from "../../services/mock/adminService";

import "./admin-users.css";

function formatNumber(value) {
    return new Intl.NumberFormat("en-US").format(value);
}

function formatSAK(value) {
    return `${Number(value).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })} SAK`;
}

function formatDate(value) {
    if (!value) {
        return "—";
    }

    return new Date(value).toLocaleDateString(
        "en-US",
        {
            day: "numeric",
            month: "short",
            year: "numeric",
        }
    );
}

function getStatusLabel(status) {
    const labels = {
        active: "Active",
        suspended: "Suspended",
        flagged: "Flagged",
        pending: "Pending",
    };

    return labels[status] || status;
}

function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [regions, setRegions] = useState([]);

    const [summary, setSummary] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [status, setStatus] = useState("all");
    const [region, setRegion] = useState("All regions");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadUsers() {
        try {
            setLoading(true);
            setError("");

            const [
                usersResponse,
                summaryResponse,
                regionsResponse,
            ] = await Promise.all([
                adminService.getAdminUsers({
                    searchTerm,
                    status,
                    region,
                }),
                adminService.getAdminUserSummary(),
                adminService.getAdminUserRegions(),
            ]);

            if (!usersResponse.success) {
                throw new Error(
                    usersResponse.message ||
                        "Unable to load users."
                );
            }

            setUsers(usersResponse.data || []);
            setSummary(summaryResponse.data || null);
            setRegions(regionsResponse.data || []);
        } catch (err) {
            console.error(
                "Failed to load admin users:",
                err
            );

            setError(
                err.message ||
                    "Unable to load administrator users."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            loadUsers();
        }, 250);

        return () => clearTimeout(timer);
    }, [searchTerm, status, region]);

    async function handleStatusChange(uid, nextStatus) {
        const response =
            await adminService.updateAdminUserStatus(
                uid,
                nextStatus
            );

        if (!response.success) {
            toast.error(response.message);
            return;
        }

        toast.success(response.message);
        await loadUsers();
    }

    async function handleFlagToggle(uid) {
        const response =
            await adminService.toggleAdminUserFlag(uid);

        if (!response.success) {
            toast.error(response.message);
            return;
        }

        toast.success(response.message);
        await loadUsers();
    }

    function handleResetFilters() {
        setSearchTerm("");
        setStatus("all");
        setRegion("All regions");
    }

    return (
        <section className="admin-users-page">
            <div className="admin-users-header">
                <div>
                    <span className="admin-page-eyebrow">
                        Administration
                    </span>

                    <h2>User management</h2>

                    <p>
                        Search, review and manage platform
                        user accounts.
                    </p>
                </div>

                <div className="admin-users-header-actions">
                    <span className="admin-mock-badge">
                        Mock environment
                    </span>

                    <button
                        type="button"
                        className="admin-refresh-button"
                        onClick={loadUsers}
                    >
                        <RefreshCw size={17} />
                        Refresh
                    </button>
                </div>
            </div>

            {summary && (
                <div className="admin-user-summary-grid">
                    <SummaryCard
                        icon={<Users size={20} />}
                        label="Total users"
                        value={formatNumber(
                            summary.totalUsers
                        )}
                    />

                    <SummaryCard
                        icon={<UserCheck size={20} />}
                        label="Active users"
                        value={formatNumber(
                            summary.activeUsers
                        )}
                    />

                    <SummaryCard
                        icon={<Ban size={20} />}
                        label="Suspended users"
                        value={formatNumber(
                            summary.suspendedUsers
                        )}
                    />

                    <SummaryCard
                        icon={<ShieldAlert size={20} />}
                        label="Flagged accounts"
                        value={formatNumber(
                            summary.flaggedUsers
                        )}
                    />
                </div>
            )}

            <div className="admin-users-toolbar">
                <div className="admin-user-search">
                    <Search size={18} />

                    <input
                        type="search"
                        placeholder="Search by name, username, email or UID..."
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(
                                event.target.value
                            )
                        }
                    />
                </div>

                <div className="admin-user-filters">
                    <select
                        value={status}
                        onChange={(event) =>
                            setStatus(event.target.value)
                        }
                    >
                        <option value="all">
                            All statuses
                        </option>
                        <option value="active">
                            Active
                        </option>
                        <option value="suspended">
                            Suspended
                        </option>
                        <option value="flagged">
                            Flagged
                        </option>
                        <option value="pending">
                            Pending
                        </option>
                    </select>

                    <select
                        value={region}
                        onChange={(event) =>
                            setRegion(event.target.value)
                        }
                    >
                        {regions.map((item) => (
                            <option
                                key={item}
                                value={item}
                            >
                                {item}
                            </option>
                        ))}
                    </select>

                    <button
                        type="button"
                        className="admin-reset-filter-button"
                        onClick={handleResetFilters}
                    >
                        Reset
                    </button>
                </div>
            </div>

            <div className="admin-users-panel">
                <div className="admin-panel-heading">
                    <div>
                        <h3>Platform users</h3>

                        <p>
                            {users.length} matching account
                            {users.length === 1
                                ? ""
                                : "s"}
                        </p>
                    </div>
                </div>

                {loading && (
                    <div className="admin-users-state">
                        <div className="admin-users-spinner" />
                        Loading users...
                    </div>
                )}

                {!loading && error && (
                    <div className="admin-users-state error">
                        <ShieldAlert size={22} />
                        <p>{error}</p>

                        <button
                            type="button"
                            onClick={loadUsers}
                        >
                            Try again
                        </button>
                    </div>
                )}

                {!loading &&
                    !error &&
                    users.length === 0 && (
                        <div className="admin-users-state">
                            <Users size={28} />

                            <h4>
                                No users found
                            </h4>

                            <p>
                                Try changing your search or
                                filter settings.
                            </p>
                        </div>
                    )}

                {!loading &&
                    !error &&
                    users.length > 0 && (
                        <div className="admin-users-table-wrapper">
                            <table className="admin-users-table">
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Status</th>
                                        <th>Region</th>
                                        <th>Balance</th>
                                        <th>Activities</th>
                                        <th>Joined</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.uid}>
                                            <td>
                                                <div className="admin-table-user">
                                                    <div className="admin-table-avatar">
                                                        {user.initials}
                                                    </div>

                                                    <div>
                                                        <strong>
                                                            {user.displayName}
                                                        </strong>

                                                        <span>
                                                            @{user.username}
                                                        </span>

                                                        <small>
                                                            {user.email}
                                                        </small>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                <span
                                                    className={`admin-user-status ${user.status}`}
                                                >
                                                    {getStatusLabel(
                                                        user.status
                                                    )}
                                                </span>
                                            </td>

                                            <td>
                                                <span className="admin-region-cell">
                                                    {user.countryCode}
                                                    <small>
                                                        {user.region}
                                                    </small>
                                                </span>
                                            </td>

                                            <td>
                                                <strong className="admin-balance-cell">
                                                    {formatSAK(
                                                        user.balance
                                                    )}
                                                </strong>
                                            </td>

                                            <td>
                                                <span className="admin-activity-cell">
                                                    {formatNumber(
                                                        user.activities
                                                    )}
                                                </span>
                                            </td>

                                            <td>
                                                <span className="admin-date-cell">
                                                    {formatDate(
                                                        user.joinedAt
                                                    )}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="admin-user-actions">
                                                    <Link
                                                        to={`/admin/users/${user.uid}`}
                                                        className="admin-table-action view"
                                                        title="View user"
                                                    >
                                                        <Eye size={16} />
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        className="admin-table-action"
                                                        title={
                                                            user.status ===
                                                            "suspended"
                                                                ? "Activate user"
                                                                : "Suspend user"
                                                        }
                                                        onClick={() =>
                                                            handleStatusChange(
                                                                user.uid,
                                                                user.status ===
                                                                    "suspended"
                                                                    ? "active"
                                                                    : "suspended"
                                                            )
                                                        }
                                                    >
                                                        {user.status ===
                                                        "suspended" ? (
                                                            <CheckCircle2
                                                                size={16}
                                                            />
                                                        ) : (
                                                            <Ban
                                                                size={16}
                                                            />
                                                        )}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className={`admin-table-action ${
                                                            user.flags > 0
                                                                ? "flagged"
                                                                : ""
                                                        }`}
                                                        title="Toggle account flag"
                                                        onClick={() =>
                                                            handleFlagToggle(
                                                                user.uid
                                                            )
                                                        }
                                                    >
                                                        <Flag size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
            </div>
        </section>
    );
}

function SummaryCard({
    icon,
    label,
    value,
}) {
    return (
        <div className="admin-user-summary-card">
            <div className="admin-summary-icon">
                {icon}
            </div>

            <div>
                <span>{label}</span>
                <strong>{value}</strong>
            </div>
        </div>
    );
}

export default AdminUsersPage;