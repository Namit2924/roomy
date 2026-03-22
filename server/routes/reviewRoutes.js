const express = require("express");
const { addReview, getReviewsByPg } = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, addReview);
router.get("/:pgId", getReviewsByPg);

module.exports = router;