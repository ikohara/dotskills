---
id: "acdb"
title: The plan review reads the plan alone and misses facts of the real repository
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-06
updated: 2026-10-06
---

Source: shoroku run-owned-seats S-44

The run-owned-seats cold read caught three things the plan review did not:
the real `seats.json` held eight `gone` Kanri seats, which Task 2's refusal
would have answered `held:` at the successor's spawn; markdownlint over the
applied tree found one MD038 in a code span opening with a space; and the
suite's duration ran against the harness's timeout. All three are facts of the
real repository or the real tools, not of the plan's text, so a review of the
plan alone misses them.

To decide: whether the plan review brief in `roles/keikaku.md` names
`seats.json`, the applied tree, and the lint run as inputs.

Carrier: Kept — the plan review brief of `roles/keikaku.md`, prose and not
the instrument.
