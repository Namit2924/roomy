const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const Pg = require("../models/Pg");
const User = require("../models/User");

const startConversation = async (req, res) => {
  try {
    const { pgId, text } = req.body;

    if (!pgId || !text || !text.trim()) {
      return res.status(400).json({ message: "PG and message are required" });
    }

    const pg = await Pg.findById(pgId);

    if (!pg) {
      return res.status(404).json({ message: "PG not found" });
    }

    if (!pg.owner) {
      return res.status(400).json({ message: "This PG has no owner assigned" });
    }

    const ownerUser = await User.findById(pg.owner);
    if (!ownerUser) {
      return res.status(404).json({ message: "Owner not found" });
    }

    let conversation = await Conversation.findOne({
      pg: pgId,
      user: req.user._id,
      owner: ownerUser._id,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        pg: pgId,
        user: req.user._id,
        owner: ownerUser._id,
      });
    }

    const message = await Message.create({
      conversation: conversation._id,
      sender: req.user._id,
      text: text.trim(),
    });

    const populatedMessage = await Message.findById(message._id).populate(
      "sender",
      "name role photo"
    );

    if (global.io) {
      global.io
        .to(conversation._id.toString())
        .emit("newMessage", populatedMessage);

      global.io.to(ownerUser._id.toString()).emit("newNotification", {
        text: "You received a new message",
        conversationId: conversation._id,
      });
    }

    res.status(201).json({
      message: "Message sent successfully",
      conversation,
      chatMessage: populatedMessage,
    });
  } catch (error) {
    console.error("startConversation error:", error);
    res.status(500).json({ message: error.message });
  }
};

const getMyConversations = async (req, res) => {
  try {
    let conversations = [];

    if (req.user.role === "owner") {
      conversations = await Conversation.find({ owner: req.user._id })
        .populate("pg", "title city area images")
        .populate("user", "name email photo")
        .sort({ updatedAt: -1 });
    } else {
      conversations = await Conversation.find({ user: req.user._id })
        .populate("pg", "title city area images")
        .populate("owner", "name email phone photo")
        .sort({ updatedAt: -1 });
    }

    res.status(200).json(conversations);
  } catch (error) {
    console.error("getMyConversations error:", error);
    res.status(500).json({ message: error.message });
  }
};

const getConversationMessages = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const isAllowed =
      conversation.user.toString() === req.user._id.toString() ||
      conversation.owner.toString() === req.user._id.toString();

    if (!isAllowed) {
      return res.status(403).json({ message: "Access denied" });
    }

    const messages = await Message.find({
      conversation: req.params.conversationId,
    })
      .populate("sender", "name role photo")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("getConversationMessages error:", error);
    res.status(500).json({ message: error.message });
  }
};

const sendReply = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Message text is required" });
    }

    const conversation = await Conversation.findById(req.params.conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const isAllowed =
      conversation.user.toString() === req.user._id.toString() ||
      conversation.owner.toString() === req.user._id.toString();

    if (!isAllowed) {
      return res.status(403).json({ message: "Access denied" });
    }

    const newMessage = await Message.create({
      conversation: conversation._id,
      sender: req.user._id,
      text: text.trim(),
    });

    const populatedMessage = await Message.findById(newMessage._id).populate(
      "sender",
      "name role photo"
    );

    if (global.io) {
      global.io
        .to(conversation._id.toString())
        .emit("newMessage", populatedMessage);

      const receiverId =
        conversation.user.toString() === req.user._id.toString()
          ? conversation.owner.toString()
          : conversation.user.toString();

      global.io.to(receiverId).emit("newNotification", {
        text: "You received a new message",
        conversationId: conversation._id,
      });
    }

    res.status(201).json({
      message: "Reply sent successfully",
      chatMessage: populatedMessage,
    });
  } catch (error) {
    console.error("sendReply error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  startConversation,
  getMyConversations,
  getConversationMessages,
  sendReply,
};