---
id: "1c70"
title: tanto role names collide across repositories on one machine
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-06
updated: 2026-09-07
---

Found within minutes of the first real use after the skill landed
(issue-770d's dogfood): a second repository's `/tanto kanri` ran the start
sequence, renamed its session `kanri`, and `ListAgents` then showed two rows
named `kanri` on the machine, one per repository. The new Kanri could not tell
that the other row belonged to a different repository, and nothing in the
skill lets it: `ListAgents` shows name, ref, kind, and start time, not the
cwd or the repository.

The cause is a design assumption. Rule 4 makes roles per repository and the
roster per repository, but the session name space is machine-wide, and three
parts of the skill assume that a role name is unique on the machine rather
than in the repository:

- bare-name addressing (`to: "kanri"`, `to: "jisso"`), which `SendMessage`
  refuses as ambiguous once two live sessions share the name;
- Kanri's uniqueness check at a handshake, "exactly one `ListAgents` row with
  that name", which misfires on another repository's role;
- the `/rename <role>` step itself, which produces the collision.

Two repositories running tanto at the same time is the normal case for a
machine with several projects, so this is not an edge case.

Workaround in use from 2026-09-06: rename each role with the repository's
directory name in front, in the shape `ListAgents` already uses for its
default names, so `<dir>-kanri`, `<dir>-jisso`, and so on, and address peers
by that full name. This is manual discipline until the skill says it.

Proposed fix: make the repository-qualified name the rule. The start
sequence asks for `/rename <dir>-<role>` where `<dir>` is the basename of
the cwd; the handshake carries the same name; addressing in `SKILL.md`, the
four role files, and the templates uses `<dir>-<role>`; the uniqueness check
looks for that full name; the batch prompt's guard line keeps naming the
workspace path as a second check. design-4807's roster and addressing
sections change with it. The alternative, keeping bare `kanri` and having
Kanri ignore same-named rows whose handshake cwd differs, leaves the
`SendMessage` ambiguity in place and is not proposed.

Related: req-04f5 (one set of roles per repository), design-4807 (roster as a
uniqueness check, bare-name addressing).

Resolution (kanri-lifecycle, 2026-09-07): the skill stops using role names as
addresses altogether — decision-73c3. A session is addressed by the name it was
born with, no `tanto` session is renamed after it has started under the skill,
and the roster becomes the **address book** rather than a uniqueness check. The
three parts named above change with it: bare-name addressing now means the born
name, which is unique on the machine without any convention; Kanri's handshake
check "exactly one listing row with that name" — the check that misfired on
another repository's role — is deleted and replaced by two that do not depend on
machine-wide uniqueness; and the rename step, which produced the collision, is
gone from the start sequence.

The repository-prefixed workaround is no longer needed. A human may still rename
a session **before** invoking the skill, and the handshake carries whatever the
name is; the rule is only that nothing renames it afterwards.

The proposed fix above — making `<dir>-<role>` the rule — was not taken. It keeps
a rename in the start sequence, and the measurement that a rename invalidates
every address a peer holds is what the chosen design avoids. design-4807's
addressing section records both the shape and the one property the rejected
alternative had.
