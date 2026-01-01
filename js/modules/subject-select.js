(function () {
  window.SubjectSelectPage = window.SubjectSelectPage || {};

  window.SubjectSelectPage.render = function renderSubjectSelect({ app }) {
    app.innerHTML = `
      <section class="page">
        <h1 class="page__title">请选择学科</h1>
        <p class="muted" style="margin: 0;">进入对应学科后，知识点、题库与学习进度将独立保存。</p>

        <div class="grid" style="margin-top: 16px;">
          <a class="card card--link" href="#/physics/home">
            <div class="card__body">
              <div class="card__row">
                <div class="card__icon" style="background: rgba(37, 99, 235, 0.12); color: var(--primary);">物</div>
                <div class="card__col">
                  <h3 class="card__title">物理</h3>
                  <p class="card__meta">大学物理·电磁学。适合进行系统刷题与知识点复习。</p>
                </div>
              </div>
            </div>
          </a>

          <a class="card card--link" href="#/digital-circuit/home">
            <div class="card__body">
              <div class="card__row">
                <div class="card__icon" style="background: rgba(16, 185, 129, 0.16); color: #059669;">电</div>
                <div class="card__col">
                  <h3 class="card__title">数字电路</h3>
                  <p class="card__meta">数字电路与系统设计。覆盖基础逻辑、组合/时序电路等内容。</p>
                </div>
              </div>
            </div>
          </a>
        </div>
      </section>
    `;
  };
})();
