const express = require("express");
const router = express.Router();
const pool = require("./dbConfig.js");

// Login route
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("login")

    // Use aadhar_num as username
    const [rows] = await pool.query(
      "SELECT * FROM villager WHERE aadhar_num = ? AND passwd = ?",
      [username, password]
    );

    if (rows.length > 0) {
      // User found, send success response with user data (excluding password)
      const user = rows[0];
      delete user.password; // Don't send password back to client

      res.status(200).json({
        success: true,
        message: "Login successful",
        user: user,
      });
    } else {
      // User not found or incorrect password
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
});


module.exports = router;
