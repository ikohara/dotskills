---
id: "c9df"
title: shoroku's proposal states a requirement as the sentence the source used, so mechanism reaches requirements/ and the need behind it is asked for afterwards
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-13
updated: 2026-09-19
---

Source: session 2026-09-13

Raised by the human in Sekkei's spec dialogue for the tanto-cost topic
(2026-09-13), drafted by Sekkei (`dotskills-a0 [95cfbe]`) at
`.tanto/tanto-cost/issue-draft-shoroku-requirement-extraction.md` and filed
here by Kanri. Related: req-3c4d, design-e3f4, req-04f5,
`docs/requirements/AGENTS.md` ("requirements vs issues", the two tests),
issue-ad1a (a different gap: an unmet need still counts as a requirement
fragment; this issue is about a *stated* need whose candidate wording fails
the two tests), and the tanto-cost spec review of 2026-09-13 with its brief.

`docs/requirements/AGENTS.md` gives two tests for "this is a requirement" —
the need survives a change of design, and its reason is the user's own
situation — and `shoroku`'s Propose step classifies each fragment as exactly
one type. Measured on the tanto-cost spec work of 2026-09-13, the tests are
applied after the fact, by a reviewer or by the human, and not by the
proposal itself:

- The spec's Requirements section proposed two edits that a read-only
  reviewer read as design by those tests (a sentence naming the file that
  carries a subagent's effort; a sentence fixing the number of roles), and
  three more that the human sent back with the question "what is the user's
  requirement here?" — the Model discipline bullet ("mostly design"), the
  Docs-are-kept-current bullet ("half design"), and the Kikaku exception
  ("`as a file` is unnecessary"). In every case the candidate was the
  sentence the source (the design) used, and the need behind it had to be
  reconstructed in the dialogue.
- Earlier the same day the human asked, of a proposed requirement change,
  "守ろうとしている要件はなんだろう？" — which requirement is this change
  protecting — and the answer split one sentence into a need (kept in
  `requirements/`) and a mechanism (moved to `design/`). Nothing in the
  proposal had asked that question first.
- The repository's own guidance for T1 wording (the cost discussion of
  2026-09-12, fourth pass) already says "abstract: no `git`, say version
  control", and it is applied by hand each time.

What `shoroku`'s Propose step could do, in the order of what would have
caught the most:

1. **State the need, not the sentence.** For every `requirements` candidate
   the proposal carries two lines: the candidate wording, and one sentence
   answering "what does the user want, and because of what in their own
   situation" — the second test written out. A candidate for which that
   sentence cannot be written is design or an issue, and the proposal says
   so instead of proposing it.
2. **Split need from mechanism the way need is split from gap.** The rules
   already make a stated-but-unmet need two fragments, a requirement and an
   issue (issue-ad1a). A stated need whose sentence carries its mechanism is
   likewise two fragments — the need to `requirements/`, the mechanism to
   `design/` — and the proposal offers the pair, never the mixed sentence.
3. **A vocabulary check on requirement wording.** A `requirements` candidate
   that names a path, a command, a config key, a file format, a role count,
   or a tool by name is flagged in the proposal ("reads as design: names
   `~/.claude/agents/`") and offered in an abstract rewrite beside the
   concrete one, so that the human picks rather than rewrites.
4. **For a change to an existing requirement, show current, proposed, and
   the need served.** The human's question "which requirement does this
   protect" is answered before it is asked; a change that protects nothing
   is a design change and is proposed as one.
5. **In recommend mode, route the doubtful ones to `unsure`.** A
   `requirements` candidate that fails a test goes to the recommendation's
   `unsure` group with the failing test named, so the human's exception
   answer is informed.

None of this changes `docs/requirements/AGENTS.md`; it moves its two tests
from a rule the classifier is expected to remember into a shape the proposal
must fill. The apply half is unaffected.

The measurement that would show the effect: the count of `requirements`
items a spec review or the human sends back as design, per spec — five on
the tanto-cost spec of 2026-09-13.
