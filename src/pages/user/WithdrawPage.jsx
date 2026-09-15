import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    ArrowDownLeft,
    CheckCircle2,
    ChevronRight,
    CircleAlert,
    Clock3,
    CreditCard,
    Info,
    Loader2,
    ShieldCheck,
    Wallet,
} from "lucide-react";
import { toast } from "sonner";

import walletService from "../../services/mock/walletService";

import "./wallet.css";
import "./withdraw.css";

import Loader from "../../components/common/Loader";
import WithdrawalStatusOverlay from "../../components/wallet/WithdrawalStatusOverlay";
import ConfettiBurst from "../../components/common/ConfettiBurst";

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


/*
|--------------------------------------------------------------------------
| Withdraw Page
|--------------------------------------------------------------------------
*/

function WithdrawPage() {
    const navigate = useNavigate();

    const [summary, setSummary] = useState(null);
    const [methods, setMethods] = useState([]);
    const [limits, setLimits] = useState(null);

    const [amount, setAmount] = useState("");
    const [selectedMethodId, setSelectedMethodId] =
        useState("");

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitPhase, setSubmitPhase] = useState(null);
    // null | "transferring" | "celebrating" | "failed"

    const [error, setError] = useState("");
    const [submittedWithdrawal, setSubmittedWithdrawal] =
        useState(null);

    /*
    |--------------------------------------------------------------------------
    | Load withdrawal data
    |--------------------------------------------------------------------------
    */

    async function loadData() {
        try {
            setLoading(true);
            setError("");

            const [
                summaryResponse,
                methodsResponse,
                limitsResponse,
            ] = await Promise.all([
                walletService.getWalletSummary(),
                walletService.getPayoutMethods(),
                walletService.getWithdrawalLimits(),
            ]);

            if (
                !summaryResponse?.success ||
                !methodsResponse?.success ||
                !limitsResponse?.success
            ) {
                throw new Error(
                    "Unable to load withdrawal information."
                );
            }

            setSummary(summaryResponse.data);
            setMethods(methodsResponse.data || []);
            setLimits(limitsResponse.data);

            /*
            |--------------------------------------------------------------------------
            | Automatically select default payout method
            |--------------------------------------------------------------------------
            */

            const defaultMethod =
                (methodsResponse.data || []).find(
                    (method) => method.isDefault
                );

            if (defaultMethod) {
                setSelectedMethodId(
                    defaultMethod.id
                );
            } else if (
                methodsResponse.data?.length
            ) {
                setSelectedMethodId(
                    methodsResponse.data[0].id
                );
            }
        } catch (err) {
            console.error(
                "Withdrawal page error:",
                err
            );

            setError(
                err?.message ||
                "Unable to load withdrawal information."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Selected payout method
    |--------------------------------------------------------------------------
    */

    const selectedMethod = useMemo(() => {
        return methods.find(
            (method) =>
                method.id === selectedMethodId
        );
    }, [methods, selectedMethodId]);

    /*
    |--------------------------------------------------------------------------
    | Amount
    |--------------------------------------------------------------------------
    */

    const numericAmount = Number(amount);

    const hasAmount =
        amount.trim() !== "" &&
        Number.isFinite(numericAmount);

    const minimumAmount =
        Number(limits?.minimum || 0);

    const maximumAmount =
        Number(limits?.maximum || 0);

    const availableBalance =
        Number(summary?.availableBalance || 0);

    const exceedsBalance =
        hasAmount &&
        numericAmount > availableBalance;

    const belowMinimum =
        hasAmount &&
        numericAmount < minimumAmount;

    const aboveMaximum =
        hasAmount &&
        numericAmount > maximumAmount;

    const isValidAmount =
        hasAmount &&
        numericAmount > 0 &&
        !exceedsBalance &&
        !belowMinimum &&
        !aboveMaximum;

    /*
    |--------------------------------------------------------------------------
    | Estimated payout
    |--------------------------------------------------------------------------
    |
    | This is a visual estimate for the mock UI only.
    | It is not a live conversion rate.
    |
    */

    const estimatedUSDT =
        isValidAmount
            ? numericAmount / 100
            : 0;

    /*
    |--------------------------------------------------------------------------
    | Quick amount buttons
    |--------------------------------------------------------------------------
    */

    function setQuickAmount(value) {
        const safeValue = Math.min(
            Number(value),
            availableBalance
        );

        setAmount(
            safeValue > 0
                ? String(safeValue)
                : ""
        );
    }

    function handleAmountChange(event) {
        const value =
            event.target.value;

        /*
        |--------------------------------------------------------------------------
        | Allow empty input
        |--------------------------------------------------------------------------
        */

        if (value === "") {
            setAmount("");
            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Only allow numbers and decimal values
        |--------------------------------------------------------------------------
        */

        if (
            !/^\d*\.?\d{0,2}$/.test(value)
        ) {
            return;
        }

        setAmount(value);
    }

    /*
    |--------------------------------------------------------------------------
    | Submit withdrawal
    |--------------------------------------------------------------------------
    */

    async function handleSubmit(event) {
        event.preventDefault();

        if (!selectedMethodId) {
            toast.error(
                "Please select a payout method."
            );

            return;
        }

        if (!hasAmount) {
            toast.error(
                "Enter a withdrawal amount."
            );

            return;
        }

        if (exceedsBalance) {
            toast.error(
                "Withdrawal amount exceeds your available balance."
            );

            return;
        }

        if (belowMinimum) {
            toast.error(
                `Minimum withdrawal is ${formatSAK(
                    minimumAmount
                )}.`
            );

            return;
        }

        if (aboveMaximum) {
            toast.error(
                `Maximum withdrawal is ${formatSAK(
                    maximumAmount
                )}.`
            );

            return;
        }

        try {
            setSubmitting(true);
            setSubmitPhase("transferring");

            /*
             * Guarantee the transfer animation is on screen for at
             * least a couple of seconds — without this, a fast mock
             * (or a fast real API) would make it flash by unseen.
             */
            const MIN_TRANSFER_DISPLAY_MS = 2600;

            const minDisplayDelay = new Promise(
                (resolve) =>
                    setTimeout(
                        resolve,
                        MIN_TRANSFER_DISPLAY_MS
                    )
            );

            const [response] = await Promise.all([
                walletService.requestWithdrawal({
                    amount: numericAmount,
                    payoutMethodId:
                        selectedMethodId,
                }),
                minDisplayDelay,
            ]);

            if (!response?.success) {
                setSubmitPhase("failed");

                toast.error(
                    response?.message ||
                    "Withdrawal could not be submitted."
                );

                return;
            }

            setSubmittedWithdrawal(
                response.data
            );

            toast.success(
                "Withdrawal request submitted."
            );

            setSubmitPhase("celebrating");
        } catch (err) {
            console.error(
                "Withdrawal submission error:",
                err
            );

            setSubmitPhase("failed");

            toast.error(
                err?.message ||
                "Something went wrong."
            );
        } finally {
            setSubmitting(false);
        }
    }

    /*
     * Called once a non-looping overlay phase (celebrating/failed)
     * has played through — hides the overlay and reveals whatever
     * is underneath (the success view, or the form again).
     */
    function clearSubmitPhase() {
        setSubmitPhase(null);
    }

    /*
    |--------------------------------------------------------------------------
    | Loading state
    |--------------------------------------------------------------------------
    */

    if (loading) {
        return (
            <div className="withdraw-page">
                <div className="withdraw-loading">
                    <Loader
                        size="lg"
                        label="Loading withdrawal options..."
                    />
                </div>
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Error state
    |--------------------------------------------------------------------------
    */

    if (error) {
        return (
            <div className="withdraw-page">
                <div className="withdraw-error">
                    <CircleAlert size={30} />

                    <h2>
                        Unable to load withdrawal
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        type="button"
                        className="withdraw-primary-button"
                        onClick={loadData}
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Success state
    |--------------------------------------------------------------------------
    */

    if (submittedWithdrawal) {
        return (
            <div className="withdraw-page">

                <WithdrawalStatusOverlay
                    phase={submitPhase}
                    onComplete={clearSubmitPhase}
                />

                {!submitPhase && <ConfettiBurst />}

                <div className="withdraw-success">

                    <div className="withdraw-success-icon">
                        <CheckCircle2
                            size={42}
                        />
                    </div>

                    <span className="withdraw-success-eyebrow">
                        Request submitted
                    </span>

                    <h1>
                        Withdrawal is on its way
                    </h1>

                    <p>
                        Your withdrawal request has
                        been received and is currently
                        being processed.
                    </p>

                    <div className="withdraw-success-card">

                        <div>
                            <span>
                                Amount
                            </span>

                            <strong>
                                {formatSAK(
                                    submittedWithdrawal.amount
                                )}
                            </strong>
                        </div>

                        <div>
                            <span>
                                Status
                            </span>

                            <strong className="withdraw-pending-text">
                                <Clock3
                                    size={15}
                                />
                                Pending
                            </strong>
                        </div>

                        <div>
                            <span>
                                Payout method
                            </span>

                            <strong>
                                {
                                    selectedMethod?.name ||
                                    submittedWithdrawal.payoutMethod
                                }
                            </strong>
                        </div>

                        <div>
                            <span>
                                Reference
                            </span>

                            <strong>
                                {submittedWithdrawal.id}
                            </strong>
                        </div>

                    </div>

                    <div className="withdraw-success-actions">

                        <Link
                            to="/wallet/withdrawals"
                            className="withdraw-primary-button"
                        >
                            View withdrawals
                            <ChevronRight
                                size={17}
                            />
                        </Link>

                        <button
                            type="button"
                            className="withdraw-secondary-button"
                            onClick={() =>
                                navigate("/wallet")
                            }
                        >
                            Back to wallet
                        </button>

                    </div>

                </div>

            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Main page
    |--------------------------------------------------------------------------
    */

    return (
        <div className="withdraw-page">

            <WithdrawalStatusOverlay
                phase={submitPhase}
                onComplete={clearSubmitPhase}
            />

            {/* =========================================================
                HEADER
            ========================================================== */}

            <div className="withdraw-page-header">

                <Link
                    to="/wallet"
                    className="withdraw-back-link"
                >
                    <ArrowLeft size={17} />
                    Back to wallet
                </Link>

                <div className="withdraw-title-row">

                    <div>
                        <div className="withdraw-eyebrow">
                            <ArrowDownLeft
                                size={15}
                            />
                            Wallet withdrawal
                        </div>

                        <h1>
                            Withdraw your earnings
                        </h1>

                        <p>
                            Choose how much you want
                            to withdraw and where you
                            want your funds sent.
                        </p>
                    </div>

                    <div className="withdraw-balance-mini">
                        <span>
                            Available balance
                        </span>

                        <strong>
                            {formatSAK(
                                availableBalance
                            )}
                        </strong>
                    </div>

                </div>

            </div>


            {/* =========================================================
                MAIN LAYOUT
            ========================================================== */}

            <div className="withdraw-layout">

                {/* =====================================================
                    FORM
                ====================================================== */}

                <form
                    className="withdraw-form-card"
                    onSubmit={handleSubmit}
                >

                    {/* =================================================
                        AMOUNT
                    ================================================== */}

                    <section className="withdraw-form-section">

                        <div className="withdraw-section-heading">
                            <div>
                                <h2>
                                    Withdrawal amount
                                </h2>

                                <p>
                                    Enter the amount you
                                    want to withdraw.
                                </p>
                            </div>

                            <Wallet size={19} />
                        </div>

                        <div
                            className={`withdraw-amount-input ${exceedsBalance ||
                                belowMinimum ||
                                aboveMaximum
                                ? "has-error"
                                : ""
                                }`}
                        >
                            <input
                                type="text"
                                inputMode="decimal"
                                value={amount}
                                onChange={
                                    handleAmountChange
                                }
                                placeholder="0.00"
                                aria-label="Withdrawal amount"
                            />

                            <span>
                                SAK
                            </span>
                        </div>

                        <div className="withdraw-available-row">
                            <span>
                                Available
                            </span>

                            <button
                                type="button"
                                onClick={() =>
                                    setQuickAmount(
                                        availableBalance
                                    )
                                }
                            >
                                Use maximum
                            </button>
                        </div>

                        {hasAmount &&
                            exceedsBalance && (
                                <div className="withdraw-field-error">
                                    <CircleAlert
                                        size={14}
                                    />

                                    Amount exceeds your
                                    available balance.
                                </div>
                            )}

                        {hasAmount &&
                            belowMinimum && (
                                <div className="withdraw-field-error">
                                    <CircleAlert
                                        size={14}
                                    />

                                    Minimum withdrawal is{" "}
                                    {formatSAK(
                                        minimumAmount
                                    )}
                                    .
                                </div>
                            )}

                        {hasAmount &&
                            aboveMaximum && (
                                <div className="withdraw-field-error">
                                    <CircleAlert
                                        size={14}
                                    />

                                    Maximum withdrawal is{" "}
                                    {formatSAK(
                                        maximumAmount
                                    )}
                                    .
                                </div>
                            )}

                        <div className="withdraw-quick-amounts">

                            {[500, 1000, 1500].map(
                                (value) => (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() =>
                                            setQuickAmount(
                                                value
                                            )
                                        }
                                        disabled={
                                            availableBalance <
                                            value
                                        }
                                    >
                                        {formatNumber(
                                            value,
                                            0
                                        )}{" "}
                                        SAK
                                    </button>
                                )
                            )}

                            <button
                                type="button"
                                onClick={() =>
                                    setQuickAmount(
                                        availableBalance
                                    )
                                }
                                disabled={
                                    availableBalance <= 0
                                }
                            >
                                Max
                            </button>

                        </div>

                    </section>


                    {/* =================================================
                        PAYOUT METHOD
                    ================================================== */}

                    <section className="withdraw-form-section">

                        <div className="withdraw-section-heading">
                            <div>
                                <h2>
                                    Payout method
                                </h2>

                                <p>
                                    Select where you want
                                    the withdrawal sent.
                                </p>
                            </div>

                            <CreditCard size={19} />
                        </div>

                        {methods.length > 0 ? (
                            <div className="withdraw-method-list">

                                {methods.map(
                                    (method) => {
                                        const selected =
                                            method.id ===
                                            selectedMethodId;

                                        return (
                                            <button
                                                type="button"
                                                key={
                                                    method.id
                                                }
                                                className={`withdraw-method-card ${selected
                                                    ? "is-selected"
                                                    : ""
                                                    }`}
                                                onClick={() =>
                                                    setSelectedMethodId(
                                                        method.id
                                                    )
                                                }
                                            >

                                                <div className="withdraw-method-icon">
                                                    <CreditCard
                                                        size={
                                                            19
                                                        }
                                                    />
                                                </div>

                                                <div className="withdraw-method-content">

                                                    <div className="withdraw-method-name">
                                                        {
                                                            method.name
                                                        }

                                                        {method.isDefault && (
                                                            <span>
                                                                Default
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="withdraw-method-network">
                                                        {
                                                            method.currency
                                                        }{" "}
                                                        •{" "}
                                                        {
                                                            method.network
                                                        }
                                                    </div>

                                                    <div className="withdraw-method-account">
                                                        {
                                                            method.maskedAccount
                                                        }
                                                    </div>

                                                </div>

                                                <div
                                                    className={`withdraw-radio ${selected
                                                        ? "is-selected"
                                                        : ""
                                                        }`}
                                                >
                                                    {selected && (
                                                        <span />
                                                    )}
                                                </div>

                                            </button>
                                        );
                                    }
                                )}

                            </div>
                        ) : (
                            <div className="withdraw-no-method">

                                <CreditCard
                                    size={24}
                                />

                                <h3>
                                    No payout methods
                                </h3>

                                <p>
                                    Add a payout method
                                    before requesting a
                                    withdrawal.
                                </p>

                                <Link
                                    to="/wallet/payout-methods"
                                    className="withdraw-secondary-button"
                                >
                                    Add payout method
                                </Link>

                            </div>
                        )}

                        <Link
                            to="/wallet/payout-methods"
                            className="withdraw-manage-link"
                        >
                            Manage payout methods
                            <ChevronRight size={15} />
                        </Link>

                    </section>


                    {/* =================================================
                        SECURITY
                    ================================================== */}

                    <div className="withdraw-security-box">

                        <ShieldCheck size={19} />

                        <div>
                            <strong>
                                Secure withdrawal
                            </strong>

                            <p>
                                Always verify your payout
                                details before submitting
                                a withdrawal request.
                            </p>
                        </div>

                    </div>


                    {/* =================================================
                        SUBMIT
                    ================================================== */}

                    <button
                        type="submit"
                        className="withdraw-submit-button"
                        disabled={
                            submitting ||
                            !isValidAmount ||
                            !selectedMethodId
                        }
                    >
                        {submitting ? (
                            <>
                                <Loader2
                                    size={18}
                                    className="withdraw-button-spinner"
                                />

                                Processing...
                            </>
                        ) : (
                            <>
                                <ArrowDownLeft
                                    size={18}
                                />

                                Request withdrawal
                            </>
                        )}
                    </button>

                    <p className="withdraw-demo-note">
                        Demo mode: this request does not
                        send real funds.
                    </p>

                </form>


                {/* =====================================================
                    SUMMARY
                ====================================================== */}

                <aside className="withdraw-summary">

                    <div className="withdraw-summary-card">

                        <div className="withdraw-summary-header">
                            <div>
                                <span>
                                    Withdrawal summary
                                </span>

                                <h2>
                                    Review your request
                                </h2>
                            </div>

                            <div className="withdraw-summary-icon">
                                <ArrowDownLeft
                                    size={19}
                                />
                            </div>
                        </div>

                        <div className="withdraw-summary-amount">

                            <span>
                                You are withdrawing
                            </span>

                            <strong>
                                {hasAmount
                                    ? formatSAK(
                                        numericAmount
                                    )
                                    : "0.00 SAK"}
                            </strong>

                        </div>

                        <div className="withdraw-summary-lines">

                            <div>
                                <span>
                                    Available balance
                                </span>

                                <strong>
                                    {formatSAK(
                                        availableBalance
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Payout method
                                </span>

                                <strong>
                                    {selectedMethod
                                        ?.name ||
                                        "Not selected"}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Network
                                </span>

                                <strong>
                                    {selectedMethod
                                        ?.network ||
                                        "—"}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Estimated payout
                                </span>

                                <strong>
                                    {estimatedUSDT > 0
                                        ? `${formatNumber(
                                            estimatedUSDT
                                        )} USDT`
                                        : "—"}
                                </strong>
                            </div>

                        </div>

                        <div className="withdraw-summary-divider" />

                        <div className="withdraw-summary-total">
                            <span>
                                Balance after request
                            </span>

                            <strong>
                                {isValidAmount
                                    ? formatSAK(
                                        availableBalance -
                                        numericAmount
                                    )
                                    : formatSAK(
                                        availableBalance
                                    )}
                            </strong>
                        </div>

                    </div>


                    {/* =================================================
                        LIMITS
                    ================================================== */}

                    <div className="withdraw-info-card">

                        <div className="withdraw-info-heading">
                            <Info size={17} />

                            <strong>
                                Withdrawal limits
                            </strong>
                        </div>

                        <div className="withdraw-info-row">
                            <span>
                                Minimum
                            </span>

                            <strong>
                                {formatSAK(
                                    minimumAmount
                                )}
                            </strong>
                        </div>

                        <div className="withdraw-info-row">
                            <span>
                                Maximum
                            </span>

                            <strong>
                                {formatSAK(
                                    maximumAmount
                                )}
                            </strong>
                        </div>

                        <div className="withdraw-info-row">
                            <span>
                                Daily limit
                            </span>

                            <strong>
                                {formatSAK(
                                    limits?.dailyLimit
                                )}
                            </strong>
                        </div>

                    </div>


                    {/* =================================================
                        NOTE
                    ================================================== */}

                    <div className="withdraw-note-card">

                        <CircleAlert
                            size={17}
                        />

                        <p>
                            Withdrawal limits and
                            conversion values shown here
                            are demonstration values for
                            the current frontend build.
                        </p>

                    </div>

                </aside>

            </div>

        </div>
    );
}

export default WithdrawPage;