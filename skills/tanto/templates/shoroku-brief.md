# Shoroku check brief — <topic or Kanri's name>

Written by the `shoroku.recommend` kind in the same dispatch as the
recommendation, at `.tanto/<topic>/t2-brief.md`, or
`.tanto/exit-kanri-<YYYY-MM-DD>-<name>-brief.md` for Kanri's between-plans
exit, beside the recommendation and untracked under `.tanto/.gitignore`.
Every part of the
brief is written in the chat's language, which the dispatch names; this
template is the English source the recommender renders. The form markers are
the exception and stay exactly as they are here: the four `##` headings, the
bracketed tag word, the `<n>.` numbers, and the label `See:` with the heading
that follows it. The brief selects and renders the recommendation's own
judgment; it does not analyze anew, and the recommendation stays the file the
apply reads.

Document: <the recommendation's path> — t2, or the Kanri exit's own
stage word — written <YYYY-MM-DD> on <model family> for the chat language
<language>.

Each group below holds one line per item of that group, in the
recommendation's order, in this shape:

    <n>. [adopt | reject | unsure] <destination> — <the candidate in one sentence> — <the one-line reason> — See: <the item's heading text, without its ### marker>

The numbers are the recommendation's own, one run across the whole file, never
restarted per group, and every `###` heading of the recommendation appears
after exactly one `See:`. A group with no item keeps its heading and carries
the single rendered line `none`, so that the four headings are always
present.

## How to answer

Answer `OK` to take every item as recommended. Name the numbers that go the
other way instead — `2 と 5 だけ`, `3 はやめて` — or give an edit,
`5 の severity は high で`. An item you do not mention goes as recommended.
What you answer is what Kanri writes into `t2-direction.md`, or the Kanri
exit's own `-direction.md`, item by item; the apply reads that file and the
recommendation, never this brief.

## Recommended adopt

<n>. [adopt] <destination> — <the candidate in one sentence> — <the one-line reason> — See: <the item's heading text, without its ### marker>

## Recommended reject

<n>. [reject] <destination> — <the candidate in one sentence> — <the one-line reason> — See: <the item's heading text, without its ### marker>

## Unsure

<n>. [unsure] <destination> — <the candidate in one sentence> — <the one-line reason> — <the question this item could not settle, one clause> — See: <the item's heading text, without its ### marker>
