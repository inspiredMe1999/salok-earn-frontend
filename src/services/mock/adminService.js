import {
    adminOverview,
    adminTrendData,
    adminRecentUsers,
    adminRecentActivities,
    adminQuickActions,
    adminPageData,
} from "../../data/adminData";

import {
    adminUsers,
    adminUserSummary,
    adminUserRegions,
} from "../../data/adminUsersData";

import {
    adminWithdrawals,
    adminWithdrawalSummary,
} from "../../data/adminWithdrawalsData";

import {
    adminEarningOpportunities,
    adminEarningSummary,
} from "../../data/adminEarningsData";

import {
    adminTriviaQuestions,
    adminTriviaSummary,
} from "../../data/adminTriviaData";

import {
    adminCommunityMessages,
    adminCommunitySummary,
} from "../../data/adminCommunityData";

import {
    adminReferralRecords,
    adminReferralSummary,
    adminReferralMilestones,
} from "../../data/adminReferralData";

import {
    adminNotifications,
    adminNotificationSummary,
    adminNotificationTypes,
} from "../../data/adminNotificationData";

import {
    adminSettings,
    adminSettingsSections,
} from "../../data/adminSettingsData";

import {
    adminTaskRecords,
    adminTaskSummary,
    adminTaskCategories,
} from "../../data/adminTaskData";

import {
    adminDeviceRecords,
    adminDeviceSummary,
    adminDeviceRiskLevels,
    adminDeviceStatuses,
    adminDeviceCountries,
} from "../../data/adminDeviceData";

import {
    adminBroadcastRecords,
    adminBroadcastSummary,
    adminBroadcastAudiences,
    adminBroadcastStatuses,
} from "../../data/adminBroadcastData";

import {
    adminAuditRecords,
    adminAuditSummary,
    adminAuditCategories,
    adminAuditSeverities,
} from "../../data/adminAuditData";

import {
    adminSystemSummary,
    adminSystemHealth,
    adminSystemRepairs,
    adminSystemMaintenance,
} from "../../data/adminSystemData";

const MOCK_DELAY = 500;

function delay(milliseconds = MOCK_DELAY) {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}

function cloneData(data) {
    return JSON.parse(JSON.stringify(data));
}

export async function getAdminOverview() {
    await delay();

    return {
        success: true,
        data: cloneData(adminOverview),
    };
}

export async function getAdminTrendData() {
    await delay();

    return {
        success: true,
        data: cloneData(adminTrendData),
    };
}

export async function getAdminRecentUsers() {
    await delay();

    return {
        success: true,
        data: cloneData(adminRecentUsers),
    };
}

export async function getAdminRecentActivities() {
    await delay();

    return {
        success: true,
        data: cloneData(adminRecentActivities),
    };
}

export async function getAdminQuickActions() {
    await delay();

    return {
        success: true,
        data: cloneData(adminQuickActions),
    };
}

export async function getAdminPageData() {
    await delay();

    return {
        success: true,
        data: cloneData(adminPageData),
    };
}

export async function getAdminUsers(options = {}) {
    await delay();

    const {
        searchTerm = "",
        status = "all",
        region = "All regions",
    } = options;

    const normalizedSearch = searchTerm
        .trim()
        .toLowerCase();

    const filteredUsers = adminUsers.filter((user) => {
        const matchesSearch =
            !normalizedSearch ||
            user.username
                .toLowerCase()
                .includes(normalizedSearch) ||
            user.displayName
                .toLowerCase()
                .includes(normalizedSearch) ||
            user.email
                .toLowerCase()
                .includes(normalizedSearch) ||
            user.uid
                .toLowerCase()
                .includes(normalizedSearch);

        const matchesStatus =
            status === "all" ||
            user.status === status;

        const matchesRegion =
            region === "All regions" ||
            user.region === region;

        return (
            matchesSearch &&
            matchesStatus &&
            matchesRegion
        );
    });

    return {
        success: true,
        data: cloneData(filteredUsers),
        total: filteredUsers.length,
    };
}

export async function getAdminUser(uid) {
    await delay();

    const user = adminUsers.find(
        (item) => item.uid === uid
    );

    if (!user) {
        return {
            success: false,
            message: "User could not be found.",
        };
    }

    return {
        success: true,
        data: cloneData(user),
    };
}

export async function getAdminUserSummary() {
    await delay();

    return {
        success: true,
        data: cloneData(adminUserSummary),
    };
}

export async function getAdminUserRegions() {
    await delay();

    return {
        success: true,
        data: cloneData(adminUserRegions),
    };
}

export async function updateAdminUserStatus(
    uid,
    status
) {
    await delay();

    const user = adminUsers.find(
        (item) => item.uid === uid
    );

    if (!user) {
        return {
            success: false,
            message: "User could not be found.",
        };
    }

    user.status = status;

    return {
        success: true,
        message: `User status changed to ${status}.`,
        data: cloneData(user),
    };
}

export async function toggleAdminUserFlag(uid) {
    await delay();

    const user = adminUsers.find(
        (item) => item.uid === uid
    );

    if (!user) {
        return {
            success: false,
            message: "User could not be found.",
        };
    }

    if (user.flags > 0) {
        user.flags = 0;

        if (user.status === "flagged") {
            user.status = "active";
        }
    } else {
        user.flags = 1;
        user.status = "flagged";
    }

    return {
        success: true,
        message:
            user.flags > 0
                ? "User flagged successfully."
                : "User flag removed.",
        data: cloneData(user),
    };
}

