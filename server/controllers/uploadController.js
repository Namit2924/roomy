const cloudinary = require("../config/cloudinary");

const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No profile image uploaded" });
    }

    const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(fileBase64, {
      folder: "roomy_profiles",
    });

    res.status(200).json({
      message: "Profile image uploaded successfully",
      imageUrl: result.secure_url,
    });
  } catch (error) {
    res.status(500).json({
      message: "Profile image upload failed",
      error: error.message,
    });
  }
};

const uploadPgImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No PG images uploaded" });
    }

    const uploadedImages = [];

    for (const file of req.files) {
      const fileBase64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

      const result = await cloudinary.uploader.upload(fileBase64, {
        folder: "roomy_pgs",
      });

      uploadedImages.push(result.secure_url);
    }

    res.status(200).json({
      message: "PG images uploaded successfully",
      imageUrls: uploadedImages,
    });
  } catch (error) {
    res.status(500).json({
      message: "PG image upload failed",
      error: error.message,
    });
  }
};

module.exports = {
  uploadProfileImage,
  uploadPgImages,
};