# Bug report — <the symptom in one line, in the reporter's words>

Written from the tanto skill's `templates/bug-report.md` by whoever noticed the
defect, saved anywhere untracked under the reporter's own repository's
`.superpowers/sdd/` (whose `.gitignore` holds `*`; create it if absent), and
sent to the intake as one line,
`bug-report: <absolute path>`. The intake Kanri copies it to
`.superpowers/sdd/inbox/<YYYY-MM-DD>-<slug>.md` and fills Triage in the copy.

## Send to

<The intake's bare name, as the human gave it. Leave it blank if the report was
never sent, so the file still says where it was meant to go.>

## Symptom

<What was expected, and what happened.>

## Reproduction

```console
<the exact command, copy-pasteable, run from the repo root>
```

<What it printed. If there is no single command, write the exact sequence
instead, step by step, and what each step printed.>

## Where seen

- Repository — <path or name>
- Skill — <the skill that ships the defect>
- File — <the path inside the skill, if it is known>
- Role or mode — <the role or mode the reporter was in>

## Severity guess

<One word. A hint for the intake, not a ruling.>

## Proposed fix

<Optional, as text. Delete this section's blank if you have none.>

## Reporter

- <name> [<ref>]
- <absolute path of the reporter's repository>
- <YYYY-MM-DD>

## Triage

<Left blank by the reporter. Kanri fills it in the inbox copy and nowhere
else.>

- Outcome — <issue, redirect, kaiseki, hotfix, or relay>
- Reference — <the issue id, the commit subject, the redirect in one line, or
  I-<n>>
- Date — <YYYY-MM-DD>
