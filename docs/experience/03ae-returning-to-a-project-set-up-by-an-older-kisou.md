---
id: "03ae"
title: returning to a project set up by an older kisou
created: 2026-10-01
updated: 2026-10-01
actors: [user, agent]
tags: [conventions, migration, trust, user-effort]
---

## Scene

The user opens a project he scaffolded months ago, when the templates were
younger. The conventions have moved on since — a rule reworded, a type
renamed, a script added — and he wants this project to catch up without
redoing by hand what the tool once did for him. He has also edited some of
those files himself. He wants the tool to know what is its own and bring that
up to date, to show him before it touches anything he wrote, and to say
plainly what it could not make out rather than guess. If the same project gets
a different proposal each time he runs it, he stops trusting the proposal.

## Expectations

- **0eda** [stated] MUST NOT change a file he wrote without showing him the change and asking first.
- **0fa4** [confirmed] SHOULD leave alone, and tell him about, whatever it cannot make out in his project, rather than guess.
- **13c7** [confirmed] SHOULD give him the same proposal for the same project, so that a re-run is something he can trust and compare.
- **0ed2** [confirmed] SHOULD keep a project he set up months ago level with the conventions as they are now, without his redoing them by hand.

## Open questions

## Sources

- [0eda] 「理由を説明されたとしても、黙って上書きされるのは困る」 (Kikaku, 2026-10-01)
- [0fa4] inferred from the folded kisou requirement file 「a file it cannot classify is left alone and reported」 (2026-09-11) and 81e0; not stated directly. Confirmed 2026-10-01: 「今のところ他に違和感なし」
- [13c7] inferred from the folded kisou requirement file 「the same tree yields the same proposal」 (2026-09-11); not stated directly. Confirmed 2026-10-01: 「今のところ他に違和感なし」
- [0ed2] inferred from the folded kisou requirement file 「so kisou-using projects do not freeze at their scaffold-time template version」 and 「kisou owns the entire bundled template」 (2026-09-11), decision-281f, and the experience-layer spec's Requirements section 3; not stated directly. Confirmed 2026-10-01: 「今のところ他に違和感なし」
