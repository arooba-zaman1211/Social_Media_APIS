const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  postTweet,
  postTweetWithImage,
} = require("../controllers/tweetController.js");

const upload = multer({ dest: "uploads/" });

router.post("/post", postTweet);
router.post("/post/image", upload.single("image"), postTweetWithImage);

module.exports = router;
