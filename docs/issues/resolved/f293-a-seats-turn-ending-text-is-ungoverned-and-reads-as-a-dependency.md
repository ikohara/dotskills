---
id: "f293"
title: a seat's turn-ending text in its own window is ungoverned and reads as a dependency
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-17
updated: 2026-09-18
---

The contract releases a seat while the one text the human reads says the seat
is waiting, so the human hesitates over a session that can already go. The
need behind it is the "A seat's last words say whether the seat can be
released" bullet of req-04f5; this issue records the gap.

## The measured case

The Jisso of `tanto-project-config`, at its T2, ended its turn with
「この後は idle して、Kanri のレコメンド/チェック/適用の結果を待ちます」. Two of the
three steps it names do not need it, and the third needs it for one question
at most. The line is not false — the seat does idle — but it describes its
state as waiting for results, and names steps the contract runs without it.
The human read the window, not the envelope, and hesitated over a seat the
contract had already released.

## Why the text is ungoverned

The role files fix the `SendMessage` line (`exit proposal: <path> —
<reading>`) and the seat's instruction to itself ("you apply nothing and
commit nothing… your deletion follows the proposal"), and say nothing about
the chat text in the seat's own window. `SKILL.md`'s Human access says Jisso
and an attached Kaiseki "never address the human unless granted"; the harness,
for its part, requires a text message at the end of every turn. So the one
text the human reads in that window is text the contract tells the seat not to
write and the harness makes it write, and it drifts into 「待ちます」 talk
because nothing says what it should hold. The reassuring content exists — in
the instruction — and is lost on the way to the screen.

## Sites

`SKILL.md`'s Session exit (the `exit proposal:` answer and the two unasked
forms for Sekkei and Keikaku) and Messages; each role file's idle and exit
paragraphs — `roles/jisso.md`'s T2 and exit, its boundary stop;
`roles/sekkei.md` at `spec accepted:`; `roles/keikaku.md` at
`coldread answered:`; `roles/kaiseki.md` at its report; `roles/kanri.md`'s own
exit and its idle after a handover.

## Second site — a Kanri line that puts a deletion and a creation in one clause

The same failure one layer up. Kanri's handshake reply to the Kikaku of
2026-09-17 read "its Keikaku (dotskills-68) pending deletion per R-7, a fresh
one released at tanto-project-config's own merge". R-7 says exactly that:
deletion asked now, a fresh seat created at the merge. Read as one clause,
"released at the merge" attaches to the deletion too, and the human asked
Kanri whether the deletion waited for the merge. Two clocks in one clause is
the compressed form of the same gap: a line about a seat that leaves the human
unsure whether the seat can go.

The shape the fix takes here is one clock per clause: a Kanri line to the
human, or to a Kikaku's handshake, that speaks of a seat's deletion and of a
successor's creation puts them in two clauses with their own times —
"deletion asked now (R-7); a fresh Keikaku is created at
`tanto-project-config`'s merge", not "pending deletion per R-7, a fresh one
released at the merge". This site shares the first's fix through Kanri's
delete request, which is why it is one issue with several sites rather than
issues that cite each other.

## Third site — Kanri's delete request

The numbered list Kanri gives the human to delete a seat says, for that seat,
which contract step still needs it — at a delete request, none, and which step
just released it — and, when Kanri knows the seat's window reads as waiting (a
T2 or exit line of the old shape), that the wait is the harness's turn-ending
text and not a dependency. One sentence, one site, and it covers every seat
whose role text has not yet caught up.

This site is the cheapest of the three and needs no file change beyond Kanri's
own wording; it is recorded here so that the topic's plan does not lose it if
Kanri's wording is not carried forward.

Related: req-04f5, design-4807, decision-d831.

Resolved by the seat-lineage plan, at all three sites. The **closing line**
is defined in `SKILL.md`'s Messages — an identity
(`<name> [<ref>] · <role>[/<topic>] · <family>`, per
`.tanto/kikaku/2026-09-17-closing-line-identity.md`) and two facts, where
the seat's work is and which contract step still needs it or `none`, with the negative rule
that a seat never names a step it is not needed for — and every role file's
idle and exit paragraph now ends with it. **Kanri's released line** carries
the second fact: `<role> <name> released — its work is in <paths>; no step
needs it — /clear its window when convenient`. **One clock per clause** is
stated in `roles/kanri.md`'s Session lifecycle: a line that speaks of a
release and of a creation keeps them in two clauses with their own times.
The third site, Kanri's delete request, is gone with the request itself:
there is no delete request any more, only a `release:` line to the seat and
one line to the human.
