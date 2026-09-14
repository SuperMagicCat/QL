const categories = [
  { id: "武器", en: "WEAPONS", icon: "⚔" },
  { id: "特殊效果词条", en: "AFFIXES", icon: "✧" },
  { id: "装备", en: "EQUIPMENT", icon: "♜" },
  { id: "书籍", en: "BOOKS", icon: "▤" },
  { id: "法术", en: "SPELLS", icon: "☿" },
  { id: "祷告", en: "PRAYERS", icon: "☽" },
  { id: "道具", en: "ITEMS", icon: "♢" },
  { id: "战斗技巧", en: "TECHNIQUES", icon: "✹" }
];

const entries = [
  { id: 1, category: "武器", name: "晨星之誓", subtitle: "长剑 · 神圣", rarity: "传说", meta: "伤害 1d8", updated: 8, tags: ["双手", "神圣", "誓约者"], description: "一柄被初升太阳祝福过的长剑。剑脊上刻着第一代誓约者留下的铭文，挥动时会在空气中留下短暂的金色裂痕。" },
  { id: 2, category: "特殊效果词条", name: "余烬回响", subtitle: "特殊效果 · 火焰", rarity: "史诗", meta: "词条等级 IV", updated: 7, tags: ["火焰", "持续伤害", "爆燃"], description: "造成火焰伤害时，有概率在目标身上留下余烬。余烬会在下一次受击时重新燃烧，并向附近目标扩散。" },
  { id: 3, category: "装备", name: "旅者的披风", subtitle: "披风 · 轻型", rarity: "稀有", meta: "防御 +2", updated: 6, tags: ["探索", "轻甲", "旅行"], description: "由防水蛛丝与旧地图织成的披风。它不显眼，却总能在暴风雨前找到一处干燥的落脚点。" },
  { id: 4, category: "法术", name: "星火坠落", subtitle: "法术 · 塑能系", rarity: "传说", meta: "消耗 3 法力", updated: 5, tags: ["范围", "火焰", "高阶"], description: "召唤一颗短暂的微型星体砸向战场。落点附近的敌人会被冲击波击退，地面留下持续燃烧的星痕。" },
  { id: 5, category: "书籍", name: "龙语抄本：残页", subtitle: "典籍 · 历史", rarity: "稀有", meta: "阅读时长 15 分钟", updated: 4, tags: ["龙语", "传说", "线索"], description: "从失落的龙巢中寻回的三页抄本。页边的墨迹会随读者的血脉产生变化，似乎记录着一条尚未结束的道路。" },
  { id: 6, category: "祷告", name: "守门人的低语", subtitle: "祷告 · 守护", rarity: "史诗", meta: "持续 3 回合", updated: 3, tags: ["护盾", "神恩", "反击"], description: "向看不见的守门人献上低语，使一名盟友获得短暂的保护。当护盾破碎时，施术者会听见远方的钟声。" },
  { id: 7, category: "道具", name: "月井水", subtitle: "消耗品 · 药剂", rarity: "普通", meta: "恢复 2d4", updated: 2, tags: ["治疗", "消耗品", "夜间"], description: "从月光照耀的古井中汲取的清水。饮用后能平复最轻微的伤口，也能让人在黑暗中看清一条路。" },
  { id: 8, category: "战斗技巧", name: "逆风步", subtitle: "战斗技巧 · 位移", rarity: "稀有", meta: "冷却 1 回合", updated: 1, tags: ["闪避", "位移", "反击"], description: "借着敌人出招的力量侧身而过，在其失去平衡的一瞬间完成换位。熟练者甚至能在狭窄的石阶上施展。" },
  { id: 9, category: "武器", name: "灰烬短弓", subtitle: "短弓 · 远程", rarity: "普通", meta: "伤害 1d6", updated: 0, tags: ["远程", "敏捷"], description: "用黑松木制成的轻巧短弓，适合旅途中快速出手。" },
  { id: 10, category: "装备", name: "银叶护符", subtitle: "饰品 · 护身", rarity: "普通", meta: "抗性 +1", updated: 0, tags: ["饰品", "抗性"], description: "一枚刻有银叶纹章的护符，佩戴者不易受到迷雾影响。" }
];

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
