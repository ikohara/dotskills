---
id: "c6d7"
title: kisou migrate "present file" merge granularity
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-05-28
updated: 2026-06-17
---

The kisou design spec listed merge-granularity tuning under "Open
questions":

> migrate "present file" merge granularity: how aggressively to
> auto-merge vs. always ask per section — settle during implementation
> against real repos.

Today the spec says: present `README` / `AGENTS.md` / `CLAUDE.md` →
section / block merge with shown diff + explicit approval. The exact
auto-merge threshold (e.g., "auto-add missing section if it has zero
overlap with existing content; ask if overlap > threshold") is not
defined.

Deferred because:

- The first real run on dotskills (commit `7558bb8`) sidestepped this
  entirely — user opted to rename `README.md` → `.bak` and rewrite
  fresh (see issue `7d5f-real-content-readme-migration-policy`).
- We don't have enough real merge cases yet to know what threshold
  feels right.

Action item: settle once we have 2-3 real migrate runs on existing
repos where the present file is template-shaped (not real content).

## Resolution

Settled by design rather than by accumulated runs: the kisou-managed Present
branch refreshes at **section / block** granularity, always via numbered
partial-accept (no silent auto-merge). The fixed-text-vs-free-text line decides
what is proposed — fixed-text sections may be updated, free-text and
author-added sections are never touched. See `decision-281f` and `SKILL.md`.
