---
id: "4e67"
title: '"requirements" turn into behavior'
created: 2026-09-30
updated: 2026-10-01
actors: [user, agent]
tags: [goal-layer, developer-experience, traceability]
---

## Scene

Asked to write requirements, both the user and the agent produce
"the system shall …" sentences. Reasonable, precise, and useless for the
question "what was this for?". The folder fills with behavior that the code
and the tests already express, and the purpose is nowhere.

## Expectations

- **891a** [stated] MUST NOT call this layer "requirements".
- **8ea6** [stated] SHOULD state background, purpose and constraints, not
  system behavior.
- **907b** [stated] SHOULD NOT define terms rigorously ("what is a user",
  "what is effort") — that precision is not wanted.
- **948b** [stated] SHOULD cover developer experience as well as end-user
  experience.
- **99ac** [stated] SHOULD move behavior sentences that already sit in the
  docs out of this layer.
- **a023** [stated] MAY keep traceability where it is cheap; it is not a
  goal in itself.
- **26c5** [stated] SHOULD let the user ask which want a piece of design protects and get an answer, without reconstructing it himself.

## Open questions

## Sources

- [891a] 「requirement はシステムの振る舞いを示す言葉としても使われているから、避けた方が良いことも分かった。」 (chat, 2026-09-13 to 15)
- [8ea6] 「「背景」「目的」「制約」を明文化した方がいい（human と AI で齟齬が減る）くらいに思っているだけなのかもしれない。」 / 「EARS って、既に仕様に踏み込んでいる気がするんだよねえ。」 (chat, 2026-09-13 to 15)
- [907b] 「もしかしたら、要求工学では、「再開はできるだけユーザの手間をとらせないこと」について「ユーザとは？」「手間をとらせないとは？」を厳密に定義していくことを目指すのかもしれないけど、ぼくはそこまでしたいのではなくて」 (chat, 2026-09-13 to 15)
- [948b] 「experience は僕が明文化したいことに近い。しかも、UX だけじゃなく、DXも、だ。それを明文化して、何がしたいかと言えば、それは最初から変わらず、AIの入力にして判断の支えにすること。」 (chat, 2026-09-13 to 15)
- [99ac] 「動かしたい。そういうリファクタリング的な skill or 機能が欲しい」 (chat, 2026-09-13 to 15)
- [a023] 「トレーサビリティはあった方がいいけど、なくてもいい。」 / 「Intentの明示や設計・実装とのトレースみたいなことが、大して役に立たないならこれ以上掘るのはやめようかと」 (chat, 2026-09-13 to 15)
- [26c5] 「守ろうとしている要件はなんだろう？」 (issue-c9df, 2026-09-13)
