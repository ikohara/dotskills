---
id: "76df"
title: printing a large shoroku brief verbatim at the kessai costs about 45k tokens of Kanri context
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-04
updated: 2026-10-04
---

Source: inbox 2026-10-03-kessai-verbatim-brief-costs-45k-tokens

`roles/kanri.md` has Kanri print the shoroku brief verbatim in its own window
at the kessai, and nothing bounds the brief's size. In one run an 83-line
brief of about 600 characters a line (49 KB) cost about 45000 tokens of Kanri
context in one turn, and took the Kanri over its ceiling just as the human
answered.

The whole text is needed only for the adopt, fix and unsure groups. Either
the reject group prints as a count and its `See:` headings, or the
recommender's rules bound the brief's rendered length. Keeping every line
short, as the `shoki-seat` brief did, is a mitigation and not the repair. The
sites are `roles/kanri.md`'s kessai step (`<the brief's text verbatim>`) and
`templates/shoroku-brief.md`.

Carrier: Kept.
