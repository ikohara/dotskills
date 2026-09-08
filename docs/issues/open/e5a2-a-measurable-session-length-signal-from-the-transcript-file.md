---
id: "e5a2"
title: a measurable session-length signal from the transcript file, for Kanri and its peers, and post-compaction claims as unverified
severity: medium
depends_on: []
blocks: ["40ed"]
claimed_by: null
claimed_at: null
created: 2026-09-07
updated: 2026-09-07
---

Reported to the intake on 2026-09-07 by the Kanri of a repository trialling
`tanto` (the s2-paper-picker v1 UX batch run), through the human. The
handover trigger in `roles/kanri.md` and the "Jisso context decay" row of
the Replace table are meant to let Kanri act before a session degrades, but
the only self-visible signal the skill names is a compaction already
noticed, which is after the fact; the `tokens left` figure is rightly ruled
out; the residency counters have no threshold (issue-40ed); and Kanri cannot
see whether a peer has compacted except through the peer's own report.

The case that made it urgent: a human-in-the-loop session in that run
compacted after about six hours, and two minutes before the compaction it
fabricated a user turn — a predicted human reply, an invented observation,
and a fake system reminder. The compaction summary then carried the
fabrication as the human's words, and the session, its Kanri, and a research
subagent acted on it until the human doubted it. The fabrication is the
harness's and the model's, not the skill's; what the skill can do is see the
compaction coming and distrust what follows it.

The reporter's measurements, all read-only:

1. `tokens left` is a per-turn budget: it reset to the same figure after
   every human message and decreased only within a turn. It says nothing
   about the context window (the same conclusion as issue-40ed's data point).
2. A session can stat its own transcript. The session id is the last path
   segment of the scratchpad directory the system prompt names, and the
   transcript is `<config dir>/projects/<project slug>/<session id>.jsonl`.
   Measured: a fresh Kanri at 1.8 MB and 484 records after about 50 minutes,
   no compaction; the human-in-the-loop session at 4.3 MB and 2,164 records
   after about six hours, one compaction. Caveats: a compaction does not
   shrink the file, tool results persisted to disk count at full size, and
   JSON overhead roughly doubles the bytes.
3. A peer's compaction is visible in its transcript as a `type: user` record
   whose text begins "This session is being continued from a previous
   conversation". Kanri finds a peer's file by the name the handshake
   carried. A plain string grep over-counts (the string also appears in tool
   output that quotes it), so the check is on the record type and the text
   prefix.
4. `ListAgents` shows name, ref, kind, and time since start only — no size,
   no cwd, no compaction state.

Proposed, from the report, for the plan that takes this up:

1. **Kanri detects a peer's compaction itself.** At every boundary, Kanri
   locates each live role's transcript and reads whether a compaction record
   exists and the file's bytes and record count. A compaction in Jisso's
   transcript is the Replace table's "context decay" symptom without waiting
   for a report to say so; one in Kanri's own transcript is the existing
   trigger, confirmable from a file instead of from introspection.
2. **The roster's Residency line carries the measurements** per live row —
   bytes, records, compactions, and the boundary at which they were read —
   so that issue-40ed's threshold can be chosen from data across runs. Until
   then the line stays informational, as the skill already says.
3. **Post-compaction claims are unverified.** A session that compacts
   re-reads the summary's human-attributed rulings and observations with the
   human before acting on them; Kanri treats a report claim of the form "the
   human saw X" or "the human ruled Y" that postdates a compaction as
   unverified until the human confirms it in Kanri's own window, and files
   no severity-high issue on it alone.

Open: whether reading a peer's transcript is within a session's permission
class on every host (the path is under the user's config directory, outside
the repository); whether the byte and record counts are portable enough
across hosts and harness versions to carry a threshold; and where the
compaction record's text prefix is defined, since the check breaks silently
if the harness rewords it.

Related: issue-40ed (blocked by this: its threshold needs this signal's
data), issue-77a1 (resolved; the residency line and the trigger),
issue-f801 (the handover's wait), decision-de63 (the trigger set, which
deliberately excludes the token figure).

Measured 2026-09-09 by the resident Kanri, with the transcript method above,
over six sessions of two plans (kanri-lifecycle, boundary-rules): the Kanri of
the first compacted at 8.6 MB, 3,082 records, and 618 user records — the
wake-ups, one per human message, peer message, or idle notice — over two
days; its successor reached 5.3 MB, 1,993 records, and 394 wake-ups in 1.7
days with no compaction; a Sekkei ran 4.6 MB and 377 wake-ups per plan, a
Jisso 3.5 to 4.5 MB and about 200 wake-ups per plan. Two things follow. The
wake-up is the cost unit: every one re-reads the session's whole context as
input, so a long-lived Kanri pays its context size on each notice. And of the
successor's 394 wake-ups, 81 were idle notices against 77 peer messages, most
of the notices false idles (a peer had dispatched a subagent and its turn
ended) carrying no information — the subscriptions roughly doubled the cost
for nothing, and the review-brief plan drops them (its spec input I-4). The
report's own warning reproduced: a plain grep for the compaction phrase
matched once in the successor's transcript, on a quoted string inside a shell
command, and that session was never compacted. The human lowered effort from
extra high to high on the Kanri and Sekkei sessions on 2026-09-09; the effect
is not yet measured.
