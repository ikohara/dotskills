---
id: "13ab"
title: twelve small prose gaps in `roles/kanri.md`, each with a proposed sentence
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-02
updated: 2026-10-02
---

Source: inbox 2026-09-25-kanri-md-prose-corrections

Twelve independent, small prose gaps in `roles/kanri.md`, each closable in
one sentence or a short adjacent clause, from one reader of the role file.
They are carried here rather than as a fix commit because items 1 to 4 and 7
to 12 add or reorder procedure, a decision each, and item 6 asserts a
platform behavior that was not verified here; item 5, the two id namespaces,
is the one pure correction and rides with the rest. Each can be triaged
alone.

1. **"When the plan lands," step 3** (the Requirements / ADRs / Deferred
   items / Shoroku-proposal recording rule) gives no mapping for a spec
   whose section headings are not those four literal names.
2. **"When the plan lands," step 2** (the Measurements landing entry)
   assumes Start step 5's opening entry was written, with no fallback for a
   topic whose opening entry was never recorded.
3. **"A seat's exit," step 2** lets a report that reads as a duplicate be
   skipped, without saying that a re-sent report can carry new content
   appended between the first send and the later read — just before a
   release, after which the session cannot re-send.
4. **"Timing"**'s "write no request" does not say whether it covers a
   `stop` or `ack` for a seat whose work this session already owns and has
   finished, or only a new dispatch or spawn.
5. **The human-access steps, step 2**: `claude attach <id>` does not state
   that `<id>` is the spawner's own id (its result file or `seats.json`),
   never the `[ref]` `ListAgents` prints; confusing the two produces "no job
   matching".
6. Nothing at the sentence after the `record` code block in the batch loop's
   step 6 warns that on Git Bash a `--status` value beginning with `/tanto`
   is rewritten by MSYS path conversion before `record` sees it, so `record`
   reports no matching roster row.
7. **"When the plan lands," step 4** says Kanri "waits for nothing" after a
   Jisso's spawn request, with no instruction to check the request's result
   file once for an `error` field, so a spawn that fails outright leaves
   Kanri waiting indefinitely.
8. **"The final batch," step 1**'s replay paragraph does not say that
   `verify --task N` against the finished tree holds only for a task no
   later task or fix round edited, so a reviewer hits expected failures
   indistinguishable from real ones.
9. The same paragraph does not say `replay`'s residual-needle sweep reads
   `replay`'s scratch copy, which holds passages only, so a needle a
   prose-specified rewrite removed shows a hit there and none in the tree.
10. The same paragraph does not say a hold on a class of dispatch or spawn
    belongs in the review dispatch's own prompt, not in a correction sent
    after the dispatch started.
11. **"The final batch," step 2** orders the fix-wave dispatch and the
    release of the prior batch's Jisso in one sentence without putting the
    release first, so an intervening act can leave that Jisso's exit
    unrecorded.
12. **"The batch loop," step 1** gives no instruction for what to check when
    a peer or the human asks whether the batch is healthy, leaving "the
    session is listed and has made a commit" indistinguishable from "its
    background work is progressing".

## The proposed texts

The reporter's Proposed fix, verbatim:

