---
id: "2065"
title: a prose-polish pass over `skills/tanto/` after seat-lineage
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-18
updated: 2026-09-20
---

Source: shoroku seat-lineage

113 review findings across the `seat-lineage` plan's 35 tasks were each judged
not worth a fix round at the time — overwhelmingly cosmetic (a ragged wrap, a
dense sentence, a loose pronoun antecedent), most of them inherited from the
plan's own literal passage text rather than from an implementer's choice. A
future prose-polish pass over `skills/tanto/` is the only real action item
behind the whole body; the sites are recorded here so they are not lost when
the topic's untracked workspace is cleaned.

A `(pm)` tag marks a finding the reviewer traced to the plan's own brief
wording rather than to an implementer choice.

This list is the diet topic's to consume: see issue-cca9.

## The sites, by task

**Task 1** (`SKILL.md`) — :121-122 "Jisso's is measured and kept" mildly
mis-predicates a verdict as measured (pm); :27's Count cell drops the
zero-Jisso-before-landing case (pm).

**Task 2** (`SKILL.md`) — :365 a long line against its paragraph's wrap rhythm
(pm); :532/:540 ragged short lines from splicing (pm); :401-403 "a `cleared`
one" antecedent slightly ambiguous (pm); :539-541 "A peer not listed" loses a
clean tie to a dropped `ListAgents` filter (pm); :510 "the count in its next
reading" has no local antecedent (pm); :360-365 one dense, multi-clause
sentence (pm).

**Task 3** (`SKILL.md`) — :631 "The two facts, as before" has no earlier
antecedent in this file (pm); :649-653 two worked examples abut with no
connective phrase (pm); :602 a long line paired with ragged short wraps at
:599/:624 (pm); :605 elides a verb, needs a second read (pm); :650 embeds
illustrative commit hashes in a worked example — this repository's own tracked
content otherwise avoids hashes, and `commits <first>..<last>` would match the
example's own placeholder style (pm).

**Task 4** (`SKILL.md`) — :886-888 a second multi-line code span, the same wrap
risk Task 14 might add to (pm); :878 a loose backward reference (pm); :864-866
a close rule reads as filed under the wrong bullet (pm); :761-763 against
:836-837 a framing tension, technically consistent but reading against itself
on first pass (pm); :764-766 the roster rows' pending-Stage statement no longer
lives here, likely resolved by Task 17 — worth confirming there; :848 one
81-column line, cosmetic (pm); the four "Who proposes when" bullets state
`release:` asymmetrically, no contradiction (pm).

**Task 5** (`SKILL.md`) — :1040-1044 not re-flowed to the file's fill width
after the insertion (pm); :1042-1043 one dense sentence, a second read (pm);
:1040-1048 mild redundancy between two adjacent paragraphs on Jisso's
plan-landing start, defensible (pm).

**Task 6** (`roles/kanri.md`) — :118-121 the same-window branch keys only on
name, so a stale handover file beside a still-live same-name Kanri would
misread — low likelihood, the file is deleted at handover completion; :5 two
second-order transient effects of the swap, later tasks' own territory; :123
against `SKILL.md:367` `replaced`/`cleared` now overlap for a same-window
predecessor, `replaced` remaining the better fit; :127 against :152 two idioms
("every `live` peer" / "every `live` row") for the same rule, cosmetic.

**Task 7** (`roles/kanri.md`) — :215-218 a non-parallel sentence elides its
verb (pm); :216 a possibly-dead precondition, harmless belt-and-braces (pm);
:212-214 "in any role" nominally includes Kanri though Kanri never handshakes
itself, momentarily ambiguous (pm); :190-191 a status fact sits in the reply
step rather than the write-row step (pm); :173-176 a four-word orphan wrap line
(pm).

**Task 8** (`roles/kanri.md`) — :322 one qualifier short of this file's "data
rows" habit; :321-323 the queue-sizing formula now stated at four sites total,
a drift risk after Task 15 (the whole-branch review confirmed one owner, no
drift found); :330-332 a literal-reading wrinkle from clause order, not a
contradiction; :326 restates Task 7's handshake rule a third time, an in-situ
recap; :317/321/329-330 forward-references to Tasks 15/27's own not-yet-landed
sites, this task's own scope note; :324-325 "fewer" borrows its noun from two
clauses back, style-level.

