---
id: "543b"
title: docs/AGENTS.md naming rules leak into non-type docs/ subdirectories
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-06-11
updated: 2026-06-11
---

In projects carrying a kisou-generated `docs/AGENTS.md`, agents sometimes
splice the `<id>` / `<slug>` naming convention into Markdown filenames under
`docs/` subdirectories outside the four standing types. Observed example,
where a superpowers spec (whose own convention is `YYYY-MM-DD-<slug>.md`)
picked up a stray 4-hex id:

```text
docs/superpowers/specs/2026-06-03-eee3-cmd-sln-eol-gates-design.md
```

The behavior is nondeterministic — the id is sometimes added, sometimes not.

Suspected cause: in `skills/kisou/templates/docs/AGENTS.md` (and its
instantiated copies, including this repo's own `docs/AGENTS.md`), the `<id>`
and `<slug>` bullets under "Document management" read as general rules for
everything under `docs/`. The four-type path table implies the scope, but
nothing states that the naming scheme applies *only* to those four
directories, and the "New subdirectories under `docs/`" paragraph
acknowledges other subdirectories without exempting them from it.

Fix direction: add an explicit scope statement to the template — e.g., "the
`<id>-<slug>` naming applies only to the four type directories; other
subdirectories under `docs/` (created by other tools or skills) keep their
own conventions" — and mirror the change in this repo's `docs/AGENTS.md`.
Already-generated projects need the same edit applied manually or via a
kisou `migrate` pass.

Resolution: applied to both files. The "New subdirectories" paragraph now
exempts non-type subdirectories from the rules, and the naming bullets are
introduced with "For the four type directories only:". Already-generated
projects still need the same edit applied manually or via a kisou `migrate`
pass.
