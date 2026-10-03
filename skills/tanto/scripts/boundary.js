// tanto's boundary instrument, beside `passage-check.js` and `reading.js`.
// Three subcommands: `check`, which runs the boundary's read-only commands
// and prints their output under fixed headings, and `record`, which writes
// the ledger's and the roster's rows — both run by the `boundary.verify` kind
// from `templates/boundary-brief.md`, and, under the design's shape 2, by a
// headless session running the same brief — and `census`, which Kanri runs
// itself: the roster's `live` and `queued` rows against the CLI's listing of
// the sessions under the root, read-only. It judges nothing.
//
// Node, no dependencies, no shebang: always
// `node "$TANTO/scripts/boundary.js" <subcommand>`.

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

/** The five report headings the boundary reads, in the brief's order. */
const REPORT_HEADINGS = [
  "For Kanri",
  "Rulings",
  "Questions for the human",
  "Deviations from the plan",
  "Shoroku proposal",
];

/** A measurement report's two headings, read only with `--measurement`. */
const MEASUREMENT_HEADINGS = ["Tasks", "Verification"];

/**
 * `--flag value` pairs and bare `--flag` switches. A flag named in
 * `repeatable` collects every occurrence into an array; every other flag
 * keeps its last value, so the same call is read the same way twice. A value
 * that itself begins with `--` is read as the next flag, which is why no
 * argument this script takes may begin with a dash.
 */
function parseArgs(argv, repeatable = []) {
  const values = {};
  for (const name of repeatable) values[name] = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;
    const name = arg.slice(2);
    const next = argv[i + 1];
    const value = next === undefined || next.startsWith("--") ? true : next;
    if (value !== true) i++;
    if (repeatable.includes(name)) values[name].push(value);
    else values[name] = value;
  }
  return values;
}

/** A given `--flag value`, or null for an absent flag or a bare switch. */
function given(values, name) {
  const value = values[name];
  return value === undefined || value === true ? null : String(value);
}

/** One line on stderr, and the exit code the caller returns. */
function fail(message, code) {
  process.stderr.write(`boundary.js: ${message}\n`);
  return code;
}

/** The skill's own directory: `--tanto`, else this script's own parent. */
function tantoDir(values) {
  return given(values, "tanto") || path.dirname(__dirname);
}

/**
 * A child `node <script> <args...>`, its stdout then its stderr joined —
 * interleaving is lost — and its exit code mapped from a signal to 1.
 */
function child(script, args) {
  const result = spawnSync(process.execPath, [script, ...args], {
    encoding: "utf8",
    cwd: process.cwd(),
  });
  const out = `${result.stdout || ""}${result.stderr || ""}`;
  const code = result.status === null ? 1 : result.status;
  return { code, out };
}

/**
 * The report header's Transcript and Ceiling lines, in the file's own order:
 * Jisso's reading, which the report carries beside its Transcript line.
 */
function reportHeader(file) {
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  const found = [];
  for (const line of lines) {
    if (line.startsWith("## ")) break;
    if (/^- (Transcript|Ceiling) — /.test(line)) found.push(line);
  }
  return found.length > 0 ? found.join("\n") : "no reading line in the report's header";
}

/**
 * The comparison key for a `commit-ready:`/`commit-done:` subject.
 * `writeEvent` stamps the line's front (`- <now> — <text>`) and appends a
 * trailing ` (batch <X>)` when `--batch` is given, never a trailing
 * timestamp -- so pairing must strip that trailing batch suffix rather than
 * compare the raw captured text, or a peer that writes its `commit-ready:`
 * outside a batch and is closed inside one never pairs.
 */
function commitSubject(text) {
  return text.replace(/\s*\(batch [^)]+\)\s*$/, "").trim();
}

/**
 * The ledger's `commit-ready:` events that have no `commit-done:` pair. A
 * peer with work to commit writes the first itself through
 * `record --event`; the boundary's own `record` call writes the second. The
 * commit window opens for the peers this prints and for no others
 * (issue-c0d0). Pairing compares `commitSubject`'s normalized key; the
 * printed line is always the full, original ledger line, batch suffix and
 * all.
 */
