const { buildPrompt } = require("../utils/prompt");

const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

/**
 * Analyze resume with Gemini AI using direct REST API
 * @param {string} resumeText - Cleaned resume text
 * @param {string} targetRole - Target job role
 * @param {string} [jobDescription] - Optional job description
 * @returns {Promise<object>} - Structured analysis result
 */
async function analyzeResume(resumeText, targetRole, jobDescription = "") {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    throw new Error("GEMINI_API_KEY is not configured. Please add it to your .env file.");
  }

  const prompt = buildPrompt(resumeText, targetRole, jobDescription);

  const url = `${GEMINI_API_BASE}/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const body = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      temperature: 0.3,
      topP: 0.8,
      maxOutputTokens: 8192,
    },
  };

  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (err) {
    throw new Error(`Network error calling Gemini API: ${err.message}`);
  }

  if (!response.ok) {
    const errBody = await response.text();
    let errMsg = `Gemini API error ${response.status}`;
    try {
      const parsed = JSON.parse(errBody);
      errMsg = parsed?.error?.message || errMsg;
    } catch (_) {}
    throw new Error(errMsg);
  }

  const data = await response.json();

  // Extract text from Gemini response structure
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) {
    throw new Error("Gemini returned an empty response. Please try again.");
  }

  // ─── Extract JSON ─────────────────────────────────────────────────────────
  const parsed = extractJSON(rawText);
  if (!parsed) {
    console.error("Raw Gemini response (first 500 chars):", rawText.substring(0, 500));
    throw new Error("AI returned an invalid response. Please try again.");
  }

  // ─── Validate required fields ─────────────────────────────────────────────
  if (typeof parsed.atsScore !== "number" || !Array.isArray(parsed.projects)) {
    throw new Error("AI response missing required fields. Please try again.");
  }

  // Clamp scores to 0–100
  parsed.atsScore = Math.max(0, Math.min(100, Math.round(parsed.atsScore)));
  if (parsed.matchScore !== undefined) {
    parsed.matchScore = Math.max(0, Math.min(100, Math.round(parsed.matchScore)));
  }

  return parsed;
}

/**
 * Robustly extract JSON from Gemini's text response
 */
function extractJSON(text) {
  // Direct parse
  try { return JSON.parse(text.trim()); } catch (_) {}

  // From markdown code block: ```json ... ```
  const codeBlock = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlock) {
    try { return JSON.parse(codeBlock[1].trim()); } catch (_) {}
  }

  // Find first { ... } block
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first !== -1 && last > first) {
    try { return JSON.parse(text.slice(first, last + 1)); } catch (_) {}
  }

  return null;
}

module.exports = { analyzeResume };

