import {
    useCallback,
    useContext,
    useEffect
} from "react"

import { useParams } from "react-router"

import {
    InterviewContext
} from "../interview.context"

import {
    generateInterviewReport,
    getInterviewReportById,
    getAllInterviewReports,
    generateResumePdf
} from "../services/interview.api"

export function useInterview() {
    const context = useContext(
        InterviewContext
    )

    const { interviewId } = useParams()

    if (!context) {
        throw new Error(
            "useInterview must be used inside InterviewProvider"
        )
    }

    const {
        loading,
        setLoading,
        report,
        setReport,
        reports,
        setReports
    } = context

    async function generateReport({
        jobDescription,
        selfDescription,
        resumeFile
    }) {
        setLoading(true)

        try {
            const response =
                await generateInterviewReport({
                    jobDescription,
                    selfDescription,
                    resumeFile
                })

            setReport(
                response.interviewReport
            )

            return response.interviewReport
        } finally {
            setLoading(false)
        }
    }

    const getReportById = useCallback(
        async (id) => {
            setLoading(true)

            try {
                const response =
                    await getInterviewReportById(id)

                setReport(
                    response.interviewReport
                )

                return response.interviewReport
            } finally {
                setLoading(false)
            }
        },
        [setLoading, setReport]
    )

    const getReports = useCallback(
        async () => {
            setLoading(true)

            try {
                const response =
                    await getAllInterviewReports()

                setReports(
                    response.interviewReports
                )

                return response.interviewReports
            } finally {
                setLoading(false)
            }
        },
        [setLoading, setReports]
    )

    async function getResumePdf(id) {
        setLoading(true)

        try {
            const pdf =
                await generateResumePdf(id)

            const url =
                window.URL.createObjectURL(
                    new Blob(
                        [pdf],
                        {
                            type: "application/pdf"
                        }
                    )
                )

            const link =
                document.createElement("a")

            link.href = url

            link.download =
                "PrepGenie_Resume.pdf"

            document.body.appendChild(link)

            link.click()

            link.remove()

            window.URL.revokeObjectURL(url)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [
        interviewId,
        getReportById,
        getReports
    ])

    return {
        loading,
        report,
        reports,

        generateReport,
        getReportById,
        getReports,
        getResumePdf
    }
}