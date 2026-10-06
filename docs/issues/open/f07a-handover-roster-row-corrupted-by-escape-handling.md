---
id: "f07a"
title: handover roster row corrupted by escape handling
severity: high
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-03
updated: 2026-10-07
---

Source: hotfix docs(issues): handover roster row corrupted by escape handling

A successor Kanri accepted a handover whose first roster data row was
corrupted. The row's cwd and Transcript paths had lost their backslashes
(`C:Users 0105523develdotskills`) and two NUL bytes had been written into
`.tanto/roster.md`, so `grep` treated the file as binary ("Binary file
matches") and `boundary.js census` printed the mangled transcript path
under Not listed. The row was Kanri's own, written at its handover
acceptance. Only that one row was damaged.

Likely cause (unverified): the row was written through a path that
interprets backslash escapes (`\U`, `\0`), such as a shell
`echo -e`/`printf` or an escape-interpreting replacement string, instead of
writing the Windows paths as literal data. Related prior note: a heredoc's
doubled backslash collapses to one on this host.

Impact: a damaged first row breaks the address every seat reads and the
census's `sessionId` match (the basename of the Transcript column is the
identity); here it was caught only because the successor read the census
output.

Suggested direction:

- `roles/kanri.md` says to write roster rows only through `boundary.js
  record` or a script that treats paths as literal data, never through an
  escape-interpreting shell or replacement string.
- the census, or `boundary.js check`, reports a NUL byte or a Transcript
  cell that does not look like a path as an error line, so a corrupted row
  is noticed at the next Kanri's start instead of by chance.

**2026-10-07, from inbox 2026-10-06-spawner-roster-and-handover-contract —
the cause verified, a third occurrence, and severity raised to high.**

- **Cause, verified.** An inline script's doubled backslash was collapsed by
  the Bash tool, and JavaScript then read the single backslash as an escape:
  each separator of the cwd and Transcript cells was dropped and a `\0`
  became a NUL byte (`C:Users<NUL>…`, the Transcript cell with no separator
  before `<sessionId>.jsonl`; the file held exactly two NULs). The likely
  cause above is the right one, and the hazard is the one
  `docs/notes/bash-tool-and-script-pitfalls.md` records for inline Bash
  forms.
- **Third recorded occurrence.** The bug report's run met it on a resumed
  handshake, where Kanri's answer said the row was
  rewritten in place while only the name and `[ref]` changed; the two cells
  were right only after a later Kanri edit. At the tanto-feedback close the
  successor Kanri's own row carried two NUL bytes again, which is why a Git
  Bash `grep` of the roster printed `Binary file … matches` (after the
  repair, `grep -n` on the roster printed its lines).
- **Impact, larger than the census.** The census matches a row by its
  Transcript basename (`scripts/tanto.js` and `scripts/boundary.js` take
  `path.basename(<cell>, ".jsonl")`), so with separators gone the basename
  is not the id and a live seat reads as `dead`. Worse, the launcher locks
  the human out of Kanri: `tanto` answers `held: <sessionId>` and names no
  cause. Nothing checks the cell on the way in; `record --seat` writes the
  Transcript cell without a shape test.

Two directions added to the two above:

- `scripts/tanto.js` attaches to the `held:` holder, and falls back to the
  state file's running Kanri by role when the first row's `sessionId`
  matches neither the listing nor the state file.
- `scripts/boundary.js record --seat` writes a successor Kanri's row itself
  (issue-5eb5's fourth defect), so no Kanri writes its own row by hand, and
  the row writer rejects a Transcript cell whose basename is not a UUID
  followed by `.jsonl`.

Kin issue-c18a, which bundles the bug report's other findings.
