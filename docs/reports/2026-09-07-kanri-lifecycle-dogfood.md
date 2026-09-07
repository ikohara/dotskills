# kanri-lifecycle — the first plan conducted entirely under `/tanto`

What issue-770d asked for. The `tanto` skill of 2026-09-06 was verified by lint,
structural greps, and a handshake smoke test the human ran by hand; nothing had
exercised a batch loop, a session replacement, or the exits. This run did. It
changed the skill in six places — addressing without rename, a resident Kanri
with a handover, a bug intake, session-exit shoroku, human access by grant, and
three small fixes — across nine tasks in three batches, a whole-branch review and
a single fix wave, using the skill on itself throughout.

This report records what the run measured about the protocol, not what the plan
delivered; the delivered shape is design-4807 and the reasoning is
decision-73c3, decision-de63, decision-2f36 and decision-d831.

## The run in numbers

Nine tasks, seven task commits, twenty-three commits on the branch, all with the
co-author trailer, nothing pushed at any point. Two Kanri sessions, one Sekkei,
one Jisso, no Kaiseki. Five boundaries plus the fix wave's.

Fix rounds: **zero across the first six tasks**, then two — one on a report and
one on the human-facing handover paper. Neither touched the skill. The fix wave
carried sixteen items in one dispatch and one scoped re-review, as the final-batch
rule requires, and two of the sixteen came back for a ruling before it closed.

The plan carried the complete contents of every file it wrote: fourteen files,
2,204 lines of fenced blocks. The whole-branch review extracted all fourteen and
diffed them against the tree, finding six differing lines — every one of them a
divergence that had already been ruled, and nothing new.

## What produced the fix-round record

One practice, applied at three levels. Before any dispatch, every fenced block in
the plan was extracted into a scratch tree and every task's verification commands
were run against it; the counts, heading orders and absence checks all reproduced,
so the pre-flight predicted the outcome of the batch before it started. Before
each review, byte identity between the committed file and its block was
established mechanically — by extraction and `diff`, not by reading — so no
reviewer spent a round discovering a transcription slip. At each boundary the
whole set of the batch's task-time checks was re-run against the tree rather than
only the ones the boundary asked for.

The consequence is that the review seat was spent on what a command cannot
decide. That is where it paid: the cross-file contract asymmetries, the
checklist items that could not fail, and the human-facing paper's defects were
all found by reviewers who had been told the mechanical half was already proven.

## Five checks that could not fail

The most useful finding of the run is a class, not an instance.

1. Two absence greps in the consistency note searched for strings their own
   pre-images never contained — one carried bold markers, the other wrapped
   across a line break — so neither could ever have matched the wording it
   forbade. They passed while being incapable of failing.
2. Two checkboxes in the handover paper would have misfired on a **correct** run:
   one demanded a commit trailer the session that makes that commit does not
   write, and one was vacuously true whenever no live peer remained.
3. The fifth was introduced by the remedy for the fourth. The fix wave added a
   command to pin the one upstream sentence the skill overrides without a pin —
   and as specified it returned zero, because that sentence wraps in its source.
   It pinned nothing, and since its check expects a nonzero count on every line,
   it would also have turned the whole check red. The fixer ran it, saw the zero,
   and stopped rather than adjusting the expectation to match.

One question found all five: **if the thing this guards actually went wrong,
would this output change?** It is cheap enough to be a named step of a review
rather than a reviewer's initiative.

## Three measurement failures, and what they cost

Every one produced a plausible wrong answer rather than an error, which is why
they survived.

**A measurement whose output shape mirrored the claim.** A count of carriage
returns was taken with a grep for the control character, which in this shell
returns the *line count* for a stream that has none. "580 CR for 580 lines" read
as confirmation of exactly the claim it cannot support. Two agents reached it
independently, and their agreement was then treated as corroboration, overriding
the one reviewer that had inferred the truth correctly from a diff. The remedy is
to prefer a measurement that would answer *differently shaped* if the claim were
false: byte counts settle a line-ending question — `git cat-file -s` against the
piped count, or `od -c` — and a control-character grep never does.

**A flatten that omitted the carriage-return strip.** Joining a file's lines
before matching a wrapped sentence returns a plausible zero when the checkout is
CRLF, because the stripped-out newline leaves the carriage return mid-sentence.
This cost one false finding, caught before it was reported, and it is why the
consistency note's flatten stages strip CR unconditionally.

**Two transpositions, both in hand-derived summaries of correct captured
output.** One report's itemized transcript swapped two grep values while its
summary sequence was right; another's summary table swapped two hook counts while
its transcript was right. The mechanical capture held both times; the prose
written from it did not. The remedy is not to capture more but to **derive less**
— a count that appears in a summary should be produced by a command over the
capture, not read off it.

The line-ending question itself is worth stating once, because three separate
authorities generalized from a sample and all three were wrong as stated. The
index is LF throughout. The working tree is **mixed, file by file**: at the end
of this run, 97 tracked files were CRLF in the checkout and 39 were LF. So a
command that flattens strips CR unconditionally — required for most files, a
no-op for the rest.

## The extraction method's three legs

The same procedure — pull every fenced block into a scratch tree, diff against
the tree, run the plan's own commands there — turned out to have three moments
in a plan, not one: the design session's plan review before the plan is
committed, the executor's pre-flight before its first task, and the conductor's
pre-flight at each boundary before a batch is accepted. None is scheduled by a
role file; a plan that edits the skill schedules them by naming the note.

