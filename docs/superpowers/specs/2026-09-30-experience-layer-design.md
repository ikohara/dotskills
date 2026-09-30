# Design: experience-layer — `docs/requirements/` becomes `docs/experience/`: the goal layer, its Sources, shoroku's fourth extraction target, and the dotskills migration inside the plan

Written 2026-09-30 by Sekkei `dotskills-4e [dc1529]` on fable, effort high,
at `docs/superpowers/specs/2026-09-30-experience-layer-design.md`, on the
branch `experience-layer`, cut from `main` on 2026-09-22 when
`tanto-bg-seats`'s checkout freed — no batch is in flight (this topic's
ledger, Progress 2026-09-30). The topic holds slot 9 of the order
`.tanto/kikaku/2026-09-20-topic-order-bg-seats-eighth.md` holds, after
`bg-seat-fixes` (closed 2026-09-30).

Its inputs are four files and one dialogue, and this spec cites them by these
names:

- **the decision file** — `.tanto/kikaku/2026-09-15-experience-layer.md`,
  the primary T0 input: the scope split, the layer, the files, the
  expectations, the identifiers, the Sources, shoroku's fourth target, kisou
  and the chat side, the dotskills migration, the tanto riders, the nine
  confirmed lines, the resolved open questions, the standing issues, the
  rejected alternatives, and the exit criterion — its §1 to §15;
- **the input** — `.tanto/kikaku/2026-09-15-shoroku-experience-input.md`,
  the handover from the chat of 2026-09-13 to 2026-09-15, **untracked and
  never committed**, kept on disk by the human's word: §1 the seven scenes,
  the five Drivers and the four Won't items that become the first content of
  `docs/experience/`; §2 the chat's reasoning; §4 the verbatim Japanese
  quotes keyed by item id that become their Sources;
- **the rider files** —
  `.tanto/kikaku/2026-09-19-ttl-regimes-issue-yield-and-kanri-daemon.md` §4
  and `.tanto/kikaku/2026-09-17-issue-source-line.md` §1 and §5: the one
  sentence for kisou's shipped `templates/docs/issues/AGENTS.md`, "the body
  opens with a `Source:` line", handed to this topic because it edits those
  templates anyway;
- **the wait list** — `.tanto/kikaku/2026-09-14-topics-after-hardening.md`
  §2, the issues held for this rethink;
- **the dialogue** — `.tanto/experience-layer/dialogue.md`: Q1 to Q3 and
  the three design sections, cited as Q1 to Q3 and D-1 to D-6.

Kanri and Jisso cold-read this document. It names every file it changes,
gives the text of every rule it adds, and says what the plan must contain.
Where it quotes the decision file it does so because the plan's writer and
the implementer read this file and not that one; where a passage is long —
the seven scenes, the quotes — it points at the input, which stays on disk.

## Fixed inputs

These are settled. Nothing below re-argues them; the plan inherits them
whole. Each names the decision-file section or the dialogue question that
settled it and the requirement bullet of `req-1a2b` or `req-3c4d` it serves,
or says that none does. (Those two files are folded into `docs/experience/`
by this plan's batch C; until then they are the requirement register, and the
brief's third section reads the pairing from here.)

1. **The scope is the layer, and only the layer** (the decision file §1).
   Type rename, scenes, expectations, Sources, trust tags, shoroku's fourth
   target, the dotskills migration, the kisou template and check updates.
   The design-side restructuring (hub-as-map, invariants-only spokes,
   `docs/design.md`, input question f2ed) and the tooling (layer lint,
   `lint --fix`, caps enforcement, prune reports, a kisou migrate that
   renames a type) are later topics. Serves `req-1a2b` "Single source of
   truth — kisou owns the entire bundled template including the `docs/`
   doc-management system": the layer ships as part of that template.
2. **The name is `docs/experience/`, the hub `docs/experience.md`, the
   prefix `exp`** (the decision file §2, §3; input question d78e). Singular,
   a mass noun like `design/`; the countable things are the scenes. Serves
   the input's `891a` — MUST NOT call this layer "requirements" — which
   batch A writes as a `[stated]` expectation; no `req-` bullet today.
3. **A scene is a situation, not a feature and not a quality attribute**
   (§2; input question e223). Quality attributes survive as `tags`. The caps
   — 5 to 10 scenes per project, a scene at most a page, 3 to 7 expectations
   per scene, at most 5 MUST-level Drivers in the hub — are wording in the
   type rules, not lint. Serves none directly; it is the shape `req-3c4d`'s
   "classify fragments as exactly one of the four managed types" classifies
   into.
4. **The hub is hand-written entirely, with no scene index and no generated
   region** (§3; input question efde). `## Cast`, `## Drivers`, `## Won't`;
   Drivers are generalized items in their own words, each pointing with `←`
   at the expectations it generalizes. `docs/experience/README.md` and a
   free-text section in `docs/experience/AGENTS.md` are rejected. Serves
   the input's `48b2` and `c018` — keep the always-read set small; no
   `req-` bullet today.
5. **Scenes are id-keyed managed files with a fixed body order and no
   `status`** (§3). `docs/experience/<id>-<slug>.md`; frontmatter `id`
   (quoted), `title`, `created`, `updated`, `actors`, `tags`; body
   `## Scene`, `## Expectations`, `## Open questions`, `## Sources`, in that
   order, Sources last. A scene is draft while it holds no `[stated]` or
   `[confirmed]` line; a superseded scene is rewritten or deleted. Serves
   `req-1a2b` "Migrate is non-destructive" indirectly: the same
   `<id>-<slug>` shape the other managed types have is what the doc-system
   check already handles.
6. **Strength words are RFC 2119; Kano is a guide for choosing the word;
   the question pair is rejected** (§4). MUST / MUST NOT are constraints,
   SHOULD / SHOULD NOT concerns weighed not obeyed, MAY an option. Serves
   none.
7. **Three trust tags, and an inferred expectation is capped at SHOULD until
   confirmed** (§4). `[stated]` a verbatim quote backs it; `[inferred]` the
   agent assembled it, Sources name the basis and a one-line reason;
   `[confirmed]` inferred, then confirmed by the human. MUST-level strength
   on the agent's own inference is the failure the input's Scene E names.
   Serves `req-3c4d` "without ever inventing content" — an inference is
   marked as one and cannot carry a constraint's weight.
8. **The vocabulary check** (§4; issue-c9df proposal 3). An expectation that
   names a path, a command, a config key, a file format, a role count, or a
   tool by name reads as design; the proposal offers it as a design
   candidate or in an abstract rewrite beside the concrete one. Serves
   `req-3c4d` "classify fragments as exactly one of the four managed types".
9. **Open questions live inline in the scene; the resolving apply appends
   `→ decision-<id>`; the line is never deleted** (§4; input question df97).
   An open question that needs tracking also becomes an issue, at the
   human's word. Serves none.
10. **One id pool across `docs/` for generation; resolution stays by
    prefix; a new id contains a letter** (§5). A new id — document or item —
    is checked against the whole tree; references always carry `<type>-`, so
    an older cross-type collision elsewhere breaks nothing; an all-digit
    `#1234` autolinks to a GitHub issue, so a new id carries at least one of
    `a` to `f`; existing all-digit ids stay. Measured 2026-09-30: no
    cross-type collision in this repository, none of the input's item ids
    collides with a document id, none is all-digit. Serves `req-1a2b`
    "Single source of truth": the rule is template text.
11. **An item is `exp-<item-id>`, one form, resolved by lookup** (§5). A
    file `docs/experience/<id>-*.md`, else a `**<id>**` line inside one or in
    the hub. The input's `experience-<slug>#<id>` is rejected. Serves none.
12. **Sources** (§6). Every scene ends with `## Sources`; an ADR may carry
    `## Sources` after Consequences; entries are verbatim quotes keyed by the
    item ids they back; an inferred item's entry names its basis and says
    "not stated directly". Japanese lives only in Sources; no `.ja.md`. The
    reading rule — do not read Sources unless verifying provenance — is in
    the type rules and `docs/AGENTS.md`. A correction the human gives at
    `Direction?` in the existing edit syntax becomes the item's `[stated]`
    source, quoted as given; a redaction is the human's. Serves the input's
    `1fb1` (MUST let the maintainer see his own words behind any claim the
    agent wrote on his behalf), `a545`, `ae58`, `b6bf`; no `req-` bullet
    today.
13. **shoroku's fourth target, with inference allowed for it alone** (§7).
    The classification rule lives in `docs/experience/AGENTS.md`;
    `SKILL.md` gains at most the sentence that the fourth target exists and
    defers to the type file; decisions stay stated-only; confirmation is the
    existing gate — `Direction?` in session mode, the `Unsure` group and the
    direction file in recommend and apply mode; an inferred candidate and a
    mechanism-laden candidate go to `Unsure` with the reason named. Serves
    `req-3c4d` "classify fragments as exactly one of the four managed
    types" and "Present a single numbered proposal", which Requirements
    below rewrites.
14. **The pairing is rewritten to name an expectation** (§1's first cost;
    §7). A design `## Section` names the `exp-<id>` — scene or item — it
    serves, or says it serves none; the proposal flags the unpaired among
    its own entries, never the standing tree. Serves `req-3c4d` "The
    proposal names, per `design` entry, the requirement it serves".
15. **kisou scaffold ships the layer; kisou migrate learns no rename** (§8).
    `templates/docs/experience/AGENTS.md` replaces the requirements template;
    a hub skeleton; `{{experience}}` in the case mapping in place of
    `{{requirements}}`; CONTRIBUTING's line; `doc-system-check.js`'s `TYPES`
    and its tests; `docs/AGENTS.md`'s type table and examples. Other kisou
    projects migrate lazily, by hand, as their own topic. Serves `req-1a2b`
    "Single source of truth" and "Re-running migrate ... refreshes it toward
    the current template" — which is why the hub is *not* a refreshed copy
    (section 2 below).
16. **The chat side emits a handover; ingestion is shoroku's file mode**
    (§8; input questions f33b, 2b72). The artifact given to claude.ai is
    `docs/experience/AGENTS.md` plus the hub skeleton, not kisou's
    `SKILL.md`. Nothing in this repository changes for it beyond those two
    files being self-sufficient. Serves `req-3c4d` "file (one or more named
    Markdown sources)".
