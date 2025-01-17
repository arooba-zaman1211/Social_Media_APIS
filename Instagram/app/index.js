require("dotenv").config();

const express = require("express");
const app = express();
const port = 3000;
const instaRoutes = require("../routes/instaroute");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/instagram", instaRoutes);

// Serve static files from 'uploads' directory
app.use("/uploads", express.static("uploads"));

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
