const categories = {
  "武器": { help: "填写武器的伤害、使用规则和特殊效果。", fields: [["伤害与基础规则", "例如：伤害 2d8；适用拼刀规则"], ["特殊效果", "命中、暴击或被动效果"], ["呼吸法 / 额外能力", "没有可留空"], ["侵蚀状态 / 限制", "侵蚀状态、需求或使用限制"]] },
  "特殊效果词条": { help: "填写词条的触发条件、具体效果和持续限制。", fields: [["触发条件", "什么时候触发"], ["效果", "触发后发生什么"], ["持续与层数", "持续时间、层数或衰减方式"], ["限制与例外", "特殊限制，没有可留空"]] },
  "装备": { help: "填写护甲或其他基础数值，以及装备提供的特殊效果。", fields: [["基础数值", "例如：护甲 5；法术护甲 3"], ["特殊效果", "受到什么影响或提供什么能力"], ["触发条件", "什么时候生效"], ["限制与次数", "次数、需求或限制"]] },
  "书籍": { help: "填写书籍记载的内容、学习方式和阅读限制。", fields: [["书籍内容", "书中记载了什么"], ["学习 / 使用方式", "阅读、学习或使用后的效果"], ["阅读条件", "需要什么条件"], ["补充记录", "其他备注"]] },
  "法术": { help: "填写法术的判定、魔力消耗、效果和失败结果。", fields: [["判定与消耗", "例如：智力判定；消耗 10 MP"], ["法术效果", "成功后发生什么"], ["持续与范围", "持续时间、范围或目标"], ["失败与限制", "失败结果或使用限制"]] },
  "祷告": { help: "填写祷告的代价、效果、判定和失败结果。", fields: [["代价与判定", "例如：失去 1d8 生命；进行信仰判定"], ["祷告效果", "成功后发生什么"], ["持续与范围", "持续时间、范围或目标"], ["失败与限制", "失败结果或使用限制"]] },
  "道具": { help: "填写道具的使用方式、效果和使用次数。", fields: [["使用方式", "如何使用、消耗什么动作"], ["道具效果", "使用后发生什么"], ["次数与持续", "可使用次数或持续时间"], ["限制与备注", "使用条件或其他说明"]] },
  "战斗技巧": { help: "填写战斗技巧的消耗、触发条件和具体效果。", fields: [["消耗", "动作、回合、资源或代价"], ["触发条件", "什么时候可以使用"], ["技巧效果", "使用后发生什么"], ["限制与失败", "限制、失败结果或补充"]] },
  "地图": { help: "填写地图地点的区域描述、路线、危险和资源。", fields: [["区域描述", "这里是什么地方"], ["地点与路线", "重要地点、入口或连接区域"], ["危险与敌人", "可能遇到的危险"], ["资源与备注", "资源、事件或其他记录"]] },
  "机制": { help: "填写机制的触发条件、规则、例外和限制。", fields: [["触发条件", "什么时候适用"], ["核心规则", "规则的具体内容"], ["流程与结果", "按什么顺序处理，结果是什么"], ["例外与限制", "特殊情况或限制"]] },
  "挑战": { help: "填写挑战的规则、参与条件、奖励和失败结果。", fields: [["挑战规则", "挑战具体要求"], ["参与条件", "谁可以参加，需要什么条件"], ["奖励与结果", "完成后获得什么"], ["失败与限制", "失败结果或特殊限制"]] }
};

const form = document.querySelector("[data-writer-form]");
const categorySelect = document.querySelector("[data-category-select]");
const detailFields = document.querySelector("[data-detail-fields]");
const categoryHelp = document.querySelector("[data-category-help]");
const status = document.querySelector("[data-status]");
const submitButton = document.querySelector("[data-submit-button]");
const existingPanel = document.querySelector("[data-existing-panel]");
const entrySearch = document.querySelector("[data-entry-search]");
const entryCategory = document.querySelector("[data-entry-category]");
const entrySelect = document.querySelector("[data-entry-select]");
const existingHelp = document.querySelector("[data-existing-help]");
const rawDescription = document.querySelector("[data-raw-description]");
const rawDescriptionInput = document.querySelector("[data-raw-description-input]");
const modeButtons = [...document.querySelectorAll("[data-mode]")];
let submitting = false;
let mode = "create";
let loadedTarget = null;
let loadedEntries = [];
let editingEntryId = null;

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
}

