# tanto boundary brief

The procedure the `boundary.verify` kind follows at one batch boundary, run on
Kanri's dispatch — and, under the design's shape 2, by a headless session: the
same text, the same arguments, the same output. You **dispatch nothing** and you
write **one** file. You judge nothing: every ruling is the resident Kanri's, and
your job is to read what it would otherwise read and to write the rows it would
otherwise write by hand.

Your dispatch names these arguments:

```text
topic=<topic> batch=<X> plan=<plan path> report=<report path>
ledger=<.tanto/<topic>/kanri.md> roster=<.tanto/roster.md> base=<merge base>
kanri-transcript=<Kanri's transcript path, from the roster's first data row>
tanto=<the skill's own directory>
peer readings since the last boundary, one per line, or none: <…>
top-family dispatches since the last boundary, one per line, or none: <…>
```

The last two lines are the two things you cannot see for yourself: the readings
peers' last lines carried since the previous boundary, and the top-family
dispatches a peer's line implied. They travel in the dispatch and go through
`record`.

## What you never do

Rule on an item. Message any session. Edit a tracked file. Run
`git checkout --` or `git clean`. Dispatch an agent. A tracked-file
modification `check` finds that the plan does not account for goes into the
verdict file's Failures section, **not** into the tree (contract rule 5): only
Kanri decides whether it is stray. The `ListAgents` self-check of `SKILL.md`'s
Resuming is not yours either — the listing shows the resident's own name, which
only the resident can compare with its roster row.

## The procedure

1. Run `check` **once**, from the repository root — the cwd every dispatch
   inherits, and the one `passage-check boundary` runs the plan's checks in:

   ```bash
   node "<tanto>/scripts/boundary.js" check --plan <plan> --report <report> \
     --base <base> --kanri-transcript <kanri-transcript> --tanto <tanto>
   ```

   Add `--measurement <path>` when the batch carried a measurement task whose
   report is a separate file. Read the output **whole**: it is this subagent's
   whole reason to exist. A repo-specific leftover no command knows about —
   a stray process, a temp directory — you note by eye and report under
   Failures.
2. From that output take: the `check:` line's pass or fail; the failing output
   of `boundary` and of `diff`, if any; the report's sections, `Rulings needed`
   and `Verify in the tree` among them, inside `## For Kanri`; Jisso's reading
   from the report's header; Kanri's reading with its ceiling, presence, and
   `ttl=` lines.
3. Run each check the report's `Verify in the tree` names — a test command, a
   file to look at — and note its pass or fail. A failure goes under Failures as
   well as under Verify in the tree.
4. Run `record` **once**, from the same directory:

   ```bash
   node "<tanto>/scripts/boundary.js" record --ledger <ledger> --roster <roster> \
     --batch <X> --tasks <N-M> --state reported --report <report> \
     --verdict "<the check: line>" \
     --kanri "<name [ref]>" --kanri-reading "<Kanri's reading, with its ttl= line>" \
     --jisso "<name [ref]>" --jisso-reading "<Jisso's reading>" \
     --peer-reading "<role> <name [ref]> <reading>" \
     --s-item "<source> | <item>" --event "dispatch: <kind> on <family>"
   ```

   One `--s-item` per item of the report's Shoroku proposal section, one
   `--peer-reading` per line the dispatch carried, one `--event` per top-family
   dispatch line it carried. The state you write is `reported` and nothing
   else: acceptance is a ruling, and the resident's own single `record` call
   carries it. Read what `record` prints — the rows it wrote — into the
   verdict file's Rows written.
5. Render `.tanto/<topic>/batch-<Y>-prompt.md` for the next batch from
   `templates/batch-prompt.md`: the plan's Batches table gives the next
   batch's tasks, and the roster's `queued` rows in handshake order give the
   Jisso. Fill the Previous batch verdict section's first line from the
   `check:` line and the report's For Kanri section, and leave the three slots
   that template names as `<Kanri fills>` — that section's ruling line, its
   deferral line, and the Rulings section's first line. Then make your second
   and last `record` call, for the batch you have just rendered:

   ```bash
   node "<tanto>/scripts/boundary.js" record --ledger <ledger> \
     --batch <Y> --tasks <N-M> --state sent --prompt <the rendered path>
   ```

   That row is bookkeeping, not a ruling — the prompt exists and the ledger
   should say so — which is why it is yours and not the resident's: the
   resident's one `record` call carries batch `<X>`'s acceptance, and nothing
   else. When the batch is the plan's last, write no prompt, make no second
   `record` call, and say so under Next prompt.
6. Write `.tanto/<topic>/batch-<X>-verdict.md`, below.
7. Reply with the one line, below, and nothing else.

## The verdict file

`.tanto/<topic>/batch-<X>-verdict.md`. Its first lines, before the headings,
carry the report's `git hash-object` and the plan's, as a review brief does, so
that a line number quoted under Failures has a fixed referent. Then ten `##`
headings in this order — and an eleventh, `Measurement`, when the batch carried
a measurement task — so that the resident reads it with
`passage-check sections` and never whole.

```text
- Report — <report path>, `git hash-object` <hash> (as read)
- Plan — <plan path>, `git hash-object` <hash> (as read)
```

## Verdict

one line: `pass` or `fail`, then the `check:` line verbatim

## Failures

the failing output of `boundary` and of `diff`, and each `Verify in the tree`
check that failed, or `none`

## Rulings applied

the report's Rulings section, verbatim, or `none`

## Rulings needed

the report's Rulings needed subsection, verbatim, or `none`

## Questions for the human

the report's section, verbatim, or `none`

## Deviations

the report's Deviations from the plan section, verbatim, or `none`

## Verify in the tree

each check the report named, with the pass or fail you got, or `none`

## Ceiling

Kanri's reading, its ceiling line, its presence line, and its `ttl=` line, as
`check` printed them; then Jisso's reading line

## Rows written

what `record` printed, as printed

## Next prompt

the path of the rendered prompt, or `none — final batch`

## Measurement

only when the batch carried a measurement task: that report's Tasks and
Verification sections, verbatim, for the contradiction Kanri reads them for

## The reply

One line, and nothing else:

```text
verdict: <verdict path> — pass|fail — rulings needed: <n>; human questions: <m>; compactions: <c>; ceiling: under|over, present|absent
```

`<n>` and `<m>` count the items under those two headings. `<c>` is the
compactions figure of Kanri's reading, so that handover signal 3 is read off
the line on a clean boundary too. `ceiling:` copies the two verdicts from
Kanri's ceiling and presence lines — `unavailable` and `absent` respectively
when a line is missing, as `SKILL.md`'s reading section already reads them.
