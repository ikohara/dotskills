---
id: "a00e"
title: the report template invites a proposed fix but does not fix its `Old:`/`New:` shape
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-20
updated: 2026-09-20
---

Source: shoroku bug-report-hold S-26

`templates/bug-report.md`'s "Proposed fix" section invites the sender to
suggest a sentence, but says nothing about its shape — so a report arrives with
prose, and the close's recommender writes the `Old:`/`New:` fences itself from
the live file.

Deferred, and the reason is the accepted limit rather than the cost: the
recommender has to read the target file at the close anyway, to check that the
old text still occurs exactly once, so a sender-supplied fence saves a
transcription and nothing more — and a sender quoting a file it may not have
open risks a fence that no longer matches. A template shape could follow if the
recommender's readings ever prove uneven.
