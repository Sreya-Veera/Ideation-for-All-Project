
import { useEffect, useState } from "react";
import { socket } from "./socket";

const boardId = "test-board";

export default function App() {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    socket.emit("join-board", boardId);
    socket.on("board-state", setNotes);
    socket.on("note-added", (note) => setNotes((prev) => [...prev, note]));
    socket.on("note-updated", (u) =>
      setNotes((prev) => prev.map((n) => (n._id === u._id ? u : n))));
    return () => socket.removeAllListeners();
  }, []);

  const addNote = () => {
    if (!text.trim()) return;
    socket.emit("add-note", { boardId, text, x: 0, y: 0 });
    setText("");
  };

  return (
    <div style={{ padding: 20 }}>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="New note" />
      <button onClick={addNote}>Add</button>
      {notes.map((n) => (
        <div key={n._id} style={{ background: "#fff59d", color: "#000", padding: 10, margin: 8, width: 200 }}>
          {n.text}
          <button onClick={() => socket.emit("vote", { id: n._id, boardId })}>
            👍 {n.votes}
          </button>
        </div>
      ))}
    </div>
  );
}