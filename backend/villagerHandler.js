// villagerHandler.js
const express = require("express");
const pool = require("./dbConfig");
const router = express.Router();

// Get all villagers with pagination
router.get("/villagers", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const [villagers] = await pool.query(
      "SELECT aadhar_num, first_name, last_name, father_name, mother_name, " +
        "dob, gender, contact_num, caste, village_name FROM villager LIMIT ? OFFSET ?",
      [limit, offset]
    );

    const [countResult] = await pool.query(
      "SELECT COUNT(*) as total FROM villager"
    );
    const totalVillagers = countResult[0].total;

    res.json({
      villagers,
      pagination: {
        total: totalVillagers,
        page,
        limit,
        totalPages: Math.ceil(totalVillagers / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching villagers:", error);
    res.status(500).json({ error: "Failed to fetch villagers" });
  }
});

// Search villagers
router.get("/villagers/search", async (req, res) => {
  try {
    const searchTerm = `%${req.query.term}%`;

    const [villagers] = await pool.query(
      "SELECT aadhar_num, first_name, last_name, father_name, mother_name, " +
        "dob, gender, contact_num, caste, village_name FROM villager " +
        "WHERE aadhar_num LIKE ? OR first_name LIKE ? OR last_name LIKE ? " +
        "OR father_name LIKE ? OR village_name LIKE ?",
      [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm]
    );

    res.json(villagers);
  } catch (error) {
    console.error("Error searching villagers:", error);
    res.status(500).json({ error: "Failed to search villagers" });
  }
});

// Get a single villager
router.get("/villagers/:aadharNum", async (req, res) => {
  try {
    const [villager] = await pool.query(
      "SELECT aadhar_num, first_name, last_name, father_name, mother_name, " +
        "dob, gender, contact_num, caste, village_name FROM villager WHERE aadhar_num = ?",
      [req.params.aadharNum]
    );

    if (villager.length === 0) {
      return res.status(404).json({ error: "Villager not found" });
    }

    res.json(villager[0]);
  } catch (error) {
    console.error("Error fetching villager:", error);
    res.status(500).json({ error: "Failed to fetch villager" });
  }
});

// Create a new villager
router.post("/villagers", async (req, res) => {
  try {
    const {
      aadhar_num,
      first_name,
      last_name,
      father_name,
      mother_name,
      dob,
      gender,
      contact_num,
      caste,
      village_name,
      passwd,
    } = req.body;

    // Check if villager already exists
    const [existingVillager] = await pool.query(
      "SELECT aadhar_num FROM villager WHERE aadhar_num = ?",
      [aadhar_num]
    );

    if (existingVillager.length > 0) {
      return res
        .status(409)
        .json({ error: "Villager with this Aadhar number already exists" });
    }

    await pool.query(
      "INSERT INTO villager (aadhar_num, first_name, last_name, father_name, mother_name, " +
        "dob, gender, contact_num, caste, village_name, passwd) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        aadhar_num,
        first_name,
        last_name,
        father_name,
        mother_name,
        dob,
        gender,
        contact_num,
        caste,
        village_name,
        passwd,
      ]
    );

    res.status(201).json({ message: "Villager added successfully" });
  } catch (error) {
    console.error("Error adding villager:", error);
    res.status(500).json({ error: "Failed to add villager" });
  }
});

// Update a villager
router.put("/villagers/:aadharNum", async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      father_name,
      mother_name,
      dob,
      gender,
      contact_num,
      caste,
      village_name,
      passwd,
    } = req.body;

    // Check if villager exists
    const [existingVillager] = await pool.query(
      "SELECT aadhar_num FROM villager WHERE aadhar_num = ?",
      [req.params.aadharNum]
    );

    if (existingVillager.length === 0) {
      return res.status(404).json({ error: "Villager not found" });
    }

    await pool.query(
      "UPDATE villager SET first_name = ?, last_name = ?, father_name = ?, mother_name = ?, " +
        "dob = ?, gender = ?, contact_num = ?, caste = ?, village_name = ?, passwd = ? " +
        "WHERE aadhar_num = ?",
      [
        first_name,
        last_name,
        father_name,
        mother_name,
        dob,
        gender,
        contact_num,
        caste,
        village_name,
        passwd,
        req.params.aadharNum,
      ]
    );

    res.json({ message: "Villager updated successfully" });
  } catch (error) {
    console.error("Error updating villager:", error);
    res.status(500).json({ error: "Failed to update villager" });
  }
});

// Delete a villager
router.delete("/villagers/:aadharNum", async (req, res) => {
  try {
    // Check if villager exists
    const [existingVillager] = await pool.query(
      "SELECT aadhar_num FROM villager WHERE aadhar_num = ?",
      [req.params.aadharNum]
    );

    if (existingVillager.length === 0) {
      return res.status(404).json({ error: "Villager not found" });
    }

    await pool.query("DELETE FROM villager WHERE aadhar_num = ?", [
      req.params.aadharNum,
    ]);

    res.json({ message: "Villager deleted successfully" });
  } catch (error) {
    console.error("Error deleting villager:", error);
    res.status(500).json({ error: "Failed to delete villager" });
  }
});

module.exports = router;
