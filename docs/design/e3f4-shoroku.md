---
id: "e3f4"
title: shoroku skill — excerpting modes, classification, partial-accept flow
created: 2026-05-28
updated: 2026-07-17
---

## Shape

A thin **behavioral** shell with no bundled assets (the doc-system
lives with kisou — see decision `9f4b`). shoroku reads transient
context, classifies into the doc system's types, and stages additions
in `docs/` as a single git commit per run. It never installs anything;
in an unprepared repo it stops and points the user at `kisou`.

## Source modes

- **session (default)** — the current conversation, plus any Markdown
  written or edited during the session, plus the existing `docs/` as
  baseline.
- **memory (explicit)** — the accumulated cross-conversation memory
  store. Memory is **read-only**; shoroku never modifies it.
  Classifies only **project-relevant** facts into `docs/`; leaves
  `user` / `feedback` memory entries alone.
- **file (explicit)** — one or more named Markdown sources. Useful for
  distilling pre-written specs / plans / notes that have not yet been
  folded into the doc-system.

## Workflow (shared across modes)

1. **Read** the source.
2. **Classify** each fragment as one of `requirement` / `design` /
   `decision` / `issue`; whole-file material (an investigation, a
   reference) goes to the flat `notes` / `reports`, per the per-type
   rules in `docs/<type>/AGENTS.md`.
3. **Propose** a single numbered list grouped by destination file —
   only entries that would actually change project state. End with
   `Direction?` and wait.
4. **Apply** the accepted subset. Stage as **one** git commit naming
   the source's topic. No auto-push.
5. **Report** files changed + commit hash. Empty / minimal source ⇒
   "nothing to distill", write nothing — never invent content.

## Partial-accept parsing

`OK` / `全部適用` accept all; `2 と 5 だけ` accept named items; `3 は
やめて` reject named items; `5 の severity は high で` accept with an
edit; `全部やめ` / `cancel` write nothing.

## Locate the rules

shoroku reads the **repo's committed `docs/AGENTS.md`** (and per-type
`docs/<type>/AGENTS.md`) at run time and defers to them — the doc
format is authoritative there, not in `SKILL.md`. If those files are
absent the repo has not adopted the system; shoroku stops and suggests
running `kisou` (docs-only migrate scope) to install them.

## Prohibited

- Writing outside `docs/`.
- Editing `AGENTS.md` / `CLAUDE.md` (kisou's job).
- Auto-pushing.
- Modifying memory in any way.
- Rewriting the body of an `accepted` ADR (only `status` /
  `supersedes` / `superseded_by` are mutable on a status flip).
- Auto-cleaning stale issue metadata or syncing with external trackers.

## Related

- `req-3c4d` — shoroku's scope and required behavior.
- `decision-9f4b` — kisou as sole installer (shoroku carries no bundle).
