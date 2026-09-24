const DATA = window.KMF_STUDY_DATA;
const TEXT_DATA = window.KMF_TEXT_DATA || {};
const STATIC_TRANSLATIONS = window.KMF_TRANSLATIONS || {};
const GRE_WORDS = window.GRE_WORDS || [];
const GRE_GLOSSARY = window.GRE_GLOSSARY || {};
const params = new URLSearchParams(window.location.search);
const requestedType = params.get("type");
const type = DATA.types[requestedType] ? requestedType : Object.keys(DATA.types)[0];
const config = DATA.types[type];
const typeQuestions = DATA.questions.filter(question => question.type === type);
const STORAGE_KEY = `kmf-verbal-${type}-state-v1`;
const COMPLETED_KEY = "kmf-verbal-completed-v1";
const QUESTION_OVERRIDES = {
  "triple-blank-b42f66a0cd66": {
    stem: "Japan's first university was more (i) {blank} than its Chinese counterparts in the same era, since the Chinese Tang system was highly (ii) {blank}. However, this changed over time. As Japanese court offices became increasingly hereditary, the examination system, by which students from a wide range of social classes were admitted into the universities, (iii) {blank}.",
    groups: [
      ["prestigious", "egalitarian", "profitable"],
      ["aristocratic", "reputable", "unsystematic"],
      ["became widely utilized", "advantaged the proletariat", "atrophied into insignificance"]
    ]
  },
  "triple-blank-8ca0d1a42366": {
    stem: "Schechter is atypically (i) {blank} the film version of Stephen King's horror novel The Shining because the qualities for which the majority of other critics have approved it (its artful camera work and so on) get in the way of narrative and render the story less, rather than more, (ii) {blank} than other films of the same genre. This is not (iii) {blank} view, and we must be grateful to Schechter for putting it forward.",
    groups: [
      ["unimpressed with", "confused by", "enamored of"],
      ["heartbreaking", "comical", "terrifying"],
      ["a commonplace", "a superior", "an unfamiliar"]
    ]
  },
  "text-completion-d33975419c8e": {
    stem: "Schechter is atypically (i) {blank} the film version of Stephen King's horror novel The Shining because the qualities for which the majority of other critics have approved it (its artful camera work and so on) get in the way of narrative and render the story less, rather than more, (ii) {blank} than other films of the same genre. This is not (iii) {blank} view, and we must be grateful to Schechter for putting it forward.",
    groups: [
      ["unimpressed with", "confused by", "enamored of"],
      ["heartbreaking", "comical", "terrifying"],
      ["a commonplace", "a superior", "an unfamiliar"]
    ]
  }
};
const READING_OVERRIDES = {
  "long-reading-b4e4d5e5a56c": {
    passage: "Julie Roy Jeffrey's recent book The Great Silent Army of Abolitionism shows how women participated in all aspects of the antislavery movement in the United States, from its inception in the early 1830s through the end of the Civil War (1861-1865). While scholars have already pointed out the importance of women's work in early abolitionist circles, especially in spreading a grassroots antislavery message through the constant and tireless circulation of petitions, Jeffery disputes certain aspects of the traditional account of their participation. For example, even though the abolitionist movement split into political and nonpolitical wings at the end of the 1830s and women were largely relegated to the less politicized faction, Jeffery does not accept the view that women's participation became marginalized as a result. She demonstrates that women found numerous ways to persist effectively in the cause, such as by organizing the antislavery fundraising fairs of the 1840s. She also disputes the notion that African American women were relegated to secondary positions in the largely White movement. Their own abolitionist societies, she argues, often responded to the crises of the pre-Civil War decades, such as the Fugitive Slave Law, more directly than did integrated abolitionist groups.",
    prompt: "The passage is primarily concerned with",
    choices: [
      "using specific examples to illustrate certain shortcomings in historians' traditional approach to a particular historical period",
      "outlining the issues underlying a debate among scholars about a particular historical period",
      "considering the work of a particular scholar on a certain subject in contrast to other work on the same subject",
      "identifying some of the most important influences on a particular historian's recent work",
      "pointing out certain inconsistencies in a recent work about a particular historical period"
    ]
  },
  "long-reading-e73736b5e6f3": {
    passage: "Julie Roy Jeffrey's recent book The Great Silent Army of Abolitionism shows how women participated in all aspects of the antislavery movement in the United States, from its inception in the early 1830s through the end of the Civil War (1861-1865). While scholars have already pointed out the importance of women's work in early abolitionist circles, especially in spreading a grassroots antislavery message through the constant and tireless circulation of petitions, Jeffery disputes certain aspects of the traditional account of their participation. For example, even though the abolitionist movement split into political and nonpolitical wings at the end of the 1830s and women were largely relegated to the less politicized faction, Jeffery does not accept the view that women's participation became marginalized as a result. She demonstrates that women found numerous ways to persist effectively in the cause, such as by organizing the antislavery fundraising fairs of the 1840s. She also disputes the notion that African American women were relegated to secondary positions in the largely White movement. Their own abolitionist societies, she argues, often responded to the crises of the pre-Civil War decades, such as the Fugitive Slave Law, more directly than did integrated abolitionist groups.",
    prompt: "Which of the following is cited by the scholars as an example of the important work done by early abolitionist women?",
    choices: [
      "The organization of fund-raising fairs",
      "The campaign against the Fugitive Slave Law",
      "The integration of the abolitionist movement",
      "The circulation of antislavery petitions",
      "The formation of African American abolitionist societies"
    ]
  }
};
const COLON_AFTER_BLANK = new Set([
  "sentence-equivalence-0258f06856c3",
  "sentence-equivalence-2bd0ee717773",
  "sentence-equivalence-d06ea8cfb2d9",
  "sentence-equivalence-2a3db3b35875",
  "sentence-equivalence-4a4f48d178ac",
  "sentence-equivalence-92a79813670f",
  "sentence-equivalence-06ce5f8f2abe",
  "sentence-equivalence-59f1ba033171",
  "sentence-equivalence-021ab26af9b3",
  "sentence-equivalence-ea53209cb50f",
  "sentence-equivalence-0e13c4d83c67"
]);
const PUNCTUATION_AFTER_BLANK = {
  "sentence-equivalence-037f207e5a63": ["."],
  "sentence-equivalence-ce9d83ba23b2": ["."],
  "sentence-equivalence-bf9800cf2dbe": ["."],
  "single-blank-d2462635173a": ["."],
  "double-blank-46ad6423dcc1": [".", ""],
  "double-blank-b91cf2c52962": [".", ":"],
  "double-blank-822f6be4f08d": [".", ""],
  "double-blank-404f4e7b001b": [".", ""],
  "double-blank-e95ab0242f0b": [".", ""],
  "double-blank-c202933d3a66": [".", ""],
  "double-blank-9ebacf854341": ["", ";"],
  "triple-blank-9101e7e09ae3": [".", ".", ""],
  "triple-blank-bcb48624947c": ["", "", "."],
  "triple-blank-394b6616d6c8": [".", "", ""],
  "triple-blank-311470a6e86e": [".", "", ""],
  "triple-blank-44e8bdab60b9": ["", ".", ""],
  "triple-blank-a5286324e158": ["", ".", ""],
  "triple-blank-5efa7dad7ee9": ["", ".", ""],
  "triple-blank-5107d7f12392": ["", ".", ""],
  "triple-blank-a97204b559aa": ["", ".", ""],
  "triple-blank-58bf533b96c4": ["", ".", ""],
  "triple-blank-93d3cf64e742": [".", "", ""],
  "triple-blank-904b78943591": [".", "", ""],
  "triple-blank-a87c5fa2c0e1": [",", "", "."],
  "triple-blank-6c09364afce1": [".", "", ""],
  "triple-blank-41e40316a7d8": [".", "", ""],
  "triple-blank-484dfe7d894c": [".", "", ""],
  "triple-blank-e794b3e2c72f": ["", ".", ""],
  "triple-blank-3f5909a6aee8": [".", "", ""],
  "triple-blank-f517675f9600": ["", ".", ""],
  "triple-blank-60ebe85d67d9": ["", ".", ""],
  "text-completion-80b4342df310": ["", "", "."],
  "text-completion-d3d03e16ca95": ["", "."],
  "text-completion-b44ef0a40247": ["", ";"],
  "text-completion-45c781f001ed": ["", ".", ""],
  "text-completion-0754a53f9a11": ["", "", "."],
  "text-completion-48f25f113286": [".", "", ""],
  "text-completion-3b68864cfbc9": [".", ""],
  "text-completion-3f60bf7750b5": ["", ".", ""],
  "text-completion-1f91ac9e58be": [".", "", ""],
  "text-completion-efe23fc9b354": ["."],
  "text-completion-13706874dddf": [",", ""],
  "text-completion-fc94087ecfb5": [".", "", ""],
  "text-completion-b83a472078a9": [",", "."],
  "text-completion-19a0e7f5ae8e": ["."],
  "text-completion-3f873732ce96": [".", "", ""],
  "text-completion-990141f03169": ["", ".", ""],
  "text-completion-26e3c21d3863": ["", ".", ""],
  "text-completion-ed9a9c92e3c4": [".", "", ""],
  "text-completion-ccbcaf5b6667": ["", ".", ""],
  "text-completion-6d20136ceb41": [".", ""],
  "text-completion-f90eec93adcf": ["", "", "."],
  "text-completion-85cb4f165bac": [".", "", ""],
  "text-completion-6538fa5c0d6e": [".", "", ""]
};
const BLANK_AFTER_ROW = {
  "text-completion-b6f6e79dab68": [0]
};

