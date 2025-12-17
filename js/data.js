(function () {
  const state = {
    loaded: false,
    knowledge: null,
    questions: [],
    chapterById: {},
    knowledgePointById: {},
    knowledgePointsByChapterId: {},
    questionById: {},
    questionsByChapterId: {},
    kpToQuestionIds: {},
  };

  function assertLoaded() {
    if (!state.loaded) {
      throw new Error("DataService 未加载：请先调用 await DataService.load()");
    }
  }

  function parsePageRange(pageRangeText) {
    if (!pageRangeText || typeof pageRangeText !== "string") return null;
    const match = pageRangeText.trim().match(/^(\d+)\s*-\s*(\d+)$/);
    if (!match) return null;
    return { start: Number(match[1]), end: Number(match[2]) };
  }

  function shuffleInPlace(items) {
    for (let i = items.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = items[i];
      items[i] = items[j];
      items[j] = tmp;
    }
    return items;
  }

  function buildIndexes() {
    state.chapterById = {};
    state.knowledgePointById = {};
    state.knowledgePointsByChapterId = {};
    state.questionById = {};
    state.questionsByChapterId = {};
    state.kpToQuestionIds = {};

    const chapters = (state.knowledge && state.knowledge.chapters) || [];
    for (const chapter of chapters) {
      state.chapterById[chapter.id] = chapter;
      state.knowledgePointsByChapterId[chapter.id] = chapter.knowledgePoints || [];
      for (const knowledgePoint of chapter.knowledgePoints || []) {
        state.knowledgePointById[knowledgePoint.id] = {
          ...knowledgePoint,
          chapterId: chapter.id,
        };
      }
    }

    for (const question of state.questions) {
      state.questionById[question.id] = question;

      if (!state.questionsByChapterId[question.chapterId]) {
        state.questionsByChapterId[question.chapterId] = [];
      }
      state.questionsByChapterId[question.chapterId].push(question);

      for (const knowledgePointId of question.knowledgePointIds || []) {
        if (!state.kpToQuestionIds[knowledgePointId]) {
          state.kpToQuestionIds[knowledgePointId] = [];
        }
        state.kpToQuestionIds[knowledgePointId].push(question.id);
      }
    }
  }

  async function load() {
    if (state.loaded) return state;

    let knowledgeData = null;
    let questionsData = null;

    const seed = window.__EM_APP_SEED__;
    if (seed && seed.knowledge && seed.questions) {
      knowledgeData = seed.knowledge;
      questionsData = seed.questions;
    } else {
      try {
        const [knowledgeRes, questionsRes] = await Promise.all([
          fetch("data/knowledge.json"),
          fetch("data/questions.json"),
        ]);
        knowledgeData = await knowledgeRes.json();
        questionsData = await questionsRes.json();
      } catch (err) {
        throw new Error(
          `无法加载题库数据：当前环境可能是 file:// 直接打开导致 fetch 失败。建议使用本地静态服务器打开，或确保已加载 js/data_seed.js。原始错误：${String(
            err,
          )}`,
        );
      }
    }

    if (!knowledgeData || !Array.isArray(knowledgeData.chapters)) {
      throw new Error("knowledge 数据结构不正确：缺少 chapters");
    }

    const questionList = Array.isArray(questionsData.questions)
      ? questionsData.questions
      : Array.isArray(questionsData)
        ? questionsData
        : null;
    if (!questionList) {
      throw new Error("questions 数据结构不正确：缺少 questions 数组");
    }

    state.knowledge = knowledgeData;
    state.questions = questionList;
    buildIndexes();
    state.loaded = true;
    return state;
  }

  function getCourseName() {
    assertLoaded();
    return state.knowledge.course || "课程";
  }

  function getChapters() {
    assertLoaded();
    return state.knowledge.chapters || [];
  }

  function getChapterById(chapterId) {
    assertLoaded();
    return state.chapterById[chapterId] || null;
  }

  function getKnowledgePointById(knowledgePointId) {
    assertLoaded();
    return state.knowledgePointById[knowledgePointId] || null;
  }

  function listKnowledgePoints({ chapterId } = {}) {
    assertLoaded();
    if (!chapterId) {
      return Object.values(state.knowledgePointById);
    }
    return state.knowledgePointsByChapterId[chapterId] || [];
  }

  function searchKnowledgePoints(queryText) {
    assertLoaded();
    const query = String(queryText || "").trim().toLowerCase();
    if (!query) return listKnowledgePoints();

    return listKnowledgePoints().filter((kp) => {
      const name = String(kp.name || "").toLowerCase();
      const definition = String(kp.definition || "").toLowerCase();
      return name.includes(query) || definition.includes(query);
    });
  }

  function getQuestionById(questionId) {
    assertLoaded();
    return state.questionById[questionId] || null;
  }

  function listQuestions(filters = {}) {
    assertLoaded();

    const {
      chapterId,
      knowledgePointIds,
      types,
      difficulties,
      questionIds,
      matchAllKnowledgePoints = false,
    } = filters || {};

    let pool = state.questions;

    if (Array.isArray(questionIds) && questionIds.length) {
      pool = questionIds
        .map((id) => state.questionById[id])
        .filter(Boolean);
    } else if (chapterId) {
      pool = state.questionsByChapterId[chapterId] || [];
    }

    if (Array.isArray(types) && types.length) {
      const allowed = new Set(types);
      pool = pool.filter((q) => allowed.has(q.type));
    }

    if (Array.isArray(difficulties) && difficulties.length) {
      const allowed = new Set(difficulties);
      pool = pool.filter((q) => allowed.has(q.difficulty));
    }

    if (Array.isArray(knowledgePointIds) && knowledgePointIds.length) {
      const selected = new Set(knowledgePointIds);
      pool = pool.filter((q) => {
        const ids = q.knowledgePointIds || [];
        if (!ids.length) return false;
        if (matchAllKnowledgePoints) {
          return knowledgePointIds.every((kpId) => ids.includes(kpId));
        }
        return ids.some((kpId) => selected.has(kpId));
      });
    }

    return pool.slice();
  }

  function pickRandomQuestions(filters, count) {
    assertLoaded();
    const desiredCount = Math.max(0, Number(count || 0));
    const pool = listQuestions(filters);
    const shuffled = shuffleInPlace(pool.slice());
    return shuffled.slice(0, desiredCount);
  }

  function getQuestionIdsByKnowledgePoint(knowledgePointId) {
    assertLoaded();
    return (state.kpToQuestionIds[knowledgePointId] || []).slice();
  }

  function getQuestionCountByKnowledgePoint(knowledgePointId) {
    assertLoaded();
    return (state.kpToQuestionIds[knowledgePointId] || []).length;
  }

  window.DataService = {
    load,
    parsePageRange,

    getCourseName,
    getChapters,
    getChapterById,

    listKnowledgePoints,
    searchKnowledgePoints,
    getKnowledgePointById,

    listQuestions,
    getQuestionById,
    pickRandomQuestions,

    getQuestionIdsByKnowledgePoint,
    getQuestionCountByKnowledgePoint,

    _state: state,
  };
})();
