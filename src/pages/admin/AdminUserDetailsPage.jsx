import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import {
    Activity,
    ArrowLeft,
    Ban,
    CheckCircle2,
    ChevronRight,
    CircleDollarSign,
    Flag,
    Mail,
    MapPin,
    MonitorSmartphone,
    ShieldAlert,
    UserCheck,
    Users,
    Wallet,
} from "lucide-react";

import adminService from "../../services/mock/adminService";

import "./admin-user-details.css";

function formatSAK(value) {
    return `${Number(value || 0).toLocaleString(
        "en-US",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }
    )} SAK`;
}

function formatNumber(value) {
    return Number(value || 0).toLocaleString("en-US");
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

function AdminUserDetailsPage() {
    const { uid } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadUser() {
        try {
            setLoading(true);
            setError("");

            const response =
                await adminService.getAdminUser(uid);

            if (!response.success) {
                throw new Error(
                    response.message ||
                        "Unable to load user details."
                );
            }

            setUser(response.data);
        } catch (err) {
            console.error(
                "Failed to load admin user:",
                err
            );

            setError(
                err.message ||
                    "Unable to load user details."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadUser();
    }, [uid]);

    async function handleStatusChange(nextStatus) {
        if (!user) {
            return;
        }

        const response =
            await adminService.updateAdminUserStatus(
                user.uid,
                nextStatus
            );

        if (!response.success) {
            toast.error(response.message);
            return;
        }

        setUser(response.data);
        toast.success(response.message);
    }

    async function handleFlagToggle() {
        if (!user) {
            return;
        }

        const response =
            await adminService.toggleAdminUserFlag(
                user.uid
            );

        if (!response.success) {
            toast.error(response.message);
            return;
        }

        setUser(response.data);
        toast.success(response.message);
    }

    if (loading) {
        return (
            <div className="admin-user-details-state">
                <div className="admin-details-spinner" />
                Loading user details...
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="admin-user-details-state error">
                <ShieldAlert size={28} />

                <h3>
                    Unable to load this account
                </h3>

                <p>
                    {error ||
                        "The requested user does not exist."}
                </p>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/admin/users")
                    }
                >
                    Return to users
                </button>
            </div>
        );
    }

    const isSuspended = user.status === "suspended";

    return (
        <section className="admin-user-details-page">
            <div className="admin-details-topbar">
                <Link
                    to="/admin/users"
                    className="admin-back-link"
                >
                    <ArrowLeft size={17} />
                    Back to users
                </Link>

                <span className="admin-mock-badge">
                    Mock environment
                </span>
            </div>

            <div className="admin-details-heading">
                <div>
                    <span className="admin-page-eyebrow">
                        User management
                    </span>

                    <h2>User details</h2>

                    <p>
                        Review account information and
                        administrative controls.
                    </p>
                </div>

                <div className="admin-details-actions">
                    <button
                        type="button"
                        className="admin-detail-action secondary"
                        onClick={handleFlagToggle}
                    >
                        <Flag size={17} />
                        {user.flags > 0
                            ? "Remove flag"
                            : "Flag account"}
                    </button>

                    <button
                        type="button"
                        className={`admin-detail-action ${
                            isSuspended
                                ? "activate"
                                : "suspend"
                        }`}
                        onClick={() =>
                            handleStatusChange(
                                isSuspended
                                    ? "active"
                                    : "suspended"
                            )
                        }
                    >
                        {isSuspended ? (
                            <CheckCircle2 size={17} />
                        ) : (
                            <Ban size={17} />
                        )}

                        {isSuspended
                            ? "Activate account"
                            : "Suspend account"}
                    </button>
                </div>
            </div>

            <div className="admin-user-profile-card">
                <div className="admin-large-avatar">
                    {user.initials}
                </div>

                <div className="admin-profile-main">
                    <div className="admin-profile-name-row">
                        <h3>{user.displayName}</h3>

                        <span
                            className={`admin-user-status ${user.status}`}
                        >
                            {getStatusLabel(user.status)}
                        </span>
                    </div>

                    <p>@{user.username}</p>

                    <div className="admin-profile-meta">
                        <span>
                            <Mail size={15} />
                            {user.email}
                        </span>

                        <span>
                            <MapPin size={15} />
                            {user.region}
                        </span>

                        <span>
                            <UserCheck size={15} />
                            Joined {formatDate(user.joinedAt)}
                        </span>
                    </div>
                </div>

                <div className="admin-profile-id">
                    <span>User ID</span>
                    <strong>{user.uid}</strong>
                </div>
            </div>

            <div className="admin-detail-stat-grid">
                <DetailStat
                    icon={<Wallet size={20} />}
                    label="Current balance"
                    value={formatSAK(user.balance)}
                />

                <DetailStat
                    icon={<CircleDollarSign size={20} />}
                    label="Total earned"
                    value={formatSAK(user.totalEarned)}
                />

                <DetailStat
                    icon={<ArrowLeft size={20} />}
                    label="Total withdrawn"
                    value={formatSAK(user.totalWithdrawn)}
                />

                <DetailStat
                    icon={<Activity size={20} />}
                    label="Activities"
                    value={formatNumber(user.activities)}
                />
            </div>

            <div className="admin-details-content-grid">
                <div className="admin-details-column">
                    <DetailsCard
                        title="Account information"
                        icon={<Users size={18} />}
                    >
                        <InfoRow
                            label="Username"
                            value={`@${user.username}`}
                        />

                        <InfoRow
                            label="Email address"
                            value={user.email}
                        />

                        <InfoRow
                            label="Account role"
                            value={user.role}
                        />

                        <InfoRow
                            label="Account status"
                            value={getStatusLabel(
                                user.status
                            )}
                        />

                        <InfoRow
                            label="Country"
                            value={`${user.region} (${user.countryCode})`}
                        />

                        <InfoRow
                            label="Joined date"
                            value={formatDate(user.joinedAt)}
                        />

                        <InfoRow
                            label="Last active"
                            value={formatDate(
                                user.lastActiveAt
                            )}
                        />
                    </DetailsCard>

                    <DetailsCard
                        title="Earning and activity overview"
                        icon={<Activity size={18} />}
                    >
                        <InfoRow
                            label="Completed activities"
                            value={formatNumber(
                                user.activities
                            )}
                        />

                        <InfoRow
                            label="Total referrals"
                            value={formatNumber(
                                user.referrals
                            )}
                        />

                        <InfoRow
                            label="Successful referrals"
                            value={formatNumber(
                                Math.floor(
                                    user.referrals * 0.67
                                )
                            )}
                        />

                        <InfoRow
                            label="Total earned"
                            value={formatSAK(
                                user.totalEarned
                            )}
                        />

                        <InfoRow
                            label="Total withdrawn"
                            value={formatSAK(
                                user.totalWithdrawn
                            )}
                        />
                    </DetailsCard>
                </div>

                <div className="admin-details-column">
                    <DetailsCard
                        title="Security and devices"
                        icon={<MonitorSmartphone size={18} />}
                    >
                        <InfoRow
                            label="Registered devices"
                            value={formatNumber(
                                user.deviceCount
                            )}
                        />

                        <InfoRow
                            label="Account flags"
                            value={formatNumber(
                                user.flags
                            )}
                        />

                        <InfoRow
                            label="Security status"
                            value={
                                user.flags > 0
                                    ? "Requires review"
                                    : "No active flags"
                            }
                        />

                        <InfoRow
                            label="Last activity"
                            value={formatDate(
                                user.lastActiveAt
                            )}
                        />

                        <div className="admin-security-notice">
                            <ShieldAlert size={18} />

                            <p>
                                Device history, multi-account
                                checks and fraud signals will
                                be connected to the backend
                                during Firebase integration.
                            </p>
                        </div>
                    </DetailsCard>

                    <DetailsCard
                        title="Administrative actions"
                        icon={<ShieldAlert size={18} />}
                    >
                        <button
                            type="button"
                            className="admin-wide-action"
                            onClick={() =>
                                handleStatusChange(
                                    isSuspended
                                        ? "active"
                                        : "suspended"
                                )
                            }
                        >
                            {isSuspended
                                ? "Restore account access"
                                : "Suspend account access"}

                            <ChevronRight size={17} />
                        </button>

                        <button
                            type="button"
                            className="admin-wide-action"
                            onClick={handleFlagToggle}
                        >
                            {user.flags > 0
                                ? "Clear account flags"
                                : "Mark account for review"}

                            <ChevronRight size={17} />
                        </button>

                        <Link
                            to="/admin/audit"
                            className="admin-wide-action"
                        >
                            View audit records
                            <ChevronRight size={17} />
                        </Link>
                    </DetailsCard>
                </div>
            </div>
        </section>
    );
}

function DetailStat({ icon, label, value }) {
    return (
        <div className="admin-detail-stat">
            <div className="admin-detail-stat-icon">
                {icon}
            </div>

            <span>{label}</span>
            <strong>{value}</strong>
        </div>
    );
}

function DetailsCard({ title, icon, children }) {
    return (
        <div className="admin-details-card">
            <div className="admin-details-card-heading">
                {icon}
                <h3>{title}</h3>
            </div>

            <div className="admin-details-card-body">
                {children}
            </div>
        </div>
    );
}

function InfoRow({ label, value }) {
    return (
        <div className="admin-info-row">
            <span>{label}</span>
            <strong>{value || "—"}</strong>
        </div>
    );
}

export default AdminUserDetailsPage;