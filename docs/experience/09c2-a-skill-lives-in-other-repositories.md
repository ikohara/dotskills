---
id: "09c2"
title: a skill lives in other repositories
created: 2026-10-01
updated: 2026-10-07
actors: [developer, user, agent]
tags: [distribution, release, feedback, privacy, user-effort]
---

## Scene

The developer's skills live in repositories that are not this one — his own
other projects today, someone else's some day. He wants a new version to be
one step away for whoever installs it, through the install route they already
use, and cutting that version to cost him only the words that say what
changed. Using the skills over there, he notices a defect; he wants to leave
one line and get back to what he was doing, and to find that line waiting
when he next has the skill repository open — decided then, not on arrival,
and never lost. And nothing about those repositories — their names, their
documents, what he was doing in them — may show up in what this repository
commits: some of them are not his to show, and what the skill needs to know
is the symptom.

## Expectations

- **2b4e** [stated] SHOULD let whoever installs the skills get a new version in one step, through the install route they already use.
- **1d5d** [confirmed] SHOULD leave him responsible only for the substantive part of a release, what the version says, and take the mechanical steps off his hands.
- **22fc** [stated] MUST NOT let a release leave his machine, or be cut twice, without his saying so at that moment.
- **259d** [confirmed] SHOULD NOT rewrite the words he wrote for a release.
- **1c7a** [confirmed] SHOULD let a defect he notices while using a skill be dropped off in one line and decided later, at a checkpoint he checks anyway, never on the spot and never lost.
- **1c02** [stated] MUST NOT let anything this repository commits say which other repositories he uses its skills in, or quote their documents.
- **3e3b** [confirmed] SHOULD let the developer see whether the stream of issues the runs file is falling or rising, per topic and per seat, so that a change of model or effort can be read in it.
- **cf07** [stated] SHOULD NOT make him carry the text of a consultation he has approved between two of his repositories.
- **2d9d** [stated] SHOULD keep a repository recognizable as the same one across closes without its name appearing.

## Open questions

## Sources

- [2b4e] 「（（apmのような）skillをインストールするインフラに対応しているから）、skill のユーザが簡単に導入できる。skillの開発者も簡単にリリースできる」 (Kikaku, 2026-10-01)
- [1d5d] inferred from the folded automated-release requirement file 「leave the human responsible only for the substantive part」 (Purpose, 2026-05-28) and 0cfa; not stated directly. Confirmed 2026-10-01: 「（（apmのような）skillをインストールするインフラに対応しているから）、skill のユーザが簡単に導入できる。skillの開発者も簡単にリリースできる」
- [22fc] 「pushの判断は repo や user の都合で変わる。skill の都合で決まるものではない」 (Kikaku, 2026-10-01)
- [259d] inferred from the folded automated-release requirement file 「The script reads but never writes CHANGELOG.md」 (2026-05-28) and 1fb1; not stated directly. Confirmed 2026-10-01: 「今のところ他に違和感なし」
- [1c7a] inferred from the folded tanto requirement file 「No report is lost and none is decided on arrival」 (2026-09-20) and 81aa; not stated directly. Confirmed 2026-10-01: 「継続的な改善をしたいが、他repoの情報はその扱いに気をつける必要がある」
- [1c02] 「他repoの情報は扱いに気をつける必要がある場合がある。「症状」がわかればいいのであって、具体的な情報は絶対に入れない」 (Kikaku, 2026-10-01)
- [3e3b] inferred from the 2026-09-19 Kikaku decision on issue yield, 「so that the effect can be read」, and the 2026-10-01 Kikaku decision on the topics after experience-layer, 「Nothing else of `tanto-feedback` comes along」 (both behind the tanto-issue-triage design's by-finder counter, 2026-10-02); not stated directly. Confirmed 2026-10-03: 「立つ. 09c2 に」
- [cf07] 「ぼくの承認のもと、直接やりとりしてくれると助かるなあ」 (Kikaku, 2026-10-06)
- [2d9d] 「repo名を直接残したくないけど、一貫性 (このcost結果とあのcost結果は時期が違うけど同じrepo) は確保したい」 (the tanto-feedback spec dialogue, Q-7, 2026-10-06)
