(function () {
  window.HomePage = window.HomePage || {};

  window.HomePage.render = function renderHome({ app }) {
    const courseName = (() => {
      try {
        return window.DataService.getCourseName();
      } catch (_err) {
        return "课程";
      }
    })();

    app.innerHTML = `
      <section class="page">
        <h1 class="page__title">在线学习系统</h1>
        <p class="muted" style="margin: 0;">课程：${courseName}</p>

        <div class="grid" style="margin-top: 8px;">
          <a class="card card--link" href="#/practice">
            <div class="card__body">
              <div class="card__row">
                <div class="card__icon" style="background: var(--primary-weak); color: var(--primary);">练</div>
                <div class="card__col">
                  <h3 class="card__title">练习中心</h3>
                  <p class="card__meta">按章节/知识点/题型组卷，开始刷题。</p>
                </div>
              </div>
            </div>
          </a>

          <a class="card card--link" href="#/knowledge">
            <div class="card__body">
              <div class="card__row">
                <div class="card__icon" style="background: rgba(124, 58, 237, 0.12); color: #7c3aed;">知</div>
                <div class="card__col">
                  <h3 class="card__title">知识点库</h3>
                  <p class="card__meta">按章节查看知识点，快速定位薄弱项。</p>
                </div>
              </div>
            </div>
          </a>

          <a class="card card--link" href="notes.html">
            <div class="card__body">
              <div class="card__row">
                <div class="card__icon" style="background: rgba(37, 99, 235, 0.12); color: var(--primary);">笔</div>
                <div class="card__col">
                  <h3 class="card__title">复习笔记</h3>
                  <p class="card__meta">按页浏览学习笔记，页码与题目来源一致。</p>
                </div>
              </div>
            </div>
          </a>

          <a class="card card--link" href="#/mistakes">
            <div class="card__body">
              <div class="card__row">
                <div class="card__icon" style="background: rgba(220, 38, 38, 0.12); color: var(--danger);">错</div>
                <div class="card__col">
                  <h3 class="card__title">错题本</h3>
                  <p class="card__meta">收藏错题，集中复习与重做。</p>
                </div>
              </div>
            </div>
          </a>

          <a class="card card--link" href="#/progress">
            <div class="card__body">
              <div class="card__row">
                <div class="card__icon" style="background: rgba(22, 163, 74, 0.12); color: var(--success);">进</div>
                <div class="card__col">
                  <h3 class="card__title">学习进度</h3>
                  <p class="card__meta">查看章节与知识点掌握情况。</p>
                </div>
              </div>
            </div>
          </a>

          <a class="card card--link" href="#/stats">
            <div class="card__body">
              <div class="card__row">
                <div class="card__icon" style="background: rgba(245, 158, 11, 0.14); color: var(--warning);">统</div>
                <div class="card__col">
                  <h3 class="card__title">统计分析</h3>
                  <p class="card__meta">正确率、题型分布、近7天趋势。</p>
                </div>
              </div>
            </div>
          </a>
        </div>
      </section>
    `;
  };
})();
