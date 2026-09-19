---
id: "bed3"
title: "a `/tanto fukki` resume that finds an un-consumed `kanri-handover.md` should ask the human, not infer \"continue\""
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-17
updated: 2026-09-19
---

Source: inbox 2026-09-17-fukki-resume-should-ask-not-infer-continue

`SKILL.md`'s Handover section names one explicit way a due handover is
declined: "If the human says 'continue' instead of creating the successor,
delete the handover file, record the declined handover in the roster's
Events (the `<k>` counter stays), and resume." Its condition is words in
Kanri's own window.

`roles/kanri.md`'s Resuming section says nothing about what to do when a
resumed session's own roster row's Transcript column points at a session
that had already written a `kanri-handover.md` naming itself as the
outgoing session — a resumed Kanri finding its own un-consumed handover
file. Nothing in the run counts as the human's word in that moment; an
environment-wide restart is not the same event.

Reported from `kuchidome`
(bug-report-fukki-resume-should-ask-not-infer-continue, 2026-09-17): a
Kanri's ceiling crossed and it wrote a handover file; before a successor was
created, the environment restarted (the config directory also moved, see
issue-d92f) and the same session resumed under a new name via `/tanto
fukki`. It found its own un-consumed `kanri-handover.md`, and — absent any
written rule for this exact case — inferred "continue" by analogy, deleted
the file, and resumed batch work without asking. This was wrong: the
ceiling was still `over` (the same signal that fired the handover had not
gone away because the session merely restarted), and when the reporter
asked the human directly afterward, the actual answer was the opposite —
open a fresh Kanri instead.

## Proposed fix

Name the case explicitly in the Resuming section (or the Handover section):
when `/tanto fukki` finds its own roster row's Transcript matching the
resumed session, *and* `.tanto/kanri-handover.md` exists and names that same
session as the outgoing one, the resumed session should not infer
"continue" from the restart alone. It should report the situation to the
human (the ceiling figure, the handover's own Why and Next step, and the
fact that no successor was ever created) and ask explicitly whether to
continue in the resumed session or wait for a fresh one, before deleting
the handover file or doing any further work.
