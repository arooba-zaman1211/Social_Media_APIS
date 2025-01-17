const express = require("express");
const bodyParser = require("body-parser");
const linkedinRoutes = require("../routes/linkedinRoutes");
const multer = require("multer");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use("/linkedin", linkedinRoutes);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer().none()); // To handle form data

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
