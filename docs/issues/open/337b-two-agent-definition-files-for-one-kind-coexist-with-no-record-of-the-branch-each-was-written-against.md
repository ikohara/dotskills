---
id: "337b"
title: two mutually exclusive agent-definition files for one kind can coexist, because nothing records which branch's tanto.json each was written against
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-17
updated: 2026-09-19
---

Source: session 2026-09-17

A session's Start sequence writes agent-definition files from the `tanto.json`
it reads on the branch its shared tree happens to be on, and leaves no record
of which branch that was. When the shape of a kind differs between branches,
two mutually exclusive definition files for the same conceptual kind end up on
disk at once, and nothing on disk distinguishes "current for `main`" from
"current for a topic branch".

Measured 2026-09-17 on this repository. `tanto-shoroku.md` — the pre-split,
single-kind form, written by a predecessor's Start sequence while the shared
tree was on `main`, which had not landed the split — sat alongside
`tanto-shoroku-recommend.md` and `tanto-shoroku-apply.md`, the split form,
written by an earlier session while the tree was on the topic branch that had.
Each file was individually correct for the branch its writer was on;
contradictory only as a set. Nothing surfaced the contradiction: it was
discovered because a predecessor's handover carried the warning by hand
("check your own agent-type list fresh, do not assume either form") rather
than a fix. The hazard is structural — Kanri, not Jisso, moves the shared tree
between `main` and a topic branch mid-tenure for unrelated reasons, so a
session's own definition-write step cannot tell which branch's convention
governs its own dispatches.

The fix, at the named site: the Start sequence's own agent-definition write
step should record — in the roster or the ledger — which branch's `tanto.json`
a given definition file was written against, so a later session can tell
whether a stale definition is safe to leave or needs removing.

Related: issue-c3d1 is the cross-repository variant of the same underlying
hazard (one machine-shared `$CLAUDE_CONFIG_DIR/agents/` directory, no
provenance record), and issue-b7a2 is the SKILL.md-versus-template
disagreement that caused the split in the first place. They stay separate
files per the human's own instruction not to fold. Also adjacent, and also
distinct: issue-cae3 (definitions are user-scope, so a kind's effort cannot
differ by repository), issue-91fa (the harness's mid-session agent-type cache
refresh), and issue-264d (the kind-names namespace reserves nothing).
