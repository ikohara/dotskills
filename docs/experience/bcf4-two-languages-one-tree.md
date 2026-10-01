---
id: "bcf4"
title: two languages, one tree
created: 2026-09-30
updated: 2026-10-01
actors: [user, agent]
tags: [language, token-cost, provenance]
---

## Scene

The user thinks and talks in Japanese. The docs are in English. The
agent reads both, but pays more for Japanese. He would rather not have
Japanese in the tree at all — but he trusts his own words more than a
translation of them.

## Expectations

- **a545** [stated] SHOULD NOT keep parallel Japanese documents (`.ja.md`).
- **ae58** [stated] MAY keep Japanese only as quoted evidence.
- **b6bf** [stated] SHOULD minimize the tokens the agent spends on Japanese.

## Open questions

## Sources

- [a545] 「どうしても日本語を残すなら .ja.md の対訳を残すとか？ できれば残したくないけど……」 (chat, 2026-09-13 to 15)
- [ae58] 「許容。」 (chat, 2026-09-13 to 15, in reply to: Japanese allowed only in Source excerpts)
- [b6bf] 「日本語をAIに読ませるのがトークン消費の点で気にはなるけど、仕方ないか。許容。」 (chat, 2026-09-13 to 15)
