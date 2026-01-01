(function () {
  const app = document.getElementById("app");
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");

  const SUBJECT_LABELS = {
    physics: "物理",
    "digital-circuit": "数字电路",
  };

  function getSubjectLabel(subject) {
    return SUBJECT_LABELS[subject] || "学科";
  }

  function buildSubjectPath(subject, path) {
    const normalizedSubject = String(subject || "").trim();
    const normalizedPath = String(path || "").trim().replace(/^\/+/, "");
    return `#/${normalizedSubject}/${normalizedPath}`;
  }

  function buildNotesUrl(subject, page) {
    const normalizedSubject = String(subject || "").trim();
    const query = new URLSearchParams();
    if (normalizedSubject) query.set("subject", normalizedSubject);
    if (page != null && page !== "") query.set("page", String(page));
    const queryText = query.toString();
    return queryText ? `notes.html?${queryText}` : "notes.html";
  }

  window.AppRoutes = {
    buildSubjectPath,
    buildNotesUrl,
    getSubjectLabel,
  };

  function renderNav(subject) {
    if (!subject) {
      nav.innerHTML = `<a href="#/select">选择学科</a>`;
      return;
    }

    nav.innerHTML = `
      <a href="#/select">切换学科</a>
      <a href="${buildSubjectPath(subject, "practice")}">练习中心</a>
      <a href="${buildSubjectPath(subject, "knowledge")}">知识点库</a>
      <a href="${buildNotesUrl(subject)}">复习笔记</a>
      <a href="${buildSubjectPath(subject, "mistakes")}">错题本</a>
      <a href="${buildSubjectPath(subject, "progress")}">学习进度</a>
      <a href="${buildSubjectPath(subject, "stats")}">统计分析</a>
    `;
  }

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
    const fallback = route?.subject
      ? window.AppRoutes.buildSubjectPath(route.subject, "home")
      : "/select";
    app.innerHTML = `
      <section class="page">
        <h1 class="page__title">页面不存在</h1>
        <p class="muted" style="margin: 0;">当前路径：${route.path}</p>
        <div><button class="btn" id="goHomeBtn">返回首页</button></div>
      </section>
    `;
    const btn = document.getElementById("goHomeBtn");
    if (btn) btn.addEventListener("click", () => window.Router.navigate(fallback));
  }

  function renderRoute(route) {
    if (!route || !route.name) return renderNotFound({ path: "" });

    if (route.name === "subject-select") return window.SubjectSelectPage.render?.({ app });

    const ctx = {
      app,
      route,
      subject: route.subject,
      subjectLabel: window.AppRoutes.getSubjectLabel(route.subject),
      buildSubjectPath: window.AppRoutes.buildSubjectPath,
      buildNotesUrl: window.AppRoutes.buildNotesUrl,
      DataService: window.DataService,
      StorageService: window.StorageService,
    };

    if (route.name === "notes-redirect") {
      const raw = route?.query?.page;
      const page = raw != null && raw !== "" ? String(raw) : "";
      const subject = route.subject || window.DataService.getSubject?.();
      const target = window.AppRoutes.buildNotesUrl(subject, page);
      window.location.href = target;
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
    if (!route || !route.name || !route.subject) return null;
    const subject = route.subject;
    if (route.name.startsWith("practice")) return window.AppRoutes.buildSubjectPath(subject, "practice");
    if (route.name.startsWith("knowledge")) return window.AppRoutes.buildSubjectPath(subject, "knowledge");
    if (route.name === "mistakes") return window.AppRoutes.buildSubjectPath(subject, "mistakes");
    if (route.name === "progress") return window.AppRoutes.buildSubjectPath(subject, "progress");
    if (route.name === "stats") return window.AppRoutes.buildSubjectPath(subject, "stats");
    return null;
  }

  function updateNavActive(route) {
    const activePath = getNavPathByRoute(route);
    const links = nav.querySelectorAll("a");
    for (const link of links) {
      const href = link.getAttribute("href") || "";
      if (activePath && href === activePath) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    }
  }

  let routeToken = 0;

  async function handleRoute(route) {
    const token = (routeToken += 1);
    try {
      if (route?.name === "subject-select") {
        renderNav(null);
        updateNavActive(route);
        closeMobileNav();
        renderRoute(route);
        animateApp();
        return;
      }

      const subject = route?.subject || window.DataService.getSubject?.() || "physics";
      window.DataService.setSubject(subject);
      window.StorageService.setSubject(subject);

      if (!window.DataService._state?.loaded) {
        renderLoading();
      }

      await window.DataService.load();
      if (token !== routeToken) return;

      renderNav(subject);
      updateNavActive(route);
      closeMobileNav();
      renderRoute(route);
      animateApp();
    } catch (err) {
      if (token !== routeToken) return;
      renderError(err);
    }
  }

  function bootstrap() {
    window.Router.init({ onRoute: handleRoute });
  }

  bootstrap();
})();
