---
id: "bdad"
title: three roster, handshake and exit-file facts the skill contract does not state
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-20
updated: 2026-09-23
---

Source: inbox 2026-09-15-roster-handshake-lifecycle-exit-guidance

Three gaps from one report, filed together because they are the same class —
a lifecycle rule the contract relies on and does not write.

- **`/tanto fukki` should compare the resumed session's model *id* against the
  row, not only its family.** One long-lived role started as
  `claude-opus-5[1m]` — the 1M-context variant, recorded in its roster row —
  and came back from a resume as plain `claude-opus-5`: session id, transcript
  and context survived, the variant did not. The expected-model gate passes
  either way, because the configured family matches both. A long-context role
  resumed into a smaller window is a failure mode the roster row alone hides.
- **A role that expects a successor has no named place for "for the successor"
  notes, and no orders line points an incoming session at one.** The shape that
  worked in practice: a read-this-in-this-order list, then the state at
  handover, then the carries for the next milestone, then the standing rulings,
  in a notes file under the topic directory. It exists today only by an
  outgoing session's own initiative.
- ~~**Every exit-file name needs a suffix, and the design and planning roles'
  default has none.**~~ Closed by the bg-seat-ergonomics design
  (`docs/superpowers/specs/2026-09-23-bg-seat-ergonomics-design.md`, 3.2):
  every proposal file is keyed on the writing session,
  `shoroku-proposal-<role>-<short id>.md`, with `-<n>` for a further file by
  the same session, so a second session of one role in a topic writes a file
  of its own. The item's evidence is in this file's history.

The report's fourth item — that the expected-model config is re-read at the
moment of each comparison — is **confirmed closed** by the contract's current
text ("read at the moment of each comparison"); that half needs nothing.

Medium because the exit-file collision is a real path collision that has
already happened more than once, and the first two are gates whose failure mode
is silent.
