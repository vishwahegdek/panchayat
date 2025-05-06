const express = require("express");
const router = express.Router();
const pool = require("./dbConfig");
const multer = require("multer");
const path = require("path");

// Set up storage for feedback document uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/feedback/");
  },
  filename: function (req, file, cb) {
    cb(null, "feedback-" + Date.now() + "-" + file.originalname);
  },
});

// Configure upload parameters
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    // Accept images, PDFs, and document files
    const filetypes = /jpeg|jpg|png|pdf|doc|docx/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only images, PDFs, and document files are allowed"));
  },
});

// Generate feedback reference ID
function generateFeedbackReference() {
  const prefix = "FDB";
  const year = new Date().getFullYear().toString();
  const random = Math.floor(10000 + Math.random() * 90000).toString();
  return `${prefix}-${year}-${random}`;
}

// Submit new feedback
router.post("/feedback", async (req, res) => {
  try {
    const {
      citizenName,
      villageName,
      aadharNumber,
      mobileNumber,
      emailAddress,
      feedbackType,
      department,
      feedbackDetails,
      rating,
      suggestions,
    } = req.body;

    // Validate required fields
    if (
      !citizenName ||
      !villageName ||
      !aadharNumber ||
      !mobileNumber ||
      !feedbackType ||
      !department ||
      !feedbackDetails ||
      !rating
    ) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided" });
    }

    // Validate Aadhar number format
    if (!/^\d{12}$/.test(aadharNumber)) {
      return res.status(400).json({ error: "Invalid Aadhar number format" });
    }

    // Validate mobile number format
    if (!/^\d{10}$/.test(mobileNumber)) {
      return res.status(400).json({ error: "Invalid mobile number format" });
    }

    // Generate feedback reference ID
    const feedbackReference = generateFeedbackReference();

    // Insert data into feedback table
    const [result] = await pool.query(
      `INSERT INTO feedback 
       (feedback_reference, citizen_name, village_name, aadhar_number, mobile_number, 
        email_address, feedback_type, department, feedback_details, quality_rating, improvement_suggestions) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        feedbackReference,
        citizenName,
        villageName,
        aadharNumber,
        mobileNumber,
        emailAddress,
        feedbackType,
        department,
        feedbackDetails,
        rating,
        suggestions,
      ]
    );

    // Return success with the generated feedback ID and reference
    res.status(201).json({
      message: "Feedback submitted successfully",
      feedbackId: result.insertId,
      feedbackReference: feedbackReference,
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ error: "Failed to submit feedback" });
  }
});

// Upload feedback documents
router.post(
  "/feedback-documents/:feedbackId",
  upload.array("documents", 5),
  async (req, res) => {
    try {
      const feedbackId = req.params.feedbackId;
      const files = req.files;

      if (!files || files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      // Create database entries for the uploaded documents
      const documentInserts = files.map(async (file) => {
        await pool.query(
          `INSERT INTO feedback_documents (feedback_id, document_path, document_name, document_type) 
         VALUES (?, ?, ?, ?)`,
          [feedbackId, file.path, file.originalname, file.mimetype]
        );
      });

      await Promise.all(documentInserts);

      res.status(201).json({
        message: "Documents uploaded successfully",
        files: files.map((file) => ({
          filename: file.filename,
          originalName: file.originalname,
          size: file.size,
        })),
      });
    } catch (error) {
      console.error("Error uploading feedback documents:", error);
      res.status(500).json({ error: "Failed to upload documents" });
    }
  }
);

// Check feedback status
router.get("/feedback/status/:reference", async (req, res) => {
  try {
    const feedbackReference = req.params.reference;
    const [rows] = await pool.query(
      "SELECT * FROM feedback WHERE feedback_reference = ?",
      [feedbackReference]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Feedback not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching feedback status:", error);
    res.status(500).json({ error: "Failed to fetch feedback status" });
  }
});

// Get feedback by ID
router.get("/feedback/:id", async (req, res) => {
  try {
    const feedbackId = req.params.id;
    const [feedback] = await pool.query(
      "SELECT * FROM feedback WHERE feedback_id = ?",
      [feedbackId]
    );

    if (feedback.length === 0) {
      return res.status(404).json({ error: "Feedback not found" });
    }

    // Get related documents if any
    const [documents] = await pool.query(
      "SELECT * FROM feedback_documents WHERE feedback_id = ?",
      [feedbackId]
    );

    res.json({
      feedback: feedback[0],
      documents: documents,
    });
  } catch (error) {
    console.error("Error fetching feedback details:", error);
    res.status(500).json({ error: "Failed to fetch feedback details" });
  }
});

// Get all feedback (admin endpoint with pagination)
router.get("/feedback", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const [rows] = await pool.query(
      `SELECT * FROM feedback ORDER BY submission_date DESC LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const [count] = await pool.query("SELECT COUNT(*) as total FROM feedback");

    res.json({
      data: rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count[0].total / limit),
        totalItems: count[0].total,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error("Error fetching feedback list:", error);
    res.status(500).json({ error: "Failed to fetch feedback list" });
  }
});

// Update feedback status (admin endpoint)
router.patch("/feedback/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const feedbackId = req.params.id;

    if (!["pending", "under_review", "resolved", "closed"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    await pool.query("UPDATE feedback SET status = ? WHERE feedback_id = ?", [
      status,
      feedbackId,
    ]);

    res.json({ message: "Feedback status updated successfully" });
  } catch (error) {
    console.error("Error updating feedback status:", error);
    res.status(500).json({ error: "Failed to update feedback status" });
  }
});

module.exports = router;