> Twelve independent one-sentence (or short-clause) fixes, each quoted in
> full as it reads and as it should read. A fix applies only to the sentence
> or clause shown; nothing else in its paragraph changes.
>
> **1.** File: `roles/kanri.md`, "When the plan lands," step 3.
> As it reads: "Nothing is copied and nothing is recommended: the close's
> recommender reads those four sections of the spec by name, and Keikaku's
> shoroku proposal, named in the `coldread answered:` line, is form-checked
> and recorded the same way ("A seat's exit", step 2)."
> As it should read: "A spec whose headings are not those four names is
> mapped by sense — its goal, fixed-inputs, and verified-facts sections as
> Requirements, its rejected-alternatives or ADR text as The ADRs, its
> out-of-scope section as Deferred items — and each row's Source names the
> sections it stands on, so that no Kanri guesses the mapping fresh. Nothing
> is copied and nothing is recommended: the close's recommender reads those
> four sections of the spec by name, and Keikaku's shoroku proposal, named in
> the `coldread answered:` line, is form-checked and recorded the same way
> ("A seat's exit", step 2)."
>
> **2.** File: `roles/kanri.md`, "When the plan lands," step 2.
> As it reads: "Take your own reading again and add its `context=` figure to
> the Measurements per-boundary row as that topic's landing entry, beside the
> opening one, with the delta between them."
> As it should read: "Take your own reading again and add its `context=`
> figure to the Measurements per-boundary row as that topic's landing entry,
> beside the opening one, with the delta between them — or, when Start step
> 5's opening entry was never written (a topic renamed or inherited past that
> step), `delta: no opening entry` and an Events line saying so; nothing is
> backfilled from memory."
>
> **3.** File: `roles/kanri.md`, "A seat's exit," step 2.
> As it reads: "A file that fails the form is one line back to the session,
> answered by a rewrite; a file that passes is recorded — one `pending` row
> per item, Source the proposal's path and the item's number — and you send
> a tab seat `release: /clear this window`, its row going `cleared`, or
> write a terminal seat's `stop` request, its row going `stopped`, nothing
> `/clear`ed and nothing said to it;"
> As it should read: "A file that fails the form is one line back to the
> session, answered by a rewrite; a file that passes is recorded — one
> `pending` row per item, Source the proposal's path and the item's number.
> A report re-sent after its first recording is re-read in full here, not
> skipped as a duplicate: a file it names may have grown since the last
> read, and the release about to go is the last moment to read it, since a
> released session sends nothing again. Then you send a tab seat
> `release: /clear this window`, its row going `cleared`, or write a
> terminal seat's `stop` request, its row going `stopped`, nothing
> `/clear`ed and nothing said to it;"
>
> **4.** File: `roles/kanri.md`, "Timing."
> As it reads: "Between the last of those and the handover file, dispatch
> nothing new and write no request: no batch prompt, no review, no spawn —
> the commit window's own slots are not new dispatches, and a seat that fell
> due at this boundary is the successor's to start."
> As it should read: "Between the last of those and the handover file,
> dispatch nothing new and write no request: no batch prompt, no review, no
> spawn — the commit window's own slots are not new dispatches, and a seat
> that fell due at this boundary is the successor's to start. A `stop` or
> `ack` request for a seat whose work this session already owns and has
> finished — a Keikaku whose `coldread answered:` line is recorded — is not
> new work and goes out before the handover file; only a dispatch or a spawn
> is held."
>
> **5.** File: `roles/kanri.md`, the human-access steps, step 2.
> As it reads: "On a grant, tell the human as a numbered list: 1.
> `claude attach <id>` for a terminal seat, or go to `<name> [<ref>]` for a
> tab seat;"
> As it should read: "On a grant, tell the human as a numbered list: 1.
> `claude attach <id>` for a terminal seat — `<id>` the spawner's own id from
> its result file or `seats.json`, never the `[ref]` `ListAgents` prints,
> which is a different namespace and fails with "no job matching" — or go to
> `<name> [<ref>]` for a tab seat;"
>
> **6.** File: `roles/kanri.md`, the sentence after the `record` code block in
> the batch loop's step 6.
> As it reads: "It carries the Batches row's state and verdict your ruling
> gives, the Progress line, the Status changes this boundary decided…"
> As it should read: "On Git Bash, a `--status` value beginning with `/tanto`
> is rewritten by MSYS path conversion (`/tanto jisso …` becomes
> `C:/Program Files/Git/tanto jisso …`) and `record` then finds no roster
> row: put `MSYS_NO_PATHCONV=1 MSYS2_ARG_CONV_EXCL="*"` before `node`. It
> carries the Batches row's state and verdict your ruling gives, the Progress
> line, the Status changes this boundary decided…"
>
> **7.** File: `roles/kanri.md`, "When the plan lands," step 4.
> As it reads: "You wait for nothing: the seat's orders are in its prompt,
> and its report is what wakes you next."
> As it should read: "You wait for nothing but read the request's result
> file once when it lands: a result carrying `error`
> (`templates/spawn-request.md`) is a seat that never started —
> "Workspace not trusted" on a repository never opened on this machine and
> profile is one such — and the wait it would otherwise begin never ends.
> The seat's orders are in its prompt, and its report is what wakes you
> next."
>
> **8.** File: `roles/kanri.md`, "The final batch," step 1, the replay
> paragraph.
> As it reads: "Name in the same prompt what the replay skips — the test
> suites, the census, `verify` — so that the reviewer runs those in the
> working tree itself instead of deriving the list."
> As it should read: "Name in the same prompt what the replay skips — the
> test suites, the census, `verify` — so that the reviewer runs those in the
> working tree itself instead of deriving the list. `verify --task N` holds
> at the finished tree only for a task no later task or fix round edited:
> name those tasks, or say whose `verify` is expected to fail, and let
> `replay` be the whole-plan check."
>
> **9.** File: `roles/kanri.md`, the same paragraph as item 8, the sentence
> after it.
> As it reads: (nothing — item 8's sentence ends the paragraph.)
> As it should read: "`replay`'s residual-needle sweep reads the scratch
> copy, which holds passages only, so a needle a prose-specified rewrite
> removed shows hits there and none in the tree: the reviewer re-sweeps the
> working tree before reporting a hit."
>
> **10.** File: `roles/kanri.md`, the same paragraph as item 8, its last
> sentence.
> As it reads: (nothing — item 9's sentence ends the paragraph.)
> As it should read: "Every hold in force at the send — on real-serve
> spawns, on a command — goes into this prompt too: a hold sent mid-flight
> reaches the seat after the run it constrains has started."
>
> **11.** File: `roles/kanri.md`, "The final batch," step 2.
> As it reads: "Turn its findings into one more batch prompt — the final
> batch — and send it to the next queued Jisso, as any batch. In that same
> turn send `release:` to the Jisso that ran the last implementation batch —
> its wait ended with this review's verdict."
> As it should read: "First send `release:` to the Jisso that ran the last
> implementation batch — its wait ended with this review's verdict; a
> terminal seat's is its `stop` request. Then, in that same turn and after
> it, turn the findings into one more batch prompt — the final batch — and
> send it to the next queued Jisso, as any batch."
>
> **12.** File: `roles/kanri.md`, "The batch loop," step 1.
> As it reads: "You hold no clock while you wait: a report is overdue when
> the human says the batch has gone quiet, or when your window wakes for
> anything else and the report has not arrived. Say in your boundary line to
> the human which signal you are waiting for, so that the human is that
> detector."
> As it should read: "You hold no clock while you wait: a report is overdue
> when the human says the batch has gone quiet, or when your window wakes
> for anything else and the report has not arrived. Say in your boundary
> line to the human which signal you are waiting for, so that the human is
> that detector. When the human or a peer asks whether the batch is
> healthy, answer from the process under the seat's own background command
> — its creation time, its output file's growth — not from the session
> listing and `git log` alone, which show a session that exists, not work
> that progresses."
