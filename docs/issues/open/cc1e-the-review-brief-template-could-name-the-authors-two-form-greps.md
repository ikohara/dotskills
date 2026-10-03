---
id: "cc1e"
title: "`templates/review-brief.md` could name the two greps the author runs, so the writer's check is the same check"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-03
updated: 2026-10-03
---

Source: shoroku tanto-issue-triage S-52

The `tanto-issue-triage` spec's brief writer reported checking the eight
rendered headings and the section 5 line "by eye, not with a tool". The
author's form check covered them by `grep`, so nothing was lost, but the
writer's own check was not the same check. `templates/review-brief.md`
could tell the writer the two greps the author runs.

Which greps the template names is a choice, since they live in the
author's role text. Beside issue-4aab and issue-fb90 (its finding 9);
issue-e3ce's item 3 (an English heading passes the brief's form check)
asks for the same mechanical form check.
