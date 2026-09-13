/*
|--------------------------------------------------------------------------
| Salok Earn - Wallet Mock Data
|--------------------------------------------------------------------------
|
| This file contains temporary presentation data for the Wallet module.
|
| IMPORTANT:
| This is MOCK DATA ONLY.
|
| Nothing in this file communicates with Firebase or changes production
| wallet information.
|
| Later, the mock service can be replaced with the real Firebase/backend
| service without redesigning the wallet UI.
|
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| Wallet Summary
|--------------------------------------------------------------------------
|
| Represents the user's current wallet overview.
|
*/

export const walletSummary = {
    availableBalance: 4218.75,

    pendingBalance: 285.5,

    totalEarned: 12840.25,

    totalWithdrawn: 8340.0,

    lifetimeEarnings: 21180.25,

    currency: "SAK",
};


/*
|--------------------------------------------------------------------------
| Wallet Statistics
|--------------------------------------------------------------------------
|
| Additional statistics that can be displayed around the wallet.
|
*/

export const walletStats = {
    thisMonth: 1840.5,

    lastMonth: 1520.25,

    today: 180.0,

    averageDaily: 61.35,

    totalTransactions: 87,

    successfulWithdrawals: 14,
};


/*
|--------------------------------------------------------------------------
| Wallet Earning Categories
|--------------------------------------------------------------------------
|
| Shows where the user's earnings have come from.
|
*/

export const walletEarningCategories = [
    {
        id: "trivia",

        name: "Trivia",

        amount: 3280.0,

        percentage: 25.5,

        icon: "brain",
    },

    {
        id: "surveys",

        name: "Surveys",

        amount: 2940.5,

        percentage: 22.8,

        icon: "clipboard",
    },

    {
        id: "tasks",

        name: "Tasks",

        amount: 2510.75,

        percentage: 19.5,

        icon: "check-square",
    },

    {
        id: "offers",

        name: "Offers",

        amount: 2769.0,

        percentage: 21.5,

        icon: "gift",
    },

    {
        id: "referrals",

        name: "Referrals",

        amount: 1340.0,

        percentage: 10.4,

        icon: "users",
    },
];


/*
|--------------------------------------------------------------------------
| Wallet Transactions
|--------------------------------------------------------------------------
|
| Mock earning and wallet transaction history.
|
| transactionType:
| - earning
| - withdrawal
| - refund
| - adjustment
|
| status:
| - completed
| - pending
| - failed
|
|--------------------------------------------------------------------------
*/

export const walletTransactions = [
    {
        id: "txn-001",

        type: "earning",

        category: "Trivia",

        title: "Trivia reward",

        description: "General Knowledge round completed",

        amount: 80,

        direction: "credit",

        status: "completed",

        date: "2026-09-12T00:42:00",

        reference: "TRV-10482",

        icon: "brain",
    },

    {
        id: "txn-002",

        type: "earning",

        category: "Survey",

        title: "Survey completed",

        description: "Technology preferences survey",

        amount: 150,

        direction: "credit",

        status: "completed",

        date: "2026-09-11T21:18:00",

        reference: "SRV-92831",

        icon: "clipboard",
    },

    {
        id: "txn-003",

        type: "earning",

        category: "Referral",

        title: "Referral reward",

        description: "Successful referral reward",

        amount: 100,

        direction: "credit",

        status: "completed",

        date: "2026-09-10T18:34:00",

        reference: "REF-00321",

        icon: "users",
    },

    {
        id: "txn-004",

        type: "earning",

        category: "Offer",

        title: "Offer completed",

        description: "Featured partner offer",

        amount: 350,

        direction: "credit",

        status: "completed",

        date: "2026-09-09T16:20:00",

        reference: "OFF-38129",

        icon: "gift",
    },

    {
        id: "txn-005",

        type: "earning",

        category: "Task",

        title: "Task completed",

        description: "Community participation task",

        amount: 100,

        direction: "credit",

        status: "completed",

        date: "2026-09-08T12:45:00",

        reference: "TSK-71028",

        icon: "check-square",
    },

    {
        id: "txn-006",

        type: "withdrawal",

        category: "Withdrawal",

        title: "Withdrawal request",

        description: "USDT payout",

        amount: 1500,

        direction: "debit",

        status: "pending",

        date: "2026-09-07T11:30:00",

        reference: "WD-728491",

        icon: "arrow-up-right",
    },

    {
        id: "txn-007",

        type: "earning",

        category: "Trivia",

        title: "Trivia reward",

        description: "Science trivia round completed",

        amount: 60,

        direction: "credit",

        status: "completed",

        date: "2026-09-06T19:12:00",

        reference: "TRV-10410",

        icon: "brain",
    },

    {
        id: "txn-008",

        type: "earning",

        category: "Survey",

        title: "Survey completed",

        description: "Shopping habits survey",

        amount: 120,

        direction: "credit",

        status: "completed",

        date: "2026-09-06T14:05:00",

        reference: "SRV-91820",

        icon: "clipboard",
    },

    {
        id: "txn-009",

        type: "withdrawal",

        category: "Withdrawal",

        title: "Withdrawal completed",

        description: "USDT payout",

        amount: 2000,

        direction: "debit",

        status: "completed",

        date: "2026-09-03T10:25:00",

        reference: "WD-712940",

        icon: "arrow-up-right",
    },

    {
        id: "txn-010",

        type: "earning",

        category: "Referral",

        title: "Referral reward",

        description: "Successful referral reward",

        amount: 100,

        direction: "credit",

        status: "completed",

        date: "2026-09-02T17:40:00",

        reference: "REF-00287",

        icon: "users",
    },

    {
        id: "txn-011",

        type: "earning",

        category: "Offer",

        title: "Offer completed",

        description: "Partner experience completed",

        amount: 200,

        direction: "credit",

        status: "completed",

        date: "2026-08-30T15:12:00",

        reference: "OFF-36210",

        icon: "gift",
    },

    {
        id: "txn-012",

        type: "withdrawal",

        category: "Withdrawal",

        title: "Withdrawal completed",

        description: "USDT payout",

        amount: 2500,

        direction: "debit",

        status: "completed",

        date: "2026-08-28T09:15:00",

        reference: "WD-698211",

        icon: "arrow-up-right",
    },
];


