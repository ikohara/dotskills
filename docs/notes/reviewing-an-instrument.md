# Reviewing an instrument

A `tanto` plan's own verification — its passage-check script, its test
suite, its `verify` command — is itself unreviewed code the first time a
plan relies on it, and it earns the same scrutiny as the work it checks.
This note collects methods for reviewing that apparatus: what mutation
testing finds that reading does not, when reconstruction is the only
complete check, what an unpinned check looks like, how a script's own
leaks get caught, and what narrowing a catch costs. Lessons about writing a
plan's verification content —
needles, counts, expectations — are in
`docs/notes/authoring-a-passage-plan.md`; the mechanical checks a `tanto`
plan runs against the skill itself are in
`docs/notes/tanto-consistency-checks.md`.

## Mutation testing

- Mutation testing finds what reading does not. Introducing a mutation and
  checking whether a test catches it found three cases, in one batch, where
  a fix or a check rested on no test at all — a whole comparison, a CR-strip
  whose fixture repository had already normalized the CR away, and a
  header-precision fix — and reading the same code had found none of the
  three.
- The general form: a test that asserts on a downstream signal cannot pin a
  rule whose violation leaves that signal unchanged. A gap-closing task is
  not immune to the gap it closes — a test written specifically to close a
  coverage gap can itself assert on the wrong signal and pass whether or not
  the rule holds. The fix in every case found was to assert on the parse
  result the rule produces, not on a later stage's output that happens not
  to move when the rule is violated.

## Reconstruction

- A partial-tree dry run invites arithmetic in place of a run. When a dry
  run says "cannot validate on this tree," the standard fallback is to
  reconstruct only the files the command actually reads, plus empty
  placeholders for the paths it creates — one script rather than an
  estimate, and running it is what found the defect an estimate would have
  missed.
- A task or batch report can misdescribe correct work: one report claimed an
  ordering that the git blobs directly refute, while the tree itself was
  right. Verify a report against the blobs, never against a reading of the
  report's own prose — reconstruction over reading is the same lesson
  mutation testing gives from the other direction, and it held across every
  batch it was tried on.
- The verification-only task's inverted reviewer instruction — tell the
  reviewer of a recorded-output deliverable to *re-run* the checks, not read
  the record of them — worked in practice: a reviewer who re-ran everything
  before opening the report caught a claim (`ls templates/` → 11) whose
  distinctness from the diff base would have voided the boundary had the
  claim failed.

## `verify` and reconstruction answer different questions

- `verify` asserts that each new passage is present exactly once; only
  reconstruction — `replay`, or a reviewer's own blob rebuild — shows that
  nothing changed outside the plan's blocks. A wave of nineteen blocks
  needed both: one without the other proves only half of what a passage
  plan claims.
- A fix wave that revises a plan's own passages makes `verify --plan <plan>
  --task N` report those tasks `passage-absent`, correctly — the tool is
  telling the truth about a tree the wave has already moved past. A boundary
  check that runs `verify` over a plan's tasks after a fix wave has to
  expect that, or it will read a right tree as broken: `verify --plan <plan>
  --task N` is only meaningful against a tree no later wave has revised.

## Unpinned checks

- A new test in a TDD plan can be unpinned before the feature it targets
  exists. A test asserting `exit 2` for "unknown subcommand," for instance,
  is satisfied by the pre-implementation error path too, so it passes before
  the feature is written and the plan's red step under-reports by one.
  Write the assertion so the pre-implementation state cannot satisfy it, and
  state the red step's count from an actual run.

## Leaks and temporary directories

- A leaked temporary tree is a defect a batch report will not surface on its
  own: one script leaked a temporary tree per invocation with no test
  asserting cleanup, and it was a boundary reviewer's own leftover check,
  not the batch report, that found it. Removing a temporary directory is a
  test like any other test; put a leftover check in the reviewer's own
  verification so it does not depend on the instrument under review to
  report on itself.
- A leak's stated source can be the minority of it. One leak framed as
  coming from a single function measured at 336 of 1675 leaked directories
  from that function, 553 from a test helper that builds a fixture
  repository, and 786 from the plan-writing helpers — count every source
  before scoping a fix to only the one first blamed.
- A `finally` block that removes a temporary tree can turn a passing run
  into an uncaught exception, and a hoist that fixes one exit path can cost
  another: two exit codes (2 versus 1) moved in opposite directions from the
  same change. Probe each exit path of a cleanup routine separately; do not
  infer one from the other.

## Narrowing a catch

- Narrowing a `catch` to domain error classes requires every raw I/O call on
  the guarded path to be wrapped into a domain error first. The kisou-refresh
  fix wave's m-1 narrowed `runApply`'s catch and regressed "a write failure
  is exit 2" into exit 1 with a stack trace, until `writeItem`'s fs calls
  were wrapped to raise `ApplyError` (`cannot write <path>: <message>`); one
  stubbed-EPERM test now pins exit 2 and a one-line stderr. The reviewer's
  check for such a narrowing is "what does a raw fs error do now?" — walk
  each raw call under the narrowed catch and name the exit path it takes.
