(function () {
  window.ProgressPage = window.ProgressPage || {};

  window.ProgressPage.render = function renderProgress({ app }) {
    const viewFromQuery = window.Router.getCurrentRoute()?.query?.view;
    let activeView = viewFromQuery === "kp" ? "kp" : "page";

    function escapeHtml(text) {
      return String(text == null ? "" : text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
    }

    function getAttemptedQuestionIds() {
      const attempts = window.StorageService.getAttempts();
      const ids = new Set();
      for (const a of attempts) ids.add(a.questionId);
      return ids;
    }

    function buildPageStats() {
      const chapters = window.DataService.getChapters();
      const attempted = getAttemptedQuestionIds();

      const byChapter = {};

      for (const ch of chapters) {
        const range = window.DataService.parsePageRange(ch.pageRange) || { start: 1, end: 1 };
        const totalByPage = {};
        const attemptedByPage = {};

        const questions = window.DataService.listQuestions({ chapterId: ch.id });
        for (const q of questions) {
          const p = Number(q.sourcePage || 0);
          if (!p) continue;
          totalByPage[p] = (totalByPage[p] || 0) + 1;
          if (attempted.has(q.id)) attemptedByPage[p] = (attemptedByPage[p] || 0) + 1;
        }

        byChapter[ch.id] = {
          chapter: ch,
          range,
          totalByPage,
          attemptedByPage,
        };
      }

      return byChapter;
    }

    function renderTabs() {
      return `
        <div class="tabs">
          <button class="tab" type="button" data-view="page" aria-selected="${activeView === "page"}">页码视图</button>
          <button class="tab" type="button" data-view="kp" aria-selected="${activeView === "kp"}">知识点视图</button>
        </div>
      `;
    }

    function renderPageView() {
      const pageStats = buildPageStats();
      const chapters = window.DataService.getChapters();

      const sections = chapters
        .map((ch) => {
          const stat = pageStats[ch.id];
          const { range, totalByPage, attemptedByPage } = stat;

          const cells = [];
          for (let p = range.start; p <= range.end; p += 1) {
            const total = totalByPage[p] || 0;
            const done = attemptedByPage[p] || 0;
            const ratio = total ? done / total : 0;
            const alpha = total ? 0.15 + ratio * 0.75 : 0.06;
            const bg = `rgba(37, 99, 235, ${alpha.toFixed(3)})`;

            const title = total ? `第${p}页：已做 ${done}/${total}` : `第${p}页：无题目`;

            cells.push(`
              <div class="page-cell" title="${escapeHtml(title)}" style="background:${bg};">
                <span class="page-cell__text">${p}</span>
              </div>
            `);
          }

          return `
            <div style="margin-top: 14px;">
              <h2 style="margin: 0 0 10px; font-size: 16px;">${escapeHtml(
                ch.name,
              )} <span class="muted" style="font-weight: 700;">（${escapeHtml(ch.pageRange)}）</span></h2>
              <div class="page-grid">${cells.join("")}</div>
            </div>
          `;
        })
        .join("");

      return sections;
    }

    function renderKnowledgePointView() {
      const stats = window.StorageService.calculateStats();
      const rows = window.DataService
        .listKnowledgePoints()
        .map((kp) => {
          const bucket = stats.byKnowledgePoint[kp.id] || { total: 0, correct: 0, accuracy: 0 };
          return {
            kp,
            total: bucket.total,
            correct: bucket.correct,
            accuracy: bucket.accuracy,
          };
        })
        .sort((a, b) => {
          if (a.accuracy !== b.accuracy) return b.accuracy - a.accuracy;
          return b.total - a.total;
        });

      const list = rows
        .map((row) => {
          const percent = Math.round(row.accuracy * 100);
          const width = `${percent}%`;
          const meta = row.total ? `正确 ${row.correct}/${row.total}` : "暂无练习记录";
          const warn = row.total && row.accuracy < 0.6 ? "progress-row--weak" : "";

          return `
            <div class="progress-row ${warn}">
              <div class="progress-row__main">
                <div style="font-weight: 800;">${escapeHtml(row.kp.name)}</div>
                <div class="muted" style="font-size: 12px; margin-top: 2px;">${escapeHtml(meta)}</div>
              </div>
              <div class="progress-row__bar">
                <div class="bar">
                  <div class="bar__fill" style="width:${width};"></div>
                </div>
                <div class="muted" style="font-size: 12px; font-weight: 800; min-width: 46px; text-align: right;">${percent}%</div>
              </div>
              <a class="btn btn--ghost" href="#/knowledge/${escapeHtml(row.kp.id)}">详情</a>
            </div>
          `;
        })
        .join("");

      return `
        <div style="margin-top: 14px;">
          <div class="card"><div class="card__body">
            <p class="muted" style="margin: 0;">按知识点正确率排序（练习越多越准确），可点击“详情”查看知识点内容。</p>
          </div></div>
          <div style="margin-top: 12px;">${list}</div>
        </div>
      `;
    }

    function render() {
      app.innerHTML = `
        <section class="page">
          <h1 class="page__title">学习进度</h1>
          ${renderTabs()}
          ${activeView === "page" ? renderPageView() : renderKnowledgePointView()}
        </section>
      `;

      const tabs = app.querySelectorAll("button[data-view]");
      for (const tab of tabs) {
        tab.addEventListener("click", () => {
          const view = tab.getAttribute("data-view");
          if (!view) return;
          activeView = view;
          render();
        });
      }
    }

    render();
  };
})();
