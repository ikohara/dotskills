---
id: "73c3"
title: tanto sessions are addressed by their born names, never renamed, and the roster is the address book
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: ["0775", "8320", "7c87", "7a19"]
created: 2026-09-07
updated: 2026-10-06
---

## Context

A Claude Code session's name is machine-wide, while `tanto` keeps one set of
roles and one roster per repository. The tanto design of 2026-09-06 had every
role run `/rename <role>` so that peers could address it by its bare role
name, and treated the roster as a uniqueness check rather than an address
book. Three facts measured on 2026-09-06 undercut that. A rename invalidates
every address peers already hold: the old name stops delivering even with the
`[ref]` attached. Two repositories running `tanto` at once collided on the
name `kanri` within minutes of the skill's first real use (issue-1c70). And in
the VS Code extension the rename does not even reach the tab title the human
reads, so it buys no readability where it matters. A rename is also one human
command per session.

## Options

- **Keep the rename with a repository prefix**, `<dir>-<role>`, the workaround
  used from 2026-09-06. Removes the collision, keeps every other cost.
- **No rename.** A session is addressed by the name it was born with, the
  `[ref]` is its identity, and the roster is the address book, correct because
  nothing renames a session.
- **Bare role names, with Kanri ignoring same-named rows** from other
  repositories. Leaves `SendMessage`'s ambiguity in place, so addressing would
  need the `[ref]` anyway.

## Decision

No rename. The address of a session is the bare name its handshake carried;
an address written `<name> [<ref>]` is used as the bare `<name>`, and the
`[ref]` is appended to a `to` value only after `SendMessage` reports the name
ambiguous. Kanri's address reaches a role by a `kanri-address:` line, by the
second argument of `/tanto <role> <address>` the human pastes, or by the
roster's first data row. No `tanto` session is renamed after it has started
under `/tanto`, Kanri included; a rename before that is the human's own
choice. The roster is the address book, one row per live role, Kanri's row
first. Chosen by the human in the kanri-lifecycle spec dialogue of
2026-09-07.

## Consequences

- Addresses look like `dotskills-0d`, and `ListAgents` is less readable for
  the human; the `[ref]` column becomes load-bearing across the listing, the
  roster, and a handover.
- Templates that named `kanri` as an addressee take a `<kanri-address>` blank
  that Kanri fills with its own bare name.
- Only Kanri's own replacement needs peers told, which is the handover of
  decision-de63; every other replacement hand shakes and Kanri rewrites the
  row.
- The sessions of the run that made this decision keep their prefixed
  `dotskills-<role>` names to its end; the rule binds sessions started after
  the skill lands.
- design-4807's reasoning "a uniqueness check, not an address book" is
  reversed; its roster section changes at the next design write-out.
