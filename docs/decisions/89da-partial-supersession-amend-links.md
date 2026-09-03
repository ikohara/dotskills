---
id: "89da"
title: partial supersession of an ADR via amends / amended_by links
status: accepted
supersedes: []
superseded_by: null
created: 2026-09-03
updated: 2026-09-03
---

## Context

The ADR rules kisou ships (the `docs/decisions/AGENTS.md` template) knew one
way to change an accepted ADR: full supersession — the new ADR sets
`supersedes: [<old>]`, the old one flips to `status: superseded` with
`superseded_by: <new>`, body untouched. On 2026-09-02 a downstream project
(s2-paper-picker) needed to replace *part* of an accepted ADR: its
decision-9b41 retired the mutation gate, seed path, root form, rename ban, and
marker self-heal of its decision-7d38, while 7d38's core (👍-subscription as
the delivery audience) stayed in force. Flipping 7d38 to `superseded` would
have read as "all of 7d38 is dead", so the implementing agent invented a
pattern on the spot, and review passed it:

- the old ADR keeps `status: accepted`;
- `superseded_by` holds prose — `"9b41 (partial — …; 👍-subscription itself
  is unaffected)"`;
- a "Partially superseded by decision-9b41: …" notice paragraph is prepended
  to the supposedly immutable body;
- the new ADR uses the regular `supersedes: ["7d38"]`.

Four defects: prose in `superseded_by` breaks or misleads any machine reader of
the field; `accepted` plus a non-null `superseded_by` is a contradictory pair
under the existing rule; the body edit violates "status and links are the only
mutable parts"; and with no rule, the next partial case breeds a third variant.

## Options

- **A — ratify the ad-hoc pattern.** Add a "Partial supersession" section
  legalizing prose in `superseded_by`, the `accepted` status, and the notice
  paragraph as the one allowed body edit. Minimal, but `superseded_by` stays
  machine-unreadable and the immutability rule gains a prose exception.
- **B — separate link fields.** Keep `supersedes` / `superseded_by` as bare ids
  meaning full retirement; add fields for the partial case. Sub-choices: where
  the scope statement lives (a structured field, a notice in the old ADR body,
  or the new ADR body), and whether a new `status` value such as `amended` is
  needed.
- **C — forbid partial supersession.** Always supersede in full; the new ADR
  restates whatever it carries over. Simple rule, but every partial change
  copies living decisions and their reasoning into a second file.

## Decision

**B**, with the adr-tools vocabulary `amends` / `amended_by`:

- The new ADR sets `amends: [<old-id>]`; the old ADR appends `<new-id>` to
  `amended_by` and bumps `updated:`. The old ADR keeps `status: accepted` and
  `superseded_by: null`; its body is not touched — no notice paragraph, no
  strike-through.
- All four link fields hold bare decision ids only. The scope of a partial
  replacement is recorded once, in the amending ADR's Decision section
  ("replaces X and Y of decision-N; the rest stands"). The current shape of
  the system is `design/`'s job, not the amended ADR's.
- No new `status` value: `status` answers "is this record alive?", and an
  amended ADR is alive. An ADR is in full force when `status: accepted` and
  `amended_by` is empty.
- Amend when the old ADR's remaining decisions still stand on their own
  recorded reasoning; supersede when nothing worth keeping would remain. Never
  amend to fix wording or add detail — that is a `design/` update or a new ADR.
- ADRs written before the fields existed omit them; absence reads as `[]`, and
  a field is added when it gains its first value. No retrofit of existing ADRs
  is required.
- The template section keeps its heading `## Superseding (the only edit to an
  accepted ADR)` and changes only its body, so the kisou refresh
  (decision-281f) sees a diverged fixed-text section, not a missing one (see
  design-c1d2).

## Consequences

- The ADR frontmatter has four link fields; the template's `docs/AGENTS.md`
  Cross-references lists all four as the structured links.
- Downstream repos pick the rule up by re-running `kisou migrate` (docs-only
  scope), never by hand-editing their `AGENTS.md`.
- The s2-paper-picker pair is a schema violation under the old rule as well,
  so it is retrofitted rather than grandfathered: frontmatter-only edits (7d38
  `superseded_by: null` + `amended_by: ["9b41"]`; 9b41 `supersedes: []` +
  `amends: ["7d38"]`) plus removal of the notice paragraph, which restores the
  as-accepted body and whose content already lives in 9b41's Decision.
- The two in-repo restatements of the mutability rule (shoroku's `SKILL.md`
  and design-e3f4) now say "status and supersede / amend links".
- This repo's own `docs/` copies of the rules lag the template until refreshed
  (issue-da04).
