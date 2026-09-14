# tanto consistency checks

Every mechanical check on the `tanto` skill, in one place, so that a plan which
edits `skills/tanto/` runs the whole set as one task instead of restating the
commands. Run them from the repository root, in the order below, and record
each command's output: the output is the deliverable of a consistency pass.

**Run these commands as written.** A paraphrase is where a consistency pass
loses its own reliability, and two measured cases say why. `grep -n '[ \t]$'`
substituted for check 9's `grep -c '[[:space:]]$'` matches every line ending in
the letter `t`: inside single quotes a bracket expression reads `\t` as the two
characters `\` and `t`, not as a tab. And `**Output**` substituted for a
recorded baseline's `Output:` heading finds no blocks at all, which reads as
"no baseline exists" rather than as a typo. A divergence between a command here
and the tree is this note's problem or the tree's; a divergence introduced in
transcription is neither, and it looks exactly like a result.

Three moments in a `tanto` plan call for the same extraction method —
every fenced block of the plan pulled into a scratch tree, diffed
against `HEAD`, and these commands run there: Sekkei's plan review
before the plan is committed, Jisso's pre-flight before its first task,
and the conductor's pre-flight at each boundary before a batch is
accepted. No role file schedules them on its own; a plan that edits
`skills/tanto/` schedules them by naming this note in its verification
section.

An absence check — check 7 below — is the one kind a new passage breaks simply by adding text, not by omitting it, so a plan that schedules only a subset of this note's checks must still schedule the absence checks: one plan scheduled checks 1, 2, and 5 and broke check 7 without ever running it.

A plan that carries passages rather than whole files — an anchor line, the
old passage, the new passage, for each edit — has no extracted tree. Its
alignment check is the diff of each touched file against the merge base,
whose hunks must be exactly the plan's passages, and its lint runs on the
tree after each task, which is the file the hook will see. Checks 1 to 8 run
on the tree as for any plan; of check 9, the extracted-tree lint does not
apply to such a plan, and the trailing-whitespace and final-newline sweep
runs as for any plan.

Six things a passage plan's pass needs that a whole-file plan's does not.

1. **The diff form.** `git diff "$(git merge-base main HEAD)" -- <file>`
   compares the working tree with the merge base, so it is right both before and
   after a task's commit. `git diff main...HEAD` compares commits only and
   misses an uncommitted edit; the two-dot form differs again. A pre-commit
   verification step built on the three-dot form under-reports silently.
   A whole-tree check's baseline belongs on the plan's own branch, or names
   the branch it was measured on and states no count: the
   requirement-extraction spec baselined its `skills/tanto` name-only diff on
   the sibling branch `review-brief` while that plan's batches were landing,
   and the count it stated went three, four, five within a day.
2. **The hunk count is a task-time check, never an invariant.** `git diff`
   merges two changed regions into one hunk when at most six unchanged lines
   separate them — three lines of context on each side; five and six give one
   hunk, seven gives two. A plan states the count it expects at each task and a
   reviewer reads the hunks. A **removed-line** count is not a check either: a
   replacement whose new passage repeats the old one's first line leaves that
   line as context, so a five-line old block can show three removed lines. Only
   the hunk read decides.
3. **Hunk order is file order, not task order.** A passage written by a late
   task can sit above passages written by an early one, so an attribution by
   hunk index is wrong and no count can catch it. Match each hunk to a passage
   by its text.
4. **Reconstruct-and-compare**, the alignment check that replaces the extracted
   tree. Either replay the plan's old/new pairs onto the merge-base file and
   diff the result against the tree, or classify every `-U0` added and removed
   line against the union of the plan's blocks and require zero uncovered lines
   — the second form needs no knowledge of each passage's shape. One trap: an
   insertion's new block omits its anchor, so a naive replace drops it.
   **Both forms are `skills/tanto/scripts/passage-check.js` now** — `replay`
   is the first and `diff` the second — and the script lives in the
   repository rather than in a session's scratchpad. That was the defect: on
   the context-cost run the dry run's application script was already gone by
   the final boundary, which is the boundary that most needs it (issue-7481).
   The second form needs only the plan and
   `git diff`, and it measured 443 added lines with **0 unaccounted** across
   thirteen files. Its one caveat is that a plan states some replacements in
   **prose** rather than in a fence — a licensed heading rename, an old line
   named in a step's sentence — so a fence-only classification must expect a
   small number of removals it cannot cover and check each by hand; there were
   three.
   Reconstruction is the only **complete** check a passage plan has, and the
   reason is that a boundary's set of presence greps cannot be complete: a
   needle proves the line it sits on and says nothing about the rest of the
   block. Of the six bullets in the section the requirement-extraction plan
   added, four carried no needle at all, so a body mangled the same way in the
   template and in the installed copy would have passed every grep — and the
   template-versus-copy diff would have passed too, since it compares those two
   with each other and not with the plan. Where a plan writes the same passage
   into a template and an installed copy, that diff is nonetheless the one check
   that binds the pair: a fix applied to one side alone passes every content
   grep and fails only there.
5. **A review method for the plan itself.** Apply the passages to copies of the
   files and re-run markdownlint with the repository configuration plus every
   string this note counts. That is the passage-plan analogue of check 9's
   extracted-tree lint, and one script settles what a spec otherwise asserts by
   reading. An insert passage states which end carries the blank line its destination needs — `insert after` opens with the separator, `insert before` closes with it — and this lint must run on the *applied* copy of each file the plan writes, not on the plan's own fenced blocks: one plan's missing trailing blank line failed MD022 only on the applied tree, and nothing in the grammar, the anchors, or the presence greps could see it, because earlier passes had never built an applied tree to lint at all.
6. **A flaw in the spec's own block is never a task-level edit.** In a passage
   plan the spec's bytes reach the tree verbatim, so a wording or wrapping flaw
   arrives with them — and the task that carries it is the one place it cannot
   be fixed, since an edit outside the passage breaks the invariant above. Such
   a flaw is a whole-branch-review item.

**A pre-edit anchor sweep, once, before the first task.** Extract every anchor
check the plan states — the steps whose own wording says "before the edit" —
run them against the tree, and compare each with the value its step states. It
is one command and it converts the plan's "measured `<date>`" claims from an
assumption about authoring time into a measurement at execution time: 64 blocks
before one batch and 31 before the next, all matching, on the context-cost run.
It is the dry run's complement — the dry run proves the edits **apply**, this
proves the tree has not **moved under them** since the plan was written. Re-run
the same extraction after the batch against each step's stated post-edit value,
remembering that an anchor which is a passage's unchanged opening still returns
`1` and only one that the new passage wholly supersedes inverts to `0`.

**Label a shared verification checklist per batch.** A plan cut into batches
whose "how a batch is verified" section is one list is a final-batch checklist
run at every boundary: about ten of one plan's twenty-two bullets named files a
later batch writes and could not pass at the first boundary. Either mark each
bullet with the batch it binds at, or make the Batches table's per-batch row
the authority for the early boundaries and say so.

**Splice-and-compare, before a fix-wave list is dispatched.** A list of passage
edits can pass every command it specifies — old text present, new text absent,
line numbers holding — and still be wrong, because none of those commands reads
the replacement joined to the unchanged line that follows it. So for each item,
flatten the old text, splice in the item's stated change with `sed`, and
word-diff the result against the flattened new block; equality means no word was
gained or lost beyond the intended change. The failure this catches has a
mechanical cause: a replacement that widens a line inside a wrapped block
already at the file's ceiling pays for the width with a word, and the narrower
the ceiling the likelier it is. A fix that touches one line and leaves its
neighbours alone avoids it structurally.

**An absence check must be falsifiable at repository scope.** Pair every
"the new form is present" check with a `grep -rn` over the skill that must print
nothing, so the pass decides that the old form is gone everywhere rather than
that the new form arrived somewhere.
Once the spec and the plan are committed under `docs/superpowers/`, an absence
grep whose scope includes `docs` excludes that directory —
`grep -rn --exclude-dir=superpowers '<old text>' skills docs` — because both
documents quote the passage they remove, and the pass would otherwise report
its own quotations.

**That exclusion is not enough, and the wider scope usually is not wanted.**
The same plan's write-out lane produces more quotations of the text it removes:
T1, T2 and every exit shoroku write ADRs, design entries and issue resolutions
under `docs/decisions/`, `docs/design/` and `docs/issues/`, and a record whose
subject is "we stopped saying X" **must** quote X. So a sweep written over
`skills docs` goes red on a clean skill by construction, and it did — two of
the context-cost plan's eight absence sweeps exited 0 with three hits, all of
them in an ADR and a design entry written by that plan's own shoroku. The
invariant they existed to prove held: the same greps over `skills/` alone
exited 1. **State the scope per sweep.** Scope it to `skills/` when the claim
is about the skill; widen it only when the claim really is that no document
anywhere still asserts the old rule, and then exclude the write-out tree as
well as `docs/superpowers/`.

The index stores LF throughout, but the working tree is mixed file by file —
some paths are checked out with CRLF and some with LF. So every command below
that flattens a file strips CR first (`tr -d '\r'`), unconditionally: it is
required for the CRLF files and a no-op for the rest, and a flatten that omits
it returns a plausible `0` rather than an error. Never decide a line-ending
question with a grep for a control character, which in this shell matches every
line of an LF-only stream and so returns the line count; settle it with byte
counts instead — `git cat-file -s` against the piped byte count, or `od -c`.

A flattened `grep -cF` counts lines, so it returns `0` or `1`: it pins the
presence of a phrase that may wrap, never a per-file occurrence count. Count
the occurrences of a line that does not wrap with a raw `grep -cF` on the
file. And flatten the **needle** the same way you flatten the file, which is
why a heredoc needle is written as one physical line: `grep -F` splits a
multi-line pattern into OR'd alternatives, so an unflattened multi-line needle
against a flattened file is a weak any-line match rather than a substring test,
and returns `1` on text that does not contain the passage at all.

**`grep -c` prints `0` and exits 1, and a Verify step is read by its exit
code.** The count on stdout and the exit status carry different news: a
`grep -c` that matches nothing prints exactly the `0` an absence check wants
and still fails, so a step whose stated expectation is "prints 0" reads as a
failure to any harness keyed on exit codes rather than on output. Write such a
check negated — `! grep -q <needle> <file>` — or compare the printed count
explicitly, so that the step's success and its exit status are the same fact.
Measured 2026-09-11; the kisou-refresh plan's frontmatter guard is written that
way.

Two `insert after` blocks that name the same anchor land in the **reverse**
of plan order: `replay` applies passages in the order they are written, and
each insert-after re-finds the anchor and inserts directly after it, so the
second block is placed above the first. A required order at one anchor is
therefore one block, not two — the kisou-refresh plan folded the spec's P6
and the second half of its P7, which share an anchor and must read in that
order, into a single `P4.6` for exactly this reason (measured 2026-09-11).
`lint` does not warn about two insertions sharing an anchor; the author has
to notice.

That mixture is an artifact, not a property, and a plan must not encode it as a
table. `core.autocrlf=true` is set globally on this machine and `.gitattributes`
gives `.md` only `* text=auto`, with per-file `eol=` for `*.sh` and `*.bat`
alone; every `.md` blob is `i/lf` in the index. So which files are checked out
CRLF depends on how each happened to be written here, and **a fresh Windows
clone checks out every `.md` as CRLF**. Any list of per-file endings is a
snapshot of one working tree. The deciding command is `git ls-files --eol <file>`
run before and after an edit: it must show the same `w/crlf` or `w/lf` as
before, and never `w/mixed`. That command pads its columns with **two** spaces
before `attr`, so a plan quoting `i/lf w/crlf attr/text=auto` with single
spaces reads as a mismatch against its own expectation; quote the shape, not
the spacing.

`grep` and `sed` strip CR on input; `diff` does not. So an anchored grep over a
CRLF file needs nothing, while a comparison of two files needs
`--strip-trailing-cr` — or `tr -d '\r'` on both sides — the moment one side has
been through a `sed` pipeline, which emits LF. Without it the diff reports every
line, which reads as total divergence rather than as a line-ending artifact.
This is what makes a template-versus-expanded-copy comparison work at all.

**Truncated output is not a measurement.** A pre-check that pipes `grep`
through `cut -c1-120` truncates the longer of two paths mid-line, and the
result looks exactly like a wrapped sentence; a batch prompt of 2026-09-09
described a template as wrapping a sentence across two lines on that basis,
when both files held it on one. The conclusion drawn happened to survive, but
the stated fact did not, and a later reader would have taken it on trust. A
pre-check states the command it ran, and a command that truncates has not
measured the thing it printed.

They also earn a run after a superpowers upgrade, because checks 4 and 5
compare text the skill quotes against the plugin's own source. A failure is one
of three things — a typo in the skill, a file a plan forgot, or a change in
superpowers. The third is never repaired by rewriting the quote; it is reported
as a ruling needed.

Three more traps, all of them met while running these checks against a plan
that edits the skill passage by passage.

**A pre-edit check whose anchor is the old passage reads as a failure once the
edit has landed.** Some replacements are anchored on the very line they
replace — a counted bullet, a table's first row, an Expected paragraph. Before
the edit the anchor returns `1`; after a *correct* edit it must return `0`. A
plan states that shape in the step so the zero is legible, and a boundary that
re-runs a whole batch's verification blocks mechanically must expect exactly
those to invert: in the review-brief run, 6 of 51 re-run blocks did, and all
six were this case. Read the matching new-passage check beside it — if that one
returns `1`, the replacement landed.

**Re-wrapping a passage can split a code span across a line break.** The result
is valid CommonMark and passes markdownlint, and it silently defeats the
one-line rule the counted strings in check 6 depend on — a raw `grep -cF` for
`` `committed <subject>` `` returns `0` when the backticks straddle a newline.
After any wrap-column change, sweep for lines carrying an odd number of
backticks.

**A hunk count is meaningless without the context width that produced it, and a
check two files must agree on is one block cited, not two copies.** The same
run measured `1/3/3/4/5/6` at `-U3`, `1/2/2/5/2/3` at `-U10` and `1/3/5/7/7/9`
at `-U0` for one set of files; and the raw sweep it ran at a boundary was this
note's check 6 block copied into a plan, where the copy and the original then
diverged by one path. State the width with the count, or state no count and
read the hunks; and cite this file's block rather than duplicating it.

**A heading-stability check puts the working tree on the left.** Written
`diff <(grep '^#' <file>) <(git show main:<file> | grep '^#')`, an *added*
heading prints with `<` and a `d` — `5d4` — and the `&& echo "no difference"`
does not fire, because `diff` exits 1. That is the expected shape, not a
failure, and a plan states the literal output so a reader does not "fix" it by
swapping the sides.

**A check whose remedy is a revert must scope its path set to the task's own
outputs, never a whole directory.** A plan step of 2026-09-09 expected
`git diff --name-only "$(git merge-base main HEAD)" -- docs` to list exactly
the four files its task wrote, and told the implementer to revert anything
else. On its own branch that was impossible: the same branch carried the plan's
spec and plan under `docs/superpowers/` and the conductor's write-out under
`docs/issues/` — eleven paths from earlier commits — and obeying the remedy
would have destroyed committed work. The check that isolates a task's own
effect is `git status --porcelain` before its commit; a merge-base listing
answers a different question and needs the branch's other traffic named.

**The installed copies inherit the templates' ragged wrapping, and it stays
ragged.** A passage written for a template whose directory names are `{{…}}`
variables is narrower once expanded, so the copy's lines look under-filled. Do
not re-wrap them: the template-versus-copy diff compares byte for byte, and a
tidier copy is a broken one.

**A verification-only task inverts the reviewer's standing instruction.** When
the deliverable *is* the recorded output of checks, a reviewer told not to
re-run the tests verifies nothing at all — the record is the claim under
review. Tell that reviewer to re-run, and judge the record on whether it reads
as captured or reconstructed. Three tells, from a run that was genuine: an
incidental count no reconstruction would land on (a diff's line total), the
exact padding and ordering of a tool's own output (`(no files to check)` beside
each skipped hook), and a result that is *not* the tidy one — a step whose
correct outcome is a non-zero exit and a missing "no difference" line, which is
the easiest place in a plan to fake a pass. Deferred minors in such a report
are triaged mechanically rather than case by case: `git check-ignore` and
`git ls-files` settle in one command whether a finding touches a tracked byte
at all.

**When the finding is a wording defect, the re-review judges the wording.**
Matching the changed words against the ruling verifies only that an edit was
made, not that the replacement is right. A fix wave of 2026-09-09 turned "a
statement that passes neither" into "fails either" in a rule whose two tests
are conjunctive; the check that mattered was reading the new clause as the
contrapositive of that conjunction, which no diff comparison performs.

**A self-check by regex over prose systematically misses what it was built
from.** After correcting two miscounts, an implementer re-checked its own work
with a pattern assembled from those two instances; it could not match
`three "missed" passages`, where a quoted word sits between the numeral and the
noun, and on that basis the report certified itself clean while still carrying
the defect. The pattern that found the instances cannot prove their absence.
The remedy that worked was not a better pattern but a **named unit**: fixing by
ruling that passages were six and files were four, and that a list's length
counts nothing, ended a miscount two rounds had failed to end. The original
error was a list of three bullets carrying four passages — an ambiguous unit,
not a typo, which is what a miscount in prose usually is.

**The instruments are extracted, never retyped.** A command a plan ships inside
a file — the reading pipeline in `SKILL.md`, the frame command in
`roles/kanri.md` — is pulled out of that file with `sed`/`awk` and run, so that
a transcription error cannot pass by producing the right answer from a
different program. Both reproduce their documented figures this way: the frame
command extracted from the role file is sixteen lines and prints 631 lines with
4 markers on one reference plan and 497 with 7 on the other, and the reading
pipeline extracted from the contract prints 84 wake-ups and 1 compaction on the
8.6 MB transcript a JSON parse agrees with exactly. A **read-only** review seat
cannot run `scripts/lint.sh` at all — four of its hooks rewrite files — so
check 9's `markdownlint-cli2` from the pre-commit cache, invoked without
`--fix`, is that seat's substitute; it served twice on the context-cost run.

**A sweep proves what it greps for, which is less than it appears.** Three
limits, each measured. A sweep for the terms a plan **introduces** is not a
sweep for the prose those terms **contradict** — the one instance in the
context-cost run, a column list enumerated without the column the new protocol
keyed on, was found by a task reviewer and by no instrument of the plan
(design-4807 records the table-drift rule this belongs to). A frame command
that does not track fences resets on any `##` heading line and printed 1746
lines with
37 markers, because passage plans quote headings inside fenced blocks; close a
fence only on the same backtick count. And write the sweep's terms **first** and
the "where each change lives" table from them, not the reverse: one spec's table
needed the sweep to make it honest twice, at nine quoting locations and then at
four terms.

