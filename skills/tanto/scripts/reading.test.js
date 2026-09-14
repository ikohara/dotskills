const test = require("node:test");
const { after } = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const SCRIPT = path.join(__dirname, "reading.js");

// Every temporary directory a helper below creates, so this file's own
// fixtures leave nothing behind under the OS temp dir.
const tmpDirs = [];
function tmpDir() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "tanto-reading-"));
  tmpDirs.push(dir);
  return dir;
}
function cleanupTmpDirs() {
  for (const dir of tmpDirs) {
    // Per-entry, so one locked directory does not stop every entry after it.
    try {
      fs.rmSync(dir, { recursive: true, force: true });
    } catch {
      // Best-effort teardown -- see above.
    }
  }
}
after(cleanupTmpDirs);

// A config directory with no `tanto.json` and no `settings.json`, so that
// every run below reads the defaults unless it names a file of its own. The
// host's real personal config must never decide a test's result.
const EMPTY_CONFIG_DIR = tmpDir();

/**
 * Write a synthetic transcript. `records` are objects, serialized one per
 * line, or strings, written as they are -- which is how the half-written
 * last line of the truncation case is built. The fixtures are synthetic so
 * that no real transcript, a file that carries the human's words, is ever
 * committed.
 */
function writeTranscript(records, { trailingNewline = true } = {}) {
  const file = path.join(tmpDir(), "transcript.jsonl");
  const body = records.map((r) => (typeof r === "string" ? r : JSON.stringify(r))).join("\n");
  fs.writeFileSync(file, trailingNewline ? `${body}\n` : body, "utf8");
  return file;
}

function writeJson(name, value) {
  const file = path.join(tmpDir(), name);
  fs.writeFileSync(file, typeof value === "string" ? value : JSON.stringify(value), "utf8");
  return file;
}

function run(args, extraEnv = {}) {
  const env = { ...process.env, CLAUDE_CONFIG_DIR: EMPTY_CONFIG_DIR };
  delete env.CLAUDE_CODE_AUTO_COMPACT_WINDOW;
  for (const [key, value] of Object.entries(extraEnv)) env[key] = value;
  const result = spawnSync(process.execPath, [SCRIPT, ...args], { encoding: "utf8", env });
  return { code: result.status, out: result.stdout || "", err: result.stderr || "", error: result.error };
}

function human(timestamp, text) {
  return {
    type: "user",
    timestamp,
    origin: { kind: "human" },
    message: { role: "user", content: text },
  };
}

function assistant(usage, extra = {}) {
  return { type: "assistant", message: { role: "assistant", usage }, ...extra };
}

const PHRASE = "This session is being continued from a previous conversation";

test("the four older figures count wake-ups and one compaction, and skip tool results", () => {
  const file = writeTranscript([
    human("2026-09-14T00:00:00.000Z", "start"),
    assistant({ input_tokens: 1, cache_creation_input_tokens: 2, cache_read_input_tokens: 3 }),
    {
      type: "user",
      message: { role: "user", content: [{ type: "tool_result", content: "ok" }] },
    },
    {
      type: "user",
      timestamp: "2026-09-14T00:10:00.000Z",
      origin: { kind: "peer", name: "kanri" },
      message: { role: "user", content: [{ type: "text", text: "boundary verified" }] },
    },
    {
      type: "user",
      message: {
        role: "user",
        content: [{ type: "tool_result", content: `${PHRASE} and the tool said so` }],
      },
    },
    { type: "user", message: { role: "user", content: `${PHRASE}. Below is a summary.` } },
  ]);

  const result = run([file]);
  assert.strictEqual(result.code, 0);
  const first = result.out.split("\n")[0];
  assert.match(first, /^transcript: \d+ B, 6 records, 3 wake-ups, 1 compactions, context=6$/);
});

test("context is the sum of the three usage fields of the last assistant record", () => {
  const file = writeTranscript([
    assistant({ input_tokens: 1, cache_creation_input_tokens: 1, cache_read_input_tokens: 1 }),
    assistant({ input_tokens: 10, cache_read_input_tokens: 5 }),
  ]);
  const result = run([file]);
  assert.strictEqual(result.code, 0);
  assert.match(result.out, /context=15$/m);
});

