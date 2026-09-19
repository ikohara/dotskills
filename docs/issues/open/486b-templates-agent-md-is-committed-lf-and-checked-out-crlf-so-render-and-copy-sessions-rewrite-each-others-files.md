---
id: "486b"
title: "`templates/agent.md` is committed LF and checked out CRLF, so a rendering session and a copying session find each other's twelve files \"differing\""
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-16
updated: 2026-09-20
---

Source: shoroku tanto-sweep-2

Found in the tanto-sweep-2 run and recorded in that run's ledger (S-61).

`skills/tanto/templates/agent.md` is committed with LF endings and checked out
with CRLF under this host's `core.autocrlf=true`. The agent-definition
comparison that decides whether a rendered definition is up to date compares
content byte-for-byte, so the endings alone decide the answer: a session that
renders the definitions through `sed` produces LF, a session that copies the
checked-out template produces CRLF, and each then reads all twelve of the
other's files as "content differs" and rewrites them. Neither rewrite is
wrong; the flap is pure line-ending noise and repeats every time the two paths
alternate.

Two fixes, either sufficient on its own and neither applied:

- the "content differs" comparison ignores line endings; or
- the render normalizes line endings so both paths produce the same bytes.

issue-6f3d is the sibling symptom of the same `core.autocrlf` cause — a
created Markdown file always landing with LF in the working tree — but it does
not cover the render-versus-copy comparison, which is where this one bites.

Related: issue-6f3d.

**2026-09-20, `bug-report-hold` — a second symptom, in the start sequence
itself.** `SKILL.md`'s Start sequence tells a session to rewrite an agent
definition whose "content differs" from what the template renders, and that
test is byte-level. Measured at one session's start: all thirteen
`~/.claude/agents/tanto-*.md` differed from the rendered template **only in
line endings**. A session that took the test literally would rewrite thirteen
files at every start, for ever; this one compared after normalizing and wrote
nothing.

Same cause as the paragraphs above, at a second site, and either fix already
listed closes it — the comparison normalizes line endings, or the template is
committed LF. Worth stating that the Start sequence, not only the
render-versus-copy path, is where the flap is paid.
