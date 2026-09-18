const DATA = window.KMF_STUDY_DATA;
const TEXT_DATA = window.KMF_TEXT_DATA || {};
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

let state = {
  level: "All",
  group: "All",
  currentId: null,
  answers: {},
  answerVisible: false,
  answerImageVisible: false,
  questionView: "text",
  zoom: 1
};
let filteredQuestions = [];
let currentIndex = 0;
let completed = loadCompleted();

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
    answers: state.answers
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

function imageLoaded(image, loading) {
  loading.hidden = true;
  image.hidden = false;
}

function loadImage(image, loading, source) {
  image.hidden = true;
  loading.hidden = false;
  image.onload = () => imageLoaded(image, loading);
  image.onerror = () => {
    loading.textContent = "이미지를 불러오지 못했습니다.";
  };
  image.src = source;
  if (image.complete && image.naturalWidth) imageLoaded(image, loading);
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
    .replace(/rni/g, "rm")
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

function completionStemHTML(lines, blankCount) {
  const rows = groupRows(lines);
  const gaps = [];
  rows.forEach((row, rowIndex) => {
    row.lines.slice(1).forEach((line, lineIndex) => {
      const previous = row.lines[lineIndex];
      const gap = line.x - (previous.x + previous.w);
      if (gap > .018) gaps.push({ rowIndex, lineIndex: lineIndex + 1, gap });
    });
  });
  const selected = new Set(gaps.sort((left, right) => right.gap - left.gap).slice(0, blankCount).map(gap => `${gap.rowIndex}:${gap.lineIndex}`));
  let inserted = selected.size;
  const html = rows.map((row, rowIndex) => row.lines.map((line, lineIndex) => {
    const text = escapeHTML(cleanText(line.t));
    const blank = selected.has(`${rowIndex}:${lineIndex}`) ? '<span class="blank-token" aria-label="blank"></span>' : "";
    return `${lineIndex ? " " : ""}${blank}${text}`;
  }).join("")).join(" ");
  const missing = Math.max(0, blankCount - inserted);
  return `${html}${'<span class="blank-token" aria-label="blank"></span>'.repeat(missing)}`;
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
    const choiceCount = question.type === "sentence-equivalence" ? 6 : 5;
    const ordered = [...lines].sort((left, right) => left.y - right.y);
    const choices = ordered.slice(0, choiceCount).sort((left, right) => right.y - left.y);
    const choiceSet = new Set(choices);
    stemLines = lines.filter(line => !choiceSet.has(line) && !headers.includes(line));
    groups = [choices.map((line, index) => ({ key: "ABCDEFGHI"[index], text: cleanText(line.t) }))];
  }

  return {
    kind: "completion",
    directions: question.type === "sentence-equivalence"
      ? "Select the two answer choices that complete the sentence and produce sentences alike in meaning."
      : blankCount > 1 ? "Select one answer choice for each blank." : "Select one answer choice.",
    stem: completionStemHTML(stemLines, blankCount),
    groups,
    multiple: question.type === "sentence-equivalence",
    limit: question.type === "sentence-equivalence" ? 2 : 1,
    expectedAnswerCount: question.type === "sentence-equivalence" ? 2 : groups.length
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
  return (record?.v || []).find(item => normalized.includes(cleanText(item.term).toLowerCase()));
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
  const meaning = vocabulary?.meaning ? `<span class="choice-gloss"><b>${escapeHTML(vocabulary.term)}</b> ${escapeHTML(vocabulary.meaning)}</span>` : "";
  const badge = state.answerVisible && isCorrect ? '<span class="answer-badge">정답</span>' : "";
  return `<label class="${classes.join(" ")}"><input type="${inputType}" name="${inputName}" value="${choice.key}" ${isSelected ? "checked" : ""} ${state.answerVisible ? "disabled" : ""}><span class="choice-key">${choice.key}</span><span class="choice-text">${escapeHTML(choice.text)}</span>${badge}${meaning}</label>`;
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
    container.innerHTML = '<p class="ocr-empty">이 문항의 텍스트를 인식하지 못했습니다. 원본 보기로 확인해 주세요.</p>';
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

  container.innerHTML = html;
  bindChoiceInputs(question, model);
  return model;
}

function setQuestionView(view) {
  state.questionView = view;
  const showText = view === "text";
  el("questionTextView").hidden = !showText;
  el("questionScroll").hidden = showText;
  el("textViewButton").classList.toggle("active", showText);
  el("imageViewButton").classList.toggle("active", !showText);
  el("textViewButton").setAttribute("aria-pressed", String(showText));
  el("imageViewButton").setAttribute("aria-pressed", String(!showText));
}

function renderAnswerSummary(question) {
  const record = TEXT_DATA[question.id];
  const model = questionModel(question, record?.l || []);
  const choices = model.groups ? model.groups.flat() : model.choices;
  const candidateAnswer = validAnswer(record, choices.map(choice => choice.key));
  const answer = candidateAnswer.length === model.expectedAnswerCount ? candidateAnswer : [];
  const vocabulary = record?.v || [];
  el("answerValue").textContent = answer.length ? answer.join(" · ") : "확인 필요";
  el("answerConfidence").textContent = record?.a?.confidence === "inferred" && answer.length ? "해설 문장에서 추출" : "";
  el("vocabularyList").replaceChildren();
  vocabulary.forEach(item => {
    const row = document.createElement("div");
    row.className = "vocabulary-item";
    const term = document.createElement("strong");
    term.textContent = item.term;
    const meaning = document.createElement("span");
    meaning.textContent = item.meaning || "한글 뜻 미확인";
    const gloss = document.createElement("small");
    gloss.textContent = item.gloss || "";
    row.append(term, meaning, gloss);
    el("vocabularyList").append(row);
  });
  el("vocabularySection").hidden = !vocabulary.length;

  const hasSourceAnswer = Boolean(question.answer);
  el("answerMissing").hidden = Boolean(answer.length) && hasSourceAnswer;
  if (!hasSourceAnswer) el("answerMissing").textContent = "이 문항은 원본 자료에 정답 이미지가 없습니다.";
  else if (!answer.length) el("answerMissing").textContent = "정답 문자를 신뢰할 수 있게 인식하지 못했습니다. 원본 해설 이미지로 확인해 주세요.";
  el("originalAnswerToggle").hidden = !hasSourceAnswer;
}

function toggleOriginalAnswer() {
  const question = filteredQuestions[currentIndex];
  if (!question?.answer) return;
  state.answerImageVisible = !state.answerImageVisible;
  el("answerScroll").hidden = !state.answerImageVisible;
  el("originalAnswerToggle").textContent = state.answerImageVisible ? "원본 해설 이미지 닫기" : "원본 해설 이미지 보기";
  if (state.answerImageVisible && !el("answerImage").getAttribute("src")) {
    loadImage(el("answerImage"), el("answerLoading"), question.answer);
  }
}

function renderQuestion() {
  const question = filteredQuestions[currentIndex];
  if (!question) return;
  state.currentId = question.id;
  state.answerVisible = false;
  state.answerImageVisible = false;
  updateAnswerVisibility();
  el("questionCounter").textContent = `Question ${currentIndex + 1} of ${filteredQuestions.length}`;
  el("questionLabel").textContent = question.label;
  el("questionMeta").textContent = [question.level !== "All" ? question.level : "", question.group].filter(Boolean).join(" · ");
  el("questionJump").max = filteredQuestions.length;
  el("questionJump").value = currentIndex + 1;
  el("completeCheckbox").checked = completed.has(question.id);
  el("previousButton").disabled = currentIndex === 0;
  el("nextButton").disabled = currentIndex === filteredQuestions.length - 1;
  el("answerImage").removeAttribute("src");
  el("answerImage").hidden = true;
  el("answerMissing").hidden = true;
  el("answerScroll").hidden = true;
  el("originalAnswerToggle").textContent = "원본 해설 이미지 보기";
  el("answerLoading").textContent = "해설 이미지를 불러오는 중...";
  renderQuestionText(question);
  renderAnswerSummary(question);
  loadImage(el("questionImage"), el("questionLoading"), question.question);
  el("questionScroll").scrollTo({ top: 0, left: 0 });
  setQuestionView(state.questionView);
  updateProgress();
  applyZoom();
  saveState();
}

function updateAnswerVisibility() {
  el("answerPanel").hidden = !state.answerVisible;
  el("answerToggle").classList.toggle("active", state.answerVisible);
  el("answerToggle").setAttribute("aria-pressed", String(state.answerVisible));
  el("answerToggleLabel").textContent = state.answerVisible ? "정답·어휘 닫기" : "정답·어휘 보기";
}

function toggleAnswer(force) {
  state.answerVisible = typeof force === "boolean" ? force : !state.answerVisible;
  updateAnswerVisibility();
  const question = filteredQuestions[currentIndex];
  if (question) renderQuestionText(question);
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

function applyZoom() {
  document.querySelectorAll(".image-scroll").forEach(container => container.style.setProperty("--zoom", state.zoom));
  el("zoomOut").disabled = state.zoom <= .75;
  el("zoomIn").disabled = state.zoom >= 2.5;
  el("zoomReset").textContent = state.zoom === 1 ? "Fit" : `${Math.round(state.zoom * 100)}%`;
}

function changeZoom(delta) {
  state.zoom = Math.min(2.5, Math.max(.75, Math.round((state.zoom + delta) * 100) / 100));
  applyZoom();
}

function initialize() {
  const saved = loadState();
  state.answers = saved.answers && typeof saved.answers === "object" ? saved.answers : {};
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
el("answerToggle").addEventListener("click", () => toggleAnswer());
el("closeAnswer").addEventListener("click", () => toggleAnswer(false));
el("textViewButton").addEventListener("click", () => setQuestionView("text"));
el("imageViewButton").addEventListener("click", () => setQuestionView("image"));
el("originalAnswerToggle").addEventListener("click", toggleOriginalAnswer);
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
el("zoomOut").addEventListener("click", () => changeZoom(-.25));
el("zoomIn").addEventListener("click", () => changeZoom(.25));
el("zoomReset").addEventListener("click", () => { state.zoom = 1; applyZoom(); });

document.addEventListener("keydown", event => {
  if (event.target.matches("input, select, button")) return;
  if (event.key === "ArrowLeft") navigate(-1);
  if (event.key === "ArrowRight") navigate(1);
  if (event.key.toLowerCase() === "a") toggleAnswer();
  if (event.key.toLowerCase() === "r") randomQuestion();
});

initialize();
