# Shoroku check brief — <topic>

Written by the `shoroku.recommend` kind in the same dispatch as the
recommendation, at the brief path the dispatch names (`.tanto/<topic>/shoroku-brief.md`
at a close), beside the recommendation
and untracked under `.tanto/.gitignore`.
Every part of the
brief is written in the human's language, which the dispatch names; this
template is the English source the recommender renders. The form markers are
the exception and stay exactly as they are here: the five `##` headings, the
bracketed tag word, the `<n>.` numbers, the label `See:` with the heading
that follows it, and the label `Feedback:` with the line that follows it —
the recommendation's own `Feedback:` line, copied as it stands, since that
line and nothing else of the item travels. The brief selects and renders the
recommendation's own judgment; it does not analyze anew, and the
recommendation stays the file the apply reads.

Document: <the recommendation's path> — written <YYYY-MM-DD> on
<model family> for the human's language
<language>.

Each group below holds one line per item of that group, in the
recommendation's order, in this shape:

    <n>. [adopt | fix | reject | unsure] <destination> — <the item in one sentence> — <the one-line reason> — See: <the item's heading text, without its ### marker>

The numbers are the recommendation's own, one run across the whole file, never
restarted per group, and every `###` heading of the recommendation appears
after exactly one `See:`. A group with no item keeps its heading and carries
the single rendered line `none`, so that the five headings are always
present. A `fix` line's second part is the text as it should read, in the
exact markup of the file it lands in, so that the human sees the sentence
that will be applied.

An item whose destination carries `feedback` — `feedback` alone, or the
compound `<docs destination>; feedback` — carries one clause more,
`Feedback: <the line that travels>`, last before `See:`; on an `[unsure]`
item it follows the question the item could not settle. Only an `[adopt]`
or an `[unsure]` item carries it: a `[reject]` item sends nothing, and a
`[fix]` item's paths are the repository's own. The clause is part of the
item's one line, so an item with a feedback half keeps one number, is
counted once, in the group it is recommended in, and its heading still
appears after exactly one `See:`:

    <n>. [adopt] <destination> — <the item in one sentence> — <the one-line reason> — Feedback: <the line that travels> — See: <the item's heading text, without its ### marker>
    <n>. [unsure] <destination> — <the item in one sentence> — <the one-line reason> — <the question this item could not settle, one clause> — Feedback: <the line that travels> — See: <the item's heading text, without its ### marker>

## How to answer

Answer `OK` to take every item as recommended. Name the numbers that go the
other way instead — `2 と 5 だけ`, `3 はやめて` — give an edit,
`5 の severity は high で`, or take the feedback half off an item and keep
the rest of it, `3 は feedback なし`. An item you do not mention goes as
recommended. What you answer is what Kanri writes into the direction file
beside the recommendation (`shoroku-direction.md` at a close), item by
item, with whether each feedback half was kept; the apply reads that file
and the recommendation, never this brief.

## Recommended adopt

<n>. [adopt] <destination> — <the item in one sentence> — <the one-line reason> — See: <the item's heading text, without its ### marker>

## Recommended fix

<n>. [fix] <the file> — <the text as it should read> — <the one-line reason> — See: <the item's heading text, without its ### marker>

## Recommended reject

<n>. [reject] <destination> — <the item in one sentence> — <the one-line reason> — See: <the item's heading text, without its ### marker>

## Unsure

<n>. [unsure] <destination> — <the item in one sentence> — <the one-line reason> — <the question this item could not settle, one clause> — See: <the item's heading text, without its ### marker>
