---
id: "c322"
title: a bug report is held untracked and decided at a close, and the intake is the cheapest live seat
status: accepted
supersedes: []
superseded_by: null
amends: ["2f36", "1ab5"]
amended_by: ["73cc"]
created: 2026-09-20
updated: 2026-10-07
---

## Context

Under the previous design the intake was the resident Kanri, which triaged each
report on arrival into one of five outcomes. Two costs were measured. An
intake's cost is not the act — one line, reading nothing — but the receiving
session's context re-read, and the conductor carries the largest context in the
run; and a triage on arrival is a decision taken with none of the close's
context, by the one seat whose attention the run most needs elsewhere. Sixty
reports had accumulated, most of them arriving while a Sekkei was live.

## Options

- **A one-line forward to Kanri while a Sekkei is live.** Rejected: it wakes
  the conductor for every report during a spec, which is most of the time.
- **The five-way triage on arrival with Hosa as executor.** Rejected: it is the
  status quo with a different name and does not reduce Kanri's wake-ups.
- **An idle-time sweep at some stage before the close.** Rejected: moot under
  decision-ce83's one human check per topic — whatever the sweep decided would
  wait for the close anyway.
- **Hold the report untracked and decide it at the close; the intake is the
  cheapest live seat.** Chosen.

## Decision

A report is copied to the inbox by the cheapest seat that is live, which
answers `received: <inbox path>` in one line and reads nothing of the report.
No filing, no hotfix, and no ruling per report. Every held report is decided at
the next topic's close, by the same recommendation the human checks by
exception, into an issue, a fix applied, a redirect, a root-cause pass, an
input to a spec, or a dismissal.

**Amends decision-2f36** (the hotfix lane), in these parts and no others: the
lane is opened by the human's word alone and never by a report's triage; its
commit body names no report's origin; the third path for a fix to a
plan-listed file is an inbox copy rather than an issue; and the intake no
longer derives the report's slug from its Symptom — the sender names the file,
so that the receiving act reads nothing. The rest of decision-2f36 stands.

**Amends decision-1ab5** in one part: its list of Hosa's chores named "the
intake's issue filings", and there are none — Hosa is the intake itself. The
rest of decision-1ab5 stands.

## Consequences

A report waits for a close rather than being answered in a day, and the
reporter hears only `received:`; what it costs the reporter is recorded as a
deferred issue rather than solved here. In exchange the conductor is not woken
by intake at all, and every report is decided with the close's context and
under one human check. The five triage outcomes gain a sixth, `fix`, in
decision-83aa.
