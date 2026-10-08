---
id: "42fc"
title: a seat's measured effort changed across an editor restart with no `/effort` typed
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-20
updated: 2026-10-08
---

Source: shoroku tanto-diet S-12

Measured on `tanto-diet`'s Sekkei seat: the seat's effort read `high` before an
editor restart and `xhigh` after it, on the same transcript, with no `/effort`
typed in that window by the human's own report. The roster now records `xhigh`
against a configured `high`, so the effort check reads as a mismatch nobody
caused.

Two candidate causes, neither established from one observation: a resume
changes the per-turn effort the harness records, or the human's setting differs
across editor restarts. Which one holds is a question for the next observation
of the same shape — a seat whose effort is read on both sides of a restart.

Until then, an effort mismatch found at a handshake or a boundary that follows
an editor restart is worth checking against this issue before it is reported as
a seat running on the wrong setting.

**2026-09-24, `bg-seat-ergonomics` and a received report — the resume claim
was never measured, and two more mismatches** (shoroku bg-seat-ergonomics
S-36, from batch-B-report.md; inbox
bug-report-jisso-effort-mismatch-on-resumed-windows). The claim that a
flag-less resume keeps a seat's effort has never been supported: the
bg-seat-ergonomics design's own by-hand probe listed the options a resume
restored as `--name`, `--settings`, `--model`, and `--permission-mode`, with
no `--effort`, and that plan's measurement task could not re-measure it,
since a workspace-trust refusal stopped it before the resume step
(issue-cd67). The two facts compound rather than duplicate. A report received
from another repository adds two same-role instances in one Kanri tenure,
both Jisso seats configured for `xhigh`: one resumed after an apparent
editor-wide restart reported `medium`, and one created fresh in a window the
human opened by hand reported `high`. Both were handled per protocol — noted
to the human, the roster row written with the effort that runs. The report
asks for an investigation, not a fix: whether `/effort` has a per-role default
that differs from `sessions.<role>.effort`, or whether a resumed or fresh
window's effort resets to something other than the profile the human last
set.

Carrier topic: `park-in-flight` (roster-ledger's close, 2026-10-08).
