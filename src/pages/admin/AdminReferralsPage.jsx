import { useEffect, useMemo, useState } from "react";
import {
    AlertTriangle,
    CheckCircle2,
    ChevronDown,
    Clock3,
    Eye,
    Flag,
    Gift,
    RefreshCw,
    Search,
    ShieldCheck,
    TrendingUp,
    Users,
    X,
} from "lucide-react";
import { toast } from "sonner";

import {
    clearAdminReferralFlag,
    flagAdminReferral,
    getAdminReferralMilestones,
    getAdminReferralRecord,
    getAdminReferralRecords,
    getAdminReferralSummary,
} from "../../services/mock/adminService";

import "./admin-referrals.css";


function formatNumber(value) {
    return new Intl.NumberFormat("en-US").format(value);
}


function formatDate(date) {
    if (!date) return "—";

    return new Intl.DateTimeFormat("en", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(date));
}


function formatSAK(value) {
    return `${formatNumber(value)} SAK`;
}


function statusLabel(status) {
    const labels = {
        successful: "Successful",
        pending: "Pending",
        flagged: "Flagged",
    };

    return labels[status] || status;
}


function AdminReferralsPage() {
    const [summary, setSummary] = useState(null);
    const [records, setRecords] = useState([]);
    const [milestones, setMilestones] = useState([]);

    const [filters, setFilters] = useState({
        search: "",
        status: "all",
        country: "all",
    });

    const [selectedRecord, setSelectedRecord] =
        useState(null);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [actionLoading, setActionLoading] =
        useState(false);


    const loadData = async (refresh = false) => {
        try {
            if (refresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const [
                summaryResult,
                recordsResult,
                milestoneResult,
            ] = await Promise.all([
                getAdminReferralSummary(),
                getAdminReferralRecords(filters),
                getAdminReferralMilestones(),
            ]);

            if (summaryResult.success) {
                setSummary(summaryResult.data);
            }

            if (recordsResult.success) {
                setRecords(recordsResult.data);
            }

            if (milestoneResult.success) {
                setMilestones(milestoneResult.data);
            }
        } catch (error) {
            console.error(error);
            toast.error(
                "Unable to load referral management data."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };


    useEffect(() => {
        loadData();
    }, [
        filters.search,
        filters.status,
        filters.country,
    ]);


    const countries = useMemo(() => {
        return [
            ...new Set(
                records.map((record) => record.country)
            ),
        ];
    }, [records]);


    const handleFilter = (key, value) => {
        setFilters((current) => ({
            ...current,
            [key]: value,
        }));
    };


    const handleFlag = async (record) => {
        try {
            setActionLoading(true);

            const result = record.flagged
                ? await clearAdminReferralFlag(record.id)
                : await flagAdminReferral(
                    record.id,
                    "Flagged for administrative review."
                );

            if (!result.success) {
                toast.error(result.message);
                return;
            }

            toast.success(result.message);

            setSelectedRecord(null);

            await loadData(true);
        } catch (error) {
            console.error(error);
            toast.error(
                "Unable to update referral flag."
            );
        } finally {
            setActionLoading(false);
        }
    };


    const openRecord = async (record) => {
        try {
            const result =
                await getAdminReferralRecord(record.id);

            if (result.success) {
                setSelectedRecord(result.data);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error(
                "Unable to open referral details."
            );
        }
    };


    const stats = [
        {
            label: "Total referrals",
            value: formatNumber(
                summary?.totalReferrals ?? 0
            ),
            icon: Users,
        },
        {
            label: "Successful",
            value: formatNumber(
                summary?.successfulReferrals ?? 0
            ),
            icon: CheckCircle2,
        },
        {
            label: "Pending",
            value: formatNumber(
                summary?.pendingReferrals ?? 0
            ),
            icon: Clock3,
        },
        {
            label: "Referral earnings",
            value: formatSAK(
                summary?.totalReferralEarnings ?? 0
            ),
            icon: Gift,
        },
        {
            label: "Conversion rate",
            value: `${summary?.conversionRate ?? 0}%`,
            icon: TrendingUp,
        },
        {
            label: "Flagged",
            value: formatNumber(
                summary?.flaggedReferrals ?? 0
            ),
            icon: Flag,
        },
    ];


    return (
        <section className="admin-referrals-page">

            <header className="admin-referrals-header">

                <div>
                    <div className="admin-referrals-eyebrow">
                        <ShieldCheck size={15} />
                        Referral operations
                    </div>

                    <h1>Referral management</h1>

                    <p>
                        Monitor referral activity, rewards,
                        milestones and referral records.
                    </p>
                </div>


                <div className="admin-referrals-header-actions">

                    <span className="admin-referrals-demo">
                        Mock data only
                    </span>

                    <button
                        type="button"
                        className="admin-referrals-refresh"
                        onClick={() => loadData(true)}
                        disabled={refreshing}
                    >
                        <RefreshCw
                            size={16}
                            className={
                                refreshing
                                    ? "admin-referrals-spin"
                                    : ""
                            }
                        />
                        Refresh
                    </button>

                </div>

            </header>


            <div className="admin-referrals-stats">

                {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <div
                            className="admin-referrals-stat"
                            key={stat.label}
                        >
                            <div className="admin-referrals-stat-icon">
                                <Icon size={19} />
                            </div>

                            <div>
                                <span>{stat.label}</span>
                                <strong>{stat.value}</strong>
                            </div>
                        </div>
                    );
                })}

            </div>


            <div className="admin-referrals-grid">

                <div className="admin-referrals-panel">

                    <div className="admin-referrals-panel-heading">
                        <div>
                            <h2>Referral records</h2>
                            <p>
                                Review individual referral
                                relationships and activity.
                            </p>
                        </div>

                        <span>
                            {records.length} records
                        </span>
                    </div>


                    <div className="admin-referrals-toolbar">

                        <div className="admin-referrals-search">
                            <Search size={17} />

                            <input
                                type="search"
                                placeholder="Search referrals..."
                                value={filters.search}
                                onChange={(event) =>
                                    handleFilter(
                                        "search",
                                        event.target.value
                                    )
                                }
                            />
                        </div>


                        <div className="admin-referrals-select">

                            <select
                                value={filters.status}
                                onChange={(event) =>
                                    handleFilter(
                                        "status",
                                        event.target.value
                                    )
                                }
                            >
                                <option value="all">
                                    All statuses
                                </option>

                                <option value="successful">
                                    Successful
                                </option>

                                <option value="pending">
                                    Pending
                                </option>

                                <option value="flagged">
                                    Flagged
                                </option>
                            </select>

                            <ChevronDown size={15} />

                        </div>


                        <div className="admin-referrals-select">

                            <select
                                value={filters.country}
                                onChange={(event) =>
                                    handleFilter(
                                        "country",
                                        event.target.value
                                    )
                                }
                            >
                                <option value="all">
                                    All countries
                                </option>

                                {countries.map(
                                    (country) => (
                                        <option
                                            key={country}
                                            value={country}
                                        >
                                            {country}
                                        </option>
                                    )
                                )}
                            </select>

                            <ChevronDown size={15} />

                        </div>

                    </div>


                    {loading ? (
                        <div className="admin-referrals-state">
                            <RefreshCw
                                size={25}
                                className="admin-referrals-spin"
                            />
                            <span>
                                Loading referral records...
                            </span>
                        </div>
                    ) : records.length === 0 ? (
                        <div className="admin-referrals-state">
                            <Users size={29} />

                            <strong>
                                No referral records
                            </strong>

                            <span>
                                Try adjusting your filters.
                            </span>
                        </div>
                    ) : (
                        <div className="admin-referrals-table-wrap">

                            <table className="admin-referrals-table">

                                <thead>
                                    <tr>
                                        <th>Referrer</th>
                                        <th>Referred user</th>
                                        <th>Country</th>
                                        <th>Status</th>
                                        <th>Reward</th>
                                        <th>Date</th>
                                        <th></th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {records.map(
                                        (record) => (
                                            <tr
                                                key={
                                                    record.id
                                                }
                                            >

                                                <td>
                                                    <div className="admin-referrals-user">

                                                        <div className="admin-referrals-avatar">
                                                            {record.referrerName
                                                                .split(" ")
                                                                .map(
                                                                    (part) =>
                                                                        part[0]
                                                                )
                                                                .join("")
                                                                .slice(
                                                                    0,
                                                                    2
                                                                )}
                                                        </div>

                                                        <div>
                                                            <strong>
                                                                {
                                                                    record.referrerName
                                                                }
                                                            </strong>

                                                            <span>
                                                                @
                                                                {
                                                                    record.referrerUsername
                                                                }
                                                            </span>
                                                        </div>

                                                    </div>
                                                </td>


                                                <td>
                                                    <div className="admin-referrals-user compact">

                                                        <div>
                                                            <strong>
                                                                {
                                                                    record.referredName
                                                                }
                                                            </strong>

                                                            <span>
                                                                {
                                                                    record.referredEmail
                                                                }
                                                            </span>
                                                        </div>

                                                    </div>
                                                </td>


                                                <td>
                                                    <span className="admin-referrals-country">
                                                        {
                                                            record.country
                                                        }
                                                    </span>
                                                </td>


                                                <td>
                                                    <span
                                                        className={`admin-referrals-status status-${record.status}`}
                                                    >
                                                        {
                                                            statusLabel(
                                                                record.status
                                                            )
                                                        }
                                                    </span>
                                                </td>


                                                <td>
                                                    <strong className="admin-referrals-reward">
                                                        {
                                                            record.reward
                                                        }{" "}
                                                        SAK
                                                    </strong>
                                                </td>


                                                <td>
                                                    <span className="admin-referrals-date">
                                                        {
                                                            formatDate(
                                                                record.createdAt
                                                            )
                                                        }
                                                    </span>
                                                </td>


                                                <td>
                                                    <button
                                                        type="button"
                                                        className="admin-referrals-view"
                                                        onClick={() =>
                                                            openRecord(
                                                                record
                                                            )
                                                        }
                                                    >
                                                        <Eye
                                                            size={
                                                                15
                                                            }
                                                        />
                                                        View
                                                    </button>
                                                </td>

                                            </tr>
                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>
                    )}

                </div>


                <aside className="admin-referrals-milestones">

                    <div className="admin-referrals-milestone-heading">

                        <div className="admin-referrals-milestone-icon">
                            <Gift size={19} />
                        </div>

                        <div>
                            <h2>Referral milestones</h2>
                            <p>
                                Current reward configuration
                            </p>
                        </div>

                    </div>


                    <div className="admin-referrals-milestone-list">

                        {milestones.map(
                            (milestone) => (
                                <div
                                    className="admin-referrals-milestone"
                                    key={
                                        milestone.id
                                    }
                                >
                                    <div>
                                        <strong>
                                            {
                                                milestone.label
                                            }
                                        </strong>

                                        <span>
                                            {
                                                milestone.referrals
                                            }{" "}
                                            referral
                                            {milestone.referrals !==
                                            1
                                                ? "s"
                                                : ""}
                                        </span>
                                    </div>

                                    <b>
                                        +
                                        {
                                            milestone.reward
                                        }{" "}
                                        SAK
                                    </b>
                                </div>
                            )
                        )}

                    </div>


                    <div className="admin-referrals-milestone-note">
                        <AlertTriangle size={16} />

                        <span>
                            These values are presentation-only
                            while the application is using mock
                            services.
                        </span>
                    </div>

                </aside>

            </div>


            {selectedRecord && (
                <div
                    className="admin-referrals-modal-backdrop"
                    onMouseDown={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            setSelectedRecord(null);
                        }
                    }}
                >

                    <div className="admin-referrals-modal">

                        <div className="admin-referrals-modal-header">

                            <div>
                                <span>
                                    Referral details
                                </span>

                                <h2>
                                    Referral relationship
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedRecord(
                                        null
                                    )
                                }
                            >
                                <X size={19} />
                            </button>

                        </div>


                        <div className="admin-referrals-modal-body">

                            <div className="admin-referrals-relationship">

                                <div className="admin-referrals-person">

                                    <div className="admin-referrals-avatar large">
                                        {selectedRecord.referrerName
                                            .split(" ")
                                            .map(
                                                (part) =>
                                                    part[0]
                                            )
                                            .join("")
                                            .slice(
                                                0,
                                                2
                                            )}
                                    </div>

                                    <strong>
                                        {
                                            selectedRecord.referrerName
                                        }
                                    </strong>

                                    <span>
                                        Referrer
                                    </span>

                                </div>


                                <div className="admin-referrals-relationship-line">
                                    <TrendingUp
                                        size={17}
                                    />
                                </div>


                                <div className="admin-referrals-person">

                                    <div className="admin-referrals-avatar large">
                                        {selectedRecord.referredName
                                            .split(" ")
                                            .map(
                                                (part) =>
                                                    part[0]
                                            )
                                            .join("")
                                            .slice(
                                                0,
                                                2
                                            )}
                                    </div>

                                    <strong>
                                        {
                                            selectedRecord.referredName
                                        }
                                    </strong>

                                    <span>
                                        Referred user
                                    </span>

                                </div>

                            </div>


                            <div className="admin-referrals-detail-grid">

                                <div>
                                    <span>
                                        Referral ID
                                    </span>

                                    <strong>
                                        {
                                            selectedRecord.id
                                        }
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Status
                                    </span>

                                    <strong>
                                        {statusLabel(
                                            selectedRecord.status
                                        )}
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Country
                                    </span>

                                    <strong>
                                        {
                                            selectedRecord.country
                                        }
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Source
                                    </span>

                                    <strong>
                                        {
                                            selectedRecord.source
                                        }
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Referral reward
                                    </span>

                                    <strong>
                                        {
                                            selectedRecord.reward
                                        }{" "}
                                        SAK
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Milestone bonus
                                    </span>

                                    <strong>
                                        {
                                            selectedRecord.milestoneBonus
                                        }{" "}
                                        SAK
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Created
                                    </span>

                                    <strong>
                                        {formatDate(
                                            selectedRecord.createdAt
                                        )}
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Completed
                                    </span>

                                    <strong>
                                        {formatDate(
                                            selectedRecord.completedAt
                                        )}
                                    </strong>
                                </div>

                            </div>


                            {selectedRecord.flagged && (
                                <div className="admin-referrals-flag-note">

                                    <AlertTriangle
                                        size={17}
                                    />

                                    <div>
                                        <strong>
                                            Referral flagged
                                        </strong>

                                        <span>
                                            {
                                                selectedRecord.flagReason
                                            }
                                        </span>
                                    </div>

                                </div>
                            )}

                        </div>


                        <div className="admin-referrals-modal-actions">

                            <button
                                type="button"
                                className={
                                    selectedRecord.flagged
                                        ? "admin-referrals-action success"
                                        : "admin-referrals-action warning"
                                }
                                onClick={() =>
                                    handleFlag(
                                        selectedRecord
                                    )
                                }
                                disabled={
                                    actionLoading
                                }
                            >
                                {selectedRecord.flagged ? (
                                    <>
                                        <CheckCircle2
                                            size={16}
                                        />
                                        Clear flag
                                    </>
                                ) : (
                                    <>
                                        <Flag
                                            size={16}
                                        />
                                        Flag referral
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                className="admin-referrals-action secondary"
                                onClick={() =>
                                    setSelectedRecord(
                                        null
                                    )
                                }
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </section>
    );
}


export default AdminReferralsPage;