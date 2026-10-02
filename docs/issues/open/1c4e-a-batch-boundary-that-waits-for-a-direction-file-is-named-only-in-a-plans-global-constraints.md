---
id: "1c4e"
title: a batch boundary that waits for a human's direction file is named in a plan's Global Constraints, not in Kanri's boundary procedure
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-02
updated: 2026-10-02
---

Source: shoroku experience-layer S-30

A batch boundary that waits for a human's direction file was new to tanto
with the `experience-layer` plan (decision-bba6), and the plan named it in
its own Global Constraints. The shape recurs by decision: `tanto-issue-triage`
runs a recommend/kessai/direction cycle per cluster. So `roles/kanri.md`'s
boundary procedure could name the case — what Kanri waits for, and how the
direction file reaches the next batch — instead of each plan's Global
Constraints restating it. A procedural addition to decide, not a text
correction.