17. **The dotskills migration runs inside this plan, by hand** (§9; input
    questions f29f, f3bd), in the shape Q1 settled: **D-1 = (A)** — a
    recommend-mode run as a batch task, the human's answer between two
    batches, a direction file, the apply as the next batch. Serves
    `req-1a2b` "Migrate is non-destructive — show diffs and ask before
    modifying existing files".
18. **The five requirement files' `req-` mentions in open issues are
    rewritten from a five-entry file map** (Q3, **D-3 = (a)**): the
    recommend run names, per requirement file, the one hub or scene its
    purpose folds into; the apply batch rewrites every `req-<file id>` in
    `docs/issues/open/` and `docs/issues/deferred/` from that map. Design
    sections take their target from the pairing pass instead. ADR bodies
    and dated reports are not edited; `docs/AGENTS.md` carries the legacy
    sentence. Serves none.
19. **The §1 scenes are committed in batch A, not re-proposed by the run**
    (D-4, the one deviation from §9 step 2). The decision file §11 confirmed
    all nine inferred lines and did not re-ask the stated ones; a second
    confirmation of the same seven scenes would cost the human what it
    already paid. The run reads them as baseline and may propose edits to
    them. Serves the input's `802f` — SHOULD NOT ask a question whose answer
    is already recorded.
20. **The wait list, settled** (Q2, **D-2**): issue-3bbb and issue-a331
    enter; issue-320e is absorbed; issue-c9df closes with proposals 1, 2, 3
    and 5 met and proposal 4 rejected (Issues this design closes); issue-2c4d
    is named and not solved; issue-c4b2, issue-13a1, issue-e916, issue-0d43,
    issue-52fd, issue-abaf stay out, each for the reason Out of scope gives.
21. **The tanto riders stay out of this plan** (the decision file §10, §15;
    "Where it sits in the queue"). The T1 Sources sentence and the T2
    `exp-` citation count are for the orders line of the next tanto topic;
    Deferred items names them for Kanri.
22. **The rider sentence** (the rider files). `templates/docs/issues/AGENTS.md`'s
    Body section gains "the body opens with a `Source:` line" with the four
    kinds `scripts/check_md_frontmatter.py` already enforces. The check and
    the retrofit landed with `bug-report-hold`; this is the template's
    sentence only. Serves `req-3c4d` "Every issue opens with its
    provenance".
23. **The exit criterion is §15's two tiers, and it is written down as a
    note** (the decision file §15; D-6). Primary: `exp-` items a topic's
    documents cite that the human did not raise in that topic's dialogue;
    zero across several consecutive topics is the fold-back signal.
    Secondary: the counts the artifacts already carry, compared within one
    model family. Not used: "I rejected that already" remarks. Serves none.

## Measured while designing

Measured 2026-09-30 on `main` at `0c492cb`, before any edit.

- `docs/requirements/` holds five files, 443 lines: `04f5-tanto.md` 192,
  `3c4d-shoroku.md` 64, `1a2b-kisou.md` 49, `5e6f-wayaku.md` 41,
  `7a8b-automated-release.md` 35; each has `## Purpose`,
  `## Required behavior`, `## Out of scope`. Plus `AGENTS.md`, 62 lines.
- `req-` references by document class: living documents 68 lines
  (`docs/design/` 29 — tanto 22, kisou 3, shoroku 3, automated-release 1;
  `docs/issues/open/` 38 lines in 37 files; `docs/issues/deferred/` 1);
  ADRs 38 lines in 23 files; dated reports 3 files; `docs/superpowers/**`
  the rest, outside the six types. By id: `req-04f5` 275, `req-3c4d` 51,
  `req-1a2b` 40, `req-d4e5` 1 (the example in `docs/AGENTS.md`), `req-7a8b`
  1, `req-5e6f` 1.
- Design `## Section` count: `4807-tanto` 24, `dc5d-install-scripts` 9,
  `c1d2-kisou` 8, `e3f4-shoroku` 7, `a5b6-automated-release` 5 — 53
  sections for the issue-320e pass. Some already carry a `Serves req-…`
  line already; the pass rewrites those and adds the rest.
- The installed `docs/AGENTS.md` and five `docs/<type>/AGENTS.md` are
  byte-equal to their templates up to `{{name}}` expansion (`diff` after
  CRLF folding shows only `{{…}}` lines). The pre-commit hook
  `kisou-doc-system-check` runs
  `node skills/kisou/scripts/doc-system-check.js check --docs docs --case snake_case`
  on any commit touching `skills/kisou/templates/docs/`, the script, or an
  installed copy, and fails on drift. So the rename's template, script, and
  copy edits are **one commit**.
- `doc-system-check.js` is 824 lines; `TYPES` at line 22 is the one list of
  type names; `targetSet(kase)` builds the seven `{type, template, target}`
  entries from it; a missing target is a `create` item; `notes` are printed
  after the items, unnumbered, and counted in the `<n> items, <m> notes`
  line. Its test is 894 lines and names `requirements` in about 25 places.
- `scripts/check_md_frontmatter.py` validates YAML-mapping frontmatter on
  every Markdown file and the `Source:` line on open and deferred issues,
  with the four kinds `inbox`, `shoroku`, `hotfix`, `session`; it applies no
  per-type schema, so a scene's `actors` and `tags` lists need no change.
- `.markdownlint-cli2.yaml` ignores `docs/superpowers/**`,
  `skills/tanto/templates/**`, and `skills/kisou/templates/*.md` — the
  doc-system templates under `skills/kisou/templates/docs/` **are** linted,
  and so will the hub template be.
- kisou `SKILL.md` names `requirements` in Step 2's mapping list, Step 3
  (scaffold) item 3, and the migrate doc-system bullets; its Scope bullet
  still promises the issue-status skeleton (issue-3bbb) and the `none`
  bullet says "all seven targets" (issue-a331). shoroku `SKILL.md` names
  requirements in its description, Step 3, and the recommend-mode
  paragraph's `req-<id>` pairing; shoroku's README names the four managed
  types on lines 9 to 10.
