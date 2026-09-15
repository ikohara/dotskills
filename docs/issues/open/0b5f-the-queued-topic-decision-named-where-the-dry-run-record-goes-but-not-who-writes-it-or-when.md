---
id: "0b5f"
title: the queued-topic decision named where the dry-run record goes but not who writes it or when
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-15
updated: 2026-09-15
---

The Kikaku decision "queued-topic keikaku" of 2026-09-15 (it lives under the
workspace's own `kikaku/` directory, outside the six types, so it is named
here by title and date rather than path-linked) said in its section 3, step 2,
that the projection dry run's record "goes in `plan-dryrun.md` beside the two
commands" — but `tanto-project-config`'s own `plan-dryrun.md` did not carry
that record until this Kanri's cold read pointed out the gap (the cold read's
finding 3), after which Keikaku added an "Addendum 3" to it.

The decision named *where* the record belongs but not *who* writes it or
*when*, so the projection probe was run and handed over as a bare result, with
no step in the design's own numbered list saying "and record it in
`plan-dryrun.md` before dispatching the review". A cold read was the backstop
that caught the missing record.

The decision file was **revised in place on 2026-09-15** — not superseded by a
new file — to name who and when: Keikaku writes the record in `plan-dryrun.md`
before dispatching `plan.review`, and it stays Keikaku's to write even when
another seat ran the probe and handed over only the result.

This issue therefore documents the gap that occurred, and closes when the
design text that `passage-check-hardening` lands in `roles/keikaku.md` carries
that step as the decision now states it — the carrier being the one
issue-13a1 describes, since that topic's own T0 read finds the step in the
decision's numbered list.

A system gap, not a user-stated need, so no paired requirement.
