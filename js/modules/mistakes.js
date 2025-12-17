(function () {
  window.MistakesPage = window.MistakesPage || {};

  window.MistakesPage.render = function renderMistakes({ app }) {
    const chapters = window.DataService.getChapters();
    const allKnowledgePoints = window.DataService.listKnowledgePoints();

    function escapeHtml(text) {
      return String(text == null ? "" : text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
    }

    function makeSnippet(text, maxLen = 68) {
      const raw = String(text || "").trim().replaceAll(/\s+/g, " ");
      if (raw.length <= maxLen) return raw;
      return `${raw.slice(0, maxLen)}…`;
    }

    function buildSession(questionIds) {
      const ts = Date.now();
      return {
        id: `mistakes_${ts}_${Math.random().toString(16).slice(2)}`,
        createdAt: ts,
        startedAt: ts,
        finishedAt: null,
        currentIndex: 0,
        questionIds,
        answers: [],
        settings: { source: "mistakes", count: questionIds.length },
      };
    }

    function renderPage() {
      const mistakes = window.StorageService.getMistakes();
      const mistakeIds = mistakes.map((m) => m.questionId);
      const questions = mistakeIds.map((id) => window.DataService.getQuestionById(id)).filter(Boolean);

      app.innerHTML = `
        <section class="page">
          <h1 class="page__title">错题本</h1>

          <div class="card">
            <div class="card__body">
              <div class="form-grid">
                <div class="field">
                  <label for="mistakeChapterFilter">按章节筛选</label>
                  <select id="mistakeChapterFilter">
                    <option value="">全部章节</option>
                    ${chapters
                      .map((c) => `<option value="${c.id}">${escapeHtml(c.name)}</option>`)
                      .join("")}
                  </select>
                </div>
                <div class="field">
                  <label for="mistakeKpFilter">按知识点筛选</label>
                  <select id="mistakeKpFilter">
                    <option value="">全部知识点</option>
                    ${allKnowledgePoints
                      .map((kp) => `<option value="${kp.id}">${escapeHtml(kp.name)}</option>`)
                      .join("")}
                  </select>
                </div>
              </div>

              <div style="margin-top: 14px; display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
                <button class="btn" type="button" id="redoAllBtn" ${
                  questions.length ? "" : "disabled"
                }>全部重做（${questions.length}）</button>
                <button class="btn btn--ghost" type="button" id="clearAllBtn" ${
                  questions.length ? "" : "disabled"
                }>清空错题</button>
                <span class="muted" id="mistakeHint"></span>
              </div>
            </div>
          </div>

          <div id="mistakeList" style="margin-top: 14px;"></div>
        </section>
      `;

      const chapterFilter = document.getElementById("mistakeChapterFilter");
      const kpFilter = document.getElementById("mistakeKpFilter");
      const list = document.getElementById("mistakeList");
      const hint = document.getElementById("mistakeHint");
      const redoAllBtn = document.getElementById("redoAllBtn");
      const clearAllBtn = document.getElementById("clearAllBtn");

      function getFilteredQuestions() {
        const chId = String(chapterFilter.value || "");
        const kpId = String(kpFilter.value || "");
        return questions.filter((q) => {
          if (chId && q.chapterId !== chId) return false;
          if (kpId && !(q.knowledgePointIds || []).includes(kpId)) return false;
          return true;
        });
      }

      function renderList() {
        const filtered = getFilteredQuestions();
        hint.textContent = mistakes.length
          ? `共收藏 ${mistakes.length} 题，当前筛选 ${filtered.length} 题`
          : "当前没有收藏的错题";

        redoAllBtn.disabled = !filtered.length;

        if (!mistakes.length) {
          list.innerHTML = `
            <div class="card"><div class="card__body">
              <p class="muted" style="margin-top: 0;">错题本还是空的：在练习结果页点击“收藏错题”即可加入。</p>
              <a class="btn" href="#/practice">去练习中心</a>
            </div></div>
          `;
          return;
        }

        if (!filtered.length) {
          list.innerHTML = `
            <div class="card"><div class="card__body">
              <p class="muted" style="margin: 0;">当前筛选条件下没有错题。</p>
            </div></div>
          `;
          return;
        }

        list.innerHTML = filtered
          .map((q) => {
            const title = `${q.type}｜${q.difficulty || "—"}｜第${q.sourcePage || "—"}页`;
            const chapter = window.DataService.getChapterById(q.chapterId);
            const chapterName = chapter ? chapter.name : q.chapterId;
            return `
              <div class="card" style="margin-top: 12px;">
                <div class="card__body">
                  <div class="muted" style="font-size: 12px; font-weight: 800;">${escapeHtml(
                    title,
                  )}</div>
                  <div class="muted" style="font-size: 12px; margin-top: 6px;">章节：${escapeHtml(
                    chapterName,
                  )}</div>
                  <div style="margin-top: 10px; white-space: pre-wrap;">${escapeHtml(
                    makeSnippet(q.content),
                  )}</div>
                  <div style="margin-top: 10px; display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
                    ${
                      Number.isInteger(q.sourcePage)
                        ? `<a class="btn btn--ghost" href="notes.html?page=${escapeHtml(q.sourcePage)}">看笔记</a>`
                        : ""
                    }
                    <button class="btn btn--ghost" type="button" data-remove-mistake="${escapeHtml(
                      q.id,
                    )}">移除</button>
                    <button class="btn" type="button" data-redo-one="${escapeHtml(q.id)}">重做此题</button>
                  </div>
                </div>
              </div>
            `;
          })
          .join("");

        const removeButtons = list.querySelectorAll("button[data-remove-mistake]");
        for (const btn of removeButtons) {
          btn.addEventListener("click", () => {
            const qid = btn.getAttribute("data-remove-mistake");
            if (!qid) return;
            window.StorageService.removeMistake(qid);
            renderPage();
          });
        }

        const redoButtons = list.querySelectorAll("button[data-redo-one]");
        for (const btn of redoButtons) {
          btn.addEventListener("click", () => {
            const qid = btn.getAttribute("data-redo-one");
            if (!qid) return;
            const session = buildSession([qid]);
            window.StorageService.setSession(session);
            window.Router.navigate("/practice/session");
          });
        }
      }

      function redoAll() {
        const filtered = getFilteredQuestions();
        if (!filtered.length) return;
        const session = buildSession(filtered.map((q) => q.id));
        window.StorageService.setSession(session);
        window.Router.navigate("/practice/session");
      }

      function clearAll() {
        window.StorageService.clearMistakes();
        renderPage();
      }

      chapterFilter.addEventListener("change", renderList);
      kpFilter.addEventListener("change", renderList);
      redoAllBtn.addEventListener("click", redoAll);
      clearAllBtn.addEventListener("click", clearAll);

      renderList();
    }

    renderPage();
  };
})();
