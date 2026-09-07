# tanto consistency checks

Every mechanical check on the `tanto` skill, in one place, so that a plan which
edits `skills/tanto/` runs the whole set as one task instead of restating the
commands. Run them from the repository root, in the order below, and record
each command's output: the output is the deliverable of a consistency pass.

Three uses run the same extraction method — every fenced block of the plan
pulled into a scratch tree, diffed against `HEAD`, and these commands run
there: Sekkei's plan review before the plan is committed, Jisso's pre-flight
before its first task, and the conductor's pre-flight at each boundary before
a batch is accepted.

On this working tree files may be checked out with CRLF, so every command
below that flattens a file strips CR first (`tr -d '\r'`); the counts do not
depend on the checkout.

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
- **Fifteen skill files, nine of them templates**, as check 1 lists them.

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
  skills/tanto/templates/tanto.json
```

Expected: all fifteen paths listed, no `No such file or directory`.

## 2. Every in-skill path named by the contract or a role file resolves

```bash
grep -oh 'roles/[a-z]*\.md\|templates/[a-z-]*\.md\|templates/tanto\.json\|skills/tanto/[a-z/-]*\.md\|skills/tanto/[a-z/-]*\.json' \
  skills/tanto/SKILL.md skills/tanto/README.md skills/tanto/roles/*.md \
  | sed 's|^skills/tanto/||' | sort -u \
  | while read -r p; do
      if [ -f "skills/tanto/$p" ]; then echo "ok       $p"; else echo "MISSING  $p"; fi
    done
```

Expected: thirteen `ok` lines — `roles/jisso.md`, `roles/kaiseki.md`,
`roles/kanri.md`, `roles/sekkei.md`, `templates/batch-prompt.md`,
`templates/batch-report.md`, `templates/bug-report.md`,
`templates/kaiseki-brief.md`, `templates/kaiseki-report.md`,
`templates/kanri-handover.md`, `templates/kanri.md`, `templates/roster.md`,
`templates/tanto.json` — and **no** `MISSING` line. A `MISSING` line is either
a typo in the reference or a file the plan forgot.

## 3. Every template is cited by the role that copies it

```bash
while read -r tpl reader; do
  if grep -q "$tpl" "$reader"; then echo "ok       $tpl <- $reader"; else echo "UNCITED  $tpl <- $reader"; fi
done <<'MAP'
templates/roster.md skills/tanto/roles/kanri.md
templates/kanri.md skills/tanto/roles/kanri.md
templates/kanri-handover.md skills/tanto/roles/kanri.md
templates/bug-report.md skills/tanto/roles/kanri.md
templates/batch-prompt.md skills/tanto/roles/kanri.md
templates/kaiseki-brief.md skills/tanto/roles/kanri.md
templates/batch-report.md skills/tanto/roles/jisso.md
templates/kaiseki-report.md skills/tanto/roles/kaiseki.md
templates/tanto.json skills/tanto/SKILL.md
MAP
```

Expected: nine `ok` lines, no `UNCITED`. Six of the nine are Kanri's, because
Kanri copies six of the templates itself.

## 4. The superpowers and shoroku sentences the skill overrides still exist

Each line below is the distinctive sentence behind one row of
`roles/jisso.md`'s "What tanto overrides" table, plus the two files the role
files name by path. Shell state does not persist between tool calls, so set
`SP` in the same call as the greps.

```bash
SP="$HOME/.claude/plugins/cache/claude-plugins-official/superpowers/6.3.0/skills"
grep -cF 'Ensure the work happens in an isolated workspace' "$SP/subagent-driven-development/SKILL.md"
grep -cF 'Do not pause to check in with your human partner between tasks' "$SP/subagent-driven-development/SKILL.md"
grep -cF "delete this plan's workspace" "$SP/subagent-driven-development/SKILL.md"
grep -cF 'under "Rulings I made"' "$SP/subagent-driven-development/SKILL.md"
grep -cF 'Always specify the model explicitly when dispatching a subagent' "$SP/subagent-driven-development/SKILL.md"
grep -cF 'Five rounds maximum per task' "$SP/subagent-driven-development/SKILL.md"
grep -cF 'Fix the root cause, not the symptom' "$SP/systematic-debugging/SKILL.md"
test -f "$SP/requesting-code-review/code-reviewer.md" && echo code-reviewer-present
grep -cF 'Direction?' skills/shoroku/SKILL.md
```

Expected: a nonzero count on every `grep` line, and `code-reviewer-present`. A
zero means superpowers or `shoroku` moved: do not silently rewrite the role
file — report which line no longer matches.

## 5. The two verbatim quotes are byte-identical in every copy

```bash
SP="$HOME/.claude/plugins/cache/claude-plugins-official/superpowers/6.3.0/skills"
grep -cF 'that norms say you ask about first (a merge, a push to a shared branch, a' "$SP/subagent-driven-development/SKILL.md"
grep -cF 'that norms say you ask about first (a merge, a push to a shared branch, a' skills/tanto/roles/jisso.md
grep -cF 'that norms say you ask about first (a merge, a push to a shared branch, a' skills/tanto/SKILL.md
grep -cF 'Implementer subagents report one of four statuses. Handle each appropriately:' "$SP/subagent-driven-development/SKILL.md"
grep -cF 'Implementer subagents report one of four statuses. Handle each appropriately:' skills/tanto/roles/jisso.md
```

Expected: `1` on all five lines. The stop-classes line lives in three files —
the source, `roles/jisso.md`, and `SKILL.md`, whose copies are the same bytes
including the line breaks — and the four-statuses line in two.

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

## 7. The strings that must be absent

```bash
grep -rn '/rename' skills/tanto/
grep -rn -i 'four-session' skills/tanto/
grep -rn '<plan>' skills/tanto/
grep -n 'a rename observed' skills/tanto/templates/roster.md
grep -n 'uniqueness check, not an address book' skills/tanto/templates/roster.md
tr -d '\r' < skills/tanto/roles/kaiseki.md | tr '\n' ' ' | tr -s ' ' | sed 's/\*\*//g' | grep -n 'You do not commit'
tr -d '\r' < skills/tanto/roles/kaiseki.md | tr '\n' ' ' | tr -s ' ' | grep -n 'never write under `docs/` yourself'
grep -nF 'Kaiseki itself never writes under' skills/tanto/roles/kanri.md
grep -rn 'skills/tanto/' skills/tanto/SKILL.md skills/tanto/roles skills/tanto/templates
grep -rnE '\b[0-9a-f]{7,40}\b' skills/tanto/
```

Expected: no output from the first nine (each exits 1). The sixth and seventh
flatten the file first, because their pre-images — `You **do not commit**` with
its bold markers, and `never write under`docs/`yourself` across a line
break — would never have matched a raw line; the sixth also strips `**`. The
tenth is read, not counted: no line may be an actual commit hash. Tracked content carries commit
subjects, never hashes, and `<sha7>` inside a template blank is a placeholder,
not a hash. `<plan>` is checked because `<plan-basename>` is the only correct
form; runtime text is skill-relative, so only the skill's `README.md` and this
note may name `skills/tanto/`.

The one wording invariant that must be **present**:

```bash
grep -c 'multi-session orchestration' skills/tanto/SKILL.md skills/tanto/README.md
```

Expected, exactly:

```text
skills/tanto/SKILL.md:1
skills/tanto/README.md:1
```

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
"$ML" --config /path/to/dotskills/.markdownlint-cli2.yaml skills/tanto/SKILL.md skills/tanto/README.md skills/tanto/roles/*.md docs/notes/tanto-consistency-checks.md
```

Expected: `Summary: 0 error(s)`. The `repo*` directory is named after the
hook's `rev` and changes whenever it does, so glob for it rather than naming
it; on a POSIX host the executable sits under `bin/` instead of `Scripts/`.
Replace `/path/to/dotskills` with the repository root — never commit a home
directory.

Trailing whitespace and the final newline are the two things markdownlint
does not check and the hooks fix silently:

```bash
for f in $(find skills docs -name '*.md'); do
  [ "$(grep -c '[[:space:]]$' "$f")" != "0" ] && echo "trailing whitespace: $f"
  [ "$(tail -c1 "$f" | od -An -c | tr -d ' ')" != '\n' ] && echo "no final newline: $f"
done; echo done
```

Expected: `done` alone. A block that passes here survives `markdownlint
--fix` on commit byte for byte, which is what a complete-contents plan
promises.
