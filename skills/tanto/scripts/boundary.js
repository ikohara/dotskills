// tanto's boundary instrument, beside `passage-check.js` and `reading.js`.
// Seven subcommands. `check` runs the boundary's read-only commands and
// prints their output under fixed headings, and `record` writes the ledger's
// and the roster's rows — both run by the `boundary.verify` kind from
// `templates/boundary-brief.md`, and, under the design's shape 2, by a
// headless session running the same brief. Kanri runs the next four itself:
// `census`, the roster's `live` and `queued` rows against the spawner's state
// file and the CLI's listing of the sessions under the root, read-only;
// `seat`, a seat's status and its name at the moment of sending; `wake`, a
// `resume` for each parked seat it names; and `beat`, the spawner's
// heartbeat, read before every request. `request` is a seat's own, its
// `park` or its `leave`, written as its turn's last tool call, or the
// intake's `attention`, the notice that a consult has arrived, which names
// no seat. Only `record` writes a document, and only `wake` and `request`
// write request files. It judges nothing.
//
// Node, no dependencies, no shebang: always
// `node "$TANTO/scripts/boundary.js" <subcommand>`.

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
// The spawner's own paths, its heartbeat's budget, and its transcript test,
// so that this file reads the state file exactly as the spawner writes it.
const spawner = require("./spawner.js");

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
 * of an event that recurs in a later batch: two `human-access: done — <what
 * the human did>` lines in two batches are two exchanges, and both stay in
 * the ledger, while two in one batch are one call made twice. A call with no
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
 * A seat's roster row, written from the spawner's result file for every
 * seat, whoever asked for it: Kanri records a seat the launcher started once
 * the census prints it under Not held (spec 1.3). Idempotent: a second call
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
 * The seats of `<root>/.tanto/spawner/seats.json`, the state file, by
 * `sessionId` (spec 2.7): empty when the file is absent or does not parse,
 * so that a root with no spawner is read as the roster and the listing
 * place its rows.
 */
function stateSeats(root) {
  try {
    const doc = JSON.parse(fs.readFileSync(path.join(spawner.spawnerDir(root), "seats.json"), "utf8"));
    const seats = Array.isArray(doc?.seats) ? doc.seats : [];
    return new Map(seats.filter((s) => s?.sessionId).map((s) => [s.sessionId, s]));
  } catch {
    return new Map();
  }
}

/**
 * The `spawner:` line (spec 2.5, 2.7): `beating` while the heartbeat is
 * within the spawner's own budget of now, `stale` when it is older, absent,
 * or does not parse. A stale spawner takes no request and raises no notice,
 * and the state file has stopped moving (R-2).
 */
function spawnerLine(root) {
  let beat = Number.NaN;
  try {
    beat = Number(fs.readFileSync(spawner.heartbeatPath(root), "utf8").trim());
  } catch {
    // No heartbeat: no spawner ever ran under this root, or `teishi` removed it.
  }
  return Math.abs(Date.now() - beat) <= spawner.HEARTBEAT_STALE_MS ? "spawner: beating" : "spawner: stale";
}

/**
 * `claude agents --json`'s sessions under the root that carry a `pid`, by
 * `sessionId`, and the ids of the entries without one; or `error`, the
 * reason, when the listing failed or printed no JSON. The paths are compared
 * here rather than passed as `--cwd`: the CLI's filter is measured for the
 * root alone (spec 2.2).
 */
function listing(root) {
  const command = claudeCommand(["agents", "--json"]);
  const got = spawnSync(command.file, command.args, { encoding: "utf8", windowsHide: true });
  if (got.status !== 0) {
    const said = (got.stderr || "").trim().split(/\r?\n/)[0];
    return { error: said || `claude agents exited ${got.status}` };
  }
  let parsed;
  try {
    parsed = JSON.parse(got.stdout || "");
  } catch {
    return { error: "claude agents --json printed no JSON" };
  }
  const all = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.sessions) ? parsed.sessions : [];
  const listed = new Map(
    all.filter((s) => s?.sessionId && s.pid && underRoot(root, s.cwd)).map((s) => [s.sessionId, s]),
  );
  // An entry with no pid is a process gone, whatever else it carries (spec
  // 3.1): its row prints under Not listed with the signal named, by its
  // sessionId alone, since the row is already this repository's.
  const stale = new Set(all.filter((s) => s?.sessionId && !s.pid).map((s) => s.sessionId));
  return { listed, stale, error: null };
}

