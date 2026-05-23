const menuToggle = document.querySelector("[data-menu-toggle]");
const navLinks = document.querySelector("[data-nav-links]");
const langToggle = document.querySelector("[data-lang-toggle]");
const pageLang = document.body?.dataset.lang || "zh";
const isEnglish = pageLang === "en";
const browserPrefersEnglish = (navigator.language || "").toLowerCase().startsWith("en");

const uiText = {
  emptyReading: isEnglish ? "Finished books are being organized" : "正在整理已读完书籍",
  fallbackNote: isEnglish ? "This book has been finished. More shareable notes will be organized later." : "这本书已经读完，后续会继续整理可展示的笔记"
};

document.documentElement.classList.add("js-ready");

const updateCursor = (event) => {
  document.body.style.setProperty("--cursor-x", `${event.clientX}px`);
  document.body.style.setProperty("--cursor-y", `${event.clientY}px`);
  document.body.classList.add("cursor-active");
};

if (window.matchMedia("(hover: hover)").matches) {
  window.addEventListener("pointermove", updateCursor, { passive: true });
  window.addEventListener("pointerleave", () => {
    document.body.classList.remove("cursor-active");
  });
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    navLinks.classList.toggle("is-open", !isOpen);
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      navLinks.classList.remove("is-open");
    });
  });
}

if (langToggle) {
  const goToEnglish = pageLang !== "en";
  const targetUrl = goToEnglish ? "./en/index.html" : "../index.html";
  const targetLabel = goToEnglish ? "English" : "中文";
  langToggle.setAttribute("aria-label", `切换到 ${targetLabel}`);
  langToggle.textContent = goToEnglish ? "EN" : "中";
  const isEntryPage = window.location.pathname === "/" || /\/index\.html?$/.test(window.location.pathname);
  if (browserPrefersEnglish && pageLang !== "en" && isEntryPage) {
    window.addEventListener("DOMContentLoaded", () => {
      window.location.href = "./en/index.html";
    }, { once: true });
  }
  langToggle.addEventListener("click", () => {
    window.location.href = targetUrl;
  });
}

const header = document.querySelector("[data-elevates]");

if (header) {
  const setHeaderState = () => {
    header.classList.toggle("is-elevated", window.scrollY > 8);
  };
  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });
}

document.querySelectorAll(".reveal").forEach((item, index) => {
  item.style.animationDelay = `${Math.min(index * 90, 360)}ms`;
});

const readingShelf = document.querySelector("[data-reading-shelf]");
const readingTitle = document.querySelector("[data-reading-title]");
const readingAuthor = document.querySelector("[data-reading-author]");
const readingMeta = document.querySelector("[data-reading-meta]");
const readingNote = document.querySelector("[data-reading-note]");
const readingCard = document.querySelector("[data-reading-card]");
const notePrev = document.querySelector("[data-note-prev]");
const noteNext = document.querySelector("[data-note-next]");
const noteCount = document.querySelector("[data-note-count]");
const noteClose = document.querySelector("[data-note-close]");
let activeNotes = [];
let activeNoteIndex = 0;
let activeTotalNotes = 0;
let activeReadingGroupIndex = 0;

const closeReadingCard = () => {
  if (!readingCard) return;
  readingCard.classList.remove("is-open", "is-popping");
  document.querySelectorAll(".sketch-book.active").forEach((item) => item.classList.remove("active"));
  window.setTimeout(() => {
    if (!readingCard.classList.contains("is-open")) {
      readingCard.hidden = true;
    }
  }, 260);
};

const updateNote = () => {
  if (!readingNote || !noteCount) return;
  readingNote.textContent = activeNotes[activeNoteIndex] || "";
  noteCount.textContent = `${activeNoteIndex + 1} / ${Math.max(activeTotalNotes, activeNotes.length, 1)}`;
  if (notePrev) notePrev.disabled = activeNotes.length <= 1;
  if (noteNext) noteNext.disabled = activeNotes.length <= 1;
  if (readingNote.parentElement) {
    readingNote.parentElement.scrollTop = 0;
    window.requestAnimationFrame(() => {
      const scrollArea = readingNote.parentElement;
      const hasMoreContent = scrollArea.scrollHeight > scrollArea.clientHeight + 4;
      const hasLongNote = (activeNotes[activeNoteIndex] || "").length > 64;
      scrollArea.classList.toggle("is-scrollable", hasMoreContent || hasLongNote || activeNotes.length > 1);
    });
  }
};

