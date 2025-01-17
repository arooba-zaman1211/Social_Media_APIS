require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const tweetRoutes = require("../routes/tweetRouter.js");

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/tweets", tweetRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
