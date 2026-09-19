---
id: "b2b5"
title: empty files with wayaku's segment names appeared in the repository root, origin not established
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-07
updated: 2026-09-19
---

Source: session 2026-09-07

On 2026-09-07, while a Sekkei session was running `wayaku` update runs,
three empty untracked files appeared at the repository root,
`seg0_r4_cur_ja.txt`, `seg82_r4_cur_ja.txt`, and `seg86_r4_cur_ja.txt`. The
names are the translation subagent's segment naming, and files of the same
names exist under that session's scratchpad. That subagent states it wrote
its segment files only under the scratchpad and never in the repository, and
it was not the only subagent running in that window, so the writer is
inferred from the names, not established. Kanri's leftover check at a batch
boundary found the files in `git status`; neither the running plan nor the
conductor had written them, and it took a message from Sekkei to connect
them to the translator. Sekkei removed them and told its subagent to keep
scratch under the session scratchpad.

What is established: the skill's text gives the subagent no scratch
location, so a subagent whose cwd is the repository root has nowhere else by
default. Empty files are harmless, but any scratch at the root shows in
every `git status`, misleads a boundary check that expects a clean tree, and
could be staged by a `git add` on a directory.

Proposed fix, two parts. One sentence in `skills/wayaku/SKILL.md` telling
the translation subagent to write scratch only under the session's
scratchpad directory, or under `.wayaku/` if it must live in the repository,
never at the repository root. And on the next occurrence, capture the writer
before deleting (file timestamps against the subagents alive at the time) so
the origin is established rather than inferred. Related: issue-2028 (wayaku
re-runs after every edit).

Provenance: the first report handled through the tanto bug intake
(design-4807, the kanri-lifecycle design of 2026-09-07). It arrived as a
peer's message rather than a bug-report file, and Kanri triaged it as an
issue in its commit slot at the batch C boundary. Reworded the same day on
Sekkei's correction: the first text named the subagent as the writer.
