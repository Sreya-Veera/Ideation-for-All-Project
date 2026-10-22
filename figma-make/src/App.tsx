import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react"

type View = "landing" | "signin" | "boards" | "create" | "join" | "board"
type NoteColor = "lime" | "blue" | "pink"

type Note = {
  id: string
  title: string
  body: string
  color: NoteColor
}

type Column = {
  id: string
  title: string
  color: NoteColor
  notes: Note[]
}

type Board = {
  id: string
  name: string
  description: string
  inviteCode: string
  isPrivate: boolean
  columns: Column[]
}

const demoBoard: Board = {
  id: "sprint-retro",
  name: "sprint 1 retro",
  description: "a quick look back at our first sprint",
  inviteCode: "M7R-42Q",
  isPrivate: true,
  columns: [
    {
      id: "worked",
      title: "what worked?",
      color: "lime",
      notes: [
        {
          id: "n1",
          title: "daily check-ins",
          body: "short, useful, no fluff",
          color: "lime",
        },
        {
          id: "n2",
          title: "clear ownership",
          body: "everyone knew the next move",
          color: "lime",
        },
      ],
    },
    {
      id: "surprised",
      title: "what surprised us?",
      color: "blue",
      notes: [
        {
          id: "n3",
          title: "fast feedback",
          body: "users replied within hours",
          color: "blue",
        },
        {
          id: "n4",
          title: "tiny wins matter",
          body: "momentum changed the room",
          color: "blue",
        },
      ],
    },
    {
      id: "next",
      title: "what should we try?",
      color: "pink",
      notes: [
        {
          id: "n5",
          title: "show work earlier",
          body: "share rough, not perfect",
          color: "pink",
        },
        {
          id: "n6",
          title: "protect focus",
          body: "two meeting-free afternoons",
          color: "pink",
        },
      ],
    },
  ],
}

const starterBoards: Board[] = [
  demoBoard,
  {
    ...demoBoard,
    id: "launch-plan",
    name: "launch plan",
    description: "ideas and tasks for launch week",
    inviteCode: "L8N-91A",
  },
  {
    ...demoBoard,
    id: "wild-ideas",
    name: "wild ideas only",
    description: "no bad ideas, no tiny thinking",
    inviteCode: "W1D-500",
  },
]

function readBoards() {
  try {
    const saved = localStorage.getItem("brainstorm-boards")
    return saved ? JSON.parse(saved) as Board[] : starterBoards
  } catch {
    return starterBoards
  }
}

function makeId() {
  return Math.random().toString(36).slice(2, 9)
}

function AppButton({
  children,
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: "primary" | "secondary" | "ghost" | "dark"
}) {
  return (
    <button className={`button button--${variant} ${className}`} {...props}>
      {children}
    </button>
  )
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M5 12h13M14 7l5 5-5 5" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

function Logo({ onClick }: { onClick: () => void }) {
  return (
    <button className="logo" onClick={onClick} aria-label="Go home">
      <span className="logo__mark">b</span>
      <span>brainstorm for all</span>
    </button>
  )
}

function Header({
  view,
  user,
  go,
  onSignOut,
}: {
  view: View
  user: string
  go: (view: View) => void
  onSignOut: () => void
}) {
  const authenticated = Boolean(user)
  return (
    <header className="site-header">
      <Logo onClick={() => go(authenticated ? "boards" : "landing")} />
      <nav aria-label="Main navigation">
        {view === "landing" && (
          <>
            <button
              onClick={() =>
                document
                  .querySelector("#how")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              how it works
            </button>
            <button
              onClick={() =>
                document
                  .querySelector("#rooms")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
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
  )
}

function Landing({ go }: { go: (view: View) => void }) {
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
              A shared space for the half-baked, the wildly ambitious, and the
              surprisingly brilliant.
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
          <div
            className="hero__visual"
            aria-label="A colorful example brainstorming board"
          >
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
              <p>
                Start a board in seconds and let the conversation grow
                naturally.
              </p>
            </article>
            <article className="feature-card note-blue">
              <span>02</span>
              <h3>everyone gets a say</h3>
              <p>
                Invite your people with one code. No complicated setup required.
              </p>
            </article>
            <article className="feature-card note-pink">
              <span>03</span>
              <h3>make it make sense</h3>
              <p>
                Group thoughts into columns and find the patterns hiding in
                plain sight.
              </p>
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
  )
}

function SignIn({
  onSignIn,
  go,
}: {
  onSignIn: (name: string) => void
  go: (view: View) => void
}) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const submit = (event: FormEvent) => {
    event.preventDefault()
    onSignIn(name.trim() || email.split("@")[0] || "thinker")
  }

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
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ada"
            />
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
            <input
              type="password"
              required
              minLength={4}
              placeholder="at least 4 characters"
            />
          </label>
          <AppButton type="submit">sign in</AppButton>
          <p className="form-note">
            No account needed for this demo. Your boards stay in this browser.
          </p>
          <button
            type="button"
            className="text-link"
            onClick={() => go("landing")}
          >
            back to home
          </button>
        </form>
      </section>
    </main>
  )
}

function Boards({
  boards,
  openBoard,
  go,
}: {
  boards: Board[]
  openBoard: (id: string) => void
  go: (view: View) => void
}) {
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
        <button
          className="action-card action-card--purple"
          onClick={() => go("join")}
        >
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
              onClick={() => openBoard(board.id)}
              key={board.id}
            >
              <div className="board-card__notes" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <strong>{board.name}</strong>
              <p>{board.description}</p>
              <small>
                {board.columns.reduce(
                  (total, column) => total + column.notes.length,
                  0,
                )}{" "}
                ideas
              </small>
            </button>
          ))}
        </div>
      </section>
    </main>
  )
}

