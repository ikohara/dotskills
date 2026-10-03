---
name: shoroku
description: Shoroku (抄録 — excerpt and record) the working session, accumulated memory, or named Markdown files into a project's docs (experience / design / decisions / issues / notes / reports) under `docs/`, following the in-repo AGENTS.md document-management system. Triggers on `抄録して`, `shorokuして`, `セッション抄録`; memory mode on `memory から抄録`, `shoroku from memory`; file mode on `<path> を抄録`, `shoroku from <path>`.
---

# shoroku

抄録 — "excerpt and record." Pull the worth-keeping fragments out of transient
context (the working **session**, accumulated **memory**, or named Markdown
**files**) and fold them into
a project's living documents, keeping the document-management system that
governs them tidy as you go.

`shoroku` is a **thin shell**. The document format and the standing rules live
in the repo's `docs/AGENTS.md` (+ each `docs/<type>/AGENTS.md`), so any agent
follows the same system with or without this skill. This skill adds the
trigger, the shoroku workflow, and the memory and file source modes. **Do not
restate the format rules here — defer to the `AGENTS.md`.**

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
(experience / design / decision / issue), whole files into the two flat
(notes / reports) — per `docs/AGENTS.md` → emit
a single numbered proposal grouped by destination file, ending with
`Direction?` → wait → apply the accepted subset per the per-type `AGENTS.md` →
**one** git commit (no auto-push) → report files changed + commit hash.

Classification follows the two splits the type files define — design vs
decisions, experience vs issues — and the proposal carries the experience
pairing `docs/AGENTS.md`'s Propose step defines; neither is restated here.
Experience is the one type whose candidate may be assembled from scattered
remarks, tagged and capped as `docs/experience/AGENTS.md` says; the other
three are stated only.

An issue written in session, memory, or file mode opens its body with one
line, `Source: session <YYYY-MM-DD>`, the day of the run — the first
non-empty line after the frontmatter, before the narrative. In recommend and
apply mode the pointer rides in the item's heading, from the source the
caller's dispatch named, and the apply writes what the heading carries.

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
overlaps surface in the proposal and the user accepts or rejects per item; in
recommend mode the baseline a caller names is what an item's destination and
reason are judged against, never a filter that drops it.
Everything else — classification, proposal, partial-accept, single commit — is
identical to session mode.

### Recommend and apply — the two halves for a caller that answers `Direction?` through files

A caller that cannot answer in the chat — an orchestrator running this skill
in a subagent, say — gets the same workflow in two halves, split where
session mode waits at `Direction?`. A session-mode run is unchanged by this
section.

**Recommend mode.** Invoked with one or more sources — each a file, a file
and the names of the sections to read, or a file with the specific items to
read named — an output path, and a baseline, the
`docs/` tree an item's destination and reason are judged against; and, when
the caller wants the check brief, a brief path, a template, and a chat
language. A caller that names several sources reads every one, since the
proposal it writes is the only proposal there is. Run the
workflow up to the
proposal and write the proposal to that path instead of printing it: the
numbered items grouped under four `##` headings, in this exact
text — `## Recommended adopt`, `## Recommended fix`, `## Recommended reject`,
`## Unsure` —
each item quoted in full from its source so that the
file stands alone as the apply's input. An `issue` destination is
recommended only when the item is medium severity or above, needs a
decision, or records a measured defect; a low-severity gap or drift in the
skill's own prose whose whole repair is one sentence, or a few adjacent ones
in one file, and needs no decision is grouped `Recommended fix`, its body
carrying `File: <path>`, the text as it reads in an `Old:` fence, the text
as it should read in a `New:` fence, the one-line reason, and (when the fix
adds a name to a list) the file's other mentions of that list, found by a
grep, as sibling fixes — an item the apply can act on without judgment; a fix
the caller's dispatch does not
allow — a file outside the paths it names — is grouped `Recommended reject`
with the correction in the reason. An experience item that is `[inferred]`,
or whose wording names a path, a command, a config key, a file format, a role
count, or a tool, is grouped `Unsure` with the reason named, so that the human
sees the inference or the mechanism before it is written. A line in a source
proposal that
only names an `S-n` (or similarly-formed) row is a pointer, not an item to
quote itself: follow the pointer to its own named source and quote from
there, never the pointer line itself. Put each item under its own `###`
heading, `### <n> — <title>`, `<n>` being one running number across the
whole recommendation, assigned in the order the dispatch names its
sources — unique across the whole file, never restarted per group nor per
source proposal — and each heading ending with the pointer the dispatch
gave for its source, in parentheses — `(<topic> S-<n>)` for a ledger row,
`(inbox <YYYY-MM-DD>-<slug>)` for an inbox copy, or the dispatch's own
words for another source — so that the apply writes the issue's `Source:`
line from the heading alone; where
the source is not a numbered proposal, as for a spec's sections, a running
number in the order the items are written — so that a reader can point at
an item by its heading and the human's answer names the item by the number
the recommendation gave it, and each
carrying its destination, a
one-line reason, the `exp-<id>` pairing for a `design` entry, and — for an
ADR item, and for an `[inferred]` experience item — the original wording
followed by a reference translation in the chat's language; a `[stated]`
experience item carries its quote in Sources and needs none. Do not wait for
`Direction?`, and write
nothing under `docs/`.

