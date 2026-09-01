const InterviewReport =
    require("../models/interviewReport.model")

const pdfParse =
    require("pdf-parse")

const PDFDocument =
    require("pdfkit")

const {
    generateInterviewReport,
    generateResumeContent
} = require("../services/ai.service")


async function generateInterviewReportController(
    req,
    res
) {
    try {
        const {
            selfDescription,
            jobDescription
        } = req.body


        if (!jobDescription) {
            return res.status(400).json({
                message:
                    "Job description is required"
            })
        }


        if (
            !req.file &&
            !selfDescription
        ) {
            return res.status(400).json({
                message:
                    "Resume or self description is required"
            })
        }


        
let resumeText = ""


if (req.file) {

    console.log(
        "PDF received by backend"
    )

    console.log(
        "File name:",
        req.file.originalname
    )

    console.log(
        "File size:",
        req.file.size
    )

    console.log(
        "File type:",
        req.file.mimetype
    )


    try {

        const pdf =
            new pdfParse.PDFParse({
                data: req.file.buffer
            })


        const resumeContent =
            await pdf.getText()


        resumeText =
            resumeContent.text || ""


        console.log(
            "PDF text extracted successfully"
        )

        console.log(
            "Extracted characters:",
            resumeText.length
        )


        if (!resumeText.trim()) {

            return res.status(400).json({
                message:
                    "The uploaded PDF does not contain readable text"
            })
        }

    } catch (error) {

        console.log(
            "PDF PARSING ERROR:"
        )

        console.log(error)

        return res.status(400).json({
            message:
                "Could not read the uploaded PDF"
        })
    }
}


        const reportFromAI =
            await generateInterviewReport({
                resume:
                    resumeText,

                selfDescription,

                jobDescription
            })


        console.log(
            "AI REPORT:",
            JSON.stringify(
                reportFromAI,
                null,
                2
            )
        )


        /*
         * SKILL GAPS
         */

        const skills =
            reportFromAI.skill_gaps ||
            reportFromAI.important_skill_gaps ||
            []


        const skillGaps =
            Array.isArray(skills)
                ? skills.map(
                    (skill) => {

                        if (
                            typeof skill ===
                            "object"
                        ) {
                            return {
                                skill:
                                    skill.skill ||
                                    "",

                                severity:
                                    skill.severity ||
                                    "medium"
                            }
                        }

                        return {
                            skill:
                                String(skill),

                            severity:
                                "medium"
                        }
                    }
                )
                : []


        /*
         * TECHNICAL QUESTIONS
         */

        const technicalQuestions =
            reportFromAI.technical_questions ||
            reportFromAI.technical_interview_questions ||
            []


        const technicalQuestionData =
            Array.isArray(
                technicalQuestions
            )
                ? technicalQuestions.map(
                    (question) => {

                        if (
                            typeof question ===
                            "object"
                        ) {
                            return {
                                question:
                                    question.question ||
                                    "",

                                answer:
                                    question.answer ||
                                    "No model answer was generated.",

                                intention:
                                    question.intention ||
                                    "Tests the candidate's understanding of the technical concept."
                            }
                        }

                        return {
                            question:
                                String(question),

                            answer:
                                "No model answer was generated.",

                            intention:
                                "Tests the candidate's understanding of the technical concept."
                        }
                    }
                )
                : []


        /*
         * BEHAVIORAL QUESTIONS
         */

        const behavioralQuestions =
            reportFromAI.behavioral_questions ||
            reportFromAI.behavioral_interview_questions ||
            []


        const behavioralQuestionData =
            Array.isArray(
                behavioralQuestions
            )
                ? behavioralQuestions.map(
                    (question) => {

                        if (
                            typeof question ===
                            "object"
                        ) {
                            return {
                                question:
                                    question.question ||
                                    "",

                                answer:
                                    question.answer ||
                                    "No model answer was generated.",

                                intention:
                                    question.intention ||
                                    "Tests the candidate's communication and behavioral skills."
                            }
                        }

                        return {
                            question:
                                String(question),

                            answer:
                                "No model answer was generated.",

                            intention:
                                "Tests the candidate's communication and behavioral skills."
                        }
                    }
                )
                : []


        /*
         * PREPARATION PLAN
         */

        const plans =
    Array.isArray(
        reportFromAI.preparation_plan
    )
        ? reportFromAI.preparation_plan
        : []


const preparationPlan =
    plans
        .map(
            (plan, index) => {

                if (
                    typeof plan ===
                    "object"
                ) {
                    return {
                        day:
                            Number(
                                plan.day ||
                                index + 1
                            ),

                        focus:
                            plan.focus ||
                            plan.description ||
                            ""
                    }
                }


                const text =
                    String(plan).trim()


                const dayMatch =
                    text.match(
                        /^Day\s*(\d+)\s*:\s*(.*)$/i
                    )


                if (dayMatch) {
                    return {
                        day:
                            Number(
                                dayMatch[1]
                            ),

                        focus:
                            dayMatch[2].trim()
                    }
                }


                return {
                    day:
                        index + 1,

                    focus:
                        text
                }
            }
        )
        .filter(
            (plan) =>
                plan.focus.trim()
        )
        /*
         * SAVE REPORT
         */

        const interviewReport =
            await InterviewReport.create({
                user:
                    req.user.id,

                title:
                    reportFromAI.job_title ||
                    "Interview Preparation",

                matchScore:
                    reportFromAI.match_score ||
                    0,

                skillGaps,

                technicalQuestions:
                    technicalQuestionData,

                behavioralQuestions:
                    behavioralQuestionData,

                preparationPlan,

                jobDescription,

                selfDescription,

                resume:
                    resumeText
            })


        return res.status(201).json({
            message:
                "Interview report generated successfully",

            interviewReport
        })

    } catch (error) {

        console.log(
            "GENERATE INTERVIEW REPORT ERROR:"
        )

        console.log(error)

        return res.status(500).json({
            message:
                "Failed to generate interview report"
        })
    }
}


