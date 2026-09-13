---
id: "3c4d"
title: shoroku — excerpt sessions, memory, or files into a project's docs
created: 2026-05-28
updated: 2026-09-13
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
- A need the user states that the system does not meet yet is proposed
  as **two** fragments, a requirement and an issue, never as one issue
  alone; the requirement outlives the fix, and the issue closes with it.
- Present a single numbered proposal grouped by destination file. In
  session mode, end with `Direction?` and wait for partial-accept input
  (`OK` / `2 と 5 だけ` / `3 はやめて` / `全部やめ` etc.); for a caller that
  answers through files, write the proposal to the file it names, each item
  with a recommendation — adopt, reject, or unsure — and read the direction
  from a second file, applying and committing once from the two.
- The proposal names, per `design` entry, the requirement it serves or
  says it serves none, and asks about a design section that serves no
  requirement and a requirement bullet no design serves; the check runs
  over the proposal's own entries, never the standing tree.
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
