# Design: tanto-issue-triage — the issue pile is reorganized by instrument: a liveness table read from git, six recommend rounds on the cheaper seats, two sittings answered by exception, one bulk apply, and a per-finder counter

Written 2026-10-02 by Sekkei `dotskills-67 [260c71]` on fable, effort xhigh,
at `docs/superpowers/specs/2026-10-02-tanto-issue-triage-design.md`, on the
branch `tanto-issue-triage`, cut from `main` on 2026-10-02 at the topic's
opening after `experience-layer`'s merge — no batch is in flight (this
topic's ledger, Progress 2026-10-02). The topic holds slot 12 of the order
`.tanto/kikaku/2026-10-01-topics-after-experience-layer.md` holds, and that
file is its input document (ledger R-1).

Its inputs are the files Kanri's orders line named and one dialogue, cited
here by these names:

- **the decision file** — `.tanto/kikaku/2026-10-01-topics-after-experience-layer.md`
  §2 (the scope: purpose, the instrument, the five destinations, the shape,
  the counter, the batches, what is not in scope, rule 5) and §6 (the
  rejected alternatives); its §0 for the figures of 2026-10-01;
- **the working note** — `.tanto/kikaku/2026-10-01-issue-clusters.md`: the
  counts, the staleness probe's method and its 52 ids, and the sixteen
  keyword clusters of the 259 issues of 2026-10-01;
- **the type rules** — `docs/issues/AGENTS.md` (status by directory,
  `git mv`, `updated:`, the `Source:` line, no tag field, "hints, not
  contracts") and `docs/experience/AGENTS.md` ("experience vs issues", the
  trust tags, the `exp-` reference);
- **the yield file** — `.tanto/kikaku/2026-09-19-ttl-regimes-issue-yield-and-kanri-daemon.md`
  §2: where the issues come from, and the rejection of a top-family dedup
  read;
- **the counter's origin** — `.tanto/kikaku/2026-09-16-fable-diet-and-shoroku-feedback.md`
  §4 and `.tanto/kikaku/2026-09-18-parallel-close-and-tanto-feedback.md`
  §5(c), read for the "issues filed, by finder" count alone; nothing else
  of `tanto-feedback` comes along;
- **the criterion note** — `docs/notes/experience-layer-exit-criterion.md`:
  the `exp-` count the close takes by hand, beside which the counter runs;
- **the dialogue** — `.tanto/tanto-issue-triage/dialogue.md`, Q-1 to Q-9,
  cited as Q-n.

Kanri and Jisso cold-read this document. It names every file it changes,
gives the form of every file the run writes, and says what the plan must
contain. Where it quotes the decision file it does so because the plan's
writer and the implementer read this file and not that one.

## Fixed inputs

These are settled. Nothing below re-argues them; the plan inherits them
whole. Each names the decision-file section or the dialogue question that
settled it, and the expectation of `docs/experience/` it serves — `exp-<id>`
and the line — or says that none does.

1. **The scope is the reorganization of the pile, by instrument, on the
   cheaper seats, with the human confirming by exception** (the decision
   file §2 "Purpose"; Q-1). The pile is every file under
   `docs/issues/open/` and `docs/issues/deferred/` at the moment the
   instrument runs — 308 on 2026-10-02 (Measured, below). Serves `exp-27e8`
   "SHOULD let the user confirm what lands by answering only the points
   that need his judgment, by exception" and `exp-178d` "SHOULD keep a run
   affordable to leave running: judgment bought where it is needed".
2. **The five destinations, one per issue, each with a one-line reason**
   (the decision file §2 "Five destinations"): Landed, Merged, Assigned,
   Re-hung on a scene, Kept. Serves none directly: a settled list is what the
   next Sekkei opens on, and the reason is the decision file's own.
3. **What is not in scope** (the decision file §2 "Not in scope", §6; Q-4):
   editing a skill's prose to resolve an issue; a new frontmatter field; a
   scene or hub edit; any edit under `skills/`; `tanto.json`; a severity
   pass. Serves none; it is the boundary.
4. **The recommend rounds are ordinary plan tasks, written by
   `task.implement` and checked by the two SDD reviewers on opus; the
   human's answers arrive between batches as direction files Kanri writes;
   Kanri prints paths and counts, never a brief verbatim** (Q-2, shape (a);
   decision-bba6's cycle reused as that ADR's Consequences foresaw). **This
   departs from the decision file §2 "The shape"**, which named
   `task.review-quality` or a project-overridden `shoroku.recommend` — opus
   either way — as the grouping seat: the judgment seat here is sonnet, and
   the opus eyes are the two reviews the SDD loop already carries. Q-2
   settled it, Q-10 confirmed it as a departure, and ADR candidate 2 lists
   the two named seats among the rejected options. Serves `exp-178d`
   (above), `exp-26d5` "SHOULD interrupt the user only at checkpoints he
   knows of … in a form he can act on as it is", `exp-19c1` "SHOULD NOT let
   any session grow past a bound he knows in advance" — the brief read in a
   file costs Kanri nothing — `exp-2e98` "SHOULD let him read a wording put
   to him for judgment in his own language, while what is written stays the
   original" (the brief in the human's language, English form markers),
   `exp-3a9e` "SHOULD tell the user when the run is waiting on him" (the
   `attention` request), and `exp-173f` "SHOULD let the run continue from
   what is on disk" (the direction file).