let state = {
  level: "All",
  group: "All",
  currentId: null,
  answers: {},
  answerVisible: false
};
let filteredQuestions = [];
let currentIndex = 0;
let completed = loadCompleted();
let translatorPromise = null;
let explanationRequest = 0;
let vocabularyIndex = null;

const TRANSLATION_CACHE_KEY = "kmf-verbal-ko-translation-cache-v1";
const TRANSLATION_CACHE_LIMIT = 120;
const VOCABULARY_MEANING_OVERRIDES = {
  "yield to": "~에 굴복하다, ~에 따르다",
  "partiality": "편파성, 편애",
  "bias": "편견, 편향",
  "committed to": "~에 전념하는, ~을 굳게 지지하는",
  "politically neutral": "정치적으로 중립적인",
  "enterprise": "사업, 활동; 기업",
  "enemy nation": "적대국"
};
const READING_VOCABULARY_EXCLUDE = new Set([
  "according", "although", "approach", "because", "certain", "different", "everyone",
  "evidence", "example", "experience", "following", "however", "important", "increased",
  "indicates", "individual", "little", "mentioned", "possible", "question", "recent",
  "report", "researchers", "scientific", "scientists", "suggests", "temperature",
  "temperatures", "therefore", "warm"
]);

const el = id => document.getElementById(id);

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    level: state.level,
    group: state.group,
    currentId: filteredQuestions[currentIndex]?.id || null,
    answers: state.answers,
    answerVisible: state.answerVisible
  }));
}

function loadCompleted() {
  try {
    return new Set(JSON.parse(localStorage.getItem(COMPLETED_KEY)) || []);
  } catch {
    return new Set();
  }
}

function saveCompleted() {
  localStorage.setItem(COMPLETED_KEY, JSON.stringify([...completed]));
}

function naturalCompare(left, right) {
  return left.localeCompare(right, undefined, { numeric: true, sensitivity: "base" });
}

function unique(values) {
  return [...new Set(values)];
}

function option(value, label = value) {
  const item = document.createElement("option");
  item.value = value;
  item.textContent = label;
  return item;
}