function unpairedCommitReady(file) {
  let lines;
  try {
    lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  } catch {
    return `no ledger at ${file}`;
  }
  const done = [];
  const ready = [];
  for (const line of lines) {
    const found = /(commit-(?:ready|done)): (.+?)(?: — \d{4}-\d{2}-\d{2} \d{2}:\d{2})?\s*$/.exec(line);
    if (!found) continue;
    if (found[1] === "commit-done") done.push(commitSubject(found[2]));
    else ready.push({ who: commitSubject(found[2]), line: line.trim() });
  }
  const open = ready.filter((item) => !done.includes(item.who));
  return open.length > 0 ? open.map((item) => item.line).join("\n") : "none";
}

function cmdCheck(argv) {
  const values = parseArgs(argv);
  for (const name of ["plan", "report", "base"]) {
    if (!given(values, name)) return fail(`check needs --${name}`, 2);
  }
  for (const name of ["plan", "report", "measurement", "kanri-transcript", "ledger"]) {
    const value = given(values, name);
    if (value !== null && !fs.existsSync(value)) {
      return fail(`check: --${name} ${value} is not on disk`, 2);
    }
  }

  const tanto = tantoDir(values);
  const passageCheck = path.join(tanto, "scripts", "passage-check.js");
  const reading = path.join(tanto, "scripts", "reading.js");
  for (const script of [passageCheck, reading]) {
    if (!fs.existsSync(script)) return fail(`check: ${script} is not on disk`, 2);
  }

  const plan = given(values, "plan");
  const report = given(values, "report");
  const boundary = child(passageCheck, ["boundary", "--plan", plan]);
  const diff = child(passageCheck, ["diff", "--plan", plan, "--base", given(values, "base")]);
  const sections = child(passageCheck, ["sections", "--file", report, ...REPORT_HEADINGS]);

  const word = (code) => (code === 0 ? "pass" : "fail");
  // The verdict is `boundary`'s alone. `diff` still runs and still prints
  // under its own heading, but a plan whose own spec and plan commits sit on
  // the branch it verifies makes `diff` fail forever, and a boundary that can
  // never pass is a boundary nobody reads.
  const verdict = boundary.code === 0 ? "pass" : "fail";

  const blocks = [
    ["boundary", boundary.out],
    ["diff", diff.out],
    ["sections", sections.out],
  ];
  const measurement = given(values, "measurement");
  if (measurement !== null) {
    const args = ["sections", "--file", measurement, ...MEASUREMENT_HEADINGS];
    blocks.push(["measurement", child(passageCheck, args).out]);
  }
  blocks.push(["jisso reading", reportHeader(report)]);
  const ledger = given(values, "ledger");
  if (ledger !== null) blocks.push(["commit-ready", unpairedCommitReady(ledger)]);
  const transcript = given(values, "kanri-transcript");
  if (transcript !== null) {
    const args = [transcript, "--role", "kanri", "--presence"];
    blocks.push(["kanri reading", child(reading, args).out]);
  }

  console.log(`check: ${verdict} — boundary ${word(boundary.code)}; diff ${word(diff.code)} (informational)`);
  for (const [heading, body] of blocks) {
    console.log(`\n## ${heading}\n`);
    console.log(String(body).replace(/\s+$/, ""));
  }
  return verdict === "pass" ? 0 : 1;
}

/** The flags `record` collects rather than overwrites. */
const REPEATABLE = ["peer-reading", "s-item", "event", "status"];

/** The Batches table's six cells, in the ledger template's column order. */
const BATCH_CELLS = ["batch", "tasks", "state", "prompt", "report", "verdict"];

/** The five values the ledger template's Batches table names for State. */
const STATES = ["planned", "sent", "reported", "accepted", "rework"];

/** The Measurements rows whose Value cells carry one entry per batch. */
const MEASUREMENT_ROW = "Kanri's context at the topic's opening";
const DEFERRALS_ROW = "deferrals:";

/** The roster's two `| Role | Topic | Name [ref] |` tables, told apart. */
const SESSIONS_HEADER = "| Role | Topic | Name [ref] | cwd |";
const RESIDENCY_HEADER = "| Role | Topic | Name [ref] | Since |";

/** A reading's five figures, in the spelling `reading.js` prints them. */
const READING = /transcript: (\d+) B, (\d+) records, (\d+) wake-ups, (\d+) compactions, context=(\d+)/;

/** A `--peer-reading` value: the role, the address, and the reading. */
const PEER = /^(\S+)\s+(\S+(?:\s+\[[^\]]+\])?)\s+(transcript:.*)$/;