// withdrawals
export async function getAdminWithdrawals(options = {}) {
    await delay();

    const {
        searchTerm = "",
        status = "all",
        riskLevel = "all",
    } = options;

    const search = searchTerm.trim().toLowerCase();

    const filteredWithdrawals = adminWithdrawals.filter(
        (withdrawal) => {
            const matchesSearch =
                !search ||
                withdrawal.id.toLowerCase().includes(search) ||
                withdrawal.reference
                    .toLowerCase()
                    .includes(search) ||
                withdrawal.username
                    .toLowerCase()
                    .includes(search) ||
                withdrawal.displayName
                    .toLowerCase()
                    .includes(search) ||
                withdrawal.email
                    .toLowerCase()
                    .includes(search);

            const matchesStatus =
                status === "all" ||
                withdrawal.status === status;

            const matchesRisk =
                riskLevel === "all" ||
                withdrawal.riskLevel === riskLevel;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesRisk
            );
        }
    );

    return {
        success: true,
        data: cloneData(filteredWithdrawals),
        total: filteredWithdrawals.length,
    };
}

export async function getAdminWithdrawalSummary() {
    await delay();

    return {
        success: true,
        data: cloneData(adminWithdrawalSummary),
    };
}

export async function getAdminWithdrawal(id) {
    await delay();

    const withdrawal = adminWithdrawals.find(
        (item) => item.id === id
    );

    if (!withdrawal) {
        return {
            success: false,
            message: "Withdrawal request not found.",
        };
    }

    return {
        success: true,
        data: cloneData(withdrawal),
    };
}

export async function updateAdminWithdrawalStatus(
    id,
    status,
    reason = ""
) {
    await delay();

    const withdrawal = adminWithdrawals.find(
        (item) => item.id === id
    );

    if (!withdrawal) {
        return {
            success: false,
            message: "Withdrawal request not found.",
        };
    }

    const allowedStatuses = [
        "pending",
        "completed",
        "rejected",
        "refunded",
    ];

    if (!allowedStatuses.includes(status)) {
        return {
            success: false,
            message: "Invalid withdrawal status.",
        };
    }

    withdrawal.status = status;
    withdrawal.processedAt =
        status === "pending"
            ? null
            : new Date().toISOString();

    if (reason.trim()) {
        withdrawal.notes = reason.trim();
    }

    return {
        success: true,
        message: `Withdrawal marked as ${status}.`,
        data: cloneData(withdrawal),
    };
}

export async function batchUpdateAdminWithdrawals(
    ids = [],
    status,
    reason = ""
) {
    await delay();

    if (!Array.isArray(ids) || ids.length === 0) {
        return {
            success: false,
            message: "No withdrawal requests selected.",
        };
    }

    const allowedStatuses = [
        "completed",
        "rejected",
        "refunded",
    ];

    if (!allowedStatuses.includes(status)) {
        return {
            success: false,
            message: "Invalid batch status.",
        };
    }

    let updatedCount = 0;

    adminWithdrawals.forEach((withdrawal) => {
        if (ids.includes(withdrawal.id)) {
            withdrawal.status = status;
            withdrawal.processedAt =
                new Date().toISOString();

            if (reason.trim()) {
                withdrawal.notes = reason.trim();
            }

            updatedCount += 1;
        }
    });

    return {
        success: true,
        message: `${updatedCount} withdrawal request(s) updated.`,
        updatedCount,
    };
}

// Earnings
export async function getAdminEarningSummary() {
    await delay();

    return {
        success: true,
        data: cloneData(adminEarningSummary),
    };
}

export async function getAdminEarningOpportunities(
    options = {}
) {
    await delay();

    const {
        searchTerm = "",
        category = "all",
        status = "all",
    } = options;

    const search = searchTerm.trim().toLowerCase();

    const filtered = adminEarningOpportunities.filter(
        (item) => {
            const matchesSearch =
                !search ||
                item.id.toLowerCase().includes(search) ||
                item.title.toLowerCase().includes(search) ||
                item.description
                    .toLowerCase()
                    .includes(search) ||
                item.provider.toLowerCase().includes(search);

            const matchesCategory =
                category === "all" ||
                item.category === category;

            const matchesStatus =
                status === "all" ||
                item.status === status;

            return (
                matchesSearch &&
                matchesCategory &&
                matchesStatus
            );
        }
    );

    return {
        success: true,
        data: cloneData(filtered),
        total: filtered.length,
    };
}

export async function getAdminEarningOpportunity(id) {
    await delay();

    const opportunity =
        adminEarningOpportunities.find(
            (item) => item.id === id
        );

    if (!opportunity) {
        return {
            success: false,
            message: "Earning opportunity not found.",
        };
    }

    return {
        success: true,
        data: cloneData(opportunity),
    };
}

export async function updateAdminEarningOpportunity(
    id,
    updates = {}
) {
    await delay();

    const opportunity =
        adminEarningOpportunities.find(
            (item) => item.id === id
        );

    if (!opportunity) {
        return {
            success: false,
            message: "Earning opportunity not found.",
        };
    }

    Object.assign(opportunity, updates);

    opportunity.updatedAt =
        new Date().toISOString();

    return {
        success: true,
        message:
            "Earning opportunity updated successfully.",
        data: cloneData(opportunity),
    };
}

export async function toggleAdminEarningOpportunity(id) {
    await delay();

    const opportunity =
        adminEarningOpportunities.find(
            (item) => item.id === id
        );

    if (!opportunity) {
        return {
            success: false,
            message: "Earning opportunity not found.",
        };
    }

    opportunity.status =
        opportunity.status === "active"
            ? "inactive"
            : "active";

    opportunity.updatedAt =
        new Date().toISOString();

    return {
        success: true,
        message:
            opportunity.status === "active"
                ? "Opportunity activated."
                : "Opportunity deactivated.",
        data: cloneData(opportunity),
    };
}

export async function deleteAdminEarningOpportunity(id) {
    await delay();

    const index =
        adminEarningOpportunities.findIndex(
            (item) => item.id === id
        );

    if (index === -1) {
        return {
            success: false,
            message: "Earning opportunity not found.",
        };
    }

    adminEarningOpportunities.splice(index, 1);

    return {
        success: true,
        message:
            "Earning opportunity removed from the mock catalogue.",
    };
}

