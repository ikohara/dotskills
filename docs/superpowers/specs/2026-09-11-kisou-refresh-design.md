# Design: the kisou refresh — a doc-system instrument, and six fixes

`kisou migrate` refreshes a kisou-managed file toward the current template
(decision-281f). Its first dogfood, on 2026-09-09, showed the path missing
two thirds of what it was asked to do — not by refusing, but by classifying
three of four per-type `docs/<type>/AGENTS.md` copies as foreign and offering
to rename each to `.bak` and rewrite it. Six issues came out of that run and
its review. This plan resolves them by moving the doc-system half of the
refresh out of prose and into one executable that decides what is
kisou-managed, what diverged, and where an added section lands; by changing
the fall-through when a fingerprint misses from "rename and rewrite" to
"leave alone and report"; and by installing the template-versus-copy check
this repository has never run.

Everything here was settled in the spec dialogue
(`.superpowers/sdd/kisou-refresh/dialogue.md`, Q-1 to Q-10 and D-1 to D-4).
The plan inherits this document whole; Kanri and Jisso cold-read it.

## Fixed inputs

These are settled. Nothing below re-argues them; the plan inherits them whole.

1. **The scope is six kisou issues** (I-1): issue-e19f (no fingerprint for a
   per-type doc-system `AGENTS.md`), issue-2bf9 (the fixed-text test reads
   `<id>` as free text), issue-f50d (migrate contradicts itself on a present
   doc-system), issue-f623 (no insertion position for an added section),
   issue-afed (the `tidy` slot's condition is stated twice, differently), and
   issue-acc0 (the notes and reports copies drift, and nothing tracks it).
   Two tanto issues ride along as measurements Kanri takes, not as work:
   issue-9a68 and issue-5a81. Serves req-1a2b, "Re-running migrate on a
   project kisou previously set up refreshes it toward the current template".

2. **The fall-through when no fingerprint matches is "leave alone and
   report"** (Q-1, B). A file kisou cannot classify is named, the fingerprint
   it missed is said, and nothing is proposed for it. The `.bak`-and-rewrite
   operation survives only as something the user asks for by naming the
   file; kisou never offers it. This amends decision-281f's "Real-content
   files keep the `.bak` + fresh-write path" and brings `SKILL.md` level with
   req-1a2b's bullet "Uncertainty narrows what migrate proposes, never widens
   it … a file it cannot classify is left alone and reported", which the
   requirement gained on 2026-09-09 and the skill text never followed.

3. **The fingerprint of a doc-system file is one general rule, not a list**
   (Q-2 B, narrowed at D-1 from "H1 and a substantially matching heading
   set" to the H1 alone, the heading set becoming the proposal's material):
   a `{docs,Documents}/**/AGENTS.md` is kisou-managed when its H1
   is the one the expanded template gives it — `# AGENTS.md` for the root,
   together with the `## Document management` heading, and `# <type>/ — AGENTS`
   for a type. The per-type enumeration the issue proposed was rejected
   because the gap it would close was opened by exactly such a list going
   stale. Serves req-1a2b, the refresh bullet.

4. **A `<...>` is an author-fill placeholder only where the template's
   `TEMPLATE FILL` block says "Replace `<...>` with content"** (Q-3, B).
   Every other `<...>` — `<id>`, `<slug>`, `<type>-<id>`,
   `title: <topic title>` — is notation the rule text uses, and its section
   is fixed-text. The doc-system templates carry no `TEMPLATE FILL` block,
   measured 2026-09-11 (`grep -c 'OPTIONAL\|TEMPLATE FILL'` returns 0 on all
   seven), so every section of a doc-system `AGENTS.md` is fixed-text, and
   the free-text test applies to layer B alone. A typographic rule (bare
   versus backticked) was rejected: `docs/AGENTS.md`'s type path table and
   the frontmatter examples carry bare notation. Serves req-1a2b, the
   refresh bullet.

5. **A present doc-system is intact as content and refreshed as structure,
   and its classification does not set the scope** (Q-4, B). The
   none / partial / full classification says what is absent and nothing
   more; the scope — full or docs-only — is always the user's pick; a
   doc-system inside the scope gets the instrument's proposals whatever its
   class, which for a `full` one level with the templates is zero items.
   The "treat the migrate scope as layer-B only unless the user asks
   otherwise" default goes, and with it the parenthetical that contradicted
   it. Serves req-1a2b, "Migrate is non-destructive — show diffs and ask".

6. **The `tidy` condition is stated once, in Step 2, and made detectable**
   (Q-5, A): `scripts/tidy` is offered only for a clang + CMake project,
   which in migrate means a `CMakeLists.txt` at the repository root. Step 3's
   scripts prompt refers to Step 2 instead of listing the slots again.
   Serves req-1a2b, "Migrate auto-detects existing project state".

7. **The template is the source; an installed doc-system copy is byte-equal
   to its expanded template, and that is an invariant** (Q-6, A). Nobody
   edits a copy directly; a wanted change goes into the template first and
   reaches the copy through refresh; a difference that is only line-wrapping
   is a divergence and is proposed for replacement, because it breaks the
   invariant that makes a copy trustworthy. This is an ADR item; the human
   chose it in the dialogue and T1 records it. Serves req-1a2b, "Single
   source of truth".

8. **The check is an executable inside the skill, and kisou runs it**
   (Q-7, A'; Q-8, A; Q-9, B). `skills/kisou/scripts/doc-system-check.js`,
   JavaScript on Node, standard library only, floor Node 22, with two
   subcommands: `check`, which reports, and `apply --items`, which writes
   the accepted items. The doc-system half of migrate is what the script
   says; layer B (`README`, `CONTRIBUTING`, `AGENTS.md`, `CLAUDE.md`) stays a
   prose judgment. A repository-local Python script (Q-7, A) was rejected
   because it would not travel with the skill; a script that also handles
   layer B (Q-8, C) was rejected because it doubles the estimate and none of
   the six issues is in layer B. Serves req-1a2b, the refresh bullet, and
   adds two bullets to it (see Requirements).

9. **This repository wires the check as a pre-commit hook and closes the
   drift by dogfood** (Q-7, A'; Q-10, A). The final batch runs
   `kisou migrate` in docs-only scope on this repository with the new skill,
   accepts the two replacements the notes and reports copies need, confirms
   the check exits 0, and only then adds the hook. The hook is a linter
   configuration edit and the two copies are agent instruction files; both
   are decide points in the plan's review brief, which is where the
   approval this repository's `AGENTS.md` requires is recorded.

## 1. The instrument — `skills/kisou/scripts/doc-system-check.js`

### What it is

One file, JavaScript on Node, no dependencies, no shebang, invoked as
`node "$KISOU/scripts/doc-system-check.js" <subcommand> …` where `$KISOU` is
the kisou skill's own directory, set in the same tool call as the command —
the `$TANTO` convention the tanto skill uses, for the same reason: shell
state does not persist between calls, and an unset variable makes the
command read a path at the filesystem root. Its tests are beside it in
`doc-system-check.test.js` and run under `node --test`.

It compares an installed doc-system — a docs root holding `AGENTS.md` and
the six `<type>/AGENTS.md` — against the bundled templates expanded for one
`case`, and either reports the differences as a numbered proposal (`check`)
or writes the items the user accepted (`apply`). It reads no other file, and
it never touches a file it did not classify as kisou-managed.

### Inputs

| Option | Meaning | Default |
| --- | --- | --- |
| `--templates <dir>` | the bundled `docs` templates | `../templates/docs`, resolved from the script's own path |
| `--docs <dir>` | the target docs root (`docs/` or `Documents/`) | required |
| `--case snake_case\|PascalCase` | the `{{name}}` expansion | derived from the docs root's basename: `Documents` → `PascalCase`, otherwise `snake_case` |
| `--items <n,…>` | `apply` only: the item numbers to write | required for `apply` |

kisou passes the `case` it detected in Step 3 (migrate). The derivation is
for a hand run and the hook, where the docs root's own name is the only
evidence, and it is the same evidence kisou's detection uses.

### Expansion and the target set

The script expands `{{name}}` in each template with kisou's built-in
`case`-aware mapping (design-c1d2; decision-8b1f): for `PascalCase`,
`docs → Documents`, `src → Source`, and every other name title-cased; for
`snake_case`, the name as written. The mapping lives in the script as one
table, the same names `SKILL.md` Step 2 lists. It then resolves the seven
targets under `--docs`: `AGENTS.md`, and `<type>/AGENTS.md` for
`requirements`, `design`, `decisions`, `issues`, `notes`, `reports`, each
directory name expanded. The status subdirectories under `issues/` are not
targets and are not created — by the tool or by kisou; `SKILL.md` already
says a writer creates one on demand when the first issue lands there. A
`--docs` directory that does not exist is a docs root with seven absent
targets — seven `create` items, exit 1 — not an error; only a path that
exists and cannot be read is exit 2. In migrate, an absent doc-system file is
therefore always the instrument's `create` item, and "write the bundle" in
`SKILL.md`'s migrate text means accepting those items; the scaffold mode's
own copy step is untouched.

When `--case` is omitted and the derived case finds none of the seven
targets while the other case finds at least one, the tool exits 2 and says to
pass `--case`, rather than proposing seven creates over an intact doc-system
whose root is named neither `docs` nor `Documents`.

### Fingerprint

A target that exists is **kisou-managed** when its first heading, read
fence-aware, is the expanded template's H1 — `# AGENTS.md` for the root,
`# {{<type>}}/ — AGENTS` expanded for a type — and, for the root alone, the
file also carries the `## Document management` heading, which is what keeps
a layer-B `AGENTS.md` copied to the wrong place from passing. A target
whose first heading is anything else, or that has no heading, is
**not kisou-managed**: the script reports it and proposes nothing for it.
A root whose H1 matches but which lacks `## Document management` gets its
own note — kisou-managed by H1, the document-management heading missing,
restore it by hand — because that heading is also a fixed section, and the
generic note would hide that the file is one `add` away from refreshable.
This is fixed input 3, in code.

### Sections

Both the expanded template and the target are split into sections at every
**ATX** heading line — one to six `#`, at most three leading spaces, then a
space — outside a fenced code block. A fence opens with a run of three or
more backticks or tildes and closes with a run of the same character at
least as long; an indented code block is not a fence, and a `#` in one is
not a heading either, since it is indented four spaces. A leading YAML
frontmatter block (`---` on line 1 to the next `---` line) is skipped, so a
`#` inside it is not a heading. Setext headings (a text line underlined with
`===` or `---`) are not recognized: a target that uses one for its H1 fails
the fingerprint and is reported as not kisou-managed, which is the safe
side. A heading inside a fence — the `# POSIX` and `# PowerShell` comments in
`docs/AGENTS.md`'s command blocks, the `## Context …` lines in the ADR
template's body sketch — is body text. A section is its heading line and
every line up to the next heading, flat, with no nesting: a `###` under a
`##` is its own section. Lines before the first heading are the preamble:
neither a fixed nor an author section, left as they are, not reported.

The section's identity is the heading line's text, exactly; its body is
compared exactly after the normalization below. The template's headings are
the **fixed sections**. A heading in the target that the template does not
have is an **author-added section**, reported and never written. When a
heading repeats in the target, the first occurrence is the fixed section and
every later one is an author-added section, reported by heading; a template
in which a heading repeats is a template error, exit 2, beside "a template
with no H1" — none of the seven has one, measured fence-aware at this spec's
review. Every template section is fixed-text (fixed input 4).

### `check` — the report

`check` prints a numbered list, one item per proposed change, in a
deterministic order: templates in the order root, requirements, design,
decisions, issues, notes, reports; within a file, the template's section
order. The item kinds:

- `create` — the target is absent. The item writes the whole expanded
  template.
- `add` — the target is kisou-managed and a fixed section is missing. The
  item inserts the expanded section at the position below.
- `replace` — the target is kisou-managed and a fixed section's body
  differs. The item replaces the section's body with the template's. The
  item is followed by the whole section, both ways: every line of the
  target's body prefixed `-`, then every line of the template's body
  prefixed `+`. No line-matching algorithm — the sections are short, and a
  rewrap, the case the dogfood pins, is unreadable as a matched diff and
  plain as two blocks. Test 4 asserts that text exactly.

After the numbered items, notices that are not items and cannot be applied:

- `note: <path> — author section kept: <heading>` for each author-added
  section;
- `note: <path> — not kisou-managed: first heading is <text>, expected
  <text>` for a target that failed the fingerprint.

`check` ends with one summary line, `<n> items, <m> notes`. An item's number
is the handle `apply` takes, and a `check` on an unchanged tree prints the
same numbers again.

### Insertion position

An added section takes the position the template gives it, relative to the
fixed sections around it (fixed input; issue-f623): it is inserted directly
after the end of the nearest **preceding** template section that exists in
the target; when none precedes it in the target, directly before the nearest
**following** template section that exists; when neither exists, at the end
of the file. An author-added section stays where the author put it, because
the rule counts template sections only. A blank line separates the inserted
section from its neighbors as the template's own spacing does.

### `apply --items <n,…>`

`apply` recomputes the same list `check` would print, takes the numbers
given, and resolves each to an item's **identity** — path, kind, heading —
from that list. Then it writes them in list order, and after every write it
recomputes the list from the tree as it now is and finds the next accepted
item by identity, so an `add` whose anchor another accepted `add` just
created lands after it, in template order; a `create` writes the file
(creating its directory), an `add` inserts, a `replace` substitutes the
body. It refuses a number that is not an item (a note has no number; a
number past the list is an error), and it refuses to run with no `--items`.
It prints the items it applied, in the `check` form, so the operator sees
what was written — which is also the only guard against the tree having
moved between the operator's `check` and the `apply`: the numbers are
re-derived, not stored, and what was written is shown. A section the user
did not accept is left exactly as it was, and partial acceptance
(`2 と 5 だけ`) is the normal case, not the exception.

### Exit codes

| Code | `check` | `apply` |
| --- | --- | --- |
| 0 | no items (notes may exist) | every requested item written |
| 1 | one or more items | — |
| 2 | bad arguments, an unreadable template, a target that exists and cannot be read, a template with no H1 or with a repeated heading, a `--case` derivation that finds no target while the other case finds one | bad arguments, no `--items`, an item number that does not exist, a write failure |

The hook uses `check`'s code as it is: a level tree exits 0.

### Encoding and line endings

Files are read as UTF-8, and a leading byte-order mark (U+FEFF) is stripped
on read — otherwise a BOM'd target's first line is not `# AGENTS.md` and the
fingerprint misses with a note that looks identical to a pass. Before
comparison, `\r\n` becomes `\n` and the file's trailing newlines are reduced
to one; a difference of line endings or of a BOM alone is not a divergence. `apply` writes a file with the line ending the
target file already uses — `\r\n` when its first line ended so, `\n`
otherwise — and a `create` writes `\n`. Line wrapping is **not** normalized:
a paragraph wrapped at a different column is a divergence (fixed input 7),
which is exactly the drift issue-acc0 measured.

### Module format and dependencies

CommonJS, `'use strict'`, `node:fs`, `node:path`, `node:util`
(`parseArgs`), and nothing else; the line diff is the script's own. No
`package.json`, no `node_modules`, no lockfile — the skill directory gains
`scripts/` with two files. The floor is **Node 22**, stated in the script's
header comment, in `SKILL.md`'s new prerequisite paragraph, and in the
README. Node 24 is what this machine runs; the tests run under the floor
through `mise x node@22`, as the tanto instrument's do.

### Tests

`doc-system-check.test.js`, `node:test` and `node:assert`, building its
fixtures in a temporary directory per test. The cases the plan must carry:

1. **Identity.** Expand the real bundle for `snake_case` into a fresh docs
   root; `check` prints `0 items` and exits 0. The same for `PascalCase`
   into a `Documents/` root, with `--case` omitted, so the derivation is
   tested.
2. **Absent.** An empty docs root: seven `create` items, exit 1; `apply`
   with all seven yields identity. The same for a `--docs` path that does
   not exist. A `--docs` path that is a file, not a directory: exit 2.
3. **Fingerprint.** A `requirements/AGENTS.md` whose H1 is `# Requirements`
   is a note, not an item, and `apply` never touches it; a root `AGENTS.md`
   with the right H1 but no `## Document management` is the same.
4. **Diverged.** A copy with one paragraph rewrapped: one `replace` item,
   its printed text asserted exactly — the item line, every old body line
   with `-`, every new body line with `+`; `apply` restores identity.
5. **Missing section, position.** A copy lacking `## requirements vs issues`
   (between `## Body` and `## Growth` in the requirements template): one
   `add` item; after `apply`, the section sits between those two. Then the
   same copy also lacking `## Body`: two `add` items; applying only the
   second inserts it after `## Frontmatter`, the nearest preceding section
   present; applying both in one `apply` lands `## Body` after
   `## Frontmatter` and `## requirements vs issues` after `## Body`, in
   template order. Then a copy that has only the H1 section: inserted at
   the end.
6. **Author section.** A copy with an extra `## Local conventions` between
   two fixed sections: a note, no item, and after an `apply` of an unrelated
   item the section is still there, in place. A copy in which `## File`
   appears twice: the first is compared, the second is a note.
7. **Fence.** A copy whose backtick-fenced block contains a `#` line, and
   one whose tilde-fenced block does: no spurious section, identity holds. A
   copy with a leading frontmatter block: skipped, identity holds. A copy
   whose H1 is setext: a not-kisou-managed note.
8. **Encoding and line endings.** A CRLF copy of the template: identity; a
   CRLF copy with one diverged section: `apply` writes CRLF back. A copy
   with a BOM: identity.
9. **Errors.** `apply` with no `--items`, with a number past the list, and
   with a note's position: exit 2 and nothing written. A template directory
   in which one file repeats a heading: exit 2. A `--docs` named `Docs`
   holding a PascalCase doc-system, `--case` omitted: exit 2 with the
   message to pass `--case`.

### What `check` is to kisou, and what it is not

It is the whole of the doc-system comparison: kisou copies its items into
the numbered proposal and passes the accepted numbers back. It is not a
layer-B tool — `README`, `CONTRIBUTING`, the top-level `AGENTS.md` and
`CLAUDE.md` keep their OPTIONAL gating, their `TEMPLATE FILL` blocks, and
their free-text sections, all of which the script does not parse and the
skill text still judges. It is not a template linter and reads no
`docs/<type>/*.md` entry.

## 2. `skills/kisou/SKILL.md` — eleven passages

Each passage below quotes the text on `main` as of 2026-09-11 that it
replaces or anchors to, and says what the new text must say. The plan
writes the new text as passage blocks with citable ids; wording is the
drafter's, meaning is fixed here. No heading of `SKILL.md` is renamed. The
`description` frontmatter line is not touched — it must keep clear of
`: ` (colon-space), which breaks the YAML load silently, and the plan's
verification loads it for real.

### P1 — the prerequisite

Insert after the paragraph that ends "Do not restate the template's
contents here — read and copy from the bundle." a paragraph saying: the
doc-system half of migrate runs one executable, `scripts/doc-system-check.js`
beside the templates, on Node 22 or later, standard library only; when
`node` is not on the path, kisou says so and the doc-system half of that
migrate does not run — it is not replaced by reading the files yourself,
because a comparison the tool did not make is not a comparison (req-1a2b:
uncertainty narrows). Scaffold needs nothing: it writes the templates as
they are.

### P2 — Step 2, the `tidy` condition, stated once

Old:

> `scripts/tidy` the
> project needs — offer `scripts/tidy` (clang-tidy) only for clang + CMake
> projects; `scripts/bootstrap` is always created)

New: the same clause, with the condition made detectable — offer
`scripts/tidy` (clang-tidy) only for a clang + CMake project, which in
migrate means a `CMakeLists.txt` at the repository root; this is the one
place the condition is stated.

### P3 — Step 3 (migrate), the scripts prompt refers to Step 2

Old:

> After surfacing the detected values for confirmation, **also ask once about
> scripts the repo lacks**: list the not-yet-present slots (`setup` / `run` /
> `build` / `test` / `lint` / `tidy`) and let the user opt into any.

New: list the slots **Step 2 offers** that the repository lacks — `tidy`
among them only under Step 2's clang + CMake condition — and let the user
opt into any. The rest of the paragraph (intent versus fact) stays.

### P4 — Step 3 (migrate), the `full` class sets no scope

Old:

> - **full** (root `AGENTS.md` + all four per-type files present) → leave
>   intact; treat the migrate scope as **layer-B only** unless the user asks
>   otherwise. It is still a refresh target (see the Present branch below).

New: **full** → the root and the four managed per-type files are present;
what is absent — `notes/` and `reports/` included, since they sit outside
this tally — and what diverged comes from the instrument in the Present
branch, inside whatever scope the user picks below. No default scope, no
parenthetical. The tally itself (five artifacts) is not changed (Q-11 a1).

### P5 — Step 3 (migrate), the fingerprint line for the doc-system

Old:

> - `{docs,Documents}/AGENTS.md` — the type path table plus the "Document
>   management" heading.

New: `{docs,Documents}/**/AGENTS.md` — the root and every `<type>/AGENTS.md`
— the H1 the expanded template gives it (`# AGENTS.md` with the
`## Document management` heading for the root; `# <type>/ — AGENTS` for a
type), a test `scripts/doc-system-check.js` applies, not you. The two
layer-B lines above it and the "any layer-B file whose heading set
substantially matches" line below it stay as they are.

### P6 — Step 3 (migrate), which angle brackets are free text

Anchor: the paragraph beginning "Never flag a **free-text section**". Insert
after it a paragraph saying: a `<...>` marks author free text only where the
template's own `TEMPLATE FILL` block says "Replace `<...>` with content";
every other `<...>` — `<id>`, `<slug>`, `<type>-<id>`, a frontmatter example's
`title: <topic title>` — is notation the rule text uses, and its section is
fixed-text. The doc-system templates carry no `TEMPLATE FILL` block, so every
section of a doc-system `AGENTS.md` is fixed-text, and the free-text test is
a layer-B test.

### P7 — Step 3 (migrate), the doc-system refresh is the instrument

Old, the sentence that opens the kisou-managed branch's procedure:

> Compare the file's
> structure against what the current template would produce for the detected
> inputs, and propose (always as numbered items, never a silent auto-merge):

New: that sentence scoped to layer B — for a layer-B file, compare its
structure against what the current template would produce for the detected
inputs, and propose, always as numbered items, never a silent auto-merge —
and, after the two bullets and P6's paragraph, a paragraph saying: for a
doc-system `AGENTS.md` the comparison is not yours. Run
`node "$KISOU/scripts/doc-system-check.js" check --docs <root> --case <case>`
with the detected values, `$KISOU` set to this skill's directory in the same
tool call. Its items go into the proposal as one contiguous block at the
**end** of the numbered list, in the tool's order, renumbered to follow the
layer-B items; kisou keeps the offset it added and, after the user's answer,
passes `apply --items` the accepted numbers **minus that offset**. The tool's
notes go after the list, unnumbered. `apply` writes the accepted items and
nothing else. It places an added section where the template places it —
after the nearest preceding fixed section the file has, else before the
nearest following one, else at the end — and leaves an author-added section
where the author put it. There is one authority per file: the instrument for
`{docs,Documents}/**/AGENTS.md`, the reading for layer B.

### P8 — Step 3 (migrate), the fall-through

Old:

> **Not kisou-managed** (real project content: custom headings / prose, no
> fingerprint) → do not attempt a merge. With approval, rename the original to
> `<file>.bak` and write a fresh template-filled file, then tell the author to
> graft the wanted sections back by hand. The `.bak` keeps this non-destructive.

(The block is a continuation of the `- **Present** …` bullet and every line
of it is indented two spaces in the file; the passage block is authored at
that column.)

New: **Not kisou-managed** → leave it alone and report it: name the file,
say which fingerprint it missed, and propose nothing for it. Renaming it to
`<file>.bak` and writing a fresh template-filled file is an operation the
user asks for by naming the file; kisou never offers it. Uncertainty narrows
the proposal (req-1a2b).

### P9 — Step 3 (migrate), the per-artifact `docs/` line

Old:

> - **`docs/` doc-system** → write the bundle if absent; if already present, leave
>   it intact and add only around it.

New: the instrument's report is the proposal, whether the doc-system is
absent or present — an absent file is a `create` item (all seven, for a
`none` doc-system: that is "write the bundle"), a missing fixed section an
`add`, a diverged fixed-text section a `replace` shown with its diff; an
author-added section is kept and reported; content is never touched.

### P10 — Prohibited actions

Insert after the line "- Do NOT auto-push." a line: Do NOT rename a file to
`.bak`, or offer to, unless the user asked for that file by name.

### P11 — Step 3 (migrate), the sentence issue-2bf9 filed against

Old, the second bullet of the kisou-managed refresh (a continuation indented
two spaces, like P8):

> - a **diverged fixed-text section** — one whose template body has **no
>   `<...>` free-text** (e.g. AGENTS `## Language`, the `docs/AGENTS.md`
>   document-management rules) → show the diff and propose replacing the stale
>   body.

New: a **diverged fixed-text section** — one whose body differs from the
template's, fixed text being what the paragraph below defines (P6) — show
the diff and propose replacing the stale body; the examples stay. The
literal "no `<...>` free-text" test goes, because it is the text the issue
names as the defect, and a reader must not meet it before P6's definition
(Q-11 b1).

## 3. `skills/kisou/README.md`

Three places, after the `SKILL.md` edits, per this repository's `AGENTS.md`
("After editing a skill's `SKILL.md`, review its sibling `README.md` for
drift"):

- **What it does, the migrate bullet.** The sentence "When such a file
  instead holds real project content, it backs the file up to `.bak` and
  writes a fresh one (with approval) instead of forcing a merge." becomes:
  a file that matches no fingerprint is left alone and reported. The
  preceding sentence gains that the doc-system comparison is made by the
  bundled `scripts/doc-system-check.js` (Node 22 or later).
- **Layout.** A third bullet: `scripts/` — `doc-system-check.js`, the
  doc-system comparison migrate runs, and its tests (`node --test`).
- **Usage.** One sentence: migrate's doc-system refresh needs `node` on the
  path.

## 4. This repository: the hook, the dogfood, the report

### The hook

`.pre-commit-config.yaml` gains, in the existing `repo: local` block that
holds `check-md-frontmatter`, one hook:

```yaml
      - id: kisou-doc-system-check
        name: kisou doc-system copies match their templates
        language: system
        pass_filenames: false
        files: ^(skills/kisou/templates/docs/|docs/AGENTS\.md$|docs/[^/]+/AGENTS\.md$)
        entry: node skills/kisou/scripts/doc-system-check.js check --docs docs --case snake_case
```

`scripts/lint.{bat,sh}` runs pre-commit, so the check runs on every lint
and commit that touches a template or a copy, and nowhere else. The
biome-check hook already binds on `.js` files, so the script and its test
are formatted and linted by the existing configuration with no addition.
The hook runs whatever `node` is on the path, and the script's floor is what
makes that safe; the tests run under the floor through `mise x node@22`,
which resolves the toolchain on demand (this repository pins nothing in a
`.mise.toml`).

Two consequences the hook brings, stated so that the next plan meets them
knowingly. First, from batch C on, a commit that edits a template's body
fails its own check unless the same commit brings this repository's copies
level — the invariant working as designed, and the reason a template edit
and its `kisou migrate` on this repository are one commit from now on.
Second, the copies are markdownlint-checked with `--fix` and the templates
are not (`.markdownlint-cli2.yaml` ignores `skills/**/templates/**`), so a
template that expands to something markdownlint would fix is a permanent
hook failure; the invariant therefore requires every template to be
markdownlint-clean **as expanded**, which is the check design-c1d2 already
describes (copy to a non-ignored path, expand, lint) and which batch B's
task 6 runs on the seven copies — a `check` at 0 items after markdownlint
has run on them is that proof.

### The dogfood

The last batch runs `kisou migrate` in **docs-only** scope on this
repository, with the skill as the branch then has it, through the same
`起草して migrate` trigger a user would type, in Jisso's own session (the
skill is a link into the working tree, so the run reads the new text). The
expected proposal, from the measurement of 2026-09-11:

| Item | Path | Kind |
| --- | --- | --- |
| 1 | `docs/notes/AGENTS.md` | replace — the H1 section's intro paragraph, rewrapped (6 lines) |
| 2 | `docs/reports/AGENTS.md` | replace — the H1 section's second paragraph, rewrapped (4 lines) |

and no other item, no note. The run accepts both, then
`node skills/kisou/scripts/doc-system-check.js check --docs docs --case snake_case`
exits 0, and only then does the hook go in. The scripts-intent prompt on
this repository still offers `setup`, `run`, `build`, and `test` — and not
`tidy`, which is the measurement for issue-afed — and the run declines them
all.

The run answers, and the report records:

- issue-e19f — are the four per-type copies and the two flat copies
  classified kisou-managed? (expected: yes, all six, by the H1 rule);
- issue-2bf9 — are the sections that carry `<id>` notation treated as
  fixed-text? (expected: yes — the two replacements are in such files, and
  no section is skipped as free text);
- issue-f623 — where does an added section land? This run has no `add`
  item, so the evidence is test case 5, quoted in the report, not the run;
- issue-afed — is `tidy` offered on this repository? (expected: no);
- issue-f50d — does a `full` doc-system in docs-only scope draw refresh
  proposals? (expected: yes, the two above);
- issue-acc0 — do the two copies come level, and does the hook fail before
  and pass after? (expected: yes; the "before" is measured by running the
  hook's command once before accepting).

### The report

`docs/reports/2026-09-11-kisou-refresh-dogfood.md`, written by Jisso as a
plan task after the run, in the shape `docs/reports/AGENTS.md` sets: the
proposal verbatim, the answers given, the six measurements above with their
observed values, and the reading of the session that ran it. It cites the
six issues by `issue-<id>` and this spec by name and date, never by path.

### Approvals

Three of this plan's edits fall under this repository's `AGENTS.md` "Never
do" list and need explicit human approval recorded before the task that
makes them: the `.pre-commit-config.yaml` edit (linter configuration), the
`node` line in `CONTRIBUTING.md` (repo-root Markdown), and the two
`docs/**/AGENTS.md` rewrites (agent instruction files). They are two decide
points in the plan's review brief — the first two share one — each with a
default of "approved", and the human's answers in `dialogue.md` are the
record. The `SKILL.md` and `README.md` edits are the plan's ordinary work.

## Old values this plan contradicts

The plan writes an `O` row for each, before its passages, in the shape
`roles/sekkei.md` sets; the counts below were measured on `main` at
2026-09-11 with `grep -c`, and a residual above them after the plan is the
first thing to place.

| Needle | Count on `main` (SKILL.md / README.md / c1d2) | Where it must be gone, or why it may stay |
| --- | --- | --- |
| `add only around it` | 1 / 0 / 1 | `skills/kisou/SKILL.md`: gone (P9). `docs/design/c1d2-kisou.md` carries it once and is T1's to update, not the plan's; it may stay through the run. |
| `layer-B only` | 1 / 0 / 0 | `skills/kisou/SKILL.md`: gone (P4). |
| `still a refresh target` | 1 / 0 / 0 | `skills/kisou/SKILL.md`: gone (P4). |
| `the type path table plus` | 1 / 0 / 0 | `skills/kisou/SKILL.md`: gone (P5). |
| `rename the original to` | 1 / 0 / 0 | `skills/kisou/SKILL.md`: gone (P8). |
| `backs the file up to` | 0 / 1 / 0 | `skills/kisou/README.md`: gone (section 3). |
| `only for clang + CMake` | 1 / 0 / 0 | `skills/kisou/SKILL.md`: gone (P2 rewords it to "only for a clang + CMake project", which this needle does not match); the README's "for clang + CMake projects" is a different phrase and stays. |
| ``(`setup` / `run` /`` | 1 / 0 / 0 | `skills/kisou/SKILL.md`: gone (P3); the Step 2 list of the six slots is a different sentence and stays. |
| `keeps this non-destructive` | 1 / 0 / 0 | `skills/kisou/SKILL.md`: gone (P8). |
| ``` `<...>` free-text** (e.g. ``` | 1 / 0 / 0 | `skills/kisou/SKILL.md`: gone (P11); the phrase wraps in the file, and this needle is the part on one line, spanning the point P11 changes. |

The sweep covers `skills/kisou/**` and `docs/design/c1d2-kisou.md`; the
files the plan does not touch are swept first.

## Requirements

What T1 writes, from this spec and the dialogue. Kanri rules on the
classification; requirement and ADR items go to the human.

- **req-1a2b**, two bullets under Required behavior: (a) the doc-system
  half of a migrate — which files are kisou-managed, which sections are
  missing or diverged, where an added section lands — is decided by a
  deterministic tool shipped with the skill, and its numbered report is the
  proposal, never a reading of the files; (b) migrate presumes `node`
  (22 or later) for that half and, without it, stops that half and says so
  rather than substituting a reading.
- **An ADR amending decision-281f** (fixed inputs 2 and 8): the
  fall-through for a file no fingerprint matches is "leave alone and
  report"; `.bak`-and-rewrite is done only on the user's naming the file;
  the doc-system comparison is the instrument; the fingerprint is the
  expanded H1. Options considered: keep `.bak` as the fall-through (Q-1 A),
  drop the `.bak` path entirely (Q-1 C), a per-type fingerprint list
  (Q-2 A), a repository-local check (Q-7 A), prose-only migrate with a
  check-only script (Q-8 B), a script that handles layer B (Q-8 C), an
  `apply` without partial acceptance (Q-9 C).
- **An ADR on ownership** (fixed input 7): the template is the source of an
  installed doc-system copy; byte equality with the expanded template is
  the invariant; a copy is never edited directly; a wrap-only difference is
  a divergence. Options considered: the copy may lead and the template
  catches up (Q-6 B); case by case (Q-6 C).
- **design-c1d2**: the Shape section gains that the skill ships one
  executable and what it decides; the Modes paragraph's "existing
  doc-system → leave intact, add only around it" and "a present
  real-content file → `.bak` + fresh write" become what fixed inputs 2 and 5
  say; the Refresh section gains this run's measurement once the report
  exists (T2), and its sentence "Every migrate on **this** repository offers
  the script slots `scripts/` lacks — `setup`, `run`, `build`, `test`, and
  `tidy`" loses `tidy`, which fixed input 6 stops offering here; the "How
  the bundle's own Markdown is verified" list gains the hook.
- **Six issues** move to `docs/issues/resolved/` at T2, each with its
  resolution: e19f, 2bf9, f50d, f623, afed, acc0. issue-2bf9 and issue-e19f
  close on the dogfood's observation, issue-f623 on test case 5, as their
  own text requires.

## What the plan must contain

- **Global Constraints**: this repository's `AGENTS.md` rules (lint the
  changed paths, commit by explicit path, the `Co-Authored-By` trailer, no
  edits to agent instruction files or linter configuration without the
  recorded approval above); the model families from the **effective**
  `tanto.json` — the personal overlay on the template's defaults, which are
  `implementer` sonnet, `reviewer` opus, `drafter` opus, `escalation` opus,
  `default` sonnet — as the plan's author reads them; the `$KISOU`
  and `$TANTO` conventions; the statement that contract rule 11 does not
  apply (the plan edits `skills/kisou/`, ledger R-1) and that a role may be
  started or replaced at any boundary; no worktree, the shared branch
  `kisou-refresh`.
- **Three batches**, three tasks each:
  - **A — the instrument.** (1) expansion, the target set, the fingerprint,
    and the fence-aware section split, with tests 1, 3, 7; (2) `check` — the
    item kinds, the diff, the notes, the ordering, the exit codes — with
    tests 2, 4, 6, 8's first half; (3) `apply --items` and the insertion
    position, with tests 5, 6's second half, 8's second half, 9. Delivers
    the script and its tests green under
    `mise x node@22 -- node --test 'skills/kisou/scripts/*.test.js'` (the
    glob, issue-235b), biome clean.
  - **B — the text.** (4) `SKILL.md` P1–P11 as passage blocks with their
    `O` rows and anchors; (5) `README.md`'s three places; (6) a
    sweep-and-check task: run `check` on this repository's seven copies and
    record the two expected items and their diffs verbatim in the batch
    report — the measurement the dogfood's expectation is pinned to.
    Delivers the skill text level with the spec, the `description` line
    loading as YAML.
  - **C — this repository.** (7) the dogfood: the migrate run, the two
    acceptances, the "before" and "after" of the hook's command; (8) the
    hook in `.pre-commit-config.yaml`, a real YAML load of the file, and
    the hook run **by id over all files** —
    `uv tool run pre-commit run kisou-doc-system-check --all-files` — since
    `scripts/lint.sh` on the changed path alone would skip it (the config
    file does not match the hook's own `files:` pattern), and one line in
    `CONTRIBUTING.md`'s Prerequisites naming `node` (22 or later) as what the
    hook runs — a repo-root Markdown edit, approved in the same decide point
    as the hook (Q-11 c1); (9) the dogfood report. The order 7 → 8 → 9 is
    load-bearing: the commit that adds the
    hook runs it, and it passes only on a level tree. Delivers a level tree
    with the check wired.
- **The Verify step of a task that carries passages** (4, 5, 8) is one
  invocation of
  `node "$TANTO/scripts/passage-check.js" verify --plan <path> --task <N>`.
  A task with no passage block gets `verify` as a no-op — it prints
  `task N: no passages` and exits 0, measured at this spec's review — so the
  **whole-file tasks** (1, 2, 3, the JavaScript; 7, the dogfood; 9, the
  report) name the test command in the glob form as their Verify, together
  with the content grep or exit code that shows their deliverable exists;
  the JavaScript files are described by the tests they must pass, not by
  passages; the hook is a passage into `.pre-commit-config.yaml` with the
  file's own YAML load as its anchor.
- **How a batch is verified**: section Verification below, copied into the
  plan.
- **Self-Review** states the largest task's line and step counts and names
  task 6 and task 7 as sweep-and-check shapes.
- Reports and prompts follow the tanto templates; the plan names nothing
  else about them.

## Verification

At every batch boundary, on the whole tree:

- `mise x node@22 -- node --test 'skills/kisou/scripts/*.test.js'` — the
  **quoted glob**, never the directory form, which fails with
  `MODULE_NOT_FOUND` on this host (issue-235b, measured 2026-09-10 and again
  at this spec's review); the floor is the pinned version, and the run's
  `node --version` line is in the batch report (from batch A on).
- `./scripts/lint.sh <changed paths>` — biome on the `.js` files,
  markdownlint on `skills/kisou/SKILL.md` and `README.md` (the templates are
  ignored by configuration and are not touched), the frontmatter hook,
  yamllint and `check-yaml` on `.pre-commit-config.yaml` (batch C).
- A real YAML load of `SKILL.md`'s frontmatter:
  `uv run --no-project --with pyyaml python -c "import yaml,io; yaml.safe_load(io.open('skills/kisou/SKILL.md',encoding='utf-8').read().split('---')[1])"`,
  and `! sed -n 's/^description: //p' skills/kisou/SKILL.md | grep -q ': '`
  — negated, because `grep -c` printing `0` exits 1 and a Verify read by
  exit code would call the pass a failure (from batch B on).
- `node "$TANTO/scripts/passage-check.js" diff --plan <plan path> --base <merge base>`
  — both options are required — every passage block applied exactly, every
  `O` needle at its stated count (from batch B on).
- `node skills/kisou/scripts/doc-system-check.js check --docs docs --case snake_case`
  exits **1 with two items** after batch A and batch B, and **0** after
  batch C; the change of that value is batch C's acceptance test.
- The content greps: `grep -c 'doc-system-check' skills/kisou/SKILL.md`
  ≥ 2 and `skills/kisou/README.md` ≥ 1 after batch B;
  `grep -c 'kisou-doc-system-check' .pre-commit-config.yaml` = 1 after
  batch C.

## Open for the human at the review

1. The `.pre-commit-config.yaml` edit (the hook) and the one-line `node`
   prerequisite in `CONTRIBUTING.md` — approval to edit linter
   configuration and repo-root Markdown. Default if unanswered: approved.
2. The rewrite of `docs/notes/AGENTS.md` and `docs/reports/AGENTS.md`
   through the dogfood — approval to edit agent instruction files. Default
   if unanswered: approved.
3. The two ADRs in Requirements are the human's at T1, through Kanri; the
   review asks nothing about them now.

## Out of scope

- Mechanizing the layer-B refresh (Q-8 C): OPTIONAL gating, `TEMPLATE FILL`,
  the free-text test stay prose.
- Heading-rename detection (issue-9ab0).
- Any change to a template's body: the six issues need none, and the
  dogfood's two items come from the copies, not the templates.
- The dotrepo side; nothing here is a pre-commit opinion for a downstream
  project — the hook is this repository's own, and downstream repositories
  reach the check through `kisou migrate` or by wiring `$KISOU` themselves.
- Removing the `.bak` path (Q-1 C).
- issue-f2c4, issue-3c7a, issue-5e9c — the order after this topic is the
  spec inputs' advisory 5.
- A `--json` output for the script: no consumer exists.

## Answers to the spec inputs

- **I-1** — the six issues are fixed inputs 1–9's subject; e19f by fixed
  inputs 3 and 8, 2bf9 by 4, f50d by 5, f623 by the insertion rule in
  section 1, afed by 6, acc0 by 7 and 9. The two tanto measurements are
  Kanri's: issue-9a68 during this spec phase (two `fable` sessions at
  once), issue-5a81 through the personal `tanto.json` overlay, which this
  spec changes nothing for.
- **Advisory 1** — every issue file was read whole before Q-1.
- **Advisory 2** — the plan edits `skills/kisou/` and this repository's own
  hook and copies; rule 11 does not apply; the README is reviewed after
  `SKILL.md` (section 3).
- **Advisory 3** — the dotrepo boundary stands; see Out of scope.
- **Advisory 4** — no template heading is renamed; no template body is
  touched; the instrument keys on headings exactly as the rule says, and
  the insertion rule is written against that.
- **Advisory 5** — noted in Out of scope.

## Deferred items

- **Heading-rename detection** in the instrument — a renamed template
  heading lands downstream as an `add` plus an author-section note, which
  is the behavior decision-89da chose to live with. issue-9ab0 stays open.
- **A machine-readable report** (`--json`) — deferred until something
  consumes it.
- **Running the check on downstream repositories** — a downstream
  repository wires `$KISOU` into its own hook if it wants the invariant
  enforced; kisou does not install hooks, and this plan does not change
  that.

## The reviews this spec has had, and what each found

**Spec review, 2026-09-11** (`.superpowers/sdd/kisou-refresh/spec-review.md`,
a read-only reviewer on `opus`): 24 findings — 1 blocker, 11 major, 8 minor,
4 nit — against a spec whose nine needle counts, seven old-text quotes, and
dogfood expectation all reproduced exactly. Sekkei's rulings:

- Accepted and folded in: the test command's glob form (issue-235b); the
  single authority per file (P7 now replaces the "Compare the file's
  structure" sentence); who writes an absent doc-system (the instrument's
  `create` items); proposal numbering in full scope (a contiguous block at
  the end, offset kept by kisou); a missing docs root (seven creates); BOM;
  duplicate headings; `apply`'s recompute-by-identity; the Verify step of
  whole-file tasks; batch C's hook run by id and its load-bearing order;
  the two unrunnable commands; the fence, frontmatter, setext, and preamble
  rules; the root's own missing-heading note; the `--case` derivation
  guard; design-c1d2's `tidy` sentence; the Q-2 citation; P8's indent; the
  effective `tanto.json`; the hook's two consequences; the whole-section
  diff.
- Rejected in part: finding 5's claim that scaffold requires the
  `issues/{open,deferred,resolved}/` skeleton — `SKILL.md` Step 3 (scaffold)
  says the opposite, a writer creates a status directory on demand; the
  spec now says nobody creates them.
- Put to the human as scope (findings 2, 3, 13) and answered at Q-11 with
  Sekkei's recommendations: P4 reworded against the five-file tally, the
  tally unchanged; P11 added for issue-2bf9's own sentence, with its `O`
  row; and `node` named in `CONTRIBUTING.md`'s Prerequisites by batch C's
  task 8, under the hook's decide point.

## Shoroku candidates from this spec work

For Kanri's adoption, not restated from the sections above:

- **Measured 2026-09-11**: the drift issue-acc0 counted (6 and 4 lines) is
  rewrapping only; content is identical. The direction question the issue
  left open was therefore moot for these two files, and was decided anyway
  (fixed input 7) because the next drift will not be.
- **Measured 2026-09-11**: none of the seven doc-system templates carries
  an `OPTIONAL` marker or a `TEMPLATE FILL` block; this is what lets the
  instrument skip the layer-B syntax entirely.
- **Rejected**: a typographic free-text rule (bare `<...>` versus
  backticked), because `docs/AGENTS.md`'s type path table and the
  frontmatter examples are bare notation.
- **Rejected**: a repository-local Python check (`scripts/check_kisou_copies.py`),
  because it would not travel with the skill; the human asked whether it
  would, which is what turned the check into the instrument.
- **Observed**: the estimate that decided A' over A — about a third of
  `passage-check.js` — rested on the doc-system templates' having no
  gating syntax; the plan's Self-Review records the actual line count for
  the next estimate.
- **Process**: every decision reached `dialogue.md` before it reached this
  document, as issue-5e9c asks; the design was presented in four sections,
  each approved before the next.