**How a dispatch is worded changes what comes back.** Four things paid, all
measured on the cheapest tier or on a single seat. Telling an implementer *why*
an expectation may be unsatisfiable — and that the right response is to keep the
mandated text and report rather than bend either — produced the right behaviour
three times out of three on `sonnet`, for four sentences in the prompt. Telling
a reviewer of a **verification-only** deliverable to *re-run* the checks rather
than read the report of them is visible in what it does: that reviewer
re-derived a note's counts and a thirty-two-number sequence from the tree.
Telling a re-reviewer to judge the **wording** against the finding, not only the
diff, changed what was checked on all three items it was applied to — one was
verified against a cost argument in two other files, one by going to look for a
third writer of the same cell, one by cadence against its neighbours. And a fix
wave takes **one dispatch, not one per finding**: eight items across six files
landed in one dispatch and one commit, with the batch prompt itself serving as
the brief because it already carried every old and new text verbatim, so no
transcription seam existed. Pair that with the conductor pre-checking each old
text in the tree before dispatch — one grep per item — which is what makes
"report a mismatch rather than paper over it" a real instruction instead of a
hopeful one.

**Two traps of this host.** Set `PYTHONIOENCODING=utf-8` for any Python that
prints a plan's text: the default here is cp932 and a single em dash kills a
measurement script mid-run. And the SDD workspace under `.superpowers/sdd/`
and tanto's own under `.tanto/` are **untracked** — each carries a
`.gitignore` of `*`, nothing under either has ever been committed — so the
repository's "no commit hashes, no user-specific paths in tracked content"
rule does not bind a report or a ledger there. Two reviewers
independently read it the other way. The rule binds what a shoroku write-out
**lifts out of** that workspace into `docs/`, which is the check worth making.

