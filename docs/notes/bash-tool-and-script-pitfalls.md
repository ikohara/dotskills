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

## A doubled backslash collapses in any inline Bash form — heredoc, awk string, `node -e` (2026-10-01, 2026-10-03)

A Windows path written with doubled backslashes inside a single-quoted
`node -e` script, run through the Bash tool, collapsed to single backslashes
and then to escapes: a NUL byte landed in a roster row, repaired by
rebuilding the path from `String.fromCharCode(92)`. Any recipe that writes a
Windows path from a shell one-liner has the same hazard; write the path with
forward slashes, or from a script file.

The `tanto-issue-triage` plan measured the same collapse six more times, in
every inline form the tool offers:

- **A quoted heredoc is not safe.** A Node script fed through
  `cat > file <<'EOF'` reached the file with each doubled backslash halved:
  a regex `(?<!\\)\|` became `(?<!\)\|` and `node` failed with
  `Unterminated group`. The quoted delimiter does not prevent the collapse on
  this host.
- **A path literal becomes a NUL.** A roster row built by a heredoc or
  `node -e` script carrying `"C:\\Users\\0000123456\\…"` (a user name that
  starts with digits, replaced here by `0000123456`) reached the file as `C:Users`, a NUL byte, and
  `0123456develdotskills`: Node read `\U` as `U`
  and `\0000` as an octal escape. The first symptom was not the wrong cell
  but `grep` reporting `Binary file … matches` and printing nothing — the
  roster looked unreadable. Seen at three roster writes in one plan.
- **An edit script writes raw CR bytes.** Node scripts that edited a plan
  and carried `\\r` or `\\n` wrote a raw CR into the file (seven and one
  occurrences), and a `\n` pattern matched nothing; found only by counting CR
  bytes and re-reading the replaced lines.
- **A plan's fenced block fails inline and passes from a file.** A plan's
  verification fences carrying `\\.` or `\\[` in an awk string printed false
  failures when run inline and passed when run from a file written with the
  Write tool; a `boundary` that runs fenced blocks verbatim meets the same
  collapse unless it writes them to a file first (see issue-58e0).
- **A seat's own commands, not only its dispatches.** A Jisso was bitten in
  its own window minutes after writing a brief that warned its implementer
  against the heredoc form.

The rule: any inline script or text that carries a Windows path or a regex
backslash goes in a file written with the Write tool, or builds the
backslash with `String.raw` or `String.fromCharCode(92)` joins — for every
seat's own commands, the controller's included. After a scripted edit of a
plan, count CR bytes with a Node byte count (not `grep -c $'\r'`, below)
and re-run `lint`.

The `run-owned-seats` plan's drafting measured it three more times
(2026-10-05): a doubled backslash in a heredoc broke a JavaScript string in
the needle generators each time, until the scripts were written with the
Write or Edit tool.

## A command that waits on standard input hangs the tool (2026-10-01)

A command that waits on standard input hangs the Bash tool until its
120-second move to the background: a stray `cat > file` typed before its
here-document held the call. The same class as the hung heredoc above, found
from the other side, with the same fix — end every call that might read
stdin with `< /dev/null`, or write the script file with the file-writing
tool and run it.

## `grep -c $'\r'` prints the line count of a file with no CR byte (2026-10-02)

`grep -c $'\r' <file>` in the Bash tool printed 375 for a file whose bytes
held no CR at all (a Node byte count read 0 CR and 375 LF), so a script
written on that reading split on `\r\n`, found one line, and failed at its
first table search. The tool's `$'\r'` is not the carriage return. Check
line endings with a Node byte count before writing a splitter.

## After `--`, `git commit` reads `-m` and the message as pathspecs (2026-10-02)

`git commit --only -- <path> -m "<message>"` treats `-m` and the message as
pathspecs once `--` has been seen and fails with `did not match any file(s)
known to git`. The message goes before `--`; a message file (`-F <file>`) is
the safe form for a multi-line one. A spec's own commit recipe carried the
wrong order into a plan.

## `uuidgen` can block the tool; draw ids with `[guid]::NewGuid()` or `crypto.randomUUID()` (2026-10-02)

`uuidgen` in the Bash tool returned two ids and then blocked a compound
command past the tool's 120-second limit on its third call (the command
finished in the background with six ids). The PowerShell form
`[guid]::NewGuid().ToString('N').Substring(0,4).ToLower()` or Node's
`crypto.randomUUID()` is the dependable draw on this host; the POSIX recipe
in `docs/AGENTS.md` stays as the portable form.

## A `cd` in a compound command moves the working directory for the next call (2026-10-02)

A `cd` inside a compound Bash command persists into the next call: twice in
one Keikaku session the working directory moved, once to a topic directory
under `.tanto/` and once to `skills/tanto/scripts` (a symlink into the tree),
and the inbox bundle filed as issue-37ec records it twice more, a Kanri's
`cd` into shoki's worktree and a Jisso's into the skill's templates, noticed
only from the harness's environment-update line. Look elsewhere with a
subshell, `( cd <dir> && … )`, or with `git -C <dir>`.

