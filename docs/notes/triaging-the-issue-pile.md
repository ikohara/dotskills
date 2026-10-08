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

## The pile on 2026-10-07, and the order it moved

Read by Kikaku from `docs/issues/` on `main` after `tanto-feedback`'s close,
before it placed `roster-ledger` sixteenth:

- **The pile.** 372 open, 25 deferred, 125 resolved — 397 open and deferred
  against the 312 of 2026-10-03. Of the open: 1 high (issue-f07a), 153
  medium, 218 low. 138 were created on 2026-10-02 or later, by the five
  closes since the triage, and none of them was read by the triage.
- **Carriers.** The triage's `Assigned to` lines still stood on 56
  (`passage-check-hardening`), 3 (`09c2-upgrade`), and 1
  (`passage-plan-generation`). Of the 138 post-triage issues, 54 carried no
  carrier line at all; 19 read `Carrier: Kept.`; 7 named
  `passage-check-hardening`; 2 named `roster-ledger`; 3 named the hotfix
  lane; the rest were Kept with a file named. The rule that every close
  names a carrier is in no skill text (issue-af21).
- **The pile by title keyword**, first match wins, an upper bound (count /
  medium / without a carrier / created 10-02 or later): Kanri, ledger,
  roster, census, handover 122 / 48 / 115 / 49; Keikaku, plan, passage-check
  78 / 39 / 39 / 20; Jisso, batch, boundary, verdict 55 / 26 / 44 / 21;
  spawner, launcher, park, wake 42 / 13 / 41 / 25; Sekkei, spec, brief 33 /
  10 / 32 / 11; shoroku, close, kessai, shoki 17 / 7 / 17 / 6. The
  Kanri/ledger pile was the largest without a carrier and grew fastest — 49
  of its 122 in five days.
- **The liveness instrument**, run by hand —
  `node scripts/issue-liveness.js --out <dir> --ref main`, 87.6 s: alive 170,
  partly 155, gone 21, none 51. Of `roster-ledger`'s fourteen issues: alive
  9, partly 3, gone 1 (issue-b106), none 1. Of `09c2-upgrade`'s three: alive
  1, partly 1, gone 1 (issue-c3d1). Of the instrument's own `passage-check /
  plan instrument` cluster, 65 rows: alive 23, partly 26, none 16 — a quarter
  cite nothing the instrument can check. Both `gone` rows named here read
  `no commit found` on every item, the case issue-d0d7 warns about.
- **The finder counter**, `node scripts/issues-by-finder.js`:
  `run-owned-seats` sekkei 18, kanri 11, jisso 8; `tanto-feedback` jisso 3,
  sekkei 2, kanri 1; `tanto-issue-triage` kanri 6, sekkei 6, jisso 3.
  Finders other than Sekkei rose, which was `tanto-feedback`'s return
  condition; that topic had closed, so the condition is spent and is
  recorded only.
- **The `maxBuffer` hotfix was owed that day.** The order of 2026-10-06 had
  taken it as landed; `passage-check.js` carried no `maxBuffer` on
  2026-10-07. It landed the same day in the hotfix lane on `main`, before
  `roster-ledger`'s Sekkei was spawned, and issue-473e is resolved.

Why `roster-ledger` went sixteenth: the reason it waited for
`run-owned-seats` (the roster's status words and the census's rules were
about to change) was spent at that topic's merge, and the order's own
criterion — a chore the human pays by hand in every run goes first — then
pointed at the roster, whose one high issue (issue-f07a) was a roster write
that had failed three times and locked the human out of Kanri, and whose
pile was the largest without a carrier.

**The 21 `gone` rows, hand-closed at `roster-ledger`'s close (2026-10-08).**
The instrument run again on 2026-10-08 (58.7 s) read alive 169, partly 155,
gone 21, none 51; the pile on `main` was 371 open (1 high, 152 medium, 218
low), 25 deferred, 126 resolved, and 55 of the 138 post-triage issues carried
no `Carrier` or `Assigned to` line by that read. Every one of the 21 `gone`
rows read `no commit found` on every item — chat lines, harness text,
another repository's words, generic paths — so each was read against the
tree and the decisions by hand. Six were closed:

- issue-127d — superseded: every seat is spawned by the run
  (decision-7a19), and the spawn request carries the family from
  `sessions.sekkei`.
- issue-29bf — superseded: `tanto` follows a Kanri handover to the successor
  with nothing typed, and the spawner refuses a second Kanri.
- issue-cabf — answered by decision-ca6d: a plan-mandated defect goes to
  the fix wave.
- issue-c204 — covered: the dispatcher verifies the file, not the reply, and
  the apply now runs in shoki's seat with Kanri's landing checks reading the
  tree.
- issue-235b — the rule is in `docs/notes/bash-tool-and-script-pitfalls.md`
  and `docs/notes/authoring-a-passage-plan.md`; the fourteen occurrences are
  in frozen documents.
- issue-b4e7 — not a defect: its figure joins the fix-wave section of
  `docs/notes/authoring-a-passage-plan.md` as a second reading of dispatch
  size.

Fifteen were kept: issue-b106, issue-264d, issue-42fc, issue-c3d1,
issue-cafd, issue-f697, issue-85e5, issue-cd67, issue-05ee, issue-abf2,
issue-aeed (stays deferred), issue-0e74, issue-512e, issue-b7e1, and
issue-d0d7. The hand-close is one more data point for issue-d0d7: rows whose
every item reads `no commit found` are read one by one, closed when a design
or a note now carries the matter, and kept otherwise — six of 21 here.
