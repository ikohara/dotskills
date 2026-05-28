---
id: "4a5b"
title: finalize kisou's scaffold / migrate trigger phrase sets
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-05-28
updated: 2026-05-28
---

The kisou design spec listed trigger-phrase finalization under "Open
questions":

> Trigger phrases: finalize the scaffold/migrate sets (currently
> tentative).

The previous working set was 8 phrases, over-broad and inconsistent
with sibling skills:

```text
scaffold: 起草 / scaffold / プロジェクト雛形 / プロジェクトを起こす
migrate:  migrate / 構造を整える / この repo を雛形に合わせる
```

## Resolution

Aligned with sibling skills (`wayaku`, `shoroku`) on the `〜して`
action form, and collapsed mode-specific phrases into an argument:

```text
Triggers on `起草して` or `kisouして`, with an optional `scaffold` /
`migrate` mode argument.
```

Rationale: bare `scaffold` / `migrate` / `構造を整える` were too generic
and risked misfiring outside kisou contexts. Mode is now an argument
(`kisou scaffold`, `kisou migrate`) rather than a separate trigger
phrase, matching how shoroku scopes its mode-specific triggers.