categorySelect.innerHTML = Object.keys(categories).map((category) => `<option value="${category}">${category}</option>`).join("");
entryCategory.innerHTML = '<option value="">全部分页</option>' + categorySelect.innerHTML;

function renderFields() {
  const config = categories[categorySelect.value];
  categoryHelp.textContent = config.help;
  detailFields.innerHTML = config.fields.map(([label, placeholder], index) => `
    <label class="detail-field ${index === 1 ? "full" : ""}">
      <span>${label}</span>
      <small>${placeholder}</small>
      <textarea name="detail-${index}" placeholder="${placeholder}"></textarea>
    </label>
  `).join("");
}

function setMode(nextMode) {
  mode = nextMode;
  editingEntryId = null;
  modeButtons.forEach((button) => {
    const active = button.dataset.mode === mode;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });
  existingPanel.hidden = mode !== "edit";
  rawDescription.hidden = mode !== "edit";
  detailFields.hidden = mode === "edit";
  submitButton.textContent = mode === "edit" ? "保存修改到 GitHub" : "提交到 GitHub";
  if (mode === "edit") {
    existingHelp.textContent = loadedEntries.length ? "选择条目后，下面的表单会载入当前内容。" : "请先点击“读取仓库资料”。";
    renderExistingEntries();
  } else {
    rawDescriptionInput.value = "";
  }
}

function setStatus(message, type = "") {
  status.textContent = message;
  status.className = `status ${type}`;
}

function encodeBase64(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}

function decodeBase64(value) {
  const binary = atob(value.replace(/\s/g, ""));
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function repositoryInputs() {
  const values = new FormData(form);
  const repository = values.get("repository").trim();
  if (!/^[-\w.]+\/[-\w.]+$/.test(repository)) throw new Error("仓库格式应为：用户名/仓库名。");
  return { values, token: values.get("token").trim(), repository, branch: values.get("branch").trim() };
}

async function githubRequest(url, token, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {})
    }
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const messages = {
      401: "Token 无效或已过期，请重新填写。",
      403: "没有写入权限或请求受到限制，请检查 Token 的 Contents 写入权限及仓库规则。",
      404: "无法访问仓库或分支，请检查仓库名称、分支和 Token 的仓库授权。",
      409: "资料已被其他提交更新。当前内容已保留，请再次提交以读取最新版本。",
      422: "GitHub 拒绝了提交，请检查分支保护规则及 Token 权限。"
    };
    throw new Error(messages[response.status] || `GitHub 请求失败（${response.status}）。请稍后重试。`);
  }
  return body;
}

function readEntries(source) {
  const match = source.match(/const entries\s*=\s*(\[[\s\S]*?\])\s*;\s*(?=const state\b)/);
  if (!match) throw new Error("没有找到 app.js 中的 entries 数据区。");
  try {
    return JSON.parse(match[1]);
  } catch {
    throw new Error("现有 entries 数据格式无法解析，请先检查 app.js。");
  }
}

function createEntry(values, existingEntries) {
  const category = values.get("category");
  const name = values.get("name").trim();
  const meta = values.get("meta").trim() || "待补充";
  const tags = values.get("tags").split(/[，,]/).map((tag) => tag.trim()).filter(Boolean);
  const config = categories[category];
  const details = config.fields.map(([label], index) => {
    const value = values.get(`detail-${index}`).trim();
    return value ? `${label}：${value}` : "";
  }).filter(Boolean);
  if (!details.length) throw new Error("请至少填写一项详细说明。");
  if (existingEntries.some((entry) => entry.category === category && entry.name === name)) {
    throw new Error(`“${name}”已经存在于${category}分页中。`);
  }
  const maxId = existingEntries.reduce((max, entry) => Math.max(max, Number(entry.id) || 0), 0);
  const maxUpdated = existingEntries.reduce((max, entry) => Math.max(max, Number(entry.updated) || 0), 0);
  return {
    id: maxId + 1,
    category,
    name,
    subtitle: `${category} · 新增资料`,
    meta,
    tags: [...new Set([category, ...tags])],
    description: details.join("\n"),
    updated: maxUpdated + 1
  };
}