- No id collides across the four managed types; none of the input's §1
  item ids (29 expectations, 5 drivers, 4 won't items, 1 open question)
  collides with a document id; none is all-digit.
- Of the wait list, issue-4b91 and issue-c583 are already resolved.

## 1. The layer: what a reader finds

After batch C, a reader of this repository finds:

```text
docs/experience.md                    — the hub: Cast, Drivers, Won't; hand-written; no id
docs/experience/AGENTS.md             — the type rules (kisou-managed copy)
docs/experience/<id>-<slug>.md        — one scene per situation
docs/design/…                         — each ## Section names the exp-<id> it serves, or "serves none"
docs/decisions/…                      — may end with ## Sources
docs/issues/…                         — req- mentions rewritten to exp-; Source: line as before
docs/AGENTS.md                        — six types still: experience, design, decisions, issues, notes, reports
```

`docs/requirements/` is gone. The six types stay six: `experience` takes
`requirements`'s place among the four managed types; the hub is one fixed
file beside the directory, listed in the type table and owned by no type
rule other than `docs/experience/AGENTS.md`'s **The hub** section.

A scene, in the form batch A writes the seven of the input's §1:

```markdown
---
id: "a1b2"
title: being asked, and asked again
created: 2026-10-01
updated: 2026-10-01
actors: [maintainer, agent]
tags: [user-effort, memory]
---

## Scene

The agent, being careful, asks the maintainer about the same preference it
asked about last week. …

## Expectations

- **75bc** [stated] SHOULD capture the reasons from the conversation the
  agent already has, not through a separate interview step.
- **802f** [confirmed] SHOULD NOT ask a question whose answer is already
  recorded.

## Open questions

- **2b72** Should the chat side write scene files directly, or always go through the handover?

## Sources

- [75bc] 「可能なら、その明文化を独立したステップに置かず、Shoroku の中で会話の中からAIが抽出してくれるのが理想だ」 (chat, 2026-09-13)
- [802f] inferred from 75bc and 0cfa; not stated directly. Confirmed 2026-09-15 (Kikaku, `2026-09-15-experience-layer.md` §11).
```

The ids above are the input's own; the plan writes the seven scenes with the
input's ids, titles from its scene headings, `actors` and `tags` chosen by
the implementer from the scene's text, and `created` = `updated` = the
commit date. Scene A's `2b72` is the one open question the input carries;
the decision file §12 resolved it (f33b), but no ADR records that yet, so
batch A writes the line with no arrow, and the close's apply appends
`→ decision-<id>` when it writes the ADR of The ADRs 7 — the rule of
section 2's Expectations, applied for the first time.

## 2. `skills/kisou/templates/docs/experience/AGENTS.md` — the type rules, new

Replaces `templates/docs/requirements/AGENTS.md`, which is deleted. Every
heading below is a fixed section a future refresh identifies by name; bodies
may be edited later, headings never renamed. The file is also what the chat
side is given (Fixed input 16), so it stands alone: a reader who has only it
and the hub skeleton can write a scene in the format.

The text, with `{{docs}}`, `{{experience}}`, `{{design}}`, `{{decisions}}`,
`{{issues}}` where the other templates use them:

````markdown
# {{experience}}/ — AGENTS

An `experience` file is a **scene**: someone is in a situation, wants
something, and something would upset them. It is the goal layer — background,
purpose, constraints, from an actor's viewpoint — and never the machine: no
mechanism, no "the system shall". Developer experience counts as much as
end-user experience. How the system meets a scene is `{{design}}/`; why a
choice was made is `{{decisions}}/`.

## File

- Path: `{{docs}}/{{experience}}/<id>-<slug>.md`. Reference prefix: `exp`.
  See the top-level `AGENTS.md` for `<id>` generation, slug rules, and the
  `<type>-<id>` reference convention.
- Granularity: **one file per situation** — cold-start,
  returning-after-months, interrupted-work — not per feature and not per
  quality attribute (those are `tags`). A project has about 5 to 10 scenes;
  a scene is at most a page and carries 3 to 7 expectations. These are
  judgments, not limits a tool enforces: past them, fold, split, or delete.
- No index file. The hub (below) is not one.

## Frontmatter

```yaml
id: "a1b2"
title: <situation, as a phrase>
created: 2026-05-27
updated: 2026-05-27
actors: [maintainer]
tags: [user-effort]
```

- `id` is a quoted string. `created` / `updated` are `YYYY-MM-DD` (UTC);
  set `updated` to today on edit.
- `actors` names who is in the scene, from the hub's Cast. `tags` are the
  quality attributes and areas the scene touches, for retrieval; free
  vocabulary, kebab-case.
- No `status` field. A scene is a draft while it holds no `[stated]` or
  `[confirmed]` line, and nothing else marks it.

## Body

Start directly after the frontmatter — no body `# heading` (markdownlint
`MD025`). Four sections, in this order, Sources last so that a heading-wise
reader can take a scene without it:

```text
## Scene           — present tense, the actor's viewpoint, what would upset them; no mechanism
## Expectations    — one line per expectation, the form below
## Open questions  — what is undecided, inline; may be empty
## Sources         — verbatim quotes keyed by item id; the only place for a language other than the docs'
```

Do not define terms ("what is a user", "what is effort"). Write the
situation the way the actor would tell it.

## Expectations

One line each:

```text
- **<id>** [stated|inferred|confirmed] MUST|MUST NOT|SHOULD|SHOULD NOT|MAY <what, from the actor's side>
```

- **Strength** is RFC 2119. MUST / MUST NOT is a constraint: a design that
  breaks it is wrong. SHOULD / SHOULD NOT is a concern: weighed, not obeyed
  — a design may set it aside for a reason it states. MAY is an option the
  actor would welcome. Choosing the word: what the actor takes for granted
  and would be upset to lose → MUST; what they would be happier with, in
  proportion → SHOULD; what would delight and whose absence goes unnoticed →
  MAY; what would upset them if present → MUST NOT; what they do not care
  about → leave it out.
- **Trust tag.** `[stated]` — a verbatim quote in Sources backs the line.
  `[inferred]` — the agent assembled it from remarks that do not say it;
  Sources names the basis items and gives a one-line reason. `[confirmed]`
  — inferred, then confirmed by the human. **An `[inferred]` expectation is
  SHOULD or SHOULD NOT at most**; a constraint on the agent's own inference
  is the mistake this tag exists to prevent. The human's answer at
  `Direction?` is the confirmation: an accepted `[inferred]` line becomes
  `[confirmed]`; a line the human corrected becomes `[stated]`, the
  correction quoted in Sources as given; an unanswered line stays
  `[inferred]`.
- **Vocabulary.** An expectation that names a path, a command, a config
  key, a file format, a role count, or a tool by name reads as design.
  Offer it as a `{{design}}/` candidate, or in an abstract rewrite beside the
  concrete one, and let the human pick.
- **Open questions** are lines under their own heading, `- **<id>** <the
  question>`. When a decision resolves one, the writer of that decision
  appends `→ decision-<id>` to the line; the line is never deleted. An open
  question that needs tracking — blocked work, a claim — is also an issue,
  at the human's word.

## Sources

- One entry per item id, in the order the items appear:
  `- [<id>] 「<verbatim quote>」 (<where and when>)` for a stated item;
  `- [<id>] inferred from <ids> and 「<quote>」; not stated directly` for an
  inferred one, with the confirmation noted when it came.
- Quotes are the actor's own words, in the language they were said in. This
  is the only place a language other than the documents' appears; there are
  no parallel translated documents.
- **Do not read Sources unless verifying provenance.** A reader who wants
  the scene reads the three sections above it; a heading-wise read stops
  before Sources.
- The human may redact a quote when accepting the item; a redaction is the
  human's act, never the agent's.

## The hub

`{{docs}}/{{experience}}.md`, one fixed file beside this directory, no id, no
frontmatter, **hand-written entirely** and the always-read entry to this
layer:

```text
## Cast      — the actors, one line each: who they are and how they meet the project
## Drivers   — generalized expectations in their own words, each pointing with ← at the exp-<id>s it generalizes; at most 5 at MUST level
## Won't     — what the human has ruled out for the project, one line each, with an id
```

No scene index and no generated region: the directory listing is the index.
Scaffolded once from the template skeleton and never refreshed from it — its
content is the project's.

## Identifiers

- Scene ids are document ids, drawn as the top-level `AGENTS.md` says.
  Expectation, driver, open-question, and Won't ids are **item ids**, drawn
  from the same pool with the same check: before using one, both
  `{{docs}}/**/<id>-*.md` and a `**<id>**` line anywhere under
  `{{docs}}/{{experience}}/` or in the hub must be absent.
- A reference to a scene is `exp-<id>`; to an item, `exp-<item-id>` — one
  form. Resolve by lookup: a file `{{docs}}/{{experience}}/<id>-*.md`, else
  the `**<id>**` line inside one of them or the hub. A `←` link in the hub
  uses the same `exp-` form.
- An item keeps its id when its strength changes or it moves to another
  scene.

## What is an experience fragment

Someone — a user, a developer, a future self — is in a situation, wants
something, and something would upset them; no mechanism is named. Two tests:
the want survives a change of design (it would still hold if the system were
built another way), and its reason is the actor's own situation — time,
trust, language, authority — not the system's coherence. A statement that
fails either is design, a decision, or an issue.

This is the one type whose fragments may be **assembled**: an agent may
infer a scene or an expectation from scattered remarks, tagged `[inferred]`
and capped as above, with basis and reason in Sources. Decisions and design
are never inferred. A behavior sentence that the code and its tests already
express is not an expectation: drop it, salvaging any reason it embeds.

## experience vs issues

- `{{experience}}/` = what the actor wants and why — whether or not the
  system meets it yet (living).
- `{{issues}}/` = what is wrong or missing and is not being fixed now.
- A want the human states is an expectation **even when it is unmet**. The
  gap it leaves is a separate issue. One statement yielding two entries is
  not duplication: the expectation outlives the fix, the issue closes with
  it. Filing the issue alone loses the expectation.
- A small want folds into an existing scene as one line; a new scene only
  for a situation no scene covers. Never one file per sentence.
- The human's confirmation is the gate. An expectation is proposed and
  accepted at `Direction?`; it is never written on the classifier's own
  judgment.

## Reading path

- Designing (brainstorming, a spec): the hub, then the scenes whose `tags`
  or `actors` match the task, then the decisions listing.
- Planning: the above plus `{{design}}/`.
- Implementing: what the plan links, and nothing more.
- A human: `README` → `CONTRIBUTING` → the hub.
- Nobody reads `## Sources` except to verify where a line came from.

## Situations

A starter catalog, for a project with no scenes yet — names, not files:
starting-from-a-chat, cold-start, returning-after-months, interrupted-work,
being-asked-again, the-agent-re-proposes, the-undecided-gets-decided,
two-languages-one-tree. Pick the ones the project has; add the ones it
lacks.

## Worked example

```markdown
---
id: "c4e1"
title: returning after months
created: 2026-05-27
updated: 2026-05-27
actors: [maintainer, agent, collaborator]
tags: [orientation, trust, always-read-set]
---

## Scene

The maintainer opens a repository untouched since spring and wants to know
where things are and what he was worried about, in one sitting. The agent
starting the same session wants the same in as few tokens as possible. A
collaborator who uses no AI wants it from the README onward. If any of them
must read the code to learn the structure, or the docs describe a structure
the code no longer has, they stop trusting the docs.

## Expectations

- **37c2** [stated] MUST NOT exclude a human who does not use AI as a reader of the docs.
- **3b2d** [confirmed] SHOULD let the maintainer re-orient in one sitting.
- **48b2** [stated] SHOULD keep what the agent reads on every task small.

## Open questions

## Sources

- [37c2] 「repo の利用者全員がAIを使う前提を（まだ）置いてない」 (chat, 2026-09-14)
- [3b2d] inferred from 37c2 and 「UX だけじゃなく、DXも、だ」; not stated directly. Confirmed 2026-09-15.
- [48b2] 「日本語をAIに読ませるのがトークン消費の点で気にはなるけど、仕方ないか。許容。」 (chat, 2026-09-14)
```

## Lifecycle

Experience is a living type. A scene the project has outgrown is rewritten
or deleted, not marked; an expectation that no longer holds is removed and
its Sources entry with it. History is the record. Split a scene that grew a
second situation; fold two that describe one.
````

Two remarks for the implementer. The worked example's quotes are the
input's §4 quotes for those ids, so that the example is true of this
repository; a fresh scaffold ships the same example, which is what the
decision file §3 asks for. And the template carries the four-backtick fence
only in this spec — in the file, the outer fence is not there, and the inner
fences are ordinary triple-backtick fences.

## 3. `skills/kisou/templates/docs/experience.md` — the hub skeleton, new

Scaffold-only. Copied once by kisou's Step 3 (scaffold) item 3 to
`{{docs}}/{{experience}}.md` with its `<...>` filled or left for the author;
**not** in `doc-system-check.js`'s `targetSet`, so migrate never compares it
and the pre-commit hook never reads it. Linted like the other doc-system
templates.

```markdown
# Experience

The goal layer of <project name>: who uses it, what they take for granted,
and what the maintainer has ruled out. Scenes live in `{{experience}}/`; this
file is hand-written and is the first thing to read.

## Cast

- **<actor>** — <who they are and how they meet the project, one line>

## Drivers

At most five at MUST level. Each generalizes the expectations it points at.

- **<id>** MUST|MUST NOT|SHOULD|SHOULD NOT <the driver> ← exp-<id>, exp-<id>

## Won't

What has been ruled out for this project, so that nobody proposes it again.

- **<id>** <the thing not to build, and in one clause why>
```

For dotskills, batch A writes `docs/experience.md` from the input's §1
Cast (maintainer, agent, collaborator), its five Drivers (`b76a`, `bf60`,
`c018`, `c233`, `c60e` with their `←` lists in `exp-` form), and its four
Won't items (`cab7`, `d061`, `d1b9`, `d443`), the intro line rewritten for
dotskills. The Drivers carry no trust tag — they are the human's generalized
items, confirmed at T0 — and the Won't items keep their `[stated]` tag as
the input wrote them.

## 4. `skills/kisou/templates/docs/AGENTS.md` and its installed copy

Edits by section. Old text is quoted where the change is a rewrite; where a
sentence is added, its place is named.

**Document management**, the type table — the `requirements` line becomes
two:

```text
{{docs}}/{{experience}}.md               — the hub: who is in the scenes, what drives the project, what it won't do (hand-written; no id)
{{docs}}/{{experience}}/<id>-<slug>.md   — scenes: who is in what situation, what they expect, and their own words
```

The sentence "Project state lives in six types, one file per entry — four
**managed** … and two **flat**" stands; add after the table: "The hub is one
fixed file beside `{{experience}}/`, hand-written, with no id and no
frontmatter requirement; `{{docs}}/{{experience}}/AGENTS.md` says what it
holds."

**`<id>`** bullet — replace "Unique within its type (the type prefix
disambiguates across types)" with: "**Unique across `{{docs}}/`**, documents
and items alike (`{{docs}}/{{experience}}/AGENTS.md` names the item ids): a
new id is one no file `{{docs}}/<type>/**/<id>-*.md` carries and no `**<id>**`
line under `{{docs}}/{{experience}}/` or in the hub carries. References still
carry the type prefix, so an older project with a cross-type collision
resolves as before." Replace "Before creating, check `{{docs}}/<type>/**/<id>-*.md`
is empty" with "Before creating, run both checks above" and add: "A new id
contains at least one of `a` to `f` — an all-digit `#1234` autolinks to a
GitHub issue; re-roll otherwise. Existing all-digit ids stay."

