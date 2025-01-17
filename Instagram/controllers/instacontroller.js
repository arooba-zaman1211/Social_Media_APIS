const axios = require("axios");
require("dotenv").config();
// Instagram Graph API Details
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const INSTAGRAM_BUSINESS_ACCOUNT_ID = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

const postToInsta = async (req, res) => {
  try {
    const { body } = req;
    const { caption, image_url } = body; // Extract image_url from the form input

    if (!image_url || !caption) {
      return res.status(400).json({
        success: false,
        message: "Caption and image URL are required",
      });
    }

    // Step 1: Upload the image to Instagram using the media endpoint
    const mediaUploadResponse = await axios.post(
      `https://graph.facebook.com/v20.0/${INSTAGRAM_BUSINESS_ACCOUNT_ID}/media`,
      {
        image_url, // Use the image URL from the form
        caption,
        access_token: ACCESS_TOKEN,
      }
    );

    // Step 2: Retrieve the media ID from the response
    const mediaId = mediaUploadResponse.data.id;

    // Step 3: Publish the media post on Instagram
    const publishResponse = await axios.post(
      `https://graph.facebook.com/v20.0/${INSTAGRAM_BUSINESS_ACCOUNT_ID}/media_publish`,
      {
        creation_id: mediaId,
        access_token: ACCESS_TOKEN,
      }
    );

    // Return success response
    res.json({ success: true, result: publishResponse.data });
  } catch (error) {
    console.error("Error posting to Instagram:", error);
    res.status(500).json({
      success: false,
      message: "Error posting to Instagram",
    });
  }
};

const postToInstaCarousel = async (req, res) => {
  try {
    const { body } = req;
    console.log("Received body:", body); // Debugging line
    const { caption, files } = body;
    console.log(files);

    if (!files || files.length < 2) {
      return res.status(400).json({
        success: false,
        message: "At least two image URLs are required for a carousel post",
      });
    }

    // Step 1: Upload each image to Instagram and get the media IDs
    const mediaIds = [];
    for (const image_url of files) {
      const mediaUploadResponse = await axios.post(
        `https://graph.facebook.com/v20.0/${INSTAGRAM_BUSINESS_ACCOUNT_ID}/media`,
        {
          image_url,
          media_type: "IMAGE",
          is_carousel_item: true,
          access_token: ACCESS_TOKEN,
        }
      );

      mediaIds.push(mediaUploadResponse.data.id);
    }

    console.log("Media Ids: ", mediaIds);
    // Step 2: Create the carousel post using the collected media IDs
    const carouselPostResponse = await axios.post(
      `https://graph.facebook.com/v20.0/${INSTAGRAM_BUSINESS_ACCOUNT_ID}/media`,
      {
        caption,
        media_type: "CAROUSEL",
        children: mediaIds,
        access_token: ACCESS_TOKEN,
      }
    );

    console.log("carousel Post Response: ", carouselPostResponse);
    // Step 3: Publish the carousel post on Instagram
    const carouselMediaId = carouselPostResponse.data.id;
    const publishResponse = await axios.post(
      `https://graph.facebook.com/v20.0/${INSTAGRAM_BUSINESS_ACCOUNT_ID}/media_publish`,
      {
        creation_id: carouselMediaId,
        access_token: ACCESS_TOKEN,
      }
    );

    console.log("publish Response: ", publishResponse);
    res.json({ success: true, result: publishResponse.data });
  } catch (error) {
    console.error("Error posting carousel to Instagram:", error);
    res.status(500).json({
      success: false,
      message: "Error posting carousel to Instagram",
    });
  }
};

module.exports = {
  postToInsta,
  postToInstaCarousel,
};
