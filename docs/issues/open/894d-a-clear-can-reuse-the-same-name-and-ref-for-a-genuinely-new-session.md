---
id: "894d"
title: a /clear can reuse the same name and ref for a genuinely new session
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-09-20
---

Source: session 2026-09-14

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

A third role type, 2026-09-15: jisso. Previously measured only for kikaku
and hosa this run. The `dotskills-0d` Kanri's own Jisso handshake arrived
twice under the identical name and ref `dotskills-5f [c4288d]` — first with
`effort=high` (a mismatch against `sessions.jisso.effort=xhigh`, flagged to
the human), then, after the human deleted and recreated the session, again
under the same name and ref with a wholly different transcript and
`effort=xhigh` this time. `ListAgents` gave no signal distinguishing the
two — only the transcript path in the second handshake's own envelope did.
So the pattern is not particular to a long-lived, human-driven role
(kikaku/hosa); it reproduces just as readily for a role created and
destroyed within one boundary. One more thing this case shows: this issue's
own title says a `/clear` can reuse the same name and ref, but the jisso
case was not a `/clear` — it was a deletion followed by a new session. The
title's scope is now known to be too narrow: the pattern is identity reuse
across any delete-and-recreate, of which `/clear` is one way, not the only
way.

**2026-09-18, `seat-lineage` — a second site, and its fix on that branch.**
`roles/kanri.md`'s "Kept Kanri" start case compared `name [ref]` only, which
under this issue's identity reuse no longer distinguishes a kept session from a
`/clear`ed one. The consequence was not cosmetic: the peers' held-line rule
(`no-role`, then wait for `kanri-address:`) would then have had no sender,
because the new Kanri would have believed itself the kept one and sent
nothing.

Resolved on that branch by the fix wave, which added a **transcript-column
check** to the start case — the same identity this issue has said all along is
the only one that distinguishes the two. Recorded here rather than filed
separately, since the consequence is fixed and the premise is this issue's.

**2026-09-20, `bug-report-hold` — a collision within one run, and the key any
future mechanism must use.** A Kanri tenure found its own bare name and `[ref]`
already on the roster at its start, as a `replaced` row with a **different**
transcript. Not a resume: the transcripts differ and the earlier row was
already `replaced` before this session existed. So the same bare name *and* the
same `[ref]` were issued to two genuinely different sessions inside the
lifetime of one run.

`SKILL.md`'s Handshake section calls the `[ref]` "load-bearing: it identifies a
session across the listing, the roster, and the handover", and here it did not.
Nothing depended on the collision going unnoticed — the handover procedure's
own transcript-path comparison caught it correctly, which is the same check the
`seat-lineage` fix wave added above. The point for a future mechanism is the
key: `(name, transcript)`, never `[ref]` alone.
