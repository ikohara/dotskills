# decisions/ — AGENTS

A `decisions` file is an **Architecture Decision Record (ADR)**: a point-in-time
record of a significant choice — its context, the options considered, the
decision, and the consequences accepted. ADRs are **append-only and immutable**
once accepted; you never rewrite the body. To reverse a decision, write a new
ADR that supersedes the old one.

Because the body is immutable, reference managed entries by `<type>-<id>` only
— never a path link, which rots when its target's status moves. The flat
`notes/` / `reports/` have no `<id>` and are cited by path; when such
a file is renamed, the renamer's mechanical link repair is allowed even in an
ADR body. Documents outside the six types — a tool's own `docs/`
subdirectory such as `docs/superpowers/specs/` — have neither an `<id>` nor
a renamer who owns inbound links: name them (title and date), never path-link
them (see Cross-references in `docs/AGENTS.md`).

## When to write an ADR

Record an ADR only when **both** hold:

1. it was a choice among real alternatives, and
2. it has lasting consequences worth recording (costly to reverse, or likely to
   be questioned later).

Trivial choices stay in `design/`. A significant decision typically produces
both an ADR (the record) and a `design/` update (the new current state) — not a
duplication: `design/` holds the operational truth, the ADR holds the reasoning
and the roads not taken.

Two litmus tests. If you cannot write an honest, non-empty Options section,
there is nothing for an ADR to hold — fold the change into `design/`. And
superseding adds a file, never removes one: if reversing the choice would not
merit a superseding ADR, the original does not merit an ADR either.

## File

- Path: `docs/decisions/<id>-<slug>.md`. Reference prefix: `decision`.
- One decision per file. No index file.

## Frontmatter

```yaml
id: "a3f7"
title: <decision title>
status: accepted          # proposed | accepted | superseded | deprecated | rejected
supersedes: []            # decision ids this replaces in full
superseded_by: null       # decision id that replaced this in full, or null
amends: []                # decision ids this replaces in part (they stay accepted)
amended_by: []            # decision ids that replaced part of this
created: 2026-05-27
updated: 2026-05-27        # changes only on a status flip or a link change
```

- `id` is a quoted string; dates are `YYYY-MM-DD` (UTC).
- Default `status` is `accepted` (a recorded decision was already made). Use
  `proposed` only while genuinely tentative.
- The four link fields hold bare decision ids only — never prose. The scope of
  a partial replacement lives in the amending ADR's body, not in a field.
- An ADR is in full force when `status: accepted` and `amended_by` is empty.
  ADRs written before the two `amend` fields existed omit them: read absence
  as `[]`, and add the field when it gains its first value.

## Body (MADR-lite)

Narrative starts directly after the frontmatter. Use these sections; keep them
short, or omit any for a trivial decision:

```text
## Context       — what forced a decision
## Options       — the alternatives considered
## Decision      — the choice
## Consequences  — what we accept; trade-offs; follow-ups
```

## Superseding (the only edit to an accepted ADR)

A later ADR replaces an earlier one either **in full** (supersede) or **in
part** (amend). Amend when the earlier ADR's remaining decisions still stand on
their own recorded reasoning; supersede when nothing worth keeping would remain.
Never amend to fix wording or add detail — that is a `design/` update or a
new ADR.

To replace a decision **in full**:

1. Write a **new** ADR; set its `supersedes: [<old-id>]`.
2. On the **old** ADR, set `status: superseded`, `superseded_by: <new-id>`, and
   bump `updated:`. Do **not** change its body.

To replace a decision **in part**:

1. Write a **new** ADR; set its `amends: [<old-id>]`. Its Decision section must
   say which parts of the old ADR it replaces and that the rest stands — this
   is the only place the scope is recorded.
2. On the **old** ADR, append `<new-id>` to `amended_by` and bump `updated:`.
   Leave `status: accepted`, `superseded_by: null`, and the body untouched — no
   notice paragraph, no strike-through. The frontmatter link is the notice; the
   current shape of the system is `design/`'s job, not the old ADR's.

An amending ADR is an ordinary ADR and can itself be amended or superseded.
Superseding an amended ADR in full retires that ADR alone; its amendments stay
accepted unless the new ADR names them too.

Status, supersede / amend links, and mechanical repair of a renamed flat-type
path link are the only mutable parts of an accepted ADR.
