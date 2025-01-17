const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  postOnLinkedIn,
  postImageOnLinkedIn,
} = require("../controllers/linkedinController"); // Correctly destructure the function
const upload = multer({ storage: multer.memoryStorage() });
// Route to post on LinkedIn
router.post("/post", postOnLinkedIn);
router.post("/post/image", upload.single("image"), postImageOnLinkedIn);

module.exports = router;