const openReadingBook = (button) => {
  document.querySelectorAll(".sketch-book").forEach((item) => item.classList.toggle("active", item === button));
  activeNotes = (button.dataset.bookNotes || "").split("||").filter(Boolean);
  activeNoteIndex = 0;
  activeTotalNotes = Number(button.dataset.bookNoteCount || activeNotes.length || 1);
  if (readingTitle) readingTitle.textContent = button.dataset.bookTitle || "";
  if (readingAuthor) readingAuthor.textContent = button.dataset.bookAuthor || "";
  if (readingMeta) readingMeta.textContent = button.dataset.bookMeta || "";
  updateNote();
  if (readingCard) {
    readingCard.hidden = false;
    readingCard.classList.remove("is-popping");
    readingCard.classList.add("is-open");
    void readingCard.offsetWidth;
    readingCard.classList.add("is-popping");
  }
};

const bindReadingButtons = () => {
  document.querySelectorAll(".sketch-book").forEach((button) => {
    if (button.dataset.bound === "true") return;
    button.dataset.bound = "true";
    button.addEventListener("click", () => openReadingBook(button));
  });
};

const createBookButton = (book) => {
  const button = document.createElement("button");
  button.className = "sketch-book";
  button.type = "button";
  const displayTitle = book.title || book.shortTitle || "";
  const seed = Array.from(displayTitle).reduce((sum, char) => sum + char.charCodeAt(0), 0) + Number(book.noteCount || 0);
  const height = 96 + (seed % 7) * 4 + (displayTitle.length % 3) * 2;
  const title = document.createElement("span");
  const maxTitleLength = 7;
  title.textContent = displayTitle.length > maxTitleLength ? `${displayTitle.slice(0, maxTitleLength)}...` : displayTitle;
  button.appendChild(title);
  button.title = displayTitle;
  button.style.setProperty("--h", `${height}px`);
  button.dataset.bookTitle = book.title || "";
  button.dataset.bookAuthor = book.author || "";
  button.dataset.bookMeta = book.meta || "";
  button.dataset.bookNoteCount = String(book.noteCount || (book.notes || []).length || 1);
  button.dataset.bookNotes = (book.notes && book.notes.length ? book.notes : [uiText.fallbackNote]).join("||");
  return button;
};

const createShelfRows = (books) => {
  const shelf = document.createElement("div");
  shelf.className = "sketch-shelf";
  const rows = [[], [], []];
  const rowCounts = [0, 0, 0];
  books.forEach((book) => {
    const targetRow = rowCounts.indexOf(Math.min(...rowCounts));
    rows[targetRow].push(book);
    rowCounts[targetRow] += 1;
  });
  rows.forEach((rowBooks) => {
    const row = document.createElement("div");
    row.className = "shelf-row";
    const shelfLine = document.createElement("span");
    shelfLine.className = "shelf-line";
    const rail = document.createElement("div");
    rail.className = "shelf-rail";
    rowBooks.forEach((book) => rail.appendChild(createBookButton(book)));
    row.append(shelfLine, rail);
    shelf.appendChild(row);
  });
  return shelf;
};

const readingCategories = [
  {
    name: "AI / Technology",
    match: /AI|AIGC|ChatGPT|人工智能|大模型|机器学习|深度学习|生成式|算法|科技|科学|宇宙|物理|数学|复杂|数字|火箭|系统之美|技术的本质|源代码/
  },
  {
    name: "Product / Growth",
    match: /产品|用户|增长|运营|设计|体验|游戏|创新|营销|口碑|商业模式|小米|行为设计|峰值体验|消费者行为/
  },
  {
    name: "Work / Management",
    match: /管理|经理|领导|团队|OKR|工作|复盘|效率|沟通|表达|谈话|提问|习惯|原则|执行|组织|阿米巴|格鲁夫|活法|干法|一路向前|能力陷阱|从优秀到卓越|关键跨越|别让猴子|赢|跨越不可能|英伟达之道/
  },
  {
    name: "Business / Investing",
    match: /投资|金融|经济|商业|行业|财富|会计|估值|证券|交易|资本|周期|公司|创业|店|竞争优势|反脆弱|随机漫步|稀缺/
  },
  {
    name: "People / Biography",
    match: /传|自传|乔布斯|马斯克|任正非|李光耀|科比|黄仁勋|李飞飞|苏东坡|人物|曼巴/
  },
  {
    name: "History / Society",
    match: /历史|中国|美国|世界|文明|文化|社会|政治|战争|党史|王朝|帝国|革命|时代|国家|民族|枪炮|万历|大明|菊与刀|娱乐至死|人类简史|古代人/
  },
  {
    name: "Thinking / Mind",
    match: /思考|逻辑|认知|心理|哲学|心智|底层|框架|决策|判断|提问|幸福|人生|学习|费曼|第一性原理|结构化|麦肯锡|拆掉思维|西西弗|禅|人性|情绪|亲密关系|终身成长|时间当作朋友|你不可不知/
  },
  {
    name: "Literature / Story",
    match: /小说|故事|文学|诗|三体|活着|命运|月亮|乌合之众|人类群星|东坡|潘金莲|无战事|长安|地下室|地坛|我们仨|太白|盖茨比|恶意|呐喊|山月记|悉达多|百年孤独|杀死一只|献给阿尔吉侬|红与黑|围城|白鹿原|局外人|包法利|罗杰疑案|且听风吟|夜晚的潜水艇/
  },
  {
    name: "Life / Memoir",
    match: /我在|我与|我的|也许你该|当我谈|皮囊|活出生命|回家|相信|你当像|克拉克森|前半生|牛棚|阿勒泰|明亮的夜晚|鳗鱼|忍不住/
  }
];