/*
|--------------------------------------------------------------------------
| Withdrawal Status Summary
|--------------------------------------------------------------------------
*/

export const withdrawalSummary = {
    totalWithdrawals: 17,

    pending: 1,

    completed: 14,

    rejected: 1,

    refunded: 1,

    totalAmount: 8340,

    pendingAmount: 1500,
};


/*
|--------------------------------------------------------------------------
| Payout Methods
|--------------------------------------------------------------------------
|
| These are intentionally fictional/demo payout methods.
|
| No real financial information is stored here.
|
|--------------------------------------------------------------------------
*/

export const payoutMethods = [
    {
        id: "payout-001",

        type: "crypto",

        provider: "FaucetPay",

        currency: "USDT",

        network: "TRC20",

        label: "USDT Wallet",

        maskedAccount: "T••••••••••••8K",

        accountName: "Salok User",

        isDefault: true,

        verified: true,

        addedAt: "2026-08-15",
    },

    {
        id: "payout-002",

        type: "crypto",

        provider: "FaucetPay",

        currency: "USDT",

        network: "ERC20",

        label: "USDT ERC20",

        maskedAccount: "0x••••••••92A1",

        accountName: "Salok User",

        isDefault: false,

        verified: true,

        addedAt: "2026-08-10",
    },
];


/*
|--------------------------------------------------------------------------
| Supported Payout Methods
|--------------------------------------------------------------------------
|
| Presentation-level data for the future "Add Payout Method" page.
|
|--------------------------------------------------------------------------
*/

export const supportedPayoutMethods = [
    {
        id: "faucetpay-usdt-trc20",

        provider: "FaucetPay",

        type: "crypto",

        currency: "USDT",

        network: "TRC20",

        name: "USDT via FaucetPay",

        description:
            "Receive your payout in USDT through the TRC20 network.",

        available: true,
    },

    {
        id: "faucetpay-usdt-erc20",

        provider: "FaucetPay",

        type: "crypto",

        currency: "USDT",

        network: "ERC20",

        name: "USDT via FaucetPay",

        description:
            "Receive your payout in USDT through the ERC20 network.",

        available: true,
    },
];


/*
|--------------------------------------------------------------------------
| Withdrawal Limits
|--------------------------------------------------------------------------
|
| These are UI/demo values only.
|
| They should NOT be treated as the real production withdrawal rules
| until we connect the real backend.
|
|--------------------------------------------------------------------------
*/

export const withdrawalLimits = {
    minimum: 500,

    maximum: 100000,

    dailyLimit: 100000,

    currency: "SAK",
};


/*
|--------------------------------------------------------------------------
| Recent Withdrawals
|--------------------------------------------------------------------------
*/

export const recentWithdrawals = [
    {
        id: "WD-728491",

        amount: 1500,

        currency: "SAK",

        payoutAmount: 15.0,

        payoutCurrency: "USDT",

        provider: "FaucetPay",

        network: "TRC20",

        status: "pending",

        requestedAt: "2026-09-07T11:30:00",

        completedAt: null,

        fee: 0,
    },

    {
        id: "WD-712940",

        amount: 2000,

        currency: "SAK",

        payoutAmount: 20.0,

        payoutCurrency: "USDT",

        provider: "FaucetPay",

        network: "TRC20",

        status: "completed",

        requestedAt: "2026-09-03T10:25:00",

        completedAt: "2026-09-03T11:02:00",

        fee: 0,
    },

    {
        id: "WD-698211",

        amount: 2500,

        currency: "SAK",

        payoutAmount: 25.0,

        payoutCurrency: "USDT",

        provider: "FaucetPay",

        network: "TRC20",

        status: "completed",

        requestedAt: "2026-08-28T09:15:00",

        completedAt: "2026-08-28T09:50:00",

        fee: 0,
    },

    {
        id: "WD-681920",

        amount: 1200,

        currency: "SAK",

        payoutAmount: 12.0,

        payoutCurrency: "USDT",

        provider: "FaucetPay",

        network: "TRC20",

        status: "completed",

        requestedAt: "2026-08-20T13:10:00",

        completedAt: "2026-08-20T13:44:00",

        fee: 0,
    },
];


/*
|--------------------------------------------------------------------------
| Mock Wallet User
|--------------------------------------------------------------------------
*/

export const mockWalletUser = {
    uid: "mock-user-001",

    username: "SalokUser",

    displayName: "Salok User",

    currency: "SAK",
};


/*
|--------------------------------------------------------------------------
| Complete Wallet Page Data
|--------------------------------------------------------------------------
|
| Convenient object used by the mock wallet service.
|
|--------------------------------------------------------------------------
*/

export const walletPageData = {
    summary: walletSummary,

    stats: walletStats,

    earningCategories: walletEarningCategories,

    transactions: walletTransactions,

    withdrawalSummary,

    payoutMethods,

    supportedPayoutMethods,

    withdrawalLimits,

    recentWithdrawals,

    user: mockWalletUser,
};