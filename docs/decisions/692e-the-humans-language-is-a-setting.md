---
id: "692e"
title: the human's language is a setting
status: accepted
supersedes: []
superseded_by: null
amends: ["2497", "ace0", "9a3a"]
amended_by: []
created: 2026-09-24
updated: 2026-09-24
---

## Context

tanto rendered its human-facing text in "the chat's language", read from the
human's first message. A spawned seat's first message is Kanri's prompt —
English keys and paths, not the human's words — so the seats the human had to
ask for Japanese did not speak it, while others followed a user-level
instruction file. The repository's `AGENTS.md` rule, "use the language of
the user's first message", outranks a skill and pointed a spawned seat at
that prompt whatever tanto said. The design "bg-seat-fixes" (2026-09-24),
section 6, sets the rule.

## Options

- **A top-level `language` key in `tanto.json`, one definition in
  `SKILL.md`, every site saying "the human's language", and the repository's
  first-message rule changed to put a configured language first (Q2,
  option b).** Chosen.
- **`SKILL.md` reading the repository's rule as satisfied by the key alone
  (Q2, option a).** Rejected: the rule outranks the skill, and precedence
  would rest on interpretation.
- **Leaving the rule out of scope (Q2, option c).** Rejected: the spawned
  seats would keep speaking English.
- **A project-only key.** Rejected: the human wants one file for every
  repository.
- **The script printing the language.** Rejected: no script needs it.

## Decision

`language`, at the top level of `tanto.json` beside `sessions`, `subagents`,
and `ceiling`, holds a BCP 47 tag and overlays across the three layers like
every other key; the built-in file sets none, and the personal file is where
the human sets it. The human's language is the merged `language` when one is
set; otherwise what the repository's own language rule gives; English only
when nothing names a language. It governs the human-facing text only — every
seat's closing line, the review and shoroku briefs, the kessai question and
every line Kanri prints for the human, an `attention` message, the batch
report's Questions for the human, the dialogues a seat holds with the human,
and every AskUserQuestion — and not the lines between sessions, anything
under `docs/`, the ledger, the roster, the reports, the subagent prompts, the
decision files, or the launcher's printed lines. Every role reads it at
start with the rest of the config. `scripts/reading.js` is unchanged. The
repository's `AGENTS.md` language rule and the kisou template's become "use
the language the user has configured, else the language of the user's first
message".

This amends, each in one part: decision-2497 — the closing line is rendered
in the human's language, not the chat's; decision-ace0 — the brief is written
in the human's language; decision-9a3a, as decision-eee2 amended it — the
file carries three maps and one top-level scalar, `language`, and its overlay
and defaults stand. The rest of each stands.

## Consequences

- Every seat, spawned or opened by the human, speaks the same language to the
  human; the lines between sessions keep their fixed English forms.
- A composed skill's rule was changed for tanto's need, on the human's
  explicit word; req-04f5's "Composes without modifying" names that
  exception.
- The kisou rule's reach is wider than tanto: a user-level instruction such
  as "Chat in Japanese" reads as a configured language in every repository
  kisou manages.
