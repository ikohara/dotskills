---
id: "aeed"
title: wayaku bulk translation is intentionally not supported
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-05-21
updated: 2026-05-27
---

`wayaku` is **spot translation only**. The SKILL.md explicitly
forbids walking the project tree:

> Do NOT walk the tree. wayaku is spot translation; only translate
> the files the user actually referenced.

If a real use case for bulk translation surfaces (translate all `*.md`
in a directory, translate a whole skill at once, etc.), revisit
whether to add a separate "wayaku-bulk" skill, an opt-in flag, or a
companion script. Until then, multi-file translation goes through
multiple explicit user requests.
