(function () {
  const DEFAULT_SUBJECT = "physics";
  const KNOWN_SUBJECTS = new Set(["physics", "digital-circuit"]);
  const LEGACY_KEYS = {
    attempts: "online_learning_attempts_v1",
    mistakes: "online_learning_mistakes_v1",
    settings: "online_learning_settings_v1",
    session: "online_learning_session_v1",
  };
  const state = {
    subject: DEFAULT_SUBJECT,
    keys: buildKeys(DEFAULT_SUBJECT),
  };

  function normalizeSubject(subject) {
    const normalized = String(subject || "").trim();
    if (KNOWN_SUBJECTS.has(normalized)) return normalized;
    return DEFAULT_SUBJECT;
  }

  function buildKeys(subject) {
    const prefix = `${subject}:`;
    return {
      attempts: `${prefix}attempts_v1`,
      mistakes: `${prefix}mistakes_v1`,
      settings: `${prefix}settings_v1`,
      session: `${prefix}session_v1`,
    };
  }

  function maybeMigrateLegacyKeys() {
    if (state.subject !== DEFAULT_SUBJECT) return;
    const entries = Object.entries(LEGACY_KEYS);
    for (const [keyName, legacyKey] of entries) {
      const nextKey = state.keys[keyName];
      if (window.localStorage.getItem(nextKey) != null) continue;
      const legacyValue = window.localStorage.getItem(legacyKey);
      if (legacyValue == null) continue;
      window.localStorage.setItem(nextKey, legacyValue);
    }
  }

  function setSubject(subject) {
    const next = normalizeSubject(subject);
    if (state.subject === next) return state.subject;
    state.subject = next;
    state.keys = buildKeys(next);
    maybeMigrateLegacyKeys();
    if (window.StorageService) {
      window.StorageService.KEYS = state.keys;
    }
    return state.subject;
  }

  function getSubject() {
    return state.subject;
  }

  maybeMigrateLegacyKeys();

  function safeParseJson(text, fallbackValue) {
    try {
      return JSON.parse(text);
    } catch (_err) {
      return fallbackValue;
    }
  }

  function readJson(key, fallbackValue) {
    const raw = window.localStorage.getItem(key);
    if (raw == null) return fallbackValue;
    return safeParseJson(raw, fallbackValue);
  }

  function writeJson(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }

  function nowMs() {
    return Date.now();
  }

  function makeId(prefix) {
    const rand = Math.random().toString(16).slice(2);
    return `${prefix}_${nowMs()}_${rand}`;
  }

  function getAttempts() {
    return readJson(state.keys.attempts, []);
  }

  function addAttempt(attempt) {
    const attempts = getAttempts();
    attempts.push(attempt);
    writeJson(state.keys.attempts, attempts);
    return attempt;
  }

  function recordAnswer({ question, userAnswer, isCorrect, durationMs, sessionId }) {
    if (!question || !question.id) {
      throw new Error("recordAnswer: 缺少 question");
    }

    const attempt = {
      id: makeId("attempt"),
      sessionId: sessionId || null,
      questionId: question.id,
      chapterId: question.chapterId || null,
      knowledgePointIds: Array.isArray(question.knowledgePointIds)
        ? question.knowledgePointIds.slice()
        : [],
      type: question.type || null,
      difficulty: question.difficulty || null,
      sourcePage: question.sourcePage || null,

      userAnswer: userAnswer == null ? "" : String(userAnswer),
      isCorrect: Boolean(isCorrect),
      answeredAt: nowMs(),
      durationMs: Number(durationMs || 0),
    };

    return addAttempt(attempt);
  }

  function clearAttempts() {
    writeJson(state.keys.attempts, []);
  }

  function getMistakes() {
    return readJson(state.keys.mistakes, []);
  }

  function hasMistake(questionId) {
    return getMistakes().some((m) => m.questionId === questionId);
  }

  function addMistake(questionId) {
    const id = String(questionId || "").trim();
    if (!id) throw new Error("addMistake: questionId 不能为空");
    const mistakes = getMistakes();
    if (mistakes.some((m) => m.questionId === id)) return mistakes;
    mistakes.push({ questionId: id, addedAt: nowMs() });
    writeJson(state.keys.mistakes, mistakes);
    return mistakes;
  }

  function removeMistake(questionId) {
    const id = String(questionId || "").trim();
    const mistakes = getMistakes().filter((m) => m.questionId !== id);
    writeJson(state.keys.mistakes, mistakes);
    return mistakes;
  }

  function toggleMistake(questionId) {
    return hasMistake(questionId) ? removeMistake(questionId) : addMistake(questionId);
  }

  function clearMistakes() {
    writeJson(state.keys.mistakes, []);
  }

  function getSettings() {
    return readJson(state.keys.settings, {});
  }

  function setSettings(partialSettings) {
    const current = getSettings();
    const next = { ...current, ...(partialSettings || {}) };
    writeJson(state.keys.settings, next);
    return next;
  }

  function getSession() {
    return readJson(state.keys.session, null);
  }

  function setSession(sessionData) {
    writeJson(state.keys.session, sessionData || null);
    return sessionData || null;
  }

  function clearSession() {
    writeJson(state.keys.session, null);
  }

  function toDateKey(timestampMs) {
    const date = new Date(Number(timestampMs || 0));
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  function calculateStats({ attempts } = {}) {
    const attemptList = Array.isArray(attempts) ? attempts : getAttempts();

    const summary = {
      total: 0,
      correct: 0,
      accuracy: 0,
    };

    const byChapter = {};
    const byKnowledgePoint = {};
    const byType = {};
    const byDay = {};

    function accBucket(map, key) {
      if (!key) return null;
      if (!map[key]) map[key] = { total: 0, correct: 0, accuracy: 0 };
      return map[key];
    }

    for (const attempt of attemptList) {
      summary.total += 1;
      if (attempt.isCorrect) summary.correct += 1;

      const chapterBucket = accBucket(byChapter, attempt.chapterId);
      if (chapterBucket) {
        chapterBucket.total += 1;
        if (attempt.isCorrect) chapterBucket.correct += 1;
      }

      const typeBucket = accBucket(byType, attempt.type);
      if (typeBucket) {
        typeBucket.total += 1;
        if (attempt.isCorrect) typeBucket.correct += 1;
      }

      for (const kpId of attempt.knowledgePointIds || []) {
        const kpBucket = accBucket(byKnowledgePoint, kpId);
        if (!kpBucket) continue;
        kpBucket.total += 1;
        if (attempt.isCorrect) kpBucket.correct += 1;
      }

      const dayKey = toDateKey(attempt.answeredAt);
      if (!byDay[dayKey]) byDay[dayKey] = { total: 0, correct: 0, accuracy: 0 };
      byDay[dayKey].total += 1;
      if (attempt.isCorrect) byDay[dayKey].correct += 1;
    }

    function finalizeBuckets(map) {
      for (const key of Object.keys(map)) {
        const bucket = map[key];
        bucket.accuracy = bucket.total ? bucket.correct / bucket.total : 0;
      }
    }

    summary.accuracy = summary.total ? summary.correct / summary.total : 0;
    finalizeBuckets(byChapter);
    finalizeBuckets(byKnowledgePoint);
    finalizeBuckets(byType);
    finalizeBuckets(byDay);

    return {
      summary,
      byChapter,
      byKnowledgePoint,
      byType,
      byDay,
    };
  }

  function getWeakKnowledgePoints({ topN = 5, minAttempts = 3 } = {}) {
    const { byKnowledgePoint } = calculateStats();
    const rows = Object.entries(byKnowledgePoint)
      .map(([knowledgePointId, bucket]) => ({
        knowledgePointId,
        total: bucket.total,
        correct: bucket.correct,
        accuracy: bucket.accuracy,
      }))
      .filter((row) => row.total >= Number(minAttempts || 0))
      .sort((a, b) => {
        if (a.accuracy !== b.accuracy) return a.accuracy - b.accuracy;
        return b.total - a.total;
      });
    return rows.slice(0, Number(topN || 5));
  }

  function resetAll() {
    window.localStorage.removeItem(state.keys.attempts);
    window.localStorage.removeItem(state.keys.mistakes);
    window.localStorage.removeItem(state.keys.settings);
    window.localStorage.removeItem(state.keys.session);
  }

  window.StorageService = {
    setSubject,
    getSubject,
    KEYS: state.keys,

    getAttempts,
    recordAnswer,
    clearAttempts,

    getMistakes,
    hasMistake,
    addMistake,
    removeMistake,
    toggleMistake,
    clearMistakes,

    getSettings,
    setSettings,

    getSession,
    setSession,
    clearSession,

    calculateStats,
    getWeakKnowledgePoints,

    resetAll,
  };
})();
