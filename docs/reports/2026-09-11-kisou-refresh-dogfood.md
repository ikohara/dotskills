# The kisou refresh dogfood

Jisso ran `kisou migrate` against this repository itself, docs-only scope,
through the skill's own trigger, on the `kisou-refresh` branch. No human was
in the dialogue: under `tanto` Jisso has no human access, so every answer
below — confirm the detection, decline every script slot, docs-only scope,
accept both items — is the batch C prompt's pre-decided answer (Kanri
carrying the human's plan-gate decisions), given by Jisso itself in place of a
user and recorded verbatim with the prompt it answered. The run measured the
skill text against fixed answers, not a live user. It was run to take the six
measurements the kisou refresh design spec of 2026-09-11 set out to resolve.

## What was run

The trigger was typed as a user would: `起草して migrate` — invoked as the
`kisou` skill with the argument `migrate`. The skill loaded through
`$CLAUDE_CONFIG_DIR/skills/kisou`, which resolves to `skills/kisou` in this
working tree (a link; `SKILL.md` identical in size, 16159 bytes, on both
paths) — confirmed by
`grep -c 'doc-system-check' skills/kisou/SKILL.md` → `4` (floor 2), so the
branch's own refreshed skill is the one that loaded.

Detection was by enumeration (`ls -d */`, `ls scripts/`, `ls -d docs/*/`,
per-artifact `ls`), not by existence probes. It found `case: snake_case`
(observed dir names `docs/`, `scripts/`, `skills/`, all lowercase; no
Pascal-cased dir), no `src/` or `tests/`, `lint` present among scripts
(`scripts/bootstrap.{bat,sh}` present and left untouched; `setup`, `run`,
`build`, `test`, `tidy` absent), `os.mode=both` (`.bat` and `.sh` both
present), a **`full`** doc-system (`docs/AGENTS.md` plus
`requirements`/`design`/`decisions`/`issues` `AGENTS.md` all present;
`notes/` and `reports/` copies also present outside the tally; the
non-standard subdir `docs/superpowers/` kept by default, exempt from the
`<id>-<slug>` naming rules), and `docs/` as the docs root. The run was
recorded in Jisso's own session, `dotskills-0e [a4fe16]`; HEAD before the run
was the commit "docs(issues): tanto says nothing about a rate limit met mid-run,
and a limit is a pause, never a model change".

## The proposal, verbatim

Docs-only scope drew no layer-B item, so the instrument's numbers are the
proposal's, offset 0. Command, with `$KISOU` the loaded skill's directory
(`$CLAUDE_CONFIG_DIR/skills/kisou`, named above):
`node "$KISOU/scripts/doc-system-check.js" check --docs docs --case
snake_case` → exit 1. The proposal, verbatim:

```text
1. replace: docs/notes/AGENTS.md — # notes/ — AGENTS
-
- A `note` is a **maintained reference** on **one** concern — a registry,
- glossary, mapping table, cheat sheet. It is *living* (updated in place), the
- opposite of `reports/` (dated, frozen). It is **not** a scratchpad or session
- log; non-curated content does not belong here (see "Not a scratch space" in
- `docs/AGENTS.md`).
-
- A *flat* type (like `reports/`): no `<id>`, no frontmatter — the slug is the
- identity.
-
+
+ A `note` is a **maintained reference** on **one** concern — a registry,
+ glossary, mapping table, cheat sheet. It is *living* (updated in place), the
+ opposite of `reports/` (dated, frozen). It is **not** a scratchpad or
+ session log; non-curated content does not belong here (see "Not a scratch
+ space" in `docs/AGENTS.md`).
+
+ A *flat* type (like `reports/`): no `<id>`, no frontmatter — the slug is the
+ identity.
+
2. replace: docs/reports/AGENTS.md — # reports/ — AGENTS
-
- A `report` records a one-off investigation — a recon, feasibility scan,
- measurement run, audit. It is **dated and frozen**: it preserves what was true
- at investigation time so later docs can cite it, and is not rewritten as the
- project moves on.
-
- A *flat* type (like `notes/`): no `<id>`, no frontmatter — the file-name date is
- the identity.
-
+
+ A `report` records a one-off investigation — a recon, feasibility scan,
+ measurement run, audit. It is **dated and frozen**: it preserves what was true
+ at investigation time so later docs can cite it, and is not rewritten as the
+ project moves on.
+
+ A *flat* type (like `notes/`): no `<id>`, no frontmatter — the file-name
+ date is the identity.
+
2 items, 0 notes
```

