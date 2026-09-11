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
