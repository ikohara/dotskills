---
id: "12dc"
title: being asked, and asked again
created: 2026-09-30
updated: 2026-10-01
actors: [user, agent]
tags: [user-effort, interruption, capture]
---

## Scene

The agent, being careful, asks the user about the same preference it
asked about last week. Or it asks five clarifying questions before a bug fix.
He answers, because not answering is worse, but every question is a context
switch out of whatever he was doing. He would rather the agent noticed what
he said in passing, drew its own conclusions, and checked them with him once.

## Expectations

- **75bc** [stated] SHOULD capture the reasons from the conversation the
  agent already has, not through a separate interview step.
- **78f6** [stated] SHOULD infer scenes from scattered remarks and confirm
  them, rather than only record what was said verbatim.
- **802f** [confirmed] SHOULD NOT ask a question whose answer is already
  recorded.
- **81aa** [confirmed] SHOULD NOT add a human gate to the flow just to
  capture reasons.
- **27e8** [confirmed] SHOULD let the user confirm what lands by answering only the points that need his judgment, by exception, instead of reading every item cold.

## Open questions

## Sources

- [75bc] 「可能なら、その明文化を独立したステップに置かず、Shoroku の中で会話の中からAIが抽出してくれるのが理想だ」 (chat, 2026-09-13 to 15)
- [78f6] 「これだけだと、なかなか抽出されない気がするなあ。発言の中から(AI)推定→(AI->human)確認→(人間)承認みたいなフローは必要だと思う。」 (chat, 2026-09-13 to 15)
- [802f] inferred from 75bc and 0cfa; not stated directly. Confirmed 2026-09-15: 「あとは yes」
- [81aa] inferred from 75bc and 0cfa; not stated directly. Confirmed 2026-09-15: 「あとは yes」
- [27e8] inferred from the folded tanto requirement file 「the human confirms what lands without having to read every item cold」 and 「only the points that need the human's judgment」 (2026-09-20) and 75bc; not stated directly. Confirmed 2026-10-01: 「今のところ他に違和感なし」
