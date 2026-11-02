export const API = "https://ideation-for-all-project-4.onrender.com";

export async function createBoard(name) {
  const res = await fetch(`${API}/boards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Could not create board");
  return res.json();
}

// Resolves to null when no board has that code
export async function findBoard(code) {
  const res = await fetch(`${API}/boards/${encodeURIComponent(code)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Server error");
  return res.json();
}
