---
id: "06b2"
title: a run in flight while the user is elsewhere
created: 2026-10-01
updated: 2026-10-02
actors: [user, agent]
tags: [interruption, cost, resumability, checkpoints]
---

## Scene

The user hands a plan to several sessions of the agent and walks away — to
another repository, to dinner, to bed. He wants to come back to work that
moved, rulings he can read, and a bill he expected; not to a window that
stalled hours ago waiting for a yes he never saw, and not to a session that
grew until it forgot what it was doing. When a session dies or he closes one
by mistake, he wants the run to pick up from what is on disk, not from
anyone's memory.

## Expectations

- **178d** [confirmed] SHOULD keep a run affordable to leave running: judgment bought where it is needed, waiting and long output kept cheap.
- **38e5** [confirmed] SHOULD NOT assume his project can be built twice side by side.
- **26d5** [confirmed] SHOULD interrupt the user only at checkpoints he knows of, and ask him only for what only he can do, while he is there and in a form he can act on as it is.
- **173f** [confirmed] SHOULD let the run continue from what is on disk when any session is lost, replaced, or resumed under another name.
- **1b75** [confirmed] SHOULD let him tell from a session's last words where its work landed and whether he may release it, as facts he can check, not as the seat's opinion.
- **19c1** [confirmed] SHOULD NOT let any session grow past a bound he knows in advance, so that what he pays per wake-up is never discovered after the fact.
- **3a9e** [inferred] SHOULD tell the user when the run is waiting on him, without his having set anything up for it.
- **bb08** [stated] SHOULD let him choose how much of a run moves at once, and with it how fast it goes and what it costs.

## Open questions

## Sources

- [178d] inferred from the folded tanto requirement file 「The split exists so that judgment stays on the strongest model, long output goes to a cheaper one, a session that waits holds a cheap context」 (Purpose, 2026-09-20) and its "A run is affordable to keep running" bullet; not stated directly. Confirmed 2026-10-01: 「今のところ他に違和感なし」
- [38e5] inferred from the folded tanto requirement file 「Whether a second checkout builds and runs depends on the repository」 (2026-09-20); not stated directly. Confirmed 2026-10-01: 「抽象案でOK」
- [26d5] inferred from the folded tanto requirement file 「the human is asked only for what only the human can do」 and 「a numbered list of commands the human can paste as they are」 (2026-09-20) and 802f; not stated directly. Confirmed 2026-10-01: 「今のところ他に違和感なし」
- [173f] inferred from the folded tanto requirement file 「any session can be replaced or recreated and the run continues from disk」 (2026-09-20); not stated directly. Confirmed 2026-10-01: 「今のところ他に違和感なし」
- [1b75] inferred from the folded tanto requirement file 「facts a human or another seat can check against a file」 (2026-09-20); not stated directly. Confirmed 2026-10-01: 「抽象案でOK」
- [19c1] inferred from the folded tanto requirement file 「stay inside known limits rather than being discovered after the fact」 and 「the human never pays for a conductor's accumulated context beyond the work in hand」 (2026-09-20); not stated directly. Confirmed 2026-10-01: 「今のところ他に違和感なし」
- [3a9e] inferred from the folded tanto requirement file 「A seat that blocks, and a kessai that waits, raise a notice on the machine without the human configuring anything」 (2026-09-24) and 26d5; not stated directly
- [bb08] 「worktreeを作らない制約のもとで、複数のagentが並列に作業できる。userはその並列度を調整することで進捗やトークン消費量を増減できる」 (Kikaku, 2026-10-02)
