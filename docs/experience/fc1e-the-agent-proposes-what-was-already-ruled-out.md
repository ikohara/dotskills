---
id: "fc1e"
title: the agent proposes what was already ruled out
created: 2026-09-30
updated: 2026-09-30
actors: [maintainer, agent]
tags: [re-proposal, agent-judgment, user-effort]
---

## Scene

Deep in a session, the agent suggests — again — the approach the maintainer
rejected a month ago, or quietly optimizes for convenience where he had said
safety comes first. He notices, this time. Each time he re-explains, and each
re-explanation is attention he did not plan to spend. What he actually wants
is smaller than a rulebook: when the agent decides how something works, it
should have his few concerns in mind, and when a different means would serve
his purpose better, it should say so.

## Expectations

- **51d2** [stated] SHOULD let the agent refer back to what the maintainer
  already wanted and decided, so it does not re-propose it.
- **58f1** [stated] MAY propose a different means when it serves the stated
  purpose better.
- **59eb** [stated] SHOULD have the agent *weigh* the maintainer's soft
  concerns, not obey them as rules.
- **6faa** [confirmed] MUST NOT propose things the maintainer has explicitly
  ruled out for the project.

## Open questions

## Sources

- [51d2] 「それを明文化しておけば、次にAIが何かを判断するときに参照できるし、「それが本当にやりたいならもっと別の手段がある」という提案もAIができる気がするんだけど。」 (chat, 2026-09-13 to 15)
- [58f1] 「それを明文化しておけば、次にAIが何かを判断するときに参照できるし、「それが本当にやりたいならもっと別の手段がある」という提案もAIができる気がするんだけど。」 (chat, 2026-09-13 to 15)
- [59eb] 「「再開処理」の仕様を決めるときに何に気をつけて欲しいのかを AI にちょっとだけ意識して欲しいのだけかもしれない」 (chat, 2026-09-13 to 15)
- [6faa] inferred from the Shape Up no-gos discussion the maintainer did not object to; not stated directly. Confirmed 2026-09-15: 「あとは yes」
