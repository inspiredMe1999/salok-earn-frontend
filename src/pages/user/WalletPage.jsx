import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowDownLeft,
    ArrowUpRight,
    BarChart3,
    CheckCircle2,
    ChevronRight,
    Clock3,
    CreditCard,
    DollarSign,
    History,
    Loader2,
    RefreshCw,
    ShieldCheck,
    Wallet as WalletIcon,
    XCircle,
} from "lucide-react";

import walletService from "../../services/mock/walletService";

import "./wallet.css";

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function formatNumber(value, decimals = 2) {
    return Number(value || 0).toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
}

function formatSAK(value) {
    return `${formatNumber(value)} SAK`;
}

function formatDate(date) {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "—";
    }

    return parsedDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function getTransactionIcon(type) {
    if (type === "withdrawal") {
        return ArrowDownLeft;
    }

    return ArrowUpRight;
}

function getTransactionStatusClass(status) {
    switch (status) {
        case "completed":
            return "wallet-status-success";

        case "pending":
            return "wallet-status-pending";

        case "rejected":
            return "wallet-status-danger";

        case "refunded":
            return "wallet-status-refunded";

        default:
            return "";
    }
}

function getStatusIcon(status) {
    switch (status) {
        case "completed":
            return CheckCircle2;

        case "pending":
            return Clock3;

        case "rejected":
            return XCircle;

        default:
            return Clock3;
    }
}

/*
|--------------------------------------------------------------------------
| Stat Card
|--------------------------------------------------------------------------
*/

