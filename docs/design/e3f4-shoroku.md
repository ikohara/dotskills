---
id: "e3f4"
title: shoroku skill — excerpting modes, classification, partial-accept flow
created: 2026-05-28
updated: 2026-10-01
---

## Shape

Serves no expectation; internal shape.

A thin **behavioral** shell with no bundled assets (the doc-system
lives with kisou — see decision `9f4b`). shoroku reads transient
context, classifies into the doc system's types, and stages additions
in `docs/` as a single git commit per run. It never installs anything;
in an unprepared repo it stops and points the user at `kisou`.

## Source modes

Serves exp-75bc.

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

Serves exp-06d2, exp-1fb1.

1. **Read** the source.
2. **Classify** each fragment as one of `experience` / `design` /
   `decision` / `issue`; whole-file material (an investigation, a
   reference) goes to the flat `notes` / `reports`, per the per-type
   rules in `docs/<type>/AGENTS.md`.
3. **Propose** a single numbered list grouped by destination file —
   only entries that would actually change project state. End with
   `Direction?` and wait.
4. **Apply** the accepted subset. Stage as **one** git commit naming
   the source's topic. No auto-push.
5. **Report** files changed + commit hash. Empty / minimal source ⇒
   `nothing to shoroku`, write nothing — never invent content.

### Classification and the experience pairing

Serves `req-3c4d`. Added 2026-09-09; the authority stays `docs/AGENTS.md`, and
the summary above is not restated there.

Classification follows the **two splits the type files define** — "design vs
decisions" in `docs/design/AGENTS.md` and "experience vs issues" in
`docs/experience/AGENTS.md`. The second is the newer of the two: a want the
user states that the system does not meet yet is **two** fragments, an
expectation and an issue, not one issue. The proposal then carries the
**experience pairing** the Propose step defines — each `design/` entry names
the `exp-<id>` it serves or says it serves none, and the unpaired are flagged.

Three properties of that rule matter to this skill's shape:

- **It is scoped to the proposal's own entries, never the standing tree.** A
  whole-tree sweep would flag every section of every design entry and offer an
  issue for every expectation — the mirror image of the over-extraction the
  granularity gate exists to prevent. A backfill is its own run (issue-320e).
- **The experience-side flag is a question, not a verdict.** An expectation no
  design serves may be unmet — a gap, and then an issue — or met but never
  described, and then a `design/` entry. Offering the issue outright would make
  the rule itself a source of over-extraction; the proposal asks and the user
  answers at `Direction?`.
- **It lives in the docs system, not in either skill.** The loss happens at
  classification, where shoroku stands, and kisou reads no `docs/` content at
  all, so a kisou-side scan for unpaired expectations was rejected: the rule is
  template text that every classifier runs, and kisou merely installs it.

Experience is the one type shoroku may assemble: an `[inferred]` candidate is
capped at SHOULD and goes to `Unsure` in recommend mode; the rule is in
`docs/experience/AGENTS.md` and this skill's `SKILL.md` carries one sentence
naming it.

A translation rule for the `Direction?` proposal was considered and rejected:
the proposal is already presented in the chat's language. The
original-plus-reference-translation shape rides in recommend mode, for an ADR
item and for an `[inferred]` experience item, and nowhere in session mode.

Two seams between this skill's wording and the docs system's remain open, as
`issue-2c4d` predicts for a bundle authored on one side and followed on the
other: `SKILL.md` says "pairing" where the docs rules say "unpaired", and the
Propose step does not state that the pairing's evidence comes from the design
entries carried in the proposal itself.

The six passages that landed this rule were written verbatim into the templates
and the installed copies and needed no wording change under review — with one
exception, which is worth recording because of where it surfaced. The "two
tests" bullet joins its tests with "and" but originally disposed only of a
statement that "passes neither", leaving the pass-exactly-one case with no
verdict; the correct clause is "fails either", the contrapositive of a
conjunction. **This is a defect class, not a typo**: a rule stating two
conjunctive tests, followed by a failure clause written with "neither",
inverts the rule's strictness silently and still reads well. It survived the
spec dialogue, the spec review, the review brief the human answered, the plan
review, and four implementation reviews, and was caught only by the
whole-branch review — the first reader whose whole job was to read the landed
text as text. The tree now says "fails either"; the spec of 2026-09-09 is the
record of what was approved and is deliberately not amended, so it still quotes
"passes neither" in its block.

## Partial-accept parsing

Serves exp-27e8.

`OK` / `全部適用` accept all; `2 と 5 だけ` accept named items; `3 は
やめて` reject named items; `5 の severity は high で` accept with an
edit; `全部やめ` / `cancel` write nothing.

## Locate the rules

Serves no expectation; internal shape.

shoroku reads the **repo's committed `docs/AGENTS.md`** (and per-type
`docs/<type>/AGENTS.md`) at run time and defers to them — the doc
format is authoritative there, not in `SKILL.md`. If those files are
absent the repo has not adopted the system; shoroku stops and suggests
running `kisou` (docs-only migrate scope) to install them.

## Prohibited

Serves exp-81e0.

- Writing outside `docs/`.
- Editing `AGENTS.md` / `CLAUDE.md` (kisou's job).
- Auto-pushing.
- Modifying memory in any way.
- Rewriting the body of an `accepted` ADR (only `status` and the
  `supersedes` / `superseded_by` / `amends` / `amended_by` links are mutable).
- Auto-cleaning stale issue metadata or syncing with external trackers.

## Related

Serves no expectation; internal shape.

- `exp-4b7f` — starting a project from a chat discussion, where shoroku's requirements folded.
- `decision-9f4b` — kisou as sole installer (shoroku carries no bundle).
