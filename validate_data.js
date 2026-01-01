#!/usr/bin/env node
const fs = require("fs");
const vm = require("vm");

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exit(1);
}

function parseRange(text) {
  const match = String(text || "").trim().match(/^(\d+)\s*-\s*(\d+)$/);
  if (!match) return null;
  const start = Number(match[1]);
  const end = Number(match[2]);
  if (!Number.isInteger(start) || !Number.isInteger(end) || start > end) return null;
  return { start, end };
}

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

function validateKnowledge(knowledge) {
  if (!knowledge || typeof knowledge !== "object") fail("knowledge: root is not an object");
  if (typeof knowledge.course !== "string" || !knowledge.course.trim()) fail("knowledge.course missing");
  if (!Array.isArray(knowledge.chapters) || !knowledge.chapters.length) fail("knowledge.chapters missing");

  const chapterIds = new Set();
  const kpIds = new Set();
  let kpCount = 0;

  for (const [chapterIndex, chapter] of knowledge.chapters.entries()) {
    const prefix = `knowledge.chapters[${chapterIndex}]`;
    if (typeof chapter.id !== "string" || !/^ch\d{3}$/.test(chapter.id)) fail(`${prefix}.id invalid`);
    if (chapterIds.has(chapter.id)) fail(`${prefix}.id duplicate: ${chapter.id}`);
    chapterIds.add(chapter.id);

    if (typeof chapter.name !== "string" || !chapter.name.trim()) fail(`${prefix}.name missing`);
    const chapterRange = parseRange(chapter.pageRange);
    if (!chapterRange) fail(`${prefix}.pageRange invalid`);

    if (!Array.isArray(chapter.knowledgePoints) || !chapter.knowledgePoints.length) {
      fail(`${prefix}.knowledgePoints missing`);
    }

    for (const [kpIndex, kp] of chapter.knowledgePoints.entries()) {
      const kprefix = `${prefix}.knowledgePoints[${kpIndex}]`;
      if (typeof kp.id !== "string" || !/^kp\d{3}$/.test(kp.id)) fail(`${kprefix}.id invalid`);
      if (kpIds.has(kp.id)) fail(`${kprefix}.id duplicate: ${kp.id}`);
      kpIds.add(kp.id);

      if (typeof kp.name !== "string" || !kp.name.trim()) fail(`${kprefix}.name missing`);
      const kpRange = parseRange(kp.pageRange);
      if (!kpRange) fail(`${kprefix}.pageRange invalid`);
      if (kpRange.start < chapterRange.start || kpRange.end > chapterRange.end) {
        fail(`${kprefix}.pageRange out of chapter range`);
      }

      if (typeof kp.definition !== "string" || !kp.definition.trim()) fail(`${kprefix}.definition missing`);
      if (!Array.isArray(kp.keyPoints) || kp.keyPoints.length < 3 || kp.keyPoints.length > 5) {
        fail(`${kprefix}.keyPoints length invalid`);
      }
      if (!Array.isArray(kp.misconceptions) || kp.misconceptions.length < 1 || kp.misconceptions.length > 3) {
        fail(`${kprefix}.misconceptions length invalid`);
      }
      kpCount += 1;
    }
  }

  return { chapters: knowledge.chapters.length, knowledgePoints: kpCount };
}

