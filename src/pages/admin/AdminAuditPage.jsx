import { useCallback, useEffect, useState } from "react";

import {
    AlertTriangle,
    CalendarDays,
    ChevronDown,
    Clock3,
    Eye,
    History,
    Info,
    RefreshCw,
    Search,
    ShieldAlert,
    ShieldCheck,
    UserRound,
    X,
} from "lucide-react";

import { toast } from "sonner";

import {
    getAdminAuditCategories,
    getAdminAuditRecord,
    getAdminAuditRecords,
    getAdminAuditSeverities,
    getAdminAuditSummary,
} from "../../services/mock/adminService";

import "./admin-audit.css";

function formatDateTime(value) {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    return date.toLocaleString([], {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatRelativeDate(value) {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    return date.toLocaleDateString([], {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function getInitials(name = "") {
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

function getSeverityIcon(severity) {
    if (severity === "critical") {
        return <ShieldAlert size={15} />;
    }

    if (severity === "warning") {
        return <AlertTriangle size={15} />;
    }

    return <Info size={15} />;
}

export default function AdminAuditPage() {
    const [summary, setSummary] = useState(null);
    const [categories, setCategories] = useState([]);
    const [severities, setSeverities] = useState([]);
    const [records, setRecords] = useState([]);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [severity, setSeverity] = useState("all");

    const [selectedRecord, setSelectedRecord] = useState(null);

    const [loading, setLoading] = useState(true);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [error, setError] = useState("");

    const loadAuditData = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const [
                summaryData,
                categoriesData,
                severitiesData,
                recordsData,
            ] = await Promise.all([
                getAdminAuditSummary(),
                getAdminAuditCategories(),
                getAdminAuditSeverities(),
                getAdminAuditRecords({
                    search,
                    category,
                    severity,
                }),
            ]);

            setSummary(summaryData);
            setCategories(categoriesData);
            setSeverities(severitiesData);
            setRecords(recordsData);
        } catch (err) {
            console.error(err);

            setError(
                "Unable to load audit logs. Please try again."
            );

            toast.error("Unable to load audit logs.");
        } finally {
            setLoading(false);
        }
    }, [search, category, severity]);

    useEffect(() => {
        const timer = setTimeout(() => {
            loadAuditData();
        }, 250);

        return () => clearTimeout(timer);
    }, [loadAuditData]);

    const handleRefresh = async () => {
        await loadAuditData();

        toast.success("Audit logs refreshed.");
    };

    const handleViewRecord = async (id) => {
        try {
            setDetailsLoading(true);

            const record = await getAdminAuditRecord(id);

            setSelectedRecord(record);
        } catch (err) {
            console.error(err);

            toast.error("Unable to load audit details.");
        } finally {
            setDetailsLoading(false);
        }
    };

    return (
        <div className="admin-audit-page">
            <section className="admin-audit-header">
                <div>
                    <div className="admin-page-eyebrow">
                        <History size={15} />
                        ADMIN AUDIT
                    </div>

                    <h1>Audit Logs</h1>

                    <p>
                        Review administrative actions and system
                        activity across the platform.
                    </p>
                </div>

                <button
                    type="button"
                    className="admin-audit-refresh"
                    onClick={handleRefresh}
                    disabled={loading}
                >
                    <RefreshCw
                        size={17}
                        className={
                            loading
                                ? "admin-audit-spinning"
                                : ""
                        }
                    />

                    Refresh
                </button>
            </section>

            <div className="admin-audit-notice">
                <ShieldCheck size={19} />

                <div>
                    <strong>Mock audit data</strong>

                    <span>
                        These records are for frontend review only.
                        The final version will display
                        server-generated administrator action history.
                    </span>
                </div>
            </div>

            <section className="admin-audit-stats">
                <div className="admin-audit-stat-card">
                    <div className="admin-audit-stat-icon">
                        <History size={19} />
                    </div>

                    <div>
                        <span>Total actions</span>
                        <strong>
                            {summary?.totalActions?.toLocaleString() ??
                                "—"}
                        </strong>
                    </div>
                </div>

                <div className="admin-audit-stat-card">
                    <div className="admin-audit-stat-icon">
                        <CalendarDays size={19} />
                    </div>

                    <div>
                        <span>Today</span>
                        <strong>
                            {summary?.todayActions?.toLocaleString() ??
                                "—"}
                        </strong>
                    </div>
                </div>

                <div className="admin-audit-stat-card">
                    <div className="admin-audit-stat-icon">
                        <ShieldAlert size={19} />
                    </div>

                    <div>
                        <span>Critical actions</span>
                        <strong>
                            {summary?.criticalActions?.toLocaleString() ??
                                "—"}
                        </strong>
                    </div>
                </div>

                <div className="admin-audit-stat-card">
                    <div className="admin-audit-stat-icon">
                        <UserRound size={19} />
                    </div>

                    <div>
                        <span>Unique admins</span>
                        <strong>
                            {summary?.uniqueAdmins?.toLocaleString() ??
                                "—"}
                        </strong>
                    </div>
                </div>
            </section>

            <section className="admin-audit-toolbar">
                <div className="admin-audit-search">
                    <Search size={18} />

                    <input
                        type="search"
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder="Search actions, admins, targets..."
                    />
                </div>

                <label className="admin-audit-select">
                    <select
                        value={category}
                        onChange={(event) =>
                            setCategory(event.target.value)
                        }
                    >
                        {categories.map((item) => (
                            <option
                                key={item.id}
                                value={item.id}
                            >
                                {item.name}
                            </option>
                        ))}
                    </select>

                    <ChevronDown size={16} />
                </label>

                <label className="admin-audit-select">
                    <select
                        value={severity}
                        onChange={(event) =>
                            setSeverity(event.target.value)
                        }
                    >
                        {severities.map((item) => (
                            <option
                                key={item.id}
                                value={item.id}
                            >
                                {item.name}
                            </option>
                        ))}
                    </select>

                    <ChevronDown size={16} />
                </label>
            </section>

            <section className="admin-audit-card">
                <div className="admin-audit-card-header">
                    <div>
                        <h2>Administrative activity</h2>

                        <p>
                            {records.length}{" "}
                            {records.length === 1
                                ? "record"
                                : "records"}{" "}
                            shown
                        </p>
                    </div>
                </div>

                {error ? (
                    <div className="admin-audit-state admin-audit-error">
                        <ShieldAlert size={24} />

                        <strong>{error}</strong>

                        <button
                            type="button"
                            onClick={handleRefresh}
                        >
                            Try again
                        </button>
                    </div>
                ) : loading ? (
                    <div className="admin-audit-state">
                        <div className="admin-audit-loader" />

                        <span>
                            Loading audit logs...
                        </span>
                    </div>
                ) : records.length === 0 ? (
                    <div className="admin-audit-state">
                        <History size={28} />

                        <strong>
                            No audit records found
                        </strong>

                        <span>
                            Try changing your search or filters.
                        </span>
                    </div>
                ) : (
                    <div className="admin-audit-table-wrap">
                        <table className="admin-audit-table">
                            <thead>
                                <tr>
                                    <th>Time</th>
                                    <th>Administrator</th>
                                    <th>Action</th>
                                    <th>Target</th>
                                    <th>Category</th>
                                    <th>Severity</th>
                                    <th />
                                </tr>
                            </thead>

                            <tbody>
                                {records.map((record) => (
                                    <tr key={record.id}>
                                        <td>
                                            <div className="audit-time">
                                                <Clock3 size={14} />

                                                <span>
                                                    {formatDateTime(
                                                        record.timestamp
                                                    )}
                                                </span>
                                            </div>
                                        </td>

                                        <td>
                                            <div className="audit-admin">
                                                <div className="audit-avatar">
                                                    {getInitials(
                                                        record.adminName
                                                    )}
                                                </div>

                                                <div>
                                                    <strong>
                                                        {
                                                            record.adminName
                                                        }
                                                    </strong>

                                                    <span>
                                                        {
                                                            record.adminEmail
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            <div className="audit-action">
                                                <strong>
                                                    {record.action}
                                                </strong>

                                                <span>
                                                    {
                                                        record.actionCode
                                                    }
                                                </span>
                                            </div>
                                        </td>

                                        <td>
                                            <div className="audit-target">
                                                {record.target}
                                            </div>
                                        </td>

                                        <td>
                                            <span className="audit-category">
                                                {
                                                    record.categoryName
                                                }
                                            </span>
                                        </td>

                                        <td>
                                            <span
                                                className={`audit-severity audit-severity-${record.severity}`}
                                            >
                                                {getSeverityIcon(
                                                    record.severity
                                                )}

                                                {record.severity}
                                            </span>
                                        </td>

                                        <td>
                                            <button
                                                type="button"
                                                className="audit-view-button"
                                                onClick={() =>
                                                    handleViewRecord(
                                                        record.id
                                                    )
                                                }
                                                aria-label="View audit details"
                                            >
                                                <Eye size={17} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {selectedRecord && (
                <div
                    className="admin-audit-modal-backdrop"
                    onMouseDown={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            setSelectedRecord(null);
                        }
                    }}
                >
                    <div className="admin-audit-modal">
                        <div className="admin-audit-modal-header">
                            <div>
                                <span>
                                    Audit record
                                </span>

                                <h2>
                                    {selectedRecord.action}
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedRecord(null)
                                }
                                aria-label="Close"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        {detailsLoading ? (
                            <div className="admin-audit-modal-loading">
                                <div className="admin-audit-loader" />

                                Loading details...
                            </div>
                        ) : (
                            <>
                                <div className="audit-detail-badges">
                                    <span className="audit-category">
                                        {
                                            selectedRecord.categoryName
                                        }
                                    </span>

                                    <span
                                        className={`audit-severity audit-severity-${selectedRecord.severity}`}
                                    >
                                        {getSeverityIcon(
                                            selectedRecord.severity
                                        )}

                                        {
                                            selectedRecord.severity
                                        }
                                    </span>
                                </div>

                                <div className="audit-detail-grid">
                                    <div>
                                        <span>
                                            Date & time
                                        </span>

                                        <strong>
                                            {formatDateTime(
                                                selectedRecord.timestamp
                                            )}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Date
                                        </span>

                                        <strong>
                                            {formatRelativeDate(
                                                selectedRecord.timestamp
                                            )}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Action code
                                        </span>

                                        <strong>
                                            {
                                                selectedRecord.actionCode
                                            }
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Target ID
                                        </span>

                                        <strong>
                                            {
                                                selectedRecord.targetId
                                            }
                                        </strong>
                                    </div>
                                </div>

                                <div className="audit-detail-section">
                                    <span>Administrator</span>

                                    <div className="audit-detail-admin">
                                        <div className="audit-avatar">
                                            {getInitials(
                                                selectedRecord.adminName
                                            )}
                                        </div>

                                        <div>
                                            <strong>
                                                {
                                                    selectedRecord.adminName
                                                }
                                            </strong>

                                            <span>
                                                {
                                                    selectedRecord.adminEmail
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="audit-detail-section">
                                    <span>Target</span>

                                    <strong>
                                        {
                                            selectedRecord.target
                                        }
                                    </strong>
                                </div>

                                <div className="audit-detail-section">
                                    <span>Description</span>

                                    <p>
                                        {
                                            selectedRecord.description
                                        }
                                    </p>
                                </div>

                                <div className="audit-detail-grid audit-detail-meta">
                                    <div>
                                        <span>
                                            IP address
                                        </span>

                                        <strong>
                                            {
                                                selectedRecord.ipAddress
                                            }
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Device
                                        </span>

                                        <strong>
                                            {
                                                selectedRecord.device
                                            }
                                        </strong>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}