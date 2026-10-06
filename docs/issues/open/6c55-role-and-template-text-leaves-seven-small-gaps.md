---
id: "6c55"
title: role and template text leaves seven small gaps, from the Destination lists to a render-time mark
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-07
updated: 2026-10-07
---

Source: inbox 2026-10-06-plan-and-spec-text-gaps

A bug report from one finished run names seven one-sentence gaps across six
files of `skills/tanto/`, each with its proposed sentence. Too many files for
one `fix`, each low, and none landed with the tanto-feedback plan. The first
two are fix-sized.

1. **The Destination lists name an experience layer unconditionally —
   fix-sized.** `roles/sekkei.md` already makes the spec reviewer's inputs
   conditional on the repository having an experience layer. The Destination
   lists do not: `templates/batch-report.md`, `templates/kaiseki-report.md`,
   `templates/kanri.md` and `templates/roster.md` list experience among the
   six `docs/` types with no reference to the repository's own documentation
   index. In a repository whose index has no experience type, a seat that
   follows the list proposes a destination with no home, and the recommender
   must reroute it. Proposed: add "— the types the repository's own
   documentation index defines" at the four lists.
2. **`roles/keikaku.md` cites an id no target repository can resolve —
   fix-sized.** Its sentence "the sizes are recorded until one can be chosen
   (issue-7281)" sends a reader of a target repository to its own
   `docs/issues/`, where the id does not exist. Proposed: drop the id.
3. **A spawned committing seat is not told the repository's commit-trailer
   rule.** The trailer is named only in `roles/hosa.md`, `roles/kanri.md` and
   `templates/shoki-brief.md`; none of `roles/sekkei.md`, `roles/keikaku.md`,
   `roles/jisso.md`, `templates/spawn-request.md` or `templates/batch-prompt.md`
   mentions it. In the run a spawned Keikaku's first commit followed the
   harness's attribution reminder and carried two extra trailer forms where
   the repository wanted one line; it was caught only at the close's merge
   question. Proposed, in the spawn text of every seat that commits: read the
   repository's agent instructions for the commit trailer before the first
   commit; where they differ from the harness's reminder, they win. Kin the
   passage-plan note's "Global Constraints name the one trailer a commit
   must carry".
4. **The plan flow never fixes how a commit message is passed.** The skill
   carries neither a stdin form nor a file form; in the run the plan's last
   step of every task passed the message on stdin with a heredoc, while the
   rendered batch prompt said "from a file, never stdin", and every Jisso
   ruled it again. Proposed, in `roles/keikaku.md`'s Global Constraints
   bullet: say once how a commit message is passed (`git commit -F <path>`).
5. **A plan that lists deliberately unpinned failure modes does not name the
   ruling route.** The SDD skill forbids telling a reviewer "do not flag",
   so both reviewers of one task raised a listed mode's missing test as
   Important, and the controller had to rule on the plan's own stated
   decision. Proposed, in the same bullet: a plan that lists such modes
   names the route once — a finding on a listed mode goes to Kanri as a
   Ruling needed, not to a fix round.
6. **The last task's quality review reads the whole mechanism.**
   `roles/jisso.md`'s override row already tells the quality reviewer of a
   cross-file mechanism built in sequence to read the earlier tasks' sibling
   files at HEAD. In the run the last task's reviewer, told to read the whole
   mechanism, found the one cross-task edge four per-task reviews had not.
   Proposed: for the last task of such a batch, tell the reviewer to read the
   whole mechanism at HEAD.
7. **A prompt that quotes tree state does not say when it was read.** A
   rendered prompt said one stash entry existed; the list was empty when the
   seat started. Harmless there, misleading when the quoted state is a path
   or a count. Proposed, in `templates/batch-prompt.md`: state quoted from the
   tree (a stash list, a path, a count) is marked as read at render time.

Precedent for a bundle of small text gaps with proposed sentences:
issue-e3ce.