Adding a check is an edit to this file.

## Versions these checks assume

- **superpowers 6.3.0.** The quoted sentences in checks 4 and 5 were taken from
  that release. Its cached skills are at
  `$HOME/.claude/plugins/cache/claude-plugins-official/superpowers/6.3.0/skills`;
  on Windows the same directory is
  `C:\Users\<user>\.claude\plugins\cache\claude-plugins-official\superpowers\6.3.0\skills`.
  When the cache is absent, read the installed skills by hand and record
  `superpowers 6.3.0, cache absent, checked by hand` with the results.
- **`shoroku` in this repository**, at `skills/shoroku/SKILL.md`.
- **Twenty-six skill files, thirteen of them templates**, as check 1 lists
  them.

These two numbers are a **structural count**, the kind design-4807 calls a
task-time check rather than an invariant: every plan that adds a template edits
four of them — this bullet, check 1's path list and its expected count, check
2's expected count, and check 3's map — and a plan that adds a script edits
the first three, since a script is not a template; a plan that adds one and
updates fewer leaves a check failing that nothing else will catch. A plan may
knowingly break them mid-run, as the context-cost plan broke checks 1 and 2
from its second task until its last; when it does, the batch that breaks them
says so and the batch that repairs them names the count it restores. This paragraph's scope is not limited to the two bullets above it: any count tied to the shape of a file is a structural count in the same sense, and check 6's per-file `idle` figures are one — the `O` sweep runs over this note as well as over the skill, so a removal task can silently invalidate an expectation written for the thing it removed. One task zeroed `notify_when_idle: true` while check 6 still expected two matching lines, and nothing caught it: the expectation lived in prose that no passage quoted and no `O` needle named.

## 1. Every file of the layout exists

