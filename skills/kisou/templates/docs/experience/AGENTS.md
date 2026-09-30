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
  is the mistake this tag exists to prevent. **The human's confirmation is
  the gate**, and it is the existing one: the answer at `Direction?`, or the
  direction file a caller writes from the human's answer. An accepted
  `[inferred]` line becomes `[confirmed]`, its Sources entry quoting the
  words of the confirmation; a line the human corrected becomes `[stated]`,
  the correction quoted as given; an unanswered line stays `[inferred]`. No
  expectation is written on the classifier's own judgment.
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
  inferred one; and, once confirmed,
  `- [<id>] inferred from <ids>; not stated directly. Confirmed <date>: 「<the human's words>」`.
- Quotes are the actor's own words, in the language they were said in. This
  is the only place a language other than the documents' appears; there are
  no parallel translated documents.
- **Do not read Sources unless verifying where a line came from.** A
  reader who wants the scene reads the three sections above it; a
  heading-wise read stops before Sources. This is the one statement of that
  rule; Reading path points here.
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

No scene index and no generated region: the directory listing is the index
(File says the same of this directory). Drivers and Won't items carry no
trust tag — the hub is the human's own words by construction. Scaffolded
once from the template skeleton and never refreshed from it — its content is
the project's.

## Identifiers

- Scene ids are document ids, drawn as the top-level `AGENTS.md` says.
  Expectation, driver, open-question, and Won't ids are **item ids**, drawn
  from the same pool with the same checks: before using one, no file
  `{{docs}}/<type>/**/<id>-*.md` exists, no `**<id>**` line exists under
  `{{docs}}/{{experience}}/` or in the hub, and no commit ever used it
  (`git log --all --oneline -S'<id>' -- {{docs}}` prints nothing) — an id
  once written is never reused, because a frozen document may cite it.
- An id that arrives from outside the tree — a chat handover's — and
  collides is re-rolled at ingestion, and the bundle's references to it are
  rewritten before anything is written.
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
- The gate is the one Expectations names under the trust tag.

## Reading path

- Designing (brainstorming, a spec): the hub, then the scenes whose `tags`
  or `actors` match the task, then the decisions listing.
- Planning: the above plus `{{design}}/`.
- Implementing: what the plan links, and nothing more.
- A human: `README` → `CONTRIBUTING` → the hub.
- `## Sources` is read as Sources says: only to verify where a line came from.

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
its Sources entry with it. History is the record, and a removed id is never
drawn again (Identifiers). Split a scene that grew a second situation; fold
two that describe one.
