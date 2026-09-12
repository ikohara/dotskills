---
id: "0b97"
title: tanto keeps its own state under `.superpowers/sdd/`, coupling it to superpowers by location and forcing the ledger move; a self-ignored `.tanto/<topic>/` is the shape it wants
severity: medium
depends_on: []
blocks: []
claimed_by: "tanto-workspace plan (Kanri dotskills-b4)"
claimed_at: 2026-09-12T05:15:00Z
created: 2026-09-11
updated: 2026-09-12
---

tanto composes superpowers skills but is not meant to depend on them: another
skill may write the spec or the plan, and the contract says so nowhere. Today
it is coupled to superpowers in three places, and only one of them is
tanto's own choice.

- The SDD skill's `sdd-workspace` script writes
  `.superpowers/sdd/<plan-basename>/progress.md` and the `.gitignore` holding
  `*` beside it. That is superpowers' state, and it stays where superpowers
  puts it.
- The spec and the plan live under `docs/superpowers/specs/` and
  `docs/superpowers/plans/`, superpowers' writing-plans convention.
- Every artifact Kanri, Sekkei, Jisso, and Kaiseki write for tanto itself —
  the roster and its archive, the conductor ledger, `spec-inputs.md`,
  `dialogue.md`, the review briefs, the dry run, the batch prompts and
  reports, the Kaiseki briefs and reports, the shoroku proposals and
  directions, the exit files, the compaction files, the inbox, the handover
  — sits in the same tree, first under `.superpowers/sdd/<topic>/` and then
  under `.superpowers/sdd/<plan-basename>/`, because the design put Kanri's
  files "next to Jisso's `progress.md`". That third coupling is the one this
  issue is about.

Raised by the human on 2026-09-11, during the kisou-refresh run: "superpowers
に依存しているわけじゃない、という認識なんだけど（他の skill で設計、計画して
もいい）、それなら たとえば `<workspace>/.tanto` 以下を vcs ignore して使うとか
の方が筋のような。"

The shape that follows: tanto's own state under `<workspace>/.tanto/<topic>/`,
with `.tanto/.gitignore` holding `*` — the same self-ignoring trick the SDD
workspace uses, so the repository's own `.gitignore` is not touched and no
approval under AGENTS.md is needed — and, beside it, a
`.tanto/.markdownlint-cli2.yaml` that disables every rule
(`config:` / `default: false`), the human's addition of 2026-09-11: the
editor's markdownlint extension otherwise flags every ledger and report in
the workspace (the `<...>` placeholders of the templates trip `MD033` on
every line they sit on), and the untracked `.superpowers/sdd/` carries the
same file today, placed by hand and by nobody's rule. Kanri writes both files
at its start when they are absent, as it writes the `.gitignore` now. The
roster, its archive, the inbox, and
the handover sit at `.tanto/`; everything per topic under `.tanto/<topic>/`
from the topic's opening to its close. The superpowers artifacts are reached
by pointer from the conductor ledger's Plan section, as the SDD ledger already
is. Two consequences fall out:

- The ledger move from `<topic>/` to `<plan-basename>/` disappears, and with
  it the "topic directory beside the plan directory" state issue-12d3 had to
  rule on — one directory per topic, named by the topic word. This is
  issue-f2c4's motivation resolved from the other side.
- The spec's and the plan's paths become what Kanri's orders line names
  rather than a fixed `docs/superpowers/...` — the contract's Artifacts table
  says "the spec, at the path the orders line names", so a spec or plan
  written by another skill needs no change to tanto.

The change touches every path in `SKILL.md`, the four role files, and the
templates, so it runs under contract rule 11. The human's preference is a
plan of its own before the Keikaku split (issue-3c7a), whose scope is already
large; the two are independent.
