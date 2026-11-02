# Ideation-for-All-Project


# Backend API

Base URL: https://ideation-for-all-project-4.onrender.com
(Free tier: first request after inactivity can take ~50s.)

## REST
- POST /boards          body: { name? }   → 201 { code, name, _id }
- GET  /boards/:code                      → 200 board | 404 { error: "Board not found" }

## Socket.io events
Client → server
- join-board   (boardCode)                            → server replies "board-state" (notes[])
- add-note     { boardId, text, x, y }                → broadcasts "note-added"
- move-note    { id, x, y, boardId }                  → broadcasts "note-moved"
- vote         { id, boardId }                        → broadcasts "note-updated"
- group-notes  { noteIds, groupId, boardId }          → broadcasts "notes-grouped"

Note: boardId is the board's "code".
Env vars: MONGO_URI, CLIENT_URL (must match the frontend's origin for CORS).
