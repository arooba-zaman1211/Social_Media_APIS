const express = require("express");
const multer = require("multer");
const {
  postToInsta,
  postToInstaCarousel,
} = require("../controllers/instacontroller");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/post", upload.single("file"), postToInsta);
router.post("/post/carousel", upload.array("files", 10), postToInstaCarousel);

module.exports = router;
