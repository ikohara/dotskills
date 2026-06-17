<!--
TEMPLATE FILL (delete this block after filling):
- This file is the agent-facing delta on top of CONTRIBUTING.md.
- Replace <...> with content. Sections marked OPTIONAL may be omitted.
- Do not duplicate information already in CONTRIBUTING.md.
- Delete this block before committing.
-->

# AGENTS.md

@CONTRIBUTING.md or read `CONTRIBUTING.md` first.

## Language

American English for everything in the repo:

- Code, log/error messages, comments, docs, commits, branch names, PRs, issues

Exceptions:

- User-facing strings: follow i18n conventions
- Chat with the agent: use the language of the user's first message

## Document management

Project context docs under `{{docs}}/` follow `{{docs}}/AGENTS.md` — read it
before adding or editing files under any `{{docs}}/<type>/`.

## Always do

- End commit messages with a `Co-Authored-By:` trailer identifying the AI agent
  (e.g., `Co-Authored-By: Claude <noreply@anthropic.com>`).
- When running `git rebase -i`, pass `-c core.hooksPath=/dev/null` to bypass
  pre-commit hooks during the rebase
  (e.g., `git -c core.hooksPath=/dev/null rebase -i ...`).
- Run `./{{scripts}}/{{lint}}.{bat,sh}` before committing.  <!-- OPTIONAL scripts=lint -->
- <e.g., "Run `./{{scripts}}/{{tidy}}.{bat,sh}` before opening a PR">  <!-- OPTIONAL scripts=tidy -->
- <e.g., "Regenerate `{{src}}/api/spec.json` after touching API handlers">
- <e.g., "Run `./{{scripts}}/migrate.{bat,sh}` after adding a file to `{{src}}/db/migrations/`">

## Never do

- Edit any `AGENTS.md` / `CLAUDE.md` without explicit approval.
- Edit root Markdown files (`README.md` / `CONTRIBUTING.md`) without explicit approval.
- Commit secrets, local-only configuration, or user-specific paths.
- Amend a published commit.
- Push to `origin/main` without explicit instruction.
- <e.g., "Edit files under `{{src}}/legacy/` without explicit approval — owner is migrating it">
- <e.g., "Modify auto-generated files (anything matching `{{src}}/**/*_pb.go`)">