const buildReadingGroups = (groups) => {
  const refined = readingCategories.map((category) => ({ name: category.name, books: [] }));
  const fallback = { name: "Life / Others", books: [] };
  groups.flatMap((group) => group.books).forEach((book) => {
    const text = `${book.title || ""} ${book.shortTitle || ""} ${book.category || ""}`;
    const categoryIndex = readingCategories.findIndex((category) => category.match.test(text));
    if (categoryIndex >= 0) {
      refined[categoryIndex].books.push(book);
    } else {
      fallback.books.push(book);
    }
  });
  return [...refined, fallback].filter((group) => group.books.length > 0);
};

const activateReadingGroup = (index) => {
  activeReadingGroupIndex = index;
  closeReadingCard();
  document.querySelectorAll("[data-reading-tab]").forEach((tab) => {
    tab.classList.toggle("active", Number(tab.dataset.readingTab) === index);
  });
  document.querySelectorAll("[data-reading-group]").forEach((group) => {
    group.hidden = Number(group.dataset.readingGroup) !== index;
  });
};

let readingRendered = false;
let readingRenderAttempts = 0;

const renderReadingShelf = () => {
  const data = window.READING_DATA;
  if (!readingShelf || !data || !Array.isArray(data.groups)) {
    bindReadingButtons();
    return false;
  }
  if (readingRendered) return true;
  readingShelf.innerHTML = "";
  const tabs = document.createElement("div");
  tabs.className = "reading-tabs";
  const stage = document.createElement("div");
  stage.className = "reading-stage";
  const groups = buildReadingGroups(data.groups);
  groups.forEach((group, index) => {
    const tab = document.createElement("button");
    tab.type = "button";
    tab.className = "reading-tab";
    tab.dataset.readingTab = String(index);
    tab.textContent = `${group.name} · ${group.books.length}`;
    tab.addEventListener("click", () => activateReadingGroup(index));
    tabs.appendChild(tab);

    const category = document.createElement("div");
    category.className = "shelf-category";
    category.dataset.readingGroup = String(index);
    const label = document.createElement("span");
    label.textContent = `${group.name} · ${group.books.length}`;
    const shelf = createShelfRows(group.books);
    category.append(label, shelf);
    stage.appendChild(category);
  });
  readingShelf.append(tabs, stage);
  bindReadingButtons();
  activateReadingGroup(Math.min(activeReadingGroupIndex, groups.length - 1));
  readingRendered = true;
  return true;
};

const scheduleReadingRender = () => {
  if (renderReadingShelf()) return;
  if (readingRenderAttempts >= 40) return;
  readingRenderAttempts += 1;
  window.setTimeout(scheduleReadingRender, 150);
};

scheduleReadingRender();
window.addEventListener("reading-data-ready", () => {
  readingRendered = false;
  scheduleReadingRender();
});

if (notePrev) {
  notePrev.addEventListener("click", () => {
    if (activeNotes.length <= 1) return;
    activeNoteIndex = (activeNoteIndex - 1 + activeNotes.length) % activeNotes.length;
    updateNote();
  });
}

if (noteNext) {
  noteNext.addEventListener("click", () => {
    if (activeNotes.length <= 1) return;
    activeNoteIndex = (activeNoteIndex + 1) % activeNotes.length;
    updateNote();
  });
}

if (noteClose && readingCard) {
  noteClose.addEventListener("click", closeReadingCard);
}
