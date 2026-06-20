/**
 * ATS Prompt Template
 */

/**
 * Build the full Gemini prompt for resume analysis
 * @param {string} resumeText - Cleaned resume text
 * @param {string} targetRole - e.g. "Frontend Developer"
 * @param {string} [jobDescription] - Optional job description for match scoring
 * @returns {string}
 */
function buildPrompt(resumeText, targetRole, jobDescription = "") {
  const jdSection = jobDescription
    ? `\nJob Description (for match scoring):\n${jobDescription}\n`
    : "";

  return `You are a world-class ATS (Applicant Tracking System) expert, senior tech recruiter, and resume optimization specialist with 15+ years of experience helping engineers land FAANG-level roles.

Your task is to deeply analyze the provided resume and return ONLY a valid JSON object — no markdown, no explanations, no code blocks, just raw JSON.

TARGET ROLE: ${targetRole}
${jdSection}
TASKS:
1. Calculate an ATS compatibility score (0–100) based on:
   - Keyword density for ${targetRole}
   - Use of action verbs
   - Quantified achievements
   - Formatting clarity
   - Skills section completeness

2. For EACH project/experience section, do ALL of the following:
   - Extract the project or company name
   - Rewrite existing weak bullet points using the STAR method (Situation, Task, Action, Result)
   - Make bullets quantified, specific, and ATS-friendly (use numbers, percentages, metrics)
   - Start each bullet with a strong action verb (Built, Developed, Optimized, Reduced, Increased, etc.)
   - Generate exactly 3 improved bullet points per project
   - Suggest 3–5 measurable metrics that could be added
   - List 3–5 keywords/technologies missing that are important for ${targetRole}

${jobDescription ? "3. Calculate a job description match score (0–100) comparing resume keywords to the job description." : ""}

RETURN THIS EXACT JSON STRUCTURE (no extra keys, no markdown):
{
  "atsScore": <number 0-100>,
  ${jobDescription ? '"matchScore": <number 0-100>,' : ""}
  "summary": "<2-3 sentence overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "projects": [
    {
      "projectName": "<project or company name>",
      "improvedBullets": [
        "<strong action verb + specific accomplishment + metric>",
        "<strong action verb + specific accomplishment + metric>",
        "<strong action verb + specific accomplishment + metric>"
      ],
      "metricSuggestions": ["<metric 1>", "<metric 2>", "<metric 3>"],
      "missingKeywords": ["<keyword 1>", "<keyword 2>", "<keyword 3>", "<keyword 4>", "<keyword 5>"]
    }
  ],
  "globalMissingKeywords": ["<keyword>", "<keyword>", "<keyword>", "<keyword>", "<keyword>"]
}

RESUME TEXT:
${resumeText}`;
}

module.exports = { buildPrompt };
