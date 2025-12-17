(function () {
  const app = document.getElementById("app");
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");

  nav.innerHTML = `
    <a href="#/practice">练习中心</a>
    <a href="#/knowledge">知识点库</a>
    <a href="notes.html">复习笔记</a>
    <a href="#/mistakes">错题本</a>
    <a href="#/progress">学习进度</a>
    <a href="#/stats">统计分析</a>
  `;

  function closeMobileNav() {
    document.body.classList.remove("nav-open");
    if (navToggle) navToggle.setAttribute("aria-expanded", "false");
  }

  function toggleMobileNav() {
    const next = !document.body.classList.contains("nav-open");
    if (next) document.body.classList.add("nav-open");
    else document.body.classList.remove("nav-open");
    if (navToggle) navToggle.setAttribute("aria-expanded", String(next));
  }

  if (navToggle) {
    navToggle.addEventListener("click", (e) => {
      e.preventDefault();
      toggleMobileNav();
    });
  }

  nav.addEventListener("click", (e) => {
    const target = e.target;
    if (target && target.closest && target.closest("a")) closeMobileNav();
  });

  document.addEventListener("click", (e) => {
    if (!document.body.classList.contains("nav-open")) return;
    const target = e.target;
    const clickedInNav = target && target.closest && target.closest("#nav");
    const clickedToggle = target && target.closest && target.closest("#navToggle");
    if (!clickedInNav && !clickedToggle) closeMobileNav();
  });

  function animateApp() {
    app.classList.remove("app-enter");
    void app.offsetWidth;
    app.classList.add("app-enter");
  }

  function renderLoading() {
    app.innerHTML = `
      <section class="page">
        <h1 class="page__title">正在加载数据…</h1>
        <p class="muted" style="margin: 0;">首次加载会在本地构建索引，稍等片刻。</p>
      </section>
    `;
  }

  function renderError(err) {
    app.innerHTML = `
      <section class="page">
        <h1 class="page__title">加载失败</h1>
        <div class="card"><div class="card__body">
          <p class="muted" style="margin-top: 0;">数据未能成功加载，通常发生在直接用 file:// 打开且未提供内嵌数据时。</p>
          <pre style="white-space: pre-wrap; margin: 0;">${String(err)}</pre>
        </div></div>
      </section>
    `;
  }

  function renderNotFound(route) {
    app.innerHTML = `
      <section class="page">
        <h1 class="page__title">页面不存在</h1>
        <p class="muted" style="margin: 0;">当前路径：${route.path}</p>
        <div><button class="btn" id="goHomeBtn">返回首页</button></div>
      </section>
    `;
    const btn = document.getElementById("goHomeBtn");
    if (btn) btn.addEventListener("click", () => window.Router.navigate("/"));
  }

  function renderRoute(route) {
    if (!route || !route.name) return renderNotFound({ path: "" });

    const ctx = {
      app,
      route,
      DataService: window.DataService,
      StorageService: window.StorageService,
    };

    if (route.name === "notes-redirect") {
      const raw = route?.query?.page;
      const page = raw != null && raw !== "" ? String(raw) : "";
      window.location.href = page ? `notes.html?page=${encodeURIComponent(page)}` : "notes.html";
      return;
    }

    if (route.name === "home") return window.HomePage.render?.(ctx);
    if (route.name === "practice") return window.PracticePage.renderSettings?.(ctx);
    if (route.name === "practice-session") return window.PracticePage.renderSession?.(ctx);
    if (route.name === "practice-result") return window.PracticePage.renderResult?.(ctx);
    if (route.name === "knowledge") return window.KnowledgePage.renderList?.(ctx);
    if (route.name === "knowledge-detail") return window.KnowledgePage.renderDetail?.(ctx);
    if (route.name === "mistakes") return window.MistakesPage.render?.(ctx);
    if (route.name === "progress") return window.ProgressPage.render?.(ctx);
    if (route.name === "stats") return window.StatsPage.render?.(ctx);

    return renderNotFound(route);
  }

  function getNavPathByRoute(route) {
    if (!route || !route.name) return null;
    if (route.name.startsWith("practice")) return "/practice";
    if (route.name.startsWith("knowledge")) return "/knowledge";
    if (route.name === "mistakes") return "/mistakes";
    if (route.name === "progress") return "/progress";
    if (route.name === "stats") return "/stats";
    return null;
  }

  function updateNavActive(route) {
    const activePath = getNavPathByRoute(route);
    const links = nav.querySelectorAll("a[href^=\"#/\"]");
    for (const link of links) {
      const href = link.getAttribute("href") || "";
      const path = href.startsWith("#") ? href.slice(1) : href;
      if (activePath && path === activePath) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    }
  }

  async function bootstrap() {
    renderLoading();
    try {
      await window.DataService.load();
    } catch (err) {
      renderError(err);
      return;
    }

    window.Router.init({
      onRoute: (route) => {
        try {
          updateNavActive(route);
          closeMobileNav();
          renderRoute(route);
          animateApp();
        } catch (err) {
          renderError(err);
        }
      },
    });
  }

  bootstrap();
})();
