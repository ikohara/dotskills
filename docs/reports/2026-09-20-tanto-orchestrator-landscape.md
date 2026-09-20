# tanto against the 2026 orchestrator landscape

A survey of what else exists for running several Claude Code sessions against
one repository, and of where tanto's distinctive value actually sits, frozen
as it stood when the `tanto-bg-seats` topic was placed. The material comes
from a Kikaku discussion, "native background seats", of the same date; this
report exists because that file is untracked and the follow-on topic's Sekkei
needs the survey to cite.

## 0. Where this came from, and how much to trust it

Every claim below about a third-party project is **second-hand** — read from
discussion and documentation, not run. Nothing here was benchmarked in this
repository. The three corrections in section 1 are the human's, made against
a first pass of the same survey that got them wrong; they are recorded as
corrections rather than folded in silently, because the first pass's errors
are the instructive part.

The claims about tanto's own behavior are the exception: those are measured
in this repository and recorded elsewhere in `docs/`.

## 1. Three layers, and the three things the first pass got wrong

**Three layers exist, and the anxiety about "is tanto obsolete?" came from
conflating them.**

*Claude Code's own.* Subagents — stateless fan-out inside one session, which
is what tanto dispatches. **Agent Teams** (2026, experimental, opt-in with
`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`): a lead spawns teammates as
separate Claude Code processes with their own contexts, a shared task list
and direct messaging — the closest native thing to tanto's transport. The
**Workflow tool** (2026-05-28): a deterministic script of `agent()`,
`parallel()` and `pipeline()`, resumable by run id. `ListAgents` and
`SendMessage`, which tanto is built on. And the background-session family —
`claude --bg`, `claude attach`, `claude stop` — which the probe of the same
date exercised.

*External orchestrators.* Claude Squad, Conductor, Crystal (now Nimbalyst),
Vibe Kanban (its company shut down 2026-04-10; the project is
community-maintained and local), claude-swarm, CodeAgentSwarm, and
**oh-my-claudecode (OMC)** — the one closest to tanto: "teams-first", a
Claude Code plugin, `omc team` for tmux CLI workers each in its own worktree
and `/team` for the native in-session team, a Model × Agent matrix with
premium / balanced / budget presets (the same idea as `tanto.json`), 19
agents, Gemini and Codex as workers, `/Skillify` extracting reusable patterns
into `.omc/skills/`, psmux for Windows.

*Local backends.* Not orchestrators but delegation targets — MCP servers that
send a subagent's work to Ollama, llama.cpp, LiteLLM or DeepSeek while the
Claude Code session stays the orchestrator; Zen MCP for multi-model
consultation.

**Three corrections.**

1. **Worktrees do not make parallel development easy.** The literature's own
   sentence: git worktrees solve file-level conflicts and *expose runtime
   conflicts*. Two worktrees still bind port 3000, share the database and the
   GPU, and each needs its own `node_modules` (symlinking breaks the
   isolation). The workarounds on record are per-worktree port arithmetic
   with `.env` rewriting, a database per worktree, and finally Docker or
   preview environments. So "nine OSS orchestrators solve parallelism with
   worktrees" means **file parallelism only**. tanto pays no isolation tax
   because its serial batches need none; on a one-GPU machine that is a
   coherent design, not a weakness.
2. **tanto does parallelize — across stages.** A Sekkei writes the next
   topic's spec while a Jisso runs this topic's batches; the draft-spec
   artifact exists for exactly that. The correct contrast is **pipeline
   parallelism** (tanto does it, modestly: one Sekkei beside one Jisso)
   versus **data parallelism** (the others do it, and it is the axis that
   collides on runtime resources). The axes are orthogonal. The first pass
   called this "giving up throughput" and was wrong.
3. **"Nobody keeps organizational memory" was too strong.** OMC's `/Skillify`
   does. The difference is the target: OMC keeps **how**, as a skill; shoroku
   keeps **why, the rejected alternative, and the measured fact**, as
   requirements, decisions and issues. To the human's question — can an AI
   work it all out from the code? — the answer is no: code records what and
   how, while a rejected alternative, a measurement ("a rename stops delivery
   even with the ref, measured 2026-09-06") and a threshold's origin leave no
   trace in code and are the most expensive things to re-derive.

**Compaction versus handover.** These are not two schools at one layer.
Compaction is what the harness does when nobody manages the lifecycle;
handover is what an orchestrator does when someone does. tanto's handover
file, roster, ledger and the SDD progress file are the handover schema almost
one for one; what tanto adds is measuring **before** the compaction rather
than counting compactions after. So handover is not a minor difference — but
the first pass's evidence for it, "Anthropic does both, see Agent Teams", was
wrong: Agent Teams is parallel separate contexts, not sequential handover.
The Anthropic-side evidence for handover is `--resume`, `--fork-session`, and
`claude stop` keeping a conversation for `attach`.

## 2. The three values are coupled, and the transport is not one of them

**tanto's distinctive value is three things**, and no framework in this
survey has them together.

1. **Pipeline parallelism on one tree** — a topic's spec written beside
   another topic's batches, no worktree, the human watching one tree.
2. **Measured, pre-compaction seat rotation** — the reading instrument
   against a configured ceiling; a Jisso retires per batch, a Kanri hands
   over on a measured figure, before the harness compacts.
3. **The shoroku loop** — every seat's exit writes a proposal; the close
   recommends, the human answers by exception, the apply writes `docs/`.

**They are coupled, not independent.** A first reading rated 2 as the value
with the shortest life, since harness compaction keeps improving and
`--autocompact <auto|tokens>` already exists. The review corrects that: **2
is 3's supply mechanism.** Rotation is what creates the exit boundaries at
which proposals are written; drop 2 in favor of compaction and the boundaries
that feed 3 disappear with it. Their lives are one life.

**The transport is not a value.** Sessions, addresses, the handshake, the
roster's liveness half, the message grammar — OMC has the same, and Agent
Teams is native. It is the part tanto maintains by hand, and the part being
commoditized.

So the decision the follow-on topic faces is not "keep tanto or not" but
**"keep paying for a hand-maintained transport, or move the three values onto
a transport the harness provides"**. The human's answer, at the time of this
survey, is the latter: 載れるなら載った方がいい. The ADR that records the
choice belongs to that topic, and takes this section as its context.
