const Review = require("../models/Review");

const addReview = async (req, res) => {
  try {
    const { pgId, rating, comment } = req.body;

    if (!pgId || !rating || !comment) {
      return res.status(400).json({ message: "All review fields are required" });
    }

    if (Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const existingReview = await Review.findOne({
      user: req.user._id,
      pg: pgId,
    });

    if (existingReview) {
      return res.status(400).json({ message: "You already reviewed this PG" });
    }

    const review = await Review.create({
      user: req.user._id,
      pg: pgId,
      rating: Number(rating),
      comment,
    });

    res.status(201).json({
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getReviewsByPg = async (req, res) => {
  try {
    const reviews = await Review.find({ pg: req.params.pgId })
      .populate("user", "name photo")
      .sort({ createdAt: -1 });

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? (
            reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
          ).toFixed(1)
        : 0;

    res.status(200).json({
      reviews,
      totalReviews,
      averageRating,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addReview,
  getReviewsByPg,
};