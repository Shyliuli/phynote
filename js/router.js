(function () {
  const DEFAULT_SUBJECT = "physics";
  const SUBJECTS = new Set(["physics", "digital-circuit"]);
  const LEGACY_PAGES = new Set([
    "home",
    "practice",
    "knowledge",
    "mistakes",
    "progress",
    "stats",
    "notes",
  ]);
  const state = {
    initialized: false,
    current: null,
    onRoute: null,
  };

  function parseQuery(queryString) {
    const query = {};
    if (!queryString) return query;

    const parts = queryString.replace(/^\?/, "").split("&").filter(Boolean);
    for (const part of parts) {
      const [rawKey, rawValue] = part.split("=");
      const key = decodeURIComponent(rawKey || "").trim();
      const value = decodeURIComponent(rawValue || "").trim();
      if (!key) continue;
      query[key] = value;
    }
    return query;
  }

  function normalizeHash(hashText) {
    const raw = String(hashText || window.location.hash || "#/").trim();
    const noHash = raw.startsWith("#") ? raw.slice(1) : raw;
    const withLeadingSlash = noHash.startsWith("/") ? noHash : `/${noHash}`;
    const [pathPart, queryString] = withLeadingSlash.split("?");
    const path = pathPart.replace(/\/+$/, "") || "/";
    return { path, query: parseQuery(queryString) };
  }

  function parseRoute() {
    const { path, query } = normalizeHash();
    const segments = path.split("/").filter(Boolean);

    const route = {
      name: "not-found",
      path,
      segments,
      query,
      params: {},
      subject: null,
    };

    if (segments.length === 0 || segments[0] === "select") {
      route.name = "subject-select";
      return route;
    }

    let subject = null;
    let restSegments = segments;
    if (SUBJECTS.has(segments[0])) {
      subject = segments[0];
      restSegments = segments.slice(1);
    } else if (LEGACY_PAGES.has(segments[0])) {
      subject = DEFAULT_SUBJECT;
      restSegments = segments.slice();
    } else {
      return route;
    }

    route.subject = subject;

    if (restSegments.length === 0) {
      route.name = "home";
      return route;
    }

    const [head, second] = restSegments;

    if (head === "home") {
      route.name = "home";
      return route;
    }

    if (head === "practice") {
      if (second === "session") route.name = "practice-session";
      else if (second === "result") route.name = "practice-result";
      else route.name = "practice";
      return route;
    }

    if (head === "knowledge") {
      if (second) {
        route.name = "knowledge-detail";
        route.params.knowledgePointId = second;
      } else {
        route.name = "knowledge";
      }
      return route;
    }

    if (head === "mistakes") {
      route.name = "mistakes";
      return route;
    }

    if (head === "progress") {
      route.name = "progress";
      return route;
    }

    if (head === "stats") {
      route.name = "stats";
      return route;
    }

    if (head === "notes") {
      route.name = "notes-redirect";
      return route;
    }

    return route;
  }

  function handleRouteChange() {
    const route = parseRoute();
    state.current = route;
    if (typeof state.onRoute === "function") {
      state.onRoute(route);
    }
  }

  function init({ onRoute } = {}) {
    if (state.initialized) return;
    state.initialized = true;
    state.onRoute = onRoute || null;

    window.addEventListener("hashchange", handleRouteChange);
    handleRouteChange();
  }

  function navigate(path) {
    const normalized = String(path || "").trim();
    if (!normalized) return;
    if (normalized.startsWith("#")) {
      window.location.hash = normalized;
      return;
    }
    window.location.hash = normalized.startsWith("/") ? `#${normalized}` : `#/${normalized}`;
  }

  function getCurrentRoute() {
    return state.current;
  }

  window.Router = {
    init,
    navigate,
    parseRoute,
    getCurrentRoute,
  };
})();