/** A document read for editing, with the line ending it already uses. */
function readDoc(file) {
  const raw = fs.readFileSync(file, "utf8");
  const eol = raw.includes("\r\n") ? "\r\n" : "\n";
  return { file, lines: raw.split(/\r?\n/), eol };
}

/**
 * The document back to disk with its own line ending and its own trailing
 * newline: the split left a final empty element for the newline the file
 * ended with, and the join puts it back.
 */
function writeDoc(doc) {
  fs.writeFileSync(doc.file, doc.lines.join(doc.eol), "utf8");
}

/** The cells of a `| a | b |` row, trimmed. */
function cells(line) {
  const inner = line.replace(/^\s*\|/, "").replace(/\|\s*$/, "");
  return inner.split("|").map((cell) => cell.trim());
}

/** The row a cell list writes back as. */
function row(values) {
  return `| ${values.join(" | ")} |`;
}

/** A `## <heading>` section's line span, end-exclusive. */
function sectionSpan(lines, heading) {
  const start = lines.findIndex((line) => line.trim() === `## ${heading}`);
  if (start === -1) return null;
  let end = start + 1;
  while (end < lines.length && !/^#{1,2} /.test(lines[end])) end++;
  return { start, end };
}

/** The first table inside a span: its header row, its first data row, its end. */
function tableSpan(lines, span) {
  for (let i = span.start; i < span.end; i++) {
    const next = lines[i + 1] || "";
    if (lines[i].startsWith("| ") && next.startsWith("| ---")) {
      let end = i + 2;
      while (end < span.end && lines[end].startsWith("|")) end++;
      return { header: i, first: i + 2, end };
    }
  }
  return null;
}

/** A table located by its header row rather than by a heading. */
function tableByHeader(lines, header) {
  const at = lines.findIndex((line) => line.startsWith(header));
  if (at === -1) return null;
  let end = at + 2;
  while (end < lines.length && lines[end].startsWith("|")) end++;
  return { header: at, first: at + 2, end };
}

/** The five figures of a reading string, or null when it does not parse. */
function readingFigures(text) {
  const found = READING.exec(String(text));
  if (!found) return null;
  const [, bytes, records, wakeUps, compactions, context] = found;
  return { bytes, records, wakeUps, compactions, context };
}

/**
 * Whether a reading string is the `transcript: unavailable — <reason>`
 * sentinel `SKILL.md` documents: a session's legitimate answer when its own
 * transcript is unreadable, not a malformed reading. Matched on the prefix
 * alone, so the reason text after the dash never has to be parsed.
 */
function isUnavailableReading(text) {
  return /^\s*transcript: unavailable\b/.test(String(text));
}

/** The cache regime a reading string carries, or `unknown`. */
function ttlOf(text) {
  const found = /ttl=(5m|1h|unknown)/.exec(String(text));
  return found ? found[1] : "unknown";
}

/** `YYYY-MM-DD HH:MM`, the stamp a Session events line carries. */
function stamp(date) {
  const two = (n) => String(n).padStart(2, "0");
  const day = `${date.getFullYear()}-${two(date.getMonth() + 1)}-${two(date.getDate())}`;
  const time = `${two(date.getHours())}:${two(date.getMinutes())}`;
  return `${day} ${time}`;
}

/** The Batches row for this batch: replaced when it exists, appended when not. */
function writeBatch(doc, values, written) {
  const span = sectionSpan(doc.lines, "Batches");
  if (!span) return "the ledger's Batches table";
  const table = tableSpan(doc.lines, span);
  if (!table) return "the ledger's Batches table";
  const batch = given(values, "batch");
  const state = given(values, "state");
  if (state !== null && !STATES.includes(state)) {
    return `a State the Batches table names (got ${state})`;
  }
  const wanted = {
    batch,
    tasks: given(values, "tasks"),
    state,
    prompt: given(values, "prompt"),
    report: given(values, "report"),
    verdict: given(values, "verdict"),
  };
  let at = -1;
  for (let i = table.first; i < table.end; i++) {
    if (cells(doc.lines[i])[0] === batch) at = i;
  }
  const blank = BATCH_CELLS.map(() => "");
  const current = at === -1 ? blank : cells(doc.lines[at]);
  while (current.length < BATCH_CELLS.length) current.push("");
  const next = BATCH_CELLS.map((name, i) => (wanted[name] === null ? current[i] : wanted[name]));
  const line = row(next);
  if (at !== -1) {
    doc.lines[at] = line;
    written.push(line);
    return null;
  }
  const placeholders = [];
  for (let i = table.first; i < table.end; i++) {
    if (cells(doc.lines[i])[0] === "(no batch yet)") placeholders.push(i);
  }
  doc.lines.splice(table.end, 0, line);
  for (const i of placeholders.reverse()) doc.lines.splice(i, 1);
  written.push(line);
  return null;
}

/**
 * One `batch <X>: …` entry inside a Measurements row's Value cell, entries
 * separated by `;`, this batch's replaced and every other entry — the opening
 * and the landing ones Kanri writes by hand, and every other batch's — left
 * untouched. Both per-batch Measurements rows are written this way.
 */
function writeCellEntry(doc, rowPrefix, batch, body, written) {
  const span = sectionSpan(doc.lines, "Measurements");
  if (!span) return "the ledger's Measurements table";
  const table = tableSpan(doc.lines, span);
  if (!table) return "the ledger's Measurements table";
  for (let i = table.first; i < table.end; i++) {
    const current = cells(doc.lines[i]);
    if (!current[0].startsWith(rowPrefix)) continue;
    const entry = `batch ${batch}: ${body}`;
    const raw = current[2].trim().startsWith("<") ? [] : current[2].split(";");
    const entries = raw.map((part) => part.trim()).filter((part) => part.length > 0);
    const at = entries.findIndex((part) => part.startsWith(`batch ${batch}:`));
    if (at === -1) entries.push(entry);
    else entries[at] = entry;
    current[2] = entries.join("; ");
    doc.lines[i] = row(current);
    written.push(doc.lines[i]);
    return null;
  }
  return `the ledger's Measurements row for ${rowPrefix}`;
}

/**
 * The seventh column of an `S-n` table, which a ledger or a roster opened
 * before it was retired keeps (spec 3.5). Spelled with one bracketed
 * character, as the consistency note's check 7 spells every retired string.
 */
const RETIRED_COLUMN = /^Stag[e]$/;

/** An `S-n` row's cells, one per column the table's own header names. */
function sItemCells(header, number, source, text) {
  const byColumn = {
    "S-n": `S-${number}`,
    Source: source,
    Item: text,
    Destination: "",
    Adopted: "pending",
    Written: "no",
  };
  return header.map((column) => {
    if (Object.hasOwn(byColumn, column)) return byColumn[column];
    return RETIRED_COLUMN.test(column) ? "t2" : "";
  });
}

/**
 * One `S-n` row, numbered from the table's highest existing `S-n`, so that a
 * `pending` row a Kanri exit wrote there since the last boundary is counted
 * and not overwritten, and written by the header it finds: six cells, or
 * seven with `t2` in the retired column, nothing migrated. A row with the
 * same Source and Item is already there.
 */
function writeSItem(doc, item, written) {
  const span = sectionSpan(doc.lines, "Shoroku proposal items");
  if (!span) return "the ledger's Shoroku proposal items table";
  const table = tableSpan(doc.lines, span);
  if (!table) return "the ledger's Shoroku proposal items table";
  const parts = String(item).split("|");
  const source = parts[0].trim();
  const text = parts.slice(1).join("|").trim();
  let highest = 0;
  const placeholders = [];
  for (let i = table.first; i < table.end; i++) {
    const current = cells(doc.lines[i]);
    if (current[1] === source && current[2] === text) {
      // Already recorded. Print the row as it stands, so that a re-run
      // with the same arguments prints the same rows as the first run.
      written.push(doc.lines[i]);
      return null;
    }
    const found = /^S-(\d+)$/.exec(current[0]);
    if (found) highest = Math.max(highest, Number(found[1]));
    if (current[0] === "(no item yet)") placeholders.push(i);
  }
  const line = row(sItemCells(cells(doc.lines[table.header]), highest + 1, source, text));
  doc.lines.splice(table.end, 0, line);
  for (const i of placeholders.reverse()) doc.lines.splice(i, 1);
  written.push(line);
  return null;
}

/**
 * One Session events line, written once per batch for the same text. The
 * dedup key is the batch and the text together, which is what makes a
 * re-run of the same call a no-op without losing the second real occurrence
 * of an event that recurs in a later batch: two `dispatch: plan.review on
 * fable` lines in two batches are two dispatches and must both be counted at
 * the close, while two in one batch are one call made twice. A call with no
 * `--batch` — a between-plans record — keys on the text alone.
 */
function writeEvent(doc, text, batch, now, written) {
  const span = sectionSpan(doc.lines, "Session events");
  if (!span) return "the ledger's Session events section";
  const body = batch === null ? text : `${text} (batch ${batch})`;
  const tail = ` — ${body}`;
  for (let i = span.start + 1; i < span.end; i++) {
    if (doc.lines[i].endsWith(tail)) {
      written.push(doc.lines[i]);
      return null;
    }
  }
  let at = span.end;
  while (at > span.start + 1 && doc.lines[at - 1].trim() === "") at--;
  const line = `- ${now} — ${body}`;
  doc.lines.splice(at, 0, line);
  written.push(line);
  return null;
}

/** The Progress section's body, replaced whole by the one line. */
function writeProgress(doc, text, written) {
  const span = sectionSpan(doc.lines, "Progress");
  if (!span) return "the ledger's Progress section";
  doc.lines.splice(span.start + 1, span.end - span.start - 1, "", text, "");
  written.push(text);
  return null;
}

/**
 * A Residency row, rewritten in place from a reading, or appended. An
 * `unavailable` reading still writes the row — `—` in the four figure
 * columns and `context=unavailable` — rather than refusing the whole call
 * over the one side whose transcript could not be read.
 */
function writeResidency(doc, role, name, reading, batch, today, written) {
  const unavailable = isUnavailableReading(reading);
  const figures = unavailable ? null : readingFigures(reading);
  if (!unavailable && !figures) return `a reading that parses (got ${reading})`;
  const table = tableByHeader(doc.lines, RESIDENCY_HEADER);
  if (!table) return "the roster's Residency table";
  let at = -1;
  for (let i = table.first; i < table.end; i++) {
    if (cells(doc.lines[i])[2] === name) at = i;
  }
  const blank = [role, "—", name, today, "", "", "", "", "", "", "—", "—", "—"];
  const current = at === -1 ? blank : cells(doc.lines[at]);
  while (current.length < blank.length) current.push("—");
  current[4] = `batch ${batch}`;
  if (unavailable) {
    current[5] = "—";
    current[6] = "—";
    current[7] = "—";
    current[8] = "—";
    current[9] = "context=unavailable";
  } else {
    current[5] = figures.bytes;
    current[6] = figures.records;
    current[7] = figures.wakeUps;
    current[8] = figures.compactions;
    current[9] = `context=${figures.context}`;
  }
  const line = row(current);
  if (at === -1) doc.lines.splice(table.end, 0, line);
  else doc.lines[at] = line;
  written.push(line);
  return null;
}

/** A session row's Status cell. */
function writeStatus(doc, name, status, written) {
  const table = tableByHeader(doc.lines, SESSIONS_HEADER);
  if (!table) return "the roster's sessions table";
  for (let i = table.first; i < table.end; i++) {
    const current = cells(doc.lines[i]);
    if (current[2] !== name) continue;
    current[9] = status;
    doc.lines[i] = row(current);
    written.push(doc.lines[i]);
    return null;
  }
  return `a roster row for ${name}`;
}

/**
 * A terminal seat's roster row, written from the spawner's result file
 * rather than from a handshake it never sends. Idempotent: a second call
 * rewrites the row in place, matched by the Name column, and a name the
 * table does not hold is appended. The Status cell is always written as
 * `live`, on purpose (Minor 13, branch-review.md): `--seat` is only ever
 * called from a spawn or resume result, and a later `stopped` in that
 * column belongs to Kanri alone to write.
 */
function writeSeatRow(doc, file, written) {
  let seat;
  try {
    seat = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return `a --seat file that parses (${file})`;
  }
  if (!seat.name) return `a name in ${file}`;
  const table = tableByHeader(doc.lines, SESSIONS_HEADER);
  if (!table) return "the roster's sessions table";
  const columns = [
    seat.role || "—",
    seat.topic || "—",
    seat.name,
    seat.cwd || "—",
    seat.model || "—",
    seat.effort || "unknown",
    seat.branch || "—",
    seat.mode || "auto",
    seat.startedAt || "—",
    "live",
    // The path; a seat whose transcript is not on disk yet carries the bare
    // `<sessionId>.jsonl`, which the census matches by `sessionId`, and
    // `unavailable` stands only where the result held neither.
    seat.transcript || (seat.sessionId ? `${seat.sessionId}.jsonl` : "unavailable"),
  ];
  const line = row(columns);
  let at = -1;
  for (let i = table.first; i < table.end; i++) {
    if (cells(doc.lines[i])[2] === seat.name) at = i;
  }
  if (at === -1) doc.lines.splice(table.end, 0, line);
  else doc.lines[at] = line;
  written.push(line);
  return null;
}

function cmdRecord(argv) {
  const values = parseArgs(argv, REPEATABLE);
  const ledgerPath = given(values, "ledger");
  const batch = given(values, "batch");
  if (!ledgerPath) return fail("record needs --ledger", 2);
  if (!fs.existsSync(ledgerPath)) return fail(`record: --ledger ${ledgerPath} is not on disk`, 2);

  // `--batch` is required only by what is keyed on a batch. An events-only or
  // status-only call — a between-plans record, a peer line answered outside a
  // boundary — needs none, and must not touch the Batches table.
  const batchCells = ["tasks", "state", "report", "verdict", "prompt"];
  const wantsBatchRow = batchCells.some((name) => given(values, name) !== null);
  if (wantsBatchRow && !batch) return fail("record needs --batch for a Batches row", 2);

  const kanri = given(values, "kanri");
  const jisso = given(values, "jisso");
  const kanriReading = given(values, "kanri-reading");
  const jissoReading = given(values, "jisso-reading");
  const seatFile = given(values, "seat");
  if (seatFile !== null && !fs.existsSync(seatFile)) {
    return fail(`record: --seat ${seatFile} is not on disk`, 2);
  }
  const seatRows = seatFile === null ? 0 : 1;
  const rosterRows = values["peer-reading"].length + values.status.length + seatRows;
  const needRoster = kanri !== null || jisso !== null || rosterRows > 0;
  const rosterPath = given(values, "roster");
  if (needRoster && !rosterPath) return fail("record needs --roster for a roster row", 2);
  if (needRoster && !fs.existsSync(rosterPath)) {
    return fail(`record: --roster ${rosterPath} is not on disk`, 2);
  }

  const now = given(values, "now") || stamp(new Date());
  const today = now.slice(0, 10);
  const written = [];
  const problems = [];
  const note = (problem) => {
    if (problem) problems.push(problem);
  };

  const ledger = readDoc(ledgerPath);
  if (wantsBatchRow) note(writeBatch(ledger, values, written));
  if (kanriReading !== null && jissoReading !== null) {
    const kanriUnavailable = isUnavailableReading(kanriReading);
    const jissoUnavailable = isUnavailableReading(jissoReading);
    if (kanriUnavailable || jissoUnavailable) {
      // One side's transcript could not be read: the joint context entry
      // needs both figures, so it is skipped rather than failing the whole
      // call — the other side's own Residency row, and everything else this
      // call names, are still written below.
      const who =
        kanriUnavailable && jissoUnavailable
          ? "kanri and jisso readings"
          : kanriUnavailable
            ? "kanri reading"
            : "jisso reading";
      written.push(`measurement skipped — ${who} unavailable`);
    } else {
      const kanriFigures = readingFigures(kanriReading);
      const jissoFigures = readingFigures(jissoReading);
      if (!kanriFigures || !jissoFigures) note("two readings that parse");
      else if (!batch) note("--batch beside a pair of readings");
      else {
        const ttl = ttlOf(kanriReading);
        const body = `kanri context=${kanriFigures.context}, jisso context=${jissoFigures.context}, ttl=${ttl}`;
        note(writeCellEntry(ledger, MEASUREMENT_ROW, batch, body, written));
      }
    }
  }
  const deferred = given(values, "deferred");
  if (deferred !== null && !batch) note("--batch beside --deferred");
  if (deferred !== null && batch) {
    note(writeCellEntry(ledger, DEFERRALS_ROW, batch, deferred, written));
  }
  for (const item of values["s-item"]) note(writeSItem(ledger, item, written));
  for (const event of values.event) note(writeEvent(ledger, event, batch, now, written));
  const progress = given(values, "progress");
  if (progress !== null) note(writeProgress(ledger, progress, written));

  let roster = null;
  const residencyRows = kanri !== null || jisso !== null || values["peer-reading"].length > 0;
  if (residencyRows && !batch) note("--batch beside a Residency row");
  if (needRoster && !(residencyRows && !batch)) {
    roster = readDoc(rosterPath);
    if (seatFile !== null) note(writeSeatRow(roster, seatFile, written));
    if (kanri !== null && kanriReading === null) note("--kanri-reading beside --kanri");
    if (kanri !== null && kanriReading !== null) {
      note(writeResidency(roster, "kanri", kanri, kanriReading, batch, today, written));
    }
    if (jisso !== null && jissoReading === null) note("--jisso-reading beside --jisso");
    if (jisso !== null && jissoReading !== null) {
      note(writeResidency(roster, "jisso", jisso, jissoReading, batch, today, written));
    }
    for (const line of values["peer-reading"]) {
      const found = PEER.exec(String(line));
      if (!found) {
        note(`a --peer-reading that parses (got ${line})`);
        continue;
      }
      note(writeResidency(roster, found[1], found[2], found[3], batch, today, written));
    }
    for (const line of values.status) {
      const found = /^(.*)\s+(live|cleared|stopped|queued)$/.exec(String(line).trim());
      if (!found) {
        note(`a --status ending in live, cleared, stopped, or queued (got ${line})`);
        continue;
      }
      note(writeStatus(roster, found[1].trim(), found[2], written));
    }
  }

  if (problems.length > 0) {
    for (const problem of problems) fail(`record wrote nothing — it did not find ${problem}`, 1);
    return 1;
  }

  writeDoc(ledger);
  if (roster) writeDoc(roster);
  for (const line of written) console.log(line);
  return 0;
}

/** The CLI, as a command: the seam `spawner.js` and `tanto.js` use. */
function claudeCommand(args) {
  const viaNode = process.env.TANTO_CLAUDE_NODE;
  if (viaNode) return { file: process.execPath, args: [viaNode, ...args] };
  return { file: process.env.TANTO_CLAUDE || "claude", args };
}

/** A path with its separators unified, no trailing one, and, on Windows, its case folded. */
function comparablePath(p) {
  const unified = String(p).replace(/\\/g, "/").replace(/\/+$/, "");
  return process.platform === "win32" ? unified.toLowerCase() : unified;
}

/**
 * Whether a listed cwd is the root or a path under it. The census compares
 * the paths itself rather than pass `--cwd`: the CLI's filter is measured for
 * the root alone, and a subdirectory and the drive letter's two spellings are
 * settled here (spec 2.2).
 */
function underRoot(root, cwd) {
  if (!cwd) return false;
  const base = comparablePath(root);
  const here = comparablePath(cwd);
  return here === base || here.startsWith(`${base}/`);
}

/** A Transcript cell's `sessionId` — its basename without `.jsonl` — or null for `unavailable`. */
function sessionIdOf(transcript) {
  const cell = String(transcript || "").trim();
  if (cell === "" || cell === "unavailable") return null;
  return cell
    .split(/[\\/]/)
    .pop()
    .replace(/\.jsonl$/, "");
}

/**
 * The `noFirstTurn` marks of `<root>/.tanto/spawner/seats.json`, by
 * `sessionId` (spec 3.3): empty when the file is absent or does not parse,
 * so the census prints as it did before.
 */
function firstTurnMarks(root) {
  try {
    const doc = JSON.parse(fs.readFileSync(path.join(root, ".tanto", "spawner", "seats.json"), "utf8"));
    const seats = Array.isArray(doc?.seats) ? doc.seats : [];
    return new Map(seats.filter((s) => s?.sessionId && s.noFirstTurn).map((s) => [s.sessionId, s.noFirstTurn]));
  } catch {
    return new Map();
  }
}

/** The four headings `census` prints, in order. */
const CENSUS_HEADINGS = ["Listed", "Not listed", "No session id", "Not held"];

/**
 * `census [--root <dir>] [--roster <path>]` (spec 2.2): the roster's `live`
 * and `queued` rows against `claude agents --json`'s sessions under the root.
 * Read-only — Kanri, the roster's one writer, acts on what it prints.
 */
function cmdCensus(argv) {
  const values = parseArgs(argv);
  for (const name of ["root", "roster"]) {
    if (values[name] === true) return fail(`census: --${name} needs a value`, 2);
  }
  const root = path.resolve(given(values, "root") || process.cwd());
  const rosterPath = given(values, "roster") || path.join(root, ".tanto", "roster.md");
  let lines;
  try {
    lines = fs.readFileSync(rosterPath, "utf8").split(/\r?\n/);
  } catch {
    return fail(`census: cannot read the roster at ${rosterPath}`, 2);
  }
  const table = tableByHeader(lines, SESSIONS_HEADER);
  if (!table) return fail(`census: no sessions table in ${rosterPath}`, 2);

  const command = claudeCommand(["agents", "--json"]);
  const got = spawnSync(command.file, command.args, { encoding: "utf8", windowsHide: true });
  if (got.status !== 0) {
    const said = (got.stderr || "").trim().split(/\r?\n/)[0];
    console.log(`census: unavailable — ${said || `claude agents exited ${got.status}`}`);
    return 1;
  }
  let parsed;
  try {
    parsed = JSON.parse(got.stdout || "");
  } catch {
    console.log("census: unavailable — claude agents --json printed no JSON");
    return 1;
  }
  const all = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.sessions) ? parsed.sessions : [];
  const listed = new Map(
    all.filter((s) => s?.sessionId && s.pid && underRoot(root, s.cwd)).map((s) => [s.sessionId, s]),
  );
  // An entry with no pid is a process gone, whatever its state says (spec
  // 3.1): its row prints under Not listed with the signal named, by its
  // sessionId alone, since the row is already this repository's.
  const stale = new Set(all.filter((s) => s?.sessionId && !s.pid).map((s) => s.sessionId));
  // The spawner's mark on a seat with no first turn, on the seat's Listed or
  // Not listed line, so that Kanri, who sees no toast, reads it (spec 3.3).
  const marks = firstTurnMarks(root);
  const firstTurn = (sessionId) => (marks.has(sessionId) ? ` — no first turn since ${marks.get(sessionId)}` : "");

  const out = { Listed: [], "Not listed": [], "No session id": [], "Not held": [] };
  const held = new Set();
  const others = new Map();
  for (let i = table.first; i < table.end; i++) {
    const row = cells(lines[i]);
    if (row.length < 11) continue;
    const [role, topic, name] = row;
    const status = row[9].split(/\s+/)[0];
    const sessionId = sessionIdOf(row[10]);
    if (status !== "live" && status !== "queued") {
      if (sessionId) others.set(sessionId, status);
      continue;
    }
    if (!sessionId) {
      out["No session id"].push(`${role} ${topic} ${name}`);
      continue;
    }
    held.add(sessionId);
    const session = listed.get(sessionId);
    if (!session) {
      const note = stale.has(sessionId) ? " — listed without a pid (a stale entry)" : "";
      out["Not listed"].push(`${role} ${topic} ${name} — ${sessionId}${note}${firstTurn(sessionId)}`);
      continue;
    }
    const bare = name.replace(/\s*\[[^\]]*\]$/, "");
    const renamed = session.name && session.name !== bare ? " — renamed" : "";
    // The listing's `state`, for the roster's `live (blocked since <HH:MM>)`
    // (spec 5.2): the census names no cause, since the listing gives none.
    const blocked = session.state === "blocked" ? " — blocked" : "";
    const listedAs = `listed as ${session.name} (${session.kind})`;
    out.Listed.push(`${role} ${topic} ${name} — ${sessionId} — ${listedAs}${renamed}${blocked}${firstTurn(sessionId)}`);
  }
  for (const [sessionId, session] of listed) {
    if (held.has(sessionId)) continue;
    const other = others.has(sessionId) ? ` — row ${others.get(sessionId)}` : "";
    out["Not held"].push(`${session.name} (${session.kind}) — ${sessionId}${other}`);
  }
  for (const heading of CENSUS_HEADINGS) {
    console.log(`\n## ${heading}\n`);
    console.log(out[heading].length > 0 ? out[heading].join("\n") : "none");
  }
  return 0;
}

function main(argv) {
  const sub = argv[0];
  if (sub === "check") return cmdCheck(argv.slice(1));
  if (sub === "record") return cmdRecord(argv.slice(1));
  if (sub === "census") return cmdCensus(argv.slice(1));
  return fail("usage: boundary.js check|record|census <options>", 2);
}

process.exitCode = main(process.argv.slice(2));
