# AGENTS.md

@CONTRIBUTING.md or read `CONTRIBUTING.md` first.

## Language

American English for everything in the repo:

- Code, log/error messages, comments, docs, commits, branch names, PRs, issues

Exceptions:

- User-facing strings: follow i18n conventions
- Chat with the agent: use the language of the user's first message

## Document management

Project context docs under `docs/` follow `docs/AGENTS.md` — read it before
adding or editing files under any `docs/<type>/`.

## Always do

- End commit messages with a `Co-Authored-By:` trailer identifying the AI agent
  (e.g., `Co-Authored-By: Claude <noreply@anthropic.com>`).
- After editing a skill's `SKILL.md`, review its sibling `README.md` for drift.

## Never do

- Edit any `AGENTS.md` / `CLAUDE.md` without explicit approval.
- Edit root Markdown files (`README.md` / `CONTRIBUTING.md`) without explicit approval.
- Commit secrets, local-only configuration, or user-specific paths.
- Amend a published commit.
- Push to `origin/main` without explicit instruction.
