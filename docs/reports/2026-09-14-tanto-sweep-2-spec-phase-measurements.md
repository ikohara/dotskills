# The tanto-sweep-2 spec phase, measured

Two measurements taken during the spec stage of the `tanto-sweep-2` topic, by
the Sekkei session that wrote the spec, and recorded at its exit because the
plan's own close report will not have seen the spec phase. The first is the
harness-reported cost of the four subagents the spec used; the second is a
single data point on `git hash-object` as a review referent, taken before the
rule it tests has landed. Both are point-in-time readings of one session; they
are evidence, not a general result.

## The cost of the four subagents this spec used

From the harness's usage lines, for req-04f5's affordability bullet and the
Measurements one-shots row:

| Subagent | Seat / model | Tokens | Tool uses | Seconds | Scope |
| --- | --- | --- | --- | --- | --- |
| Issue survey | `default`, sonnet | 190,301 | 51 | 650 | 41 issues |
| Fix-notes extraction | `default`, sonnet | 161,727 | 77 | 497 | 27 issues |
| Spec review | `spec.review`, opus | 155,064 | 37 | 622 | 16 findings |
| Review brief | `brief.write`, fable | 103,763 | 11 | 223 | — |

The review brief's 103,763 tokens and 223 s stand against 115,120 tokens and
262 s for the same day's context-ceiling spec brief — the same seat on the same
day, on a different topic.

The reading: the two sonnet reads replaced what a fable Sekkei would otherwise
have read into its own context; the spec was then written from their two files.

## `git hash-object` as the review referent works before the rule lands

The spec's 5.4 asks the reviewer and the brief writer to record the document's
hash at read time. This session applied that to itself, before the rule had
landed anywhere: the reviewer recorded `ff2a5ad6…`, the brief writer
`01b36c59…` and reported the hash unchanged across its read, and no edit was
made between a dispatch and its report.

One data point, and only that: the rule costs nothing and fixes the referent.
