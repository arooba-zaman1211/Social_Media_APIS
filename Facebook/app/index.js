require("dotenv").config();
const express = require("express");
const app = express();
const port = 5000;
const metaRoutes = require("../routes/MetaRoutes.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/meta", metaRoutes);

// Serve static files from 'uploads' directory
app.use("/uploads", express.static("uploads"));

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
