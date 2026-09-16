# The tanto project config Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give `tanto` a third config source, `<cwd>/.claude/tanto.json`,
overlaid field by field on the personal file, and make each role carry a
project-level effort into project-scope agent definitions under
`<cwd>/.claude/agents/`, which the harness prefers over the user-scope copy of
the same name.

**Architecture:** Two batches. Batch A lands the **sources**: the third layer
in `scripts/reading.js` with its `--project-config` switch and its file-named
warnings, the config section of `SKILL.md`, Kanri's two config sites, the
README's two bullets, and the consistency note's §16 switch count. At that
boundary the definitions paragraphs still describe one scope, and this
repository ships no project file to exercise the other, so the tree is
consistent. Batch B lands the **definitions**: the `<scope>` slot in
`templates/agent.md`, the two-pass write in `SKILL.md`, the project half of
the count line at both sites, the README's sentence on the generated files,
the note's §8 fifth line, and a sweep-and-check task that runs the spec's
whole Verification section.

**Tech Stack:** Markdown (the skill's contract, role files, README, and the
`docs/notes/` consistency note); Node with no dependencies and `node:test` for
`scripts/reading.js` and its suite; `mise` to pin the test run to Node 22;
`node "$TANTO/scripts/passage-check.js"` as the plan's own instrument; Git
Bash as the shell.

**Spec:** `.tanto/tanto-project-config/spec-draft.md`, committed by this
topic's Keikaku at
`docs/superpowers/specs/2026-09-15-tanto-project-config-design.md`. The plan
argues from the spec; executors read both.

## Global Constraints

Every task's requirements implicitly include this section.

### This repository's rules

From `AGENTS.md` and `CONTRIBUTING.md`, which bind every task here:

- **American English** for code, log and error messages, comments, docs,
  commits, branch names, PRs, and issues.
- **Run the linter on the changed paths before committing.** From the repo
  root, `./scripts/lint.sh <paths>` — the paths relative to the repo root.
  Several hooks auto-fix (markdownlint `--fix`, biome); a fix also fails the
  run with the change left unstaged, so re-stage and run it again.
- **Commit by explicit path** with `git commit --only <paths>`; the index is
  shared with other sessions. New files need `git add <paths>` first, because
  `--only` cannot pick up an untracked file. Never `git add -A`, `git add .`,
  `git add -u`, a bare `git commit`, or `git commit -a`.
- **End every commit message with a `Co-Authored-By:` trailer** naming the AI
  agent that made the commit, for example
  `Co-Authored-By: Claude <noreply@anthropic.com>`.
- **Never** edit agent instruction files, repo-root Markdown, or
  linter/formatter config without explicit human approval; never amend a
  published commit; never push to `origin/main` without explicit human
  approval; never bypass a commit or push hook (`--no-verify`, a
  `core.hooksPath` override) without explicit human approval.
- **After editing a skill's `SKILL.md`, review its sibling `README.md` for
  drift.** Task 4 and Task 7 are where this plan does that.
- Project context documents under `docs/` follow `docs/AGENTS.md`. This plan
  edits exactly one file there, `docs/notes/tanto-consistency-checks.md`, and
  files no new document; the T2 list at the end names what Kanri files later.

### The shell

**Every fenced command in this plan runs in Git Bash**, not PowerShell and
not `cmd`. `$TANTO` is the tanto skill's own directory, which the harness
names when it invokes the skill. In this repository the skill is linked into
the working tree at `skills/tanto`, so `TANTO=skills/tanto` is the form every
command in this plan spells. Shell state does not persist between tool
calls, so **`$TANTO` is set in the same tool call as any command that names
it**:

```bash
TANTO="skills/tanto"
node "$TANTO/scripts/passage-check.js" lint --plan docs/superpowers/plans/2026-09-15-tanto-project-config.md
```

An unset `$TANTO` makes every one of these commands read a path at the
filesystem root. The same reminder belongs in each batch prompt: Jisso needs
it as much as Keikaku does.

Every `git`, `node`, `mise`, and `./scripts/lint.sh` command runs from the
repository root, `C:/Users/0000105523/devel/dotskills`. `passage-check.js`
resolves every passage path and runs every anchor command relative to the
process's working directory, so a command run from anywhere else reports
false failures.

### The models this run's own dispatches use

Resolved from `.claude-priv/tanto.json` overlaid on
`skills/tanto/templates/tanto.json`. The personal file holds exactly
`{"subagents": {"shoroku": "fable"}}` — a bare string, so it sets `shoroku`'s
model and leaves its effort to the layer below. These are the concrete values,
not a pointer to the file:

| Session | Model | Effort | | Subagent kind | Model | Effort |
| --- | --- | --- | --- | --- | --- | --- |
| `kikaku` | `fable` | `xhigh` | | `task.implement` | `sonnet` | `high` |
| `kanri` | `sonnet` | `high` | | `task.escalate` | `opus` | `high` |
| `sekkei` | `fable` | `high` | | `task.review-spec` | `opus` | `medium` |
| `keikaku` | `sonnet` | `high` | | `task.review-quality` | `opus` | `medium` |
| `jisso` | `sonnet` | `xhigh` | | `plan.draft` | `opus` | `high` |
| `kaiseki` | `fable` | `xhigh` | | `plan.review` | `fable` | `high` |
| `hosa` | `sonnet` | `medium` | | `plan.coldread` | `fable` | `high` |
| | | | | `spec.review` | `opus` | `high` |
| | | | | `branch.review` | `fable` | `high` |
| | | | | `brief.write` | `fable` | `high` |
| | | | | `shoroku` | `fable` | `medium` |
| | | | | `default` | `sonnet` | `medium` |

The ceiling map resolves to `kanri` and `jisso` at `2 x 65000` each,
`presence_minutes` `60`, and `share_threshold` `150000`. Every dispatch names
a `model` from that table; none omits it.

### The shared tree

All roles share one working tree and one branch; there is no worktree. **A
modification in the shared tree that a session or its own subagent did not
make is not that session's to discard.** It is reported — a `task.implement`
subagent tells its role in one line, the role tells Kanri in one line — and
never run through `git checkout --` or `git clean` on the session's own
judgment. Only Kanri decides whether it is stray.

### Rule 11: the authority while this plan is in flight

This plan edits `tanto`'s own files, and the sessions that run it load the
working tree's copy of the skill, so a session started mid-plan reads whatever
is on disk at that moment. **While this plan is in flight, the authority for
the run's sessions is this plan's Global Constraints, Kanri's orders line, and
the batch prompts — not the role text on disk.** Kanri records that as a
ruling when the plan lands, so every batch prompt and any handover file carries
it. Kanri's own handover proceeds when it is due, and its successor takes the
authority ruling from the handover file rather than from the tree.

**The boundary from which a role may be started or replaced is the final one,
after Batch B.** Before it, no role is replaced and no further role is created,
with the two standing exceptions above: Kanri's own due handover, and a
Kaiseki, which is a Kanri ruling recorded as `R-n` and made with the
half-edited skill in view. The boundary is the final one because the config
section, the start line, the template, and the script must all agree together:
a role started between the two batches would read a `SKILL.md` whose sources
paragraph names three files while its definitions paragraph still describes one
scope.

### What the run's own sessions read

**This repository ships no project `.claude/tanto.json`**, and this plan does
not add one (spec Fixed input 5). The run's own sessions therefore read **one**
config file — the personal `$CLAUDE_CONFIG_DIR/tanto.json` — and write **one**
scope of definitions, the user-scope one, for the whole of this plan. That is
consistent with the half-edited skill at every point, because the second scope
has nothing to act on. The write path of section 2 is measured by the first run
in any repository that carries a project effort; the T2 list files that as an
issue.

`<cwd>/.claude/` exists in this repository and is empty. Nothing in this plan
writes into it, and no task's verification depends on its being empty beyond
what the passages themselves state.

### The whole-tree `O`-needle sweep

Every stop condition and Task 8 Step 5 that sweeps an `O` needle over the
whole tree runs it as
`grep -rc -F --exclude-dir=superpowers --exclude-dir=resolved -- '<needle>' skills docs`,
not a bare `skills docs` sweep. `docs/superpowers/` holds frozen specs and
plans that quote the old phrasing verbatim as history, and
`docs/issues/resolved/` holds a closed issue that does too; neither is a site
this plan missed. Every `O` block's "Nowhere else" claim below is a claim over
this swept set, not the literal whole repository; `O2.5`'s declared survivor
in `docs/decisions/03f9-*.md` is the one expected hit even within it, because
`docs/decisions/` is swept and that file is live, not frozen.

## Batches

### Batch A — the sources

**Tasks 1, 2, 3, 4.**

**Delivers:** the third config layer, end to end, everywhere the sources are
described. `scripts/reading.js` overlays a project file on the personal one,
takes `--project-config`, and names the file in every unknown-key warning;
`reading.test.js` covers the five cases of spec 3.4 and its two old assertions
carry the file; `SKILL.md`'s config section states the three files, the
three-layer overlay, the two `in <path>` phrases, and the two-file start line,
and its reading section and Artifacts table name `--project-config` and the
project config file; `roles/kanri.md` reads both files at a handshake and
enumerates both in its start line; the README's two bullets name the project
file; the consistency note's §16 alternation counts eight switches.

**Stop conditions** (every one of them met before Kanri rules the boundary):

- `./scripts/lint.sh` clean on each path the batch changed, named
  individually.
- `mise x node@22 -- node --test skills/tanto/scripts/reading.test.js` passes,
  with the version it resolved recorded in the batch report, and
  `mise x node@22 -- node --test skills/tanto/scripts/passage-check.test.js`
  passes.
- `node "$TANTO/scripts/passage-check.js" verify --plan <this plan> --task N`
  clean for N in 1, 2, 3, 4.
- `node "$TANTO/scripts/passage-check.js" diff` clean over the batch's
  commits.
- **A whole-tree sweep, not a sweep of the files the batch wrote:** every
  `O1.*` through `O4.*` needle is at its stated after-count over the swept set
  (Global Constraints), run as
  `grep -rc -F --exclude-dir=superpowers --exclude-dir=resolved -- '<needle>' skills docs`
  from the repository root, so a survivor in a file this batch did not touch
  is seen. The one needle expected to survive is `O2.5`'s, in
  `docs/decisions/03f9-*.md`, which the T2 ADR amends and this plan does not
  touch.
- `git status --porcelain` shows nothing beyond the batch's own commits.

**Role lifecycle at this boundary:** none. No role is started or replaced here
(see Rule 11 above); Kanri's own handover is the only movement that may occur.

### Batch B — the definitions

**Tasks 5, 6, 7, 8.**

**Delivers:** the project-scope definitions. `templates/agent.md` carries the
`<scope>` slot, rendered empty at user scope and as one clause at project
scope; `SKILL.md` describes the user-scope pass from the built-in and personal
layers and the project pass that follows it — write, removal, and the
self-ignoring `.gitignore` — carries the project half of the count line and
the two-scope visibility sentence, says "both scopes" in Resuming, widens Rule
6, and holds the two definitions rows in Artifacts; `roles/kanri.md` writes
the definitions of both scopes and prints the full count line; the README says
where the generated definitions go and that a `.gitignore` covers them; the
consistency note's §8 reads a project-scope definition when one exists; and the
spec's whole Verification section has been run and its output recorded.

