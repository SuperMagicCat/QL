const categories = [
  { id: "武器", en: "WEAPONS", icon: "⚔" },
  { id: "特殊效果词条", en: "AFFIXES", icon: "✧" },
  { id: "装备", en: "EQUIPMENT", icon: "♜" },
  { id: "书籍", en: "BOOKS", icon: "▤" },
  { id: "法术", en: "SPELLS", icon: "☿" },
  { id: "祷告", en: "PRAYERS", icon: "☽" },
  { id: "道具", en: "ITEMS", icon: "♢" },
  { id: "战斗技巧", en: "TECHNIQUES", icon: "✹" },
  { id: "地图", en: "MAPS", icon: "⌖" }
];

const entries = [];

const state = { category: "全部", rarity: "all", search: "", sort: "recent", visible: 8 };
const categoryGrid = document.querySelector("[data-category-grid]");
const entryGrid = document.querySelector("[data-entry-grid]");
const resultCount = document.querySelector("[data-result-count]");
const resultsTitle = document.querySelector("[data-results-title]");
const emptyState = document.querySelector("[data-empty-state]");
const loadMore = document.querySelector("[data-load-more]");
const dialog = document.querySelector("[data-dialog]");
let toastTimer;

const rarityClass = { 传说: "legendary", 史诗: "epic", 稀有: "rare", 普通: "common" };

function renderCategories() {
  categoryGrid.innerHTML = [
    { id: "全部", en: "ALL ENTRIES", icon: "✦" },
    ...categories
  ].map((item) => `
    <button class="category-card ${state.category === item.id ? "active" : ""}" type="button" data-category="${item.id}">
      <span class="category-icon">${item.icon}</span>
      <strong>${item.id}</strong>
      <small>${item.en}</small>
    </button>
  `).join("");
}

function filteredEntries() {
  const query = state.search.trim().toLowerCase();
  const result = entries.filter((entry) => {
    const inCategory = state.category === "全部" || entry.category === state.category;
    const inRarity = state.rarity === "all" || entry.rarity === state.rarity;
    const haystack = [entry.name, entry.category, entry.subtitle, entry.rarity, ...entry.tags].join(" ").toLowerCase();
    return inCategory && inRarity && (!query || haystack.includes(query));
  });
  return result.sort((a, b) => state.sort === "name" ? a.name.localeCompare(b.name, "zh") : state.sort === "rarity" ? ["传说", "史诗", "稀有", "普通"].indexOf(a.rarity) - ["传说", "史诗", "稀有", "普通"].indexOf(b.rarity) : b.updated - a.updated);
}

function renderEntries() {
  const result = filteredEntries();
  const visible = result.slice(0, state.visible);
  resultsTitle.textContent = state.category === "全部" ? "全部条目" : state.category;
  resultCount.textContent = `${result.length} 条记录`;
  entryGrid.innerHTML = visible.map((entry) => `
    <article class="entry-card rarity-${entry.rarity}" data-entry-id="${entry.id}" tabindex="0" role="button" aria-label="查看 ${entry.name}">
      <div class="entry-topline">
        <span class="entry-type">${entry.category} · ${entry.subtitle.split("·")[1]?.trim() || "资料"}</span>
        <span class="rarity ${rarityClass[entry.rarity]}">◆ ${entry.rarity}</span>
      </div>
      <h3>${entry.name}</h3>
      <p>${entry.description}</p>
      <div class="entry-footer"><span class="entry-meta">${entry.meta}</span><span class="entry-arrow">↗</span></div>
    </article>
  `).join("");
  emptyState.hidden = result.length > 0;
  loadMore.hidden = result.length <= state.visible;
}

function openEntry(id) {
  const entry = entries.find((item) => item.id === Number(id));
  if (!entry) return;
  document.querySelector("[data-dialog-category]").textContent = `${entry.category} · ${entry.rarity}`;
  document.querySelector("[data-dialog-title]").textContent = entry.name;
  document.querySelector("[data-dialog-subtitle]").textContent = entry.subtitle;
  document.querySelector("[data-dialog-meta]").innerHTML = `<span><strong>${entry.meta}</strong>基础效果</span><span><strong>${entry.rarity}</strong>稀有度</span>`;
  document.querySelector("[data-dialog-description]").textContent = entry.description;
  document.querySelector("[data-dialog-tags]").innerHTML = entry.tags.map((tag) => `<span>${tag}</span>`).join("");
  dialog.showModal();
}

function toast(message) {
  const region = document.querySelector("[data-toast-region]");
  region.textContent = message;
  region.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => region.classList.remove("show"), 2400);
}

categoryGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  state.category = button.dataset.category;
  state.visible = 8;
  renderCategories();
  renderEntries();
  document.querySelector("#compendium").scrollIntoView({ behavior: "smooth", block: "start" });
});

entryGrid.addEventListener("click", (event) => {
  const card = event.target.closest("[data-entry-id]");
  if (card) openEntry(card.dataset.entryId);
});
entryGrid.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const card = event.target.closest("[data-entry-id]");
  if (card) openEntry(card.dataset.entryId);
});
document.querySelector("[data-search]").addEventListener("input", (event) => {
  state.search = event.target.value;
  state.visible = 8;
  renderEntries();
});
document.querySelector("[data-sort]").addEventListener("change", (event) => {
  state.sort = event.target.value;
  renderEntries();
});
document.querySelector("[data-filter-toggle]").addEventListener("click", () => {
  document.querySelector("[data-advanced-filters]").classList.toggle("open");
});
document.querySelector("[data-advanced-filters]").addEventListener("click", (event) => {
  const chip = event.target.closest("[data-rarity]");
  if (!chip) return;
  state.rarity = chip.dataset.rarity;
  document.querySelectorAll("[data-rarity]").forEach((item) => item.classList.toggle("active", item === chip));
  renderEntries();
});
loadMore.addEventListener("click", () => {
  state.visible += 4;
  renderEntries();
});
document.querySelector("[data-scroll-to]").addEventListener("click", () => document.querySelector("#compendium").scrollIntoView({ behavior: "smooth" }));
document.querySelector("[data-dialog-close]").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
document.querySelectorAll("[data-home]").forEach((link) => link.addEventListener("click", (event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }));
document.querySelectorAll("[data-toast]").forEach((button) => button.addEventListener("click", () => toast(button.dataset.toast)));
document.querySelector("[data-theme-toggle]").addEventListener("click", () => {
  document.body.classList.toggle("light-contrast");
  toast(document.body.classList.contains("light-contrast") ? "已切换至明亮阅读模式" : "已切换至羊皮纸阅读模式");
});
document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    document.querySelector("[data-search]").focus();
  }
  if (event.key === "Escape" && dialog.open) dialog.close();
});

renderCategories();
renderEntries();
