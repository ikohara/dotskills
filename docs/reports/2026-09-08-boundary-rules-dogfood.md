# boundary-rules — the first plan that carried passages instead of files

The third plan run under `tanto`, and the first whose Kanri had the handover
rule in view from the start. It closed three issues about boundaries — a due
handover waiting for what its session still owns (issue-f801), Kanri deriving
the topic word instead of asking for it (issue-c7e1), and the rule for a skill
edited in place while a run uses it (issue-4ac3, now decision-5c8e). What makes
it worth freezing is not those three rules but the method that delivered them:
the plan carried **passages** — an anchor line, the old text, the new text — for
each of twelve edits, rather than the complete contents of the six files it
touched. The two earlier runs are
`docs/reports/2026-09-06-tanto-dogfood.md` and
`docs/reports/2026-09-07-kanri-lifecycle-dogfood.md`.

## The run in numbers

Seven tasks in two batches, then the whole-branch review's fix wave. Six task
commits, one wave commit, and nineteen commits on the branch in all — the rest
Sekkei's spec and plan and Kanri's own `docs/` commits.

**Zero fix rounds on Tasks 1 to 6.** The only fix round in the run landed on
Task 7, the verification-only task, and it was about the record rather than the
tree. Twelve passages over six files; their per-file hunk counts against the
merge base were `7, 1, 1, 1, 1, 1` from the moment each landed and were still
that after the fix wave. The consistency note's checks were run against a
pre-edit baseline at every boundary and matched it every time — twelve blocks of
twelve at the last pass.

## The method held, and what it cost

Zero transcription errors, established not by reading but by an independent
reconstruct-and-compare over the whole branch: every added and removed line
classified against the union of the plan's blocks, with none left over.

The cost is structural and worth stating plainly. In a passage plan **the
spec's own bytes reach the tree verbatim**, so a wording or wrapping flaw in a
spec block arrives with the passage — and the task that carries it is the one
place it cannot be fixed, because an edit outside the passage breaks the
invariant that the file's diff is exactly its passages. Six such flaws were
deferred across the run. Six independent reviewers reached that conclusion
unprompted, each saying some version of "must not be fixed here". Three were
then fixed in the fix wave, where the correction belongs; three stayed, two of
them as questions for the spec's next revision.

A related authoring rule came out of the same fact: **a passage's wrap column
belongs to the destination file and is fixed when the spec block is written.**
Blocks authored at 68-76 columns landed in a file whose prose runs to 79, and no
later task could re-wrap them without breaking byte identity.

## Two checks that could not fail, and the pre-flight that caught them

Both were found before any implementer ran, by the pre-flight the previous run's
shoroku asked for and this plan's Task 2 wrote into Kanri's procedure.

The first was a check whose expected output was already true. A fix-wave item
verified itself with "the new first line returns `1`" — but that line was a
substring of the one-line form it replaced, so it returned `1` before the edit
as well. This is the sixth instance of the class across two runs, and the first
caught by the pre-flight sentence rather than by a reviewer afterwards.

The second was worse and is the run's most transferable finding. **A fix-wave
item passed every command it specified while silently dropping a word.** Its
replacement widened a line by five characters inside a block already at the
file's 79-column ceiling, and the width came out of the word `every` at the end
of the last replaced line. Joined to the unchanged line below it, the file would
have read "the first boundary at which file the plan touches agrees with every
other" — ungrammatical, and missing the universal quantifier the sentence exists
to state. The old text was present, the new text absent, the line numbers held;
after the edit the new-text grep would have returned `1` and the hunk count
would not have moved. **What no command in the list did was read the replacement
joined to the unchanged text around it.** The wave was held, the item reduced to
a one-line edit that touches no neighbour, and the mechanical form of the missing
check — splice the stated change into the old text and word-diff against the new
— is now in `docs/notes/tanto-consistency-checks.md`.

The same hour therefore showed the pre-flight sentence both necessary and
insufficient: running a command without comparing its output catches nothing,
and comparing outputs is still not the same as reading what the edit will
produce. The wave that carried the sentence completing the first half was itself
held by the second.

## What each review seat could see

