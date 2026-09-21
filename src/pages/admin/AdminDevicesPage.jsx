import { useCallback, useEffect, useMemo, useState } from "react";
import {
    AlertTriangle,
    Ban,
    CheckCircle2,
    ChevronDown,
    Clock3,
    Eye,
    Fingerprint,
    Flag,
    Gauge,
    Globe2,
    MonitorSmartphone,
    RefreshCw,
    ScanSearch,
    Search,
    ShieldAlert,
    ShieldCheck,
    ShieldX,
    Sparkles,
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

function formatNumber(value) {
    return new Intl.NumberFormat("en-US").format(value || 0);
}

function formatDate(value, options = {}) {
    if (!value) return "—";

    return new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        ...options,
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

function getRiskMeta(level) {
    return (
        {
            low: {
                label: "Low risk",
                className: "low",
                copy: "No immediate security concern",
            },
            medium: {
                label: "Medium risk",
                className: "medium",
                copy: "Worth monitoring",
            },
            high: {
                label: "High risk",
                className: "high",
                copy: "Manual review recommended",
            },
            critical: {
                label: "Critical risk",
                className: "critical",
                copy: "Immediate investigation",
            },
        }[level] || {
            label: getRiskLabel(level),
            className: level,
            copy: "Security review",
        }
    );
}

function RiskBadge({ level, compact = false }) {
    const meta = getRiskMeta(level);

    return (
        <span
            className={`device-risk-badge ${meta.className}${
                compact ? " compact" : ""
            }`}
        >
            <span className="device-risk-dot" />
            {getRiskLabel(level)}
        </span>
    );
}

function StatusBadge({ status }) {
    return (
        <span className={`device-status-badge ${status}`}>
            {status === "clear" && <CheckCircle2 size={13} />}
            {status === "flagged" && <Flag size={13} />}
            {status === "blocked" && <ShieldX size={13} />}
            {getStatusLabel(status)}
        </span>
    );
}

function ScoreBar({ level }) {
    const intensityByLevel = {
        low: 25,
        medium: 50,
        high: 75,
        critical: 100,
    };

    const intensity = intensityByLevel[level] || 0;

    return (
        <div className="device-score-wrap">
            <div className="device-score-topline">
                <span>Risk intensity</span>
                <strong>{getRiskLabel(level)}</strong>
            </div>
            <div className="device-score-track" aria-label={`${getRiskLabel(level)} risk intensity`}>
                <span
                    className={level || "low"}
                    style={{ width: `${intensity}%` }}
                />
            </div>
        </div>
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
    const [actionLoading, setActionLoading] = useState(false);

    const [selectedDevice, setSelectedDevice] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    const [flagModalOpen, setFlagModalOpen] = useState(false);
    const [flagReason, setFlagReason] = useState("");

    const [confirmAction, setConfirmAction] = useState(null);

    const loadData = useCallback(
        async (showRefresh = false) => {
            try {
                if (showRefresh) setRefreshing(true);
                else setLoading(true);

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
                toast.error("Unable to load device management data.");
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

    const activeOverlay =
        detailsOpen || flagModalOpen || Boolean(confirmAction);

    useEffect(() => {
        if (!activeOverlay) return undefined;

        const previousOverflow = document.body.style.overflow;

        function handleKeyDown(event) {
            if (event.key !== "Escape") return;

            if (flagModalOpen) {
                setFlagModalOpen(false);
                return;
            }

            if (confirmAction) {
                setConfirmAction(null);
                return;
            }

            setDetailsOpen(false);
        }

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [activeOverlay, confirmAction, flagModalOpen]);

    const insight = useMemo(() => {
        const flagged = devices.filter((item) => item.status === "flagged").length;
        const blocked = devices.filter((item) => item.status === "blocked").length;
        const multiAccount = devices.filter((item) => Number(item.accountCount) > 1).length;
        const critical = devices.filter((item) => item.riskLevel === "critical").length;
        const maxAccounts = devices.reduce(
            (highest, item) => Math.max(highest, Number(item.accountCount || 0)),
            0
        );
        const leadingCountry = devices.reduce((acc, item) => {
            if (!item.country) return acc;
            acc[item.country] = (acc[item.country] || 0) + 1;
            return acc;
        }, {});

        const topCountry = Object.entries(leadingCountry).sort(
            (a, b) => b[1] - a[1]
        )[0];

        return {
            flagged,
            blocked,
            multiAccount,
            critical,
            maxAccounts,
            topCountry: topCountry?.[0] || "—",
        };
    }, [devices]);

    const openDetails = async (id) => {
        try {
            const device = await getAdminDevice(id);

            if (!device) {
                toast.error("Device record could not be found.");
                return;
            }

            setSelectedDevice(device);
            setDetailsOpen(true);
        } catch {
            toast.error("Unable to load device details.");
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
            setSelectedDevice(result.data);
            await loadData(true);
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

            toast.success("Device flagged for review.");
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

            const result = await clearAdminDeviceFlag(id);

            if (!result.success) {
                toast.error(result.message);
                return;
            }

            toast.success("Device flag cleared.");
            setSelectedDevice(result.data);
            await loadData(true);
        } catch {
            toast.error("Unable to clear device flag.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleBlock = async (id) => {
        try {
            setActionLoading(true);

            const result = await blockAdminDevice(id);

            if (!result.success) {
                toast.error(result.message);
                return;
            }

            toast.success("Device and linked accounts blocked.");
            setSelectedDevice(result.data);
            setConfirmAction(null);
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

            const result = await unblockAdminDevice(id);

            if (!result.success) {
                toast.error(result.message);
                return;
            }

            toast.success("Device unblocked.");
            setSelectedDevice(result.data);
            setConfirmAction(null);
            await loadData(true);
        } catch {
            toast.error("Unable to unblock device.");
        } finally {
            setActionLoading(false);
        }
    };

    function resetFilters() {
        setSearch("");
        setRiskLevel("all");
        setStatus("all");
        setCountry("All Countries");
    }

    return (
        <section className="admin-devices-page">
            <header className="admin-devices-heading">
                <div className="admin-devices-heading-copy">
                    <div className="admin-devices-eyebrow">
                        <span className="admin-devices-eyebrow-icon">
                            <Fingerprint size={14} />
                        </span>
                        Security intelligence
                    </div>

                    <h1>Devices & fraud control</h1>

                    <p>
                        Investigate device clusters, identify multi-account patterns,
                        and manage security actions from one focused workspace.
                    </p>
                </div>

                <div className="admin-devices-heading-actions">
                    <span className="admin-devices-environment">
                        <span className="admin-devices-environment-dot" />
                        Mock environment
                    </span>

                    <button
                        type="button"
                        className="admin-device-refresh"
                        onClick={() => loadData(true)}
                        disabled={refreshing}
                    >
                        <RefreshCw
                            size={16}
                            className={refreshing ? "device-spin" : ""}
                        />
                        Refresh data
                    </button>
                </div>
            </header>

            <section className="admin-device-security-banner">
                <div className="admin-device-security-banner-icon">
                    <ShieldCheck size={20} />
                </div>

                <div className="admin-device-security-banner-copy">
                    <strong>Security workspace is running in mock mode</strong>
                    <span>
                        All scans, flags and blocks are local demonstration actions.
                        No real user account or device is being changed.
                    </span>
                </div>

                <div className="admin-device-security-banner-meta">
                    <span>Review before production</span>
                </div>
            </section>

            <section className="admin-device-kpi-grid">
                <article className="admin-device-kpi admin-device-kpi-primary">
                    <div className="admin-device-kpi-topline">
                        <span className="admin-device-kpi-icon">
                            <ShieldAlert size={18} />
                        </span>
                        <span className="admin-device-kpi-caption">Needs attention</span>
                    </div>
                    <strong>{summary?.flaggedAccounts ?? "—"}</strong>
                    <span className="admin-device-kpi-label">Flagged accounts</span>
                    <div className="admin-device-kpi-footer">
                        <span>
                            <Flag size={12} />
                            {insight.flagged} visible in current view
                        </span>
                    </div>
                </article>

                <article className="admin-device-kpi">
                    <div className="admin-device-kpi-topline">
                        <span className="admin-device-kpi-icon blue">
                            <Fingerprint size={18} />
                        </span>
                        <span className="admin-device-kpi-caption">Clusters</span>
                    </div>
                    <strong>{summary?.deviceClusters ?? "—"}</strong>
                    <span className="admin-device-kpi-label">Device clusters</span>
                    <div className="admin-device-kpi-footer">
                        <span>
                            <Users size={12} />
                            {insight.multiAccount} multi-account records
                        </span>
                    </div>
                </article>

                <article className="admin-device-kpi">
                    <div className="admin-device-kpi-topline">
                        <span className="admin-device-kpi-icon red">
                            <Ban size={18} />
                        </span>
                        <span className="admin-device-kpi-caption">Enforced</span>
                    </div>
                    <strong>{summary?.blockedDevices ?? "—"}</strong>
                    <span className="admin-device-kpi-label">Blocked devices</span>
                    <div className="admin-device-kpi-footer">
                        <span>
                            <ShieldX size={12} />
                            {insight.blocked} blocked in current view
                        </span>
                    </div>
                </article>

                <article className="admin-device-kpi">
                    <div className="admin-device-kpi-topline">
                        <span className="admin-device-kpi-icon amber">
                            <AlertTriangle size={18} />
                        </span>
                        <span className="admin-device-kpi-caption">High priority</span>
                    </div>
                    <strong>{summary?.highRiskAccounts ?? "—"}</strong>
                    <span className="admin-device-kpi-label">High-risk accounts</span>
                    <div className="admin-device-kpi-footer">
                        <span>
                            <Gauge size={12} />
                            {insight.critical} critical clusters visible
                        </span>
                    </div>
                </article>

                <article className="admin-device-kpi">
                    <div className="admin-device-kpi-topline">
                        <span className="admin-device-kpi-icon green">
                            <ScanSearch size={18} />
                        </span>
                        <span className="admin-device-kpi-caption">Monitoring</span>
                    </div>
                    <strong>{summary?.recentScans ?? "—"}</strong>
                    <span className="admin-device-kpi-label">Recent scans</span>
                    <div className="admin-device-kpi-footer">
                        <span>
                            <Clock3 size={12} />
                            Latest security activity tracked locally
                        </span>
                    </div>
                </article>
            </section>

            <section className="admin-device-insights-grid">
                <div className="admin-device-insight-main">
                    <div className="admin-device-section-heading">
                        <div>
                            <span className="admin-device-section-kicker">
                                Investigation overview
                            </span>
                            <h2>Risk posture</h2>
                        </div>
                        <span className="admin-device-section-badge">
                            {formatNumber(devices.length)} records
                        </span>
                    </div>

                    <div className="admin-device-posture-grid">
                        <div className="admin-device-posture-card">
                            <div className="admin-device-posture-icon high">
                                <ShieldAlert size={17} />
                            </div>
                            <div>
                                <strong>{formatNumber(insight.critical)}</strong>
                                <span>Critical clusters</span>
                            </div>
                        </div>

                        <div className="admin-device-posture-card">
                            <div className="admin-device-posture-icon warning">
                                <Flag size={17} />
                            </div>
                            <div>
                                <strong>{formatNumber(insight.flagged)}</strong>
                                <span>Flagged in view</span>
                            </div>
                        </div>

                        <div className="admin-device-posture-card">
                            <div className="admin-device-posture-icon neutral">
                                <Users size={17} />
                            </div>
                            <div>
                                <strong>{formatNumber(insight.maxAccounts)}</strong>
                                <span>Largest linked cluster</span>
                            </div>
                        </div>

                        <div className="admin-device-posture-card">
                            <div className="admin-device-posture-icon blue">
                                <Globe2 size={17} />
                            </div>
                            <div>
                                <strong>{insight.topCountry}</strong>
                                <span>Most represented country</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="admin-device-insight-side">
                    <div className="admin-device-side-heading">
                        <Sparkles size={16} />
                        Investigation cues
                    </div>
                    <div className="admin-device-cue-list">
                        <div>
                            <span className="admin-device-cue-dot critical" />
                            <div>
                                <strong>Prioritize critical clusters</strong>
                                <span>Review high-account and previously blocked patterns first.</span>
                            </div>
                        </div>
                        <div>
                            <span className="admin-device-cue-dot warning" />
                            <div>
                                <strong>Verify linked accounts</strong>
                                <span>Use the device details view to inspect account relationships.</span>
                            </div>
                        </div>
                        <div>
                            <span className="admin-device-cue-dot neutral" />
                            <div>
                                <strong>Run a fresh scan</strong>
                                <span>Update the local last-scan timestamp before taking action.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="admin-device-panel">
                <div className="admin-device-panel-header">
                    <div>
                        <span className="admin-device-section-kicker">Security records</span>
                        <h2>Device investigation queue</h2>
                        <p>Search and filter device intelligence, then open a record for a complete security review.</p>
                    </div>
                    <div className="admin-device-panel-count">
                        <MonitorSmartphone size={15} />
                        {formatNumber(devices.length)} visible
                    </div>
                </div>

                <div className="admin-device-toolbar">
                    <div className="device-search">
                        <Search size={17} />
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search fingerprint, UID, username or email..."
                        />
                    </div>

                    <div className="device-filter">
                        <select value={riskLevel} onChange={(event) => setRiskLevel(event.target.value)}>
                            {riskLevels.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                        <ChevronDown size={15} />
                    </div>

                    <div className="device-filter">
                        <select value={status} onChange={(event) => setStatus(event.target.value)}>
                            {statuses.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                        <ChevronDown size={15} />
                    </div>

                    <div className="device-filter">
                        <select value={country} onChange={(event) => setCountry(event.target.value)}>
                            {countries.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                        <ChevronDown size={15} />
                    </div>

                    <button type="button" className="admin-device-filter-reset" onClick={resetFilters}>
                        Reset
                    </button>
                </div>

                <div className="admin-device-table-wrap">
                    {loading ? (
                        <div className="admin-device-loading">
                            <div className="device-spinner" />
                            <strong>Loading security records</strong>
                            <span>Preparing device intelligence for review...</span>
                        </div>
                    ) : devices.length === 0 ? (
                        <div className="admin-device-empty">
                            <div className="admin-device-empty-icon">
                                <Fingerprint size={30} />
                            </div>
                            <h3>No matching device records</h3>
                            <p>Try adjusting your search or security filters.</p>
                            <button type="button" className="admin-device-empty-reset" onClick={resetFilters}>
                                Clear filters
                            </button>
                        </div>
                    ) : (
                        <table className="admin-device-table">
                            <thead>
                                <tr>
                                    <th>Device identity</th>
                                    <th>Accounts</th>
                                    <th>Risk</th>
                                    <th>Risk score</th>
                                    <th>Status</th>
                                    <th>Region</th>
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
                                                    <Fingerprint size={18} />
                                                </div>
                                                <div>
                                                    <strong>{device.deviceFingerprint}</strong>
                                                    <span>{device.deviceInstallId}</span>
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            <div className="device-account-count">
                                                <Users size={15} />
                                                <strong>{formatNumber(device.accountCount)}</strong>
                                                <span>{device.accountCount === 1 ? "account" : "accounts"}</span>
                                            </div>
                                        </td>

                                        <td>
                                            <RiskBadge level={device.riskLevel} />
                                        </td>

                                        <td>
                                            <ScoreBar level={device.riskLevel} />
                                        </td>

                                        <td>
                                            <StatusBadge status={device.status} />
                                        </td>

                                        <td>
                                            <span className="device-country">
                                                <Globe2 size={13} />
                                                {device.country}
                                            </span>
                                        </td>

                                        <td>
                                            <span className="device-date">
                                                {formatDate(device.lastScanAt, {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="device-row-actions">
                                                <button
                                                    type="button"
                                                    onClick={() => openDetails(device.id)}
                                                    title="View investigation"
                                                    aria-label="View investigation"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleScan(device.id)}
                                                    title="Run scan"
                                                    aria-label="Run scan"
                                                    disabled={actionLoading}
                                                >
                                                    <ScanSearch size={16} />
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
                        <span>Showing {formatNumber(devices.length)} security record{devices.length === 1 ? "" : "s"}</span>
                        <span>Local mock intelligence</span>
                    </div>
                )}
            </section>

            {detailsOpen && selectedDevice && (
                <div className="admin-device-modal-backdrop" onMouseDown={() => setDetailsOpen(false)}>
                    <div className="admin-device-modal admin-device-details-modal" onMouseDown={(event) => event.stopPropagation()}>
                        <div className="admin-device-modal-accent" />

                        <div className="admin-device-modal-header">
                            <div>
                                <span>Security investigation</span>
                                <h2>Device cluster details</h2>
                                <p>Review identity, risk indicators and linked accounts before taking action.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setDetailsOpen(false)}
                                className="device-modal-close"
                                aria-label="Close details"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="device-detail-hero">
                            <div className="device-detail-icon">
                                <Fingerprint size={26} />
                            </div>

                            <div className="device-detail-identity">
                                <div className="device-detail-overline">Device fingerprint</div>
                                <strong>{selectedDevice.deviceFingerprint}</strong>
                                <span>{selectedDevice.deviceInstallId}</span>
                            </div>

                            <div className="device-detail-badges">
                                <RiskBadge level={selectedDevice.riskLevel} />
                                <StatusBadge status={selectedDevice.status} />
                            </div>
                        </div>

                        <div className="device-detail-summary">
                            <div>
                                <span>Accounts linked</span>
                                <strong>{formatNumber(selectedDevice.accountCount)}</strong>
                                <small>Associated profiles</small>
                            </div>
                            <div>
                                <span>Country</span>
                                <strong>{selectedDevice.country}</strong>
                                <small>Primary region</small>
                            </div>
                            <div>
                                <span>Last scan</span>
                                <strong>{formatDate(selectedDevice.lastScanAt, { day: "2-digit", month: "short" })}</strong>
                                <small>{formatDate(selectedDevice.lastScanAt, { hour: "2-digit", minute: "2-digit" })}</small>
                            </div>
                            <div>
                                <span>Review owner</span>
                                <strong>{selectedDevice.flaggedBy || "System"}</strong>
                                <small>{selectedDevice.flaggedAt ? formatDate(selectedDevice.flaggedAt) : "Not flagged"}</small>
                            </div>
                        </div>

                        <div className="device-detail-columns">
                            <div className="device-detail-column">
                                <div className="device-detail-card">
                                    <div className="device-detail-card-heading">
                                        <div className="device-detail-card-icon warning">
                                            <AlertTriangle size={16} />
                                        </div>
                                        <div>
                                            <strong>Risk indicators</strong>
                                            <span>Signals detected on this device</span>
                                        </div>
                                    </div>

                                    <ul className="device-indicators">
                                        {selectedDevice.indicators.map((indicator) => (
                                            <li key={indicator}>{indicator}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="device-detail-card">
                                    <div className="device-detail-card-heading">
                                        <div className="device-detail-card-icon blue">
                                            <Gauge size={16} />
                                        </div>
                                        <div>
                                            <strong>Risk assessment</strong>
                                            <span>Current local security posture</span>
                                        </div>
                                    </div>

                                    <ScoreBar level={selectedDevice.riskLevel} />

                                    <div className="device-assessment-copy">
                                        <strong>{getRiskMeta(selectedDevice.riskLevel).label}</strong>
                                        <span>{getRiskMeta(selectedDevice.riskLevel).copy}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="device-detail-column">
                                <div className="device-detail-card">
                                    <div className="device-detail-card-heading">
                                        <div className="device-detail-card-icon green">
                                            <Users size={16} />
                                        </div>
                                        <div>
                                            <strong>Linked accounts</strong>
                                            <span>{selectedDevice.accountCount} account{selectedDevice.accountCount === 1 ? "" : "s"} associated with this device</span>
                                        </div>
                                    </div>

                                    <div className="linked-account-list">
                                        {selectedDevice.accounts.map((account) => (
                                            <div className="linked-account" key={account.uid}>
                                                <div className="linked-account-avatar">
                                                    <UserRound size={16} />
                                                </div>
                                                <div className="linked-account-main">
                                                    <strong>{account.username}</strong>
                                                    <span>{account.email}</span>
                                                    <small>{account.uid}</small>
                                                </div>
                                                <span className={`linked-account-status ${account.status}`}>
                                                    {account.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="device-detail-card device-detail-metadata-card">
                                    <div className="device-detail-card-heading">
                                        <div className="device-detail-card-icon neutral">
                                            <MonitorSmartphone size={16} />
                                        </div>
                                        <div>
                                            <strong>Identifiers</strong>
                                            <span>Reference values for investigation</span>
                                        </div>
                                    </div>

                                    <div className="device-identifier-list">
                                        <div>
                                            <span>Fingerprint</span>
                                            <strong>{selectedDevice.deviceFingerprint}</strong>
                                        </div>
                                        <div>
                                            <span>Install ID</span>
                                            <strong>{selectedDevice.deviceInstallId}</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {selectedDevice.flagReason && (
                            <div className="device-flag-reason">
                                <div className="device-flag-reason-icon">
                                    <Flag size={15} />
                                </div>
                                <div>
                                    <strong>Current flag reason</strong>
                                    <p>{selectedDevice.flagReason}</p>
                                </div>
                            </div>
                        )}

                        <div className="device-modal-actions">
                            <button
                                type="button"
                                className="device-secondary-btn"
                                onClick={() => handleScan(selectedDevice.id)}
                                disabled={actionLoading}
                            >
                                <ScanSearch size={16} />
                                Run scan
                            </button>

                            {selectedDevice.status === "blocked" ? (
                                <button
                                    type="button"
                                    className="device-secondary-btn"
                                    onClick={() => setConfirmAction({ type: "unblock", device: selectedDevice })}
                                    disabled={actionLoading}
                                >
                                    <ShieldCheck size={16} />
                                    Unblock
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="device-danger-btn"
                                    onClick={() => setConfirmAction({ type: "block", device: selectedDevice })}
                                    disabled={actionLoading}
                                >
                                    <Ban size={16} />
                                    Block device
                                </button>
                            )}

                            {selectedDevice.status === "flagged" ? (
                                <button
                                    type="button"
                                    className="device-secondary-btn"
                                    onClick={() => handleClearFlag(selectedDevice.id)}
                                    disabled={actionLoading}
                                >
                                    <CheckCircle2 size={16} />
                                    Clear flag
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="device-warning-btn"
                                    onClick={() => setFlagModalOpen(true)}
                                    disabled={actionLoading}
                                >
                                    <Flag size={16} />
                                    Flag for review
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {flagModalOpen && selectedDevice && (
                <div className="admin-device-modal-backdrop admin-device-modal-layer-top" onMouseDown={() => setFlagModalOpen(false)}>
                    <div className="admin-device-modal admin-device-small-modal" onMouseDown={(event) => event.stopPropagation()}>
                        <div className="admin-device-modal-accent" />
                        <div className="admin-device-modal-header">
                            <div>
                                <span>Security action</span>
                                <h2>Flag device for review</h2>
                                <p>Record a concise reason so the next administrator can understand the action.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setFlagModalOpen(false)}
                                className="device-modal-close"
                                aria-label="Close flag dialog"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="device-action-context">
                            <div className="device-action-context-icon">
                                <Fingerprint size={17} />
                            </div>
                            <div>
                                <strong>{selectedDevice.deviceFingerprint}</strong>
                                <span>{selectedDevice.accountCount} linked account{selectedDevice.accountCount === 1 ? "" : "s"} · {selectedDevice.country}</span>
                            </div>
                        </div>

                        <div className="device-field-group">
                            <label htmlFor="flagReason">Review reason</label>
                            <textarea
                                id="flagReason"
                                value={flagReason}
                                onChange={(event) => setFlagReason(event.target.value)}
                                placeholder="Example: Multiple active accounts share the same device fingerprint."
                                rows={5}
                            />
                        </div>

                        <div className="device-modal-actions">
                            <button type="button" className="device-secondary-btn" onClick={() => setFlagModalOpen(false)}>
                                Cancel
                            </button>
                            <button type="button" className="device-warning-btn" onClick={handleFlag} disabled={actionLoading}>
                                <Flag size={16} />
                                {actionLoading ? "Flagging..." : "Flag device"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {confirmAction && (
                <div className="admin-device-modal-backdrop admin-device-modal-layer-top" onMouseDown={() => setConfirmAction(null)}>
                    <div className="admin-device-confirm-modal" onMouseDown={(event) => event.stopPropagation()}>
                        <div className={`admin-device-confirm-icon ${confirmAction.type === "block" ? "danger" : "success"}`}>
                            {confirmAction.type === "block" ? <Ban size={22} /> : <ShieldCheck size={22} />}
                        </div>

                        <span className="admin-device-confirm-kicker">Security action</span>
                        <h2>{confirmAction.type === "block" ? "Block this device?" : "Unblock this device?"}</h2>
                        <p>
                            {confirmAction.type === "block"
                                ? `This mock action will block the device and mark all ${confirmAction.device.accountCount} linked account${confirmAction.device.accountCount === 1 ? "" : "s"} as blocked.`
                                : "This mock action will remove the blocked state from the device and return it to flagged review status."}
                        </p>

                        <div className="admin-device-confirm-record">
                            <Fingerprint size={16} />
                            <div>
                                <strong>{confirmAction.device.deviceFingerprint}</strong>
                                <span>{confirmAction.device.country} · {confirmAction.device.deviceInstallId}</span>
                            </div>
                        </div>

                        <div className="admin-device-confirm-actions">
                            <button type="button" className="device-secondary-btn" onClick={() => setConfirmAction(null)} disabled={actionLoading}>
                                Cancel
                            </button>
                            <button
                                type="button"
                                className={confirmAction.type === "block" ? "device-danger-btn" : "device-success-btn"}
                                onClick={() =>
                                    confirmAction.type === "block"
                                        ? handleBlock(confirmAction.device.id)
                                        : handleUnblock(confirmAction.device.id)
                                }
                                disabled={actionLoading}
                            >
                                {confirmAction.type === "block" ? <Ban size={16} /> : <ShieldCheck size={16} />}
                                {actionLoading
                                    ? "Processing..."
                                    : confirmAction.type === "block"
                                        ? "Block device"
                                        : "Unblock device"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
