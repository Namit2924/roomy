const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pg: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pg",
      required: true,
    },
  },
  { timestamps: true }
);

wishlistSchema.index({ user: 1, pg: 1 }, { unique: true });

module.exports = mongoose.model("Wishlist", wishlistSchema);