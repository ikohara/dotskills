---
id: "b898"
title: a plan drafter's scratch work under the topic directory has no deleter
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-04
updated: 2026-10-04
---

Source: shoroku shoki-seat S-38

The `shoki-seat` drafter was told to keep its scratch work under
`.tanto/shoki-seat/scratch/` and could not remove it (`rm -rf` blocked by
policy), so the directory — eight scratch repositories, a generator script,
and the parts it assembled — stays on disk, ignored by `.tanto/.gitignore`.
The `plan.draft` dispatch text in `roles/keikaku.md` should name a scratch
location the job cleans up, or say who deletes it; Kanri may clear the
directory at the close, but no step says so.

Carrier: Kept.
