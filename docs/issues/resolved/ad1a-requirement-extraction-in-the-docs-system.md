---
id: "ad1a"
title: requirement extraction in the docs system — a need the human states is a requirement fragment even when unmet
severity: medium
depends_on: []
blocks: []
claimed_by: tanto requirement-extraction plan (Kanri, dotskills)
claimed_at: 2026-09-09T14:12:00+09:00
created: 2026-09-09
updated: 2026-09-09
---

Raised by the human in the review-brief spec dialogue (2026-09-08, D-2) and
deferred by that spec to the skills that own the docs system: `kisou`, which
installs `docs/AGENTS.md` and the per-type files, and `shoroku`, which
follows them. `tanto` adds no rule of its own for it; its one hook is the
review brief's requirement section, which asks the human two questions per
item.

The mechanism that loses a requirement. `docs/AGENTS.md`'s shoroku step
classifies each fragment as exactly one of four types, and
`docs/issues/AGENTS.md` defines an issue as something wrong or missing that
is not being fixed now. An unmet need matches "missing", so it becomes an
issue and the requirement in it is lost — by shoroku, and by Kanri filing an
issue at the intake under the same rules. `docs/design/AGENTS.md` has a
"design vs decisions" paragraph ("a significant choice often updates design
and adds an ADR; that is not duplication"); there is no "requirements vs
issues" counterpart. The instance that surfaced it: issue-a1c9's opening
statement — reading the full translation of every spec and plan is too much;
a third party should list only the judgment points — is a need about the
human's own situation that survives any design of the brief, and it was
filed as an issue; the review-brief spec moves it into req-04f5 at its T1.

What to add, in `kisou`'s templates for `docs/requirements/AGENTS.md` and
`docs/AGENTS.md`:

- **The rule.** A need the human states is a requirement fragment even when
  unmet; the gap it leaves is a separate issue fragment; one statement
  yielding two entries is not duplication.
- **Two tests** for "this is a requirement": the need survives a change of
  design; its reason is the human's own situation (time, trust, language,
  authority), not the system's coherence.
- **The gate against over-extraction.** The granularity rule
  `docs/requirements/AGENTS.md` already has (coarse, one file per topic,
  never one file per sentence) applied to classification: a small need
  folds into an existing requirement's section as one bullet, or is design;
  a new file only for a new topic. The human's confirmation stays the gate
  — `tanto`'s adoption rule (decision-1f5f) already requires it for every
  requirement item, and `shoroku`'s own `Direction?` prompt (req-3c4d)
  requires it outside `tanto`.
- **The pairing.** A requirement file and a design file per topic already
  cite each other (req-04f5 and design-4807 do). The check to add is
  bullet-level — a design section that names no requirement, a requirement
  bullet no design serves — as a `kisou` consistency check and a `shoroku`
  proposal field.
- **`shoroku`'s `SKILL.md`** defers to `docs/AGENTS.md` and needs one
  mirroring sentence at most.

Not in the review-brief plan, by that spec's Fixed inputs (D-2): the fix
belongs where every classifier reads. Related: req-1a2b (`kisou`),
req-3c4d (`shoroku`), req-04f5, decision-1f5f, issue-a1c9, and the
review-brief design of 2026-09-08 ("What goes to kisou and shoroku").

**Resolved 2026-09-09** by the requirement-extraction plan. Six passages
landed: the `## requirements vs issues` section carrying the rule, its two
tests, the granularity gate and the `Direction?` gate; the exit paragraph in
the issues template, placed where a classifier matching "missing" reads first;
the rewritten Classify step, which keeps "exactly one" and says the unmet need
is **two** fragments; the two pairing bullets in the design and requirements
Body rules; and the rewritten Propose step, which flags the unpaired among the
entries a proposal carries. `skills/shoroku/SKILL.md` gained one sentence
naming the two splits and the pairing without restating either. All four of
this repository's installed copies were brought level.

One wording of this issue is superseded, openly. It asked for the pairing check
"as a `kisou` consistency check"; it became a **docs-system rule** in the
template text instead (D-1). kisou's refresh compares section structure against
its templates and reads no `docs/` content at all, so it has no place to run
such a check — and the loss this issue describes happens at classification,
where `shoroku` stands, not at installation, where `kisou` does. The rule now
lives in the text both skills serve, and every classifier runs it.

What the plan deliberately did not do: sweep the standing tree. No existing
design section was made to name its requirement; that backfill is issue-320e,
a shoroku run of its own, item by item.
