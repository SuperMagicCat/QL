import { createServer } from "node:http";
import { execFile } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const root = fileURLToPath(new URL(".", import.meta.url));
const entriesPath = join(root, "data", "entries.json");
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || "127.0.0.1";
const execFileAsync = promisify(execFile);
const categories = new Set(["武器", "特殊效果词条", "装备", "书籍", "法术", "祷告", "道具", "战斗技巧", "地图", "机制", "挑战"]);
const mime = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp"
};

function sendJson(response, status, payload) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload, null, 2));
}

function isLocalRequest(request) {
  return ["127.0.0.1", "::1", "::ffff:127.0.0.1"].includes(request.socket.remoteAddress);
}

async function readJsonBody(request) {
  let body = "";
  for await (const chunk of request) {
    body += chunk;
    if (body.length > 1_000_000) throw new Error("请求内容过大");
  }
  return body ? JSON.parse(body) : {};
}

function cleanText(value) {
  return String(value || "").trim();
}

function normalizeTags(category, value) {
  const rawTags = Array.isArray(value) ? value : String(value || "").split(/[,，\n]/);
  return [...new Set([category, ...rawTags.map(cleanText).filter(Boolean)])];
}

async function loadEntries() {
  const body = await readFile(entriesPath, "utf8");
  const entries = JSON.parse(body);
  if (!Array.isArray(entries)) throw new Error("entries.json must contain an array");
  return entries;
}

async function saveEntries(entries) {
  await writeFile(entriesPath, `${JSON.stringify(entries, null, 2)}\n`, "utf8");
}

function buildEntry(payload, entries) {
  const category = cleanText(payload.category);
  const name = cleanText(payload.name);
  const description = cleanText(payload.description);

  if (!categories.has(category)) throw new Error("请选择有效分类");
  if (!name) throw new Error("请填写条目名称");
  if (!description) throw new Error("请填写条目内容");

  const maxId = entries.reduce((max, entry) => Math.max(max, Number(entry.id) || 0), 0);
  const maxUpdated = entries.reduce((max, entry) => Math.max(max, Number(entry.updated) || 0), 0);

  return {
    id: maxId + 1,
    category,
    name,
    subtitle: cleanText(payload.subtitle) || `${category} · 玩家新增`,
    meta: cleanText(payload.meta) || "玩家新增",
    tags: normalizeTags(category, payload.tags),
    description,
    updated: maxUpdated + 1
  };
}

async function runGit(args) {
  try {
    const result = await execFileAsync("git", args, { cwd: root, windowsHide: true });
    return { ok: true, output: `${result.stdout}${result.stderr}`.trim() };
  } catch (error) {
    return { ok: false, output: `${error.stdout || ""}${error.stderr || error.message}`.trim() };
  }
}

async function publishChanges(message) {
  const add = await runGit(["add", "data/entries.json"]);
  if (!add.ok) throw new Error(add.output || "git add 失败");

  const commit = await runGit(["commit", "-m", message || "Update compendium entries"]);
  if (!commit.ok && /nothing to commit|无文件要提交/i.test(commit.output)) {
    return { committed: false, pushed: false, output: commit.output || "没有需要提交的资料改动" };
  }
  if (!commit.ok) throw new Error(commit.output || "git commit 失败");

  const push = await runGit(["push", "origin", "main"]);
  if (!push.ok) throw new Error(push.output || "git push 失败");

  return { committed: true, pushed: true, output: `${commit.output}\n${push.output}`.trim() };
}

async function handleApi(request, response, pathname) {
  if (!isLocalRequest(request)) {
    sendJson(response, 403, { error: "写入接口只允许本机访问" });
    return true;
  }

  try {
    if (pathname === "/api/entries" && request.method === "GET") {
      sendJson(response, 200, { entries: await loadEntries() });
      return true;
    }

    if (pathname === "/api/entries" && request.method === "POST") {
      const payload = await readJsonBody(request);
      const entries = await loadEntries();
      const duplicate = entries.some((entry) => entry.category === cleanText(payload.category) && entry.name === cleanText(payload.name));
      if (duplicate) {
        sendJson(response, 409, { error: "这个分类里已经有同名条目" });
        return true;
      }

      const entry = buildEntry(payload, entries);
      entries.push(entry);
      await saveEntries(entries);
      sendJson(response, 201, { entry, count: entries.length });
      return true;
    }

    if (pathname === "/api/publish" && request.method === "POST") {
      const payload = await readJsonBody(request);
      const result = await publishChanges(cleanText(payload.message));
      sendJson(response, 200, result);
      return true;
    }

    sendJson(response, 404, { error: "接口不存在" });
    return true;
  } catch (error) {
    sendJson(response, 500, { error: error.message || "写入器执行失败" });
    return true;
  }
}

createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
  if (pathname.startsWith("/api/")) {
    await handleApi(request, response, pathname);
    return;
  }

  const fileName = pathname === "/" ? "index.html" : pathname === "/writer" ? "writer.html" : pathname.slice(1);
  const safePath = normalize(join(root, fileName));

  if (!safePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    const body = await readFile(safePath);
    const headers = { "Content-Type": mime[extname(safePath)] || "application/octet-stream" };
    if (extname(safePath) === ".json") headers["Cache-Control"] = "no-store";
    response.writeHead(200, headers);
    response.end(body);
  } catch {
    const body = await readFile(join(root, "index.html"));
    response.writeHead(200, { "Content-Type": mime[".html"] });
    response.end(body);
  }
}).listen(port, host, () => {
  console.log(`Qilong compendium running at http://${host}:${port}`);
  console.log(`Writer available at http://${host}:${port}/writer`);
});
