---
id: "f07a"
title: handover roster row corrupted by escape handling
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-03
updated: 2026-10-03
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
