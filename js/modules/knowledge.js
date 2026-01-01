(function () {
  window.KnowledgePage = window.KnowledgePage || {};

  window.KnowledgePage.renderList = function renderKnowledgeList({ app, subject, buildSubjectPath }) {
    const chapters = window.DataService.getChapters();

    app.innerHTML = `
      <section class="page">
        <h1 class="page__title">知识点库</h1>
        <div class="card">
          <div class="card__body">
            <div class="field">
              <label for="kpSearchInput">搜索知识点</label>
              <input id="kpSearchInput" type="text" placeholder="输入关键词（名称/定义）" />
            </div>
          </div>
        </div>

        <div id="kpListContainer" style="margin-top: 14px;"></div>
      </section>
    `;

    const input = document.getElementById("kpSearchInput");
    const container = document.getElementById("kpListContainer");

    function escapeHtml(text) {
      return String(text == null ? "" : text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
    }

    function makeSnippet(text, maxLen = 54) {
      const raw = String(text || "").trim().replaceAll(/\s+/g, " ");
      if (raw.length <= maxLen) return raw;
      return `${raw.slice(0, maxLen)}…`;
    }

    function renderList(queryText) {
      const query = String(queryText || "").trim().toLowerCase();

      const groups = chapters
        .map((ch) => {
          const items = (ch.knowledgePoints || []).filter((kp) => {
            if (!query) return true;
            const name = String(kp.name || "").toLowerCase();
            const def = String(kp.definition || "").toLowerCase();
            return name.includes(query) || def.includes(query);
          });
          return { chapter: ch, items };
        })
        .filter((g) => g.items.length);

      if (!groups.length) {
        container.innerHTML = `
          <div class="card"><div class="card__body">
            <p class="muted" style="margin: 0;">没有匹配的知识点，请换个关键词试试。</p>
          </div></div>
        `;
        return;
      }

      container.innerHTML = groups
        .map(({ chapter, items }) => {
          const cards = items
            .map((kp) => {
              const count = window.DataService.getQuestionCountByKnowledgePoint(kp.id);
              const meta = [
                kp.pageRange ? `页码：${kp.pageRange}` : null,
                `相关题目：${count}`,
              ]
                .filter(Boolean)
                .join("｜");

              return `
                <a class="card card--link" href="${buildSubjectPath(subject, `knowledge/${kp.id}`)}">
                  <div class="card__body">
                    <div class="card__row">
                      <div class="card__icon" style="background: rgba(124, 58, 237, 0.12); color: #7c3aed;">知</div>
                      <div class="card__col">
                        <h3 class="card__title">${escapeHtml(kp.name)}</h3>
                        <p class="card__meta">${escapeHtml(makeSnippet(kp.definition))}</p>
                        <p class="card__meta" style="margin-top: 8px;">${escapeHtml(meta)}</p>
                      </div>
                    </div>
                  </div>
                </a>
              `;
            })
            .join("");

          return `
            <div style="margin-top: 14px;">
              <h2 style="margin: 0 0 10px; font-size: 16px;">${escapeHtml(
                chapter.name,
              )} <span class="muted" style="font-weight: 700;">（${escapeHtml(chapter.pageRange)}）</span></h2>
              <div class="grid">${cards}</div>
            </div>
          `;
        })
        .join("");
    }

    input.addEventListener("input", (e) => renderList(e.target.value));
    renderList("");
  };

  window.KnowledgePage.renderDetail = function renderKnowledgeDetail({
    app,
    route,
    subject,
    buildSubjectPath,
    buildNotesUrl,
  }) {
    const id = route?.params?.knowledgePointId || "";
    const kp = id ? window.DataService.getKnowledgePointById(id) : null;

    function escapeHtml(text) {
      return String(text == null ? "" : text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
    }

    if (!kp) {
      app.innerHTML = `
        <section class="page">
          <h1 class="page__title">知识点不存在</h1>
          <p class="muted" style="margin: 0;">知识点ID：${escapeHtml(id)}</p>
          <div style="margin-top: 12px;"><a class="btn" href="${buildSubjectPath(subject, "knowledge")}">返回列表</a></div>
        </section>
      `;
      return;
    }

    const chapter = kp.chapterId ? window.DataService.getChapterById(kp.chapterId) : null;
    const relatedCount = window.DataService.getQuestionCountByKnowledgePoint(kp.id);
    const chapterName = chapter ? chapter.name : "章节";
    const range = window.DataService.parsePageRange(kp.pageRange);
    const startPage = range ? range.start : null;

    const keyPointsHtml = (kp.keyPoints || [])
      .map((p) => `<li>${escapeHtml(p)}</li>`)
      .join("");
    const misconceptionsHtml = (kp.misconceptions || [])
      .map((p) => `<li>${escapeHtml(p)}</li>`)
      .join("");

    app.innerHTML = `
      <section class="page">
        <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
          <a class="btn btn--ghost" href="${buildSubjectPath(subject, "knowledge")}">返回</a>
          <span class="muted">${escapeHtml(chapterName)}</span>
        </div>

        <h1 class="page__title" style="margin-top: 12px;">${escapeHtml(kp.name)}</h1>
        <div class="pills" style="margin-top: 8px;">
          ${
            startPage
              ? `<a class="pill pill--ghost" href="${buildNotesUrl(
                  subject,
                  startPage,
                )}" title="打开对应笔记页">页码：${escapeHtml(kp.pageRange || "—")}</a>`
              : `<span class="pill pill--ghost">页码：${escapeHtml(kp.pageRange || "—")}</span>`
          }
          <span class="pill pill--ghost">相关题目：${relatedCount}</span>
        </div>

        <div class="card" style="margin-top: 14px;">
          <div class="card__body">
            <h2 style="margin: 0 0 10px; font-size: 16px;">定义</h2>
            <div style="white-space: pre-wrap;">${escapeHtml(kp.definition || "")}</div>
          </div>
        </div>

        <div class="grid" style="margin-top: 14px;">
          <div class="card">
            <div class="card__body">
              <h2 style="margin: 0 0 10px; font-size: 16px;">核心要点</h2>
              <ul style="margin: 0; padding-left: 18px;">${keyPointsHtml}</ul>
            </div>
          </div>
          <div class="card">
            <div class="card__body">
              <h2 style="margin: 0 0 10px; font-size: 16px;">常见误区</h2>
              <ul style="margin: 0; padding-left: 18px;">${misconceptionsHtml}</ul>
            </div>
          </div>
        </div>

        <div class="card" style="margin-top: 14px;">
          <div class="card__body" style="display:flex; gap:10px; flex-wrap:wrap; align-items:center; justify-content:space-between;">
            <div class="muted">基于该知识点的题目：${relatedCount} 道</div>
            <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
              ${
                startPage ? `<a class="btn btn--ghost" href="${buildNotesUrl(subject, startPage)}">查看笔记</a>` : ""
              }
              <a class="btn" href="${buildSubjectPath(
                subject,
                `practice?chapterId=${escapeHtml(kp.chapterId || "")}&kp=${escapeHtml(kp.id)}`,
              )}">开始练习</a>
            </div>
          </div>
        </div>
      </section>
    `;
  };
})();
