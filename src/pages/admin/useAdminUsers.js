import { useCallback, useEffect, useRef, useState } from "react";

import adminService from "../../services/mock/adminService";

const DEBOUNCE_MS = 250;

/**
 * Delays a fast-changing value (a search box, a slider) so that
 * downstream effects fire once the user stops typing.
 */
export function useDebouncedValue(value, delay = DEBOUNCE_MS) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debounced;
}

/**
 * Owns every piece of admin-user data fetching:
 *
 *  - reference data (summary, regions) is loaded once, not on every keystroke
 *  - in-flight requests are sequenced, so a slow early response can never
 *    overwrite a fast later one
 *  - the first load shows skeletons; later loads keep the current rows on
 *    screen and mark the table as refreshing
 *  - mutations apply optimistically and roll back if the service rejects
 */
export default function useAdminUsers({ searchTerm, status, region }) {
    const [users, setUsers] = useState([]);
    const [summary, setSummary] = useState(null);
    const [regions, setRegions] = useState([]);

    const [phase, setPhase] = useState("loading"); // loading | ready | error
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState("");

    const debouncedSearch = useDebouncedValue(searchTerm);

    const requestId = useRef(0);
    const mounted = useRef(true);
    const hasLoadedOnce = useRef(false);

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    const loadReferenceData = useCallback(async () => {
        try {
            const [summaryResponse, regionsResponse] = await Promise.all([
                adminService.getAdminUserSummary(),
                adminService.getAdminUserRegions(),
            ]);

            if (!mounted.current) return;

            setSummary(summaryResponse?.data ?? null);
            setRegions(regionsResponse?.data ?? []);
        } catch (err) {
            // Reference data is supporting context, not the main payload.
            // A failure here should never blank out the table.
            console.error("Failed to load admin reference data:", err);
        }
    }, []);

    const loadUsers = useCallback(async () => {
        const id = ++requestId.current;

        if (hasLoadedOnce.current) {
            setIsRefreshing(true);
        } else {
            setPhase("loading");
        }

        try {
            const response = await adminService.getAdminUsers({
                searchTerm: debouncedSearch,
                status,
                region,
            });

            // A newer request has already been issued — discard this result.
            if (id !== requestId.current || !mounted.current) return;

            if (!response?.success) {
                throw new Error(
                    response?.message || "The user list could not be loaded."
                );
            }

            setUsers(response.data ?? []);
            setError("");
            setPhase("ready");
            hasLoadedOnce.current = true;
        } catch (err) {
            if (id !== requestId.current || !mounted.current) return;

            console.error("Failed to load admin users:", err);
            setError(err.message || "The user list could not be loaded.");
            setPhase("error");
        } finally {
            if (id === requestId.current && mounted.current) {
                setIsRefreshing(false);
            }
        }
    }, [debouncedSearch, status, region]);

    useEffect(() => {
        loadReferenceData();
    }, [loadReferenceData]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const refresh = useCallback(async () => {
        await Promise.all([loadUsers(), loadReferenceData()]);
    }, [loadUsers, loadReferenceData]);

    const patchUser = useCallback((uid, patch) => {
        setUsers((current) =>
            current.map((user) =>
                user.uid === uid ? { ...user, ...patch } : user
            )
        );
    }, []);

    const changeStatus = useCallback(
        async (uid, nextStatus) => {
            const previous = users.find((user) => user.uid === uid);
            if (!previous) return { success: false, message: "User not found." };

            patchUser(uid, { status: nextStatus });

            try {
                const response = await adminService.updateAdminUserStatus(
                    uid,
                    nextStatus
                );

                if (!response?.success) {
                    patchUser(uid, { status: previous.status });
                    return response ?? {
                        success: false,
                        message: "The status change was rejected.",
                    };
                }

                loadReferenceData();
                return response;
            } catch (err) {
                patchUser(uid, { status: previous.status });
                return {
                    success: false,
                    message: err.message || "The status change did not save.",
                };
            }
        },
        [users, patchUser, loadReferenceData]
    );

    const toggleFlag = useCallback(
        async (uid) => {
            const previous = users.find((user) => user.uid === uid);
            if (!previous) return { success: false, message: "User not found." };

            const wasFlagged = Number(previous.flags) > 0;
            patchUser(uid, { flags: wasFlagged ? 0 : Math.max(1, previous.flags) });

            try {
                const response = await adminService.toggleAdminUserFlag(uid);

                if (!response?.success) {
                    patchUser(uid, { flags: previous.flags });
                    return response ?? {
                        success: false,
                        message: "The flag could not be changed.",
                    };
                }

                // Reconcile with whatever the service actually recorded.
                loadUsers();
                loadReferenceData();
                return response;
            } catch (err) {
                patchUser(uid, { flags: previous.flags });
                return {
                    success: false,
                    message: err.message || "The flag could not be changed.",
                };
            }
        },
        [users, patchUser, loadUsers, loadReferenceData]
    );

    return {
        users,
        summary,
        regions,
        phase,
        isRefreshing,
        error,
        refresh,
        changeStatus,
        toggleFlag,
    };
}