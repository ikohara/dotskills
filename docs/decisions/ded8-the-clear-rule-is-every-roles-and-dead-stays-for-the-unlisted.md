---
id: "ded8"
title: "the clear rule is every role's; `dead` stays for the unlisted"
status: accepted
supersedes: []
superseded_by: null
amends: ["d831", "ce83"]
amended_by: ["8320", "cdc4", "39fb"]
created: 2026-09-18
updated: 2026-09-24
---

## Context

`cleared` entered the roster for the two seats outside the lifecycle, Kikaku
and Hosa, which the human `/clear`s rather than deletes. Once every seat's
window is reused (req-04f5), the question is whether `cleared` generalizes to
the lifecycle roles too, and what is left for `dead`.

## Options

- **The clear rule is every role's**, and `dead` stays for a window that is
  gone without appearing on the roster.
- **`cleared` limited to Kikaku and Hosa**, with the lifecycle roles keeping
  the deletion vocabulary.
- **`replaced` for a retired Jisso.** The seat-lineage decision file of
  2026-09-16 §2 suggested it — a Jisso that has handed its batch on "fits
  without a new word". Rejected: a released window is given `cleared` like
  every other release, and `replaced` is kept for a Kanri's old row alone,
  because a retired Jisso is a window the human `/clear`s, and one status per
  fact keeps the roster's archive rule readable.

## Decision

The clear rule is every role's; `dead` stays for the unlisted (I-1 §5, §8).

**This ADR amends decision-d831 and decision-ce83** where they say a session is
"deleted" once its proposal is on disk: it is **released**, and the window is
kept. Everything else in both ADRs stands — d831's requirement that every
planned exit carry its own shoroku, and ce83's four steps and its
recommendation-checked-by-exception rule.

## Consequences

- One status per fact: `cleared` for a release, `replaced` for a Kanri's
  superseded row, `dead` for a window the roster never listed.
- The archive's enumeration has to carry `cleared` wherever it lists the
  archived statuses.
- The deletion vocabulary leaves the runtime text, which is what the
  seat-lineage sweep in `docs/notes/tanto-consistency-checks.md` check 25 now
  holds in place.
