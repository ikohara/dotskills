# tanto consistency checks

Every mechanical check on the `tanto` skill, in one place, so that a plan which
edits `skills/tanto/` runs the whole set as one task instead of restating the
commands. Run them from the repository root, in the order below, and record
each command's output: the output is the deliverable of a consistency pass.

**Run these commands as written.** A paraphrase is where a consistency pass
loses its own reliability, and two measured cases say why. `grep -n '[ \t]$'`
substituted for check 9's `grep -c '[[:space:]]$'` matches every line ending in
the letter `t`: inside single quotes a bracket expression reads `\t` as the two
characters `\` and `t`, not as a tab. And `**Output**` substituted for a
recorded baseline's `Output:` heading finds no blocks at all, which reads as
"no baseline exists" rather than as a typo. A divergence between a command here
and the tree is this note's problem or the tree's; a divergence introduced in
transcription is neither, and it looks exactly like a result.

Three moments in a `tanto` plan call for the same extraction method —
every fenced block of the plan pulled into a scratch tree, diffed
against `HEAD`, and these commands run there: Sekkei's plan review
before the plan is committed, Jisso's pre-flight before its first task,
and the conductor's pre-flight at each boundary before a batch is
accepted. No role file schedules them on its own; a plan that edits
`skills/tanto/` schedules them by naming this note in its verification
section.

A plan that carries passages rather than whole files — an anchor line, the
old passage, the new passage, for each edit — has no extracted tree. Its
alignment check is the diff of each touched file against the merge base,
whose hunks must be exactly the plan's passages, and its lint runs on the
tree after each task, which is the file the hook will see. Checks 1 to 8 run
on the tree as for any plan; of check 9, the extracted-tree lint does not
apply to such a plan, and the trailing-whitespace and final-newline sweep
runs as for any plan.

Six things a passage plan's pass needs that a whole-file plan's does not.

1. **The diff form.** `git diff "$(git merge-base main HEAD)" -- <file>`
   compares the working tree with the merge base, so it is right both before and
   after a task's commit. `git diff main...HEAD` compares commits only and
   misses an uncommitted edit; the two-dot form differs again. A pre-commit
   verification step built on the three-dot form under-reports silently.
2. **The hunk count is a task-time check, never an invariant.** `git diff`
   merges two changed regions into one hunk when at most six unchanged lines
   separate them — three lines of context on each side; five and six give one
   hunk, seven gives two. A plan states the count it expects at each task and a
   reviewer reads the hunks.
3. **Hunk order is file order, not task order.** A passage written by a late
   task can sit above passages written by an early one, so an attribution by
   hunk index is wrong and no count can catch it. Match each hunk to a passage
   by its text.
4. **Reconstruct-and-compare**, the alignment check that replaces the extracted
   tree. Either replay the plan's old/new pairs onto the merge-base file and
   diff the result against the tree, or classify every `-U0` added and removed
   line against the union of the plan's blocks and require zero uncovered lines
   — the second form needs no knowledge of each passage's shape. One trap: an
   insertion's new block omits its anchor, so a naive replace drops it.
5. **A review method for the plan itself.** Apply the passages to copies of the
   files and re-run markdownlint with the repository configuration plus every
   string this note counts. That is the passage-plan analogue of check 9's
   extracted-tree lint, and one script settles what a spec otherwise asserts by
   reading.
6. **A flaw in the spec's own block is never a task-level edit.** In a passage
   plan the spec's bytes reach the tree verbatim, so a wording or wrapping flaw
   arrives with them — and the task that carries it is the one place it cannot
   be fixed, since an edit outside the passage breaks the invariant above. Such
   a flaw is a whole-branch-review item.

**Splice-and-compare, before a fix-wave list is dispatched.** A list of passage
edits can pass every command it specifies — old text present, new text absent,
line numbers holding — and still be wrong, because none of those commands reads
the replacement joined to the unchanged line that follows it. So for each item,
flatten the old text, splice in the item's stated change with `sed`, and
word-diff the result against the flattened new block; equality means no word was
gained or lost beyond the intended change. The failure this catches has a
mechanical cause: a replacement that widens a line inside a wrapped block
already at the file's ceiling pays for the width with a word, and the narrower
the ceiling the likelier it is. A fix that touches one line and leaves its
neighbours alone avoids it structurally.

**An absence check must be falsifiable at repository scope.** Pair every
"the new form is present" check with a `grep -rn` over the skill that must print
nothing, so the pass decides that the old form is gone everywhere rather than
that the new form arrived somewhere.

The index stores LF throughout, but the working tree is mixed file by file —
some paths are checked out with CRLF and some with LF. So every command below
that flattens a file strips CR first (`tr -d '\r'`), unconditionally: it is
required for the CRLF files and a no-op for the rest, and a flatten that omits
it returns a plausible `0` rather than an error. Never decide a line-ending
question with a grep for a control character, which in this shell matches every
line of an LF-only stream and so returns the line count; settle it with byte
counts instead — `git cat-file -s` against the piped byte count, or `od -c`.

A flattened `grep -cF` counts lines, so it returns `0` or `1`: it pins the
presence of a phrase that may wrap, never a per-file occurrence count. Count
the occurrences of a line that does not wrap with a raw `grep -cF` on the
file.

That mixture is an artifact, not a property, and a plan must not encode it as a
table. `core.autocrlf=true` is set globally on this machine and `.gitattributes`
gives `.md` only `* text=auto`, with per-file `eol=` for `*.sh` and `*.bat`
alone; every `.md` blob is `i/lf` in the index. So which files are checked out
CRLF depends on how each happened to be written here, and **a fresh Windows
clone checks out every `.md` as CRLF**. Any list of per-file endings is a
snapshot of one working tree. The deciding command is `git ls-files --eol <file>`
run before and after an edit: it must show the same `w/crlf` or `w/lf` as
before, and never `w/mixed`.

They also earn a run after a superpowers upgrade, because checks 4 and 5
compare text the skill quotes against the plugin's own source. A failure is one
of three things — a typo in the skill, a file a plan forgot, or a change in
superpowers. The third is never repaired by rewriting the quote; it is reported
as a ruling needed.

Adding a check is an edit to this file.

## Versions these checks assume

- **superpowers 6.3.0.** The quoted sentences in checks 4 and 5 were taken from
  that release. Its cached skills are at
  `$HOME/.claude/plugins/cache/claude-plugins-official/superpowers/6.3.0/skills`;
  on Windows the same directory is
  `C:\Users\<user>\.claude\plugins\cache\claude-plugins-official\superpowers\6.3.0\skills`.
  When the cache is absent, read the installed skills by hand and record
  `superpowers 6.3.0, cache absent, checked by hand` with the results.
- **`shoroku` in this repository**, at `skills/shoroku/SKILL.md`.
- **Sixteen skill files, ten of them templates**, as check 1 lists them.

## 1. Every file of the layout exists

```bash
ls skills/tanto/SKILL.md skills/tanto/README.md \
  skills/tanto/roles/kanri.md skills/tanto/roles/sekkei.md \
  skills/tanto/roles/jisso.md skills/tanto/roles/kaiseki.md \
  skills/tanto/templates/roster.md skills/tanto/templates/kanri.md \
  skills/tanto/templates/kanri-handover.md \
  skills/tanto/templates/bug-report.md \
  skills/tanto/templates/batch-prompt.md \
  skills/tanto/templates/batch-report.md \
  skills/tanto/templates/kaiseki-brief.md \
  skills/tanto/templates/kaiseki-report.md \
  skills/tanto/templates/review-brief.md \
  skills/tanto/templates/tanto.json 2>&1
