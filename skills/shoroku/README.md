# shoroku

抄録 — "excerpt and record." A Claude skill that excerpts a working
session, accumulated memory, or named Markdown files into a project's living
documents, and maintains the agent-agnostic document-management system that
governs them.

## What it does

- Maintains the six document types under `docs/`: the four managed —
  **experience**, **design**, **decisions** (ADRs), **issues**
  (`docs/<type>/<id>-<slug>.md`, no index) — plus two flat types,
  **notes** (living references) and **reports** (dated investigations).
- The format and standing rules live in committed `docs/AGENTS.md`
  (+ each `docs/<type>/AGENTS.md`), so **any** agent follows the system,
  with or without this skill.
- On a trigger, excerpts the current **session** (default), **memory**
  (explicit), or named Markdown **files** (explicit) into those docs: classify
  → numbered proposal → you partially accept → one git commit.
- For a caller that answers through files — an orchestrator running the skill
  in a subagent — the same workflow splits into two halves at `Direction?`:
  **recommend** writes the numbered proposal, each item under its own `###`
  heading and marked adopt, fix, reject, or unsure, to a path the caller names —
  and, when the caller names a brief path, a template and a chat language, a
  check brief beside it, one line per item in that language; **apply** reads
  the proposal with a direction file, makes one commit for the accepted docs
  subset, and a second commit for an accepted `Recommended fix` item's text
  correction when the direction accepted at least one.

## Usage

Say e.g. `抄録して` / `shorokuして` / `セッション抄録` to shoroku the session,
`memory から抄録` / `shoroku from memory` to draw from accumulated memory, or
`<path> を抄録` / `shoroku from <path>` (e.g. `docs/superpowers/ を抄録`) to
draw from named Markdown files. In a repo that has not adopted the system, the
skill points you to the `kisou` skill to set it up first.

## Layout

- `SKILL.md` — the skill (a thin shell over the committed `docs/AGENTS.md`).

The bundled document-management template lives with the `kisou` skill, which
installs it; `shoroku` only reads and writes into it.
