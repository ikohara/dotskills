---
id: "1298"
title: a consuming repository resuming under an upstream skill revision has no migration rule
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-20
updated: 2026-10-03
---

Source: inbox 2026-09-15-tanto-skill-revision-mid-plan-no-migration-rule

When a run resumes after an editor restart and the tanto skill on disk has
changed underneath it, `/tanto fukki` should say which contract and which
layout the run is on, and how a run on the old layout reaches the new one. It
says nothing: it "reads this file and nothing else".

Measured by the reporter. A batch was in flight under the skill as it stood on
2026-09-11 — roster and ledger under `.superpowers/sdd/`, the old role text in
every session's context, personal defaults. On the 2026-09-14 resume the skill
on disk was a revision: the `.tanto/` layout, the Keikaku / Kikaku / Hosa
roles, `reading.js` with a ceiling, twelve agent definitions, new default
families. The run had to rule its own bridge — stay on the old authority
mid-batch, migrate the roster and topic files to `.tanto/` and hand Kanri over
at the next boundary — and every resumed peer handshaked with a model the
revised defaults no longer expect.

Proposed: at `/tanto fukki`, compare the roster's location against the
contract's expected location; when they differ, say so in the start line and
name the bridge — the run stays on the authority it started under until the
next boundary of the topic in flight, where Kanri migrates the files and hands
over, and peers resumed under the old role text are not refused on the new
defaults.

Why this is not covered by the rule-11 issues already filed: rule 11 is about
*this* repository's own plans editing the skill its sessions run. A consuming
repository resuming under a revision it did not make is the case none of
issue-11db, issue-28f2 or rule 11 itself names.

**2026-10-01, the same gap from the other direction: the branch behind, not
the copy stale** (shoroku experience-layer S-75). The skill the sessions load
is a symlink into the working tree, so a topic branch cut before a skill
change runs the older contract. On 2026-10-01 a start line on
`experience-layer` reported the personal file's `language` key as unknown,
because `SKILL.md` and `reading.js` on that branch predate the commit that
added the key on `main`; a Hosa whose context held the newer text read the
same file as valid and asked whether it was a stale copy. The branch was
behind, not the copy, and it resolved at the merge. The proposed line, for
this issue's resolution: say in the skill's documentation that the contract
a session reads is the checked-out branch's, which a long-lived topic branch
can lag — or have the start line name the commit of `SKILL.md` it read.

Assigned to 09c2-upgrade (tanto-issue-triage, 2026-10-03).