**Task 9** (`roles/kanri.md`) — :421-427 the rule's condition is led with a
trailing aside rather than stated up front, reading inverted under load (pm);
:374-380 one sentence with four nested em-dash/colon interruptions (pm);
:377/:427 ragged mid-paragraph fill (pm); :426-427 a cross-reference points at
the fix-wave prompt rather than the step where the verdict lands — Task 11
rewrote that section next, resolved there; :363-364 against :370 a pre-existing
"Rulings"/"Rulings needed" naming mismatch, out of this task's scope, flagged
for Task 28's own territory (`templates/batch-report.md`) and resolved there.

**Task 10** (`roles/kanri.md`) — :460 "at most three topic lines" never
exercised by either worked example, unillustrated rather than contradicted
(pm); :436-437 "the idle block" arrives with no definitional gloss (pm);
:517-518 a compressed sentence with no stated actor or recipient (pm); :504-518
three cases ordered main-rule-then-exceptions, so a top-down reader could act
early — all three remain complete and non-overlapping (pm); :515-516 two
stacked possessives (pm).

**Task 11** (`roles/kanri.md`) — :585 against :1089-1093 the roster's
shoroku-item destination named two ways, Tasks 14/17's own not-yet-landed
territory at the time, resolved there; :573-575 a clause attaches slightly
ambiguously, recoverable from the next line (pm); :562 one ragged wrap line
(pm).

**Task 12** (`roles/kaiseki.md`) — :620 "then `release:`" more elliptic than
this file's other references to the same line (pm).

**Task 13** (`roles/kanri.md`) — :836-840 the plan-close branch no longer
routes anything to "Not reconstructed", harmless, the template still prompts
for it (pm); :853-854 a scoping sentence sits at the tail of one branch but
covers both, the wording carrying it (pm); :819-820/:842 ragged re-wrap at two
sites (pm).

**Task 14** (`roles/kanri.md`) — :1097-1098 an absolute statement against a
two-sentences-earlier exception, `SKILL.md:861`'s qualifier would close it
(pm); :967-972 a framing clause is slightly off though the destination is right
(pm); :964-972 the placement splits a commit/writer pair and sits inside "The
four steps" although it describes a moment none of the four run (pm); :971-972
a de-duplication rule narrowed to the roster table specifically, where
`roles/kanri.md`'s own Task-17-owned `roster.md` keeps the general framing
(pm); :1029-1031 "your own"/"then your own" used in two different senses in one
sentence (pm); :1009 "the close's three files" undercounts the `close:` line's
five fields, pre-existing wording; :1037 "every planned exit … carries its own
shoroku" is broader than `SKILL.md`'s explicit Kikaku/Hosa exception, newly
visible since Task 4 made the exception explicit, pre-existing wording.

**Task 15** (`roles/kanri.md`) — :1333-1334 against the then-untouched Readings
section's :1368-1369, an in-file contradiction resolved by Task 16 as planned;
:515 "the Create table's Jisso row's request" now ambiguous with two Jisso rows
existing, earlier-task text, outside this task's own passages; :1312 the Create
row states the queue-empty condition but not its timing, which lives in the
Replace row and rule 11 instead, brief-faithful; :1285 list item 1 ends with a
colon, reading as a lead-in rather than parallel to items 2-5 (pm).

**Task 16** (`roles/kanri.md`) — :1371-1372 the `--role jisso` verify clause has
no listed trigger in the doubted-reading list, still reachable another way,
arguably spec-owned (pm); :1393-1394 an em-dash parenthetical eats a comma
boundary, parsing on a second read (pm); :1393 coins a past tense the file does
not otherwise use (pm); :1395 a cosmetic ragged wrap.

**Task 17** (`templates/roster.md`) — :28/:32 "Kanri sends only to `live` rows"
stated twice, two bullets apart, both brief-mandated; :73-75 a ragged short
line mid-paragraph, cosmetic; :116-120 the Events catalogue mixes three form
shapes, each individually correct; :94-95 against :101-102 a small tension on
whether the Written column can hold a commit subject, defensible but giving two
answers on first read; :15-16 "its status unchanged" against `roles/kanri.md`'s
looser "a queued row keeps its status" — informational, not a Task 17 issue.

