---
id: "264d"
title: "the kind-names namespace under `.claude/agents/` reserves nothing"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-16
updated: 2026-09-19
---

Source: shoroku tanto-project-config

Found by the whole-branch reviewer of the `tanto-project-config` run as Minor 5
(2026-09-16) and carried as S-51 in that run's ledger.

The twelve `tanto-<object>-<act>.md` names are tanto's own namespace, and
nothing in the skill says a repository must not track a file of its own under
one of them. Now that the render step writes into `<cwd>/.claude/agents/` and
the project pass **removes** the definitions a kind no longer needs, a
repository that tracked `tanto-default.md` for its own reasons would find it
deleted at the next role start — a tracked file gone, with no ruling and no
message naming the cause.

One clause prevents it: the twelve kind names under `<cwd>/.claude/agents/` are
reserved for tanto's render step, and a repository tracks nothing there.

Distinct from issue-59c9, which observes that **`.tanto/`** is one flat
namespace with nothing reserved: this is the agent-definition filename
namespace under `.claude/agents/`, and the consequence is a deleted tracked
file rather than a directory collision.

Related: issue-e2db (the project pass measured end to end — its removal check
is the mechanism this concerns).