function CreateBoard({
  createBoard,
  go,
}: {
  createBoard: (board: Board) => void
  go: (view: View) => void
}) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isPrivate, setIsPrivate] = useState(true)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const board: Board = {
      ...demoBoard,
      id: makeId(),
      name: name.trim(),
      description: description.trim() || "a brand new space for big ideas",
      inviteCode:
        `${Math.random().toString(36).slice(2, 5)}-${Math.random().toString(36).slice(2, 5)}`.toUpperCase(),
      isPrivate,
      columns: demoBoard.columns.map((column) => ({ ...column, notes: [] })),
    }
    createBoard(board)
  }

  return (
    <main className="center-page">
      <form className="panel-form panel-form--wide" onSubmit={submit}>
        <button
          type="button"
          className="back-link"
          onClick={() => go("boards")}
        >
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
          <label
            className={`choice-card note-lime ${
              isPrivate ? "choice-card--selected" : ""
            }`}
          >
            <input
              type="radio"
              checked={isPrivate}
              onChange={() => setIsPrivate(true)}
            />
            <span>
              <strong>invite only</strong>
              <small>People need the board code.</small>
            </span>
          </label>
          <label
            className={`choice-card ${
              !isPrivate ? "choice-card--selected" : ""
            }`}
          >
            <input
              type="radio"
              checked={!isPrivate}
              onChange={() => setIsPrivate(false)}
            />
            <span>
              <strong>anyone with the link</strong>
              <small>Best for open brainstorms.</small>
            </span>
          </label>
        </fieldset>
        <AppButton type="submit">create my board</AppButton>
      </form>
    </main>
  )
}

function JoinBoard({
  boards,
  onJoin,
  go,
}: {
  boards: Board[]
  onJoin: (id: string) => void
  go: (view: View) => void
}) {
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const submit = (event: FormEvent) => {
    event.preventDefault()
    const normalized = code.trim().toUpperCase()
    const match = boards.find((board) => board.inviteCode === normalized)
    if (!match) {
      setError("That code did not match a board. Try M7R-42Q.")
      return
    }
    onJoin(match.id)
  }
  return (
    <main className="center-page">
      <form className="join-card" onSubmit={submit}>
        <button
          type="button"
          className="back-link"
          onClick={() => go("boards")}
        >
          ← go back
        </button>
        <p className="eyebrow">you&apos;ve got an invite</p>
        <h1>got a code?</h1>
        <p>Enter the code your board owner shared with you.</p>
        <label>
          invite code
          <input
            autoFocus
            value={code}
            onChange={(event) => {
              setCode(event.target.value.toUpperCase())
              setError("")
            }}
            placeholder="M7R-42Q"
            maxLength={7}
          />
        </label>
        {error && <p className="error-message">{error}</p>}
        <AppButton type="submit">join the board</AppButton>
      </form>
    </main>
  )
}

