---
id: "366f"
title: a close's fix commit lands after the whole-branch review, unreviewed by a subagent
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-20
updated: 2026-09-20
---

Source: shoroku bug-report-hold S-26

A `fix` item from a close (decision-83aa) lands on the topic branch **after**
the whole-branch review has run, so no subagent reviews it. Its checks are
Kanri's own diff verification and the human's line on the shoroku brief.

Deferred with the accepted limit recorded: a `fix` is by construction one
sentence in one file, with its old and new text quoted in the recommendation
the human approved, which is a smaller surface than any reviewed change on the
branch. If a fix ever breaks a pinned string, the consistency script is where
that catch belongs, not a second review dispatch.
