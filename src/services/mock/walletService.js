import {
    walletPageData,
    walletSummary,
    walletStats,
    walletEarningCategories,
    walletTransactions,
    withdrawalSummary,
    payoutMethods,
    supportedPayoutMethods,
    withdrawalLimits,
    recentWithdrawals,
    mockWalletUser,
} from "../../data/walletData";

/*
|--------------------------------------------------------------------------
| Wallet Mock Service
|--------------------------------------------------------------------------
|
| This service provides all wallet-related data for the frontend while
| the application is still running in MOCK mode.
|
| IMPORTANT:
| This file does NOT connect to Firebase.
| It does NOT create real withdrawals.
| It does NOT modify production wallet balances.
|
| Later, when Firebase integration begins, the page components should
| continue calling these service methods. We can then replace the
| implementation behind the service without rebuilding the UI.
|
|--------------------------------------------------------------------------
*/

const MOCK_DELAY = 500;

/*
|--------------------------------------------------------------------------
| Small delay helper
|--------------------------------------------------------------------------
|
| Real APIs take some time to respond.
| We simulate that delay here so the UI can properly display loading
| states during development.
|
|--------------------------------------------------------------------------
*/

function delay(milliseconds = MOCK_DELAY) {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}

/*
|--------------------------------------------------------------------------
| Clone helper
|--------------------------------------------------------------------------
|
| This prevents the UI from accidentally modifying the original mock
| data objects.
|
|--------------------------------------------------------------------------
*/

function cloneData(data) {
    return JSON.parse(JSON.stringify(data));
}

/*
|--------------------------------------------------------------------------
| Get Wallet Summary
|--------------------------------------------------------------------------
|
| Returns:
| - available balance
| - pending balance
| - total earned
| - total withdrawn
| - lifetime earnings
|
|--------------------------------------------------------------------------
*/

export async function getWalletSummary() {
    await delay();

    return {
        success: true,
        data: cloneData(walletSummary),
    };
}

/*
|--------------------------------------------------------------------------
| Get Wallet Statistics
|--------------------------------------------------------------------------
|
| Returns additional wallet statistics used by the dashboard.
|
|--------------------------------------------------------------------------
*/

export async function getWalletStats() {
    await delay();

    return {
        success: true,
        data: cloneData(walletStats),
    };
}

/*
|--------------------------------------------------------------------------
| Get Earning Categories
|--------------------------------------------------------------------------
|
| Used to show where the user's earnings came from.
|
| Example:
| Trivia
| Surveys
| Tasks
| Offers
| Referrals
|
|--------------------------------------------------------------------------
*/

export async function getWalletEarningCategories() {
    await delay();

    return {
        success: true,
        data: cloneData(walletEarningCategories),
    };
}

/*
|--------------------------------------------------------------------------
| Get Wallet Transactions
|--------------------------------------------------------------------------
|
| Optional filtering can be supplied:
|
| {
|     type: "earning"
| }
|
| or:
|
| {
|     type: "withdrawal"
| }
|
| or:
|
| {
|     status: "completed"
| }
|
|--------------------------------------------------------------------------
*/

