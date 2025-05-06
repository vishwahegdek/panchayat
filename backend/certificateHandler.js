const express = require("express");
const router = express.Router();
const pool = require("./dbConfig");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "public", "uploads", "certificates");

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with original extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// File filter to only allow certain file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [".pdf", ".jpg", ".jpeg", ".png"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only PDF, JPG, and PNG are allowed."),
      false
    );
  }
};

// Configure multer with storage and file size limits
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});

// Generate application ID
function generateApplicationId() {
  // CERT-YYYY-XXXXX format
  const year = new Date().getFullYear();
  const random = Math.floor(10000 + Math.random() * 90000); // 5-digit number
  return `CERT-${year}-${random}`;
}

// Submit certificate application
router.post("/certificate", upload.array("documents", 5), async (req, res) => {
  let connection;

  try {
    // Start a transaction
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Generate a unique application ID
    const applicationId = req.body.applicationId || generateApplicationId();

    // Base application data
    const applicationData = {
      application_id: applicationId,
      applicant_name: req.body.applicantName,
      village_name: req.body.villageName,
      aadhar_number: req.body.aadharNumber,
      mobile_number: req.body.mobileNumber,
      certificate_type: req.body.certType,
      additional_remarks: req.body.remarks,
      declaration_accepted: req.body.declaration === "on" ? true : false,
    };

    // Insert main application data
    await connection.query(
      "INSERT INTO certificate_applications SET ?",
      applicationData
    );

    // Insert certificate-specific details based on certificate type
    switch (req.body.certType) {
      case "birth":
        await connection.query("INSERT INTO birth_certificate_details SET ?", {
          application_id: applicationId,
          child_name: req.body.childName,
          date_of_birth: req.body.dob,
          father_name: req.body.fatherName,
          mother_name: req.body.motherName,
          birth_place: req.body.birthPlace,
          reason_for_certificate: req.body.birthReason,
        });
        break;

      case "death":
        await connection.query("INSERT INTO death_certificate_details SET ?", {
          application_id: applicationId,
          deceased_name: req.body.deceasedName,
          date_of_death: req.body.dod,
          age_at_death: req.body.ageAtDeath,
          relation_to_applicant: req.body.relation,
          death_place: req.body.deathPlace,
          reason_for_certificate: req.body.deathReason,
        });
        break;

      case "ayushman":
        await connection.query("INSERT INTO ayushman_card_details SET ?", {
          application_id: applicationId,
          family_head_name: req.body.familyHead,
          family_members: req.body.familyMembers,
          annual_income: req.body.annualIncome,
          category: req.body.category,
          ration_card_number: req.body.rationCard,
          existing_insurance: req.body.existingInsurance,
        });
        break;

      case "rtc":
        await connection.query("INSERT INTO rtc_details SET ?", {
          application_id: applicationId,
          survey_number: req.body.surveyNumber,
          hissa_number: req.body.hissaNumber,
          landowner_name: req.body.landownerName,
          relation_to_owner: req.body.relationToOwner,
          district: req.body.district,
          taluk: req.body.taluk,
          hobli: req.body.hobli,
          land_area: req.body.landArea,
          current_crop: req.body.currentCrop,
          rtc_purpose: req.body.rtcPurpose,
        });
        break;
    }

    // Process uploaded documents if any
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        await connection.query("INSERT INTO certificate_documents SET ?", {
          application_id: applicationId,
          file_name: file.originalname,
          file_path: file.path.replace(/\\/g, "/"),
          file_type: file.mimetype,
        });
      }
    }

    // Commit the transaction
    await connection.commit();

    res.status(201).json({
      success: true,
      message: "Certificate application submitted successfully",
      applicationId: applicationId,
    });
  } catch (error) {
    // Rollback on error
    if (connection) await connection.rollback();

    console.error("Error submitting certificate application:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit certificate application",
      error: error.message,
    });
  } finally {
    // Release connection
    if (connection) connection.release();
  }
});

// Get application status by application ID
router.get("/certificate/status/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT application_id, applicant_name, certificate_type, application_status, created_at FROM certificate_applications WHERE application_id = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.json({
      success: true,
      application: rows[0],
    });
  } catch (error) {
    console.error("Error fetching application status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch application status",
      error: error.message,
    });
  }
});

module.exports = router;
