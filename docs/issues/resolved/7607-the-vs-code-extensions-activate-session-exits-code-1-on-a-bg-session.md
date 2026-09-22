---
id: "7607"
title: the VS Code extension's Activate session exits code 1 on a `claude --bg` session (CLI 2.1.277; the extension's bundled binary one point release behind)
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-20
updated: 2026-09-22
---

Source: shoroku tanto-diet S-29

Measured during the background-seats probe. A session started with
`claude --bg` appears in the VS Code extension's session list under its
assigned name, but "Activate session" opens a tab whose process exits with
code 1. `claude attach <id>` in the integrated terminal works on the same
session, so the seat itself is fine and only the extension's own activation
path fails.

The leading suspect, unconfirmed, is that the extension's bundled binary is
one point release behind the standalone CLI (2.1.277 here). The extension's
own version number was not captured at the time, so this issue records only
the CLI's; whoever re-checks should capture both.

Re-check on the extension's next update. Until it passes, a background seat is
reachable by terminal attach only, which is the state the
`2026-09-20-tanto-bg-seats-probe.md` report froze.

Resolved by decision-363c: the extension's "Activate session" is not a premise
of the design. A terminal seat is reachable from the editor's integrated
terminal by the CLI's own `attach`, precisely because the extension's bundled
binary and the CLI drift — which is what this issue measured. The failure
stands as recorded; it simply no longer blocks anything, so there is nothing
left to re-check on the extension's account.
