---
id: "3c4d"
title: shoroku — excerpt sessions, memory, or files into a project's docs
created: 2026-05-28
updated: 2026-07-22
---

## Purpose

A Claude Agent Skill that folds transient context — the working
conversation, accumulated memory, or named Markdown files — into a
project's `docs/` — the managed four (requirements / design / decisions /
issues) plus the flat two (notes / reports) — without ever inventing
content. Output follows the agent-agnostic
document-management system described in committed `docs/AGENTS.md` so
that any agent (skill-less, non-Claude) maintains the same shape over
time.

## Required behavior

- Three source modes: **session** (default — the current chat + edited
  Markdown), **memory** (the accumulated cross-conversation memory
  store), and **file** (one or more named Markdown sources).
- For each source, classify fragments as **exactly one** of the four
  managed types (`requirement` / `design` / `decision` / `issue`);
  whole-file material — an investigation worth freezing, durable
  reference material — goes to the flat `notes` / `reports`
  (decision `3544`). Skip anything that does not change project state.
- Present a single numbered proposal grouped by destination file. End
  with `Direction?` and wait for partial-accept input (`OK` / `2 と 5
  だけ` / `3 はやめて` / `全部やめ` etc.).
- Apply the accepted subset following the rules in each
  `docs/<type>/AGENTS.md`. Stage as **one** git commit; never auto-push.
- Empty / minimal source ⇒ report "nothing to distill" and write
  nothing.
- shoroku never installs or modifies the doc-system itself; if invoked
  in an unprepared repo it delegates to `kisou` (see decision `9f4b`)
  and stops.
- Memory is **read-only** — never modified by shoroku.

## Out of scope

- Index files, auto-cleanup of stale `claimed_by` / `depends_on` /
  `blocks`, or auto-moving issues between status directories — these
  are human / agent judgment.
- External-tracker sync (GitHub, Jira, etc.).
