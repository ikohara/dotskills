---
id: "3a33"
title: Kanri's escalations carry no chat-language reference translation of the wording the human confirms
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-09
updated: 2026-09-10
---

The human's word of 2026-09-09, on Q-1 of the review-brief T1: from now on,
when the original text and the chat's language differ, an escalated wording
— a requirement bullet, an ADR summary — is followed by a reference
translation in the chat's language. req-04f5 carries it as a bullet since
the same day; this issue is the gap in the skill.

`roles/kanri.md`'s adoption rule, its T0 and T1 procedure, its T2 direction,
and its exit shoroku steps all say "ask the human the escalated items" and
nothing about language. The review brief renders its points into the chat's
language, but what the human confirms at an escalation is the wording that
will be written, and the repository's wording is American English. Kanri
applied the rule by hand at the review-brief T1 (the second req-04f5 bullet
was shown with a Japanese reference translation); the skill does not ask for
it.

The fix is one sentence in the adoption-rule paragraph of `roles/kanri.md`,
and the same sentence where the exit shoroku and the T2 direction escalate:
the original first, then a reference translation in the chat's language; the
original is what is written. Whether `shoroku`'s own `Direction?` prompt
should do the same outside `tanto` is a question for the
requirement-extraction spec (its I-1, note 3), not settled here.

Related: req-04f5, req-3c4d, decision-1f5f, decision-ace0.

Resolution (context-cost, 2026-09-09): "The adoption rule" in `roles/kanri.md`
gained the rule — an escalated item whose wording is in a language other than
the chat's is put to the human as the original followed by a reference
translation in the chat's language — and the three places that say "ask the
human the escalated items" each gained ", original then reference translation,"
so the rule is read where it is applied rather than only where it is stated.
The three are T0 and T1, T2 step 2, and Exit shoroku step 2; two of the three
old passages wrapped across lines, so each was edited as it wrapped. Verified by
count: `reference translation` four times in the file, `original then reference
translation` three.
