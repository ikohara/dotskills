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
- Commit by explicit path with `git commit --only <paths>` — the index is shared. New files need `git add <paths>` first (`--only` can't pick up untracked files).
- End commit messages with a `Co-Authored-By:` trailer identifying the AI agent
  (e.g., `Co-Authored-By: Claude <noreply@anthropic.com>`).
- <e.g., "Regenerate `{{src}}/api/spec.json` after touching API handlers">
- <e.g., "Run `./{{scripts}}/migrate.{bat,sh}` after adding a file to `{{src}}/db/migrations/`">

## Never do

- Edit agent instruction files, repo-root Markdown, or linter/formatter config without explicit human approval.
- Commit secrets, local-only configuration, or user-specific paths.
- Stage or commit beyond explicitly named paths — `git add -A` / `.` / `-u`, bare `git commit`, or `git commit -a` — without explicit human approval.
- Amend a published commit.
- Push to `origin/main` without explicit human approval.
- Bypass commit or push verification hooks (`git commit --no-verify` / `-n`, `git push --no-verify`, or a `core.hooksPath` override) without explicit human approval.
- <e.g., "Edit files under `{{src}}/legacy/` without explicit approval — owner is migrating it">
- <e.g., "Modify auto-generated files (anything matching `{{src}}/**/*_pb.go`)">
