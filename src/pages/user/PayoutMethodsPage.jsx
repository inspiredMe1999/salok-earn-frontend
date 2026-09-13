import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
    ArrowLeft,
    Check,
    ChevronRight,
    CircleAlert,
    Copy,
    CreditCard,
    LockKeyhole,
    Plus,
    ShieldCheck,
    Trash2,
    WalletCards,
    X,
} from "lucide-react";

import walletService from "../../services/mock/walletService";

import "./wallet.css";
import "./payout-methods.css";

function PayoutMethodsPage() {
    const [payoutMethods, setPayoutMethods] = useState([]);
    const [supportedMethods, setSupportedMethods] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showAddModal, setShowAddModal] = useState(false);

    const [formData, setFormData] = useState({
        provider: "FaucetPay",
        currency: "USDT",
        network: "TRC20",
        account: "",
        makeDefault: false,
    });

    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadPayoutMethods();
    }, []);

    async function loadPayoutMethods() {
        try {
            setLoading(true);
            setError("");

            const [methodsResponse, supportedResponse] =
                await Promise.all([
                    walletService.getPayoutMethods(),
                    walletService.getSupportedPayoutMethods(),
                ]);

            if (!methodsResponse?.success) {
                throw new Error(
                    methodsResponse?.message ||
                    "Unable to load payout methods."
                );
            }

            if (!supportedResponse?.success) {
                throw new Error(
                    supportedResponse?.message ||
                    "Unable to load supported payout methods."
                );
            }

            setPayoutMethods(
                Array.isArray(methodsResponse.data)
                    ? methodsResponse.data
                    : []
            );

            setSupportedMethods(
                Array.isArray(supportedResponse.data)
                    ? supportedResponse.data
                    : []
            );
        } catch (err) {
            console.error(
                "Failed to load payout methods:",
                err
            );

            setError(
                err?.message ||
                "We couldn't load your payout methods. Please try again."
            );

            setPayoutMethods([]);
            setSupportedMethods([]);
        } finally {
            setLoading(false);
        }
    }

    function handleInputChange(event) {
        const { name, value, type, checked } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    function handleNetworkChange(network) {
        setFormData((current) => ({
            ...current,
            network,
        }));
    }

    async function handleAddMethod(event) {
        event.preventDefault();

        if (!formData.account.trim()) {
            toast.error("Enter your payout account.");
            return;
        }

        try {
            setSubmitting(true);

            const response =
                await walletService.addPayoutMethod({
                    provider: formData.provider,
                    currency: formData.currency,
                    network: formData.network,
                    account: formData.account.trim(),
                    makeDefault: formData.makeDefault,
                });

            if (!response?.success) {
                throw new Error(
                    response?.message ||
                    "Unable to add payout method."
                );
            }

            const newMethod = response.data;

            setPayoutMethods((current) => {
                if (newMethod?.isDefault) {
                    return [
                        newMethod,
                        ...current.map((method) => ({
                            ...method,
                            isDefault: false,
                        })),
                    ];
                }

                return [newMethod, ...current];
            });

            setShowAddModal(false);

            setFormData({
                provider: "FaucetPay",
                currency: "USDT",
                network: "TRC20",
                account: "",
                makeDefault: false,
            });

            toast.success(
                response.message ||
                "Payout method added."
            );
        } catch (err) {
            console.error(
                "Failed to add payout method:",
                err
            );

            toast.error(
                err?.message ||
                "Unable to add payout method right now."
            );
        } finally {
            setSubmitting(false);
        }
    }

    async function handleSetDefault(methodId) {
        try {
            const response =
                await walletService.setDefaultPayoutMethod(
                    methodId
                );

            if (!response?.success) {
                throw new Error(
                    response?.message ||
                    "Unable to update default payout method."
                );
            }

            setPayoutMethods((current) =>
                current.map((method) => ({
                    ...method,
                    isDefault: method.id === methodId,
                }))
            );

            toast.success(
                response.message ||
                "Default payout method updated."
            );
        } catch (err) {
            console.error(
                "Failed to set default payout method:",
                err
            );

            toast.error(
                err?.message ||
                "Unable to update the default payout method."
            );
        }
    }

    async function handleRemoveMethod(methodId) {
        const method = payoutMethods.find(
            (item) => item.id === methodId
        );

        if (!method) {
            return;
        }

        if (method.isDefault) {
            toast.error(
                "Set another payout method as default before removing this one."
            );

            return;
        }

        const confirmed = window.confirm(
            "Remove this payout method?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const response =
                await walletService.removePayoutMethod(
                    methodId
                );

            if (!response?.success) {
                throw new Error(
                    response?.message ||
                    "Unable to remove payout method."
                );
            }

            setPayoutMethods((current) =>
                current.filter(
                    (item) => item.id !== methodId
                )
            );

            toast.success(
                response.message ||
                "Payout method removed."
            );
        } catch (err) {
            console.error(
                "Failed to remove payout method:",
                err
            );

            toast.error(
                err?.message ||
                "Unable to remove payout method."
            );
        }
    }

    async function handleCopyAccount(account) {
        try {
            await navigator.clipboard.writeText(account);

            toast.success("Account copied.");
        } catch {
            toast.error("Unable to copy account.");
        }
    }

    function getMethodIcon(method) {
        if (method?.currency === "USDT") {
            return <WalletCards size={24} />;
        }

        return <CreditCard size={24} />;
    }

    if (loading) {
        return (
            <div className="wallet-page payout-methods-page">
                <div className="wallet-loading-card">
                    <div className="wallet-loading-spinner" />

                    <h3>Loading payout methods...</h3>

                    <p>
                        Please wait while we load your saved payout
                        options.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="wallet-page payout-methods-page">
            {/* Page Header */}
            <section className="wallet-page-header">
                <div>
                    <Link
                        to="/wallet"
                        className="wallet-back-link"
                    >
                        <ArrowLeft size={16} />
                        Back to Wallet
                    </Link>

                    <div className="wallet-title-row">
                        <div>
                            <span className="wallet-eyebrow">
                                Wallet
                            </span>

                            <h1>Payout Methods</h1>

                            <p>
                                Manage where your withdrawal
                                requests are sent.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="wallet-primary-button"
                            onClick={() =>
                                setShowAddModal(true)
                            }
                        >
                            <Plus size={18} />
                            Add Method
                        </button>
                    </div>
                </div>
            </section>

            {/* Demo Notice */}
            <section className="payout-demo-notice">
                <div className="payout-demo-icon">
                    <CircleAlert size={20} />
                </div>

                <div>
                    <strong>Demo mode</strong>

                    <p>
                        These payout methods are mock data for the
                        frontend review. No real payout account or
                        funds are being connected.
                    </p>
                </div>
            </section>

            {error && (
                <section className="wallet-error-card">
                    <CircleAlert size={20} />

                    <div>
                        <strong>Something went wrong</strong>

                        <p>{error}</p>
                    </div>

                    <button
                        type="button"
                        onClick={loadPayoutMethods}
                    >
                        Retry
                    </button>
                </section>
            )}

            {/* Saved Methods */}
            <section className="payout-section">
                <div className="payout-section-header">
                    <div>
                        <span className="wallet-eyebrow">
                            Saved
                        </span>

                        <h2>Your payout methods</h2>

                        <p>
                            Choose the account you want to use
                            when withdrawing.
                        </p>
                    </div>

                    <span className="payout-count">
                        {payoutMethods.length} saved
                    </span>
                </div>

                {payoutMethods.length === 0 ? (
                    <div className="payout-empty-card">
                        <div className="payout-empty-icon">
                            <WalletCards size={28} />
                        </div>

                        <h3>No payout methods yet</h3>

                        <p>
                            Add a payout method to make withdrawals
                            easier.
                        </p>

                        <button
                            type="button"
                            className="wallet-primary-button"
                            onClick={() =>
                                setShowAddModal(true)
                            }
                        >
                            <Plus size={18} />
                            Add Payout Method
                        </button>
                    </div>
                ) : (
                    <div className="payout-method-list">
                        {payoutMethods.map((method) => (
                            <article
                                className={`payout-method-card ${method.isDefault
                                    ? "is-default"
                                    : ""
                                    }`}
                                key={method.id}
                            >
                                <div className="payout-method-main">
                                    <div className="payout-method-icon">
                                        {getMethodIcon(method)}
                                    </div>

                                    <div className="payout-method-details">
                                        <div className="payout-method-heading">
                                            <h3>
                                                {method.provider}
                                            </h3>

                                            {method.isDefault && (
                                                <span className="payout-default-badge">
                                                    <Check size={13} />
                                                    Default
                                                </span>
                                            )}
                                        </div>

                                        <div className="payout-method-meta">
                                            <span>
                                                {method.currency}
                                            </span>

                                            <span className="meta-dot">
                                                •
                                            </span>

                                            <span>
                                                {method.network}
                                            </span>

                                            {method.isVerified && (
                                                <>
                                                    <span className="meta-dot">
                                                        •
                                                    </span>

                                                    <span className="verified-label">
                                                        <ShieldCheck
                                                            size={14}
                                                        />
                                                        Verified
                                                    </span>
                                                </>
                                            )}
                                        </div>

                                        <div className="payout-account">
                                            <code>
                                                {method.account}
                                            </code>

                                            <button
                                                type="button"
                                                className="icon-action-button"
                                                onClick={() =>
                                                    handleCopyAccount(
                                                        method.account
                                                    )
                                                }
                                                aria-label="Copy payout account"
                                                title="Copy account"
                                            >
                                                <Copy size={15} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="payout-method-actions">
                                    {!method.isDefault && (
                                        <button
                                            type="button"
                                            className="payout-action-button"
                                            onClick={() =>
                                                handleSetDefault(
                                                    method.id
                                                )
                                            }
                                        >
                                            Set as default
                                        </button>
                                    )}

                                    {!method.isDefault && (
                                        <button
                                            type="button"
                                            className="payout-remove-button"
                                            onClick={() =>
                                                handleRemoveMethod(
                                                    method.id
                                                )
                                            }
                                        >
                                            <Trash2 size={16} />
                                            Remove
                                        </button>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            {/* Supported Methods */}
            <section className="payout-section">
                <div className="payout-section-header">
                    <div>
                        <span className="wallet-eyebrow">
                            Supported
                        </span>

                        <h2>Available payout options</h2>

                        <p>
                            These are the payout configurations
                            currently represented in the demo.
                        </p>
                    </div>
                </div>

                <div className="supported-payout-grid">
                    {supportedMethods.map((method) => (
                        <article
                            className="supported-payout-card"
                            key={`${method.provider}-${method.network}`}
                        >
                            <div className="supported-payout-icon">
                                <WalletCards size={22} />
                            </div>

                            <div>
                                <h3>{method.provider}</h3>

                                <p>
                                    {method.currency} ·{" "}
                                    {method.network}
                                </p>
                            </div>

                            <span className="supported-status">
                                Available
                            </span>
                        </article>
                    ))}
                </div>
            </section>

            {/* Security */}
            <section className="payout-security-card">
                <div className="payout-security-icon">
                    <LockKeyhole size={22} />
                </div>

                <div>
                    <h3>Keep your payout details secure</h3>

                    <p>
                        Only add payout accounts that belong to
                        you. Always double-check the network and
                        destination before submitting a withdrawal.
                    </p>
                </div>

                <ChevronRight
                    size={20}
                    className="payout-security-arrow"
                />
            </section>

            {/* Add Method Modal */}
            {showAddModal && (
                <div
                    className="payout-modal-backdrop"
                    onMouseDown={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            setShowAddModal(false);
                        }
                    }}
                >
                    <div
                        className="payout-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="add-payout-title"
                    >
                        <div className="payout-modal-header">
                            <div>
                                <span className="wallet-eyebrow">
                                    New payout method
                                </span>

                                <h2 id="add-payout-title">
                                    Add payout method
                                </h2>

                                <p>
                                    Add a destination for future
                                    withdrawals.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="modal-close-button"
                                onClick={() =>
                                    setShowAddModal(false)
                                }
                                aria-label="Close"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form
                            className="payout-form"
                            onSubmit={handleAddMethod}
                        >
                            <div className="payout-form-group">
                                <label htmlFor="provider">
                                    Provider
                                </label>

                                <select
                                    id="provider"
                                    name="provider"
                                    value={formData.provider}
                                    onChange={
                                        handleInputChange
                                    }
                                >
                                    <option value="FaucetPay">
                                        FaucetPay
                                    </option>
                                </select>
                            </div>

                            <div className="payout-form-row">
                                <div className="payout-form-group">
                                    <label htmlFor="currency">
                                        Currency
                                    </label>

                                    <select
                                        id="currency"
                                        name="currency"
                                        value={formData.currency}
                                        onChange={
                                            handleInputChange
                                        }
                                    >
                                        <option value="USDT">
                                            USDT
                                        </option>
                                    </select>
                                </div>

                                <div className="payout-form-group">
                                    <label>
                                        Network
                                    </label>

                                    <div className="network-options">
                                        <button
                                            type="button"
                                            className={`network-option ${formData.network ===
                                                "TRC20"
                                                ? "selected"
                                                : ""
                                                }`}
                                            onClick={() =>
                                                handleNetworkChange(
                                                    "TRC20"
                                                )
                                            }
                                        >
                                            <span>
                                                TRC20
                                            </span>

                                            {formData.network ===
                                                "TRC20" && (
                                                    <Check
                                                        size={16}
                                                    />
                                                )}
                                        </button>

                                        <button
                                            type="button"
                                            className={`network-option ${formData.network ===
                                                "ERC20"
                                                ? "selected"
                                                : ""
                                                }`}
                                            onClick={() =>
                                                handleNetworkChange(
                                                    "ERC20"
                                                )
                                            }
                                        >
                                            <span>
                                                ERC20
                                            </span>

                                            {formData.network ===
                                                "ERC20" && (
                                                    <Check
                                                        size={16}
                                                    />
                                                )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="payout-form-group">
                                <label htmlFor="account">
                                    Wallet / Account
                                </label>

                                <input
                                    id="account"
                                    name="account"
                                    type="text"
                                    value={formData.account}
                                    onChange={
                                        handleInputChange
                                    }
                                    placeholder="Enter wallet address or account"
                                    autoComplete="off"
                                />

                                <span className="form-help-text">
                                    Demo input only. Do not enter
                                    real financial information.
                                </span>
                            </div>

                            <label className="default-checkbox">
                                <input
                                    type="checkbox"
                                    name="makeDefault"
                                    checked={
                                        formData.makeDefault
                                    }
                                    onChange={
                                        handleInputChange
                                    }
                                />

                                <span className="checkbox-custom">
                                    {formData.makeDefault && (
                                        <Check size={13} />
                                    )}
                                </span>

                                <span>
                                    Make this my default payout
                                    method
                                </span>
                            </label>

                            <div className="payout-form-security">
                                <ShieldCheck size={17} />

                                <span>
                                    Your payout details are only
                                    used for withdrawal processing
                                    in the eventual live
                                    integration.
                                </span>
                            </div>

                            <div className="payout-modal-actions">
                                <button
                                    type="button"
                                    className="wallet-secondary-button"
                                    onClick={() =>
                                        setShowAddModal(false)
                                    }
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="wallet-primary-button"
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <>
                                            <span className="button-spinner" />
                                            Adding...
                                        </>
                                    ) : (
                                        <>
                                            <Plus size={18} />
                                            Add Method
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PayoutMethodsPage;