Exactly two items, both `replace`, the expected two paths in that order, no
note. No `.bak` offer; no file reported as not kisou-managed. Then: `Direction?`

## The answers given

Prompt 1, the detected values presented for confirmation (verbatim as put):

> - mode: `migrate` (explicit argument)
> - `case`: `snake_case` — observed dir names `docs/`, `scripts/`, `skills/`, all lowercase; no Pascal-cased dir
> - `dirs`: none — no `src/` or `tests/` (a fact, not prompted)
> - `scripts`: `lint` present (`scripts/lint.bat`, `scripts/lint.sh`); `scripts/bootstrap.{bat,sh}` present and left untouched; `setup`, `run`, `build`, `test`, `tidy` absent
> - `os`: `windows` + `unix` (`.bat` and `.sh` both present) → `os.mode=both`
> - doc-system: **`full`** — `docs/AGENTS.md` + `requirements/design/decisions/issues` `AGENTS.md` all present; `notes/` and `reports/` copies also present (outside the tally); non-standard subdir `docs/superpowers/` → kept by default, exempt from the `<id>-<slug>` naming rules
> - docs root: `docs/`

Answer 1: confirmed as detected.

Prompt 2, the scripts-intent prompt (verbatim as put):

> scripts the repo lacks (opt in?): `setup`, `run`, `build`, `test`. (`tidy` not offered: no `CMakeLists.txt` at the repository root.)

Answer 2: decline all four. No script added.

Prompt 3, the scope (verbatim as put):

> scope: full (layer B + doc-system) or docs-only?

Answer 3: **docs-only**.

Acceptance, after the numbered proposal above and its `Direction?`: `1 と 2` —
accept both. Applying them
(`node "$KISOU/scripts/doc-system-check.js" apply --items 1,2 --docs docs
--case snake_case`) exited 0 and printed:

```text
1. replace: docs/notes/AGENTS.md — # notes/ — AGENTS
2. replace: docs/reports/AGENTS.md — # reports/ — AGENTS
2 items applied
```

## The six measurements

| Issue | Question | Expected | Observed |
| --- | --- | --- | --- |
| issue-e19f | Are the four per-type copies and the two flat copies classified kisou-managed? | Yes, all six, by the H1 rule | Yes. All seven doc-system copies (the six named plus `docs/AGENTS.md` itself) passed the H1 fingerprint; none was reported as not kisou-managed; no note was printed. |
| issue-2bf9 | Are the sections that carry `<id>` notation treated as fixed-text? | Yes — the two replacements are in such files, and no section was skipped as free text | Yes. No `<id>`/`<slug>` in a fixed section was read as free text: the two `replace` items above were the only proposals, and the sections carrying `<id>` in the notes and reports copies compared level once the rewrap was closed. |
| issue-f623 | Where does an added section land? | No `add` item on this tree; the evidence is test case 5, quoted below, not the run | **The run produced no `add` item** — nothing was missing from any of the seven copies, so this question has no answer from the run itself. The evidence is test case 5, quoted below, not the run. |
| issue-afed | Is `tidy` offered on this repository? | No | No. The scripts prompt (Prompt 2, above) offered `setup`, `run`, `build`, `test` and did not offer `tidy`, on the detectable condition the batch text states: no `CMakeLists.txt` at the repository root (measured directly: `ls CMakeLists.txt` → none). |
| issue-f50d | Does a `full` doc-system in docs-only scope draw refresh proposals? | Yes, the two above | Yes, the two `replace` items above. The classification was stated as `full` in Prompt 1 before scope was asked at all; the class did not narrow the scope on its own, and the scope (docs-only) was the answer to the separate Prompt 3, asked after the class was already stated. |
| issue-acc0 | Do the two copies come level, and does the hook's command fail before and pass after? | Yes; the "before" was measured by running the command once before accepting | Yes. Before: `node skills/kisou/scripts/doc-system-check.js check --docs docs --case snake_case` exited **1**, printing the same two-item, 41-line proposal quoted above (`cmp`-identical to the batch's separate sweep-and-check capture). After `apply`, the same command printed `0 items, 0 notes` and exited **0**. `git status --porcelain` showed exactly the two lines quoted below (each a space, then `M`, then the path); `git diff --stat` measured the drift itself: 6 lines (3+/3−) on notes, 4 lines (2+/2−) on reports — wrapped paragraphs only, not a content change. |