function renderExistingEntries() {
  if (mode !== "edit") return;
  const category = entryCategory.value;
  const query = entrySearch.value.trim().toLowerCase();
  const matching = loadedEntries.filter((entry) => {
    const inCategory = !category || entry.category === category;
    return inCategory && (!query || `${entry.name} ${entry.category} ${entry.description}`.toLowerCase().includes(query));
  });
  entrySelect.disabled = !matching.length;
  entrySelect.innerHTML = matching.length
    ? '<option value="">选择条目</option>' + matching.map((entry) => `<option value="${entry.id}">${escapeHTML(entry.category)} · ${escapeHTML(entry.name)}</option>`).join("")
    : `<option>${loadedEntries.length ? "没有匹配的条目" : "请先读取仓库资料"}</option>`;
  entrySelect.value = matching.some((entry) => entry.id === editingEntryId) ? String(editingEntryId) : "";
}

function fillEditForm(entry) {
  if (!entry) return;
  editingEntryId = entry.id;
  form.elements.namedItem("name").value = entry.name;
  form.elements.namedItem("meta").value = entry.meta || "";
  form.elements.namedItem("tags").value = (entry.tags || []).filter((tag) => tag !== entry.category).join("，");
  rawDescriptionInput.value = entry.description || "";
  categorySelect.value = entry.category;
  renderFields();
  rawDescriptionInput.value = entry.description || "";
  existingHelp.textContent = `当前编辑：${entry.category} · ${entry.name}（#${entry.id}）`;
}

async function loadExistingEntries() {
  try {
    const { token, repository, branch } = repositoryInputs();
    if (!token) throw new Error("请先填写 GitHub Token。");
    setStatus("正在读取 GitHub 上的最新资料……");
    const apiBase = `https://api.github.com/repos/${repository}`;
    const file = await githubRequest(`${apiBase}/contents/app.js?ref=${encodeURIComponent(branch)}`, token);
    loadedEntries = readEntries(decodeBase64(file.content));
    loadedTarget = { repository, branch };
    existingHelp.textContent = `已读取 ${loadedEntries.length} 条资料，请选择要修改的条目。`;
    setStatus("资料读取成功。", "success");
    renderExistingEntries();
  } catch (error) {
    loadedTarget = null;
    loadedEntries = [];
    entrySelect.disabled = true;
    existingHelp.textContent = "读取失败，请检查连接信息。";
    setStatus(error.message || "读取失败，请检查 Token、仓库和分支。", "error");
  }
}

function createUpdatedEntry(values, existingEntry, existingEntries) {
  const category = values.get("category");
  const name = values.get("name").trim();
  const meta = values.get("meta").trim() || "待补充";
  const tags = values.get("tags").split(/[，,]/).map((tag) => tag.trim()).filter(Boolean);
  const description = values.get("raw-description").trim();
  if (!description) throw new Error("请填写完整详情。");
  if (existingEntries.some((entry) => entry.id !== existingEntry.id && entry.category === category && entry.name === name)) {
    throw new Error(`“${name}”已经存在于${category}分页中。`);
  }
  const maxUpdated = existingEntries.reduce((max, entry) => Math.max(max, Number(entry.updated) || 0), 0);
  return {
    ...existingEntry,
    category,
    name,
    subtitle: existingEntry.subtitle?.startsWith(`${category} ·`) ? existingEntry.subtitle : `${category} · 修改资料`,
    meta,
    tags: [...new Set([category, ...tags])],
    description,
    updated: maxUpdated + 1
  };
}

function replaceEntry(source, entry) {
  const lines = source.split(/\r?\n/);
  const lineIndex = lines.findIndex((line) => new RegExp(`^\\s*\\{\\s*"id"\\s*:\\s*${entry.id}\\s*,`).test(line));
  if (lineIndex < 0) throw new Error("没有找到要修改的条目，可能是资料已被其他人更新，请重新读取。");
  const lineBreak = source.includes("\r\n") ? "\r\n" : "\n";
  const comma = /,\s*$/.test(lines[lineIndex]) ? "," : "";
  lines[lineIndex] = `  ${JSON.stringify(entry)}${comma}`;
  return lines.join(lineBreak);
}

