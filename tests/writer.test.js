import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const writerSource = readFileSync(new URL("../writer.js", import.meta.url), "utf8");
const appSource = readFileSync(new URL("../app.js", import.meta.url), "utf8");

function setup({ source = appSource, category = "武器", name = "测试条目", failure = 0 } = {}) {
  const fields = Object.entries({
    token: "test-only-token", repository: "SuperMagicCat/QL", branch: "main",
    category, name, meta: "伤害 2d8", tags: "测试，测试,格式",
    "detail-0": "", "detail-1": "第一行\n第二行 $& $' $` <文字>", "detail-2": "", "detail-3": ""
  }).map(([name, value]) => ({ name, value, disabled: false }));
  fields.namedItem = (name) => fields.find((field) => field.name === name);
  const form = { elements: fields, addEventListener() {} };
  const status = {};
  const nodes = {
    "[data-writer-form]": form,
    "[data-category-select]": Object.assign(fields.namedItem("category"), { addEventListener() {} }),
    "[data-detail-fields]": {}, "[data-category-help]": {},
    "[data-status]": status, "[data-submit-button]": {}
  };
  const requests = [];
  const context = vm.createContext({
    TextEncoder, TextDecoder, btoa, atob, setTimeout,
    document: { querySelector: (selector) => nodes[selector] },
    FormData: class { constructor() { return new Map(fields.map(({ name, value }) => [name, value])); } },
    fetch: async (url, options) => {
      requests.push({ url, options });
      const writing = options.method === "PUT";
      return {
        ok: !writing || !failure,
        status: writing && failure ? failure : 200,
        json: async () => writing
          ? { commit: { sha: "1234567890abcdef" } }
          : { sha: "latest-file-sha", content: Buffer.from(source).toString("base64") }
      };
    }
  });
  vm.runInContext(writerSource, context);
  return { context, fields, requests, status, submit: () => context.submitEntry({ preventDefault() {} }) };
}

for (const newline of ["\n", "\r\n"]) {
  test(`publishes one entry, preserving existing content with ${JSON.stringify(newline)}`, async () => {
    const source = appSource.replace(/\r?\n/g, newline);
    const run = setup({ source, name: '测试 "引号" $& $\' $` <标签>' });
    const before = run.context.readEntries(source);
    await run.submit();
    assert.equal(run.requests.length, 2);
    const request = run.requests[1];
    const body = JSON.parse(request.options.body);
    const updated = Buffer.from(body.content, "base64").toString("utf8");
    const after = run.context.readEntries(updated);
    assert.equal(after.length, before.length + 1);
    assert.equal(JSON.stringify(after.slice(1)), JSON.stringify(before));
    assert.equal(after[0].name, '测试 "引号" $& $\' $` <标签>');
    assert.ok(after[0].description.includes("第二行 $& $' $` <文字>"));
    assert.equal(after[0].id, 57);
    assert.equal(after[0].updated, 57);
    assert.equal(body.sha, "latest-file-sha");
    assert.equal(body.branch, "main");
    assert.equal(request.options.headers["Content-Type"], "application/json");
    assert.equal(run.fields.namedItem("token").value, "test-only-token");
    assert.equal(run.fields.namedItem("name").value, "");
    assert.ok(!updated.includes("test-only-token"));
    new vm.Script(updated);
  });
}

test("same-category duplicates do not publish", async () => {
  const run = setup({ category: "机制", name: "狂暴" });
  await run.submit();
  assert.equal(run.requests.length, 1);
  assert.match(run.status.textContent, /已经存在/);
  assert.equal(run.fields.namedItem("name").value, "狂暴");
});

test("an empty archive remains valid JSON after insertion", async () => {
  const run = setup({ source: "const entries = [];\nconst state = {};" });
  await run.submit();
  const body = JSON.parse(run.requests[1].options.body);
  const data = run.context.readEntries(Buffer.from(body.content, "base64").toString("utf8"));
  assert.equal(data.length, 1);
  assert.equal(data[0].id, 1);
});

test("a conflicting write preserves the form and does not retry automatically", async () => {
  const run = setup({ failure: 409 });
  await run.submit();
  assert.equal(run.requests.length, 2);
  assert.match(run.status.textContent, /当前内容已保留/);
  assert.equal(run.fields.namedItem("name").value, "测试条目");
  assert.ok(run.fields.every((field) => !field.disabled));
});

test("a second click while publishing does not submit twice", async () => {
  const run = setup();
  await Promise.all([run.submit(), run.submit()]);
  assert.equal(run.requests.length, 2);
});
