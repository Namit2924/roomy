const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");
const {
  uploadProfileImage,
  uploadPgImages,
} = require("../controllers/uploadController");

const router = express.Router();

// single image for profile
router.post("/profile", protect, upload.single("image"), uploadProfileImage);

// multiple images for PG (max 20)
router.post("/pg", protect, upload.array("images", 20), uploadPgImages);

module.exports = router;