## Anchor a table edit on a whole line (2026-10-02)

An Edit whose `old_string` was only the start of a ledger table row
(`| S-47 | … item 8 |`) and whose `new_string` inserted rows before the row's
own tail split that row in two. A table edit anchors on a whole line.

## `FORCE_COLOR=3` wraps a captured `console.log` number in ANSI codes (2026-10-02)

The host shell exports `FORCE_COLOR=3`, so `node -e 'console.log(<number>)'`
captured by `$(…)` carries ANSI codes (`ESC[33m308ESC[39m`) and every `=`
comparison on it fails. It produced one false `fail` at every boundary of the
`tanto-issue-triage` plan, whose verification blocks captured numbers this
way. Run such a capture with `FORCE_COLOR=0`, or print `String(n)`. The
boundary consequence is issue-58e0.

## An open-ended `sed` range prints to the end of the file (2026-10-02)

A `sed -n '/^| B-rework-1/,/^| C/p'` range whose end pattern never matched
printed the ledger to its end — about 15,000 tokens of the S table and the
Measurements text into a Kanri's context. A ledger or roster read by a start
pattern takes a line-number range or a `grep`, never an open-ended `sed`
range.

## `node --test` on a directory fails at once on Node 24.16 (2026-10-03)

`node --test skills/tanto/scripts/` — a directory — fails at once on
Node 24.16: the directory is read as one test file, and the run reports
`1 test / fail 1`. The shoki-seat spec's verification line named the
directory and was not runnable on this host; the plan named
`skills/tanto/scripts/*.test.js` in every command instead. Earlier plans'
verification lines that name the directory carry the same defect, and a plan
reusing one names the files.

## `$CLAUDE_JOB_DIR` prints as a Windows path, and a redirect to it wrote a stray file (2026-10-04)

`$CLAUDE_JOB_DIR` prints as a Windows path with backslashes in the Bash tool,
and `mkdir -p`, `awk -v` and a redirect to `"$CLAUDE_JOB_DIR/tmp/..."` then
treat it as a relative name: a first awk extraction wrote a stray file named
`C:Users…` into the repository root (removed before it was staged).
`cygpath -u "$CLAUDE_JOB_DIR"` gives the usable form, and a background
seat's `$CLAUDE_JOB_DIR/tmp` instruction would need it.

## `git diff` and Git Bash `grep` hide CRs, so a CRLF check through them fails by construction (2026-10-04)

On this host `git diff` and Git Bash `grep` hide carriage returns (the index
holds LF and the working tree CRLF under `core.autocrlf`), so a check that
every new line ends in CRLF, written as `git diff | cat -A | grep '^+'`,
fails by construction: it printed every `+` line. Count `\r\n` and bare `\n`
over the file's bytes with node instead. Measured by an implementer of the
shoki-seat fix wave and confirmed on three files. A neighbor of the
`grep -c $'\r'` entry above.

## A CRLF template defeats a multi-line placeholder match (2026-10-04)

`skills/tanto/templates/shoki-brief.md`, like the other templates, carries
CRLF line endings in the working tree, so a render script that matched a
multi-line placeholder with an exact `\n`-joined string found nothing and
said only `expected 1 got 0`. Normalize the line endings before matching.
The agent template's case is issue-486b.

## A roster-built `--share` list matched two table shapes (2026-10-04)

A script that built the `reading.js --share` path list from the roster
matched the Residency table's rows as well as the Sessions table's — both
start `| kanri |` — so the first run passed seven `0` cells as paths and
printed `skipped 0, 0, 0, 0, 0, 0, 0`; the second run, with the Sessions
rows only, gave 91% over 13 transcripts. The roster has two row shapes with
the same first two cells; a script that reads it selects the table by its
heading first.

## A `cat` displayed collapsed backslashes while the file was intact (2026-10-04)

A `cat` of the roster in the Bash tool printed one row's cwd and Transcript
cells with their backslashes collapsed (`C:Users 0105523develdotskills...`),
while the file's own bytes (`od -c`) and a later `grep` of the same row were
intact. Check the bytes before rewriting a row that looks damaged in a
tool's output: the damage was in the display, and a rewrite would have done
nothing but append a false Events line.

## `--test-name-pattern` after the file path is ignored (2026-10-05)

`node --test <file> --test-name-pattern <p>` does not apply the pattern: the
run takes the whole file. Put the flag before the path.

## A time written from an estimate is wrong (2026-10-05)

A ledger time written from an estimate was wrong three times in one batch
against the shell clock. A time in a ledger comes from `date` or is left
out.

## A `git stash` in the shared tree is invisible to a peer's `git status` (2026-10-06)

The repository's stash list held an entry from 2026-09-10 that no current
run made, and an implementer of the `run-owned-seats` batch C took and
popped a temporary stash. A stash is one more thing a peer's `git status`
cannot see in a shared checkout; a dispatch into the shared tree says never
to stash.
