---
id: "b7e4"
title: "passage-check.js verify --task <N> silently no-ops when a task's only blocks are W"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-18
updated: 2026-09-19
---

Source: session 2026-09-18

Reported from a live occurrence in another repository, 2026-09-18: for a task
whose only passages are `W` blocks (a whole new file, byte-exact), `verify
--task <N>` is expected to check that the file on disk matches the plan's
quoted bytes, the same way it checks `P`/`A` blocks for other tasks. Instead
it silently prints "no passages" and exits `0` regardless of whether the new
file is byte-correct — a task with only `W` blocks gets no mechanical check
at all from `verify`.

## Symptom

`verify --task <N>` cannot distinguish a byte-correct `W` file from a wrong
one, because the check filters passages on `kind === "P" || kind === "A"`
before doing anything, per `scripts/passage-check.js` lines 971 and 1012 —
`W` blocks never reach the comparison.

## Reproduction

```console
node "$TANTO/scripts/passage-check.js" verify --plan <plan path> --task <N>
```

On a task whose passages are only `W` blocks, `verify --task <N>` prints "no
passages" and exits `0` both before and after the new file(s) are written —
observed on the occurrence this issue is filed from, where the gap was caught
only because a dispatched spec reviewer independently diffed the new files
against the brief, not by `verify` itself.

## Proposed fix

`verify --task <N>` could check every `W` block's file against its quoted
bytes exactly, the same pass it already makes for `P`/`A`, instead of
filtering `W` out before the check runs.
