---
id: "d19f"
title: brief.write copies the review-brief template's sample headings instead of translating them
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-09-14
---

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
