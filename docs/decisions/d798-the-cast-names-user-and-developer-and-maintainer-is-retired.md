---
id: "d798"
title: the Cast names `user` and `developer`, one human in two hats, and `maintainer` is retired
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: []
created: 2026-10-02
updated: 2026-10-02
---

## Context

The hub's Cast named the human `maintainer`, and the seven baseline scenes
carried it in their `actors:` lists and prose. Reading scene 06b2, the human
found the word sounded like the developer of dotskills or of tanto, while
the scenes mean the person who owns the project the skills are used in; and
one sentence of 06b2 — a commit naming a private repository — belonged to a
different hat, the skill developer's, which the Cast did not have. No
recorded reason had ever chosen `maintainer`. Decided by Kikaku on
2026-10-01, at the `experience-layer` migration kessai.

## Options

- **Keep `maintainer`.**
- **Fix only its definition line**, the lighter change.
- **Rename it to `user`, and add `developer`** (chosen).

## Decision

`maintainer` becomes `user` in the hub's Cast, in the `actors:` of every
baseline scene, and in their prose and expectation lines; the pronoun "he"
stays. The Cast lines:

- `user` — the person using the skills in projects of his own. Solo
  developer of those projects; works mostly with AI; returns to repos after
  weeks or months away. The same person as the developer, in the project
  hat.
- `developer` — the same person in the dotskills hat: ships the skills, and
  hears back from the repositories that use them.

`agent` and `collaborator` are untouched. The worked example's
`actors: [maintainer]` in `docs/experience/AGENTS.md`, and in the kisou
template it is installed from, is a generic example for any project and is
not changed by this decision.

## Consequences

- Fixing only the definition line was set aside because the word's sound was
  the complaint.
- With a skill-developer actor, `user` / `developer` splits where
  `maintainer` / `developer` would not (both are developers), so a scene can
  say whose want it is.
- The shipped templates and the worked example still say `maintainer`; the
  word the bundle uses is left to a later decision.

## Sources

- [d798] 「maintainer っていう actor がいることは分かったけど、その定義は？ 他には？」 (Kikaku, 2026-10-01)
- [d798] 「「maintainer」というと、dotskills や tanto skill の開発者っぽく聞こえる。「user」にしなかった理由はある？」 (Kikaku, 2026-10-01)
- [d798] 「これってbug-report系の話だよね。これは、それこそskillの開発者という新actorを起こして、「継続的な改善をしたいが、他repoの情報はその扱いに気をつける必要がある」みたいなシーンを新規に起こす必要があるんじゃないかな。」 (Kikaku, 2026-10-01)
- [d798] 「1-4. 推奨で。」 (Kikaku, 2026-10-01)