/**
 * Spec 1.3's suffix on a Not held line, for a seat the state file holds and
 * no `live` or `queued` row does: the result Kanri records it from. None for
 * a seat that has ended.
 */
function spawnedAs(seat) {
  if (!seat || seat.status === "stopped" || seat.status === "removed") return "";
  return ` — spawned as ${seat.role || "—"} ${seat.topic || "—"}, result ${seat.requestId || "unknown"}`;
}

/** The six headings `census` prints after its `spawner:` line, in order (spec 2.7). */
const CENSUS_HEADINGS = ["Listed", "Parked", "Ended", "Not listed", "No session id", "Not held"];

/**
 * `census [--root <dir>] [--roster <path>]` (spec 2.2, 2.7): the `spawner:`
 * line, then the roster's `live` and `queued` rows against the state file and
 * `claude agents --json`'s sessions under the root, under six headings.
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

  const found = listing(root);
  if (found.error) {
    console.log(`census: unavailable — ${found.error}`);
    return 1;
  }
  const { listed, stale } = found;
  const seats = stateSeats(root);
  // The spawner's mark on a seat with no first turn, on the seat's Listed or
  // Not listed line, so that Kanri, who sees no toast, reads it (spec 3.3).
  const firstTurn = (sessionId) => {
    const mark = seats.get(sessionId)?.noFirstTurn;
    return mark ? ` — no first turn since ${mark}` : "";
  };

  const out = Object.fromEntries(CENSUS_HEADINGS.map((heading) => [heading, []]));
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
    const seat = seats.get(sessionId);
    const where = `${role} ${topic} ${name} — ${sessionId}`;
    // Ended by the state file, whatever the listing shows: a seat a tab still
    // holds is recorded `stopped` with no command run (spec 5.1). Kanri writes
    // the row `stopped`, with an Events line naming what ended it.
    if (seat?.status === "stopped" || seat?.status === "removed") {
      out.Ended.push(`${where} — ${seat.status}${seat.endedBy ? ` by ${seat.endedBy}` : ""}`);
      continue;
    }
    const session = listed.get(sessionId);
    if (!session && seat?.status === "parked") {
      // The run's seat, its conversation on disk: nothing to mark. A cut turn
      // is Recovery's to continue, never a boundary's (spec 2.7).
      out.Parked.push(`${where}${seat.midTurn ? " — mid-turn" : ""}${seat.waiting ? " — waiting" : ""}`);
      continue;
    }
    if (!session) {
      const note = stale.has(sessionId) ? " — listed without a pid (a stale entry)" : "";
      out["Not listed"].push(`${where}${note}${firstTurn(sessionId)}`);
      continue;
    }
    const bare = name.replace(/\s*\[[^\]]*\]$/, "");
    const renamed = session.name && session.name !== bare ? " — renamed" : "";
    // Blocked on a background entry's `status: "waiting"`, with the listing's
    // cause (spec 2.6): a seat that answered and waits lists `idle`, and a
    // prompt in a tab is in front of the human already. The roster's
    // `(blocked since <HH:MM>)` keeps its form.
    const waiting = session.kind === "background" && session.status === "waiting";
    const blocked = waiting ? ` — blocked (${session.waitingFor || "no cause listed"})` : "";
    const listedAs = `listed as ${session.name} (${session.kind})`;
    out.Listed.push(`${where} — ${listedAs}${renamed}${blocked}${firstTurn(sessionId)}`);
  }
  for (const [sessionId, session] of listed) {
    if (held.has(sessionId)) continue;
    const other = others.has(sessionId) ? ` — row ${others.get(sessionId)}` : "";
    out["Not held"].push(`${session.name} (${session.kind}) — ${sessionId}${other}${spawnedAs(seats.get(sessionId))}`);
  }
  // A seat the launcher started is in the state file before any row holds
  // it, and a parked one is in no listing (spec 1.3): it prints here either
  // way, for Kanri to record from its result. A `gone` seat no row holds is
  // an earlier run's, collected and never stopped, and prints nothing.
  for (const [sessionId, seat] of seats) {
    if (held.has(sessionId) || listed.has(sessionId)) continue;
    if (!["running", "blocked", "parked"].includes(seat.status)) continue;
    const other = others.has(sessionId) ? ` — row ${others.get(sessionId)}` : "";
    out["Not held"].push(`${seat.name || "—"} (not listed) — ${sessionId}${other}${spawnedAs(seat)}`);
  }
  console.log(spawnerLine(root));
  for (const heading of CENSUS_HEADINGS) {
    console.log(`\n## ${heading}\n`);
    console.log(out[heading].length > 0 ? out[heading].join("\n") : "none");
  }
  return 0;
}

/**
 * The four subcommands' arguments after `census`: a flag named in `switches`
 * is bare, every other `--flag` takes the next argument, and the rest are
 * positionals, in order — `wake --hold <sessionId>` must not read the id as
 * the switch's value, as `parseArgs` would.
 */
