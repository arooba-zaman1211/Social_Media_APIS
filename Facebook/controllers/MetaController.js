const axios = require("axios");

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const PAGE_ID = process.env.PAGE_ID;

// Post to Facebook page with image and caption
const postToFacebookPage = async (req, res) => {
  try {
    const { body } = req;
    const { caption, image_url } = body;

    if (!caption) {
      return res
        .status(400)
        .json({ success: false, message: "Caption is required" });
    }

    // Make POST request to Facebook Graph API
    const photoUploadResponse = await axios.post(
      `https://graph.facebook.com/${PAGE_ID}/photos`,
      {
        url: image_url,
        caption: caption,
        access_token: ACCESS_TOKEN,
      }
    );

    // Success response
    res.json({ success: true, result: photoUploadResponse.data });
  } catch (error) {
    console.error(
      "Error posting to Facebook Page:",
      error.response?.data || error.message
    );
    res
      .status(500)
      .json({ success: false, message: "Error posting to Facebook Page" });
  }
};

module.exports = {
  postToFacebookPage,
};
