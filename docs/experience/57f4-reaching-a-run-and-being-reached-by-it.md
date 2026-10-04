---
id: "57f4"
title: reaching a run, and being reached by it
created: 2026-10-04
updated: 2026-10-04
actors: [user, agent]
tags: [interruption, attention, checkpoints, access]
---

## Scene

A run is in flight and the user is somewhere — at the desk beside it, in
another repository, or away with only a phone. Sometimes the run needs him: a
decision that is his, a review, a yes. Sometimes he wants a word with it: a
spec to talk through, a chore to hand over, a question about where things
stand. He wants to hear from the run when it needs him and only then, at
points he knew were coming, and to step into the conversation from wherever he
is, the same way every time. He does not want a notice that keeps calling
after he has answered it, a request that comes one day and not the next, or a
way in that works only from one program, or that he must find again because
the run replaced the session he was talking to.

## Expectations

- **26d5** [confirmed] SHOULD interrupt the user only at checkpoints he knows of, and ask him only for what only he can do, while he is there and in a form he can act on as it is.
- **3a9e** [confirmed] SHOULD tell the user when the run is waiting on him, without his having set anything up for it.
- **9d8f** [confirmed] SHOULD claim his attention only while something is his to act on, and release it once he has acted.
- **1c96** [confirmed] SHOULD let him step into any conversation of the run from wherever he is working, the same way each time, whichever session now holds the part.
- **1b75** [confirmed] SHOULD let him tell from a session's last words where its work landed, as facts he can check, not as the seat's opinion.

## Open questions

## Sources

- [26d5] inferred from the folded tanto requirement file 「the human is asked only for what only the human can do」 and 「a numbered list of commands the human can paste as they are」 (2026-09-20) and 802f; not stated directly. Confirmed 2026-10-01: 「今のところ他に違和感なし」
- [3a9e] inferred from the folded tanto requirement file 「A seat that blocks, and a kessai that waits, raise a notice on the machine without the human configuring anything」 (2026-09-24) and 26d5; not stated directly. Confirmed 2026-10-02: 「3a9e と 5d0c は両方そのとおり」
- [9d8f] inferred from 3a9e and 「Kanri が clear をうながしたり、しなかったりする」, 「うながす、ずーっと for you に出ちゃう」 (Kikaku, 2026-10-04); not stated directly. Confirmed 2026-10-04: 「ABCまさにそのとおりだね」
- [1c96] inferred from 173f and 「そもそもVSCodeを前提にしない方が良いのではないか」, 「それが素の terminal でも psmux つきの terminal でも、VSCodeでも、この skill は関知しない」, 「kanri が handover するたびに tanto.bat を実行するのがカッタるい」 (Kikaku, 2026-10-04); not stated directly. Confirmed 2026-10-04: 「ABCまさにそのとおりだね」
- [1b75] inferred from the folded tanto requirement file 「facts a human or another seat can check against a file」 (2026-09-20); not stated directly. Confirmed 2026-10-01: 「抽象案でOK」 Narrowed 2026-10-04, the clause "and whether he may release it" dropped, since under c53d releasing a session is the run's own act: 「直したいところ特になし」
