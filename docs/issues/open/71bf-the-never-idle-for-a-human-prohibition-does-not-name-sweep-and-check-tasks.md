---
id: "71bf"
title: the never-idle-for-a-human prohibition does not name sweep-and-check tasks
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-09-14
---

The standing rule that a `task.implement` dispatch never idles for a human —
SDD's own prohibition table, which `roles/jisso.md` already states — is worded
for an ordinary implementation task. It does not call out the sweep-and-check
task shape by name, even though it applies just as hard there.

`tanto-context-ceiling`'s cold read had to raise the question to confirm the
rule still holds for such a task (task 17, considered holding open until a
human-relayed figure arrived). The run reached the right answer from the
existing wording, but that the question had to be raised at all is evidence
the wording is under-specified for this shape.

Scoped to the wording gap only: the alternative the cold read considered is
settled by the existing rule and is not at issue here. No new choice was made,
so this is not a `decisions/` entry.
