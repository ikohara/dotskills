# tanto

担当 — "take charge of." A Claude Code skill for multi-session orchestration of
one implementation plan.

## What it does

- Runs one plan through separate Claude Code sessions in the same
  repository, on the same branch except shoki's, which works in the CLI's
  own worktree: **Kanri** (管理) manages, **Sekkei** (設計)
  writes the spec, **Keikaku** (計画) writes the plan, **Jisso** (実装)
  implements, **Kaiseki** (解析) root-causes. A seat whose work is dialogue
  with the human — Sekkei, Kaiseki, and the two below — is a tab the human
  opens; every other seat is a background session, an instrument of the
  skill's starts, stops, and resumes on a request file the run writes, so
  that no session ever issues a session-creating command. The human reaches
  a terminal seat with `claude attach` in the editor's own terminal.
- Adds two seats outside that lifecycle, opened by the human and never
  requested by Kanri: **Kikaku** (企画) thinks with the human about what the
  next work is and hands Kanri a decision file, and **Hosa** (補佐) takes the
  small jobs, editing tracked files only in a slot Kanri gives.
- Gives each session one procedure file plus a shared contract, so a session
  loads its own role and not the whole protocol.
- Keeps state in files rather than in messages — a roster, a conductor ledger,
  batch prompts and reports, Kaiseki briefs and reports. A message is one line
  plus a path, because a message dies with the session and a file does not.
  Every session also measures its own context from its own transcript — bytes,
  records, wake-ups, compactions, and the turn's context in tokens — and sends
  that reading with the lines it
  already sends, so the roster holds what the current run costs and its archive
  holds what earlier runs cost.
- Runs each batch boundary — the verification, the report's sections, the two
  readings, the ledger's and the roster's row appends, the next prompt's draft
  — in a subagent whose context ends with its turn, so that the resident
  Kanri reads one verdict line and rules on it. The boundary's procedure is a
  template the subagent reads, and its one deliverable is a verdict file.
- Holds **Kanri** under a context ceiling derived from that last figure — its
  own measured baseline plus a chosen number of batches of measured
  consumption — and hands the role over at the next boundary once it is
  crossed, with nobody present: the successor is started by the run, and the
  plan close hands over in any case. **Jisso** is measured the same
  way and kept for the archive, but is replaced by rotation rather than by
  the ceiling: one fresh session per batch, started when that batch's prompt
  exists, except on a plan that edits this skill, whose executors are all
  started at its landing and wait, so that every one of them read the same
  skill.
- Takes bug reports about the skills this repository ships: a report is a
  file and one line to the run's live Hosa, or to Kanri when none is live,
  which copies it and answers `received:`; every report is decided at the
  next topic's close with everything else — an issue, a one-sentence fix
  applied to the skill's text, a redirect, a root-cause session, an input to
  a spec in progress, or dismissed — and nothing tracked names the
  reporter's repository.
- Puts a **review brief** in front of the human before each spec and plan
  review: the points that need the human's judgment, each with a pointer into
  the document, in the chat's language, written by a subagent the document's
  author dispatches — Sekkei for the spec, Keikaku for the plan — so the
  human confirms those and reads the rest only where a point sends them.
- Uses superpowers as it is — brainstorming, writing-plans, subagent-driven
  development, systematic-debugging, requesting-code-review — with the `docs/`
  document-management system that `kisou` installs; the write-out runs through
  `shoroku`'s recommend and apply halves, which are that skill's own feature.
- Checks each session's model and effort against the personal and the project
  `tanto.json` and **warns only** — it never switches either — and puts a
  concrete model family into every subagent dispatch and each kind's effort
  into the agent definitions it generates.

## Prerequisites

- **Claude Code, and its CLI's background sessions.** `tanto` needs
  `ListAgents` to see the live sessions and
  `SendMessage` to address them by name. Unlike `kisou`, `shoroku`, and
  `wayaku`, it is not host-agnostic and does not run on other Agent Skills
  hosts.
