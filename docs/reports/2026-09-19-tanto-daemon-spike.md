# The daemon spike: can a headless Claude Code session join a tanto run

A feasibility probe, measured 2026-09-19, for whether a non-interactive
Claude Code session can hold a tanto role: started headless, discoverable by
`ListAgents`, and reachable by `SendMessage` in both directions.

## Method

Four steps, run from an interactive Hosa session in this repository:

1. Start a headless session that stays alive.
2. From the interactive session, run `ListAgents` and note whether the
   headless session is listed, and how.
3. Send it one tanto-style line and see whether it arrives.
4. Have it send one line back.

## What was tried

`claude --bg "<prompt>"` — the CLI's own background-agent flag — was the
mechanism used, over the Agent SDK's `query()` loop, since it needed no code
and is what `claude agents` (list/attach/logs/stop) already manages.

The first attempt, with no `--model` flag, defaulted to `fable`/`high`: it
failed immediately with `API Error: 400 Claude Code 2.1.231 does not support
this model; version 2.1.251 or newer is required` (this machine's installed
CLI is 2.1.231). The second attempt added `--model sonnet` and started
cleanly, reaching `state: "working"` in `claude agents --json`. The
version-gated model default is worth a note for any future daemon set up on
this machine: name the model explicitly rather than relying on the
background-agent default.

## The four answers

1. **A headless session stays alive** via `claude --bg --model sonnet
   "<prompt>"`. It returns immediately with a short id (`claude agents`,
   `claude attach <id>`, `claude logs <id>`, `claude stop <id>` manage it from
   then on) and keeps running as a real Claude Code session against the same
   repository.
2. **It is listed by `ListAgents`**, distinguished from an interactive window
   two ways: `kind: bg` instead of `interactive`, and a `name` the harness
   derived from a short summary of its own task ("tanto inter-session
   messaging") rather than the random `dotskills-XX` names interactive
   sessions get. `claude agents --json` shows the same session with
   `kind: "background"`, its own `sessionId`, and a `state` field
   (`working`, `idle`, `blocked`, or `failed`) that `ListAgents`' own
   `status: idle | busy` does not carry.
3. **A tanto-style line reaches it.** `SendMessage` to the background
   session's listed name delivered a handshake-shaped line (with the
   `no-role` second line the protocol requires) exactly as it would to an
   interactive peer; the tool call returned success (queued, not held for
   approval, since this machine's own background session ran in the same
   auto-mode permission setting as the sender).
4. **It replies.** The daemon session answered `no-role` — the correct
   protocol reply, since its prompt never ran `/tanto` and so it had no role
   to act under. The reply arrived as an ordinary `<cross-session-message>`
   in the sending window.

## What this does and does not establish

The mechanics work: a headless background session is a first-class
`ListAgents`/`SendMessage` peer, no different in kind from an interactive
window, once `--model` is named explicitly. What this spike does not test:
whether a background session can run a tanto role file end to end (it was
never sent `/tanto <role>`, only a plain prompt), whether it survives a host
restart the way an interactive window's resume does, or what its permission
mode defaults to for tool use the human has not seen run once. Those are
follow-on questions for whoever picks up the daemon idea next, not settled
here.

Both test sessions (`89525a0a`, the failed fable attempt, and `77f1c053`,
the working sonnet one) were stopped at the end of this probe; neither left
a roster row, since neither ran `/tanto`.
