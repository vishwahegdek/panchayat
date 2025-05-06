const express = require("express");
const router = express.Router();
const pool = require("./dbConfig");

// Get all schemes
router.get("/schemes", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM schemes");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching schemes:", error);
    res.status(500).json({ error: "Failed to fetch schemes" });
  }
});

// Get scheme by ID
router.get("/schemes/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM schemes WHERE scheme_id = ?",
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Scheme not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching scheme:", error);
    res.status(500).json({ error: "Failed to fetch scheme" });
  }
});

// Filter schemes by type
router.get("/schemes/filter/:type", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM schemes WHERE scheme_type = ?",
      [req.params.type]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error filtering schemes:", error);
    res.status(500).json({ error: "Failed to filter schemes" });
  }
});

module.exports = router;