// Trivia
export async function getAdminTriviaSummary() {
    await delay();

    return {
        success: true,
        data: cloneData(adminTriviaSummary),
    };
}

export async function getAdminTriviaQuestions(
    options = {}
) {
    await delay();

    const {
        searchTerm = "",
        category = "all",
        status = "all",
        difficulty = "all",
    } = options;

    const search = searchTerm.trim().toLowerCase();

    const filtered = adminTriviaQuestions.filter(
        (item) => {
            const matchesSearch =
                !search ||
                item.id.toLowerCase().includes(search) ||
                item.question.toLowerCase().includes(search) ||
                item.categoryName
                    .toLowerCase()
                    .includes(search);

            const matchesCategory =
                category === "all" ||
                item.categoryId === category;

            const matchesStatus =
                status === "all" ||
                item.status === status;

            const matchesDifficulty =
                difficulty === "all" ||
                item.difficulty === difficulty;

            return (
                matchesSearch &&
                matchesCategory &&
                matchesStatus &&
                matchesDifficulty
            );
        }
    );

    return {
        success: true,
        data: cloneData(filtered),
        total: filtered.length,
    };
}

export async function getAdminTriviaQuestion(id) {
    await delay();

    const question =
        adminTriviaQuestions.find(
            (item) => item.id === id
        );

    if (!question) {
        return {
            success: false,
            message: "Trivia question not found.",
        };
    }

    return {
        success: true,
        data: cloneData(question),
    };
}

export async function toggleAdminTriviaQuestion(id) {
    await delay();

    const question =
        adminTriviaQuestions.find(
            (item) => item.id === id
        );

    if (!question) {
        return {
            success: false,
            message: "Trivia question not found.",
        };
    }

    question.status =
        question.status === "active"
            ? "inactive"
            : "active";

    question.updatedAt =
        new Date().toISOString();

    return {
        success: true,
        message:
            question.status === "active"
                ? "Trivia question activated."
                : "Trivia question deactivated.",
        data: cloneData(question),
    };
}

export async function updateAdminTriviaQuestion(
    id,
    updates = {}
) {
    await delay();

    const question =
        adminTriviaQuestions.find(
            (item) => item.id === id
        );

    if (!question) {
        return {
            success: false,
            message: "Trivia question not found.",
        };
    }

    Object.assign(question, updates);

    question.updatedAt =
        new Date().toISOString();

    return {
        success: true,
        message:
            "Trivia question updated successfully.",
        data: cloneData(question),
    };
}

export async function deleteAdminTriviaQuestion(id) {
    await delay();

    const index =
        adminTriviaQuestions.findIndex(
            (item) => item.id === id
        );

    if (index === -1) {
        return {
            success: false,
            message: "Trivia question not found.",
        };
    }

    adminTriviaQuestions.splice(index, 1);

    return {
        success: true,
        message:
            "Trivia question removed from the mock catalogue.",
    };
}

// Community
export async function getAdminCommunitySummary() {
    await delay();

    const uniqueMembers = new Set(
        adminCommunityMessages.map((message) => message.senderUid)
    );

    const blockedUsers = new Set(
        adminCommunityMessages
            .filter((message) => message.isBlocked)
            .map((message) => message.senderUid)
    );

    return {
        success: true,
        data: {
            ...adminCommunitySummary,
            totalMessages: adminCommunityMessages.length,
            activeMembers: uniqueMembers.size,
            reportedMessages: adminCommunityMessages.filter(
                (message) => message.reports?.length > 0
            ).length,
            imageMessages: adminCommunityMessages.filter(
                (message) => message.type === "image"
            ).length,
            hiddenMessages: adminCommunityMessages.filter(
                (message) => message.status === "hidden"
            ).length,
            blockedUsers: blockedUsers.size,
        },
    };
}


export async function getAdminCommunityMessages(options = {}) {
    await delay();

    const {
        search = "",
        status = "all",
        type = "all",
        region = "all",
    } = options;

    const normalizedSearch = search.trim().toLowerCase();

    let results = [...adminCommunityMessages];

    if (normalizedSearch) {
        results = results.filter((message) => {
            return (
                message.text?.toLowerCase().includes(normalizedSearch) ||
                message.senderName?.toLowerCase().includes(normalizedSearch) ||
                message.senderUid?.toLowerCase().includes(normalizedSearch) ||
                message.imageName?.toLowerCase().includes(normalizedSearch)
            );
        });
    }

    if (status !== "all") {
        if (status === "reported") {
            results = results.filter(
                (message) => message.reports?.length > 0
            );
        } else {
            results = results.filter(
                (message) => message.status === status
            );
        }
    }

    if (type !== "all") {
        results = results.filter(
            (message) => message.type === type
        );
    }

    if (region !== "all") {
        results = results.filter(
            (message) => message.senderRegion === region
        );
    }

    return {
        success: true,
        data: results,
    };
}


export async function getAdminCommunityMessage(id) {
    await delay();

    const message = adminCommunityMessages.find(
        (item) => item.id === id
    );

    if (!message) {
        return {
            success: false,
            message: "Community message not found.",
            data: null,
        };
    }

    return {
        success: true,
        data: cloneData(message),
    };
}


export async function moderateAdminCommunityMessage(
    id,
    action,
    reason = ""
) {
    await delay();

    const message = adminCommunityMessages.find(
        (item) => item.id === id
    );

    if (!message) {
        return {
            success: false,
            message: "Community message not found.",
        };
    }

    const now = new Date().toISOString();

    if (action === "hide") {
        message.status = "hidden";
        message.moderatedAt = now;
        message.moderationReason =
            reason || "Message hidden by administrator.";

        return {
            success: true,
            message: "Message hidden successfully.",
            data: cloneData(message),
        };
    }

    if (action === "show") {
        message.status = "visible";
        message.moderatedAt = now;
        message.moderationReason = "";

        return {
            success: true,
            message: "Message restored successfully.",
            data: cloneData(message),
        };
    }

    if (action === "remove") {
        message.status = "removed";
        message.moderatedAt = now;
        message.moderationReason =
            reason || "Message removed by administrator.";

        return {
            success: true,
            message: "Message removed successfully.",
            data: cloneData(message),
        };
    }

    return {
        success: false,
        message: "Unsupported moderation action.",
    };
}


