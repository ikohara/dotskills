---
id: "b2b5"
title: wayaku's translation subagent writes scratch files into the repository root
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-07
updated: 2026-09-07
---

On 2026-09-07 a `wayaku` run in a Sekkei session left three empty untracked
files at the repository root, `seg0_r4_cur_ja.txt`, `seg82_r4_cur_ja.txt`,
and `seg86_r4_cur_ja.txt`, written by the translation subagent as scratch.
Kanri's leftover check at a batch boundary found them in `git status`;
neither the running plan nor the conductor had written them, and it took a
message from Sekkei to identify the source. Sekkei removed them and told its
subagent to keep scratch under the session scratchpad.

The skill's text gives the subagent no scratch location, so the subagent's
cwd, the repository root, is the default. Empty files are harmless, but any
scratch at the root shows in every `git status`, misleads a boundary check
that expects a clean tree, and could be staged by a `git add` on a directory.

Proposed fix: one sentence in `skills/wayaku/SKILL.md` telling the
translation subagent to write scratch only under the session's scratchpad
directory, or under `.wayaku/` if it must live in the repository, never at
the repository root. Related: issue-2028 (wayaku re-runs after every edit).

Provenance: the first report handled through the tanto bug intake
(design-4807, the kanri-lifecycle design of 2026-09-07). It arrived as a
peer's message rather than a bug-report file, and Kanri triaged it as an
issue in its commit slot at the batch C boundary.
