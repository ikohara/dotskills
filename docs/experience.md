# Experience

The goal layer of dotskills: who uses it, what they take for granted, and
what the maintainer has ruled out. Scenes live in `experience/`; this file is
hand-written and is the first thing to read.

## Cast

- **maintainer** — the user. Solo developer of dotskills and of the projects that use kisou/shoroku. Works mostly with AI; returns to repos after weeks or months away.
- **agent** — Claude Code: Fable orchestrating, Opus/Sonnet subagents. Reads and writes the docs; starts every session cold.
- **collaborator** — a future human contributor who may not use AI at all.

## Drivers

At most five at MUST level. Each generalizes the expectations it points at.

- **b76a** MUST NOT lose the maintainer's reasons between conversation and repo ← exp-06d2, exp-1fb1
- **bf60** MUST NOT exclude non-AI human readers ← exp-37c2
- **c018** SHOULD keep the always-read set small ← exp-48b2, exp-b6bf
- **c233** SHOULD let the agent weigh stated concerns and propose alternatives ← exp-51d2, exp-58f1, exp-59eb
- **c60e** SHOULD NOT add human steps or gates just to capture reasons ← exp-0cfa, exp-75bc, exp-81aa

## Won't

What has been ruled out for this project, so that nobody proposes it again.

- **cab7** Rigorous requirements engineering (defining "user", "effort", etc.).
- **d061** Goal models or full traceability as an end.
- **d1b9** Bilingual `.ja.md` documents.
- **d443** A separate elicitation step ("WHY pass") before brainstorming — superseded by extraction inside shoroku.