It was missing a leg. None of the three ran the repository's **linter** on the
extracted files, which is how a fenced block that could not survive
`markdownlint --fix` reached a commit: the block nested code spans, the linter
reshaped the prose, and the committed sentence then named a different string from
the one its own neighbouring command searched for. That was the run's only
deviation from the plan before the fix wave.

The gap closed inside the same plan. It was raised as a candidate at a boundary,
and the design session's own exit shoroku landed it as the note's **check 9**,
"Linting an extracted tree", with the incantation for running the pre-commit
cache's linter against a scratch tree outside the repository.

## The handover, observed from the receiving end

The resident Kanri handed over **mid-plan**, at the final batch's boundary rather
than after the merge decision. The trigger was a compaction the session noticed
about itself on its second day, after eight batches and one plan close, with
nothing missing from the ledger — the first data point for the count threshold
issue-40ed leaves open.

The executor was the live peer that received the successor's address line, so
three of the handover run's six pass criteria were verified from the receiving
end: the roster's first row named the successor as live with the outgoing session
marked replaced, the Residency line was reset to the successor with zero counts
and today's date, and the handover file was gone. The human judged the run passed
against all six checkboxes; box four — every live peer received the address line
— was satisfied by the single send to the only live peer, the design session
having already been deleted.

Two things the handover taught. A handover due at a boundary must wait for the
session's own background agents and for any commit line it has promised a peer,
because a subagent dies with its session and a successor inherits only its report
file; that is issue-f801, and the handover file's "In flight" section gains a
line for it. And the idle-notice signal is weaker than it looks: the final batch
produced two notices in the same minute, the first a false idle raised while the
fix subagent was still running and the second from a re-subscription that fired
immediately. After a false idle the report line is the only reliable signal, and
a re-subscription is not a second one.

One design defect surfaced here and was fixed in the paper rather than the
protocol: the plan had delivered the human's handover procedure into
`.superpowers/sdd/<plan-basename>/`, the very directory the protocol asks the
human whether to delete right after the write-out and the merge decision — along
with the conductor ledger the handover's own exit shoroku proposes from. The
roster records the human answering exactly that question with "delete the
workspace" at the previous plan's close, so the destructive order was precedented
rather than hypothetical.

## The bug intake's first case

The intake took one real report during the run, and it did not arrive as a bug
report file: the design session noticed three empty scratch files at the
repository root during its translation runs and sent Kanri a message. Triage
filed it as an issue. The session's own correction afterwards is the part worth
keeping — it had named a subagent as the origin, then established that the
subagent claimed to have written only under the scratchpad and was not the only
one in the window, so the origin was **inferred rather than established**. The
issue was reworded to state only what was established: the translation skill's
text names no scratch location.

## The VS Code tab title

Not reachable from a skill, a slash command, a hook, or a setting. The rename the
previous design asked for reaches only the session name the listing shows; the
tab the human actually reads carries an AI-generated title or one set through the
extension's own UI. This was one of the two facts that decided against a
mandatory rename.

## The design session's side

Its own exit shoroku recorded what the executor could not see. The spec and plan
went through a review, a re-review after a late input, and a second re-review
after a second one; the late input's real cost was the **seam** review — folding
a new section into a finished document leaves stale summaries in the older text,
and three of the four stale counts in that plan sat in exactly the three files the
fold had touched. Translation for the human's review of both documents cost about
1.2M tokens on the cheap model. Its measurement of the concurrency question: two
strong-model sessions for eleven hours, with two mid-tier and five cheap
subagents at the peak, and no rate limit.

## The review seat's economics

The whole-branch review cost 234k subagent tokens, 47 tool uses and about
seventeen minutes on the strong model, read-only and with no subagents of its
own. The part worth keeping is its falsifiability test: for each check the note
claims, inject the forbidden string and watch the command fire. That is what
established the checks could fail, and it is what the executor's own re-runs
could not establish.

The pattern across all the reviews is consistent. Where the controller had
already proven the mechanical half and said so in the dispatch, the reviewer
found cross-file contract defects and human-facing ones; where it had not, the
reviewer spent its effort re-deriving byte identity and returned mostly wording
minors. One reviewer added a check nobody asked for and it was the right one: a
fix asked to make a summary agree with a transcript can satisfy the request by
doctoring the transcript, so it diffed the report's quoted output against the
capture on disk before verdicting the fix.

## Two residue observations

A plan's defects tend to be **claims the plan makes about itself**. Both defects
found in this plan's review were in its self-review and its batches table rather
than in its content, and the same class recurred twice more during execution, in
stale heading counts left by a late fold. A plan review reads the meta-prose
against the body first.

And a check's heading can claim more than its command verifies. The note's
verbatim-quote check pins one line of a five-line quote, which is exactly what the
design asked for; its heading said the quotes were byte-identical in every copy.
That is a heading defect, not a check defect, and the distinction matters — the
command was right.

## Pending between-plans hotfixes

Two residuals were parked at the final batch rather than fixed, because the
final batch has no second fix wave. Both go to the hotfix lane on `main` after
the merge decision, one commit per symptom, no issue filed, since the commit is
the durable record:

- `SKILL.md`'s new definition of the adoption rule names only the first of its
  two escalation classes and, by saying the rest is Kanri's to decide,
  contradicts the second. Behavior is unaffected — only Kanri performs adoption
  and its own role file is complete — but the sentence was added for
  self-containment and is incomplete in exactly the respect it was meant to fix.
- The consistency note's check 5 body still describes the three copies as the
  same bytes including line breaks, the overclaim its heading was corrected to
  drop.

They are named here so they survive the deletion of the run's workspace.
