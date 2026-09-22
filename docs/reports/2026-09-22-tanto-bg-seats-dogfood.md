# The tanto-bg-seats dogfood

This report covers the `tanto-bg-seats` plan's dogfood run: the rewrite that
moves every seat whose work is not dialogue with the human into a background
session started, stopped, and resumed by an instrument of the skill's, leaving
the human to open only the seats that talk to them. It records the measured
facts of that run which belong to a dated, frozen record rather than to a
living note — the re-measurement that makes the spec's own figures citable,
four recovery cases, the costs the run paid outside its own protocol, the
costs it did not measure, one open question it hands to a later Kikaku, and
the run's residency readings.

## The spec's Measured figures, re-measured

The spec reviewer re-ran the spec's Measured 4, 5, and 7 figures on
2026-09-20 — `wc -c`, `grep -c`, and one `grep` per term over
`docs/issues/open/`, against 246 open issues — and all three reproduced
exactly, which is what makes those figures citable from outside the spec.

## Recovery

Four resume cases, each from a different cause, all clean.

**An uncontrolled OS reboot.** This run carried a real, uncontrolled OS
reboot — not a simulated `/clear` — through to full recovery via `/tanto
fukki`, for both Kanri and a Jisso, with no roster or ledger corruption. Both
resumed sessions kept their transcripts and were matched by transcript path
alone. This is the first time in the run's history that the resume mechanism
was exercised by an event outside anyone's control rather than by the human's
own `/clear`.

**What that reboot cost.** Recovery completed within roughly 17 minutes of the
affected window's own last pre-reboot activity, with no data loss beyond the
one uncaptured pre-reboot checkpoint. A full-plan reboot mid-batch is
survivable, at a real, non-trivial cost in wall-clock time and in the one
measurement window it collapsed.

**An editor restart mid-dispatch.** An editor restart happened mid-turn, while
Kanri's own `boundary.verify` dispatch for batch D was in flight. Every seat
came back at once under new names on the *same* transcripts — Kanri
(`dotskills-39 [e78b52]` → `dotskills-6f [bf4376]`), Hosa (`dotskills-65
[29b568]` → `dotskills-a0 [ea5a16]`), the live batch-D Jisso (`dotskills-43
[3e744d]` → `dotskills-99 [25ed24]`), and the one remaining queued Jisso
(`dotskills-9d [f72029]` → `dotskills-db [472f49]`) — and every one
re-handshook correctly, matched by transcript path alone, with no
`human-needed:` step and no data loss. A second clean full-recovery data point
after the reboot case, this time without any of the human's-hands steps a
reboot recovery needed.

**The mid-queue case.** One of the sessions that restart resumed was a Jisso
still `queued`: it was resumed before any batch prompt had reached it, with no
`progress.md` state of its own to recover, and only then received its one
batch, the fix wave. `SKILL.md`'s Resuming section covered this cleanly with
no special handling — a case distinct from the other two resumes of this run,
which each resumed a session mid-batch rather than mid-queue.

## What the run cost outside its own protocol

