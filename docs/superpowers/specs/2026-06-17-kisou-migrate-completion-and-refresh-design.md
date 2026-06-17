# kisou: migrate-mode completion and template refresh

**Goal:** Make kisou's **migrate** mode three things at once — and resolve
issues `5e7f`, `b2a4`, `e8f9`, and `c6d7` together, since all four live on the
same migrate surface:

1. **Detect partial state** in the doc-system instead of treating it as
   all-or-nothing (`e8f9`).
2. **Offer scripts the project lacks** instead of silently treating an absent
   script as a declined one (`b2a4`).
3. **Refresh kisou-managed files toward the current template** so a repo
   scaffolded by an older kisou can pick up template changes (`5e7f`), with the
   merge granularity pinned down (`c6d7`).

These reshape migrate into three layers — **confirm detected facts → fill gaps
→ refresh toward template**. No new mode, no version stamp, no change to scaffold
mode.

## Context (current state)

`skills/kisou/SKILL.md` Step 3 (migrate) does pre-flight detection (dirs, case,
scripts, OS, doc-system) by enumerating real FS entries — never `test -d` probes
(`e3a1` / decision `4f5a`). It then, per artifact:

- **Absent** → create (filled), as in scaffold.
- **Present** (`README` / `AGENTS.md` / `CLAUDE.md`) → branch on shape:
  - **Stub-shaped** (template heading set, or `<...>` placeholders remain) →
    section/block merge, show diff, insert only what is **missing**.
  - **Real content** (custom headings/prose, no `<...>`) → rename to `.bak` +
    write fresh, author re-grafts by hand (`7d5f`).
- **`scripts/`** → add only the *requested* scripts; never overwrite.
- **doc-system** → write the bundle if absent; if present, leave intact.

Three gaps remain:

- **Doc-system detection is binary** — `docs/AGENTS.md` + per-type files present
  ⇒ "installed"; absent ⇒ "install everything." Partial states (status subdirs
  exist but `AGENTS.md` files don't; or `AGENTS.md` present but no per-type
  files) are mis-classified (`e8f9`). dotskills itself was in such a partial
  state before its first migrate.
- **Scripts detection expresses only facts, not intent** — an absent script is
  never offered. A user wanting to *add* `lint` to a repo that lacks it gets no
  prompt (`b2a4`).
- **No refresh path** — the stub-shaped branch only inserts what is *missing*.
  A kisou-managed file whose template content has since *changed* (e.g. the
  `543b` rewording of `docs/AGENTS.md`) is never updated; the project drifts
  from the current template forever (`5e7f`). The exact merge granularity for
  the stub path (auto-merge vs always ask) was never pinned (`c6d7`).

## Decisions

### D1 — Stateless, no version marker (`5e7f`)

Refresh is driven by **structural comparison against the current template**, not
by a stamped `kisou-template-version`. Rationale: a stamp adds persistent state
to every generated project, demands a bump on every template change, and still
needs content comparison to say *what* changed — and the already-deployed repos
that most need upgrading (dotskills included) carry no stamp, so they could not
be recognized anyway. Stateless comparison works on any kisou-shaped repo
regardless of scaffold-time version and matches kisou's thin-shell philosophy.
(`5e7f` option (a) rejected; option (b) adopted.)

### D2 — Refresh is a sub-case of the Present/stub branch, not a new mode

Migrate gains no third mode and no new trigger. "Pick up template changes" is
just the stub-shaped Present branch extended from *insert-what's-missing* to
*also refresh-what-diverged*. Re-running `kisou migrate` on a kisou-managed repo
is the upgrade path; SKILL.md states this explicitly.

### D3 — Doc-system detection becomes `none` / `partial` / `full` (`e8f9`)

Detection enumerates each doc-system artifact individually: `{docs}/AGENTS.md`
and each `{docs}/<type>/AGENTS.md` (×4).

- **none** → install the full doc-system (current behavior).
- **full** → leave intact, but it becomes a refresh target under D5.
- **partial** → list what is present vs missing, propose adding **only the
  missing** pieces. Surface any non-standard subdirectory (e.g.
  `docs/superpowers/`, a non-standard `docs/issues/in-progress/`) as **kept by
  default**, and note it is **exempt from the `<id>-<slug>` naming rules**
  (`543b`). Status subdirs (`open`/`deferred`/`resolved`) are created on demand,
  not part of the present/missing tally.

Detection still enumerates real FS entries, never `test -d` probes (`e3a1`).

### D4 — Scripts split into "detected" + "add anything else?" (`b2a4`)

The migrate scripts question becomes two parts:

1. **Detected** — auto-selected from disk, presented pre-checked for
   confirmation (current behavior).
2. **Add anything else?** — an explicit prompt listing the not-yet-present slots
   (`setup` / `run` / `build` / `test` / `lint` / `tidy`) so the user can opt
   into a script the repo lacks.

`dirs` keeps its existence-based behavior unchanged: it is a **fact** about the
project (an absent `src/` means no source dir), not an **intent**, so absence is
not a prompt. SKILL.md notes this asymmetry in one line.

### D5 — Refresh granularity: additive + fixed-text updates only (`c6d7`)

For a Present file recognized as **kisou-managed** (see D6), compare its current
structure against what the current template would produce *given the detected
inputs*, and propose — always as numbered items, never silently auto-merged:

