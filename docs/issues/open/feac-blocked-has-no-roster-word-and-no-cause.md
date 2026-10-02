---
id: "feac"
title: "`blocked` has no roster word and no cause: a stuck seat, a usage-limit pause and a permission prompt read the same"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-02
updated: 2026-10-02
---

Source: shoroku experience-layer S-6

Two tenures measured the same hole from two sides.

**The roster has no word for it** (S-6). `SKILL.md`'s Session exit names
seven Status words — `queued`, `live`, `stopped`, `cleared`, `replaced`,
`dead`, `refused` — and none fits a session `claude agents --json` reports
`blocked` while the roster's row must still say something. A Kanri
improvised `live (blocked — …)` rather than invent an eighth word unasked.
The annotation-on-`live` pattern already exists for the idle Kikaku/Hosa
case; whether this is the same mechanism under another name is worth
confirming, not assuming.

**The census's `blocked` is one word for several causes** (S-97). On
2026-10-01 the five-hour usage limit stopped a new Kanri's first act: the
spawner's census logged it `blocked` at 12:23, and nothing happened until the
human told the session at 14:11 that the limit had hit and to resume.
`SKILL.md`'s limit rule assumes the paused seat can send a `paused:` line to
Kanri; a Kanri that is itself the paused seat has no peer to send it to, and
its `blocked` is the same word a permission prompt produces. Issue-dff9 adds
a third cause, an undelivered initial prompt.

Undecided in `SKILL.md` and `roles/kanri.md`: whether the roster gets a word
or a stated convention for "alive, stuck outside its control", and whether
the spawner's attention notice names a usage-limit block apart from a
permission block.
