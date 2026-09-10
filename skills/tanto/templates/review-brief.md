# Review brief — <spec or plan> — <topic>

Written by the brief writer Kanri dispatches, at
`.superpowers/sdd/<topic>/review-brief-spec.md` or `review-brief-plan.md`,
next to the review reports and untracked under `.superpowers/sdd/.gitignore`.
Every part of the brief is written in the chat's language, which the dispatch
names, the headings included; this template is the English source the writer
renders. The form markers are the exception and stay exactly as they are
here: the bracketed tag words `confirm`, `choose`, `decide`, `nothing`, the
labels `Q:`, `A:`, `Serves:`, `Adds or changes:`, `See:`,
`— If unanswered:`, the `## <n>.` numbers, and the pointer after `See:`. The
brief selects and renders; it does
not analyze anew.

Document: <path> — brief written <YYYY-MM-DD> on <model family> for the chat
language <language>. Inputs read: <the document; for a spec also
spec-inputs.md and dialogue.md; for a plan also the spec>.

## How to answer

Answer in a numbered list, one line per point, `<section>.<point>` then the
reply. The shapes: `OK` confirms the document's answer; `→ <option>` chooses
one of the options a point names; `→ <decision>` decides what the document
left open; `change: <what>` accepts with an edit; `later: <reason>` defers.
`all OK` confirms every point tagged confirm at once, and a point tagged
confirm or nothing that goes unmentioned counts as confirmed. A point tagged
choose or decide needs its own line; when it goes unanswered, what the point
names after `— If unanswered:` is what it selects, so that you see before
answering what your silence will choose. A choose or decide point carrying no
such clause is a defective brief: it stays open, and Sekkei asks for it on its
own line rather than reading a default into it.
Example:

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
stands in the document and not translated, never a line number; the pointer,
like the labels and the tags, is not rendered into the chat's language. At
most five points per section; what does not fit goes to the last section,
one line each. For a spec, section 5's body is the single rendered line
`not applicable — a spec`.

Every point tagged **choose** or **decide** ends with `— If unanswered: <what>`
after the pointer. For a **decide** point it names the document's own answer
where one exists, and otherwise the recommendation Sekkei states with the
brief; for a **choose** point it names one of the options the point lists. The
clause is the writer's, it is rendered in the chat's language like the rest of
the point, and the marker `— If unanswered:` itself is a form marker and stays
as it is. The unsettled section's `decide` lines carry it too; they have no
pointer, so it follows the line's own trailing clause instead (issue-867f).

## 1. Scope and what was excluded

1. [confirm | choose | decide | nothing] Q: <...> — A: <...> — See: <section> — If unanswered: <what, on a choose or decide point only>

## 2. Choices among alternatives, with the rejected ones and their reasons

1. [confirm | choose | decide | nothing] Q: <...> — A: <...> — See: <section> — If unanswered: <what, on a choose or decide point only>

## 3. Requirements

Two questions per item: which requirement this design serves — read from the
document's own `req-<id>` citations, "not stated" when it has none — and
whether it adds to or changes a requirement or an ADR. A point that adds or
changes one asks you to confirm its wording; a point that serves one and
changes nothing asks nothing.

1. [confirm | nothing] Serves: <req-<id>, the bullet, or "not stated"> — Adds or changes: <yes: what, or no> — See: <section>

## 4. Deferred items

1. [confirm | choose | decide | nothing] Q: <...> — A: <...> — See: <section> — If unanswered: <what, on a choose or decide point only>

## 5. For a plan: the batch cut, the replacement boundary, what each batch verifies

1. [confirm | choose | decide | nothing] Q: <...> — A: <...> — See: <section> — If unanswered: <what, on a choose or decide point only>

## What the writer could not settle

Each line says what an answer here does: "no answer needed unless you
object" for a decided item that overflowed its section, or "an answer here
decides <what>" for a gap the document leaves.

- [nothing | decide] <the point, one line> — <no answer needed unless you object | an answer here decides <what>> — If unanswered: <what, on a decide line only>
