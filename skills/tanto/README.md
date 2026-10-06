# tanto

担当 — "take charge of." A Claude Code skill for multi-session orchestration of
one implementation plan.

## What it does

- Runs one plan through separate Claude Code sessions in the same
  repository, on the same branch except shoki's, which works in a worktree
  Kanri cuts: **Kanri** (管理) manages, **Sekkei** (設計)
  writes the spec, **Keikaku** (計画) writes the plan, **Jisso** (実装)
  implements, **Kaiseki** (解析) root-causes. Every seat is a background
  session the run starts, stops, and resumes on a request file it writes,
  so that no session ever issues a session-creating command. A seat whose
  work is dialogue with the human — Sekkei, Keikaku, Kaiseki, and the two
  below — is parked between its turns, its process stopped and its
  conversation kept, and is woken when a line is due. The human enters any
  seat with `tanto <role>` in the editor's own terminal — that command, and
  the process it runs, is what every line of this skill calls the
  **launcher** — and a dialogue seat also by a click on its row in the
  editor's session list.
- Adds two seats outside that lifecycle, started by the human with
  `tanto kikaku` and `tanto hosa`, ended by `/tanto taiseki` typed in them,
  and never requested by Kanri: **Kikaku** (企画) thinks with the human about
  what the next work is and hands Kanri a decision file, and **Hosa** (補佐)
  takes the small jobs, editing tracked files only in a slot Kanri gives.
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
  file and one line to the run's Hosa while the listing shows one in a
  turn, else to Kanri — in practice Kanri, since a Hosa is parked between
  its turns — which copies it and answers `received:`; every report is
  decided at the
  next topic's close with everything else — an issue, a one-sentence fix
  applied to the skill's text, a redirect, a root-cause session, an input to
  a spec in progress, or dismissed — and nothing tracked names the
  reporter's repository.
- Puts a **review brief** in front of the human before each spec and plan
  review: the points that need the human's judgment, each with a pointer into
  the document, in the human's language, written by a subagent the document's
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
- **Claude Code CLI 2.1.289 or newer** — the version every rule of the
  run-owned seats was measured on — for `claude --bg`,
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
  itself, and the spec and the plan are wherever the Sekkei's and the
  Keikaku's prompt keys say, by default the superpowers convention.
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
  by a `.gitignore` the roles write there. The same files carry `language`,
  the language the run speaks to the human in, as a BCP 47 tag:
  `{"language": "ja"}` in the personal file sets it for every repository, and
  a project file may override it; unset, the repository's own language rule
  decides (`SKILL.md`, "The expected-model config").

## Usage

Put `skills/tanto/scripts/` on `PATH` — the two wrappers there, `tanto.bat`
and `tanto.sh`, are the human's one command — and run it in VS Code's
integrated terminal, at the repository's top level:

```console
tanto [<role>] [<topic>] [--attach | --no-attach] [--root <path>] [--timeout <ms>]
tanto fukki [--no-attach] [--root <path>] [--timeout <ms>]
tanto teishi [--seats] [--root <path>] [--timeout <ms>]
tanto jokyo [--root <path>]
```

A bare `tanto` is `tanto kanri`: it starts the spawner if none is beating,
finds the run's Kanri or asks the spawner for one, resumes what a reboot
took, and attaches this terminal to Kanri. `tanto <role>` enters that
role's seat the same way, the role word in romaji, kana, or kanji
(`kikaku` / `きかく` / `企画`): a `kikaku`, a `hosa`, and a `kaiseki` with no
topic are started when the run holds none; a `sekkei`, `keikaku`, or
`jisso` is Kanri's to start, and the launcher says so when none is held. A
`<topic>` picks the seat when two of a role are held. `-n` (`--no-attach`)
starts or ensures the seat, prints its name and the ways in, and exits.
When Kanri hands over while you are attached to it, the launcher follows to
the successor, and nothing is typed. Run twice, `tanto` starts nothing
twice; without `PATH`, `node <skill>/scripts/tanto.js` does the same, and a
root other than the current directory is given with `--root`.

Four more words, each also in kana, kanji, and English:

| Word | Also | Typed | Does |
| --- | --- | --- | --- |
| `fukki` | ふっき, 復帰, `resume` | at the terminal, or as `/tanto fukki` in Kanri | puts the run back after a reboot, a spawner's death, or a quota's return, and tells Kanri, which recovers what was cut |
| `teishi` | ていし, 停止, `stop` | at the terminal | stops the spawner and keeps every conversation; `--seats` stops every seat too, which retires the run |
| `jokyo` | じょうきょう, 状況, `status` | at the terminal | prints one line per seat — what it is doing, whether it waits on you, its `context=`, and the command that enters it — and changes nothing |
| `taiseki` | たいせき, 退席, `leave` | as `/tanto taiseki` in a Kikaku, a Hosa, or a standalone Kaiseki | ends that seat; the next `tanto <role>` starts a new conversation |

