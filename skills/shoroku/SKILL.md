---
name: shoroku
description: Shoroku (抄録 — excerpt and record) the working session, accumulated memory, or named Markdown files into a project's docs (requirements / design / decisions / issues / notes / reports) under `docs/`, following the in-repo AGENTS.md document-management system. Triggers on `抄録して`, `shorokuして`, `セッション抄録`; memory mode on `memory から抄録`, `shoroku from memory`; file mode on `<path> を抄録`, `shoroku from <path>`.
---

# shoroku

抄録 — "excerpt and record." Pull the worth-keeping fragments out of transient
context (the working **session**, or accumulated **memory**) and fold them into
a project's living documents, keeping the document-management system that
governs them tidy as you go.

`shoroku` is a **thin shell**. The document format and the standing rules live
in the repo's `docs/AGENTS.md` (+ each `docs/<type>/AGENTS.md`), so any agent
follows the same system with or without this skill. This skill adds the
trigger, the shoroku workflow, and a memory source mode. **Do not restate
the format rules here — defer to the `AGENTS.md`.**

## Step 1: Locate the rules

The document-management rules live in the project's **docs root** as
`docs/AGENTS.md` (the system + the session-shoroku workflow) plus each
`docs/<type>/AGENTS.md` (per-type format). The root may be `docs/` or
`Documents/`; the type dirs likewise. `docs/` and `<type>/` below are
shorthand — substitute whichever names the project uses.

1. **Present** → they are the source of truth; follow them.
2. **Absent** → this repo has not adopted the system. `shoroku` does **not**
   install it; tell the user and suggest running the **`kisou`** skill (its
   docs-only scope installs exactly this), then stop. Do not write docs until
   the system is in place.

## Step 2: Choose the source

- **session** (default): the current conversation + any Markdown written or
  edited this session + the existing `docs/` as baseline.
- **memory** (only when the user explicitly asks, e.g. `memory から抄録`): read
  the project's accumulated memory store wholesale as the source, instead of
  the session.
- **file** (when the user names a path / glob / directory, e.g.
  `docs/superpowers/ を抄録`, `shoroku from docs/superpowers/**`): read the
  named Markdown file(s) as the source. A directory expands to its `**/*.md`;
  a glob is taken literally; a single file is taken as-is.

## Step 3: Shoroku

Run the shoroku workflow defined in the repo's `docs/AGENTS.md`: read source →
classify each candidate into the six types — fragments into the four managed
(requirement / design / decision / issue), whole files into the two flat
(notes / reports) — per `docs/AGENTS.md` → emit
a single numbered proposal grouped by destination file, ending with
`Direction?` → wait → apply the accepted subset per the per-type `AGENTS.md` →
**one** git commit (no auto-push) → report files changed + commit hash.

Parse direction flexibly: `OK` / `全部適用` accept all; `2 と 5 だけ` accept
named; `3 はやめて` reject named; `5 の severity は high で` accept with an edit;
`全部やめ` / `cancel` write nothing.

### Memory source specifics

Memory is **read-only**: never delete or modify it. Classify memory entries the
same way, but route only **project-relevant** facts into `docs/`; leave
`user` / `feedback` entries in memory (they are not project state). Everything
else — proposal, partial-accept, single commit — is identical to session mode.

### File source specifics

Source files are **read-only**: never modify, move, or delete them. Resolve the
match list (path / glob / directory → file set) and list those files at the
top of the proposal so the user can confirm the scope before reviewing
entries. Do **not** deduplicate against existing `docs/<type>/*.md` —
overlaps surface in the proposal and the user accepts or rejects per item.
Everything else — classification, proposal, partial-accept, single commit — is
identical to session mode.

## Empty / minimal input

If the source has nothing substantive to excerpt, report `nothing to shoroku`
and exit. **Never invent content.**

## Soft nudge

When a session is winding down (completion utterances, a recent `git commit`, a
topic transition, or many turns with substantive edits), you **may** suggest a
shoroku run — **once per session at most**. If the user declines, stay quiet
for the rest of the session. Never start a run without explicit confirmation.

## Prohibited actions

- Do NOT start a shoroku run without explicit user confirmation.
- Do NOT restate the document format in this file — defer to `AGENTS.md`.
- Do NOT write outside `docs/`. `shoroku` no longer installs or edits
  `AGENTS.md`; setting up the system is `kisou`'s job.
- Do NOT rewrite an `accepted` ADR body — only its `status` / supersede links.
- When cross-linking entries, follow `docs/AGENTS.md` Cross-references — never
  add a path link from an ADR or other immutable/frozen entry (doc-id only).
- Do NOT delete or modify memory.
- Do NOT auto-push, auto-clean issue metadata, or sync with external trackers.