**Task 18** (`templates/roster-archive.md`) — :6 a ragged wrap from the brief's
literal text (pm); :4-6 a 13-word parenthetical lengthens an already-long
sentence (pm).

**Task 19** (`templates/kanri-handover.md`) — :89 bare angle brackets
(`<family>`/`<level>`) get swallowed by a Markdown renderer, a pre-existing
file convention (pm); :88-92 mixed code formatting across one line (pm); :88-92
inconsistent terminal punctuation across four steps (pm); :89 "as
`sessions.kanri` says" does not name where that key lives, unlike the Create
list's own phrasing (pm); :34 the "## Live peers" heading does not reflect that
`queued` Jissos are listed there too, not renamed given the heading-stability
constraints on templates; :88 against :92 mild redundancy across one fork,
readable as written.

**Task 20** (`templates/kanri.md`) — :12-13/:57-58 ragged wrapping, cosmetic
(pm); :105 "the idle block's own source" over-claims sole sourcehood, the idle
block actually having two sources (pm); :115 a bare name where the roster
elsewhere treats `[ref]` as load-bearing, defensible here since Measurements is
not in that list.

**Task 21** (`roles/jisso.md`) — :30, :78, :314 the three closing-line mentions
never carry the identity prefix `SKILL.md` already establishes, `SKILL.md`
remaining authoritative and this task's scope note limiting it to its own nine
sites; :54-55 against :80-81 "expect none" could misread as "expect no further
prompt" rather than "expect no next batch", recoverable from context (pm);
:78-88 and :318-324 restate the same exit-via-report's-section rule in two
places, defensible point-of-use redundancy.

**Task 22** (`roles/sekkei.md`) — :178 a colon collision, two colons in close
succession (pm); :167, :171, :175, :183 ragged fill from passage-literal
editing across several tasks, wanting one reflow pass eventually; :176-181 the
closing line states `none` for the still-needed step while awaiting `release:`,
defensible under `SKILL.md`'s own rule, a consistency observation rather than a
defect.

**Task 23** (`roles/keikaku.md`) — :93 "carries one" resolves a pronoun the old
text spelled out (pm); :95/:288 ragged wrap from passage-literal editing, where
refilling would break the passage check (pm); Keikaku's closing line reports
`none` for the still-needed step while awaiting `release:`, the same pattern as
Task 22's Sekkei, consistent by design.

**Task 24** (`roles/kaiseki.md`) — :79-81 the closing-line description closes
with a colon instead of the em-dash its Sekkei/Keikaku siblings use,
recoverable (pm); :79, :117 never uses the word "wait" where its siblings do,
the wait being implied, brief-dictated; :108 a ragged fill from the reflow,
cosmetic; :74 references a "Shoroku proposal" heading
`templates/kaiseki-report.md` did not carry yet at the time — Task 28's own
territory, resolved there.

**Task 25** (`roles/hosa.md`) — :82 "no `release:` line" mixes what Hosa sends
against what it receives, trivially true as phrased (pm); :39 a ragged
mid-paragraph wrap (pm); :93 "the compaction's count" slightly off the
established term, wording only; :96 "in any role" quietly widens the old "the
next `/tanto hosa`" phrasing, correct and brief-mandated, flagged so the
widening reads as deliberate; :97-99 no identity prefix or `sent:` line
mentioned, consistent with every other seat file, the general rule living in
`SKILL.md`.

**Task 26** (`roles/kikaku.md`) — :65 the new `decision:`/`no-role` sentence
sits topically apart from its own paragraph (about window lifecycle, not wire
format), brief-dictated placement; :65 the sentence makes this the file's
longest line at 81 columns, cosmetic, MD013 is off; :22 against :58 two
`release:` rename forms (a bare token against "`release:` line"), a judgment
call rather than an inconsistency; `roles/kanri.md:1325` still said "the next
`/tanto kikaku` handshake" in a compaction-recovery table, narrower than but
not contradicting the widened rule — outside this task's own scope and tracked
as issue-5601, where the row is dead text either way.