Leave an attach with `←` and then leave the agent view: the seat keeps
running, a dialogue seat parks at its turn's end, and the launcher prints
the `jokyo` listing. `/stop` stops a seat's process, and a Kanri you `/stop`
comes back with `tanto`. `claude agents` lists every seat by name,
`<repo>-<role>[-<topic>]-<hex>`, and terminal panes, one `tanto <role>`
each, show several at once; no multiplexer is needed, since a seat outlives
its terminal.

After a reboot, `tanto` resumes a Kanri, a Jisso, or a shoki that
`seats.json` holds as `running` or `blocked` — or, for Kanri alone, `gone`;
one it holds as `stopped` or `removed` is not resumed. A dialogue seat is
not resumed: it is parked, and is woken when a line is due — one whose turn
the reboot cut is continued by Kanri's Recovery, which `tanto fukki`
starts. The spawner writes a heartbeat as it works: `tanto` starts a
spawner when none has beaten within a minute, and `tanto teishi` signals
only one that has.

Inside a session, `/tanto <role>` — or `担当して <role>` / `tantoして <role>`,
the role word in hiragana, kanji, or romaji (`かんり` / `管理` / `kanri`) —
is what a seat's own prompt runs. A session the run did not start that
types it is told to use `tanto <role>`, and stops. Every seat finds Kanri in
the roster's first data row, read at the moment it sends, and there is no
address argument. `tanto kaiseki` with no topic is standalone Kaiseki — the
strong model leads one debugging session, with no batch loop.

An editor reload asks nothing: a tab that held a seat comes back under a
new name, nothing keys on it, and a seat whose tab is not reopened is
parked. A Kanri, a Jisso, or a shoki is unaffected by the reload. The
desktop notice tells the human when a seat waits on them — a dialogue
seat's question at the end of a turn the run started, a permission prompt,
a kessai — and an optional harness hook makes it immediate; nothing
requires it.

## The faces of a seat

A face is a place you talk to a seat from: the terminal attach that
`tanto <role>` gives, a VS Code tab, and Remote Control through Kanri. A seat
is in one place at a time — the launcher refuses a seat a tab holds, and
says which tab to close. A dialogue seat is parked between its turns, which
is what lets a click on its row open it in a tab with a normal prompt box.
Five constraints come with that:

- **C-1** — enter a dialogue seat from a terminal by `tanto <role>`, never
  by a bare `claude attach` and never from the agent view that `←` opens:
  neither tells the spawner you are there, and the seat's park at its turn's
  end closes that screen under you. Kanri is entered by `tanto`, and is not
  opened in a tab.
- **C-2** — a parked seat is offline to Remote Control until something wakes
  it. From there, ask Kanri: it wakes the seat and holds it awake until 55
  minutes after its last turn, or until you say you are done.
- **C-3** — a seat started after the editor's list was loaded is in the list
  after `Developer: Reload Window`; a click on its row opens it. For about
  half a minute after a turn ends the row may still show the "open somewhere
  else" notice.
- **C-4** — a tab's turn runs at the editor's effort and on the extension's
  bundled binary; a version gap that keeps a tab from opening leaves the
  terminal.
- **C-5** — a window reload cuts the turn of a seat open in a tab, with its
  background work; a word in the tab continues it.

## Moving a run

A run started before seats were run-owned has a Kanri that read the older
text, and seats the human opened in tabs. The text on disk reaches every
repository the moment it lands, so such a run opens no new dialogue seat: a
`/tanto <role>` typed in a window there stops with one line, and its Kanri
cannot spawn one. Its open seats go on, its Jissos and its close are
untouched, and `tanto` still enters its Kanri. A Kikaku and a standalone
Kaiseki, which that Kanri never addresses, can be started there by
`tanto kikaku` and `tanto kaiseki` once its spawner is a current one —
`tanto teishi`, then `tanto`, which touch no seat. Everything else waits for
the move, made once, at a batch boundary or a plan's close:
`tanto teishi --seats`, then `tanto`, and close the windows of that run's
old seats. The new Kanri takes the run from its roster and ledger as a
Kanri does after any loss. Until then, `tanto` prints one line naming the
roster's old-contract rows, and goes on; the line asks for nothing, and a roster row
of the old contract that Kanri leaves for the archive keeps it printing until the
plan's close.

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
  writes the conductor ledger's and the roster's rows idempotently;
  `census`, which Kanri runs itself, read-only, to place the roster's rows
  against the spawner's `seats.json` and the sessions `claude agents --json`
  lists under the repository; `request`, the park or leave request a seat
  writes for itself; and `seat`, `wake`, and `beat`, which Kanri runs before
  it sends a seat a line or writes a request. `scripts/boundary.test.js`
  beside it.
- `scripts/spawner.js` — the one process in a run that issues `claude --bg`,
  `claude stop`, `claude rm`, and `claude --resume`: a resident started by
  the launcher and never by a session, taking request files, writing result
  files, keeping `seats.json`, parking a dialogue seat at its own request,
  running a census of `claude agents --json`, and raising the desktop
  notice. `spawner.js notify --stdin` is the
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
