const express = require("express");
const { postToFacebookPage } = require("../controllers/MetaController.js");
const multer = require("multer");
const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Route to handle Facebook post request
router.post("/post", upload.single("file"), postToFacebookPage);

module.exports = router;
