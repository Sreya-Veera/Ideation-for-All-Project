const express = require("express");
const crypto = require("crypto");
const Board = require("../models/Board");

const router = express.Router();
const makeCode = () => crypto.randomBytes(3).toString("hex").toUpperCase();

// Create Board
router.post("/", async (req, res) => {
  try {
    let code;
    do {
      code = makeCode();
    } while (await Board.exists({ code }));
    const board = await Board.create({ code, name: req.body?.name });
    res.status(201).json(board);
  } catch (err) {
    console.log("create board error:", err.message);
    res.status(500).json({ error: "Could not create board" });
  }
});

// Join Board
router.get("/:code", async (req, res) => {
  try {
    const board = await Board.findOne({ code: req.params.code.toUpperCase() });
    if (!board) return res.status(404).json({ error: "Board not found" });
    res.json(board);
  } catch (err) {
    console.log("join board error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