**Stop conditions:**

- `./scripts/lint.sh` clean on each path the batch changed, named
  individually.
- `mise x node@22 -- node --test skills/tanto/scripts/reading.test.js` and
  `mise x node@22 -- node --test skills/tanto/scripts/passage-check.test.js`
  both pass.
- `node "$TANTO/scripts/passage-check.js" verify --plan <this plan> --task N`
  clean for N in 5, 6, 7, 8.
- `node "$TANTO/scripts/passage-check.js" diff` clean over the batch's
  commits.
- **A whole-tree sweep, not a sweep of the files the batch wrote:** every
  `O5.*` through `O7.*` needle is at its stated after-count over the swept set
  (Global Constraints), run as
  `grep -rc -F --exclude-dir=superpowers --exclude-dir=resolved -- '<needle>' skills docs`
  from the repository root.
- The consistency note's §8 lines run and their output recorded, including the
  new fifth line's fallback on a host with no project-scope definition — which
  is this host.
- Task 8's recorded output exists in the batch report: every grep of the
  spec's Verification section, with its command and its result.
- `git status --porcelain` shows nothing beyond the batch's own commits.

**Role lifecycle at this boundary:** **this is the boundary from which a role
may be started or replaced.** The config section, the start line, the template,
and the script agree from here on, so a session started now reads a coherent
skill.

## How a batch is verified

Kanri runs all of this at the boundary, in the repository root, in Git Bash.

**1. Lint on the changed paths, by name.** Never `--all-files`, never a
directory: the exact paths the batch's commits touched.

```bash
./scripts/lint.sh skills/tanto/scripts/reading.js skills/tanto/scripts/reading.test.js skills/tanto/SKILL.md skills/tanto/roles/kanri.md skills/tanto/README.md skills/tanto/templates/agent.md docs/notes/tanto-consistency-checks.md
```

Expected: every hook `Passed` or `Skipped` on those paths (the union of both
batches' — Batch A leaves `templates/agent.md` untouched and Batch B leaves
`scripts/reading.js` and its test untouched, and lint on an unchanged path is
harmless). A hook that auto-fixed leaves the change unstaged and fails the
run; re-stage and run again.

**2. The two Node suites, on the pinned Node.** Node 22 is the floor the skill
assumes; `mise` pins the test run to it, and the resolved version goes in the
batch report.

```bash
mise x node@22 -- node --version
mise x node@22 -- node --test skills/tanto/scripts/reading.test.js
mise x node@22 -- node --test skills/tanto/scripts/passage-check.test.js
```

Expected: a `v22.*` line, then `# fail 0` from each suite.

**3. The consistency note's §8 lines.** Run the fenced block of
`docs/notes/tanto-consistency-checks.md` §8 as it stands at that boundary —
four lines before Task 7, five after.

Expected, in order: `['argument-hint', 'description', 'name']` then `ok`;
`tanto.json ok 7 12`; `['description', 'effort', 'name']` then `ok`;
`['description', 'effort', 'name'] high`; and, from Task 7 on, the fifth
line's fallback, `no project-scope definition on this host`, because this
repository ships no project file.

**4. The greps of the spec's Verification section.** Copied from the spec
unchanged; Task 8 owns them as its deliverable and Kanri re-runs them here.

```bash
grep -c -- '--project-config' skills/tanto/SKILL.md skills/tanto/scripts/reading.js
grep -c 'unknown key ceiling.<name> in <path>, ignored' skills/tanto/SKILL.md
grep -c 'in <path>, ignored' skills/tanto/SKILL.md
grep -c '<scope>' skills/tanto/templates/agent.md
grep -c 'both scopes' skills/tanto/SKILL.md
grep -c 'Read both' skills/tanto/roles/kanri.md
grep -c 'project: <p> current' skills/tanto/SKILL.md skills/tanto/roles/kanri.md
node skills/tanto/scripts/reading.js 2>&1 | head -n 1 | grep -oE '\-\-role|\-\-presence|\-\-backstop|\-\-share|\-\-now|\-\-config|\-\-project-config|\-\-settings' | sort -u | wc -l
```

Expected, after Batch B: `2` for `SKILL.md` and `1` for `reading.js`;
then `1`; then `2`; then `1`; then `1`; then `1`; then `1` and `1`; then `8`.
Kanri also runs this section at Batch A's boundary, where six of the eight
already read their final value — Task 3 lands both `--project-config` sites
in `SKILL.md` and Task 1 lands `reading.js`'s, Task 2 lands both
`in <path>, ignored` phrases, and Task 4 lands `Read both` — but `<scope>`
and `both scopes` read `0`, and the `project: <p> current` pair reads `0` and
`0`, because those are Task 5's and Tasks 6/7's; the fence still exits `0`
either way, since `wc -l` is its last command. Each of the two
`in <path>, ignored` phrases is written on **one** line, and
the passages keep them so: a reflow that wraps one leaves the text right and
this check red.

**5. The boundary check.**

```bash
TANTO="skills/tanto"
BASE="$(git log --diff-filter=A --format=%H -1 -- docs/superpowers/plans/2026-09-15-tanto-project-config.md)"
node "$TANTO/scripts/passage-check.js" diff --plan docs/superpowers/plans/2026-09-15-tanto-project-config.md --base "$BASE"
```

Expected: clean. `$BASE` is the commit that added this plan. Under R-9, this
plan lands on its own branch, cut from `main` at Kanri's "checkout free"
line, and the spec and the plan are its first two commits — the same shape
every earlier topic's plan used, so `main..HEAD -- <the plan's own passage
files>` would also resolve to this same commit; the plan-commit formula is
kept because it needs no path list and holds unchanged whether the branch is
merged yet or not. This is the check that says the committed tree is what
the plan's passages describe, and it is the one Kanri rules the boundary on.

**6. The M2 probe, once, by the whole-branch reviewer.** Not a batch step: in
a scratch directory **outside this repository**, write
`.claude/agents/tanto-default.md` whose description carries the project-scope
marker clause of spec 4.4, run `claude -p --model haiku` asked to print
`tanto-default`'s description from its system prompt, and expect the marker.
The report names the Claude Code version it ran on.

---

## Task 1: `scripts/reading.js` and its suite — the third layer

**Files:**

- Modify: `skills/tanto/scripts/reading.js`
- Test: `skills/tanto/scripts/reading.test.js`

**Interfaces:**

- Produces: `loadCeiling(explicitConfig, explicitProjectConfig)` — a second
  positional parameter, the project file's path, defaulting to
  `path.join(process.cwd(), ".claude", "tanto.json")`. Its return value's
  `path` field becomes `paths`, an object `{ personal, project }` of the two
  resolved paths. No caller inside `reading.js` reads either, and the script
  prints no config path; the field exists for a module caller and for the
  tests.
- Produces: `projectConfigPathOf(explicit)` — module-internal, not exported.
- Produces: the `--project-config <path>` switch on both forms of the command
  line, and the warning phrase
  `unknown key ceiling.<name> in <path>, ignored`, which `SKILL.md`'s config
  section quotes in Task 2 and must match byte for byte.

### The old values this task contradicts

**O1.1** `then the personal file. Returns` — `skills/tanto/scripts/reading.js` 1, gone by P1.3. Nowhere else in the swept set (Global Constraints). The needle is the `loadCeiling` doc comment's continuation line, quoted without its ` * ` markers because those carry no backtick and the needle must not either.

**O1.2** `[--config <path>] [--settings <path>]` — `skills/tanto/scripts/reading.js` 1, gone by P1.1. Nowhere else in the swept set (Global Constraints). The needle spans the point `--project-config` is inserted at; the second form's `[--config <path>]` alone would survive the same edit.

**O1.3** `unknown key ceiling.${name}, ignored` — `skills/tanto/scripts/reading.js` 1, gone by P1.3. Nowhere else in the swept set (Global Constraints). This is the phrase the script writes on stderr; `SKILL.md`'s copy of it is O2.6, a different spelling of the same entity, and it goes in Task 2.

**O1.4** `, ignored$/m` — `skills/tanto/scripts/reading.test.js` 2, gone by P1.6, which rebuilds both assertions as `new RegExp` over the fixture's own path. Nowhere else in the swept set (Global Constraints).

### Passages

**P1.1** `skills/tanto/scripts/reading.js` — replace exactly these 2 lines

```
const USAGE =
  "Usage: reading.js <transcript> [--role kanri|jisso] [--presence] [--backstop] [--now <ISO>] [--config <path>] [--settings <path>], or reading.js --share <transcript> [<transcript>...] [--config <path>]";
```

**P1.1 →**

```
const USAGE =
  "Usage: reading.js <transcript> [--role kanri|jisso] [--presence] [--backstop] [--now <ISO>] [--config <path>] [--project-config <path>] [--settings <path>], or reading.js --share <transcript> [<transcript>...] [--config <path>] [--project-config <path>]";
```

**P1.2** `skills/tanto/scripts/reading.js` — insert after these 3 lines

```
function configPathOf(explicit) {
  return explicit || path.join(configDir(), "tanto.json");
}
```

**P1.2 →**

```

/**
 * The project file, at `<cwd>/.claude/tanto.json`. `CLAUDE_CONFIG_DIR`
 * relocates the home-directory files only, so this path is read relative to
 * the session's working directory whatever that variable says.
 */
function projectConfigPathOf(explicit) {
  return explicit || path.join(process.cwd(), ".claude", "tanto.json");
}
```

**P1.3** `skills/tanto/scripts/reading.js` — replace exactly these 22 lines

```
/**
 * The merged `ceiling` map: the built-in copy, then the shipped
 * `templates/tanto.json`, then the personal file. Returns
 * { ceiling, warnings, path } -- `warnings` the unknown keys of the personal
 * file, which the caller writes to stderr.
 */
function loadCeiling(explicitConfig) {
  const ceiling = cloneCeiling(BUILT_IN_CEILING);
  const template = readJson(path.join(__dirname, "..", "templates", "tanto.json"));
  // The shipped template is the built-in default, so its own keys are never
  // reported as unknown: a template this script cannot read is a defect of
  // the skill, not of the human's file.
  overlayCeiling(ceiling, template?.ceiling, () => {});

  const configFile = configPathOf(explicitConfig);
  const personal = readJson(configFile);
  const warnings = [];
  overlayCeiling(ceiling, personal?.ceiling, (name) => {
    warnings.push(`unknown key ceiling.${name}, ignored`);
  });
  return { ceiling, warnings, path: configFile };
}
```

**P1.3 →**

```
/**
 * The merged `ceiling` map: the built-in copy, then the shipped
 * `templates/tanto.json`, then the personal file, then the project file.
 * Returns { ceiling, warnings, paths } -- `paths` the personal and the
 * project file as each was resolved, and `warnings` the unknown keys of
 * both, each named with the file it came from, which the caller writes to
 * stderr. Nothing in this script prints either path.
 */
