---
id: "fb90"
title: twenty-two tanto-skill findings from one plan's T2 close, bundled
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-02
updated: 2026-10-04
---

Source: inbox 2026-10-01-tanto-findings-from-a-plan-close

Twenty-two findings from one reporter repository's plan close, each with
its proposed fix. Each can be triaged alone; they are kept as one issue so
the bundle stays whole and findable for `tanto-issue-triage`, and none was
re-verified here. Findings 17 and 19 reproduce by command and are the first
to take. Four belong with issues of their own: finding 5 with issue-db0c
(the ceiling), 9 with issue-4aab (the review-brief template), 18 with
issue-dfb3 (rows matched by name), and 21 with issue-dff9 (the undelivered
initial prompt). The reporter's severity: items 4, 5, 18 and 21 high in cost
(each stopped or mis-addressed a step), the rest low.

## Role files

1. **`roles/sekkei.md`, Step 1 — the restatement misses landed-but-unmerged
   specs.** An accepted spec of another topic, not yet merged, covered part
   of the new spec's scope and was found only in drafting, costing one
   correction turn. Fix: Step 1 names "every accepted spec on a branch not
   yet merged" as a source.
2. **`roles/sekkei.md`, write rules — a mid-turn human request was acted on
   before its decision reached `dialogue.md`.** A request that arrived
   mid-turn (a trial instruction file in another repository) was done first
   and recorded afterwards. Fix: name whether a file written in another
   repository is an exception, and state the record-then-act order for a
   mid-turn request.
3. **`roles/kanri.md`, the ask line — the model family came from a
   handover's note, not a fresh config read.** A project `tanto.json` the
   human removed changed the family to ask for; the ask used the old one.
   Fix: the ask line reads both config files at the moment of asking, as the
   handshake already does.
4. **`roles/kanri.md` exceeds the Read tool's 25000-token cap.** At about
   36000 tokens, a first read is a partial view of lines 1-950, with the
   close procedure on the second page; a Kanri's start context was 150682
   against a derived baseline of 86576. Fix: name a two-read start in the
   file, or move the close, intake and lifecycle sections to an on-demand
   file.
5. **The Kanri ceiling's baseline counts the first turn, not the forced
   cold read.** A Kanri's cold read alone (role file, contract, plan frame)
   put it over the derived ceiling (226302 against 219182) before one batch
   was ruled, so a handover fired at once. Fix: derive the baseline after
   the cold read, or add the cold read's size to it. (See issue-db0c.)
6. **`roles/kanri.md`, "Shusei, shoki, and the landing" — a resumed Keikaku
   answers `checkout free:` with `plan committed:`, not the
   `committed <subject>` the contract waits for.** When spec and plan land
   together the first line stands in for the second. Fix: say so in the
   section.
7. **The kessai's approval does not reach the harness's auto-mode
   classifier.** The close's `git merge --no-ff`, the local-branch delete and
   the writes of a shoki spawn request stalled on a classifier denial,
   although the human had approved exactly those acts in the kessai answer.
   The allow rules (`Bash(git merge --no-ff:*)`, `Bash(git branch -d:*)`,
   writes under `.tanto/spawner/requests/`) are the human's to add; the
   contract could name them at the kessai.
8. **`roles/kanri.md`, handover and address paragraphs — a send to a cached
   Kanri address succeeds during a handover and reaches the outgoing
   Kanri.** Seen twice (a Sekkei, then a Jisso): the send returned no error
   because the old session was still listed, and the harness's "messaging a
   new session… under a previously used name" note was the only cue. A
   fresh roster read cannot see a handover in progress; what made the send
   recoverable was that the report carried its own path in a file. Fix: name
   that note as the signal to re-read the roster, and keep every line's
   payload in a file.

## Templates