function validateQuestions({ knowledge, questionsData }) {
  if (!questionsData || typeof questionsData !== "object") fail("questions: root is not an object");
  const questions = Array.isArray(questionsData.questions) ? questionsData.questions : null;
  if (!questions) fail("questions.questions missing");

  const chapterById = new Map();
  const kpById = new Map();
  for (const chapter of knowledge.chapters) {
    chapterById.set(chapter.id, { range: parseRange(chapter.pageRange) });
    for (const kp of chapter.knowledgePoints || []) {
      kpById.set(kp.id, { chapterId: chapter.id });
    }
  }

  const allowedTypes = new Set(["选择题", "判断题", "填空题", "简答题", "计算题"]);
  const difficultyCount = { 简单: 0, 中等: 0, 困难: 0 };
  const perChapter = new Map();
  const usedKp = new Set();
  const seenIds = new Set();

  function ensureChapterStats(chapterId) {
    if (!perChapter.has(chapterId)) {
      perChapter.set(chapterId, { choice: 0, judge: 0, fill: 0, short: 0, calc: 0, total: 0 });
    }
    return perChapter.get(chapterId);
  }

  for (const [i, q] of questions.entries()) {
    const prefix = `questions[${i}]`;
    if (typeof q.id !== "string" || !/^q\d{3}$/.test(q.id)) fail(`${prefix}.id invalid`);
    if (seenIds.has(q.id)) fail(`${prefix}.id duplicate: ${q.id}`);
    seenIds.add(q.id);

    if (typeof q.type !== "string" || !allowedTypes.has(q.type)) fail(`${prefix}.type invalid`);
    if (typeof q.difficulty !== "string" || !(q.difficulty in difficultyCount)) fail(`${prefix}.difficulty invalid`);
    difficultyCount[q.difficulty] += 1;

    if (typeof q.chapterId !== "string" || !chapterById.has(q.chapterId)) fail(`${prefix}.chapterId invalid`);
    const { range } = chapterById.get(q.chapterId);
    if (!Number.isInteger(q.sourcePage)) fail(`${prefix}.sourcePage not integer`);
    if (q.sourcePage < range.start || q.sourcePage > range.end) fail(`${prefix}.sourcePage out of chapter range`);

    if (!Array.isArray(q.knowledgePointIds) || !q.knowledgePointIds.length) fail(`${prefix}.knowledgePointIds missing`);
    for (const kpId of q.knowledgePointIds) {
      if (!kpById.has(kpId)) fail(`${prefix}.knowledgePointId invalid: ${kpId}`);
      if (kpById.get(kpId).chapterId !== q.chapterId) fail(`${prefix}.knowledgePointId chapter mismatch`);
      usedKp.add(kpId);
    }

    if (typeof q.content !== "string" || !q.content.trim()) fail(`${prefix}.content missing`);
    if (typeof q.answer !== "string" || !q.answer.trim()) fail(`${prefix}.answer missing`);
    if (typeof q.explanation !== "string" || !q.explanation.trim()) fail(`${prefix}.explanation missing`);

    if (q.type === "选择题") {
      if (!Array.isArray(q.options) || q.options.length !== 4) fail(`${prefix}.options must have 4 items`);
      if (!["A", "B", "C", "D"].includes(q.answer)) fail(`${prefix}.answer invalid for 选择题`);
    } else if ("options" in q) {
      fail(`${prefix}.options should not exist for ${q.type}`);
    }

    if (q.type === "判断题" && !["对", "错"].includes(q.answer)) fail(`${prefix}.answer invalid for 判断题`);
    if (q.type === "填空题" && !String(q.content).includes("______")) fail(`${prefix}.填空题 missing blanks`);

    const stats = ensureChapterStats(q.chapterId);
    stats.total += 1;
    if (q.type === "选择题") stats.choice += 1;
    else if (q.type === "判断题") stats.judge += 1;
    else if (q.type === "填空题") stats.fill += 1;
    else if (q.type === "简答题") stats.short += 1;
    else if (q.type === "计算题") stats.calc += 1;
  }

  // Ensure sequential IDs (q001..qNNN)
  const ids = [...seenIds].sort();
  for (let idx = 1; idx <= ids.length; idx += 1) {
    const expected = `q${String(idx).padStart(3, "0")}`;
    if (ids[idx - 1] !== expected) fail(`question id sequence gap: expected ${expected}, got ${ids[idx - 1]}`);
  }

  // Per-chapter quotas (as required by the project tasks)
  function getExpectedCounts(chapterId) {
    const num = Number(String(chapterId || "").replace(/^ch/, ""));
    if (Number.isFinite(num) && num >= 11) {
      return { choice: 3, judge: 2, fill: 1, short: 1, calc: 1, total: 8 };
    }
    return { choice: 4, judge: 2, fill: 2, short: 1, calc: 1, total: 10 };
  }

  for (const chapter of knowledge.chapters) {
    const stats = perChapter.get(chapter.id);
    if (!stats) fail(`chapter ${chapter.id} has no questions`);
    const expected = getExpectedCounts(chapter.id);
    const ok =
      stats.choice === expected.choice &&
      stats.judge === expected.judge &&
      stats.fill === expected.fill &&
      stats.short === expected.short &&
      stats.calc === expected.calc &&
      stats.total === expected.total;
    if (!ok) {
      fail(
        `chapter ${chapter.id} counts mismatch: expected ${JSON.stringify(expected)}, got ${JSON.stringify(stats)}`,
      );
    }
  }

  // Coverage: every knowledgePointId must be used at least once
  const allKp = [...kpById.keys()];
  const uncovered = allKp.filter((id) => !usedKp.has(id));
  if (uncovered.length) fail(`uncovered knowledgePointIds: ${uncovered.join(", ")}`);

  return { questions: questions.length, difficultyCount };
}