```

Expected: all sixteen paths listed, no `No such file or directory`.

## 2. Every in-skill path named by the contract or a role file resolves

```bash
grep -oh 'roles/[a-z]*\.md\|templates/[a-z-]*\.md\|templates/tanto\.json\|skills/tanto/[a-z/-]*\.md\|skills/tanto/[a-z/-]*\.json' \
  skills/tanto/SKILL.md skills/tanto/README.md skills/tanto/roles/*.md \
  | sed 's|^skills/tanto/||' | sort -u \
  | while read -r p; do
      if [ -f "skills/tanto/$p" ]; then echo "ok       $p"; else echo "MISSING  $p"; fi
    done
```

Expected: fourteen `ok` lines — `roles/jisso.md`, `roles/kaiseki.md`,
`roles/kanri.md`, `roles/sekkei.md`, `templates/batch-prompt.md`,
`templates/batch-report.md`, `templates/bug-report.md`,
`templates/kaiseki-brief.md`, `templates/kaiseki-report.md`,
`templates/kanri-handover.md`, `templates/kanri.md`,
`templates/review-brief.md`, `templates/roster.md`, `templates/tanto.json` —
and **no** `MISSING` line. A `MISSING` line is either a typo in the reference
or a file the plan forgot.

## 3. Every template is cited by the role that copies it

```bash
while read -r tpl reader; do
  if grep -qF "$tpl" "$reader"; then echo "ok       $tpl <- $reader"; else echo "UNCITED  $tpl <- $reader"; fi
done <<'MAP'
templates/roster.md skills/tanto/roles/kanri.md
templates/kanri.md skills/tanto/roles/kanri.md
templates/kanri-handover.md skills/tanto/roles/kanri.md
templates/bug-report.md skills/tanto/roles/kanri.md
templates/batch-prompt.md skills/tanto/roles/kanri.md
templates/kaiseki-brief.md skills/tanto/roles/kanri.md
templates/review-brief.md skills/tanto/roles/kanri.md
templates/batch-report.md skills/tanto/roles/jisso.md
templates/kaiseki-report.md skills/tanto/roles/kaiseki.md
templates/tanto.json skills/tanto/SKILL.md
MAP
```

Expected: ten `ok` lines, no `UNCITED`. Seven of the ten are Kanri's, because
Kanri copies seven of the templates itself.

## 4. The superpowers and shoroku sentences the skill overrides still exist

Each line below is the distinctive sentence behind one row of
`roles/jisso.md`'s "What tanto overrides" table, plus the two files the role
files name by path. Shell state does not persist between tool calls, so set
`SP` in the same call as the greps. The task-reviewer-prompt line flattens the
file first, because that phrase wraps across a line break in the source; every
other line quotes text that already sits on one raw line, so a plain
`grep -cF` finds it directly.

```bash
SP="$HOME/.claude/plugins/cache/claude-plugins-official/superpowers/6.3.0/skills"
grep -cF 'Ensure the work happens in an isolated workspace' "$SP/subagent-driven-development/SKILL.md"
grep -cF 'Do not pause to check in with your human partner between tasks' "$SP/subagent-driven-development/SKILL.md"
grep -cF "delete this plan's workspace" "$SP/subagent-driven-development/SKILL.md"
grep -cF 'under "Rulings I made"' "$SP/subagent-driven-development/SKILL.md"
grep -cF 'Always specify the model explicitly when dispatching a subagent' "$SP/subagent-driven-development/SKILL.md"
grep -cF 'Five rounds maximum per task' "$SP/subagent-driven-development/SKILL.md"
tr -d '\r' < "$SP/subagent-driven-development/task-reviewer-prompt.md" | tr '\n' ' ' | tr -s ' ' | grep -cF 'Do not re-run the suite to confirm their report'
grep -cF 'Fix the root cause, not the symptom' "$SP/systematic-debugging/SKILL.md"
test -f "$SP/requesting-code-review/code-reviewer.md" && echo code-reviewer-present
grep -cF 'Direction?' skills/shoroku/SKILL.md
```

Expected, for the superpowers version named under "Versions these checks
assume": the counts `1 1 4 1 1 1 1 1`, then `code-reviewer-present`, then `1`.
**Any change in a count means superpowers or `shoroku` moved — not only a zero.**
A third line dropping from `4` to `2` is the overridden text moving, which is
exactly the drift this check exists to catch, and a "nonzero on every line"
expectation would wave it through. A version bump is expected to move these
counts: record the new ones here with the new version when it lands. Either way,
do not silently rewrite the role file — report which line changed.

## 5. The two verbatim quotes' pinned lines are present in every copy

```bash
SP="$HOME/.claude/plugins/cache/claude-plugins-official/superpowers/6.3.0/skills"
grep -cF 'that norms say you ask about first (a merge, a push to a shared branch, a' "$SP/subagent-driven-development/SKILL.md"
grep -cF 'that norms say you ask about first (a merge, a push to a shared branch, a' skills/tanto/roles/jisso.md
grep -cF 'that norms say you ask about first (a merge, a push to a shared branch, a' skills/tanto/SKILL.md
grep -cF 'Implementer subagents report one of four statuses. Handle each appropriately:' "$SP/subagent-driven-development/SKILL.md"
grep -cF 'Implementer subagents report one of four statuses. Handle each appropriately:' skills/tanto/roles/jisso.md
```

Expected: `1` on all five lines. The stop-classes line lives in three files —
the source, `roles/jisso.md`, and `SKILL.md` — and the four-statuses line in
two. This check pins one line of each quote per copy; whole-quote byte
identity is a plan's extraction-and-diff job, not this command's.

## 6. The strings the roles route on

```bash
grep -cF '<kanri-address>' skills/tanto/templates/batch-prompt.md
grep -cF '<kanri-address>' skills/tanto/templates/kaiseki-brief.md
grep -cF '<kanri-address>' skills/tanto/SKILL.md
grep -cF 'kanri-address:' skills/tanto/SKILL.md
grep -cF 'kanri-address:' skills/tanto/roles/sekkei.md
grep -cF 'kanri-address:' skills/tanto/roles/jisso.md
grep -cF 'kanri-address:' skills/tanto/roles/kaiseki.md
grep -cF 'bug-report:' skills/tanto/SKILL.md
grep -cF 'exit-<role>' skills/tanto/SKILL.md
grep -cF 'exit-<role>' skills/tanto/roles/kanri.md
grep -c '^## Residency$' skills/tanto/templates/roster.md
grep -c '^## Shoroku candidates$' skills/tanto/templates/roster.md
grep -cF -- '- Kanri — ' skills/tanto/templates/batch-prompt.md
grep -c '| Written |' skills/tanto/templates/kanri.md
grep -cF 'except the accepted subset of its own exit shoroku, at its exit' skills/tanto/SKILL.md
grep -cF 'no commit but its exit shoroku' skills/tanto/SKILL.md
grep -cF 'nothing to commit' skills/tanto/roles/sekkei.md
grep -cF 'nothing to commit' skills/tanto/roles/kanri.md
grep -cF 'nothing to commit' skills/tanto/SKILL.md
grep -cF 'human-needed:' skills/tanto/SKILL.md
grep -cF 'the human by grant' skills/tanto/SKILL.md
grep -cF 'Kanri <name> [<ref>] since <YYYY-MM-DD>:' skills/tanto/templates/roster.md
grep -cF 'Kanri <name> [<ref>] since <YYYY-MM-DD>:' skills/tanto/templates/kanri-handover.md
grep -cF '| S-n | Source | Candidate | Destination | Adopted | Stage | Written |' skills/tanto/templates/roster.md
grep -cF '| S-n | Source | Candidate | Destination | Adopted | Stage | Written |' skills/tanto/templates/kanri.md
grep -cF 'bug-report: <absolute path>' skills/tanto/SKILL.md
grep -cF 'bug-report: <absolute path>' skills/tanto/templates/bug-report.md
```

Expected, one number per line, in order: `2`, `1`, `1`, `2`, `1`, `1`, `1`,
`1`, `5`, `3`, `1`, `1`, `1`, `1`, `1`, `1`, `1`, `1`, `1`, `1`, `3`, `1`,
`1`, `1`, `1`, `1`, `1`. The six trailing `1`s pin the three cross-file pairs
— the Residency line, the seven-column `S-n` header, and the bug-report line
— each copy once, so that a change to one copy shows up as a mismatch. The
`--` before the
`- Kanri` pattern is required: without it `grep` reads the leading `-` as an
option.

The five triage answers, each exactly once in the contract:

```bash
for s in 'triage: issue-<id>' 'triage: redirect — <one line>' 'triage: kaiseki requested' 'triage: hotfix — <commit subject>' 'triage: relayed as I-<n>'; do
  printf '%s -> %s\n' "$s" "$(grep -cF "$s" skills/tanto/SKILL.md)"
done
```

Expected: five lines, each ending `-> 1`.

The human-access request line, byte-identical in the contract and the four
role files:

```bash
for f in skills/tanto/SKILL.md skills/tanto/roles/kanri.md skills/tanto/roles/sekkei.md skills/tanto/roles/jisso.md skills/tanto/roles/kaiseki.md; do
  printf '%s -> %s\n' "$f" "$(grep -cF 'human-needed: <what the human must do> — <why no other way> — <where: this window>' "$f")"
done
```

Expected: five lines, each ending `-> 1`.

The `kanri-address:` obligation sentence, byte-identical in the three peer
role files once each file's line wrapping is flattened — the sentence wraps at
a different column in each file, so a raw `grep -cF` returns 0:

```bash
for f in skills/tanto/roles/sekkei.md skills/tanto/roles/jisso.md skills/tanto/roles/kaiseki.md; do
  printf '%s -> %s\n' "$f" "$(tr -d '\r' < "$f" | tr '\n' ' ' | tr -s ' ' | grep -cF "A message whose first line is \`kanri-address: <name> [<ref>]\` replaces Kanri's address from then on; if a send to Kanri errors, re-read the roster's first data row.")"
done
```

Expected: three lines, each ending `-> 1`.

The rule behind the last two blocks, since both exist for the same reason: a
line that must stay byte-identical across files is either kept on **one** line,
where a plain `grep -cF` pins it, or its check flattens the file first. A
wrapped line cannot be pinned by `grep -cF` at all — no raw line carries it, so
the count is `0` in every copy and the check silently pins nothing.

The authority triad, which the rule above does **not** cover. Rule 11, Kanri's
"When the plan lands" step 1, and Sekkei's Step 3 bullet each name the same
three sources of authority, but they are not byte-identical — the subject
differs by role:

- `SKILL.md` — "the plan's Global Constraints, Kanri's orders line, and the
  batch prompts"
- `roles/kanri.md` — "the constraints, your orders line, and the batch prompts"
- `roles/sekkei.md` — "the constraints, Kanri's orders line, and the batch
  prompts"

So no full-string check can pin all three. Pin the common substring instead, and
add the absence check that makes a number disagreement visible:

```bash
for f in skills/tanto/SKILL.md skills/tanto/roles/kanri.md skills/tanto/roles/sekkei.md; do
  printf '%s -> %s\n' "$f" "$(tr -d '\r' < "$f" | tr '\n' ' ' | tr -s ' ' | grep -cF 'orders line, and the batch prompts')"
done
grep -rn 'orders lines' skills/tanto/
```

Expected: three lines, each ending `-> 1`, then no output at all from the
`grep -rn` (it exits 1). Both halves can fail, which is the point. A plural in
one copy of a phrase meant to agree is invisible to every other check here: it
was singular in seven of eight occurrences across the skill, six task reviews
read the passage carrying the plural, and only a whole-branch pass that could
see all three copies at once caught it.

The two lines of the review brief, and the idle subscription that only the
exit lines keep, each on one line where it occurs, counted raw over every
Markdown file of the skill so that a stray copy fails the check:

```bash
for f in skills/tanto/SKILL.md skills/tanto/roles/*.md skills/tanto/templates/*.md; do
  printf '%s review-ready %s brief %s idle %s\n' "$f" "$(grep -cF 'review-ready: <' "$f")" "$(grep -cF 'brief: <path>' "$f")" "$(grep -cF 'notify_when_idle: true' "$f")"
done
```

Expected: `skills/tanto/SKILL.md review-ready 1 brief 1 idle 2`,
`skills/tanto/roles/kanri.md review-ready 1 brief 1 idle 2`,
`skills/tanto/roles/sekkei.md review-ready 2 brief 2 idle 0`, and every other
line ending `review-ready 0 brief 0 idle 0`. The two `idle` in `SKILL.md`
are the Messages bullet's exception and the Session exit paragraph; the two
in `roles/kanri.md` are the exit lines. A batch prompt or a brief sent with a
subscription would show as a third.

## 7. The strings that must be absent

```bash
grep -rn '/rename' skills/tanto/
grep -rn -i 'four-session' skills/tanto/
grep -rn '<plan>' skills/tanto/
grep -n 'a rename observed' skills/tanto/templates/roster.md
grep -n 'uniqueness check, not an address book' skills/tanto/templates/roster.md
tr -d '\r' < skills/tanto/roles/kaiseki.md | tr '\n' ' ' | tr -s ' ' | sed 's/\*\*//g' | grep -o 'You do not commit'
tr -d '\r' < skills/tanto/roles/kaiseki.md | tr '\n' ' ' | tr -s ' ' | sed 's/\*\*//g' | grep -o 'never write under `docs/` yourself'
grep -nF 'Kaiseki itself never writes under' skills/tanto/roles/kanri.md
grep -rn 'skills/tanto/' skills/tanto/SKILL.md skills/tanto/roles skills/tanto/templates
grep -rnE '\b[0-9a-f]{7,40}\b' skills/tanto/
```

Expected: no output from the first nine (each exits 1). The sixth and
seventh flatten the file first and strip `**`, because their pre-images
— `You **do not commit**` with its bold markers, and
``never write under `docs/` yourself`` across a line break — would never
have matched a raw line. The tenth is read, not counted: no line may be
an actual commit hash. Tracked content carries commit subjects, never
hashes, and `<sha7>` inside a template blank is a placeholder, not a
hash. `<plan>` is checked because `<plan-basename>` is the only correct
form; runtime text is skill-relative, so only the skill's `README.md`
and this note may name `skills/tanto/`.

The one wording invariant that must be **present**:

```bash
grep -c 'multi-session orchestration' skills/tanto/SKILL.md skills/tanto/README.md
```

Expected, exactly:

```text
skills/tanto/SKILL.md:1
skills/tanto/README.md:1
```

Every `README.md` these checks name is the **skill's** own. The repository root
`README.md` is deliberately out of scope: it is not part of the skill's
delivered layout, no `tanto` plan may edit it, and nothing the skill does at
runtime depends on it. It describes the repository's skills for a reader — which
are host-agnostic and which are not — so it changes when the set of skills
changes, not when `tanto` does.

## 8. The frontmatter and the JSON parse

```bash
uv run --no-project --with pyyaml python -c "import yaml;t=open('skills/tanto/SKILL.md',encoding='utf-8').read().split('---')[1];d=yaml.safe_load(t);print(sorted(d));print('BAD' if ': ' in d['description'] else 'ok')"
uv run --no-project python -c "import json;json.load(open('skills/tanto/templates/tanto.json'));print('json ok')"
```

Expected: `['argument-hint', 'description', 'name']`, then `ok`, then
`json ok`. A colon followed by a space anywhere in the `description` value
breaks frontmatter parsing silently, which is what the second line prints
`BAD` for. When `--with pyyaml` cannot fetch PyYAML, fall back to
`sed -n 's/^description: //p' skills/tanto/SKILL.md | grep -c ': '`, expect
`0`, and record the fallback.

Use `uv run --no-project`, never a bare `python`.

## 9. Linting an extracted tree

The extraction method's third leg. `scripts/lint.sh` runs pre-commit, which
takes only paths inside the repository, so a scratch tree of blocks extracted
from a plan cannot go through it. The markdownlint-cli2 the hook uses is
installed in the pre-commit cache; run it on the scratch tree with the
repository's configuration, whose `ignores` still apply (templates and
`docs/superpowers/**` are skipped there too):

```bash
ML=$(ls ~/.cache/pre-commit/repo*/node_env-default/Scripts/markdownlint-cli2 | head -1)
"$ML" --config "$(git rev-parse --show-toplevel)/.markdownlint-cli2.yaml" skills/tanto/SKILL.md skills/tanto/README.md skills/tanto/roles/*.md docs/notes/tanto-consistency-checks.md
```

Expected: `Summary: 0 error(s)`. The `repo*` directory is named after the
hook's `rev` and changes whenever it does, so glob for it rather than naming
it; on a POSIX host the executable sits under `bin/` instead of `Scripts/`.
The config path comes from `git rev-parse --show-toplevel` so the block is
copy-pasteable and still never embeds a home directory.

Two notes on this block. Its argument list is the tree's **real** paths, which
is why it can be run as-is against the repository; a scratch tree substitutes
its own paths there, and the heading and the arguments otherwise disagree. And
`markdownlint-cli2` from the cache, run **without** `--fix`, is the right
instrument for a **read-only reviewer**: four of `scripts/lint.sh`'s hooks
mutate files, so a review seat forbidden to touch the tree cannot run the
repository's own lint entry point at all.

Trailing whitespace and the final newline are the two things markdownlint
does not check and the hooks fix silently:

```bash
find skills docs -name '*.md' -print0 | while IFS= read -r -d '' f; do
  [ "$(grep -c '[[:space:]]$' "$f")" != "0" ] && echo "trailing whitespace: $f"
  [ "$(tail -c1 "$f" | od -An -c | tr -d ' ')" != '\n' ] && echo "no final newline: $f"
done; echo done
```

Expected: `done` alone. A block that passes here survives `markdownlint
--fix` on commit byte for byte, which is what a complete-contents plan
promises. The loop reads a NUL-delimited list rather than an unquoted
`$(find ...)`, which would word-split on any path containing a space; none of
the repository's Markdown files has one today, so this is a latent case closed
rather than a bug fixed.