function loadCeiling(explicitConfig, explicitProjectConfig) {
  const ceiling = cloneCeiling(BUILT_IN_CEILING);
  const template = readJson(path.join(__dirname, "..", "templates", "tanto.json"));
  // The shipped template is the built-in default, so its own keys are never
  // reported as unknown: a template this script cannot read is a defect of
  // the skill, not of the human's file.
  overlayCeiling(ceiling, template?.ceiling, () => {});

  const warnings = [];
  const configFile = configPathOf(explicitConfig);
  const personal = readJson(configFile);
  overlayCeiling(ceiling, personal?.ceiling, (name) => {
    warnings.push(`unknown key ceiling.${name} in ${configFile}, ignored`);
  });

  // The project layer wins. A file that is missing or does not parse is the
  // no-op case here, exactly as the personal one is.
  const projectFile = projectConfigPathOf(explicitProjectConfig);
  const project = readJson(projectFile);
  overlayCeiling(ceiling, project?.ceiling, (name) => {
    warnings.push(`unknown key ceiling.${name} in ${projectFile}, ignored`);
  });

  return { ceiling, warnings, paths: { personal: configFile, project: projectFile } };
}
```

**P1.4** `skills/tanto/scripts/reading.js` — replace all 2 occurrences of this 1 line

```
  const { ceiling, warnings } = loadCeiling(values.config);
```

**P1.4 →**

```
  const { ceiling, warnings } = loadCeiling(values.config, values["project-config"]);
```

**P1.5** `skills/tanto/scripts/reading.js` — replace exactly these 2 lines

```
        config: { type: "string" },
        settings: { type: "string" },
```

**P1.5 →**

```
        config: { type: "string" },
        "project-config": { type: "string" },
        settings: { type: "string" },
```

**P1.6** `skills/tanto/scripts/reading.test.js` — replace exactly these 2 lines

```
  assert.match(result.err, /^unknown key ceiling\.sekkei, ignored$/m);
  assert.match(result.err, /^unknown key ceiling\.kanri\.window, ignored$/m);
```

**P1.6 →**

```
  const escaped = config.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const line = (name) => new RegExp(`^unknown key ceiling\\.${name} in ${escaped}, ignored$`, "m");
  assert.match(result.err, line("sekkei"));
  assert.match(result.err, line("kanri\\.window"));
```

**P1.7** `skills/tanto/scripts/reading.test.js` — replace exactly these 7 lines

```
function run(args, extraEnv = {}) {
  const env = { ...process.env, CLAUDE_CONFIG_DIR: EMPTY_CONFIG_DIR };
  delete env.CLAUDE_CODE_AUTO_COMPACT_WINDOW;
  for (const [key, value] of Object.entries(extraEnv)) env[key] = value;
  const result = spawnSync(process.execPath, [SCRIPT, ...args], { encoding: "utf8", env });
  return { code: result.status, out: result.stdout || "", err: result.stderr || "", error: result.error };
}
```

**P1.7 →**

```
function run(args, extraEnv = {}) {
  const env = { ...process.env, CLAUDE_CONFIG_DIR: EMPTY_CONFIG_DIR };
  delete env.CLAUDE_CODE_AUTO_COMPACT_WINDOW;
  for (const [key, value] of Object.entries(extraEnv)) env[key] = value;
  // `cwd` is an empty directory for the same reason the config directory is
  // one: the project layer is read at `<cwd>/.claude/tanto.json`, and the
  // real repository's own file -- present or not -- must never decide a
  // test's result.
  const opts = { encoding: "utf8", env, cwd: EMPTY_CONFIG_DIR };
  const result = spawnSync(process.execPath, [SCRIPT, ...args], opts);
  return { code: result.status, out: result.stdout || "", err: result.stderr || "", error: result.error };
}
```

**P1.8** `skills/tanto/scripts/reading.test.js` — insert after these 9 lines

```
test("--share skips a path it cannot read, counts only the ones read, and names the skipped", () => {
  const readable = writeTranscript([assistant({ input_tokens: 400000 })]);
  const missing = path.join(tmpDir(), "gone.jsonl");

  const result = run(["--share", readable, missing]);
  assert.strictEqual(result.code, 0);
  assert.match(result.out, /over 1 transcripts \(400000 \/ 400000 tokens\)/);
  assert.match(result.out, /\(skipped .*gone\.jsonl\)/);
});
```

**P1.8 →**

```

test("the project file overlays the personal one, field by field", () => {
  const file = writeTranscript([assistant({ input_tokens: 1000 }), assistant({ input_tokens: 2000 })]);
  const personal = writeJson("tanto.json", {
    ceiling: { kanri: { batches: 3, per_batch: 10000 } },
  });
  const project = writeJson("project-tanto.json", { ceiling: { kanri: { batches: 1 } } });

  const result = run([file, "--role", "kanri", "--config", personal, "--project-config", project]);
  assert.strictEqual(result.code, 0);
  // `batches` is the project's; `per_batch` is the personal's, untouched.
  assert.match(result.out, /^ceiling: kanri baseline=1000 \+ 1 x 10000 = 11000 — context=2000 under$/m);
});

test("a missing project file is the all-lower-layers case", () => {
  const file = writeTranscript([assistant({ input_tokens: 1000 }), assistant({ input_tokens: 2000 })]);
  const personal = writeJson("tanto.json", { ceiling: { kanri: { batches: 3 } } });
  const missing = path.join(tmpDir(), "no-project-tanto.json");

  const result = run([file, "--role", "kanri", "--config", personal, "--project-config", missing]);
  assert.strictEqual(result.code, 0);
  assert.match(result.out, /^ceiling: kanri baseline=1000 \+ 3 x 65000 = 196000 — context=2000 under$/m);
});

test("an unparsable project file is the same, and adds nothing on stderr", () => {
  const file = writeTranscript([assistant({ input_tokens: 1000 }), assistant({ input_tokens: 2000 })]);
  const personal = writeJson("tanto.json", { ceiling: { kanri: { batches: 3 } } });
  const broken = writeJson("project-tanto.json", "{ not json at all");

  const result = run([file, "--role", "kanri", "--config", personal, "--project-config", broken]);
  assert.strictEqual(result.code, 0);
  assert.match(result.out, /^ceiling: kanri baseline=1000 \+ 3 x 65000 = 196000 — context=2000 under$/m);
  assert.strictEqual(result.err, "");
});

test("--project-config fixes the path in both forms", () => {
  const one = writeTranscript([assistant({ input_tokens: 200000 })]);
  const project = writeJson("project-tanto.json", { ceiling: { share_threshold: 100000 } });

  const reading = run([one, "--role", "jisso", "--project-config", project]);
  assert.strictEqual(reading.code, 0);
  assert.match(reading.out, /^ceiling: jisso baseline=200000 \+ 2 x 65000 = 330000 — context=200000 under$/m);

  const share = run(["--share", one, "--project-config", project]);
  assert.strictEqual(share.code, 0);
  assert.match(share.out, /share: 100% of usage at context > 100000 over 1 transcripts/);
});

