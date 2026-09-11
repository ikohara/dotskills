---
id: "2e52"
title: tanto's roles read reports whole and verify a boundary by hand-built shell, where a sections tool and a boundary script would keep the raw output out of the context
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-11
updated: 2026-09-11
---

The skill's cost signal is the transcript reading, and what fills a Kanri
transcript, measured on the kisou-refresh run of 2026-09-11 (1.86 MB at the
first resume, before any batch), is in this order: the cold read (the spec
whole plus the plan's frame, about 30k tokens — the frame alone was 1335
lines because the plan's Global Constraints and instrument specification are
long); reports, proposals, and review files read whole with `cat`; the
verification output at every boundary (`git status`, `git show`, the test
run, lint); and the review brief's form check. Every one of those enters the
context at full size, and the roles then extract the few lines they act on.

The idea worth borrowing is the context-mode plugin's: run the command where
the output stays out of the context, and bring back only what was derived
from it. tanto does this in one place already — the frame command in
`roles/kanri.md` collapses every task's steps to a line count — and nowhere
else. Raised by the human on 2026-09-11: "この repo で context-mode をあまり使
えてないな、と思っていて。tanto skill の中で、context-mode（があれば）を使え
るところとか、あるいは、context-mode と同じアイデアで token を減らす手法とか
はないかな？"

Three concrete places, in the order of what they would save:

1. **A sections tool.** The batch report, the Kaiseki report, the review
   brief, the shoroku proposal and direction, and the two review reports all
   have fixed skeletons. A `sections` subcommand of
   `skills/tanto/scripts/passage-check.js` — or a second small script —
   prints the named sections of a file and nothing else, and the role files
   say "read a report by its sections, never whole": Kanri reads a batch
   report as For Kanri, Rulings, Questions for the human, Deviations, Shoroku
   candidates, which is the order `roles/kanri.md` already prescribes. On
   this run Kanri did it by hand with `awk` for the candidates sections and
   with `cat` everywhere else.
2. **A boundary script.** Kanri's tree verification at every batch boundary
   is the same set of commands each time — `git status` clean, the commits
   and their trailers in a loop, the test run on the floor, lint on the
   changed paths, the plan's own acceptance command — and today it is
   composed ad hoc in one Bash call with `grep` filters. A `boundary`
   subcommand that runs the plan's "How a batch is verified" list and prints
   one pass or fail line per check, with the failing output only, is the
   same instrument for Kanri that `diff` and `verify` are for Jisso.
3. **A staged frame.** The frame command prints everything outside the task
   steps. A first stage that prints only the headings, the Batches table,
   How a batch is verified, and the Self-Review, with each task's head on
   demand by number, would have cut the kisou-refresh cold read by more than
   half; the specification sections a plan carries for its implementers are
   not what Kanri rules on.

When the context-mode plugin is present, the boundary bundle can run through
its batch execution and be queried instead of read; the skill cannot assume
the plugin, so the role text would say "through context-mode when it is
available, otherwise through the script", and the script is the thing that
must exist either way.

The measurement is already in place: the roster's Residency readings. A run
with the sections tool and the boundary script, read against this run's
figures (Kanri 1.86 MB and 19 wake-ups at the first resume; the plan Sekkei
2.99 MB at `plan committed:`), shows the effect in bytes. Under contract
rule 11, with the `.tanto/` move (issue-0b97) or the Keikaku split
(issue-3c7a).
