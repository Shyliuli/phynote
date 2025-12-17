(function () {
  window.NotesPage = window.NotesPage || {};

  function escapeHtml(text) {
    return String(text == null ? "" : text)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function getRequestedPage(route) {
    const raw = route?.query?.page;
    if (raw == null || raw === "") return 1;
    const n = Number(raw);
    if (!Number.isFinite(n)) return 1;
    return n;
  }

  window.NotesPage.render = function renderNotes({ app, route }) {
    let totalPages = 0;
    try {
      totalPages = window.NotesService.getTotalPages();
    } catch (err) {
      app.innerHTML = `
        <section class="page">
          <h1 class="page__title">复习笔记加载失败</h1>
          <div class="card"><div class="card__body">
            <pre style="white-space: pre-wrap; margin: 0;">${escapeHtml(String(err))}</pre>
          </div></div>
        </section>
      `;
      return;
    }

    const pageNumber = window.NotesService.clampPage(getRequestedPage(route));
    const page = window.NotesService.getPage(pageNumber);
    if (!page) {
      app.innerHTML = `
        <section class="page">
          <h1 class="page__title">未找到笔记内容</h1>
          <p class="muted" style="margin: 0;">页码：${escapeHtml(pageNumber)}</p>
          <div style="margin-top: 12px;"><a class="btn" href="#/notes?page=1">回到第一页</a></div>
        </section>
      `;
      return;
    }

    const chapterName = page.chapterName || "章节";
    const kpName = page.knowledgePointName || "知识点";
    const kpId = page.knowledgePointId || "";

    const prevDisabled = pageNumber <= 1 ? "disabled" : "";
    const nextDisabled = totalPages && pageNumber >= totalPages ? "disabled" : "";

    app.innerHTML = `
      <section class="page">
        <h1 class="page__title">复习笔记</h1>
        <p class="muted" style="margin: 0;">说明：这里的“页码”是本系统的笔记定位编号（虚拟页码），与题目来源页码保持一致。</p>

        <div class="card">
          <div class="card__body notes-toolbar">
            <div class="notes-toolbar__left">
              <button class="btn btn--ghost" id="notesPrevBtn" ${prevDisabled}>上一页</button>
              <button class="btn btn--ghost" id="notesNextBtn" ${nextDisabled}>下一页</button>
            </div>
            <div class="notes-toolbar__jump">
              <div class="field" style="margin: 0; min-width: 160px;">
                <label for="notesPageInput">跳转页码</label>
                <input id="notesPageInput" type="number" min="1" max="${escapeHtml(totalPages)}" value="${escapeHtml(
                  pageNumber,
                )}" />
              </div>
              <button class="btn" id="notesJumpBtn" type="button">跳转</button>
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
                  ${
                    kpId
                      ? `<a class="btn btn--ghost" href="#/knowledge/${escapeHtml(kpId)}">查看该知识点</a>`
                      : ""
                  }
                </div>
              </div>
            </div>

            <pre class="notes-content">${escapeHtml(page.content || "")}</pre>

            <div class="notes-footer muted">第 ${escapeHtml(pageNumber)} 页</div>
          </div>
        </div>
      </section>
    `;

    function navigateTo(targetPage) {
      const p = window.NotesService.clampPage(targetPage);
      window.Router.navigate(`/notes?page=${p}`);
    }

    const prevBtn = document.getElementById("notesPrevBtn");
    const nextBtn = document.getElementById("notesNextBtn");
    const input = document.getElementById("notesPageInput");
    const jumpBtn = document.getElementById("notesJumpBtn");

    if (prevBtn) prevBtn.addEventListener("click", () => navigateTo(pageNumber - 1));
    if (nextBtn) nextBtn.addEventListener("click", () => navigateTo(pageNumber + 1));
    if (jumpBtn)
      jumpBtn.addEventListener("click", () => {
        const n = Number(input?.value);
        navigateTo(n);
      });
    if (input)
      input.addEventListener("keydown", (e) => {
        if (e.key !== "Enter") return;
        e.preventDefault();
        const n = Number(input.value);
        navigateTo(n);
      });
  };
})();