```bash
ls skills/tanto/SKILL.md skills/tanto/README.md \
  skills/tanto/roles/kanri.md skills/tanto/roles/sekkei.md \
  skills/tanto/roles/keikaku.md skills/tanto/roles/jisso.md \
  skills/tanto/roles/kaiseki.md skills/tanto/roles/kikaku.md \
  skills/tanto/roles/hosa.md \
  skills/tanto/templates/roster.md skills/tanto/templates/kanri.md \
  skills/tanto/templates/roster-archive.md \
  skills/tanto/templates/kanri-handover.md \
  skills/tanto/templates/bug-report.md \
  skills/tanto/templates/batch-prompt.md \
  skills/tanto/templates/batch-report.md \
  skills/tanto/templates/kaiseki-brief.md \
  skills/tanto/templates/kaiseki-report.md \
  skills/tanto/templates/review-brief.md \
  skills/tanto/templates/kikaku-decision.md \
  skills/tanto/templates/agent.md \
  skills/tanto/templates/tanto.json \
  skills/tanto/scripts/passage-check.js \
  skills/tanto/scripts/passage-check.test.js \
  skills/tanto/scripts/reading.js \
  skills/tanto/scripts/reading.test.js 2>&1
```

Expected: all twenty-six paths listed, no `No such file or directory`.
Seven role files, thirteen templates, four scripts, the contract and the
skill's own `README.md`.

## 2. Every in-skill path named by the contract or a role file resolves

```bash
grep -oh 'roles/[a-z]*\.md\|templates/[a-z-]*\.md\|templates/tanto\.json\|scripts/[a-z.-]*\.js\|skills/tanto/[a-z/-]*\.md\|skills/tanto/[a-z/-]*\.json' \
  skills/tanto/SKILL.md skills/tanto/README.md skills/tanto/roles/*.md \
  | sed 's|^skills/tanto/||' | sort -u \
  | while read -r p; do
      if [ -f "skills/tanto/$p" ]; then echo "ok       $p"; else echo "MISSING  $p"; fi
    done
```

Expected: twenty-four `ok` lines — `roles/hosa.md`, `roles/jisso.md`,
`roles/kaiseki.md`, `roles/kanri.md`, `roles/keikaku.md`,
`roles/kikaku.md`, `roles/sekkei.md`, `scripts/passage-check.js`,
`scripts/passage-check.test.js`, `scripts/reading.js`,
`scripts/reading.test.js`, `templates/agent.md`,
`templates/batch-prompt.md`, `templates/batch-report.md`,
`templates/bug-report.md`, `templates/kaiseki-brief.md`,
`templates/kaiseki-report.md`, `templates/kanri-handover.md`,
`templates/kanri.md`, `templates/kikaku-decision.md`,
`templates/review-brief.md`, `templates/roster-archive.md`,
`templates/roster.md`, and `templates/tanto.json`, whose relative order for the
two roster paths is the locale's and is not part of this check —
and **no** `MISSING` line. A `MISSING` line is either a typo in the reference
or a file the plan forgot.

A count produced by a regex like this one moves with the text a plan writes, not with the files it creates: one plan's stated expectation for this check went 15 → 17 on the reasoning "the plan adds two files", when the value this check actually returns is 16. The wrong model survived a spec review, a dry run, and an adjudication before a run of the command caught it. State the count this check returns, not the arithmetic that produced it.

## 3. Every template is cited by the role that copies it

```bash
while read -r tpl reader; do
  if grep -qF "$tpl" "$reader"; then echo "ok       $tpl <- $reader"; else echo "UNCITED  $tpl <- $reader"; fi
done <<'MAP'
templates/roster.md skills/tanto/roles/kanri.md
templates/roster-archive.md skills/tanto/roles/kanri.md
templates/kanri.md skills/tanto/roles/kanri.md
templates/kanri-handover.md skills/tanto/roles/kanri.md
templates/bug-report.md skills/tanto/roles/kanri.md
templates/batch-prompt.md skills/tanto/roles/kanri.md
templates/kaiseki-brief.md skills/tanto/roles/kanri.md
templates/review-brief.md skills/tanto/roles/sekkei.md
templates/review-brief.md skills/tanto/roles/keikaku.md
templates/batch-report.md skills/tanto/roles/jisso.md
templates/kaiseki-report.md skills/tanto/roles/kaiseki.md
templates/kikaku-decision.md skills/tanto/roles/kikaku.md
templates/tanto.json skills/tanto/SKILL.md
templates/agent.md skills/tanto/roles/kanri.md
templates/agent.md skills/tanto/roles/sekkei.md
templates/agent.md skills/tanto/roles/keikaku.md
templates/agent.md skills/tanto/roles/jisso.md
templates/agent.md skills/tanto/roles/kaiseki.md
templates/agent.md skills/tanto/roles/kikaku.md
templates/agent.md skills/tanto/roles/hosa.md
MAP
```

Expected: twenty `ok` lines, no `UNCITED`. Eight of the twenty are Kanri's —
seven templates Kanri copies itself, plus the agent definition, which every
role renders at its start and which therefore takes one row per role. The
review brief has two readers because the document's author dispatches it:
Sekkei for the spec, Keikaku for the plan.

## 4. The superpowers and shoroku sentences the skill overrides still exist

Each line below is the distinctive sentence behind one row of
`roles/jisso.md`'s "What tanto overrides" table, plus the two files the role
files name by path. Shell state does not persist between tool calls, so set
`SP` in the same call as the greps. The task-reviewer-prompt line flattens the
file first, because that phrase wraps across a line break in the source; every
other line quotes text that already sits on one raw line, so a plain
`grep -cF` finds it directly.

```bash
SP="$HOME/.claude/plugins/cache/claude-plugins-official/superpowers/6.3.0/skills"
grep -cF 'Ensure the work happens in an isolated workspace' "$SP/subagent-driven-development/SKILL.md"
grep -cF 'Do not pause to check in with your human partner between tasks' "$SP/subagent-driven-development/SKILL.md"
grep -cF "delete this plan's workspace" "$SP/subagent-driven-development/SKILL.md"
grep -cF 'under "Rulings I made"' "$SP/subagent-driven-development/SKILL.md"
grep -cF 'Always specify the model explicitly when dispatching a subagent' "$SP/subagent-driven-development/SKILL.md"
grep -cF 'Five rounds maximum per task' "$SP/subagent-driven-development/SKILL.md"
tr -d '\r' < "$SP/subagent-driven-development/task-reviewer-prompt.md" | tr '\n' ' ' | tr -s ' ' | grep -cF 'Do not re-run the suite to confirm their report'
grep -cF 'Fix the root cause, not the symptom' "$SP/systematic-debugging/SKILL.md"
test -f "$SP/requesting-code-review/code-reviewer.md" && echo code-reviewer-present
grep -cF 'Direction?' skills/shoroku/SKILL.md
```

Expected, for the superpowers version named under "Versions these checks
assume": the counts `1 1 4 1 1 1 1 1`, then `code-reviewer-present`, then `1`.
**Any change in a count means superpowers or `shoroku` moved — not only a zero.**
A third line dropping from `4` to `2` is the overridden text moving, which is
exactly the drift this check exists to catch, and a "nonzero on every line"
expectation would wave it through. A version bump is expected to move these
counts: record the new ones here with the new version when it lands. Either way,
do not silently rewrite the role file — report which line changed.

## 5. The two verbatim quotes' pinned lines are present in every copy

```bash
SP="$HOME/.claude/plugins/cache/claude-plugins-official/superpowers/6.3.0/skills"
grep -cF 'that norms say you ask about first (a merge, a push to a shared branch, a' "$SP/subagent-driven-development/SKILL.md"
grep -cF 'that norms say you ask about first (a merge, a push to a shared branch, a' skills/tanto/roles/jisso.md
grep -cF 'that norms say you ask about first (a merge, a push to a shared branch, a' skills/tanto/SKILL.md
grep -cF 'Implementer subagents report one of four statuses. Handle each appropriately:' "$SP/subagent-driven-development/SKILL.md"
grep -cF 'Implementer subagents report one of four statuses. Handle each appropriately:' skills/tanto/roles/jisso.md
```