function BoardView({
  board,
  updateBoard,
  go,
}: {
  board: Board
  updateBoard: (board: Board) => void
  go: (view: View) => void
}) {
  const [newNoteColumn, setNewNoteColumn] = useState<string | null>(null)
  const [noteTitle, setNoteTitle] = useState("")
  const [noteBody, setNoteBody] = useState("")
  const [copied, setCopied] = useState(false)

  const addNote = (event: FormEvent, columnId: string) => {
    event.preventDefault()
    if (!noteTitle.trim()) return
    updateBoard({
      ...board,
      columns: board.columns.map((column) =>
        column.id === columnId
          ? {
              ...column,
              notes: [
                ...column.notes,
                {
                  id: makeId(),
                  title: noteTitle.trim(),
                  body: noteBody.trim(),
                  color: column.color,
                },
              ],
            }
          : column,
      ),
    })
    setNoteTitle("")
    setNoteBody("")
    setNewNoteColumn(null)
  }

  const removeNote = (columnId: string, noteId: string) => {
    updateBoard({
      ...board,
      columns: board.columns.map((column) =>
        column.id === columnId
          ? {
              ...column,
              notes: column.notes.filter((note) => note.id !== noteId),
            }
          : column,
      ),
    })
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(board.inviteCode)
    } catch {
      // Clipboard can be unavailable in embedded previews; showing the code still gives a useful fallback.
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <main className="board-page">
      <div className="board-toolbar">
        <button className="back-link" onClick={() => go("boards")}>
          ← all boards
        </button>
        <div className="board-toolbar__actions">
          <span className="privacy-pill">
            {board.isPrivate ? "invite only" : "open link"}
          </span>
          <AppButton variant="secondary" onClick={copyCode}>
            {copied ? "code copied" : `invite · ${board.inviteCode}`}
          </AppButton>
        </div>
      </div>
      <header className="board-heading">
        <p className="eyebrow">live brainstorm</p>
        <h1>{board.name}</h1>
        <p>{board.description}</p>
      </header>
      <section className="idea-board">
        {board.columns.map((column) => (
          <article
            className={`idea-column note-${column.color}`}
            key={column.id}
          >
            <div className="idea-column__heading">
              <div>
                <span>{column.notes.length}</span>
                <h2>{column.title}</h2>
              </div>
              <button
                className="round-button"
                aria-label={`Add idea to ${column.title}`}
                onClick={() =>
                  setNewNoteColumn(
                    newNoteColumn === column.id ? null : column.id,
                  )
                }
              >
                <PlusIcon />
              </button>
            </div>
            <div className="note-stack">
              {column.notes.map((note) => (
                <div className="idea-note" key={note.id}>
                  <button
                    className="delete-note"
                    aria-label={`Delete ${note.title}`}
                    onClick={() => removeNote(column.id, note.id)}
                  >
                    ×
                  </button>
                  <strong>{note.title}</strong>
                  <p>{note.body || "A fresh thought worth sharing."}</p>
                </div>
              ))}
            </div>
            {newNoteColumn === column.id && (
              <form
                className="new-note-form"
                onSubmit={(event) => addNote(event, column.id)}
              >
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
            <button
              className="add-idea"
              onClick={() => setNewNoteColumn(column.id)}
            >
              + add an idea
            </button>
          </article>
        ))}
      </section>
    </main>
  )
}

export default function App() {
  const [view, setView] = useState<View>("landing")
  const [user, setUser] = useState(
    () => localStorage.getItem("brainstorm-user") || "",
  )
  const [boards, setBoards] = useState<Board[]>(readBoards)
  const [activeBoardId, setActiveBoardId] = useState("sprint-retro")

  useEffect(() => {
    localStorage.setItem("brainstorm-boards", JSON.stringify(boards))
  }, [boards])

  const activeBoard = useMemo(
    () => boards.find((board) => board.id === activeBoardId) || boards[0],
    [activeBoardId, boards],
  )

  const go = (next: View) => {
    setView(next)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const openBoard = (id: string) => {
    setActiveBoardId(id)
    go("board")
  }

  const signIn = (name: string) => {
    setUser(name)
    localStorage.setItem("brainstorm-user", name)
    go("boards")
  }

  const signOut = () => {
    setUser("")
    localStorage.removeItem("brainstorm-user")
    go("landing")
  }

  const createBoard = (board: Board) => {
    setBoards((current) => [board, ...current])
    setActiveBoardId(board.id)
    go("board")
  }

  const updateBoard = (updated: Board) => {
    setBoards((current) =>
      current.map((board) => (board.id === updated.id ? updated : board)),
    )
  }

  const showHeader = view !== "signin"

  return (
    <div className="app">
      {showHeader && (
        <Header view={view} user={user} go={go} onSignOut={signOut} />
      )}
      {view === "landing" && <Landing go={go} />}
      {view === "signin" && <SignIn onSignIn={signIn} go={go} />}
      {view === "boards" && (
        <Boards boards={boards} openBoard={openBoard} go={go} />
      )}
      {view === "create" && <CreateBoard createBoard={createBoard} go={go} />}
      {view === "join" && (
        <JoinBoard boards={boards} onJoin={openBoard} go={go} />
      )}
      {view === "board" && activeBoard && (
        <BoardView board={activeBoard} updateBoard={updateBoard} go={go} />
      )}
    </div>
  )
}
