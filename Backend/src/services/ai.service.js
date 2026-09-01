const {
    GoogleGenAI
} = require("@google/genai")


const ai =
    new GoogleGenAI({
        apiKey:
            process.env.GEMINI_API_KEY
    })


async function generateInterviewReport({
    resume,
    selfDescription,
    jobDescription
}) {
    const prompt = `
You are an expert technical interviewer
and career coach.

Analyze the candidate information
and job description below.

CANDIDATE RESUME:
${resume || "No resume provided"}

CANDIDATE SELF DESCRIPTION:
${selfDescription || "No self description provided"}

JOB DESCRIPTION:
${jobDescription}

Create a personalized interview
preparation report.

Return ONLY valid JSON.

Use EXACTLY this structure:

{
    "match_score": 0,
    "job_title": "",
    "technical_questions": [
        {
            "question": "",
            "intention": "",
            "answer": ""
        }
    ],
    "behavioral_questions": [
        {
            "question": "",
            "intention": "",
            "answer": ""
        }
    ],
    "skill_gaps": [
        ""
    ],
    "preparation_plan": [
        ""
    ]
}

Generate 7 technical questions.

Generate 5 behavioral questions.

Every question must have its own
specific answer.

Every question must have its own
specific intention.

Do not repeat answers.

Do not repeat intentions.

Technical answers must be accurate
and suitable for an interview.

Behavioral answers should be realistic
and use the STAR approach where useful.

The skill gaps must be based on the
actual candidate and job description.

The preparation plan must address
the candidate's actual weaknesses.

Do not use markdown.

Do not add anything outside the JSON.
`

    const response =
        await ai.models.generateContent({
            model:
                "gemini-3.6-flash",

            contents:
                prompt
        })


    let text =
        response.text


    text =
        text
            .replace(
                /^```json\s*/i,
                ""
            )
            .replace(
                /^```\s*/i,
                ""
            )
            .replace(
                /\s*```$/i,
                ""
            )
            .trim()


    return JSON.parse(text)
}


async function generateResumeContent({
    resume,
    selfDescription,
    jobDescription
}) {
    const prompt = `
You are a professional resume writer.

Create an improved professional resume
for the target job.

TARGET JOB:
${jobDescription}

CURRENT RESUME:
${resume || "No resume provided"}

CANDIDATE INFORMATION:
${selfDescription || "No additional information provided"}

Keep all information truthful.

Do not invent companies, degrees,
projects, achievements, dates,
technologies, or experience.

Improve the wording, structure,
clarity, and relevance of the resume.

Return only the resume content.

Use this structure:

NAME

PROFESSIONAL SUMMARY

SKILLS

EXPERIENCE

PROJECTS

EDUCATION

ACHIEVEMENTS

Only include sections for which
information is available.
`

    const response =
        await ai.models.generateContent({
            model:
                "gemini-3.6-flash",

            contents:
                prompt
        })


    return response.text
}


module.exports = {
    generateInterviewReport,
    generateResumeContent
}