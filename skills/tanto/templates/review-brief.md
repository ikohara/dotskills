# Review brief — <spec or plan> — <topic>

Written by the brief writer Kanri dispatches, at
`.superpowers/sdd/<topic>/review-brief-spec.md` or `review-brief-plan.md`,
next to the review reports and untracked under `.superpowers/sdd/.gitignore`.
Every part of the brief, these headings included, is written in the chat's
language, which the dispatch names; this template is the English source the
writer renders. The brief selects and renders; it does not analyze anew.

Document: <path> — brief written <YYYY-MM-DD> on <model family> for the chat
language <language>. Inputs read: <the document; for a spec also
spec-inputs.md and dialogue.md; for a plan also the spec>.

## How to answer

Answer in a numbered list, one line per point, `<section>.<point>` then the
reply. The shapes: `OK` confirms the document's answer; `→ <option>` chooses
one of the options a point names; `→ <decision>` decides what the document
left open; `change: <what>` accepts with an edit; `later: <reason>` defers.
`all OK` confirms every point tagged confirm at once, and a point not
mentioned counts as confirmed. Example:

    all OK
    2.1 → (b)
    3.1 change: the bullet reads "..."
    4.2 later: measure first

Each point opens with what it asks of you: **confirm** — the document
decided, say OK or object; **choose** — the document names options, pick
one; **decide** — the document left it open, your answer decides it;
**nothing** — information, no answer needed unless you object. Then the
question, in one sentence; the document's answer, in one sentence; and the
pointer — the document's section heading that answers it, copied as it
stands in the document and not translated, never a line number; the pointer
is the one part of a point not rendered into the chat's language. At most
five points per section; what does not fit goes to the last section, one
line each. For a spec, section 5's body is the single line
`<not applicable — a spec>`.

## 1. Scope and what was excluded

1. [confirm | choose | decide | nothing] Q: <...> — A: <...> — See: <section>

## 2. Choices among alternatives, with the rejected ones and their reasons

1. [confirm | choose | decide | nothing] Q: <...> — A: <...> — See: <section>

## 3. Requirements

Two questions per item: which requirement this design serves — read from the
document's own `req-<id>` citations, "not stated" when it has none — and
whether it adds to or changes a requirement or an ADR. A point that adds or
changes one asks you to confirm its wording; a point that serves one and
changes nothing asks nothing.

1. [confirm | nothing] Serves: <req-<id>, the bullet, or "not stated"> — Adds or changes: <yes: what, or no> — See: <section>

## 4. Deferred items

1. [confirm | choose | decide | nothing] Q: <...> — A: <...> — See: <section>

## 5. For a plan: the batch cut, the replacement boundary, what each batch verifies

1. [confirm | choose | decide | nothing] Q: <...> — A: <...> — See: <section>

## What the writer could not settle

Each line says what an answer here does: "no answer needed unless you
object" for a decided item that overflowed its section, or "an answer here
decides <what>" for a gap the document leaves.

- [nothing | decide] <the point, one line> — <no answer needed unless you object | an answer here decides <what>>