```text
 M docs/notes/AGENTS.md
 M docs/reports/AGENTS.md
```

issue-f623's row needs its own accounting, because the dogfood produced no
`add` item to point to. `skills/kisou/scripts/doc-system-check.test.js`'s test
case 5 is the evidence that closes it, in six tests (lines 462–530 and
689–720):

- **"an added section lands after the nearest preceding section present"**
  (line 462): deletes `## Body` from a fresh `requirements/AGENTS.md` copy,
  applies the resulting `add` item, and asserts the section order becomes
  `# requirements/ — AGENTS`, `## File`, `## Body`, `## Growth` — the missing
  section reappears immediately after `## File`, the nearest section still
  present that precedes it in template order.
- **"applying only the later of two adds anchors it to what is present"**
  (line 476): deletes both `## Body` and `## Growth`, applies only item 2
  (`## Growth`), and asserts the order becomes `# requirements/ — AGENTS`,
  `## File`, `## Growth` — the later add anchors to `## File`, the nearest
  section actually present, skipping over the still-missing `## Body` rather
  than anchoring to a section that is not there.
- **"applying both adds in one run lands them in template order"** (line
  490): deletes the same two sections but applies both items (`1,2`) in one
  run, and asserts the order becomes `# requirements/ — AGENTS`, `## File`,
  `## Body`, `## Growth` — template order is restored regardless of the
  order the items were listed in.
- **"an add whose only preceding section is the H1 lands directly after it"**
  (line 505): builds a `notes/AGENTS.md` with only its H1, intro, `## Body`,
  and `## Growth` (no `## File`), applies the `## File` add, and asserts it
  lands as `# notes/ — AGENTS`, `## File`, `## Body`, `## Growth` — with no
  other section preceding it in the template, the add anchors to the H1
  itself.
- **"a copy with only its H1 takes every section, in order, at the end"**
  (line 517): builds a `notes/AGENTS.md` with only its H1 and intro, applies
  all three missing sections in one run, and asserts the full order
  `# notes/ — AGENTS`, `## File`, `## Body`, `## Growth` — every section
  the template defines, inserted in template order, at the end.
- On the real bundle: **"a section deleted from the real requirements copy is
  re-inserted in place"** (line 689): expands the actual bundle template,
  deletes `## requirements vs issues` from the real `requirements/AGENTS.md`,
  runs `check` (exit 1, one `add` item matching
  `^1\. add: .*requirements/AGENTS\.md — ## requirements vs issues$`), applies
  it, and asserts the restored order
  `# requirements/ — AGENTS`, `## File`, `## Frontmatter`, `## Body`,
  `## requirements vs issues`, `## Growth` — then re-runs `check` and asserts
  `0 items, 0 notes`, exit 0.

