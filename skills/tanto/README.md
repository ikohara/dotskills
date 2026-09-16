# tanto

担当 — "take charge of." A Claude Code skill for multi-session orchestration of
one implementation plan.

## What it does

- Runs one plan through separate interactive Claude Code sessions in the same
  repository and on the same branch: **Kanri** (管理) manages, **Sekkei** (設計)
  writes the spec, **Keikaku** (計画) writes the plan, **Jisso** (実装)
  implements, **Kaiseki** (解析) root-causes. The human creates and deletes
  sessions; Kanri is the only role that asks.
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
- Holds **Kanri** and **Jisso** under a context ceiling derived from that last
  figure — each seat's own measured baseline plus a chosen number of batches of
  measured consumption — and hands the one over or replaces the other at the
  next boundary once it is crossed, but only while the human is there to create
  the successor; otherwise the crossing is recorded as deferred and the run
  continues to the plan close, which hands over in any case.
- Takes bug reports about the skills this repository ships: a report is a file
  and one line to Kanri, which triages it into an issue, a redirect, a
  root-cause session, a one-line hotfix, or an input to a spec in progress.
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

- **Claude Code.** `tanto` needs `ListAgents` to see the live sessions and
  `SendMessage` to address them by name. Unlike `kisou`, `shoroku`, and
  `wayaku`, it is not host-agnostic and does not run on other Agent Skills
  hosts.
- **Node 22 or newer on `PATH`**, for `scripts/passage-check.js` and
  `scripts/reading.js`. Every role runs the second at every boundary and every
  exit, so it is no longer needed only by a plan that carries passages; a
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
  write-out at T0, T1, and T2. Without `docs/AGENTS.md` the adopted candidates
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

Open one session per role and run `/tanto <role>` in each — or
`担当して <role>` / `tantoして <role>`. The role word is accepted in hiragana,
kanji, or romaji (`かんり` / `管理` / `kanri`).

Start Kanri first, with no address:

```console
/tanto kanri
```

Every lifecycle role after Kanri is created when Kanri asks the human for it,
and starts with Kanri's name as its request prints it:

```console
/tanto sekkei <kanri>
/tanto keikaku <kanri>
/tanto jisso <kanri>
/tanto kaiseki <kanri>
```

Kikaku and Hosa are the human's own seats — `/tanto kikaku` and
`/tanto hosa`, opened whenever the human wants one. With no name after the
command, the session finds Kanri in the roster.

`<kanri>` is the bare name Kanri's request prints — the name that session was
born with. No `tanto` session is renamed once it has started, because a rename
would invalidate every address already held.

Every attached role then checks its model and sends Kanri one handshake line;
Kanri checks its model too, but receives handshakes rather than sending one,
and standalone Kaiseki sends none. Kanri replies with that role's standing
orders.

`/tanto kaiseki` with no address is standalone Kaiseki — the strong model leads
one debugging session, with no roster and no batch loop.

A window that comes back after an editor restart or a closed tab keeps its
context and its transcript but gets a new name. `/tanto fukki` (復帰), typed in
that window, matches it to its roster row by that transcript path and rejoins
it to the run; no address is pasted, and Kanri's window goes first.

## Layout

- `SKILL.md` — the shared contract every role reads.
- `roles/kanri.md`, `roles/sekkei.md`, `roles/keikaku.md`, `roles/jisso.md`,
  `roles/kaiseki.md`, `roles/kikaku.md`, `roles/hosa.md` — one procedure per
  role. A session reads exactly one.
- `templates/` — copy-and-fill skeletons: `roster.md`, `roster-archive.md`,
  `kanri.md` (the conductor ledger), `kanri-handover.md`, `bug-report.md`,
  `batch-prompt.md`, `batch-report.md`, `kaiseki-brief.md`,
  `kaiseki-report.md`, `review-brief.md`, `shoroku-brief.md` (the shoroku
  check brief), `tanto.json` (the built-in model and effort defaults),
  `kikaku-decision.md`, and `agent.md`, the subagent definition every role
  generates from.
- `scripts/passage-check.js` — the instrument a plan that carries passages
  checks itself with: `lint`, `replay`, `diff`, `verify`, `sections`,
  `frame`, and `boundary`, with `scripts/passage-check.test.js` beside it.
- `scripts/reading.js` — the instrument every role measures itself with: the
  five-figure reading of one transcript, with the ceiling, presence and
  backstop lines on request, and a `--share` form over several transcripts
  that Kanri runs at the plan close, with `scripts/reading.test.js` beside it.
- Both scripts are Node, no dependencies, invoked as `node <path>`.

## Relationship to kisou, shoroku, and superpowers

`kisou` installs the `docs/` document-management system and `shoroku` fills it;
`tanto` decides **when** it is filled and how each filling is checked: at
every stage the session holding the candidates writes them, `shoroku`
recommends in a subagent, the human answers by exception, and `shoroku`
applies and commits the accepted subset. superpowers supplies the spec, plan,
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
`docs/superpowers/specs/2026-09-12-tanto-cost-design.md`.
