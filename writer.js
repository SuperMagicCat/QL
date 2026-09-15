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

categorySelect.innerHTML = Object.keys(categories).map((category) => `<option value="${category}">${category}</option>`).join("");

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

async function githubRequest(url, token, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.headers || {})
    }
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || `GitHub 请求失败（${response.status}）`);
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

async function submitEntry(event) {
  event.preventDefault();
  const values = new FormData(form);
  const token = values.get("token").trim();
  const repository = values.get("repository").trim();
  const branch = values.get("branch").trim();
  const name = values.get("name").trim();
  if (!name) return setStatus("请填写条目名称。", "error");
  if (!/^[-\w.]+\/[-\w.]+$/.test(repository)) return setStatus("仓库格式应为：用户名/仓库名。", "error");

  submitButton.disabled = true;
  setStatus("正在读取 GitHub 上的最新资料……");
  try {
    const apiBase = `https://api.github.com/repos/${repository}`;
    const file = await githubRequest(`${apiBase}/contents/app.js?ref=${encodeURIComponent(branch)}`, token);
    const source = decodeBase64(file.content);
    const entries = readEntries(source);
    const entry = createEntry(values, entries);
    const lineBreak = source.includes("\r\n") ? "\r\n" : "\n";
    const entriesRegion = source.match(/(const entries\s*=\s*\[)([\s\S]*?)(\]\s*;\s*const state\b)/);
    if (!entriesRegion) throw new Error("没有找到可写入的 entries 数据区。");
    const nextSource = source.replace(
      entriesRegion[0],
      `${entriesRegion[1]}${lineBreak}  ${JSON.stringify(entry)},${lineBreak}${entriesRegion[2]}${entriesRegion[3]}`
    );
    setStatus("正在提交新条目……");
    const commit = await githubRequest(`${apiBase}/contents/app.js`, token, {
      method: "PUT",
      body: JSON.stringify({
        message: `新增${entry.category}：${entry.name}`,
        content: encodeBase64(nextSource),
        sha: file.sha,
        branch
      })
    });
    setStatus(`已成功提交“${entry.name}”。${commit.commit?.html_url ? `提交记录：${commit.commit.html_url}` : "GitHub Pages 通常会在几分钟内发布更新。"}`, "success");
    ["name", "meta", "tags", "detail-0", "detail-1", "detail-2", "detail-3"].forEach((field) => {
      const input = form.elements.namedItem(field);
      if (input) input.value = "";
    });
    renderFields();
  } catch (error) {
    setStatus(error.message || "提交失败，请检查 Token、仓库和分支。", "error");
  } finally {
    submitButton.disabled = false;
  }
}

categorySelect.addEventListener("change", renderFields);
form.addEventListener("submit", submitEntry);
form.addEventListener("reset", () => setTimeout(renderFields, 0));
renderFields();