test("an unknown key is named with the file it came from, with both files in one run", () => {
  const file = writeTranscript([assistant({ input_tokens: 1000 }), assistant({ input_tokens: 2000 })]);
  const personal = writeJson("tanto.json", { ceiling: { sekkei: { batches: 3 } } });
  const project = writeJson("project-tanto.json", { ceiling: { kanri: { window: 30 } } });

  const result = run([file, "--role", "kanri", "--config", personal, "--project-config", project]);
  assert.strictEqual(result.code, 0);
  // The fixture paths are absolute and, on Windows, backslashed, so these
  // `$`-anchored lines build their pattern from the path itself.
  const escape = (p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const line = (name, p) => new RegExp(`^unknown key ceiling\\.${name} in ${escape(p)}, ignored$`, "m");
  assert.match(result.err, line("sekkei", personal));
  assert.match(result.err, line("kanri\\.window", project));
});
```

### Anchors

**A1.1** `skills/tanto/scripts/reading.js` — `node skills/tanto/scripts/reading.js 2>&1 | head -n 1 | grep -c -- '--project-config'` — before: 0, after: 1

**A1.2** `skills/tanto/scripts/reading.test.js` — `grep -c '^test(' skills/tanto/scripts/reading.test.js` — before: 13, after: 18

### Steps

- [ ] **Step 1: Write the failing tests**

Apply **P1.6**, **P1.7**, and **P1.8** to
`skills/tanto/scripts/reading.test.js`, and nothing else yet.

- [ ] **Step 2: Run the suite to watch it fail**

```bash
mise x node@22 -- node --test skills/tanto/scripts/reading.test.js
```

Expected: FAIL. The five new cases fail because `--project-config` is an
unknown option (`parseArgs` throws, the script writes `USAGE` and exits 2), and
the rewritten `unknown key` case fails because the script still writes the
phrase without the file.

- [ ] **Step 3: Write the implementation**

Apply **P1.1**, **P1.2**, **P1.3**, **P1.4**, and **P1.5** to
`skills/tanto/scripts/reading.js`. Nothing else in that file changes: the
script still prints no config path, and no role file passes the new switch.

- [ ] **Step 4: Run the suite to watch it pass**

```bash
mise x node@22 -- node --version
mise x node@22 -- node --test skills/tanto/scripts/reading.test.js
```

Expected: a `v22.*` line, then `# fail 0`. Record the resolved version for the
batch report.

- [ ] **Step 5: Run the sibling suite, which shares nothing but must stay green**

```bash
mise x node@22 -- node --test skills/tanto/scripts/passage-check.test.js
```

Expected: `# fail 0`.

- [ ] **Step 6: Lint the changed paths**

```bash
./scripts/lint.sh skills/tanto/scripts/reading.js skills/tanto/scripts/reading.test.js
```

Expected: every hook `Passed` or `Skipped`. `biome-check` may reformat; if it
does, the run fails with the change unstaged — re-stage and run it again.

- [ ] **Step 7: Verify**

```bash
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-15-tanto-project-config.md --task 1
```

- [ ] **Step 8: Commit**

```bash
git commit --only skills/tanto/scripts/reading.js skills/tanto/scripts/reading.test.js -m "feat(tanto): reading.js reads a project tanto.json over the personal one" -m "loadCeiling gains a fourth layer, the project file at <cwd>/.claude/tanto.json, overlaid field by field on the personal one; --project-config fixes its path on both forms of the command line; and every unknown-key warning now names the file it came from. The returned path field becomes paths, with personal and project. Five cases join the suite and the two old warning assertions are rebuilt over the fixture's own path. Serves req-04f5 Model discipline; extends issue-6a29." -m "Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 2: `SKILL.md` — the three sources, the overlay, and the start line

**Files:**

- Modify: `skills/tanto/SKILL.md` (the section "The expected-model config")

**Interfaces:**

- Consumes: Task 1's warning phrase,
  `unknown key ceiling.<name> in <path>, ignored`. `SKILL.md`'s copy and
  `reading.js`'s must agree; the spec's Verification greps check both.
- Produces: the start line's two-file report, which `roles/kanri.md`'s
  enumeration defers to in Task 4.

### The old values this task contradicts

**O2.1** `is unset. Three maps, three mechanisms.` — `skills/tanto/SKILL.md` 1, gone by P2.1. Nowhere else in the swept set (Global Constraints). The spec names the location sentence itself, which carries backticks and so cannot be written as a lead; this needle is that sentence's end, and it spans the point where one file becomes three.

**O2.2** `model with the effort from the defaults.` — `skills/tanto/SKILL.md` 1, gone by P2.1. Nowhere else in `skills/` within the swept set (Global Constraints). The README's own bare-string sentence is worded differently and is O4.4's entity.

**O2.3** `since a personal override can be` — `skills/tanto/SKILL.md` 1, gone by P2.2. Nowhere else in the swept set (Global Constraints).

**O2.4** `overlay it on the defaults **field by field**:` — `skills/tanto/SKILL.md` 1, gone by P2.3. Nowhere else in the swept set (Global Constraints). The colon is load-bearing: P2.3 keeps the words and turns the colon into a comma, so a needle without it would survive its own change.

**O2.5** `unknown key <name>, ignored` — `skills/tanto/SKILL.md` 1, gone by P2.3. One more hit outside the skill, in `docs/decisions/03f9-the-top-family-in-one-shots-and-a-kind-that-carries-a-model-and-an-effort.md`, which **stays**: the ADR of "The ADRs" amends 03f9 at T2, and this plan does not edit `docs/decisions/`. The sweep's expected after-count over the repository is therefore 1, all of it in that ADR.

**O2.6** `unknown key ceiling.<name>, ignored` — `skills/tanto/SKILL.md` 1, gone by P2.3. Nowhere else in the swept set (Global Constraints).

**O2.7** `your start line, which file you read; which keys came from the` — `skills/tanto/SKILL.md` 1, gone by P2.4. Nowhere else in the swept set (Global Constraints).

**O2.8** `no tanto.json at <path>, all` — `skills/tanto/SKILL.md` 1, gone by P2.4. Nowhere else in the swept set (Global Constraints). Same entity as O2.7 — the start line's report — recorded separately because the spec quotes both halves and the two are on different lines.

### Passages

**P2.1** `skills/tanto/SKILL.md` — replace exactly these 4 lines

```
`$CLAUDE_CONFIG_DIR/tanto.json`, or `~/.claude/tanto.json` when that variable
is unset. Three maps, three mechanisms. Every value of the first two is
`{ "model": <family>, "effort": <level> }`, or a bare string, which means that
model with the effort from the defaults.
```

**P2.1 →**

```
Three files, each overlaid on the one before it and the last one winning: the
built-in defaults at `templates/tanto.json` in the skill; the personal
`$CLAUDE_CONFIG_DIR/tanto.json`, or `~/.claude/tanto.json` when that variable
is unset; and the project `<cwd>/.claude/tanto.json`. `<cwd>` is the session's
working directory — the one rule 4 binds the session to, and the one the
roster's cwd column records. The skill does not search upward for a repository
root, so a session started outside the repository root reads no project file
and says so. Whether a repository commits its own file is that repository's
decision: the skill only reads it, requires it tracked no more than it ignores
it, and ships no `.local` variant.

Three maps, three mechanisms. Every value of the first two maps is
`{ "model": <family>, "effort": <level> }`, or a bare string, which sets
`model` and leaves `effort` to the layers below.
```

**P2.2** `skills/tanto/SKILL.md` — replace exactly these 6 lines

```
- `sessions.<role>` is **advisory**. The checks above and Kanri's handshake
  check compare against it, read at the moment of each comparison — the
  file's presence as much as its content, since a personal override can be
  created, edited, or deleted at any time, and "it existed when I last
  checked" is never evidence that it exists now. Nothing switches a
  session's model or its effort.
```

**P2.2 →**

```
- `sessions.<role>` is **advisory**. The checks above and Kanri's handshake
  check compare against it, read at the moment of each comparison — each
  file's presence as much as its content, since a personal or a project
  override can be created, edited, or deleted at any time, and "it existed
  when I last checked" is never evidence that it exists now. Nothing switches
  a session's model or its effort.
```

**P2.3** `skills/tanto/SKILL.md` — replace exactly these 14 lines

```
The skill ships built-in defaults at `templates/tanto.json`, derived from the
family ladder `fable > opus > sonnet > haiku` (as of 2026-09). Read the
personal file and overlay it on the defaults **field by field**: a personal
`{"effort":"medium"}` under `subagents.task.implement` changes that effort and
keeps the default model. A partial personal file is complete; an absent file
is the case where every key is a default. The `ceiling` map overlays the same
way and at the same granularity: a personal
`{"ceiling": {"kanri": {"batches": 1}}}` sets Kanri's batch count to 1 and
leaves every other value of all three maps alone. A key that names no role, no
kind and no ceiling field — an older file's, for instance — is reported in
your start line as `unknown key <name>, ignored`, or as
`unknown key ceiling.<name>, ignored` for one under that map, which
`scripts/reading.js` writes on `stderr` every time it reads the file; either
way it is otherwise ignored.
```

**P2.3 →**

```
The skill ships built-in defaults at `templates/tanto.json`, derived from the
family ladder `fable > opus > sonnet > haiku` (as of 2026-09). Read the
personal file and overlay it on the defaults **field by field**, then read the
project file and overlay it on that result the same way: a personal
`{"effort":"medium"}` under `subagents.task.implement` changes that effort and
keeps the default model, and a project `{"effort":"xhigh"}` under
`sessions.sekkei` changes that one effort and keeps the model of the layer
below. A partial file is complete at either layer; an absent file is the case
where every key comes from the layers below it. The `ceiling` map overlays the
same way and at the same granularity: a personal
`{"ceiling": {"kanri": {"batches": 1}}}` sets Kanri's batch count to 1 and
leaves every other value of all three maps alone. A key that names no role, no
kind and no ceiling field — an older file's, for instance — is reported in
your start line as `unknown key <name> in <path>, ignored`, or as
`unknown key ceiling.<name> in <path>, ignored` for one under that map, which
`scripts/reading.js` writes on `stderr` every time it reads a file; either
way it is otherwise ignored.
```

**P2.4** `skills/tanto/SKILL.md` — replace exactly these 3 lines

```
Say once, in your start line, which file you read; which keys came from the
defaults, at the granularity of a field, or `no tanto.json at <path>, all
keys built-in defaults`; the ladder result if the check failed; and
```

**P2.4 →**

```
Say once, in your start line: the two config files with their state, as
`personal <path> present` or `personal <path> absent`, and as
`project <path> present` or `project <path> absent`; which fields came from
the project file, at the granularity of a field — for instance
`project: subagents.task.implement.effort, ceiling.kanri.batches` — which
fields came from the personal file, and that the rest are built-in defaults,
or `all keys built-in defaults` when both files are absent; the unknown keys,
each named with its file; the ladder result if the check failed; and
```

**P2.5** `skills/tanto/SKILL.md` — insert after these 1 lines

```
human is told once and the session carries on.
```

**P2.5 →**

```

A field the project file sets to the same value the personal file sets is
reported as the project's: the report is about where the effective value was
read from, and precedence decides that.
```

### Anchors

**A2.1** `skills/tanto/SKILL.md` — `grep -c 'in <path>, ignored' skills/tanto/SKILL.md` — before: 0, after: 2

**A2.2** `skills/tanto/SKILL.md` — `grep -c 'project <path> present' skills/tanto/SKILL.md` — before: 0, after: 1

### Steps

- [ ] **Step 1: Apply the four replacements**

Apply **P2.1**, **P2.2**, **P2.3**, and **P2.4** to `skills/tanto/SKILL.md`,
in that order. Nothing outside "The expected-model config" changes in this
task.

- [ ] **Step 2: Apply the insertion**

Apply **P2.5**. Its anchor is the last line of the start-line paragraph; the
anchor lines stay and only the new paragraph is added after them.

- [ ] **Step 3: Check that the two quoted phrases are each on one line**

```bash
grep -c 'in <path>, ignored' skills/tanto/SKILL.md
grep -c 'unknown key ceiling.<name> in <path>, ignored' skills/tanto/SKILL.md
```

Expected: `2`, then `1`. A `1` on the first line means a reflow wrapped one of
the phrases; put it back on one line. `markdownlint` will not object — `MD013`
is off in this repository.

- [ ] **Step 4: Lint the changed path**

```bash
./scripts/lint.sh skills/tanto/SKILL.md
```

Expected: every hook `Passed` or `Skipped`. `check-md-frontmatter` runs here;
the frontmatter is untouched by this task, and its `description` gains no
`: `.

- [ ] **Step 5: Verify**

```bash
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-15-tanto-project-config.md --task 2
```

- [ ] **Step 6: Commit**

```bash
git commit --only skills/tanto/SKILL.md -m "docs(tanto): the expected-model config names three files, not one" -m "The section's opening states the built-in, personal and project layers with their precedence and says what <cwd> is; the bare-string rule takes its effort from the layers below rather than from the defaults; the overlay paragraph reads the project file after the personal one and both unknown-key phrases name the file; and the start line reports the two files with their state and which fields came from which. The agents phrase is untouched here and lands with batch B. Extends issue-6a29." -m "Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 3: `SKILL.md`'s reading section and Artifacts row, and the note's §16

**Files:**

- Modify: `skills/tanto/SKILL.md` ("The transcript reading"; "Artifacts")
- Modify: `docs/notes/tanto-consistency-checks.md` (§16)

**Interfaces:**

- Consumes: Task 1's `--project-config` switch, which both `SKILL.md` sites
  and the note's alternation name.
- Produces: `grep -c -- '--project-config' skills/tanto/SKILL.md` at `2`, which
  Task 8 re-checks.

### The old values this task contradicts

**O3.1** `Three further switches` — `skills/tanto/SKILL.md` 1, gone by P3.1, which makes it four. Nowhere else in the swept set (Global Constraints).

**O3.2** `\-\-config|\-\-settings` — `docs/notes/tanto-consistency-checks.md` 1, gone by P3.4. Nowhere else in the swept set (Global Constraints). The entity is §16's switch check, and its expected value moves with it: P3.5 turns the `7` into an `8` in the Expected paragraph. That number cannot carry a needle of its own — it sits inside a code span, and the block grammar delimits a needle with single backticks — so it rides this one, and A3.2 is the anchor that catches it if it does not.

### Passages

**P3.1** `skills/tanto/SKILL.md` — replace exactly these 4 lines

```
and Kanri runs it once, at the plan close. Three further switches — `--now`,
`--config`, `--settings` — fix the clock, the personal config and the settings
file; they exist for the tests and for a Kanri verifying a peer's reading, and
no role file passes them.
```

**P3.1 →**

```
and Kanri runs it once, at the plan close. Four further switches — `--now`,
`--config`, `--project-config`, `--settings` — fix the clock, the personal
config, the project config and the settings file; they exist for the tests and
for a Kanri verifying a peer's reading from another working directory, and no
role file passes them.
```

**P3.2** `skills/tanto/SKILL.md` — replace exactly these 2 lines

```
and `--now`, `--config` and `--settings` fixing what the tests and a verifying
Kanri need fixed — and `--share` over several transcripts, which Kanri runs at
```

**P3.2 →**

```
and `--now`, `--config`, `--project-config` and `--settings` fixing what the
tests and a verifying Kanri need fixed — and `--share` over several
transcripts, which Kanri runs at
```

**P3.3** `skills/tanto/SKILL.md` — insert after these 1 lines

```
| `$CLAUDE_CONFIG_DIR/tanto.json` | the user | every role at start, Kanri at each handshake | the personal expected-model config |
```

**P3.3 →**

```
| `<cwd>/.claude/tanto.json` | the repository | every role at start, Kanri at each handshake, `scripts/reading.js` | the project expected-model config, overlaid on the personal one; committed or ignored as the repository decides |
```

**P3.4** `docs/notes/tanto-consistency-checks.md` — replace exactly these 1 lines

```
node skills/tanto/scripts/reading.js 2>&1 | head -n 1 | grep -oE '\-\-role|\-\-presence|\-\-backstop|\-\-share|\-\-now|\-\-config|\-\-settings' | sort -u | wc -l
```

**P3.4 →**

```
node skills/tanto/scripts/reading.js 2>&1 | head -n 1 | grep -oE '\-\-role|\-\-presence|\-\-backstop|\-\-share|\-\-now|\-\-config|\-\-project-config|\-\-settings' | sort -u | wc -l
```

**P3.5** `docs/notes/tanto-consistency-checks.md` — replace exactly these 1 lines

```
line, naming **both** its forms on that one line, then `7`; then one
```

**P3.5 →**

```
line, naming **both** its forms on that one line, then `8`; then one
```

**P3.6** `docs/notes/tanto-consistency-checks.md` — insert after these 1 lines

```
the first of two forms would pass while hiding half the interface.
```

**P3.6 →**

```

`--config` does not match inside `--project-config` — the text there is
`t-config`, not a second `--config` — so the two are counted separately, and
an alternation that named only the shorter one would keep passing while
covering less of the interface than it used to.
```

### Anchors

**A3.1** `skills/tanto/SKILL.md` — `grep -c -- '--project-config' skills/tanto/SKILL.md` — before: 0, after: 2

**A3.2** `docs/notes/tanto-consistency-checks.md` — `grep -c 'project-config' docs/notes/tanto-consistency-checks.md` — before: 0, after: 2

**A3.3** `docs/notes/tanto-consistency-checks.md` — `node skills/tanto/scripts/reading.js 2>&1 | head -n 1 | grep -oE '\-\-role|\-\-presence|\-\-backstop|\-\-share|\-\-now|\-\-config|\-\-project-config|\-\-settings' | sort -u | wc -l` — before: 8, after: 8

### Steps

- [ ] **Step 1: Apply the two `SKILL.md` replacements**

Apply **P3.1** to "The transcript reading" and **P3.2** to the Artifacts
executables paragraph.

- [ ] **Step 2: Apply the Artifacts table insertion**

Apply **P3.3**. The anchor is the personal config row; the new project row
goes immediately after it, and the definitions row below stays where it is —
Task 6 owns that one.

- [ ] **Step 3: Apply the note's §16 changes**

Apply **P3.4**, **P3.5**, and **P3.6** to
`docs/notes/tanto-consistency-checks.md`. §16's structural counts and its
closing paragraph about numbering are untouched, and no check is renumbered:
plans cite these numbers.

- [ ] **Step 4: Run the note's §16 block as it now stands**

```bash
node skills/tanto/scripts/passage-check.js 2>&1 | head -n 1 | grep -oE 'lint|replay|diff|verify|sections|frame|boundary' | sort -u | wc -l
node skills/tanto/scripts/reading.js 2>&1 | head -n 1 | grep -oE '\-\-role|\-\-presence|\-\-backstop|\-\-share|\-\-now|\-\-config|\-\-project-config|\-\-settings' | sort -u | wc -l
grep -cF 'scripts/reading.js' skills/tanto/SKILL.md skills/tanto/README.md
```

Expected: `7`, then `8`, then one `<path>:<n>` line per file with `<n>` at
least `1`. A `7` on the second line means the alternation did not take the new
switch, or `reading.js`'s usage line does not name it — Task 1's work.

- [ ] **Step 5: Lint the changed paths**

```bash
./scripts/lint.sh skills/tanto/SKILL.md docs/notes/tanto-consistency-checks.md
```

Expected: every hook `Passed` or `Skipped`. `markdownlint-cli2` runs on the
note (`docs/superpowers/**` is ignored, `docs/notes/**` is not) and may
auto-fix; re-stage and run again if it does.

- [ ] **Step 6: Verify**

```bash
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-15-tanto-project-config.md --task 3
```

- [ ] **Step 7: Commit**

```bash
git commit --only skills/tanto/SKILL.md docs/notes/tanto-consistency-checks.md -m "docs(tanto): name --project-config where the interface is described" -m "The transcript reading section counts four further switches, the Artifacts executables paragraph lists the new one, and the Artifacts table gains a row for the project config file. Consistency check 16's alternation gains the switch and its expectation becomes 8, with a sentence on why --config does not match inside --project-config and why the check would otherwise keep passing while covering less." -m "Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 4: `roles/kanri.md`'s two config sites, and the README's two bullets

**Files:**

- Modify: `skills/tanto/roles/kanri.md` (Start step 1; On a handshake step 1)
- Modify: `skills/tanto/README.md` (the feature bullet; the Prerequisites
  bullet)

**Interfaces:**

- Consumes: Task 2's start line. `roles/kanri.md` restates only its own
  enumeration and defers to `SKILL.md` for what reading the config means; the
  three-way report is stated once, there.
- Produces: `grep -c 'Read both' skills/tanto/roles/kanri.md` at `1`, which
  Task 8 re-checks.

No other role file names the personal path or the agents directory: the six
other files under `skills/tanto/roles/` are untouched by this whole plan, and
`roles/jisso.md`'s "not visible to this session" is prose about one kind, not
the count line.

### The old values this task contradicts

**O4.1** `config file, the keys that came from the defaults` — `skills/tanto/roles/kanri.md` 1, gone by P4.1. Nowhere else in the swept set (Global Constraints).

**O4.2** `at this moment — its presence as much as its content;` — `skills/tanto/roles/kanri.md` 1, gone by P4.2. Nowhere else in the swept set (Global Constraints). The spec names the sentence's opening, which carries backticks; this needle is the clause that follows it and changes with it.

**O4.3** `model and effort against a personal` — `skills/tanto/README.md` 1, gone by P4.3. Nowhere else in the swept set (Global Constraints). The spec's own needle, "against a personal `tanto.json`", carries backticks, and its backtick-free head survives an edit that only appends "and a project" — so P4.3 rewrites the phrase as "against the personal and the project" and this needle spans that.

**O4.4** `When it is absent, every key falls back to the` — `skills/tanto/README.md` 1, gone by P4.4. Nowhere else in the swept set (Global Constraints). The entity is the Prerequisites bullet, whose opening the spec quotes with backticks; the singular "it is absent" is the part that must become "both are absent".

### Passages

**P4.1** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```
   `ListAgents` once for your own `name [ref]`, and say your start line: the
   config file, the keys that came from the defaults, the ladder result if
   that check failed, and
```

**P4.1 →**

```
   `ListAgents` once for your own `name [ref]`, and say your start line: the
   two config files and which fields came from which, the ladder result if
   that check failed, and
```

**P4.2** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```
1. Read `tanto.json` at this moment — its presence as much as its content;
   "it existed when I last checked" is never evidence that it exists now —
```

**P4.2 →**

```
1. Read both `tanto.json` files at this moment — their presence as much as
   their content; "it existed when I last checked" is never evidence that
   either exists now —
```

Spec 1.4 says this sentence "gains the word 'both' and nothing else"; this
passage also changes "its" to "their" and "it exists" to "either exists" for
subject-verb agreement with two files. The plural reading is correct where
the spec's literal instruction would leave a grammar error; recorded here so
the deviation is not mistaken for drift.

**P4.3** `skills/tanto/README.md` — replace exactly these 4 lines

```
- Checks each session's model and effort against a personal `tanto.json` and
  **warns only** — it never switches either — and puts a concrete model family
  into every subagent dispatch and each kind's effort into the agent
  definitions it generates.
```

**P4.3 →**

```
- Checks each session's model and effort against the personal and the project
  `tanto.json` and **warns only** — it never switches either — and puts a
  concrete model family into every subagent dispatch and each kind's effort
  into the agent definitions it generates.
```

**P4.4** `skills/tanto/README.md` — replace exactly these 5 lines

```
- **Optional** — a personal `$CLAUDE_CONFIG_DIR/tanto.json` (or
  `~/.claude/tanto.json`). When it is absent, every key falls back to the
  built-in defaults in `templates/tanto.json`; a partial file is complete,
  because the overlay is field by field, and a key written as a bare model
  name takes its effort from the defaults.
```

**P4.4 →**

```
- **Optional** — a personal `$CLAUDE_CONFIG_DIR/tanto.json` (or
  `~/.claude/tanto.json`), and a project `<repo>/.claude/tanto.json` overlaid
  on it, committed or ignored as the repository decides. When both are absent,
  every key falls back to the built-in defaults in `templates/tanto.json`; a
  partial file is complete at either layer, because the overlay is field by
  field, and a key written as a bare model name takes its effort from the
  layers below.
```

### Anchors

**A4.1** `skills/tanto/roles/kanri.md` — `grep -c 'Read both' skills/tanto/roles/kanri.md` — before: 0, after: 1

**A4.2** `skills/tanto/README.md` — `grep -c 'as the repository decides' skills/tanto/README.md` — before: 0, after: 1

### Steps

- [ ] **Step 1: Apply Kanri's two passages**

Apply **P4.1** to Start step 1 and **P4.2** to "On a handshake" step 1.
Nothing else in `roles/kanri.md` changes in this task: the twelve-definitions
phrase and the count line are Task 7's.

- [ ] **Step 2: Apply the README's two passages**

Apply **P4.3** and **P4.4**. The templates list is unchanged — `agent.md` is
still one template — and the sentence on the generated project definitions is
Task 7's.

- [ ] **Step 3: Check the two sites read as one rule**

```bash
grep -c 'Read both' skills/tanto/roles/kanri.md
grep -n 'two config files' skills/tanto/roles/kanri.md
```

Expected: `1`, then one line inside Start step 1. If the second prints nothing,
P4.1 did not land.

- [ ] **Step 4: Lint the changed paths**

```bash
./scripts/lint.sh skills/tanto/roles/kanri.md skills/tanto/README.md
```

Expected: every hook `Passed` or `Skipped`.

- [ ] **Step 5: Verify**

```bash
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-15-tanto-project-config.md --task 4
```

- [ ] **Step 6: Commit**

```bash
git commit --only skills/tanto/roles/kanri.md skills/tanto/README.md -m "docs(tanto): Kanri reads both config files, and the README names the project one" -m "Kanri's handshake step reads both tanto.json files at the moment of the comparison, and its start line enumerates the two files and which fields came from which rather than one file and the defaulted keys. The README's feature bullet checks against the personal and the project file, and its Prerequisites bullet names <repo>/.claude/tanto.json, overlaid on the personal one and committed or ignored as the repository decides." -m "Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 5: `templates/agent.md`'s `<scope>` slot, and the two-pass write

**Files:**

- Modify: `skills/tanto/templates/agent.md`
- Modify: `skills/tanto/SKILL.md` (the definitions paragraph of "The
  expected-model config")

**Interfaces:**

- Produces: the `<scope>` slot, rendered as the empty string at user scope and
  as ` Project-scope copy for this repository.` — one leading space — at
  project scope. The user-scope rendering is therefore **byte-identical to
  today's**, which is why the existing user-scope definitions on any machine
  stay untouched. The clause carries no `: `, which the consistency note's
  §8 frontmatter check guards.
- Produces: the project pass's three halves — write, removal, `.gitignore` —
  which Task 6's count line reports on and Task 7's README sentence points at.

### The old values this task contradicts

**O5.1** `seat. Dispatched by a tanto role` — `skills/tanto/templates/agent.md` 1, gone by P5.1, which inserts the `<scope>` slot between the two sentences. Nowhere else in `skills/` within the swept set (Global Constraints). Rendered definitions under `~/.claude/agents/` are outside this repository and are rewritten by the next session that starts; they are not swept.

**O5.2** `work, write for each of the twelve kinds` — `skills/tanto/SKILL.md` 1, gone by P5.2. Nowhere else in the swept set (Global Constraints). The needle keeps the comma and the word before it because P5.2's own new text opens the user-scope pass with a capitalized "Write for each of the twelve kinds", which a shorter needle would match.

### Passages

**P5.1** `skills/tanto/templates/agent.md` — replace exactly these 1 lines

```
description: tanto's <object>.<act> seat. Dispatched by a tanto role by name through subagent_type, and never to be selected from this description.
```

**P5.1 →**

```
description: tanto's <object>.<act> seat.<scope> Dispatched by a tanto role by name through subagent_type, and never to be selected from this description.
```

**P5.2** `skills/tanto/SKILL.md` — replace exactly these 8 lines

```
A kind's effort cannot ride in a dispatch; it rides in an agent definition,
which the harness reads when a session starts. So, after reading the merged
config and before any other work, write for each of the twelve kinds the file
`~/.claude/agents/tanto-<object>-<act>.md` — the kind's name with its `.`
turned into a `-`, under `$CLAUDE_CONFIG_DIR/agents/` when that variable is
set — from `templates/agent.md`, when the file is absent or its content
differs from what the template renders. A file that already matches is left
alone.
```

**P5.2 →**

```
A kind's effort cannot ride in a dispatch; it rides in an agent definition,
which the harness reads when a session starts. So, after reading the merged
config and before any other work, make two passes.

**User scope.** Write for each of the twelve kinds the file
`~/.claude/agents/tanto-<object>-<act>.md` — the kind's name with its `.`
turned into a `-`, under `$CLAUDE_CONFIG_DIR/agents/` when that variable is
set — from `templates/agent.md`, when the file is absent or its content
differs from what the template renders. A file that already matches is left
alone. This rendering takes its effort from the merge of the **built-in and
personal layers only**, never from the project file, and its `<scope>` slot
renders empty. That merge is the one every role in every repository computes
identically for the same personal file, and it is what keeps the user-scope
files stable across repositories: a project's effort written where every other
project reads it is the failure this whole mechanism exists to prevent.

**Project scope.** Then compute, for each of the twelve kinds, the three-layer
effort. For every kind whose three-layer effort **differs** from the
user-scope effort, write `<cwd>/.claude/agents/tanto-<object>-<act>.md` from
the same template with that effort and with the `<scope>` slot rendered as
` Project-scope copy for this repository.` — one leading space, and no other
change from the user-scope rendering above, which renders the same slot as
the empty string — when that file is absent or its content differs; a file
that already matches is left alone. A model difference alone produces no project-scope file: the model
rides in the dispatch's own `model` parameter, and a definition carries none.
For every kind whose three-layer effort does **not** differ, remove
`<cwd>/.claude/agents/tanto-<object>-<act>.md` if it exists. That removal
sweep runs whenever `<cwd>/.claude/agents/` exists, whether or not a project
file does, and only those twelve names are ever removed — nothing else under
that directory is touched. Without it, a project file edited to drop an effort
would leave a project-scope copy that keeps winning while your start line
reports the personal effort, which is the silent override the requirement
forbids. When the project pass writes its first definition and
`<cwd>/.claude/agents/.gitignore` is absent, write that file with the two
lines `tanto-*.md` and `.gitignore`; when it exists it is never overwritten,
whatever it holds, and it is not removed when the last project definition is.
When the project file is absent, or sets no effort that differs, the write
half writes nothing and creates no directory; the removal half still runs.
```

### Anchors

**A5.1** `skills/tanto/templates/agent.md` — `grep -c '<scope>' skills/tanto/templates/agent.md` — before: 0, after: 1

**A5.2** `skills/tanto/SKILL.md` — `grep -c 'Project scope' skills/tanto/SKILL.md` — before: 0, after: 1

### Steps

- [ ] **Step 1: Apply the template's one-line change**

Apply **P5.1**. The body below the frontmatter is unchanged, `name` and
`effort` are unchanged, and the user-scope rendering — `<scope>` as the empty
string — is byte-identical to what the template produces today.

- [ ] **Step 2: Check the template still parses as frontmatter**

```bash
uv run --no-project --with pyyaml python -c "import yaml,sys;t=open(sys.argv[1],encoding='utf-8').read().split('---')[1];d=yaml.safe_load(t);print(sorted(d));print('BAD' if ': ' in d['description'] else 'ok')" skills/tanto/templates/agent.md
```

Expected: `['description', 'effort', 'name']`, then `ok`. A `BAD` means the
`<scope>` clause introduced a colon followed by a space, which breaks
frontmatter parsing silently; the clause of spec 4.4 carries none.

- [ ] **Step 3: Apply the two-pass paragraph**

Apply **P5.2** to `skills/tanto/SKILL.md`. Use `uv run --no-project`, never a
bare `python`, for the check above.

- [ ] **Step 4: Lint the changed paths**

```bash
./scripts/lint.sh skills/tanto/templates/agent.md skills/tanto/SKILL.md
```

Expected: every hook `Passed` or `Skipped`. `markdownlint-cli2` ignores
`skills/tanto/templates/**`, so only `SKILL.md` is linted as Markdown here;
`check-md-frontmatter` still reads both.

- [ ] **Step 5: Verify**

```bash
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-15-tanto-project-config.md --task 5
```

- [ ] **Step 6: Commit**

```bash
git commit --only skills/tanto/templates/agent.md skills/tanto/SKILL.md -m "feat(tanto): a project-level effort rides in a project-scope agent definition" -m "The agent template's description gains a <scope> slot, empty at user scope so that rendering stays byte-identical, and one clause at project scope so the marker survives into the agent list. SKILL.md splits the definitions write into two passes: the user-scope pass renders from the built-in and personal layers only, keeping those files stable across repositories, and the project pass writes, removes, and self-ignores under <cwd>/.claude/agents/ for the kinds whose effort the project file changes. Answers issue-cae3." -m "Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 6: `SKILL.md` — the count line, the visibility rule, Rule 6, Artifacts

**Files:**

- Modify: `skills/tanto/SKILL.md` (the count paragraph; the start line's
  agents phrase; "Resuming"; "Artifacts" table; Rule 6)

**Interfaces:**

- Consumes: Task 5's project pass and its `<scope>` marker; `<s>` is the
  number of the twelve names whose description in this session's own agent
  list carries that marker.
- Produces: the count line
  `agents: <n> current, <m> written, <k> not visible to this session; project: <p> current, <q> written, <r> removed, <s> in effect`,
  written on **one** line. Task 7 restates the same line in
  `roles/kanri.md`; the spec's Verification greps expect `1` at each site.

### The old values this task contradicts

**O6.1** `is above zero. This is information` — `skills/tanto/SKILL.md` 1, gone by P6.2. Nowhere else in the swept set (Global Constraints). The spec's own needle is the count line, and the count line cannot carry one: the new line begins with the old line's every character and only then adds the `project:` half, so any needle inside it survives its own change, and a needle reaching the closing backtick cannot be written as a lead. This needle is the sentence that follows the line and is rewritten in the same passage.

**O6.2** `every role at its start, from the merged config` — `skills/tanto/SKILL.md` 1, gone by P6.3. Nowhere else in the swept set (Global Constraints).

**O6.3** `from the definitions at` — `skills/tanto/SKILL.md` 1, gone by P6.4. Nowhere else in the swept set (Global Constraints). Rule 6's own path is in backticks; P6.4 rewrites the clause as "from the definitions this session sees", so this needle spans the change rather than surviving an added path.

**O6.4** `twelve-definitions write-and-count` — `skills/tanto/SKILL.md` 1, gone by P6.5. Nowhere else in the swept set (Global Constraints). The entity is what `/tanto fukki` re-runs, which is now both scopes and no longer twelve files.

### Passages

**P6.1** `skills/tanto/SKILL.md` — replace exactly these 6 lines

```
Then read your own system prompt's list of available agent types and count
the twelve names in it. A definition written during a session is not visible
to that session, so the first session on a machine that writes them
dispatches without them; from then on a dispatch names its kind as
`subagent_type: tanto-<object>-<act>` — or `tanto-<kind>` for a kind with no
dot in its name, `tanto-shoroku` and `tanto-default`.
```

**P6.1 →**

```
Then read your own system prompt's list of available agent types and count
the twelve names in it, and among them the ones whose description carries the
project-scope clause. A definition written during a session is not visible to
that session at either scope, so the first session on a machine that writes
them dispatches without them, and a project effort takes effect from the
second session started in that repository after the project file changed;
from then on a dispatch names its kind as
`subagent_type: tanto-<object>-<act>` — or `tanto-<kind>` for a kind with no
dot in its name, `tanto-shoroku` and `tanto-default`. A kind visible at user
scope but not yet at project scope dispatches with the user-scope effort, and
the dispatching role says so once, as it does for a kind it cannot see at all.
```

**P6.2** `skills/tanto/SKILL.md` — replace exactly these 2 lines

```
`agents: <n> current, <m> written, <k> not visible to this session`, with the
kinds named when `<k>` is above zero. This is information, not a warning: the
```

**P6.2 →**

```
`agents: <n> current, <m> written, <k> not visible to this session; project: <p> current, <q> written, <r> removed, <s> in effect`,
with `<s>` the number of the twelve names whose description in this session's
own agent list carries the project-scope clause, and with the kinds named when
`<k>` is above zero. The `project:` half is printed even when all four of its
numbers are zero, so that a start line always says which scope the session
runs on. This
is information, not a warning: the
```

**P6.3** `skills/tanto/SKILL.md` — replace exactly these 1 lines

```
| `~/.claude/agents/tanto-*.md`, or `$CLAUDE_CONFIG_DIR/agents/` when that variable is set | every role at its start, from the merged config | the harness, at the next session start | one definition per kind, from `templates/agent.md`; a definition is dispatchable only from the sessions started after it was written |
```

**P6.3 →**

```
| `~/.claude/agents/tanto-*.md`, or `$CLAUDE_CONFIG_DIR/agents/` when that variable is set | every role at its start, from the built-in and personal layers | the harness, at the next session start | one definition per kind, from `templates/agent.md`; a definition is dispatchable only from the sessions started after it was written |
| `<cwd>/.claude/agents/tanto-*.md`, and `<cwd>/.claude/agents/.gitignore` beside them | every role at its start, for the kinds whose effort the project file changes | the harness, at the next session start; git | the project-scope definitions, from the same template with its `<scope>` clause rendered; the `.gitignore` holds `tanto-*.md` and `.gitignore`, is written once and never overwritten |
```

**P6.4** `skills/tanto/SKILL.md` — replace exactly these 3 lines

```
6. Every subagent dispatch names a `model` from `tanto.json`; none omits it,
   and it names a `subagent_type` from the definitions at
   `~/.claude/agents/tanto-<object>-<act>.md` when this session sees them.
```

**P6.4 →**

```
6. Every subagent dispatch names a `model` from `tanto.json`; none omits it,
   and it names a `subagent_type` from the definitions this session sees,
   whether they are at `~/.claude/agents/` or at `<cwd>/.claude/agents/`.
```

**P6.5** `skills/tanto/SKILL.md` — replace exactly these 3 lines

```
the session's context, which is what a resume preserves. It also re-runs the
Start sequence's twelve-definitions write-and-count (a resume can carry a new
`CLAUDE_CONFIG_DIR`, and re-writing may nudge the harness to re-scan) and says
```

**P6.5 →**

```
the session's context, which is what a resume preserves. It also re-runs the
Start sequence's definitions write-and-count in both scopes (a resume can
carry a new `CLAUDE_CONFIG_DIR`, and re-writing may nudge the harness to
re-scan) and says
```

### Anchors

**A6.1** `skills/tanto/SKILL.md` — `grep -c 'project: <p> current' skills/tanto/SKILL.md` — before: 0, after: 1

**A6.2** `skills/tanto/SKILL.md` — `grep -c 'both scopes' skills/tanto/SKILL.md` — before: 0, after: 1

### Steps

- [ ] **Step 1: Apply the count and visibility passages**

Apply **P6.1** and **P6.2**. **P6.2's first line is long and must stay one
line**: the spec's Verification greps the whole count line, and a reflow
leaves the text right and the check red. `MD013` is off in this repository, so
nothing will wrap it for you.

- [ ] **Step 2: Apply the Artifacts and Rule 6 passages**

Apply **P6.3**, which turns one definitions row into two, and **P6.4**, which
widens Rule 6 to either scope.

- [ ] **Step 3: Apply the Resuming passage**

Apply **P6.5**. `/tanto fukki` re-runs both passes and says the result the
same way the Start sequence does.

- [ ] **Step 4: Check the count line and the Resuming phrase**

```bash
grep -c 'project: <p> current' skills/tanto/SKILL.md
grep -c 'both scopes' skills/tanto/SKILL.md
```

Expected: `1`, then `1`. A `0` on the first means the count line was wrapped.

- [ ] **Step 5: Lint the changed path**

```bash
./scripts/lint.sh skills/tanto/SKILL.md
```

Expected: every hook `Passed` or `Skipped`. The Artifacts table is a
pipe table; markdownlint will not object to a long row, and no row of it is
touched by any other in-flight topic.

- [ ] **Step 6: Verify**

```bash
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-15-tanto-project-config.md --task 6
```

- [ ] **Step 7: Commit**

```bash
git commit --only skills/tanto/SKILL.md -m "docs(tanto): the start line says which scope a session runs on" -m "The agents count line gains its project half, printed even when all four numbers are zero, with <s> read from the project-scope clause in this session's own agent list. The visibility sentence covers both scopes and states that a project effort takes effect from the second session in that repository. Artifacts gains a row for the project-scope definitions and their .gitignore and re-attributes the user-scope row to the built-in and personal layers, Rule 6 names either scope, and Resuming re-runs the write-and-count in both." -m "Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 7: Kanri's definitions line, the README's sentence, and the note's §8