**Cross-references** — the example line becomes
`exp-d4e5` · `design-f6a1` · `decision-a3f7` · `issue-b9c2`; add after it:
"An `exp-` reference names a scene or an item in one — `exp-<id>` for
either — and is resolved by lookup, a file first and a `**<id>**` line
second." The living-document parenthesis becomes
"(`{{experience}}/`, `{{design}}/`, an open issue)". Add, as the last
paragraph of the section: "A `req-<id>` reference in a document older than
this layer names a `requirements/` file the project folded into
`{{experience}}/`; the file and the fold are in history, and the reference
is not rewritten in a frozen document."

**Session shoroku (excerpting)** — step 2: "Classify each fragment as
exactly one of experience / design / decision / issue. The type files define
the two splits that are easy to get wrong: "design vs decisions" in
`{{docs}}/{{design}}/AGENTS.md`, and "experience vs issues" in
`{{docs}}/{{experience}}/AGENTS.md` — a want the user states that the system
does not meet yet is **two** fragments, an expectation and an issue, not one
issue. Experience is the one type whose fragment may be assembled from
scattered remarks; that file says how it is tagged and capped." Step 3:
"Each `{{design}}/` entry in the list names the `exp-<id>` — a scene or an
item — it serves, or says it serves none. Of the entries in the list, flag
the unpaired: a design section that serves no expectation (ask whether an
unstated want stands behind it), and an expectation no design serves (ask
whether the want is unmet — an issue — or met but not described — a
`{{design}}/` entry). The standing tree is not swept; a backfill is its own
run." Step 1 gains one sentence: "Do not read a scene's or an ADR's
`## Sources` unless verifying where a line came from." The closing
paragraph's "Fragments fold into the four **managed** types" stands.

## 5. The other doc-system templates and their copies

**`templates/docs/design/AGENTS.md`**, Body, the pairing bullet — old:

> Name the requirement each `## Section` serves with `req-<id>`. A section
> that serves none says so ("serves no requirement; internal shape"), so a
> shoroku proposal can ask whether an unstated need stands behind it.

new:

