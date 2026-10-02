---
id: "355d"
title: "the shipped worked example and the bundle's word for one person: `maintainer`/`human`/`user`, a `[confirmed]` entry without its quote, and a near-duplicate of scene 7bb3"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-02
updated: 2026-10-02
---

Source: shoroku experience-layer S-69

Everything here lives in `skills/kisou/templates/docs/experience/AGENTS.md`
and its installed copy `docs/experience/AGENTS.md`, which the doc-system hook
pins byte for byte, so the two change together. The Kikaku decision of
2026-10-01 (decision-d798) left the worked example's `maintainer` unchanged
"by this decision", so the bundle's one word is still a decision to make.

- **The word** (S-69). The shipped templates say `maintainer` — the hub
  skeleton `skills/kisou/templates/docs/experience.md` and the type rules
  `skills/kisou/templates/docs/experience/AGENTS.md` in its frontmatter
  example and its worked example, with the installed copy the same — while
  this repository's hub and scenes say `user` and `developer` after the
  rename. Whether the template follows the rename is decided nowhere.
- **Three words for one person** (S-81). Before the close's fix, the hub
  skeleton said "what the maintainer has ruled out", the type rules "what
  the human has ruled out", and this repository's hub "what the user has
  ruled out". A fresh scaffold's author read one word in the file they fill
  and another in the rules that govern it. The hub skeleton's own line was
  corrected at the close to "the user"; the type rules' word and the
  examples' remain.
- **A `[confirmed]` entry without its quote** (S-48). The worked example's
  `[3b2d]` Sources entry reads "Confirmed 2026-09-15." with no quoted
  words, against the Sources form the same file gives, so a project that
  copies the example writes a `[confirmed]` line the form rejects.
- **A near-duplicate of a real scene** (S-89). The installed worked example
  (scene `c4e1`, "returning after months", actors
  `maintainer, agent, collaborator`, three expectations) is a near-duplicate
  of this repository's real scene `7bb3` of the same title (actors
  `user, agent, collaborator`, five expectations): an agent reading the rules
  file and the directory sees two "returning after months" scenes with
  different casts.