Expected: `1` on all five lines. The stop-classes line lives in three files —
the source, `roles/jisso.md`, and `SKILL.md` — and the four-statuses line in
two. This check pins one line of each quote per copy; whole-quote byte
identity is a plan's extraction-and-diff job, not this command's.

## 6. The strings the roles route on

A cross-role line needs **one full-string check per copy**, not a prefix. A grep
for the head of a line cannot tell the literal from the placeholder — the
reading line is spelled once, in `SKILL.md`'s `echo`, and every other file
carries `<reading>` instead, so a prefix grep for `transcript` matches both and
proves neither. Where a line is duplicated by design across files, pin each copy
by its own complete string: the Residency table header is checked byte for byte
in `templates/roster.md` and again in `templates/kanri-handover.md`, which is
what makes a drift between the two loud.

```bash
grep -cF '<kanri-address>' skills/tanto/templates/batch-prompt.md
grep -cF '<kanri-address>' skills/tanto/templates/kaiseki-brief.md
grep -cF '<kanri-address>' skills/tanto/SKILL.md
grep -cF 'kanri-address:' skills/tanto/SKILL.md
grep -cF 'kanri-address:' skills/tanto/roles/sekkei.md
grep -cF 'kanri-address:' skills/tanto/roles/jisso.md
grep -cF 'kanri-address:' skills/tanto/roles/kaiseki.md
grep -cF 'bug-report:' skills/tanto/SKILL.md
grep -cF 'exit-<role>' skills/tanto/SKILL.md
grep -cF 'exit-<role>' skills/tanto/roles/kanri.md
grep -c '^## Residency$' skills/tanto/templates/roster.md
grep -c '^## Shoroku candidates$' skills/tanto/templates/roster.md
grep -cF -- '- Kanri — ' skills/tanto/templates/batch-prompt.md
grep -c '| Written |' skills/tanto/templates/kanri.md
grep -cF 'nothing to commit' skills/tanto/roles/sekkei.md
grep -cF 'nothing to commit' skills/tanto/roles/kanri.md
grep -cF 'nothing to commit' skills/tanto/SKILL.md
grep -cF 'human-needed:' skills/tanto/SKILL.md
grep -cF 'the human by grant' skills/tanto/SKILL.md
grep -cF '| Role | Topic | Name [ref] | Since | Read at | Bytes | Records | Wake-ups | Compactions | Context | Batches | Plans | Noticed |' skills/tanto/templates/roster.md
grep -cF '| Role | Topic | Name [ref] | Since | Read at | Bytes | Records | Wake-ups | Compactions | Context | Batches | Plans | Noticed |' skills/tanto/templates/kanri-handover.md
grep -cF '| S-n | Source | Candidate | Destination | Adopted | Stage | Written |' skills/tanto/templates/roster.md
grep -cF '| S-n | Source | Candidate | Destination | Adopted | Stage | Written |' skills/tanto/templates/kanri.md
grep -cF 'bug-report: <absolute path>' skills/tanto/SKILL.md
grep -cF 'bug-report: <absolute path>' skills/tanto/templates/bug-report.md
grep -cF 'transcript=<absolute path|unavailable>' skills/tanto/SKILL.md
grep -cF 'compacted: <path>' skills/tanto/SKILL.md
grep -cF 'compacted: <path>' skills/tanto/roles/kanri.md
grep -cF 'confirmed: <path>' skills/tanto/SKILL.md
grep -cF 'confirmed: <path>' skills/tanto/roles/kanri.md
grep -cF 'cleared: <old name> → <new name>' skills/tanto/templates/roster.md
grep -cF 'decision: <path> received from <name>' skills/tanto/templates/roster.md
```

Expected, one number per line, in order: `2`, `1`, `1`, `3`, `1`, `1`, `1`,
`1`, `5`, `3`, `1`, `1`, `1`, `1`, `1`, `1`, `1`, `1`, `3`, `1`, `1`, `1`,
`1`, `1`, `1`, `1`, `1`, `1`, `1`, `1`, `1`, `1`. The fourth is `3` because
`SKILL.md` spells `kanri-address:` three times: the handshake section's
handover form, the Resuming section's resumed form, and the `<kanri-address>`
blank's own paragraph. The six `1`s at positions 20 to 25 pin the three
cross-file pairs — the Residency table header, the seven-column `S-n` header,
and the bug-report line — each copy once, so that a change to one copy shows
up as a mismatch. The Residency header carries the Topic column because the
roster does, and the two copies of it gain the column together or the pair
goes loud. The five after them pin the strings the reading and the compaction
rule route on: the handshake's `transcript=` blank in the contract, and
`compacted:` and `confirmed:` in the contract and in Kanri's role file. The
last two pin the roster's two new Events forms. The
`--` before the
`- Kanri` pattern is required: without it `grep` reads the leading `-` as an
option.

The line forms the new seats and the limit rule route on, each exactly once
in the contract:

```bash
for s in 'decision: <path>' 'chore: <one line>' 'chore: <what> — <paths> — slot: now | at the next boundary' 'slot-needed: <what> — <paths>' 'slot: now — commit and report' 'slot: at the next boundary' 'paused: <dispatch> on <family> — resets <time>' 'continue: <dispatch> — same model' 'exit proposal: <path> — <reading>' 'spec accepted: <spec path> — <reading>'; do
  printf '%s -> %s\n' "$s" "$(grep -cF "$s" skills/tanto/SKILL.md)"
done
```

Expected: ten lines, each ending `-> 1`. Two of the ten are `chore:` forms
and two are `slot:` forms, because each of those lines has a form the sender
writes and a form Kanri writes, and a prefix grep cannot tell one from the
other — the rule at the head of this check. These are the contract's copies
only; a role file that repeats a form is pinned where that file's own rows
are.

The five triage answers, each exactly once in the contract:

```bash
for s in 'triage: issue-<id>' 'triage: redirect — <one line>' 'triage: kaiseki requested' 'triage: hotfix — <commit subject>' 'triage: relayed as I-<n>'; do
  printf '%s -> %s\n' "$s" "$(grep -cF "$s" skills/tanto/SKILL.md)"
done
```

Expected: five lines, each ending `-> 1`.

The human-access request line, byte-identical in the contract and the four
role files:

```bash
for f in skills/tanto/SKILL.md skills/tanto/roles/kanri.md skills/tanto/roles/sekkei.md skills/tanto/roles/jisso.md skills/tanto/roles/kaiseki.md; do
  printf '%s -> %s\n' "$f" "$(grep -cF 'human-needed: <what the human must do> — <why no other way> — <where: this window>' "$f")"
done
```

Expected: five lines, each ending `-> 1`.

The `kanri-address:` obligation sentence, byte-identical in the three peer
role files once each file's line wrapping is flattened — the sentence wraps at
a different column in each file, so a raw `grep -cF` returns 0:

```bash
for f in skills/tanto/roles/sekkei.md skills/tanto/roles/jisso.md skills/tanto/roles/kaiseki.md; do
  printf '%s -> %s\n' "$f" "$(tr -d '\r' < "$f" | tr '\n' ' ' | tr -s ' ' | grep -cF "A message whose first line is \`kanri-address: <name> [<ref>]\` replaces Kanri's address from then on; if a send to Kanri errors, re-read the roster's first data row.")"
done
```

Expected: three lines, each ending `-> 1`.

