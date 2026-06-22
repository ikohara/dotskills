# AGENTS.md

This project keeps its state as a set of small Markdown documents under
`{{docs}}/`, in four types. The rules here are agent-agnostic: any agent that
adds or edits these docs — with or without the `shoroku` skill — follows them.

## Document management

Project state lives in four types, one file per entry:

```text
{{docs}}/{{requirements}}/<id>-<slug>.md    — what the project must do for users, and why
{{docs}}/{{design}}/<id>-<slug>.md          — how it is built now, and why this shape
{{docs}}/{{decisions}}/<id>-<slug>.md       — ADRs: why a choice was made (immutable record)
{{docs}}/{{issues}}/<status>/<id>-<slug>.md — known problems / deferred decisions
```

Per-type rules (frontmatter, body, lifecycle) live in each
`{{docs}}/<type>/AGENTS.md`. Read the one for the type you are touching.

**New subdirectories under `{{docs}}/`.** The four above are the standing
schema. If you add another subdirectory, propose adding its path to the
Markdown linter's ignore list before populating it — or leave it linted
like the rest of `{{docs}}/`.

For the four type directories only:

- **No index files.** A directory listing plus each file's frontmatter
  `title:` is the index.
- **`<id>`** — the first 4 hex chars of a fresh UUID, lowercase. Unique within
  its type (the type prefix disambiguates across types). Emit `id:` as a quoted
  string (a 4-hex id may be all digits and would otherwise parse as an int).
  Before creating, check `{{docs}}/<type>/**/<id>-*.md` is empty.
- **`<slug>`** — English, kebab-case, derived from the title.

Generate an `<id>`:

```bash
# POSIX
uuidgen | tr -d '-' | cut -c1-4 | tr 'A-Z' 'a-z'
```

```powershell
# PowerShell
[guid]::NewGuid().ToString('N').Substring(0,4).ToLower()
```

### Cross-references

Refer to an entry as `<type>-<id>` in prose, commits, and code comments:

- `req-d4e5` · `design-f6a1` · `decision-a3f7` · `issue-b9c2`

The `<type>-<id>` reference is the **durable** pointer: it survives slug renames
and — for issues — status moves. A Markdown link to the file is an **optional
convenience for clickability** and is **fragile** — it breaks whenever the
target's path changes.

- **Prefer `<type>-<id>` everywhere.** A path link is an extra on top of it,
  never a replacement.
- **From an immutable or frozen document, use `<type>-<id>` only — never a path
  link.** Such documents — ADRs in `{{decisions}}/`, and any dated
  point-in-time record a project keeps (reports, dated plans) — are not edited
  after they are written, so a path link in them can never be repaired and rots
  permanently once the target moves.
- **From a living document** (`{{requirements}}/`, `{{design}}/`, an open issue)
  a path link is allowed, but whoever moves the target owns updating the inbound
  links — see `{{issues}}/AGENTS.md` for the issue-status case.

Structured (frontmatter) links are limited to ADR `supersedes` /
`superseded_by` and issue `depends_on` / `blocks`.

## Session shoroku (excerpting)

At the user's request, fold the working session into these docs. Any agent can
run this; it needs no skill.

1. **Read** the session: the conversation, plus any Markdown written or edited
   during it, plus the existing `{{docs}}/` as baseline.
2. **Classify** each candidate as exactly one of requirement / design /
   decision / issue (see "design vs decisions" in the type files for the
   design/decision split).
3. **Propose** a single numbered list, grouped by destination file, of only the
   entries that would change project state. End with `Direction?` and wait.
4. **Apply** the accepted subset, following the per-type `AGENTS.md`. Stage and
   commit as **one** git commit naming the session's topic. No auto-push.
5. **Report** the files changed and the commit hash. If nothing substantive,
   say so and write nothing — never invent content.

(With the `shoroku` skill, the same flow is available on a trigger, and can also
draw from accumulated memory or named Markdown files instead of the session.)
