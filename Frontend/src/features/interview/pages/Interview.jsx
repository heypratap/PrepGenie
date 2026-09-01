import {
    useEffect,
    useState
} from "react"

import {
    useParams,
    useNavigate
} from "react-router"

import "./interview.css"

import {
    useInterview
} from "../hooks/useInterview"

const NAV_ITEMS = [
    {
        id: "technical",
        label: "Technical Questions"
    },
    {
        id: "behavioral",
        label: "Behavioral Questions"
    },
    {
        id: "roadmap",
        label: "Preparation Roadmap"
    }
]

function QuestionCard({ item, index }) {
    const [open, setOpen] = useState(false)

    return (
        <div className={`q-card ${open ? "q-card--open" : ""}`}>
            <button
                className="q-card__header"
                onClick={() => setOpen(!open)}
            >
                <span className="q-card__index">Q{index + 1}</span>
                <p className="q-card__title">{item.question}</p>
                <span className="q-card__toggle">
                    {open ? "−" : "+"}
                </span>
            </button>

            {open && (
                <div className="q-card__body">
                    <div className="q-card__section">
                        <span className="q-tag q-tag--intention">
                            Interviewer Intention
                        </span>
                        <p className="q-text">{item.intention}</p>
                    </div>

                    <div className="q-card__section">
                        <span className="q-tag q-tag--answer">
                            Model Answer & Framework
                        </span>
                        <p className="q-text">{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

function RoadMapDay({ day }) {
    return (
        <div className="roadmap-day-card">
            <div className="roadmap-day-card__header">
                <span className="day-badge">Day {day.day}</span>
                <h3>{day.focus}</h3>
            </div>

            <ul className="task-list">
                {day.tasks.map((task, index) => (
                    <li key={index} className="task-item">
                        <span className="task-check">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </span>
                        <span>{task}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

function Interview() {
    const { interviewId } = useParams()
    const navigate = useNavigate()

    const {
        report,
        loading,
        getReportById,
        getResumePdf
    } = useInterview()

    const [activeNav, setActiveNav] = useState("technical")

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        }
    }, [interviewId, getReportById])

    if (loading || !report) {
        return (
            <main className="loading-screen">
                <div className="spinner" />
                <h1>Building your tailored interview preparation plan...</h1>
            </main>
        )
    }

    const scoreClass =
        report.matchScore >= 80
            ? "high"
            : report.matchScore >= 60
                ? "medium"
                : "low"

    return (
        <div className="interview-page">
            <div className="interview-layout">
                {/* Left Navigation Sidebar */}
                <aside className="interview-nav">
                    <button
                        className="back-button"
                        onClick={() => navigate("/")}
                    >
                        <span>←</span>
                        <span>Back to Home</span>
                    </button>

                    <div className="nav-group">
                        <span className="nav-group-title">PLAN SECTIONS</span>

                        {NAV_ITEMS.map((item) => (
                            <button
                                key={item.id}
                                className={`nav-item-btn ${activeNav === item.id ? "active" : ""}`}
                                onClick={() => setActiveNav(item.id)}
                            >
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="nav-bottom-action">
                        <button
                            className="download-resume-btn"
                            onClick={() => getResumePdf(interviewId)}
                        >
                            <span>Download PDF Resume</span>
                            <span>↓</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="interview-content">
                    {activeNav === "technical" && (
                        <section className="section-content">
                            <header className="content-header">
                                <div>
                                    <span className="pill-tag">Technical Track</span>
                                    <h1>Technical Interview Questions</h1>
                                </div>
                                <span className="count-badge">
                                    {report.technicalQuestions.length} Questions
                                </span>
                            </header>

                            <div className="q-list">
                                {report.technicalQuestions.map((question, index) => (
                                    <QuestionCard
                                        key={index}
                                        item={question}
                                        index={index}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === "behavioral" && (
                        <section className="section-content">
                            <header className="content-header">
                                <div>
                                    <span className="pill-tag">Behavioral Track</span>
                                    <h1>Behavioral & Situational Questions</h1>
                                </div>
                                <span className="count-badge">
                                    {report.behavioralQuestions.length} Questions
                                </span>
                            </header>

                            <div className="q-list">
                                {report.behavioralQuestions.map((question, index) => (
                                    <QuestionCard
                                        key={index}
                                        item={question}
                                        index={index}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === "roadmap" && (
                        <section className="section-content">
                            <header className="content-header">
                                <div>
                                    <span className="pill-tag">Strategy</span>
                                    <h1>Preparation Roadmap</h1>
                                </div>
                                <span className="count-badge">
                                    {report.preparationPlan.length} Days Schedule
                                </span>
                            </header>

                            <div className="roadmap-grid">
                                {report.preparationPlan.map((day) => (
                                    <RoadMapDay
                                        key={day.day}
                                        day={day}
                                    />
                                ))}
                            </div>
                        </section>
                    )}
                </main>

                {/* Right Sidebar (Match Score & Skill Gaps) */}
                <aside className="interview-sidebar">
                    <div className="score-card">
                        <span className="sidebar-label">ROLE MATCH SCORE</span>
                        <div className={`score-display score-${scoreClass}`}>
                            <strong>{report.matchScore}</strong>
                            <span>/ 100</span>
                        </div>
                        <p className="score-description">
                            Calculated by analyzing your experience against target job requirements.
                        </p>
                    </div>

                    <div className="sidebar-divider" />

                    <div className="gaps-card">
                        <span className="sidebar-label">CRITICAL SKILL GAPS</span>
                        <div className="skill-list">
                            {report.skillGaps && report.skillGaps.length > 0 ? (
                                report.skillGaps.map((gap, index) => (
                                    <div
                                        key={index}
                                        className={`skill-box skill-${gap.severity || "medium"}`}
                                    >
                                        <span className="skill-name">{gap.skill}</span>
                                        <span className="skill-severity-label">{gap.severity || "gap"}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="no-gaps-text">No significant gaps detected! Great match.</p>
                            )}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}

export default Interview