const { twitterClient } = require("../twitterClient.js");
const fs = require("fs");
const path = require("path");

const postTweet = async (req, res) => {
  const { tweetText } = req.body;

  if (!tweetText) {
    return res.status(400).json({ error: "Tweet text is required" });
  }

  try {
    const response = await twitterClient.v2.tweet(tweetText);
    res
      .status(200)
      .json({ message: "Tweet posted successfully", data: response });
  } catch (error) {
    console.error(
      "Error posting tweet:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({
      error: "Failed to post tweet",
      details: error.response ? error.response.data : error.message,
    });
  }
};

const postTweetWithImage = async (req, res) => {
  const { text } = req.body;
  const image = req.file;

  if (!text) {
    return res.status(400).json({ error: "Tweet text is required" });
  }

  if (!image) {
    return res.status(400).json({ error: "Image is required" });
  }

  try {
    const imageData = fs.readFileSync(image.path);

    const mediaResponse = await twitterClient.v1.uploadMedia(imageData, {
      mimeType: image.mimetype,
    });
    console.log("Full Media Response:", mediaResponse);

    await twitterClient.v2.tweet({
      text,
      media: {
        media_ids: [mediaResponse],
      },
    });

    res.status(200).json({ message: "Tweet posted successfully" });
  } catch (error) {
    console.error("Error posting tweet:", error);
    res.status(500).json({
      error: "Failed to post tweet",
      details: error.response ? error.response.data : error.message,
    });
  } finally {
    // Clean up the uploaded file
    fs.unlinkSync(req.file.path);
  }
};

module.exports = { postTweet, postTweetWithImage };
