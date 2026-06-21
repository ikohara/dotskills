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

- Run `./{{scripts}}/{{lint}}.{bat,sh}` on the changed paths (relative to the repo root) and fix issues before committing. <!-- OPTIONAL scripts=lint -->
- Run `./{{scripts}}/{{tidy}}.{bat,sh}` on the changed C/C++ source files (paths relative to the repo root) and fix issues before committing. <!-- OPTIONAL scripts=tidy -->
- End commit messages with a `Co-Authored-By:` trailer identifying the AI agent
  (e.g., `Co-Authored-By: Claude <noreply@anthropic.com>`).
- <e.g., "Regenerate `{{src}}/api/spec.json` after touching API handlers">
- <e.g., "Run `./{{scripts}}/migrate.{bat,sh}` after adding a file to `{{src}}/db/migrations/`">

## Never do

- Edit agent instruction files, repo-root Markdown, or linter/formatter config without explicit approval.
- Commit secrets, local-only configuration, or user-specific paths.
- Amend a published commit.
- Push to `origin/main` without explicit instruction.
- <e.g., "Edit files under `{{src}}/legacy/` without explicit approval — owner is migrating it">
- <e.g., "Modify auto-generated files (anything matching `{{src}}/**/*_pb.go`)">
