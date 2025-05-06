const express = require("express");
const cors = require("cors");
const path = require("path");
const schemeRoutes = require("./schemeHandler.js");
const applicationRoutes = require("./applicationHandler.js");
const feedbackRoutes = require("./feedbackHandler.js");
const certificateRoutes = require("./certificateHandler.js");
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static("public")); // Serve static files from 'public' directory

// Routes
app.use("/api", schemeRoutes);
app.use("/api", applicationRoutes);
app.use("/api", feedbackRoutes);
app.use("/api", certificateRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
