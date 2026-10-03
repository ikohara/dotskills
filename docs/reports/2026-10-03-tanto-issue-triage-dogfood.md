# The tanto-issue-triage dogfood

This report records the first run of the issue-triage topic on its own project: the liveness instrument's read of the 308-issue pile, the nine recommendation rounds, the three sittings in which the human answered them, and the apply that moved the issue files. It gives the measurements that run produced, each read from a command or a file named beside it, and it judges nothing. It is also where the Kikaku decision on the order of the next topics (`.tanto/kikaku/2026-10-01-topics-after-experience-layer.md`, section 6, "Rejected") says the question of the 09c2 side third ahead of the passage-plan generator "returns at the triage's close with numbers": the Assigned counts per carrier topic under "Assigned and Merged" are those numbers.

The commands were run from the repository root on the tree as the apply and the two scripts left it (the nine `docs(issues): triage round ...` commits, the `feat(scripts): issues-by-finder` commit and the `docs(notes)` commit that names the count's command are in). The files under `.tanto/` and `.superpowers/` are local to the run and are not tracked: `liveness.json`, `instrument-figures.txt`, `round-files.txt`, the nine `triage-R<part>-recommendation.md` and `triage-R<part>-direction.md`, the nine `apply-R<part>-list.tsv`, the conductor ledger `.tanto/tanto-issue-triage/kanri.md`, the controller's notes `.superpowers/sdd/2026-10-02-tanto-issue-triage/batch-E-notes.md`, the `batch-*-verdict.md` files, and the three Kikaku decision files `.tanto/kikaku/2026-10-03-triage-sitting-1.md`, `-2.md` and `-3.md`. A figure that came out other than the plan expected is stated as it came out.

Words this report uses as the run used them. The **instrument** is `scripts/issue-liveness.js`: it reads each issue's quoted strings and backticked paths against `main` and gives the issue a verdict (alive, gone, partly, none). A **round file** is one of the nine liveness tables (`liveness-R<part>.md`, parts 1, 2a, 2b, 3, 4a, 4b, 5, 6a, 6b); the **recommendation** for a round gives every issue a **destination**: **Landed** (closed on `main` by a named commit; the file moves to `resolved/`), **Merged** (folded into a **carrier** issue, which stays where it is and gains a `Carries` line), **Assigned** (handed to a later topic by a line appended to the issue), **Re-hung** (tied to an experience-layer scene expectation, `exp-<id>`, by a `Serves` line), or **Kept** (untouched). A **sitting** is the human's reading of a batch's recommendations; the answer, given through a Kikaku decision file, is written as the round's **direction file**, which lists only the items changed from the recommendation. **Kessai** is the request for that answer. `R-n` names a ruling and `S-n` a shoroku proposal row in the conductor ledger `.tanto/tanto-issue-triage/kanri.md`; a **boundary** is the check that closes a batch, recorded in its **verdict file**. **Wants no scene states** lists wants an issue states that no scene line yet states.

## The instrument

Source: element 0 of `.tanto/tanto-issue-triage/liveness.json` (its `meta`), and `.tanto/tanto-issue-triage/instrument-figures.txt`.

```bash
node -e 'console.log(JSON.stringify(require("./.tanto/tanto-issue-triage/liveness.json")[0].meta, null, 2))'
cat .tanto/tanto-issue-triage/instrument-figures.txt
```

- **The pile.** 308 issues, read against `main`. The instrument's own `date` field reads `2026-10-02`.
- **The verdicts.** alive 113, gone 18, partly 141, none 36 (308 in all).
- **The counts per round file.** 1: 50, 2a: 40, 2b: 39, 3: 28, 4a: 32, 4b: 32, 5: 25, 6a: 31, 6b: 31 (308 in all).
- **The wall time.** 60.8 seconds for the whole instrument run.
- **The clusters.** `kanri / ledger / handover / boundary` 68, `passage-check / plan instrument` 50, `other` 46, `keikaku / plan / coldread / batch shape` 32, `reading / ceiling / cost / ttl` 16, `jisso / sdd / report` 16, `shoroku / close / kessai / shoki` 13, `config / agents / effort / model` 12, `roster / handshake / address` 11, `sekkei / spec / dialogue` 11, `spawner / bg seats / resume` 8, `kisou / docs system / templates` 8, `brief / review` 5, `tests / scripts` 5, `hosa / kikaku / kaiseki` 4, `wayaku / i18n / language` 3.

The first command printed the `meta` object, whole:

```json
{
  "ref": "main",
  "date": "2026-10-02",
  "total": 308,
  "verdicts": {
    "alive": 113,
    "gone": 18,
    "partly": 141,
    "none": 36
  },
  "clusters": {
    "passage-check / plan instrument": 50,
    "kanri / ledger / handover / boundary": 68,
    "roster / handshake / address": 11,
    "reading / ceiling / cost / ttl": 16,
    "config / agents / effort / model": 12,
    "keikaku / plan / coldread / batch shape": 32,
    "jisso / sdd / report": 16,
    "sekkei / spec / dialogue": 11,
    "brief / review": 5,
    "shoroku / close / kessai / shoki": 13,
    "spawner / bg seats / resume": 8,
    "hosa / kikaku / kaiseki": 4,
    "kisou / docs system / templates": 8,
    "wayaku / i18n / language": 3,
    "tests / scripts": 5,
    "other": 46
  },
  "rounds": [
    {
      "part": "1",
      "count": 50
    },
    {
      "part": "2a",
      "count": 40
    },
    {
      "part": "2b",
      "count": 39
    },
    {
      "part": "3",
      "count": 28
    },
    {
      "part": "4a",
      "count": 32
    },
    {
      "part": "4b",
      "count": 32
    },
    {
      "part": "5",
      "count": 25
    },
    {
      "part": "6a",
      "count": 31
    },
    {
      "part": "6b",
      "count": 31
    }
  ],
  "wallSeconds": 60.8
}
```

The second command printed the figures file, whole:

```text
pile 308; ref main; date 2026-10-02; wall 60.8 s
verdicts {"alive":113,"gone":18,"partly":141,"none":36}
clusters {"passage-check / plan instrument":50,"kanri / ledger / handover / boundary":68,"roster / handshake / address":11,"reading / ceiling / cost / ttl":16,"config / agents / effort / model":12,"keikaku / plan / coldread / batch shape":32,"jisso / sdd / report":16,"sekkei / spec / dialogue":11,"brief / review":5,"shoroku / close / kessai / shoki":13,"spawner / bg seats / resume":8,"hosa / kikaku / kaiseki":4,"kisou / docs system / templates":8,"wayaku / i18n / language":3,"tests / scripts":5,"other":46}
rounds [{"part":"1","count":50},{"part":"2a","count":40},{"part":"2b","count":39},{"part":"3","count":28},{"part":"4a","count":32},{"part":"4b","count":32},{"part":"5","count":25},{"part":"6a","count":31},{"part":"6b","count":31}]
working note: 259 placed lines; 240 of them still in the pile (the denominator); 162 placed by the instrument in the same cluster as by the note
probe: 52 ids listed; 48 still in the pile; 45 read gone or partly
no commit found: 307 gone items in 156 issues
```

## Rounds and destinations

Source: column 3 of each `.tanto/tanto-issue-triage/apply-R<part>-list.tsv` (the effective destination of every issue in the round, after the human's direction was applied), cross-checked against the subjects of the nine apply commits. The round-file names come from `round-files.txt`.

```bash
d=.tanto/tanto-issue-triage
for p in $(tr -d '\r' < "$d/round-files.txt"); do printf 'R%s: ' "$p"; cut -f3 "$d/apply-R$p-list.tsv" | sort | uniq -c | awk '{printf "%s %s; ", $2, $1}'; echo; done
git log --format=%s "$(git merge-base main HEAD)..HEAD" | grep '^docs(issues): triage round '
```

The first command printed:

```text
R1: Assigned 40; Kept 7; Merged 3;
R2a: Assigned 7; Kept 29; Re-hung 4;
R2b: Kept 31; Landed 1; Merged 1; Re-hung 6;
R3: Assigned 2; Kept 20; Re-hung 6;
R4a: Assigned 2; Kept 28; Merged 1; Re-hung 1;
R4b: Assigned 1; Kept 25; Landed 5; Re-hung 1;
R5: Kept 21; Landed 3; Re-hung 1;
R6a: Assigned 5; Kept 25; Landed 1;
R6b: Assigned 3; Kept 23; Landed 5;
```

(Each line the command printed ends in a space after its last semicolon; the repository's trailing-whitespace hook removed it from the copy above.)

Set as a table (a destination the list does not carry is 0):

| Round file | Landed | Merged | Assigned | Re-hung | Kept | Issues |
| --- | --- | --- | --- | --- | --- | --- |
| R1 | 0 | 3 | 40 | 0 | 7 | 50 |
| R2a | 0 | 0 | 7 | 4 | 29 | 40 |
| R2b | 1 | 1 | 0 | 6 | 31 | 39 |
| R3 | 0 | 0 | 2 | 6 | 20 | 28 |
| R4a | 0 | 1 | 2 | 1 | 28 | 32 |
| R4b | 5 | 0 | 1 | 1 | 25 | 32 |
| R5 | 3 | 0 | 0 | 1 | 21 | 25 |
| R6a | 1 | 0 | 5 | 0 | 25 | 31 |
| R6b | 5 | 0 | 3 | 0 | 23 | 31 |
| All | 15 | 5 | 60 | 19 | 209 | 308 |

The second command printed the nine apply commits' subjects, newest first:

```text
docs(issues): triage round 6b — landed 5, merged 0, assigned 3, re-hung 0
docs(issues): triage round 6a — landed 1, merged 0, assigned 5, re-hung 0
docs(issues): triage round 5 — landed 3, merged 0, assigned 0, re-hung 1
docs(issues): triage round 4b — landed 5, merged 0, assigned 1, re-hung 1
docs(issues): triage round 4a — landed 0, merged 1, assigned 2, re-hung 1
docs(issues): triage round 3 — landed 0, merged 0, assigned 2, re-hung 6
docs(issues): triage round 2b — landed 1, merged 1, assigned 0, re-hung 6
docs(issues): triage round 2a — landed 0, merged 0, assigned 7, re-hung 4
docs(issues): triage round 1 — landed 0, merged 3, assigned 40, re-hung 0
```

The cross-check agrees on every cell. For each of the nine rounds the four counts in the subject (landed, merged, assigned, re-hung) equal the table's four columns, and the Kept column is the list's remainder: each row's six cells sum to the round's count in `liveness.json`'s `rounds` array (50, 40, 39, 28, 32, 32, 25, 31, 31). The total row (Landed 15, Merged 5, Assigned 60, Re-hung 19, Kept 209) is the column sums, and each row matches the independent per-round count the controller wrote in `.superpowers/sdd/2026-10-02-tanto-issue-triage/batch-E-notes.md` before the apply ran (landed 15, merged 5, assigned 60, re-hung 19, kept 209). The subjects carry no Kept count, so the Kept column rests on the lists alone. No difference was found.

## Assigned and Merged

Source: `git grep` over `docs/issues` for the closing paragraph each apply wrote, in the tracked tree.

```bash
git grep -h -o -E 'Assigned to [a-z0-9-]+ \(tanto-issue-triage' -- docs/issues | sort | uniq -c
git grep -n -E '^Carries issue-[0-9a-f]{4}' -- docs/issues || echo 'no carrier'
```

The first command printed:

```text
      3 Assigned to 09c2-upgrade (tanto-issue-triage
     56 Assigned to passage-check-hardening (tanto-issue-triage
      1 Assigned to passage-plan-generation (tanto-issue-triage
```

**The Assigned counts per carrier topic** (the numbers the decision file's question on the 09c2 ordering asked for): `passage-check-hardening` 56, `09c2-upgrade` 3, `passage-plan-generation` 1. The three sum to 60, equal to the Assigned column's total under "Rounds and destinations". The counts are of matching lines in the tracked issue files, which is what the command measures.

The second command printed the five carriers of the Merged issues:

```text
docs/issues/open/2d69-a-skip-declaration-names-a-pattern-not-the-subject-it-applies-to.md:86:Carries issue-8808 (merged by tanto-issue-triage, 2026-10-03).
docs/issues/open/58fe-passage-check-verifies-a-w-block-with-nothing.md:87:Carries issue-b7e4 (merged by tanto-issue-triage, 2026-10-03).
docs/issues/open/ac9d-the-frame-command-keys-on-a-task-heading-depth.md:68:Carries issue-5e47 (merged by tanto-issue-triage, 2026-10-03).
docs/issues/open/c391-passage-check-created-line-lint-gap.md:55:Carries issue-91d5 (merged by tanto-issue-triage, 2026-10-03).
docs/issues/open/dfb3-roster-rows-are-matched-by-the-name-string-so-a-rename-duplicates-a-row.md:59:Carries issue-65e4 (merged by tanto-issue-triage, 2026-10-03).
```

Five carriers for five Merged issues, one each, matching the Merged column's total of 5: `2d69` carries `8808`, `58fe` carries `b7e4`, `ac9d` carries `5e47`, `c391` carries `91d5`, `dfb3` carries `65e4`. Four of the five Merged rows are the recommendation's own (the three of round 1, and `5e47` into `ac9d` in round 4a); one, `65e4` into `dfb3` (round 2b, item 29), is the human's direction, read from column 5 of the lists. Issue `ac9d` is also an Assigned issue (round 2a item 38) that stays in `docs/issues/open/` as a carrier.

## Wants no scene states

Source: the `## Wants no scene states` section of each `triage-R<part>-recommendation.md`, one bullet per want, printed with its round file; then each bullet's issue id joined to columns 2 and 3 of that round's `apply-R<part>-list.tsv` to find its effective destination.

```bash
d=.tanto/tanto-issue-triage
for p in $(tr -d '\r' < "$d/round-files.txt"); do awk -v p="$p" '{sub(/\r$/, "")} /^## / {s = $0; next} s == "## Wants no scene states" && /^- issue-/ {print "R" p ": " $0}' "$d/triage-R$p-recommendation.md"; done
```

The command printed 35 bullets (R1 4, R2a 1, R2b 3, R3 3, R4a 4, R4b 6, R5 10, R6a 3, R6b 1), whole:

```text
R1: - issue-2c6a — a read-only review seat can record the lint floor without mutating the tree — nearest scene: exp-06b2
R1: - issue-5050 — linting a directory never reports green having checked nothing — nearest scene: none
R1: - issue-bfea — a whole-branch review in an isolated worktree runs replay and writes its report where Kanri reads it — nearest scene: exp-06b2
R1: - issue-cbbb — a read-only reviewer can exercise boundary check against a real plan without side effects — nearest scene: exp-06b2
R2a: - issue-3ca4 — a progress view across repositories, read from the per-repo ledgers — nearest scene: exp-06b2
R2b: - issue-cdad — the user cannot tell which topic's work a shared resident Kanri's context growth paid for, no per-topic breakdown or stated reading rule — nearest scene: exp-06b2
R2b: - issue-ed26 — a design-shaped escalation carries, by default, a suggestion to take it to Kikaku with the source files named — nearest scene: exp-06b2
R2b: - issue-edcc — a reporter is told when a decision reached elsewhere reverses the answer already given to its report — nearest scene: exp-09c2
R3: - issue-d82b — a different reviewer family per role inside `tanto.json` `subagents` — nearest scene: none
R3: - issue-d3f1 — seat and stage cost measurements carried in the skill's own reference material — nearest scene: exp-06b2
R3: - issue-9a68 — a measured budget in place of rule 9's count of strong-model sessions — nearest scene: exp-06b2
R4a: - issue-a75e — a batch report that tells him an effect outside the worktree happened and was reverted, with how the revert was checked — nearest scene: exp-06b2
R4a: - issue-bb86 — a dogfood of a dialogue that says whether it measured fixed answers or what a live user actually types — nearest scene: exp-06b2
R4a: - issue-cafd — a question that gates the product reaches him before the close even when no batch waits on it — nearest scene: exp-053f
R4a: - issue-e2b7 — his reply counting only for the points on screen when he gave it, when a new point arrives mid-question — nearest scene: exp-12dc
R4b: - issue-1bff — Kanri running concurrent topics is warned of the shared-checkout collision before the first branch switch — nearest scene: exp-06b2
R4b: - issue-7a31 — a sender learns what became of the report it sent — nearest scene: exp-09c2
R4b: - issue-a04c — a settled spec's review brief looks as settled as it is, without padding "nothing" lines — nearest scene: exp-12dc
R4b: - issue-f697 — the spec stage gets facts from a tree no Claude session reads through a seat of the skill and not the conductor — nearest scene: exp-06b2
R4b: - issue-b6d3 — the developer can see where the review gate's substantive changes come from — nearest scene: exp-12dc
R4b: - issue-e36d — the human can tell a brief's points drawn from the document from points the writer raised — nearest scene: exp-12dc
R5: - issue-0ea9 — a recommendation's own obligation outside its numbered list is not silently dropped — nearest scene: exp-12dc
R5: - issue-147e — a proposal row that arrives after the close's recommend is not left pending unnoticed — nearest scene: exp-06b2
R5: - issue-2c4d — the shipped description of shoroku does not drift from the skill — nearest scene: exp-7bb3
R5: - issue-a9a8 — an exit proposal does not re-propose what is already queued — nearest scene: exp-12dc
R5: - issue-abaf — a long proposal stays reviewable — nearest scene: exp-12dc
R5: - issue-c1e5 — a written relay row is carried out and not forgotten across tenures — nearest scene: exp-06b2
R5: - issue-d5c9 — a decision made mid-topic does not read an issue file its own ledger already knows is stale — nearest scene: exp-7bb3
R5: - issue-fd4b — the close does not wait without limit on a stuck seat — nearest scene: exp-06b2
R5: - issue-46d3 — the test suite does not cost minutes of wall time at every boundary — nearest scene: exp-06b2
R5: - issue-05ee — a decision's interim clause is put in front of the tenures it binds — nearest scene: exp-06b2
R6a: - issue-aeed — translating many files at once, wanted only if a real use appears — nearest scene: exp-bcf4
R6a: - issue-b2b5 — a translation subagent's scratch files never land at the repository root — nearest scene: exp-bcf4
R6a: - issue-229c — a check that rejects a user-home absolute path from any tracked file — nearest scene: exp-09c2
R6b: - issue-7fa4 — a seat whose turn stopped advancing is surfaced to the user without his asking — nearest scene: exp-06b2
```

By the nearest scene each bullet names: `exp-06b2` 18, `exp-12dc` 7, `exp-09c2` 3, `exp-7bb3` 2, `exp-bcf4` 2, `exp-053f` 1, `none` 2 (35 in all).

**Effective destinations.** Joined to the lists, all 35 bullets' issues are Kept: 35 of 35, none Landed, Merged, Assigned or Re-hung. The join below, reading column 3 of each bullet's own round list, printed `35 Kept` and nothing else, so no bullet carries a destination note.

```bash
d=.tanto/tanto-issue-triage
for p in $(tr -d '\r' < "$d/round-files.txt"); do awk '{sub(/\r$/, "")} /^## / {s = $0; next} s == "## Wants no scene states" && /^- issue-/ {print substr($2, 7, 4)}' "$d/triage-R$p-recommendation.md" | while read -r id; do awk -F'\t' -v id="$id" '$2 == id {print $3}' "$d/apply-R$p-list.tsv"; done; done | sort | uniq -c
```

The 35 bullets are for a later run to write into scenes at the human's word; nothing here writes them.

## Issues by finder

Source: `node scripts/issues-by-finder.js`, run in the tree as it stood on the day of this report and copied whole. The counter counted 407 issues, more than the 308 the triage read: `git ls-files` lists 264 issue files under `docs/issues/open/`, 24 under `deferred/` and 119 under `resolved/` (407 in all), and the 20 issues the apply moved (15 Landed and 5 Merged) are in the resolved count.

```bash
node scripts/issues-by-finder.js
```

```text
## By finder — bg-seat-ergonomics

| Finder | Issues |
| --- | --- |
| boundary | 4 |
| jisso | 4 |
| kikaku | 2 |
| sekkei | 2 |
| branch reviewer | 1 |
| keikaku | 1 |
| plan reviewer | 1 |
| shoroku (unnumbered) | 1 |
| unmapped (issues) | 1 |
| unmapped (notes (process)) | 1 |

## By finder — bg-seat-fixes

| Finder | Issues |
| --- | --- |
| kanri | 3 |
| branch reviewer | 1 |
| keikaku | 1 |
| sekkei | 1 |

## By finder — boundary-rules

| Finder | Issues |
| --- | --- |
| shoroku (unnumbered) | 1 |

## By finder — bug-report-hold

| Finder | Issues |
| --- | --- |
| unmapped (spec `2026-09-19-bug-report-hold-design.) | 4 |
| kanri | 3 |
| branch reviewer | 1 |
| jisso | 1 |
| keikaku | 1 |
| kikaku | 1 |
| plan reviewer | 1 |
| spec reviewer | 1 |
| unmapped (`shoroku-at-close`'s own R-19 (this topi) | 1 |

## By finder — context-cost

| Finder | Issues |
| --- | --- |
| shoroku (unnumbered) | 2 |

## By finder — experience-layer

| Finder | Issues |
| --- | --- |
| kanri | 10 |
| jisso | 4 |
| branch reviewer | 3 |
| keikaku | 2 |
| sekkei | 2 |
| unmapped (issues) | 2 |
| human | 1 |
| spec reviewer | 1 |

## By finder — kisou-refresh

| Finder | Issues |
| --- | --- |
| shoroku (unnumbered) | 8 |

## By finder — requirement-extraction

| Finder | Issues |
| --- | --- |
| shoroku (unnumbered) | 2 |

## By finder — review-brief

| Finder | Issues |
| --- | --- |
| shoroku (unnumbered) | 2 |

## By finder — seat-lineage

| Finder | Issues |
| --- | --- |
| shoroku (unnumbered) | 15 |

## By finder — shoroku-at-close

| Finder | Issues |
| --- | --- |
| shoroku (unnumbered) | 17 |

## By finder — tanto

| Finder | Issues |
| --- | --- |
| shoroku (unnumbered) | 5 |

## By finder — tanto-bg-seats

| Finder | Issues |
| --- | --- |
| branch reviewer | 4 |
| jisso | 3 |
| kanri | 3 |
| keikaku | 2 |
| spec reviewer | 1 |

## By finder — tanto-context-ceiling

| Finder | Issues |
| --- | --- |
| shoroku (unnumbered) | 10 |

## By finder — tanto-cost

| Finder | Issues |
| --- | --- |
| shoroku (unnumbered) | 8 |

## By finder — tanto-diet

| Finder | Issues |
| --- | --- |
| branch reviewer | 2 |
| close | 2 |
| jisso | 2 |
| sekkei | 2 |
| kikaku | 1 |

## By finder — tanto-project-config

| Finder | Issues |
| --- | --- |
| shoroku (unnumbered) | 12 |

## By finder — tanto-sweep

| Finder | Issues |
| --- | --- |
| shoroku (unnumbered) | 5 |

## By finder — tanto-sweep-2

| Finder | Issues |
| --- | --- |
| shoroku (unnumbered) | 11 |

## By finder — tanto-workspace

| Finder | Issues |
| --- | --- |
| shoroku (unnumbered) | 7 |

## By finder — —

| Finder | Issues |
| --- | --- |
| session | 102 |
| no source | 71 |
| inbox | 44 |

## Totals

| Topic | close | jisso | boundary | branch reviewer | spec reviewer | plan reviewer | sekkei | keikaku | kanri | kikaku | inbox | human | session | shoroku (unnumbered) | no source | unmapped | Total |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| bg-seat-ergonomics | 0 | 4 | 4 | 1 | 0 | 1 | 2 | 1 | 0 | 2 | 0 | 0 | 0 | 1 | 0 | 2 | 18 |
| bg-seat-fixes | 0 | 0 | 0 | 1 | 0 | 0 | 1 | 1 | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 6 |
| boundary-rules | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 1 |
| bug-report-hold | 0 | 1 | 0 | 1 | 1 | 1 | 0 | 1 | 3 | 1 | 0 | 0 | 0 | 0 | 0 | 5 | 14 |
| context-cost | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | 2 |
| experience-layer | 0 | 4 | 0 | 3 | 1 | 0 | 2 | 2 | 10 | 0 | 0 | 1 | 0 | 0 | 0 | 2 | 25 |
| kisou-refresh | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 8 | 0 | 0 | 8 |
| requirement-extraction | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | 2 |
| review-brief | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | 2 |
| seat-lineage | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 15 | 0 | 0 | 15 |
| shoroku-at-close | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 17 | 0 | 0 | 17 |
| tanto | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 5 | 0 | 0 | 5 |
| tanto-bg-seats | 0 | 3 | 0 | 4 | 1 | 0 | 0 | 2 | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 13 |
| tanto-context-ceiling | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 10 | 0 | 0 | 10 |
| tanto-cost | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 8 | 0 | 0 | 8 |
| tanto-diet | 2 | 2 | 0 | 2 | 0 | 0 | 2 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 9 |
| tanto-project-config | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 12 | 0 | 0 | 12 |
| tanto-sweep | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 5 | 0 | 0 | 5 |
| tanto-sweep-2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 11 | 0 | 0 | 11 |
| tanto-workspace | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 7 | 0 | 0 | 7 |
| — | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 44 | 0 | 102 | 0 | 71 | 0 | 217 |
| Total | 2 | 14 | 4 | 12 | 3 | 2 | 7 | 7 | 19 | 4 | 44 | 1 | 102 | 106 | 71 | 9 | 407 |

## Source kinds

| Source | Issues |
| --- | --- |
| shoroku | 190 |
| session | 102 |
| inbox | 44 |
| hotfix | 0 |
| no source | 71 |

Attributable: 84 of 407 issues (20.6%) name an S-<n> ledger row and reach a finder through it; the by-finder table reads only the topics whose issues carry one.

Of those 84, 0 came out unresolved.

issues counted: 407
```

Four facts to read the output by, each measured and none a judgment:

- **The attributable share is 84 of 407.** The text prints it as 20.6%. A JSON form of the same share would carry the fraction 0.2063… (84 divided by 407 is 0.20638…), not the rounded percentage. The output holds 21 `## By finder` sections (`node scripts/issues-by-finder.js | grep -c '^## By finder — '` prints 21): the 20 named topics and the dash topic (`—`, the issues that carry no topic), which is last. Only the 20 named topics reach a finder; the dash topic's 217 issues are session, inbox and no-source issues and are counted by their source kind.
- **Duplicate ledger ids.** `.tanto/bg-seat-ergonomics/kanri.md` holds duplicate ids S-28, S-29, S-30, S-34, S-35 and S-36 (`grep -oE '^\| S-[0-9]+ \|' .tanto/bg-seat-ergonomics/kanri.md | sort | uniq -d` prints exactly those six), each with a different Source cell on its second row. The counter takes the first row for an id, so an issue that cites one of those six ids may be attributed to the first row's finder, not the one the issue meant. The size of that effect on the table above was not measured.
- **Truncated `unmapped` labels.** The two `unmapped (...)` labels under `bug-report-hold` are cut by the counter at a fixed width (``unmapped (spec `2026-09-19-bug-report-hold-design.)`` and ``unmapped (`shoroku-at-close`'s own R-19 (this topi)``); they are printed as the counter printed them.
- **This topic has no section.** `tanto-issue-triage` does not appear among the topics of the output.

## Unprompted exp- ids

Source: `node scripts/issues-by-finder.js --exp tanto-issue-triage --adr`, the note's recipe (`docs/notes/experience-layer-exit-criterion.md`) applied as written: the topic's own documents are the spec, the plan and the two review briefs; the inputs are the dialogue, the spec-inputs file and the Kikaku decisions that fed the Sekkei; `--adr` is given with no path, which adds no ADR to the documents (the counter's own usage line takes `--adr <paths...>`), because none exists before the close.

```bash
node scripts/issues-by-finder.js --exp tanto-issue-triage --adr
```

The output, whole:

```text
documents: docs/superpowers/specs/2026-10-02-tanto-issue-triage-design.md, docs/superpowers/plans/2026-10-02-tanto-issue-triage.md, .tanto/tanto-issue-triage/review-brief-spec.md, .tanto/tanto-issue-triage/review-brief-plan.md
inputs: .tanto/tanto-issue-triage/dialogue.md, .tanto/tanto-issue-triage/spec-inputs.md, .tanto/kikaku/2026-09-16-fable-diet-and-shoroku-feedback.md, .tanto/kikaku/2026-09-18-parallel-close-and-tanto-feedback.md, .tanto/kikaku/2026-09-19-ttl-regimes-issue-yield-and-kanri-daemon.md, .tanto/kikaku/2026-10-01-issue-clusters.md, .tanto/kikaku/2026-10-01-topics-after-experience-layer.md
documents ids (17): 06b2 09c2 173f 178d 19c1 26d5 27e8 2e98 3a9e 3b2d 518b aaaa bb08 bbbb cccc e3c1 eeee
inputs ids (280): 02ab 03f9 0404 05ee 0632 0673 06b2 077b 09c2 0b5f 0d6c 0e74 0ea9 1096 11db 1298 12dc 13a1 1708 1861 18be 1a9a 1bff 1c02 1c9a 1c9d 1d5d 1d95 1e44 1f2b 1f92 2026 2028 2065 229c 22e9 22fc 235b 259d 261c 264d 26ef 271a 274f 27e8 2872 28f2 2b4e 2b9c 2bab 2c4d 2c6a 2d69 2d84 2e19 2e2b 2e52 2f17 2f47 314b 322d 337b 366f 3694 36c0 372b 37c8 387c 38f5 3a7c 3ca4 3df8 3e94 3f38 40ed 4210 42fc 43a8 45f8 474b 483c 486b 48b2 4914 4d53 4d8a 4eef 4f5c 5050 5144 51af 52ef 52fd 55a3 5601 57b4 58fe 59c9 5a17 5a2d 5a78 5a81 5cf3 5e30 5e47 5e63 5e9c 5f98 6062 629b 62e7 63c1 647b 6620 6880 6a1f 6aa8 6b47 6c44 6c89 6f3d 71bf 7275 7281 7607 768b 7a31 7b7b 7bb3 7bef 7c11 7c28 7f28 7f2a 8016 8312 8349 860b 87fd 894d 8c74 909c 915a 91f6 91fa 9350 9627 96f2 97bc 9a3a 9a68 9ab0 9b2e 9c6f 9ca6 9d17 9d84 9f2c a00e a04c a1a7 a28a a3ea a433 a449 a4c7 a4e2 a5a3 a5b6 a5d0 a5e9 a75e a79c a7d2 a8c2 a9a8 aa37 abaf ac65 ac9d aeed af82 afea b1e4 b22f b2b5 b31c b409 b4e7 b58d b673 b6cb b6d3 b7a2 b7e4 b917 bb86 bb8c bba6 bd69 bdad bed3 bf75 bf89 bfea c0d0 c1e5 c204 c30e c391 c3a9 c3d1 c44b c4b2 c526 c820 c841 c8e2 caba cb19 cbbb cca9 ccd3 cdad d072 d0c9 d0f4 d19f d3bc d3f1 d45c d502 d5c9 d604 d82b d922 d92f dace dadc dc5d de29 dead e047 e10a e13a e18b e28c e2b1 e2b7 e2db e36d e3e4 e496 e6b0 e73b e916 e941 ea3c eb47 ebd9 ed26 ed39 ed4b edcc f1a4 f208 f327 f36d f3e2 f546 f5d8 f697 f851 f902 f94f f9b3 fab7 ff62 ffee fff8
unprompted (14): exp-173f exp-178d exp-19c1 exp-26d5 exp-2e98 exp-3a9e exp-3b2d exp-518b exp-aaaa exp-bb08 exp-bbbb exp-cccc exp-e3c1 exp-eeee
skipped: (none)
unprompted: 14
```

**The count is 14, and what it measures.** The unprompted ids are the documents' `exp-<id>` references that the inputs do not hold. Three limits of the recipe, applied faithfully as the note gives it, change what 14 means:

- **Four of the 14 are not references.** `aaaa`, `bbbb`, `cccc` and `eeee` are the illustrative ids in the spec's and the plan's own test-fixture prose, so they are in the documents' side without being a reference to a scene. Without them the count is 10.
- **The inputs side counts any bare four-hex word.** The `inputs ids` line is long (280) because it holds every four-character hex-looking word in the input files, among them the year `2026`. That makes the inputs side wider than the issue-id and expectation-id references it is meant to hold. The effect runs one way: a document id whose four characters also appear as a bare word in some input file is taken as prompted, so on this side the 14 can only undercount the unprompted references. The four fixture ids of the first bullet are the opposite error, on the documents side; the two do not cancel, and 10 — the count with the fixtures removed — is still a floor. The line shows three of the 17 documents' ids (`06b2`, `09c2`, `27e8`) on the inputs side, which is the 17 less 14. The report does not say how many of those three are real prompts.
- **Nothing was skipped.** The `skipped` line reads `(none)`: every named file was read.

## The working note and the traces

Source: the last three lines of `instrument-figures.txt` (printed in full under "The instrument"). The working note is `.tanto/kikaku/2026-10-01-issue-clusters.md`.

- **Agreement with the working note's placements.** The note holds 259 placed lines (the figures file's unit). 240 of them name an issue still in the pile on the instrument's date, and that is the denominator. The instrument placed 162 of the 240 in the same cluster as the note did: 162 of 240, 67.5% (the percentage is this report's arithmetic from the two printed figures; the instrument prints the counts only). The 19 placed lines whose issue is no longer in the pile are the difference between 259 and 240.
- **The probe.** The probe's 52 listed ids: 48 were still in the pile, and 45 of those 48 read gone or partly.
- **The `no commit found` rows.** The figures file prints `no commit found: 307 gone items in 156 issues`. The unit is a gone item (a quoted passage or a path in an issue's text that no longer reads in the tree), not an issue: 307 gone items for which no removing commit was found, spread over 156 issues. As a cross-check, a recount over `liveness.json` of the items whose `state` is `gone` found 327 gone items in all, 307 with no `removedBy` in 156 issues and 20 with one in 15 issues; the 307 and the 156 agree with the figures file. The 18 issues with a `gone` verdict (see "The instrument") are a different unit from either: an issue's verdict, not an item's state.

  ```bash
  node -e 'const r=require("./.tanto/tanto-issue-triage/liveness.json").slice(1);let g=0,n=0,w=0;const ni=new Set(),wi=new Set();for(const x of r)for(const i of x.items)if(i.state==="gone"){g++;if(i.removedBy){w++;wi.add(x.id)}else{n++;ni.add(x.id)}}console.log(`gone items ${g}; no removedBy ${n} in ${ni.size} issues; with removedBy ${w} in ${wi.size} issues`)'
  ```

## The human's changes and the sittings

### How many items the human changed

Source: the item lines of each `.tanto/tanto-issue-triage/triage-R<part>-direction.md`. The plan's command counts lines of the form `<n> — <word> ...`; the nine real direction files do not use that form, and the plan's count printed 0 for every round. The form they carry is `R<part>: <n> は <Destination word> → <target>`, with a Landed line followed by an indented `subject:` line that names the commit subject (not an item line of its own). The count below is of the lines `^R<part>: [0-9]+ は`.

```bash
d=.tanto/tanto-issue-triage
for p in $(tr -d '\r' < "$d/round-files.txt"); do n=$(grep -cE "^R$p: [0-9]+ は " "$d/triage-R$p-direction.md" || true); printf 'R%s: %s changed\n' "$p" "$n"; done
```

| Round file | Changed from the recommendation |
| --- | --- |
| R1 | 20 |
| R2a | 4 |
| R2b | 1 |
| R3 | 2 |
| R4a | 1 |
| R4b | 3 |
| R5 | 3 |
| R6a | 3 |
| R6b | 7 |
| All | 44 |

The plan's form `^[0-9]+ —` matched 0 lines in every file (R1 to R6b, all nine), run as the plan wrote it. The 44 equals the ledger's own record of the human's answer (R-14: "44 overrides", per round 20, 4, 1, 2, 1, 3, 3, 3, 7). It also equals the number of rows whose column 5 reads `direction` in the nine lists (read with `cut -f3,5` over the lists): 32 Assigned, 11 Landed and 1 Merged. The other 264 rows are the recommendation's own (209 Kept, 28 Assigned, 19 Re-hung, 4 Merged, 4 Landed). The 11 Landed rows carry the `subject:` line the human named, per the ledger's R-14. In the fence below, the tab `cut -f3,5` leaves between the two fields is shown as a space (markdownlint's MD010 rewrote it), so the fence is not byte-identical to the command's output.

```bash
d=.tanto/tanto-issue-triage
for p in $(tr -d '\r' < "$d/round-files.txt"); do cut -f3,5 "$d/apply-R$p-list.tsv"; done | sort | uniq -c
```

```text
     32 Assigned direction
     28 Assigned recommendation
    209 Kept recommendation
     11 Landed direction
      4 Landed recommendation
      1 Merged direction
      4 Merged recommendation
     19 Re-hung recommendation
```

### How long each sitting waited

Source: the first four lines of each direction file (its `Route:` and `Date:` lines), the ledger `.tanto/tanto-issue-triage/kanri.md` (the Batches rows and the Session events lines), and the modification times of the `batch-*-verdict.md`, the three decision files and the direction files.

```bash
d=.tanto/tanto-issue-triage
for p in $(tr -d '\r' < "$d/round-files.txt"); do printf '== R%s\n' "$p"; sed -n '1,4p' "$d/triage-R$p-direction.md"; done
grep -n -E '^\| [A-Z]' "$d/kanri.md" | head -20
ls -l --time-style=+%F_%T "$d"/batch-*-verdict.md
ls -l --time-style=+%F_%T .tanto/kikaku/2026-10-03-triage-sitting-*.md "$d"/triage-R*-direction.md "$d/batch-E-prompt.md"
grep -n -E '^- 2026-' "$d/kanri.md"
sed -n '/^## Progress/,/^## Plan/p' "$d/kanri.md"
```

**What the direction headers carry.** Each of the nine files opens with a `Route:` line and a `Date:` line and nothing more: the date is `2026-10-03` in all nine, and no file carries a time. The route is the Kikaku decision file of the file's sitting (`.tanto/kikaku/2026-10-03-triage-sitting-1.md` for R1, R2a, R2b; `-2.md` for R3, R4a, R4b; `-3.md` for R5, R6a, R6b), each noted as "decision-9cc5's route". The sitting grouping is therefore three, as the files group the rounds; the spec called for two sittings, after batch B and after batch C; the plan's Deviations item 1 ("three recommend sittings, not two") added sitting 3 after batch D once the instrument split three rounds in two, and its Batches table row D names it.

**What the ledger carries.** The Batches rows (A, B, C, B-rework-1, B-rework-2, D, E) carry a state, the prompt and report paths and a verdict, and no date or time. The ledger's R-n rulings carry a date at most (R-1 and R-3 name 2026-10-01; R-2, R-4, R-7, R-8 and R-10 name 2026-10-02; R-14 names 2026-10-03; the other seven name no date) and no time. The only times in the ledger, read as it stood at 08:08 on 2026-10-03 (it has gained lines since), are the Session events lines: topic opened 2026-10-02 12:55; spec review-ready 2026-10-02 16:51; plan review-ready 2026-10-02 19:42; three review-seat dispatches tagged batch A — spec.review, plan.review, plan.coldread — 2026-10-02 20:30, none of them batch A's own dispatch; a handover accepted 2026-10-03 08:08. The Progress section is one line with no time, and the Measurements table's When column holds dates only. No line carries the time a batch boundary was accepted or the time the human's kessai was asked, so the ledger gives no boundary time for any sitting.

**What the files' modification times carry.** The verdict files, which stand for the boundary that closed each batch:

```text
-rw-r--r-- 1 0000105523 1049089 12145 2026-10-02_20:30:51 .tanto/tanto-issue-triage/batch-A-verdict.md
-rw-r--r-- 1 0000105523 1049089 10040 2026-10-02_21:42:32 .tanto/tanto-issue-triage/batch-B-rework-1-verdict.md
-rw-r--r-- 1 0000105523 1049089  7950 2026-10-02_21:53:18 .tanto/tanto-issue-triage/batch-B-rework-2-verdict.md
-rw-r--r-- 1 0000105523 1049089 10814 2026-10-02_21:19:30 .tanto/tanto-issue-triage/batch-B-verdict.md
-rw-r--r-- 1 0000105523 1049089 12187 2026-10-02_22:55:58 .tanto/tanto-issue-triage/batch-C-verdict.md
-rw-r--r-- 1 0000105523 1049089 16820 2026-10-03_00:27:00 .tanto/tanto-issue-triage/batch-D-verdict.md
```

(The `grep` over the ledger's Batches rows also printed the Shoroku proposal rows S-1 to S-11, which begin with a capital letter in the same column; they are not part of this measurement and are not copied.) The three Kikaku decision files were last written at 08:03:36 (sitting 1), 08:03:45 (sitting 2) and 08:03:46 (sitting 3) on 2026-10-03, and all nine direction files at 08:05:31 on the same day. Each decision file says of itself that it is one of three "written from one consultation, one per sitting", and that the human's words are the same in all three.

**How long each sitting waited**, from the verdict file that closed the batch holding the sitting's rounds to the sitting's decision file and to its direction files (all times as the file system reports them, in the host's local time):

| Sitting | Boundary file (modification time) | Decision file | Direction files | Waited, to the decision file | Waited, to the direction files |
| --- | --- | --- | --- | --- | --- |
| 1 (R1, R2a, R2b) | `batch-B-rework-2-verdict.md` (2026-10-02 21:53:18) | 2026-10-03 08:03:36 | 2026-10-03 08:05:31 | 10 h 10 min | 10 h 12 min |
| 2 (R3, R4a, R4b) | `batch-C-verdict.md` (2026-10-02 22:55:58) | 2026-10-03 08:03:45 | 2026-10-03 08:05:31 | 9 h 08 min | 9 h 10 min |
| 3 (R5, R6a, R6b) | `batch-D-verdict.md` (2026-10-03 00:27:00) | 2026-10-03 08:03:46 | 2026-10-03 08:05:31 | 7 h 37 min | 7 h 39 min |

**The precision these figures have.** The direction headers carry a day and no time, and the ledger carries no boundary time, so the ledger and the headers give each sitting's wait to the day only, and on that reading all three waited from the night of 2026-10-02 into the morning of 2026-10-03. The hours in the table come from the files' last-write times alone, so they are approximate in two ways. First, a verdict file's last-write time is when the verdict was written, not when Kanri accepted it or asked the human to answer; the ledger holds no such time, so the wait the human experienced starts at some unrecorded point after it, and the figures are upper bounds on that only if no verdict file was written again after its boundary — the second caveat cuts the other way. Second, a last-write time can be later than the first write; a file edited afterward reads late. The three sittings were answered together, in one consultation that wrote the three decision files within ten seconds of one another, so the three waits differ only because the three boundaries came at different hours of the night: the table measures how long each boundary's verdict sat before the one answer, not three separately timed answers. The nine direction files carry one modification time (08:05:31), so they were written, or last written, together, about two minutes after the decision files; the spec's wording is that each is written "the moment that round's answer is complete". The handover line at 08:08 on 2026-10-03 and the batch E prompt's own modification time (08:08:37) both come after the direction files.
