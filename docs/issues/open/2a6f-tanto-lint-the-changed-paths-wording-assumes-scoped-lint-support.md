---
id: "2a6f"
title: tanto's "lint the changed paths" wording assumes the repo's lint wrapper supports path scoping, which is not always true
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-09-14
---

tanto's role text (for example `roles/kanri.md`'s T2/exit shoroku apply step,
"lints the changed paths by name") assumes a repo's lint wrapper supports
scoping to specific paths. Reported from the `ellmx` repo: its
`scripts\lint.bat` takes no path arguments and always runs
`pre-commit --all-files` — a full-repository lint every time — so the scoped
equivalent (`pre-commit run --files <path>`) is never actually invoked. A
tanto session that follows the skill's "lint the changed paths" wording
literally is describing something the underlying tool does not do there.

Other role files may carry the same phrase; not exhaustively checked.

Open question, not a one-line fix: either reword the skill's instances of
"lint the changed paths" to allow a full-repo run when the repo's own script
doesn't support scoping, or have tanto check for that support first (e.g.
whether the wrapper accepts a path / calls `pre-commit run --files`) before
assuming a scoped lint happened.

Reporter: `ellmx-b5 [d337fe]`, repo `ellmx` (a sibling repository on the same
machine), 2026-09-14 (`.tanto/inbox/2026-09-14-lint-scope-wording.md`).
