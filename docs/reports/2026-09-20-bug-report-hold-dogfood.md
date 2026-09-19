# The bug-report-hold dogfood

This report covers the `bug-report-hold` plan's Task 17 — a whole-tree sweep
of the old values the plan's spec names as contradicted, and a re-run of
every check "How a batch is verified" lists in the plan itself, plus the
three consistency checks Task 16 re-pinned. It preserves, in a committed and
tracked location, a summary of a record that otherwise exists only under the
untracked `.tanto/bug-report-hold/` tree: `old-value-sweep.md`, which nothing
commits and which will not survive the eventual cleanup of that topic
workspace.

## The old-value sweep

Task 17 folded the 24 Markdown files the plan's spec table names (`SKILL.md`,
`README.md`, every role file, every template, `skills/shoroku/SKILL.md` and
its `README.md`) to single-space copies on a scratch tree, exactly as the
spec's own table was built, and swept all 42 needles the spec's "Old values
this plan contradicts" table lists (including the two this task itself rules
on, `the three counts` and `a Kanri in another repository is where`). Full
raw output and the per-hit disposition live at
`.tanto/bug-report-hold/old-value-sweep.md`.

Thirty-eight of the 42 needles returned `NONE`, as expected. Four returned a
hit — one more group than the brief's own stated expectation anticipated:

- `Kanri's filings` — one hit (`SKILL.md`), the spec's own "kept" disposition:
  the new Hosa row keeps the phrase after "the bug intake."
- `` four `##` headings `` — one hit (`skills/shoroku/SKILL.md`), **not**
  anticipated by this task's own dispatch. Investigation (`git log -p` on the
  file) shows the phrase is this plan's own new, correct text — Task 4's
  commit replaced the file's prior "three `##` headings" with "four `##`
  headings" — and the spec's Old-values table bundles this string into the
  same row as `three groups`/`in three groups` even though, unlike those two,
  its post-plan form is identical to the swept string. It stays, correctly.
- `the three counts` — **four** hits, not the three O17.1 declares
  (`SKILL.md`, `roles/kanri.md`, `templates/kanri.md`). The sweep finds a
  fourth, previously unlisted site in `roles/hosa.md`, invisible to an
  unfolded `grep` because the phrase wraps across a line break there. It
  carries the same off-by-one gap O17.1 already names (four item groups now,
  not three) and the same disposition — it stays, routed to the close's own
  `Recommended fix` the same way O17.1 is.
- `a Kanri in another repository is where` — one hit (`roles/kanri.md`), the
  plan's own new text (spec 3.6), deliberately not declared as an `O` block
  because `lint` forbids a task from declaring its own new text as an old
  value.

## Verification re-run

Every command in "How a batch is verified" sections 4, 5, and 6 was run
again against the landed tree, plus Task 16's three re-pinned checks (the
intake check, check 18, check 19) from `docs/notes/tanto-consistency-checks.md`.
Every value held clean: section 4's ten content-grep blocks each printed
their expected numbers and exit status; section 5's real YAML load over
`docs/issues/open/*.md` and `docs/issues/deferred/*.md` exited `0` with
nothing printed; section 6's `unittest discover` on the frontmatter hook's
own test file printed `OK`; and all three of Task 16's checks matched the
note's own stated expectations exactly (values recorded below, under
Measurements).

## Measurements

- **The retrofit's four kinds.** Task 1's own recorded run: `inbox: 13`,
  `shoroku: 105`, `hotfix: 0`, `session: 116`, summing to `234` — matching
  the total file count under `docs/issues/open/` (219) and `deferred/` (15).
  The brief's own estimate for `inbox` was "about 15"; the actual run found
  `13`, close to but not exactly matching that estimate.
- **The inbox's untriaged count, measured now.**
  `grep -L 'Outcome — \(issue\|fix\|redirect\|kaiseki\|relay\|dismissed\)'
  .tanto/inbox/*.md | wc -l` run fresh at this task's own execution returns
  `39`, against `60` total copies (unchanged from the spec's own count — the
  retrofit normalizes existing Triage text, it does not add or remove
  copies). The spec's own 2026-09-19 measurement was `49` untriaged of `60`;
  the drop is not tasks triaging reports — nothing in this plan does that —
  but Task 1's own `normalize_inbox()` step rewriting 11 copies' Outcome
  lines from non-canonical forms (e.g. `hotfix`, `issue-<id>…`) into the
  canonical form (`fix`, `issue`) this bullet's own grep pattern matches;
  those 11 copies' outcomes were already effectively decided and simply
  read as untriaged to the old check until the retrofit normalized their
  wording. This `39` is the count going into the topic's own close, whenever
  that runs — not the count after it.
- **The consistency note's edited checks**, each printed value beside its
  stated expectation, all matching:
  - The intake check: three lines, each `-> 1 1`
    (`SKILL.md`, `roles/kanri.md`, `roles/hosa.md`), matching "three lines,
    each ending `-> 1 1`."
  - Check 18: `1 1 1 1 1 1 1 0`, then `1` and `1` (the two case-insensitive
    counts), then `0` — matching the note's full stated expectation exactly.
  - Check 19: `1`, `7`, `1`, `3`, `1`, `1`, `5`, `5`, `1` — matching "`1`, a
    non-zero count, `1`, then non-zero on the three citations, then `5`, `5`,
    and `1`."
- **The `bug-report:` counts, and which one moved and when.** A16.3
  (`grep -cF 'bug-report: <absolute path>' skills/tanto/SKILL.md`) and A16.4
  (the same phrase in `skills/tanto/templates/bug-report.md`) both read `1`
  now, unchanged from the spec's own pre-plan measurement and through this
  task's own boundary. A16.2 (`grep -cF 'bug-report:' skills/tanto/SKILL.md`,
  the bare form) reads `2` now — moved from the spec's pre-plan `1`, but at
  Task 7 (batch B), not at Task 16 or here: Task 7 added a `.tanto/sent/` row
  to the Artifacts table whose Readers cell names the `bug-report:` line a
  second time, three batches before Task 16 re-pinned the note's expectation
  to match. The note's own L578 (the bare count) was re-pinned by Task 16;
  its L594-595 (the two `bug-report: <absolute path>` occurrences) were
  deliberately left unedited, because their "new" values, measured against
  this plan's own new texts, equal the old ones — `SKILL.md`'s new Messages
  paragraph and the new `templates/bug-report.md` each still name
  `bug-report: <absolute path>` exactly once, as the old ones did.
- **What only the topic's own close will know.** The inbox's untriaged count
  after the topic's own close, how many of that close's items went `fix`,
  and whether the second commit (`fix: text corrections from <topic>'s
  close`) exists are not knowable at this task's own execution. They are
  recorded in `.tanto/bug-report-hold/kanri.md`'s Progress section at the
  close itself, by whoever runs it — Kanri, or Hosa under a `close:` line.
