const Wishlist = require("../models/Wishlist");

const addToWishlist = async (req, res) => {
  try {
    const { pgId } = req.body;

    if (!pgId) {
      return res.status(400).json({ message: "PG id is required" });
    }

    const existing = await Wishlist.findOne({
      user: req.user._id,
      pg: pgId,
    });

    if (existing) {
      return res.status(400).json({ message: "PG already in wishlist" });
    }

    const wishlistItem = await Wishlist.create({
      user: req.user._id,
      pg: pgId,
    });

    res.status(201).json({
      message: "PG added to wishlist",
      wishlistItem,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ user: req.user._id }).populate(
      "pg",
      "title city location price gender images availableRooms"
    );

    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const item = await Wishlist.findOneAndDelete({
      user: req.user._id,
      pg: req.params.pgId,
    });

    if (!item) {
      return res.status(404).json({ message: "PG not found in wishlist" });
    }

    res.status(200).json({ message: "PG removed from wishlist" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
};