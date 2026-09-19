import { useCallback, useEffect, useState } from "react";

import {
    AlertTriangle,
    CheckCircle2,
    ChevronDown,
    Eye,
    Fingerprint,
    Flag,
    RefreshCw,
    ScanSearch,
    Search,
    ShieldAlert,
    ShieldCheck,
    UserRound,
    Users,
    X,
} from "lucide-react";

import { toast } from "sonner";

import {
    blockAdminDevice,
    clearAdminDeviceFlag,
    flagAdminDevice,
    getAdminDevice,
    getAdminDevices,
    getAdminDeviceCountries,
    getAdminDeviceRiskLevels,
    getAdminDeviceStatuses,
    getAdminDeviceSummary,
    scanAdminDevice,
    unblockAdminDevice,
} from "../../services/mock/adminService";

import "./admin-devices.css";

function formatDate(value) {
    if (!value) return "—";

    return new Intl.DateTimeFormat("en", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
}

function getRiskLabel(level) {
    return (
        {
            low: "Low",
            medium: "Medium",
            high: "High",
            critical: "Critical",
        }[level] || level
    );
}

function getStatusLabel(status) {
    return (
        {
            clear: "Clear",
            flagged: "Flagged",
            blocked: "Blocked",
        }[status] || status
    );
}

function RiskBadge({ level }) {
    return (
        <span className={`device-risk-badge ${level}`}>
            <span className="device-risk-dot" />
            {getRiskLabel(level)}
        </span>
    );
}

function StatusBadge({ status }) {
    return (
        <span className={`device-status-badge ${status}`}>
            {status === "clear" && (
                <CheckCircle2 size={13} />
            )}

            {status === "flagged" && (
                <Flag size={13} />
            )}

            {status === "blocked" && (
                <ShieldAlert size={13} />
            )}

            {getStatusLabel(status)}
        </span>
    );
}

export default function AdminDevicesPage() {
    const [summary, setSummary] = useState(null);
    const [devices, setDevices] = useState([]);

    const [riskLevels, setRiskLevels] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [countries, setCountries] = useState([]);

    const [search, setSearch] = useState("");
    const [riskLevel, setRiskLevel] = useState("all");
    const [status, setStatus] = useState("all");
    const [country, setCountry] = useState("All Countries");

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [selectedDevice, setSelectedDevice] =
        useState(null);

    const [detailsOpen, setDetailsOpen] =
        useState(false);

    const [flagModalOpen, setFlagModalOpen] =
        useState(false);

    const [flagReason, setFlagReason] =
        useState("");

    const [actionLoading, setActionLoading] =
        useState(false);

    const loadData = useCallback(
        async (showRefresh = false) => {
            try {
                if (showRefresh) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                const [
                    summaryData,
                    deviceData,
                    riskData,
                    statusData,
                    countryData,
                ] = await Promise.all([
                    getAdminDeviceSummary(),
                    getAdminDevices({
                        search,
                        riskLevel,
                        status,
                        country,
                    }),
                    getAdminDeviceRiskLevels(),
                    getAdminDeviceStatuses(),
                    getAdminDeviceCountries(),
                ]);

                setSummary(summaryData);
                setDevices(deviceData);
                setRiskLevels(riskData);
                setStatuses(statusData);
                setCountries(countryData);
            } catch (error) {
                console.error(error);

                toast.error(
                    "Unable to load device management data."
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [search, riskLevel, status, country]
    );

    useEffect(() => {
        loadData();
    }, [loadData]);

    const openDetails = async (id) => {
        try {
            const device = await getAdminDevice(id);

            if (!device) {
                toast.error(
                    "Device record could not be found."
                );
                return;
            }

            setSelectedDevice(device);
            setDetailsOpen(true);
        } catch {
            toast.error(
                "Unable to load device details."
            );
        }
    };

    const handleScan = async (id) => {
        try {
            setActionLoading(true);

            const result = await scanAdminDevice(id);

            if (!result.success) {
                toast.error(result.message);
                return;
            }

            toast.success("Device scan completed.");

            await loadData(true);

            if (selectedDevice?.id === id) {
                setSelectedDevice(result.data);
            }
        } catch {
            toast.error("Device scan failed.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleFlag = async () => {
        if (!selectedDevice) return;

        try {
            setActionLoading(true);

            const result = await flagAdminDevice(
                selectedDevice.id,
                flagReason
            );

            if (!result.success) {
                toast.error(result.message);
                return;
            }

            toast.success(
                "Device flagged for review."
            );

            setSelectedDevice(result.data);
            setFlagModalOpen(false);
            setFlagReason("");

            await loadData(true);
        } catch {
            toast.error("Unable to flag device.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleClearFlag = async (id) => {
        try {
            setActionLoading(true);

            const result =
                await clearAdminDeviceFlag(id);

            if (!result.success) {
                toast.error(result.message);
                return;
            }

            toast.success("Device flag cleared.");

            setSelectedDevice(result.data);

            await loadData(true);
        } catch {
            toast.error(
                "Unable to clear device flag."
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleBlock = async (id) => {
        const confirmed = window.confirm(
            "Block this device and its linked accounts?"
        );

        if (!confirmed) return;

        try {
            setActionLoading(true);

            const result =
                await blockAdminDevice(id);

            if (!result.success) {
                toast.error(result.message);
                return;
            }

            toast.success(
                "Device and linked accounts blocked."
            );

            setSelectedDevice(result.data);

            await loadData(true);
        } catch {
            toast.error("Unable to block device.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleUnblock = async (id) => {
        try {
            setActionLoading(true);

            const result =
                await unblockAdminDevice(id);

            if (!result.success) {
                toast.error(result.message);
                return;
            }

            toast.success("Device unblocked.");

            setSelectedDevice(result.data);

            await loadData(true);
        } catch {
            toast.error("Unable to unblock device.");
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <section className="admin-devices-page">
            <div className="admin-devices-header">
                <div>
                    <div className="admin-page-eyebrow">
                        Security & fraud prevention
                    </div>

                    <h1>Devices & Fraud</h1>

                    <p>
                        Review device clusters, investigate
                        multi-account activity and manage
                        account risk.
                    </p>
                </div>

                <button
                    type="button"
                    className="admin-device-refresh"
                    onClick={() => loadData(true)}
                    disabled={refreshing}
                >
                    <RefreshCw
                        size={17}
                        className={
                            refreshing
                                ? "device-spin"
                                : ""
                        }
                    />

                    Refresh
                </button>
            </div>

            <div className="admin-device-notice">
                <ShieldCheck size={18} />

                <div>
                    <strong>Mock security data</strong>

                    <span>
                        This page currently uses local mock
                        records. No real accounts or devices
                        are being blocked or flagged.
                    </span>
                </div>
            </div>

            <div className="admin-device-stats">
                <div className="admin-device-stat-card">
                    <div className="device-stat-icon warning">
                        <Flag size={19} />
                    </div>

                    <div>
                        <span>Flagged accounts</span>
                        <strong>
                            {summary?.flaggedAccounts ?? "—"}
                        </strong>
                    </div>
                </div>

                <div className="admin-device-stat-card">
                    <div className="device-stat-icon">
                        <Fingerprint size={19} />
                    </div>

                    <div>
                        <span>Device clusters</span>
                        <strong>
                            {summary?.deviceClusters ?? "—"}
                        </strong>
                    </div>
                </div>

                <div className="admin-device-stat-card">
                    <div className="device-stat-icon danger">
                        <ShieldAlert size={19} />
                    </div>

                    <div>
                        <span>Blocked devices</span>
                        <strong>
                            {summary?.blockedDevices ?? "—"}
                        </strong>
                    </div>
                </div>

                <div className="admin-device-stat-card">
                    <div className="device-stat-icon danger">
                        <AlertTriangle size={19} />
                    </div>

                    <div>
                        <span>High-risk accounts</span>
                        <strong>
                            {summary?.highRiskAccounts ?? "—"}
                        </strong>
                    </div>
                </div>

                <div className="admin-device-stat-card">
                    <div className="device-stat-icon">
                        <ScanSearch size={19} />
                    </div>

                    <div>
                        <span>Recent scans</span>
                        <strong>
                            {summary?.recentScans ?? "—"}
                        </strong>
                    </div>
                </div>
            </div>

            <div className="admin-device-panel">
                <div className="admin-device-toolbar">
                    <div className="device-search">
                        <Search size={17} />

                        <input
                            type="search"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search UID, username, email or device..."
                        />
                    </div>

                    <div className="device-filter">
                        <select
                            value={riskLevel}
                            onChange={(event) =>
                                setRiskLevel(
                                    event.target.value
                                )
                            }
                        >
                            {riskLevels.map((item) => (
                                <option
                                    key={item.id}
                                    value={item.id}
                                >
                                    {item.name}
                                </option>
                            ))}
                        </select>

                        <ChevronDown size={15} />
                    </div>

                    <div className="device-filter">
                        <select
                            value={status}
                            onChange={(event) =>
                                setStatus(
                                    event.target.value
                                )
                            }
                        >
                            {statuses.map((item) => (
                                <option
                                    key={item.id}
                                    value={item.id}
                                >
                                    {item.name}
                                </option>
                            ))}
                        </select>

                        <ChevronDown size={15} />
                    </div>

                    <div className="device-filter">
                        <select
                            value={country}
                            onChange={(event) =>
                                setCountry(
                                    event.target.value
                                )
                            }
                        >
                            {countries.map((item) => (
                                <option
                                    key={item}
                                    value={item}
                                >
                                    {item}
                                </option>
                            ))}
                        </select>

                        <ChevronDown size={15} />
                    </div>
                </div>

                <div className="admin-device-table-wrap">
                    {loading ? (
                        <div className="admin-device-loading">
                            <div className="device-spinner" />
                            <span>
                                Loading device records...
                            </span>
                        </div>
                    ) : devices.length === 0 ? (
                        <div className="admin-device-empty">
                            <Fingerprint size={34} />

                            <h3>
                                No device records found
                            </h3>

                            <p>
                                Try changing your search or
                                security filters.
                            </p>
                        </div>
                    ) : (
                        <table className="admin-device-table">
                            <thead>
                                <tr>
                                    <th>Device</th>
                                    <th>Accounts</th>
                                    <th>Risk</th>
                                    <th>Status</th>
                                    <th>Country</th>
                                    <th>Last scan</th>
                                    <th />
                                </tr>
                            </thead>

                            <tbody>
                                {devices.map((device) => (
                                    <tr key={device.id}>
                                        <td>
                                            <div className="device-identity">
                                                <div className="device-fingerprint-icon">
                                                    <Fingerprint
                                                        size={18}
                                                    />
                                                </div>

                                                <div>
                                                    <strong>
                                                        {
                                                            device.deviceFingerprint
                                                        }
                                                    </strong>

                                                    <span>
                                                        {
                                                            device.deviceInstallId
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            <div className="device-account-count">
                                                <Users size={15} />
                                                {
                                                    device.accountCount
                                                }
                                            </div>
                                        </td>

                                        <td>
                                            <RiskBadge
                                                level={
                                                    device.riskLevel
                                                }
                                            />
                                        </td>

                                        <td>
                                            <StatusBadge
                                                status={
                                                    device.status
                                                }
                                            />
                                        </td>

                                        <td>
                                            <span className="device-country">
                                                {
                                                    device.country
                                                }
                                            </span>
                                        </td>

                                        <td>
                                            <span className="device-date">
                                                {formatDate(
                                                    device.lastScanAt
                                                )}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="device-row-actions">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openDetails(
                                                            device.id
                                                        )
                                                    }
                                                    title="View details"
                                                >
                                                    <Eye
                                                        size={16}
                                                    />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleScan(
                                                            device.id
                                                        )
                                                    }
                                                    title="Scan device"
                                                    disabled={
                                                        actionLoading
                                                    }
                                                >
                                                    <ScanSearch
                                                        size={16}
                                                    />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {!loading && devices.length > 0 && (
                    <div className="admin-device-table-footer">
                        <span>
                            Showing {devices.length} device
                            {devices.length === 1
                                ? ""
                                : "s"}
                        </span>
                    </div>
                )}
            </div>

            {detailsOpen && selectedDevice && (
                <div
                    className="admin-device-modal-backdrop"
                    onMouseDown={() =>
                        setDetailsOpen(false)
                    }
                >
                    <div
                        className="admin-device-modal"
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="admin-device-modal-header">
                            <div>
                                <span>
                                    Device investigation
                                </span>

                                <h2>
                                    Device cluster details
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setDetailsOpen(false)
                                }
                                className="device-modal-close"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="device-detail-hero">
                            <div className="device-detail-icon">
                                <Fingerprint size={25} />
                            </div>

                            <div>
                                <strong>
                                    {
                                        selectedDevice.deviceFingerprint
                                    }
                                </strong>

                                <span>
                                    {
                                        selectedDevice.deviceInstallId
                                    }
                                </span>
                            </div>

                            <div className="device-detail-badges">
                                <RiskBadge
                                    level={
                                        selectedDevice.riskLevel
                                    }
                                />

                                <StatusBadge
                                    status={
                                        selectedDevice.status
                                    }
                                />
                            </div>
                        </div>

                        <div className="device-detail-grid">
                            <div>
                                <span>Country</span>
                                <strong>
                                    {
                                        selectedDevice.country
                                    }
                                </strong>
                            </div>

                            <div>
                                <span>Linked accounts</span>
                                <strong>
                                    {
                                        selectedDevice.accountCount
                                    }
                                </strong>
                            </div>

                            <div>
                                <span>Last scan</span>
                                <strong>
                                    {formatDate(
                                        selectedDevice.lastScanAt
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>Flagged by</span>
                                <strong>
                                    {
                                        selectedDevice.flaggedBy ||
                                        "System"
                                    }
                                </strong>
                            </div>
                        </div>

                        <div className="device-detail-section">
                            <div className="device-detail-section-title">
                                <AlertTriangle
                                    size={17}
                                />

                                <h3>
                                    Risk indicators
                                </h3>
                            </div>

                            <ul className="device-indicators">
                                {selectedDevice.indicators.map(
                                    (indicator) => (
                                        <li
                                            key={indicator}
                                        >
                                            {indicator}
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>

                        <div className="device-detail-section">
                            <div className="device-detail-section-title">
                                <Users size={17} />

                                <h3>
                                    Linked accounts
                                </h3>
                            </div>

                            <div className="linked-account-list">
                                {selectedDevice.accounts.map(
                                    (account) => (
                                        <div
                                            className="linked-account"
                                            key={account.uid}
                                        >
                                            <div className="linked-account-avatar">
                                                <UserRound
                                                    size={17}
                                                />
                                            </div>

                                            <div>
                                                <strong>
                                                    {
                                                        account.username
                                                    }
                                                </strong>

                                                <span>
                                                    {
                                                        account.email
                                                    }
                                                </span>
                                            </div>

                                            <span
                                                className={`linked-account-status ${account.status}`}
                                            >
                                                {
                                                    account.status
                                                }
                                            </span>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>

                        {selectedDevice.flagReason && (
                            <div className="device-flag-reason">
                                <strong>
                                    Flag reason
                                </strong>

                                <p>
                                    {
                                        selectedDevice.flagReason
                                    }
                                </p>
                            </div>
                        )}

                        <div className="device-modal-actions">
                            <button
                                type="button"
                                className="device-secondary-btn"
                                onClick={() =>
                                    handleScan(
                                        selectedDevice.id
                                    )
                                }
                                disabled={actionLoading}
                            >
                                <ScanSearch size={16} />
                                Scan
                            </button>

                            {selectedDevice.status ===
                            "blocked" ? (
                                <button
                                    type="button"
                                    className="device-secondary-btn"
                                    onClick={() =>
                                        handleUnblock(
                                            selectedDevice.id
                                        )
                                    }
                                    disabled={actionLoading}
                                >
                                    <ShieldCheck
                                        size={16}
                                    />
                                    Unblock
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="device-danger-btn"
                                    onClick={() =>
                                        handleBlock(
                                            selectedDevice.id
                                        )
                                    }
                                    disabled={actionLoading}
                                >
                                    <ShieldAlert
                                        size={16}
                                    />
                                    Block
                                </button>
                            )}

                            {selectedDevice.status ===
                            "flagged" ? (
                                <button
                                    type="button"
                                    className="device-secondary-btn"
                                    onClick={() =>
                                        handleClearFlag(
                                            selectedDevice.id
                                        )
                                    }
                                    disabled={actionLoading}
                                >
                                    <CheckCircle2
                                        size={16}
                                    />
                                    Clear flag
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="device-warning-btn"
                                    onClick={() =>
                                        setFlagModalOpen(true)
                                    }
                                    disabled={actionLoading}
                                >
                                    <Flag size={16} />
                                    Flag
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {flagModalOpen && selectedDevice && (
                <div
                    className="admin-device-modal-backdrop"
                    onMouseDown={() =>
                        setFlagModalOpen(false)
                    }
                >
                    <div
                        className="admin-device-small-modal"
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="admin-device-modal-header">
                            <div>
                                <span>Security action</span>

                                <h2>
                                    Flag device
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setFlagModalOpen(false)
                                }
                                className="device-modal-close"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <p className="flag-modal-description">
                            Add a reason for flagging this
                            device for manual review.
                        </p>

                        <textarea
                            value={flagReason}
                            onChange={(event) =>
                                setFlagReason(
                                    event.target.value
                                )
                            }
                            placeholder="Example: Multiple accounts share the same device fingerprint."
                            rows={5}
                        />

                        <div className="device-modal-actions">
                            <button
                                type="button"
                                className="device-secondary-btn"
                                onClick={() =>
                                    setFlagModalOpen(false)
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="device-warning-btn"
                                onClick={handleFlag}
                                disabled={actionLoading}
                            >
                                <Flag size={16} />
                                Flag device
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}