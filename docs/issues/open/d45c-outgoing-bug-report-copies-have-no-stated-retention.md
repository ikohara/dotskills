---
id: "d45c"
title: outgoing bug-report copies have no stated retention
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-17
updated: 2026-09-17
---

`SKILL.md`'s "Reporting from the other side" says where an outgoing bug
report is *sent* — the intake's bare name, read from the target workspace's
roster — but names no destination or lifetime for the *sender's own local
copy* once it is sent. The incoming side has an explicit, dated convention
(`.tanto/inbox/<YYYY-MM-DD>-<slug>.md`); the outgoing side has grown its own
convention by accretion instead: a flat, undated `bug-report-<slug>.md`
sitting directly at `.tanto/`'s own root, with no index and no stated expiry.

Reported from `kuchidome` (bug-report-tanto-outgoing-bug-report-retention-undefined,
2026-09-17): 32 files matching `bug-report-*.md` sit directly under that
repository's `.tanto/`, accumulated across at least six prior Kanri tenures,
none removed once their reply arrived and was receipt-confirmed — several of
the sends that repository's own ledger records as "receipt-confirmed" are
still on disk there.

Two directions to choose between, from the reporter: (a) name a retention
rule explicitly — the sender's own copy may be deleted once the intake's
`triage:` reply is received and recorded, since the receiving end's inbox
copy is then the durable record; or (b) give the outgoing side the same
dated-and-indexed shape the inbox already has
(`.tanto/sent/<YYYY-MM-DD>-<slug>.md`), so a long-lived repository does not
grow an unbounded flat file list with no way to tell what is still open.

Second data point, from a re-send of the same report two Kanri tenures later
(2026-09-17): the file count grew from 32 to 44, including the report of this
very defect, which itself sat unsent from its own draft until this later
send — the retention gap applies to a report about itself.
