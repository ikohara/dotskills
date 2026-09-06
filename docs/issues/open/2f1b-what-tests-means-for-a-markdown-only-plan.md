---
id: "2f1b"
title: the Jisso role file does not say what tests are for a documentation-only plan
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-06
updated: 2026-09-06
---

subagent-driven development's dispatch templates assume a test suite. The
implementer template says to run the focused test while iterating and the full
suite once before committing, and to record evidence of a failing run before the
fix and a passing one after. The reviewer template says not to re-run the suite
to confirm the implementer's report, and treats warnings in the test output as
findings.

A plan that ships Markdown — a skill, a document set, a template pack — has no
suite. Its equivalents are different in kind, not just in name, and
`skills/tanto/roles/jisso.md` says nothing about the substitution, so every
dispatch has to invent the wording again.

What the substitution actually was on the run that produced this issue, across
fourteen tasks and one fix wave:

- **lint on the changed paths, named individually** — a directory argument makes
  every hook skip and proves nothing, which is a trap worth stating once;
- **content greps** for required headings in order, for exact strings later
  tasks depend on, and for strings that must be absent;
- **a real YAML load** of the skill's frontmatter, not a regex, because a colon
  followed by a space silently breaks frontmatter parsing;
- **a JSON parse** of the shipped config, because no pre-commit hook parses
  JSON in this repo.

Two consequences followed from the gap. Every implementer dispatch had to say
what "tests" meant for its task, and one task — a verification-only pass that
creates no file — needed its reviewer told the *opposite* of the template's
standing instruction: re-run the checks, because the recorded output is the
deliverable rather than a claim about code.

To do: add a short section to the executor's role file saying what verification
means when the plan produces documents, and naming the verification-only case as
the one where a reviewer re-runs rather than trusts. One place, once, instead of
once per dispatch.
