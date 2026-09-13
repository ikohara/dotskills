---
id: "8c74"
title: "`templates/kanri.md`'s Stage example list omits `exit-keikaku`, which `SKILL.md` lists as one of five"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-13
updated: 2026-09-13
---

Found by the tanto-cost run's batch E task 17 reviewer (2026-09-13),
recorded in `.tanto/tanto-cost/batch-E-report.md`, "Rulings" (landed as
written; not fixable inside this plan).

`templates/kanri.md:46`'s Stage example list, illustrating the shoroku
table's Stage column, does not include `exit-keikaku` among its examples,
while `SKILL.md:552-557` lists five stage-word examples and says "the
conductor ledger's Stage values mirror it." One of the five is missing
from the mirror.

Not fixable inside the tanto-cost plan: `templates/kanri.md` carries
passages under task 17, already landed; adding the missing example would
be an unquoted edit to a path `diff` already treats as fully accounted for.

Related: issue-e18b, issue-62e7 (the same "one file lists N things, another
lists fewer" shape, from earlier batches of the same run).
