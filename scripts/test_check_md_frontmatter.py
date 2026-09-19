"""Tests for check_md_frontmatter's Source: line check (spec 8.1)."""

from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from check_md_frontmatter import HINT, SOURCE_HINT, check

FRONTMATTER = '---\nid: "abcd"\ntitle: "a defect"\ncreated: 2026-09-19\nupdated: 2026-09-19\n---\n'


class SourceLineTest(unittest.TestCase):
    def setUp(self) -> None:
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        self.root = Path(tmp.name)

    def write(self, relative: str, body: str) -> Path:
        path = self.root / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(FRONTMATTER + body, encoding="utf-8")
        return path

    def test_each_kind_passes(self) -> None:
        for line in (
            "Source: inbox 2026-09-19-a-report-slug",
            "Source: shoroku tanto-cost S-4",
            "Source: hotfix docs(tanto): name the symptom",
            "Source: session 2026-09-19",
        ):
            with self.subTest(line=line):
                path = self.write("docs/issues/open/abcd-x.md", f"\n{line}\n\nnarrative\n")
                self.assertEqual(check(path), ([], False))

    def test_shoroku_without_a_row_passes(self) -> None:
        path = self.write(
            "docs/issues/open/abcd-x.md", "\nSource: shoroku tanto-sweep-2\n\nnarrative\n"
        )
        self.assertEqual(check(path), ([], False))

    def test_open_without_a_source_fails_with_the_hint(self) -> None:
        path = self.write("docs/issues/open/abcd-x.md", "\nnarrative, not a Source line\n")
        problems, parse_error = check(path)
        self.assertFalse(parse_error)
        self.assertEqual(len(problems), 1)
        self.assertIn(SOURCE_HINT, problems[0])

    def test_deferred_without_a_source_fails(self) -> None:
        path = self.write("docs/issues/deferred/abcd-x.md", "\nnarrative, not a Source line\n")
        problems, _ = check(path)
        self.assertEqual(len(problems), 1)

    def test_the_same_file_under_resolved_passes(self) -> None:
        path = self.write("docs/issues/resolved/abcd-x.md", "\nnarrative, not a Source line\n")
        self.assertEqual(check(path), ([], False))

    def test_a_non_issue_markdown_file_passes_untouched(self) -> None:
        path = self.write("docs/notes/abcd-x.md", "\nnarrative, not a Source line\n")
        self.assertEqual(check(path), ([], False))

    def test_both_hints_are_ascii(self) -> None:
        # pre-commit's Python prints to a cp932 stdout on this host; a
        # non-ASCII character there raises UnicodeEncodeError in place of
        # the message (the spec review reproduced it).
        for hint in (HINT, SOURCE_HINT):
            with self.subTest(hint=hint):
                hint.encode("ascii")


if __name__ == "__main__":
    unittest.main()
