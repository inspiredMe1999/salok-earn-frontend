import { useEffect, useMemo, useState } from "react";
import {
    CheckCircle2,
    ChevronDown,
    Clock3,
    Eye,
    FileText,
    Gift,
    ListChecks,
    PauseCircle,
    PlayCircle,
    Plus,
    RefreshCw,
    Search,
    Trash2,
    Users,
    X,
} from "lucide-react";
import { toast } from "sonner";

import {
    createAdminTask,
    deleteAdminTask,
    getAdminTask,
    getAdminTaskCategories,
    getAdminTasks,
    getAdminTaskSummary,
    toggleAdminTask,
    updateAdminTask,
} from "../../services/mock/adminService";

import "./admin-tasks.css";


const initialForm = {
    title: "",
    description: "",
    category: "engagement",
    provider: "Salok Earn",
    reward: "",
    targetCountry: "All countries",
    completionLimit: 1,
    requirements: "",
    status: "draft",
};


function formatNumber(value) {
    return new Intl.NumberFormat().format(value || 0);
}


function formatDate(value) {
    if (!value) return "—";

    return new Intl.DateTimeFormat("en", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(value));
}


function getStatusLabel(status) {
    const labels = {
        active: "Active",
        paused: "Paused",
        draft: "Draft",
    };

    return labels[status] || status;
}


function getStatusClass(status) {
    return `admin-task-status admin-task-status-${status}`;
}


