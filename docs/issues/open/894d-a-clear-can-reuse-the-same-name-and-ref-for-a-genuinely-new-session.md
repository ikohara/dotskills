---
id: "894d"
title: a /clear can reuse the same name and ref for a genuinely new session
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-09-14
---

After a local `/clear` followed by `/tanto hosa` in this run, `ListAgents`
reported the identical name and ref (`dotskills-b0 [27f77c]`, "started 4h
ago") for the fresh session, even though its transcript was a brand-new,
different, smaller file (the session id had changed). This is not a resume:
`SKILL.md`'s Resuming section expects a **new** name and ref when a session
comes back under a changed transcript path, and the roster's keeping rule
distinguishes a resume (transcript match, row rewritten in place) from a
fresh session (transcript does not match, old row marked `cleared`, new row
written) by that same signal. Here the transcript changed but the identity
did not — the opposite of what both mechanisms assume.

Contrast observed minutes earlier in the same run: Kikaku's own `/clear` +
`/tanto kikaku` got a brand-new name and ref (`dotskills-2b [224104]` →
`dotskills-2a [de54ef]`) for the analogous case. Two `/clear`s, same
session, same machine, same day, opposite identity-reuse behavior.

Not diagnosed to a cause — this looks like harness-level name/ref
assignment, outside the skill's control. Severity is low because the
roster mechanics already handle both outcomes correctly today (a
transcript-match resume, or a fresh `cleared`-status row); the risk is
narrower: a Kanri that assumed name and ref always change after `/clear`
would misjudge this case as a stale or refused duplicate handshake instead
of accepting it as the reporter's own fresh session.

Reproduction is not a fixed command sequence — it was observed twice in one
run with opposite results. Both instances are recorded in this
repository's own `.tanto/roster.md` Events for 2026-09-14: kikaku
`dotskills-2b [224104]` → `dotskills-2a [de54ef]`, and hosa
`dotskills-b0 [27f77c]` → `dotskills-b0 [27f77c]` (same ref, new
transcript).
