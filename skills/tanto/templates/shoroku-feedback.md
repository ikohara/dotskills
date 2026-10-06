# Shoroku feedback — <workspace id> <YYYY-MM-DD>

Written from the tanto skill's `templates/shoroku-feedback.md` at a plan
close, at `.tanto/<topic>/shoroku-feedback.md` in the main checkout, in two
hands, and sent by a third. Shoki writes Items and Departures from the
close's recommendation and direction — a Hosa, on a chore the human hands
it for a topic already closed, writes Items from what the human tells it and
Departures `none`. `usage.js close` writes Usage, checks the file, places
it — under `.tanto/sent/` as `<YYYY-MM-DD>-feedback-<workspace id>.md`,
with `-2`, `-3` before `.md` for a further file of the same day, or straight
into `.tanto/inbox/` in the repository that ships the skill — and prints the
line that is sent to that repository's intake,
`shoroku-feedback: <absolute path>`. The intake copies the file to its
`.tanto/inbox/` under the same basename and appends one line under
Received; the receiving close's apply fills Triage in the copy, each line
under Items being one item of that close's recommendation. A section its
hand has nothing for carries the single line `none`.

Nothing in this file names the repository it came from, its path, its
topics, or its sessions, and nothing quotes the human, an item's source
text, or that repository's documents. The workspace is named by its id
alone; an item is paraphrased in tanto's terms — a role, a kind, a
template, a step; a type is one of the six `docs/` type words, `fix`, or
`feedback`, never a document's id, title, or path; and Usage carries a date
and durations, never an instant. `usage.js close` searches the file for what
would name the workspace before it places it, and holds a file that does.

- Workspace — <workspace id>
- Closed — <YYYY-MM-DD>

## Items

<n>. <the line that travels> — Class: tanto-only | both

## Departures

<n>. <override | retyped | unsure-resolved | rejected-as-recommended> — recommended <type, and adopt or reject> — directed <type, and adopt or reject> — <the reason, paraphrased> — rule: <the rule it suggests, or none yet>

## Usage

<one fenced json block: the usage extract of 4.6>

## Received

## Triage

- Outcome — <feedback>
- Items — <n>: <issue | fix | redirect | kaiseki | relay | dismissed> — <reference>
- Date — <YYYY-MM-DD>