export default function AdminTasksPage() {
    const [summary, setSummary] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [categories, setCategories] = useState([]);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [category, setCategory] = useState("all");

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [selectedTask, setSelectedTask] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const [form, setForm] = useState(initialForm);
    const [saving, setSaving] = useState(false);


    const loadData = async (isRefresh = false) => {
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        try {
            const [
                summaryResult,
                taskResult,
                categoryResult,
            ] = await Promise.all([
                getAdminTaskSummary(),
                getAdminTasks({
                    search,
                    status,
                    category,
                }),
                getAdminTaskCategories(),
            ]);

            if (summaryResult.success) {
                setSummary(summaryResult.data);
            }

            if (taskResult.success) {
                setTasks(taskResult.data);
            }

            if (categoryResult.success) {
                setCategories(categoryResult.data);
            }
        } catch (error) {
            console.error(error);
            toast.error("Unable to load tasks.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };


    useEffect(() => {
        loadData();
    }, [search, status, category]);


    const stats = useMemo(() => {
        return [
            {
                label: "Total tasks",
                value: summary?.totalTasks || 0,
                icon: ListChecks,
            },
            {
                label: "Active",
                value: summary?.activeTasks || 0,
                icon: CheckCircle2,
            },
            {
                label: "Paused",
                value: summary?.pausedTasks || 0,
                icon: PauseCircle,
            },
            {
                label: "Completed today",
                value: summary?.completedToday || 0,
                icon: Users,
            },
            {
                label: "Rewards issued",
                value: `${formatNumber(summary?.totalRewardsIssued)} SAK`,
                icon: Gift,
            },
        ];
    }, [summary]);


    const openCreateForm = () => {
        setEditingTask(null);
        setForm(initialForm);
        setShowForm(true);
    };


    const openEditForm = (task) => {
        setEditingTask(task);

        setForm({
            title: task.title || "",
            description: task.description || "",
            category: task.category || "engagement",
            provider: task.provider || "Salok Earn",
            reward: task.reward || "",
            targetCountry:
                task.targetCountry || "All countries",
            completionLimit:
                task.completionLimit || 1,
            requirements:
                Array.isArray(task.requirements)
                    ? task.requirements.join("\n")
                    : "",
            status: task.status || "draft",
        });

        setShowForm(true);
    };


    const closeForm = () => {
        if (saving) return;

        setShowForm(false);
        setEditingTask(null);
        setForm(initialForm);
    };


    const handleFormChange = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };


    const handleSave = async (event) => {
        event.preventDefault();

        if (!form.title.trim()) {
            toast.error("Enter a task title.");
            return;
        }

        if (!form.description.trim()) {
            toast.error("Enter a task description.");
            return;
        }

        if (!form.reward || Number(form.reward) <= 0) {
            toast.error("Enter a valid reward.");
            return;
        }

        setSaving(true);

        try {
            const requirements = form.requirements
                .split("\n")
                .map((item) => item.trim())
                .filter(Boolean);

            const payload = {
                ...form,
                reward: Number(form.reward),
                completionLimit:
                    Number(form.completionLimit) || 1,
                requirements,
            };

            const result = editingTask
                ? await updateAdminTask(
                      editingTask.id,
                      payload
                  )
                : await createAdminTask(payload);

            if (!result.success) {
                toast.error(
                    result.message ||
                        "Unable to save task."
                );
                return;
            }

            toast.success(
                result.message ||
                    "Task saved successfully."
            );

            closeForm();
            await loadData(true);
        } catch (error) {
            console.error(error);
            toast.error("Unable to save task.");
        } finally {
            setSaving(false);
        }
    };


    const handleView = async (task) => {
        const result = await getAdminTask(task.id);

        if (!result.success) {
            toast.error(
                result.message || "Task not found."
            );
            return;
        }

        setSelectedTask(result.data);
        setShowDetails(true);
    };


    const handleToggle = async (task) => {
        const result = await toggleAdminTask(task.id);

        if (!result.success) {
            toast.error(
                result.message ||
                    "Unable to update task."
            );
            return;
        }

        toast.success(result.message);
        await loadData(true);
    };


    const handleDelete = async (task) => {
        const confirmed = window.confirm(
            `Delete "${task.title}"?\n\nThis is a mock admin action during frontend development.`
        );

        if (!confirmed) return;

        const result = await deleteAdminTask(task.id);

        if (!result.success) {
            toast.error(
                result.message ||
                    "Unable to delete task."
            );
            return;
        }

        toast.success(result.message);
        await loadData(true);
    };


    if (loading && !summary) {
        return (
            <section className="admin-tasks-page">
                <div className="admin-tasks-loading">
                    <RefreshCw size={22} className="spin" />
                    <span>Loading tasks...</span>
                </div>
            </section>
        );
    }


    return (
        <section className="admin-tasks-page">
            <div className="admin-tasks-header">
                <div>
                    <div className="admin-page-eyebrow">
                        Earning management
                    </div>

                    <h1>Tasks</h1>

                    <p>
                        Create and manage custom earning
                        tasks available across the
                        platform.
                    </p>
                </div>

                <div className="admin-tasks-header-actions">
                    <button
                        type="button"
                        className="admin-task-refresh-button"
                        onClick={() => loadData(true)}
                        disabled={refreshing}
                    >
                        <RefreshCw
                            size={17}
                            className={
                                refreshing
                                    ? "spin"
                                    : ""
                            }
                        />

                        Refresh
                    </button>

                    <button
                        type="button"
                        className="admin-task-primary-button"
                        onClick={openCreateForm}
                    >
                        <Plus size={18} />
                        Create task
                    </button>
                </div>
            </div>


            <div className="admin-task-notice">
                <FileText size={18} />

                <div>
                    <strong>Preview / Mock Data</strong>

                    <span>
                        Task management is currently
                        using mock services. No production
                        Firebase task data is being
                        modified.
                    </span>
                </div>
            </div>


            <div className="admin-task-stat-grid">
                {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <div
                            className="admin-task-stat-card"
                            key={stat.label}
                        >
                            <div className="admin-task-stat-icon">
                                <Icon size={19} />
                            </div>

                            <div>
                                <span>
                                    {stat.label}
                                </span>

                                <strong>
                                    {typeof stat.value ===
                                    "number"
                                        ? formatNumber(
                                              stat.value
                                          )
                                        : stat.value}
                                </strong>
                            </div>
                        </div>
                    );
                })}
            </div>


            <div className="admin-task-toolbar">
                <div className="admin-task-search">
                    <Search size={18} />

                    <input
                        type="search"
                        placeholder="Search tasks..."
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                    />
                </div>

                <div className="admin-task-filter">
                    <select
                        value={status}
                        onChange={(event) =>
                            setStatus(
                                event.target.value
                            )
                        }
                    >
                        <option value="all">
                            All statuses
                        </option>

                        <option value="active">
                            Active
                        </option>

                        <option value="paused">
                            Paused
                        </option>

                        <option value="draft">
                            Draft
                        </option>
                    </select>

                    <ChevronDown size={16} />
                </div>

                <div className="admin-task-filter">
                    <select
                        value={category}
                        onChange={(event) =>
                            setCategory(
                                event.target.value
                            )
                        }
                    >
                        <option value="all">
                            All categories
                        </option>

                        {categories.map(
                            (item) => (
                                <option
                                    value={item.id}
                                    key={item.id}
                                >
                                    {item.name}
                                </option>
                            )
                        )}
                    </select>

                    <ChevronDown size={16} />
                </div>
            </div>


            <div className="admin-task-table-card">
                <div className="admin-task-table-header">
                    <div>
                        <h2>Task catalogue</h2>

                        <span>
                            {formatNumber(tasks.length)}{" "}
                            matching tasks
                        </span>
                    </div>
                </div>

                {tasks.length === 0 ? (
                    <div className="admin-task-empty">
                        <ListChecks size={34} />

                        <h3>No tasks found</h3>

                        <p>
                            Try adjusting your search or
                            filters.
                        </p>
                    </div>
                ) : (
                    <div className="admin-task-table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Task</th>
                                    <th>Category</th>
                                    <th>Reward</th>
                                    <th>Target</th>
                                    <th>Completed</th>
                                    <th>Status</th>
                                    <th>Updated</th>
                                    <th />
                                </tr>
                            </thead>

                            <tbody>
                                {tasks.map((task) => (
                                    <tr key={task.id}>
                                        <td>
                                            <div className="admin-task-name">
                                                <strong>
                                                    {task.title}
                                                </strong>

                                                <span>
                                                    {
                                                        task.provider
                                                    }
                                                </span>
                                            </div>
                                        </td>

                                        <td>
                                            <span className="admin-task-category">
                                                {
                                                    task.categoryName
                                                }
                                            </span>
                                        </td>

                                        <td>
                                            <strong className="admin-task-reward">
                                                +
                                                {formatNumber(
                                                    task.reward
                                                )}{" "}
                                                SAK
                                            </strong>
                                        </td>

                                        <td>
                                            <span className="admin-task-target">
                                                {
                                                    task.targetCountry
                                                }
                                            </span>
                                        </td>

                                        <td>
                                            {formatNumber(
                                                task.completedCount
                                            )}
                                        </td>

                                        <td>
                                            <span
                                                className={getStatusClass(
                                                    task.status
                                                )}
                                            >
                                                {task.status ===
                                                    "active" && (
                                                    <CheckCircle2
                                                        size={
                                                            14
                                                        }
                                                    />
                                                )}

                                                {task.status ===
                                                    "paused" && (
                                                    <PauseCircle
                                                        size={
                                                            14
                                                        }
                                                    />
                                                )}

                                                {task.status ===
                                                    "draft" && (
                                                    <Clock3
                                                        size={
                                                            14
                                                        }
                                                    />
                                                )}

                                                {getStatusLabel(
                                                    task.status
                                                )}
                                            </span>
                                        </td>

                                        <td>
                                            {formatDate(
                                                task.updatedAt
                                            )}
                                        </td>

                                        <td>
                                            <div className="admin-task-actions">
                                                <button
                                                    type="button"
                                                    title="View task"
                                                    onClick={() =>
                                                        handleView(
                                                            task
                                                        )
                                                    }
                                                >
                                                    <Eye
                                                        size={
                                                            17
                                                        }
                                                    />
                                                </button>

                                                <button
                                                    type="button"
                                                    title={
                                                        task.status ===
                                                        "active"
                                                            ? "Pause task"
                                                            : "Activate task"
                                                    }
                                                    onClick={() =>
                                                        handleToggle(
                                                            task
                                                        )
                                                    }
                                                >
                                                    {task.status ===
                                                    "active" ? (
                                                        <PauseCircle
                                                            size={
                                                                17
                                                            }
                                                        />
                                                    ) : (
                                                        <PlayCircle
                                                            size={
                                                                17
                                                            }
                                                        />
                                                    )}
                                                </button>

                                                <button
                                                    type="button"
                                                    title="Edit task"
                                                    onClick={() =>
                                                        openEditForm(
                                                            task
                                                        )
                                                    }
                                                >
                                                    <FileText
                                                        size={
                                                            17
                                                        }
                                                    />
                                                </button>

                                                <button
                                                    type="button"
                                                    className="danger"
                                                    title="Delete task"
                                                    onClick={() =>
                                                        handleDelete(
                                                            task
                                                        )
                                                    }
                                                >
                                                    <Trash2
                                                        size={
                                                            17
                                                        }
                                                    />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>


            {showDetails && selectedTask && (
                <div
                    className="admin-task-modal-backdrop"
                    onMouseDown={() =>
                        setShowDetails(false)
                    }
                >
                    <div
                        className="admin-task-modal"
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="admin-task-modal-header">
                            <div>
                                <span>
                                    Task details
                                </span>

                                <h2>
                                    {selectedTask.title}
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowDetails(false)
                                }
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="admin-task-detail-grid">
                            <div>
                                <span>Category</span>
                                <strong>
                                    {
                                        selectedTask.categoryName
                                    }
                                </strong>
                            </div>

                            <div>
                                <span>Provider</span>
                                <strong>
                                    {
                                        selectedTask.provider
                                    }
                                </strong>
                            </div>

                            <div>
                                <span>Reward</span>
                                <strong>
                                    +
                                    {formatNumber(
                                        selectedTask.reward
                                    )}{" "}
                                    SAK
                                </strong>
                            </div>

                            <div>
                                <span>Status</span>
                                <strong>
                                    {getStatusLabel(
                                        selectedTask.status
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>Target</span>
                                <strong>
                                    {
                                        selectedTask.targetCountry
                                    }
                                </strong>
                            </div>

                            <div>
                                <span>Completed</span>
                                <strong>
                                    {formatNumber(
                                        selectedTask.completedCount
                                    )}
                                </strong>
                            </div>
                        </div>

                        <div className="admin-task-detail-section">
                            <span>Description</span>

                            <p>
                                {
                                    selectedTask.description
                                }
                            </p>
                        </div>

                        <div className="admin-task-detail-section">
                            <span>Requirements</span>

                            <ul>
                                {selectedTask.requirements?.map(
                                    (requirement) => (
                                        <li
                                            key={
                                                requirement
                                            }
                                        >
                                            <CheckCircle2
                                                size={15}
                                            />

                                            {requirement}
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>

                        <div className="admin-task-modal-footer">
                            <button
                                type="button"
                                className="admin-task-secondary-button"
                                onClick={() => {
                                    setShowDetails(
                                        false
                                    );
                                    openEditForm(
                                        selectedTask
                                    );
                                }}
                            >
                                Edit task
                            </button>

                            <button
                                type="button"
                                className="admin-task-primary-button"
                                onClick={() =>
                                    setShowDetails(false)
                                }
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {showForm && (
                <div
                    className="admin-task-modal-backdrop"
                    onMouseDown={closeForm}
                >
                    <form
                        className="admin-task-modal admin-task-form-modal"
                        onSubmit={handleSave}
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="admin-task-modal-header">
                            <div>
                                <span>
                                    {editingTask
                                        ? "Edit task"
                                        : "Create task"}
                                </span>

                                <h2>
                                    {editingTask
                                        ? "Update task"
                                        : "New earning task"}
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={closeForm}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="admin-task-form-grid">
                            <label>
                                <span>Task title</span>

                                <input
                                    name="title"
                                    value={form.title}
                                    onChange={
                                        handleFormChange
                                    }
                                    placeholder="e.g. Complete Your Profile"
                                />
                            </label>

                            <label>
                                <span>Provider</span>

                                <input
                                    name="provider"
                                    value={
                                        form.provider
                                    }
                                    onChange={
                                        handleFormChange
                                    }
                                    placeholder="Provider name"
                                />
                            </label>

                            <label>
                                <span>Category</span>

                                <select
                                    name="category"
                                    value={
                                        form.category
                                    }
                                    onChange={
                                        handleFormChange
                                    }
                                >
                                    {categories.map(
                                        (item) => (
                                            <option
                                                value={
                                                    item.id
                                                }
                                                key={
                                                    item.id
                                                }
                                            >
                                                {
                                                    item.name
                                                }
                                            </option>
                                        )
                                    )}
                                </select>
                            </label>

                            <label>
                                <span>Reward (SAK)</span>

                                <input
                                    type="number"
                                    min="1"
                                    name="reward"
                                    value={form.reward}
                                    onChange={
                                        handleFormChange
                                    }
                                    placeholder="100"
                                />
                            </label>

                            <label>
                                <span>Target country / region</span>

                                <input
                                    name="targetCountry"
                                    value={
                                        form.targetCountry
                                    }
                                    onChange={
                                        handleFormChange
                                    }
                                    placeholder="All countries"
                                />
                            </label>

                            <label>
                                <span>Completion limit</span>

                                <input
                                    type="number"
                                    min="1"
                                    name="completionLimit"
                                    value={
                                        form.completionLimit
                                    }
                                    onChange={
                                        handleFormChange
                                    }
                                />
                            </label>

                            <label>
                                <span>Status</span>

                                <select
                                    name="status"
                                    value={
                                        form.status
                                    }
                                    onChange={
                                        handleFormChange
                                    }
                                >
                                    <option value="draft">
                                        Draft
                                    </option>

                                    <option value="active">
                                        Active
                                    </option>

                                    <option value="paused">
                                        Paused
                                    </option>
                                </select>
                            </label>

                            <label className="admin-task-form-full">
                                <span>Description</span>

                                <textarea
                                    name="description"
                                    rows="4"
                                    value={
                                        form.description
                                    }
                                    onChange={
                                        handleFormChange
                                    }
                                    placeholder="Describe what the user needs to complete."
                                />
                            </label>

                            <label className="admin-task-form-full">
                                <span>
                                    Requirements
                                </span>

                                <textarea
                                    name="requirements"
                                    rows="4"
                                    value={
                                        form.requirements
                                    }
                                    onChange={
                                        handleFormChange
                                    }
                                    placeholder={
                                        "One requirement per line"
                                    }
                                />

                                <small>
                                    Enter one requirement
                                    per line.
                                </small>
                            </label>
                        </div>

                        <div className="admin-task-form-warning">
                            <FileText size={17} />

                            <span>
                                This form currently
                                modifies mock data only.
                                Production task records
                                will be connected later
                                through the backend service
                                layer.
                            </span>
                        </div>

                        <div className="admin-task-modal-footer">
                            <button
                                type="button"
                                className="admin-task-secondary-button"
                                onClick={closeForm}
                                disabled={saving}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="admin-task-primary-button"
                                disabled={saving}
                            >
                                {saving ? (
                                    <>
                                        <RefreshCw
                                            size={17}
                                            className="spin"
                                        />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2
                                            size={17}
                                        />

                                        {editingTask
                                            ? "Save changes"
                                            : "Create task"}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </section>
    );
}