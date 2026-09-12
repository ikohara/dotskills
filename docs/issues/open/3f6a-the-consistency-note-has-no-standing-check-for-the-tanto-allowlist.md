---
id: "3f6a"
title: the consistency note has no standing check for where `.superpowers/sdd` and `plan-basename` may survive in the tanto skill
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-12
updated: 2026-09-12
---

After the tanto-workspace plan of 2026-09-12, the spellings `.superpowers/sdd`
and `plan-basename` may survive in `skills/tanto/` and
`docs/notes/tanto-consistency-checks.md` only on the lines that name the SDD
ledger's own path, the SDD workspace, and the note's own prose about them —
an allowlist the plan's spec states in its section 3 and the plan checks in
its Verification items 3 and 5, with expected per-file counts. Nothing checks
it after that plan closes: the consistency note's check list has no entry for
the allowlist, so a later passage that reintroduces either spelling elsewhere
in the skill is caught only if its plan happens to sweep for it.

The spec deferred the question (its Deferred item 2): whether the note gains
the allowlist as a standing check rather than a plan-time one is Kanri's to
decide at that plan's T2, "if the sweep earns a number". This issue is that
deferral, filed one to one at T1 so it is not lost; T2 either writes the
check into the note — the two counted `grep -rn … | grep -vc` commands of
the plan's Verification item 3, with their expected values — and resolves
this, or records why not.

Related: the tanto-workspace design of 2026-09-11 (section 3, Deferred
items), `docs/notes/tanto-consistency-checks.md`, issue-10bc.
