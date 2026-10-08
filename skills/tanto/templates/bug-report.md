# Bug report — <the symptom in one line, in the reporter's words>

Written from the tanto skill's `templates/bug-report.md` by whoever noticed
the defect, saved at `.tanto/sent/<YYYY-MM-DD>-<slug>.md` under the
reporter's own repository (whose `.tanto/.gitignore` holds `*` and whose
`.tanto/.markdownlint-cli2.yaml` holds `config:` / `default: false`; create
both if absent; `<slug>` is kebab-case from the symptom, one to six words),
and sent to the intake as one line, `bug-report: <absolute path>`. The intake
is the target workspace's `live` Hosa, else its Kanri: the bare name — the
`<name>` in the third column, before any bracket, whichever header that
roster carries — of the roster row
whose Role is `hosa` and whose Status begins with `live`, or of the first
data row when there is none, checked against `ListAgents`, or given by the human when that
roster is absent or the name is not listed. The intake copies the file to
`.tanto/inbox/` under this file's basename, fills Received in the copy, and
answers `received: <inbox path>`; Triage is filled in the copy at a close.

Nothing in this file names the reporter's repository, its path, its
sessions, or its topics, and nothing quotes that repository's own documents:
a tracked file written from this report names it as
`inbox <YYYY-MM-DD>-<slug>` and nothing more.

## Send to

<The intake's bare name, as read from the target roster, or as the human
gave it. Leave it blank if the report was never sent, so the file still says
where it was meant to go.>

## Symptom

<What was expected, and what happened — restated against the skill's own
text and, where a specific incident is cited, read from that incident's own
transcript when one is on disk rather than from a ledger's summary of it.
Quote nothing from the reporter repository's plans, specs, ledgers, or
dialogues.>

## Reproduction

```console
<the exact command, copy-pasteable, run from the root of the repository that
ships the skill, or against the inline fixture below>
```

<What it printed. If there is no single command, write the exact sequence
instead, step by step, and what each step printed. Replace every path from
the reporter's repository by `<repo>`; an input the command needs is an
inline fixture written here.>

## Where seen

- Skill — <the skill that ships the defect>
- File — <the path inside the skill, if it is known>
- Role or mode — <the role or mode the reporter was in>

## Severity guess

<One word. A hint for the close's recommender, not a ruling.>

## Proposed fix

<Optional, as text. Delete this section's blank if you have none. A repair
that is one sentence, written here as the sentence, lets the close apply it
as a fix instead of filing an issue.>

## Reported

- `<YYYY-MM-DD>`

## Received

<Left blank by the reporter. The intake appends one line to the inbox copy:
`- <the envelope's from-name, or "the human, in chat">, <YYYY-MM-DD>`.>

## Triage

<Left blank by the reporter and by the intake. The close's apply replaces the
three bracketed values in the inbox copy and nowhere else; a copy whose Outcome is one of the six
words is out of the queue.>

- Outcome — <issue, fix, redirect, kaiseki, relay, or dismissed>
- Reference — <the issue id, the fix's commit subject, the redirect or
  dismissal in one line, the kaiseki line, or the relay's `I-<n> of <topic>`,
  the topic alone until Kanri has appended the `I-n`>
- Date — `<YYYY-MM-DD>`
