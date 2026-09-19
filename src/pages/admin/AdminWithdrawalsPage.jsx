import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
    CheckCircle2,
    CircleDollarSign,
    Eye,
    Filter,
    RefreshCw,
    Search,
    ShieldAlert,
    XCircle,
} from "lucide-react";

import adminService from "../../services/mock/adminService";
import "./admin-withdrawals.css";

function formatNumber(value) {
    return new Intl.NumberFormat("en-US").format(value);
}

function formatAmount(value, currency = "SAK") {
    return `${formatNumber(value)} ${currency}`;
}

function formatDate(value) {
    if (!value) return "—";

    return new Date(value).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
    });
}

function getStatusClass(status) {
    return `withdrawal-status withdrawal-status-${status}`;
}

function getRiskClass(riskLevel) {
    return `withdrawal-risk withdrawal-risk-${riskLevel}`;
}

function AdminWithdrawalsPage() {
    const [withdrawals, setWithdrawals] = useState([]);
    const [summary, setSummary] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [status, setStatus] = useState("all");
    const [riskLevel, setRiskLevel] = useState("all");

    const [selectedIds, setSelectedIds] = useState([]);
    const [selectedWithdrawal, setSelectedWithdrawal] =
        useState(null);

    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState("");

    async function loadWithdrawals() {
        try {
            setLoading(true);
            setError("");

            const [
                withdrawalsResponse,
                summaryResponse,
            ] = await Promise.all([
                adminService.getAdminWithdrawals({
                    searchTerm,
                    status,
                    riskLevel,
                }),
                adminService.getAdminWithdrawalSummary(),
            ]);

            if (!withdrawalsResponse.success) {
                throw new Error(
                    withdrawalsResponse.message ||
                        "Unable to load withdrawals."
                );
            }

            if (!summaryResponse.success) {
                throw new Error(
                    summaryResponse.message ||
                        "Unable to load withdrawal summary."
                );
            }

            setWithdrawals(
                Array.isArray(withdrawalsResponse.data)
                    ? withdrawalsResponse.data
                    : []
            );

            setSummary(summaryResponse.data);
        } catch (err) {
            console.error(
                "Failed to load admin withdrawals:",
                err
            );

            setError(
                err.message ||
                    "Unable to load withdrawal requests."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadWithdrawals();
    }, [searchTerm, status, riskLevel]);

    const allVisibleSelected = useMemo(() => {
        return (
            withdrawals.length > 0 &&
            withdrawals.every((withdrawal) =>
                selectedIds.includes(withdrawal.id)
            )
        );
    }, [withdrawals, selectedIds]);

    function toggleSelectAll() {
        if (allVisibleSelected) {
            setSelectedIds([]);
            return;
        }

        setSelectedIds(
            withdrawals.map((withdrawal) => withdrawal.id)
        );
    }

    function toggleSelect(id) {
        setSelectedIds((current) =>
            current.includes(id)
                ? current.filter((item) => item !== id)
                : [...current, id]
        );
    }

    async function updateStatus(id, nextStatus) {
        const reason =
            nextStatus === "rejected"
                ? "Rejected during mock administrative review."
                : nextStatus === "refunded"
                    ? "Refunded during mock administrative review."
                    : "Approved during mock administrative review.";

        try {
            setProcessing(true);

            const response =
                await adminService.updateAdminWithdrawalStatus(
                    id,
                    nextStatus,
                    reason
                );

            if (!response.success) {
                throw new Error(
                    response.message ||
                        "Unable to update withdrawal."
                );
            }

            toast.success(response.message);
            setSelectedWithdrawal(null);
            await loadWithdrawals();
        } catch (err) {
            toast.error(
                err.message ||
                    "Unable to update withdrawal."
            );
        } finally {
            setProcessing(false);
        }
    }

    async function processBatch(nextStatus) {
        if (selectedIds.length === 0) {
            toast.error(
                "Select at least one withdrawal request."
            );
            return;
        }

        try {
            setProcessing(true);

            const response =
                await adminService.batchUpdateAdminWithdrawals(
                    selectedIds,
                    nextStatus,
                    "Updated through mock batch administration."
                );

            if (!response.success) {
                throw new Error(
                    response.message ||
                        "Unable to process selected withdrawals."
                );
            }

            toast.success(response.message);
            setSelectedIds([]);
            await loadWithdrawals();
        } catch (err) {
            toast.error(
                err.message ||
                    "Unable to process selected withdrawals."
            );
        } finally {
            setProcessing(false);
        }
    }

    function resetFilters() {
        setSearchTerm("");
        setStatus("all");
        setRiskLevel("all");
        setSelectedIds([]);
    }

    return (
        <section className="admin-withdrawals-page">
            <div className="admin-page-heading">
                <div>
                    <span className="admin-eyebrow">
                        Financial operations
                    </span>

                    <h1>Withdrawal management</h1>

                    <p>
                        Review and manage user withdrawal
                        requests in the mock administration
                        environment.
                    </p>
                </div>

                <div className="admin-heading-actions">
                    <span className="admin-demo-badge">
                        Mock data only
                    </span>

                    <button
                        type="button"
                        className="admin-secondary-button"
                        onClick={loadWithdrawals}
                        disabled={loading}
                    >
                        <RefreshCw size={16} />
                        Refresh
                    </button>
                </div>
            </div>

            {summary && (
                <div className="withdrawal-summary-grid">
                    <div className="withdrawal-summary-card">
                        <span>Total requests</span>
                        <strong>
                            {formatNumber(
                                summary.totalWithdrawals
                            )}
                        </strong>
                        <small>All-time requests</small>
                    </div>

                    <div className="withdrawal-summary-card warning">
                        <span>Pending requests</span>
                        <strong>
                            {formatNumber(
                                summary.pendingWithdrawals
                            )}
                        </strong>
                        <small>
                            {formatAmount(
                                summary.pendingAmount
                            )}{" "}
                            awaiting review
                        </small>
                    </div>

                    <div className="withdrawal-summary-card success">
                        <span>Completed</span>
                        <strong>
                            {formatNumber(
                                summary.completedWithdrawals
                            )}
                        </strong>
                        <small>
                            {formatAmount(
                                summary.completedAmount
                            )}
                        </small>
                    </div>

                    <div className="withdrawal-summary-card danger">
                        <span>Rejected</span>
                        <strong>
                            {formatNumber(
                                summary.rejectedWithdrawals
                            )}
                        </strong>
                        <small>
                            {formatNumber(
                                summary.refundedWithdrawals
                            )}{" "}
                            refunded
                        </small>
                    </div>
                </div>
            )}

            <div className="withdrawal-toolbar">
                <div className="withdrawal-search">
                    <Search size={18} />

                    <input
                        type="search"
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(event.target.value)
                        }
                        placeholder="Search user, email, ID or reference..."
                    />
                </div>

                <div className="withdrawal-filter">
                    <Filter size={16} />

                    <select
                        value={status}
                        onChange={(event) =>
                            setStatus(event.target.value)
                        }
                    >
                        <option value="all">
                            All statuses
                        </option>
                        <option value="pending">
                            Pending
                        </option>
                        <option value="completed">
                            Completed
                        </option>
                        <option value="rejected">
                            Rejected
                        </option>
                        <option value="refunded">
                            Refunded
                        </option>
                    </select>
                </div>

                <select
                    className="withdrawal-filter-select"
                    value={riskLevel}
                    onChange={(event) =>
                        setRiskLevel(event.target.value)
                    }
                >
                    <option value="all">All risk levels</option>
                    <option value="low">Low risk</option>
                    <option value="medium">Medium risk</option>
                    <option value="high">High risk</option>
                </select>

                <button
                    type="button"
                    className="admin-text-button"
                    onClick={resetFilters}
                >
                    Reset
                </button>
            </div>

            {selectedIds.length > 0 && (
                <div className="withdrawal-batch-bar">
                    <strong>
                        {selectedIds.length} selected
                    </strong>

                    <div>
                        <button
                            type="button"
                            onClick={() =>
                                processBatch("completed")
                            }
                            disabled={processing}
                        >
                            <CheckCircle2 size={15} />
                            Approve
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                processBatch("rejected")
                            }
                            disabled={processing}
                        >
                            <XCircle size={15} />
                            Reject
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                processBatch("refunded")
                            }
                            disabled={processing}
                        >
                            Refund
                        </button>
                    </div>
                </div>
            )}

            <div className="admin-panel withdrawal-table-panel">
                <div className="admin-panel-heading">
                    <div>
                        <h2>Withdrawal requests</h2>
                        <p>
                            {withdrawals.length} request(s)
                            currently displayed
                        </p>
                    </div>

                    <span className="admin-panel-label">
                        Review queue
                    </span>
                </div>

                {loading ? (
                    <div className="admin-loading-state">
                        Loading withdrawal requests...
                    </div>
                ) : error ? (
                    <div className="admin-error-state">
                        <ShieldAlert size={22} />
                        <p>{error}</p>

                        <button
                            type="button"
                            onClick={loadWithdrawals}
                        >
                            Try again
                        </button>
                    </div>
                ) : withdrawals.length === 0 ? (
                    <div className="admin-empty-state">
                        No withdrawal requests match your filters.
                    </div>
                ) : (
                    <div className="withdrawal-table-wrapper">
                        <table className="withdrawal-table">
                            <thead>
                                <tr>
                                    <th>
                                        <input
                                            type="checkbox"
                                            checked={
                                                allVisibleSelected
                                            }
                                            onChange={
                                                toggleSelectAll
                                            }
                                            aria-label="Select all withdrawals"
                                        />
                                    </th>
                                    <th>Request</th>
                                    <th>User</th>
                                    <th>Amount</th>
                                    <th>Risk</th>
                                    <th>Status</th>
                                    <th>Requested</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {withdrawals.map(
                                    (withdrawal) => (
                                        <tr
                                            key={
                                                withdrawal.id
                                            }
                                        >
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(
                                                        withdrawal.id
                                                    )}
                                                    onChange={() =>
                                                        toggleSelect(
                                                            withdrawal.id
                                                        )
                                                    }
                                                    aria-label={`Select ${withdrawal.id}`}
                                                />
                                            </td>

                                            <td>
                                                <strong>
                                                    {
                                                        withdrawal.id
                                                    }
                                                </strong>
                                                <small>
                                                    {
                                                        withdrawal.reference
                                                    }
                                                </small>
                                            </td>

                                            <td>
                                                <strong>
                                                    {
                                                        withdrawal.displayName
                                                    }
                                                </strong>
                                                <small>
                                                    @
                                                    {
                                                        withdrawal.username
                                                    }
                                                </small>
                                            </td>

                                            <td>
                                                <strong>
                                                    {formatAmount(
                                                        withdrawal.amount
                                                    )}
                                                </strong>
                                                <small>
                                                    {formatAmount(
                                                        withdrawal.payoutAmount,
                                                        withdrawal.payoutCurrency
                                                    )}
                                                </small>
                                            </td>

                                            <td>
                                                <span
                                                    className={getRiskClass(
                                                        withdrawal.riskLevel
                                                    )}
                                                >
                                                    {
                                                        withdrawal.riskLevel
                                                    }
                                                </span>
                                            </td>

                                            <td>
                                                <span
                                                    className={getStatusClass(
                                                        withdrawal.status
                                                    )}
                                                >
                                                    {
                                                        withdrawal.status
                                                    }
                                                </span>
                                            </td>

                                            <td>
                                                {formatDate(
                                                    withdrawal.requestedAt
                                                )}
                                            </td>

                                            <td>
                                                <button
                                                    type="button"
                                                    className="withdrawal-view-button"
                                                    onClick={() =>
                                                        setSelectedWithdrawal(
                                                            withdrawal
                                                        )
                                                    }
                                                >
                                                    <Eye
                                                        size={16}
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

            {selectedWithdrawal && (
                <div
                    className="withdrawal-modal-backdrop"
                    onClick={() =>
                        setSelectedWithdrawal(null)
                    }
                >
                    <div
                        className="withdrawal-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="withdrawal-modal-header">
                            <div>
                                <span className="admin-eyebrow">
                                    Withdrawal details
                                </span>

                                <h2>
                                    {
                                        selectedWithdrawal.id
                                    }
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedWithdrawal(
                                        null
                                    )
                                }
                                aria-label="Close details"
                            >
                                ×
                            </button>
                        </div>

                        <div className="withdrawal-detail-grid">
                            <div>
                                <span>User</span>
                                <strong>
                                    {
                                        selectedWithdrawal.displayName
                                    }
                                </strong>
                                <small>
                                    {
                                        selectedWithdrawal.email
                                    }
                                </small>
                            </div>

                            <div>
                                <span>Request amount</span>
                                <strong>
                                    {formatAmount(
                                        selectedWithdrawal.amount
                                    )}
                                </strong>
                                <small>
                                    {formatAmount(
                                        selectedWithdrawal.payoutAmount,
                                        selectedWithdrawal.payoutCurrency
                                    )}
                                </small>
                            </div>

                            <div>
                                <span>Payout provider</span>
                                <strong>
                                    {
                                        selectedWithdrawal.payoutProvider
                                    }
                                </strong>
                                <small>
                                    {
                                        selectedWithdrawal.network
                                    }
                                </small>
                            </div>

                            <div>
                                <span>Payout account</span>
                                <strong>
                                    {
                                        selectedWithdrawal.account
                                    }
                                </strong>
                                <small>
                                    {
                                        selectedWithdrawal.payoutCurrency
                                    }
                                </small>
                            </div>

                            <div>
                                <span>Risk level</span>
                                <strong>
                                    {
                                        selectedWithdrawal.riskLevel
                                    }
                                </strong>
                            </div>

                            <div>
                                <span>Requested at</span>
                                <strong>
                                    {formatDate(
                                        selectedWithdrawal.requestedAt
                                    )}
                                </strong>
                            </div>
                        </div>

                        <div className="withdrawal-detail-note">
                            <strong>Administrative notes</strong>
                            <p>
                                {selectedWithdrawal.notes ||
                                    "No administrative notes have been added."}
                            </p>
                        </div>

                        <div className="withdrawal-modal-actions">
                            {selectedWithdrawal.status ===
                                "pending" && (
                                <>
                                    <button
                                        type="button"
                                        className="withdrawal-action approve"
                                        disabled={processing}
                                        onClick={() =>
                                            updateStatus(
                                                selectedWithdrawal.id,
                                                "completed"
                                            )
                                        }
                                    >
                                        <CheckCircle2
                                            size={16}
                                        />
                                        Approve
                                    </button>

                                    <button
                                        type="button"
                                        className="withdrawal-action reject"
                                        disabled={processing}
                                        onClick={() =>
                                            updateStatus(
                                                selectedWithdrawal.id,
                                                "rejected"
                                            )
                                        }
                                    >
                                        <XCircle size={16} />
                                        Reject
                                    </button>
                                </>
                            )}

                            {selectedWithdrawal.status ===
                                "completed" && (
                                <button
                                    type="button"
                                    className="withdrawal-action refund"
                                    disabled={processing}
                                    onClick={() =>
                                        updateStatus(
                                            selectedWithdrawal.id,
                                            "refunded"
                                        )
                                    }
                                >
                                    <CircleDollarSign
                                        size={16}
                                    />
                                    Refund
                                </button>
                            )}

                            <button
                                type="button"
                                className="admin-secondary-button"
                                onClick={() =>
                                    setSelectedWithdrawal(
                                        null
                                    )
                                }
                            >
                                Close
                            </button>
                        </div>

                        <p className="withdrawal-demo-note">
                            These actions update mock data only.
                            No real payout is processed.
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
}

export default AdminWithdrawalsPage;