import { useState } from "react";

const API = "https://ideation-for-all-project-4.onrender.com";

export default function Home({ onEnterBoard }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function createBoard() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/boards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "My board" }),
      });
      const board = await res.json();
      onEnterBoard(board.code);
    } catch {
      setError("Could not create a board. The server may be waking up, so try again.");
    } finally {
      setLoading(false);
    }
  }

  async function joinBoard() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/boards/${code.trim()}`);
      if (res.status === 404) {
        setError("No board with that code.");
        return;
      }
      const board = await res.json();
      onEnterBoard(board.code);
    } catch {
      setError("Could not reach the server. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Sticky Notes</h2>
      <button onClick={createBoard} disabled={loading}>Create Board</button>
      <div style={{ marginTop: 16 }}>
        <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Board code" />
        <button onClick={joinBoard} disabled={loading || !code.trim()}>Join Board</button>
      </div>
      {loading && <p>Loading… the first request can take up to a minute.</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