> Name the expectation each `## Section` serves with `exp-<id>` — a scene or
> an item in one. A section that serves none says so ("serves no
> expectation; internal shape"), so a shoroku proposal can ask whether an
> unstated want stands behind it. The pairing is checked on the entries a
> proposal carries, never by a sweep of the standing tree.

The last sentence is issue-320e's wording point, settled by putting the
scope in the bullet.

**`templates/docs/decisions/AGENTS.md`**, Body (MADR-lite) — the block gains
one line:

```text
## Sources       — optional; verbatim quotes keyed by the item ids they back, in the language they were said in
```

and, after the block, one sentence: "`## Sources` is the one place a
language other than the documents' appears; a reader takes the four sections
above it and reads Sources only to verify where a line came from."

**`templates/docs/issues/AGENTS.md`** — the second paragraph's "the need
itself is a requirement fragment and the issue records only the gap — see
"requirements vs issues" in `{{docs}}/{{requirements}}/AGENTS.md`. An issue
filed alone loses the requirement." becomes "the want itself is an
expectation and the issue records only the gap — see "experience vs issues"
in `{{docs}}/{{experience}}/AGENTS.md`. An issue filed alone loses the
expectation." Body gains, after its one paragraph: "The body opens with one
line, `Source: <kind> <pointer>`, the first non-empty line after the
frontmatter — `inbox <YYYY-MM-DD>-<slug>`, `shoroku <topic>[ S-<n>]`,
`hotfix <commit subject>`, or `session <YYYY-MM-DD>`: a pointer to where the
issue came from, never a class word." (Fixed input 22.)

**`templates/CONTRIBUTING.md`** — the TEMPLATE FILL list's `{{requirements}}`
becomes `{{experience}}`; the Project structure line becomes

```markdown
- [`{{docs}}/{{experience}}.md`]({{docs}}/{{experience}}.md) — who uses this and what they expect; scenes in [`{{docs}}/{{experience}}/`]({{docs}}/{{experience}}/)
```

and the References paragraph's list becomes "`{{experience}}/`,
`{{design}}/`, `{{decisions}}/`, and `{{issues}}/`", its example
`req-d4e5` becoming `exp-d4e5`. This repository's own `CONTRIBUTING.md`
gets the same two edits by hand (it is a filled layer-B file, not a checked
copy).

The installed copies `docs/AGENTS.md`, `docs/design/AGENTS.md`,
`docs/decisions/AGENTS.md`, `docs/issues/AGENTS.md` are rewritten to the
expanded templates in the same commit; `docs/experience/AGENTS.md` is
created from section 2; `docs/requirements/AGENTS.md` is left in place until
batch C removes the directory (it is no longer in the target set, so the
check ignores it).

## 6. `skills/kisou/SKILL.md`, `scripts/doc-system-check.js`, its test, and the READMEs

**`SKILL.md`**:

- Scope, Produces — old: "the `docs/` doc-management system (`docs/AGENTS.md`
  + `docs/<type>/AGENTS.md` + the `docs/issues/{open,deferred,resolved}/`
  skeleton)"; new: "the `docs/` doc-management system (`docs/AGENTS.md`,
  the per-type `docs/<type>/AGENTS.md` under the cased type directories,
  and the hand-written hub `docs/experience.md`)". Closes issue-3bbb.
- Step 2, the dir-names mapping list: `{{requirements}}` → `{{experience}}`.
- Step 3 (scaffold) item 3 — create `{experience,design,decisions,notes,reports}/`;
  add: "Copy `templates/docs/experience.md` to the cased docs root as the
  hub, filling its `<...>` from the inputs where they are known and leaving
  the rest for the author; this file is written once and is not a
  doc-system copy the instrument checks."
- Step 3 (migrate), the doc-system classification — "(requirements / design /
  decisions / issues)" → "(experience / design / decisions / issues)". The
  `none` bullet — old "all seven targets are absent"; new "all five tallied
  targets are absent, and the two flat copies with them". Closes
  issue-a331. The `full` bullet's parenthesis stands. Add to the `partial`
  bullet's list of non-standard subdirectories: "a `requirements/` directory
  is one such — the name this type had before `experience/`; the instrument
  says so in a note, and the rename is a hand migration this skill does not
  perform."
- The `docs/` doc-system bullet — "(all seven, for a `none` doc-system …)"
  stands: the instrument still enumerates seven targets (root plus six).
- The description frontmatter stands (it names no type).

**`scripts/doc-system-check.js`**:

- Line 22: `const TYPES = ["experience", "design", "decisions", "issues", "notes", "reports"];`
- In `collect`, after the target loop, one note when
  `existsExact(docsDir, expandName("requirements", kase) + "/AGENTS.md")`
  and the `experience` target does not exist:
  `note: <docs>/<requirements>/ — the name the experience type had before 2026-09; renaming it is a hand migration, not an item`
  where `<requirements>` is the cased name. Printed with the other notes,
  counted in the summary line. `check` exits 0 on a note alone, as today.
- Nothing else: `targetSet`, `classify`, `apply` are unchanged.

**`scripts/doc-system-check.test.js`**: every `requirements` fixture,
heading, and path becomes `experience` — the `expandName` assertions
(`"experience"` / `"Experience"`), the target-set lists, the
not-kisou-managed note strings (`# experience/ — AGENTS`), the section
lists of the real-copy tests (`## experience vs issues` replaces
`## requirements vs issues`; the section set in the "deleted section is
re-inserted" test follows section 2's headings). One new test: a docs
directory holding `requirements/AGENTS.md` and no `experience/AGENTS.md`
produces the `create: experience/AGENTS.md` item and the note above; one
holding both produces no note. `node --test skills/kisou/scripts/` passes.

**`skills/kisou/README.md`** — reviewed for drift after `SKILL.md` changes;
its lines 9 and 42 name the doc-system without naming types, so the review
is expected to find one place at most.

**`skills/shoroku/README.md`** — lines 9 to 10, "the four managed —
**requirements**, **design**, **decisions** (ADRs), **issues**" →
"**experience**, **design**, **decisions** (ADRs), **issues**".

## 7. `skills/shoroku/SKILL.md`

Four edits, and the rule for the fourth target stays in the type file
(Fixed input 13; issue-2c4d is not worsened because of this).

- The frontmatter `description`: "(requirements / design / decisions /
  issues / notes / reports)" → "(experience / design / decisions / issues /
  notes / reports)". The description carries no `: `.
- Step 3, first paragraph: "fragments into the four managed (requirement /
  design / decision / issue)" → "(experience / design / decision / issue)".
  Second paragraph — old: "Classification follows the two splits the type
  files define — design vs decisions, requirements vs issues — and the
  proposal carries the requirement pairing `docs/AGENTS.md`'s Propose step
  defines; neither is restated here."; new: "Classification follows the two
  splits the type files define — design vs decisions, experience vs issues
  — and the proposal carries the experience pairing `docs/AGENTS.md`'s
  Propose step defines; neither is restated here. Experience is the one
  type whose candidate may be assembled from scattered remarks, tagged and
  capped as `docs/experience/AGENTS.md` says; the other three are stated
  only."
- Recommend mode: "the `req-<id>` pairing for a `design` entry" → "the
  `exp-<id>` pairing for a `design` entry"; "for a requirement or ADR item —
  the original wording followed by a reference translation in the chat's
  language" → "for an ADR item, and for an `[inferred]` experience item —
  the original wording followed by a reference translation in the chat's
  language; a `[stated]` experience item carries its quote in Sources and
  needs none". Add one sentence after the `Recommended fix` rule: "An
  experience item that is `[inferred]`, or whose wording names a path, a
  command, a config key, a file format, a role count, or a tool, is grouped
  `Unsure` with the reason named, so that the human sees the inference or
  the mechanism before it is written."
- Apply mode: unchanged in text; "per the per-type `AGENTS.md`" already
  covers a scene.

Nothing else. Session mode's `Direction?` is the confirmation gate for
experience candidates by the type file's own rule; the skill adds no step.

## 8. `docs/design/e3f4-shoroku.md` and `docs/design/c1d2-kisou.md`

Living documents, updated in batch C when the rest of `docs/` changes.

- `e3f4`: the heading `### Classification and the requirement pairing`
  becomes `### Classification and the experience pairing`; its body's
  "requirements vs issues", "requirement pairing", "requirement bullet",
  `req-<id>` are rewritten to the experience terms; a paragraph is added
  after the three properties: "Experience is the one type shoroku may
  assemble: an `[inferred]` candidate is capped at SHOULD and goes to
  `Unsure` in recommend mode; the rule is in `docs/experience/AGENTS.md`
  and this skill's `SKILL.md` carries one sentence naming it." The Workflow
  list's step 2 names `experience`. The section's `Serves` line names the
  `exp-` items batch C's pairing pass assigns.
