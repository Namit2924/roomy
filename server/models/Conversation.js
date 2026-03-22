const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    pg: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pg",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

conversationSchema.index({ pg: 1, user: 1, owner: 1 }, { unique: true });

module.exports = mongoose.model("Conversation", conversationSchema);