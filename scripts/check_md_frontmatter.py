#!/usr/bin/env python3
"""Fail when a Markdown file's YAML frontmatter does not parse as a mapping.

pre-commit passes the changed Markdown paths as arguments. A file whose first
line is `---` (a UTF-8 BOM and CRLF are allowed) carries frontmatter up to the
next `---` line and that block must be valid YAML and a mapping; any other
file passes untouched. Per-kind schema checks (required keys, name formats)
are not done here.
"""

from __future__ import annotations

import sys
from pathlib import Path

import yaml

DELIMITER = "---"
HINT = "hint: a value containing a colon followed by a space must be quoted (description: 'Use when: x')"


def _yaml_type(value: object) -> str:
    return "null" if value is None else type(value).__name__


def check(path: Path) -> tuple[list[str], bool]:
    """Return (problems, parse_error) for one file.

    Problems are `<path>:<line>: <message>` lines; `parse_error` says whether
    any of them came from the YAML parser, which is when the hint applies.
    """
    try:
        text = path.read_text(encoding="utf-8-sig", errors="replace")
    except OSError as e:
        return [f"{path}:1: cannot read file: {e}"], False
    lines = text.replace("\r\n", "\n").split("\n")
    if not lines or lines[0].rstrip() != DELIMITER:
        return [], False
    end = next((i for i in range(1, len(lines)) if lines[i].rstrip() == DELIMITER), None)
    if end is None:
        return [f"{path}:1: frontmatter opened with --- is not closed by a second --- line"], False
    block = "\n".join(lines[1:end])
    try:
        data = yaml.safe_load(block)
    except yaml.MarkedYAMLError as e:
        # Marks are 0-based within the block; the opening --- is file line 1.
        line = e.problem_mark.line + 2 if e.problem_mark is not None else 1
        message = e.problem or "invalid YAML"
        if e.context:
            message = f"{message} ({e.context})"
        return [f"{path}:{line}: {message}"], True
    except yaml.YAMLError as e:
        return [f"{path}:1: invalid YAML: {e}"], True
    if not isinstance(data, dict):
        return [f"{path}:1: frontmatter must be a YAML mapping (got {_yaml_type(data)})"], False
    return [], False


def main(argv: list[str]) -> int:
    problems: list[str] = []
    show_hint = False
    for arg in argv:
        found, parse_error = check(Path(arg))
        problems.extend(found)
        show_hint = show_hint or parse_error
    for problem in problems:
        print(problem)
    if show_hint:
        print(HINT)
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