async function submitEntry(event) {
  event.preventDefault();
  if (submitting) return;
  let connection;
  try {
    connection = repositoryInputs();
  } catch (error) {
    return setStatus(error.message, "error");
  }
  const { values, token, repository, branch } = connection;
  const name = values.get("name").trim();
  if (!name) return setStatus("请填写条目名称。", "error");
  if (!/^[-\w.]+\/[-\w.]+$/.test(repository)) return setStatus("仓库格式应为：用户名/仓库名。", "error");
  if (mode === "edit" && (!editingEntryId || !loadedTarget || loadedTarget.repository !== repository || loadedTarget.branch !== branch)) {
    return setStatus("请先读取当前仓库资料并选择要修改的条目。", "error");
  }

  submitting = true;
  const controls = [...form.elements];
  controls.forEach((control) => { control.disabled = true; });
  setStatus("正在读取 GitHub 上的最新资料……");
  try {
    const apiBase = `https://api.github.com/repos/${repository}`;
    const file = await githubRequest(`${apiBase}/contents/app.js?ref=${encodeURIComponent(branch)}`, token);
    const source = decodeBase64(file.content);
    const entries = readEntries(source);
    const existingEntry = mode === "edit" ? entries.find((entry) => entry.id === editingEntryId) : null;
    if (mode === "edit" && !existingEntry) throw new Error("要修改的条目已不存在，请重新读取资料。");
    if (mode === "edit" && JSON.stringify(existingEntry) !== JSON.stringify(loadedEntries.find((entry) => entry.id === editingEntryId))) {
      throw new Error("这条资料已被其他提交修改。当前填写内容已保留，请重新读取并确认最新内容后再保存。");
    }
    const entry = mode === "edit" ? createUpdatedEntry(values, existingEntry, entries) : createEntry(values, entries);
    const lineBreak = source.includes("\r\n") ? "\r\n" : "\n";
    let nextSource;
    if (mode === "edit") {
      nextSource = replaceEntry(source, entry);
    } else {
      const entriesRegion = source.match(/(const entries\s*=\s*\[)([\s\S]*?)(\]\s*;\s*const state\b)/);
      if (!entriesRegion) throw new Error("没有找到可写入的 entries 数据区。");
      nextSource = source.replace(
        entriesRegion[0],
        () => `${entriesRegion[1]}${lineBreak}  ${JSON.stringify(entry)}${entries.length ? "," : ""}${entriesRegion[2]}${entriesRegion[3]}`
      );
    }
    setStatus("正在提交新条目……");
    const commit = await githubRequest(`${apiBase}/contents/app.js`, token, {
      method: "PUT",
      body: JSON.stringify({
        message: `${mode === "edit" ? "修改" : "新增"}${entry.category}：${entry.name}`,
        content: encodeBase64(nextSource),
        sha: file.sha,
        branch
      })
    });
    setStatus(`${mode === "edit" ? "已成功修改" : "已成功提交"}“${entry.name}”（${commit.commit?.sha?.slice(0, 7) || "已提交"}）。GitHub Pages 发布后，资料库会显示最新内容。`, "success");
    if (mode === "edit") {
      loadedEntries = entries.map((item) => item.id === entry.id ? entry : item);
      renderExistingEntries();
    } else {
      ["name", "meta", "tags", "detail-0", "detail-1", "detail-2", "detail-3"].forEach((field) => {
        const input = form.elements.namedItem(field);
        if (input) input.value = "";
      });
      renderFields();
    }
  } catch (error) {
    setStatus(error.message || "提交失败，请检查 Token、仓库和分支。", "error");
  } finally {
    controls.forEach((control) => { control.disabled = false; });
    submitting = false;
  }
}

categorySelect.addEventListener("change", renderFields);
entryCategory.addEventListener("change", renderExistingEntries);
entrySearch.addEventListener("input", renderExistingEntries);
entrySelect.addEventListener("change", () => fillEditForm(loadedEntries.find((entry) => entry.id === Number(entrySelect.value))));
document.querySelector("[data-load-entries]").addEventListener("click", loadExistingEntries);
modeButtons.forEach((button) => button.addEventListener("click", () => setMode(button.dataset.mode)));
form.addEventListener("submit", submitEntry);
form.addEventListener("reset", () => setTimeout(renderFields, 0));
renderFields();
