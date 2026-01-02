(function () {
  function escapeHtml(text) {
    return String(text == null ? "" : text)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function isLetter(ch) {
    return /[a-zA-Z]/.test(ch);
  }

  function isAlphaNum(ch) {
    return /[0-9a-zA-Z]/.test(ch);
  }

  const LATEX_SYMBOLS = {
    alpha: "α",
    beta: "β",
    gamma: "γ",
    delta: "δ",
    epsilon: "ε",
    varepsilon: "ε",
    zeta: "ζ",
    eta: "η",
    theta: "θ",
    vartheta: "ϑ",
    iota: "ι",
    kappa: "κ",
    lambda: "λ",
    mu: "μ",
    nu: "ν",
    xi: "ξ",
    pi: "π",
    rho: "ρ",
    sigma: "σ",
    tau: "τ",
    phi: "φ",
    varphi: "ϕ",
    chi: "χ",
    psi: "ψ",
    omega: "ω",
    hbar: "ħ",

    Gamma: "Γ",
    Delta: "Δ",
    Theta: "Θ",
    Lambda: "Λ",
    Xi: "Ξ",
    Pi: "Π",
    Sigma: "Σ",
    Phi: "Φ",
    Psi: "Ψ",
    Omega: "Ω",

    infty: "∞",
    cdot: "·",
    times: "×",
    to: "→",

    partial: "∂",
    nabla: "∇",

    int: "∫",
    oint: "∮",
    ge: "≥",
    le: "≤",
    approx: "≈",
    ne: "≠",
    pm: "±",
    dots: "…",
    cdots: "…",
    ldots: "…",
    circ: "°",
  };

  const LATEX_FUNCTIONS = new Set(["sin", "cos", "tan", "ln", "log"]);

  function parseMathGroup(state) {
    if (state.s[state.i] !== "{") return null;
    state.i += 1;
    const inner = parseMathExpression(state, "}");
    if (state.s[state.i] === "}") state.i += 1;
    return inner;
  }

  function parseMathScriptArg(state) {
    const ch = state.s[state.i];
    if (ch === "{") return parseMathGroup(state) || "";
    return parseMathAtom(state, { allowScripts: false }) || "";
  }

  function parseMathCommand(state) {
    state.i += 1; // consume '\'
    const next = state.s[state.i] || "";

    if (!next) return escapeHtml("\\");

    // One-char commands like '\,' for thin space.
    if (!isLetter(next)) {
      state.i += 1;
      if (next === ",") return `<span class="math-space math-space--thin"></span>`;
      return escapeHtml(next);
    }

    let name = "";
    while (isLetter(state.s[state.i] || "")) {
      name += state.s[state.i];
      state.i += 1;
    }

    if (name === "frac") {
      const num = parseMathGroup(state) || "";
      const den = parseMathGroup(state) || "";
      return `<span class="math-frac"><span class="math-num">${num}</span><span class="math-den">${den}</span></span>`;
    }

    if (name === "sqrt") {
      const body = parseMathGroup(state) || "";
      return `<span class="math-sqrt">√<span class="math-sqrt-body">${body}</span></span>`;
    }

    if (name === "vec") {
      const body = parseMathGroup(state) || "";
      return `<span class="math-deco math-vec">${body}</span>`;
    }

    if (name === "hat") {
      const body = parseMathGroup(state) || "";
      return `<span class="math-deco math-hat">${body}</span>`;
    }

    if (name === "quad") return `<span class="math-space math-space--quad"></span>`;

    if (LATEX_FUNCTIONS.has(name)) {
      return `<span class="math-func">${escapeHtml(name)}</span>`;
    }

    if (Object.prototype.hasOwnProperty.call(LATEX_SYMBOLS, name)) {
      return `<span class="math-sym">${escapeHtml(LATEX_SYMBOLS[name])}</span>`;
    }

    // Unknown command: keep as plain text (drop the backslash).
    return `<span class="math-unk">${escapeHtml(name)}</span>`;
  }

  function parseMathTextRun(state) {
    const start = state.i;
    while (isAlphaNum(state.s[state.i] || "")) state.i += 1;
    const run = state.s.slice(start, state.i);
    return escapeHtml(run);
  }

  function parseMathAtom(state, { allowScripts } = { allowScripts: true }) {
    const ch = state.s[state.i];
    if (!ch) return "";

    let base = "";

    if (ch === "{") {
      base = parseMathGroup(state) || "";
    } else if (ch === "\\") {
      base = parseMathCommand(state);
    } else if (isAlphaNum(ch)) {
      base = parseMathTextRun(state);
    } else if (ch === "\n") {
      state.i += 1;
      base = " ";
    } else if (ch === " ") {
      state.i += 1;
      base = " ";
    } else {
      state.i += 1;
      base = escapeHtml(ch);
    }

    if (!allowScripts) return base;

    let sup = null;
    let sub = null;
    while (true) {
      const op = state.s[state.i];
      if (op !== "^" && op !== "_") break;
      state.i += 1;
      const arg = parseMathScriptArg(state);
      if (op === "^") sup = arg;
      else sub = arg;
    }

    if (!sup && !sub) return base;

    const supHtml = sup ? `<sup class="math-sup">${sup}</sup>` : "";
    const subHtml = sub ? `<sub class="math-sub">${sub}</sub>` : "";
    return `<span class="math-scripts"><span class="math-base">${base}</span>${supHtml}${subHtml}</span>`;
  }

  function parseMathExpression(state, stopChar) {
    const parts = [];
    while (state.i < state.s.length) {
      const ch = state.s[state.i];
      if (stopChar && ch === stopChar) break;
      parts.push(parseMathAtom(state, { allowScripts: true }));
    }
    return parts.join("");
  }

  function renderLatex(latex, { displayMode = false } = {}) {
    const state = { s: String(latex || ""), i: 0 };
    const body = parseMathExpression(state, null);
    const cls = displayMode ? "math math--block" : "math math--inline";
    return `<span class="${cls}">${body}</span>`;
  }

  function renderInline(text) {
    const raw = String(text == null ? "" : text);
    const parts = [];
    let i = 0;

    function pushText(s) {
      if (!s) return;
      // Basic inline formatting: **bold**
      const escaped = escapeHtml(s);
      parts.push(escaped);
    }

    while (i < raw.length) {
      const idx = raw.indexOf("$", i);
      if (idx < 0) {
        pushText(raw.slice(i));
        break;
      }

      // Escaped dollar
      if (idx > 0 && raw[idx - 1] === "\\") {
        pushText(raw.slice(i, idx - 1));
        parts.push("$");
        i = idx + 1;
        continue;
      }

      // text before $
      pushText(raw.slice(i, idx));
      let j = idx + 1;
      while (j < raw.length) {
        const next = raw.indexOf("$", j);
        if (next < 0) break;
        if (next > 0 && raw[next - 1] === "\\") {
          j = next + 1;
          continue;
        }
        const latex = raw.slice(idx + 1, next);
        parts.push(renderLatex(latex, { displayMode: false }));
        i = next + 1;
        break;
      }
      if (i === idx) {
        // no closing $, treat as text
        parts.push("$");
        i = idx + 1;
      }
    }

    // bold (**...**) and inline code (`...`) post-processing on already-safe HTML:
    let html = parts.join("");
    html = html
      .replaceAll(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replaceAll(/`([^`]+?)`/g, "<code>$1</code>");
    return html;
  }

  function renderMarkdown(markdown) {
    const text = String(markdown == null ? "" : markdown).replaceAll("\r\n", "\n");
    const lines = text.split("\n");
    const out = [];

    let i = 0;
    let inFence = false;
    let fenceBuf = [];
    let mathBuf = null;

    function flushParagraph(buf) {
      const joined = buf
        .join(" ")
        .replaceAll(/\s+/g, " ")
        .trim();
      if (!joined) return;
      out.push(`<p>${renderInline(joined)}</p>`);
    }

    function flushFence() {
      const code = fenceBuf.join("\n");
      out.push(`<pre class="md-code"><code>${escapeHtml(code)}</code></pre>`);
      fenceBuf = [];
    }

    function flushMathBlock() {
      const latex = (mathBuf || []).join("\n").trim();
      out.push(`<div class="math-block">${renderLatex(latex, { displayMode: true })}</div>`);
      mathBuf = null;
    }

    while (i < lines.length) {
      const line = lines[i];
      const t = line.trimEnd();
      const trimmed = t.trim();

      const imgMatch = trimmed.match(/^!\[(.*)\]\((.*)\)\s*$/);
      if (imgMatch) {
        const alt = imgMatch[1] || "";
        const src = imgMatch[2] || "";
        const safeSrc = /^(https?:)?\/\/|^\.\.?\//.test(src) || !/:/.test(src) ? src : "";
        if (safeSrc) {
          out.push(
            `<div class="md-image"><img src="${escapeHtml(safeSrc)}" alt="${escapeHtml(
              alt,
            )}" loading="lazy" /></div>`,
          );
        } else {
          out.push(`<p>${renderInline(trimmed)}</p>`);
        }
        i += 1;
        continue;
      }

      if (trimmed.startsWith("```")) {
        if (inFence) {
          inFence = false;
          flushFence();
        } else {
          inFence = true;
        }
        i += 1;
        continue;
      }

      if (inFence) {
        fenceBuf.push(t);
        i += 1;
        continue;
      }

      if (trimmed === "$$") {
        if (mathBuf) {
          flushMathBlock();
        } else {
          mathBuf = [];
        }
        i += 1;
        continue;
      }

      if (mathBuf) {
        mathBuf.push(t);
        i += 1;
        continue;
      }

      // Single-line $$...$$
      if (trimmed.startsWith("$$") && trimmed.endsWith("$$") && trimmed.length > 4) {
        const latex = trimmed.slice(2, -2).trim();
        out.push(`<div class="math-block">${renderLatex(latex, { displayMode: true })}</div>`);
        i += 1;
        continue;
      }

      if (/^---+$/.test(trimmed)) {
        out.push("<hr />");
        i += 1;
        continue;
      }

      const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const content = headingMatch[2].trim();
        out.push(`<h${level}>${renderInline(content)}</h${level}>`);
        i += 1;
        continue;
      }

      // Table: contiguous pipe lines with a separator row.
      if (trimmed.startsWith("|") && trimmed.includes("|")) {
        const tableLines = [];
        let j = i;
        while (j < lines.length) {
          const ln = lines[j].trimEnd();
          const tr = ln.trim();
          if (!tr.startsWith("|") || !tr.includes("|")) break;
          tableLines.push(tr);
          j += 1;
        }

        const sepIdx = tableLines.findIndex((r) => /^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?$/.test(r));
        if (tableLines.length >= 2 && sepIdx === 1) {
          const headerRow = tableLines[0];
          const bodyRows = tableLines.slice(2);
          const parseRow = (row) =>
            row
              .replace(/^\|/, "")
              .replace(/\|$/, "")
              .split("|")
              .map((c) => c.trim());
          const headers = parseRow(headerRow);
          const body = bodyRows.map(parseRow);
          out.push(`<div class="md-table"><table><thead><tr>${headers
            .map((h) => `<th>${renderInline(h)}</th>`)
            .join("")}</tr></thead><tbody>${body
            .map((r) => `<tr>${r.map((c) => `<td>${renderInline(c)}</td>`).join("")}</tr>`)
            .join("")}</tbody></table></div>`);
          i = j;
          continue;
        }
      }

      // Lists
      const ulMatch = trimmed.match(/^-\s+(.+)$/);
      const olMatch = trimmed.match(/^\d+\.\s+(.+)$/);
      if (ulMatch || olMatch) {
        const isOrdered = Boolean(olMatch);
        const items = [];
        let j = i;
        while (j < lines.length) {
          const row = lines[j].trim();
          const m = isOrdered ? row.match(/^\d+\.\s+(.+)$/) : row.match(/^-\s+(.+)$/);
          if (!m) break;
          items.push(m[1]);
          j += 1;
        }
        const tag = isOrdered ? "ol" : "ul";
        out.push(`<${tag}>${items.map((it) => `<li>${renderInline(it)}</li>`).join("")}</${tag}>`);
        i = j;
        continue;
      }

      // Paragraph
      if (!trimmed) {
        i += 1;
        continue;
      }

      const para = [];
      let j = i;
      while (j < lines.length) {
        const row = lines[j].trimEnd();
        const tr = row.trim();
        if (!tr) break;
        if (tr.startsWith("```")) break;
        if (tr === "$$") break;
        if (tr.startsWith("$$") && tr.endsWith("$$") && tr.length > 4) break;
        if (/^#{1,6}\s+/.test(tr)) break;
        if (/^---+$/.test(tr)) break;
        if (tr.startsWith("|") && tr.includes("|")) break;
        if (/^-\s+/.test(tr) || /^\d+\.\s+/.test(tr)) break;
        para.push(tr);
        j += 1;
      }
      flushParagraph(para);
      i = j;
    }

    if (inFence) flushFence();
    if (mathBuf) flushMathBlock();

    return `<div class="md">${out.join("")}</div>`;
  }

  window.NotesRenderer = {
    renderMarkdown,
    renderLatex,
  };
})();
