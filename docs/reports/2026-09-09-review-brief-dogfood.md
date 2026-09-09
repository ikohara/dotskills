# review-brief — the run where the risk moved into the text

The fourth plan run under `tanto`, and the second to carry **passages** rather
than whole file contents. It closed one issue, issue-a1c9: before the human
reviews a spec or a plan, a third party lists only the points that need the
human's judgment, in the language of the chat, each with a pointer into the
document. What is worth freezing is less the feature than the run's shape — the
implementation of a decided text was essentially error-free, and every defect
the run found was a defect **in the text that had been decided**. The three
earlier runs are `docs/reports/2026-09-06-tanto-dogfood.md`,
`docs/reports/2026-09-07-kanri-lifecycle-dogfood.md`, and
`docs/reports/2026-09-08-boundary-rules-dogfood.md`.

## The run in numbers

Seven tasks in two batches, plus the whole-branch review's fix wave. Six files
touched, twenty-three passages, one of them a new file. Seven commits of plan
output on the branch, and **zero fix rounds in any task** — every one of the
eight task-level reviews came back clean on its first pass, with no Critical and
no Important finding at any point.

The whole-branch review, on `opus`, returned "approve after the fix wave": 0
Critical, 2 Important, 7 Minor. The fix wave was one implementer dispatch
carrying all eight ruled fixes and exactly one scoped re-review, which verdicted
every fix ADDRESSED with no new breakage. Nothing was parked; the breaker never
engaged.

## Spec conformance, measured

The whole-branch reviewer compared the spec's own fenced blocks against the
delivered tree: **all eighteen** blocks of the spec's seven binding sections
byte-identical, flattened, to the delivered passages; 227 added lines all
tracing to a spec block or its prose; 37 deletions all inside declared
replacements; **zero stray bytes**.

That is the finding this report exists for. A passage plan whose blocks are
given verbatim turns implementation into transcription plus verification, and
`sonnet` implementers did that without a single error across twenty-three
passages. The remaining risk therefore sits entirely in whether the decided text
was right — and that is exactly where the review's two Important findings
landed, in the spec's own blocks rather than in their transcription.

The corollary, worth stating because it is not obvious: fourteen task-level
findings were raised across the eight task reviews, and **every one was in an
implementer's report prose** — an elided output, a dropped `needle=`
reassignment between two consecutive checks, a misattributed citation, a
mislabelled hunk, an unfinished arithmetic sentence. None was in the tree. Each
was caught because the reviewer had been told to re-derive the fact rather than
read it. Two dispatch habits are what produced that: "show the output, do not
summarize it" to the implementer, and "re-establish what you verify" to the
reviewer.

## The reconstruction check, and how a method spread mid-run

From Task 4 onward every reviewer proved byte-identity and the "no other byte
moved" constraint in one move: take the file's blob at the base commit, apply
the brief's old → new operations parsed programmatically out of the brief, and
compare the result with the committed blob. All of them came back identical, and
the method scaled to the fix wave — ten replacements across five files at once.

Its by-product is the load-bearing half: it proves each old passage occurs
**exactly once** in the base, which is the assumption a passage plan silently
rests on and which no other check in the plan tested.

The method was invented by one task's reviewer, unprompted. It spread because
the controller wrote it into the next dispatch; nothing else would have carried
it, since each reviewer is a fresh subagent that reads only what its dispatch
gives it. A method a reviewer invents mid-run propagates only through the
controller.

## The two briefs, measured before the rule existed

Both were run by hand on this run's own documents, ahead of the skill carrying
the rule.

**The spec brief**, 2026-09-08: `opus`, read-only, about 3 minutes, 78k subagent
tokens, 6 tool uses, over a 758-line spec plus a 121-line dialogue record and
the scope inputs. Output 5/5/5/2 points with section 5 as one line, four
unsettled lines, **nine** distinct pointers, all of them headings of the spec.
Kanri's form check is three greps and takes under a minute. One refresh was
needed, because the spec moved between dispatch and return — the rule "a new
brief when the judgment points changed" did not cover a fold that landed
mid-write.

**The plan brief**, 2026-09-09: `opus`, about 6 minutes, 110k subagent tokens,
18 tool uses, over the 3087-line plan plus the 1022-line spec. Output 5/5/5/5/5
points, five unsettled lines (four `nothing`, one `decide`), **ten** distinct
pointers. The form check is four greps and a heading-match loop, under two
minutes; no re-dispatch was needed. The writer avoided every heading carrying
` — ` because the three-part split would break on it, which became spec input
I-5. The human answered `All OK` — the first end-to-end run of the plan gate
through a brief.

The human's own reaction to the first brief shaped the template: each point must
say what it asks of the reader, and the brief must show the reply shapes with a
worked example, the way `shoroku`'s Direction prompt does.

## What the dialogue record showed

`dialogue.md` — the human's answers verbatim, in order — was kept by hand during
the spec dialogue, before the rule existed. It was sufficient for a third party
to check every Fixed input in the spec against the human's own answers, and
every one matched. That is the artifact's own evidence, measured before the
skill required it.

issue-a1c9's five-item list of what a brief should carry survived into the
spec's five sections with exactly one widening: the requirement item became two
questions.

Two observations about the dialogue itself. The human asked two questions — one
about the models, one about requirement extraction — and each changed the
design; the second was caught only because Sekkei's answer named a concrete
requirement that had been lost. A record of the human's own words is what makes
such a turn legible to Kanri and to T1 without a paraphrase in between.

