---
id: "d19f"
title: brief.write copies the review-brief template's sample headings instead of translating them
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-09-19
---

Source: session 2026-09-14

Reported from `C:\Users\0000105523\devel\kuchidome` (tanto, topic
`gated-permissions`, sekkei dispatching `brief.write`): a `brief.write`
subagent kept `templates/review-brief.md`'s `## <n>. <English>` sample
headings in English on its first render, although the dispatch said the
brief's language is Japanese and the template's own header already says
"the headings included" — i.e. translate them. Sekkei's form check
(`grep '^#'` on the brief) caught it; a `SendMessage` back to the same
subagent re-rendered the seven headings correctly in 12 s, the body
otherwise byte-for-byte unchanged.

Two candidate fixes, either resolves it:

- Render the template's sample headings once per language in the template
  itself, so there is no English original to copy from.
- Tell the writer explicitly, in the dispatch prompt's first line, to
  translate the sample headings rather than copy them.

The form check already catches the defect before it reaches the human, so
this is a cost issue (one extra round trip), not a correctness one.

**2026-09-18, `seat-lineage` — a second data point, one heading left in
English.** The `brief.write` seat (sonnet) rendered seven of the eight headings
of the shoroku check brief and left `## How to answer` exactly as
`templates/shoroku-brief.md` spells it. The form check caught it and a second
dispatch fixed that one line; earlier briefs in this repository rendered it
`## 回答のしかた`. One failure in one brief, of the kind the template's own "the
headings included" already forbids, and the same shape as the original
instance. No template change is proposed by this instance either — it is the
second measurement of the cost, not a new defect.
