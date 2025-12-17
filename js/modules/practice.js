(function () {
  window.PracticePage = window.PracticePage || {};

  function escapeHtml(text) {
    return String(text == null ? "" : text)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function normalizeAnswerText(text) {
    return String(text == null ? "" : text)
      .trim()
      .replaceAll(/\s+/g, "")
      .toLowerCase();
  }

  function getAnswerRecord(session, questionId) {
    const answers = Array.isArray(session.answers) ? session.answers : [];
    return answers.find((a) => a.questionId === questionId) || null;
  }

  function upsertAnswerRecord(session, record) {
    if (!Array.isArray(session.answers)) session.answers = [];
    const idx = session.answers.findIndex((a) => a.questionId === record.questionId);
    if (idx >= 0) session.answers[idx] = record;
    else session.answers.push(record);
  }

  function renderKnowledgePointTags(question) {
    const ids = question.knowledgePointIds || [];
    if (!ids.length) return "";

    const tags = ids
      .map((id) => {
        const kp = window.DataService.getKnowledgePointById(id);
        const name = kp ? kp.name : id;
        return `<a class="tag" href="#/knowledge/${id}" title="查看知识点详情">${escapeHtml(
          name,
        )}</a>`;
      })
      .join("");

    return `<div class="tags">${tags}</div>`;
  }

  function parseChoiceLetter(optionText) {
    const match = String(optionText || "").trim().match(/^([A-D])\s*[\.\u3001]/);
    if (match) return match[1];
    const first = String(optionText || "").trim().charAt(0);
    return /^[A-D]$/.test(first) ? first : "";
  }

  window.PracticePage.renderSettings = function renderPracticeSettings({ app }) {
    const chapters = window.DataService.getChapters();

    const query = window.Router.getCurrentRoute()?.query || {};
    const preselectChapterId = query.chapterId ? String(query.chapterId) : "all";
    const preselectKnowledgePointId = query.kp ? String(query.kp) : null;

    const defaultCount = 10;

    app.innerHTML = `
      <section class="page">
        <h1 class="page__title">练习中心</h1>
        <div class="card"><div class="card__body">
          <form id="practiceForm">
            <div class="form-grid">
              <div class="field">
                <label for="chapterSelect">章节</label>
                <select id="chapterSelect">
                  <option value="all">全部章节</option>
                  ${chapters
                    .map((c) => `<option value="${c.id}">${c.name}（${c.pageRange}）</option>`)
                    .join("")}
                </select>
              </div>
              <div class="field">
                <label for="typeSelect">题型</label>
                <select id="typeSelect">
                  <option value="all">全部题型</option>
                  <option value="choice">选择题</option>
                  <option value="judge">判断题</option>
                  <option value="fill">填空题</option>
                  <option value="short">简答题（含计算题）</option>
                </select>
              </div>
              <div class="field">
                <label for="countInput">题目数量</label>
                <input id="countInput" type="number" min="1" max="50" value="${defaultCount}" />
              </div>
            </div>

            <div class="field" style="margin-top: 14px;">
              <label>知识点（可多选）</label>
              <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center; margin-bottom: 8px;">
                <button class="btn btn--ghost" type="button" id="kpSelectAllBtn">全选</button>
                <button class="btn btn--ghost" type="button" id="kpClearBtn">清空</button>
                <span class="muted" id="kpSummary"></span>
              </div>
              <div class="checklist" id="kpChecklist"></div>
              <p class="muted" id="poolInfo" style="margin: 10px 0 0;"></p>
            </div>

            <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center; margin-top: 14px;">
              <button class="btn" type="submit" id="startBtn">开始练习</button>
              <button class="btn btn--ghost" type="button" id="resetBtn">重置条件</button>
              <span class="muted" id="errorText" style="color: var(--danger);"></span>
            </div>
          </form>
        </div></div>
      </section>
    `;

    const chapterSelect = document.getElementById("chapterSelect");
    const typeSelect = document.getElementById("typeSelect");
    const countInput = document.getElementById("countInput");
    const kpChecklist = document.getElementById("kpChecklist");
    const kpSelectAllBtn = document.getElementById("kpSelectAllBtn");
    const kpClearBtn = document.getElementById("kpClearBtn");
    const kpSummary = document.getElementById("kpSummary");
    const poolInfo = document.getElementById("poolInfo");
    const errorText = document.getElementById("errorText");
    const resetBtn = document.getElementById("resetBtn");
    const form = document.getElementById("practiceForm");

    function getSelectedChapterId() {
      const value = String(chapterSelect.value || "all");
      return value === "all" ? null : value;
    }

    function getSelectedTypes() {
      const value = String(typeSelect.value || "all");
      if (value === "choice") return ["选择题"];
      if (value === "judge") return ["判断题"];
      if (value === "fill") return ["填空题"];
      if (value === "short") return ["简答题", "计算题"];
      return null;
    }

    function getSelectedKnowledgePointIds() {
      const selected = [];
      const inputs = kpChecklist.querySelectorAll("input[type=\"checkbox\"]");
      for (const input of inputs) {
        if (input.checked) selected.push(input.value);
      }
      return selected;
    }

    function updateKnowledgePointChecklist() {
      const chapterId = getSelectedChapterId();
      const knowledgePoints = window.DataService.listKnowledgePoints({ chapterId });

      kpChecklist.innerHTML = knowledgePoints
        .map((kp) => {
          const pageText = kp.pageRange ? `（${kp.pageRange}）` : "";
          return `
            <label class="checkitem">
              <input type="checkbox" name="knowledgePointIds" value="${kp.id}" />
              <span>${kp.name}</span>
              <span class="muted" style="margin-left:auto;">${pageText}</span>
            </label>
          `;
        })
        .join("");

      if (preselectKnowledgePointId) {
        const target = kpChecklist.querySelector(`input[value="${preselectKnowledgePointId}"]`);
        if (target) target.checked = true;
      }

      const inputs = kpChecklist.querySelectorAll("input[type=\"checkbox\"]");
      for (const input of inputs) input.addEventListener("change", updatePoolInfo);

      updatePoolInfo();
    }

    function updatePoolInfo() {
      errorText.textContent = "";
      const chapterId = getSelectedChapterId();
      const types = getSelectedTypes();
      const knowledgePointIds = getSelectedKnowledgePointIds();

      const filters = {
        chapterId: chapterId || undefined,
        types: types || undefined,
        knowledgePointIds: knowledgePointIds.length ? knowledgePointIds : undefined,
      };

      const pool = window.DataService.listQuestions(filters);
      const selectedCount = knowledgePointIds.length;
      kpSummary.textContent = selectedCount ? `已选 ${selectedCount} 个知识点` : "未选择知识点（默认不限）";
      poolInfo.textContent = `当前条件可抽题：${pool.length} 道`;
    }

    function selectAllKnowledgePoints() {
      const inputs = kpChecklist.querySelectorAll("input[type=\"checkbox\"]");
      for (const input of inputs) input.checked = true;
      updatePoolInfo();
    }

    function clearAllKnowledgePoints() {
      const inputs = kpChecklist.querySelectorAll("input[type=\"checkbox\"]");
      for (const input of inputs) input.checked = false;
      updatePoolInfo();
    }

    function resetForm() {
      chapterSelect.value = "all";
      typeSelect.value = "all";
      countInput.value = String(defaultCount);
      updateKnowledgePointChecklist();
    }

    function buildSession({ questionIds, settings }) {
      const ts = Date.now();
      return {
        id: `session_${ts}_${Math.random().toString(16).slice(2)}`,
        createdAt: ts,
        startedAt: ts,
        finishedAt: null,
        currentIndex: 0,
        questionIds,
        answers: [],
        settings,
      };
    }

    function handleSubmit(evt) {
      evt.preventDefault();
      errorText.textContent = "";

      const chapterId = getSelectedChapterId();
      const types = getSelectedTypes();
      const knowledgePointIds = getSelectedKnowledgePointIds();
      const requestedCount = Math.max(1, Number(countInput.value || defaultCount));

      const filters = {
        chapterId: chapterId || undefined,
        types: types || undefined,
        knowledgePointIds: knowledgePointIds.length ? knowledgePointIds : undefined,
      };

      const pool = window.DataService.listQuestions(filters);
      if (!pool.length) {
        errorText.textContent = "当前条件没有可用题目，请调整筛选条件。";
        return;
      }

      const picked = window.DataService.pickRandomQuestions(filters, Math.min(requestedCount, pool.length));
      const questionIds = picked.map((q) => q.id);

      const settings = {
        chapterId,
        knowledgePointIds,
        type: String(typeSelect.value || "all"),
        count: requestedCount,
      };

      const session = buildSession({ questionIds, settings });
      window.StorageService.setSession(session);
      window.StorageService.setSettings({ lastPracticeSettings: settings });

      window.Router.navigate("/practice/session");
    }

    chapterSelect.value = preselectChapterId === "all" ? "all" : preselectChapterId;
    chapterSelect.addEventListener("change", updateKnowledgePointChecklist);
    typeSelect.addEventListener("change", updatePoolInfo);
    countInput.addEventListener("change", updatePoolInfo);

    kpSelectAllBtn.addEventListener("click", selectAllKnowledgePoints);
    kpClearBtn.addEventListener("click", clearAllKnowledgePoints);
    resetBtn.addEventListener("click", resetForm);
    form.addEventListener("submit", handleSubmit);

    updateKnowledgePointChecklist();
  };

  window.PracticePage.renderSession = function renderPracticeSession({ app }) {
    const session = window.StorageService.getSession();
    if (!session || !Array.isArray(session.questionIds) || !session.questionIds.length) {
      app.innerHTML = `
        <section class="page">
          <h1 class="page__title">答题页</h1>
          <div class="card"><div class="card__body">
            <p class="muted" style="margin-top: 0;">未找到进行中的练习，请先到练习中心出题。</p>
            <a class="btn" href="#/practice">去出题</a>
          </div></div>
        </section>
      `;
      return;
    }

    const routeQuery = window.Router.getCurrentRoute()?.query || {};
    if (routeQuery.jump) {
      const jumpId = String(routeQuery.jump);
      const idx = session.questionIds.findIndex((id) => String(id) === jumpId);
      if (idx >= 0) session.currentIndex = idx;
    }

    const total = session.questionIds.length;
    const currentIndex = Math.min(Math.max(0, Number(session.currentIndex || 0)), total - 1);
    session.currentIndex = currentIndex;

    const questionId = session.questionIds[currentIndex];
    const question = window.DataService.getQuestionById(questionId);
    if (!question) {
      app.innerHTML = `
        <section class="page">
          <h1 class="page__title">题目不存在</h1>
          <p class="muted" style="margin: 0;">题目ID：${escapeHtml(questionId)}</p>
          <div style="margin-top: 12px;"><a class="btn" href="#/practice">返回练习中心</a></div>
        </section>
      `;
      return;
    }

    const existingRecord = getAnswerRecord(session, question.id);

    const type = question.type;
    const difficulty = question.difficulty || "—";
    const headerBadges = `
      <span class="pill">${escapeHtml(type)}</span>
      <span class="pill pill--ghost">难度：${escapeHtml(difficulty)}</span>
      <span class="pill pill--ghost">第 ${currentIndex + 1} / ${total} 题</span>
    `;

    const sourcePage = Number(question.sourcePage);
    const sourceHtml = Number.isInteger(sourcePage)
      ? `<a class="muted link" href="notes.html?page=${escapeHtml(sourcePage)}">来源：第 ${escapeHtml(
          sourcePage,
        )} 页</a>`
      : "";

    app.innerHTML = `
      <section class="page">
        <h1 class="page__title">答题</h1>

        <div class="card">
          <div class="card__body">
            <div class="pills">${headerBadges}</div>
            <div style="margin-top: 12px;">
              <div class="question-text">${escapeHtml(question.content)}</div>
            </div>

            <div style="margin-top: 12px;">
              ${renderKnowledgePointTags(question)}
              ${sourceHtml ? `<p class="muted" style="margin: 8px 0 0;">${sourceHtml}</p>` : ""}
            </div>

            <div style="margin-top: 14px;" id="answerArea"></div>

            <div style="margin-top: 14px; display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
              <button class="btn" id="submitBtn">提交答案</button>
              <button class="btn btn--ghost" id="nextBtn" disabled>下一题</button>
              <button class="btn btn--ghost" id="finishBtn" style="display:none;">完成</button>
              <span class="muted" id="inlineHint"></span>
            </div>
          </div>
        </div>

        <div id="feedbackArea" style="margin-top: 14px;"></div>
      </section>
    `;

    const answerArea = document.getElementById("answerArea");
    const feedbackArea = document.getElementById("feedbackArea");
    const submitBtn = document.getElementById("submitBtn");
    const nextBtn = document.getElementById("nextBtn");
    const finishBtn = document.getElementById("finishBtn");
    const inlineHint = document.getElementById("inlineHint");

    const isLast = currentIndex === total - 1;
    if (isLast) {
      nextBtn.style.display = "none";
      finishBtn.style.display = "inline-flex";
      finishBtn.disabled = true;
    }

    function setSession(nextSession) {
      window.StorageService.setSession(nextSession);
    }

    function ensureQuestionStartTime() {
      const now = Date.now();
      if (session.currentQuestionId !== question.id) {
        session.currentQuestionId = question.id;
        session.currentQuestionStartedAt = now;
        setSession(session);
      } else if (!session.currentQuestionStartedAt) {
        session.currentQuestionStartedAt = now;
        setSession(session);
      }
    }

    ensureQuestionStartTime();

    function renderAnswerInput() {
      if (type === "选择题") {
        const optionsHtml = (question.options || [])
          .map((opt) => {
            const letter = parseChoiceLetter(opt);
            const checked = existingRecord && existingRecord.userAnswer === letter ? "checked" : "";
            return `
              <label class="option">
                <input type="radio" name="choice" value="${escapeHtml(letter)}" ${checked} />
                <span>${escapeHtml(opt)}</span>
              </label>
            `;
          })
          .join("");
        answerArea.innerHTML = `<div class="options">${optionsHtml}</div>`;
      } else if (type === "判断题") {
        const val = existingRecord ? existingRecord.userAnswer : "";
        answerArea.innerHTML = `
          <div class="judge">
            <button class="btn btn--ghost" type="button" data-judge="对" id="judgeTrueBtn">对</button>
            <button class="btn btn--ghost" type="button" data-judge="错" id="judgeFalseBtn">错</button>
            <input type="hidden" id="judgeValue" value="${escapeHtml(val)}" />
          </div>
        `;
        const trueBtn = document.getElementById("judgeTrueBtn");
        const falseBtn = document.getElementById("judgeFalseBtn");
        const hidden = document.getElementById("judgeValue");

        function updateJudgeButtons() {
          const current = hidden.value;
          if (current === "对") {
            trueBtn.classList.add("btn--primary");
            falseBtn.classList.remove("btn--primary");
          } else if (current === "错") {
            falseBtn.classList.add("btn--primary");
            trueBtn.classList.remove("btn--primary");
          } else {
            trueBtn.classList.remove("btn--primary");
            falseBtn.classList.remove("btn--primary");
          }
        }

        trueBtn.addEventListener("click", () => {
          hidden.value = "对";
          updateJudgeButtons();
        });
        falseBtn.addEventListener("click", () => {
          hidden.value = "错";
          updateJudgeButtons();
        });
        updateJudgeButtons();
      } else if (type === "填空题") {
        const val = existingRecord ? existingRecord.userAnswer : "";
        answerArea.innerHTML = `
          <div class="field">
            <label for="fillInput">你的答案</label>
            <input id="fillInput" type="text" placeholder="请输入填空内容" value="${escapeHtml(val)}" />
          </div>
        `;
      } else {
        const val = existingRecord ? existingRecord.userAnswer : "";
        answerArea.innerHTML = `
          <div class="field">
            <label for="textAnswer">你的答案</label>
            <textarea id="textAnswer" placeholder="请输入你的解答（主观题建议对照参考答案自评）">${escapeHtml(
              val,
            )}</textarea>
          </div>
        `;
      }

      if (existingRecord && existingRecord.evaluated) {
        const inputs = answerArea.querySelectorAll("input, textarea, button");
        for (const el of inputs) el.disabled = true;
        submitBtn.disabled = true;
        nextBtn.disabled = false;
        finishBtn.disabled = false;
      }
    }

    function renderFeedback(record) {
      if (!record) return;

      const correctAnswerText = question.answer != null ? String(question.answer) : "";
      const explanationText = question.explanation != null ? String(question.explanation) : "";

      if (record.evaluated) {
        const title = record.isCorrect ? "回答正确" : "回答错误";
        const color = record.isCorrect ? "var(--success)" : "var(--danger)";
        feedbackArea.innerHTML = `
          <div class="card">
            <div class="card__body">
              <h3 style="margin: 0 0 10px; color: ${color};">${escapeHtml(title)}</h3>
              <div class="qa">
                <div class="qa__row"><span class="qa__label">你的答案</span><span>${escapeHtml(
                  record.userAnswer,
                )}</span></div>
                <div class="qa__row"><span class="qa__label">正确答案</span><span>${escapeHtml(
                  correctAnswerText,
                )}</span></div>
              </div>
              <p class="muted" style="margin: 10px 0 0;">解析：${escapeHtml(explanationText)}</p>
            </div>
          </div>
        `;
        return;
      }

      feedbackArea.innerHTML = `
        <div class="card">
          <div class="card__body">
            <h3 style="margin: 0 0 10px;">参考答案（主观题请自评）</h3>
            <div class="qa">
              <div class="qa__row"><span class="qa__label">你的答案</span><span>${escapeHtml(
                record.userAnswer,
              )}</span></div>
              <div class="qa__row"><span class="qa__label">参考答案</span><span>${escapeHtml(
                correctAnswerText,
              )}</span></div>
            </div>
            <p class="muted" style="margin: 10px 0 12px;">解析：${escapeHtml(explanationText)}</p>
            <div style="display:flex; gap:10px; flex-wrap:wrap;">
              <button class="btn" id="markCorrectBtn" type="button">我答对了</button>
              <button class="btn btn--ghost" id="markWrongBtn" type="button">我答错了</button>
            </div>
          </div>
        </div>
      `;

      const markCorrectBtn = document.getElementById("markCorrectBtn");
      const markWrongBtn = document.getElementById("markWrongBtn");

      const durationMs = Math.max(0, Date.now() - Number(session.currentQuestionStartedAt || Date.now()));

      function finalize(isCorrect) {
        const finalized = {
          ...record,
          evaluated: true,
          isCorrect: Boolean(isCorrect),
          answeredAt: Date.now(),
          durationMs,
        };
        upsertAnswerRecord(session, finalized);
        setSession(session);

        window.StorageService.recordAnswer({
          question,
          userAnswer: finalized.userAnswer,
          isCorrect: finalized.isCorrect,
          durationMs: finalized.durationMs,
          sessionId: session.id,
        });

        submitBtn.disabled = true;
        nextBtn.disabled = false;
        finishBtn.disabled = false;
        inlineHint.textContent = "已记录本题结果";
        renderFeedback(finalized);
        renderAnswerInput();
      }

      markCorrectBtn.addEventListener("click", () => finalize(true));
      markWrongBtn.addEventListener("click", () => finalize(false));
    }

    function getUserAnswer() {
      if (type === "选择题") {
        const checked = answerArea.querySelector("input[name=\"choice\"]:checked");
        return checked ? checked.value : "";
      }
      if (type === "判断题") {
        const hidden = document.getElementById("judgeValue");
        return hidden ? hidden.value : "";
      }
      if (type === "填空题") {
        const input = document.getElementById("fillInput");
        return input ? input.value : "";
      }
      const textarea = document.getElementById("textAnswer");
      return textarea ? textarea.value : "";
    }

    function evaluateObjectiveAnswer(userAnswer) {
      if (type === "选择题") return String(userAnswer).trim().toUpperCase() === String(question.answer).trim();
      if (type === "判断题") return String(userAnswer).trim() === String(question.answer).trim();
      if (type === "填空题") {
        return normalizeAnswerText(userAnswer) === normalizeAnswerText(question.answer);
      }
      return false;
    }

    function handleSubmit() {
      inlineHint.textContent = "";

      const userAnswer = getUserAnswer();
      if (!String(userAnswer || "").trim()) {
        inlineHint.textContent = "请先填写/选择答案再提交。";
        return;
      }

      const durationMs = Math.max(0, Date.now() - Number(session.currentQuestionStartedAt || Date.now()));

      if (type === "简答题" || type === "计算题") {
        const pending = {
          questionId: question.id,
          userAnswer: String(userAnswer),
          isCorrect: null,
          evaluated: false,
          answeredAt: Date.now(),
          durationMs,
        };
        upsertAnswerRecord(session, pending);
        setSession(session);

        submitBtn.disabled = true;
        renderFeedback(pending);
        renderAnswerInput();
        return;
      }

      const isCorrect = evaluateObjectiveAnswer(userAnswer);
      const record = {
        questionId: question.id,
        userAnswer: String(userAnswer),
        isCorrect,
        evaluated: true,
        answeredAt: Date.now(),
        durationMs,
      };
      upsertAnswerRecord(session, record);
      setSession(session);

      window.StorageService.recordAnswer({
        question,
        userAnswer: record.userAnswer,
        isCorrect: record.isCorrect,
        durationMs: record.durationMs,
        sessionId: session.id,
      });

      submitBtn.disabled = true;
      nextBtn.disabled = false;
      finishBtn.disabled = false;
      inlineHint.textContent = "已记录本题结果";
      renderFeedback(record);
      renderAnswerInput();
    }

    function goNext() {
      if (session.currentIndex >= total - 1) return;
      session.currentIndex += 1;
      session.currentQuestionId = null;
      session.currentQuestionStartedAt = null;
      setSession(session);
      window.Router.navigate(`/practice/session?i=${session.currentIndex}&t=${Date.now()}`);
    }

    function finish() {
      session.finishedAt = Date.now();
      setSession(session);
      window.Router.navigate("/practice/result");
    }

    submitBtn.addEventListener("click", handleSubmit);
    nextBtn.addEventListener("click", goNext);
    finishBtn.addEventListener("click", finish);

    renderAnswerInput();
    if (existingRecord) {
      renderFeedback(existingRecord);
      if (existingRecord.evaluated) {
        submitBtn.disabled = true;
        nextBtn.disabled = false;
        finishBtn.disabled = false;
      }
    }
  };

  window.PracticePage.renderResult = function renderPracticeResult({ app }) {
    const session = window.StorageService.getSession();
    if (!session || !Array.isArray(session.questionIds) || !session.questionIds.length) {
      app.innerHTML = `
        <section class="page">
          <h1 class="page__title">结果页</h1>
          <div class="card"><div class="card__body">
            <p class="muted" style="margin-top: 0;">未找到可展示的练习结果，请先完成一组练习。</p>
            <a class="btn" href="#/practice">去练习中心</a>
          </div></div>
        </section>
      `;
      return;
    }

    const total = session.questionIds.length;
    const answers = Array.isArray(session.answers) ? session.answers : [];
    const answerById = {};
    for (const a of answers) answerById[a.questionId] = a;

    let correct = 0;
    let evaluated = 0;
    for (const qId of session.questionIds) {
      const a = answerById[qId];
      if (a && a.evaluated) {
        evaluated += 1;
        if (a.isCorrect) correct += 1;
      }
    }

    const accuracy = total ? correct / total : 0;
    const percent = Math.round(accuracy * 100);

    const startedAt = Number(session.startedAt || session.createdAt || 0);
    const finishedAt = Number(session.finishedAt || Date.now());
    const durationMs = startedAt ? Math.max(0, finishedAt - startedAt) : 0;
    const durationSec = Math.round(durationMs / 1000);
    const mm = String(Math.floor(durationSec / 60)).padStart(2, "0");
    const ss = String(durationSec % 60).padStart(2, "0");

    const wrongIds = session.questionIds.filter((id) => {
      const a = answerById[id];
      return a && a.evaluated && a.isCorrect === false;
    });

    const unansweredIds = session.questionIds.filter((id) => {
      const a = answerById[id];
      return !a || !a.evaluated;
    });

    const wrongListHtml = wrongIds.length
      ? wrongIds
          .map((id) => {
            const q = window.DataService.getQuestionById(id);
            if (!q) return "";
            const title = `${q.type}｜${q.difficulty || "—"}｜第${q.sourcePage || "—"}页`;
            const isSaved = window.StorageService.hasMistake(id);
            const btnText = isSaved ? "已收藏" : "收藏错题";
            const btnClass = isSaved ? "btn btn--ghost" : "btn";
            return `
              <div class="card" style="margin-top: 12px;">
                <div class="card__body">
                  <div class="muted" style="font-size: 12px; font-weight: 800;">${escapeHtml(
                    title,
                  )}</div>
                  <div style="margin-top: 8px; white-space: pre-wrap;">${escapeHtml(q.content)}</div>
                  <div style="margin-top: 10px; display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
                    <button class="${btnClass}" type="button" data-toggle-mistake="${escapeHtml(
                      id,
                    )}">${escapeHtml(btnText)}</button>
                    ${
                      Number.isInteger(q.sourcePage)
                        ? `<a class="btn btn--ghost" href="notes.html?page=${escapeHtml(q.sourcePage)}">看笔记</a>`
                        : ""
                    }
                    <a class="btn btn--ghost" href="#/practice/session?jump=${escapeHtml(
                      id,
                    )}">回到题目</a>
                  </div>
                </div>
              </div>
            `;
          })
          .join("")
      : `<p class="muted" style="margin: 0;">本次没有错题，继续保持。</p>`;

    const warningHtml = unansweredIds.length
      ? `<p class="muted" style="margin: 10px 0 0; color: var(--warning);">注意：仍有 ${unansweredIds.length} 题未完成判定（通常是主观题未自评）。</p>`
      : "";

    app.innerHTML = `
      <section class="page">
        <h1 class="page__title">练习结果</h1>

        <div class="card">
          <div class="card__body">
            <div class="pills">
              <span class="pill">得分：${correct}/${total}（${percent}%）</span>
              <span class="pill pill--ghost">用时：${mm}:${ss}</span>
              <span class="pill pill--ghost">已判定：${evaluated}/${total}</span>
            </div>
            ${warningHtml}

            <div style="margin-top: 14px; display:flex; gap:10px; flex-wrap:wrap;">
              <a class="btn" href="#/practice">再做一组</a>
              <a class="btn btn--ghost" href="#/mistakes">查看错题本</a>
              <a class="btn btn--ghost" href="#/">返回首页</a>
            </div>
          </div>
        </div>

        <div style="margin-top: 14px;">
          <h2 style="margin: 0 0 10px; font-size: 16px;">错题列表</h2>
          ${wrongListHtml}
        </div>
      </section>
    `;

    const toggleButtons = app.querySelectorAll("button[data-toggle-mistake]");
    for (const btn of toggleButtons) {
      btn.addEventListener("click", () => {
        const qid = btn.getAttribute("data-toggle-mistake");
        if (!qid) return;
        window.StorageService.toggleMistake(qid);
        const isSaved = window.StorageService.hasMistake(qid);
        btn.textContent = isSaved ? "已收藏" : "收藏错题";
        btn.className = isSaved ? "btn btn--ghost" : "btn";
      });
    }
  };
})();
