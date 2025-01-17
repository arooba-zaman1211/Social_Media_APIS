const axios = require("axios");

const postOnLinkedIn = async (req, res) => {
  const { accessToken, personId, postContent } = req.body;

  try {
    const response = await axios.post(
      "https://api.linkedin.com/v2/ugcPosts",
      {
        author: `urn:li:person:${personId}`,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: {
              text: postContent,
            },
            shareMediaCategory: "NONE",
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error(
      "Error posting on LinkedIn:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Failed to post on LinkedIn" });
  }
};

// Register the image
const registerImage = async (accessToken, personId) => {
  try {
    const response = await axios.post(
      "https://api.linkedin.com/v2/assets?action=registerUpload",
      {
        registerUploadRequest: {
          recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
          owner: `urn:li:person:${personId}`,
          serviceRelationships: [
            {
              relationshipType: "OWNER",
              identifier: "urn:li:userGeneratedContent",
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.value;
  } catch (error) {
    console.error(
      "Error registering image:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// Upload the image
const uploadImage = async (uploadUrl, image) => {
  try {
    await axios.put(uploadUrl, image.buffer, {
      headers: {
        "Content-Type": image.mimetype,
      },
    });
  } catch (error) {
    console.error(
      "Error uploading image:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// Create the share
// Create the share
const createShare = async (accessToken, personId, assetId, postContent) => {
  console.log("6");
  console.log(accessToken);
  console.log(personId);
  console.log(assetId);
  console.log(postContent);
  try {
    const response = await axios.post(
      "https://api.linkedin.com/v2/ugcPosts",
      {
        author: `urn:li:person:${personId}`,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: {
              text: postContent,
            },
            shareMediaCategory: "IMAGE",
            media: [
              {
                status: "READY",
                media: `${assetId}`,
                description: {
                  text: "Image description here",
                },
                title: {
                  text: "Image title here",
                },
              },
            ],
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error creating share:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// Controller function to handle the full process
const postImageOnLinkedIn = async (req, res) => {
  const { accessToken, personId, postContent } = req.body;
  const image = req.file;

  console.log("1");

  if (!accessToken || !personId || !postContent) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!image) {
    return res.status(400).json({ error: "No image file provided" });
  }

  console.log("2");
  try {
    // Register the image
    const { uploadMechanism, asset } = await registerImage(
      accessToken,
      personId
    );
    console.log("Upload Mechanism:", uploadMechanism);
    console.log("Asset ID:", asset);

    if (!uploadMechanism || !asset) {
      throw new Error("Failed to get upload mechanism or asset ID");
    }

    console.log("4");
    // Upload the image
    const uploadUrl =
      uploadMechanism[
        "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
      ].uploadUrl;
    if (!uploadUrl) {
      throw new Error("Upload URL not found");
    }

    console.log("5");
    await uploadImage(uploadUrl, image);

    // Create the share
    const response = await createShare(
      accessToken,
      personId,
      asset,
      postContent
    );
    console.log("7");
    res.status(200).json(response);
  } catch (error) {
    console.error("Error posting on LinkedIn:", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { postOnLinkedIn, postImageOnLinkedIn };
