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

  function isListLine(line) {
    const trimmed = String(line || "").trim();
    return /^-\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed);
  }

  function sanitizeContent(raw) {
    const text = String(raw == null ? "" : raw)
      .replaceAll("\r\n", "\n")
      .replaceAll("\r", "\n")
      .replaceAll("\t", " ")
      .replace(/[\uE000-\uF8FF]/g, "");

    const lines = text.split("\n").map((line) => {
      let next = line.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
      next = next.replace(/\s+$/g, "");
      const trimmed = next.trim();
      if (!trimmed) return "";
      if (trimmed === "-") return "";
      if (!trimmed.startsWith("|")) {
        next = next.replace(/\s{2,}/g, " ");
      }
      return next;
    });

    const filtered = [];
    let lastNonBlank = "";
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      if (!line.trim()) {
        let nextNonBlank = "";
        for (let j = i + 1; j < lines.length; j += 1) {
          if (lines[j].trim()) {
            nextNonBlank = lines[j];
            break;
          }
        }
        if (isListLine(lastNonBlank) && isListLine(nextNonBlank)) continue;
        filtered.push("");
        continue;
      }
      filtered.push(line);
      lastNonBlank = line;
    }

    const collapsed = [];
    let prevBlank = false;
    for (const line of filtered) {
      const isBlank = !line.trim();
      if (isBlank && prevBlank) continue;
      collapsed.push(line);
      prevBlank = isBlank;
    }

    return collapsed.join("\n").trim();
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

    const pages = resolved.pages
      .slice()
      .sort((a, b) => Number(a.page) - Number(b.page))
      .map((page) => ({ ...page, content: sanitizeContent(page.content) }));
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
