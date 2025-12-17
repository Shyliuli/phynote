#!/usr/bin/env node
const fs = require("fs");

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exit(1);
}

function readText(path) {
  try {
    return fs.readFileSync(path, "utf8");
  } catch (err) {
    fail(`cannot read ${path}: ${String(err)}`);
  }
}

function normalizeNewlines(text) {
  return String(text || "").replaceAll("\r\n", "\n");
}

function getPartStartIndex(markdown, partLabel) {
  const re = new RegExp(`^##\\s+${partLabel}部分`, "m");
  const idx = markdown.search(re);
  return idx >= 0 ? idx : null;
}

function splitIntoUnits(text) {
  const lines = normalizeNewlines(text).split("\n");
  const units = [];
  let buffer = [];
  let inFence = false;
  let inMathBlock = false;

  function flush() {
    const joined = buffer.join("\n").trim();
    if (joined) units.push(joined);
    buffer = [];
  }

  for (const line of lines) {
    const trimmed = line.trimEnd();
    const t = trimmed.trim();

    // fenced code block
    if (t.startsWith("```")) {
      if (inFence) {
        buffer.push(trimmed);
        inFence = false;
        flush();
      } else {
        flush();
        buffer.push(trimmed);
        inFence = true;
      }
      continue;
    }

    if (inFence) {
      buffer.push(trimmed);
      continue;
    }

    // $$ math block
    if (t === "$$") {
      if (inMathBlock) {
        buffer.push(trimmed);
        inMathBlock = false;
        flush();
      } else {
        flush();
        buffer.push(trimmed);
        inMathBlock = true;
      }
      continue;
    }

    if (inMathBlock) {
      buffer.push(trimmed);
      continue;
    }

    const isHeading = /^#{1,6}\s+/.test(t);
    const isSeparator = /^---+$/.test(t);

    if (isHeading || isSeparator) {
      flush();
      if (isHeading) {
        units.push(trimmed);
      }
      continue;
    }

    if (!t) {
      flush();
      continue;
    }

    buffer.push(trimmed);
  }

  flush();
  return units;
}

function findNearestSplitIndex(text, desiredIndex, windowSize, predicate) {
  const left = Math.max(0, desiredIndex - windowSize);
  const right = Math.min(text.length - 1, desiredIndex + windowSize);
  for (let offset = 0; offset <= windowSize; offset += 1) {
    const i1 = desiredIndex - offset;
    const i2 = desiredIndex + offset;
    if (i1 >= left && predicate(text[i1], i1)) return i1;
    if (i2 <= right && predicate(text[i2], i2)) return i2;
  }
  return null;
}

