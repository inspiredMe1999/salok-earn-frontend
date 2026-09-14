import { useEffect, useState } from "react";
import {
    ArrowDownLeft,
    ArrowLeft,
    Check,
    CheckCircle2,
    Clock3,
    Copy,
    ExternalLink,
    RefreshCw,
    ShieldCheck,
    WalletCards,
    XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Link, useNavigate, useParams } from "react-router-dom";

import walletService from "../../services/mock/walletService";

import "./wallet.css";
import "./withdrawal-details.css";

import Loader from "../../components/common/Loader";

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
        month: "long",
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

function getStatusClass(status) {
    return `withdrawal-detail-status withdrawal-detail-status--${status}`;
}

function getProvider(withdrawal) {
    return (
        withdrawal?.payoutMethod ||
        withdrawal?.provider ||
        "Payout method"
    );
}

function getNetwork(withdrawal) {
    return withdrawal?.network || "—";
}

function getReference(withdrawal) {
    return (
        withdrawal?.reference ||
        withdrawal?.id ||
        "—"
    );
}

function getAccount(withdrawal) {
    return (
        withdrawal?.account ||
        withdrawal?.maskedAccount ||
        "••••••••"
    );
}

function LoadingState() {
    return (
        <div className="withdrawal-detail-loading">
            <Loader
                size="lg"
                label="Loading withdrawal details..."
            />
        </div>
    );
}

function ErrorState({ message, onRetry }) {
    return (
        <div className="withdrawal-detail-error">
            <div className="withdrawal-detail-error__icon">
                <XCircle size={26} />
            </div>

            <h2>
                Unable to load withdrawal
            </h2>

            <p>
                {message ||
                    "We couldn't find this withdrawal."}
            </p>

            <div className="withdrawal-detail-error__actions">
                <button
                    type="button"
                    className="wallet-primary-button"
                    onClick={onRetry}
                >
                    <RefreshCw size={16} />
                    Try again
                </button>

                <Link
                    to="/wallet/withdrawals"
                    className="wallet-secondary-button"
                >
                    Back to history
                </Link>
            </div>
        </div>
    );
}

function InfoItem({
    label,
    value,
    mono = false,
    copyable = false,
    onCopy,
}) {
    return (
        <div className="withdrawal-info-item">
            <span className="withdrawal-info-item__label">
                {label}
            </span>

            <div className="withdrawal-info-item__value-wrap">
                <strong
                    className={
                        mono
                            ? "withdrawal-info-item__mono"
                            : ""
                    }
                >
                    {value}
                </strong>

                {copyable && (
                    <button
                        type="button"
                        onClick={onCopy}
                        title={`Copy ${label.toLowerCase()}`}
                        aria-label={`Copy ${label.toLowerCase()}`}
                    >
                        <Copy size={14} />
                    </button>
                )}
            </div>
        </div>
    );
}

