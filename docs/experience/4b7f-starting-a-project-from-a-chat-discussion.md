---
id: "4b7f"
title: starting a project from a chat discussion
created: 2026-09-30
updated: 2026-10-02
actors: [user, agent]
tags: [reasons-retention, handover, user-effort, provenance]
---

## Scene

The user thinks a new tool through with an AI in chat over an evening.
By the end, all the reasons are in the chat: why now, what would annoy him,
what he refuses to build. He asks for a handover file, drops it into a fresh
repo uncommitted, runs the first documentation pass, deletes the file. Weeks
later the repo has design docs and decision records, but neither he nor the
agent can say why a particular constraint exists. The reasons were compressed
out twice — once into the handover, once into the docs.

## Expectations

- **06d2** [stated] MUST NOT lose the user's reasons between the chat
  and the repo.
- **0cfa** [stated] SHOULD NOT require the user to hand-write the
  reasons.
- **16c2** [stated] SHOULD keep the handover flow — chat → file → new repo or directory, uncommitted; deletion optional — with only what the file carries changing.
- **4c63** [confirmed] SHOULD let what a chat settled become the start of its own project without ceremony.
- **1fb1** [confirmed] MUST let the user see his own words behind any
  claim the agent wrote on his behalf.
- **2c03** [confirmed] SHOULD NOT make the user re-derive his project conventions for every new project.

## Open questions

- **2b72** Should the chat side write scene files directly (skipping the
  handover for experience content), or always go through the handover?
  → decision-5e6b

## Sources

- [06d2] 「このフローだと、いちばん req のソースとなるものから大量に落としてしまう。どうする？」 (chat, 2026-09-13 to 15)
- [0cfa] 「human が全部手書きするのはいまさらダルいよ」 (chat, 2026-09-13 to 15)
- [16c2] 「新 repo (ただしcommit しない。削除してもいい）」 / 「今回のファイルも削除はしない予定（もちろん commit もしない）」 (Kikaku, 2026-09-15)
- [4c63] inferred from 16c2; not stated directly. Confirmed 2026-10-02: 「1で」
- [1fb1] inferred from 「推定→確認→承認みたいなフローは必要」 and his agreement to Source excerpts; not stated directly. Confirmed 2026-09-15: 「あとは yes」
- [2c03] inferred from the folded kisou requirement file 「without re-deriving conventions per project」 (Purpose, 2026-09-11) and 0cfa; not stated directly. Confirmed 2026-10-01: 「今のところ他に違和感なし」
