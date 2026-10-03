---
id: "3b01"
title: the Start sequence's agent-definition write-out has no instrument, so every Kanri hand-writes the render-and-compare script
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-03
updated: 2026-10-03
---

Source: shoroku tanto-issue-triage S-137

Start step 1 asks Kanri to compare the user-scope and project-scope agent
definitions with what `templates/agent.md` renders for each of the fifteen
kinds. The result is the start line's figure `agents: <n> current, <m>
written, <k> not visible; project: <p> current, <q> written, <r> removed,
<s> in effect`.

No script does this. A Kanri hand-writes the render-and-compare script at
every start (the measured tenure's was a throwaway under
`$CLAUDE_JOB_DIR/tmp`), and two Kanris may count the same files
differently.

Proposed: a `tanto.js agents` subcommand, or a `reading.js --config`
sibling, that prints the two counts of the start line. Which surface of the
launcher carries it is a decision. Beside issue-337b (two definition files
for one kind) and issue-1c9a (a definition named with the wrong extension).
