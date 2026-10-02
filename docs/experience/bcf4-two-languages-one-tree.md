---
id: "bcf4"
title: two languages, one tree
created: 2026-09-30
updated: 2026-10-02
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
- **2e98** [confirmed] SHOULD let him read a wording put to him for judgment in his own language, while what is written stays the original.
- **5d0c** [inferred] SHOULD have every word the run says to him in the language he has set, while the project's documents keep the project's language.
- **2daa** [confirmed] SHOULD let him read any one file in Japanese when he asks, with the translation staying his alone and never entering the shared tree.

## Open questions

## Sources

- [a545] 「どうしても日本語を残すなら .ja.md の対訳を残すとか？ できれば残したくないけど……」 (chat, 2026-09-13 to 15)
- [ae58] 「許容。」 (chat, 2026-09-13 to 15, in reply to: Japanese allowed only in Source excerpts)
- [b6bf] 「日本語をAIに読ませるのがトークン消費の点で気にはなるけど、仕方ないか。許容。」 (chat, 2026-09-13 to 15)
- [2e98] inferred from the folded tanto requirement file 「the original is what is written, the translation is what the human reads it by」 (2026-09-20) and a545, ae58; not stated directly. Confirmed 2026-10-01: 「今のところ他に違和感なし」
- [5d0c] inferred from the folded tanto requirement file 「The language the human has configured, for every repository or for one … is the language of every word a seat addresses to the human」 (2026-09-24) and 2e98; not stated directly
- [2daa] inferred from the folded wayaku requirement file 「spot, file-by-file Japanese translation of arbitrary files」 and 「the cache is excluded from the shared repo」 (Purpose, 2026-05-28) and a545, b6bf; not stated directly. Confirmed 2026-10-01: 「今のところ他に違和感なし」