1. **`templates/review-brief.md` — two prose phrases stayed in English** in
   the last section ("no answer needed unless you object", "an answer here
   decides …"), because the template does not list them as form markers; the
   human had to ask for the section to be explained. Fix: list them as
   markers to render, or write them in the chat's language in the template.
   (See issue-4aab.)
2. **`templates/batch-prompt.md`, Setup — `Kanri — <name> [<ref>]` goes
    stale at every handover** between drafting and sending; a fix-wave
    prompt was corrected by hand. Fix: "Kanri — the roster's first data
    row".
3. **`templates/spawn-request.md` gives no recipe for the request `<id>`.**
    A request file written with an unset shell variable was named with a
    literal `${ts}` and landed beside the `requests/` directory, where the
    spawner never takes it; `date -u +%Y-%m-%dT%H-%M-%S-000Z` worked. Fix:
    put that command in the template.

## Plan drafting and review

1. **A plan step that runs after the plan's cold read must name a role
    still live then.** `plan.draft` and `plan.review` both wrote "Keikaku
    strikes" for a step that runs after Keikaku has stopped. Fix: a line in
    the plan-drafting and plan-review guidance.
2. **Post-strike prose that cites block ids breaks `lint` on the struck
    copy** (`missing-block`): a plan with alternative branches cited a
    passage id in prose, which no longer exists after the strike. Fix:
    describe by content, or have `lint` skip ids in prose.
3. **`passage-check.js lint` does not check that every passage id a task
    defines appears in that task's step list.** Four omissions in one plan
    (three tasks). Fix: add that check.
4. **A later passage or a rework that rewrites text an earlier passage
    produced leaves `verify --task N` red, and no rule says which runs are
    expected to fail.** Seen twice. Fix: a plan's "How a batch is verified"
    names the overlapping pairs, or `verify` reads a pair table.
5. **The batch-prompt wording "beyond the plan's blocks" is unsatisfiable
    for prose inside a `P` block**, because `passage-check verify` matches
    whole contiguous lines; only a line after the block, or an amendment of
    the block, can satisfy it. Fix: change the wording in the template, or
    document `verify`'s whole-line match.

## Scripts and the spawner

1. **`boundary.js record --event` stamps its own time onto every line.** A
    restated dispatch line is re-dated, a text that already begins with a
    stamp prints two, and the role file's example does not say the text goes
    in unstamped (seen across three tenures). Fix: an `--at <time>` form, or
    a stated convention that the text is unstamped.
2. **`boundary.js record --seat` writes the spawn prompt as the roster's
    Name cell without `[ref]`, and `--status` finds a row by that name text,
    which the census then renames.** A spawned row needs a hand rename
    before `--status` can find it, and a rename between two calls leaves a
    duplicate `live` row. Fix: write `name [ref]` from the spawner result,
    and match `--status` on the `[ref]`. (See issue-dfb3.)
3. **`boundary.js record --status` accepts only a value ending in `live`,
    `cleared`, `stopped`, or `queued`**, so the contract's
    `idle since <HH:MM>` marker cannot be written through it (it was done by
    hand with `sed`). Fix: a form for it.
4. **The census's rename detection compares name strings only.** After a
    background seat is resumed, the `[ref]` alone can change and the rename
    is missed. Fix: compare `[ref]` too.
5. **A `claude --bg -w` shoki's initial prompt never ran** (three spawns of
    three); the human attached and typed the `brief:` line. The census shows
    `blocked`, which carries no information here. Fix: the contract lists
    the typed `brief:` line as a `for you:` item. (See issue-dff9.)
6. **`roster.md`'s Events log is never pruned.** It reached about 162 KB and
    224 lines, and every Kanri start cold-reads it. Fix: prune closed plans'
    Events at the archive move, or read only the Events after the last
    `handover accepted`.

## Reproduction

The reporter's: no single command; each item is a reading of
the named file or script against the behavior described, taken from the
run's records. Items 17, 18 and 19 reproduce with
`node scripts/boundary.js record` against a copy of `templates/roster.md`
and `templates/kanri.md`: item 17 with `--event "2026-01-01 00:00 — x"` (two
stamps print), item 19 with `--status "<name> idle since 10:00"` (refused),
and item 18 with a `--seat` result file whose `name` has no `[ref]`,
followed by `--status "<name> [<ref>] stopped"`.

Scripts and the spawner, item 5, is resolved by the shoki-seat design
(decision-b282, decision-6c00): the shoki's prompt never ran because
`--add-dir` consumed it, and the spawner now puts the prompt first and treats
the CLI's idle note as a failed delivery. The bundle's other items stay open.
