# tanto

担当 — "take charge of." A Claude Code skill for multi-session orchestration of
one implementation plan.

## What it does

- Runs one plan through separate interactive Claude Code sessions in the same
  repository and on the same branch: **Kanri** (管理) manages, **Sekkei** (設計)
  designs, **Jisso** (実装) implements, **Kaiseki** (解析) root-causes. The
  human creates and deletes sessions; Kanri is the only role that asks.
- Gives each session one procedure file plus a shared contract, so a session
  loads its own role and not the whole protocol.
- Keeps state in files rather than in messages — a roster, a conductor ledger,
  batch prompts and reports, Kaiseki briefs and reports. A message is one line
  plus a path, because a message dies with the session and a file does not.
- Composes, without editing them, superpowers brainstorming, writing-plans,
  subagent-driven development, systematic-debugging, and requesting-code-review;
  the `docs/` document-management system that `kisou` installs; and `shoroku`
  for the write-out.
- Checks each session's model against a personal `tanto.json` and **warns
  only** — it never switches a model — and puts a concrete model family into
  every subagent dispatch.

## Prerequisites

- **Claude Code.** `tanto` needs `ListAgents` to see the live sessions and
  `SendMessage` to address them by name. Unlike `kisou`, `shoroku`, and
  `wayaku`, it is not host-agnostic and does not run on other Agent Skills
  hosts.
- **The superpowers plugin**, for brainstorming, writing-plans,
  subagent-driven-development, systematic-debugging, and
  requesting-code-review. Sekkei and Jisso invoke them directly, and the SDD
  skill's `sdd-workspace` script owns `.superpowers/sdd/`.
- **A `kisou`-style `docs/` system** in the target repo, for the `shoroku`
  write-out at T0, T1, and T2. Without `docs/AGENTS.md` the adopted candidates
  have nowhere to land.
- **Optional** — a personal `$CLAUDE_CONFIG_DIR/tanto.json` (or
  `~/.claude/tanto.json`). When it is absent, every key falls back to the
  built-in defaults in `templates/tanto.json`; a partial file is complete,
  because the overlay is key by key.

## Usage

Open one session per role and run `/tanto <role>` in each — or
`担当して <role>` / `tantoして <role>`. The role word is accepted in hiragana,
kanji, or romaji (`かんり` / `管理` / `kanri`).

Start Kanri first, with no address:

```console
/tanto kanri
```

Every other role is created when Kanri asks the human for it, and starts with
Kanri's bare name as the address, exactly as Kanri's request prints it:

```console
/tanto sekkei kanri
/tanto jisso kanri
/tanto kaiseki kanri
```

`/tanto kaiseki` with no address is standalone Kaiseki — the strong model leads
one debugging session, with no roster and no batch loop.

Every attached role then checks its model, asks the human to run
`/rename <role>`, and sends Kanri one handshake line; Kanri checks its model and
asks for the rename too, but it receives handshakes rather than sending one, and
standalone Kaiseki sends none. Kanri replies with that role's standing orders.

## Layout

- `SKILL.md` — the shared contract every role reads.
- `roles/kanri.md`, `roles/sekkei.md`, `roles/jisso.md`, `roles/kaiseki.md` —
  one procedure per role. A session reads exactly one.
- `templates/` — copy-and-fill skeletons: `roster.md`, `kanri.md` (the
  conductor ledger), `batch-prompt.md`, `batch-report.md`, `kaiseki-brief.md`,
  `kaiseki-report.md`, and `tanto.json` (the built-in expected-model defaults).

## Relationship to kisou, shoroku, and superpowers

`kisou` installs the `docs/` document-management system and `shoroku` fills it;
`tanto` decides **when** it is filled and **who** fills it — Kanri at T0 and
T1, Jisso at T2 with Kanri answering `Direction?` through a file. superpowers
supplies the spec, plan, implementation, and debugging machinery; `tanto`
supplies the sessions, the boundaries between them, and the model discipline.
None of those skills is edited: every override `tanto` makes is written into
its own role files.

The design this skill implements is
`docs/superpowers/specs/2026-09-06-tanto-design.md`.
