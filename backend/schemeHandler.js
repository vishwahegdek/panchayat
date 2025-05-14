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

// Add new scheme
router.post("/schemes", async (req, res) => {
  try {
    const {
      scheme_name,
      scheme_type,
      start_date,
      end_date,
      age_limit,
      beneficiary_count,
      total_budget,
      details,
      status,
    } = req.body;

    const query = `
      INSERT INTO schemes (
        scheme_name, scheme_type, start_date, end_date, 
        age_limit, beneficiary_count, total_budget, details, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(query, [
      scheme_name,
      scheme_type,
      start_date || null,
      end_date || null,
      age_limit || null,
      beneficiary_count || null,
      total_budget || null,
      details || null,
      status,
    ]);

    res.status(201).json({
      message: "Scheme added successfully",
      scheme_id: result.insertId,
    });
  } catch (error) {
    console.error("Error adding scheme:", error);
    res.status(500).json({ error: "Failed to add scheme" });
  }
});

// Update scheme
router.put("/schemes/:id", async (req, res) => {
  try {
    const {
      scheme_name,
      scheme_type,
      start_date,
      end_date,
      age_limit,
      beneficiary_count,
      total_budget,
      details,
      status,
    } = req.body;

    const query = `
      UPDATE schemes SET
        scheme_name = ?, 
        scheme_type = ?, 
        start_date = ?, 
        end_date = ?, 
        age_limit = ?, 
        beneficiary_count = ?, 
        total_budget = ?, 
        details = ?, 
        status = ?
      WHERE scheme_id = ?
    `;

    const [result] = await pool.query(query, [
      scheme_name,
      scheme_type,
      start_date || null,
      end_date || null,
      age_limit || null,
      beneficiary_count || null,
      total_budget || null,
      details || null,
      status,
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Scheme not found" });
    }

    res.json({ message: "Scheme updated successfully" });
  } catch (error) {
    console.error("Error updating scheme:", error);
    res.status(500).json({ error: "Failed to update scheme" });
  }
});

// Delete scheme
router.delete("/schemes/:id", async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM schemes WHERE scheme_id = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Scheme not found" });
    }

    res.json({ message: "Scheme deleted successfully" });
  } catch (error) {
    console.error("Error deleting scheme:", error);
    res.status(500).json({ error: "Failed to delete scheme" });
  }
});

module.exports = router;
