---
id: "5e5b"
title: "`boundary.js census` exits 0 on an empty listing, and no test pins it"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-24
updated: 2026-09-24
---

Source: shoroku bg-seat-ergonomics S-23

`skills/tanto/scripts/boundary.js census` exits 0 on an empty `sessions`
array and on entries without `cwd`, listing every roster row under "Not
listed". A Kanri following the census would then mark every row `dead`.

Keikaku accepted this as a documented gap (the bg-seat-ergonomics plan's
Review Focus item 2) rather than fixing it, and Task 3's quality reviewer
re-derived the same failure mode independently. `boundary.test.js` still has
no successful-empty-listing case: its `() => []` fixture is used only for the
failed-listing modes.

The cheapest pin is one test for the empty-array case, whichever way the
behavior itself is ruled — refusing an empty listing, or reporting it as its
own case.
