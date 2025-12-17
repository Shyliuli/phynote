(function () {
  const app = document.getElementById("notesApp");
  const seed = window.__EM_NOTES_SEED__;

  function escapeHtml(text) {
    return String(text == null ? "" : text)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  if (!app) {
    throw new Error("notesApp 容器不存在");
  }

  if (!seed || !Array.isArray(seed.pages) || !seed.pages.length) {
    app.innerHTML = `
      <section class="page">
        <h1 class="page__title">复习笔记加载失败</h1>
        <div class="card"><div class="card__body">
          <p class="muted" style="margin: 0;">未找到内嵌笔记数据：请确认已加载 <code>js/notes_seed.js</code>。</p>
        </div></div>
      </section>
    `;
    return;
  }

  const totalPages = Number(seed.totalPages || seed.pages.length || 0) || 0;
  const pageByNumber = {};
  for (const p of seed.pages) {
    const n = Number(p.page);
    if (Number.isInteger(n)) pageByNumber[n] = p;
  }

  function clampPage(n) {
    const num = Math.floor(Number(n));
    if (!Number.isFinite(num) || num <= 0) return 1;
    if (totalPages && num > totalPages) return totalPages;
    return num;
  }

  function parsePageFromLocation() {
    const url = new URL(window.location.href);
    const q = url.searchParams.get("page");
    if (q != null && q !== "") return clampPage(q);
    if (url.hash && url.hash.startsWith("#page=")) {
      return clampPage(url.hash.slice("#page=".length));
    }
    return 1;
  }

  function setPageInLocation(page, { replace = false } = {}) {
    const url = new URL(window.location.href);
    url.searchParams.set("page", String(page));
    url.hash = "";
    if (replace) window.history.replaceState({}, "", url.toString());
    else window.history.pushState({}, "", url.toString());
  }

  function render(pageNumber) {
    const page = pageByNumber[pageNumber];
    if (!page) {
      app.innerHTML = `
        <section class="page">
          <h1 class="page__title">未找到该页</h1>
          <p class="muted" style="margin: 0;">页码：${escapeHtml(pageNumber)}</p>
          <div style="margin-top: 12px;">
            <a class="btn" href="notes.html?page=1">回到第一页</a>
            <a class="btn btn--ghost" href="index.html#/">回到练习系统</a>
          </div>
        </section>
      `;
      return;
    }

    const chapterName = page.chapterName || "章节";
    const kpName = page.knowledgePointName || "知识点";
    const kpId = page.knowledgePointId || "";

    const prevDisabled = pageNumber <= 1 ? "disabled" : "";
    const nextDisabled = totalPages && pageNumber >= totalPages ? "disabled" : "";

    const rendered = window.NotesRenderer?.renderMarkdown
      ? window.NotesRenderer.renderMarkdown(page.content || "")
      : `<pre style="white-space: pre-wrap; margin: 0;">${escapeHtml(page.content || "")}</pre>`;

    document.title = `复习笔记｜第${pageNumber}页`;

    app.innerHTML = `
      <section class="page">
        <h1 class="page__title">复习笔记</h1>
        <p class="muted" style="margin: 0;">说明：这里的“页码”是本系统的笔记定位编号，与题目来源页码/知识点页码完全一致。</p>

        <div class="card">
          <div class="card__body notes-toolbar">
            <div class="notes-toolbar__left">
              <button class="btn btn--ghost" id="prevBtn" ${prevDisabled}>上一页</button>
              <button class="btn btn--ghost" id="nextBtn" ${nextDisabled}>下一页</button>
            </div>
            <div class="notes-toolbar__jump">
              <div class="field" style="margin: 0; min-width: 160px;">
                <label for="pageInput">跳转页码</label>
                <input id="pageInput" type="number" min="1" max="${escapeHtml(totalPages)}" value="${escapeHtml(
      pageNumber,
    )}" />
              </div>
              <button class="btn" id="jumpBtn" type="button">跳转</button>
            </div>
            <div class="notes-toolbar__right">
              <div class="muted" style="font-weight: 800;">第 ${escapeHtml(pageNumber)} / ${escapeHtml(
      totalPages,
    )} 页</div>
            </div>
          </div>
        </div>

        <div class="card notes-paper">
          <div class="card__body">
            <div class="notes-meta">
              <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center; justify-content:space-between;">
                <div>
                  <div class="notes-meta__chapter">${escapeHtml(chapterName)}</div>
                  <div class="muted" style="margin-top: 4px;">${escapeHtml(kpName)}</div>
                </div>
                <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
                  <a class="btn btn--ghost" href="index.html#/">回到练习系统</a>
                  ${
                    kpId
                      ? `<a class="btn" href="index.html#/knowledge/${escapeHtml(kpId)}">查看该知识点</a>`
                      : ""
                  }
                </div>
              </div>
            </div>

            <div class="notes-content">${rendered}</div>

            <div class="notes-footer muted">第 ${escapeHtml(pageNumber)} 页</div>
          </div>
        </div>
      </section>
    `;

    function go(to) {
      const p = clampPage(to);
      setPageInLocation(p);
      render(p);
    }

    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const pageInput = document.getElementById("pageInput");
    const jumpBtn = document.getElementById("jumpBtn");

    if (prevBtn) prevBtn.addEventListener("click", () => go(pageNumber - 1));
    if (nextBtn) nextBtn.addEventListener("click", () => go(pageNumber + 1));
    if (jumpBtn)
      jumpBtn.addEventListener("click", () => {
        go(Number(pageInput?.value));
      });
    if (pageInput)
      pageInput.addEventListener("keydown", (e) => {
        if (e.key !== "Enter") return;
        e.preventDefault();
        go(Number(pageInput.value));
      });
  }

  window.addEventListener("popstate", () => {
    const page = parsePageFromLocation();
    render(page);
  });

  const initialPage = parsePageFromLocation();
  setPageInLocation(initialPage, { replace: true });
  render(initialPage);
})();

