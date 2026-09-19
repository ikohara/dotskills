---
id: "ea3c"
title: a plan schedules a command or construct that an open issue already records as failing on this host
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-12
updated: 2026-09-19
---

Source: shoroku tanto-workspace

Nothing in the spec or plan workflow consults the open issues for the commands
and constructs the plan is about to schedule. So a form already recorded as
failing here is written into the next plan, reaches dispatch unchallenged, and
is rediscovered by the session running it — at the cost of a ruling, a
re-author, and whatever the workaround leaves behind.

Both of the tanto-workspace run's controller rulings (2026-09-12) trace to this
one gap, and both hazards were on file before the plan was written.

- **issue-235b**, filed 2026-09-10: `node --test <directory>` fails with
  `MODULE_NOT_FOUND` on this host. The tanto-workspace spec (2026-09-11) and
  plan (2026-09-12) scheduled that exact form four times — once in the spec's
  Verification section, three times in the plan — and the failure surfaced at a
  batch boundary, where the session substituted the file form and recorded both.
- **issue-f851**, filed 2026-09-11, the day before the plan: a block is not
  checked against its destination's linter before dispatch. The plan then wrote
  two blocks carrying a leading space inside an inline code span, which
  markdownlint's `MD038` strips silently; both had to be re-authored by ruling,
  and both now report `passage-absent` for the life of the plan (issue-7c28).

Neither is a case of an issue nobody had gotten to. Both are cases of a filed,
open, indexed issue describing exactly the thing the plan then did.

The cheap fix is a plan-review step: for each command form and each block
construct the plan schedules, grep the open issues for it, and either avoid the
form or state in the plan why it is used anyway. `docs/issues/open/` is small
enough to grep by hand, and the plan's own Verification section is the natural
place to record the result — the check is cheapest exactly where the commands
are enumerated.

A second, weaker mitigation for the same gap: an issue that records a **command
form** as broken could name the working replacement in its title or first line,
so a grep hit is immediately actionable rather than a prompt to read the whole
issue. issue-235b does this well; issue-f851 does not, and its scope was in
fact wider than its own text claimed.

Related: req-04f5, design-4807 (plan conventions under tanto), issue-235b,
issue-f851, issue-7c28.
