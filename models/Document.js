//models\Document.js
const mongoose = require("mongoose");

const docSchema = new mongoose.Schema({
  title: String,
  content: String,

  // 🔐 ROLE-BASED ACCESS CONTROL
  access: {
    type: [String],
     default: ["public"]
  }
});

// text search for RAG
docSchema.index({ content: "text" });

module.exports = mongoose.model("Document", docSchema);