import { useEffect, useMemo, useRef, useState } from "react";

import {
    Ban,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Eye,
    Flag,
    RefreshCw,
    Search,
    ShieldAlert,
    SlidersHorizontal,
    UserCheck,
    Users,
    X,
} from "lucide-react";

import { Link } from "react-router-dom";
import { toast } from "sonner";

import useAdminUsers from "./useAdminUsers";

import "./admin-users.css";

const PAGE_SIZE = 12;
const ALL_REGIONS = "All regions";

const numberFormatter = new Intl.NumberFormat("en-US");

const sakFormatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
});

const STATUS_LABELS = {
    active: "Active",
    suspended: "Suspended",
    flagged: "Flagged",
    pending: "Pending",
};

const STATUS_OPTIONS = [
    { value: "all", label: "All statuses" },
    { value: "active", label: "Active" },
    { value: "suspended", label: "Suspended" },
    { value: "flagged", label: "Flagged" },
    { value: "pending", label: "Pending" },
];

const COLUMNS = [
    { key: "displayName", label: "User", sortable: true, align: "left" },
    { key: "status", label: "Status", sortable: true, align: "left" },
    { key: "region", label: "Region", sortable: true, align: "left" },
    { key: "balance", label: "Balance", sortable: true, align: "right" },
    { key: "activities", label: "Activity", sortable: true, align: "right" },
    { key: "joinedAt", label: "Joined", sortable: true, align: "left" },
    { key: "actions", label: "Actions", sortable: false, align: "right" },
];

function formatNumber(value) {
    return numberFormatter.format(Number(value) || 0);
}

function formatSAK(value) {
    return `${sakFormatter.format(Number(value) || 0)} SAK`;
}

function formatDate(value) {
    if (!value) return "—";

    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? "—" : dateFormatter.format(parsed);
}

function getStatusLabel(status) {
    return STATUS_LABELS[status] || status;
}

function share(part, whole) {
    if (!whole) return 0;
    return Math.round((Number(part) / Number(whole)) * 100);
}

function compareUsers(a, b, key) {
    switch (key) {
        case "balance":
        case "activities":
        case "flags":
            return (Number(a[key]) || 0) - (Number(b[key]) || 0);
        case "joinedAt":
            return new Date(a.joinedAt || 0) - new Date(b.joinedAt || 0);
        default:
            return String(a[key] ?? "").localeCompare(String(b[key] ?? ""), "en", {
                sensitivity: "base",
            });
    }
}

function AdminUsersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [status, setStatus] = useState("all");
    const [region, setRegion] = useState(ALL_REGIONS);

    const [sort, setSort] = useState({ key: "joinedAt", direction: "desc" });
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState(() => new Set());
    const [busyUid, setBusyUid] = useState(null);

    const searchRef = useRef(null);

    const {
        users,
        summary,
        regions,
        phase,
        isRefreshing,
        error,
        refresh,
        changeStatus,
        toggleFlag,
    } = useAdminUsers({ searchTerm, status, region });

    const hasActiveFilters =
        Boolean(searchTerm) || status !== "all" || region !== ALL_REGIONS;

    const sortedUsers = useMemo(() => {
        const copy = [...users];
        const factor = sort.direction === "asc" ? 1 : -1;
        copy.sort((a, b) => compareUsers(a, b, sort.key) * factor);
        return copy;
    }, [users, sort]);

    const pageCount = Math.max(1, Math.ceil(sortedUsers.length / PAGE_SIZE));
    const safePage = Math.min(page, pageCount);
    const pageStart = (safePage - 1) * PAGE_SIZE;
    const visibleUsers = sortedUsers.slice(pageStart, pageStart + PAGE_SIZE);

    // Any change to the result set puts the reader back at the top of it.
    useEffect(() => {
        setPage(1);
        setSelected(new Set());
    }, [searchTerm, status, region, sort]);

    // "/" jumps to search, the way it does in the rest of the console.
    useEffect(() => {
        function handleKey(event) {
            const tag = event.target?.tagName;
            const typing =
                tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";

            if (event.key === "/" && !typing) {
                event.preventDefault();
                searchRef.current?.focus();
            }
        }

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);

    function toggleSort(key) {
        setSort((current) =>
            current.key === key
                ? {
                      key,
                      direction: current.direction === "asc" ? "desc" : "asc",
                  }
                : { key, direction: key === "displayName" ? "asc" : "desc" }
        );
    }

    function toggleSelection(uid) {
        setSelected((current) => {
            const next = new Set(current);
            next.has(uid) ? next.delete(uid) : next.add(uid);
            return next;
        });
    }

    function togglePageSelection() {
        const pageUids = visibleUsers.map((user) => user.uid);
        const allSelected = pageUids.every((uid) => selected.has(uid));

        setSelected((current) => {
            const next = new Set(current);
            pageUids.forEach((uid) =>
                allSelected ? next.delete(uid) : next.add(uid)
            );
            return next;
        });
    }

    function applyStatusFilter(nextStatus) {
        setStatus((current) => (current === nextStatus ? "all" : nextStatus));
    }

    function resetFilters() {
        setSearchTerm("");
        setStatus("all");
        setRegion(ALL_REGIONS);
    }

    async function handleStatusChange(uid, nextStatus) {
        setBusyUid(uid);
        const response = await changeStatus(uid, nextStatus);
        setBusyUid(null);

        if (!response.success) {
            toast.error(response.message);
            return;
        }

        toast.success(response.message);
    }

    async function handleFlagToggle(uid) {
        setBusyUid(uid);
        const response = await toggleFlag(uid);
        setBusyUid(null);

        response.success
            ? toast.success(response.message)
            : toast.error(response.message);
    }

    async function handleBulkStatus(nextStatus) {
        const uids = [...selected];
        const results = await Promise.all(
            uids.map((uid) => changeStatus(uid, nextStatus))
        );

        const failed = results.filter((result) => !result.success).length;
        const verb = nextStatus === "suspended" ? "Suspended" : "Reactivated";

        if (failed) {
            toast.error(`${failed} of ${uids.length} accounts did not change.`);
        } else {
            toast.success(`${verb} ${uids.length} accounts.`);
        }

        setSelected(new Set());
    }

    const regionOptions = regions.length ? regions : [ALL_REGIONS];
    const isEmpty = phase === "ready" && sortedUsers.length === 0;

    return (
        <section className="au">
            <header className="au-head">
                <div className="au-head-text">
                    <nav aria-label="Breadcrumb" className="au-crumbs">
                        <Link to="/admin">Admin</Link>
                        <span aria-hidden="true">/</span>
                        <span aria-current="page">Users</span>
                    </nav>

                    <h1>User management</h1>

                    <p>
                        Review accounts, act on flagged behaviour, and suspend or
                        reinstate access.
                    </p>
                </div>

                <div className="au-head-actions">
                    <span className="au-env" title="Data is served from the mock service">
                        Mock data
                    </span>

                    <button
                        type="button"
                        className="au-button"
                        onClick={refresh}
                        disabled={isRefreshing}
                    >
                        <RefreshCw
                            size={16}
                            className={isRefreshing ? "au-spin" : undefined}
                            aria-hidden="true"
                        />
                        {isRefreshing ? "Refreshing" : "Refresh"}
                    </button>
                </div>
            </header>

            <div className="au-rail" role="group" aria-label="Filter by account standing">
                <Stat
                    icon={<Users size={17} />}
                    label="Total users"
                    value={summary ? formatNumber(summary.totalUsers) : null}
                    tone="neutral"
                />

                <Stat
                    icon={<UserCheck size={17} />}
                    label="Active"
                    value={summary ? formatNumber(summary.activeUsers) : null}
                    meta={
                        summary
                            ? `${share(summary.activeUsers, summary.totalUsers)}% of platform`
                            : null
                    }
                    tone="active"
                    pressed={status === "active"}
                    onClick={() => applyStatusFilter("active")}
                />

                <Stat
                    icon={<Ban size={17} />}
                    label="Suspended"
                    value={summary ? formatNumber(summary.suspendedUsers) : null}
                    meta={
                        summary
                            ? `${share(summary.suspendedUsers, summary.totalUsers)}% of platform`
                            : null
                    }
                    tone="suspended"
                    pressed={status === "suspended"}
                    onClick={() => applyStatusFilter("suspended")}
                />

                <Stat
                    icon={<ShieldAlert size={17} />}
                    label="Flagged"
                    value={summary ? formatNumber(summary.flaggedUsers) : null}
                    meta={
                        summary
                            ? `${share(summary.flaggedUsers, summary.totalUsers)}% of platform`
                            : null
                    }
                    tone="flagged"
                    pressed={status === "flagged"}
                    onClick={() => applyStatusFilter("flagged")}
                />
            </div>

            <div className="au-toolbar">
                <div className="au-search">
                    <Search size={17} aria-hidden="true" />

                    <input
                        ref={searchRef}
                        id="au-search"
                        type="search"
                        placeholder="Name, username, email or UID"
                        aria-label="Search users"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                    />

                    {searchTerm ? (
                        <button
                            type="button"
                            className="au-search-clear"
                            onClick={() => {
                                setSearchTerm("");
                                searchRef.current?.focus();
                            }}
                            aria-label="Clear search"
                        >
                            <X size={14} aria-hidden="true" />
                        </button>
                    ) : (
                        <kbd className="au-kbd" aria-hidden="true">
                            /
                        </kbd>
                    )}
                </div>

                <div className="au-filters">
                    <label className="au-field">
                        <SlidersHorizontal size={14} aria-hidden="true" />
                        <span className="au-sr">Filter by status</span>
                        <select
                            value={status}
                            onChange={(event) => setStatus(event.target.value)}
                        >
                            {STATUS_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="au-field">
                        <span className="au-sr">Filter by region</span>
                        <select
                            value={region}
                            onChange={(event) => setRegion(event.target.value)}
                        >
                            {regionOptions.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </label>

                    {hasActiveFilters && (
                        <button
                            type="button"
                            className="au-button ghost"
                            onClick={resetFilters}
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            </div>

            <div className="au-panel" data-refreshing={isRefreshing ? "true" : undefined}>
                <div className="au-panel-head">
                    <div>
                        <h2>Accounts</h2>
                        <p aria-live="polite">
                            {phase === "loading"
                                ? "Loading accounts"
                                : `${formatNumber(sortedUsers.length)} ${
                                      sortedUsers.length === 1 ? "account" : "accounts"
                                  }${hasActiveFilters ? " match these filters" : ""}`}
                        </p>
                    </div>

                    {selected.size > 0 && (
                        <div className="au-bulk">
                            <span>{selected.size} selected</span>

                            <button
                                type="button"
                                onClick={() => handleBulkStatus("active")}
                            >
                                Reactivate
                            </button>

                            <button
                                type="button"
                                className="danger"
                                onClick={() => handleBulkStatus("suspended")}
                            >
                                Suspend
                            </button>

                            <button
                                type="button"
                                className="au-bulk-clear"
                                onClick={() => setSelected(new Set())}
                                aria-label="Clear selection"
                            >
                                <X size={14} aria-hidden="true" />
                            </button>
                        </div>
                    )}
                </div>

                {phase === "error" && (
                    <div className="au-state error" role="alert">
                        <ShieldAlert size={22} aria-hidden="true" />
                        <h3>The user list could not be loaded</h3>
                        <p>{error}</p>
                        <button type="button" className="au-button solid" onClick={refresh}>
                            Try again
                        </button>
                    </div>
                )}

                {isEmpty && (
                    <div className="au-state">
                        <Users size={26} aria-hidden="true" />
                        <h3>No accounts match</h3>
                        <p>
                            Widen the search, or clear the filters to see every
                            account on the platform.
                        </p>
                        {hasActiveFilters && (
                            <button
                                type="button"
                                className="au-button solid"
                                onClick={resetFilters}
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                )}

                {(phase === "loading" || (phase === "ready" && !isEmpty)) && (
                    <>
                        <div className="au-table-scroll">
                            <table className="au-table">
                                <caption className="au-sr">
                                    Platform user accounts with status, region,
                                    balance and activity
                                </caption>

                                <thead>
                                    <tr>
                                        <th scope="col" className="au-check-col">
                                            <input
                                                type="checkbox"
                                                aria-label="Select all users on this page"
                                                disabled={phase === "loading"}
                                                checked={
                                                    visibleUsers.length > 0 &&
                                                    visibleUsers.every((user) =>
                                                        selected.has(user.uid)
                                                    )
                                                }
                                                onChange={togglePageSelection}
                                            />
                                        </th>

                                        {COLUMNS.map((column) => (
                                            <th
                                                key={column.key}
                                                scope="col"
                                                data-align={column.align}
                                                aria-sort={
                                                    sort.key === column.key
                                                        ? sort.direction === "asc"
                                                            ? "ascending"
                                                            : "descending"
                                                        : "none"
                                                }
                                            >
                                                {column.sortable ? (
                                                    <button
                                                        type="button"
                                                        className="au-sort"
                                                        onClick={() =>
                                                            toggleSort(column.key)
                                                        }
                                                        data-active={
                                                            sort.key === column.key
                                                                ? "true"
                                                                : undefined
                                                        }
                                                    >
                                                        {column.label}
                                                        <span
                                                            className="au-sort-mark"
                                                            aria-hidden="true"
                                                        >
                                                            {sort.key === column.key
                                                                ? sort.direction ===
                                                                  "asc"
                                                                    ? "↑"
                                                                    : "↓"
                                                                : "↕"}
                                                        </span>
                                                    </button>
                                                ) : (
                                                    <span className="au-sr">
                                                        {column.label}
                                                    </span>
                                                )}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody>
                                    {phase === "loading"
                                        ? Array.from({ length: 6 }).map((_, index) => (
                                              <SkeletonRow key={index} />
                                          ))
                                        : visibleUsers.map((user) => (
                                              <UserRow
                                                  key={user.uid}
                                                  user={user}
                                                  selected={selected.has(user.uid)}
                                                  busy={busyUid === user.uid}
                                                  onSelect={() =>
                                                      toggleSelection(user.uid)
                                                  }
                                                  onStatusChange={handleStatusChange}
                                                  onFlagToggle={handleFlagToggle}
                                              />
                                          ))}
                                </tbody>
                            </table>
                        </div>

                        {phase === "ready" && (
                            <ul className="au-cards">
                                {visibleUsers.map((user) => (
                                    <UserCard
                                        key={user.uid}
                                        user={user}
                                        busy={busyUid === user.uid}
                                        onStatusChange={handleStatusChange}
                                        onFlagToggle={handleFlagToggle}
                                    />
                                ))}
                            </ul>
                        )}

                        {phase === "ready" && pageCount > 1 && (
                            <nav className="au-pager" aria-label="Pagination">
                                <p>
                                    {formatNumber(pageStart + 1)}–
                                    {formatNumber(
                                        Math.min(
                                            pageStart + PAGE_SIZE,
                                            sortedUsers.length
                                        )
                                    )}{" "}
                                    of {formatNumber(sortedUsers.length)}
                                </p>

                                <div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setPage((current) =>
                                                Math.max(1, current - 1)
                                            )
                                        }
                                        disabled={safePage === 1}
                                        aria-label="Previous page"
                                    >
                                        <ChevronLeft size={16} aria-hidden="true" />
                                    </button>

                                    <span>
                                        Page {safePage} of {pageCount}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setPage((current) =>
                                                Math.min(pageCount, current + 1)
                                            )
                                        }
                                        disabled={safePage === pageCount}
                                        aria-label="Next page"
                                    >
                                        <ChevronRight size={16} aria-hidden="true" />
                                    </button>
                                </div>
                            </nav>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}

function Stat({ icon, label, value, meta, tone, pressed, onClick }) {
    const content = (
        <>
            <span className="au-stat-icon" data-tone={tone} aria-hidden="true">
                {icon}
            </span>

            <span className="au-stat-body">
                <span className="au-stat-label">{label}</span>
                <strong className="au-stat-value">
                    {value ?? <span className="au-shimmer" aria-hidden="true" />}
                </strong>
                {meta && <span className="au-stat-meta">{meta}</span>}
            </span>
        </>
    );

    if (!onClick) {
        return <div className="au-stat">{content}</div>;
    }

    return (
        <button
            type="button"
            className="au-stat interactive"
            onClick={onClick}
            aria-pressed={pressed}
        >
            {content}
        </button>
    );
}

function UserRow({ user, selected, busy, onSelect, onStatusChange, onFlagToggle }) {
    const isSuspended = user.status === "suspended";
    const isFlagged = Number(user.flags) > 0;

    return (
        <tr data-selected={selected ? "true" : undefined} data-busy={busy ? "true" : undefined}>
            <td className="au-check-col">
                <input
                    type="checkbox"
                    checked={selected}
                    onChange={onSelect}
                    aria-label={`Select ${user.displayName}`}
                />
            </td>

            <td>
                <div className="au-identity">
                    <span className="au-avatar" aria-hidden="true">
                        {user.initials}
                    </span>

                    <span className="au-identity-text">
                        <strong>{user.displayName}</strong>
                        <span>@{user.username}</span>
                        <small>{user.email}</small>
                    </span>
                </div>
            </td>

            <td>
                <StatusBadge status={user.status} flags={user.flags} />
            </td>

            <td>
                <span className="au-region">
                    <strong>{user.countryCode}</strong>
                    <small>{user.region}</small>
                </span>
            </td>

            <td data-align="right">
                <span className="au-balance">{formatSAK(user.balance)}</span>
            </td>

            <td data-align="right">
                <span className="au-activity">{formatNumber(user.activities)}</span>
            </td>

            <td>
                <span className="au-date">{formatDate(user.joinedAt)}</span>
            </td>

            <td data-align="right">
                <RowActions
                    user={user}
                    busy={busy}
                    isSuspended={isSuspended}
                    isFlagged={isFlagged}
                    onStatusChange={onStatusChange}
                    onFlagToggle={onFlagToggle}
                />
            </td>
        </tr>
    );
}

function UserCard({ user, busy, onStatusChange, onFlagToggle }) {
    const isSuspended = user.status === "suspended";
    const isFlagged = Number(user.flags) > 0;

    return (
        <li className="au-card" data-busy={busy ? "true" : undefined}>
            <div className="au-card-top">
                <div className="au-identity">
                    <span className="au-avatar" aria-hidden="true">
                        {user.initials}
                    </span>

                    <span className="au-identity-text">
                        <strong>{user.displayName}</strong>
                        <span>@{user.username}</span>
                        <small>{user.email}</small>
                    </span>
                </div>

                <StatusBadge status={user.status} flags={user.flags} />
            </div>

            <dl className="au-card-facts">
                <div>
                    <dt>Balance</dt>
                    <dd className="au-balance">{formatSAK(user.balance)}</dd>
                </div>

                <div>
                    <dt>Region</dt>
                    <dd>
                        {user.countryCode} · {user.region}
                    </dd>
                </div>

                <div>
                    <dt>Activity</dt>
                    <dd>{formatNumber(user.activities)}</dd>
                </div>

                <div>
                    <dt>Joined</dt>
                    <dd>{formatDate(user.joinedAt)}</dd>
                </div>
            </dl>

            <RowActions
                user={user}
                busy={busy}
                isSuspended={isSuspended}
                isFlagged={isFlagged}
                onStatusChange={onStatusChange}
                onFlagToggle={onFlagToggle}
                labelled
            />
        </li>
    );
}

function RowActions({
    user,
    busy,
    isSuspended,
    isFlagged,
    onStatusChange,
    onFlagToggle,
    labelled = false,
}) {
    return (
        <div className="au-actions" data-labelled={labelled ? "true" : undefined}>
            <Link
                to={`/admin/users/${user.uid}`}
                className="au-action view"
                title={`Open ${user.displayName}`}
            >
                <Eye size={15} aria-hidden="true" />
                {labelled && <span>Open</span>}
                {!labelled && (
                    <span className="au-sr">Open {user.displayName}</span>
                )}
            </Link>

            <button
                type="button"
                className="au-action"
                disabled={busy}
                title={isSuspended ? "Reactivate account" : "Suspend account"}
                onClick={() =>
                    onStatusChange(user.uid, isSuspended ? "active" : "suspended")
                }
            >
                {isSuspended ? (
                    <CheckCircle2 size={15} aria-hidden="true" />
                ) : (
                    <Ban size={15} aria-hidden="true" />
                )}
                {labelled ? (
                    <span>{isSuspended ? "Reactivate" : "Suspend"}</span>
                ) : (
                    <span className="au-sr">
                        {isSuspended ? "Reactivate" : "Suspend"} {user.displayName}
                    </span>
                )}
            </button>

            <button
                type="button"
                className="au-action"
                data-on={isFlagged ? "true" : undefined}
                disabled={busy}
                aria-pressed={isFlagged}
                title={isFlagged ? "Remove flag" : "Flag for review"}
                onClick={() => onFlagToggle(user.uid)}
            >
                <Flag size={15} aria-hidden="true" />
                {labelled ? (
                    <span>{isFlagged ? "Unflag" : "Flag"}</span>
                ) : (
                    <span className="au-sr">
                        {isFlagged ? "Remove flag from" : "Flag"} {user.displayName}
                    </span>
                )}
            </button>
        </div>
    );
}

function StatusBadge({ status, flags }) {
    const count = Number(flags) || 0;

    return (
        <span className="au-status" data-status={status}>
            <span className="au-status-dot" aria-hidden="true" />
            {getStatusLabel(status)}
            {count > 0 && (
                <span className="au-status-flags" title={`${count} open flags`}>
                    {count}
                </span>
            )}
        </span>
    );
}

function SkeletonRow() {
    return (
        <tr className="au-skeleton" aria-hidden="true">
            <td className="au-check-col">
                <span className="au-shimmer box" />
            </td>
            <td>
                <div className="au-identity">
                    <span className="au-shimmer avatar" />
                    <span className="au-identity-text">
                        <span className="au-shimmer line wide" />
                        <span className="au-shimmer line" />
                    </span>
                </div>
            </td>
            {Array.from({ length: 6 }).map((_, index) => (
                <td key={index}>
                    <span className="au-shimmer line" />
                </td>
            ))}
        </tr>
    );
}

export default AdminUsersPage;