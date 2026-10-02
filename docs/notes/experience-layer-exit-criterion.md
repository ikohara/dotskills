# The experience layer's exit criterion

How the experience layer — `docs/experience.md` and the scenes under
`docs/experience/` — is judged: what would show that it earns its place, and
what would say to fold it back. Set by the `experience-layer` topic in
September 2026.

**What is measured, and why.** What the layer alone supplies is memory of
project-specific reasons. Model strength supplies the rest. The three outcomes the
developer expects of the layer — fewer questions at the spec and plan
stages, better-aimed recommendations, better improvement proposals — all move
with the model too, so none of them is the criterion by itself.

**Primary — unprompted use.** At each topic's close, count the `exp-` items
cited in the topic's spec, plan, ADRs, and review brief that the human did not
raise in that topic's `dialogue.md`, `spec-inputs.md`, or the Kikaku files
the topic cites: a `grep -o 'exp-[0-9a-f]\{4\}'` over the four documents,
set-minus the same grep over the dialogue and the inputs, the subtraction
comparing ids with or without the `exp-` prefix. Until a tanto topic gives
that count to the close's recommender or to Kanri, it is run by hand at the
close and written into the topic's dogfood report, or, when the report
precedes the close, into `docs/notes/tanto-measured-data-points.md`. The same count is one command, `node scripts/issues-by-finder.js --exp <topic>`, whose by-finder table is taken at the same moment and written beside it. **Zero
across three consecutive topics is the fold-back signal** — the number is the
developer's, set on 2026-09-30: fold the hub's Cast, Drivers, and Won't into
`AGENTS.md` and drop the scenes.

**Secondary — the counts the artifacts already carry**, compared only across
topics whose roster rows show the same model family for the seat that
produced them: per spec, the number of questions Sekkei put in
`dialogue.md`, and the number of design sections — the `##` sections of the
spec's design chapters that Sekkei wrote before the review gate; the number of points in the review brief; and the number of
requirement or experience items a spec review or the human sent back as
design. The baseline is `tanto-context-ceiling`, `tanto-cost`, and
`tanto-sweep-2`, read from `.tanto/<topic>/` and the ledgers; it is taken
again when the model family changes.

**Not used:** the count of "I rejected that already" remarks.

This note is not the migration's record: the counts of the experience-layer
migration itself are in `docs/reports/`, in that topic's dogfood report, and
they are not this criterion's baseline.