export async function toggleAdminCommunityUserBlock(uid) {
    await delay();

    const userMessages = adminCommunityMessages.filter(
        (message) => message.senderUid === uid
    );

    if (!userMessages.length) {
        return {
            success: false,
            message: "Community user not found.",
        };
    }

    const currentlyBlocked = userMessages.some(
        (message) => message.isBlocked
    );

    const newBlockedState = !currentlyBlocked;

    userMessages.forEach((message) => {
        message.isBlocked = newBlockedState;
    });

    return {
        success: true,
        message: newBlockedState
            ? "Community user blocked successfully."
            : "Community user unblocked successfully.",
        data: {
            uid,
            isBlocked: newBlockedState,
        },
    };
}


export async function getAdminCommunityReports() {
    await delay();

    const reports = [];

    adminCommunityMessages.forEach((message) => {
        if (!message.reports?.length) {
            return;
        }

        message.reports.forEach((report) => {
            reports.push({
                ...report,
                messageId: message.id,
                messageText: message.text,
                senderName: message.senderName,
                senderUid: message.senderUid,
                messageStatus: message.status,
            });
        });
    });

    return {
        success: true,
        data: reports,
    };
}

// Referrals
export async function getAdminReferralSummary() {
    await delay();

    return {
        success: true,
        data: cloneData(adminReferralSummary),
    };
}


export async function getAdminReferralRecords(options = {}) {
    await delay();

    const {
        search = "",
        status = "all",
        country = "all",
    } = options;

    const normalizedSearch = search.trim().toLowerCase();

    let results = [...adminReferralRecords];

    if (normalizedSearch) {
        results = results.filter((record) =>
            record.referrerName
                ?.toLowerCase()
                .includes(normalizedSearch) ||
            record.referrerUsername
                ?.toLowerCase()
                .includes(normalizedSearch) ||
            record.referredName
                ?.toLowerCase()
                .includes(normalizedSearch) ||
            record.referredEmail
                ?.toLowerCase()
                .includes(normalizedSearch) ||
            record.referrerUid
                ?.toLowerCase()
                .includes(normalizedSearch) ||
            record.referredUid
                ?.toLowerCase()
                .includes(normalizedSearch)
        );
    }

    if (status !== "all") {
        results = results.filter(
            (record) => record.status === status
        );
    }

    if (country !== "all") {
        results = results.filter(
            (record) => record.country === country
        );
    }

    return {
        success: true,
        data: cloneData(results),
    };
}


export async function getAdminReferralRecord(id) {
    await delay();

    const record = adminReferralRecords.find(
        (item) => item.id === id
    );

    if (!record) {
        return {
            success: false,
            message: "Referral record not found.",
            data: null,
        };
    }

    return {
        success: true,
        data: cloneData(record),
    };
}


export async function getAdminReferralMilestones() {
    await delay();

    return {
        success: true,
        data: cloneData(adminReferralMilestones),
    };
}


export async function flagAdminReferral(id, reason = "") {
    await delay();

    const record = adminReferralRecords.find(
        (item) => item.id === id
    );

    if (!record) {
        return {
            success: false,
            message: "Referral record not found.",
        };
    }

    record.flagged = true;
    record.status = "flagged";
    record.flagReason =
        reason || "Referral flagged for administrative review.";

    return {
        success: true,
        message: "Referral flagged successfully.",
        data: cloneData(record),
    };
}


export async function clearAdminReferralFlag(id) {
    await delay();

    const record = adminReferralRecords.find(
        (item) => item.id === id
    );

    if (!record) {
        return {
            success: false,
            message: "Referral record not found.",
        };
    }

    record.flagged = false;
    record.status =
        record.completedAt
            ? "successful"
            : "pending";

    record.flagReason = "";

    return {
        success: true,
        message: "Referral flag cleared.",
        data: cloneData(record),
    };
}

// Notifications
export async function getAdminNotificationSummary() {
    await delay();

    return {
        success: true,
        data: cloneData(adminNotificationSummary),
    };
}

export async function getAdminNotificationTypes() {
    await delay();

    return {
        success: true,
        data: cloneData(adminNotificationTypes),
    };
}

export async function getAdminNotifications(options = {}) {
    await delay();

    const {
        search = "",
        type = "all",
        status = "all",
    } = options;

    const normalizedSearch = search.trim().toLowerCase();

    let results = [...adminNotifications];

    if (normalizedSearch) {
        results = results.filter((notification) =>
            notification.title
                ?.toLowerCase()
                .includes(normalizedSearch) ||
            notification.message
                ?.toLowerCase()
                .includes(normalizedSearch) ||
            notification.id
                ?.toLowerCase()
                .includes(normalizedSearch)
        );
    }

    if (type !== "all") {
        results = results.filter(
            (notification) =>
                notification.type === type
        );
    }

    if (status !== "all") {
        results = results.filter(
            (notification) =>
                notification.status === status
        );
    }

    return {
        success: true,
        data: cloneData(results),
    };
}

export async function getAdminNotification(id) {
    await delay();

    const notification = adminNotifications.find(
        (item) => item.id === id
    );

    if (!notification) {
        return {
            success: false,
            message: "Notification not found.",
            data: null,
        };
    }

    return {
        success: true,
        data: cloneData(notification),
    };
}

