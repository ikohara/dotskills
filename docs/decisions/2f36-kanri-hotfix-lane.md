---
id: "2f36"
title: Kanri may edit and commit a skill file outside a plan, the hotfix lane
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: ["1ab5"]
created: 2026-09-07
updated: 2026-09-13
---

## Context

req-04f5 requires that trouble reports reach the repository's Kanri and that
Kanri answers them, including by fixing when the fix is small and no batch is
in flight. The tanto design of 2026-09-06 gave Kanri no source file of its
own: every edit to a skill went through a plan, and Kanri wrote only the
roster, the ledger, prompts, and `docs/`. A one-line fix would then wait for
the next plan's small-fixes batch, or cost a plan of its own. The shape of
the lane was settled between Sekkei and Kanri on 2026-09-07 as three
deviations from the intake proposal, which the human approved.

## Options

- **Every fix through a plan.** Byte-exact plan alignment stays untouched;
  one-line fixes wait, sometimes for days.
- **A hotfix lane for Kanri**, open only while no batch is in flight, never on
  a file the in-flight plan lists, one commit by explicit path, no issue.
- **A separate fixer role.** One more session and one more handshake for
  work that is one line.

## Decision

The hotfix lane. Kanri edits the skill file directly, runs lint on the changed
paths by name and the README drift review if `SKILL.md` changed, commits once
by explicit path with the trailer, and records a ruling. It is open only
between batches, in Kanri's slot of the boundary's commit window, or between
plans; and never on a file the in-flight plan lists in its file structure,
because such a plan carries that file's complete final content and a later
task would overwrite the fix. No issue is filed: the commit is the durable
record, so its subject names the symptom and its body names where the report
came from, and hotfixes are carried forward, from the roster's Events into
the next ledger and from there into the next dogfood report, so they reach
`docs/` once. A fix to a plan-listed file takes one of three paths: a
cold-read question to Sekkei while a rewriting task is still ahead; the
whole-branch review's single fix wave when only the final batch remains; an
issue otherwise.

## Consequences

- Kanri becomes the one role that edits source outside a plan; rule 5's "no
  tracked-file edit while a batch runs" is unchanged.
- A hotfix on a plan branch rides with the branch and is named in Kanri's
  merge question; between plans it lands on `main`, never pushed.
- Without an issue, `git log` is the only durable record of a hotfix until
  the next dogfood report; that is the price of not filing ceremony for one
  line.
- design-4807's picture of Kanri as a role that owns no source file is
  reversed at the next design write-out.
