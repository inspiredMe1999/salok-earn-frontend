import {
    communityInfo,
    communityRules,
    communityMembers,
    communityMessages,
    communitySummary,
    mockCommunityUser,
} from "../../data/communityData";

const MOCK_DELAY = 400;

// Global community image uploads mirror the audited
// global chat storage rule: images up to 5 MB.
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function delay() {
    return new Promise((resolve) => {
        setTimeout(resolve, MOCK_DELAY);
    });
}

function cloneData(data) {
    return JSON.parse(JSON.stringify(data));
}

/*
|--------------------------------------------------------------------------
| Community Information
|--------------------------------------------------------------------------
*/

export async function getCommunityInfo() {
    await delay();

    return {
        success: true,
        data: cloneData(communityInfo),
    };
}

export async function getCommunityRules() {
    await delay();

    return {
        success: true,
        data: cloneData(communityRules),
    };
}

export async function getCommunityMembers() {
    await delay();

    return {
        success: true,
        data: cloneData(communityMembers),
        total: communityMembers.length,
    };
}

/*
|--------------------------------------------------------------------------
| Messages
|--------------------------------------------------------------------------
*/

export async function getCommunityMessages(options = {}) {
    await delay();

    const {
        searchTerm = "",
    } = options;

    let results = cloneData(communityMessages);

    if (searchTerm.trim()) {
        const term = searchTerm
            .trim()
            .toLowerCase();

        results = results.filter(
            (message) =>
                message.message
                    ?.toLowerCase()
                    .includes(term) ||
                message.displayName
                    ?.toLowerCase()
                    .includes(term) ||
                message.username
                    ?.toLowerCase()
                    .includes(term)
        );
    }

    return {
        success: true,
        data: results,
        total: results.length,
    };
}

/*
|--------------------------------------------------------------------------
| Send Message
|--------------------------------------------------------------------------
|
| Supports:
| - Text-only messages
| - Image messages
| - Replies
|
*/

export async function sendCommunityMessage(
    message,
    options = {}
) {
    await delay();

    const trimmedMessage =
        typeof message === "string"
            ? message.trim()
            : "";

    const imageUrl =
        options?.imageUrl || null;

    const replyTo =
        options?.replyTo || null;

    if (!trimmedMessage && !imageUrl) {
        return {
            success: false,
            message:
                "Message or image is required.",
        };
    }

    const newMessage = {
        id: `message-${Date.now()}`,
        userId: mockCommunityUser.uid,
        username: mockCommunityUser.username,
        displayName: mockCommunityUser.displayName,
        initials: mockCommunityUser.initials,
        role: mockCommunityUser.role,
        message: trimmedMessage,
        imageUrl,
        replyTo,
        timestamp: new Date().toISOString(),
        reactions: [],
    };

    communityMessages.push(newMessage);

    return {
        success: true,
        message: "Message sent successfully.",
        data: cloneData(newMessage),
    };
}

/*
|--------------------------------------------------------------------------
| Image Upload — Mock
|--------------------------------------------------------------------------
|
| This does NOT upload anything to Firebase.
|
| We simply create a browser object URL so the image can
| be displayed during frontend development.
|
*/

export async function uploadCommunityImage(
    file
) {
    await delay();

    if (!file) {
        return {
            success: false,
            message: "Please select an image.",
        };
    }

    if (!file.type?.startsWith("image/")) {
        return {
            success: false,
            message:
                "Only image files are allowed.",
        };
    }

    if (file.size > MAX_IMAGE_SIZE) {
        return {
            success: false,
            message:
                "Image must be 5 MB or smaller.",
        };
    }

    const imageUrl =
        URL.createObjectURL(file);

    return {
        success: true,
        message:
            "Image attached successfully.",
        data: {
            url: imageUrl,
            name: file.name,
            size: file.size,
            type: file.type,
        },
    };
}

/*
|--------------------------------------------------------------------------
| Remove Mock Image Object URL
|--------------------------------------------------------------------------
*/

export function revokeCommunityImageUrl(
    imageUrl
) {
    if (
        imageUrl &&
        imageUrl.startsWith("blob:")
    ) {
        URL.revokeObjectURL(imageUrl);
    }
}

/*
|--------------------------------------------------------------------------
| Reactions
|--------------------------------------------------------------------------
*/

export async function toggleMessageReaction(
    messageId,
    emoji
) {
    await delay();

    const message =
        communityMessages.find(
            (item) =>
                item.id === messageId
        );

    if (!message) {
        return {
            success: false,
            message: "Message not found.",
        };
    }

    const existingReaction =
        message.reactions.find(
            (reaction) =>
                reaction.emoji === emoji
        );

    if (existingReaction) {
        if (existingReaction.reacted) {
            existingReaction.count =
                Math.max(
                    0,
                    existingReaction.count - 1
                );

            existingReaction.reacted =
                false;
        } else {
            existingReaction.count += 1;
            existingReaction.reacted =
                true;
        }
    } else {
        message.reactions.push({
            emoji,
            count: 1,
            reacted: true,
        });
    }

    return {
        success: true,
        data: cloneData(message),
    };
}

/*
|--------------------------------------------------------------------------
| Summary / User
|--------------------------------------------------------------------------
*/

export async function getCommunitySummary() {
    await delay();

    return {
        success: true,
        data: cloneData(
            communitySummary
        ),
    };
}

export async function getCommunityUser() {
    await delay();

    return {
        success: true,
        data: cloneData(
            mockCommunityUser
        ),
    };
}

/*
|--------------------------------------------------------------------------
| Full Page Data
|--------------------------------------------------------------------------
*/

export async function getCommunityPageData() {
    await delay();

    return {
        success: true,
        data: {
            info: cloneData(
                communityInfo
            ),
            rules: cloneData(
                communityRules
            ),
            members: cloneData(
                communityMembers
            ),
            messages: cloneData(
                communityMessages
            ),
            summary: cloneData(
                communitySummary
            ),
            user: cloneData(
                mockCommunityUser
            ),
        },
    };
}

/*
|--------------------------------------------------------------------------
| Search
|--------------------------------------------------------------------------
*/

export async function searchCommunityMessages(
    searchTerm
) {
    return getCommunityMessages({
        searchTerm,
    });
}

/*
|--------------------------------------------------------------------------
| Default Service
|--------------------------------------------------------------------------
*/

export default {
    getCommunityInfo,
    getCommunityRules,
    getCommunityMembers,
    getCommunityMessages,
    getCommunitySummary,
    getCommunityUser,
    getCommunityPageData,
    sendCommunityMessage,
    uploadCommunityImage,
    revokeCommunityImageUrl,
    toggleMessageReaction,
    searchCommunityMessages,
};