5. **Six rounds by merged keyword cluster, three per batch, two sittings,
   one apply after both** (Q-3), **a round above fifty issues split in two
   by the instrument** (Q-10, the review's F-9 and F-10), so that a sitting
   may hold four briefs and the plan's batch count follows the file count.
   Serves `exp-bb08` "SHOULD let him choose how much of a run moves at
   once" and `exp-27e8`.
6. **Both scripts live under the repository's `scripts/`, run by hand at a
   close as the criterion note has the `exp-` count run today; nothing
   under `skills/` changes, so this is not a skill-editing plan** (Q-4; the
   decision file §2 left the placement to Sekkei). Serves none directly;
   the reason is rule 11's regime and the absence of any production run of
   the instrument so far.
7. **A `gone` string is a candidate, never the verdict**: Landed only when
   the recommender reads the removing commit's subject against the issue's
   gap and finds the gap closed (Q-5; the working note's caveat "gone is
   not resolved"). Serves `exp-518b` "SHOULD make it obvious when a
   structural description is stale relative to the code" — the instrument
   is that line's own tool — and, by its negative, `exp-3b2d` "SHOULD let
   the user re-orient in one sitting": a wrong move into `resolved/`, the
   directory excluded from reading, is the one error nobody re-finds.
8. **The counter is "issues filed per topic, by finder", from each issue's
   `Source:` line and the named ledger's `S-n` row, one script, run at the
   close beside the `exp-` count and written where that count goes** (the
   decision file §2 "The counter"; the counter's origin files). Serves none
   stated; the want behind it is a candidate (Requirements, below).
9. **The apply edits `docs/issues/` in bulk from a Jisso batch; Kanri's
   hand stays off `docs/`** (the decision file §2 "Rule 5"). Serves none;
   it is the skill's rule 5.
10. **The carrier topic, the scene, and the resolution are body lines, not
    frontmatter** (the decision file §2 items 1 to 4 and §6; the type
    rules' "No `tags:` / `labels:`"). Serves none; it is the type rule.
11. **A want no scene states is reported, never written into a scene by
    this topic** (the decision file §2 item 4). Serves `exp-e3c1` "SHOULD
    NOT have to put every want into words himself: the agent draws them
    out … and checks them with him before anything is recorded" — the check
    is the report, the recording is a later run's.
12. **The Assigned carriers are exactly three**: `passage-check-hardening`,
    `passage-plan-generation`, and the scene 09c2 upgrade candidate, written
    `09c2-upgrade` until that topic has a slug (the decision file §1, §2
    item 3, §5). Serves none; it is the order's state.

## Measured while designing

Figures taken on 2026-10-02 in this window; each is re-measured by the
instrument when it runs, and the instrument's figures are the ones the plan
and the report carry.

- **The pile**: 308 files — `open/` 284, `deferred/` 24 (the working note
  counted 259 on 2026-10-01; 30 were filed on 2026-10-02 by the
  `experience-layer` close, and 68 of the 308 are not placed by the note).
  Severity medium 115, low 191, high 2. `created:` 2026-09 271, 2026-10 30,
  2026-05 6, 2026-06 1. `Source:` kinds shoroku 174, session 93, inbox 41;
  the shoroku topics are nineteen, `experience-layer` 25 the largest.
  `depends_on` is non-empty in 3 files, `blocks` in 1, `claimed_by` in none.
- **Evidence density**: 221 of 308 carry a double-quoted string of 30 to
  140 characters; 258 carry a backticked token that looks like a path; 34
  cite an `exp-` id; **none** marks an `Old:` side in any form, so the
  decision file's "the `Old:` side only where an issue marks one" selects
  nothing today and the extraction is of every quoted string.
- **The two primitives**: `git grep -F` over `skills docs/notes scripts`
  takes about 0.12 s per string and `git log -S` about 0.24 s on this tree
  (713 commits on `main`); a per-string spawn for 1500 needles would be
  three to six minutes, which is why section 1 loads the tree once and
  searches in memory, spawning git only for the gone ones.
- **Line endings**: `git ls-files --eol` reads `i/lf w/crlf attr/text=auto`
  for the issue files — the index holds LF, the working tree CRLF under
  `core.autocrlf=true`. A writer that appends must use the file's own
  working-tree ending; git normalizes the blob either way, but a mixed
  working-tree file trips the editor's diff view.
- **The precedent**: `experience-layer`'s plan held batch D until
  `.tanto/experience-layer/migration-direction.md` existed, with Kanri
  checking the brief's form, writing one `attention` request, and writing
  the direction from a Kikaku decision file (decision-bba6; that plan's
  Global Constraints and its Batches table). The direction file's shape —
  a header naming the answer's route, then the items by the
  recommendation's numbers — is what section 3 reuses.
- **The resolved precedent**: 43 of the 99 files under `resolved/` carry a
  body paragraph opening `Resolved by …` (the review's recount; the
  dialogue's first figure of 61 counted looser forms), placed as the last
  paragraph before any trailing note; ten read `Resolved by the bg-seat-ergonomics
  design`, the rest name a plan's task. Section 4's Landed line follows
  that placement and names the removing commit's subject instead.
- **The decision file §0's check**: whether the recommender's bar "reads as
  that file wrote it" was for this Sekkei to check in `roles/kanri.md`'s
  close dispatch and in the shoroku skill's recommend mode. Both carry the
  sentence — `roles/kanri.md` Shoroku step 2 ("an item is recommended as an
  `issue` only when it is medium severity or above, needs a decision, or
  records a measured defect") and `skills/shoroku/SKILL.md`'s recommend
  mode, one hit each — and nothing is asked of the skill here.
- **The tree listing**: `git ls-files --with-tree=main` unions the index with
  the tree (685 paths on this branch against `git ls-tree -r main`'s 684),
  so the branch's own new files would be listed and fail to read at `main`;
  section 1 lists with `git ls-tree`. And of the pile's backticked path
  tokens, 314 are rooted (`skills/…`, `docs/…`, `scripts/…`) and 397, in
  141 files, are skill-relative — `roles/kanri.md`, `templates/agent.md`,
  `SKILL.md` — so a path check must resolve a token as a suffix of a tracked
  path (the review's F-1 and F-2).
- **`git commit --only` and a rename**: issue-9350 measured that a `git mv`
  committed with `--only` must name the old path as well as the new one,
  or the vacated path survives in `HEAD`. Section 4's commit recipe names
  both.

## 1. The instrument — `scripts/issue-liveness.js`

A Node script with no dependencies, its tests beside it at
`scripts/issue-liveness.test.js`, run by `node --test scripts/issue-liveness.test.js`.
It is this repository's tool: it reads `docs/issues/` and the git tree and
nothing of any skill.

**Invocation.**
`node scripts/issue-liveness.js --out <dir> [--ref main] [--docs docs/issues]`.
`--out` is the directory the outputs go to — `.tanto/tanto-issue-triage/`
in this plan. `--ref` is the tree every needle is checked against, `main`
by default; the run in batch A passes nothing, since the branch has not
touched the trees the needles point into. Exit 0 on a completed run,
whatever the verdicts; exit 1 only when git or the input directory is
unusable, with one line on `stderr`.

**Per issue, the script extracts** from the body (everything after the
frontmatter), after normalizing CRLF to LF:

- **quoted strings**: the text between a pair of straight or curly double
  quotes when it is 30 to 140 characters long — the working note's rule,
  unchanged, so that the probe's 52 ids are reproducible;
- **path tokens**: a backticked token with no space that contains a `/`
  or ends in one of `.md .js .json .sh .bat .ps1 .py .yaml .yml .toml`,
  stripped of a trailing `:line` or `:line-line` suffix, which is kept as
  the token's line hint; a token beginning with `.tanto/`, `.superpowers/`,
  `~`, `$`, or `<` is skipped (untracked, or a placeholder);
- the **title**, the **severity**, **created**, the **`Source:` line** and
  its kind, the directory (`open` or `deferred`), and whether the body
  cites an `exp-` id.

**The tree is loaded once.** `git ls-tree -r -z --name-only <ref>` lists
the tree's paths and nothing of the index; every path outside the four
excluded trees — `docs/issues/`, `docs/reports/`, `docs/superpowers/`, and
`.tanto/` — whose extension is one of `.md .txt .js .cjs .mjs .ts .json
.jsonc .yaml .yml .toml .sh .bat .ps1 .psd1 .psm1 .py .css .html .gitignore
.gitattributes .editorconfig` or that has no extension is read with
`git show <ref>:<path>` — a listed path that fails to read is a fatal error,
so that the loaded tree is exactly the ref's — and kept in memory as its
bytes and as a **normalized** copy: CRLF to LF, every run of whitespace
including line breaks to one space, every backtick removed, and every
Markdown link `[text](target)` reduced to its text. A quoted needle is
normalized the same way before the substring test, so that a quote of a
sentence carrying inline code or a link still matches. The exclusions are the self-citing and the
frozen: an issue quotes its own needle, a report or a plan quotes the old
text as old text, and a match there says nothing about the live tree.

**A quoted string is alive** when its normalized form is a substring of
any file's normalized copy; the row records the first path that holds it.
A **path token is alive** when some tracked path at `<ref>` equals it or
ends with `/` followed by it — a token naming a directory is alive when any
tracked path has it as a prefix — since 397 of the pile's tokens are
skill-relative (`roles/kanri.md`, `templates/agent.md`, `SKILL.md`) and
only 314 are rooted (Measured); the row records the resolved path, and a
token that resolves to several paths records the first and is alive. Its
line hint, when it has one, must be within the resolved file's line count;
a path that resolves with a line hint past the end is `partly` for that
token. A string or path found nowhere is **gone**.

**A gone string is traced.** For each gone quoted string the script runs,
once,
`git log <ref> -n 1 --format=%s --name-only --pickaxe-regex -S<pattern> -- <the included trees>`
where `<pattern>` is the string's words, each regex-escaped, joined by
`\s+`, so that a quote that wraps in the source still matches the pickaxe.
The subject and the first path the output names are the row's evidence;
an empty result records `no commit found`. A gone path token is traced
only when no tracked path resolves it, with
`git log <ref> -n 1 --format=%s --diff-filter=D -- <the token, and every path ending in it that ever existed>`
— in practice `git log --all --diff-filter=D --name-only` filtered by the
suffix — the deleting commit's subject, or `no commit found`. The commit hash is never written: the
outputs are untracked, but the subject is what every tracked line downstream
carries, and a hash is what the human's rebases make stale.

**The verdict per issue** is one of four words over its extracted items:
`none` when nothing was extracted; `alive` when every item is alive;
`gone` when every item is gone; `partly` otherwise. The counts travel with
it — `alive <a> / gone <g> / none <n>` — and every gone item with its
subject.

**The cluster** is assigned by the title alone, first match wins, by the
ordered list below; it is the working note's sixteen names with the rule
written out, and the spec is the authority where the two differ. A term of
five letters or fewer — `plan`, `task`, `lint`, `test`, `cost`, `ttl`,
`spec`, `share`, `close`, `model`, `node`, `brief`, `batch`, `spawn` —
matches as a whole word (`\b` on both sides); a longer term matches as a
substring; every match is case-insensitive. Within a row the broad terms
come last so that the specific ones decide first, and the review's F-10
measured the substring rule's drift against the note at 75 of 240 placed
issues, which Task 2's report measures again under this rule. **The round**
is the Q-3 merge of the clusters, and **a round above fifty issues is split
by the instrument** into `<n>a` and `<n>b` in table order, each its own
file, task, and brief (Q-10).

| Order | Cluster | Title matches (case-insensitive) | Round |
| --- | --- | --- | --- |
| 1 | passage-check / plan instrument | `passage-check`, `passage`, `replay`, `needle`, `fence`, `O block`, `dry run`, `dryrun`, `pickaxe`, `lint` | R1 |
| 2 | kanri / ledger / handover / boundary | `ledger`, `handover`, `boundary`, `census`, `ruling`, `R-n`, `events line`, `successor`, `kanri` | R2 |
| 3 | roster / handshake / address | `roster`, `handshake`, `address`, `no-role`, `rename`, `sessionId` | R2 |
| 4 | reading / ceiling / cost / ttl | `reading`, `ceiling`, `context=`, `cache`, `token`, `wake-up`, `compaction`, `quota`, `429`, `cost`, `ttl`, `share` | R3 |
| 5 | config / agents / effort / model | `tanto.json`, `config`, `agent definition`, `agents/`, `effort`, `model`, `family` | R3 |
| 6 | keikaku / plan / coldread / batch shape | `keikaku`, `coldread`, `cold read`, `batch`, `plan` | R4 |
| 7 | jisso / sdd / report | `jisso`, `sdd`, `implementer`, `batch report`, `report`, `task` | R4 |
| 8 | sekkei / spec / dialogue | `sekkei`, `spec`, `dialogue` | R4 |
| 9 | brief / review | `brief`, `review` | R4 |
| 10 | shoroku / close / kessai / shoki | `shoroku`, `close`, `kessai`, `shoki`, `shusei`, `direction`, `recommend`, `proposal` | R5 |
| 11 | spawner / bg seats / resume | `spawner`, `spawn`, `bg seat`, `background`, `resume`, `launcher`, `seats.json`, `--bg`, `attach`, `terminal seat`, `tab seat` | R5 |
| 12 | hosa / kikaku / kaiseki | `hosa`, `kikaku`, `kaiseki` | R5 |
| 13 | kisou / docs system / templates | `kisou`, `doc-system`, `docs/`, `template`, `frontmatter`, `AGENTS.md`, `experience`, `scene`, `requirement` | R6 |
| 14 | wayaku / i18n / language | `wayaku`, `language`, `japanese`, `translation`, `i18n` | R6 |
| 15 | tests / scripts | `test`, `script`, `node`, `pre-commit` | R6 |
| 16 | other | everything else | R6 |

A term of five letters or fewer matches as a whole word, a longer one as a
substring, all case-insensitively, with `R-n`, `429`, `--bg`, `context=`,
and `O block` matched literally (the rule above the table). The list is a
constant at the top of the script, so that a reader of the table and a
reader of the script see the same rule, and Task 2's report prints the
agreement with the working note's placements — the count of the 240
note-placed issues that land in the note's own cluster.

**Two more columns**, cheap and advisory:

- **neighbors**: the three other issues of the pile whose titles share the
  most tokens with this one — tokens being the title lowercased and split
  on non-word characters, stopwords of three letters or fewer dropped —
  with the overlap count; a Merged hint for the recommender, never a
  verdict;
- **inbound**: every living document — a file under `docs/experience/`,
  `docs/design/`, `docs/notes/`, an open or deferred issue, the hub, the
  root Markdown files — that mentions this issue's current path at all,
  link or plain text, by `grep -F` of the path (the tree holds zero
  Markdown links to `open/` or `deferred/` paths today and eight plain
  mentions, Measured by the review); what the apply must repoint when the
  issue moves.

**Outputs**, all under `--out`:

- `liveness.json` — an array, one object per issue:
  `id, dir, path, title, severity, created, source, sourceKind, citesExp,
  cluster, round, verdict, counts {alive, gone, none}, items [{kind, text,
  state, foundIn | removedBy {subject, path} | null}], neighbors [{id,
  overlap}], inbound [path]`, and a `meta` object first with `ref`, the
  run's date, the counts per verdict, per cluster, and per round, and the
  run's wall time;
- `liveness-R1.md` to `liveness-R6.md` — one Markdown table per round,
  or `liveness-R<n>a.md` and `liveness-R<n>b.md` for a round above fifty
  issues, split in table order — columns `id | dir | sev | verdict | a/g/n |
  cluster | title | gone items (needle → subject) | neighbors | inbound`,
  the title cut at 100 characters, every `|` in a cell escaped as `\|`
  (title `4914` carries one), each gone item on its own line inside the
  cell separated by `<br>`; a header line naming the ref, the date, and
  the round's counts per verdict. This is the file a round's recommender
  reads;
- a summary on `stdout`: the counts per verdict, per round, and the wall
  time.

**Tests** (`node --test`): the test builds a fixture repository under a
temporary directory with `git init`, commits two text files and three
issue files — one quoting a sentence that stays, one quoting a sentence
the second commit removes (with a line break inside the quote in the
source), one with no evidence and a path token to a file the third commit
deletes — and asserts: the verdict words and counts; the removing commit's
subject on the gone string and the deleting subject on the gone path; that
a quote wrapped across a line in the source is found alive; that a needle
present only under `docs/issues/` or `docs/reports/` reads gone; the
cluster of four titles against the table, one per branch of the first-match
rule including `other`, and one short term that must not match inside a
longer word; the round map and the split of a round above fifty; a
skill-relative path token resolved alive by suffix; a neighbor pair; an
inbound mention found, link or plain; a `|` in a title escaped in the
table; CRLF input handled; exit codes.
The fixture's git identity is set in the test, as the tanto suite does.

## 2. The recommend rounds — one task per round

One task per round file — six when no round is split, one more for each
round the instrument split in two — three or four to a batch, batch B
taking the first half and batch C the second. Each is an ordinary SDD task: the `task.implement` implementer writes two
files, the `task.review-spec` reviewer checks them against the rules below,
the `task.review-quality` reviewer checks their form. No subagent of a
higher family is dispatched for them, and no Jisso dispatches a recommender
of its own (Q-2; the decision file's "no top-family read of the pile").

**The implementer reads** `liveness-R<n>.md`, the `title:` of every issue
in the round, and the body of any issue it needs — a Landed candidate's,
a Merged pair's, a Re-hung candidate's — and the live file a gone string's
subject points at when the subject alone does not say whether the gap
closed. It reads no other round's files.

**It writes `.tanto/tanto-issue-triage/triage-R<n>-recommendation.md`:**

- a header: the round, the liveness file read and its header line, the
  date, the implementer's model family;
- five `##` sections in this order and this exact text — `## Landed`,
  `## Merged`, `## Assigned`, `## Re-hung`, `## Kept` — and a sixth,
  `## Wants no scene states`, last;
- under the five, one `###` heading per issue of the round,
  `### <n> — <title> (issue-<id>)` — the full `title:`, not the table's
  100-character cut, with any `|` left as it is — `<n>` one running number
  across the round in the order the liveness table lists the issues, never
  restarted per section; under it four lines — `Destination:` the section's word;
  `Target:` the removing commit's subject for Landed, `issue-<carrier id>`
  for Merged, one of the three carriers for Assigned, `exp-<id>` for
  Re-hung, `—` for Kept; `Reason:` one sentence; `Evidence:` the liveness
  row's verdict and counts, and for Landed the subject and the file it
  removed from;
- under `## Wants no scene states`, a bullet per Kept issue whose gap is a
  want no scene states — `- issue-<id> — <the want in one clause> —
  nearest scene: exp-<scene id> or none` — or the one line `none`.

**It writes `.tanto/tanto-issue-triage/triage-R<n>-brief.md`** in the
human's language, from the shoroku check brief's form with its groups
replaced by the five destinations:

- `# Triage check brief — round <n>` and a Document line naming the
  recommendation's path, the date, and the family;
- six `##` headings in this order: `## How to answer`, `## Landed`,
  `## Merged`, `## Assigned`, `## Re-hung`, `## Kept` — the heading words
  stay in English as form markers, as the shoroku brief's do;
- under How to answer, the rendered text: answer `OK` to take the round as
  recommended; name the numbers that go the other way with a destination
  word and, where it needs one, a target — `12 は Kept`, `30 は Merged →
  issue-abcd`, `41 は Assigned → passage-check-hardening`, `7 は Re-hung →
  exp-178d` — an item not named goes as recommended; the answer is written
  by Kanri into `triage-R<n>-direction.md`, which the apply reads with the
  recommendation and never this brief;
- under each destination heading, one line per item of that group in the
  recommendation's order, or the one line `none`:
  `<n>. [landed|merged|assigned|rehung|kept] <target> — <title> — <reason> — See: <the item's heading text, without its ### marker>`
  — a Landed line's target is the removing commit's subject, a Merged
  line's the carrier id, an Assigned line's the topic, a Re-hung line's the
  `exp-` id, a Kept line's `—`, and a Kept line whose issue is listed under
  Wants no scene states ends its reason with ` — want unstated`.

**The rules the spec reviewer checks**, each against the two files and the
liveness row. The reviewer reads the recommendation, the round's liveness
table, and the bodies of the Landed and Merged items only — never every
body of the round — and runs the `exp-` lookup for the Re-hung items; the
quality reviewer runs the greps below and reads no issue body. The two
reviews are bounded so that a round costs one sonnet read of its bodies
and not three (`exp-178d`).

- **Landed** only when the liveness row holds at least one gone item with
  a removing subject, and the subject — or the live file the implementer
  read — shows the issue's gap closed: the sentence the issue said was
  missing is now there, the rule it said was absent now exists, the
  instrument it said was unbuilt is in the tree. A gone quote under a
  subject that rewrote the passage and kept the gap is Kept or Assigned,
  the subject in the reason (Fixed input 7). An issue whose only gone item
  is its own proposed wording, never in the tree, is not Landed.
- **Merged** when two or more issues of the pile name the same gap — the
  same missing rule or defect at the same site — not merely the same
  file: the carrier is the one with the earliest `created:`, unless
  another's body is plainly fuller, and the recommendation says which and
  why; the carrier may be in another round, and is named by id; a carrier
  must be an issue of the pile, never one already under `resolved/`.
- **Assigned** only to one of the three carriers of Fixed input 12, and
  only when the issue's gap is inside that topic's scope as the decision
  file §3 and §5 state it — the passage instrument, the plan generator, the
  09c2 upgrade route; a gap in Kanri's, the ledger's, the reading's, the
  roster's, or any other cluster has no carrier today and is Kept.
- **Re-hung** only to an `exp-` id that resolves by lookup — a file
  `docs/experience/<id>-*.md` or a `**<id>**` line in one of them or in the
  hub — and only when the issue's gap is a want that line states; the
  reviewer runs the lookup. An issue that already cites that `exp-` id in
  its body is Kept, since the line is already there.
- **Kept** is the default and needs no reason beyond the one line.
- A deferred issue keeps its directory unless it is Landed or Merged.
- Every issue of the round appears exactly once under the five sections;
  no issue of another round appears.

**The form the quality reviewer checks**, by `grep` and never by reading
the prose: `grep -c '^## '` on the recommendation is 6 and on the brief is
6, the headings in the orders above; `grep '^### '` on the recommendation
lists every id of `liveness-R<n>.md` once; every `###` heading's text,
marker stripped, appears exactly once in the brief after `See: `, and the
brief names no heading the recommendation lacks; every brief line under a
destination heading opens with `<n>. [` and one of the five tag words.

The task's own `Verify` carries those greps, and the batch report's
**Questions for the human** section lists, per round, the brief's path and
the counts per destination with the Wants-no-scene-states count — the one
thing the human reads at the boundary (section 3). That section is
restricted by `roles/jisso.md` and `templates/batch-report.md` to the four
SDD stop classes and a scope or spec change; **this plan's Global
Constraints extend it by one item kind** — a round's brief path and counts,
a status line for Kanri's window and not a question — which is Kanri's own
choice between the two forms the review offered (I-1's follow-up), because
the boundary brief copies that section into the verdict file and a line
under For Kanri would not reach Kanri without a skill edit this topic does
not make.

## 3. The two sittings — the boundary that waits

The cycle is decision-bba6's, run twice, with the brief read as a file
(Q-2, Q-3). The plan's Global Constraints name it, as that ADR's
Consequences say a plan does.

**At the boundary of batch B** (rounds 1 to 3) and again **at the boundary
of batch C** (rounds 4 to 6):

1. The `boundary.verify` subagent verifies the batch as any batch: the
   recommendation and brief pairs are untracked, so the tree is clean; the
   six form greps per round are the boundary's — each round task's
   `Verify` carries them, the report's Verify in the tree lists them, and
   the verdict file's Failures section is where a bad brief shows — and the
   report's Questions for the human carries the paths and their counts,
   which the brief copies into the verdict (I-1, amendment 1).
2. Kanri reads the verdict, not a brief: on a form failure there it sends
   that one round back for rework as any rework (a `B-rework-<n>` or
   `C-rework-<n>` key whose tasks are that round's one task). Kanri runs no
   grep of its own at this boundary.
3. Kanri writes one `attention` request whose message is
   `kessai: tanto-issue-triage rounds 1–3 — claude attach <id>` after B and
   `rounds 4–6 — claude attach <id>` after C, the spawner filling the id,
   and prints in its own window, in the human's language, one line per
   round from the verdict's copy of the report's counts:
   `R<n>: <brief path> — landed <a>, merged <b>, assigned <c>, re-hung <d>, kept <e>; wants without a scene <w>`
   and one closing line saying how to answer — per round, by exception,
   `OK` or the numbers that go the other way. It does not print a brief.
4. The human opens the brief files and answers per round, in any of the
   close kessai's three routes: Kanri's window by `claude attach`; a Kikaku
   decision file whose third section names the round's recommendation and
   answers it (decision-9cc5); or a live Hosa, whose chore is the skill's
   existing line `kessai answer: tanto-issue-triage — <the human's words
   verbatim>`, the words naming the round (`R2: OK`, `R3: 12 は Kept`) —
   no role file learns an `R<n>` form (I-1, amendment 2). A bare `OK` with
   no round answers every round of the open sitting; an answer naming an
   item number and no round is not guessed — Kanri asks one line and writes
   nothing until it is answered.
5. Kanri writes `.tanto/tanto-issue-triage/triage-R<n>-direction.md` per
   round, the moment that round's answer is complete and not at the
   sitting's end, from the answer and nothing else: a header naming the
   route and the date; then either the one line `OK` or one line per item
   that goes the other way, `<n> — <destination word> [<target>] — <the
   human's words verbatim>`, the destination word one of the five and the
   target as the brief's How to answer asks for it. A word Kanri cannot
   normalize to a destination is written verbatim with the destination
   `unclear`; the apply leaves such an item Kept and reports it. An item
   the human does not name goes as recommended, and the direction does not
   repeat it. While batch D waits, the ledger's Progress line reads
   `batch D waits on triage directions — <k> of 6 exist` — of the round
   files' count when a round was split — and "all exist" is a plain `ls`
   Kanri runs at every wake-up.

Batch C is spawned at B's boundary without waiting for the first sitting:
its tasks read the liveness files, not the directions. When a split round
adds a recommend batch, that batch's boundary is a sitting too, its
`attention` message naming the rounds that batch produced; "two sittings"
is the unsplit case (the review brief's unsettled point, taken by default). **Batch D is not
spawned until a direction file exists for every round file**, and Kanri's
boundary-C turn says so in its own window when they do not yet. An answer
for the first sitting that arrives after C's boundary is written all the
same; the second `attention` request names only rounds 4–6. Nothing else in the run
waits on the human, and a Jisso never does.

Kanri's own acts at each sitting are the one request, the per-round line,
the direction files, and withholding batch D (I-1); its cost is those
lines — the measurement S-11 of the ledger (one verbatim kessai
read costing about a batch) is the reason the brief is a file here.

## 4. The apply — batch D

Two tasks, one per three rounds, each reading the three recommendations
and their directions and editing `docs/issues/` in bulk (Fixed input 9).
Per issue, the effective destination is the direction's line when there is
one and the recommendation's otherwise; `unclear` is Kept.

- **Landed**: `git mv docs/issues/<dir>/<file> docs/issues/resolved/<file>`;
  `updated:` set to the day; appended as the body's last paragraph, after
  one blank line:
  `Resolved by "<the removing commit's subject>" — found by the tanto-issue-triage liveness check, <YYYY-MM-DD>.`
- **Merged**: every issue but the carrier moved likewise, its last
  paragraph `Merged into issue-<carrier id> (tanto-issue-triage, <YYYY-MM-DD>).`;
  the carrier's `updated:` set and its last paragraph
  `Carries issue-<id>[, issue-<id>…] (merged by tanto-issue-triage, <YYYY-MM-DD>).`
  — one such line per carrier, listing every issue merged into it across
  every round, which is why the two apply tasks run in order and the
  second appends to a line the first wrote when the carrier recurs. A
  carrier that its own round moved to `resolved/` is still the carrier:
  the pointer is the id, which the directory does not change.
- **Assigned**: the directory unchanged; `updated:` set; last paragraph
  `Assigned to <topic> (tanto-issue-triage, <YYYY-MM-DD>).`
- **Re-hung**: the directory unchanged; `updated:` set; last paragraph
  `Serves exp-<id> (tanto-issue-triage, <YYYY-MM-DD>).`
- **Kept**: untouched — no `updated:` bump, no line.

**Line endings**: the paragraph is appended in the file's own working-tree
ending (CRLF today), never with a bare `\n` into a CRLF file (Measured).

**Inbound links**: for every moved issue, each path in its liveness
`inbound` list has the old path replaced by the new one; a living
document's link only — `docs/reports/` and `docs/decisions/` carry
`<type>-<id>` references by the type rules and are not edited.

**Commits**: one per round, in round order, by explicit path and naming
both sides of every rename (issue-9350):
`git add -A -- <new paths>` is not used; the recipe is
`git add -- <each new path>` then
`git commit --only -- <each old path> <each new path> <each edited carrier or inbound path> -m "docs(issues): triage round <n> — landed <a>, merged <b>, assigned <c>, re-hung <d>"`.
`./scripts/lint.sh` runs on the changed paths by name before each commit;
the frontmatter hook checks every moved file.

**Verification**, per task and at the boundary: for each round's commit,
`git diff-tree -r --name-status <commit>` shows exactly landed + merged-away
renames into `resolved/` (`R` lines) and no path outside `docs/issues/`,
`docs/experience/`, `docs/design/`, `docs/notes/`, the hub, and the root
Markdown files — the count and the path check are per apply commit, since
Tasks 11 and 12 commit scripts, the note, and the report at the same
boundary and every round lands on one day; `git grep -F` of each moved
issue's old path over the living documents prints nothing;
`git status --porcelain` is empty after the commits.

## 5. The counter — `scripts/issues-by-finder.js`

A Node script with no dependencies, tests beside it at
`scripts/issues-by-finder.test.js`. It answers the one question the yield
file left open — whether moving Sekkei to fable changed what gets filed —
by counting, per topic, who proposed each issue.

**Invocation.** `node scripts/issues-by-finder.js [--docs docs/issues] [--tanto .tanto] [--status open,deferred,resolved]`
prints the tables; `--json <path>` writes them as well.
`node scripts/issues-by-finder.js --exp <topic> [--docs <paths…>] [--inputs <paths…>] [--adr <paths…>]`
runs the criterion note's `exp-` recipe.

**The by-finder count.** For every issue under the named status
directories, read the `Source:` line:

- `inbox <date>-<slug>` → finder `inbox`;
- `session <date>` → finder `session`;
- `hotfix <subject>` → finder `hotfix`;
- `shoroku <topic>` with no `S-<n>` → finder `shoroku (unnumbered)`;
- no `Source:` line at all — 71 of the 99 resolved issues, filed before
  decision-4d80 bound the hook to `open/` and `deferred/` — → finder
  `no source`;
- `shoroku <topic> S-<n>` → open `.tanto/<topic>/kanri.md` and find the
  row whose first cell is `S-<n>` anywhere in the file — eight of the
  fourteen ledgers head that table `## Shoroku candidates` with a
  `Candidate` column and the newer ones `## Shoroku proposal items`, so the
  heading is never the locator — and read its Source cell; when the cell
  opens `carried from <other topic> S-<m>` or `carried from roster-S-<m>`,
  follow it once to the named ledger or to the text after the colon, which
  names the original file; then map the cell to a finder by the first
  pattern that matches, in this order:
  `batch-shusei`, `shoki` → `close`;
  `batch-*-report.md`, `shoroku-proposal-jisso-`, `shoroku-proposal.md` →
  `jisso`; `batch-*-verdict.md` → `boundary`; `branch-review` →
  `branch reviewer`; `spec-review.md` → `spec reviewer`; `plan-review`,
  `coldread.md`, `plan-dryrun` → `plan reviewer`;
  `shoroku-proposal-sekkei-`, `exit-sekkei-proposal`, `the spec`, `spec §`,
  a `docs/superpowers/specs/` path, `spec-draft` → `sekkei`;
  `shoroku-proposal-keikaku-`, `exit-keikaku-proposal` → `keikaku`;
  `shoroku-proposal-kanri-`, `exit-kanri-`, `Kanri's own`,
  `kanri-handover` → `kanri`; `kaiseki-` → `kaiseki`; `.tanto/kikaku/`
  or `Kikaku decision` → `kikaku`; `inbox` → `inbox`; `human word` →
  `human`; anything else → `unmapped (<the cell's first 40 characters>)`
  — the review measured 136 of 458 rows unmapped under the first draft of
  this list, among them bare destination words in `bg-seat-ergonomics`'s
  S-34 to S-37 (column drift in that ledger), which stay `unmapped`; a
  topic with no `.tanto/<topic>/kanri.md`, or a row id past the table's
  end → `unresolved`.

The output is one table per topic — rows the finders, one column the
count, sorted by count — and a totals table of topic × finder, plus the
`Source:` kinds' totals; the topic of a `session` or `inbox` issue is
`—`. The script reads `.tanto/` and the ledgers it finds there; the
`unresolved` cases are a topic whose directory is gone (`kisou-refresh`,
`tanto-sweep`, `tanto`, `review-brief`, `requirement-extraction`,
`context-cost`, `boundary-rules` — 25 issues today, all unnumbered, so they
fall to `shoroku (unnumbered)` first) and a row id past a table's end.
**Coverage** is stated with the tables: of 336 issues on 2026-10-02, 84
carry a `Source:` with an `S-n` and so reach a finder through a ledger row,
106 of the 190 shoroku-sourced carry none, 102 are `session`, 44 `inbox`,
so the by-finder table attributes about a quarter of the pile, the topics
from `shoroku-at-close` onward, and the yield file's question — did moving
Sekkei to fable change what is filed — is readable only from that point;
the script prints the attributable share beside the tables, and the report
carries it (Q-10, F-13).

**The `exp-` count.** `--exp <topic>` collects the `exp-<id>` references —
prefixed only, exactly the note's `grep -o 'exp-[0-9a-f]\{4\}'` — from the
documents — by default the topic's spec and plan under `docs/superpowers/`,
`.tanto/<topic>/review-brief-spec.md` and `review-brief-plan.md`, and the
`--adr` paths given — and set-minus the ids found over the inputs — by
default `.tanto/<topic>/dialogue.md`, `spec-inputs.md`, and every
`.tanto/kikaku/*.md` path the spec names — where the inputs side collects
both prefixed references and bare four-hex ids, since a human writes
`27e8` without the prefix; the comparison is by bare id. The documents side
never collects bare ids, which would sweep issue and decision ids into the
primary criterion (the review's F-5). It prints the unprompted ids and
their count, and the two lists it subtracted. The
note's hand recipe stays valid; this is the same count run by one command.

**Tests**: fixture issue files and a fixture ledger under a temporary
directory covering each `Source:` form, a `carried from` hop, every
finder pattern once including both table headings, `no source`,
`unmapped` and `unresolved`; and for `--exp` a fixture spec, plan,
dialogue, and Kikaku file whose subtraction yields a known set, with a bare
id in the dialogue cancelling a prefixed one in the spec and a bare issue
id in the spec not counted.

## 6. The note's sentence and the dogfood report

**`docs/notes/experience-layer-exit-criterion.md`** gains one sentence at
the end of its "Primary" paragraph, after "…into
`docs/notes/tanto-measured-data-points.md`.":
`The same count is one command, node scripts/issues-by-finder.js --exp <topic>, whose by-finder table is taken at the same moment and written beside it.`
No other note changes; the counts themselves are written by hand at a
close as the note already says.

**`docs/reports/<YYYY-MM-DD>-tanto-issue-triage-dogfood.md`**, dated the
day batch D writes it, frozen, no frontmatter, `# H1` and a scope
paragraph (the reports type rules): the instrument's `meta` figures — the
pile's size, the verdict counts, the per-round counts, the wall time; a
table round × destination from the directions as applied; the Assigned
counts per carrier topic; the Merged carriers and what each carries; the
full list of Wants no scene states, by issue id and clause, for a later
run to write into scenes at the human's word; the by-finder tables as of
that day, with the attributable share beside them; the
`--exp tanto-issue-triage` output over the spec, the plan, and the two
review briefs, ADRs excluded since none exists before the close; the
instrument's agreement with the working note's placements and the count of
`no commit found` rows; the number of items the human changed from the recommendation per
round; and how long each sitting waited, read from the direction headers
against the boundary times in the ledger. It is where the decision file §6
says the 09c2 ordering question "returns at the triage's close with
numbers".

## Where each change lives

| File | Change | Batch |
| --- | --- | --- |
| `scripts/issue-liveness.js`, `scripts/issue-liveness.test.js` | new, section 1 | A |
| `.tanto/tanto-issue-triage/liveness.json`, `liveness-R1.md` … `liveness-R6.md` | untracked, the instrument's run, section 1 | A |
| `.tanto/tanto-issue-triage/triage-R<n>-recommendation.md`, `triage-R<n>-brief.md` × 6 | untracked, section 2 | B (R1–R3), C (R4–R6) |
| `.tanto/tanto-issue-triage/triage-R<n>-direction.md` × 6 | untracked, written by Kanri from the human's answers, section 3 | the boundaries after B and C |
| `docs/issues/open/**`, `docs/issues/deferred/**`, `docs/issues/resolved/**` | moves and last paragraphs per the directions, section 4 | D |
| living documents named in `liveness.json` `inbound` | path links repointed, section 4 | D |
| `scripts/issues-by-finder.js`, `scripts/issues-by-finder.test.js` | new, section 5 | D |
| `docs/notes/experience-layer-exit-criterion.md` | one sentence, section 6 | D |
| `docs/reports/<date>-tanto-issue-triage-dogfood.md` | new, section 6 | D |

Nothing under `skills/`, `.claude/`, or `docs/experience/` beyond a
repointed link changes; no ADR body and no dated report is edited.

## Old values this plan contradicts

None in the tree is made false by this design. The criterion note's "Until
a tanto topic gives that count to the close's recommender or to Kanri, it
is run by hand at the close" stays true — the count is still by hand, now
one command — and section 6 appends to it rather than rewriting it. The
working note's clusters and its probe are superseded by the instrument's
outputs, and the note says so of itself ("The topic's own instrument
replaces both"); it is an untracked Kikaku file and is not edited. The
issues type rules' "Do not … auto-move resolved issues. Leave them for
human / agent judgment" is not contradicted either: a bulk `git mv` from a
direction file the human answered is a judged move, not an automatic one.

## Requirements

Under the experience layer the requirement register is `docs/experience/`,
and this section names the expectations. No expectation is edited or added
by this plan (Fixed input 3). One
candidate stands for the close's recommender, to be grouped `Unsure` and
put to the human:

1. Behind Fixed input 8, a want of the developer's that no scene states:
   *he wants to see whether the stream of issues a run files is falling or
   rising, per topic and per seat, so that a model or effort change can be
   read in it* — the yield file's "so that the effect can be read", the
   decision file's "Nothing else of `tanto-feedback` comes along". Nearest
   scene: `exp-09c2` (the developer hears back from the repositories that
   use the skills) or `exp-06b2`; the recommender proposes the scene and
   the human picks or declines. Tagged `[inferred]` and capped at SHOULD by
   the type rules.

The sources of every other line this design serves are the scenes named in
Fixed inputs; none is new.

## The ADRs

Candidates for the close's recommender, each with a non-empty Options
section available; none is written by this plan.

1. **The issue pile is reorganized by a git-evidence instrument and five
   body-line destinations, on the cheaper seats, with the human answering
   by exception.** Options: a top-family read of the pile (rejected by the
   yield file §2, kept as to the method by the decision file §6); a
   between-plans sweep with no topic (rejected: 308 items is too many for
   one kessai and the instrument did not exist); folding the reorganization
   into each next Sekkei's input (rejected: the clusters no placed topic
   holds would stay stale); an instrument plus rounds inside a plan
   (chosen). Consequences: a `scripts/` tool this repository owns; the
   next topics open on a settled list; every tracked line the triage
   writes names a commit by subject. Sources: the human's words on
   2026-10-01, 「tanto の issueの状況も見て、その再編も含め」 and 「推奨で行こう」.
2. **A round's recommendation is an ordinary SDD task checked by the opus
   reviewers, and the human's answers are direction files between batches,
   not a recommender dispatch and not a kessai in Kanri's window.**
   Options: Kanri runs the close's shape between batches with the brief
   verbatim (rejected: S-11's cost per sitting on a sonnet Kanri, and a plan
   instructing Kanri); the decision file §2's own two seats — a
   `task.review-quality` dispatch, or a project-overridden
   `shoroku.recommend`, opus either way, as the round's judgment
   (rejected: an opus first pass still needs a review, so the round would
   buy opus twice, and the shoroku skill's recommend mode is shaped for
   proposals into `docs/`, not for five triage destinations); a
   Jisso-dispatched opus recommender on a borrowed kind, as
   `experience-layer`'s batch C Jisso dispatched the recommender inside its
   task (rejected: the kind's name and its work diverge, and the opus cost
   per round is the same); SDD tasks on sonnet with the opus reviews the
   loop already carries, the brief read as a file (chosen; the departure
   from §2 confirmed at Q-10). It extends decision-bba6 and replaces no
   part of it: bba6 decides the recommend → answer → apply cycle inside a
   plan and says nothing of how the brief reaches the human (the review
   brief's 2.5, taken by default). Reuses decision-bba6 and extends it: the brief is
   read in the editor and Kanri prints paths and counts. Sources: Q-2
   「よい」, Q-3 「推奨で」.
3. **A gone string is a candidate; Landed needs the removing commit's
   subject read against the gap.** Options: every `gone` is Landed unless
   the human stops it (rejected: `resolved/` is excluded from reading, so a
   wrong move is the one error nobody re-finds); the instrument alone
   decides nothing and the recommender reads the subject (chosen).
   Sources: Q-5 「よい」; the working note's caveat.
4. **The instrument and the counter are repository scripts; wiring either
   into the close waits for two or three closes' data.** Options: ship the
   instrument under `skills/tanto/scripts/` and wire the close's recommend
   dispatch now (rejected: a skill-editing plan's regime for a tool that has
   never run in production); kisou's `scripts/` (deferred: no other
   repository has asked); repository `scripts/` (chosen). Sources: Q-4
   「よい」; the decision file §2 "Where the script lives is Sekkei's call".

## What the plan must contain

For Keikaku.

- **Global Constraints**: nothing under `skills/`, `.claude/`, or
  `docs/experience/` is edited (a repointed path link excepted); no ADR
  body and no dated report is edited; **batch D is not spawned until the
  six files `.tanto/tanto-issue-triage/triage-R1-direction.md` to
  `triage-R6-direction.md` exist**, and batch C is spawned without waiting;
  the boundary after B and the boundary after C are the sittings of
  section 3, with Kanri's acts named — the one `attention` request, the
  per-round line in its window, the direction files, and withholding batch
  D — and nothing else of Kanri's, the form greps being the boundary's
  (I-1); the batch report's Questions for the human is extended by one item
  kind, a round's brief path and counts, a status line and not a question
  (section 2); every `task.implement` of batch B and C reads only its round's
  liveness file and the issue bodies it needs, and the two reviews are
  bounded as section 2 says; a rework of a round is a rework of that one
  task; every commit
  names both sides of a rename; every appended paragraph uses the file's
  working-tree line ending; the instrument's run reads `main` and the
  apply's `git mv` runs on the branch.
- **Four batches**: A — Task 1 the instrument with its tests (TDD as SDD
  runs it), Task 2 the run (`--out .tanto/tanto-issue-triage`), whose
  deliverable is the seven untracked files and a report carrying the
  `meta` counts and the round files' count; B — one task per round file of
  the first half; C — one per round file of the second half, Keikaku
  planning both from the files Task 2 produced, three or four tasks a
  batch, a further batch when a split round pushes a half past four; D —
  the apply of the first half, the apply of the second half, the counter
  with its tests and the note's sentence, the dogfood report. Rule 7's
  three or four tasks a batch yields to the boundary where it must: batch A
  is two tasks, as `experience-layer`'s one-task batch C was.
- **Each round task's text** carries section 2 whole: the two files' paths
  and forms, the five rules, the greps of its Verify, and the report line
  for Questions for the human. The round tasks differ only in their round
  file.
- **Each apply task's text** carries section 4 whole, with the commit
  recipe and the round-ordered loop; the second apply task says it appends
  to a carrier line the first may have written.
- **How a batch is verified**: the suite `node --test scripts/*.test.js`
  at every boundary from A; `./scripts/lint.sh` on the changed paths by
  name; at B and C `git status --porcelain` empty and the six form greps
  per round, run by the boundary; at D the per-commit counts of section 4
  and the report present with section 6's list.
- **The passage check**: this plan carries no passage blocks — its tracked
  edits are two new scripts with tests, one sentence in a note, a new
  report, and bulk moves whose text exists only at run time — so the plan
  says so in its Global Constraints and the boundary's `diff` is filtered
  by path for `docs/issues/`, `scripts/issue-*.js`, `scripts/issues-*.js`,
  `docs/reports/`, and the note, with each task's own `verify` standing in,
  as `experience-layer`'s plan did for its run-time families.

## Verification

Per batch, by the implementer and by the boundary. Every `lint.sh` call
names files, never a directory.

- `node --test scripts/issue-liveness.test.js` passes (A and after).
- After A: `ls .tanto/tanto-issue-triage/liveness-R*.md | wc -l` is 6 plus
  the number of rounds split;
  `node -e 'const j=require("./.tanto/tanto-issue-triage/liveness.json");console.log(j.length-1)'`
  equals `ls docs/issues/open docs/issues/deferred | grep -c '\.md$'`; the
  `meta` verdict counts sum to the same number; `git status --porcelain`
  shows only the two new scripts before their commit and nothing after.
- After B and C, per round: `grep -c '^## ' triage-R<n>-recommendation.md`
  is 6; `grep -c '^## ' triage-R<n>-brief.md` is 6;
  `grep -c '^### ' triage-R<n>-recommendation.md` equals the round's row
  count in `liveness-R<n>.md`; for every `###` heading, `grep -cF "See: <text>" triage-R<n>-brief.md`
  is 1; `git status --porcelain` is empty.
- Before D: a direction file exists for every round file and each opens
  with the header and either `OK` or lines in section 3's form.
- After D: for each round's commit, `git diff-tree -r --name-status
  <commit>` shows landed + merged-away `R` lines into `resolved/` and no
  other path outside the living documents; `git grep -F -- '<old path>'` over
  `docs/experience docs/design docs/notes docs/issues/open docs/issues/deferred docs/experience.md README.md CONTRIBUTING.md AGENTS.md`
  prints nothing for every moved issue; `node --test scripts/*.test.js`
  passes; `node scripts/issues-by-finder.js` prints a totals table whose
  grand total equals the issue count across the three directories;
  `./scripts/lint.sh docs/notes/experience-layer-exit-criterion.md docs/reports/<date>-tanto-issue-triage-dogfood.md scripts/issues-by-finder.js scripts/issues-by-finder.test.js`
  passes; `git log --oneline main..HEAD -- skills .claude docs/experience`
  prints nothing but link repoints under `docs/experience`, if any.

## Out of scope

- Any edit under `skills/` — the carrier topic's work is to fix, this
  topic's is to name the carrier (the decision file §2).
- A new frontmatter field, a `tags:` or `carrier:` key; a severity pass;
  a `claimed_by` sweep.
- Writing a want into a scene or the hub; editing an expectation.
- Wiring the instrument or the counter into the close, into
  `roles/kanri.md`, or into the shoroku skill's recommend mode; shipping
  either through kisou (Deferred).
- `tanto.json` at any layer.
- The `experience-layer` close's own rows — recommended before this topic
  opened; its 30 issues of 2026-10-02 are in the pile and are triaged like
  the rest.
- Re-triaging `resolved/`; the 99 files there are not read.
- A `tanto-feedback` usage extract, feedback records, or anything of that
  topic beyond the by-finder count.

## Issues this design closes

Each term grepped separately across `docs/issues/open/` and `deferred/` on
2026-10-02: `stale` (37 + 2, all about other things), `triage` (14, the
inbox's triage), `duplicate` (18 + 1), `dedup` (3), `liveness` (3),
`by finder`, `issues filed`, `exp- count`, `exit criterion`, `inbound`,
`path link` (none each); the spec review then reads the directory whole.

This design closes no issue by its own text: what it builds is the
procedure that decides each one, and the decisions are the rounds' and the
human's. Two issues bind the apply rather than close: **issue-9350** (a
`git mv` under `--only` names both paths — section 4's recipe) and
**issue-1c4e** (a boundary that waits for a direction file is named in the
plan's Global Constraints — section 3 does so, and the issue stays open
for the skill's side). **issue-a9a8** (the recommend mode does not
cross-check a proposal against pending `S-n` rows) is the Merged
destination's cousin on the close side and is not touched.

## Answers to the spec inputs

`.tanto/tanto-issue-triage/spec-inputs.md` holds one input, written after
the spec's first commit.

- **I-1** — Kanri's answer on section 3 and the plan's first bullet, asked
  as Step 2's Kanri's-own-procedure case: accepted with two amendments and
  three clarifications, all applied. Amendment 1: the form greps are
  `boundary.verify`'s, not a Kanri act — Kanri's named acts are the
  `attention` request, the per-round line, the direction files, and
  withholding batch D (section 3 steps 1 and 2; What the plan must contain).
  Amendment 2: the Hosa relay keeps the skill's `kessai answer: <topic> —
  <words>` line with the round inside the words, since this topic edits
  nothing under `skills/` (section 3 step 4). Clarifications: a bare `OK`
  answers every round of the open sitting and an item number without a
  round is asked back; a round's direction file is written the moment its
  answer is complete, with the Progress line `batch D waits on triage
  directions — <k> of 6 exist`; the `attention` message names rounds 1–3
  after B and 4–6 after C, and a first-sitting answer arriving after C's
  boundary is written all the same (section 3 steps 3 to 5). Kanri's
  follow-up by message chose, for the review's F-6, the form in which this
  plan's Global Constraints extend the report's Questions for the human by
  one item kind (section 2).

## Deferred items

1. **Wiring the instrument into the close** — the recommender reading a
   liveness table at every close, or a pre-commit check that an issue's
   quoted text still exists — after two or three closes have run it by
   hand (Fixed input 6; ADR candidate 4).
2. **Shipping the instrument through kisou** to repositories whose issues
   quote their own trees; nothing has asked.
3. **The wants no scene states** collected in the report: written into
   scenes by a later shoroku run at the human's word, never by this topic
   (Fixed input 11).
4. **The 09c2 ordering question** — whether the upgrade side moves ahead
   of the generator — returns to Kikaku with the report's numbers (the
   decision file §6).
5. **A pickaxe miss**: a quote whose words were reordered or partly
   rewritten in the removing commit is `no commit found`; the row still
   says gone, and the recommender treats it as Kept with the fact noted.
   Whether a fuzzier trace is worth building is read from the report's
   count of such rows.
6. **The ledgerless topics**: the by-finder count reads `unresolved` for
   a topic whose `.tanto/<topic>/` directory is gone (seven topics, 25
   issues today, all unnumbered); the lineage of those rows is in the
   roster archive's Events lines and is not reconstructed by this topic.
7. **A Merged carrier chain** across topics — an issue merged into a
   carrier that a later triage merges again — is left to that later run;
   the pointer is the id and resolves either way.

## Shoroku proposal from this spec work

Items not in any file above; the dialogue and the spec review are the
recommender's own inputs.

1. Rejected in the dialogue with reason — Q-2 (b): Kanri running the close's
   shape between batches would spend a sonnet Kanri's ceiling on verbatim
   briefs (S-11: one 42 KB brief, about 94000 tokens) and would have a plan
   instruct Kanri; (c): a recommender on a borrowed kind splits the kind's
   name from its work and adds a Jisso dispatch outside the task loop.
2. Rejected in the dialogue with reason — Q-3's alternative: one sitting of
   about 300 lines after the second batch, against two of about 150 that
   let the first sitting's habits inform the second batch's briefs.
3. Rejected in the dialogue with reason — Q-4's alternative: wiring the
   instrument into the close now would make this a skill-editing plan for
   a tool that has never run.
4. Rejected in the dialogue with reason — Q-5's alternative: every `gone`
   Landed unless stopped, because `resolved/` is excluded from reading and
   a wrong move there is not re-found.
5. Fact measured — none of the 308 issues marks an `Old:` side in any
   form, so the decision file's "the `Old:` side only where an issue marks
   one" selects nothing; the extraction is of every quoted string, and the
   discrimination the note asked for is the recommender's reading of the
   removing subject (Fixed input 7).
6. Fact measured — the pile grew from 259 to 308 between the working note
   (2026-10-01) and the spec (2026-10-02), 30 of them filed by one close;
   a triage designed on a count is designed on a moving count, and the
   instrument's own `meta` is the figure the plan carries.
7. Fact measured — `git ls-files --eol` reads `i/lf w/crlf` for every issue
   file under `core.autocrlf=true`; a bulk writer that appends `\n` to a
   CRLF working-tree file leaves a mixed file the editor's diff shows whole.
8. Observation — the per-string `git grep` the working note's probe used
   costs about 0.12 s a call; at the pile's needle count a loaded tree and
   an in-memory normalized search is the difference between seconds and
   minutes, and it is also what lets a wrapped quote match.
9. Observation about the process — the human asked, after sections 1 and 2,
   for the topic's background, purpose, and approach to be restated (Q-7);
   the opening restatement (Q-1) had covered the mechanism and the behavior
   and not the why. A Sekkei's opening on a Kikaku input could carry the
   decision's own reason in two sentences beside the mechanism.
10. Observation about the process — the spec review was dispatched after
    I-1 had arrived and before it was applied, so the reviewer read a
    document two amendments behind the ledger and spent one finding (F-7)
    saying so; a Sekkei that receives an `I-n` before the review dispatch
    should apply it first.
11. Fact measured by the review and ruled into section 1 — the substring
    cluster rule moved 75 of 240 note-placed issues; the whole-word rule for
    short terms is the fix, and Task 2 reports the agreement so the next
    triage can tune the list from a number.
