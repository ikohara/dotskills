---
id: "b7d3"
title: the bug-report route needs no human relay, Kanri registers its address per user
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-07
updated: 2026-09-12
---

`SKILL.md`'s bug-report route ends with "Kanri is the intake, and the human
supplies the intake's address", and `roles/kanri.md` explains why: no session
outside the repository can learn Kanri's name, because `ListAgents` shows no
cwd, the roster is per repository, and the skill's runtime text never names
its source location. So every report crosses the human's hands twice — once
to learn the address, once more when the reporter cannot send. On 2026-09-07
the first real report (issue-e5a2, from the s2-paper-picker run) reached
this repository's Kanri as a path the human pasted into chat, and the human
asked whether the route could do without them.

What a session on the same machine can and cannot see:

- `ListAgents` lists every session of the user on the machine with its name
  `[ref]`, kind, and time since start; not its cwd, its role, or whether it
  runs `tanto`. A born name is prefixed with the cwd's directory name
  (`dotskills-d1`, `s2-paper-picker-aa`), which narrows the candidates but is
  neither unique nor stable, and a renamed session loses it.
- Asking candidate sessions "which of you is Kanri" works but interleaves a
  question into sessions that may have nothing to do with `tanto`; the guard
  reply `not me` exists, an answer does not have to come, and the one-boss
  rule is exactly a rule against unsolicited inbound traffic. A fallback,
  not a route.

Two routes need no question:

1. **Resolve the skill's link and read the roster.** Where the user-level
   skill directory is a link into the repository that ships `tanto` (as in
   this repository's own setup), `readlink` on it gives the repository, and
   `.superpowers/sdd/roster.md`'s first data row is Kanri's address, readable
   by any session of the same user. It fails where the skill is installed as
   a copy.
2. **Kanri registers itself per user.** Next to `tanto.json`, a file such as
   `$CLAUDE_CONFIG_DIR/tanto-kanri.json` maps a repository path to its
   Kanri's `name [ref]`; Kanri writes its row at start and at a handover
   (the successor overwrites the predecessor's row) and removes it at its
   own exit. A reporter looks up the repository that ships the skill it is
   reporting on. A row can go stale when sessions die with a VS Code
   restart, so the reporter checks that the name is in `ListAgents` before
   sending, and falls back to route 1, then to the human.

Recommendation, for the plan that takes this up: route 2 with the
`ListAgents` check, route 1 as the fallback, the human last — and the
reporter's side of `roles/kanri.md` ("Reporting from the other side") and the
Kaiseki standalone clause read the registry instead of asking the human for
the address. The roles' own address lookup is unchanged: Sekkei, Jisso, and
an attached Kaiseki get Kanri's address on the command line or from the
roster, never from the registry.

Open: the registry's exact location and shape (one file for all
repositories, or one per repository under the config directory); what a
reporter does when the repository that ships the skill has no live Kanri
(write the report, tell its own human, as today); whether the registry also
serves a cross-repository progress view (issue-3ca4) and so should carry more
than the address.

Resolved by the tanto-workspace plan (2026-09-12) on route 1 alone, not the
route this issue recommended. It proposed route 2 — a per-user registry file —
as primary, with route 1 (resolve the skill link, read the roster) as fallback.
What landed is route 1 only: the sender reads the intake's bare name from the
first data row of the target repository's `.tanto/roster.md`, which is Kanri's
row by construction, and checks it against `ListAgents` before sending; the
human supplies only the workspace path, where the sender does not already know
it. The core ask — no human relay for the **address** — is met. Route 2's
registry, and its open questions about cross-repository shape, were not built
and remain a live design alternative if the human's one remaining step is ever
worth removing too.

Related: issue-e5a2 (the report that travelled this route), decision-73c3
(addressing by born name; a registry is an address book beyond one
repository), design-4807 (Bug intake), req-04f5 (the human's interrupt
budget), `docs/reports/2026-09-12-tanto-workspace-dogfood.md`.