The rule behind the last two blocks, since both exist for the same reason: a
line that must stay byte-identical across files is either kept on **one** line,
where a plain `grep -cF` pins it, or its check flattens the file first. A
wrapped line cannot be pinned by `grep -cF` at all — no raw line carries it, so
the count is `0` in every copy and the check silently pins nothing.

The authority triad, which the rule above does **not** cover. Rule 11, Kanri's
"When the plan lands" step 1, and Sekkei's Step 3 bullet each name the same
three sources of authority, but they are not byte-identical — the subject
differs by role:

- `SKILL.md` — "the plan's Global Constraints, Kanri's orders line, and the
  batch prompts"
- `roles/kanri.md` — "the constraints, your orders line, and the batch prompts"
- `roles/keikaku.md` — "the constraints, Kanri's orders line, and the batch
  prompts"

So no full-string check can pin all three. Pin the common substring instead, and
add the absence check that makes a number disagreement visible:

```bash
for f in skills/tanto/SKILL.md skills/tanto/roles/kanri.md skills/tanto/roles/keikaku.md; do
  printf '%s -> %s\n' "$f" "$(tr -d '\r' < "$f" | tr '\n' ' ' | tr -s ' ' | grep -cF 'orders line, and the batch prompts')"
done
grep -rn 'orders lines' skills/tanto/
```

Expected: three lines, each ending `-> 1`, then no output at all from the
`grep -rn` (it exits 1). Both halves can fail, which is the point. A plural in
one copy of a phrase meant to agree is invisible to every other check here: it
was singular in seven of eight occurrences across the skill, six task reviews
read the passage carrying the plural, and only a whole-branch pass that could
see all three copies at once caught it.

The review brief's notice, and the idle subscription no tanto line carries
any more, each on one line where it occurs, counted raw over every Markdown
file of the skill so that a stray copy fails the check:

```bash
for f in skills/tanto/SKILL.md skills/tanto/README.md skills/tanto/roles/*.md skills/tanto/templates/*.md; do
  printf '%s notice %s idle %s\n' "$f" "$(grep -cF 'review-ready: <document path>; brief: <brief path>' "$f")" "$(grep -cF 'notify_when_idle: true' "$f")"
done
```

Expected: `skills/tanto/SKILL.md notice 1 idle 0`,
`skills/tanto/roles/kanri.md notice 1 idle 0`,
`skills/tanto/roles/keikaku.md notice 1 idle 0`,
`skills/tanto/roles/sekkei.md notice 1 idle 0`, and every other line ending
`notice 0 idle 0`. The notice carries the document and the brief on one
line and waits for nothing, so its copies are the author that sends it and
the Kanri that receives it; the set of files carrying it is a structural
count in the sense of "Versions these checks assume", not an invariant, and
the batch that changes the set names the figures it restores. One column
counts the whole notice rather than two counting its halves, because a head
grep matches the literal and the placeholder alike. Every `idle` figure
reads `0` since 2026-09-10: no tanto line carries a subscription, the
`exit:` lines included (issue-d725). Any nonzero figure is a subscription
reintroduced, which is what this column now checks for.

The pass condition is that **every line carrying an `idle` field ends `idle 0`**, not that every line of the output does — most lines this check prints carry no `idle` field at all. A naive count of lines not ending `idle 0` over the whole output always reads as a failure: one run counted 48 such lines and read the tree as broken, when only sixteen lines carried an `idle` field in the first place and all sixteen ended `idle 0`. Filter to the lines carrying the field before counting.

A routing string is pinned **per copy**, and the number of copies changes when a plan gives the string a new home. After the tanto-workspace plan of 2026-09-12 the cross-role string `bug-report: <absolute path>` has four copies — `SKILL.md`, `roles/kanri.md`, `roles/kaiseki.md` and `templates/bug-report.md` — where the checks above pin two files. Extend the check as the copies grow: a pinned check that names fewer files than the string has copies keeps passing while the copy it does not name drifts.

The review brief's **form** check joins each wrapped point with its continuation lines before grepping for the point's tag, its `See:` and its `— If unanswered:`. Those fields belong to a point, not to a line, and most points wrap — so a line-based check fails every one of them and says nothing about the form.

## 7. The strings that must be absent

```bash
grep -rn '/rename' skills/tanto/
grep -rn -i 'four-session' skills/tanto/
grep -rn '<plan>' skills/tanto/
grep -n 'a rename observed' skills/tanto/templates/roster.md
grep -n 'uniqueness check, not an address book' skills/tanto/templates/roster.md
tr -d '\r' < skills/tanto/roles/kaiseki.md | tr '\n' ' ' | tr -s ' ' | sed 's/\*\*//g' | grep -o 'You do not commit'
tr -d '\r' < skills/tanto/roles/kaiseki.md | tr '\n' ' ' | tr -s ' ' | sed 's/\*\*//g' | grep -o 'never write under `docs/` yourself'
grep -nF 'Kaiseki itself never writes under' skills/tanto/roles/kanri.md
grep -rn 'skills/tanto/' skills/tanto/SKILL.md skills/tanto/roles skills/tanto/templates
grep -rnE 'subagents\.(implementer|reviewer|drafter|escalation)\b' skills/tanto
grep -rnE 'exit write.out' skills/tanto
grep -rn -iE 'sho[m]u|jos[h]u' skills/tanto skills/shoroku docs/notes
grep -rnE '#{3} Task' skills/tanto/SKILL.md skills/tanto/roles skills/tanto/templates
grep -rnE '\b[0-9a-f]{7,40}\b' skills/tanto/
```

Expected: no output from the first thirteen (each exits 1). The sixth and
seventh flatten the file first and strip `**`, because their pre-images
— `You **do not commit**` with its bold markers, and
``never write under `docs/` yourself`` across a line break — would never
have matched a raw line. The tenth through the thirteenth are the strings
retired when the seats and the kinds were recut, and all four are written as
regular expressions rather than as the literals they forbid, for two reasons
that hold permanently: the rejected-seat sweep runs over `docs/notes/` and so
over this file, and a standing check written into the file it checks must not
count its own text; and a plan that removes a string refuses that string in
its own new passages, so a literal here would fail the plan that installs the
check rather than the tree it checks. The tenth pins the four subagent keys
that are gone — `default` survives as one of the twelve kinds and is not
swept. The eleventh pins the retired wording for a session committing its own
exit shoroku. The twelfth pins the two rejected seat names, over the skill,
`shoroku`, and this directory, which is the scope the choice was recorded
against; the spec and the dialogue under `docs/superpowers/` keep them as the
record and are deliberately outside it. The thirteenth pins a frame command
keyed on a depth-three task heading: `frame` matches a task heading at any
depth (issue-ac9d), so no runtime text carries that pattern any more, and the
row names the contract, `roles/` and `templates/` rather than `skills/tanto`
because the script's own code and its test fixtures carry that heading by
design. The fourteenth is read, not counted: no line may be
an actual commit hash. Tracked content carries commit subjects, never
hashes, and `<sha7>` inside a template blank is a placeholder, not a
hash. `<plan>` is checked because `<plan-basename>` is the only correct
form; runtime text is skill-relative, so only the skill's `README.md`
and this note may name `skills/tanto/`. This is a deliberate asymmetry, not an oversight: the skill's `README.md` may name `skills/tanto/` because it documents this repository's layout, which is precisely what runtime text must not depend on.

The invocation line is read rather than counted, for the second reason above:
the value it must no longer carry cannot be written here.

```bash
grep -n 'argument-hint' skills/tanto/SKILL.md
```

Expected: one line, whose value reads
`kanri | sekkei | keikaku | jisso | kaiseki | kikaku | hosa | fukki | resume`
— nine arguments, every one the contract accepts, the alias included
(issue-260c). The line is unique in the file, so reading it settles both
halves at once: the nine-argument value is there, and the four-role value it
replaced is not.

