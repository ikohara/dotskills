---
id: "7e21"
title: tanto's own state is decoupled from superpowers by location
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: []
created: 2026-09-12
updated: 2026-09-12
---

## Context

The first tanto design put Kanri's files "next to Jisso's `progress.md`", so
every file tanto writes for itself — the roster and its archive, the conductor
ledger, the spec inputs and the dialogue, the briefs, the dry run, the batch
prompts and reports, the Kaiseki files, the shoroku proposals and directions,
the exit and compaction files, the inbox, the handover — sat under
`.superpowers/sdd/`, the SDD skill's workspace. Three consequences accumulated
(issue-0b97, issue-f2c4, issue-6aa8): a coupling to superpowers by location
that nothing in the contract asks for, since another skill may write the spec
or the plan and the SDD ledger is the only superpowers artifact tanto reads;
two directories per topic — `<topic>/` before the plan lands and
`<plan-basename>/` after — with a ledger move between them that every Kanri
performed and every path spelling had to follow; and a roster whose path was
not fixed, so a bug-report sender in another repository could not read the
intake's address and the human relayed Kanri's name by hand (issue-b7d3).
req-04f5 requires that tanto composes the skills it uses without modifying
them, that state lives in files, and that trouble reports reach the
repository's Kanri.

## Options

- **Stay under `.superpowers/sdd/`** and keep the ledger move: no work, the
  three consequences kept.
- **`<workspace>/.tanto/`, fixed, one directory per topic, self-ignored and
  self-lint-silenced** by a `.gitignore` of `*` and a `.markdownlint-cli2.yaml`
  of `config:` / `default: false` that tanto writes itself; the SDD ledger,
  the spec, and the plan stay where their skills put them and are reached by
  the path Kanri's orders line names, by default the superpowers convention.
- **A configurable location** through a `tanto.json` key: rejected, because
  the lookups that must work with no configuration in hand — `/tanto resume`,
  a role started without an address, a bug-report sender — all read the
  roster's first row at a path they must already know.
- **A tanto-native `docs/tanto/`** for the spec and the plan as well: rejected,
  because it widens the location coupling from `.superpowers/sdd/` to
  `docs/superpowers/`, needs a linter-configuration edit and a `docs/AGENTS.md`
  addition, and diverges from where brainstorming and writing-plans write by
  default.
- For the migration, three choices of what moves and when: live state only,
  at the boundary of the batch that lands every file a session loads (taken);
  the archive alone with a fresh bootstrap (splits the archive's history and
  the inbox across two places); every old directory (symmetry and nothing
  else). Moving at the plan's close, or before that batch, leaves a window in
  which the loaded text names `.tanto/` and the state is elsewhere, or the
  reverse.

## Decision

Everything tanto writes for itself lives under `<workspace>/.tanto/`,
self-ignored and self-lint-silenced, one directory per topic from the topic's
opening to the plan's close, so that nothing moves when a plan lands and the
roster sits at a fixed path a bug-report sender can read the intake's address
from. The artifacts of the skills tanto composes are reached by pointer; the
spec's and the plan's default location stays the superpowers convention, and
`<plan-basename>` survives only in the SDD ledger's own path. The location is
fixed, not configurable. The migration that accompanies the text change moves
live state only — the roster, its archive, the inbox, Kanri's exit proposals,
and the open topic's directory — at the boundary of the batch that lands every
file a session loads; the records of closed plans stay where they were.

## Consequences

- The ledger move disappears from Kanri's plan-landing step, and the topic
  word and the plan basename no longer name two directories.
- A reporter in another repository reads the intake's address from the target
  workspace's roster and asks the human only when that address is stale
  (req-04f5's trouble-reports bullet, 2026-09-12); the route's detail is
  design-4807's, written when the text lands.
- The records of the plans closed before the migration stay under
  `.superpowers/sdd/`, read-only; a later re-read looks in two places.
- decision-de63 and decision-ace0 name the old paths in their bodies. They
  are not amended: an ADR body is as-of-then, and the current shape is
  design-4807's to state (a rule the `kisou` document system does not yet
  spell out; filed as an issue).
- The plan that lands this text edits every file the run's own sessions load,
  so contract rule 11 applies; its boundary is the batch that lands the loaded
  files, on the reading recorded in design-4807 rather than by amending
  decision-5c8e, which the human chose at the spec review.
- Related: req-04f5, decision-5c8e, decision-de63, decision-ace0,
  issue-0b97, issue-6aa8, issue-f2c4, issue-b7d3, issue-12d3, and the
  tanto-workspace design of 2026-09-11.