**Files:**

- Modify: `skills/tanto/roles/kanri.md` (Start step 1)
- Modify: `skills/tanto/README.md` (the Prerequisites bullet)
- Modify: `docs/notes/tanto-consistency-checks.md` (§8)

**Interfaces:**

- Consumes: Task 6's count line, restated here byte for byte, and Task 5's
  project pass, which the README sentence and the note's fifth line point at.
- Consumes: Task 4's rewritten Prerequisites bullet — P7.3's old block is the
  last two lines **as Task 4 leaves them**, not as they stand on `main`.
- Produces: `grep -c 'project: <p> current' skills/tanto/roles/kanri.md` at
  `1`, and the note's fifth §8 line, both of which Task 8 re-checks.

### The old values this task contradicts

**O7.1** `write the twelve agent` — `skills/tanto/roles/kanri.md` 1, gone by P7.1. Nowhere else in the swept set (Global Constraints).

**O7.2** `this line is the only place your own two values are checked,` — `skills/tanto/roles/kanri.md` 1, gone by P7.2. Nowhere else in the swept set (Global Constraints). As at O6.1, Kanri's copy of the count line cannot carry its own needle — the new line opens with every character of the old one — so the needle is the clause the same passage reflows, where "this line" becomes "this start line".

**O7.3** `fourth line reads a **rendered** definition` — `docs/notes/tanto-consistency-checks.md` 1, gone by P7.5. Nowhere else in the swept set (Global Constraints). The entity is §8's account of which command reads a rendered definition, which becomes two commands.

