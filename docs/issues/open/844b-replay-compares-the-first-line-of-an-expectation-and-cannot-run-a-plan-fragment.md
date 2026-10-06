---
id: "844b"
title: replay compares the first line of an expectation and cannot run a plan fragment
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-06
updated: 2026-10-06
---

Source: shoroku run-owned-seats S-40

Two limits of `passage-check.js replay`, measured while the run-owned-seats
plan was drafted:

- The `Expected:` comparison reads only the first line of the paragraph, so a
  multi-line expectation prints `DIFFERS` for output that matches. This is the
  mechanism under issue-647b.
- `replay` cannot run a fragment of a plan: it runs every `node --test` fence,
  and a fragment written by one parallel drafter has no `replay-skip:` lines
  for the fences that belong to the whole (kin issue-1d95, whose skip is per
  fence).

Carrier topic: `passage-check-hardening` — `replay`'s comparison and its
fence selection; 647b is in its list.
