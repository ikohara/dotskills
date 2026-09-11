---
id: "f50d"
title: kisou's migrate text contradicts itself on a present doc-system, refresh target versus leave intact
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-09
updated: 2026-09-11
---

Found in the requirement-extraction spec review (2026-09-09).

`skills/kisou/SKILL.md` Step 3 (migrate) says two things about a doc-system
that is already present. The detection paragraph, for a `full` doc-system
(root `AGENTS.md` plus all four per-type files): "leave intact; treat the
migrate scope as **layer-B only** unless the user asks otherwise. It is still
a refresh target (see the Present branch below)". The per-artifact list, at
its end: "**`docs/` doc-system** → write the bundle if absent; if already
present, leave it intact and add only around it." The Present branch between
them describes the refresh of a kisou-managed file toward the current
template, which is decision-281f's upgrade path, and design-c1d2 carries both
halves in one sentence.

A reader running migrate on a repository with a full doc-system cannot tell
from the text whether the four rule files are refreshed or left alone. The
requirement-extraction plan resolves it for its own run by following the
parenthetical ("still a refresh target") together with an explicit docs-only
scope pick, which is "the user asks otherwise", and records the contradiction
as a finding whatever the run does.

The fix is to make the two passages say one thing: a present doc-system is
left intact as content and is refreshed as structure — missing fixed sections
added, diverged fixed-text sections offered for replacement — and the
per-artifact bullet should say so instead of "add only around it".

Related: req-1a2b, design-c1d2, decision-281f, issue-ad1a, issue-e19f.

Resolved by the kisou refresh design spec of 2026-09-11, fixed input 5: the
`none` / `partial` / `full` class says what is absent and sets no scope; the
scope is the user's pick, and a doc-system inside the scope gets the
instrument's proposals whatever its class. Measured on 2026-09-11: the class
was `full`, stated before scope was asked; the run did not narrow the scope
on its own; and the two `replace` items were proposed in the docs-only scope
the user picked — `docs/reports/2026-09-11-kisou-refresh-dogfood.md`. The fix
wave's P10.1–P10.4 removed the last sentences in `skills/kisou/SKILL.md`
that prescribed a scope from the class.
