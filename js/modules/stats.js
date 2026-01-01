(function () {
  window.StatsPage = window.StatsPage || {};

  window.StatsPage.render = function renderStats({ app, subject, buildSubjectPath }) {
    const chapters = window.DataService.getChapters();
    const stats = window.StorageService.calculateStats();
    const summary = stats.summary;

    function escapeHtml(text) {
      return String(text == null ? "" : text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
    }

    function percent(value) {
      return `${Math.round(Number(value || 0) * 100)}%`;
    }

    function daysCount() {
      return Object.keys(stats.byDay || {}).length;
    }

    function renderChapterMastery() {
      const rows = chapters
        .map((ch) => {
          const bucket = stats.byChapter[ch.id] || { total: 0, correct: 0, accuracy: 0 };
          const p = Math.round(bucket.accuracy * 100);
          const meta = bucket.total ? `正确 ${bucket.correct}/${bucket.total}` : "暂无练习";
          return `
            <div class="progress-row">
              <div class="progress-row__main">
                <div style="font-weight: 900;">${escapeHtml(ch.name)}</div>
                <div class="muted" style="font-size: 12px; margin-top: 2px;">${escapeHtml(meta)}</div>
              </div>
              <div class="progress-row__bar">
                <div class="bar"><div class="bar__fill" style="width:${p}%;"></div></div>
                <div class="muted" style="font-size: 12px; font-weight: 800; min-width: 46px; text-align: right;">${p}%</div>
              </div>
              <a class="btn btn--ghost" href="${buildSubjectPath(
                subject,
                `practice?chapterId=${escapeHtml(ch.id)}`,
              )}">练习</a>
            </div>
          `;
        })
        .join("");

      return rows;
    }

    function renderWeakKnowledgePoints() {
      const weak = window.StorageService.getWeakKnowledgePoints({ topN: 5, minAttempts: 1 });
      if (!weak.length) {
        return `<p class="muted" style="margin: 0;">暂无足够数据识别薄弱知识点，先去练几题吧。</p>`;
      }

      return weak
        .map((row) => {
          const kp = window.DataService.getKnowledgePointById(row.knowledgePointId);
          const name = kp ? kp.name : row.knowledgePointId;
          const p = Math.round(row.accuracy * 100);
          return `
            <div class="card" style="margin-top: 12px; border-color: rgba(220, 38, 38, 0.22);">
              <div class="card__body" style="display:flex; gap:12px; align-items:center; justify-content:space-between; flex-wrap:wrap;">
                <div>
                  <div style="font-weight: 900;">${escapeHtml(name)}</div>
                  <div class="muted" style="font-size: 12px; margin-top: 2px;">正确 ${row.correct}/${row.total}（${p}%）</div>
                </div>
                <a class="btn" href="${buildSubjectPath(
                  subject,
                  `knowledge/${escapeHtml(row.knowledgePointId)}`,
                )}">查看详情</a>
              </div>
            </div>
          `;
        })
        .join("");
    }

    function renderTypeStats() {
      const entries = Object.entries(stats.byType || {});
      if (!entries.length) {
        return `<p class="muted" style="margin: 0;">暂无题型数据。</p>`;
      }

      const rows = entries
        .map(([type, bucket]) => ({
          type,
          total: bucket.total,
          correct: bucket.correct,
          accuracy: bucket.accuracy,
        }))
        .sort((a, b) => b.total - a.total);

      return `
        <div class="grid">
          ${rows
            .map((row) => {
              const p = Math.round(row.accuracy * 100);
              return `
                <div class="card">
                  <div class="card__body">
                    <div style="font-weight: 900;">${escapeHtml(row.type)}</div>
                    <div class="muted" style="font-size: 12px; margin-top: 2px;">正确 ${row.correct}/${row.total}</div>
                    <div class="bar" style="margin-top: 10px;"><div class="bar__fill" style="width:${p}%;"></div></div>
                    <div class="muted" style="font-size: 12px; font-weight: 800; margin-top: 8px;">正确率：${p}%</div>
                  </div>
                </div>
              `;
            })
            .join("")}
        </div>
      `;
    }

    function renderDailyTrend() {
      const byDay = stats.byDay || {};
      const today = new Date();
      const days = [];
      for (let i = 6; i >= 0; i -= 1) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        const key = `${y}-${m}-${dd}`;
        const bucket = byDay[key] || { total: 0, correct: 0, accuracy: 0 };
        days.push({ key, ...bucket });
      }

      const maxTotal = Math.max(1, ...days.map((d) => d.total));
      const bars = days
        .map((d) => {
          const h = Math.round((d.total / maxTotal) * 100);
          const p = Math.round(d.accuracy * 100);
          const title = `${d.key}：${d.total}题，${p}%`;
          const color = d.total ? `rgba(37, 99, 235, ${0.2 + d.accuracy * 0.75})` : "rgba(16,24,40,0.06)";
          return `
            <div class="trend__item" title="${escapeHtml(title)}">
              <div class="trend__bar" style="height:${h}%; background:${color};"></div>
              <div class="trend__label">${escapeHtml(d.key.slice(5))}</div>
            </div>
          `;
        })
        .join("");

      return `
        <div class="trend">
          ${bars}
        </div>
        <p class="muted" style="margin: 10px 0 0;">提示：柱高表示练习量，颜色深浅表示正确率（鼠标悬停查看数据）。</p>
      `;
    }

    app.innerHTML = `
      <section class="page">
        <h1 class="page__title">统计分析</h1>

        <div class="grid">
          <div class="card"><div class="card__body">
            <div class="muted" style="font-size: 12px; font-weight: 900;">总练习题数</div>
            <div style="font-size: 26px; font-weight: 900; margin-top: 6px;">${summary.total}</div>
          </div></div>
          <div class="card"><div class="card__body">
            <div class="muted" style="font-size: 12px; font-weight: 900;">总正确率</div>
            <div style="font-size: 26px; font-weight: 900; margin-top: 6px;">${percent(summary.accuracy)}</div>
          </div></div>
          <div class="card"><div class="card__body">
            <div class="muted" style="font-size: 12px; font-weight: 900;">练习天数</div>
            <div style="font-size: 26px; font-weight: 900; margin-top: 6px;">${daysCount()}</div>
          </div></div>
        </div>

        <div style="margin-top: 14px;">
          <h2 style="margin: 0 0 10px; font-size: 16px;">章节掌握度</h2>
          ${renderChapterMastery()}
        </div>

        <div style="margin-top: 14px;">
          <h2 style="margin: 0 0 10px; font-size: 16px;">薄弱知识点 TOP5</h2>
          ${renderWeakKnowledgePoints()}
        </div>

        <div style="margin-top: 14px;">
          <h2 style="margin: 0 0 10px; font-size: 16px;">题型分布</h2>
          ${renderTypeStats()}
        </div>

        <div style="margin-top: 14px;">
          <h2 style="margin: 0 0 10px; font-size: 16px;">近7天趋势</h2>
          ${renderDailyTrend()}
        </div>
      </section>
    `;
  };
})();
