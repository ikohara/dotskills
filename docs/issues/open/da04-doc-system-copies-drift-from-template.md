---
id: "da04"
title: this repo's docs/ AGENTS.md copies drift from the kisou template in both directions
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-03
updated: 2026-09-03
---

This repo dogfoods the doc system kisou ships, so `docs/AGENTS.md` and each
`docs/<type>/AGENTS.md` are downstream copies of
`skills/kisou/templates/docs/**`. As of 2026-09-03 they diverge both ways:

- **Template ahead.** The partial-supersession rule (`amends` / `amended_by`,
  decision-89da) and the out-of-system citation rule (decision-e57e) exist only
  in the template. `docs/AGENTS.md` and `docs/decisions/AGENTS.md` here still
  describe full supersession only and list two structured links.
- **Repo copy ahead.** `docs/decisions/AGENTS.md` here carries a "Two litmus
  tests" paragraph under "When to write an ADR" that the template lacks, so no
  downstream project receives it. Whether that paragraph was meant to stay
  local is undecided.

## Resolution path

1. Decide whether the litmus paragraph belongs in the template; if so, port it
   with `{{design}}` placeholders.
2. Run `kisou migrate` here with the docs-only scope and accept the refresh
   items for the two files — the designed upgrade path (decision-281f). Do not
   hand-edit the copies.
3. Both steps edit agent instruction files and need explicit human approval per
   the root `AGENTS.md`.
