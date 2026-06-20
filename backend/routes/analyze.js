const express = require("express");
const multer = require("multer");
const { parseResume } = require("../services/parser");
const { analyzeResume } = require("../services/ai");

const router = express.Router();

// ─── Multer: memory storage (no disk writes) ──────────────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and DOCX files are supported."), false);
    }
  },
});

// ─── POST /api/analyze-resume ─────────────────────────────────────────────────
router.post(
  "/analyze-resume",
  upload.single("resume"),
  async (req, res) => {
    try {
      // Validate file
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "No resume file uploaded. Please attach a PDF or DOCX file.",
        });
      }

      // Validate target role
      const targetRole = (req.body.targetRole || "").trim();
      if (!targetRole) {
        return res.status(400).json({
          success: false,
          error: "Please specify a target role (e.g., 'Frontend Developer').",
        });
      }

      const jobDescription = (req.body.jobDescription || "").trim();

      console.log(`\n📄 Analyzing resume for: ${targetRole}`);
      console.log(`   File: ${req.file.originalname} (${(req.file.size / 1024).toFixed(1)} KB)`);

      // Step 1: Parse resume
      const { text: resumeText } = await parseResume(req.file.buffer, req.file.mimetype);
      console.log(`   ✅ Parsed: ${resumeText.length} chars`);

      // Step 2: Analyze with AI
      const analysis = await analyzeResume(resumeText, targetRole, jobDescription);
      console.log(`   ✅ AI Analysis complete. ATS Score: ${analysis.atsScore}`);

      return res.json({
        success: true,
        data: analysis,
      });
    } catch (err) {
      console.error("❌ analyze-resume error:", err.message);

      // Return user-friendly errors
      const status = err.message.includes("Unsupported") ? 400
        : err.message.includes("API key") ? 503
        : err.message.includes("Could not extract") ? 422
        : 500;

      return res.status(status).json({
        success: false,
        error: err.message,
      });
    }
  }
);

// ─── Multer file filter error handler ────────────────────────────────────────
router.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      success: false,
      error: "File too large. Maximum size is 5MB.",
    });
  }
  if (err.message?.includes("Only PDF")) {
    return res.status(400).json({ success: false, error: err.message });
  }
  next(err);
});

module.exports = router;
