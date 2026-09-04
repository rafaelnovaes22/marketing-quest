import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { Script, runInNewContext } from "node:vm";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");

function functionSource(name) {
  const start = html.indexOf("function " + name + "(");
  assert.ok(start >= 0, name);
  let candidate = "";
  for (const line of html.slice(start).split("\n")) {
    candidate += line + "\n";
    try {
      new Script("(" + candidate + ")");
      return candidate;
    } catch {}
  }
  throw new Error("Could not extract function: " + name);
}

test("inline scripts parse", () => {
  for (const [, source] of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) new Script(source);
});

function finishMission(hits, gain) {
  const elements = {};
  const state = { xp: 0, done: {}, badges: [], streak: 1 };
  const context = { S: state, GAIN: gain, HITS: hits, M: { id: "first", qs: [1, 2, 3] }, HP: 3,
    $: (selector) => elements[selector] || (elements[selector] = { appendChild() {} }),
    badge() {}, save() {}, show() {}, hud() {}, map() {}, document: { createElement: () => ({}) } };
  runInNewContext(functionSource("finish") + "\nfinish()", context);
  return { state, elements };
}

test("first completion bonus is both shown and credited", () => {
  const { state, elements } = finishMission(3, 525);
  assert.equal(state.xp, 625);
  assert.equal(elements["#rxp"].textContent, "+625 XP");
  assert.equal(state.done.first, true);
});

test("an unsuccessful quiz cannot complete a mission", () => {
  const { state } = finishMission(0, 0);
  assert.equal(state.done.first, undefined);
  assert.equal(state.xp, 0);
});

test("ranking names are escaped and streak uses calendar date", () => {
  const escaped = runInNewContext(functionSource("escapeName") + '\nescapeName("<svg onload=alert(1)>")');
  assert.ok(!escaped.includes("<svg"));
  assert.match(escaped, /&lt;svg/);
  const day = { getFullYear: () => 2026, getMonth: () => 8, getDate: () => 4 };
  assert.equal(runInNewContext(functionSource("localDay") + "\nlocalDay(day)", { day }), "2026-09-04");
});
