# AGENTS.md

This project keeps its state as a set of small documents under `docs/`. The
rules are agent-agnostic: any agent editing these docs follows them, with or
without the `shoroku` skill.

## Document management

Project state lives in six types, one file per entry — four **managed**
(frontmatter with a hash `<id>`) and two **flat** (no `<id>`, no frontmatter;
slug or date is the identity):

```text
docs/requirements/<id>-<slug>.md    — what the project must do for users, and why
docs/design/<id>-<slug>.md          — how it is built now, and why this shape
docs/decisions/<id>-<slug>.md       — ADRs: why a choice was made (immutable record)
docs/issues/<status>/<id>-<slug>.md — known problems / deferred decisions
docs/notes/<slug>.<ext>             — maintained single-concern references (living)
docs/reports/<YYYY-MM-DD>-<slug>.md — dated, frozen investigations
```

Per-type rules (frontmatter, body, lifecycle) live in each
`docs/<type>/AGENTS.md`. Read the one for the type you are touching.

**New subdirectories under `docs/`.** The six above are the standing schema.
Add another only after proposing its path for the linter's ignore list — or
leave it linted like the rest.

**Not a scratch space.** These six types are curated project state. A tool or
skill's own working artifacts (plans, specs, scratch, session logs) go under its
**own** `docs/` subdirectory (e.g. `docs/superpowers/`), exempt from
these rules — never into `notes/` or any of the six types.

For the four type directories only:

- **No index files.** A directory listing plus each file's frontmatter
  `title:` is the index.
- **`<id>`** — the first 4 hex chars of a fresh UUID, lowercase. Unique within
  its type (the type prefix disambiguates across types). Emit `id:` as a quoted
  string (a 4-hex id may be all digits and would otherwise parse as an int).
  Before creating, check `docs/<type>/**/<id>-*.md` is empty.
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
  link.** Such documents — ADRs in `decisions/`, and any dated
  point-in-time record a project keeps (reports, dated plans) — are not edited
  after they are written, so a path link in them can never be repaired and rots
  permanently once the target moves.
- **From a living document** (`requirements/`, `design/`, an open issue)
  a path link is allowed, but whoever moves the target owns updating the inbound
  links — see `issues/AGENTS.md` for the issue-status case.

**The flat types are the exception.** `notes/` and `reports/` have no
`<id>`, so they are cited by **path** from any document, frozen ones included.
They have no status directories — a flat path changes only on a deliberate
rename — and whoever renames a note or report owns updating its inbound links
repo-wide. That mechanical link repair is allowed even in a frozen document's
body: it does not alter what was recorded.

**Documents outside the six types are not path-linked from frozen documents.**
A tool's own `docs/` subdirectory (e.g. `docs/superpowers/specs/`) has
neither an `<id>` nor a renamer who owns inbound links, so a path to it from an
ADR or report can neither survive nor be repaired. Refer to such a file by name
— its title and date — and, if it must stay durably citable, freeze the material
as a `reports/` entry and cite that path instead.

Structured (frontmatter) links are limited to ADR `supersedes` /
`superseded_by` / `amends` / `amended_by` and issue `depends_on` / `blocks`.

## Session shoroku (excerpting)

At the user's request, fold the working session into these docs. Any agent can
run this; it needs no skill.

1. **Read** the session: the conversation, plus any Markdown written or edited
   during it, plus the existing `docs/` as baseline.
2. **Classify** each fragment as exactly one of requirement / design /
   decision / issue (see "design vs decisions" in the type files for the
   design/decision split).
3. **Propose** a single numbered list, grouped by destination file, of only the
   entries that would change project state. End with `Direction?` and wait.
4. **Apply** the accepted subset, following the per-type `AGENTS.md`. Stage and
   commit as **one** git commit naming the session's topic. No auto-push.
5. **Report** the files changed and the commit hash. If nothing substantive,
   say so and write nothing — never invent content.

shoroku targets all six types. Fragments fold into the four **managed** types;
the two **flat** types take whole files — propose a new `reports/` entry when
the session is essentially an investigation worth freezing, or a `notes/`
create/append when it built durable reference material. Don't cram an
investigation record into `design/`/`decisions/` when it is really a
report.

(With the `shoroku` skill, the same flow is available on a trigger, and can also
draw from accumulated memory or named Markdown files instead of the session.)
