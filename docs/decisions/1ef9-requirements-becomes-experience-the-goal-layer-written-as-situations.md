---
id: "1ef9"
title: "`docs/requirements/` becomes `docs/experience/`: the goal layer is written as situations, not behavior"
status: accepted
supersedes: []
superseded_by: null
amends: ["8b1f"]
amended_by: []
created: 2026-10-02
updated: 2026-10-02
---

## Context

The goal layer under `docs/requirements/` was read, by agents and by the
human alike, as a list of system behaviors: its files said what the system
shall do, which is design's job, and the reasons the human wanted recorded —
whose situation, what would upset him — had no place to go. The word itself
pulled toward behavior. Decided in the `experience-layer` spec of
2026-09-30, from the human's words in the chat that preceded it.

## Options

- **Keep `requirements/`** and lint its sentences toward needs (issue-c9df's
  proposals alone).
- **A `docs/intent/`** of goals without scenes.
- **Scenes as situations** under `docs/experience/`: someone is in a
  situation, wants something, and something would upset them (chosen).

## Decision

`docs/requirements/` becomes `docs/experience/`, and the goal layer is
written as situations, not behavior. This amends decision-8b1f as
decision-47f2 did: `requirements` leaves the case-mapping table and
`experience` joins it, in the table's one authority and its two copies (kisou
`SKILL.md` Step 2 and the instrument's `TYPES`). The rest of 8b1f stands on
its own reasoning.

## Consequences

- The pairing rule between design and the goal layer is rewritten a second
  time within a month.
- `req-` references in 23 ADRs are left as history; `docs/AGENTS.md` says how
  a `req-<id>` in an older document is read.
- The caps on a scene (about 5 to 10 scenes, 3 to 7 expectations) are
  wording, judgments a tool does not enforce.

## Sources

- [1ef9] 「experience は僕が明文化したいことに近い。しかも、UX だけじゃなく、DXも、だ。それを明文化して、何がしたいかと言えば、それは最初から変わらず、AIの入力にして判断の支えにすること。」 (chat, 2026-09-13 to 15)
- [1ef9] 「requirement はシステムの振る舞いを示す言葉としても使われているから、避けた方が良いことも分かった。」 (chat, 2026-09-13 to 15)
