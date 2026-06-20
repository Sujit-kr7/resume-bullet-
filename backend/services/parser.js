/**
 * Resume Parser Service
 * Supports PDF (.pdf) and DOCX (.docx) files
 */

/**
 * @param {Buffer} buffer - File buffer from Multer memory storage
 * @param {string} mimetype - MIME type of the uploaded file
 * @returns {Promise<{ text: string }>}
 */
async function parseResume(buffer, mimetype) {
  const isDocx =
    mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimetype === "application/msword";

  const isPdf = mimetype === "application/pdf";

  if (isPdf) {
    const pdf = require("pdf-parse");
    const data = await pdf(buffer);
    const cleaned = cleanText(data.text);
    if (!cleaned || cleaned.length < 50) {
      throw new Error("Could not extract meaningful text from the PDF. Is it a scanned image?");
    }
    return { text: cleaned };
  }

  if (isDocx) {
    const mammoth = require("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    const cleaned = cleanText(result.value);
    if (!cleaned || cleaned.length < 50) {
      throw new Error("Could not extract meaningful text from the DOCX file.");
    }
    return { text: cleaned };
  }

  throw new Error("Unsupported file format. Please upload a PDF or DOCX file.");
}

/**
 * Clean extracted text — remove excessive whitespace, weird characters
 */
function cleanText(raw) {
  return raw
    .replace(/\r\n/g, "\n")         // Normalize line endings
    .replace(/[ \t]{2,}/g, " ")     // Collapse multiple spaces/tabs
    .replace(/\n{3,}/g, "\n\n")     // Collapse triple+ newlines to double
    .replace(/[^\x20-\x7E\n]/g, " ") // Remove non-printable chars
    .trim();
}

module.exports = { parseResume };
