---
id: "2bf9"
title: kisou's fixed-text test reads the docs rules' `<id>` notation as free-text, so their refresh is unreachable as written
severity: medium
depends_on: []
blocks: []
claimed_by: tanto kisou-refresh (Kanri dotskills-28)
claimed_at: 2026-09-11T00:43:15Z
created: 2026-09-09
updated: 2026-09-11
---

Found in the requirement-extraction spec review (2026-09-09), while working
out which sections kisou's refresh would offer to replace on this repository's
installed copies.

`skills/kisou/SKILL.md` Step 3 (migrate), the kisou-managed branch, refreshes
"a **diverged fixed-text section** — one whose template body has **no `<...>`
free-text**" and says "Never flag a **free-text section** (template body
carrying `<...>` for the author to fill, e.g. README `## Tech stack`)". The
docs rules are written in an angle-bracket notation of their own: the design
template's `## Body` carries "Link to a recorded choice with `decision-<id>`
where relevant", and the requirement-extraction passages add `req-<id>` and
`design-<id>` to the requirements `## Body` and to `docs/AGENTS.md`'s
"Session shoroku (excerpting)" section. Read literally, `<id>` makes each of
those a free-text section that the refresh never flags, so a change to the
bundled rule text would never reach an installed copy through
`kisou migrate` — exactly the path decision-281f describes as the upgrade
path. Read as intended, `<...>` means an author-fill placeholder such as
`<topic title>`, and decision-281f's own example calls "the `docs/AGENTS.md`
document-management rules", saturated with `<id>` / `<slug>` / `<status>`, a
fixed-text section.

The requirement-extraction plan relies on the intended reading and measures
what the refresh actually does (its Task 3); a refresh that skips a section
because its body carries `<id>` is a finding against kisou in that plan's
batch report. Either way the skill text needs a sentence that separates the
two kinds of angle brackets — a fill placeholder the author owns from a
notation token the rule text uses — so that the fixed-text test is decidable
without knowing the author's intent.

The refresh run of 2026-09-09 did **not** exercise this, and the issue must
not be closed on its evidence. The fingerprint gap of issue-e19f diverted
three of the four files before the fixed-text classification ever ran on them,
so for those three the literal reading was never reached. For the one file that
did reach the refresh branch, `docs/AGENTS.md`, the **intended** reading held:
its "Session shoroku (excerpting)" section was offered for replacement even
though its body carries `<id>` notation. That is one data point in favor of the
intended reading and none against the literal one — the defect is **masked,
not disproved**.

Related: req-1a2b, design-c1d2, decision-281f, issue-ad1a (the plan whose
refresh run exercises this), issue-e19f (the per-type fingerprint), and
issue-f623 (the insertion position of an added section).
