import { useState } from "react";
import Home from "./Home";
import Board from "./Board";

export default function App() {
  const [boardId, setBoardId] = useState(null);

  return boardId
    ? <Board boardId={boardId} onLeave={() => setBoardId(null)} />
    : <Home onEnterBoard={setBoardId} />;
}