function populateLevels(savedLevel) {
  const levels = unique(typeQuestions.map(question => question.level));
  el("levelSelect").replaceChildren();
  if (levels.length > 1 || levels[0] !== "All") el("levelSelect").append(option("All", "All difficulties"));
  levels.sort(naturalCompare).forEach(level => el("levelSelect").append(option(level)));
  el("levelControl").hidden = levels.length === 1 && levels[0] === "All";
  state.level = [...el("levelSelect").options].some(item => item.value === savedLevel) ? savedLevel : el("levelSelect").options[0]?.value || "All";
  el("levelSelect").value = state.level;
}

function populateGroups(savedGroup) {
  const inLevel = typeQuestions.filter(question => state.level === "All" || question.level === state.level);
  const groups = unique(inLevel.map(question => question.group)).sort(naturalCompare);
  el("groupSelect").replaceChildren(option("All", "All sets"));
  groups.forEach(group => el("groupSelect").append(option(group)));
  state.group = groups.includes(savedGroup) ? savedGroup : "All";
  el("groupSelect").value = state.group;
}

function applyFilters(preferredId = null) {
  filteredQuestions = typeQuestions.filter(question => {
    const levelMatches = state.level === "All" || question.level === state.level;
    const groupMatches = state.group === "All" || question.group === state.group;
    return levelMatches && groupMatches;
  });
  const preferredIndex = preferredId ? filteredQuestions.findIndex(question => question.id === preferredId) : -1;
  currentIndex = preferredIndex >= 0 ? preferredIndex : 0;
  renderQuestion();
}

function groupRows(lines) {
  const rows = [];
  [...lines].sort((left, right) => Math.abs(left.y - right.y) > .014 ? right.y - left.y : left.x - right.x).forEach(line => {
    const current = rows.at(-1);
    if (current && Math.abs(current.y - line.y) <= .014) {
      current.lines.push(line);
      current.y = (current.y + line.y) / 2;
    } else {
      rows.push({ y: line.y, lines: [line] });
    }
  });
  return rows.map(row => ({
    y: row.y,
    lines: row.lines.sort((left, right) => left.x - right.x)
  }));
}

function escapeHTML(value) {
  return String(value).replace(/[&<>\"]/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;"
  })[character]);
}