async function getInterviewReportByIdController(
    req,
    res
) {
    try {

        const {
            interviewId
        } = req.params


        const interviewReport =
            await InterviewReport.findOne({
                _id:
                    interviewId,

                user:
                    req.user.id
            })


        if (!interviewReport) {
            return res.status(404).json({
                message:
                    "Interview report not found"
            })
        }


        return res.status(200).json({
            interviewReport
        })

    } catch (error) {

        console.log(error)

        return res.status(500).json({
            message:
                "Something went wrong"
        })
    }
}


async function getAllInterviewReportsController(
    req,
    res
) {
    try {

        const reports =
            await InterviewReport
                .find({
                    user:
                        req.user.id
                })
                .sort({
                    createdAt: -1
                })
                .select(
                    "-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan"
                )


        return res.status(200).json({
            interviewReports:
                reports
        })

    } catch (error) {

        console.log(error)

        return res.status(500).json({
            message:
                "Something went wrong"
        })
    }
}


async function generateResumePdfController(
    req,
    res
) {
    try {

        const {
            interviewReportId
        } = req.params


        const interviewReport =
            await InterviewReport.findOne({
                _id:
                    interviewReportId,

                user:
                    req.user.id
            })


        if (!interviewReport) {
            return res.status(404).json({
                message:
                    "Interview report not found"
            })
        }


        const resumeContent =
            await generateResumeContent({
                resume:
                    interviewReport.resume,

                selfDescription:
                    interviewReport.selfDescription,

                jobDescription:
                    interviewReport.jobDescription
            })


        const doc =
            new PDFDocument({
                margin: 50
            })


        const chunks = []


        doc.on(
            "data",
            (chunk) => {
                chunks.push(chunk)
            }
        )


        const pdfPromise =
            new Promise(
                (resolve, reject) => {

                    doc.on(
                        "end",
                        () => {
                            resolve(
                                Buffer.concat(
                                    chunks
                                )
                            )
                        }
                    )

                    doc.on(
                        "error",
                        reject
                    )
                }
            )


        doc
            .fontSize(20)
            .text(
                "Resume",
                {
                    align: "center"
                }
            )


        doc.moveDown()


        doc
            .fontSize(11)
            .text(
                resumeContent,
                {
                    align: "left",
                    lineGap: 5
                }
            )


        doc.end()


        const pdfBuffer =
            await pdfPromise


        res.set({
            "Content-Type":
                "application/pdf",

            "Content-Disposition":
                "attachment; filename=PrepGenie_Resume.pdf",

            "Content-Length":
                pdfBuffer.length
        })


        return res.send(
            pdfBuffer
        )

    } catch (error) {

        console.log(
            "GENERATE RESUME PDF ERROR:"
        )

        console.log(error)

        return res.status(500).json({
            message:
                "Failed to generate resume"
        })
    }
}


module.exports = {
    generateInterviewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController
}