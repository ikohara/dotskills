---
id: "cddc"
title: "`passage-check.js sections` needs a heading and cannot list a file's sections"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-04
updated: 2026-10-04
---

Source: inbox 2026-10-03-passage-check-sections-needs-heading

`passage-check.js sections --file <path>` with no heading prints its usage
line instead of listing the file's sections, and a file with no headings —
the cold read's numbered list — cannot be read by it at all, so a Kanri falls
back to `grep`. Let `sections --file <path>` with no heading list the file's
headings, and a heading-less file's numbered items, so the instrument can
enumerate before it extracts.

The role-text half — what Kanri does with the cold read today — was corrected
in `roles/kanri.md` by the shoki-seat close's text corrections. Kin
issue-2e52 (a sections tool that keeps raw output out of the context).

Carrier topic: `passage-check-hardening`.
