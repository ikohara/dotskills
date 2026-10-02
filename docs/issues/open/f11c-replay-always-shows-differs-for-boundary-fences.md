---
id: "f11c"
title: "`replay` always shows `DIFFERS` for boundary fences: `replay-skip:` is shared with `boundary`, and fences that call `git` fail in the scratch tree"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-02
updated: 2026-10-02
---

Source: shoroku experience-layer S-34

Two measured sources of permanent noise in `replay`'s output on every
passage plan with a boundary section; a reader takes the lines for defects.
Carrier topic: `passage-check-hardening`.

**`replay-skip:` is shared with `boundary`.** A `replay-skip:` pattern is
honored by `replay` and by `boundary` alike, so a marker comment
(`# tree-state`) in the task fences that read the live tree is the only way
to skip replay noise without also skipping fences `boundary` must run. The
fences under "How a batch is verified" then always show as `DIFFERS` in
`replay`'s scratch tree — nine on the `experience-layer` plan — and the
dry-run report rules on each as an artifact. A plan with guarded,
phase-conditional boundary fences always carries that noise.

**Fences that call `git` fail in the scratch tree** (S-83). In `replay`'s
scratch tree the two "How a batch is verified" fences that call `git`
without a `# tree-state` comment (the `diff` fence and the `lint` fence)
fail with `fatal: not a git repository`. The plan's rule says those fences
never carry the comment, because `boundary` honors the same pattern, so
every passage plan with a boundary `diff` or `lint` fence shows two
`DIFFERS` that mean nothing. Either `replay` skips a fence whose first
command names `git`, or the rule lets the comment on.

Issue-14a4 is a third false line of `replay`'s, on anchors.
