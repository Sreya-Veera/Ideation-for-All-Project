const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, default: "Untitled board" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Board", boardSchema);
