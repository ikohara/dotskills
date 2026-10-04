# Triaging the issue pile

What the first triage of `docs/issues/` (the `tanto-issue-triage` topic,
2026-10-02 to 2026-10-03) measured about the pile and about its instrument,
`scripts/issue-liveness.js`, with the counter `scripts/issues-by-finder.js`
beside it. One concern: the figures and limits the next triage reads first,
before it trusts a verdict or re-measures. Why the triage has this shape is in
the decisions written at that close (decision-f706 for the Landed rule); the
open questions it left are issues (issue-d0a3, issue-d0d7). A later
measurement that disagrees is added beside an entry rather than replacing it.

## What the design stage measured

- **No issue marks an `Old:` side.** None of the 308 issues marks one in any
  form, so a rule that extracts "the `Old:` side only where an issue marks
  one" selects nothing. The instrument extracts every quoted string, and the
  discrimination happens where the recommender reads the removing commit's
  subject.
- **The pile moves under a design.** It grew from 259 to 308 between the
  working note (2026-10-01) and the spec (2026-10-02), 30 of them filed by one
  close. A triage designed on a count is designed on a moving count; the
  instrument's own `meta` is the figure a plan carries.
- **Issue files read `i/lf w/crlf`.** `git ls-files --eol` reads that for
  every issue file under `core.autocrlf=true`; a bulk writer that appends `\n`
  to a CRLF working-tree file leaves a mixed file the editor's diff shows
  whole.
- **A per-string `git grep` costs about 0.12 s.** At the pile's needle count,
  loading the tree once and searching normalized text in memory is the
  difference between seconds and minutes, and it is also what lets a wrapped
  quote match.
- **Short cluster terms match as whole words.** The spec's substring cluster
  rule moved 75 of the 240 note-placed issues to another cluster; the
  whole-word rule for short terms is the fix, and the instrument reports its
  agreement so the next triage can tune the term list from a number. One
  title (issue-4914) carried an unescaped `|`.

## Path tokens and quotes: what the instrument reads and what it misreads

- **Paths are rooted or skill-relative.** The pile's backticked path tokens
  were 314 rooted and 397 skill-relative (`roles/…`, `templates/…`,
  `SKILL.md`), in 141 of 308 files. Any path check on issue bodies resolves
  against the skill roots as well as the repository root.
- **Many gone path items are not paths.** Of the 777 backticked path items in
  the 308 issues, 138 read gone. Of those, 59 are leading `./` (2), starting
  `/` (19), globs (23), `<…>` placeholders (10) or bare extensions (5); 79
  are bare file names and `scripts\lint.bat`-style tokens. In all, 14 issues
  read gone or partly gone only because of such items (2c6a, 52ef, ebd9,
  1c9d, a23a, bd69, 42fc, d45c, 0d6c, aeed, 229c, 11db, 6aa8, f327). A `gone`
  verdict on a path item is checked by eye before it counts.
- **Some gone quotes are alive once split.** 10 of the 189 gone quote items
  are alive once split at their ellipsis `…` and stripped of edge
  punctuation, across 8 issues (issue-29bf read gone for a two-fragment quote
  whose fragments both sit on one line of `roles/kanri.md`).
- **A quote of missing text traces to the wrong commit.** For a quote of text
  an issue says is *missing*, the traced removing subject can name the commit
  that caused the gap, not the one that closed it (issue-a1a7).

## The git calls behind a trace

- `git ls-files --with-tree=main` printed 685 paths on the triage branch and
  `git ls-tree -r main` 684: `--with-tree` unions the index. A listing of
  `main`'s tree reads `ls-tree`.
- `git log -n 1 --format=%s --name-only --pickaxe-regex -S'<words joined by \s+>'`
  runs in about 0.3 s on this host's git, prints the subject, a blank line,
  then the paths, and honors `\s`.
- Without `--pickaxe-all`, that `--name-only` list is already filtered to the
  files that held the string, so the first name line is a file that held the
  quote (probed in a scratch repository by a quality reviewer).

## Provenance and clusters at the first triage

Baselines the next triage compares against, measured before the triage
moved anything:

- 71 of 99 resolved issues carried no `Source:` line.
- 106 of 190 shoroku-sourced issues carried no `S-n`.
- 84 of 336 issues were attributable to a finder through a ledger row — the
  figure the by-finder counter came from (beside issue-b22f).
- The substring cluster rule moved 75 of the 240 note-placed issues (above).

## What the instrument finds, and how rarely it finds a subject

- **Wall time and agreement.** The instrument ran in 60.8 s on the real pile
  (684 sequential `git show` reads; loading the tree alone took one reviewer
  about 13 s). Its cluster agreement with the working note was 162 of 240
  (67.5%); the working note's staleness probe read 45 of 48 gone or partly.
- **A traced subject is rare.** The rows every one of whose gone items reads
  `no commit found` were 97 of the 221 rows of rounds 1 to 4b (22 of 50, 17
  of 40, 16 of 39, 13 of 28, 19 of 32, 10 of 32), and only round 4b had a
  Landed item (2). The Landed rule rests on a handful of items; whether a
  fuzzier trace is worth building reads its count from here (issue-d0a3), and
  the default for such rows is issue-d0d7.

## Inbound links: the instrument reads paths, the tree cites ids

The instrument's `inbound` column was `—` in all 308 rows: a fixed-string
grep of all 308 paths over the living set confirmed zero path mentions.
Living documents cite issues as `issue-<id>`, about 1,900 times, which the
instrument does not count by design. So:

- `—` must not be read as "nothing references this issue".
- The repoint machinery the spec built for moved issues was never exercised
  on real data; a living document naming an issue by basename or relative
  path would not be found either (a wider basename grep found none).
- After the apply, one of the twenty moved issues was cited in a living
  document, only by id (`issue-e916`, twice in
  `docs/notes/tanto-consistency-checks.md`), and needed no repoint: the id
  still resolves to the file under `resolved/`. Id citations are the only
  kind the tree holds, and they survive a move without an edit.

## Two readings a round task needs: the breadth of a scene line, and an absence grep over the mechanisms

- **A broad scene line takes many issues.** Three broad scene lines (178d,
  19c1 and 1b75, then in scene exp-06b2) took six of round 3's issues, and the
  reviews moved none of them; the near misses (6620, fff8, d3f1) were the
  judgment the human is most likely to move. The sittings are where that
  breadth gets checked.
- **"The gap is absent on `main`" needs a grep over the mechanisms.** The
  rule was false twice in round 5: check 18 of
  `docs/notes/tanto-consistency-checks.md` already pinned the heading contract
  issue-e916 asked for, and the spawner already raised a notice on a blocked
  seat that issue-dff9 and issue-fd4b said nothing watched. The instrument
  cannot see it, since it reads an issue's quoted strings and paths, not the
  mechanisms that serve its want. A round task's Step 2 carries an absence
  grep over the consistency note, `spawner.js` and `boundary.js` before a
  Reason says a check or signal is missing.
