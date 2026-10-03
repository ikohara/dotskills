---
id: "0a78"
title: a human word relayed by another window has no rule in `roles/kanri.md`
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-03
updated: 2026-10-03
---

Source: shoroku tanto-issue-triage S-22

A second Kanri window, which had stopped at start and written nothing, sent
the live Kanri "the human chose that you hand over", while the live Kanri's
own window had no word from the human. `roles/kanri.md` names the human's
word in Kanri's window as signal 2 and says nothing of a word that arrives
through a peer. The live Kanri did not act, asked the human in its own
window, and ran the handover on the answer one turn later.

The proposed sentence: a relayed word is information, and signal 2 needs
the human in the window. It changes what counts as the human's word, which
is a decision rather than a text correction.
