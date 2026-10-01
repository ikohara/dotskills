---
id: "eb47"
title: a Kanri standby session opened ahead of the handover
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-17
updated: 2026-10-01
---

Source: shoroku seat-lineage

The idea: a successor Kanri the human opens ahead, handshaking as `standby`;
at a boundary where the handover trigger fires, the live Kanri hands over to
it without a create request, and Kanri prompts the human to open one when none
is listed.

Pros recorded: the presence gate and the deferred-handover machinery (three
records, issue-1a9a, issue-caba, issue-8312) could be deleted, since the room
is never empty; the ceiling would be honored instead of carried 1.2× to 2.4×
over; with the rolling shoroku proposal the write-out is once per lineage
anyway.

Cons recorded: a standby's context is the disk at its start, which under rule
11 can be an older role text the longer it waits; two standing extra windows;
two Kanri names in `ListAgents`, a new roster status, a handshake variant, the
"Second Kanri" start case and Rule 4 rewritten; the human's "continue" at a
plan close disappears; and the growth itself is untouched.

Why shelved: the rolling shoroku proposal alone removes the largest measured
wait; what a standby adds is 5 to 10 attended minutes per handover and the
unattended case, against a new mode in a skill whose every added mode has cost
follow-up consistency issues; the root fix for Kanri's frequency is
`tanto-diet`. The human: やんなくてもいい気はする.

Revisit trigger: after `seat-lineage` and `tanto-diet` have landed, a plan
whose Kanri still hands over at every batch boundary (handover count ≥ batch
count), or whose deferred handover crosses 2× the ceiling, reopens this with
the pros and cons above. Until then the presence gate and the deferral stay
for Kanri, and issue-1a9a, issue-caba, and issue-8312 are fixed as the bugs
they are.

Related: exp-06b2, design-4807, decision-eee2.