- `c1d2`: the Shape paragraph "four managed (`requirements` / `design` /
  `decisions` / `issues`)" → "(`experience` / `design` / `decisions` /
  `issues`)"; add one sentence: "The hub `docs/experience.md` is
  scaffolded once from `templates/docs/experience.md` and is not a copy the
  instrument compares." The enforcement section's "fourteen guarded paths"
  stands (seven templates, seven copies).

Both files' `## Section`s get their `Serves exp-…` line from the pairing
pass like every other design section.

## 9. The migration run — batches B and C

The plan's ordering constraint, and the three dispatches.

**Batch A** lands sections 2 to 7 — the hook-guarded set in one commit; the
hub, the seven scenes, the kisou and shoroku `SKILL.md` edits, the READMEs,
and the exit-criterion note (section 10) in one or more further commits.
`docs/requirements/` is not touched: it is batch B's read-only source.

**Batch B** is one task. It dispatches the shoroku skill's recommend mode
on the `shoroku.recommend` kind — `subagent_type: tanto-shoroku-recommend`,
`model` from the merged `tanto.json` (`fable` today) — with:

- sources: the five files `docs/requirements/*.md` except `AGENTS.md`,
  whole;
- baseline: the `docs/` tree as batch A left it — the hub, the seven
  scenes, `docs/experience/AGENTS.md`;
- the questions the recommendation answers, per source sentence: **drop**
  (a behavior sentence the code and its tests already express, grouped
  `Recommended reject` with the reason "implemented; carried by the code"
  and any embedded reason salvaged into an expectation item beside it),
  **expectation** into an existing scene or a **new scene** (`Recommended
  adopt`, each with its trust tag, its strength, its Sources entry, and —
  for a new scene — `actors`, `tags`, and the Scene text), **issue** (a
  need not met), **design line** or **decision candidate** (a design choice
  the sentence states); `[inferred]` and mechanism-laden items to `Unsure`
  as section 7 says;
- the **pairing pass**: for each of the 53 design `## Section`s, the
  `exp-<id>` it serves or "serves no expectation; internal shape", as one
  `Recommended adopt` item per design file whose body lists the sections
  and their targets;
- the **file map** (Fixed input 18): five lines, `req-<id> → exp-<id>` or
  `→ the hub`, one per requirement file, as one item;
- **ids for new items and scenes assigned in the recommendation**, drawn
  against the pool by the two checks of section 2's Identifiers and named
  in each item so that the pairing pass can cite them;
- output `.tanto/experience-layer/migration-recommendation.md`; brief
  `.tanto/experience-layer/migration-brief.md` from the tanto skill's
  `templates/shoroku-brief.md`, in the human's language (`ja`).

The task's report says the item counts by group and the scene count the
recommendation would leave (the cap of Fixed input 3 is a judgment, so a
count above ten is reported, not failed). **The boundary after batch B
waits for the human**: Kanri checks the brief's form as at a close, writes
an `attention` request whose message is
`kessai: experience-layer migration — claude attach <id>`, puts the one
question with the recommendation's and the brief's paths and the counts in
its own window, and writes `.tanto/experience-layer/migration-direction.md`
from the human's answer — by exception, in Kanri's window or through a
live Hosa's `kessai answer:` relay. The plan's Global Constraints say that
batch C is not spawned until that file exists.

**Batch C** is three or four tasks, in order:

1. Dispatch the shoroku skill's apply mode on the `shoroku.apply` kind —
   `subagent_type: tanto-shoroku-apply`, `model` from `tanto.json` (`opus`
   today) — with the recommendation, the direction, and the commit subject
   `docs: fold requirements into experience`. It writes the accepted scenes
   and expectations (into the seven scenes and any new ones), the issues
   (each opening `Source: shoroku experience-layer`), the design lines, the
   `Serves exp-…` lines of the pairing pass, and nothing the direction did
   not accept; one commit.
2. Remove `docs/requirements/` (`git rm -r`); rewrite every `req-<id>` in
   `docs/design/**`, `docs/issues/open/**`, `docs/issues/deferred/**`, and
   `docs/notes/**` — design from the pairing pass's targets where a
   `Serves req-…` line existed, issues and notes from the file map;
   `git mv` issue-320e and issue-c9df to `docs/issues/resolved/`, bumping
   `updated:`; apply section 8 to the two design files; this repository's
   `CONTRIBUTING.md` (section 5). Lint by path; one commit.
3. Verify (section 12) and write the dogfood report (section 11).

A `Recommended fix` item the recommendation may carry — a one-sentence
repair in `skills/kisou/**` or `skills/shoroku/**` the run noticed — is
applied by the same apply dispatch as its second commit, with the subject
`fix: text corrections from the experience migration`, as the skill's apply
mode already does; the dispatch names those two directories as the paths a
fix may touch.

## 10. `docs/notes/experience-layer-exit-criterion.md`, new

A maintained reference on one concern: how the layer is judged. Written in
batch A; its `# H1` is its title, no frontmatter. Content, in prose:

- **What is measured and why.** What the layer alone supplies is memory of
  project-specific reasons; model strength supplies the rest. Three
  outcomes the human expects — fewer questions at spec and plan stages,
  better-aimed recommendations, better improvement proposals — all move
  with the model too, so none is the criterion by itself.
- **Primary — unprompted use.** At each topic's close, count the `exp-`
  items cited in the topic's spec, plan, ADRs, and review brief that the
  human did not raise in that topic's `dialogue.md`, `spec-inputs.md`, or
  the Kikaku files the topic cites: a `grep -o 'exp-[0-9a-f]\{4\}'` over the
  four documents, set-minus the same grep over the dialogue and inputs.
  Until a tanto topic gives the count to the close's recommender or to
  Kanri (Deferred items 2), it is run by hand at the close and written into
  the topic's dogfood report. **Zero across three consecutive topics is the
  fold-back signal**: fold the hub's Cast, Drivers, and Won't into
  `AGENTS.md` and drop the scenes.
- **Secondary — counts the artifacts already carry**, compared only across
  topics whose roster rows show the same model family for the seat that
  produced them: per spec, the number of questions Sekkei put in
  `dialogue.md`; the number of points in the review brief; the number of
  requirement or experience items a spec review or the human sent back as
  design. Baseline: `tanto-context-ceiling`, `tanto-cost`, `tanto-sweep-2`,
  read from `.tanto/<topic>/` and the ledgers; taken again when the family
  changes.
- **Not used**: the count of "I rejected that already" remarks.

## 11. The dogfood report

`docs/reports/<YYYY-MM-DD>-experience-layer-dogfood.md`, written in batch
C's last task, dated by the file name only. It records the migration:

- the counts of the decision file §9 step 5 — source sentences dropped,
  moved to an issue, salvaged into an expectation, moved to design or a
  decision candidate; scenes created and scenes edited; design sections
  paired versus "serves none"; the five-entry file map as written;
- the recommendation's item count by group and its `Unsure` count; how many
  items the human's answer changed and how; the elapsed time between batch
  B's report and the direction file;
- the `req-` count in living documents before (68) and after (0), and in
  ADRs, unchanged (38);
- the first measurement of the secondary criterion for this topic — Sekkei's
  question count (3 plus 3 design sections), the brief's point count, the
  items the spec review sent back as design;
- anything the run taught about the type rules' wording, as input to the
  close's recommender.

It is not the exit criterion's baseline; section 10 says what is.

## Where each change lives