**Task 27** (`templates/batch-prompt.md`) — :1-3 the `no-role` line is the
prompt's third rendered line, not literally its "second line" per `SKILL.md`'s
own shorthand — the substance is right and the residual friction is in
`SKILL.md`'s own phrasing, not this file; :34 "the `<n>`th of this plan"
renders wrong for numeral fill-ins (2th, 3th), where the title line's own
phrasing is numeral-safe and only this ordinal form is not; :1 against :33-34
the Jisso's ordinal stated twice, two hand-filled copies of the same fact, low
drift risk; :33-37 high placeholder-nesting depth, parsing but the densest
instruction in the file — worth addressing together if the brief is ever
reopened (the fix wave's H6 picked the "replaces, not joined" reading for the
specific ambiguity here, but the density itself remains); :6-7 "not your
workspace or your name" has a compound antecedent, inherited wording pre-dating
this task.

**Task 28** (`templates/batch-report.md`) — :41-42 "Nothing else is written at
your exit" is unqualified against `roles/jisso.md`'s own stated T2 exception,
where the role file is the authority and wins on conflict, cosmetic (pm).

**Task 29** (`templates/shoroku-brief.md`) — :35-37 a ragged wrap newly
introduced by one excision, the brief's own wrap (pm); :5-6, :15-17 similar
pre-existing raggedness at two more spots, inherited rather than caused; :3-5
"recommendation" now appears twice in one short sentence since the
between-plans alternative is gone, previously masked, a later-editor note.

**Task 30** (`skills/tanto/README.md`) — :129 `` `[ref]` `` used with no
definition anywhere in this README (its only occurrence of the term), defined
in `SKILL.md` instead, one file away from any real reader of this skill (pm,
downgraded from the quality reviewer's own Important rating on independent
verification).

**Task 31** (`docs/notes/tanto-consistency-checks.md`) — the new "## 25."
section's P31.3-adjacent prose explains position 9 before circling back to
position 4, an out-of-list-order readability wrinkle from the insertion point,
not wrong.

**Task 32** (`docs/notes/claude-code-sessions-observed.md`) — :257 "Measured on
2026-09-16" against the file's usual bare "Measured"/"Observed" convention, a
tiny drift (pm); :262-263 an ambiguous "it" antecedent, where the nearest noun
is "rows" and the clear referent is the clear event (pm); :262 "three
post-clear rows" left implicit as to why three, so a reader outside the
measurement may pause (pm).

**Task 34** (`docs/issues/resolved/f293-…`) — one line runs well past the
file's soft wrap with a missing comma before "or `none`" (MD013 is off, lint
passes); "every role file's idle and exit paragraph now ends with it" is
vacuously true but slightly overstated for `roles/kikaku.md`, which has no
idle or exit paragraph by design.

**The fix wave** (`roles/kanri.md`) — two parked minors from the wave's own
second review pass, both still open and neither judged load-bearing enough to
fix alongside B/C/H1:

- :150, in the new Kept-Kanri transcript-mismatch fallback text (fix A):
  "continue as the paragraph above says" reads against the wrong antecedent —
  a reader's nearest referent is the Handover paragraph just above, whose own
  ending does not apply here. "As this case's first sentence says" would
  resolve it.
- :322, in "When the plan lands" step 3 (fix E): the inserted sentence leaves
  "Nothing is copied and nothing is recommended:" starting mid-line — cosmetic
  only, lint passes either way.

**One more pre-existing site**, from the whole-branch review's Minor 3:
`roles/kanri.md:8` "Kikaku … hears nothing from you" contradicts the handshake
reply at :196 (which carries Kanri's address and the open topics) and
`SKILL.md:24` ("Kikaku at its handshake only"). Pre-existing since 2026-09-13;
the contract's wording is the accurate one, so the fix is one clause.

**Name the loop's steps, do not number them** (2026-09-20, `tanto-diet`) —
`roles/kanri.md` and `SKILL.md` refer to the batch loop by step number in
eleven places outside the loop itself, so a loop rewrite is never local: this
topic's own renumbering had to chase all eleven. Naming the steps (`the send`,
`the commit window`) instead of numbering them would make the next rewrite
cheap. Not a defect on its own — the eleven cross-references are the measured
cost of the current numbering, and this pass is where a change of that size
belongs.

A prose-quality backlog, not a user-stated need, so no paired requirement.
