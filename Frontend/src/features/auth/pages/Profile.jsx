import {
    useState
} from "react"

import {
    useNavigate
} from "react-router"

import {
    useAuth
} from "../hooks/useAuth"

import {
    useInterview
} from "../../interview/hooks/useInterview"

import "./profile.css"

function Profile() {
    const navigate = useNavigate()
    const { user, handleLogout, handleUpdateUsername } = useAuth()
    const { reports, getResumePdf } = useInterview()

    const [isEditingUsername, setIsEditingUsername] = useState(false)
    const [newUsername, setNewUsername] = useState(user?.username || "")
    const [updating, setUpdating] = useState(false)
    const [feedback, setFeedback] = useState({ type: "", text: "" })

    const totalPlans = reports?.length || 0

    const averageScore = totalPlans > 0
        ? Math.round(
            reports.reduce((acc, r) => acc + (r.matchScore || 0), 0) / totalPlans
        )
        : 0

    const remainingUpdates = user?.remainingUpdates ?? 2
    const canUpdate = remainingUpdates > 0

    async function onSaveUsername(e) {
        e.preventDefault()
        setFeedback({ type: "", text: "" })

        if (!newUsername.trim()) {
            setFeedback({ type: "error", text: "Username cannot be empty." })
            return
        }

        if (newUsername.trim() === user?.username) {
            setIsEditingUsername(false)
            return
        }

        setUpdating(true)
        try {
            const res = await handleUpdateUsername(newUsername.trim())
            setFeedback({
                type: "success",
                text: res?.message || "Username updated successfully!"
            })
            setIsEditingUsername(false)
        } catch (err) {
            setFeedback({
                type: "error",
                text: err.response?.data?.message || "Failed to update username. Please try again."
            })
        } finally {
            setUpdating(false)
        }
    }

    function onStartEdit() {
        setNewUsername(user?.username || "")
        setFeedback({ type: "", text: "" })
        setIsEditingUsername(true)
    }

    function onCancelEdit() {
        setIsEditingUsername(false)
        setFeedback({ type: "", text: "" })
    }

    return (
        <div className="profile-page">
            <div className="profile-container">
                {/* Profile Header Card */}
                <div className="profile-header-card">
                    <div className="profile-avatar-wrapper">
                        <div className="profile-icon-box">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </div>
                        <div className="profile-identity">
                            <div className="name-row">
                                <h1>{user?.username || "Candidate"}</h1>
                                <span className="plan-badge">Candidate Account</span>
                            </div>
                            <p className="profile-email">{user?.email}</p>
                        </div>
                    </div>

                    <div className="profile-header-actions">
                        <button
                            className="profile-home-btn"
                            onClick={() => navigate("/")}
                        >
                            ← Back to Home
                        </button>
                        <button
                            className="profile-logout-btn"
                            onClick={handleLogout}
                        >
                            Sign out
                        </button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <span className="stat-label">PREPARED PLANS</span>
                        <strong className="stat-number">{totalPlans}</strong>
                        <p className="stat-hint">Generated interview strategies</p>
                    </div>

                    <div className="stat-card">
                        <span className="stat-label">AVG MATCH SCORE</span>
                        <strong className="stat-number">
                            {averageScore > 0 ? `${averageScore}%` : "—"}
                        </strong>
                        <p className="stat-hint">Across all evaluated positions</p>
                    </div>

                    <div className="stat-card">
                        <span className="stat-label">ACCOUNT STATUS</span>
                        <strong className="stat-number stat-active">Active</strong>
                        <p className="stat-hint">AI preparation access enabled</p>
                    </div>
                </div>

                {/* Account Details Box with Monthly Update Option */}
                <div className="profile-section-card">
                    <div className="card-header">
                        <div>
                            <h2>Personal Information</h2>
                            <p className="card-subtitle">Manage your candidate identity and credentials</p>
                        </div>
                        <span className="info-badge">Verified</span>
                    </div>

                    {feedback.text && (
                        <div className={`feedback-alert feedback-alert--${feedback.type}`}>
                            {feedback.text}
                        </div>
                    )}

                    <div className="info-fields-grid">
                        {/* Username Field with Monthly Limit Controls */}
                        <div className="info-field">
                            <div className="field-header">
                                <label>Username</label>
                                <span className={`limit-badge ${canUpdate ? "limit-available" : "limit-exhausted"}`}>
                                    {remainingUpdates} / 2 changes left this month
                                </span>
                            </div>

                            {isEditingUsername ? (
                                <form onSubmit={onSaveUsername} className="username-edit-form">
                                    <input
                                        type="text"
                                        className="username-edit-input"
                                        value={newUsername}
                                        onChange={(e) => setNewUsername(e.target.value)}
                                        placeholder="Enter new username"
                                        minLength={3}
                                        maxLength={30}
                                        autoFocus
                                        required
                                    />
                                    <div className="username-edit-actions">
                                        <button
                                            type="submit"
                                            className="btn-save"
                                            disabled={updating}
                                        >
                                            {updating ? "Saving..." : "Save"}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn-cancel"
                                            onClick={onCancelEdit}
                                            disabled={updating}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="field-value-row">
                                    <div className="field-value">
                                        <span>{user?.username || "Not set"}</span>
                                    </div>
                                    <button
                                        type="button"
                                        className="edit-username-btn"
                                        onClick={onStartEdit}
                                        disabled={!canUpdate}
                                        title={canUpdate ? "Change your username (max 2 times per month)" : "Monthly username change limit reached"}
                                    >
                                        {canUpdate ? "Change" : "Limit Reached"}
                                    </button>
                                </div>
                            )}

                            <span className="field-help-text">
                                You can change your username up to 2 times every 30 days.
                            </span>
                        </div>

                        {/* Email Field */}
                        <div className="info-field">
                            <div className="field-header">
                                <label>Email Address</label>
                            </div>
                            <div className="field-value-row">
                                <div className="field-value">
                                    <span>{user?.email || "Not set"}</span>
                                </div>
                            </div>
                            <span className="field-help-text">
                                Used for authentication and notifications.
                            </span>
                        </div>
                    </div>
                </div>

                {/* Past Preparation Plans Section */}
                <div className="profile-section-card">
                    <div className="card-header">
                        <h2>Your Interview History</h2>
                        <span className="count-pill">{totalPlans} Plans</span>
                    </div>

                    {totalPlans > 0 ? (
                        <div className="plans-table">
                            {reports.map((report) => {
                                const scoreClass =
                                    report.matchScore >= 80
                                        ? "score-high"
                                        : report.matchScore >= 60
                                            ? "score-medium"
                                            : "score-low"

                                return (
                                    <div key={report._id} className="plan-row">
                                        <div className="plan-main">
                                            <h3>{report.title || "Target Position Plan"}</h3>
                                            <p>
                                                Created on{" "}
                                                {new Date(report.createdAt).toLocaleDateString(undefined, {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric"
                                                })}
                                            </p>
                                        </div>

                                        <div className="plan-meta">
                                            <span className={`match-badge ${scoreClass}`}>
                                                {report.matchScore}% Match
                                            </span>

                                            <div className="plan-actions">
                                                <button
                                                    className="plan-view-btn"
                                                    onClick={() => navigate(`/interview/${report._id}`)}
                                                >
                                                    View Plan →
                                                </button>
                                                <button
                                                    className="plan-pdf-btn"
                                                    onClick={() => getResumePdf(report._id)}
                                                    title="Download tailored resume"
                                                >
                                                    Resume PDF
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="empty-plans">
                            <p>You haven't generated any interview preparation plans yet.</p>
                            <button
                                className="start-plan-btn"
                                onClick={() => navigate("/")}
                            >
                                Generate Your First Plan →
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Profile