Between them these six tests exercise all three insertion positions the
instrument can take — anchored to the nearest preceding section present, to
the H1 when nothing else precedes, and appended in template order when only
the H1 remains — on both a synthetic fixture and the real `requirements`
template. The dogfood did not exercise the insertion rule at all, because
nothing was missing from any of this repository's seven copies; the test
suite, not this run, is what closes issue-f623.

## What the session reads like

One trigger, three prompts (detection confirm, scripts intent, scope), one
numbered proposal with `Direction?`, one acceptance, one `apply` printout, one
commit. The instrument's `check` was invoked once for the proposal itself
(plus once before as the measured "before" and twice after as the measured
"after" and the lint re-check); `apply` once. No prompt asked anything
detection had already answered. Nothing was renamed, nothing was offered as
`.bak`, and no file was edited by hand. The batch text read cleanly enough
that the run needed no clarification at any of the three prompts; the one
place a reader should note is that the `full`/docs-only split arrived as two
separate answers (classification, then scope) rather than one, which is why
issue-f50d's row above states the order explicitly.

## Session reading

The Jisso session's transcript reading at the time of writing: `transcript:
2552635 B, 561 records, 11 wake-ups, 0 compactions`. The four figures are the
transcript file's size in bytes and its record count, the number of
wake-ups (turns that re-read the whole context), and the number of
compactions (harness-produced summaries), as the `tanto` skill defines the
reading.

## Measurements appended at T2

The rows below were added by the kisou refresh plan's T2 write-out after the
run. They freeze what the plan's other stages — the spec review, the plan
review, the batch reports, and the whole-branch review — measured, so that
later documents can cite one dated record.

### The drift's mechanism and the invariant's cost

- `docs/notes/AGENTS.md` and `docs/reports/AGENTS.md` are the only LF-only
  Markdown files in the doc-system (the rest are CRLF under `text=auto` plus
  `autocrlf=true`), and they are exactly the two drifted files: a tool wrote
  them after checkout, a plausible mechanism for the rewrap (measured at the
  spec review).
- The drift issue-acc0 counted (6 and 4 lines) is rewrapping only, content
  identical. The direction question was moot for these two and was decided
  anyway (the spec's fixed input 7), because the next drift will not be.
- The instrument's first run on this repository, at batch A: two `replace`
  items, both a rewrap of the H1 section's paragraph, nothing else. At the
  batch B boundary, the same two `replace` items, unchanged by the skill-text
  edits — 41 lines of output, 6 and 4 wrapped lines.
- The `node`-absent branch is what makes an unscoped sentence dangerous: a
  two-authority defect is harmless while the tool works and is the only
  instruction that fires when it does not. That is the reason for the
  whole-branch review's M-1 fix.

### What the reviews measured about the instrument's rules

- The dogfood expectation reproduces in twenty lines of Node, independently
  of the instrument: expanding the seven template `AGENTS.md` with the
  identity mapping and comparing section by section after BOM, CRLF, and
  trailing-newline normalization gives five identical, `notes` and `reports`
  diverged in the H1 section only, and no missing or author-added section
  (the plan review).
- A defect in the spec's rules, measured at the plan review: "a section body
  ends at the blank line before the next heading" plus "trailing newlines
  reduce to one" makes deleting a file's last section a divergence in the
  section before it; four fixtures had been built that way. The corollary:
  with those rules a `replace` of a file's last section never converges when
  the template body ends in a blank line — a permanently failing hook on a
  tree nobody can level. The shipped templates do not trigger it; a template
  edit could. This is the origin of the plan's trailing-blank-line rule and
  the reason the spec's byte-equality invariant was relaxed, a spec change
  the human ruled on at the plan gate.
- A fixture that installs a private miniature bundle but omits `--templates`
  silently falls back to the real bundle and fails in a later task than the
  one that wrote it — the worst place for an SDD run.
- The byte-equality invariant had a fourth exemption nobody had counted: text
  before the first heading was compared by nothing (a paragraph above the H1
  gave `0 items, 0 notes`, exit 0), and the spec enumerated three while
  ruling the fourth into existence three paragraphs apart. Closed by the fix
  wave's task 13: the preamble is kept through `apply` and reported as a
  note.
- `apply`'s guard spoke a different numbering from the operator's `check`,
  so the only defense against a moved tree was unreadable in the normal
  partial-acceptance case. Closed by the fix wave's task 11 (m-2).
- A whitespace-only fingerprint miss was invisible in its own note; the BOM
  reasoning generalizes to any zero-width difference. Closed by the fix
  wave's task 11 (m-4).

### Hypotheses rejected

- That the doc-system templates hard-code literal type names inside
  `{{docs}}/…` paths — every such path is `{{docs}}/{{<type>}}/…` (the spec
  review).
- That `replay` staged the plan file — the script only calls
  `git rev-parse`, `show`, and `diff`; the index mtime moved because
  `git status` refreshed its stat cache, and the status line (a space, then
  `A`, then the plan's path) was Sekkei's own `git add -N` (the plan review).
- That the byte-exact `replace` assertion of task 2 is unsatisfiable — the
  fixture edits a body in place, so the trailing blank line survives (the
  plan review).
- That markdownlint would rewrap the new `SKILL.md` passages and break
  `diff` — `MD013: false`, and `docs/superpowers/**` is ignored, so the plan
  is never linted; lint-before-verify stays the order, and the risk is
  smaller than it looks (the plan review).
- That the doc-system templates carry layer-B syntax — none of the seven
  carries an `OPTIONAL` marker or a `TEMPLATE FILL` block, which is what let
  the instrument skip that syntax (the spec's own candidates).

### The spec and plan stages, measured

- The spec reviewer (`opus`): 24 findings, 40 tool uses, about 12 minutes;
  the spec grew 737 → 892 lines from its rulings. The parts the spec had
  measured itself — nine needle counts, seven old-text quotes, the dogfood
  expectation — were the parts the review found nothing in.
- The plan side of the fable-spec / opus-plan split, issue-3c7a's account:
  readings at handshake `317302 B, 39 records, 2 wake-ups` and at
  `plan committed:` `2992656 B, 983 records, 18 wake-ups`, about 2.7 MB on
  `opus` against the spec stage's 1.87 MB on `fable`. No information lost to
  the split was measured: `dialogue.md` was never opened, and every
  plan-review finding was against the plan's own construction.
- The plan drafter (`opus`): about 140k tokens, 16 tool uses, 11.4 minutes,
  2071 lines, 13 `(chosen here)` choices (12 adopted, 1 overruled, 2 of them
  spec corrections). The plan reviewer (`opus`): about 214k tokens, 52 tool
  uses, 14 minutes, 16 findings, two of them measured by implementing the
  rules — 1.5× the drafter's cost.
- The plan was edited four times after its commit and before any task (two
  one-line corrections, the base rule twice), each a commit answering a
  measurement or the cold read. The Handoff's "answer by editing the plan"
  trickle was expected; `diff`'s intolerance of it was not, and is closed by
  the hotfix.
- The estimate that decided A′ over A (about a third of `passage-check.js`)
  rested on the templates' having no gating syntax; the plan's Self-Review
  records the actual size for the next estimate.

### Process observations

- The scope split arrived after the first draft and cost nothing at the spec
  stage, because Step 3's "What the plan must contain" already makes the
  spec a cold drafter's handover; the split's cost is measured at the plan
  stage.
- The four-section design presentation approved every choice and enumerated
  no edge case. For a spec that ships a script, the review, not the
  dialogue, is where edge cases surface, and the "Tests the plan must carry"
  list turns them into deliverables.
- The branch moved twice under the plan review (a sentence edited mid-read,
  the `replay-skip:` workaround dropped after the hotfix). A read-only
  reviewer on a live branch re-measures every quoted line before writing
  it, or two of sixteen findings would have been stale.
- Every decision reached `dialogue.md` before the spec, as issue-5e9c asks;
  the design was presented in four sections, each approved before the next.
- The drafter's six tasks all carried lint and commit steps; Sekkei's three
  hand-written ones carried none (blocker 1). Sekkei had modeled them on a
  `sed -n` excerpt of a tanto-sweep task cut before its lint and commit
  steps — a model read partially is reproduced partially. The rule, if
  wanted for `roles/sekkei.md`: read a model task to its Done when.
- Two limits struck the day. First, five `sonnet` wayaku subagents Sekkei
  dispatched in parallel all died on HTTP 429 "weekly limit, resets Sep 13
  10am Asia/Tokyo" — a weekly quota on the weak family, exhausted by
  fan-out, not issue-9a68's per-minute limit — and the plan gate was
  answered from the brief alone, the second time a gate has been answered
  that way. Then the `opus` weekly limit struck another session mid-wave,
  and the human raised it. Both times the answer was the same dispatch on
  the same model, not a model change. A passage plan's translatable prose is
  a fraction of its lines, so section-wise chunking is the right shape for
  the fan-out.
- `replay` verified one `grep` on this plan — 51 of 52 commands skipped, all
  six skip classes firing. `replay`'s yield scales inversely with how much
  of a plan's verification runs through the toolchain, and Sekkei has no
  signal about that before the boundary.
- The R-20 shape: a `node:test` suite's temp directories reaped by a
  `process.on("exit")` handler in the per-file child process, the pattern
  `passage-check.test.js` uses with `after()`. This repository has no
  test-conventions document, and `CONTRIBUTING.md` is repo-root Markdown, so
  the shape is recorded here.

### Jisso's readings and the batches' shape

| Batch | Bytes | Records | Wake-ups | Compactions | Fix rounds |
| --- | --- | --- | --- | --- | --- |
| A | 1533992 | 306 | 7 | 0 | 2 |
| B | 2103596 | 440 | 9 | 0 | 0 |
| C | 2735583 | 619 | 12 | 0 | 2 |
| final (the fix wave) | 3451825 | 870 | 21 | 0 | 1 |

One mid-batch block (R-40, in the wave). Implementers ran on `sonnet`, every
review on `opus`. No 429 in Jisso's session; the `opus` weekly limit struck
another session mid-wave and was raised.

The roster's Residency table at this T2, the record of every session of this
run (issue-40ed's data):

| Role | Name [ref] | Since | Read at | Bytes | Records | Wake-ups | Compactions | Batches | Plans | Noticed |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| kanri | dotskills-28 [152b9d] (born dotskills-ad [34df4d]) | 2026-09-11 | final batch accepted | 5455255 | 2209 | 56 | 0 | 4 | 0 | 0 |
| kanri | dotskills-c5 [fe6b7a] | 2026-09-10 | handover written (tanto-sweep close); replaced 2026-09-11 | 4249771 | 1457 | 54 | 0 | 5 | 1 | 0 |
| sekkei | dotskills-2c [bda97a] | 2026-09-11 | spec done (the tanto-workspace fable Sekkei; holding for `main is free`) | 2120044 | 553 | 21 | 0 | — | — | — |
| jisso | dotskills-0e [a4fe16] | 2026-09-11 | final batch report | 3451825 | 870 | 21 | 0 | — | — | — |
| sekkei | dotskills-c4 [10e8ed] (born dotskills-0b [d38f29]) | 2026-09-11 | exit write-out committed (the opus plan Sekkei); dead 2026-09-11 | 3320149 | 1156 | 23 | 0 | — | — | — |
| sekkei | dotskills-8a [3b8143] | 2026-09-11 | exit write-out committed (the fable spec Sekkei); dead 2026-09-11 | 1870290 | 658 | 28 | 0 | — | — | — |

### The wave's boundary

- `diff --plan <wave> --base <pre-wave>` was clean with nothing unaccounted;
  the `kisou-doc-system-check` hook fired on the instrument's own path; and
  the seven docs templates linted in place with 0 errors.
