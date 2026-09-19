---
id: "a04c"
title: brief.write's five-per-section cap renders a fully-settled spec's brief as misleading "nothing" lines
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-09-20
---

Source: inbox 2026-09-14-brief-write-five-per-section-cap-hides-settled-points

Reported from `C:\Users\0000105523\devel\kuchidome` (tanto, topic
`boundary-hardening`): for a spec whose dialogue settled everything (every
answer `OK`, every review finding adopted), the review brief had no
`choose` or `decide` point, yet 8 of its 28 points overflowed into the
unsettled section as `nothing` lines, because of
`templates/review-brief.md`'s five-per-section cap. The brief was
technically correct — the human answered `all OK` in one line — but the
brief's shape (many `nothing` lines under "What the writer could not
settle") does not match a spec that is, in substance, fully settled.

Two candidate directions:

- A shorter brief form for a spec whose dialogue and review left nothing
  genuinely unsettled.
- Raise or remove the five-per-section cap when every point in a section is
  `confirm`/`nothing` rather than `choose`/`decide`.
