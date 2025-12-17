(function () {
  const state = {
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

  function buildIndexes() {
    state.pageByNumber = {};
    for (const page of state.pages) {
      const n = Number(page.page);
      if (!Number.isInteger(n)) continue;
      state.pageByNumber[n] = page;
    }
  }

  async function load() {
    if (state.loaded) return state;

    let seed = window.__EM_NOTES_SEED__;
    if (!seed) {
      try {
        const res = await fetch("data/notes.json");
        seed = await res.json();
      } catch (err) {
        throw new Error(
          `无法加载笔记数据：当前环境可能是 file:// 直接打开导致 fetch 失败。建议使用本地静态服务器打开，或确保已加载 js/notes_seed.js。原始错误：${String(
            err,
          )}`,
        );
      }
    }

    if (!seed || typeof seed !== "object" || !Array.isArray(seed.pages)) {
      throw new Error("notes 数据结构不正确：缺少 pages 数组");
    }

    const pages = seed.pages.slice().sort((a, b) => Number(a.page) - Number(b.page));
    const maxPage = pages.length ? Number(pages[pages.length - 1].page) : 0;
    const totalPages = Number(seed.totalPages || maxPage || pages.length || 0);

    state.seed = seed;
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
    load,
    getTotalPages,
    clampPage,
    getPage,
    _state: state,
  };
})();
