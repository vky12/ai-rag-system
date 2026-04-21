//routes\chatRoutes.js
const express = require("express");
const axios = require("axios");

const auth = require("../middleware/auth");
const role = require("../middleware/role");
const Document = require("../models/Document");
const Chat = require("../models/Chat");
const { getContext } = require("../services/ragService");
const { generateResponse } = require("../services/openaiService");

const router = express.Router();

// CHAT
router.post("/", auth, async (req, res) => {
  try {
    const message = req.body.message;
    const role = req.user.role;

    // 1. CHAT CACHE
    const chat = await Chat.findOne({ message });
    if (chat) {
      return res.json({ reply: chat.response });
    }

    // 2. GET CONTEXT (FILTERED)
    const context = await getContext(message, role);

    // 🔐 3. BLOCK IF NO ACCESS
    if (!context || context.trim() === "") {
      return res.json({
        reply: "You do not have permission to access this information."
      });
    }

    // 4. AI GENERATION
    const reply = await generateResponse(message, context);

    // 5. SAVE
    await Chat.create({
      userId: req.user.id,
      message,
      response: reply
    });

    // 6. RETURN
    res.json({ reply });

  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

// GET CHATS (RBAC FIXED)
router.get("/", auth, role("admin", "user"), async (req, res) => {
  const filter =
    req.user.role === "admin"
      ? {}
      : { userId: req.user.id };

  const chats = await Chat.find(filter);

  res.json(chats);
});

module.exports = router;