The verification-only task inverts the reviewer's standing instruction — re-run
the checks rather than trust the report — because a report of a check is not the
check. That inversion found the batch's one Important finding: an instruction
the task had **declined**, recorded in its report as though it were a decision.
The task had been told to read the twelve hunks against the twelve passages and
had answered that the brief asked only for the counts. It does not, and the
counts cannot tell twelve correct passages from twelve wrong ones. Applied again
to the fix round — because a claim to have *read* something is exactly the
evidence the posture rejects — the same instruction confirmed all twelve
attributions against the tree.

That reading also settled one thing no count could: **hunk order is file order,
not task order.** The third hunk in `roles/kanri.md` was written by Task 5 while
the four below it were Task 2's, so an attribution by index would have been
wrong and no arithmetic would have caught it.

The whole-branch review earned its seat on a cross-file argument no task-level
review could make. One copy of a three-part authority phrase said "orders lines"
where the other two said "orders line"; it was singular in seven of eight
occurrences across the skill. Six task reviews read the passage containing the
plural, and none of them could see the other two copies.

Every reviewer in the run verified transcription **by command rather than by
eye**, and three chose a different mechanical check unprompted — a reconstructed
post-image line-matched against the spec's blocks, a script over added and
removed lines with a re-wrapped item flattened clause by clause, and one MD5
taken four ways over a single added line.

## The review package's two blind spots

Both were reported as limits rather than guessed around, by every reviewer that
hit them. The package is written with `-U10`, so adjacent changed regions appear
merged and the plan's default-context hunk count is invisible in it — the count
belongs to the conductor's boundary sweep, not to the reviewer. And the package
strips CR bytes, so on a plan whose constraints turn on per-file line endings the
reviewer cannot see them at all and must run one focused byte check.

## Line endings are an artifact, not a property

The plan's Global Constraints carried a table of which files are checked out
CRLF and which LF, measured on this machine. Two independent seats in the fix
wave found the same thing about it: `core.autocrlf=true` is global here and
`.gitattributes` gives `.md` only `* text=auto`, with per-file `eol=` for `*.sh`
and `*.bat` alone, while every `.md` blob is `i/lf` in the index. **A fresh
Windows clone checks out every `.md` as CRLF.** The split this run worked around
is an artifact of how each file happened to be written in this working tree, so
the table is a snapshot rather than a repository property. The procedure the
constraint states — `git ls-files --eol` before and after, same value, never
`w/mixed` — stays correct, because it reads the actual state. Both seats
declined to touch `.gitattributes`, correctly: it would have been a sixth item
in a wave adjudicated at five.

## Rule 11's first execution was its own construction

The rule this plan added says that while a plan editing the skill is in flight,
the authority for the run's sessions is the plan's Global Constraints, Kanri's
orders line, and the batch prompts, and that the plan names the boundary from
which a role may be started or replaced. The run that wrote it obeyed it: both
batch prompts carry the authority ruling verbatim, and the plan names the
boundary in both of the two places the rule requires. The batch A boundary was
chosen as that boundary and proved safe by a command at each boundary — a
per-file count of the citation the later batch lands, zero everywhere at batch A
— rather than asserted.

## Outside the plan, during the run

Three things happened on this branch that no task produced.

**Two hotfixes landed before the topic opened.** The previous run's report listed
them as pending; both went onto `main` on 2026-09-07 under that run's ruling —
"fix(tanto): the adoption-rule sentence names its second escalation class" and
"docs(notes): check 5's body claims only what its command verifies". They are
now in the tree, and this report is where that is recorded.

**The bug intake took its second real case.** A report from another repository
trialling the skill reached Kanri through the human as `bug-report: <path>`
during the spec phase, and was triaged into issue-e5a2 there. The intake route
still needs the human to carry the file, which is issue-b7d3.

**A VS Code restart killed every session mid-run.** The human resumed Kanri and
Sekkei; each came back under a **new name and ref with its context intact**. The
roster records each as a new row with the old row marked `dead`, which is the
right reading: the address died, not the context. One in-flight message was lost
— Sekkei's "plan committed" line — and the tree replaced it, the plan being the
branch head. The first assumption on the roster, that a missing session meant a
lost session, was corrected minutes later by the session itself.
