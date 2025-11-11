const Chat = require("../models/Chat");

// Start a new chat
const createChat = async (req, res) => {
  try {
    const { participantId, relatedJob } = req.body;

    // check if chat already exists between same users for same job
    let chat = await Chat.findOne({
      participants: { $all: [req.user._id, participantId] },
      relatedJob,
    });

    if (!chat) {
      chat = await Chat.create({
        participants: [req.user._id, participantId],
        relatedJob,
      });
    }

    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { chatId, message } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    chat.messages.push({ sender: req.user._id, message });
    await chat.save();

    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get user chats
const getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user._id })
      .populate("participants", "name email")
      .populate("relatedJob", "title")  .populate("messages.sender", "name email");

    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
// Mark Read Messages
const markAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    chat.messages.forEach(msg => {
      if (!msg.isRead && msg.sender.toString() !== req.user._id) {
        msg.isRead = true;
      }
    });

    await chat.save();
    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { createChat, sendMessage, getUserChats,markAsRead  };