### Passages

**P7.1** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```
1. Read `tanto.json` as `SKILL.md` describes, write the twelve agent
   definitions from the merged config as its start sequence prescribes, run
```

**P7.1 →**

```
1. Read `tanto.json` as `SKILL.md` describes, write the agent definitions of
   both scopes as its start sequence prescribes, run
```

**P7.2** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```
   `agents: <n> current, <m> written, <k> not visible to this session`; your
   own `model` and `effort` against `sessions.kanri`, since you send no
   handshake and this line is the only place your own two values are checked,
```

**P7.2 →**

```
   `agents: <n> current, <m> written, <k> not visible to this session; project: <p> current, <q> written, <r> removed, <s> in effect`;
   your own `model` and `effort` against `sessions.kanri`, since you send no
   handshake and this start line is the only place your own two values are
   checked,
```

**P7.3** `skills/tanto/README.md` — replace exactly these 2 lines

```
  field, and a key written as a bare model name takes its effort from the
  layers below.
```

**P7.3 →**

```
  field, and a key written as a bare model name takes its effort from the
  layers below. An effort the project file changes is carried by project-scope
  agent definitions the roles generate under `<repo>/.claude/agents/`, ignored
  by a `.gitignore` the roles write there.
```

**P7.4** `docs/notes/tanto-consistency-checks.md` — insert after these 1 lines

