import { useCallback, useEffect, useState } from "react";

import {
    AlertTriangle,
    CalendarDays,
    CheckCircle2,
    ChevronDown,
    Clock3,
    Database,
    Info,
    Lock,
    RefreshCw,
    RotateCcw,
    Server,
    Settings,
    ShieldAlert,
    ShieldCheck,
    Wrench,
    X,
} from "lucide-react";

import { toast } from "sonner";

import {
    getAdminSystemHealth,
    getAdminSystemMaintenance,
    getAdminSystemRepairs,
    getAdminSystemSummary,
    runAdminSystemRepair,
    updateAdminSystemMaintenance,
} from "../../services/mock/adminService";

import "./admin-system.css";

function formatDateTime(value) {
    if (!value) {
        return "—";
    }

    return new Date(value).toLocaleString([], {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function getHealthIcon(status) {
    if (status === "operational") {
        return <CheckCircle2 size={17} />;
    }

    return <AlertTriangle size={17} />;
}

export default function AdminSystemPage() {
    const [summary, setSummary] = useState(null);
    const [health, setHealth] = useState([]);
    const [repairs, setRepairs] = useState([]);
    const [maintenance, setMaintenance] = useState(null);

    const [loading, setLoading] = useState(true);
    const [repairing, setRepairing] = useState(false);

    const [selectedRepair, setSelectedRepair] =
        useState(null);

    const [repairDate, setRepairDate] = useState("");

    const [maintenanceForm, setMaintenanceForm] =
        useState({
            maintenanceMode: false,
            maintenanceTitle: "",
            maintenanceMessage: "",
            allowAdminAccess: true,
        });

    const [showMaintenanceEditor, setShowMaintenanceEditor] =
        useState(false);

    const loadSystemData = useCallback(async () => {
        try {
            setLoading(true);

            const [
                summaryData,
                healthData,
                repairsData,
                maintenanceData,
            ] = await Promise.all([
                getAdminSystemSummary(),
                getAdminSystemHealth(),
                getAdminSystemRepairs(),
                getAdminSystemMaintenance(),
            ]);

            setSummary(summaryData);
            setHealth(healthData);
            setRepairs(repairsData);
            setMaintenance(maintenanceData);

            setMaintenanceForm(maintenanceData);
        } catch (error) {
            console.error(error);

            toast.error(
                "Unable to load system information."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadSystemData();
    }, [loadSystemData]);

    const handleRefresh = async () => {
        await loadSystemData();

        toast.success("System information refreshed.");
    };

    const openRepair = (repair) => {
        setRepairDate("");
        setSelectedRepair(repair);
    };

    const closeRepair = () => {
        if (!repairing) {
            setSelectedRepair(null);
            setRepairDate("");
        }
    };

    const handleRepair = async () => {
        if (!selectedRepair) {
            return;
        }

        if (
            selectedRepair.requiresDate &&
            !repairDate
        ) {
            toast.error(
                "Please select the starting date."
            );

            return;
        }

        try {
            setRepairing(true);

            const result =
                await runAdminSystemRepair(
                    selectedRepair.id,
                    {
                        date: repairDate,
                    }
                );

            if (!result.success) {
                toast.error(result.message);

                return;
            }

            toast.success(result.message);

            setSelectedRepair(null);
            setRepairDate("");

            await loadSystemData();
        } catch (error) {
            console.error(error);

            toast.error(
                "The repair operation could not be completed."
            );
        } finally {
            setRepairing(false);
        }
    };

    const handleMaintenanceSave = async () => {
        try {
            const result =
                await updateAdminSystemMaintenance(
                    maintenanceForm
                );

            if (!result.success) {
                toast.error(result.message);

                return;
            }

            setMaintenance(result.data);
            setMaintenanceForm(result.data);

            setShowMaintenanceEditor(false);

            toast.success(
                "Maintenance settings saved."
            );
        } catch (error) {
            console.error(error);

            toast.error(
                "Unable to save maintenance settings."
            );
        }
    };

    const handleMaintenanceToggle = () => {
        setMaintenanceForm((current) => ({
            ...current,
            maintenanceMode:
                !current.maintenanceMode,
        }));
    };

    return (
        <div className="admin-system-page">
            <section className="admin-system-header">
                <div>
                    <div className="admin-page-eyebrow">
                        <Server size={15} />
                        ADMIN SYSTEM
                    </div>

                    <h1>System</h1>

                    <p>
                        Monitor platform health and manage
                        restricted system operations.
                    </p>
                </div>

                <button
                    type="button"
                    className="admin-system-refresh"
                    onClick={handleRefresh}
                    disabled={loading}
                >
                    <RefreshCw
                        size={17}
                        className={
                            loading
                                ? "admin-system-spinning"
                                : ""
                        }
                    />

                    Refresh
                </button>
            </section>

            <div className="admin-system-notice">
                <ShieldCheck size={19} />

                <div>
                    <strong>
                        Mock system controls
                    </strong>

                    <span>
                        System checks and repair actions are
                        simulated for frontend review. They do
                        not modify Firebase data.
                    </span>
                </div>
            </div>

            <section className="admin-system-overview">
                <div className="admin-system-status-card">
                    <div className="admin-system-status-icon">
                        <CheckCircle2 size={22} />
                    </div>

                    <div>
                        <span>System status</span>

                        <strong>
                            {summary?.systemStatus ===
                            "operational"
                                ? "Operational"
                                : "Attention required"}
                        </strong>

                        <small>
                            All monitored services are
                            responding normally.
                        </small>
                    </div>
                </div>

                <div className="admin-system-overview-card">
                    <div className="admin-system-overview-icon">
                        <Wrench size={19} />
                    </div>

                    <div>
                        <span>
                            Last leaderboard repair
                        </span>

                        <strong>
                            {formatDateTime(
                                summary?.lastLeaderboardRepair
                            )}
                        </strong>
                    </div>
                </div>

                <div className="admin-system-overview-card">
                    <div className="admin-system-overview-icon">
                        <Clock3 size={19} />
                    </div>

                    <div>
                        <span>
                            Last system check
                        </span>

                        <strong>
                            {formatDateTime(
                                summary?.lastSystemCheck
                            )}
                        </strong>
                    </div>
                </div>

                <div className="admin-system-overview-card">
                    <div className="admin-system-overview-icon">
                        <Settings size={19} />
                    </div>

                    <div>
                        <span>
                            Maintenance mode
                        </span>

                        <strong>
                            {summary?.maintenanceMode
                                ? "Enabled"
                                : "Disabled"}
                        </strong>
                    </div>
                </div>
            </section>

            <section className="admin-system-section">
                <div className="admin-system-section-header">
                    <div>
                        <div className="admin-system-section-title">
                            <Server size={18} />

                            <h2>System health</h2>
                        </div>

                        <p>
                            Current status of core platform
                            services.
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="admin-system-loading">
                        <div className="admin-system-loader" />

                        Loading system health...
                    </div>
                ) : (
                    <div className="admin-system-health-grid">
                        {health.map((item) => (
                            <div
                                key={item.id}
                                className="admin-system-health-card"
                            >
                                <div className="admin-system-health-icon">
                                    {getHealthIcon(
                                        item.status
                                    )}
                                </div>

                                <div>
                                    <div className="admin-system-health-name">
                                        <strong>
                                            {item.name}
                                        </strong>

                                        <span
                                            className={`admin-system-health-status admin-system-health-${item.status}`}
                                        >
                                            {
                                                item.status
                                            }
                                        </span>
                                    </div>

                                    <p>
                                        {
                                            item.description
                                        }
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section className="admin-system-section">
                <div className="admin-system-section-header">
                    <div>
                        <div className="admin-system-section-title">
                            <RotateCcw size={18} />

                            <h2>
                                Leaderboard repairs
                            </h2>
                        </div>

                        <p>
                            Restricted operations for repairing
                            leaderboard data.
                        </p>
                    </div>
                </div>

                <div className="admin-system-warning">
                    <ShieldAlert size={19} />

                    <div>
                        <strong>
                            Restricted administrative
                            operations
                        </strong>

                        <span>
                            These operations can affect
                            ranking data. In the production
                            version they should remain
                            server-authoritative and limited
                            to authorized administrators.
                        </span>
                    </div>
                </div>

                <div className="admin-system-repair-grid">
                    {repairs.map((repair) => (
                        <div
                            key={repair.id}
                            className="admin-system-repair-card"
                        >
                            <div className="admin-system-repair-top">
                                <div className="admin-system-repair-icon">
                                    <Database size={19} />
                                </div>

                                <span
                                    className={`admin-system-risk admin-system-risk-${repair.risk}`}
                                >
                                    {repair.risk} risk
                                </span>
                            </div>

                            <h3>
                                {repair.name}
                            </h3>

                            <p>
                                {repair.description}
                            </p>

                            <div className="admin-system-repair-meta">
                                <span>
                                    <Clock3 size={14} />

                                    {
                                        repair.estimatedTime
                                    }
                                </span>

                                {repair.requiresDate && (
                                    <span>
                                        <CalendarDays
                                            size={14}
                                        />

                                        Starting date
                                        required
                                    </span>
                                )}
                            </div>

                            <button
                                type="button"
                                className="admin-system-repair-button"
                                onClick={() =>
                                    openRepair(repair)
                                }
                            >
                                <Wrench size={16} />

                                Run repair
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            <section className="admin-system-section">
                <div className="admin-system-section-header">
                    <div>
                        <div className="admin-system-section-title">
                            <Settings size={18} />

                            <h2>Maintenance</h2>
                        </div>

                        <p>
                            Configure the platform maintenance
                            state.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="admin-system-edit-button"
                        onClick={() =>
                            setShowMaintenanceEditor(
                                true
                            )
                        }
                    >
                        <Settings size={15} />

                        Configure
                    </button>
                </div>

                <div className="admin-system-maintenance-card">
                    <div className="admin-system-maintenance-row">
                        <div>
                            <strong>
                                Maintenance mode
                            </strong>

                            <span>
                                Temporarily restrict normal
                                user access to the platform.
                            </span>
                        </div>

                        <span
                            className={`admin-system-maintenance-status ${
                                maintenance?.maintenanceMode
                                    ? "enabled"
                                    : "disabled"
                            }`}
                        >
                            {maintenance?.maintenanceMode
                                ? "Enabled"
                                : "Disabled"}
                        </span>
                    </div>

                    <div className="admin-system-maintenance-row">
                        <div>
                            <strong>
                                Admin access
                            </strong>

                            <span>
                                Allow administrators to
                                access the platform during
                                maintenance.
                            </span>
                        </div>

                        <span
                            className={`admin-system-maintenance-status ${
                                maintenance?.allowAdminAccess
                                    ? "enabled"
                                    : "disabled"
                            }`}
                        >
                            {maintenance?.allowAdminAccess
                                ? "Allowed"
                                : "Restricted"}
                        </span>
                    </div>

                    <div className="admin-system-maintenance-message">
                        <span>
                            Maintenance message
                        </span>

                        <strong>
                            {maintenance?.maintenanceTitle}
                        </strong>

                        <p>
                            {maintenance?.maintenanceMessage}
                        </p>
                    </div>
                </div>
            </section>

            {selectedRepair && (
                <div
                    className="admin-system-modal-backdrop"
                    onMouseDown={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            closeRepair();
                        }
                    }}
                >
                    <div className="admin-system-modal">
                        <div className="admin-system-modal-header">
                            <div>
                                <div className="admin-system-modal-icon">
                                    <AlertTriangle
                                        size={21}
                                    />
                                </div>

                                <div>
                                    <span>
                                        Restricted operation
                                    </span>

                                    <h2>
                                        {
                                            selectedRepair.name
                                        }
                                    </h2>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={closeRepair}
                                disabled={repairing}
                                aria-label="Close"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        <div className="admin-system-modal-body">
                            <div className="admin-system-danger-box">
                                <ShieldAlert size={19} />

                                <p>
                                    This operation may modify
                                    leaderboard data. In
                                    production, this action
                                    should only be performed
                                    after verifying the issue
                                    and confirming that the
                                    operation is authorized.
                                </p>
                            </div>

                            <p className="admin-system-modal-description">
                                {
                                    selectedRepair.description
                                }
                            </p>

                            {selectedRepair.requiresDate && (
                                <label className="admin-system-date-field">
                                    <span>
                                        Repair starting date
                                    </span>

                                    <input
                                        type="date"
                                        value={repairDate}
                                        onChange={(event) =>
                                            setRepairDate(
                                                event.target
                                                    .value
                                            )
                                        }
                                    />
                                </label>
                            )}

                            <div className="admin-system-confirm-info">
                                <Lock size={16} />

                                <span>
                                    This action is simulated
                                    in mock mode and will not
                                    modify Firebase data.
                                </span>
                            </div>
                        </div>

                        <div className="admin-system-modal-actions">
                            <button
                                type="button"
                                className="admin-system-cancel"
                                onClick={closeRepair}
                                disabled={repairing}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="admin-system-confirm"
                                onClick={handleRepair}
                                disabled={repairing}
                            >
                                {repairing ? (
                                    <>
                                        <span className="admin-system-button-loader" />

                                        Running...
                                    </>
                                ) : (
                                    <>
                                        <Wrench size={16} />

                                        Run repair
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showMaintenanceEditor && (
                <div
                    className="admin-system-modal-backdrop"
                    onMouseDown={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            setShowMaintenanceEditor(
                                false
                            );
                        }
                    }}
                >
                    <div className="admin-system-modal admin-system-maintenance-modal">
                        <div className="admin-system-modal-header">
                            <div>
                                <div className="admin-system-modal-icon">
                                    <Settings
                                        size={21}
                                    />
                                </div>

                                <div>
                                    <span>
                                        Platform controls
                                    </span>

                                    <h2>
                                        Maintenance settings
                                    </h2>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowMaintenanceEditor(
                                        false
                                    )
                                }
                                aria-label="Close"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        <div className="admin-system-modal-body">
                            <div className="admin-system-toggle-row">
                                <div>
                                    <strong>
                                        Enable maintenance
                                        mode
                                    </strong>

                                    <span>
                                        Temporarily restrict
                                        normal platform access.
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    className={`admin-system-toggle ${
                                        maintenanceForm.maintenanceMode
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={
                                        handleMaintenanceToggle
                                    }
                                    aria-label="Toggle maintenance mode"
                                >
                                    <span />
                                </button>
                            </div>

                            <label className="admin-system-form-field">
                                <span>
                                    Maintenance title
                                </span>

                                <input
                                    type="text"
                                    value={
                                        maintenanceForm.maintenanceTitle
                                    }
                                    onChange={(event) =>
                                        setMaintenanceForm(
                                            (current) => ({
                                                ...current,
                                                maintenanceTitle:
                                                    event
                                                        .target
                                                        .value,
                                            })
                                        )
                                    }
                                />
                            </label>

                            <label className="admin-system-form-field">
                                <span>
                                    Maintenance message
                                </span>

                                <textarea
                                    rows="4"
                                    value={
                                        maintenanceForm.maintenanceMessage
                                    }
                                    onChange={(event) =>
                                        setMaintenanceForm(
                                            (current) => ({
                                                ...current,
                                                maintenanceMessage:
                                                    event
                                                        .target
                                                        .value,
                                            })
                                        )
                                    }
                                />
                            </label>

                            <div className="admin-system-toggle-row">
                                <div>
                                    <strong>
                                        Allow admin access
                                    </strong>

                                    <span>
                                        Keep administrator access
                                        available during
                                        maintenance.
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    className={`admin-system-toggle ${
                                        maintenanceForm.allowAdminAccess
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        setMaintenanceForm(
                                            (current) => ({
                                                ...current,
                                                allowAdminAccess:
                                                    !current.allowAdminAccess,
                                            })
                                        )
                                    }
                                    aria-label="Toggle admin access"
                                >
                                    <span />
                                </button>
                            </div>
                        </div>

                        <div className="admin-system-modal-actions">
                            <button
                                type="button"
                                className="admin-system-cancel"
                                onClick={() =>
                                    setShowMaintenanceEditor(
                                        false
                                    )
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="admin-system-confirm"
                                onClick={
                                    handleMaintenanceSave
                                }
                            >
                                <CheckCircle2 size={16} />

                                Save settings
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}