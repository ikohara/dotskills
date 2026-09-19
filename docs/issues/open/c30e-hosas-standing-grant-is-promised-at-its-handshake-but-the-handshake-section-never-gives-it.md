---
id: "c30e"
title: "Hosa's standing grant is promised at its handshake reply, but `roles/kanri.md`'s handshake section never states the grant"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-13
updated: 2026-09-19
---

Source: session 2026-09-13

Found by the tanto-cost run's batch C task 12 reviewer (2026-09-13),
recorded in `.tanto/tanto-cost/batch-C-report.md`, "Parked and deferred
minors" and "Rulings needed" (item 2). Kanri ruled to accept and file
rather than authorize an off-plan edit, for the same reason as issue-e18b
and issue-7ba4: `roles/kanri.md` is closed by the tanto-cost plan after
batch C, and no later task's passage touches the handshake section.

`skills/tanto/roles/kanri.md`'s Human access section (task 12's region) now
reads: Hosa's chores are worked "in the line you answer its handshake
with" — a standing grant, given at handshake time, the same way Sekkei's
and Keikaku's standing grants are. But `## On a handshake` (task 9's
region) gives Hosa only "your address and one line, 'tracked files only in
a slot I give'" — no `human-access: granted — …` clause, where Sekkei's and
Keikaku's grants are quoted there verbatim. A Kanri that follows the
handshake section literally never actually utters Hosa's grant.

Unlike issue-e18b (a purely descriptive summary row going stale, with no
behavioral consequence), this is a **working rule**: the grant's existence
is a real precondition Hosa's own conduct depends on, and the section that
is supposed to state it does not. Both task 9's and task 12's passages
landed exactly as the plan quotes them — the gap is in what the plan asked
for, not in how either task implemented its own region.

Fix: one clause added to the handshake section's Hosa case, naming the
grant the way Sekkei's and Keikaku's are named there. `roles/kanri.md` is
closed for further editing within the tanto-cost plan (its file-structure
lock ends at batch C), so this waits for a follow-up plan or the earliest
point after this plan closes that the hotfix lane reopens for
`skills/tanto/`.

Related: issue-e18b, issue-7ba4 (the same "found late, can't fix in-plan"
shape from the same run's batches B and C).
