const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "http://localhost:5173" } });

let notes = [];

io.on("connection", (socket) => {
  console.log("someone connected");

  socket.on("join-board", (boardId) => {
    socket.join(boardId);
    socket.emit("board-state", notes.filter((n) => n.boardId === boardId));
  });

  socket.on("add-note", (data) => {
    const note = { ...data, _id: Date.now().toString(), votes: 0 };
    notes.push(note);
    io.to(data.boardId).emit("note-added", note);
  });

  socket.on("vote", ({ id, boardId }) => {
    const note = notes.find((n) => n._id === id);
    if (note) {
      note.votes++;
      io.to(boardId).emit("note-updated", note);
    }
  });
});

server.listen(4000, () => console.log("running on 4000 (no database)"));