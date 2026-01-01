(function () {
  const DEFAULT_SUBJECT = "physics";
  const KNOWN_SUBJECTS = new Set(["physics", "digital-circuit"]);
  const state = {
    subject: DEFAULT_SUBJECT,
    loaded: false,
    seed: null,
    totalPages: 0,
    pages: [],
    pageByNumber: {},
  };

  function assertLoaded() {
    if (!state.loaded) {
      throw new Error("NotesService 未加载：请先调用 await NotesService.load()");
    }
  }

  function normalizeSubject(subject) {
    const normalized = String(subject || "").trim();
    if (KNOWN_SUBJECTS.has(normalized)) return normalized;
    return DEFAULT_SUBJECT;
  }

  function resetState() {
    state.loaded = false;
    state.seed = null;
    state.totalPages = 0;
    state.pages = [];
    state.pageByNumber = {};
  }

  function setSubject(subject) {
    const next = normalizeSubject(subject);
    if (state.subject === next) return state.subject;
    state.subject = next;
    resetState();
    return state.subject;
  }

  function getSubject() {
    return state.subject;
  }

  function buildIndexes() {
    state.pageByNumber = {};
    for (const page of state.pages) {
      const n = Number(page.page);
      if (!Number.isInteger(n)) continue;
      state.pageByNumber[n] = page;
    }
  }

  function resolveSeed(seed, subject) {
    if (!seed || typeof seed !== "object") return null;
    if (seed.subjects && seed.subjects[subject]) return seed.subjects[subject];
    if (seed.subject === subject) return seed;
    if (seed.pages && subject === DEFAULT_SUBJECT) return seed;
    return null;
  }

  async function load() {
    if (state.loaded) return state;

    const seed = window.__EM_NOTES_SEED__;
    const isFileProtocol = window.location.protocol === "file:";
    const subject = normalizeSubject(state.subject);
    let resolved = resolveSeed(seed, subject);
    if (!resolved || !isFileProtocol) {
      try {
        const res = await fetch(`data/${subject}/notes.json`);
        resolved = await res.json();
      } catch (err) {
        throw new Error(
          `无法加载笔记数据：当前环境可能是 file:// 直接打开导致 fetch 失败。建议使用本地静态服务器打开，或确保已加载 js/notes_seed.js。原始错误：${String(
            err,
          )}`,
        );
      }
    }

    if (!resolved || typeof resolved !== "object" || !Array.isArray(resolved.pages)) {
      throw new Error("notes 数据结构不正确：缺少 pages 数组");
    }

    const pages = resolved.pages.slice().sort((a, b) => Number(a.page) - Number(b.page));
    const maxPage = pages.length ? Number(pages[pages.length - 1].page) : 0;
    const totalPages = Number(resolved.totalPages || maxPage || pages.length || 0);

    state.seed = resolved;
    state.pages = pages;
    state.totalPages = Number.isInteger(totalPages) ? totalPages : maxPage;
    buildIndexes();
    state.loaded = true;
    return state;
  }

  function getTotalPages() {
    assertLoaded();
    return state.totalPages;
  }

  function clampPage(pageNumber) {
    assertLoaded();
    const total = state.totalPages || 0;
    const n = Number(pageNumber);
    if (!Number.isFinite(n) || n <= 0) return 1;
    if (total && n > total) return total;
    return Math.floor(n);
  }

  function getPage(pageNumber) {
    assertLoaded();
    const n = clampPage(pageNumber);
    return state.pageByNumber[n] || null;
  }

  window.NotesService = {
    setSubject,
    getSubject,
    load,
    getTotalPages,
    clampPage,
    getPage,
    _state: state,
  };
})();