| File | Change | Batch |
| --- | --- | --- |
| `skills/kisou/templates/docs/experience/AGENTS.md` | new, section 2 | A |
| `skills/kisou/templates/docs/requirements/AGENTS.md` | deleted | A |
| `skills/kisou/templates/docs/experience.md` | new, section 3 | A |
| `skills/kisou/templates/docs/AGENTS.md` | section 4 | A |
| `skills/kisou/templates/docs/design/AGENTS.md`, `decisions/AGENTS.md`, `issues/AGENTS.md` | section 5 | A |
| `skills/kisou/templates/CONTRIBUTING.md` | section 5 | A |
| `skills/kisou/scripts/doc-system-check.js`, `.test.js` | section 6 | A |
| `docs/AGENTS.md`, `docs/design/AGENTS.md`, `docs/decisions/AGENTS.md`, `docs/issues/AGENTS.md` | rewritten to the expanded templates | A, same commit as the templates and the script |
| `docs/experience/AGENTS.md` | created from the expanded template | A, same commit |
| `docs/experience.md` | section 3, from the input §1 | A |
| `docs/experience/<id>-<slug>.md` × 7 | the input §1 scenes, §11 corrections, §4 quotes | A |
| `skills/kisou/SKILL.md`, `README.md` | section 6 | A |
| `skills/shoroku/SKILL.md`, `README.md` | section 7 | A |
| `docs/notes/experience-layer-exit-criterion.md` | new, section 10 | A |
| `.tanto/experience-layer/migration-recommendation.md`, `-brief.md` | the recommend dispatch's output (untracked) | B |
| `.tanto/experience-layer/migration-direction.md` | Kanri, from the human's answer (untracked) | B's boundary |
| `docs/experience/**`, `docs/design/**`, `docs/issues/**` | the apply dispatch, `docs: fold requirements into experience` | C |
| `docs/requirements/` | removed | C |
| `docs/design/**`, `docs/issues/open/**`, `docs/issues/deferred/**`, `docs/notes/**` | `req-` → `exp-` | C |
| `docs/issues/resolved/320e-…`, `c9df-…` | moved | C |
| `docs/design/e3f4-shoroku.md`, `c1d2-kisou.md` | section 8 | C |
| `CONTRIBUTING.md` (this repository) | section 5 | C |
| `docs/reports/<date>-experience-layer-dogfood.md` | section 11 | C |

Untouched: `scripts/check_md_frontmatter.py`, `.pre-commit-config.yaml`,
`.markdownlint-cli2.yaml`, every file under `skills/tanto/`, every ADR
body, every dated report, everything under `docs/superpowers/`.

## Old values this plan contradicts

Sentences in the tree that the design above makes false, so that the plan's
sweep finds them; each is rewritten by the section named.

- `docs/AGENTS.md` (and its template): "Unique within its type (the type
  prefix disambiguates across types)"; "Before creating, check
  `docs/<type>/**/<id>-*.md` is empty"; the `req-d4e5` example; "requirements
  vs issues" in step 2; "names the `req-<id>` it serves" in step 3;
  "(`requirements/`, `design/`, an open issue)" — section 4.
- `docs/requirements/AGENTS.md` (and its template): the whole file —
  deleted, section 2 replaces it.
- `docs/design/AGENTS.md` (and its template): "Name the requirement each
  `## Section` serves with `req-<id>`" — section 5.
- `docs/issues/AGENTS.md` (and its template): "the need itself is a
  requirement fragment … see "requirements vs issues" in
  `docs/requirements/AGENTS.md`. An issue filed alone loses the requirement"
  — section 5.
- `skills/kisou/templates/CONTRIBUTING.md`: the `{{requirements}}` line and
  the References list; this repository's `CONTRIBUTING.md`: "`docs/requirements/`
  — what we're building" and "`requirements/`, `design/`, `decisions/`, and
  `issues/`", "`req-d4e5`" — section 5.
- `skills/kisou/SKILL.md`: "the `docs/issues/{open,deferred,resolved}/`
  skeleton" (Scope); "`{{requirements}}`" (Step 2); "`{requirements,design,decisions,notes,reports}/`"
  (Step 3 scaffold); "(requirements / design / decisions / issues)" and
  "all seven targets are absent" (Step 3 migrate) — section 6.
- `skills/kisou/scripts/doc-system-check.js` line 22 and every
  `requirements` in its test — section 6.
- `skills/shoroku/SKILL.md`: "(requirements / design / decisions / issues /
  notes / reports)" (description); "(requirement / design / decision /
  issue)", "requirements vs issues", "the requirement pairing" (Step 3);
  "the `req-<id>` pairing for a `design` entry", "for a requirement or ADR
  item" (recommend mode) — section 7.
- `skills/shoroku/README.md` lines 9 to 10 — section 6.
- `docs/design/e3f4-shoroku.md`: "Classification and the requirement
  pairing" and its body's requirement terms; step 2 of Workflow —
  section 8.
- `docs/design/c1d2-kisou.md`: "four managed (`requirements` / `design` /
  `decisions` / `issues`)" — section 8.
- Every `Serves req-<id>` line in `docs/design/**` — section 9, batch C.

## Requirements

`req-1a2b` and `req-3c4d` are folded by batch C, so this section names what
the migration run must carry forward from them as expectations rather than
editing them. The recommend run treats these as stated by this spec's
dialogue (D-1 to D-6) and the decision file, and proposes them with the rest;
the human's direction decides.

1. From `req-3c4d` "classify fragments as exactly one of the four managed
   types (`requirement` / `design` / `decision` / `issue`)" and "A need the
   user states that the system does not meet yet is proposed as two
   fragments": the want behind them — the maintainer's words reach the
   documents as what he meant, not as the sentence the source used, and
   nothing is invented — is the input's `06d2`, `78f6`, `81e0` already in
   Scene A, D, E. No new expectation; the run points the sentences at those
   ids.
2. From `req-3c4d` "The proposal names, per `design` entry, the requirement
   it serves": the want — the maintainer can ask "which want does this
   design protect" and get an answer without reconstructing it — is a new
   `[stated]` expectation in Scene C (the agent proposes what was ruled
   out), Source 「守ろうとしている要件はなんだろう？」 (issue-c9df, 2026-09-13).
   Its `[stated]` tag holds because that quote is in issue-c9df's body.
3. From `req-1a2b` "Single source of truth — kisou owns the entire bundled
   template including the `docs/` doc-management system" and "Re-running
   migrate … refreshes it toward the current template": the want — a
   project set up months ago keeps up with the conventions without the
   maintainer redoing them — is a scene the run proposes for a situation the
   seven do not cover (returning to a repository set up by an older kisou),
   `[inferred]` from those two bullets and decision `281f`, capped at
   SHOULD, for the human to confirm.
4. Everything else in the five files is classified by the run under the
   rules of section 2's "What is an experience fragment".

## The ADRs

Candidates for the close's recommender, each with a non-empty Options
section available; none is written by this plan.

