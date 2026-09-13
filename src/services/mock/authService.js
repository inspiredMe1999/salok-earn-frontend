const MOCK_USER = {
    id: "mock-user-001",
    uid: "mock-user-001",

    firstName: "Clement",
    lastName: "User",
    displayName: "Clement User",

    email: "demo@salok.earn",

    role: "user",

    wallet: {
        balance: 1250.75,
        pending: 180.25,
    },
};

/**
 * Mock login.
 */
export async function login(email, password) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (
                email === "demo@salok.earn" &&
                password === "password123"
            ) {
                localStorage.setItem(
                    "salok_mock_user",
                    JSON.stringify(MOCK_USER)
                );

                resolve(MOCK_USER);

                return;
            }

            reject(
                new Error(
                    "Invalid email or password. Try demo@salok.earn / password123"
                )
            );
        }, 900);
    });
}

/**
 * Mock account registration.
 *
 * No real account is created.
 * This only simulates the registration process.
 */
export async function register(userData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (!userData.email) {
                reject(
                    new Error(
                        "Email address is required."
                    )
                );

                return;
            }

            const newUser = {
                id: `mock-user-${Date.now()}`,
                uid: `mock-user-${Date.now()}`,

                firstName: userData.firstName,
                lastName: userData.lastName,

                displayName:
                    `${userData.firstName} ${userData.lastName}`,

                email: userData.email,

                role: "user",

                wallet: {
                    balance: 0,
                    pending: 0,
                },
            };

            localStorage.setItem(
                "salok_mock_user",
                JSON.stringify(newUser)
            );

            resolve(newUser);
        }, 1200);
    });
}


/**
 * Mock password reset request.
 *
 * Later this will call Firebase:
 *
 * sendPasswordResetEmail()
 *
 * For now, it only simulates the request.
 */
export async function sendPasswordReset(email) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (!email) {
                reject(
                    new Error(
                        "Email address is required."
                    )
                );

                return;
            }

            resolve({
                success: true,
                email,
            });
        }, 1000);
    });
}


/**
 * Mock password reset.
 */
export async function resetPassword(
    newPassword
) {
    return new Promise(
        (resolve, reject) => {
            setTimeout(() => {
                if (!newPassword) {
                    reject(
                        new Error(
                            "New password is required."
                        )
                    );

                    return;
                }

                if (
                    newPassword.length < 8
                ) {
                    reject(
                        new Error(
                            "Password must contain at least 8 characters."
                        )
                    );

                    return;
                }

                /*
                 * In the mock environment we
                 * simply simulate a successful
                 * password update.
                 *
                 * Firebase will replace this
                 * later.
                 */

                resolve({
                    success: true,
                });
            }, 1200);
        }
    );
}

/**
 * Get the currently authenticated mock user.
 */
export function getCurrentUser() {
    const storedUser =
        localStorage.getItem(
            "salok_mock_user"
        );

    if (!storedUser) {
        return null;
    }

    try {
        return JSON.parse(storedUser);
    } catch {
        localStorage.removeItem(
            "salok_mock_user"
        );

        return null;
    }
}

/**
 * Mock logout.
 */
export async function logout() {
    localStorage.removeItem(
        "salok_mock_user"
    );

    return true;
}