function StatusTimeline({ withdrawal }) {
    const status =
        withdrawal?.status || "pending";

    const isCompleted =
        status === "completed";

    const isRejected =
        status === "rejected";

    const isRefunded =
        status === "refunded";

    return (
        <div className="withdrawal-timeline">
            <div className="withdrawal-timeline__item is-complete">
                <div className="withdrawal-timeline__marker">
                    <Check size={14} />
                </div>

                <div className="withdrawal-timeline__content">
                    <strong>
                        Withdrawal requested
                    </strong>

                    <span>
                        {formatDateTime(
                            withdrawal?.createdAt ||
                            withdrawal?.date
                        )}
                    </span>
                </div>
            </div>

            <div
                className={`withdrawal-timeline__line ${status !== "pending"
                        ? "is-complete"
                        : ""
                    }`}
            />

            <div
                className={`withdrawal-timeline__item ${status !== "pending"
                        ? "is-complete"
                        : "is-current"
                    }`}
            >
                <div className="withdrawal-timeline__marker">
                    {status === "pending" ? (
                        <Clock3 size={14} />
                    ) : (
                        <Check size={14} />
                    )}
                </div>

                <div className="withdrawal-timeline__content">
                    <strong>
                        {isRejected
                            ? "Withdrawal rejected"
                            : isRefunded
                                ? "Withdrawal refunded"
                                : isCompleted
                                    ? "Withdrawal processed"
                                    : "Processing withdrawal"}
                    </strong>

                    <span>
                        {isCompleted ||
                            isRejected ||
                            isRefunded
                            ? formatDateTime(
                                withdrawal?.completedAt ||
                                withdrawal?.updatedAt ||
                                withdrawal?.date
                            )
                            : "Your withdrawal is being reviewed."}
                    </span>
                </div>
            </div>

            {!isRejected && !isRefunded && (
                <>
                    <div
                        className={`withdrawal-timeline__line ${isCompleted
                                ? "is-complete"
                                : ""
                            }`}
                    />

                    <div
                        className={`withdrawal-timeline__item ${isCompleted
                                ? "is-complete"
                                : "is-upcoming"
                            }`}
                    >
                        <div className="withdrawal-timeline__marker">
                            {isCompleted ? (
                                <Check size={14} />
                            ) : (
                                <WalletCards size={14} />
                            )}
                        </div>

                        <div className="withdrawal-timeline__content">
                            <strong>
                                Funds delivered
                            </strong>

                            <span>
                                {isCompleted
                                    ? "Funds have been sent to your payout method."
                                    : "Funds will be delivered once processing is complete."}
                            </span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default function WithdrawalDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [withdrawal, setWithdrawal] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    async function loadWithdrawal() {
        try {
            setLoading(true);
            setError("");

            const response =
                await walletService.getWithdrawal(
                    id
                );

            if (!response?.success) {
                throw new Error(
                    response?.message ||
                    "Unable to load withdrawal."
                );
            }

            if (!response.data) {
                throw new Error(
                    "Withdrawal not found."
                );
            }

            setWithdrawal(response.data);
        } catch (err) {
            console.error(
                "Failed to load withdrawal:",
                err
            );

            setError(
                err?.message ||
                "We couldn't load this withdrawal."
            );

            setWithdrawal(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (id) {
            loadWithdrawal();
        }
    }, [id]);

    async function handleCopy(value, message) {
        if (!value) {
            return;
        }

        try {
            if (
                navigator.clipboard &&
                window.isSecureContext
            ) {
                await navigator.clipboard.writeText(
                    String(value)
                );
            } else {
                const textarea =
                    document.createElement(
                        "textarea"
                    );

                textarea.value = String(value);

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
                message || "Copied successfully."
            );
        } catch (err) {
            console.error(
                "Failed to copy:",
                err
            );

            toast.error(
                "Unable to copy."
            );
        }
    }

    if (loading) {
        return (
            <div className="withdrawal-details-page">
                <LoadingState />
            </div>
        );
    }

    if (error || !withdrawal) {
        return (
            <div className="withdrawal-details-page">
                <ErrorState
                    message={error}
                    onRetry={loadWithdrawal}
                />
            </div>
        );
    }

    const status =
        withdrawal?.status || "pending";

    const StatusIcon =
        getStatusIcon(status);

    const amount =
        Number(withdrawal?.amount || 0);

    const usdtAmount =
        Number(
            withdrawal?.usdtAmount || 0
        );

    const reference =
        getReference(withdrawal);

    const account =
        getAccount(withdrawal);

    return (
        <div className="withdrawal-details-page">
            <header className="withdrawal-details-header">
                <div>
                    <button
                        type="button"
                        className="wallet-back-button"
                        onClick={() =>
                            navigate(
                                "/wallet/withdrawals"
                            )
                        }
                    >
                        <ArrowLeft size={17} />
                        Back to withdrawals
                    </button>

                    <div className="withdrawal-details-title">
                        <span>
                            Wallet
                        </span>

                        <h1>
                            Withdrawal Details
                        </h1>

                        <p>
                            Review the details and
                            current status of your
                            withdrawal request.
                        </p>
                    </div>
                </div>

                <Link
                    to="/wallet/withdraw"
                    className="wallet-primary-button"
                >
                    <ArrowDownLeft size={17} />
                    New withdrawal
                </Link>
            </header>

            <div className="wallet-demo-notice">
                <div className="wallet-demo-notice__icon">
                    <ShieldCheck size={18} />
                </div>

                <div>
                    <strong>
                        Demo wallet mode
                    </strong>

                    <span>
                        This withdrawal is mock
                        data for frontend review.
                        No real funds are being
                        transferred.
                    </span>
                </div>
            </div>

            <section className="withdrawal-detail-hero">
                <div className="withdrawal-detail-hero__left">
                    <div className="withdrawal-detail-hero__icon">
                        <ArrowDownLeft size={24} />
                    </div>

                    <div>
                        <span>
                            Withdrawal request
                        </span>

                        <h2>
                            {formatSAK(amount)}
                        </h2>

                        <p>
                            {formatUSDT(
                                usdtAmount
                            )}
                        </p>
                    </div>
                </div>

                <div
                    className={getStatusClass(
                        status
                    )}
                >
                    <StatusIcon size={16} />
                    {getStatusLabel(status)}
                </div>
            </section>

            <div className="withdrawal-details-grid">
                <section className="withdrawal-detail-card">
                    <div className="withdrawal-detail-card__header">
                        <div>
                            <span>
                                Transaction
                            </span>

                            <h2>
                                Withdrawal information
                            </h2>
                        </div>
                    </div>

                    <div className="withdrawal-info-grid">
                        <InfoItem
                            label="Amount"
                            value={formatSAK(
                                amount
                            )}
                        />

                        <InfoItem
                            label="USDT amount"
                            value={formatUSDT(
                                usdtAmount
                            )}
                        />

                        <InfoItem
                            label="Payout provider"
                            value={getProvider(
                                withdrawal
                            )}
                        />

                        <InfoItem
                            label="Network"
                            value={getNetwork(
                                withdrawal
                            )}
                        />

                        <InfoItem
                            label="Payout account"
                            value={account}
                            mono
                            copyable
                            onCopy={() =>
                                handleCopy(
                                    account,
                                    "Payout account copied."
                                )
                            }
                        />

                        <InfoItem
                            label="Reference"
                            value={reference}
                            mono
                            copyable
                            onCopy={() =>
                                handleCopy(
                                    reference,
                                    "Withdrawal reference copied."
                                )
                            }
                        />

                        <InfoItem
                            label="Requested"
                            value={formatDateTime(
                                withdrawal?.createdAt ||
                                withdrawal?.date
                            )}
                        />

                        <InfoItem
                            label="Status"
                            value={getStatusLabel(
                                status
                            )}
                        />
                    </div>
                </section>

                <section className="withdrawal-detail-card withdrawal-timeline-card">
                    <div className="withdrawal-detail-card__header">
                        <div>
                            <span>
                                Progress
                            </span>

                            <h2>
                                Withdrawal status
                            </h2>
                        </div>
                    </div>

                    <StatusTimeline
                        withdrawal={
                            withdrawal
                        }
                    />
                </section>
            </div>

            <section className="withdrawal-detail-security">
                <div className="withdrawal-detail-security__icon">
                    <ShieldCheck size={21} />
                </div>

                <div>
                    <h3>
                        Keep your payout details secure
                    </h3>

                    <p>
                        Never share private wallet
                        credentials or recovery
                        information with anyone.
                        Salok Earn will never ask
                        for your wallet password or
                        private key.
                    </p>
                </div>
            </section>

            <div className="withdrawal-detail-actions">
                <Link
                    to="/wallet/withdrawals"
                    className="wallet-secondary-button"
                >
                    <ArrowLeft size={16} />
                    Withdrawal history
                </Link>

                <Link
                    to="/wallet"
                    className="wallet-secondary-button"
                >
                    <WalletCards size={16} />
                    Wallet overview
                </Link>

                <Link
                    to="/wallet/withdraw"
                    className="wallet-primary-button"
                >
                    <ArrowDownLeft size={16} />
                    Make another withdrawal
                </Link>
            </div>
        </div>
    );
}