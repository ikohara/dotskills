---
id: "7bb3"
title: returning after months
created: 2026-09-30
updated: 2026-10-01
actors: [user, agent, collaborator]
tags: [orientation, trust, always-read-set, staleness]
---

## Scene

The user opens a repo he has not touched since spring. He wants to know
where things are and what he was worried about, in one sitting. The agent
starting the same session wants the same, in as few tokens as possible. A
collaborator who does not use AI wants the same, from a README onward. If any
of them has to read the code to learn the structure, or if the docs describe a
structure the code no longer has, they stop trusting the docs and stop reading
them.

## Expectations

- **37c2** [stated] MUST NOT exclude a human who does not use AI as a reader
  of the docs.
- **3b2d** [confirmed] SHOULD let the user re-orient in one sitting.
- **48b2** [stated] SHOULD keep what the agent reads on every task small.
- **518b** [confirmed] SHOULD make it obvious when a structural description
  is stale relative to the code.

## Open questions

## Sources

- [37c2] 「ぼくは、repo の利用者全員がAIを使う前提を（まだ）置いてない。したがって、req, design, ADR の主な読み手は AI だけど、human を排除したわけじゃないんだ。」 (chat, 2026-09-13 to 15)
- [3b2d] inferred from 37c2 and 「UX だけじゃなく、DXも、だ」; the "one sitting" bound is Claude's; not stated directly. Confirmed 2026-09-15: 「いろいろ考えたけど「一回の着席で」に勝る表現を思いつかなかった。OK」
- [48b2] 「日本語をAIに読ませるのがトークン消費の点で気にはなるけど、仕方ないか。許容。」 (chat, 2026-09-13 to 15)
- [518b] inferred from the user's acceptance of a generated, commit-stamped map (「(AI) diff 提案→ (人間) 承認→ (AI) マージの手順と, OPTIONAL どっちがコスト安いかというと 後者？ 真なら後者で」); not stated directly. Confirmed 2026-09-15: 「あとは yes」
