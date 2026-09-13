import {
    mockProfileUser,
    profileStats,
    profilePreferences,
} from "../../data/profileData";

const MOCK_DELAY = 400;

function delay() {
    return new Promise((resolve) => {
        setTimeout(resolve, MOCK_DELAY);
    });
}

function cloneData(data) {
    return JSON.parse(
        JSON.stringify(data)
    );
}

/*
|--------------------------------------------------------------------------
| Profile
|--------------------------------------------------------------------------
*/

export async function getProfile() {
    await delay();

    return {
        success: true,
        data: cloneData(
            mockProfileUser
        ),
    };
}

export async function getProfileStats() {
    await delay();

    return {
        success: true,
        data: cloneData(
            profileStats
        ),
    };
}

export async function getProfilePreferences() {
    await delay();

    return {
        success: true,
        data: cloneData(
            profilePreferences
        ),
    };
}

/*
|--------------------------------------------------------------------------
| Full Profile Data
|--------------------------------------------------------------------------
*/

export async function getProfilePageData() {
    await delay();

    return {
        success: true,

        data: {
            user: cloneData(
                mockProfileUser
            ),

            stats: cloneData(
                profileStats
            ),

            preferences: cloneData(
                profilePreferences
            ),
        },
    };
}

/*
|--------------------------------------------------------------------------
| Update Profile
|--------------------------------------------------------------------------
*/

export async function updateProfile(
    profileData = {}
) {
    await delay();

    const updatedUser = {
        ...mockProfileUser,
        ...profileData,
    };

    return {
        success: true,

        message:
            "Profile updated successfully.",

        data: cloneData(
            updatedUser
        ),
    };
}

/*
|--------------------------------------------------------------------------
| Upload Profile Image — Mock
|--------------------------------------------------------------------------
*/

export async function uploadProfileImage(
    file
) {
    await delay();

    if (!file) {
        return {
            success: false,
            message:
                "Please select an image.",
        };
    }

    if (!file.type?.startsWith("image/")) {
        return {
            success: false,
            message:
                "Only image files are allowed.",
        };
    }

    const maxSize =
        5 * 1024 * 1024;

    if (file.size > maxSize) {
        return {
            success: false,
            message:
                "Profile image must be 5 MB or smaller.",
        };
    }

    const imageUrl =
        URL.createObjectURL(file);

    return {
        success: true,

        message:
            "Profile image selected.",

        data: {
            url: imageUrl,

            name: file.name,

            size: file.size,

            type: file.type,
        },
    };
}

export function revokeProfileImageUrl(
    imageUrl
) {
    if (
        imageUrl &&
        imageUrl.startsWith("blob:")
    ) {
        URL.revokeObjectURL(
            imageUrl
        );
    }
}

/*
|--------------------------------------------------------------------------
| Preferences
|--------------------------------------------------------------------------
*/

export async function updateProfilePreferences(
    preferences = {}
) {
    await delay();

    const updatedPreferences = {
        ...profilePreferences,
        ...preferences,
    };

    return {
        success: true,

        message:
            "Preferences updated successfully.",

        data: cloneData(
            updatedPreferences
        ),
    };
}

/*
|--------------------------------------------------------------------------
| Default Service
|--------------------------------------------------------------------------
*/

export default {
    getProfile,
    getProfileStats,
    getProfilePreferences,
    getProfilePageData,
    updateProfile,
    uploadProfileImage,
    revokeProfileImageUrl,
    updateProfilePreferences,
};