---
id: "b7e1"
title: the agent view's folder-trust question after a detach takes no input
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-23
updated: 2026-09-23
---

Source: session 2026-09-23

Returning from an attached background seat to the agent view shows the CLI's
folder-trust question — "Quick safety check: Is this a project you created
or one you trust?" — for the terminal's folder, and the question takes no
input: neither "Yes, I trust this folder" nor "No, exit" can be selected.

Reproduction: in a repository whose trust `$CLAUDE_CONFIG_DIR/.claude.json`
does not record — `projects[<path>].hasTrustDialogAccepted` is not `true` —
`claude attach <id>` to a background seat, then leave it by `←`, `/exit`, or
`Ctrl+C` twice, the three ways out that return to the agent view. `Ctrl+Z`,
which returns to the shell instead, does not show it.

Environment: Windows, VS Code's integrated terminal, Claude Code CLI 2.1.280.

The same question at the start of an interactive `claude` in that folder does
take input, and answering "Yes, I trust this folder" there records the trust;
after that, no way out of a seat shows the question again. `.claude.json`
keeps one folder under two keys that differ in the drive letter's case —
`c:/…`, which the editor's sessions write, and `C:/…`, which a terminal
writes — and a trust recorded under one is not read under the other.

Workaround: run `claude` in the repository root once and answer "Yes, I trust
this folder". `tanto` prints that advice in one line when `.claude.json` does
not record the trust under the root as it resolved it (the
bg-seat-ergonomics design, 4.3). The fix is upstream's, and a report to
anthropics/claude-code is the human's to make.

Low because the seat keeps running whatever the question does, and the
workaround is one command.

Related: issue-fd4b (a `--bg` worktree spawn stuck on a startup dialog, the
seat-side neighbor of this one).