The harness's own auto-mode permission classifier refused a plain recursive
delete of an independently-verified-dead scratch directory twice, with two
different stated reasons ("Interfere With Workloads", and then "Irreversible
Local Destruction" on a mere re-check `ls`). The effect was that the
classifier blocked a Jisso from completing the same class of cleanup that task
9 had completed unassisted one batch earlier, turning what had been a
same-session ruling into a cross-session human-needed round trip. This is not
a defect in tanto's own protocol — the protocol's escalation path is exactly
what absorbed it — but it is a real cost this run paid, and it is counted
here.

## What was not measured

- The spawner's census polls `claude agents --json` every fifteen seconds; the
  cost of that process on the machine is unmeasured.

## Open questions this run hands on

The fix-wave batch prompt was authored by dispatching the `plan.draft` kind —
normally Keikaku's, for the plan itself — rather than a kind of its own,
because no `tanto.json` kind names "Kanri drafts a batch's task content
directly, outside the plan document." It read the whole-branch review and the
ledger's own rulings and produced a well-scoped, independently-checkable
four-task breakdown, coverage table included, on the first pass. Whether that
deserves a dedicated kind, or whether reusing `plan.draft` for any
Kanri-authored task-drafting is the intended pattern, is a question for a later
Kikaku; nothing here decides it.

## Measurements

The run's residency readings, assembled at the close from the topic ledger's
own Measurements table — the topic's authoritative, complete reading list —
and from the roster's Residency rows for the sessions that carried them. A
reading present in the ledger's Measurements line but not separately captured
in the roster's own Residency table is marked `—` in the four detail columns,
with only its `context=` figure carried; the roster under-recorded several
boundaries (batch A2, batch B1's Jisso, and batch B2's Kanri handover-written
reading) that the ledger caught in full, which is itself worth a data point.

| Role | Topic | Name [ref] | Since | Read at | Bytes | Records | Wake-ups | Compactions | Context | Batches | Plans | Noticed |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| kanri | — | dotskills-10 [58f333] | 2026-09-20 | topic opened | — | — | — | — | context=175641 | — | — | — |
| kanri | — | dotskills-10 [58f333] | 2026-09-21 | plan landed | — | — | — | — | context=250301 | — | — | — |
| kanri | — | dotskills-10 [58f333] | 2026-09-21 | handover (plan stage, deferred) | — | — | — | — | context=274897 | — | — | — |
| kanri | — | dotskills-10 [58f333] | 2026-09-20 | handover (plan stage, `tanto-bg-seats`) | 1846342 | 589 | 13 | 0 | context=280500 | 0 | 0 | 0 |
| kanri | — | dotskills-10 [58f333] | 2026-09-21 | handover accepted | 735389 | 99 | 4 | 0 | context=137188 | 0 | 0 | 0 |
| kanri | — | dotskills-10 [58f333] | — | batch A1 | — | — | — | — | context=314073 | — | — | — |
| kanri | — | dotskills-10 [58f333] | — | batch A2 | — | — | — | — | context=348397 | — | — | — |
| kanri | — | dotskills-10 [58f333] | 2026-09-19 | batch B1 | 2484017 | 802 | 14 | 0 | context=372678 | 3 | 1 | 0 |
| kanri | — | dotskills-39 [e78b52] | — | batch B2 (handover written) | — | — | — | — | context=490250 | — | — | — |
| kanri | — | dotskills-39 [e78b52] | 2026-09-21 | handover accepted | 1086985 | 185 | 4 | 0 | context=196064 | 0 | 0 | 0 |
| kanri | — | dotskills-39 [e78b52] | — | batch B3 (deferred) | — | — | — | — | context=245749 | — | — | — |
| kanri | — | dotskills-39 [e78b52] | — | batch C (handover written) | — | — | — | — | context=315888 | — | — | — |
| kanri | — | dotskills-6f [bf4376] | — | batch C (handover accepted) | — | — | — | — | context=287271 | — | — | — |
| kanri | — | dotskills-6f [bf4376] | 2026-09-21 | handover written (batch D) | 1766329 | 428 | 8 | 0 | context=307412 | 1 | 0 | 0 |
| kanri | — | dotskills-6f [bf4376] | 2026-09-22 | batch D | 1566319 | 353 | 8 | 0 | context=282102 | — | — | — |
| kanri | — | dotskills-6f [bf4376] | 2026-09-22 | handover accepted | — | — | — | — | context=143350 | — | — | — |
| kanri | — | dotskills-6f [bf4376] | 2026-09-22 | batch fixwave | 1835491 | 408 | 7 | 0 | context=305143 | 0 | 0 | 0 |
| sekkei | tanto-bg-seats | dotskills-9d [f72029] | 2026-09-20 | spec accepted (exit) | 2675113 | 649 | 16 | 0 | context=388281 | — | — | — |
| keikaku | tanto-bg-seats | dotskills-03 [355e3e] | 2026-09-21 | coldread answered (exit) | 4340862 | 1652 | 21 | 0 | context=599300 | — | — | — |
| jisso | tanto-bg-seats | dotskills-fa [aab689] | 2026-09-21 | batch A1 | 2910521 | 775 | 16 | 0 | context=408777 | — | — | — |
| jisso | tanto-bg-seats | dotskills-b6 [b17d69] | — | batch A2 | — | — | — | — | context=339391 | — | — | — |
| jisso | tanto-bg-seats | dotskills-17 [ec6aa8] | — | batch B1 | — | — | — | — | context=427761 | — | — | — |
| jisso | tanto-bg-seats | dotskills-79 [e30537] | 2026-09-21 | batch B2 | 3081328 | 861 | 14 | 0 | context=444426 | — | — | — |
| jisso | tanto-bg-seats | dotskills-9b [254de2] | 2026-09-21 | batch B3 | 2628581 | 806 | 23 | 0 | context=359196 | — | — | — |
| jisso | tanto-bg-seats | dotskills-7b [e0db6d] | 2026-09-21 | batch C | 2241170 | 675 | 27 | 0 | context=327077 | — | — | — |
| jisso | tanto-bg-seats | dotskills-43 [3e744d] / dotskills-99 [25ed24] | 2026-09-21 | batch D | 4079468 | 1101 | 37 | 0 | context=597142 | — | — | — |
| jisso | tanto-bg-seats | dotskills-9d [f72029] / dotskills-db [472f49] | 2026-09-22 | batch fixwave | 2842294 | 807 | 27 | 0 | context=423327 | — | — | — |
| jisso | tanto-bg-seats | dotskills-db [472f49] | 2026-09-22 | T2 shoroku proposal | 3134852 | 910 | 28 | 0 | context=467328 | — | — | — |

Names joined with `/` mark a session resumed under a new name mid-batch — the
editor restart above, both readings from the same transcript; the reading
carried is the one that Jisso itself sent at that boundary or exit.