export async function getWalletTransactions(options = {}) {
    await delay();

    let transactions = cloneData(walletTransactions);

    const {
        type,
        status,
        limit,
    } = options;

    /*
    |--------------------------------------------------------------------------
    | Filter by transaction type
    |--------------------------------------------------------------------------
    */

    if (type) {
        transactions = transactions.filter(
            (transaction) =>
                transaction.type === type
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Filter by transaction status
    |--------------------------------------------------------------------------
    */

    if (status) {
        transactions = transactions.filter(
            (transaction) =>
                transaction.status === status
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Limit number of records
    |--------------------------------------------------------------------------
    */

    if (limit) {
        transactions = transactions.slice(
            0,
            Number(limit)
        );
    }

    return {
        success: true,
        data: transactions,
        total: transactions.length,
    };
}

/*
|--------------------------------------------------------------------------
| Get Withdrawal Summary
|--------------------------------------------------------------------------
|
| Provides:
| - pending withdrawals
| - completed withdrawals
| - rejected withdrawals
| - refunded withdrawals
| - total withdrawn amount
|
|--------------------------------------------------------------------------
*/

export async function getWithdrawalSummary() {
    await delay();

    return {
        success: true,
        data: cloneData(withdrawalSummary),
    };
}

/*
|--------------------------------------------------------------------------
| Get Payout Methods
|--------------------------------------------------------------------------
|
| Returns the user's configured payout methods.
|
| These are DEMO records only.
|
|--------------------------------------------------------------------------
*/

export async function getPayoutMethods() {
    await delay();

    return {
        success: true,
        data: getStoredPayoutMethods(),
    };
}

/*
|--------------------------------------------------------------------------
| Get Supported Payout Methods
|--------------------------------------------------------------------------
|
| Used by the withdrawal and payout-method screens to display the
| payout methods supported by the mock frontend.
|
|--------------------------------------------------------------------------
*/

export async function getSupportedPayoutMethods() {
    await delay();

    return {
        success: true,
        data: cloneData(supportedPayoutMethods),
    };
}

/*
|--------------------------------------------------------------------------
| Get Withdrawal Limits
|--------------------------------------------------------------------------
|
| IMPORTANT:
| These values are only frontend/demo values.
|
| They should NOT be treated as the final production withdrawal rules.
|
|--------------------------------------------------------------------------
*/

export async function getWithdrawalLimits() {
    await delay();

    return {
        success: true,
        data: cloneData(withdrawalLimits),
    };
}

/*
|--------------------------------------------------------------------------
| Get Recent Withdrawals
|--------------------------------------------------------------------------
|
| Used for the wallet overview and withdrawals page.
|
|--------------------------------------------------------------------------
*/

export async function getRecentWithdrawals(options = {}) {
    await delay();

    let withdrawals = cloneData(recentWithdrawals);

    const {
        status,
        limit,
    } = options;

    /*
    |--------------------------------------------------------------------------
    | Filter by status
    |--------------------------------------------------------------------------
    */

    if (status) {
        withdrawals = withdrawals.filter(
            (withdrawal) =>
                withdrawal.status === status
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Limit records
    |--------------------------------------------------------------------------
    */

    if (limit) {
        withdrawals = withdrawals.slice(
            0,
            Number(limit)
        );
    }

    return {
        success: true,
        data: withdrawals,
        total: withdrawals.length,
    };
}

/*
|--------------------------------------------------------------------------
| Get Current Wallet User
|--------------------------------------------------------------------------
*/

export async function getWalletUser() {
    await delay();

    return {
        success: true,
        data: cloneData(mockWalletUser),
    };
}

/*
|--------------------------------------------------------------------------
| Get Complete Wallet Page Data
|--------------------------------------------------------------------------
|
| This is useful when the Wallet overview needs several pieces of data
| at the same time.
|
|--------------------------------------------------------------------------
*/

export async function getWalletPageData() {
    await delay();

    return {
        success: true,
        data: cloneData(walletPageData),
    };
}

/*
|--------------------------------------------------------------------------
| Get A Single Transaction
|--------------------------------------------------------------------------
|
| Looks up a transaction using its ID.
|
|--------------------------------------------------------------------------
*/

export async function getWalletTransaction(transactionId) {
    await delay();

    const transaction = walletTransactions.find(
        (item) =>
            item.id === transactionId
    );

    if (!transaction) {
        return {
            success: false,
            data: null,
            message: "Transaction not found.",
        };
    }

    return {
        success: true,
        data: cloneData(transaction),
    };
}

/*
|--------------------------------------------------------------------------
| Get A Single Payout Method
|--------------------------------------------------------------------------
|
| Looks up a payout method using its ID.
|
|--------------------------------------------------------------------------
*/

export async function getPayoutMethod(payoutMethodId) {
    await delay();

    const payoutMethod = payoutMethods.find(
        (item) =>
            item.id === payoutMethodId
    );

    if (!payoutMethod) {
        return {
            success: false,
            data: null,
            message: "Payout method not found.",
        };
    }

    return {
        success: true,
        data: cloneData(payoutMethod),
    };
}

/*
|--------------------------------------------------------------------------
| Get A Single Withdrawal
|--------------------------------------------------------------------------
|
| Looks up a withdrawal using its ID.
|
|--------------------------------------------------------------------------
*/

export async function getWithdrawal(withdrawalId) {
    await delay();

    const withdrawal = recentWithdrawals.find(
        (item) =>
            item.id === withdrawalId
    );

    if (!withdrawal) {
        return {
            success: false,
            data: null,
            message: "Withdrawal not found.",
        };
    }

    return {
        success: true,
        data: cloneData(withdrawal),
    };
}

/*
|--------------------------------------------------------------------------
| Calculate Wallet Totals
|--------------------------------------------------------------------------
|
| This helper calculates totals from transaction records.
|
| It is mainly useful for testing the frontend and can later be replaced
| by values supplied directly from Firebase/backend services.
|
|--------------------------------------------------------------------------
*/

export async function calculateWalletTotals() {
    await delay();

    const transactions = cloneData(walletTransactions);

    let totalEarnings = 0;
    let totalWithdrawals = 0;

    transactions.forEach((transaction) => {
        const amount = Number(
            transaction.amount || 0
        );

        if (
            transaction.type === "earning" &&
            transaction.direction === "credit"
        ) {
            totalEarnings += amount;
        }

        if (
            transaction.type === "withdrawal" &&
            transaction.direction === "debit"
        ) {
            totalWithdrawals += amount;
        }
    });

    return {
        success: true,
        data: {
            totalEarnings,
            totalWithdrawals,
            transactionCount: transactions.length,
        },
    };
}

/*
|--------------------------------------------------------------------------
| Search Wallet Transactions
|--------------------------------------------------------------------------
|
| Searches:
| - title
| - description
| - reference
|
|--------------------------------------------------------------------------
*/

export async function searchWalletTransactions(searchTerm = "") {
    await delay();

    const query = searchTerm
        .trim()
        .toLowerCase();

    if (!query) {
        return {
            success: true,
            data: cloneData(walletTransactions),
            total: walletTransactions.length,
        };
    }

    const results = walletTransactions.filter(
        (transaction) => {
            const title =
                transaction.title?.toLowerCase() || "";

            const description =
                transaction.description?.toLowerCase() || "";

            const reference =
                transaction.reference?.toLowerCase() || "";

            return (
                title.includes(query) ||
                description.includes(query) ||
                reference.includes(query)
            );
        }
    );

    return {
        success: true,
        data: cloneData(results),
        total: results.length,
    };
}

/*
|--------------------------------------------------------------------------
| Mock Withdrawal Request
|--------------------------------------------------------------------------
|
| IMPORTANT:
|
| This does NOT create a real withdrawal.
|
| It only simulates the response that the future backend could return.
|
| The actual Wallet UI will use this method later when we build the
| withdrawal form.
|
|--------------------------------------------------------------------------
*/

export async function requestWithdrawal({
    amount,
    payoutMethodId,
} = {}) {
    await delay();

    const numericAmount = Number(amount);

    /*
    |--------------------------------------------------------------------------
    | Basic validation
    |--------------------------------------------------------------------------
    */

    if (
        !Number.isFinite(numericAmount) ||
        numericAmount <= 0
    ) {
        return {
            success: false,
            message: "Enter a valid withdrawal amount.",
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Find payout method
    |--------------------------------------------------------------------------
    */

    const payoutMethod = payoutMethods.find(
        (method) =>
            method.id === payoutMethodId
    );

    if (!payoutMethod) {
        return {
            success: false,
            message: "Please select a valid payout method.",
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Check mock minimum
    |--------------------------------------------------------------------------
    */

    if (
        numericAmount <
        Number(withdrawalLimits.minimum)
    ) {
        return {
            success: false,
            message: `Minimum withdrawal is ${withdrawalLimits.minimum} ${withdrawalLimits.currency}.`,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Check mock maximum
    |--------------------------------------------------------------------------
    */

    if (
        numericAmount >
        Number(withdrawalLimits.maximum)
    ) {
        return {
            success: false,
            message: `Maximum withdrawal is ${withdrawalLimits.maximum} ${withdrawalLimits.currency}.`,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Generate demo withdrawal
    |--------------------------------------------------------------------------
    */

    const withdrawal = {
        id: `WD-${Date.now()}`,
        amount: numericAmount,
        currency: withdrawalLimits.currency,
        status: "pending",
        payoutMethodId: payoutMethod.id,
        payoutMethod: payoutMethod.name,
        network: payoutMethod.network,
        createdAt: new Date().toISOString(),
    };

    return {
        success: true,
        message:
            "Withdrawal request submitted successfully.",
        data: withdrawal,
    };
}



const PAYOUT_METHODS_STORAGE_KEY =
    "salok_wallet_payout_methods";

function getStoredPayoutMethods() {
    try {
        const stored = localStorage.getItem(
            PAYOUT_METHODS_STORAGE_KEY
        );

        if (stored) {
            const parsed = JSON.parse(stored);

            if (Array.isArray(parsed)) {
                return parsed;
            }
        }
    } catch (error) {
        console.error(
            "Failed to read stored payout methods:",
            error
        );
    }

    return cloneData(payoutMethods);
}

function savePayoutMethods(methods) {
    try {
        localStorage.setItem(
            PAYOUT_METHODS_STORAGE_KEY,
            JSON.stringify(methods)
        );
    } catch (error) {
        console.error(
            "Failed to save payout methods:",
            error
        );
    }
}

/*
|--------------------------------------------------------------------------
| Add Mock Payout Method
|--------------------------------------------------------------------------
|
| This only simulates adding a payout method.
|
| No real payout account is created.
|
|--------------------------------------------------------------------------
*/

export async function addPayoutMethod(methodData = {}) {
    await delay();

    // Validate required fields
    if (!methodData.provider) {
        return {
            success: false,
            message: "Payout provider is required.",
        };
    }

    if (!methodData.account?.trim()) {
        return {
            success: false,
            message: "Payout account is required.",
        };
    }

    // Get the current mock payout methods
    const currentMethods = getStoredPayoutMethods();

    // Create the new payout method
    const newMethod = {
        id: `payout-${Date.now()}`,
        type: "crypto",
        provider: methodData.provider,
        currency: methodData.currency || "USDT",
        network: methodData.network || "TRC20",
        account: methodData.account.trim(),
        isVerified: false,
        isDefault: Boolean(methodData.makeDefault),
        createdAt: new Date().toISOString(),
    };

    // If this method is being made default,
    // remove default status from all existing methods.
    const updatedMethods = newMethod.isDefault
        ? currentMethods.map((method) => ({
            ...method,
            isDefault: false,
        }))
        : currentMethods;

    updatedMethods.push(newMethod);

    // Save updated mock methods
    savePayoutMethods(updatedMethods);

    return {
        success: true,
        message: "Payout method added successfully.",
        data: newMethod,
    };
}

/*
|--------------------------------------------------------------------------
| Remove Mock Payout Method
|--------------------------------------------------------------------------
|
| Simulates removing a payout method.
|
|--------------------------------------------------------------------------
*/

export async function removePayoutMethod(
    payoutMethodId
) {
    await delay();

    const exists = payoutMethods.some(
        (method) =>
            method.id === payoutMethodId
    );

    if (!exists) {
        return {
            success: false,
            message: "Payout method not found.",
        };
    }

    return {
        success: true,
        message:
            "Payout method removed successfully.",
    };
}

/*
|--------------------------------------------------------------------------
| Set Mock Default Payout Method
|--------------------------------------------------------------------------
*/

export async function setDefaultPayoutMethod(
    payoutMethodId
) {
    await delay();

    const exists = payoutMethods.some(
        (method) =>
            method.id === payoutMethodId
    );

    if (!exists) {
        return {
            success: false,
            message: "Payout method not found.",
        };
    }

    return {
        success: true,
        message:
            "Default payout method updated successfully.",
        data: {
            payoutMethodId,
        },
    };
}

/*
|--------------------------------------------------------------------------
| Export Service Object
|--------------------------------------------------------------------------
|
| This gives us one clean service interface.
|
| Pages can use:
|
| walletService.getWalletPageData()
|
| instead of importing every function separately.
|
|--------------------------------------------------------------------------
*/

const walletService = {
    getWalletSummary,
    getWalletStats,
    getWalletEarningCategories,
    getWalletTransactions,
    getWithdrawalSummary,
    getPayoutMethods,
    getSupportedPayoutMethods,
    getWithdrawalLimits,
    getRecentWithdrawals,
    getWalletUser,
    getWalletPageData,
    getWalletTransaction,
    getPayoutMethod,
    getWithdrawal,
    calculateWalletTotals,
    searchWalletTransactions,
    requestWithdrawal,
    addPayoutMethod,
    removePayoutMethod,
    setDefaultPayoutMethod,
};

export default walletService;