import { useEffect, useMemo, useState } from "react";
import {
    ArrowDownLeft,
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Copy,
    ExternalLink,
    Filter,
    RefreshCw,
    Search,
    WalletCards,
    XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

import walletService from "../../services/mock/walletService";

import "./wallet.css";
import "./withdrawals.css";

import Loader from "../../components/common/Loader";

const STATUS_FILTERS = [
    {
        id: "all",
        label: "All",
    },
    {
        id: "pending",
        label: "Pending",
    },
    {
        id: "completed",
        label: "Completed",
    },
    {
        id: "rejected",
        label: "Rejected",
    },
    {
        id: "refunded",
        label: "Refunded",
    },
];

function formatSAK(amount) {
    return `${Number(amount || 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })} SAK`;
}

function formatUSDT(amount) {
    return `${Number(amount || 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })} USDT`;
}

function formatDate(date) {
    if (!date) {
        return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "—";
    }

    return parsedDate.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function formatDateTime(date) {
    if (!date) {
        return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "—";
    }

    return parsedDate.toLocaleString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

function getStatusIcon(status) {
    switch (status) {
        case "completed":
            return CheckCircle2;

        case "pending":
            return Clock3;

        case "rejected":
            return XCircle;

        case "refunded":
            return RefreshCw;

        default:
            return Clock3;
    }
}

function getStatusLabel(status) {
    switch (status) {
        case "completed":
            return "Completed";

        case "pending":
            return "Pending";

        case "rejected":
            return "Rejected";

        case "refunded":
            return "Refunded";

        default:
            return "Unknown";
    }
}

function getStatusClass(status) {
    return `withdrawal-status withdrawal-status--${status}`;
}

function getPayoutProvider(withdrawal) {
    return (
        withdrawal?.payoutMethod ||
        withdrawal?.provider ||
        "Payout method"
    );
}

function getReference(withdrawal) {
    return (
        withdrawal?.reference ||
        withdrawal?.id ||
        "—"
    );
}

function getNetwork(withdrawal) {
    return withdrawal?.network || "—";
}

function WithdrawalStatus({ status }) {
    const StatusIcon = getStatusIcon(status);

    return (
        <span className={getStatusClass(status)}>
            <StatusIcon size={14} />
            {getStatusLabel(status)}
        </span>
    );
}

function SummaryCard({
    label,
    value,
    description,
    icon: Icon,
    className = "",
}) {
    return (
        <article
            className={`withdrawal-summary-card ${className}`}
        >
            <div className="withdrawal-summary-card__top">
                <div className="withdrawal-summary-card__icon">
                    <Icon size={19} />
                </div>
            </div>

            <div className="withdrawal-summary-card__value">
                {value}
            </div>

            <div className="withdrawal-summary-card__label">
                {label}
            </div>

            {description && (
                <div className="withdrawal-summary-card__description">
                    {description}
                </div>
            )}
        </article>
    );
}

function WithdrawalCard({
    withdrawal,
    onCopyReference,
}) {
    const amount =
        Number(withdrawal?.amount || 0);

    const usdtAmount =
        Number(withdrawal?.usdtAmount || 0);

    return (
        <article className="withdrawal-card">
            <div className="withdrawal-card__main">
                <div className="withdrawal-card__icon">
                    <ArrowDownLeft size={20} />
                </div>

                <div className="withdrawal-card__identity">
                    <div className="withdrawal-card__title-row">
                        <h3>
                            {getPayoutProvider(
                                withdrawal
                            )}
                        </h3>

                        <WithdrawalStatus
                            status={
                                withdrawal?.status
                            }
                        />
                    </div>

                    <div className="withdrawal-card__meta">
                        <span>
                            {withdrawal?.currency ||
                                "USDT"}
                        </span>

                        <span>•</span>

                        <span>
                            {getNetwork(withdrawal)}
                        </span>

                        <span>•</span>

                        <span>
                            {formatDate(
                                withdrawal?.createdAt ||
                                withdrawal?.date
                            )}
                        </span>
                    </div>
                </div>
            </div>

            <div className="withdrawal-card__amount">
                <strong>
                    {formatSAK(amount)}
                </strong>

                <span>
                    {formatUSDT(usdtAmount)}
                </span>
            </div>

            <div className="withdrawal-card__reference">
                <span>Reference</span>

                <button
                    type="button"
                    onClick={() =>
                        onCopyReference(
                            getReference(
                                withdrawal
                            )
                        )
                    }
                    title="Copy reference"
                >
                    <code>
                        {getReference(withdrawal)}
                    </code>

                    <Copy size={14} />
                </button>
            </div>

            <Link
                to={`/wallet/withdrawals/${withdrawal?.id
                    }`}
                className="withdrawal-card__view"
            >
                View details
                <ExternalLink size={15} />
            </Link>
        </article>
    );
}

function WithdrawalTableRow({
    withdrawal,
    onCopyReference,
}) {
    const amount =
        Number(withdrawal?.amount || 0);

    const usdtAmount =
        Number(withdrawal?.usdtAmount || 0);

    return (
        <div className="withdrawal-table__row">
            <div className="withdrawal-table__cell withdrawal-table__cell--date">
                <strong>
                    {formatDate(
                        withdrawal?.createdAt ||
                        withdrawal?.date
                    )}
                </strong>

                <span>
                    {formatDateTime(
                        withdrawal?.createdAt ||
                        withdrawal?.date
                    )}
                </span>
            </div>

            <div className="withdrawal-table__cell">
                <strong>
                    {getPayoutProvider(
                        withdrawal
                    )}
                </strong>

                <span>
                    {getNetwork(withdrawal)}
                </span>
            </div>

            <div className="withdrawal-table__cell withdrawal-table__cell--amount">
                <strong>
                    {formatSAK(amount)}
                </strong>

                <span>
                    {formatUSDT(usdtAmount)}
                </span>
            </div>

            <div className="withdrawal-table__cell">
                <WithdrawalStatus
                    status={withdrawal?.status}
                />
            </div>

            <div className="withdrawal-table__cell withdrawal-table__cell--reference">
                <button
                    type="button"
                    onClick={() =>
                        onCopyReference(
                            getReference(
                                withdrawal
                            )
                        )
                    }
                    title="Copy reference"
                >
                    <code>
                        {getReference(withdrawal)}
                    </code>

                    <Copy size={14} />
                </button>
            </div>

            <div className="withdrawal-table__cell withdrawal-table__cell--action">
                <Link
                    to={`/wallet/withdrawals/${withdrawal?.id
                        }`}
                    aria-label="View withdrawal details"
                    title="View details"
                >
                    <ExternalLink size={17} />
                </Link>
            </div>
        </div>
    );
}

function LoadingState() {
    return (
        <div className="withdrawals-loading">
            <Loader
                size="lg"
                label="Loading your withdrawals..."
            />
        </div>
    );
}

function EmptyState({ hasFilters }) {
    return (
        <div className="withdrawals-empty">
            <div className="withdrawals-empty__icon">
                <WalletCards size={28} />
            </div>

            <h3>
                {hasFilters
                    ? "No withdrawals found"
                    : "No withdrawals yet"}
            </h3>

            <p>
                {hasFilters
                    ? "Try changing your search or status filter."
                    : "Your withdrawal history will appear here once you make a withdrawal."}
            </p>

            {!hasFilters && (
                <Link
                    to="/wallet/withdraw"
                    className="wallet-primary-button"
                >
                    Make a withdrawal
                </Link>
            )}
        </div>
    );
}

function ErrorState({ message, onRetry }) {
    return (
        <div className="withdrawals-error">
            <div className="withdrawals-error__icon">
                <XCircle size={25} />
            </div>

            <h3>
                Unable to load withdrawals
            </h3>

            <p>
                {message ||
                    "Something went wrong while loading your withdrawal history."}
            </p>

            <button
                type="button"
                className="wallet-primary-button"
                onClick={onRetry}
            >
                <RefreshCw size={16} />
                Try again
            </button>
        </div>
    );
}

export default function WithdrawalsPage() {
    const navigate = useNavigate();

    const [withdrawals, setWithdrawals] =
        useState([]);

    const [summary, setSummary] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("all");

    const [searchTerm, setSearchTerm] =
        useState("");

    const [showFilters, setShowFilters] =
        useState(false);

    async function loadWithdrawals() {
        try {
            setLoading(true);
            setError("");

            const [
                withdrawalsResponse,
                summaryResponse,
            ] = await Promise.all([
                walletService.getRecentWithdrawals(),
                walletService.getWithdrawalSummary(),
            ]);

            if (!withdrawalsResponse?.success) {
                throw new Error(
                    withdrawalsResponse?.message ||
                    "Unable to load withdrawals."
                );
            }

            if (!summaryResponse?.success) {
                throw new Error(
                    summaryResponse?.message ||
                    "Unable to load withdrawal summary."
                );
            }

            setWithdrawals(
                Array.isArray(
                    withdrawalsResponse.data
                )
                    ? withdrawalsResponse.data
                    : []
            );

            setSummary(
                summaryResponse.data || null
            );
        } catch (err) {
            console.error(
                "Failed to load withdrawals:",
                err
            );

            setError(
                err?.message ||
                "We couldn't load your withdrawals."
            );

            setWithdrawals([]);
            setSummary(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadWithdrawals();
    }, []);

    async function handleCopyReference(reference) {
        if (!reference) {
            return;
        }

        try {
            if (
                navigator.clipboard &&
                window.isSecureContext
            ) {
                await navigator.clipboard.writeText(
                    reference
                );
            } else {
                const textarea =
                    document.createElement(
                        "textarea"
                    );

                textarea.value = reference;
                document.body.appendChild(
                    textarea
                );

                textarea.select();

                document.execCommand("copy");

                document.body.removeChild(
                    textarea
                );
            }

            toast.success(
                "Withdrawal reference copied."
            );
        } catch (err) {
            console.error(
                "Failed to copy reference:",
                err
            );

            toast.error(
                "Unable to copy reference."
            );
        }
    }

    const filteredWithdrawals = useMemo(() => {
        const normalizedSearch =
            searchTerm
                .trim()
                .toLowerCase();

        return withdrawals.filter(
            (withdrawal) => {
                const matchesStatus =
                    statusFilter === "all" ||
                    withdrawal?.status ===
                    statusFilter;

                if (!matchesStatus) {
                    return false;
                }

                if (!normalizedSearch) {
                    return true;
                }

                const searchableText = [
                    withdrawal?.id,
                    withdrawal?.reference,
                    withdrawal?.payoutMethod,
                    withdrawal?.provider,
                    withdrawal?.network,
                    withdrawal?.status,
                    withdrawal?.currency,
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();

                return searchableText.includes(
                    normalizedSearch
                );
            }
        );
    }, [
        withdrawals,
        statusFilter,
        searchTerm,
    ]);

    const hasFilters =
        statusFilter !== "all" ||
        searchTerm.trim() !== "";

    const totalAmount =
        Number(
            summary?.totalAmount || 0
        );

    const pendingAmount =
        Number(
            summary?.pendingAmount || 0
        );

    return (
        <div className="withdrawals-page">
            <header className="wallet-page-header">
                <div>
                    <button
                        type="button"
                        className="wallet-back-button"
                        onClick={() =>
                            navigate("/wallet")
                        }
                    >
                        <ArrowLeft size={17} />
                        Back to Wallet
                    </button>

                    <div className="wallet-page-title">
                        <span className="wallet-page-eyebrow">
                            Wallet
                        </span>

                        <h1>
                            Withdrawal History
                        </h1>

                        <p>
                            Track your withdrawal
                            requests, payouts and
                            transaction history.
                        </p>
                    </div>
                </div>

                <Link
                    to="/wallet/withdraw"
                    className="wallet-primary-button"
                >
                    <ArrowDownLeft size={17} />
                    Withdraw
                </Link>
            </header>

            <div className="wallet-demo-notice">
                <div className="wallet-demo-notice__icon">
                    <WalletCards size={18} />
                </div>

                <div>
                    <strong>
                        Demo wallet mode
                    </strong>

                    <span>
                        Withdrawal records shown
                        here are mock data for
                        frontend review. No real
                        funds are moved.
                    </span>
                </div>
            </div>

            {!loading && !error && (
                <section className="withdrawal-summary-grid">
                    <SummaryCard
                        label="Total withdrawn"
                        value={formatSAK(
                            totalAmount
                        )}
                        description={`${summary?.totalWithdrawals ||
                            0
                            } withdrawal requests`}
                        icon={ArrowDownLeft}
                        className="withdrawal-summary-card--primary"
                    />

                    <SummaryCard
                        label="Completed"
                        value={
                            summary?.completed ||
                            0
                        }
                        description="Successfully processed"
                        icon={CheckCircle2}
                    />

                    <SummaryCard
                        label="Pending"
                        value={
                            summary?.pending ||
                            0
                        }
                        description={`${formatSAK(
                            pendingAmount
                        )} currently pending`}
                        icon={Clock3}
                    />

                    <SummaryCard
                        label="Rejected"
                        value={
                            summary?.rejected ||
                            0
                        }
                        description="Requests not processed"
                        icon={XCircle}
                    />
                </section>
            )}

            <section className="withdrawals-section">
                <div className="withdrawals-section__header">
                    <div>
                        <span className="wallet-section-eyebrow">
                            Transactions
                        </span>

                        <h2>
                            Your withdrawals
                        </h2>
                    </div>

                    <button
                        type="button"
                        className={`withdrawals-filter-toggle ${showFilters
                            ? "is-active"
                            : ""
                            }`}
                        onClick={() =>
                            setShowFilters(
                                (current) =>
                                    !current
                            )
                        }
                    >
                        <Filter size={16} />
                        Filters
                    </button>
                </div>

                <div
                    className={`withdrawals-toolbar ${showFilters
                        ? "is-visible"
                        : ""
                        }`}
                >
                    <div className="withdrawals-search">
                        <Search size={17} />

                        <input
                            type="search"
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(
                                    event.target
                                        .value
                                )
                            }
                            placeholder="Search by reference, provider or network..."
                        />
                    </div>

                    <div className="withdrawals-status-filters">
                        {STATUS_FILTERS.map(
                            (filter) => (
                                <button
                                    type="button"
                                    key={
                                        filter.id
                                    }
                                    className={
                                        statusFilter ===
                                            filter.id
                                            ? "is-active"
                                            : ""
                                    }
                                    onClick={() =>
                                        setStatusFilter(
                                            filter.id
                                        )
                                    }
                                >
                                    {
                                        filter.label
                                    }
                                </button>
                            )
                        )}
                    </div>
                </div>

                {loading && <LoadingState />}

                {!loading && error && (
                    <ErrorState
                        message={error}
                        onRetry={
                            loadWithdrawals
                        }
                    />
                )}

                {!loading &&
                    !error &&
                    filteredWithdrawals.length ===
                    0 && (
                        <EmptyState
                            hasFilters={
                                hasFilters
                            }
                        />
                    )}

                {!loading &&
                    !error &&
                    filteredWithdrawals.length >
                    0 && (
                        <>
                            <div className="withdrawals-mobile-list">
                                {filteredWithdrawals.map(
                                    (
                                        withdrawal
                                    ) => (
                                        <WithdrawalCard
                                            key={
                                                withdrawal.id
                                            }
                                            withdrawal={
                                                withdrawal
                                            }
                                            onCopyReference={
                                                handleCopyReference
                                            }
                                        />
                                    )
                                )}
                            </div>

                            <div className="withdrawals-table">
                                <div className="withdrawal-table__head">
                                    <span>
                                        Date
                                    </span>

                                    <span>
                                        Payout method
                                    </span>

                                    <span>
                                        Amount
                                    </span>

                                    <span>
                                        Status
                                    </span>

                                    <span>
                                        Reference
                                    </span>

                                    <span />
                                </div>

                                {filteredWithdrawals.map(
                                    (
                                        withdrawal
                                    ) => (
                                        <WithdrawalTableRow
                                            key={
                                                withdrawal.id
                                            }
                                            withdrawal={
                                                withdrawal
                                            }
                                            onCopyReference={
                                                handleCopyReference
                                            }
                                        />
                                    )
                                )}
                            </div>
                        </>
                    )}
            </section>

            {!loading && !error && (
                <section className="withdrawals-footer-card">
                    <div className="withdrawals-footer-card__icon">
                        <CalendarDays size={21} />
                    </div>

                    <div>
                        <h3>
                            Need another withdrawal?
                        </h3>

                        <p>
                            You can start a new
                            withdrawal from your
                            available wallet balance.
                        </p>
                    </div>

                    <Link
                        to="/wallet/withdraw"
                        className="wallet-secondary-button"
                    >
                        Make withdrawal
                    </Link>
                </section>
            )}
        </div>
    );
}