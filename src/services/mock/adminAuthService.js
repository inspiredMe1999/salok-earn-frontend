const ADMIN_STORAGE_KEY = "salok_mock_admin";

const mockAdmin = {
    uid: "mock-admin-001",
    name: "Salok Administrator",
    email: "admin@salok.earn",
    role: "admin",
    permissions: [
        "users.view",
        "users.manage",
        "withdrawals.manage",
        "tasks.manage",
        "devices.view",
        "reports.manage",
        "broadcasts.manage",
        "audit.view",
        "system.manage",
    ],
};

function delay(milliseconds = 500) {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}

function saveAdmin(admin) {
    localStorage.setItem(
        ADMIN_STORAGE_KEY,
        JSON.stringify(admin)
    );
}

function readAdmin() {
    const storedAdmin = localStorage.getItem(
        ADMIN_STORAGE_KEY
    );

    if (!storedAdmin) {
        return null;
    }

    try {
        return JSON.parse(storedAdmin);
    } catch {
        localStorage.removeItem(ADMIN_STORAGE_KEY);
        return null;
    }
}

export async function adminLogin(email, password) {
    await delay();

    if (
        email !== "admin@salok.earn" ||
        password !== "admin123"
    ) {
        return {
            success: false,
            message: "Invalid administrator credentials.",
        };
    }

    saveAdmin(mockAdmin);

    return {
        success: true,
        data: mockAdmin,
        message: "Administrator login successful.",
    };
}

export async function adminLogout() {
    await delay(200);

    localStorage.removeItem(ADMIN_STORAGE_KEY);

    return {
        success: true,
        message: "Administrator logged out successfully.",
    };
}

export async function getCurrentAdmin() {
    await delay(200);

    return {
        success: true,
        data: readAdmin(),
    };
}

export function isAdminAuthenticated() {
    return Boolean(readAdmin());
}

const adminAuthService = {
    adminLogin,
    adminLogout,
    getCurrentAdmin,
    isAdminAuthenticated,
};

export default adminAuthService;