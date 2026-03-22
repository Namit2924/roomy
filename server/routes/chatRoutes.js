const express = require("express");
const {
  startConversation,
  getMyConversations,
  getConversationMessages,
  sendReply,
} = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/start", protect, startConversation);
router.get("/", protect, getMyConversations);
router.get("/:conversationId/messages", protect, getConversationMessages);
router.post("/:conversationId/reply", protect, sendReply);

module.exports = router;