function WalletStatCard({
    icon: Icon,
    label,
    value,
    description,
    className = "",
}) {
    return (
        <div className={`wallet-stat-card ${className}`}>
            <div className="wallet-stat-top">
                <div className="wallet-stat-icon">
                    <Icon size={20} strokeWidth={2} />
                </div>
            </div>

            <div className="wallet-stat-value">
                {value}
            </div>

            <div className="wallet-stat-label">
                {label}
            </div>

            {description && (
                <div className="wallet-stat-description">
                    {description}
                </div>
            )}
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Transaction Row
|--------------------------------------------------------------------------
*/

function TransactionRow({ transaction }) {
    const Icon = getTransactionIcon(transaction.type);

    const isCredit =
        transaction.direction === "credit";

    return (
        <div className="wallet-transaction-row">
            <div className="wallet-transaction-icon">
                <Icon
                    size={18}
                    strokeWidth={2}
                />
            </div>

            <div className="wallet-transaction-main">
                <div className="wallet-transaction-title">
                    {transaction.title}
                </div>

                <div className="wallet-transaction-description">
                    {transaction.description}
                </div>

                <div className="wallet-transaction-meta">
                    <span>
                        {formatDate(transaction.date)}
                    </span>

                    {transaction.reference && (
                        <>
                            <span className="wallet-meta-dot">
                                •
                            </span>

                            <span>
                                {transaction.reference}
                            </span>
                        </>
                    )}
                </div>
            </div>

            <div className="wallet-transaction-right">
                <div
                    className={`wallet-transaction-amount ${isCredit
                            ? "wallet-amount-credit"
                            : "wallet-amount-debit"
                        }`}
                >
                    {isCredit ? "+" : "-"}
                    {formatNumber(
                        transaction.amount
                    )}{" "}
                    SAK
                </div>

                <span
                    className={`wallet-status ${getTransactionStatusClass(
                        transaction.status
                    )}`}
                >
                    {transaction.status}
                </span>
            </div>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Earnings Category Row
|--------------------------------------------------------------------------
*/

function EarningsCategory({ category }) {
    return (
        <div className="wallet-category-row">
            <div className="wallet-category-left">
                <div className="wallet-category-icon">
                    {category.icon === "trivia" && (
                        <BarChart3 size={18} />
                    )}

                    {category.icon === "surveys" && (
                        <CheckCircle2 size={18} />
                    )}

                    {category.icon === "tasks" && (
                        <History size={18} />
                    )}

                    {category.icon === "offers" && (
                        <DollarSign size={18} />
                    )}

                    {category.icon === "referrals" && (
                        <ArrowUpRight size={18} />
                    )}
                </div>

                <div>
                    <div className="wallet-category-name">
                        {category.name}
                    </div>

                    <div className="wallet-category-percentage">
                        {category.percentage}% of earnings
                    </div>
                </div>
            </div>

            <div className="wallet-category-amount">
                {formatSAK(category.amount)}
            </div>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Withdrawal Status
|--------------------------------------------------------------------------
*/

function WithdrawalStatus({ status }) {
    const StatusIcon = getStatusIcon(status);

    return (
        <span
            className={`wallet-withdrawal-status ${getTransactionStatusClass(
                status
            )}`}
        >
            <StatusIcon size={14} />

            <span>
                {status}
            </span>
        </span>
    );
}

/*
|--------------------------------------------------------------------------
| Withdrawal Row
|--------------------------------------------------------------------------
*/

function WithdrawalRow({ withdrawal }) {
    return (
        <div className="wallet-withdrawal-row">
            <div className="wallet-withdrawal-method-icon">
                <CreditCard size={18} />
            </div>

            <div className="wallet-withdrawal-main">
                <div className="wallet-withdrawal-title">
                    {withdrawal.payoutMethod}
                </div>

                <div className="wallet-withdrawal-meta">
                    {withdrawal.network} •{" "}
                    {formatDate(withdrawal.createdAt)}
                </div>
            </div>

            <div className="wallet-withdrawal-amount">
                <strong>
                    {formatSAK(withdrawal.amount)}
                </strong>

                <span>
                    {withdrawal.usdtAmount
                        ? `${withdrawal.usdtAmount} USDT`
                        : ""}
                </span>
            </div>

            <WithdrawalStatus
                status={withdrawal.status}
            />
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Loading State
|--------------------------------------------------------------------------
*/

function WalletLoading() {
    return (
        <div className="wallet-loading">
            <Loader2
                size={30}
                className="wallet-loading-spinner"
            />

            <p>
                Loading your wallet...
            </p>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Error State
|--------------------------------------------------------------------------
*/

function WalletError({ onRetry }) {
    return (
        <div className="wallet-error">
            <div className="wallet-error-icon">
                <RefreshCw size={22} />
            </div>

            <h3>
                We couldn't load your wallet
            </h3>

            <p>
                Something went wrong while loading
                your wallet information.
            </p>

            <button
                type="button"
                className="wallet-primary-button"
                onClick={onRetry}
            >
                <RefreshCw size={17} />
                Try again
            </button>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Wallet Page
|--------------------------------------------------------------------------
*/

function WalletPage() {
    const [pageData, setPageData] = useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    /*
    |--------------------------------------------------------------------------
    | Load wallet
    |--------------------------------------------------------------------------
    */

    async function loadWallet() {
        try {
            setLoading(true);
            setError("");

            const response =
                await walletService.getWalletPageData();

            if (!response?.success) {
                throw new Error(
                    response?.message ||
                    "Unable to load wallet."
                );
            }

            setPageData(response.data);
        } catch (err) {
            console.error(
                "Wallet loading error:",
                err
            );

            setError(
                err?.message ||
                "Unable to load wallet."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadWallet();
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Derived values
    |--------------------------------------------------------------------------
    */

    const recentTransactions =
        useMemo(() => {
            return (
                pageData?.transactions || []
            ).slice(0, 6);
        }, [pageData]);

    const recentWithdrawals =
        useMemo(() => {
            return (
                pageData?.recentWithdrawals ||
                []
            ).slice(0, 4);
        }, [pageData]);

    const completedWithdrawals =
        pageData?.withdrawalSummary
            ?.completed || 0;

    const pendingWithdrawals =
        pageData?.withdrawalSummary
            ?.pending || 0;

    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {
        return (
            <div className="wallet-page">
                <WalletLoading />
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Error
    |--------------------------------------------------------------------------
    */

    if (error || !pageData) {
        return (
            <div className="wallet-page">
                <WalletError
                    onRetry={loadWallet}
                />
            </div>
        );
    }

    const {
        summary,
        stats,
        earningCategories,
        withdrawalSummary: withdrawals,
        payoutMethods: methods,
        user,
    } = pageData;

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <div className="wallet-page">

            {/* =========================================================
                PAGE HEADER
            ========================================================== */}

            <header className="wallet-page-header">
                <div>
                    <div className="wallet-eyebrow">
                        <WalletIcon size={15} />
                        My wallet
                    </div>

                    <h1>
                        Your earnings,
                        <span>
                            your control.
                        </span>
                    </h1>

                    <p>
                        Manage your SAK balance,
                        earnings and withdrawals
                        from one place.
                    </p>
                </div>

                <div className="wallet-header-actions">
                    <Link
                        to="/wallet/withdraw"
                        className="wallet-primary-button"
                    >
                        <ArrowDownLeft
                            size={18}
                        />

                        Withdraw
                    </Link>

                    <Link
                        to="/wallet/payout-methods"
                        className="wallet-secondary-button"
                    >
                        <CreditCard
                            size={18}
                        />

                        Payout methods
                    </Link>
                </div>
            </header>


            {/* =========================================================
                BALANCE HERO
            ========================================================== */}

            <section className="wallet-balance-card">

                <div className="wallet-balance-background">
                    <span />
                    <span />
                    <span />
                </div>

                <div className="wallet-balance-content">

                    <div className="wallet-balance-heading">
                        <div>
                            <span className="wallet-balance-label">
                                Available balance
                            </span>

                            <div className="wallet-balance-amount">
                                <strong>
                                    {formatNumber(
                                        summary.availableBalance
                                    )}
                                </strong>

                                <span>
                                    {summary.currency}
                                </span>
                            </div>
                        </div>

                        <div className="wallet-balance-icon">
                            <WalletIcon
                                size={25}
                            />
                        </div>
                    </div>

                    <div className="wallet-balance-bottom">

                        <div className="wallet-balance-detail">
                            <span>
                                Pending
                            </span>

                            <strong>
                                {formatSAK(
                                    summary.pendingBalance
                                )}
                            </strong>
                        </div>

                        <div className="wallet-balance-detail">
                            <span>
                                Total earned
                            </span>

                            <strong>
                                {formatSAK(
                                    summary.totalEarned
                                )}
                            </strong>
                        </div>

                        <div className="wallet-balance-detail">
                            <span>
                                Total withdrawn
                            </span>

                            <strong>
                                {formatSAK(
                                    summary.totalWithdrawn
                                )}
                            </strong>
                        </div>

                    </div>
                </div>
            </section>


            {/* =========================================================
                QUICK STATS
            ========================================================== */}

            <section className="wallet-stats-grid">

                <WalletStatCard
                    icon={DollarSign}
                    label="This month"
                    value={formatSAK(
                        stats.thisMonth
                    )}
                    description="Earned this month"
                />

                <WalletStatCard
                    icon={BarChart3}
                    label="Last month"
                    value={formatSAK(
                        stats.lastMonth
                    )}
                    description="Previous month"
                />

                <WalletStatCard
                    icon={ArrowUpRight}
                    label="Today"
                    value={formatSAK(
                        stats.today
                    )}
                    description="Earned today"
                />

                <WalletStatCard
                    icon={History}
                    label="Transactions"
                    value={formatNumber(
                        stats.totalTransactions,
                        0
                    )}
                    description="Wallet transactions"
                />

            </section>


            {/* =========================================================
                MAIN GRID
            ========================================================== */}

            <div className="wallet-main-grid">

                {/* =====================================================
                    EARNINGS BREAKDOWN
                ====================================================== */}

                <section className="wallet-panel wallet-earnings-panel">

                    <div className="wallet-panel-header">
                        <div>
                            <h2>
                                Earnings breakdown
                            </h2>

                            <p>
                                See where your rewards
                                are coming from.
                            </p>
                        </div>

                        <div className="wallet-panel-header-icon">
                            <BarChart3
                                size={19}
                            />
                        </div>
                    </div>

                    <div className="wallet-category-list">
                        {earningCategories.map(
                            (category) => (
                                <EarningsCategory
                                    key={
                                        category.id
                                    }
                                    category={
                                        category
                                    }
                                />
                            )
                        )}
                    </div>

                    <div className="wallet-lifetime-card">
                        <div>
                            <span>
                                Lifetime earnings
                            </span>

                            <strong>
                                {formatSAK(
                                    summary.lifetimeEarnings
                                )}
                            </strong>
                        </div>

                        <ShieldCheck
                            size={21}
                        />
                    </div>

                </section>


                {/* =====================================================
                    WITHDRAWAL SUMMARY
                ====================================================== */}

                <section className="wallet-panel wallet-withdrawal-summary-panel">

                    <div className="wallet-panel-header">
                        <div>
                            <h2>
                                Withdrawals
                            </h2>

                            <p>
                                Your withdrawal activity
                                at a glance.
                            </p>
                        </div>

                        <Link
                            to="/wallet/withdrawals"
                            className="wallet-panel-link"
                        >
                            View all
                            <ChevronRight
                                size={16}
                            />
                        </Link>
                    </div>

                    <div className="wallet-withdrawal-summary-grid">

                        <div className="wallet-withdrawal-summary-item">
                            <span>
                                Total
                            </span>

                            <strong>
                                {withdrawals.totalWithdrawals}
                            </strong>
                        </div>

                        <div className="wallet-withdrawal-summary-item is-pending">
                            <span>
                                Pending
                            </span>

                            <strong>
                                {pendingWithdrawals}
                            </strong>
                        </div>

                        <div className="wallet-withdrawal-summary-item is-success">
                            <span>
                                Completed
                            </span>

                            <strong>
                                {completedWithdrawals}
                            </strong>
                        </div>

                        <div className="wallet-withdrawal-summary-item is-danger">
                            <span>
                                Rejected
                            </span>

                            <strong>
                                {withdrawals.rejected}
                            </strong>
                        </div>

                    </div>

                    <div className="wallet-withdrawal-total">
                        <div>
                            <span>
                                Total withdrawn
                            </span>

                            <strong>
                                {formatSAK(
                                    withdrawals.totalAmount
                                )}
                            </strong>
                        </div>

                        <div>
                            <span>
                                Pending amount
                            </span>

                            <strong>
                                {formatSAK(
                                    withdrawals.pendingAmount
                                )}
                            </strong>
                        </div>
                    </div>

                    <Link
                        to="/wallet/withdraw"
                        className="wallet-outline-button wallet-full-button"
                    >
                        Withdraw funds
                        <ChevronRight
                            size={17}
                        />
                    </Link>

                </section>

            </div>


            {/* =========================================================
                TRANSACTIONS + PAYOUT METHODS
            ========================================================== */}

            <div className="wallet-content-grid">

                {/* =====================================================
                    RECENT TRANSACTIONS
                ====================================================== */}

                <section className="wallet-panel wallet-transactions-panel">

                    <div className="wallet-panel-header">
                        <div>
                            <h2>
                                Recent transactions
                            </h2>

                            <p>
                                Your latest wallet activity.
                            </p>
                        </div>

                        <Link
                            to="/activity"
                            className="wallet-panel-link"
                        >
                            View activity
                            <ChevronRight
                                size={16}
                            />
                        </Link>
                    </div>

                    {recentTransactions.length >
                        0 ? (
                        <div className="wallet-transactions-list">
                            {recentTransactions.map(
                                (transaction) => (
                                    <TransactionRow
                                        key={
                                            transaction.id
                                        }
                                        transaction={
                                            transaction
                                        }
                                    />
                                )
                            )}
                        </div>
                    ) : (
                        <div className="wallet-empty">
                            <History
                                size={25}
                            />

                            <p>
                                No transactions yet.
                            </p>
                        </div>
                    )}

                </section>


                {/* =====================================================
                    PAYOUT METHODS
                ====================================================== */}

                <section className="wallet-panel wallet-payout-panel">

                    <div className="wallet-panel-header">
                        <div>
                            <h2>
                                Payout methods
                            </h2>

                            <p>
                                Manage where your funds
                                can be sent.
                            </p>
                        </div>

                        <Link
                            to="/wallet/payout-methods"
                            className="wallet-panel-link"
                        >
                            Manage
                            <ChevronRight
                                size={16}
                            />
                        </Link>
                    </div>

                    <div className="wallet-payout-list">

                        {methods
                            .slice(0, 3)
                            .map((method) => (
                                <div
                                    className="wallet-payout-method"
                                    key={
                                        method.id
                                    }
                                >
                                    <div className="wallet-payout-method-icon">
                                        <CreditCard
                                            size={18}
                                        />
                                    </div>

                                    <div className="wallet-payout-method-main">
                                        <strong>
                                            {
                                                method.name
                                            }
                                        </strong>

                                        <span>
                                            {
                                                method.currency
                                            }{" "}
                                            •{" "}
                                            {
                                                method.network
                                            }
                                        </span>

                                        <small>
                                            {
                                                method.maskedAccount
                                            }
                                        </small>
                                    </div>

                                    {method.isDefault && (
                                        <span className="wallet-default-badge">
                                            Default
                                        </span>
                                    )}
                                </div>
                            ))}

                    </div>

                    <Link
                        to="/wallet/payout-methods"
                        className="wallet-outline-button wallet-full-button"
                    >
                        Manage payout methods
                        <ChevronRight
                            size={17}
                        />
                    </Link>

                </section>

            </div>


            {/* =========================================================
                RECENT WITHDRAWALS
            ========================================================== */}

            <section className="wallet-panel wallet-recent-withdrawals-panel">

                <div className="wallet-panel-header">
                    <div>
                        <h2>
                            Recent withdrawals
                        </h2>

                        <p>
                            Track the latest requests
                            made from your wallet.
                        </p>
                    </div>

                    <Link
                        to="/wallet/withdrawals"
                        className="wallet-panel-link"
                    >
                        View withdrawals
                        <ChevronRight
                            size={16}
                        />
                    </Link>
                </div>

                {recentWithdrawals.length >
                    0 ? (
                    <div className="wallet-withdrawals-list">
                        {recentWithdrawals.map(
                            (withdrawal) => (
                                <WithdrawalRow
                                    key={
                                        withdrawal.id
                                    }
                                    withdrawal={
                                        withdrawal
                                    }
                                />
                            )
                        )}
                    </div>
                ) : (
                    <div className="wallet-empty">
                        <ArrowDownLeft
                            size={25}
                        />

                        <p>
                            No withdrawals yet.
                        </p>
                    </div>
                )}

            </section>


            {/* =========================================================
                SECURITY NOTE
            ========================================================== */}

            <section className="wallet-security-note">

                <div className="wallet-security-icon">
                    <ShieldCheck
                        size={21}
                    />
                </div>

                <div>
                    <strong>
                        Your wallet is protected
                    </strong>

                    <p>
                        Keep your account secure and
                        make sure your payout details
                        are always correct before
                        requesting a withdrawal.
                    </p>
                </div>

                <Link to="/security">
                    Security settings
                    <ChevronRight
                        size={16}
                    />
                </Link>

            </section>

        </div>
    );
}

export default WalletPage;