function splitUnitOnce(unit) {
  const text = String(unit || "").trim();
  if (!text) return null;
  if (text.length < 240) return null;
  if (/^#{1,6}\s+/.test(text)) return null;
  if (text.startsWith("```") || text === "$$") return null;

  const mid = Math.floor(text.length / 2);

  const newlineIdx = findNearestSplitIndex(text, mid, 220, (ch) => ch === "\n");
  if (newlineIdx != null && newlineIdx > 10 && newlineIdx < text.length - 10) {
    const a = text.slice(0, newlineIdx).trim();
    const b = text.slice(newlineIdx + 1).trim();
    if (a && b) return [a, b];
  }

  // Prefer splitting at sentence boundaries to avoid breaking a sentence into fragments.
  const punctSet = new Set(["。", "！", "？", "；", ";", ".", "!", "?"]);
  const punctIdx = findNearestSplitIndex(
    text,
    mid,
    180,
    (ch, i) => punctSet.has(ch) && i > 10 && i < text.length - 10,
  );
  if (punctIdx != null) {
    const a = text.slice(0, punctIdx + 1).trim();
    const b = text.slice(punctIdx + 1).trim();
    if (a && b) return [a, b];
  }

  return null;
}

function ensureMinUnitCount(units, minCount) {
  const result = units.slice();
  if (result.length >= minCount) return result;

  const maxIters = minCount * 12;
  let iter = 0;
  while (result.length < minCount && iter < maxIters) {
    iter += 1;
    let bestIndex = -1;
    let bestLen = 0;
    for (let i = 0; i < result.length; i += 1) {
      const u = result[i];
      const len = String(u || "").length;
      if (len > bestLen) {
        bestLen = len;
        bestIndex = i;
      }
    }
    if (bestIndex < 0) break;
    const split = splitUnitOnce(result[bestIndex]);
    if (!split) break;
    result.splice(bestIndex, 1, split[0], split[1]);
  }
  return result;
}

function distributeUnitsEvenly(units, groupCount) {
  const safeCount = Math.max(1, Number(groupCount || 0));
  if (safeCount === 1) return [units.slice()];

  const totalChars = units.reduce((sum, u) => sum + String(u || "").length, 0) || 1;
  const target = Math.max(1, Math.round(totalChars / safeCount));

  const groups = [];
  let unitIndex = 0;

  for (let i = 0; i < safeCount; i += 1) {
    const remainingGroups = safeCount - i;
    const remainingUnits = units.length - unitIndex;
    const mustLeave = remainingGroups - 1;
    const maxTake = Math.max(1, remainingUnits - mustLeave);

    const group = [];
    let acc = 0;
    while (unitIndex < units.length && group.length < maxTake) {
      const u = units[unitIndex];
      group.push(u);
      acc += String(u || "").length;
      unitIndex += 1;
      if (acc >= target && group.length >= 1 && (units.length - unitIndex) >= mustLeave) break;
    }
    groups.push(group);
  }

  // Sanity: ensure non-empty groups.
  for (const g of groups) {
    if (!g.length) fail("internal: empty unit group generated");
  }

  return groups;
}

function paginateUnits(units, capacity) {
  const pages = [];
  let idx = 0;
  const cap = Math.max(40, Number(capacity || 0));

  while (idx < units.length) {
    const pageUnits = [];
    let acc = 0;

    while (idx < units.length) {
      const next = units[idx];
      const nextLen = String(next || "").length;
      if (pageUnits.length > 0 && acc + nextLen > cap) break;
      pageUnits.push(next);
      acc += nextLen;
      idx += 1;
    }

    if (!pageUnits.length) {
      // Fallback: ensure progress even if a single unit is larger than cap.
      pageUnits.push(units[idx]);
      idx += 1;
    }

    pages.push(pageUnits);
  }

  return pages;
}

function writeJson(path, obj) {
  fs.writeFileSync(path, `${JSON.stringify(obj, null, 2)}\n`, "utf8");
}

function writeAppSeed({ knowledge, questionsData, outPath }) {
  const output = `// Auto-generated from project/data/knowledge.json and project/data/questions.json.\n// If you update the JSON files, re-generate this file so the app can run via file:// without fetch/CORS.\n(function () {\n  window.__EM_APP_SEED__ = {\n    knowledge: ${JSON.stringify(knowledge)},\n    questions: ${JSON.stringify(questionsData)},\n  };\n})();\n`;
  fs.writeFileSync(outPath, output, "utf8");
}

function main() {
  const knowledgePath = "project/data/knowledge.json";
  const questionsPath = "project/data/questions.json";
  const markdownPath = "input/电磁学.md";
  const outNotesSeedPath = "project/js/notes_seed.js";
  const outAppSeedPath = "project/js/data_seed.js";

  const knowledge = JSON.parse(readText(knowledgePath));
  const questionsData = JSON.parse(readText(questionsPath));
  const markdown = normalizeNewlines(readText(markdownPath));

  if (!knowledge || !Array.isArray(knowledge.chapters) || !knowledge.chapters.length) {
    fail(`invalid knowledge: ${knowledgePath}`);
  }
  if (!questionsData || !Array.isArray(questionsData.questions)) {
    fail(`invalid questions: ${questionsPath}`);
  }

  const orderedChapters = knowledge.chapters.slice();
  if (orderedChapters.length !== 10) fail(`expected 10 chapters, got ${orderedChapters.length}`);

  // Build chapter slices based on markdown “第X部分” headings (第2~10部分作为边界).
  const chapterStart = new Map();
  chapterStart.set("ch001", 0);
  const partLabels = ["第二", "第三", "第四", "第五", "第六", "第七", "第八", "第九", "第十"];
  const chapterIds = ["ch002", "ch003", "ch004", "ch005", "ch006", "ch007", "ch008", "ch009", "ch010"];
  for (let i = 0; i < partLabels.length; i += 1) {
    const idx = getPartStartIndex(markdown, partLabels[i]);
    if (idx == null) {
      fail(`cannot find heading for ${partLabels[i]}部分 in ${markdownPath}`);
    }
    chapterStart.set(chapterIds[i], idx);
  }

  // Page capacity (roughly based on plain-text characters). Larger => fewer pages.
  const PAGE_CAPACITY = 320;

  const pages = [];
  const kpById = new Map();
  for (const chapter of orderedChapters) {
    for (const kp of chapter.knowledgePoints || []) {
      kpById.set(kp.id, { chapterId: chapter.id });
    }
  }

  for (let cIndex = 0; cIndex < orderedChapters.length; cIndex += 1) {
    const chapter = orderedChapters[cIndex];
    const startIdx = chapterStart.get(chapter.id);
    if (startIdx == null) fail(`missing chapter start index for ${chapter.id}`);

    const nextChapterId = orderedChapters[cIndex + 1]?.id;
    const endIdx = nextChapterId ? chapterStart.get(nextChapterId) : markdown.length;
    if (endIdx == null) fail(`missing next chapter start index for ${nextChapterId}`);
    if (endIdx < startIdx) fail(`chapter boundary reversed for ${chapter.id}`);

    const chapterText = markdown.slice(startIdx, endIdx).trim();
    let baseUnits = splitIntoUnits(chapterText);
    if (!baseUnits.length) fail(`chapter ${chapter.id} has no content after splitting`);

    const kps = Array.isArray(chapter.knowledgePoints) ? chapter.knowledgePoints : [];
    if (!kps.length) fail(`chapter ${chapter.id} has no knowledgePoints`);

    // Ensure we can allocate at least one unit per knowledge point.
    baseUnits = ensureMinUnitCount(baseUnits, kps.length);

    const kpUnitGroups = distributeUnitsEvenly(baseUnits, kps.length);

    const chapterStartPage = pages.length ? pages[pages.length - 1].page + 1 : 1;
    let chapterEndPage = chapterStartPage - 1;

    for (let kpIndex = 0; kpIndex < kps.length; kpIndex += 1) {
      const kp = kps[kpIndex];
      const kpUnits = kpUnitGroups[kpIndex] || [];
      if (!kpUnits.length) fail(`chapter ${chapter.id} generated empty kp units: ${kp.id}`);

      const kpStartPage = pages.length ? pages[pages.length - 1].page + 1 : 1;
      const kpPages = paginateUnits(kpUnits, PAGE_CAPACITY);
      if (!kpPages.length) fail(`chapter ${chapter.id} has no pages for kp ${kp.id}`);

      for (const pageUnits of kpPages) {
        const pageNumber = pages.length ? pages[pages.length - 1].page + 1 : 1;
        const content = pageUnits.join("\n\n").trim();
        pages.push({
          page: pageNumber,
          chapterId: chapter.id,
          chapterName: chapter.name,
          knowledgePointId: kp.id,
          knowledgePointName: kp.name,
          content,
        });
        chapterEndPage = pageNumber;
      }

      const kpEndPage = pages.length ? pages[pages.length - 1].page : kpStartPage;
      kp.pageRange = kpStartPage === kpEndPage ? `${kpStartPage}-${kpEndPage}` : `${kpStartPage}-${kpEndPage}`;
    }

    if (chapterEndPage < chapterStartPage) fail(`chapter ${chapter.id} ended before it started`);
    chapter.pageRange =
      chapterStartPage === chapterEndPage ? `${chapterStartPage}-${chapterEndPage}` : `${chapterStartPage}-${chapterEndPage}`;
  }

  // Ensure page numbers are continuous (1..N).
  for (let i = 0; i < pages.length; i += 1) {
    const expected = i + 1;
    if (pages[i].page !== expected) fail(`page sequence mismatch at index ${i}: expected ${expected}, got ${pages[i].page}`);
  }

  const kpRangeById = new Map();
  for (const chapter of orderedChapters) {
    for (const kp of chapter.knowledgePoints || []) {
      const [a, b] = String(kp.pageRange || "").split("-").map((x) => Number(x));
      if (!Number.isInteger(a) || !Number.isInteger(b) || a > b) fail(`invalid generated kp.pageRange for ${kp.id}`);
      kpRangeById.set(kp.id, { start: a, end: b, chapterId: chapter.id });
    }
  }

  // Update question sourcePage to match the new knowledge-point page mapping.
  for (const q of questionsData.questions) {
    const firstKp = Array.isArray(q.knowledgePointIds) ? q.knowledgePointIds[0] : null;
    if (!firstKp || !kpRangeById.has(firstKp)) fail(`question ${q.id} has invalid knowledgePointIds`);
    const r = kpRangeById.get(firstKp);
    if (r.chapterId !== q.chapterId) fail(`question ${q.id} chapter mismatch with kp ${firstKp}`);
    q.sourcePage = r.start;
  }

  const seed = {
    source: "input/电磁学.md",
    course: knowledge.course || "课程",
    totalPages: pages.length,
    pages,
  };

  const notesSeedOutput = `// Auto-generated from ${markdownPath} and project/data/knowledge.json. DO NOT EDIT.\n(function () {\n  window.__EM_NOTES_SEED__ = ${JSON.stringify(
    seed,
    null,
    2,
  )};\n})();\n`;

  writeJson(knowledgePath, knowledge);
  writeJson(questionsPath, questionsData);
  fs.writeFileSync(outNotesSeedPath, notesSeedOutput, "utf8");
  writeAppSeed({ knowledge, questionsData, outPath: outAppSeedPath });

  console.log("OK");
  console.log(`- updated: ${knowledgePath}`);
  console.log(`- updated: ${questionsPath}`);
  console.log(`- wrote: ${outAppSeedPath}`);
  console.log(`- wrote: ${outNotesSeedPath} (pages=${pages.length}, capacity=${PAGE_CAPACITY})`);
}

main();