1. **`docs/requirements/` becomes `docs/experience/`: the goal layer is
   written as situations, not behavior.** Options: keep `requirements/`
   and lint its sentences toward needs (issue-c9df's proposals alone); a
   `docs/intent/` of goals without scenes; scenes as situations (chosen).
   Consequences: the pairing rule rewritten a second time within a month;
   `req-` in 23 ADRs left as history; the caps are wording. Sources: the
   decision file's human's words on 「experience は僕が明文化したいことに近い」
   and 「requirement はシステムの振る舞いを示す言葉としても使われている」.
2. **One id pool across `docs/`, resolution by prefix, and a letter in every
   new id.** Options: per-type pools as before; a global pool with a
   prefix-less reference; a global pool with prefixed references (chosen).
   Consequences: one word in the rules and a wider grep; older projects'
   cross-type collisions harmless.
3. **Inference is allowed for experience alone, tagged, and capped at
   SHOULD until confirmed; confirmation is the existing gate.** Options:
   stated-only for every type (nothing is assembled, and the input's Scene
   D failure stands); a separate confirmation step at finish or a Kano
   question pair; the existing `Direction?` and direction file (chosen).
   Consequences: a `[inferred]` line can sit unconfirmed; `Unsure` grows by
   the inferred items.
4. **An ADR may carry `## Sources`, and a language other than the documents'
   appears only there.** Options: parallel `.ja.md`; quotes inline in
   Context; a Sources section after Consequences (chosen). Consequences:
   MADR-lite gains an optional section; heading-wise readers skip it.
5. **kisou migrate learns no type rename; the pilot repository migrates by
   hand inside its own plan, under the doc-system hook.** Options: teach
   migrate to rename a type (the 2026-09-09 dogfood measured migrate
   misclassifying every per-type file, so not yet); a `.bak` rename path
   (rejected by decision `0590`'s uncertainty rule); the hand migration
   (chosen). Consequences: other kisou projects migrate lazily, as their
   own topic each.
6. **The migration's confirmation is a recommend-check-apply cycle inside
   the plan, with the human's answer between two batches** (D-1). Options:
   Sekkei re-classifies in the dialogue; the plan swaps structure and the
   human runs shoroku afterwards; the two-batch cycle (chosen).
   Consequences: a batch boundary that waits for a direction file, the
   first such in a tanto plan; the plan's Global Constraints name it.
7. **The chat side emits a handover and never writes scene files; shoroku's
   file mode ingests it** (the decision file §8; input questions f33b,
   2b72). Options: the chat writes scenes directly into a fresh
   repository; the chat emits scene-format drafts in a handover (chosen).
   Consequences: id de-collision happens at ingestion; the two files given
   to the chat must stand alone. Its apply appends `→ decision-<id>` to
   Scene A's `2b72` line.

## What the plan must contain

For Keikaku.

- **Global Constraints**: the hook-guarded set (templates, `TYPES`, tests,
  installed copies, `docs/experience/AGENTS.md`) lands in one commit;
  `docs/requirements/` is not edited before batch C; batch C is not
  spawned until `.tanto/experience-layer/migration-direction.md` exists;
  every dispatch of the shoroku skill names its kind and model from
  `tanto.json` (`shoroku.recommend`, `shoroku.apply`); nothing under
  `skills/tanto/` is edited; no ADR body and no dated report is edited;
  the input file `.tanto/kikaku/2026-09-15-shoroku-experience-input.md` is
  read and never committed, copied, or deleted.
- **Batches**: A (sections 2 to 7, 10), B (section 9's one task), C
  (section 9's tasks, sections 8, 11, 12). Three or four tasks per batch;
  A may be two batches if its task count asks for it, the hook-guarded
  commit first.
- **The seven scenes' task** names the input's §1 scene by letter, its
  expectation ids, the decision file §11's nine confirmations and the two
  corrections (16c2's wording; 3b2d as worded), and §4's quotes by id; its
  Done-when is the seven files present, each with the four headings in
  order, every expectation line matching the form of section 2, every id in
  `## Expectations` having a `## Sources` entry, and `docs/experience.md`'s
  Drivers pointing at ids that exist.
- **How a batch is verified**: section 12's commands, per batch.
- **The dogfood report task** with section 11's list as its Done-when.

## Verification

Per batch, by the implementer and by the boundary:

- `node skills/kisou/scripts/doc-system-check.js check --docs docs --case snake_case`
  exits 0 (A, C).
- `node --test skills/kisou/scripts/` passes (A).
- `./scripts/lint.sh <changed paths>` passes (every batch).
- After A: `ls docs/experience/*.md | grep -v AGENTS | wc -l` is 7;
  `grep -c '^## ' docs/experience.md` is 3; the Drivers' `←` ids each
  resolve — `for id in $(grep -o 'exp-[0-9a-f]\{4\}' docs/experience.md | cut -d- -f2 | sort -u); do grep -rl "\*\*$id\*\*" docs/experience/ >/dev/null || echo "unresolved $id"; done`
  prints nothing; `grep -c 'inferred' skills/shoroku/SKILL.md` is 2 (both in
  the recommend-mode paragraph) and `grep -c 'Kano\|RFC 2119' skills/shoroku/SKILL.md`
  is 0 (the rule stayed in the type file); `test ! -e skills/kisou/templates/docs/requirements/AGENTS.md`.
- After B: both files exist; `grep -c '^## Recommended\|^## Unsure' .tanto/experience-layer/migration-recommendation.md`
  is 4; every `###` heading's text appears once after `See:` in the brief
  (Kanri's form check).
- After C: `test ! -e docs/requirements`;
  `grep -rl 'req-[0-9a-f]\{4\}' docs/design docs/issues/open docs/issues/deferred docs/notes`
  prints nothing; `grep -rl 'req-[0-9a-f]\{4\}' docs/decisions | wc -l` is
  still 23; in each of the five design files the count of `^## ` lines
  equals the count of `^Serves ` lines — every section's body opens with
  `Serves exp-<id>.` or `Serves no expectation; internal shape.`, the form
  the pairing pass writes; the scene count
  `ls docs/experience/*.md | grep -v AGENTS | wc -l` is reported against
  the cap; `ls docs/issues/resolved/320e-* docs/issues/resolved/c9df-*`
  lists both; in every scene, each `**<id>**` under `## Expectations` has a
  `[<id>]` line under `## Sources` of the same file.


## Out of scope

- The design-side restructuring and the tooling (Fixed input 1).
- A kisou migrate that renames a type; other kisou projects' migration.
- Any edit under `skills/tanto/` — the T1 Sources sentence, the T2 count,
  and issue-13a1's carrier (which this Sekkei applies to its own Step 2
  dispatch by listing `docs/issues/open/` as an input, and proposes nothing
  for the role file) and issue-e916 (a tanto-side check of shoroku's heading
  contract).
- issue-c4b2 (the empty Usage section — not a docs matter), issue-0d43
  (the README's source modes — the sibling drift check forces it when
  `SKILL.md` changes, and the review in section 6 may fix it in passing
  without widening the plan), issue-52fd (a measurement Kanri schedules),
  issue-abaf (stays deferred; a scene is a longer item but there are fewer).
- `scripts/check_md_frontmatter.py`: no per-type schema for scenes now; a
  later tooling topic may add the `[inferred]`-cap check there.
- The chat-side custom skill's packaging: the two files are what is
  uploaded, by the human, outside this repository.

## Issues this design closes

Each term grepped separately across `docs/issues/open/` on 2026-09-30:
`requirement` (many, all in bodies naming `req-`), `req-<id>` (37 files,
section 9's rewrite), `pairing` (320e, c9df, e916), `seven targets` (a331),
`skeleton` (3bbb).

- **issue-320e** — closed by batch C's pairing pass over the 53 sections;
  the wording point it raised is settled by section 5's scope sentence in
  the design bullet. Moved to `resolved/` in batch C.
- **issue-c9df** — proposals 1 (state the need), 2 (split need from
  mechanism), 3 (vocabulary check), 5 (doubtful candidates to `Unsure`) are
  met by section 2's Expectations and section 7. Proposal 4 (current /
  proposed / need for a change to an existing requirement) is **rejected**
  (D-2): under scenes the main path for a changed want is a new expectation
  or a rewritten scene, a correction the human gives becomes the item's
  `[stated]` source, and "which want does this protect" is answered by the
  `exp-<id>` a design section names — so the three-column form has nothing
  left to show. Moved to `resolved/` in batch C.
- **issue-3bbb** — the Scope bullet, section 6. Resolved in batch A.
- **issue-a331** — the `none` bullet, section 6. Resolved in batch A.
- **issue-2c4d** — not closed and not worsened: section 7 adds one sentence
  to `SKILL.md` and the rule to the type file, as that issue's premise
  requires; the spec says so here so that the close's recommender does not
  re-open it.

## Answers to the spec inputs

No `spec-inputs.md` was written for this topic. The rider (Fixed input 22)
came in the orders line and is answered by section 5.

## Deferred items

1. **The T1 Sources sentence** (the decision file §10): "`dialogue.md`,
   `spec-inputs.md`, and the Kikaku decision files the topic cites are the
   Sources for experience extraction; a quote that exists there makes an
   expectation `[stated]` mechanically, anything else is `[inferred]`." A
   rider for the orders line of the next tanto topic, attached by Kanri; it
   touches tanto's role text and this plan edits none.
2. **The T2 count** (§15 primary): the close's recommender, or Kanri, counts
   the `exp-` citations against the dialogue and writes the number into the
   dogfood report. Same rider. Until then the note of section 10 is run by
   hand.
3. **The `[inferred]`-cap and vocabulary checks as lint**, in
   `check_md_frontmatter.py` or a kisou instrument — the tooling topic.
4. **kisou migrate's type rename** — when a second kisou project needs it.
5. **The design-side restructuring** — input question f2ed, undecided.
6. **A scene for the `Source:` line's own want** — the human's reasons for
   provenance on issues are in `bug-report-hold`'s dialogue; the run may
   find them or a later shoroku may.

## Shoroku proposal from this spec work

Items not in any file above; the dialogue and the spec review are the
recommender's own inputs.

1. Rejected in the dialogue with reason — Q1 (B): Sekkei re-classifying
   443 lines in the spec dialogue would cost the human the whole check now,
   at spec time, with no recommendation file to answer by exception; (C):
   two directories coexisting on `main` after the merge, and a shoroku run
   outside tanto with no ledger row for its outcome.
2. Rejected in the dialogue with reason — Q3 (b): 38 per-issue judgments
   for lines that are boilerplate `Related:` mentions; (c): dropping the
   mentions loses the one pointer from an issue to the want it sits under.
3. Fact measured — the wait list of 2026-09-14 named issue-4b91 and
   issue-c583 for this topic to judge; both were resolved by
   `tanto-sweep-2` before this topic opened. A wait list is a snapshot.
4. Observation — the pre-commit hook's byte-equality makes "migrate by
   hand" a one-commit act by construction; the decision file's §8 and §9
   did not say so, and a plan that split the templates from the copies
   would fail its first commit. Worth one sentence in `design-c1d2`'s
   enforcement section as a consequence.
5. Observation — a batch boundary that waits for a human's direction file
   (section 9) is new to tanto; if it recurs, `roles/kanri.md`'s boundary
   procedure could name it instead of the plan's Global Constraints.