function cleanText(value) {
  return String(value)
    .replace(/\(\s*(?:lli|lll|111)\s*\)/gi, "(iii)")
    .replace(/\(\s*(?:li|ll|11)\s*\)/gi, "(ii)")
    .replace(/m\]/g, "rm")
    .replace(/n\]/g, "m")
    .replace(/^[Oo0•]\s+(?=[A-Za-z])/, "")
    .replace(/\bSource\]\s*/gi, "")
    .replace(/\bworkers, rights\b/gi, "workers' rights")
    .replace(/\bcelebrities, donations\b/gi, "celebrities' donations")
    .replace(/\bband width\b/gi, "bandwidth")
    .replace(/\bCDS\b/g, "CDs")
    .replace(/\bRamachandran[\"”]\s*s\b/g, "Ramachandran's")
    .replace(/\bsomethings\b/gi, "sometimes")
    .replace(/\bliterature\. there\b/g, "literature. There")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function rowText(row) {
  return cleanText(row.lines.map(line => line.t).join(" "));
}

function paragraphsFromLines(lines) {
  const rows = groupRows(lines);
  if (!rows.length) return [];
  const gaps = rows.slice(1).map((row, index) => rows[index].y - row.y).filter(gap => gap > .005);
  const typicalGap = gaps.length ? [...gaps].sort((a, b) => a - b)[Math.floor(gaps.length / 2)] : .05;
  const paragraphs = [];
  let current = [];
  rows.forEach((row, index) => {
    const previous = rows[index - 1];
    if (previous && previous.y - row.y > Math.max(.072, typicalGap * 1.55) && current.length) {
      paragraphs.push(cleanText(current.join(" ")));
      current = [];
    }
    current.push(rowText(row));
  });
  if (current.length) paragraphs.push(cleanText(current.join(" ")));
  return paragraphs;
}

function completionStemHTML(question, lines, blankCount) {
  const rows = groupRows(lines);
  const blankAfterRows = new Set(BLANK_AFTER_ROW[question.id] || []);
  const explicitBlankAfter = new Set();
  rows.forEach((row, rowIndex) => row.lines.forEach((line, lineIndex) => {
    if (/\((?:i{1,3}|l{1,3}|1{1,3})\)\s*$/i.test(cleanText(line.t)) || (blankAfterRows.has(rowIndex) && lineIndex === row.lines.length - 1)) {
      explicitBlankAfter.add(`${rowIndex}:${lineIndex}`);
    }
  }));
  const gaps = [];
  const leftEdge = Math.min(...rows.flatMap(row => row.lines.map(line => line.x)));
  rows.forEach((row, rowIndex) => {
    if (rowIndex > 0) {
      const leadingGap = row.lines[0].x - leftEdge;
      if (leadingGap > .018) gaps.push({ rowIndex, lineIndex: 0, gap: leadingGap });
    }
    row.lines.slice(1).forEach((line, lineIndex) => {
      const previous = row.lines[lineIndex];
      const gap = line.x - (previous.x + previous.w);
      if (gap > .018 && !explicitBlankAfter.has(`${rowIndex}:${lineIndex}`)) gaps.push({ rowIndex, lineIndex: lineIndex + 1, gap });
    });
  });
  const remaining = Math.max(0, blankCount - explicitBlankAfter.size);
  const selected = new Set(gaps.sort((left, right) => right.gap - left.gap).slice(0, remaining).map(gap => `${gap.rowIndex}:${gap.lineIndex}`));
  let inserted = selected.size + explicitBlankAfter.size;
  let blankIndex = 0;
  const blankHTML = () => {
    const configured = PUNCTUATION_AFTER_BLANK[question.id]?.[blankIndex];
    const punctuation = `${configured || (COLON_AFTER_BLANK.has(question.id) ? ":" : "")} `;
    blankIndex += 1;
    return `<span class="blank-token" aria-label="blank"></span>${punctuation}`;
  };
  const html = rows.map((row, rowIndex) => row.lines.map((line, lineIndex) => {
    const text = escapeHTML(cleanText(line.t));
    const key = `${rowIndex}:${lineIndex}`;
    const before = selected.has(key) ? blankHTML() : "";
    const after = explicitBlankAfter.has(key) ? ` ${blankHTML()}` : "";
    return `${lineIndex ? " " : ""}${before}${text}${after}`;
  }).join("")).join(" ");
  const missing = Math.max(0, blankCount - inserted);
  const trailingBlanks = '<span class="blank-token" aria-label="blank"></span>'.repeat(missing);
  const sourceText = cleanText(`${rows.flatMap(row => row.lines).map(line => cleanText(line.t)).join(" ")}${" _____".repeat(missing)}`);
  let completed = `${html}${trailingBlanks}`;
  if (!/[.!?](?:["”’)]*)$/.test(sourceText)) {
    completed = missing === 0 && /(?:&quot;|["”’])$/.test(completed)
      ? completed.replace(/(&quot;|["”’])$/, ".$1")
      : `${completed}.`;
  }
  return completed;
}

function blankCountFor(question, lines) {
  if (question.type === "double-blank") return 2;
  if (question.type === "triple-blank") return 3;
  if (["single-blank", "sentence-equivalence"].includes(question.type)) return 1;
  const headers = lines.filter(line => /^\s*Blank/i.test(line.t)).length;
  if (headers) return headers;
  const markers = lines.map(line => line.t).join(" ").match(/\((?:i{1,3}|l{1,3}|1{1,3})\)/gi);
  return Math.min(3, Math.max(1, markers?.length || 1));
}

function completionModel(question, lines) {
  const override = QUESTION_OVERRIDES[question.id];
  if (override) {
    let keyIndex = 0;
    const groups = override.groups.map(group => group.map(text => ({ key: "ABCDEFGHI"[keyIndex++], text })));
    return {
      kind: "completion",
      directions: "Select one answer choice for each blank.",
      stem: escapeHTML(override.stem).replaceAll("{blank}", '<span class="blank-token" aria-label="blank"></span>'),
      groups,
      multiple: false,
      limit: 1,
      expectedAnswerCount: groups.length
    };
  }

  const blankCount = blankCountFor(question, lines);
  const headers = lines.filter(line => /^\s*Blank/i.test(line.t)).sort((left, right) => left.x - right.x);
  let sentenceEquivalence = question.type === "sentence-equivalence";
  let stemLines;
  let groups;

  if (headers.length > 1) {
    const headerY = Math.max(...headers.map(line => line.y));
    stemLines = lines.filter(line => line.y > headerY + .025);
    const optionLines = lines.filter(line => line.y < headerY - .025 && !headers.includes(line));
    groups = headers.map(header => []);
    optionLines.forEach(line => {
      const center = line.x + line.w / 2;
      let nearest = 0;
      headers.forEach((header, index) => {
        const distance = Math.abs(center - (header.x + header.w / 2));
        const best = Math.abs(center - (headers[nearest].x + headers[nearest].w / 2));
        if (distance < best) nearest = index;
      });
      groups[nearest].push(line);
    });
    groups = groups.map((group, groupIndex) => partitionChoiceRows(groupRows(group), 3)
      .map((rows, optionIndex) => ({
        key: "ABCDEFGHI"[groupIndex * 3 + optionIndex],
        text: cleanText(rows.map(rowText).join(" "))
      })));
  } else {
    const contentRows = groupRows(lines.filter(line => !headers.includes(line)));
    const rowGaps = contentRows.slice(1).map((row, index) => ({ index: index + 1, gap: contentRows[index].y - row.y }));
    const choiceStart = rowGaps.sort((left, right) => right.gap - left.gap)[0]?.index || Math.max(1, contentRows.length - 5);
    const stemRows = contentRows.slice(0, choiceStart);
    const choiceRows = contentRows.slice(choiceStart);
    sentenceEquivalence ||= choiceRows.length === 6;
    stemLines = stemRows.flatMap(row => row.lines);
    groups = [choiceRows.map((row, index) => ({ key: "ABCDEFGHI"[index], text: rowText(row) }))];
  }

  return {
    kind: "completion",
    directions: sentenceEquivalence
      ? "Select the two answer choices that complete the sentence and produce sentences alike in meaning."
      : blankCount > 1 ? "Select one answer choice for each blank." : "Select one answer choice.",
    stem: completionStemHTML(question, stemLines, blankCount),
    groups,
    multiple: sentenceEquivalence,
    limit: sentenceEquivalence ? 2 : 1,
    expectedAnswerCount: sentenceEquivalence ? 2 : groups.length
  };
}

function partitionChoiceRows(rows, expectedCount, fixedBreaks = []) {
  if (rows.length <= expectedCount) return rows.map(row => [row]);
  const gaps = rows.slice(1).map((row, index) => ({ index: index + 1, gap: rows[index].y - row.y }));
  const breaks = new Set(fixedBreaks.filter(index => index > 0));
  gaps
    .filter(item => !breaks.has(item.index))
    .sort((left, right) => right.gap - left.gap)
    .slice(0, Math.max(0, expectedCount - 1 - breaks.size))
    .forEach(item => breaks.add(item.index));
  const groups = [];
  rows.forEach((row, index) => {
    if (!groups.length || breaks.has(index)) groups.push([]);
    groups.at(-1).push(row);
  });
  return groups;
}

function readingModel(question, lines) {
  const override = READING_OVERRIDES[question.id];
  if (override) {
    return {
      kind: "reading",
      directions: "Select one answer choice.",
      passage: [override.passage],
      prompt: override.prompt,
      choices: override.choices.map((text, index) => ({ key: "ABCDEFGHI"[index], text })),
      multiple: false,
      limit: 1,
      expectedAnswerCount: 1
    };
  }

  const left = lines.filter(line => line.x < .49);
  const right = lines.filter(line => line.x >= .49);
  const rightRows = groupRows(right);
  const bulletPattern = /^[Oo0]\s+/;
  const bulletChoice = rightRows.findIndex(row => bulletPattern.test(rowText(row)));
  const minimumX = Math.min(...rightRows.flatMap(row => row.lines.map(line => line.x)));
  const indentedChoice = rightRows.findIndex((row, index) => index > 0 && Math.min(...row.lines.map(line => line.x)) > minimumX + .022);
  const candidates = [bulletChoice, indentedChoice].filter(index => index >= 0);
  const firstChoice = candidates.length ? Math.min(...candidates) : -1;

  const promptRows = firstChoice >= 0 ? rightRows.slice(0, firstChoice) : rightRows;
  const choiceRows = firstChoice >= 0 ? rightRows.slice(firstChoice) : [];
  const prompt = cleanText(promptRows.map(rowText).join(" "));
  const selectSentence = /\b(?:select|click on) (?:a|the) sentence/i.test(prompt);
  let choices = [];

  if (selectSentence) {
    const passage = cleanText(paragraphsFromLines(left).join(" "));
    choices = (passage.match(/[^.!?]+[.!?]+(?:[\"']|$)?/g) || [passage]).map((text, index) => ({ key: "ABCDEFGHI"[index], text: cleanText(text) }));
  } else if (choiceRows.length) {
    const bulletStarts = choiceRows.map((row, index) => bulletPattern.test(rowText(row)) ? index : -1).filter(index => index >= 0);
    const sourceAnswerLength = String(TEXT_DATA[question.id]?.a?.value || "").length;
    const isExplicitMulti = /select all|each of the following|which (?:two|three)|select the (?:two|three)/i.test(prompt);
    const expectedCount = isExplicitMulti || sourceAnswerLength > 1 || choiceRows.length < 5 ? 3 : 5;
    const grouped = partitionChoiceRows(choiceRows, Math.min(expectedCount, choiceRows.length), bulletStarts);
    choices = grouped.map((rows, index) => ({
      key: "ABCDEFGHI"[index],
      text: cleanText(rows.map(row => rowText(row).replace(bulletPattern, "")).join(" "))
    }));
  }

  const answerLength = String(TEXT_DATA[question.id]?.a?.value || "").length;
  const multiple = !selectSentence && /select all|each of the following|which (?:two|three)|select the (?:two|three)/i.test(prompt);
  return {
    kind: "reading",
    directions: selectSentence ? "Select one sentence in the passage." : multiple ? "Select all the answer choices that apply." : "Select one answer choice.",
    passage: paragraphsFromLines(left),
    prompt,
    choices,
    multiple,
    limit: multiple ? Math.min(3, Math.max(2, answerLength)) : 1,
    expectedAnswerCount: multiple ? Math.min(3, Math.max(2, answerLength)) : 1
  };
}

function questionModel(question, lines) {
  return ["short-reading", "long-reading", "logic"].includes(question.type)
    ? readingModel(question, lines)
    : completionModel(question, lines);
}

function vocabularyForChoice(record, text) {
  const normalized = cleanText(text).toLowerCase();
  return (record?.v || []).find(item => normalized.includes(vocabularyTerm(item.term).toLowerCase()));
}

function stripChoicePrefix(value) {
  return cleanText(value || "")
    .replace(/^[)\]}(\s]*/, "")
    .replace(/^[A-F](?:[.):-])?\s+/i, "")
    .trim();
}

function vocabularyTerm(value) {
  return stripChoicePrefix(value).replace(/[.;:,]+$/, "").trim();
}

function cleanedVocabularyGloss(vocabulary, term) {
  let gloss = stripChoicePrefix(vocabulary?.gloss || "");
  if (!gloss) return "";
  const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const leadingTerm = new RegExp(`^${escapedTerm}(?=$|[\\s:;,.(]|[A-Z])`, "i");
  while (leadingTerm.test(gloss)) gloss = gloss.replace(leadingTerm, "").trim();

  const parts = gloss
    .replace(/[()]/g, ";")
    .replace(/\bSyn(?:onym)?s?\.?\s*/gi, "")
    .split(/[;,]+|\.(?=\s|$)/)
    .map(part => part.replace(/^[\s:,.\-/]+|[\s:,.\-/]+$/g, "").trim())
    .filter(Boolean)
    .filter(part => part.toLowerCase() !== term.toLowerCase());
  return [...new Map(parts.map(part => [part.toLowerCase(), part])).values()].slice(0, 6).join(", ");
}

function vocabularyGloss(vocabulary) {
  if (!vocabulary) return "";
  const term = vocabularyTerm(vocabulary.term);
  const meaning = VOCABULARY_MEANING_OVERRIDES[term.toLowerCase()] || cleanText(vocabulary.meaning || "");
  const gloss = cleanedVocabularyGloss(vocabulary, term);
  if (!meaning && !gloss) return "";
  return `<span class="choice-gloss">${meaning ? `<span class="choice-meaning">${escapeHTML(meaning)}</span>` : ""}${gloss ? `<span class="choice-synonyms"><b>유의어·설명</b> ${escapeHTML(gloss)}</span>` : ""}</span>`;
}

function completedStem(model, fills) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = model.stem;
  wrapper.querySelectorAll(".blank-token").forEach((blank, index) => {
    blank.replaceWith(document.createTextNode(` ${fills[index] || "_____"} `));
  });
  return cleanText(wrapper.textContent || "");
}

function explanationSources(model, answer) {
  if (model.kind === "reading") {
    const passage = cleanText(model.passage.join("\n\n"));
    return [
      passage ? { label: "지문 전체 해석", text: passage } : null,
      model.prompt ? { label: "문제 해석", text: cleanText(model.prompt) } : null
    ].filter(Boolean);
  }

  if (!answer.length) {
    const blanks = Array.from({ length: model.groups?.length || 1 }, () => "_____");
    return [{ label: "문장 전체 해석", text: completedStem(model, blanks) }];
  }
  if (model.multiple) {
    return model.groups.flat()
      .filter(choice => answer.includes(choice.key))
      .map((choice, index) => ({
        label: answer.length > 1 ? `완성 문장 ${index + 1} 해석` : "문장 전체 해석",
        text: completedStem(model, [choice.text])
      }));
  }

  const fills = model.groups.map(group => group.find(choice => answer.includes(choice.key))?.text || "_____");
  return [{ label: "문장 전체 해석", text: completedStem(model, fills) }];
}

function buildVocabularyIndex() {
  if (vocabularyIndex) return vocabularyIndex;
  const entries = new Map();
  Object.entries(VOCABULARY_MEANING_OVERRIDES).forEach(([term, meaning]) => {
    entries.set(term.toLowerCase(), { term, meaning });
  });
  GRE_WORDS.forEach(item => {
    const term = vocabularyTerm(item.word || "");
    const meaning = cleanText(item.meaning || "");
    const key = term.toLowerCase();
    if (term.length >= 4 && /[가-힣]/.test(meaning) && !entries.has(key)) entries.set(key, { term, meaning });
  });
  Object.entries(GRE_GLOSSARY).forEach(([rawTerm, rawMeaning]) => {
    const term = vocabularyTerm(rawTerm);
    const meaning = cleanText(rawMeaning || "");
    const key = term.toLowerCase();
    if (term.length >= 4 && /[가-힣]/.test(meaning) && !entries.has(key)) entries.set(key, { term, meaning });
  });
  Object.values(TEXT_DATA).forEach(record => (record?.v || []).forEach(item => {
    const term = vocabularyTerm(item.term);
    const meaning = VOCABULARY_MEANING_OVERRIDES[term.toLowerCase()] || cleanText(item.meaning || "");
    const key = term.toLowerCase();
    if (term.length >= 4 && /[가-힣]/.test(meaning) && !entries.has(key)) entries.set(key, { term, meaning });
  }));
  vocabularyIndex = [...entries.values()].sort((left, right) => right.term.length - left.term.length);
  return vocabularyIndex;
}

function vocabularySourceText(model) {
  if (model.kind === "reading") return cleanText([...model.passage, model.prompt].join(" "));
  const wrapper = document.createElement("div");
  wrapper.innerHTML = model.stem;
  wrapper.querySelectorAll(".blank-token").forEach(blank => blank.replaceWith(document.createTextNode(" ")));
  return cleanText(wrapper.textContent || "");
}

function vocabularyAppears(sourceText, term) {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const plural = /[a-z]$/i.test(term) && !/s$/i.test(term) ? "(?:s|es)?" : "";
  return new RegExp(`(^|[^a-z])${escaped}${plural}(?=$|[^a-z])`, "i").test(sourceText);
}

function explanationVocabulary(record, model) {
  const sourceText = vocabularySourceText(model).toLowerCase();
  const selected = new Map();

  (record?.v || []).forEach(item => {
    const term = vocabularyTerm(item.term);
    const meaning = VOCABULARY_MEANING_OVERRIDES[term.toLowerCase()] || cleanText(item.meaning || "");
    if (term.length >= 4 && /[가-힣]/.test(meaning) && vocabularyAppears(sourceText, term)) {
      selected.set(term.toLowerCase(), { term, meaning });
    }
  });

  for (const item of buildVocabularyIndex()) {
    if (selected.size >= 6) break;
    const key = item.term.toLowerCase();
    if (READING_VOCABULARY_EXCLUDE.has(key)) continue;
    if (!selected.has(key) && vocabularyAppears(sourceText, item.term)) selected.set(key, item);
  }
  return [...selected.values()];
}

function explanationHTML(question, record, model, answer) {
  const sources = explanationSources(model, answer);
  const vocabulary = explanationVocabulary(record, model);
  const translations = sources.length
    ? sources.map((source, index) => `<div class="translation-item"><h4>${escapeHTML(source.label)}</h4><p class="translation-source-text" lang="en">${escapeHTML(source.text)}</p><p class="translation-result" data-translation-index="${index}" lang="ko">해석을 준비하고 있습니다…</p></div>`).join("")
    : '<p class="explanation-unavailable">정답 정보가 확인되지 않아 완성 문장 해석을 표시할 수 없습니다.</p>';
  const words = vocabulary.length
    ? `<div class="explanation-vocabulary"><h4>본문 핵심 어휘</h4><ul>${vocabulary.map(item => `<li><strong>${escapeHTML(item.term)}</strong><span>${escapeHTML(item.meaning)}</span></li>`).join("")}</ul></div>`
    : "";

  return {
    sources,
    html: `<section class="answer-explanation" data-question-id="${escapeHTML(question.id)}"><div class="explanation-heading"><div><span>ANSWER REVIEW</span><h3>문장 해석과 본문 어휘</h3></div><button class="translation-retry" type="button" hidden>해석 다시 불러오기</button></div><div class="translation-list">${translations}</div>${words}</section>`
  };
}

function loadTranslationCache() {
  try {
    return JSON.parse(localStorage.getItem(TRANSLATION_CACHE_KEY)) || {};
  } catch {
    return {};
  }
}

function translationCacheKey(questionId, index, text) {
  let hash = 0;
  for (let cursor = 0; cursor < text.length; cursor += 1) hash = ((hash << 5) - hash + text.charCodeAt(cursor)) | 0;
  return `${questionId}:${index}:${hash}`;
}

function cachedTranslation(questionId, index, text) {
  const stored = STATIC_TRANSLATIONS[questionId]?.[index];
  if (stored) return stored;
  return loadTranslationCache()[translationCacheKey(questionId, index, text)]?.text || "";
}

function cacheTranslation(questionId, index, source, translated) {
  const cache = loadTranslationCache();
  cache[translationCacheKey(questionId, index, source)] = { text: translated, savedAt: Date.now() };
  const entries = Object.entries(cache).sort((left, right) => right[1].savedAt - left[1].savedAt).slice(0, TRANSLATION_CACHE_LIMIT);
  localStorage.setItem(TRANSLATION_CACHE_KEY, JSON.stringify(Object.fromEntries(entries)));
}

function setTranslationMessage(message) {
  document.querySelectorAll(".translation-result").forEach(node => {
    if (!node.dataset.ready) node.textContent = message;
  });
}

function prepareTranslator() {
  if (!("Translator" in window)) return Promise.resolve(null);
  if (translatorPromise) return translatorPromise;
  translatorPromise = (async () => {
    const availability = await window.Translator.availability({ sourceLanguage: "en", targetLanguage: "ko" });
    if (availability === "unavailable") return null;
    return window.Translator.create({
      sourceLanguage: "en",
      targetLanguage: "ko",
      monitor(monitor) {
        monitor.addEventListener("downloadprogress", event => {
          setTranslationMessage(`한영 해석 모델을 준비하고 있습니다… ${Math.round(event.loaded * 100)}%`);
        });
      }
    });
  })().catch(() => {
    translatorPromise = null;
    return null;
  });
  return translatorPromise;
}

async function renderTranslations(question, sources) {
  if (!sources.length) return;
  const panel = document.querySelector(`.answer-explanation[data-question-id="${question.id}"]`);
  if (!panel) return;
  const request = ++explanationRequest;
  const targets = [...panel.querySelectorAll(".translation-result")];
  const retry = panel.querySelector(".translation-retry");

  sources.forEach((source, index) => {
    const cached = cachedTranslation(question.id, index, source.text);
    if (cached && targets[index]) {
      targets[index].textContent = cached;
      targets[index].dataset.ready = "true";
    }
  });
  if (targets.every(target => target.dataset.ready)) return;

  const translator = await prepareTranslator();
  if (request !== explanationRequest || !panel.isConnected) return;
  if (!translator) {
    targets.filter(target => !target.dataset.ready).forEach(target => {
      target.textContent = "자동 해석은 데스크톱 Chrome에서 사용할 수 있습니다.";
      target.classList.add("translation-note");
    });
    retry.hidden = !("Translator" in window);
    retry.addEventListener("click", () => {
      translatorPromise = null;
      retry.hidden = true;
      setTranslationMessage("해석을 다시 준비하고 있습니다…");
      prepareTranslator();
      renderTranslations(question, sources);
    }, { once: true });
    return;
  }

  for (let index = 0; index < sources.length; index += 1) {
    if (targets[index]?.dataset.ready) continue;
    try {
      const translated = await translator.translate(sources[index].text);
      if (request !== explanationRequest || !panel.isConnected) return;
      targets[index].textContent = translated;
      targets[index].dataset.ready = "true";
      cacheTranslation(question.id, index, sources[index].text, translated);
    } catch {
      targets[index].textContent = "해석을 불러오지 못했습니다. 다시 시도해 주세요.";
      targets[index].classList.add("translation-note");
      retry.hidden = false;
    }
  }
}

function validAnswer(record, choiceKeys) {
  const answer = String(record?.a?.value || "").split("");
  return answer.length && answer.every(key => choiceKeys.includes(key)) ? answer : [];
}

function choiceHTML(question, record, choice, inputType, inputName, answer, selected) {
  const isCorrect = answer.includes(choice.key);
  const isSelected = selected.includes(choice.key);
  const vocabulary = state.answerVisible ? vocabularyForChoice(record, choice.text) : null;
  const classes = ["choice"];
  if (state.answerVisible) classes.push("answer-revealed");
  if (state.answerVisible && isCorrect) classes.push("correct-choice");
  if (state.answerVisible && isSelected && !isCorrect) classes.push("wrong-choice");
  const gloss = state.answerVisible ? vocabularyGloss(vocabulary) : "";
  return `<label class="${classes.join(" ")}"><input type="${inputType}" name="${inputName}" value="${choice.key}" ${isSelected ? "checked" : ""} ${state.answerVisible ? "disabled" : ""}><span class="choice-key">${choice.key}</span><span class="choice-text">${escapeHTML(choice.text)}</span>${gloss}</label>`;
}

function bindChoiceInputs(question, model) {
  const container = el("questionTextContent");
  container.querySelectorAll(".choice input").forEach(input => input.addEventListener("change", () => {
    let selected = [...container.querySelectorAll(".choice input:checked")].map(item => item.value);
    if (model.multiple && selected.length > model.limit) {
      input.checked = false;
      selected = selected.filter(value => value !== input.value);
    }
    state.answers[question.id] = selected;
    saveState();
  }));
}

function renderQuestionText(question) {
  const record = TEXT_DATA[question.id];
  const container = el("questionTextContent");
  container.replaceChildren();
  const lines = record?.l || [];
  if (!lines.length) {
    container.innerHTML = '<p class="ocr-empty">이 문항의 텍스트를 확인하지 못했습니다.</p>';
    return null;
  }

  const model = questionModel(question, lines);
  const selected = state.answers[question.id] || [];
  const allChoices = model.groups ? model.groups.flat() : model.choices;
  const candidateAnswer = validAnswer(record, allChoices.map(choice => choice.key));
  const answer = candidateAnswer.length === model.expectedAnswerCount ? candidateAnswer : [];
  let html = `<div class="directions">${escapeHTML(model.directions)}</div>`;

  if (model.kind === "reading") {
    html += `<article class="passage-card"><p class="passage-label">Passage</p>${model.passage.map(paragraph => `<p>${escapeHTML(paragraph)}</p>`).join("")}</article>`;
    html += `<p class="question-stem">${escapeHTML(model.prompt)}</p>`;
    html += `<div class="choices${model.multiple ? " multi" : ""}${state.answerVisible ? " answer-mode" : ""}">`;
    model.choices.forEach(choice => {
      html += choiceHTML(question, record, choice, model.multiple ? "checkbox" : "radio", `answer-${question.id}`, answer, selected);
    });
    html += "</div>";
  } else {
    html += `<p class="question-stem">${model.stem}</p>`;
    if (model.groups.length > 1) {
      html += `<div class="blank-groups${state.answerVisible ? " answer-mode" : ""}">`;
      model.groups.forEach((group, groupIndex) => {
        html += `<section class="blank-group"><h3>Blank (${["i", "ii", "iii"][groupIndex]})</h3>`;
        group.forEach(choice => { html += choiceHTML(question, record, choice, "radio", `blank-${question.id}-${groupIndex}`, answer, selected); });
        html += "</section>";
      });
      html += "</div>";
    } else {
      html += `<div class="choices${model.multiple ? " multi" : ""}${state.answerVisible ? " answer-mode" : ""}">`;
      model.groups[0].forEach(choice => { html += choiceHTML(question, record, choice, model.multiple ? "checkbox" : "radio", `answer-${question.id}`, answer, selected); });
      html += "</div>";
    }
  }

  let explanation = null;
  if (state.answerVisible) {
    explanation = explanationHTML(question, record, model, answer);
    html += explanation.html;
  }

  container.innerHTML = html;
  bindChoiceInputs(question, model);
  if (explanation) renderTranslations(question, explanation.sources);
  return model;
}

function renderQuestion() {
  const question = filteredQuestions[currentIndex];
  if (!question) return;
  state.currentId = question.id;
  updateAnswerVisibility();
  el("questionCounter").textContent = `Question ${currentIndex + 1} of ${filteredQuestions.length}`;
  el("questionLabel").textContent = question.label;
  el("questionMeta").textContent = [question.level !== "All" ? question.level : "", question.group].filter(Boolean).join(" · ");
  el("questionJump").max = filteredQuestions.length;
  el("questionJump").value = currentIndex + 1;
  el("completeCheckbox").checked = completed.has(question.id);
  el("previousButton").disabled = currentIndex === 0;
  el("nextButton").disabled = currentIndex === filteredQuestions.length - 1;
  renderQuestionText(question);
  updateAnswerVisibility();
  updateProgress();
  saveState();
}

function updateAnswerVisibility() {
  el("answerToggle").classList.toggle("active", state.answerVisible);
  el("answerToggle").setAttribute("aria-pressed", String(state.answerVisible));
  el("answerToggleLabel").textContent = state.answerVisible ? "정답·어휘 닫기" : "정답·어휘 보기";
}

function toggleAnswer(force) {
  state.answerVisible = typeof force === "boolean" ? force : !state.answerVisible;
  updateAnswerVisibility();
  const question = filteredQuestions[currentIndex];
  if (question) renderQuestionText(question);
  saveState();
}

function updateProgress() {
  const completedInType = typeQuestions.filter(question => completed.has(question.id)).length;
  const percentage = typeQuestions.length ? (completedInType / typeQuestions.length) * 100 : 0;
  el("progressBar").style.width = `${percentage}%`;
  el("progressText").textContent = `${completedInType} / ${typeQuestions.length} completed`;
}

function navigate(offset) {
  const nextIndex = Math.min(Math.max(currentIndex + offset, 0), filteredQuestions.length - 1);
  if (nextIndex === currentIndex) return;
  currentIndex = nextIndex;
  renderQuestion();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function randomQuestion() {
  if (filteredQuestions.length < 2) return;
  let randomIndex = currentIndex;
  while (randomIndex === currentIndex) randomIndex = Math.floor(Math.random() * filteredQuestions.length);
  currentIndex = randomIndex;
  renderQuestion();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function jumpToQuestion() {
  const target = Number(el("questionJump").value) - 1;
  if (!Number.isInteger(target) || target < 0 || target >= filteredQuestions.length) {
    el("questionJump").value = currentIndex + 1;
    return;
  }
  currentIndex = target;
  renderQuestion();
}

function initialize() {
  const saved = loadState();
  state.answers = saved.answers && typeof saved.answers === "object" ? saved.answers : {};
  state.answerVisible = Boolean(saved.answerVisible);
  document.title = `${config.title} | KMF Verbal`;
  el("typeTitle").textContent = `${config.title} · ${config.koreanTitle}`;
  populateLevels(saved.level || "All");
  populateGroups(saved.group || "All");
  applyFilters(saved.currentId || null);
}

el("levelSelect").addEventListener("change", event => {
  state.level = event.target.value;
  populateGroups("All");
  applyFilters();
});
el("groupSelect").addEventListener("change", event => {
  state.group = event.target.value;
  applyFilters();
});
el("answerToggle").addEventListener("click", () => {
  if (!state.answerVisible) prepareTranslator();
  toggleAnswer();
});
el("previousButton").addEventListener("click", () => navigate(-1));
el("nextButton").addEventListener("click", () => navigate(1));
el("randomButton").addEventListener("click", randomQuestion);
el("jumpButton").addEventListener("click", jumpToQuestion);
el("questionJump").addEventListener("keydown", event => { if (event.key === "Enter") jumpToQuestion(); });
el("completeCheckbox").addEventListener("change", event => {
  const question = filteredQuestions[currentIndex];
  if (event.target.checked) completed.add(question.id);
  else completed.delete(question.id);
  saveCompleted();
  updateProgress();
});
document.addEventListener("keydown", event => {
  if (event.target.matches("input, select, button")) return;
  if (event.key === "ArrowLeft") navigate(-1);
  if (event.key === "ArrowRight") navigate(1);
  if (event.key.toLowerCase() === "a") toggleAnswer();
  if (event.key.toLowerCase() === "r") randomQuestion();
});

initialize();
