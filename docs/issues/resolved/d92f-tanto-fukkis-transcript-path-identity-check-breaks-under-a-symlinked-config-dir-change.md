---
id: "d92f"
title: "`/tanto fukki`'s transcript-path identity check breaks under a `CLAUDE_CONFIG_DIR` change, even when the file is identical"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-09-23
---

Source: inbox 2026-09-14-fukki-config-dir-mismatch

Expected: `SKILL.md`'s Resuming self-check ("run `ListAgents` once; find the
roster row whose Transcript column is this session's own transcript path")
to recognize a resumed session even across an editor/window restart.

What happened: a machine running two config profiles whose `projects/`
directories are the **same directory via a symlink**, so a session's
transcript file is physically identical regardless of which profile is
active. But `SKILL.md`'s formula for "this session's own transcript path" is
`<config dir>/projects/<project slug>/<session id>.jsonl`, computed from the
*currently active* `CLAUDE_CONFIG_DIR`. When a window's `CLAUDE_CONFIG_DIR`
changed mid-session from one profile to the other (no session restart, same
`CLAUDE_CODE_SESSION_ID`), the computed path no longer matched the roster's
stored Transcript column as an exact string, even though the two paths name
the same inode. Every peer of the reporting run (Kanri, Sekkei, Jisso, and a
separate repository's own Kanri) hit the same mismatch independently and had
to be manually walked through it by the human — the protocol gave no path
search or fallback logic for this case, so Kanri had to actually inspect the
environment and compare the two project directories to conclude it was safe
to treat the sessions as resumed rather than orphaned.

This repository's own run independently hit the identical symptom the same
day, on the same kind of profile-switch event — see this repository's
`.tanto/roster.md` Events section, the 2026-09-14 `resumed:` lines for
Kanri and Sekkei, for a second data point.

## Reproduction

Not a single command — the sequence:

1. Start a tanto Kanri session with `CLAUDE_CONFIG_DIR` resolving to one
   profile; note its transcript path in the roster.
2. Without restarting the session (same `CLAUDE_CODE_SESSION_ID`), have the
   environment's `CLAUDE_CONFIG_DIR` change to a different directory whose
   `projects/` subdirectory is a symlink to the first one's.
3. Run `/tanto fukki`. The self-check computes a transcript path under the
   *new* config dir, which is an exact-string mismatch against the roster's
   stored path even though the filesystem shows they are the same file.

## Where seen

Reported from the `ellmx` repository, and independently in this repository
(Kanri and Hosa) the same day — `SKILL.md`, the "Resuming" section (the
transcript-path formula and the match logic), and "The transcript reading"
section (the same formula); role or mode: Kanri, mid-topic, `/tanto fukki`
and the peer-side re-handshake-by-transcript-match logic Kanri applies to a
peer's handshake.

## Proposed fix

No single fix is obviously right, so this is reported as a finding to weigh,
not a prescribed patch:

- Resolve both the computed path and the stored path through the filesystem
  (symlink/junction resolution) before comparing, so a symlinked config dir
  doesn't break the match; or
- Fall back to a weaker signal — the same `CLAUDE_CODE_SESSION_ID` embedded
  in the transcript filename itself — when the full path doesn't match but
  the filename does; or
- Simply document the failure mode ("if your machine runs more than one
  config profile sharing `projects/` via symlink, a config-dir change
  mid-session will read as `/tanto fukki` finding no matching row — check for
  that before concluding the session is new") so a future Kanri recognizes it
  in one read instead of re-deriving it.

Reporter: `ellmx-fd [05a76d]`, repo `ellmx` (a sibling repository on the same
machine), 2026-09-14
(`.tanto/inbox/2026-09-14-fukki-config-dir-mismatch.md`).

## A third data point, 2026-09-14

Measured during the `tanto-context-ceiling` spec work, after an editor
restart:

- The config directory had moved to `.claude-priv`.
- The session's transcript existed under **both** config directories at the
  same size — the same file seen twice, which is the symptom above in its
  plainest form: the path differs and the file does not.
- The `agents/` directory under the new config directory held no
  `tanto-*.md`, so a resumed session's dispatches run without the agent
  definitions until a fresh session writes them. That half is issue-7c39
  (resolved); it is recorded here only because both halves were observed in
  the same event, and a future reader hitting one should expect the other.

## A fourth data point, 2026-09-17, from this repository's own run

An editor restart moved this session's own config directory display to
`.claude-priv`; `ListAgents` showed a new name for every session in the
run at once. Rather than recompute a fresh transcript path under the new
config dir and string-compare it against the roster's stored (`.claude`)
path, this Kanri sidestepped the mismatch by checking both directories
directly: `.claude-priv/projects/<slug>/` and `.claude/projects/<slug>/`
listed the same file (`c0f44500-....jsonl`), same size, same mtime, and
the personal `tanto.json` and `agents/` under both paths were byte-identical
— confirming the same underlying directory reached by two names (a
junction, on this evidence, though not confirmed by a reparse-point query).
Treating the roster's stored path as ground truth and verifying it still
existed and was still growing was enough to conclude "still the same
session, resumed" without ever needing the two paths to string-match. That
manual side-step is itself evidence for the first proposed fix above
(resolve both paths through the filesystem before comparing) over the
"weaker signal" alternative — the session id embedded in the filename was
available and unchanged throughout, but the ground-truth check that
actually worked here was the roster's own path plus growth over time, not
that filename.

**2026-09-22, `tanto-bg-seats` — narrowed to tab seats.** The landed design
gives a spawned seat its `sessionId` as identity, read from the spawner's own
result files (decision-8320), so a terminal seat is re-identified across a
restart without the transcript path entering the comparison at all. What is left
of this issue is the tab seats the human opens — Kaiseki, and any seat a human
resumes by hand — where `/tanto fukki` still matches by transcript path and
still breaks when `CLAUDE_CONFIG_DIR` changes under an identical file. The two
proposed fixes stand as written for that narrower case.

Resolved by the bg-seat-ergonomics design
(`docs/superpowers/specs/2026-09-23-bg-seat-ergonomics-design.md`, 2.1 and
2.6), for the tab seats too: the match is the Transcript column's basename,
the `sessionId`, which is the same under either spelling of the config
directory, and neither proposed fix is needed. After an editor restart a tab
seat needs no `/tanto fukki` at all — Kanri's census finds it under its new
name — and one typed there matches by the same basename.
