---
id: "e3ce"
title: nine role-file and template guidance gaps from one plan close
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-03
updated: 2026-10-03
---

Source: inbox 2026-10-02-role-file-guidance-gaps-from-a-plan-close

Nine guidance gaps, each a sentence or short rule in a role file or
template, each re-checked by the reporter against the current text. Apart
from item 4, each adds a rule, which is a decision. Low overall; items 4 (an
instruction that did nothing) and 7 (a context cost of roughly 180k) stood
out.

1. **`roles/sekkei.md`, Step 1 — no search of the repository's notes before
   a live-state risk goes to the human.** A Sekkei told the human an
   installed hook in another checkout might run stale code, reasoning from
   code and a Kikaku file only; the repository's notes already recorded a
   re-run that had removed the risk. `grep -n -i 'notes' roles/sekkei.md`
   finds no such step. Fix: one line in Step 1 — before a live-state risk
   goes to the human, search the maintained notes for a procedure that
   already handled it.
2. **`roles/sekkei.md`, Step 2 — Kanri's answer to a passage check is
   specified only as an `I-n`.** Kanri answered with a file in the topic
   directory; the route worked and surfaced a conflict (two version bumps
   colliding at a merge) neither the dialogue nor the design had seen. Fix:
   a file in the topic directory is an equally valid answer, and the Sekkei
   reads whichever arrives.
3. **An English heading passes the brief's form check** (beside issue-4aab
   and issue-cc1e). The brief writer rendered seven of eight headings and
   left `## How to answer` in English. `templates/review-brief.md` and
   `SKILL.md`'s "The brief's form" are consistent with each other; the
   defect is that nothing in the check is mechanical. `templates/shoroku-brief.md`
   keeps its five `##` headings in English as markers, which makes the pair
   easy to confuse. Fix: the form check adds that no heading line is still
   the template's English text, and the template's marker paragraph names
   the how-to-answer heading as rendered.
4. **`roles/keikaku.md`'s line-ending bullet gave a restore that does
   nothing.** `git checkout -- <path>` after the commit does not rewrite a
   just-committed file (git sees the working copy as unmodified); the file
   becomes `w/crlf` only after `rm <path>` first. Closed: the fix commit
   `fix: text corrections from tanto-issue-triage's close` on `main` changed
   the bullet to `rm <path> && git checkout -- <path>`. Reproduction, in a
   scratch repository:

   ```console
   git init -q . && printf '*.bat text eol=crlf\n' > .gitattributes
   git add .gitattributes && git commit -qm a
   printf 'echo hi\n' > a.bat && git add a.bat && git commit -qm b
   git checkout -- a.bat && git ls-files --eol a.bat
   rm a.bat && git checkout -- a.bat && git ls-files --eol a.bat
   ```

   It printed `w/lf` after the plain checkout and `w/crlf` after the `rm`
   and checkout.
5. **A Sekkei's effort drifted across an editor resume** (addendum to
   issue-42fc). A Sekkei session read `max` at its start and `xhigh` after
   the editor resumed it, with no `/effort` typed in that window as far as
   it saw. The mismatch is not specific to Jisso, and `roles/sekkei.md`
   carries no start-line effort check (`grep -n -i effort roles/sekkei.md`
   is empty; `roles/kanri.md` and `roles/hosa.md` have one). Fix: issue-42fc's,
   extended to Sekkei.
6. **`roles/keikaku.md`, drafting briefs — a drafter copies a named model
   plan's literal commit trailer.** A docs drafter told to end commits with
   the configured `Co-Authored-By:` trailer copied the model name from the
   earlier plan the brief named as its example; the plan review caught it.
   The role file has no rule on naming a model plan. Fix: a drafting brief
   that names a model plan also names the one thing it gets wrong, or names
   no model plan.
7. **`roles/jisso.md`, Start step 1 is unbounded for a very large plan**
   (beside issue-63c1). The first Jisso of a plan of roughly 9,800 lines
   read the frame, Task 1, and about 900 spec lines it never used; its
   context was 102k at its start line and 281k by its second dispatch, past
   a derived ceiling of 217k at the first boundary, while the ledger and
   brief files carried everything the dispatches needed. Only the final
   batch has an `Instead:` exemption. Fix: for an oversized plan, read the
   frame only (Global Constraints, the Batches table, the verification
   fences) and let the briefs carry the tasks.
8. **`templates/batch-report.md`, "Verify in the tree" — diff claims carry
   no base or path scope** (beside issue-909c). A report said a
   path-limited `git diff <sha>..HEAD` was empty — true against one task's
   base, false of the batch, since a later task's commit had added a file
   there; the boundary brief caught it by re-running. Fix: every diff claim
   names its base commit and its path scope.
9. **`roles/jisso.md`, "The final batch" versus a fix-wave prompt.** The
   role says a fix wave takes one fixer and exactly one scoped re-review,
   with no second fix wave. A fix-wave batch prompt said the SDD fix-round
   loop applies as a unit, and the Jisso followed the prompt. The current
   `templates/batch-prompt.md` has no sentence about that loop, so the
   override came from the prompt writer; nothing says which text wins. Fix:
   the role file states whether a prompt may lift the cap, or the template
   carries the cap into a fix-wave prompt.
