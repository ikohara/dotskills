---
id: "f9b3"
title: issue-status subdir case rule (`open`/`deferred`/`resolved` stay lowercase) is implicit
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-05-28
updated: 2026-05-28
---

The `{{name}}` case mapping table covers script names and structural dirs but
**explicitly excludes** the issue-status subdir names (`open`, `deferred`,
`resolved`) — they stay lowercase under any `case`. This rule is correct (the
status labels are conventionally lowercase) but the explanation is only in
the spec (Resolved decisions) and the implicit use in `docs/AGENTS.md`:

```text
{{docs}}/{{issues}}/<status>/<id>-<slug>.md
```

`{{issues}}` is cased; `<status>` is a literal placeholder that the spec says
"stays lowercase." A first-time reader of the templates won't necessarily
catch the rule from the template text alone.

## Suggested fix

Make the rule visible in the template-side TEMPLATE FILL block or in
`docs/AGENTS.md`. A one-line note next to the file-path code block, e.g.:

```markdown
> `<status>` is one of `open` / `deferred` / `resolved` and is **not** subject
> to the `case` mapping — status labels are lowercase by convention.
```

Alternatively, give the status subdir names their own `{{open}}` / `{{deferred}}`
/ `{{resolved}}` placeholders with their entries in the case table mapped to
themselves (i.e., explicit identity). This is more uniform but adds 3 names
that never actually case-flip.