test("effort takes perTurnEffort over effort, null falls through, and neither is unknown", () => {
  const both = writeTranscript([assistant({ input_tokens: 1 }, { perTurnEffort: "xhigh", effort: "high" })]);
  assert.match(run([both]).out, /^effort=xhigh$/m);

  const nulled = writeTranscript([assistant({ input_tokens: 1 }, { perTurnEffort: null, effort: "medium" })]);
  assert.match(run([nulled]).out, /^effort=medium$/m);

  const neither = writeTranscript([assistant({ input_tokens: 1 })]);
  assert.match(run([neither]).out, /^effort=unknown$/m);
});

test("the ceiling line is the measured baseline plus N batches, and --config overrides a field", () => {
  const under = writeTranscript([assistant({ input_tokens: 1000 }), assistant({ input_tokens: 2000 })]);
  const over = writeTranscript([assistant({ input_tokens: 1000 }), assistant({ input_tokens: 200000 })]);

  assert.match(
    run([under, "--role", "kanri"]).out,
    /^ceiling: kanri baseline=1000 \+ 2 x 65000 = 131000 — context=2000 under$/m,
  );
  assert.match(
    run([over, "--role", "jisso"]).out,
    /^ceiling: jisso baseline=1000 \+ 2 x 65000 = 131000 — context=200000 over$/m,
  );

  const config = writeJson("tanto.json", { ceiling: { kanri: { batches: 1 } } });
  assert.match(
    run([under, "--role", "kanri", "--config", config]).out,
    /^ceiling: kanri baseline=1000 \+ 1 x 65000 = 66000 — context=2000 under$/m,
  );
});

test("the presence line reads the last human wake-up and not a peer's", () => {
  const file = writeTranscript([
    human("2026-09-14T00:00:00.000Z", "a ruling"),
    assistant({ input_tokens: 1 }),
    {
      type: "user",
      timestamp: "2026-09-14T05:00:00.000Z",
      origin: { kind: "peer", name: "jisso" },
      message: { role: "user", content: "batch B reported" },
    },
  ]);

  assert.match(
    run([file, "--presence", "--now", "2026-09-14T00:30:00.000Z"]).out,
    /^human: last=2026-09-14T00:00:00\.000Z 30 min ago — present \(window 60 min\)$/m,
  );
  assert.match(
    run([file, "--presence", "--now", "2026-09-14T02:00:00.000Z"]).out,
    /^human: last=2026-09-14T00:00:00\.000Z 120 min ago — absent \(window 60 min\)$/m,
  );

  const noHuman = writeTranscript([
    assistant({ input_tokens: 1 }),
    { type: "user", message: { role: "user", content: "an older harness record" } },
  ]);
  assert.match(
    run([noHuman, "--presence", "--now", "2026-09-14T02:00:00.000Z"]).out,
    /^human: last=none — absent \(window 60 min\)$/m,
  );
});

test("the backstop line reads the environment, then the settings file, then the default", () => {
  const file = writeTranscript([assistant({ input_tokens: 1000 }), assistant({ input_tokens: 2000 })]);

  assert.match(
    run([file, "--role", "kanri", "--backstop"], {
      CLAUDE_CODE_AUTO_COMPACT_WINDOW: "400000",
    }).out,
    /^backstop: autoCompactWindow=400000 \(env\) — above ceiling 131000$/m,
  );

  const settings = writeJson("settings.json", { autoCompactWindow: 100000 });
  assert.match(
    run([file, "--role", "kanri", "--backstop", "--settings", settings]).out,
    /^backstop: autoCompactWindow=100000 \(settings\) — below ceiling 131000$/m,
  );

  assert.match(
    run([file, "--role", "kanri", "--backstop"]).out,
    /^backstop: autoCompactWindow=967000 \(default\) — above ceiling 131000$/m,
  );
});

