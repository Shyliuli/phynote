(function () {
  const app = document.getElementById("notesApp");

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

  function parseSubjectFromLocation() {
    const url = new URL(window.location.href);
    const subject = url.searchParams.get("subject");
    return subject || "physics";
  }

  function buildAppLink(subject, path) {
    const normalized = String(path || "").trim().replace(/^\/+/, "");
    return `index.html#/${subject}/${normalized}`;
  }

  function parsePageFromLocation() {
    const url = new URL(window.location.href);
    const q = url.searchParams.get("page");
    if (q != null && q !== "") return Number(q);
    if (url.hash && url.hash.startsWith("#page=")) {
      return Number(url.hash.slice("#page=".length));
    }
    return 1;
  }

  function setPageInLocation(page, subject, { replace = false } = {}) {
    const url = new URL(window.location.href);
    if (subject) url.searchParams.set("subject", String(subject));
    url.searchParams.set("page", String(page));
    url.hash = "";
    if (replace) window.history.replaceState({}, "", url.toString());
    else window.history.pushState({}, "", url.toString());
  }

  function render(pageNumber, subject) {
    const totalPages = window.NotesService.getTotalPages();
    const page = window.NotesService.getPage(pageNumber);

    if (!page) {
      app.innerHTML = `
        <section class="page">
          <h1 class="page__title">未找到该页</h1>
          <p class="muted" style="margin: 0;">页码：${escapeHtml(pageNumber)}</p>
          <div style="margin-top: 12px;">
            <a class="btn" href="notes.html?subject=${escapeHtml(subject)}&page=1">回到第一页</a>
            <a class="btn btn--ghost" href="${buildAppLink(subject, "home")}">回到练习系统</a>
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
                  <a class="btn btn--ghost" href="${buildAppLink(subject, "home")}">回到练习系统</a>
                  ${
                    kpId
                      ? `<a class="btn" href="${buildAppLink(subject, `knowledge/${escapeHtml(
                          kpId,
                        )}`)}">查看该知识点</a>`
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
      const p = window.NotesService.clampPage(to);
      setPageInLocation(p, subject);
      render(p, subject);
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

  async function bootstrap() {
    const subject = parseSubjectFromLocation();
    try {
      if (!window.NotesService) throw new Error("NotesService 未加载");
      window.NotesService.setSubject(subject);
      await window.NotesService.load();
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

    const initialPage = window.NotesService.clampPage(parsePageFromLocation());
    setPageInLocation(initialPage, subject, { replace: true });
    render(initialPage, subject);

    window.addEventListener("popstate", () => {
      const page = window.NotesService.clampPage(parsePageFromLocation());
      render(page, subject);
    });
  }

  bootstrap();
})();
