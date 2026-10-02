# Bash tool and script pitfalls

What breaks when a session edits files or runs scripts through the Bash tool
on this Windows host. One dated entry per measured hazard, with the fix that
worked; none is a defect of this repository's own code. A later measurement
that disagrees is added beside an entry rather than replacing it.

## A section edit by heading needs a fence-aware split (2026-09-30)

Editing a 1,200-line spec by replacing whole `##` sections found by heading
is unsafe when the spec quotes templates in fenced blocks: the hub template's
`## Cast` inside a fence ended a section early and left an 867-character
duplicate tail, which the brief writer caught as a contradiction (two hub
tails, one tagging Won't items and one not). A section edit on a document
with fenced `##` lines needs a fence-aware split, as `doc-system-check.js`'s
`splitSections` already is.

## A Python heredoc collapses an escape, and cp932 stdout refuses an em dash (2026-09-30)

A Python heredoc through the Bash tool collapsed a `"\n## …"` escape into a
literal newline (the doubled-backslash pitfall, re-measured), and `print()`
of an em dash under the default cp932 stdout raised `UnicodeEncodeError`.
`PYTHONIOENCODING=utf-8` on the command fixed the second; a script file
written with the Write tool instead of a heredoc fixed the first.

## A heredoc carrying a `node` edit script hung the tool (2026-09-30)

A heredoc carrying a small `node` edit script hung the Bash tool for 120
seconds and was moved to the background. The same script written with the
Write tool and run directly worked at once. Every regex-bearing edit script
of that plan stage went through a Write-tool file afterwards.

## `git checkout -- <path>` does not restore CRLF after an LF commit (2026-09-30)

A line-ending restore of the shape `git checkout -- <path>`, after a commit
of a file written with LF under `text=auto`, is a no-op: the working copy
equals the normalized index blob, so git treats the file as unmodified.
Deleting the working copy first, then checking it out, restores CRLF.
Measured at the `experience-layer` plan's Task 1 Step 7, whose restore steps
named the command without that condition.

## A doubled backslash in a single-quoted `node -e` collapses to an escape (2026-10-01)

A Windows path written with doubled backslashes inside a single-quoted
`node -e` script, run through the Bash tool, collapsed to single backslashes
and then to escapes: a NUL byte landed in a roster row, repaired by
rebuilding the path from `String.fromCharCode(92)`. Any recipe that writes a
Windows path from a shell one-liner has the same hazard; write the path with
forward slashes, or from a script file.

## A command that waits on standard input hangs the tool (2026-10-01)

A command that waits on standard input hangs the Bash tool until its
120-second move to the background: a stray `cat > file` typed before its
here-document held the call. The same class as the hung heredoc above, found
from the other side, with the same fix — end every call that might read
stdin with `< /dev/null`, or write the script file with the file-writing
tool and run it.
