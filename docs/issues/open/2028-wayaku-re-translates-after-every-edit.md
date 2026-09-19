---
id: "2028"
title: wayaku re-translates after every edit unless told not to
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-06
updated: 2026-09-19
---

Source: session 2026-09-06

While reviewing the tanto spec on 2026-09-06, the Sekkei session re-ran
`wayaku` on the spec after each of three small edits, without being asked,
because it read "translate before asking for a review" as "never present a
stale translation". Each run took about 15 minutes and 150-180k tokens, so
the three re-runs cost about 45 minutes of wall clock for a few changed
sentences.

The skill gives no such instruction. Its Step 2 mtime check only decides
what to do *when invoked*; nothing says to invoke it again after the source
changes. The gap is that nothing says *not* to, and an agent that infers a
"keep the translation fresh" duty is expensive.

Proposed fix, in `skills/wayaku/SKILL.md` under "Prohibited actions":

> Do NOT re-run on a file because its source changed. A translation is made
> on request and is not kept fresh; a new translation needs a new request
> from the user (`和訳更新`, `wayaku <path>`, or similar). A stale cache is
> the expected state between requests.

And one sentence in the overview: "on-demand" means the user asks each
time; the mtime check exists so that a repeated request skips work, not so
that the agent watches for changes.

Optionally mirror the sentence in req-5e6f (the wayaku requirement).

Measured 2026-09-07, in the Sekkei session of the kanri-lifecycle run: the
skill's update mode (`和訳更新`) diffed the old and new source per section and
patched only the affected regions on each of eight updates of a 3,400-line
plan, one to three minutes each, after a first full run that split the file
across five chunk subagents. So the premise above — a re-run costs a full
translation — held only for the first run. The measurement was taken with a
sonnet subagent that kept its context across the updates; a fresh invocation
has no such context, and whether it patches as cheaply is not measured. This
is data for the issue, not a resolution: the fix proposed above still decides
whether the agent re-runs at all.