test("the share line weights usage by context across transcripts, with the threshold from --config", () => {
  const one = writeTranscript([assistant({ input_tokens: 100 }), assistant({ input_tokens: 300 })]);
  const two = writeTranscript([assistant({ input_tokens: 600 })]);
  const config = writeJson("tanto.json", { ceiling: { share_threshold: 200 } });

  const result = run(["--share", one, two, "--config", config]);
  assert.strictEqual(result.code, 0);
  assert.match(result.out, /^share: 90% of usage at context > 200 over 2 transcripts \(900 \/ 1000 tokens\)$/m);
});

test("a missing transcript is the unavailable form at exit 0, and a usage error is exit 2", () => {
  const missing = path.join(tmpDir(), "not-here.jsonl");
  const unavailable = run([missing, "--role", "kanri"]);
  assert.strictEqual(unavailable.code, 0);
  assert.match(unavailable.out, /^transcript: unavailable — .+$/m);
  assert.match(unavailable.out, /^effort=unknown$/m);
  assert.doesNotMatch(unavailable.out, /^ceiling:/m);

  const file = writeTranscript([assistant({ input_tokens: 1 })]);
  const noRole = run([file, "--backstop"]);
  assert.strictEqual(noRole.code, 2);
  assert.match(noRole.err, /Usage: reading\.js/);

  const badRole = run([file, "--role", "sekkei"]);
  assert.strictEqual(badRole.code, 2);
  assert.match(badRole.err, /invalid --role 'sekkei'/);

  const noArgs = run([]);
  assert.strictEqual(noArgs.code, 2);
});

test("a half-written last record is counted in records and nowhere else", () => {
  const file = writeTranscript(
    [human("2026-09-14T00:00:00.000Z", "start"), assistant({ input_tokens: 7 }), '{"type":"assis'],
    { trailingNewline: false },
  );
  const result = run([file]);
  assert.strictEqual(result.code, 0);
  assert.match(result.out, /^transcript: \d+ B, 3 records, 1 wake-ups, 0 compactions, context=7$/m);
});

test("context is 0 when no assistant record carries a usage object", () => {
  const file = writeTranscript([
    human("2026-09-14T00:00:00.000Z", "start"),
    { type: "assistant", message: { role: "assistant", content: [] } },
  ]);
  assert.match(run([file]).out, /context=0$/m);
});

test("a missing or unparsable --config file is the all-defaults case", () => {
  const file = writeTranscript([assistant({ input_tokens: 1000 }), assistant({ input_tokens: 2000 })]);
  const expected = /^ceiling: kanri baseline=1000 \+ 2 x 65000 = 131000 — context=2000 under$/m;

  const missing = path.join(tmpDir(), "no-tanto.json");
  assert.match(run([file, "--role", "kanri", "--config", missing]).out, expected);

  const broken = writeJson("tanto.json", "{ not json at all");
  assert.match(run([file, "--role", "kanri", "--config", broken]).out, expected);
});

test("an unknown key under the ceiling map is ignored and named on stderr", () => {
  const file = writeTranscript([assistant({ input_tokens: 1000 }), assistant({ input_tokens: 2000 })]);
  const config = writeJson("tanto.json", {
    ceiling: { sekkei: { batches: 3 }, kanri: { window: 30 } },
  });

  const result = run([file, "--role", "kanri", "--config", config]);
  assert.strictEqual(result.code, 0);
  assert.match(result.err, /^unknown key ceiling\.sekkei, ignored$/m);
  assert.match(result.err, /^unknown key ceiling\.kanri\.window, ignored$/m);
  assert.match(result.out, /^ceiling: kanri baseline=1000 \+ 2 x 65000 = 131000 — context=2000 under$/m);
});

test("--share skips a path it cannot read, counts only the ones read, and names the skipped", () => {
  const readable = writeTranscript([assistant({ input_tokens: 400000 })]);
  const missing = path.join(tmpDir(), "gone.jsonl");

  const result = run(["--share", readable, missing]);
  assert.strictEqual(result.code, 0);
  assert.match(result.out, /over 1 transcripts \(400000 \/ 400000 tokens\)/);
  assert.match(result.out, /\(skipped .*gone\.jsonl\)/);
});
