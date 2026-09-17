---
id: "c2d7"
title: a project memory rule is loaded by every role session of the repository, so a rule meant for one seat fires in all of them
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-12
updated: 2026-09-17
---

Claude Code's auto-memory is kept per project directory, and every tanto role
session of a repository runs in that directory, so every memory file the
human's Kanri accumulates is loaded into Sekkei, Jisso, and Kaiseki as well.
A rule written for one seat therefore fires in all of them, and the skill
text — the contract, the role files, the batch prompts — is not the only
instruction a role follows.

Measured twice. On 2026-09-11 a memory rule "run wayaku on a spec or plan
before asking the user to review" made the kisou-refresh plan Sekkei dispatch
five parallel `sonnet` translators, which exhausted the sonnet weekly quota
(kisou-refresh R-17; issue-5a17's case). On 2026-09-12 the same rule made the
tanto-workspace plan Sekkei dispatch a translator nobody had asked for, whose
fan-out ended its turn with nothing written (the case behind the issue on a
subagent that fans out). tanto's own text has never had a translation step;
the review brief in the chat's language is the review gate (kisou-refresh
R-8). The memory was rewritten on 2026-09-12 to say so.

Two things to write, both cheap. In `skills/tanto/`: one sentence, in
`SKILL.md` or the role files, that a role's authority is the contract, its
role file, Kanri's lines, and the batch prompts, and that a project memory
rule that would add a dispatch or a document is put to Kanri as a line
before it is acted on — under contract rule 11, with the next plan that
edits the role files (the cost topic). Outside the skill: the human's own
memory hygiene for a repository that runs tanto — keep the project memory to
facts about the tree and the tooling, and put working preferences into the
skill or the prompts, where every session reads the same text. A companion
observation for the cost topic: a memory file is part of every session's
system prompt and so of every cache write.

Related: issue-5a17, issue-2e52, the issue on a subagent that fans out and
writes nothing (2026-09-12, from the plan Sekkei's exit), the tanto usage
report of 2026-09-12.

**Resolved 2026-09-17.** `skills/tanto/SKILL.md`'s rule 3 now says a role's
authority is the contract, its role file, Kanri's lines, and the batch prompts, and
that a project memory rule which would add a dispatch or a document is put to Kanri
before it is acted on, "since the same memory is loaded by every session in the
repository". That is the one sentence inside the skill this issue asked for; the
memory-hygiene half is the human's own and needs no text.
