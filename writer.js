const categories = ["武器", "特殊效果词条", "装备", "书籍", "法术", "祷告", "道具", "战斗技巧", "地图", "机制", "挑战"];
const form = document.querySelector("[data-entry-form]");
const categoryField = document.querySelector("[data-category]");
const subtitleField = document.querySelector("[data-subtitle]");
const status = document.querySelector("[data-status]");
const saveButton = document.querySelector("[data-save]");
const publishButton = document.querySelector("[data-publish]");
const count = document.querySelector("[data-count]");
const recentList = document.querySelector("[data-recent-list]");
let subtitleEdited = false;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showStatus(message, type = "") {
  status.textContent = message;
  status.className = `form-status ${type}`.trim();
}

function setBusy(busy) {
  saveButton.disabled = busy;
  publishButton.disabled = busy;
  saveButton.querySelector("span").textContent = busy ? "…" : "＋";
}

function updateSubtitle() {
  if (!subtitleEdited) subtitleField.value = `${categoryField.value} · 玩家新增`;
}

function formPayload() {
  return Object.fromEntries(new FormData(form).entries());
}

async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || `请求失败（${response.status}）`);
  return payload;
}

async function loadLibrary() {
  try {
    const payload = await request("/api/entries");
    const entries = payload.entries || [];
    count.textContent = `${entries.length} 条资料`;
    const recent = [...entries].sort((a, b) => b.updated - a.updated).slice(0, 12);
    recentList.innerHTML = recent.length
      ? recent.map((entry) => `
          <div class="recent-entry">
            <div>
              <strong>${escapeHtml(entry.name)}</strong>
              <small>${escapeHtml(entry.category)}</small>
            </div>
            <time>#${entry.id}</time>
          </div>
        `).join("")
      : '<p class="empty-recent">资料库还没有条目。</p>';
  } catch (error) {
    count.textContent = "读取失败";
    recentList.innerHTML = `<p class="empty-recent">${escapeHtml(error.message)}</p>`;
  }
}

async function saveEntry(shouldPublish = false) {
  const payload = formPayload();
  setBusy(true);
  showStatus(shouldPublish ? "正在保存并准备推送……" : "正在保存……");

  try {
    const result = await request("/api/entries", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    let message = `已保存「${result.entry.name}」到「${result.entry.category}」分类。`;

    if (shouldPublish) {
      showStatus(`${message}\n正在提交并推送 Git……`);
      const published = await request("/api/publish", {
        method: "POST",
        body: JSON.stringify({ message: `Add ${result.entry.category} entry: ${result.entry.name}` })
      });
      message = published.pushed
        ? `${message}\nGit 推送成功，托管平台会自动重新部署。`
        : `${message}\n${published.output || "没有新的 Git 提交。"}`;
    }

    showStatus(message, "success");
    form.reset();
    categoryField.value = categories[0];
    subtitleEdited = false;
    updateSubtitle();
    await loadLibrary();
  } catch (error) {
    showStatus(error.message, "error");
  } finally {
    setBusy(false);
  }
}

categoryField.innerHTML = categories.map((category) => `<option value="${category}">${category}</option>`).join("");
categoryField.value = "武器";
updateSubtitle();

form.addEventListener("input", (event) => {
  if (event.target === subtitleField) subtitleEdited = true;
  const data = formPayload();
  document.querySelector("[data-preview-category]").textContent = data.category || "未选择分类";
  document.querySelector("[data-preview-name]").textContent = data.name || "未命名条目";
  document.querySelector("[data-preview-description]").textContent = data.description || "在左侧填写内容，这里会实时预览它在资料库中的样子。";
  document.querySelector("[data-preview-meta]").textContent = data.meta || "玩家新增";
});
categoryField.addEventListener("change", updateSubtitle);
form.addEventListener("submit", (event) => {
  event.preventDefault();
  saveEntry(false);
});
document.querySelector("[data-publish]").addEventListener("click", () => {
  if (form.reportValidity()) saveEntry(true);
});
document.querySelector("[data-reset]").addEventListener("click", () => {
  form.reset();
  categoryField.value = "武器";
  subtitleEdited = false;
  updateSubtitle();
  showStatus("");
  form.dispatchEvent(new Event("input"));
});

loadLibrary();