The one wording invariant that must be **present**:

```bash
grep -c 'multi-session orchestration' skills/tanto/SKILL.md skills/tanto/README.md
```

Expected, exactly:

```text
skills/tanto/SKILL.md:1
skills/tanto/README.md:1
```

Every `README.md` these checks name is the **skill's** own. The repository root
`README.md` is deliberately out of scope: it is not part of the skill's
delivered layout, no `tanto` plan may edit it, and nothing the skill does at
runtime depends on it. It describes the repository's skills for a reader — which
are host-agnostic and which are not — so it changes when the set of skills
changes, not when `tanto` does.

A presence invariant belongs beside this absence check: every inline command in runtime text names an interpreter or is executable. Removing a repo-specific prefix from an invocation is not the same edit as making the command runnable — one fix satisfied the absence check above and still left five commands with no interpreter, because nothing here checks that what remains actually runs.

The allowlist this skill's own layout leaves behind (issue-3f6a, 2026-09-12):

```bash
grep -rn '\.superpowers/sdd' skills/tanto docs/notes/tanto-consistency-checks.md | grep -vc 'sdd/<plan-basename>/'
grep -rn 'plan-basename' skills/tanto docs/notes/tanto-consistency-checks.md | grep -vc 'sdd/<plan-basename>/'
```

Expected: `3` and `1`. The filter drops the SDD skill's own ledger,
`.superpowers/sdd/<plan-basename>/progress.md`, which any prompt, report or
brief may name; what survives the filter is the skill's `README.md` bullet on
what `sdd-workspace` owns, `SKILL.md`'s sentence on the one artifact tanto
reads there, and this note's own prose about the two untracked trees — that is
the `3`. The `1` is a different thing and not a retired spelling at all: it is
this note's own wording invariant about the two forms of a plan's basename
(line 685). A rise in the first number is a new spelling of the layout tanto
retired; a rise in the second is a new mention of that invariant. Read the
lines, not the count, either way.

This subsection is inside its own sweep, so every line of it that names either
needle also carries `sdd/<plan-basename>/` and is filtered out. A standing
check written into the file it checks must not move its own numbers — or it
counts its own text, and its expected value is wrong the moment it is written.
Measured when this subsection landed: of its nineteen added lines, four name a
needle and all four carry the filter's substring, so the filtered counts held
at `3` and `1` — while the *unfiltered* per-file counts for this file rose from
1 and 1 to 3 and 5, which is the same fact seen from the other side.

## 8. The frontmatter and the JSON parse

```bash
uv run --no-project --with pyyaml python -c "import yaml;t=open('skills/tanto/SKILL.md',encoding='utf-8').read().split('---')[1];d=yaml.safe_load(t);print(sorted(d));print('BAD' if ': ' in d['description'] else 'ok')"
node -e 'const t=require("./skills/tanto/templates/tanto.json");const r=Object.keys(t.sessions),k=Object.keys(t.subagents);if(r.length!==7||k.length!==12)process.exit(1);for(const m of [t.sessions,t.subagents])for(const v of Object.values(m))if(!v.model||!v.effort)process.exit(1);console.log("tanto.json ok",r.length,k.length)'
uv run --no-project --with pyyaml python -c "import yaml,sys;t=open(sys.argv[1],encoding='utf-8').read().split('---')[1];d=yaml.safe_load(t);print(sorted(d));print('BAD' if ': ' in d['description'] else 'ok')" skills/tanto/templates/agent.md
uv run --no-project --with pyyaml python -c "import yaml,sys;t=open(sys.argv[1],encoding='utf-8').read().split('---')[1];d=yaml.safe_load(t);print(sorted(d),d['effort'])" "${CLAUDE_CONFIG_DIR:-$HOME/.claude}/agents/tanto-task-implement.md"
```

Expected: `['argument-hint', 'description', 'name']`, then `ok`; then
`tanto.json ok 7 12`; then `['description', 'effort', 'name']` and `ok`;
then `['description', 'effort', 'name'] high`. A colon followed by a space
anywhere in a `description` value
breaks frontmatter parsing silently, which is what the `BAD` branch prints
for, and it is run against the agent template as well as the contract
because the rendered definition is a frontmatter file the harness parses.
The second line is a parse and two assertions in one: the twelve kinds, the
seven roles, and `model` and `effort` on every entry of both maps, which is
what makes a half-widened config fail here rather than at a dispatch. The
fourth line reads a **rendered** definition, which exists only where a role
has already generated one; where the directory is empty, record
`definitions not generated on this host` and let the dogfood settle it.
When `--with pyyaml` cannot fetch PyYAML, fall back to
`sed -n 's/^description: //p' skills/tanto/SKILL.md | grep -c ': '`, expect
`0`, and record the fallback.

Use `uv run --no-project`, never a bare `python`.

## 9. Linting an extracted tree

The extraction method's third leg. `scripts/lint.sh` runs pre-commit, which
takes only paths inside the repository, so a scratch tree of blocks extracted
from a plan cannot go through it. The markdownlint-cli2 the hook uses is
installed in the pre-commit cache; run it on the scratch tree with the
repository's configuration, whose `ignores` still apply (templates and
`docs/superpowers/**` are skipped there too):

```bash
ML=$(ls ~/.cache/pre-commit/repo*/node_env-default/Scripts/markdownlint-cli2 | head -1)
"$ML" --config "$(git rev-parse --show-toplevel)/.markdownlint-cli2.yaml" skills/tanto/SKILL.md skills/tanto/README.md skills/tanto/roles/*.md docs/notes/tanto-consistency-checks.md
```

Expected: `Summary: 0 error(s)`. The `repo*` directory is named after the
hook's `rev` and changes whenever it does, so glob for it rather than naming
it; on a POSIX host the executable sits under `bin/` instead of `Scripts/`.
The config path comes from `git rev-parse --show-toplevel` so the block is
copy-pasteable and still never embeds a home directory.

Two notes on this block. Its argument list is the tree's **real** paths, which
is why it can be run as-is against the repository; a scratch tree substitutes
its own paths there, and the heading and the arguments otherwise disagree. And
`markdownlint-cli2` from the cache, run **without** `--fix`, is the right
instrument for a **read-only reviewer**: four of `scripts/lint.sh`'s hooks
mutate files, so a review seat forbidden to touch the tree cannot run the
repository's own lint entry point at all.

Three more, from a scratch-tree dry run on this host. The Claude Code Bash
tool fails a long command — roughly forty lines and up, carrying a quoted
heredoc plus a pipeline — with `unexpected EOF while looking for matching
'''`, whatever the content; write the same commands to a script file with the
Write tool and run it by path. Recursive deletion is denied to the session, so
a dry run takes a fresh scratch directory per run rather than clearing one.
And the editor's markdownlint reports on files under `.superpowers/` are
advisory: the commit path ignores that directory, and `.tanto/`, where a
brief or a draft now lives, carries its own configuration that turns every
rule off.

Trailing whitespace and the final newline are the two things markdownlint
does not check and the hooks fix silently:

```bash
find skills docs -name '*.md' -print0 | while IFS= read -r -d '' f; do
  [ "$(grep -c '[[:space:]]$' "$f")" != "0" ] && echo "trailing whitespace: $f"
  [ "$(tail -c1 "$f" | od -An -c | tr -d ' ')" != '\n' ] && echo "no final newline: $f"
done; echo done
```

