---
id: "06b2"
title: a plan handed to a run
created: 2026-10-01
updated: 2026-10-07
actors: [user, agent]
tags: [autonomy, cost, resumability, bounds]
---

## Scene

The user hands a plan to several sessions of the agent and turns to something
else — another repository, dinner, or the next thing on the same desk. Whether
he is in the room makes no difference to what he wants of the run: that it
carries the work forward by itself, inside limits he knew before it started,
and that the bill is the one he expected. He does not want to be the one who
keeps it going — starting its sessions, replacing one that has grown too
large, clearing away one that is done, or telling the run what he just did to
it. When a session dies or he closes one by mistake, he wants the run to pick
up from what is on disk, not from anyone's memory.

## Expectations

- **178d** [confirmed] SHOULD keep a run affordable to leave running: judgment bought where it is needed, waiting and long output kept cheap.
- **38e5** [confirmed] SHOULD NOT assume his project can be built twice side by side.
- **173f** [confirmed] SHOULD let the run continue from what is on disk when any session is lost, replaced, or resumed under another name.
- **19c1** [confirmed] SHOULD NOT let any session grow past a bound he knows in advance, so that what he pays per wake-up is never discovered after the fact.
- **bb08** [stated] SHOULD let him choose how much of a run moves at once, and with it how fast it goes and what it costs.
- **c53d** [confirmed] SHOULD NOT make him the run's operator: the run starts, replaces, and clears away its own sessions, and learns what he did without his reporting it.
- **af0c** [confirmed] SHOULD NOT let an ordinary act of his tools — an editor reload, a closed tab — ask anything of him or of the run.
- **a0fb** [stated] SHOULD let him know, after a run, what each seat and each kind cost and what it bought, by model, without anyone copying a figure.
- **5ad8** [stated] SHOULD keep usage, and what it bought, long enough — months — to be read as a trend.

## Open questions

## Sources

- [178d] inferred from the folded tanto requirement file 「The split exists so that judgment stays on the strongest model, long output goes to a cheaper one, a session that waits holds a cheap context」 (Purpose, 2026-09-20) and its "A run is affordable to keep running" bullet; not stated directly. Confirmed 2026-10-01: 「今のところ他に違和感なし」
- [38e5] inferred from the folded tanto requirement file 「Whether a second checkout builds and runs depends on the repository」 (2026-09-20); not stated directly. Confirmed 2026-10-01: 「抽象案でOK」
- [173f] inferred from the folded tanto requirement file 「any session can be replaced or recreated and the run continues from disk」 (2026-09-20); not stated directly. Confirmed 2026-10-01: 「今のところ他に違和感なし」
- [19c1] inferred from the folded tanto requirement file 「stay inside known limits rather than being discovered after the fact」 and 「the human never pays for a conductor's accumulated context beyond the work in hand」 (2026-09-20); not stated directly. Confirmed 2026-10-01: 「今のところ他に違和感なし」
- [bb08] 「worktreeを作らない制約のもとで、複数のagentが並列に作業できる。userはその並列度を調整することで進捗やトークン消費量を増減できる」 (Kikaku, 2026-10-02)
- [c53d] inferred from 26d5 and 「clear したことはkanriが気づきようがないから、わざわざ clear して、わざわざ kanri に報告する」, 「kanri が handover するたびに tanto.bat を実行するのがカッタるい」, 「可能な限り自走して欲しいこととかは、離れていようがいまいが変わらない」 (Kikaku, 2026-10-04); not stated directly. Confirmed 2026-10-04: 「ABCまさにそのとおりだね」
- [af0c] inferred from 「VSCode側の都合（本体や拡張の更新）で reload 相当の処理が走ることは1,2日に1回はあると思っていい」 (the run-owned-seats spec dialogue, D-9, 2026-10-05); not stated directly. Confirmed 2026-10-06: 「A (confirmed)」 (Kikaku)
- [a0fb] 「何はなくとも measure は必要なんじゃないかと思うわけ」 (Kikaku, 2026-10-06)
- [5ad8] 「長期（といっても数ヶ月単位）の統計はコスト最適化の戦略策定で見たくなると思うんだよなあ」 (the tanto-feedback spec dialogue, Q-8, 2026-10-06)