export async function createAdminNotification(notificationData = {}) {
    await delay();

    if (!notificationData.title?.trim()) {
        return {
            success: false,
            message: "Notification title is required.",
        };
    }

    if (!notificationData.message?.trim()) {
        return {
            success: false,
            message: "Notification message is required.",
        };
    }

    const newNotification = {
        id: `notification-${Date.now()}`,
        title: notificationData.title.trim(),
        message: notificationData.message.trim(),
        type: notificationData.type || "system",
        status: notificationData.status || "draft",
        audience: notificationData.audience || "all",
        recipients: 0,
        readCount: 0,
        unreadCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        scheduledAt: notificationData.scheduledAt || null,
        sentAt: null,
        createdBy: "Admin",
    };

    adminNotifications.unshift(newNotification);

    return {
        success: true,
        message: "Notification created successfully.",
        data: cloneData(newNotification),
    };
}

export async function updateAdminNotification(
    id,
    updates = {}
) {
    await delay();

    const notification = adminNotifications.find(
        (item) => item.id === id
    );

    if (!notification) {
        return {
            success: false,
            message: "Notification not found.",
        };
    }

    if (
        updates.title !== undefined &&
        !updates.title?.trim()
    ) {
        return {
            success: false,
            message: "Notification title is required.",
        };
    }

    if (
        updates.message !== undefined &&
        !updates.message?.trim()
    ) {
        return {
            success: false,
            message: "Notification message is required.",
        };
    }

    Object.assign(notification, {
        ...updates,
        title:
            updates.title !== undefined
                ? updates.title.trim()
                : notification.title,
        message:
            updates.message !== undefined
                ? updates.message.trim()
                : notification.message,
        updatedAt: new Date().toISOString(),
    });

    return {
        success: true,
        message: "Notification updated successfully.",
        data: cloneData(notification),
    };
}

export async function toggleAdminNotification(id) {
    await delay();

    const notification = adminNotifications.find(
        (item) => item.id === id
    );

    if (!notification) {
        return {
            success: false,
            message: "Notification not found.",
        };
    }

    if (notification.status === "active") {
        notification.status = "disabled";
    } else {
        notification.status = "active";
    }

    notification.updatedAt = new Date().toISOString();

    return {
        success: true,
        message:
            notification.status === "active"
                ? "Notification enabled."
                : "Notification disabled.",
        data: cloneData(notification),
    };
}

export async function deleteAdminNotification(id) {
    await delay();

    const index = adminNotifications.findIndex(
        (item) => item.id === id
    );

    if (index === -1) {
        return {
            success: false,
            message: "Notification not found.",
        };
    }

    adminNotifications.splice(index, 1);

    return {
        success: true,
        message: "Notification deleted successfully.",
    };
}

// Settings
export async function getAdminSettings() {
    await delay();

    return {
        success: true,
        data: cloneData(adminSettings),
    };
}

export async function getAdminSettingsSections() {
    await delay();

    return {
        success: true,
        data: cloneData(adminSettingsSections),
    };
}

export async function updateAdminSettings(
    section,
    updates = {}
) {
    await delay();

    if (!adminSettings[section]) {
        return {
            success: false,
            message: "Settings section not found.",
        };
    }

    Object.assign(
        adminSettings[section],
        updates
    );

    return {
        success: true,
        message: "Settings saved successfully.",
        data: cloneData(
            adminSettings[section]
        ),
    };
}

export async function resetAdminSettings(
    section
) {
    await delay();

    if (!adminSettings[section]) {
        return {
            success: false,
            message: "Settings section not found.",
        };
    }

    const defaults = {
        general: {
            platformName: "Salok Earn",
            platformCode: "SAK",
            supportEmail: "support@salok.world",
            defaultTimezone: "Africa/Lagos",
            registrationEnabled: true,
            newUserBonus: 0,
        },

        earning: {
            earningCurrency: "SAK",
            minimumOfferReward: 10,
            maximumOfferReward: 5000,
            dailyEarningLimit: 100000,
            earningHistoryDays: 90,
            showEstimatedRewards: true,
        },

        withdrawal: {
            minimumWithdrawal: 500,
            maximumWithdrawal: 100000,
            dailyWithdrawalLimit: 100000,
            processingFee: 0,
            withdrawalsEnabled: true,
            manualReviewEnabled: true,
        },

        referral: {
            referralReward: 100,
            milestoneReward: 500,
            milestoneTarget: 5,
            referralsEnabled: true,
            requireQualifiedReferral: true,
            maximumReferralBonus: 5000,
        },

        trivia: {
            dailyAnswerLimit: 150,
            categoryAnswerLimit: 30,
            maximumEnergy: 10,
            roundEnergyCost: 1,
            rewardPerCorrectAnswer: 20,
            triviaEnabled: true,
        },

        community: {
            communityEnabled: true,
            imageUploadsEnabled: true,
            repliesEnabled: true,
            maximumMessageLength: 500,
            maximumImageSizeMb: 5,
            moderationEnabled: true,
        },

        maintenance: {
            maintenanceMode: false,
            maintenanceTitle:
                "We'll be back soon",
            maintenanceMessage:
                "Salok Earn is temporarily unavailable while we perform maintenance.",
            allowAdminAccess: true,
        },
    };

    Object.assign(
        adminSettings[section],
        cloneData(defaults[section])
    );

    return {
        success: true,
        message:
            "Settings restored to their default values.",
        data: cloneData(
            adminSettings[section]
        ),
    };
}

// Tasks
export async function getAdminTaskSummary() {
    await delay();

    return {
        success: true,
        data: cloneData(adminTaskSummary),
    };
}


export async function getAdminTaskCategories() {
    await delay();

    return {
        success: true,
        data: cloneData(adminTaskCategories),
    };
}


