import { useEffect, useState } from "react";
import { createBoard, findBoard } from "./api";
import { socket } from "./socket";

// Every board shares these columns; a note's groupId says which column it sits in
const COLUMNS = [
  { id: "worked", title: "what worked?", color: "lime" },
  { id: "surprised", title: "what surprised us?", color: "blue" },
  { id: "next", title: "what should we try?", color: "pink" },
];

const WAKING_UP = "Waking up the server… the first request can take up to a minute.";

// The backend has no "list boards" route, so we remember the boards this browser has opened
function readBoards() {
  try {
    const saved = localStorage.getItem("ideation-boards");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

// Notes store one text field, so the title and body are kept on separate lines
function splitNote(text = "") {
  const [title, ...rest] = text.split("\n");
  return { title, body: rest.join("\n") };
}

function columnOf(note) {
  return COLUMNS.some((column) => column.id === note.groupId) ? note.groupId : COLUMNS[0].id;
}

function AppButton({ children, variant = "primary", className = "", ...props }) {
  return (
    <button className={`button button--${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M5 12h13M14 7l5 5-5 5" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function Logo({ onClick }) {
  return (
    <button className="logo" onClick={onClick} aria-label="Go home">
      <span className="logo__mark">b</span>
      <span>brainstorm for all</span>
    </button>
  );
}

function Header({ view, user, go, onSignOut }) {
  const authenticated = Boolean(user);
  return (
    <header className="site-header">
      <Logo onClick={() => go(authenticated ? "boards" : "landing")} />
      <nav aria-label="Main navigation">
        {view === "landing" && (
          <>
            <button onClick={() => document.querySelector("#how")?.scrollIntoView({ behavior: "smooth" })}>
              how it works
            </button>
            <button onClick={() => document.querySelector("#rooms")?.scrollIntoView({ behavior: "smooth" })}>
              made for
            </button>
          </>
        )}
        {authenticated ? (
          <>
            <button onClick={() => go("boards")}>your boards</button>
            <span className="user-dot" aria-hidden="true">
              {user.slice(0, 1).toUpperCase()}
            </span>
            <button className="nav-pill" onClick={onSignOut}>
              sign out
            </button>
          </>
        ) : (
          <>
            <button onClick={() => go("signin")}>sign in</button>
            <button className="nav-pill" onClick={() => go("signin")}>
              get started
            </button>
          </>
        )}
      </nav>
    </header>
  );
}

function Landing({ go }) {
  return (
    <>
      <main>
        <section className="hero">
          <div className="hero__copy">
            <p className="eyebrow">thinking is better together</p>
            <h1>
              brainstorm
              <br />
              like it&apos;s a
              <br />
              group chat.
            </h1>
            <p className="hero__lede">
              A shared space for the half-baked, the wildly ambitious, and the surprisingly brilliant.
            </p>
            <div className="button-row">
              <AppButton onClick={() => go("signin")}>
                start brainstorming <ArrowIcon />
              </AppButton>
              <AppButton variant="secondary" onClick={() => go("join")}>
                join with a code
              </AppButton>
            </div>
          </div>
          <div className="hero__visual" aria-label="A colorful example brainstorming board">
            <div className="mock-window">
              <div className="mock-window__bar">
                <span />
                <span />
                <span />
                <b>fresh ideas</b>
              </div>
              <div className="mock-columns">
                <div className="mock-column note-lime">
                  <small>big swings</small>
                  <strong>what if it felt effortless?</strong>
                  <i />
                  <i />
                </div>
                <div className="mock-column note-pink">
                  <small>tiny sparks</small>
                  <strong>make the first step fun.</strong>
                  <i />
                  <i />
                </div>
                <div className="mock-column note-blue">
                  <small>worth trying</small>
                  <strong>invite the quiet voices in.</strong>
                  <i />
                  <i />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="sticky-section">
          <p className="eyebrow">the good stuff, in one place</p>
          <h2>everything&apos;s a sticky wall of ideas, minus the mess.</h2>
          <div className="feature-grid">
            <article className="feature-card note-lime">
              <span>01</span>
              <h3>big ideas need room</h3>
              <p>Start a board in seconds and let the conversation grow naturally.</p>
            </article>
            <article className="feature-card note-blue">
              <span>02</span>
              <h3>everyone gets a say</h3>
              <p>Invite your people with one code. No complicated setup required.</p>
            </article>
            <article className="feature-card note-pink">
              <span>03</span>
              <h3>make it make sense</h3>
              <p>Group thoughts into columns and find the patterns hiding in plain sight.</p>
            </article>
          </div>
        </section>

        <section className="how-section" id="how">
          <p className="eyebrow eyebrow--light">three steps. zero friction.</p>
          <h2>how it works</h2>
          <div className="steps">
            <article>
              <b>01</b>
              <h3>make a board</h3>
              <p>Name the thing you&apos;re thinking about.</p>
            </article>
            <article>
              <b>02</b>
              <h3>share the code</h3>
              <p>Send one simple invite to your people.</p>
            </article>
            <article>
              <b>03</b>
              <h3>stick, sort, solve</h3>
              <p>Add ideas, spot themes, and choose what&apos;s next.</p>
            </article>
          </div>
        </section>

        <section className="rooms-section" id="rooms">
          <p className="eyebrow">a room for every kind of thinking</p>
          <h2>made for rooms full of ideas</h2>
          <div className="room-grid">
            <article>
              <span className="room-card__shape room-card__shape--one" />
              <div>
                <h3>every student gets a voice</h3>
                <p>Collect thoughts before the loudest answer wins.</p>
              </div>
            </article>
            <article>
              <span className="room-card__shape room-card__shape--two" />
              <div>
                <h3>meetings that end with a plan</h3>
                <p>Turn discussion into a shared next step.</p>
              </div>
            </article>
          </div>
        </section>

        <section className="final-cta">
          <div>
            <p className="eyebrow">less blank page. more momentum.</p>
            <h2>your next brainstorm starts here.</h2>
          </div>
          <AppButton variant="dark" onClick={() => go("signin")}>
            make a board <ArrowIcon />
          </AppButton>
        </section>
      </main>
      <footer>
        <Logo onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} />
        <p>Made for messy minds and good ideas.</p>
      </footer>
    </>
  );
}

function SignIn({ onSignIn, go }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const submit = (event) => {
    event.preventDefault();
    onSignIn(name.trim() || email.split("@")[0] || "thinker");
  };

  return (
    <main className="auth-page">
      <section className="auth-poster">
        <p className="eyebrow">come as you are</p>
        <h1>
          big ideas.
          <br />
          zero chaos.
        </h1>
        <p>All your best thinking, together in one bright place.</p>
        <div className="poster-notes">
          <span className="note-pink">make it weird</span>
          <span className="note-blue">ask why not?</span>
          <span className="note-lime">build on it</span>
        </div>
      </section>
      <section className="auth-form-wrap">
        <form className="panel-form" onSubmit={submit}>
          <p className="eyebrow">good to see you</p>
          <h2>welcome back</h2>
          <label>
            your name
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Ada" />
          </label>
          <label>
            email
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />
          </label>
          <label>
            password
            <input type="password" required minLength={4} placeholder="at least 4 characters" />
          </label>
          <AppButton type="submit">sign in</AppButton>
          <p className="form-note">No account needed yet. Your name stays in this browser.</p>
          <button type="button" className="text-link" onClick={() => go("landing")}>
            back to home
          </button>
        </form>
      </section>
    </main>
  );
}

function Boards({ boards, openBoard, go }) {
  return (
    <main className="page-shell">
      <section className="page-heading">
        <p className="eyebrow">your idea kitchen</p>
        <h1>what are we cooking up?</h1>
        <p>Start something new or jump back into a board.</p>
      </section>
      <div className="action-grid">
        <button className="action-card note-lime" onClick={() => go("create")}>
          <span className="action-icon">
            <PlusIcon />
          </span>
          <span>
            <strong>start a board</strong>
            <small>Open a fresh space for ideas.</small>
          </span>
          <ArrowIcon />
        </button>
        <button className="action-card action-card--purple" onClick={() => go("join")}>
          <span className="action-icon">#</span>
          <span>
            <strong>join with a code</strong>
            <small>Have an invite? Come on in.</small>
          </span>
          <ArrowIcon />
        </button>
      </div>

      <section className="board-list">
        <div className="section-title">
          <h2>your boards</h2>
          <span>{boards.length} total</span>
        </div>
        <div className="board-grid">
          {boards.map((board, index) => (
            <button
              className={`board-card board-card--${index % 3}`}
              onClick={() => openBoard(board.code)}
              key={board.code}
            >
              <div className="board-card__notes" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <strong>{board.name}</strong>
              <p>{board.description}</p>
              <small>code · {board.code}</small>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

function CreateBoard({ onCreate, go }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const board = await createBoard(name.trim());
      onCreate({
        code: board.code,
        name: board.name,
        description: description.trim() || "a brand new space for big ideas",
        isPrivate,
      });
    } catch {
      setError("Could not create a board. The server may be waking up, so try again.");
      setLoading(false);
    }
  };

  return (
    <main className="center-page">
      <form className="panel-form panel-form--wide" onSubmit={submit}>
        <button type="button" className="back-link" onClick={() => go("boards")}>
          ← your boards
        </button>
        <p className="eyebrow">blank wall, endless possibility</p>
        <h1>start a board</h1>
        <label>
          board name
          <input
            autoFocus
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. spring campaign"
          />
        </label>
        <label>
          what&apos;s this about? <small>optional</small>
          <input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="give your people a little context"
          />
        </label>
        <fieldset>
          <legend>who can join?</legend>
          <label className={`choice-card note-lime ${isPrivate ? "choice-card--selected" : ""}`}>
            <input type="radio" checked={isPrivate} onChange={() => setIsPrivate(true)} />
            <span>
              <strong>invite only</strong>
              <small>People need the board code.</small>
            </span>
          </label>
          <label className={`choice-card ${!isPrivate ? "choice-card--selected" : ""}`}>
            <input type="radio" checked={!isPrivate} onChange={() => setIsPrivate(false)} />
            <span>
              <strong>anyone with the link</strong>
              <small>Best for open brainstorms.</small>
            </span>
          </label>
        </fieldset>
        {loading && <p className="status-message">{WAKING_UP}</p>}
        {error && <p className="error-message">{error}</p>}
        <AppButton type="submit" disabled={loading}>
          {loading ? "creating…" : "create my board"}
        </AppButton>
      </form>
    </main>
  );
}

function JoinBoard({ onJoin, goBack }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const board = await findBoard(code.trim());
      if (!board) {
        setError("That code did not match a board. Check it and try again.");
        setLoading(false);
        return;
      }
      onJoin(board);
    } catch {
      setError("Could not reach the server. Try again in a moment.");
      setLoading(false);
    }
  };

  return (
    <main className="center-page">
      <form className="join-card" onSubmit={submit}>
        <button type="button" className="back-link" onClick={goBack}>
          ← go back
        </button>
        <p className="eyebrow">you&apos;ve got an invite</p>
        <h1>got a code?</h1>
        <p>Enter the code your board owner shared with you.</p>
        <label>
          invite code
          <input
            autoFocus
            required
            value={code}
            onChange={(event) => {
              setCode(event.target.value.toUpperCase());
              setError("");
            }}
            placeholder="A1B2C3"
            maxLength={6}
          />
        </label>
        {loading && <p className="status-message">{WAKING_UP}</p>}
        {error && <p className="error-message">{error}</p>}
        <AppButton type="submit" disabled={loading}>
          {loading ? "joining…" : "join the board"}
        </AppButton>
      </form>
    </main>
  );
}

function BoardView({ board, go }) {
  const [notes, setNotes] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [newNoteColumn, setNewNoteColumn] = useState(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const join = () => socket.emit("join-board", board.code);
    const onState = (list) => {
      setNotes(list);
      setLoaded(true);
    };
    const onAdded = (note) => setNotes((prev) => [...prev, note]);
    const onUpdated = (updated) =>
      setNotes((prev) => prev.map((note) => (note._id === updated._id ? updated : note)));
    const onGrouped = ({ noteIds, groupId }) =>
      setNotes((prev) => prev.map((note) => (noteIds.includes(note._id) ? { ...note, groupId } : note)));
    const onDeleted = ({ id }) => setNotes((prev) => prev.filter((note) => note._id !== id));

    // Rejoin after a reconnect, since the server forgets which rooms a dropped socket was in
    socket.on("connect", join);
    socket.on("board-state", onState);
    socket.on("note-added", onAdded);
    socket.on("note-updated", onUpdated);
    socket.on("notes-grouped", onGrouped);
    socket.on("note-deleted", onDeleted);
    join();

    return () => {
      socket.off("connect", join);
      socket.off("board-state", onState);
      socket.off("note-added", onAdded);
      socket.off("note-updated", onUpdated);
      socket.off("notes-grouped", onGrouped);
      socket.off("note-deleted", onDeleted);
    };
  }, [board.code]);

  const addNote = (event, columnId) => {
    event.preventDefault();
    if (!noteTitle.trim()) return;
    const text = noteBody.trim() ? `${noteTitle.trim()}\n${noteBody.trim()}` : noteTitle.trim();
    socket.emit("add-note", { boardId: board.code, text, x: 0, y: 0, groupId: columnId });
    setNoteTitle("");
    setNoteBody("");
    setNewNoteColumn(null);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(board.code);
    } catch {
      // Clipboard can be unavailable in embedded previews; showing the code still gives a useful fallback.
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <main className="board-page">
      <div className="board-toolbar">
        <button className="back-link" onClick={() => go("boards")}>
          ← all boards
        </button>
        <div className="board-toolbar__actions">
          <span className="privacy-pill">{board.isPrivate ? "invite only" : "open link"}</span>
          <AppButton variant="secondary" onClick={copyCode}>
            {copied ? "code copied" : `invite · ${board.code}`}
          </AppButton>
        </div>
      </div>
      <header className="board-heading">
        <p className="eyebrow">live brainstorm</p>
        <h1>{board.name}</h1>
        <p>{board.description}</p>
        {!loaded && <p className="status-message">{WAKING_UP}</p>}
      </header>
      <section className="idea-board">
        {COLUMNS.map((column) => {
          const columnNotes = notes.filter((note) => columnOf(note) === column.id);
          return (
            <article className={`idea-column note-${column.color}`} key={column.id}>
              <div className="idea-column__heading">
                <div>
                  <span>{columnNotes.length}</span>
                  <h2>{column.title}</h2>
                </div>
                <button
                  className="round-button"
                  aria-label={`Add idea to ${column.title}`}
                  onClick={() => setNewNoteColumn(newNoteColumn === column.id ? null : column.id)}
                >
                  <PlusIcon />
                </button>
              </div>
              <div className="note-stack">
                {columnNotes.map((note) => {
                  const { title, body } = splitNote(note.text);
                  return (
                    <div className="idea-note" key={note._id}>
                      <button
                        className="delete-note"
                        aria-label={`Delete ${title}`}
                        onClick={() => socket.emit("delete-note", { id: note._id, boardId: board.code })}
                      >
                        ×
                      </button>
                      <strong>{title}</strong>
                      <p>{body || "A fresh thought worth sharing."}</p>
                      <button
                        className="vote-note"
                        aria-label={`Vote for ${title}`}
                        onClick={() => socket.emit("vote", { id: note._id, boardId: board.code })}
                      >
                        👍 {note.votes}
                      </button>
                    </div>
                  );
                })}
              </div>
              {newNoteColumn === column.id && (
                <form className="new-note-form" onSubmit={(event) => addNote(event, column.id)}>
                  <input
                    autoFocus
                    value={noteTitle}
                    onChange={(event) => setNoteTitle(event.target.value)}
                    placeholder="your big idea"
                    required
                  />
                  <textarea
                    value={noteBody}
                    onChange={(event) => setNoteBody(event.target.value)}
                    placeholder="add a little context"
                    rows={3}
                  />
                  <div>
                    <button type="button" onClick={() => setNewNoteColumn(null)}>
                      cancel
                    </button>
                    <button type="submit">stick it</button>
                  </div>
                </form>
              )}
              <button className="add-idea" onClick={() => setNewNoteColumn(column.id)}>
                + add an idea
              </button>
            </article>
          );
        })}
      </section>
    </main>
  );
}

export default function App() {
  const [view, setView] = useState("landing");
  const [user, setUser] = useState(() => localStorage.getItem("brainstorm-user") || "");
  const [boards, setBoards] = useState(readBoards);
  const [activeCode, setActiveCode] = useState(null);

  useEffect(() => {
    localStorage.setItem("ideation-boards", JSON.stringify(boards));
  }, [boards]);

  const activeBoard = boards.find((board) => board.code === activeCode);

  const go = (next) => {
    setView(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openBoard = (code) => {
    setActiveCode(code);
    go("board");
  };

  const signIn = (name) => {
    setUser(name);
    localStorage.setItem("brainstorm-user", name);
    go("boards");
  };

  const signOut = () => {
    setUser("");
    localStorage.removeItem("brainstorm-user");
    go("landing");
  };

  // Puts the board at the top of this browser's list and opens it
  const saveAndOpen = (board) => {
    setBoards((current) => [board, ...current.filter((saved) => saved.code !== board.code)]);
    openBoard(board.code);
  };

  // Description and privacy aren't stored on the server, so keep what this browser already knows
  const joinBoard = (board) => {
    const saved = boards.find((existing) => existing.code === board.code);
    saveAndOpen({
      description: "a shared space for big ideas",
      isPrivate: true,
      ...saved,
      code: board.code,
      name: board.name,
    });
  };

  const showHeader = view !== "signin";

  return (
    <div className="app">
      {showHeader && <Header view={view} user={user} go={go} onSignOut={signOut} />}
      {view === "landing" && <Landing go={go} />}
      {view === "signin" && <SignIn onSignIn={signIn} go={go} />}
      {view === "boards" && <Boards boards={boards} openBoard={openBoard} go={go} />}
      {view === "create" && <CreateBoard onCreate={saveAndOpen} go={go} />}
      {view === "join" && <JoinBoard onJoin={joinBoard} goBack={() => go(user ? "boards" : "landing")} />}
      {view === "board" && activeBoard && <BoardView board={activeBoard} go={go} />}
    </div>
  );
}