Expected: `done` alone. A block that passes here survives `markdownlint
--fix` on commit byte for byte, which is what a complete-contents plan
promises. The loop reads a NUL-delimited list rather than an unquoted
`$(find ...)`, which would word-split on any path containing a space; none of
the repository's Markdown files has one today, so this is a latent case closed
rather than a bug fixed.

The skill's two `.js` files are outside every block above. `scripts/lint.sh`
lints them through Biome, which a read-only seat cannot run; their content is
checked by `mise x node@22 -- node --test "skills/tanto/scripts/*.test.js"` —
the quoted glob, since the directory form fails on this host — and that is
the command a read-only seat runs in place of the lint.

## 10. A controller-written verification script earns the same scrutiny as the work it checks

A scan a controller writes to check a plan is itself unreviewed code, and its **coverage** — not just its findings — is a claim that needs stating and testing separately. One pre-flight scan reported "38 of 38 passage blocks resolve exactly once against the current tree"; it had actually checked 25 — a loop skipped a single-task file before reaching the occurrence check, so the thirteen blocks in files only one task touches were never resolved, and the scan also missed that the plan carried one global replacement rather than none. Neither error was caught by the scan's own author; an independent parse of the plan surfaced the contradiction. "38 of 38 checked" and "no finding" are two different assertions, and the first is the one that can fail silently.

## 11. Deferred minors are re-measured against the finished suite

A deferral recorded per task — "no test pins a last-section replace" — is a claim about the tree at the moment it was written, and a later task's test can close the gap by accident without anyone striking the deferral. In the kisou-refresh run the ledger's "no test pins a last-section replace" was false at head: a later task's test covered it, and the whole-branch review found the stale deferral, not the gap. Deferrals recorded per task are never re-measured against the finished suite unless something runs them. So before the whole-branch review is dispatched, Kanri re-runs each deferral's claim against the finished tree — a `grep` for the test name or the behavior, or the targeted test — and the list carried into the review holds only what is still open.

## 12. A fix wave in the block grammar

A whole-branch review's fixes are dispatched as a wave Kanri writes in the plan's own block grammar, a wave file with one task per finding group, so the wave earns the plan's instrument: `lint` and `replay` before dispatch, `verify --plan <wave> --task N` per task, and `diff --plan <wave> --base <pre-wave>` clean at the boundary. The tanto-sweep plan's fix wave was the first instance (`docs/reports/2026-09-10-tanto-sweep-dogfood.md`); the kisou-refresh plan's wave of 2026-09-11 was the second, and the shape held — six commits, one fix round the wave did not anticipate, and one mid-batch amendment (R-40: an approved `files:` line at 132 columns against the repository's yamllint `max: 120`) resolved by one message each way, Jisso's ruling request with the equivalent factored form proposed and Kanri's `amended:` after the block was rewritten and the wave's `lint` re-run, with `verify --task 13` clean against the amended wave. After a wave, `verify --plan <plan> --task N` on the original plan reports the tasks the wave superseded as `passage-absent`, correctly — see `docs/notes/reviewing-an-instrument.md`. A passage the controller re-authors mid-run by a recorded ruling, with no wave, produces the same reading for a different reason and with no marker to tell the two apart (issue-7c28).

## 13. Scheduling these checks without drift

Schedule a check by **extracting this note's own fenced block and piping it to `bash`**, never by copying the commands into a plan. A copy is a second source that drifts from the first the moment either is edited, and the drift is silent because both still run. Measured in the tanto-workspace plan, whose task 6 ran checks 6 and 7 out of this file rather than from a transcription: check 6's thirty-two values came back identical in the working tree and in the applied tree.

## 14. A verification-only task inverts the reviewer's instruction

A task whose deliverable is **recorded output** — a sweep that creates no file, whose failure condition is "it changed a tracked file" — inverts the standing rule that a reviewer does not re-run what the implementer already ran. Here the report *is* the artifact, so a reviewer who trusts it verifies nothing at all, and the risk it is the control for is specific: an implementer working from a brief that states expected values can stop running the commands and start predicting them, and a prediction is indistinguishable from a real run because it is built from the same brief. Tell that reviewer to re-run every command and compare. Measured in the tanto-workspace plan: task 6's reviewer re-ran all twelve steps and reproduced every one, including the three longest transcripts, which were the easiest to have fabricated.

A corollary for the dispatch: say in it that output differing from the brief's expectation is the normal shape of a real run, and that a report in which every number confirms the brief earns a second look rather than a faster approval.

## 15. Work assigned by section name drifts; quote the heading

Assigning a write-out by section name — "the `Bug intake` section of the design entry" — fails when the destination's headings differ from the source's, which they routinely do: a design entry and `SKILL.md` describe the same mechanism under different words. Quote the heading text, or give a line number, so the assignment names a place that exists in the file it is addressed to.

## 16. The usage line names every subcommand

```bash
node skills/tanto/scripts/passage-check.js 2>&1 | head -n 1
node skills/tanto/scripts/passage-check.js 2>&1 | head -n 1 | grep -oE 'lint|replay|diff|verify|sections|frame|boundary' | sort -u | wc -l
node skills/tanto/scripts/reading.js 2>&1 | head -n 1
node skills/tanto/scripts/reading.js 2>&1 | head -n 1 | grep -oE '\-\-role|\-\-presence|\-\-backstop|\-\-share|\-\-now|\-\-config|\-\-settings' | sort -u | wc -l
grep -cF 'scripts/reading.js' skills/tanto/SKILL.md skills/tanto/README.md
```

Expected: the first script's usage line, then `7`; the second script's usage
line, naming **both** its forms on that one line, then `7`; then one
`<path>:<n>` line per file with `<n>` at least `1`. The usage lines are read,
not
matched: the wording belongs to each script, and a plan that rewords one is not
wrong for doing so. The counts are the check. A subcommand or a switch the
script
implements and the usage line omits is invisible to every reader who has only
the usage line, and a role that never learns of it keeps doing the work by
hand — which is the whole reason the three new subcommands were added.
`sort -u`
before the count so a name the line spells twice is counted once. The last
command is the presence check between the contract's executables paragraph,
which must name both scripts, and the README's Layout, which must list both: a
zero on either side is the drift this check exists for. `reading.js` spells its
usage over one line for exactly this reason — a `head -n 1` that showed only
the first of two forms would pass while hiding half the interface.

This check is numbered after the lessons above rather than beside checks 1 to
9 because the numbers here are cited by plans; renumbering a check would make
every earlier citation point at something else. A plan that schedules the
mechanical set schedules checks 1 to 9 and this one.

## 17. The reading's fifth figure is in every place a reading lands

```bash
grep -rc 'context=' skills/tanto/SKILL.md skills/tanto/roles/kanri.md \
  skills/tanto/roles/jisso.md skills/tanto/templates/batch-report.md \
  skills/tanto/templates/roster.md skills/tanto/templates/roster-archive.md \
  skills/tanto/templates/kanri-handover.md skills/tanto/templates/kanri.md
grep -rlF 'context=' skills/tanto | sort
```

Expected: a nonzero count on each of the eight files named, and a file list
that is those eight plus `skills/tanto/scripts/reading.js` and
`skills/tanto/scripts/reading.test.js`, and nothing else. The spelling
`context=` is the one the reading itself prints, which is why the sweep is for
that and not for the word "context": a template that gained a Context column
whose paragraph spells the figure another way is invisible to this check and to
the reader who greps for it. A file in the list that is not one of the ten is a
place a reading landed that no design names — report it rather than adding it
here.

This check does not count itself: its subject is `skills/tanto`, and this note
lives under `docs/`. That is deliberate, and it is the standing trap the
paragraph under "Versions these checks assume" describes — a check written into
the file it checks moves its own numbers, and its expected value is wrong the
moment it is written.
