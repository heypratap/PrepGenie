import {
    useRef,
    useState
} from "react"

import {
    useNavigate
} from "react-router"

import "./home.css"

import {
    useInterview
} from "../hooks/useInterview"

function Home() {
    const navigate = useNavigate()

    const {
        loading,
        generateReport,
        reports
    } = useInterview()

    const resumeInputRef = useRef(null)

    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const [resumeName, setResumeName] = useState("")

    async function handleGenerateReport() {
        const resumeFile = resumeInputRef.current?.files?.[0]

        if (!jobDescription.trim()) {
            alert("Please paste the target job description.")
            return
        }

        if (!resumeFile && !selfDescription.trim()) {
            alert("Please upload your resume PDF or describe your background.")
            return
        }

        if (resumeFile) {
            if (resumeFile.type !== "application/pdf") {
                alert("Please upload a valid PDF file.")
                return
            }

            if (resumeFile.size > 3 * 1024 * 1024) {
                alert("Resume file must be smaller than 3MB.")
                return
            }
        }

        try {
            const report = await generateReport({
                jobDescription,
                selfDescription,
                resumeFile
            })

            navigate(`/interview/${report._id}`)
        } catch (error) {
            console.error(error)
            alert(
                error.response?.data?.message ||
                "Failed to generate interview plan. Please try again."
            )
        }
    }

    function scrollToGenerator() {
        const el = document.getElementById("generator")
        el?.scrollIntoView({ behavior: "smooth" })
    }

    if (loading) {
        return (
            <main className="loading-screen">
                <div className="spinner" />
                <h1>PrepGenie is preparing your interview plan...</h1>
            </main>
        )
    }

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-badge-stack">
                    <span className="hero-badge-text">
                        Over 10,000+ candidates prepared for top companies
                    </span>
                </div>

                <h1 className="hero-title">
                    Your AI Copilot for{" "}
                    <span className="hero-highlight">Targeted Interview</span> &{" "}
                    Career Success
                </h1>

                <p className="hero-subtitle">
                    Scale your interview readiness with personalized technical questions,
                    model answers, real-time skill gap analysis, and tailored resumes.
                </p>

                <button
                    className="hero-cta-btn"
                    onClick={scrollToGenerator}
                >
                    <span>Get Prepared Now</span>
                    <span className="cta-arrow">→</span>
                </button>
            </section>

            {/* Generator Card */}
            <section className="generator-wrapper" id="generator">
                <div className="generator-card">
                    <div className="generator-card__header">
                        <div className="header-icon">
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </div>
                        <div>
                            <h2>AI Interview Plan Generator</h2>
                            <p>Tailored preparation to help you land the role faster</p>
                        </div>
                    </div>

                    <div className="generator-card__body">
                        {/* Target Job Panel */}
                        <div className="input-panel">
                            <div className="input-panel__header">
                                <span className="step-number">01</span>
                                <h3>Target Job Description</h3>
                                <span className="status-badge required">Required</span>
                            </div>

                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                maxLength={5000}
                                className="custom-textarea"
                                placeholder="Paste the job description (responsibilities, requirements, tech stack)..."
                            />

                            <div className="char-counter">
                                {jobDescription.length} / 5000
                            </div>
                        </div>

                        <div className="panel-divider" />

                        {/* Profile & Resume Panel */}
                        <div className="input-panel">
                            <div className="input-panel__header">
                                <span className="step-number">02</span>
                                <h3>Your Profile & Experience</h3>
                            </div>

                            <div className="upload-container">
                                <label className="upload-dropzone" htmlFor="resume-file">
                                    <div className="dropzone-icon">
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                            <polyline points="17 8 12 3 7 8"></polyline>
                                            <line x1="12" y1="3" x2="12" y2="15"></line>
                                        </svg>
                                    </div>
                                    <p className="dropzone-title">Upload your resume</p>
                                    <span className="dropzone-hint">PDF only · Max 3MB</span>

                                    {resumeName && (
                                        <div className="selected-file-badge">
                                            <svg
                                                width="14"
                                                height="14"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                <polyline points="14 2 14 8 20 8"></polyline>
                                            </svg>
                                            <strong>{resumeName}</strong>
                                        </div>
                                    )}

                                    <input
                                        ref={resumeInputRef}
                                        id="resume-file"
                                        type="file"
                                        accept="application/pdf,.pdf"
                                        hidden
                                        onChange={(e) => {
                                            const file = e.target.files?.[0]
                                            if (!file) {
                                                setResumeName("")
                                                return
                                            }
                                            if (file.type !== "application/pdf") {
                                                alert("Please select a PDF file.")
                                                e.target.value = ""
                                                setResumeName("")
                                                return
                                            }
                                            if (file.size > 3 * 1024 * 1024) {
                                                alert("PDF must be smaller than 3MB.")
                                                e.target.value = ""
                                                setResumeName("")
                                                return
                                            }
                                            setResumeName(file.name)
                                        }}
                                    />
                                </label>
                            </div>

                            <div className="or-separator">
                                <span>OR</span>
                            </div>

                            <div className="self-desc-container">
                                <textarea
                                    value={selfDescription}
                                    onChange={(e) => setSelfDescription(e.target.value)}
                                    className="custom-textarea custom-textarea--short"
                                    placeholder="Or describe your skills, key projects, and years of experience..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="generator-card__footer">
                        <div className="footer-notice">
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                            </svg>
                            <span>AI Analysis · Generates in under a minute</span>
                        </div>

                        <button
                            onClick={handleGenerateReport}
                            className="generate-action-btn"
                        >
                            <span>Generate My Plan</span>
                            <span className="arrow">→</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Feature Cards Row */}
            <section className="features-section" id="features">
                <div className="feature-cards-grid">
                    <div className="feature-card">
                        <span className="feature-card__index">/01</span>
                        <div className="feature-card__icon icon-blue">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                        </div>
                        <h3>AI Question Prediction</h3>
                        <p>Role-specific technical & behavioral interview questions with interviewer intention and model answers.</p>
                    </div>

                    <div className="feature-card">
                        <span className="feature-card__index">/02</span>
                        <div className="feature-card__icon icon-dark">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            </svg>
                        </div>
                        <h3>Skill Gap Matrix</h3>
                        <p>Instant profile match score and missing competencies breakdown before stepping into the room.</p>
                    </div>

                    <div className="feature-card">
                        <span className="feature-card__index">/03</span>
                        <div className="feature-card__icon icon-black">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                        </div>
                        <h3>Tailored Roadmap</h3>
                        <p>Day-by-day actionable preparation schedule and downloadable ATS-tailored resume PDF.</p>
                    </div>

                    <div className="feature-card-highlight">
                        <span className="pill-tag">Feature</span>
                        <h2>A high-end AI preparation solution offering pro insights to ace any interview.</h2>
                        <button className="highlight-cta-btn" onClick={scrollToGenerator}>
                            <span>Try Now</span>
                            <span className="circle-arrow">↗</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Recent Preparation Plans */}
            {reports.length > 0 && (
                <section className="recent-section">
                    <div className="section-header">
                        <div>
                            <span className="pill-tag">History</span>
                            <h2 className="section-title">Your Recent Preparation Plans</h2>
                        </div>
                    </div>

                    <div className="recent-grid">
                        {reports.map((report) => {
                            const scoreClass =
                                report.matchScore >= 80
                                    ? "score-high"
                                    : report.matchScore >= 60
                                        ? "score-medium"
                                        : "score-low"

                            return (
                                <div
                                    key={report._id}
                                    className="recent-card"
                                    onClick={() => navigate(`/interview/${report._id}`)}
                                >
                                    <div className="recent-card__header">
                                        <h3>{report.title || "Target Position Plan"}</h3>
                                        <span className={`match-badge ${scoreClass}`}>
                                            {report.matchScore}% match
                                        </span>
                                    </div>
                                    <p className="recent-card__date">
                                        Created on {new Date(report.createdAt).toLocaleDateString(undefined, {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric"
                                        })}
                                    </p>
                                    <div className="recent-card__footer">
                                        <span>View complete strategy</span>
                                        <span className="recent-arrow">→</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="home-footer">
                <div className="home-footer__brand">
                    <img
                        src="/prepgenie-logo.png"
                        alt="PrepGenie Logo"
                        className="footer-logo-img"
                    />
                </div>
                <p>© 2026 PrepGenie. Intelligent AI interview preparation platform.</p>
            </footer>
        </div>
    )
}

export default Home