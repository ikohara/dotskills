---
id: "641f"
title: "`usage.js` code residues the tanto-feedback fix wave left: a chore's re-run rewrites a `final` record, and three one-line minors"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-07
updated: 2026-10-07
---

Source: shoroku tanto-feedback S-53

`skills/tanto/scripts/usage.js` carries four code residues the tanto-feedback
fix wave deferred, with no second wave to take them. Each is low; each is
code, so an issue is the only register.

- **A chore's `close` rewrites a `final` usage record.** `usage.js close`, run
  by a Hosa's feedback chore for a topic already closed, rewrites
  `.tanto/<topic>/usage.json` as `final` when `--keep-usage` is absent,
  replacing the close's own record with a re-measure that may be partial
  (the record write in `cmdClose`). The role text's repair keeps a held
  re-run's switches, but the script remains free to overwrite a `final`
  file. Either `close` leaves a `final` record alone unless told otherwise,
  or the chore's text says so.
- **The stem loop does not check the receiving inbox for the new stem.**
  When `close` allocates a new stem after a delivered file, it does not
  check whether the receiving inbox already holds that basename.
- **The catch in `main` prints `usage.js: undefined`** for a thrown value
  that is not an `Error`, and no stack.
- **The delivered-copy test cannot tell today's date from the previous
  basename's**, so it would pass if the new stem kept the old date.

Each of the last three is a one-line change.
