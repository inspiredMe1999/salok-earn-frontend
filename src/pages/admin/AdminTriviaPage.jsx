import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
    CheckCircle2,
    Eye,
    Filter,
    PauseCircle,
    PlayCircle,
    RefreshCw,
    Search,
    ShieldAlert,
    Trash2,
    X,
} from "lucide-react";

import adminService from "../../services/mock/adminService";
import "./admin-trivia.css";

function formatNumber(value) {
    return new Intl.NumberFormat("en-US").format(value);
}

function formatDate(value) {
    if (!value) return "—";

    return new Date(value).toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric",
        }
    );
}

function AdminTriviaPage() {
    const [questions, setQuestions] = useState([]);
    const [summary, setSummary] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [category, setCategory] = useState("all");
    const [status, setStatus] = useState("all");
    const [difficulty, setDifficulty] =
        useState("all");

    const [selectedQuestion, setSelectedQuestion] =
        useState(null);

    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState("");

    async function loadData() {
        try {
            setLoading(true);
            setError("");

            const [
                questionsResponse,
                summaryResponse,
            ] = await Promise.all([
                adminService.getAdminTriviaQuestions({
                    searchTerm,
                    category,
                    status,
                    difficulty,
                }),
                adminService.getAdminTriviaSummary(),
            ]);

            if (!questionsResponse.success) {
                throw new Error(
                    questionsResponse.message ||
                        "Unable to load trivia questions."
                );
            }

            if (!summaryResponse.success) {
                throw new Error(
                    summaryResponse.message ||
                        "Unable to load trivia summary."
                );
            }

            setQuestions(
                Array.isArray(questionsResponse.data)
                    ? questionsResponse.data
                    : []
            );

            setSummary(summaryResponse.data);
        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                    "Unable to load trivia questions."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, [
        searchTerm,
        category,
        status,
        difficulty,
    ]);

    async function toggleQuestion(question) {
        try {
            setProcessing(true);

            const response =
                await adminService.toggleAdminTriviaQuestion(
                    question.id
                );

            if (!response.success) {
                throw new Error(
                    response.message ||
                        "Unable to update question."
                );
            }

            toast.success(response.message);

            setSelectedQuestion(null);

            await loadData();
        } catch (err) {
            toast.error(
                err.message ||
                    "Unable to update question."
            );
        } finally {
            setProcessing(false);
        }
    }

    async function deleteQuestion(question) {
        const confirmed = window.confirm(
            `Remove this trivia question?\n\n"${question.question}"`
        );

        if (!confirmed) return;

        try {
            setProcessing(true);

            const response =
                await adminService.deleteAdminTriviaQuestion(
                    question.id
                );

            if (!response.success) {
                throw new Error(
                    response.message ||
                        "Unable to remove question."
                );
            }

            toast.success(response.message);

            setSelectedQuestion(null);

            await loadData();
        } catch (err) {
            toast.error(
                err.message ||
                    "Unable to remove question."
            );
        } finally {
            setProcessing(false);
        }
    }

    function resetFilters() {
        setSearchTerm("");
        setCategory("all");
        setStatus("all");
        setDifficulty("all");
    }

    return (
        <section className="admin-trivia-page">
            <div className="admin-page-heading">
                <div>
                    <span className="admin-eyebrow">
                        Trivia operations
                    </span>

                    <h1>Trivia management</h1>

                    <p>
                        Review, search and manage the mock trivia
                        question catalogue.
                    </p>
                </div>

                <div className="admin-heading-actions">
                    <span className="admin-demo-badge">
                        Mock data only
                    </span>

                    <button
                        type="button"
                        className="admin-secondary-button"
                        onClick={loadData}
                        disabled={loading}
                    >
                        <RefreshCw size={16} />
                        Refresh
                    </button>
                </div>
            </div>

            {summary && (
                <div className="admin-trivia-summary">
                    <div>
                        <span>Total questions</span>
                        <strong>
                            {formatNumber(
                                summary.totalQuestions
                            )}
                        </strong>
                        <small>Question catalogue</small>
                    </div>

                    <div className="trivia-stat-success">
                        <span>Active questions</span>
                        <strong>
                            {formatNumber(
                                summary.activeQuestions
                            )}
                        </strong>
                        <small>Currently available</small>
                    </div>

                    <div className="trivia-stat-warning">
                        <span>Inactive</span>
                        <strong>
                            {formatNumber(
                                summary.inactiveQuestions
                            )}
                        </strong>
                        <small>Not currently served</small>
                    </div>

                    <div>
                        <span>Total answers</span>
                        <strong>
                            {formatNumber(
                                summary.totalAnswers
                            )}
                        </strong>
                        <small>Mock submissions</small>
                    </div>

                    <div className="trivia-stat-danger">
                        <span>Reports</span>
                        <strong>
                            {formatNumber(
                                summary.reportedQuestions
                            )}
                        </strong>
                        <small>Questions requiring review</small>
                    </div>
                </div>
            )}

            <div className="admin-trivia-toolbar">
                <div className="admin-trivia-search">
                    <Search size={17} />

                    <input
                        type="search"
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(
                                event.target.value
                            )
                        }
                        placeholder="Search questions..."
                    />
                </div>

                <div className="admin-trivia-filter">
                    <Filter size={15} />

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

                        <option value="general">
                            General Knowledge
                        </option>

                        <option value="science">
                            Science
                        </option>

                        <option value="history">
                            History
                        </option>

                        <option value="technology">
                            Technology
                        </option>

                        <option value="entertainment">
                            Entertainment
                        </option>

                        <option value="sports">
                            Sports
                        </option>
                    </select>
                </div>

                <select
                    className="admin-trivia-select"
                    value={difficulty}
                    onChange={(event) =>
                        setDifficulty(
                            event.target.value
                        )
                    }
                >
                    <option value="all">
                        All difficulty
                    </option>

                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>

                <select
                    className="admin-trivia-select"
                    value={status}
                    onChange={(event) =>
                        setStatus(event.target.value)
                    }
                >
                    <option value="all">
                        All statuses
                    </option>

                    <option value="active">
                        Active
                    </option>

                    <option value="inactive">
                        Inactive
                    </option>
                </select>

                <button
                    type="button"
                    className="admin-text-button"
                    onClick={resetFilters}
                >
                    Reset
                </button>
            </div>

            <div className="admin-panel">
                <div className="admin-panel-heading">
                    <div>
                        <h2>Question catalogue</h2>

                        <p>
                            {questions.length} question(s)
                            displayed
                        </p>
                    </div>

                    <span className="admin-panel-label">
                        Trivia bank
                    </span>
                </div>

                {loading ? (
                    <div className="admin-loading-state">
                        Loading trivia questions...
                    </div>
                ) : error ? (
                    <div className="admin-error-state">
                        <ShieldAlert size={20} />
                        <p>{error}</p>

                        <button
                            type="button"
                            onClick={loadData}
                        >
                            Try again
                        </button>
                    </div>
                ) : questions.length === 0 ? (
                    <div className="admin-empty-state">
                        No questions match the selected filters.
                    </div>
                ) : (
                    <div className="admin-trivia-list">
                        {questions.map((question) => (
                            <article
                                key={question.id}
                                className="admin-trivia-card"
                            >
                                <div className="admin-trivia-number">
                                    ?
                                </div>

                                <div className="admin-trivia-content">
                                    <div className="admin-trivia-top">
                                        <span className="admin-trivia-category">
                                            {
                                                question.categoryName
                                            }
                                        </span>

                                        <span
                                            className={`admin-trivia-difficulty ${question.difficulty}`}
                                        >
                                            {
                                                question.difficulty
                                            }
                                        </span>

                                        {question.reports >
                                            0 && (
                                            <span className="admin-trivia-report">
                                                <ShieldAlert
                                                    size={12}
                                                />
                                                {
                                                    question.reports
                                                }{" "}
                                                report
                                                {question.reports >
                                                1
                                                    ? "s"
                                                    : ""}
                                            </span>
                                        )}
                                    </div>

                                    <h3>
                                        {
                                            question.question
                                        }
                                    </h3>

                                    <div className="admin-trivia-meta">
                                        <span>
                                            Reward:{" "}
                                            <strong>
                                                {
                                                    question.reward
                                                }{" "}
                                                SAK
                                            </strong>
                                        </span>

                                        <span>
                                            Answers:{" "}
                                            <strong>
                                                {formatNumber(
                                                    question.answersCount
                                                )}
                                            </strong>
                                        </span>

                                        <span>
                                            Updated:{" "}
                                            <strong>
                                                {formatDate(
                                                    question.updatedAt
                                                )}
                                            </strong>
                                        </span>
                                    </div>
                                </div>

                                <span
                                    className={`admin-trivia-status ${question.status}`}
                                >
                                    {question.status}
                                </span>

                                <div className="admin-trivia-actions">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSelectedQuestion(
                                                question
                                            )
                                        }
                                    >
                                        <Eye size={15} />
                                        View
                                    </button>

                                    <button
                                        type="button"
                                        disabled={
                                            processing
                                        }
                                        onClick={() =>
                                            toggleQuestion(
                                                question
                                            )
                                        }
                                    >
                                        {question.status ===
                                        "active" ? (
                                            <>
                                                <PauseCircle
                                                    size={
                                                        15
                                                    }
                                                />
                                                Disable
                                            </>
                                        ) : (
                                            <>
                                                <PlayCircle
                                                    size={
                                                        15
                                                    }
                                                />
                                                Enable
                                            </>
                                        )}
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>

            {selectedQuestion && (
                <div
                    className="admin-trivia-modal-backdrop"
                    onClick={() =>
                        setSelectedQuestion(null)
                    }
                >
                    <div
                        className="admin-trivia-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="admin-trivia-modal-header">
                            <div>
                                <span className="admin-eyebrow">
                                    Question details
                                </span>

                                <h2>
                                    Trivia question
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedQuestion(
                                        null
                                    )
                                }
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="admin-trivia-question-box">
                            <span>
                                {
                                    selectedQuestion.categoryName
                                }
                            </span>

                            <h3>
                                {
                                    selectedQuestion.question
                                }
                            </h3>
                        </div>

                        <div className="admin-trivia-answer-list">
                            {selectedQuestion.answers.map(
                                (answer) => (
                                    <div
                                        key={answer.id}
                                        className={
                                            answer.id ===
                                            selectedQuestion.correctAnswer
                                                ? "correct"
                                                : ""
                                        }
                                    >
                                        <span>
                                            {answer.id.toUpperCase()}
                                        </span>

                                        <strong>
                                            {answer.text}
                                        </strong>

                                        {answer.id ===
                                            selectedQuestion.correctAnswer && (
                                            <CheckCircle2
                                                size={16}
                                            />
                                        )}
                                    </div>
                                )
                            )}
                        </div>

                        <div className="admin-trivia-detail-grid">
                            <div>
                                <span>Question ID</span>
                                <strong>
                                    {
                                        selectedQuestion.id
                                    }
                                </strong>
                            </div>

                            <div>
                                <span>Difficulty</span>
                                <strong>
                                    {
                                        selectedQuestion.difficulty
                                    }
                                </strong>
                            </div>

                            <div>
                                <span>Reward</span>
                                <strong>
                                    {
                                        selectedQuestion.reward
                                    }{" "}
                                    SAK
                                </strong>
                            </div>

                            <div>
                                <span>Answers</span>
                                <strong>
                                    {formatNumber(
                                        selectedQuestion.answersCount
                                    )}
                                </strong>
                            </div>
                        </div>

                        <div className="admin-trivia-modal-actions">
                            <button
                                type="button"
                                className="admin-trivia-toggle"
                                disabled={processing}
                                onClick={() =>
                                    toggleQuestion(
                                        selectedQuestion
                                    )
                                }
                            >
                                {selectedQuestion.status ===
                                "active" ? (
                                    <>
                                        <PauseCircle
                                            size={16}
                                        />
                                        Disable
                                    </>
                                ) : (
                                    <>
                                        <PlayCircle
                                            size={16}
                                        />
                                        Enable
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                className="admin-trivia-delete"
                                disabled={processing}
                                onClick={() =>
                                    deleteQuestion(
                                        selectedQuestion
                                    )
                                }
                            >
                                <Trash2 size={16} />
                                Remove
                            </button>
                        </div>

                        <p className="admin-trivia-demo-note">
                            Mock administration only. These
                            changes do not modify the Firebase
                            trivia system.
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
}

export default AdminTriviaPage;