## Facts the design rests on

- `fable` is twice `opus` per token on both input and output (the Claude API
  skill's cached price table of 2026-06-24), so a `fable` reviewer is neither
  cheaper nor faster for an input-heavy, short-output job.
- The issue-a1c9 statement was requirement-shaped and was filed as an issue by
  the docs system's "exactly one type" rule — the observation that became
  issue-ad1a.
- superpowers has no third-party review of a spec or a plan, and no explicit
  human approval of a plan beyond the choice of how to execute it. `tanto` adds
  the reviewer subagents, the one human OK, and Kanri's cold read.
- Check 6 of the consistency note carried five fenced blocks before this plan;
  the new tree sweep is its sixth.

## What the previous run's conventions bought

boundary-rules ended with one defect, and it was the one claim no command
decided. This plan states that same claim correctly — and its one weak point was
the **command meant to decide it**: the term sweep, whose first form was
dominated by the plan's own `Run` and `git add` lines and whose output was a
count rather than a record. The convention added after the last run moved the
failure from the assertion to the instrument. That is progress, and it is also
the shape of most of this run's new plan conventions: they are about
instruments, not about passages.

A second inheritance failed differently. A count written in prose in three
places drifted in one run — the template's headings, given as seven in two
places and eight in two others. A count that appears more than twice wants a
command, not a number.

## Hunk counts and line endings

A hunk count was right only for the context width that produced it, three times
in one run: `SKILL.md` gave 2 at `-U10` against the task-time 3 at `-U3`;
`roles/kanri.md` gave 3 at `-U8` against 4 at `-U3`; the whole-branch review read
`1/2/2/5/2/3` at `-U10` and `1/3/5/7/7/9` at `-U0` against the same task-time
`1/3/3/4/5/6`. Three separate readers each reported a number that was true and
unusable without its width.

The line-ending split is real and per file: batch A's three files were checked
out `w/lf`, batch B's three `w/crlf`, and no file ended `w/mixed` after seven
edits — because the plan decided endings with `git ls-files --eol` per task
rather than encoding them as a table. Two of the nine pre-existing templates are
checked out CRLF and seven LF, so "every template is LF" is not true of this
working tree either. The note already says why: the mixture is an artifact of
how each file happened to be written on this machine.

## The checks, run three times

Task 7 ran the note's checks 1 to 8 as written plus check 9's whitespace sweep;
its reviewer re-ran them from its own extraction of the note's fenced blocks;
the fix wave's re-reviewer ran them a third time. All three agree, and every
output matched the note's own Expected text.

That reviewer did something worth keeping for any verification-only task: before
running anything it **diffed the report's transcribed command blocks against its
own extraction from the note** — byte-identical, so no check had been
paraphrased. Without that step, "run the commands as written" is not checkable
at all. It then completed a half-performed step independently, classifying all
232 added or removed lines across the six files against the plan's own fenced
blocks, and found **zero uncovered lines**.

`README.md` scored `0 0 0` on all three routed strings, which is why the gap in
check 6's loop — its prose claimed to cover every Markdown file of the skill
while the loop skipped one — was latent rather than a failure.

## The cost interruptions

An `opus` task reviewer was **killed mid-review by a session limit** and had to
be re-dispatched, losing one full review seat; the re-dispatched review then came
back clean on its first pass. The reviewer is read-only, so nothing had to be
recovered. decision-9a3a's concern — a run losing a subagent to a rate limit —
recurred one model family down, on the reviewer tier, and against the **session**
limit rather than the per-minute one.

Separately, the human read the VS Code extension's Account & Usage view on
2026-09-09 for the last 24 hours on this machine: 91% of usage attributed to
subagent-heavy sessions, 89% to contexts over 150k, 23% to periods with four or
more sessions in parallel, and 24% to general-purpose subagents, with skills and
plugins at 1 to 2% each. Context length, not wake-up count alone, is what the
limit charges. Both facts are recorded on issue-e5a2 and issue-40ed.

## Outside the plan, during the run

Three `docs/` write-outs happened beside the seven task commits, and together
with this T2 they are every `docs/` change the run made outside the plan's own
note commit. T1 filed issue-ad1a (requirement extraction in the docs system) and
issue-5a81 (a `fable` reviewer measured through the personal overlay), and
claimed issue-a1c9. The T1 addendum, after the human answered the two escalated
questions, added the req-04f5 bullet for the review brief and wrote
decision-ace0 amending decision-1f5f; on the human's own word the same day it
also added a second req-04f5 bullet — an escalated wording in a language other
than the chat's carries a reference translation in the chat's language after the
original — with issue-3a33 for the tanto side of it, and filed issue-5830, the
Kanri cold read carrying the whole plan into its context.

## Three verification layers, and which one paid

One last observation, because it prices something that felt useful. Every task
ran three layers: the implementer's own checks, the controller's independent
re-run of the same checks before dispatching the review, and the reviewer. All
fourteen findings came from the **reviewer**. The controller's layer caught
nothing the reviewer would not have caught.

It was neither free nor wasted — it would have stopped a bad task before a
review seat was spent, and it is what the batch reports' boundary evidence rests
on — but across seven tasks it produced no finding of its own. Worth knowing
before a future run treats it as the layer that catches things.

**Hotfixes on this branch: none.**
