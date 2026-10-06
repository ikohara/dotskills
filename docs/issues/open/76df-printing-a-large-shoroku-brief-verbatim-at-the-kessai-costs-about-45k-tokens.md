---
id: "76df"
title: printing a large shoroku brief verbatim at the kessai costs about 45k tokens of Kanri context
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-04
updated: 2026-10-07
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

**2026-10-07, from inbox 2026-10-06-kanri-context-cost-and-close-gaps — two
more tenures.** One Kanri began its tenure at `context=162496` (baseline
88,933, ceiling 218,933), read a 43 KB brief once, printed it once, and was
at 251,798 after the kessai's answer, the merge and the shoki spawn: over the
ceiling, so the close's own handover was due before the archive move. A
later Kanri of the same run went from 129,680 at its start to 268,700 at the
fix wave's boundary (ceiling 284,797) before the kessai of a close of 84
rows, whose brief it then had to print; it judged that a handover right
after the recommendation was written, before the print, would have kept the
kessai in a fresh context. The report's direction, beside the two above: when
the recommendation has 100 items or more, hand over once it is written, and
the successor prints the brief. Kin issue-f000.

Carrier: Kept.