export async function getAdminTasks(options = {}) {
    await delay();

    const {
        search = "",
        status = "all",
        category = "all",
    } = options;

    const searchTerm = search.trim().toLowerCase();

    const filtered = adminTaskRecords.filter((task) => {
        const matchesSearch =
            !searchTerm ||
            task.title.toLowerCase().includes(searchTerm) ||
            task.description.toLowerCase().includes(searchTerm) ||
            task.provider.toLowerCase().includes(searchTerm);

        const matchesStatus =
            status === "all" ||
            task.status === status;

        const matchesCategory =
            category === "all" ||
            task.category === category;

        return (
            matchesSearch &&
            matchesStatus &&
            matchesCategory
        );
    });

    return {
        success: true,
        data: cloneData(filtered),
    };
}


export async function getAdminTask(id) {
    await delay();

    const task = adminTaskRecords.find(
        (item) => item.id === id
    );

    if (!task) {
        return {
            success: false,
            message: "Task not found.",
            data: null,
        };
    }

    return {
        success: true,
        data: cloneData(task),
    };
}


export async function createAdminTask(taskData = {}) {
    await delay();

    if (!taskData.title?.trim()) {
        return {
            success: false,
            message: "Task title is required.",
        };
    }

    if (!taskData.description?.trim()) {
        return {
            success: false,
            message: "Task description is required.",
        };
    }

    if (!taskData.reward || Number(taskData.reward) <= 0) {
        return {
            success: false,
            message: "A valid reward is required.",
        };
    }

    const category =
        adminTaskCategories.find(
            (item) => item.id === taskData.category
        ) || adminTaskCategories[0];

    const newTask = {
        id: `task-${Date.now()}`,
        title: taskData.title.trim(),
        description: taskData.description.trim(),
        category: category.id,
        categoryName: category.name,
        provider: taskData.provider?.trim() || "Salok Earn",
        reward: Number(taskData.reward),
        currency: "SAK",
        status: taskData.status || "draft",
        targetCountry:
            taskData.targetCountry?.trim() || "All countries",
        completionLimit:
            Number(taskData.completionLimit) || 1,
        completedCount: 0,
        requirements:
            Array.isArray(taskData.requirements)
                ? taskData.requirements
                : [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    adminTaskRecords.unshift(newTask);

    return {
        success: true,
        message: "Task created successfully.",
        data: cloneData(newTask),
    };
}


export async function updateAdminTask(id, updates = {}) {
    await delay();

    const taskIndex = adminTaskRecords.findIndex(
        (item) => item.id === id
    );

    if (taskIndex === -1) {
        return {
            success: false,
            message: "Task not found.",
        };
    }

    const existingTask = adminTaskRecords[taskIndex];

    let category = null;

    if (updates.category) {
        category =
            adminTaskCategories.find(
                (item) => item.id === updates.category
            ) || null;
    }

    const updatedTask = {
        ...existingTask,
        ...updates,
        ...(category
            ? {
                category: category.id,
                categoryName: category.name,
            }
            : {}),
        updatedAt: new Date().toISOString(),
    };

    if (updatedTask.reward !== undefined) {
        updatedTask.reward = Number(updatedTask.reward);
    }

    adminTaskRecords[taskIndex] = updatedTask;

    return {
        success: true,
        message: "Task updated successfully.",
        data: cloneData(updatedTask),
    };
}


export async function toggleAdminTask(id) {
    await delay();

    const taskIndex = adminTaskRecords.findIndex(
        (item) => item.id === id
    );

    if (taskIndex === -1) {
        return {
            success: false,
            message: "Task not found.",
        };
    }

    const task = adminTaskRecords[taskIndex];

    task.status =
        task.status === "active"
            ? "paused"
            : "active";

    task.updatedAt = new Date().toISOString();

    return {
        success: true,
        message:
            task.status === "active"
                ? "Task activated."
                : "Task paused.",
        data: cloneData(task),
    };
}


export async function deleteAdminTask(id) {
    await delay();

    const taskIndex = adminTaskRecords.findIndex(
        (item) => item.id === id
    );

    if (taskIndex === -1) {
        return {
            success: false,
            message: "Task not found.",
        };
    }

    const task = adminTaskRecords[taskIndex];

    adminTaskRecords.splice(taskIndex, 1);

    return {
        success: true,
        message: `"${task.title}" was deleted.`,
        data: cloneData(task),
    };
}

// Devices
export async function getAdminDeviceSummary() {
    await delay();

    return cloneData(adminDeviceSummary);
}

export async function getAdminDeviceRiskLevels() {
    await delay();

    return cloneData(adminDeviceRiskLevels);
}

export async function getAdminDeviceStatuses() {
    await delay();

    return cloneData(adminDeviceStatuses);
}

export async function getAdminDeviceCountries() {
    await delay();

    return cloneData(adminDeviceCountries);
}

export async function getAdminDevices(options = {}) {
    await delay();

    const {
        search = "",
        riskLevel = "all",
        status = "all",
        country = "All Countries",
    } = options;

    const searchValue = search.trim().toLowerCase();

    return cloneData(
        adminDeviceRecords.filter((device) => {
            const matchesSearch =
                !searchValue ||
                device.deviceFingerprint
                    .toLowerCase()
                    .includes(searchValue) ||
                device.deviceInstallId
                    .toLowerCase()
                    .includes(searchValue) ||
                device.accounts.some(
                    (account) =>
                        account.uid
                            .toLowerCase()
                            .includes(searchValue) ||
                        account.username
                            .toLowerCase()
                            .includes(searchValue) ||
                        account.email
                            .toLowerCase()
                            .includes(searchValue)
                );

            const matchesRisk =
                riskLevel === "all" ||
                device.riskLevel === riskLevel;

            const matchesStatus =
                status === "all" ||
                device.status === status;

            const matchesCountry =
                country === "All Countries" ||
                device.country === country;

            return (
                matchesSearch &&
                matchesRisk &&
                matchesStatus &&
                matchesCountry
            );
        })
    );
}

export async function getAdminDevice(id) {
    await delay();

    const device = adminDeviceRecords.find(
        (item) => item.id === id
    );

    return device ? cloneData(device) : null;
}

export async function scanAdminDevice(id) {
    await delay();

    const device = adminDeviceRecords.find(
        (item) => item.id === id
    );

    if (!device) {
        return {
            success: false,
            message: "Device record not found.",
        };
    }

    device.lastScanAt = new Date().toISOString();

    return {
        success: true,
        message: "Device scan completed.",
        data: cloneData(device),
    };
}

export async function flagAdminDevice(id, reason = "") {
    await delay();

    const device = adminDeviceRecords.find(
        (item) => item.id === id
    );

    if (!device) {
        return {
            success: false,
            message: "Device record not found.",
        };
    }

    device.status = "flagged";
    device.flaggedAt = new Date().toISOString();
    device.flaggedBy = "admin";
    device.flagReason =
        reason.trim() ||
        "Device flagged for manual review.";

    return {
        success: true,
        message: "Device flagged successfully.",
        data: cloneData(device),
    };
}

export async function clearAdminDeviceFlag(id) {
    await delay();

    const device = adminDeviceRecords.find(
        (item) => item.id === id
    );

    if (!device) {
        return {
            success: false,
            message: "Device record not found.",
        };
    }

    device.status = "clear";
    device.flaggedAt = null;
    device.flaggedBy = null;
    device.flagReason = null;

    return {
        success: true,
        message: "Device flag cleared.",
        data: cloneData(device),
    };
}

export async function blockAdminDevice(id) {
    await delay();

    const device = adminDeviceRecords.find(
        (item) => item.id === id
    );

    if (!device) {
        return {
            success: false,
            message: "Device record not found.",
        };
    }

    device.status = "blocked";

    device.accounts = device.accounts.map(
        (account) => ({
            ...account,
            status: "blocked",
        })
    );

    return {
        success: true,
        message: "Device blocked successfully.",
        data: cloneData(device),
    };
}

export async function unblockAdminDevice(id) {
    await delay();

    const device = adminDeviceRecords.find(
        (item) => item.id === id
    );

    if (!device) {
        return {
            success: false,
            message: "Device record not found.",
        };
    }

    device.status = "flagged";

    return {
        success: true,
        message: "Device unblocked successfully.",
        data: cloneData(device),
    };
}

// Broadcast
export async function getAdminBroadcastSummary() {
    await delay();

    return cloneData(adminBroadcastSummary);
}

export async function getAdminBroadcastAudiences() {
    await delay();

    return cloneData(adminBroadcastAudiences);
}

export async function getAdminBroadcastStatuses() {
    await delay();

    return cloneData(adminBroadcastStatuses);
}

export async function getAdminBroadcasts(options = {}) {
    await delay();

    const {
        search = "",
        status = "all",
    } = options;

    const searchValue =
        search.trim().toLowerCase();

    return cloneData(
        adminBroadcastRecords.filter((broadcast) => {
            const matchesSearch =
                !searchValue ||
                broadcast.subject
                    .toLowerCase()
                    .includes(searchValue) ||
                broadcast.audience
                    .toLowerCase()
                    .includes(searchValue);

            const matchesStatus =
                status === "all" ||
                broadcast.status === status;

            return (
                matchesSearch &&
                matchesStatus
            );
        })
    );
}

export async function getAdminBroadcast(id) {
    await delay();

    const broadcast =
        adminBroadcastRecords.find(
            (item) => item.id === id
        );

    return broadcast
        ? cloneData(broadcast)
        : null;
}

export async function createAdminBroadcast(
    broadcastData = {}
) {
    await delay();

    if (!broadcastData.subject?.trim()) {
        return {
            success: false,
            message: "Broadcast subject is required.",
        };
    }

    if (!broadcastData.body?.trim()) {
        return {
            success: false,
            message: "Broadcast message is required.",
        };
    }

    if (!broadcastData.audienceId) {
        return {
            success: false,
            message: "Recipient audience is required.",
        };
    }

    const audience =
        adminBroadcastAudiences.find(
            (item) =>
                item.id ===
                broadcastData.audienceId
        );

    if (!audience) {
        return {
            success: false,
            message: "Selected audience was not found.",
        };
    }

    const newBroadcast = {
        id: `broadcast-${Date.now()}`,
        subject:
            broadcastData.subject.trim(),
        body:
            broadcastData.body.trim(),
        audience: audience.name,
        audienceId: audience.id,
        recipientCount:
            audience.recipientCount,
        deliveredCount: 0,
        openedCount: 0,
        status:
            broadcastData.action === "send"
                ? "sent"
                : "draft",
        createdAt:
            new Date().toISOString(),
        sentAt:
            broadcastData.action === "send"
                ? new Date().toISOString()
                : null,
        createdBy: "Admin",
    };

    adminBroadcastRecords.unshift(
        newBroadcast
    );

    return {
        success: true,
        message:
            broadcastData.action === "send"
                ? "Broadcast sent successfully."
                : "Broadcast saved as draft.",
        data: cloneData(newBroadcast),
    };
}

export async function sendAdminBroadcastTest(
    broadcastData = {}
) {
    await delay();

    if (!broadcastData.email?.trim()) {
        return {
            success: false,
            message: "Test email address is required.",
        };
    }

    if (!broadcastData.subject?.trim()) {
        return {
            success: false,
            message: "Broadcast subject is required.",
        };
    }

    if (!broadcastData.body?.trim()) {
        return {
            success: false,
            message: "Broadcast message is required.",
        };
    }

    return {
        success: true,
        message:
            `Test email sent to ${broadcastData.email.trim()}.`,
    };
}

export async function deleteAdminBroadcast(id) {
    await delay();

    const index =
        adminBroadcastRecords.findIndex(
            (item) => item.id === id
        );

    if (index === -1) {
        return {
            success: false,
            message: "Broadcast not found.",
        };
    }

    adminBroadcastRecords.splice(index, 1);

    return {
        success: true,
        message: "Broadcast deleted.",
    };
}

export async function getAdminAuditSummary() {
    await delay();

    return cloneData(adminAuditSummary);
}

export async function getAdminAuditCategories() {
    await delay();

    return cloneData(adminAuditCategories);
}

export async function getAdminAuditSeverities() {
    await delay();

    return cloneData(adminAuditSeverities);
}

export async function getAdminAuditRecords(options = {}) {
    await delay();

    const {
        search = "",
        category = "all",
        severity = "all",
    } = options;

    let records = [...adminAuditRecords];

    const normalizedSearch = search.trim().toLowerCase();

    if (normalizedSearch) {
        records = records.filter((record) => {
            return (
                record.action.toLowerCase().includes(normalizedSearch) ||
                record.actionCode.toLowerCase().includes(normalizedSearch) ||
                record.adminName.toLowerCase().includes(normalizedSearch) ||
                record.adminEmail.toLowerCase().includes(normalizedSearch) ||
                record.target.toLowerCase().includes(normalizedSearch) ||
                record.targetId.toLowerCase().includes(normalizedSearch) ||
                record.description.toLowerCase().includes(normalizedSearch)
            );
        });
    }

    if (category !== "all") {
        records = records.filter(
            (record) => record.category === category
        );
    }

    if (severity !== "all") {
        records = records.filter(
            (record) => record.severity === severity
        );
    }

    return cloneData(records);
}

export async function getAdminAuditRecord(id) {
    await delay();

    const record = adminAuditRecords.find(
        (item) => item.id === id
    );

    if (!record) {
        return null;
    }

    return cloneData(record);
}

//System
export async function getAdminSystemSummary() {
    await delay();

    return cloneData(adminSystemSummary);
}

export async function getAdminSystemHealth() {
    await delay();

    return cloneData(adminSystemHealth);
}

export async function getAdminSystemRepairs() {
    await delay();

    return cloneData(adminSystemRepairs);
}

export async function getAdminSystemMaintenance() {
    await delay();

    return cloneData(adminSystemMaintenance);
}

export async function runAdminSystemRepair(
    repairId,
    options = {}
) {
    await delay(900);

    const repair = adminSystemRepairs.find(
        (item) => item.id === repairId
    );

    if (!repair) {
        return {
            success: false,
            message: "Repair operation was not found.",
        };
    }

    if (
        repair.requiresDate &&
        !options.date
    ) {
        return {
            success: false,
            message: "A repair date is required.",
        };
    }

    return {
        success: true,
        message: `${repair.name} completed successfully in mock mode.`,
        data: {
            repairId: repair.id,
            repairCode: repair.code,
            completedAt: new Date().toISOString(),
            mode: "mock",
            affectedRecords: Math.floor(
                Math.random() * 500
            ) + 50,
        },
    };
}

export async function updateAdminSystemMaintenance(
    updates = {}
) {
    await delay();

    Object.assign(
        adminSystemMaintenance,
        cloneData(updates)
    );

    return {
        success: true,
        message: "Maintenance settings updated.",
        data: cloneData(adminSystemMaintenance),
    };
}

const adminService = {
    getAdminOverview,
    getAdminTrendData,
    getAdminRecentUsers,
    getAdminRecentActivities,
    getAdminQuickActions,
    getAdminPageData,

    getAdminUsers,
    getAdminUser,
    getAdminUserSummary,
    getAdminUserRegions,
    updateAdminUserStatus,
    toggleAdminUserFlag,

    getAdminWithdrawals,
    getAdminWithdrawalSummary,
    getAdminWithdrawal,
    updateAdminWithdrawalStatus,
    batchUpdateAdminWithdrawals,

    getAdminEarningSummary,
    getAdminEarningOpportunities,
    getAdminEarningOpportunity,
    updateAdminEarningOpportunity,
    toggleAdminEarningOpportunity,
    deleteAdminEarningOpportunity,

    getAdminTriviaSummary,
    getAdminTriviaQuestions,
    getAdminTriviaQuestion,
    toggleAdminTriviaQuestion,
    updateAdminTriviaQuestion,
    deleteAdminTriviaQuestion,

    getAdminCommunitySummary,
    getAdminCommunityMessages,
    getAdminCommunityMessage,
    moderateAdminCommunityMessage,
    toggleAdminCommunityUserBlock,
    getAdminCommunityReports,

    getAdminReferralSummary,
    getAdminReferralRecords,
    getAdminReferralRecord,
    getAdminReferralMilestones,
    flagAdminReferral,
    clearAdminReferralFlag,

    getAdminNotificationSummary,
    getAdminNotificationTypes,
    getAdminNotifications,
    getAdminNotification,
    createAdminNotification,
    updateAdminNotification,
    toggleAdminNotification,
    deleteAdminNotification,

    createAdminTask,
    deleteAdminTask,
    getAdminTask,
    getAdminTaskCategories,
    getAdminTasks,
    getAdminTaskSummary,
    toggleAdminTask,
    updateAdminTask,

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

    createAdminBroadcast,
    deleteAdminBroadcast,
    getAdminBroadcast,
    getAdminBroadcastAudiences,
    getAdminBroadcastStatuses,
    getAdminBroadcasts,
    getAdminBroadcastSummary,
    sendAdminBroadcastTest,

    getAdminAuditCategories,
    getAdminAuditRecord,
    getAdminAuditRecords,
    getAdminAuditSeverities,
    getAdminAuditSummary,

    getAdminSettings,
    getAdminSettingsSections,
    updateAdminSettings,
    resetAdminSettings,

    getAdminSystemHealth,
    getAdminSystemMaintenance,
    getAdminSystemRepairs,
    getAdminSystemSummary,
    runAdminSystemRepair,
    updateAdminSystemMaintenance,
};

export default adminService;