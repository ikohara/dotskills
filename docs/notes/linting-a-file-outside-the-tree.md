# Linting a Markdown file outside the repository tree

`./scripts/lint.{sh,bat}` takes in-repo paths only: it runs pre-commit over
files git knows about, so a draft that is not part of the tree — a plan or spec
under `.tanto/`, a scratch copy in the scratchpad directory — cannot be checked
through it. The same markdownlint-cli2 the hook uses can be run directly on
such a file. This note records the *shape* of that invocation; every concrete
path in it varies per machine and per OS, so none is written literally here.

## The shape

1. **The pre-commit cache directory.** Its location is per user (pre-commit's
   own cache root, overridable by its environment variable).
2. **A per-hook repository directory inside it**, named by a hash segment that
   pre-commit generates per machine. Find it rather than assume it — it is the
   cache subdirectory holding the markdownlint-cli2 hook's checkout.
3. **The hook's node environment inside that directory.** pre-commit installs
   the hook's Node dependencies into an environment subdirectory of its own,
   and the interpreter subdirectory below that is OS-dependent (it differs
   between Windows and POSIX). The hook's `node_modules` live under that
   environment, **not** at the top of the cache repository directory.
4. **The binary is `markdownlint-cli2-bin.mjs`** under
   `node_modules/markdownlint-cli2/` inside that environment. Run it with
   `node`, passing the target file.

The trap: there is also a top-level `markdownlint-cli2-bin.mjs` directly in the
cache repository directory. Running that one fails on a missing `globby`,
because the dependencies it needs are installed under the node environment
subdirectory, not beside it. Use the copy under the environment's
`node_modules`.

## The configuration

markdownlint-cli2 reads its configuration from the **working directory** it is
invoked in, not from the target file's location. So:

- Create a scratch directory (the session scratchpad is the right place).
- Copy the repository's `.markdownlint-cli2.yaml` into it, **with its
  `ignores:` list stripped** — those globs are written against the repository
  tree and would either match nothing or, worse, silently exclude the file
  being checked.
- Run `node <…>/markdownlint-cli2-bin.mjs <file>` from that scratch directory.

The result is the same rule set the commit hook would apply, on a file the hook
will never see.

## Why the paths are not written out here

The cache hash segment is generated per machine and the interpreter
subdirectory name is OS-specific, so a literal command line recorded here would
be both user-specific and wrong on the next machine — see the "never commit
user-specific paths" rule in `AGENTS.md`. Resolve the two variable segments by
listing the cache directory at the time of use.

Related: issue-6aa8 and issue-e047 record the other half of this — the paths
the repository configuration's `ignores:` list leaves checked by no hook at
all.
