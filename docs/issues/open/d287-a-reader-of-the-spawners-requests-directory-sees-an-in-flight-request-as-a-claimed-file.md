---
id: "d287"
title: a reader of the spawner's requests directory sees an in-flight request as a .claimed file
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-06
updated: 2026-10-06
---

Source: shoroku run-owned-seats S-8

The hotfix for issue-f03b (a claim by rename in `takeRequests`) broke four
launcher tests until the `requests` helper of `tanto.test.js` was taught to
read a claimed request. The helper reads the requests directory and the
results directory and assumed a request file stays until its result exists;
after the claim there is a window with neither, a `<name>.<pid>.claimed` file
while a resume or a spawn runs.

The fix was one line, but the shoki-seat spec's section 4.2 and that plan's
tests said nothing about readers of the requests directory: a reader of
`.tanto/spawner/requests/` other than the spawner — a test helper, a census,
Kanri's own `ls` — now sees an in-flight request as a `.claimed` file, not as
`.json`. The next plan that touches the spawner should name that reader
class in its spec.

Carrier: Kept — a reader class for the next spawner plan's spec; the spawner
is no topic's file in the order.