function parseLine(argv, switches) {
  const values = {};
  const positionals = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith("--")) {
      positionals.push(arg);
      continue;
    }
    const name = arg.slice(2);
    const next = argv[i + 1];
    if (switches.includes(name) || next === undefined || next.startsWith("--")) {
      values[name] = true;
      continue;
    }
    values[name] = next;
    i++;
  }
  return { values, positionals };
}

/** `--root`, else the cwd, resolved; null when `--root` is given bare. */
function rootOf(values) {
  if (values.root === true) return null;
  return path.resolve(given(values, "root") || process.cwd());
}

function sleepSync(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

/**
 * Request files under the spawner's `requests/`, each through a temp file
 * and a rename, as `tanto.js` writes them. The ids share one stamp and are
 * numbered in order, so that the spawner, which takes requests in name
 * order, takes a `hold` before the `resume` written after it. Returns the
 * ids; throws when there is no requests directory.
 */
function writeRequests(root, bodies) {
  const dir = path.join(spawner.spawnerDir(root), "requests");
  if (!fs.statSync(dir).isDirectory()) throw new Error(`${dir} is not a directory`);
  const at = new Date().toISOString().replace(/[:.]/g, "-");
  const tag = Math.random().toString(36).slice(2, 8);
  return bodies.map((body, i) => {
    const id = `${at}-${String(i).padStart(3, "0")}-${tag}`;
    const file = path.join(dir, `${id}.json`);
    fs.writeFileSync(`${file}.tmp`, `${JSON.stringify(body, null, 2)}\n`);
    fs.renameSync(`${file}.tmp`, file);
    return id;
  });
}

/**
 * The `uuid` of a transcript's last record that carries one — a record may
 * carry none — or null. A last line cut by a write in progress is skipped.
 * Throws when the file cannot be read.
 */
function lastUuid(file) {
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  for (let i = lines.length - 1; i >= 0; i--) {
    if (!lines[i].trim()) continue;
    try {
      const record = JSON.parse(lines[i]);
      if (typeof record?.uuid === "string" && record.uuid) return record.uuid;
    } catch {
      // Not a whole record; the one before it is read instead.
    }
  }
  return null;
}

/**
 * `request attention --message <text> [--root <dir>]` (the tanto-feedback
 * design, 7.2): the intake's notice that a consult has arrived,
 * `{ op: "attention", message }`, which names no seat and so takes no
 * `--transcript`. The beat comes first: on a stale spawner it writes nothing,
 * prints the `spawner:` line, and exits 1 — the inbox copy is the record, and
 * the Kikaku finds it at its next turn. It is a request of its own and
 * leaves a seat's park request as it stands.
 */
function requestAttention(values) {
  if (values.transcript !== undefined || values.waiting || values.notice) {
    return fail("request attention takes no --transcript, --waiting, or --notice", 2);
  }
  const message = given(values, "message");
  if (!message) return fail("request attention needs --message <text>", 2);
  const root = rootOf(values);
  if (!root) return fail("request: --root needs a value", 2);
  const beat = spawnerLine(root);
  if (beat !== "spawner: beating") {
    console.log(beat);
    return 1;
  }
  let ids;
  try {
    ids = writeRequests(root, [{ op: "attention", message }]);
  } catch {
    return fail(`request: no spawner requests directory under ${root}`, 2);
  }
  console.log(`attention requested: ${ids[0]}`);
  return 0;
}

/**
 * `request <park|leave> --transcript <path> [--waiting [--notice]]` (spec
 * 2.2, 5.2): a seat's request about itself, written as its turn's last tool
 * call. The `sessionId` is the transcript's basename and `after` the `uuid`
 * of its last record that carries one, so that the spawner acts only once
 * the turn that wrote the request has ended. `park` carries `waiting` and
 * `notice`; `leave` is a `stop` with `self: true`. `request attention` is
 * `requestAttention`'s.
 */
function cmdRequest(argv) {
  const { values, positionals } = parseLine(argv, ["waiting", "notice"]);
  const act = positionals[0];
  if (act === "attention") return requestAttention(values);
  if (act !== "park" && act !== "leave") return fail("request needs park, leave, or attention", 2);
  const transcript = given(values, "transcript");
  if (!transcript?.endsWith(".jsonl")) return fail("request needs --transcript <path>.jsonl", 2);
  if (act === "leave" && (values.waiting || values.notice)) {
    return fail("request leave takes no --waiting and no --notice", 2);
  }
  if (values.notice && !values.waiting) return fail("request park: --notice goes with --waiting", 2);
  const root = rootOf(values);
  if (!root) return fail("request: --root needs a value", 2);
  let after;
  try {
    after = lastUuid(transcript);
  } catch {
    return fail(`request: cannot read the transcript at ${transcript}`, 2);
  }
  const sessionId = path.basename(transcript, ".jsonl");
  const body =
    act === "park"
      ? { op: "park", sessionId, waiting: values.waiting === true, notice: values.notice === true }
      : { op: "stop", sessionId, self: true };
  if (after) body.after = after;
  let ids;
  try {
    ids = writeRequests(root, [body]);
  } catch {
    return fail(`request: no spawner requests directory under ${root}`, 2);
  }
  console.log(`${act} requested: ${ids[0]}`);
  return 0;
}

/** A seat by its `sessionId`, else the last one of that name — a `removed` messenger's among them (spec 4.4). */
function findSeat(seats, who) {
  if (seats.has(who)) return seats.get(who);
  return [...seats.values()].filter((seat) => seat.name === who).pop() || null;
}

/**
 * `seat`'s line, `<status> <name> <kind> <role> <turn>` (spec 2.5). The name
 * and the kind are the listing's now, else the state file's name and `-`: a
 * seat a tab holds stays listed after its `stop` (spec 5.1), which no census
 * pass of the spawner records. `<turn>` is `ended` or `open` by the
 * spawner's `turnEnded` over the whole transcript, `-` when none is on disk.
 */
function seatLine(seat, listed) {
  const session = listed.get(seat.sessionId);
  const name = session?.name || seat.name || "-";
  const kind = session?.kind || "-";
  let turn = "-";
  if (seat.transcript && fs.existsSync(seat.transcript)) {
    turn = spawner.turnEnded(seat.transcript)?.ended ? "ended" : "open";
  }
  return `${seat.status || "-"} ${name} ${kind} ${seat.role || "-"} ${turn}`;
}

/**
 * `seat <sessionId or name> [--root <dir>]` (spec 2.5, 1.5): the seat's line
 * from the state file, then the `spawner:` line. A session the state file
 * does not hold prints `no entry <kind>`, the kind the listing's for it, `-`
 * when it is not listed — what a session that ran `/tanto <role>` by hand
 * reads to learn whether the run started it. A listing that failed prints no
 * entry line: `seat: the listing failed — <error>` and exit 1, so a failed
 * listing is never read as "not listed".
 */
function cmdSeat(argv) {
  const { values, positionals } = parseLine(argv, []);
  const who = positionals[0];
  if (!who) return fail("seat needs a sessionId or a name", 2);
  const root = rootOf(values);
  if (!root) return fail("seat: --root needs a value", 2);
  const found = listing(root);
  if (found.error) return fail(`seat: the listing failed — ${found.error}`, 1);
  const listed = found.listed;
  const seat = findSeat(stateSeats(root), who);
  if (seat) {
    console.log(seatLine(seat, listed));
  } else {
    const session = listed.get(who) || [...listed.values()].find((s) => s.name === who);
    console.log(`no entry ${session?.kind || "-"}`);
  }
  console.log(spawnerLine(root));
  return 0;
}

/** A hold for a face with no launcher: 55 minutes past the seat's last turn, inside the hour's cache (spec 2.4, D-22). */
const HOLD_FOR_MS = 3300000;

/** How long `wake` waits for all its results (spec 2.5); `TANTO_WAKE_WAIT_MS` is a test seam. */
function wakeWaitMs() {
  return Number(process.env.TANTO_WAKE_WAIT_MS) || 60000;
}

/** The results of `ids` that land within `waitMs` in all, by id; one that does not is absent. */
function waitForResults(root, ids, waitMs) {
  const dir = path.join(spawner.spawnerDir(root), "results");
  const found = new Map();
  const until = Date.now() + waitMs;
  for (;;) {
    for (const id of ids) {
      if (found.has(id)) continue;
      try {
        found.set(id, JSON.parse(fs.readFileSync(path.join(dir, `${id}.json`), "utf8")));
      } catch {
        // Not there yet: the spawner writes a result through a rename.
      }
    }
    if (found.size === ids.length || Date.now() >= until) return found;
    sleepSync(500);
  }
}

/**
 * `wake [--hold] <sessionId>... [--root <dir>]` (spec 2.5): the `spawner:`
 * line; then a `resume` with no prompt for each seat, all written at once —
 * each after a `hold` with `forMs` and no `pid` when `--hold` is given (spec
 * 2.4) — one wait of up to sixty seconds for every result, and one line per
 * seat: `seat`'s line, or `error: <the result's error> — <sessionId>` with
 * the name the result carries. On a stale spawner it writes nothing: a
 * request no spawner takes is a line that waits unseen. Exit 1 on an error
 * line, on a hold that failed, or on a listing that failed (`listing:
 * <error>`, after the seats' lines).
 */
function cmdWake(argv) {
  const { values, positionals } = parseLine(argv, ["hold"]);
  const ids = [...new Set(positionals)];
  if (ids.length === 0) return fail("wake needs a sessionId", 2);
  const root = rootOf(values);
  if (!root) return fail("wake: --root needs a value", 2);
  const beat = spawnerLine(root);
  console.log(beat);
  if (beat !== "spawner: beating") return 1;
  const bodies = [];
  const plan = ids.map((sessionId) => {
    const entry = { sessionId, hold: null, resume: null };
    if (values.hold) {
      entry.hold = bodies.length;
      bodies.push({ op: "hold", sessionId, forMs: HOLD_FOR_MS });
    }
    entry.resume = bodies.length;
    bodies.push({ op: "resume", sessionId });
    return entry;
  });
  let written;
  try {
    written = writeRequests(root, bodies);
  } catch {
    return fail(`wake: no spawner requests directory under ${root}`, 2);
  }
  const results = waitForResults(root, written, wakeWaitMs());
  const found = listing(root);
  const listed = found.listed || new Map();
  const seats = stateSeats(root);
  let failed = false;
  for (const entry of plan) {
    const result = results.get(written[entry.resume]);
    if (!result || result.error) {
      failed = true;
      const name = result?.name ? ` ${result.name}` : "";
      console.log(`error: ${result ? result.error : "no result"} — ${entry.sessionId}${name}`);
      continue;
    }
    // A hold that failed leaves the seat awake and unheld: said on its line,
    // which still begins with the five words.
    let held = "";
    if (entry.hold !== null) {
      const hold = results.get(written[entry.hold]);
      if (!hold || hold.error) {
        held = ` — hold: ${hold ? hold.error : "no result"}`;
        failed = true;
      }
    }
    const seat = seats.get(entry.sessionId);
    console.log(`${seat ? seatLine(seat, listed) : `no entry ${listed.get(entry.sessionId)?.kind || "-"}`}${held}`);
  }
  if (found.error) {
    console.log(`listing: ${found.error}`);
    failed = true;
  }
  return failed ? 1 : 0;
}

/** `beat [--root <dir>]` (spec 2.5): the `spawner:` line alone, exit 1 when stale. */
function cmdBeat(argv) {
  const { values } = parseLine(argv, []);
  const root = rootOf(values);
  if (!root) return fail("beat: --root needs a value", 2);
  const line = spawnerLine(root);
  console.log(line);
  return line === "spawner: beating" ? 0 : 1;
}

function main(argv) {
  const sub = argv[0];
  if (sub === "check") return cmdCheck(argv.slice(1));
  if (sub === "record") return cmdRecord(argv.slice(1));
  if (sub === "census") return cmdCensus(argv.slice(1));
  if (sub === "request") return cmdRequest(argv.slice(1));
  if (sub === "seat") return cmdSeat(argv.slice(1));
  if (sub === "wake") return cmdWake(argv.slice(1));
  if (sub === "beat") return cmdBeat(argv.slice(1));
  return fail("usage: boundary.js check|record|census|request|seat|wake|beat <options>", 2);
}

process.exitCode = main(process.argv.slice(2));