- **Claude Code CLI 2.1.280 or newer**, for `claude --bg`,
  `claude agents --json`, `claude attach`, `claude --resume <id> --bg`,
  `claude stop`, and `claude rm` — the six commands the spawner and the
  launcher are built on. The spawner names each background seat and passes
  it `--settings '{"worktree":{"bgIsolation":"none"}}'` — the CLI's
  `worktree.bgIsolation`, `worktree` by default and undocumented upstream
  (anthropics/claude-code#59580) — because the seats share one checkout that
  the default would move them out of; a managed policy that forces
  `worktree` wins over the flag, and no settings file is written.
- **Node 22 or newer on `PATH`**, for `scripts/passage-check.js`,
  `scripts/reading.js`, `scripts/boundary.js`, `scripts/spawner.js`, and
  `scripts/tanto.js`. Every role runs the second
  at every exit and every boundary — Kanri's at a boundary through the
  `boundary.verify` subagent — so it is no longer needed only by a plan that carries passages; a
  session on which `node` will not run sends
  `transcript: unavailable — <one line why>` in place of its reading and
  carries on, which costs the run its cost signal and nothing else. Claude Code
  is itself a Node
  application, and the first-party skills assume `node` the same way.
- **The superpowers plugin**, for brainstorming, writing-plans,
  subagent-driven-development, systematic-debugging, and
  requesting-code-review. Sekkei, Keikaku, and Jisso invoke them directly.
  The SDD skill's `sdd-workspace` script owns `.superpowers/sdd/`; tanto's
  own state lives under `.tanto/`, which it ignores and lint-silences
  itself, and the spec and the plan are wherever Kanri's orders line says,
  by default the superpowers convention.
- **A `kisou`-style `docs/` system** in the target repo, for the `shoroku`
  write-out at each topic's close. Without `docs/AGENTS.md` the adopted items
  have nowhere to land.
- **Optional** — a personal `$CLAUDE_CONFIG_DIR/tanto.json` (or
  `~/.claude/tanto.json`), and a project `<repo>/.claude/tanto.json` overlaid
  on it, committed or ignored as the repository decides. When both are absent,
  every key falls back to the built-in defaults in `templates/tanto.json`; a
  partial file is complete at either layer, because the overlay is field by
  field, and a key written as a bare model name takes its effort from the
  layers below. An effort the project file changes is carried by project-scope
  agent definitions the roles generate under `<repo>/.claude/agents/`, ignored
  by a `.gitignore` the roles write there.

## Usage

Put `skills/tanto/scripts/` on `PATH` — the two wrappers there, `tanto.bat`
and `tanto.sh`, are the human's one command — and run it in VS Code's
integrated terminal, at the repository's top level:

```console
tanto
```

It starts the spawner if none is running, finds the run's Kanri or asks the
spawner for one, resumes any terminal seat a reboot took, and prints the
one line to type next:

```console
claude attach <id>
```

Every way out of a seat — `←` or `/exit` to the agent view, `Ctrl+Z` to the
shell, closing the terminal — leaves it running; `/stop` alone stops it,
and a Kanri you `/stop` comes back with `tanto`. `claude agents` lists every
seat by name, `<repo>-<role>[-<topic>]-<hex>`, and terminal panes, one
`claude attach <id>` each, show several at once; no multiplexer is needed,
since a seat outlives its terminal. `tanto` is also the way back after a
restart, and it is idempotent: run twice, it starts nothing twice. Without
`PATH`, `node <skill>/scripts/tanto.js` does the same. A seat `seats.json`
holds as `running` or `blocked` — or, for Kanri alone, `gone` — is resumed;
one it holds as `stopped` or `removed` is not. `tanto down` stops the
spawner and keeps every conversation; `tanto down --seats` stops the seats
too, which retires the run — the conversations are kept, but a seat the run
stopped is not resumed.

The tab seats are the human's own, opened as before — or
`担当して <role>` / `tantoして <role>`, the role word in hiragana, kanji, or
romaji (`かんり` / `管理` / `kanri`):

```console
/tanto sekkei
/tanto kaiseki topic=<topic>
/tanto kikaku
/tanto hosa
```

Each finds Kanri in the roster's first data row, read at the moment it
sends, and there is no address argument. `/tanto kaiseki` with no key is
standalone Kaiseki — the strong model leads one debugging session, with no
batch loop. The terminal seats — Keikaku, every Jisso, the shusei batch, the
scribe that writes the records, and Kanri's own successors — are never
typed: the run starts them with the keys they need.

A tab that comes back after an editor restart keeps its context and its
transcript and gets a new name, which Kanri matches to its roster row by its
session id; nothing is typed there. A terminal seat is
unaffected by the restart, and after a reboot `tanto` resumes it under the
same session id. The desktop notice tells the human when a seat is waiting
on them; an optional harness hook makes it immediate, and nothing requires
it.

## Layout

- `SKILL.md` — the shared contract every role reads.
- `roles/kanri.md`, `roles/sekkei.md`, `roles/keikaku.md`, `roles/jisso.md`,
  `roles/kaiseki.md`, `roles/kikaku.md`, `roles/hosa.md` — one procedure per
  role. A session reads exactly one.
- `templates/` — copy-and-fill skeletons: `roster.md`, `roster-archive.md`,
  `kanri.md` (the conductor ledger), `kanri-handover.md`, `bug-report.md`,
  `batch-prompt.md`, `batch-report.md`, `boundary-brief.md` (the procedure the
  boundary's subagent follows), `shoki-brief.md` (the scribe's whole
  contract), `spawn-request.md` (the request schema), `kaiseki-brief.md`,
  `kaiseki-report.md`, `review-brief.md`, `shoroku-brief.md` (the shoroku
  check brief), `tanto.json` (the built-in model and effort defaults),
  `kikaku-decision.md`, and `agent.md`, the subagent definition every role
  generates from.
- `scripts/passage-check.js` — the instrument a plan that carries passages
  checks itself with: `lint`, `replay`, `diff`, `verify`, `sections`,
  `frame`, and `boundary`, with `scripts/passage-check.test.js` beside it.
- `scripts/reading.js` — the instrument every role measures itself with: three
  lines always — the five-figure reading of one transcript, the effort, and
  `ttl=5m|1h|unknown`, the cache regime — with the ceiling, presence and
  backstop lines on request, and a `--share` form over several transcripts
  that Kanri runs at the plan close, with `scripts/reading.test.js` beside it.
- `scripts/boundary.js` — the boundary's own instrument, run by the subagent
  Kanri dispatches there: `check`, which runs the boundary's read-only
  commands and prints their output under fixed headings, and `record`, which
  writes the conductor ledger's and the roster's rows idempotently; and
  `census`, which Kanri runs itself, read-only, to place the roster's rows
  against the sessions `claude agents --json` lists under the repository.
  `scripts/boundary.test.js` beside it.
- `scripts/spawner.js` — the one process in a run that issues `claude --bg`,
  `claude stop`, `claude rm`, and `claude --resume`: a resident started by
  the launcher and never by a session, taking request files, writing result
  files, keeping `seats.json`, running a census of `claude agents --json`,
  and raising the desktop notice. `spawner.js notify --stdin` is the
  one-shot the optional hook calls. `scripts/spawner.test.js` beside it.
- `scripts/tanto.js`, with `scripts/tanto.bat` and `scripts/tanto.sh` — the
  human's one command, and the two wrappers that are put on `PATH` as
  `tanto`. `scripts/tanto.test.js` beside it.
- All five scripts are Node, no dependencies, invoked as `node <path>`; the
  two wrappers are what is invoked bare.

## Relationship to kisou, shoroku, and superpowers

`kisou` installs the `docs/` document-management system and `shoroku` fills it;
`tanto` decides **when** it is filled and how each filling is checked: at
every exit and every boundary the session holding the items writes
them, and once per topic, at its close, `shoroku` recommends in a subagent
on the top family, the human answers by exception, and `shoroku` applies
and commits the accepted subset on a cheaper one. superpowers supplies the spec, plan,
implementation, and debugging machinery; `tanto` supplies the sessions, the
boundaries between them, and the model discipline. superpowers is used as it
is, and `shoroku`'s two halves are its own feature, which `tanto` calls;
every override `tanto` makes is written into its own role files.

The designs this skill implements are
`docs/superpowers/specs/2026-09-06-tanto-design.md`,
`docs/superpowers/specs/2026-09-07-kanri-lifecycle-design.md`,
`docs/superpowers/specs/2026-09-07-boundary-rules-design.md`,
`docs/superpowers/specs/2026-09-08-review-brief-design.md`,
`docs/superpowers/specs/2026-09-09-context-cost-design.md`,
`docs/superpowers/specs/2026-09-11-tanto-workspace-design.md`, and
`docs/superpowers/specs/2026-09-12-tanto-cost-design.md`,
`docs/superpowers/specs/2026-09-15-shoroku-at-close-design.md`,
`docs/superpowers/specs/2026-09-19-tanto-diet-design.md`,
`docs/superpowers/specs/2026-09-20-tanto-bg-seats-design.md`, and
`docs/superpowers/specs/2026-09-23-bg-seat-ergonomics-design.md`.
