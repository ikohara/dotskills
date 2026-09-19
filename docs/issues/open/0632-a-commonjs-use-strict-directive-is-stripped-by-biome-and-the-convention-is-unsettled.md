---
id: "0632"
title: biome's recommended rules strip a bare `"use strict"` from a CommonJS script under the hook's `--write`, and the repository has no convention for the directive
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-11
updated: 2026-09-19
---

Source: session 2026-09-11

`biome.json` enables the recommended rules, and `lint/suspicious/noRedundantUseStrict`
is among them with a safe fix: under the `biome-check` pre-commit hook, which
runs with `--write`, a bare `"use strict";` at the top of a CommonJS `.js`
file is silently removed. Met on 2026-09-11 in batch A of the kisou-refresh
plan, whose spec and plan mandate the directive for
`skills/kisou/scripts/doc-system-check.js` and its test file: the hook
stripped it from both, and the implementer restored it behind a per-file
`// biome-ignore lint/suspicious/noRedundantUseStrict: CommonJS script, not an ES module`
line, because the linter configuration is not to be edited without the
human's approval (AGENTS.md). The repository's only other CommonJS script,
`skills/tanto/scripts/passage-check.js`, carries no directive at all.

So the two shipped scripts disagree, and nothing says which is the
convention. Two consistent answers:

- **No directive.** The `.js` files under `skills/*/scripts/` are CommonJS
  scripts run by `node <path>`; sloppy-mode differences are not something
  either script relies on, and biome's rule reads the directive as redundant
  for a reason. The kisou-refresh spec's "CommonJS, `'use strict'`" line and
  the two suppression comments go.
- **Directive with suppression.** Keep `"use strict"` as the plan wrote it,
  and either add the two-line suppression to `passage-check.js` too or turn
  the rule off in `biome.json` — the latter a linter-configuration edit the
  human approves.

Either is a one-commit change; the choice is a repository code-style
decision, so it is the human's. Until it is made, the kisou-refresh plan
proceeds with the suppression form (kisou-refresh ledger R-21).
