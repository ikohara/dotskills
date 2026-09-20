# Background seats: nine probes toward Kanri-spawns-Jisso

Nine measurements, run 2026-09-20 from an interactive Hosa session in this
repository (CLI 2.1.277), toward the `tanto-bg-seats` follow-on topic's own
input document (Kikaku decision `2026-09-20-native-bg-seats.md`, section 6):
can Kanri spawn a headless `claude --bg` session directly into a tanto role,
and what does that session's identity and permission behavior look like.
Every disposable test session was stopped and removed at the end; none
carries a role and none has a roster row.

## The nine

1. `claude --bg --model sonnet --permission-mode auto "/tanto jisso dotskills-10 [58f333]"`
   — **no.** Denied before the process even started:
   `Permission for this action was denied by the Claude Code auto mode
   classifier. Reason: [Create Unsafe Agents]`. Repeated with no
   `--permission-mode` flag at all (same denial) and with a plain non-role
   prompt (`"reply with just the word: pong"`, which started cleanly) to
   isolate the cause: the classifier fires on the *prompt content* naming a
   tanto role/address, not on `--bg` itself or on the permission mode chosen.
   Per the harness's own denial text, no workaround was attempted; this is
   the measured answer, not an obstacle to route around.
2. Permission-prompt blocking under a background seat — **how, partial.**
   `claude --bg --model sonnet --permission-mode manual "Run: git log --oneline -1"`
   ran to completion (`state: "done"`) with no visible pause; `claude logs
   <id>` shows the shell command executed and the answer printed, no
   permission dialog in the captured output. A plain read-only shell command
   is not gated even under `manual` mode in a background seat — `state:
   blocked` was not observed. Whether a genuinely gated action (a file write
   outside the allow-list, or item 1's own classifier class) produces
   `state: blocked`, and whether `claude attach` lets a human answer it, is
   not settled by this probe: item 1's denial fires before the session
   starts, so it never reaches a `blocked` state to attach to.
3. `Notification` hook with matcher `permission_prompt` — **untested.** No
   `Notification` hook is configured anywhere in this repository
   (`.claude/settings.json` and `.claude/settings.local.json` are both
   absent). Testing this meant adding a hook to config for the probe, which
   is a config edit this probe did not have standing to make unilaterally;
   left for the follow-on topic to test deliberately, with the human's say
   on the hook.
4. `--bg --session-id <uuid>` — **no, but resolved anyway.** The CLI refuses
   the flag outright: `warning: --bg manages the session id; ignoring
   --session-id (use --resume <id> to continue an existing session)`. The id
   it assigns on its own is still discoverable immediately after start from
   `claude agents --json`'s `sessionId` field, and the transcript lands
   exactly where expected: `<config>/projects/<slug>/<sessionId>.jsonl` —
   verified present. `node scripts/reading.js <that path>` read it cleanly.
   So the handshake's `transcript=` is not knowable before spawn, but is one
   `claude agents --json` call away after it, and `reading.js` needs no
   change.
5. `--agents <json>` — **no.** `claude --help` shows what it actually is:
   custom subagent definitions for the Task tool (the same shape as
   `skills/tanto/templates/agent.md` renders to a file), not a background
   session's own model or effort. It carries no field for the *session's*
   model or effort. tanto's two-scope `tanto-<object>-<act>.md` write-out
   stays exactly as it is; `--agents` is an unrelated, if similarly-named,
   mechanism.
6. `claude stop <id>` then resume — **how.** `claude stop <id>` followed by
   `claude --resume <id> --bg` **with no other flags or prompt** wakes the
   session with its saved options and keeps the same id. Passing any extra
   flag or a new prompt alongside `--resume` instead starts a *copy* under a
   new id (observed twice) — so "the same command continues it, extra flags
   copy it" is a real, sharp distinction, not a hypothetical one. A host
   restart was not part of this probe; `respawn` is confirmed to exist for a
   different case by `claude respawn --help` ("Restart a background session
   ... so it picks up the current Claude binary") — its own wording reads as
   an update-the-binary operation, not explicitly a crash-recovery one, so
   whether it also recovers a session that did not survive a host restart is
   still open.
7. `--brief` — **how, partial.** `claude --help` describes it as "Enable
   SendUserMessage tool for agent-to-user communication" — a tool-access
   flag, not a delivery channel by itself. Where `SendUserMessage`'s output
   actually surfaces (a hook payload, `claude logs`, a toast) was not
   exercised in this probe; no session was started with `--brief` and made
   to call it.
8. VS Code: does the extension list a CLI-started session; can a stopped one
   be resumed as a tab; does a CLI session see the IDE — **untested.** This
   probe ran entirely from a Bash tool with no VS Code window opened
   alongside it to check against; needs a human-present check, not a
   Bash-only one.
9. `claude attach` from the VS Code integrated terminal — **untested**, same
   reason as item 8.

## What this settles for the follow-on topic

Item 1's denial is the one finding that changes the shape of the idea, not
just fills in a blank: **Kanri cannot spawn a Jisso (or any seat) by handing
`claude --bg` a `/tanto <role> ...` prompt directly** — the harness's own
auto-mode classifier refuses it as "Create Unsafe Agents" before the process
starts, regardless of `--permission-mode`. Whatever a follow-on topic designs
for Kanri-spawns-Jisso has to route around this classifier (a different
prompt shape, a settings-level allow-rule the human adds deliberately, or
some other invocation this probe did not try) rather than assuming a
prompt-the-role-directly shape works as written.

Items 4 and 6 are otherwise unqualified good news: a background session's
identity columns (name, transcript path) are recoverable post-spawn with no
protocol change, and `reading.js` needs no change to read a `--bg` session's
transcript.

Items 3, 8, and 9 need a human-present check or a deliberate config/hook
edit and are not settled here.