function validateSeed({ knowledge, questionsData }) {
  const code = fs.readFileSync("project/js/data_seed.js", "utf8");
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(code, ctx);

  const seed = ctx.window.__EM_APP_SEED__;
  if (!seed || !seed.knowledge || !seed.questions) fail("data_seed.js: window.__EM_APP_SEED__ missing or invalid");

  const seedCourse = seed.knowledge.course;
  const jsonCourse = knowledge.course;
  if (seedCourse !== jsonCourse) fail(`data_seed.js: course mismatch: seed=${seedCourse} json=${jsonCourse}`);

  const seedCount = Array.isArray(seed.questions.questions) ? seed.questions.questions.length : 0;
  const jsonCount = Array.isArray(questionsData.questions) ? questionsData.questions.length : 0;
  if (seedCount !== jsonCount) fail(`data_seed.js: question count mismatch: seed=${seedCount} json=${jsonCount}`);

  return { course: seedCourse, questions: seedCount };
}

function validateNotesSeed({ knowledge }) {
  const code = fs.readFileSync("project/js/notes_seed.js", "utf8");
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(code, ctx);

  const seed = ctx.window.__EM_NOTES_SEED__;
  if (!seed || !Array.isArray(seed.pages)) fail("notes_seed.js: window.__EM_NOTES_SEED__ missing or invalid");

  const seedCourse = seed.course;
  const jsonCourse = knowledge.course;
  if (seedCourse !== jsonCourse) fail(`notes_seed.js: course mismatch: seed=${seedCourse} json=${jsonCourse}`);

  const totalPages = Number(seed.totalPages);
  if (!Number.isInteger(totalPages) || totalPages <= 0) fail("notes_seed.js: totalPages invalid");
  if (seed.pages.length !== totalPages) {
    fail(`notes_seed.js: pages length mismatch: pages=${seed.pages.length} totalPages=${totalPages}`);
  }

  const chapterById = new Map();
  const kpById = new Map();
  for (const chapter of knowledge.chapters) {
    chapterById.set(chapter.id, { range: parseRange(chapter.pageRange) });
    for (const kp of chapter.knowledgePoints || []) {
      kpById.set(kp.id, { chapterId: chapter.id, range: parseRange(kp.pageRange) });
    }
  }

  const seenPages = new Set();
  for (const [i, page] of seed.pages.entries()) {
    const prefix = `notes.pages[${i}]`;
    const n = Number(page.page);
    if (!Number.isInteger(n)) fail(`${prefix}.page not integer`);
    if (n < 1 || n > totalPages) fail(`${prefix}.page out of range`);
    if (seenPages.has(n)) fail(`${prefix}.page duplicate: ${n}`);
    seenPages.add(n);

    if (typeof page.chapterId !== "string" || !chapterById.has(page.chapterId)) fail(`${prefix}.chapterId invalid`);
    const chapterRange = chapterById.get(page.chapterId).range;
    if (!chapterRange) fail(`${prefix}.chapterRange invalid`);
    if (n < chapterRange.start || n > chapterRange.end) fail(`${prefix}.page out of chapter range`);

    if (typeof page.knowledgePointId !== "string" || !kpById.has(page.knowledgePointId)) {
      fail(`${prefix}.knowledgePointId invalid`);
    }
    const kp = kpById.get(page.knowledgePointId);
    if (kp.chapterId !== page.chapterId) fail(`${prefix}.knowledgePointId chapter mismatch`);
    if (!kp.range) fail(`${prefix}.knowledgePointRange invalid`);
    if (n < kp.range.start || n > kp.range.end) fail(`${prefix}.page out of knowledgePoint range`);

    if (typeof page.content !== "string") fail(`${prefix}.content not string`);
  }

  for (let i = 1; i <= totalPages; i += 1) {
    if (!seenPages.has(i)) fail(`notes_seed.js: missing page ${i}`);
  }

  return { pages: seed.pages.length, totalPages };
}

function main() {
  const knowledge = readJson("project/data/physics/knowledge.json");
  const questionsData = readJson("project/data/physics/questions.json");

  const knowledgeStats = validateKnowledge(knowledge);
  const questionStats = validateQuestions({ knowledge, questionsData });
  const seedStats = validateSeed({ knowledge, questionsData });
  const notesStats = validateNotesSeed({ knowledge });

  console.log("OK");
  console.log(`course: ${seedStats.course}`);
  console.log(`chapters: ${knowledgeStats.chapters}, knowledgePoints: ${knowledgeStats.knowledgePoints}`);
  console.log(`questions: ${questionStats.questions}`);
  console.log(`notes: ${notesStats.pages} pages`);
  console.log(`difficulty: ${JSON.stringify(questionStats.difficultyCount)}`);
}

main();