<!-- markdownlint-disable MD038 -->

When the caller also names a brief path, a template, and a chat language,
write the check brief from that template at that path, rendered in that
language, in the same run and from the same judgment: one line per item under
the same four headings, each ending in `See:` and the item's heading text,
its `### ` marker stripped. The brief is the second and last file this mode writes.

<!-- markdownlint-enable MD038 -->

**Apply mode.** Invoked with a recommendation path, a direction path, and a
commit subject. The recommendation quotes every item in full, so no third
file is read: where the candidates were sections of the source document, the
recommendation is the only proposal there is. Apply the accepted subset per
the per-type `AGENTS.md` — an issue opening with the `Source:` line its
item's heading carries, `Source: shoroku <topic> S-<n>` or `Source: inbox
<YYYY-MM-DD>-<slug>`, and naming nothing else of where a report came from —
lint the changed paths by name, make **one** commit
by explicit path with the subject you were given, and report the paths and
the subject. Then two things outside `docs/`, when the dispatch asks for
them. For every inbox copy the dispatch named, fill its `## Triage` section
— Outcome, one of `issue`, `fix`, `redirect`, `kaiseki`, `relay`,
`dismissed`, as the direction settled it; Reference, the issue id, the
fix's commit subject, the redirect or dismissal in one line, the `kaiseki`
line, or the relay's topic; Date — an untracked write that rides in no
commit. For every accepted `Recommended fix` item, replace its `Old:` text
with its `New:` text exactly once in the file it names, lint those paths,
review the sibling `README.md` for drift when a `SKILL.md` changed, make a
**second** commit by explicit path with the fix subject the dispatch gave,
and report it; an `Old:` text found zero or several times is reported as
`fix skipped: <n> — <why>` and the file is left as it was. Write nothing the
direction did not accept, and never run
without a direction file.

The direction file carries the directions this skill already parses — `OK`,
`2 と 5 だけ`, `3 はやめて`, an edit — one line per item, or one `OK` for the
whole list.

## Empty / minimal input

If the source has nothing substantive to excerpt, report `nothing to shoroku`
and exit. **Never invent content.**

## Soft nudge

When a session is winding down (completion utterances, a recent `git commit`, a
topic transition, or many turns with substantive edits), you **may** suggest a
shoroku run — **once per session at most**. If the user declines, stay quiet
for the rest of the session. Never start a run without explicit confirmation
— in session mode; in recommend and apply mode the caller's dispatch is the
start, and the direction file is the confirmation.

## Prohibited actions

- Do NOT start a shoroku run without explicit user confirmation — in session
  mode; in recommend mode the caller's dispatch is the run's start and
  nothing is written under `docs/`, and in apply mode the direction file is
  the confirmation, written from the human's answers.
- Do NOT restate the document format in this file — defer to `AGENTS.md`.
- Do NOT write outside `docs/` — except the recommendation and brief files
  a caller names in recommend mode, and in apply mode the inbox copies'
  Triage sections and the `Recommended fix` files the dispatch names.
  `shoroku` no longer installs or edits
  `AGENTS.md`; setting up the system is `kisou`'s job.
- Do NOT rewrite an `accepted` ADR body — only its `status` / supersede and
  amend links.
- When cross-linking entries, follow `docs/AGENTS.md` Cross-references — never
  add a path link from an ADR or other immutable/frozen entry (doc-id only).
- Do NOT delete or modify memory.
- Do NOT auto-push, auto-clean issue metadata, or sync with external trackers.