```
uv run --no-project --with pyyaml python -c "import yaml,sys;t=open(sys.argv[1],encoding='utf-8').read().split('---')[1];d=yaml.safe_load(t);print(sorted(d),d['effort'])" "${CLAUDE_CONFIG_DIR:-$HOME/.claude}/agents/tanto-task-implement.md"
```

**P7.4 →**

```
if test -f .claude/agents/tanto-task-implement.md; then
  uv run --no-project --with pyyaml python -c "import yaml,sys;t=open(sys.argv[1],encoding='utf-8').read().split('---')[1];d=yaml.safe_load(t);print(sorted(d),d['effort'])" .claude/agents/tanto-task-implement.md
else
  echo "no project-scope definition on this host"
fi
```

**P7.5** `docs/notes/tanto-consistency-checks.md` — replace exactly these 4 lines

```
what makes a half-widened config fail here rather than at a dispatch. The
fourth line reads a **rendered** definition, which exists only where a role
has already generated one; where the directory is empty, record
`definitions not generated on this host` and let the dogfood settle it.
```

**P7.5 →**

```
what makes a half-widened config fail here rather than at a dispatch. The
fourth and fifth lines read a **rendered** definition — the fourth the
user-scope one, the fifth the project-scope copy under this repository's own
`.claude/agents/` — and each exists only where a role has already generated
it; where the user-scope directory is empty, record
`definitions not generated on this host`, and where the project-scope file is
absent the fifth line echoes its own fallback, which is the expected result in
every repository that ships no project config. Let the dogfood settle both.
```

**P7.6** `docs/notes/tanto-consistency-checks.md` — replace exactly these 3 lines

```
Expected: `['argument-hint', 'description', 'name']`, then `ok`; then
`tanto.json ok 7 12`; then `['description', 'effort', 'name']` and `ok`;
then `['description', 'effort', 'name'] high`. A colon followed by a space
```

**P7.6 →**

```
Expected: `['argument-hint', 'description', 'name']`, then `ok`; then
`tanto.json ok 7 12`; then `['description', 'effort', 'name']` and `ok`;
then `['description', 'effort', 'name'] high` for the user-scope definition;
and for the project-scope one either the same three keys with this
repository's own effort, or the fallback line the fifth command echoes. A
colon followed by a space
```

### Anchors

**A7.1** `skills/tanto/roles/kanri.md` — `grep -c 'project: <p> current' skills/tanto/roles/kanri.md` — before: 0, after: 1

**A7.2** `docs/notes/tanto-consistency-checks.md` — `grep -c 'no project-scope definition on this host' docs/notes/tanto-consistency-checks.md` — before: 0, after: 1

**A7.3** `skills/tanto/README.md` — `grep -c 'agents/' skills/tanto/README.md` — before: 0, after: 1

### Steps

- [ ] **Step 1: Apply Kanri's two passages**

Apply **P7.1** and **P7.2**. **P7.2's first line is long and must stay one
line**, for the same reason P6.2's must: the spec greps the whole count line
at this site too.

- [ ] **Step 2: Check Kanri's line against `SKILL.md`'s**

```bash
grep -c 'project: <p> current' skills/tanto/SKILL.md skills/tanto/roles/kanri.md
```

Expected: `1` for each file. The two copies are the same line; if one differs,
fix the copy, not the source.

- [ ] **Step 3: Apply the README's sentence**

Apply **P7.3**. Its old block is the last two lines of the Prerequisites
bullet **as Task 4 left them** — if the file still reads
`name takes its effort from the defaults.`, Task 4 has not landed and this
task is out of order.

- [ ] **Step 4: Apply the note's §8 changes**

Apply **P7.4** (the fifth command), **P7.5** (the prose about which lines read
a rendered definition), and **P7.6** (the Expected paragraph). §8's other
three commands, its `BAD` branch, its PyYAML fallback, and the
`uv run --no-project` rule are untouched.

- [ ] **Step 5: Run the note's §8 block as it now stands**

```bash
uv run --no-project --with pyyaml python -c "import yaml;t=open('skills/tanto/SKILL.md',encoding='utf-8').read().split('---')[1];d=yaml.safe_load(t);print(sorted(d));print('BAD' if ': ' in d['description'] else 'ok')"
node -e 'const t=require("./skills/tanto/templates/tanto.json");const r=Object.keys(t.sessions),k=Object.keys(t.subagents);if(r.length!==7||k.length!==12)process.exit(1);for(const m of [t.sessions,t.subagents])for(const v of Object.values(m))if(!v.model||!v.effort)process.exit(1);console.log("tanto.json ok",r.length,k.length)'
uv run --no-project --with pyyaml python -c "import yaml,sys;t=open(sys.argv[1],encoding='utf-8').read().split('---')[1];d=yaml.safe_load(t);print(sorted(d));print('BAD' if ': ' in d['description'] else 'ok')" skills/tanto/templates/agent.md
uv run --no-project --with pyyaml python -c "import yaml,sys;t=open(sys.argv[1],encoding='utf-8').read().split('---')[1];d=yaml.safe_load(t);print(sorted(d),d['effort'])" "${CLAUDE_CONFIG_DIR:-$HOME/.claude}/agents/tanto-task-implement.md"
if test -f .claude/agents/tanto-task-implement.md; then
  uv run --no-project --with pyyaml python -c "import yaml,sys;t=open(sys.argv[1],encoding='utf-8').read().split('---')[1];d=yaml.safe_load(t);print(sorted(d),d['effort'])" .claude/agents/tanto-task-implement.md
else
  echo "no project-scope definition on this host"
fi
```

