# tanto roster

Kept by Kanri at `.superpowers/sdd/roster.md`. Kanri is the only writer.

## Keeping rule

- One row per role, Kanri's own row first.
- One live session per role. A second handshake for a role that already has a
  live row gets no row and is reported to the human.
- Every handshake rewrites that role's row in full.
- A row whose session is no longer listed by `ListAgents` gets status `dead`.
  Rows are never deleted, so the run stays readable after a replacement.
- This is a uniqueness check, not an address book. Peers address a role by its
  bare name. The `[ref]` column exists only for the case where a rename was
  skipped and two sessions share a directory-derived name.
- Kanri dispatches nothing to a session that has no accepted row here.

| Role | Name [ref] | cwd | Model | Branch | Mode | Started | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| kanri | <name> [<ref>] | <absolute path> | <model id> | <branch> | <auto or unknown> | <YYYY-MM-DD HH:MM> | live |
| <role> | <name> [<ref>] | <absolute path> | <model id> | <branch> | <auto or unknown> | <YYYY-MM-DD HH:MM> | live |

Status is one of `live`, `dead`, `replaced`, `refused`. `refused` records a
handshake that got no row — a duplicate role, or a model that did not match
`sessions.<role>` — and is always followed by an Events line saying which.

## Events

- <YYYY-MM-DD HH:MM> — <one line: a handshake accepted, or refused and why; a
  rename observed or skipped; a session declared dead and what was verified;
  the conductor ledger moved from .superpowers/sdd/<topic>/ to
  .superpowers/sdd/<plan-basename>/; a VS Code restart and which roles were
  recreated>
