---
id: "96f2"
title: every instrument a passage plan builds is aimed at the plan, and none at the fix wave that edits the same files
severity: low
depends_on: ["7481"]
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-10
updated: 2026-09-10
---

A passage plan is checked by `lint`, by `replay`, by `diff`, by the dry run,
by its own content greps, and — since the tanto-sweep run of 2026-09-10 — by
linting the applied tree. Every one of those is aimed at a **plan**. A **fix
wave** edits the same files, is drafted faster, is reviewed less, and has
none of them.

Measured in that run: of four fix passes over the spec and the plan, one
introduced a stop-class defect. The fix's object was a repository-relative
path prefix that the consistency note's check 7 forbids in runtime text; the
edit removed it, and **silently removed the `node` in front of it as well**,
leaving five role-file passages ordering a shebang-less file to run itself.
The absence check the fix was written for passed. The next review round found
it.

design-4807 already says a fix-wave list "is drafted under the same conditions
as a plan and deserves the same pre-flight: run each specified command once
before dispatching it, and compare its output with what the list expects".
This run found that insufficient for this class — the defect was not in a
command the pre-flight would have run, but in a token an edit aimed at a
different token took with it. What would have caught it is the instrument the
same run's confirmation pass finally ran and that four passes before it never
did: **apply the wave to a scratch tree and check the result the way `replay`
checks a plan** — lint the applied copy, and read the runtime text back as
prose rather than as a diff.

No fix is proposed here. What is recorded is that the class exists, that it
cost that run one full review round, and that the instrument for it is the one
already being built for plans.

Related: req-04f5, design-4807 (the fix-wave pre-flight, and the passage
conventions), issue-7481 (the durable passage check), the tanto-sweep plan
review of 2026-09-10.