Expected: `['argument-hint', 'description', 'name']` then `ok`;
`tanto.json ok 7 12`; `['description', 'effort', 'name']` then `ok`;
`['description', 'effort', 'name'] high`; then
`no project-scope definition on this host`, because this repository ships no
project config. Record all five outputs for the batch report.

- [ ] **Step 6: Lint the changed paths**

```bash
./scripts/lint.sh skills/tanto/roles/kanri.md skills/tanto/README.md docs/notes/tanto-consistency-checks.md
```

Expected: every hook `Passed` or `Skipped`.

- [ ] **Step 7: Verify**

```bash
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-15-tanto-project-config.md --task 7
```

- [ ] **Step 8: Commit**

```bash
git commit --only skills/tanto/roles/kanri.md skills/tanto/README.md docs/notes/tanto-consistency-checks.md -m "docs(tanto): Kanri writes both scopes, and check 8 reads a project-scope definition" -m "Kanri's start step writes the agent definitions of both scopes and prints the full count line, the same line SKILL.md states. The README's Prerequisites bullet says a project effort is carried by project-scope definitions under <repo>/.claude/agents/, ignored by a .gitignore the roles write there. Consistency check 8 gains a fifth line reading the project-scope copy, with a fallback for a host that has none, which is the expected result in a repository that ships no project config." -m "Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 8: the sweep and check

**Files:** none. **This task is sweep-and-check shaped: its deliverable is
recorded output, not a file.** Nothing is committed for it; its result goes
into the batch report and into Kanri's boundary ruling. It changes no file, so
it carries no `P` block and no `O` block — its anchors are the spec's own
Verification greps, and `verify --task 8` is how they are run.

**Interfaces:**

- Consumes: everything Tasks 1 through 7 landed. Every anchor below is one of
  the spec's Verification greps, copied unchanged.

### Anchors

**A8.1** `skills/tanto/SKILL.md` — `grep -c -- '--project-config' skills/tanto/SKILL.md` — before: 2, after: 2

**A8.2** `skills/tanto/scripts/reading.js` — `grep -c -- '--project-config' skills/tanto/scripts/reading.js` — before: 1, after: 1

**A8.3** `skills/tanto/SKILL.md` — `grep -c 'unknown key ceiling.<name> in <path>, ignored' skills/tanto/SKILL.md` — before: 1, after: 1

**A8.4** `skills/tanto/SKILL.md` — `grep -c 'in <path>, ignored' skills/tanto/SKILL.md` — before: 2, after: 2

**A8.5** `skills/tanto/templates/agent.md` — `grep -c '<scope>' skills/tanto/templates/agent.md` — before: 1, after: 1

**A8.6** `skills/tanto/SKILL.md` — `grep -c 'both scopes' skills/tanto/SKILL.md` — before: 1, after: 1

**A8.7** `skills/tanto/roles/kanri.md` — `grep -c 'Read both' skills/tanto/roles/kanri.md` — before: 1, after: 1

**A8.8** `skills/tanto/SKILL.md` — `grep -c 'project: <p> current' skills/tanto/SKILL.md` — before: 1, after: 1

**A8.9** `skills/tanto/roles/kanri.md` — `grep -c 'project: <p> current' skills/tanto/roles/kanri.md` — before: 1, after: 1

**A8.10** `skills/tanto/scripts/reading.js` — `node skills/tanto/scripts/reading.js 2>&1 | head -n 1 | grep -oE '\-\-role|\-\-presence|\-\-backstop|\-\-share|\-\-now|\-\-config|\-\-project-config|\-\-settings' | sort -u | wc -l` — before: 8, after: 8

Each of these ten reads the same value before and after this task, because
this task changes nothing. That is the point: they are the standing assertions
of the finished work, and the task exists to run them together and record what
they print.

### Steps

- [ ] **Step 1: Run the spec's Verification greps and record every line**

```bash
grep -c -- '--project-config' skills/tanto/SKILL.md skills/tanto/scripts/reading.js
grep -c 'unknown key ceiling.<name> in <path>, ignored' skills/tanto/SKILL.md
grep -c 'in <path>, ignored' skills/tanto/SKILL.md
grep -c '<scope>' skills/tanto/templates/agent.md
grep -c 'both scopes' skills/tanto/SKILL.md
grep -c 'Read both' skills/tanto/roles/kanri.md
grep -c 'project: <p> current' skills/tanto/SKILL.md skills/tanto/roles/kanri.md
```

Expected: `2` for `SKILL.md` and `1` for `reading.js`; then `1`; then `2`;
then `1`; then `1`; then `1`; then `1` and `1`. Paste every command with its
output into the batch report.

- [ ] **Step 2: Run the consistency note's §16 count**

```bash
node skills/tanto/scripts/reading.js 2>&1 | head -n 1
node skills/tanto/scripts/reading.js 2>&1 | head -n 1 | grep -oE '\-\-role|\-\-presence|\-\-backstop|\-\-share|\-\-now|\-\-config|\-\-project-config|\-\-settings' | sort -u | wc -l
```

Expected: the usage line, naming **both** forms on that one line, then `8`.

- [ ] **Step 3: Run the consistency note's §8 block, all five lines**

Run the block exactly as Task 7 Step 5 lists it. Expected, in order:
`['argument-hint', 'description', 'name']` then `ok`; `tanto.json ok 7 12`;
`['description', 'effort', 'name']` then `ok`;
`['description', 'effort', 'name'] high`; then
`no project-scope definition on this host`. Record all five.

- [ ] **Step 4: Run both Node suites on the pinned Node**

```bash
mise x node@22 -- node --version
mise x node@22 -- node --test skills/tanto/scripts/reading.test.js
mise x node@22 -- node --test skills/tanto/scripts/passage-check.test.js
```

Expected: a `v22.*` line, then `# fail 0` from each suite. Record the resolved
version.

- [ ] **Step 5: Sweep every `O` needle of both batches over the whole tree**

For each needle in every `O` block of Tasks 1 through 7, run it over the swept
set (Global Constraints) and not only over the files the batches wrote:

```bash
grep -rc -F --exclude-dir=superpowers --exclude-dir=resolved -- 'work, write for each of the twelve kinds' skills docs | grep -v ':0$'
```

Expected: no output for every needle except `O2.5`'s, whose one surviving hit
is in `docs/decisions/03f9-the-top-family-in-one-shots-and-a-kind-that-carries-a-model-and-an-effort.md`
and is the T2 ADR's to amend. A hit anywhere else in the swept set is a site
the plan missed; report it to Kanri and stop rather than editing outside the
plan.

- [ ] **Step 6: Confirm the tree is clean**

```bash
git status --porcelain
```

Expected: no output. A modification here that this session did not make is
reported to Kanri in one line and never discarded — not with `git checkout --`
and not with `git clean`.

- [ ] **Step 7: Verify**

```bash
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-15-tanto-project-config.md --task 8
```

- [ ] **Step 8: Report, and commit nothing**

This task has no commit. Put every command and its output in the batch report
under the batch's verification section, and answer Kanri with the one-line
boundary report the templates prescribe.

---

## Self-Review

**Spec coverage.** Spec section 1 (the sources and the merge) is Tasks 1, 2
and 4; section 1.3's start line is Task 2, its agents phrase Task 6; section
1.4 is Task 4; sections 1.5 and 1.6 need no edit, being unchanged statements
that the merged result is what is checked. Section 2 is Tasks 5, 6 and 7:
2.1 and 2.2–2.4 in P5.2, 2.5 in P6.2 and P7.2, 2.6 in P6.1. Section 3 is Task
1 whole. Section 4.1's eleven sub-changes: 1, 2, 3, 4 in Task 2; 7, 9 and the
config-file row of 10 in Task 3; 5 in Task 5; 6, 8, 11 and the definitions
rows of 10 in Task 6. Section 4.2 is Tasks 4 and 7; 4.3 is Tasks 4 and 7; 4.4
is Task 5; 4.5 is Task 1; 4.6's §16 is Task 3 and its §8 is Task 7. The
Verification section is Task 8, except the M2 probe, which is the
whole-branch reviewer's and is written into "How a batch is verified" step 6.
No spec requirement is without a task.

**The largest task.** Task 1, at **359 lines** from its `## Task 1` heading to
the line before `## Task 2`, with **8 steps**, 8 passages, 2 anchors, and 4
`O` blocks. It is the one task with real code, and most of those lines are the
passages themselves — the five new test cases are one 60-line new block. Its
step count is the TDD cycle: three of its eight steps are command runs that
only observe. Task 7 is the next largest at 204 lines and 8 steps, Task 6 at
179 and 7, Task 5 at 148 and 6; every task in the plan has between 6 and 8
steps.

**The sweep-and-check task.** **Task 8**, the final task of Batch B. Its
deliverable is recorded output rather than a file: it changes nothing, commits
nothing, and carries only anchors. It is flagged as such in its own heading
line and in Batch B's stop conditions.

**Placeholder scan.** No step says TBD, "implement later", "add error
handling", or "similar to Task N". Every code step carries its code; every
passage carries both blocks verbatim; every expected value is a literal.

**Type consistency.** `loadCeiling(explicitConfig, explicitProjectConfig)` is
named the same way in Task 1's Interfaces block, in P1.3, and at both call
sites in P1.4. `projectConfigPathOf` is spelled the same in P1.2 and P1.3. The
warning phrase `unknown key ceiling.<name> in <path>, ignored` is the same
string in P1.3 (as a template literal), in P2.3 (as prose), and in A8.3. The
count line is byte-identical in P6.2 and P7.2. The `<scope>` slot is the same
token in P5.1, P5.2, P6.3, and A8.5.

## For T2 (not this plan's tasks)

Kanri handles these after the final batch; **no task above implements them**,
and no task above writes under `docs/decisions/`, `docs/requirements/`, or
`docs/issues/`.

- **One ADR**, amending decision-9a3a and decision-03f9, with
  `amends: ["9a3a", "03f9"]` in its frontmatter and `amended_by` added to
  both. Its Context, Options, Decision, and Consequences are written out in
  the spec's "The ADRs" section. It also says in one sentence each why
  decision-08bc, decision-eee2, and decision-7e21 are touched and not amended.
- **The issues this design closes:** issue-6a29 (the project overlay, both of
  its open questions answered) and issue-cae3 (a project-level effort honored
  through project-scope definitions, its `blocks: ["6a29"]` discharged with
  it).
- **The Deferred items as new issues:** the project pass measured end to end
  by the first run in any repository that carries a project effort, naming its
  four checks; and a second project layer — a shared file plus a per-machine
  override — at severity `low`.
- **`docs/requirements/04f5-tanto.md`:** no bullet is added or reworded; T2
  records that **Model discipline** is now served, and bumps nothing but
  `updated:` if the ADR's cross-reference is added there.
- **`docs/design/4807-tanto.md` goes stale** in two places, which T2 rewrites
  against sections 1 and 2 of the spec: "The expected-model config" (its
  two-maps paragraph and its definitions paragraph) and "The start sequence"
  (the start line's three sources).

Reports and prompts follow the tanto templates.
