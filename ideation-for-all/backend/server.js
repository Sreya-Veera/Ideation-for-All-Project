require("dotenv").config({ path: __dirname + "/.env" });
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const Note = require("./models/Note");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: process.env.CLIENT_URL } });

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.get("/", (req, res) => res.send("ok"));
app.use("/boards", require("./routes/boards"));

mongoose.connect(process.env.MONGO_URI).catch((err) => console.log("MongoDB error:", err.message));
mongoose.connection.on("connected", () => console.log("MongoDB connected"));
mongoose.connection.on("error", (err) => console.log("MongoDB error:", err.message));

io.on("connection", (socket) => {
  console.log("someone connected");

  socket.on("join-board", async (boardId) => {
    socket.join(boardId);
    socket.emit("board-state", await Note.find({ boardId }));
  });

  socket.on("add-note", async (data) => {
    const note = await Note.create(data);
    io.to(data.boardId).emit("note-added", note);
  });

  socket.on("move-note", async ({ id, x, y, boardId }) => {
    await Note.findByIdAndUpdate(id, { x, y });
    socket.to(boardId).emit("note-moved", { id, x, y });
  });

  socket.on("vote", async ({ id, boardId }) => {
    const note = await Note.findByIdAndUpdate(id, { $inc: { votes: 1 } }, { new: true });
    io.to(boardId).emit("note-updated", note);
  });

  socket.on("group-notes", async ({ noteIds, groupId, boardId }) => {
    await Note.updateMany({ _id: { $in: noteIds } }, { groupId });
    io.to(boardId).emit("notes-grouped", { noteIds, groupId });
  });

  socket.on("delete-note", async ({ id, boardId }) => {
    await Note.findByIdAndDelete(id);
    io.to(boardId).emit("note-deleted", { id });
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`running on ${PORT}`));
