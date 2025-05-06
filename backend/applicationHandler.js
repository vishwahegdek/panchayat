const express = require("express");
const router = express.Router();
const pool = require("./dbConfig");
const multer = require("multer");
const path = require("path");

// Set up storage for document uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/documents/");
  },
  filename: function (req, file, cb) {
    cb(null, "doc-" + Date.now() + "-" + file.originalname);
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

// Create new application
router.post("/applications", async (req, res) => {
  try {
    const {
      applicantName,
      villageName,
      aadharNumber,
      age,
      gender,
      schemeName,
      schemeId,
      applicationStatus,
    } = req.body;

    // Validate required fields
    if (
      !applicantName ||
      !villageName ||
      !aadharNumber ||
      !age ||
      !gender ||
      !schemeName ||
      !schemeId
    ) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided" });
    }

    // Validate Aadhar number format
    if (!/^\d{12}$/.test(aadharNumber)) {
      return res.status(400).json({ error: "Invalid Aadhar number format" });
    }

    // Insert data into application table
    const [result] = await pool.query(
      `INSERT INTO application 
       (applicant_name, aadhar_num, scheme_name, scheme_id, gender, age, village_name, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        applicantName,
        aadharNumber,
        schemeName,
        schemeId,
        gender,
        age,
        villageName,
        applicationStatus || "pending",
      ]
    );

    // Return success with the generated application ID
    res.status(201).json({
      message: "Application submitted successfully",
      applicationId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating application:", error);

    // Check for foreign key constraint errors
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        error:
          "Invalid reference: Either the Aadhar number or scheme details don't exist in our records",
      });
    }

    res.status(500).json({ error: "Failed to submit application" });
  }
});

// Handle document uploads
router.post(
  "/upload-documents/:applicationId",
  upload.array("documents", 5),
  async (req, res) => {
    try {
      const applicationId = req.params.applicationId;
      const files = req.files;

      if (!files || files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      // Create database entries for the uploaded documents
      const documentInserts = files.map(async (file) => {
        await pool.query(
          `INSERT INTO application_documents (application_id, document_path, document_name, document_type) 
         VALUES (?, ?, ?, ?)`,
          [applicationId, file.path, file.originalname, file.mimetype]
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
      console.error("Error uploading documents:", error);
      res.status(500).json({ error: "Failed to upload documents" });
    }
  }
);

// Get application status
router.get("/applications/:id", async (req, res) => {
  try {
    const applicationId = req.params.id;
    const [rows] = await pool.query(
      "SELECT * FROM application WHERE application_id = ?",
      [applicationId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching application:", error);
    res.status(500).json({ error: "Failed to fetch application" });
  }
});

module.exports = router;
