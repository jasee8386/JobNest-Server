const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createChat,
  sendMessage,
  getUserChats,
  markAsRead,
} = require("../controllers/chatController");

const router = express.Router();

// All chat routes require login
router.use(protect);

// Start a new chat
router.post("/", createChat);

// Send a message
router.post("/message", sendMessage);

// Get all chats of logged-in user
router.get("/", getUserChats);

// Mark messages as read
router.put("/:chatId/read", markAsRead);

module.exports = router;