- **Missing fixed section / block** → propose adding it (template-filled).
- **Diverged fixed-text section** — a section whose template body contains **no
  `<...>` free-text** (e.g. AGENTS `## Language`, the `docs/AGENTS.md` document-
  management rules including the `543b` wording) → show a diff and propose
  replacing the stale body.
- **Free-text section** — one whose template body has `<...>` placeholders for
  the author to fill (e.g. README `## Tech stack`, CONTRIBUTING `## Code style`)
  → **never flagged**; the author owns it and staleness can't be told from an
  intentional edit.
- **Author-added section** (not in the template) → **never proposed for
  removal**. Refresh is additive/updating only, never destructive.

This is the `c6d7` answer: granularity is section/block; no auto-merge without
approval; the free-text-vs-fixed-text line is what bounds false positives. The
existing partial-accept interaction (`OK` / `2 と 5 だけ` / `3 はやめて` /
`全部やめ`) carries the proposal.

### D6 — "kisou-managed" fingerprint

A Present file qualifies for D5 refresh (rather than the `7d5f` real-content
`.bak` path) when it shows a template fingerprint:

- `CLAUDE.md` — the `@AGENTS.md` pointer + "All project instructions live in
  `AGENTS.md`" body.
- `AGENTS.md` — the `@CONTRIBUTING.md or read …` pointer line.
- `docs/AGENTS.md` — the four-type path table + "Document management" heading.
- Otherwise — heading set substantially matches the template (the existing
  stub-shaped test).

A Present file lacking any fingerprint is **real content** and keeps the `7d5f`
path unchanged (rename to `.bak` + fresh write, author re-grafts).

## Changes

All edits are prose/instructions; the template *files* under
`skills/kisou/templates/` are unchanged — they serve as the comparison source.

### 1. `skills/kisou/SKILL.md` — Step 3 (migrate) detection list

- Replace the binary doc-system bullet with the three-state rule (D3): enumerate
  `{docs}/AGENTS.md` and each `{docs}/<type>/AGENTS.md`; classify
  none/partial/full; on partial, add only missing pieces and surface
  non-standard subdirs as kept + naming-exempt.
- Keep the FS-enumeration / no-`test -d` caveat (`e3a1`).

### 2. `skills/kisou/SKILL.md` — Step 2 + migrate scripts question

- Split the scripts selection in migrate mode into "detected (confirm)" +
  "add anything else? (absent slots)" per D4.
- Add the one-line `dirs`-is-a-fact-not-intent rationale.

### 3. `skills/kisou/SKILL.md` — Present branch (the core change)

- Extend the **stub-shaped** sub-case into the D5 refresh logic: define the
  kisou-managed fingerprint (D6), the additive + fixed-text-update comparison,
  the free-text / author-section exemptions, and that proposals always go
  through numbered partial-accept.
- Leave the **real-content** sub-case (`7d5f` `.bak` path) unchanged, now reached
  only when no fingerprint matches (D6).

### 4. `skills/kisou/SKILL.md` — relationship / framing

- State that re-running `kisou migrate` is the template-upgrade path (D2): no new
  mode or trigger.
- Review `## Prohibited actions` for consistency (refresh must still show diffs
  and never overwrite without approval — already covered, confirm wording).

### 5. `skills/kisou/README.md`

- After the SKILL.md edits, review for drift (per `AGENTS.md`): migrate is now
  completion- and refresh-aware; mention the re-run-to-upgrade path if README
  describes migrate behavior.

### 6. Project docs (this repo)

- **`docs/design/c1d2-kisou.md`** — update the Modes section: migrate doc-system
  detection is three-state; Present/stub branch refreshes diverged fixed-text
  sections, not just missing ones; scripts question is two-part.
- **New `docs/decisions/<id>-stateless-migrate-refresh.md`** — record D1/D2/D5/D6
  (stateless structural refresh, additive + fixed-text granularity, no version
  stamp). Reference `5e7f` / `c6d7`.
- **Issue resolutions** — append a Resolution to `5e7f`, `b2a4`, `e8f9`, `c6d7`
  and move each to `docs/issues/resolved/` once implemented.

## Out of scope

- **Template file content** under `skills/kisou/templates/` — unchanged; used
  only as the comparison source. (If implementation finds the free-text /
  fixed-text line genuinely ambiguous for some section, clarifying *that one
  section's* template wording is in scope; wholesale template edits are not.)
- **`src/` / `tests/` / `scripts/` body content** — never touched; refresh
  covers only kisou-managed Markdown (layer-B files + doc-system `AGENTS.md`s).
- **scaffold mode** — unchanged.
- **A version stamp / manifest** — explicitly rejected (D1).
- **Removing author content** — refresh never proposes deletions (D5).
- **`dirs` intent prompt** — `dirs` stays existence-based (D4).

## Verification

- Re-read the edited SKILL.md migrate section and confirm the three layers read
  coherently and the Present branch's two sub-cases (fingerprint → refresh;
  no-fingerprint → `7d5f` `.bak`) are unambiguous.
- Confirm `e3a1` (FS enumeration), `543b` (non-type subdir naming exemption), and
  `7d5f` (real-content `.bak`) wording stays consistent — no regressions.
- Dry-run the doc-system three-state rule mentally against dotskills' own
  pre-migrate partial state (status subdirs present, `AGENTS.md`s absent) and
  confirm it now classifies as `partial` and proposes only the missing
  `AGENTS.md` files.
- After SKILL.md edits, review sibling `skills/kisou/README.md` for drift
  (per `AGENTS.md`).
- Confirm the new decision record and the four issue resolutions cross-reference
  each other correctly.
