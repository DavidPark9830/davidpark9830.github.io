const questions = TEST_CONFIG.questions;
const DURATION_SECONDS = TEST_CONFIG.durationSeconds;
const STORAGE_KEY = `verbal-practice-${TEST_CONFIG.testNumber}-state-v1`;
const GLOSSARY_ENTRIES = Object.entries(window.GRE_GLOSSARY || {})
  .sort(([left], [right]) => right.length - left.length);

let state = {
  screen: "start",
  current: 0,
  answers: {},
  marked: {},
  remaining: DURATION_SECONDS,
  startedAt: null,
  timerId: null,
  timeHidden: false,
  showAnswers: false
};

const el = id => document.getElementById(id);

function loadSaved() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || saved.submitted) return null;
    if (saved.startedAt) {
      const elapsed = Math.max(0, Math.floor((Date.now() - saved.savedAt) / 1000));
      saved.remaining = Math.max(0, saved.remaining - elapsed);
    }
    return saved;
  } catch { return null; }
}

function saveState() {
  if (state.screen === "result") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    current: state.current,
    answers: state.answers,
    marked: state.marked,
    remaining: state.remaining,
    startedAt: state.startedAt,
    savedAt: Date.now(),
    submitted: false
  }));
}

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function showScreen(name) {
  state.screen = name;
  el("startScreen").hidden = name !== "start";
  el("examScreen").hidden = name !== "exam";
  el("reviewScreen").hidden = name !== "review";
  el("resultScreen").hidden = name !== "result";
  el("examTools").hidden = !["exam", "review"].includes(name);
  el("answerToggle").hidden = name !== "exam";
  el("testFooter").hidden = !["exam", "review"].includes(name);
  el("headerQuestion").textContent = name === "exam"
    ? `Question ${state.current + 1} of ${questions.length}`
    : name === "review" ? "Review" : TEST_CONFIG.title;
}

function beginTest(resume = false) {
  if (!resume) {
    state.current = 0;
    state.answers = {};
    state.marked = {};
    state.remaining = DURATION_SECONDS;
    state.startedAt = Date.now();
    localStorage.removeItem(STORAGE_KEY);
  }
  state.showAnswers = false;
  showScreen("exam");
  renderQuestion();
  startTimer();
  saveState();
}

function directionsFor(question) {
  if (question.type === "blank") return "Select one answer choice for each blank.";
  if (question.type === "multi") return "Select all the answer choices that apply.";
  return "Select one answer choice.";
}

function renderQuestion(resetAnswerView = true) {
  if (resetAnswerView) state.showAnswers = false;
  const question = questions[state.current];
  showScreen("exam");
  updateAnswerToggle();
  el("questionNumber").textContent = `Question ${state.current + 1} of ${questions.length}`;
  el("sectionBadge").textContent = `Section ${question.section} · Question ${question.sectionQuestion}`;
  el("markCheckbox").checked = Boolean(state.marked[state.current]);
  el("questionContent").innerHTML = questionHTML(question);
  bindAnswerInputs(question);
  el("backButton").disabled = state.current === 0;
  el("nextButton").textContent = state.current === questions.length - 1 ? "Review" : "Next";
  if (resetAnswerView) window.scrollTo(0, 0);
}

function questionHTML(question) {
  let html = `<div class="directions">${directionsFor(question)}</div>`;
  if (question.passage && question.passage.length) {
    html += `<article class="passage-card"><p class="passage-label">Passage</p>${question.passage.map(paragraph => `<p>${paragraph}</p>`).join("")}</article>`;
  }
  html += `<p class="question-stem">${question.prompt}</p>`;

  if (state.showAnswers) {
    html += bodyGlossaryHTML(question);
  }

  const selected = state.answers[state.current] || [];
  if (question.type === "blank") {
    html += `<div class="blank-groups${state.showAnswers ? " answer-mode" : ""}">`;
    question.groups.forEach((group, groupIndex) => {
      html += `<section class="blank-group"><h3>Blank (${roman(groupIndex + 1)})</h3>`;
      group.forEach(choice => {
        html += choiceHTML(question, choice, selected, `radio`, `blank-${groupIndex}`);
      });
      html += `</section>`;
    });
    html += `</div>`;
  } else {
    const isMulti = question.type === "multi";
    html += `<div class="choices${isMulti ? " multi" : ""}${state.showAnswers ? " answer-mode" : ""}">`;
    question.choices.forEach(choice => {
      html += choiceHTML(question, choice, selected, isMulti ? "checkbox" : "radio", "answer");
    });
    html += `</div>`;
  }

  if (state.showAnswers) html += explanationHTML(question);
  return html;
}

function choiceHTML(question, choice, selected, inputType, inputName) {
  const isSelected = selected.includes(choice.key);
  const isCorrect = question.answer.includes(choice.key);
  const classes = ["choice"];
  if (state.showAnswers) classes.push("answer-revealed");
  if (state.showAnswers && isCorrect) classes.push("correct-choice");
  if (state.showAnswers && isSelected && !isCorrect) classes.push("wrong-choice");
  const glosses = state.showAnswers ? findGlosses(choice.text, 4) : [];
  const glossHTML = glosses.length
    ? `<span class="choice-gloss">${glosses.map(gloss => `<span><b>${escapeHTML(gloss.term)}</b> ${escapeHTML(gloss.meaning)}</span>`).join("")}</span>`
    : "";
  const answerBadge = state.showAnswers && isCorrect ? `<span class="answer-badge">정답</span>` : "";

  return `<label class="${classes.join(" ")}"><input type="${inputType}" name="${inputName}" value="${choice.key}" ${isSelected ? "checked" : ""} ${state.showAnswers ? "disabled" : ""}><span class="choice-key">${choice.key}</span><span class="choice-text">${choice.text}</span>${answerBadge}${glossHTML}</label>`;
}

function roman(number) {
  return ["i", "ii", "iii", "iv"][number - 1] || String(number);
}

function allChoices(question) {
  return question.groups ? question.groups.flat() : question.choices;
}

function correctChoices(question) {
  return question.answer.map(key => allChoices(question).find(choice => choice.key === key)).filter(Boolean);
}

function htmlToText(html) {
  const holder = document.createElement("div");
  holder.innerHTML = html || "";
  return holder.textContent.replace(/\s+/g, " ").trim();
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"]/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  })[character]);
}

function findGlosses(html, limit = 8) {
  const text = htmlToText(html).toLocaleLowerCase("en-US").replace(/naïveté/g, "naivete");
  const matches = [];

  for (const [term, meaning] of GLOSSARY_ENTRIES) {
    const normalizedTerm = term.toLocaleLowerCase("en-US");
    const pattern = new RegExp(`(^|[^a-z])${normalizedTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}($|[^a-z])`, "i");
    if (!pattern.test(text)) continue;
    if (matches.some(match => match.term.includes(term) || term.includes(match.term))) continue;
    matches.push({ term, meaning });
    if (matches.length >= limit) break;
  }

  return matches;
}

function bodyGlossaryHTML(question) {
  const source = `${(question.passage || []).join(" ")} ${question.prompt}`;
  const glosses = findGlosses(source, 12);
  if (!glosses.length) return "";
  const label = question.passage && question.passage.length ? "본문 핵심 어휘" : "문장 핵심 어휘";
  return `<aside class="body-glossary" aria-label="${label}"><strong>${label}</strong><div>${glosses.map(gloss => `<span><b>${escapeHTML(gloss.term)}</b> ${escapeHTML(gloss.meaning)}</span>`).join("")}</div></aside>`;
}

function completedSentenceHTML(question) {
  if (!question.prompt.includes("blank-token")) return "";
  const prompt = question.prompt.split("<br><br>")[0];
  const answers = correctChoices(question).map(choice => choice.text);
  const replacements = question.type === "blank" ? answers : [answers.join(" / ")];
  let index = 0;
  const completed = prompt.replace(/<span class="blank-token"[^>]*>blank<\/span>/g, () => {
    const answer = replacements[Math.min(index, replacements.length - 1)] || "";
    index += 1;
    return `<mark>${answer}</mark>`;
  });
  return `<div class="completed-sentence"><strong>완성 문장</strong><p>${completed}</p></div>`;
}

function evidenceSentence(question) {
  if (!question.passage || !question.passage.length) return "";
  const promptText = htmlToText(question.prompt);
  const quoted = [...promptText.matchAll(/[“\"]([^”\"]{35,})[”\"]/g)].map(match => match[1]);
  if (quoted.length) return quoted.sort((left, right) => right.length - left.length)[0];

  const passage = htmlToText(question.passage.join(" "));
  const sentences = passage.replace(/([.!?][”\"]?)\s+/g, "$1\u0000").split("\u0000");
  const query = correctChoices(question).map(choice => htmlToText(choice.text)).join(" ");
  const stopWords = new Set(["about", "after", "again", "against", "being", "could", "from", "have", "into", "more", "most", "other", "should", "that", "their", "there", "these", "they", "this", "those", "through", "which", "with", "would"]);
  const queryWords = new Set((query.toLowerCase().match(/[a-z]{4,}/g) || []).filter(word => !stopWords.has(word)));
  let best = { sentence: "", score: 0 };
  sentences.forEach(sentence => {
    const words = new Set((sentence.toLowerCase().match(/[a-z]{4,}/g) || []).filter(word => !stopWords.has(word)));
    const score = [...queryWords].filter(word => words.has(word)).length;
    if (score > best.score) best = { sentence: sentence.trim(), score };
  });
  return best.score ? best.sentence : "";
}

function explanationCopy(question) {
  const prompt = htmlToText(question.prompt).toLowerCase();
  if (question.prompt.includes("blank-token")) {
    if (/although|but|despite|however|yet|far from/.test(prompt)) {
      return "대조를 나타내는 표현을 기준으로 앞뒤 의미가 자연스럽게 반전되는 조합을 고르면 됩니다. 문법과 어조까지 맞는 것은 표시된 정답입니다.";
    }
    if (/because|since|thus|therefore|consequently|so /.test(prompt)) {
      return "원인과 결과의 연결을 따라가면 표시된 어휘가 문장의 논리를 완성합니다. 같은 빈칸에 들어가는 두 단어는 문맥상 같은 의미를 만들어야 합니다.";
    }
    return "문장의 문법 구조와 전체 어조를 함께 적용하면 표시된 어휘가 가장 자연스럽습니다. 두 개가 정답인 문제는 두 단어가 문장에 같은 의미를 만듭니다.";
  }
  if (prompt.includes("most nearly means") || prompt.includes("least change in meaning")) {
    return "사전의 첫 번째 뜻보다 해당 문장에서의 쓰임을 기준으로 판단해야 합니다. 표시된 보기가 원문의 의미와 어조를 가장 가깝게 유지합니다.";
  }
  if (prompt.includes("except")) {
    return "본문에서 직접 확인되는 항목들을 하나씩 제외하면 표시된 보기만 질문의 조건에 해당하지 않습니다.";
  }
  if (prompt.includes("weakens")) {
    return "표시된 정보는 결론을 설명할 다른 가능성을 만들거나 핵심 전제를 약화하므로 논증의 설득력을 가장 크게 낮춥니다.";
  }
  if (prompt.includes("strengthens")) {
    return "표시된 정보는 전제와 결론 사이의 빠진 연결을 보완하므로 논증을 가장 직접적으로 강화합니다.";
  }
  if (prompt.includes("assumption")) {
    return "표시된 내용이 거짓이라고 가정하면 논증의 결론이 유지되기 어렵습니다. 따라서 논증이 반드시 전제하는 내용입니다.";
  }
  if (prompt.includes("organization")) {
    return "글의 시작에서 제시한 관점과 뒤에서 보완하거나 수정한 내용을 순서대로 비교하면 표시된 전개 방식과 일치합니다.";
  }
  if (prompt.includes("function") || prompt.includes("primarily in order to") || prompt.includes("refers to")) {
    return "해당 표현을 앞뒤 문장과 연결해 보면, 표시된 보기가 글 전체에서 그 문장이나 사례가 수행하는 역할을 가장 정확히 설명합니다.";
  }
  if (prompt.includes("select the sentence") || prompt.includes("which sentence")) {
    return "표시된 문장은 질문이 요구한 주장이나 사례를 직접 제시합니다. 문장의 내용뿐 아니라 앞 문장과의 연결 관계가 핵심입니다.";
  }
  return "본문에 직접 제시된 내용과 그로부터 필요한 범위 안에서만 도출되는 함의를 비교하면 표시된 보기가 가장 정확합니다. 다른 보기는 범위를 넓히거나 본문이 말하지 않은 내용을 더합니다.";
}

function explanationHTML(question) {
  const answers = correctChoices(question);
  const evidence = evidenceSentence(question);
  const answerRows = answers.map(choice => {
    const glosses = findGlosses(choice.text, 4);
    const meaning = glosses.length
      ? `<span>${glosses.map(gloss => `${escapeHTML(gloss.term)}: ${escapeHTML(gloss.meaning)}`).join(" · ")}</span>`
      : "";
    return `<li><b>${choice.key}</b><span>${choice.text}</span>${meaning}</li>`;
  }).join("");

  return `<section class="explanation-panel" aria-live="polite">
    <div class="explanation-heading"><span>Answer & Explanation</span><strong>정답 ${question.answer.join(", ")}</strong></div>
    <ul class="answer-summary">${answerRows}</ul>
    ${completedSentenceHTML(question)}
    <div class="explanation-copy"><strong>해설</strong><p>${explanationCopy(question)}</p></div>
    ${evidence ? `<blockquote><strong>근거 문장</strong><p>${escapeHTML(evidence)}</p></blockquote>` : ""}
  </section>`;
}

function updateAnswerToggle() {
  el("answerToggle").setAttribute("aria-pressed", String(state.showAnswers));
  el("answerToggleLabel").textContent = state.showAnswers ? "정답/해설 닫기" : "정답/해설 보기";
  el("answerToggle").classList.toggle("active", state.showAnswers);
}

function bindAnswerInputs(question) {
  if (state.showAnswers) return;
  if (question.type === "blank") {
    question.groups.forEach((_, groupIndex) => {
      document.querySelectorAll(`input[name="blank-${groupIndex}"]`).forEach(input => {
        input.addEventListener("change", () => {
          const selections = question.groups.map((__, index) => document.querySelector(`input[name="blank-${index}"]:checked`)?.value).filter(Boolean);
          state.answers[state.current] = selections;
          saveState();
        });
      });
    });
    return;
  }

  document.querySelectorAll('input[name="answer"]').forEach(input => {
    input.addEventListener("change", () => {
      state.answers[state.current] = question.type === "multi"
        ? [...document.querySelectorAll('input[name="answer"]:checked')].map(item => item.value)
        : [input.value];
      saveState();
    });
  });
}

function isAnswered(index) {
  const question = questions[index];
  const values = state.answers[index] || [];
  if (question.type === "blank") return values.length === question.groups.length;
  return values.length > 0;
}

function renderReview() {
  state.showAnswers = false;
  showScreen("review");
  const answered = questions.filter((_, index) => isAnswered(index)).length;
  const marked = questions.filter((_, index) => state.marked[index]).length;
  el("reviewSummary").textContent = `${answered} of ${questions.length} questions answered · ${marked} marked for review`;
  el("reviewGroups").replaceChildren();

  [2, 3].forEach(section => {
    const group = document.createElement("section");
    group.className = "review-group";
    group.innerHTML = `<h2>Section ${section}</h2><div class="review-grid"></div>`;
    const grid = group.querySelector(".review-grid");
    questions.forEach((question, index) => {
      if (question.section !== section) return;
      const button = document.createElement("button");
      button.type = "button";
      button.className = `review-question${isAnswered(index) ? " answered" : ""}${state.marked[index] ? " marked" : ""}`;
      button.textContent = `Question ${question.sectionQuestion}`;
      button.addEventListener("click", () => { state.current = index; renderQuestion(); });
      grid.append(button);
    });
    el("reviewGroups").append(group);
  });

  el("backButton").disabled = false;
  el("nextButton").textContent = "Submit";
  window.scrollTo(0, 0);
}

function requestSubmit() {
  const answered = questions.filter((_, index) => isAnswered(index)).length;
  const unanswered = questions.length - answered;
  el("submitMessage").textContent = unanswered
    ? `${answered} questions are answered. ${unanswered} question${unanswered === 1 ? " is" : "s are"} unanswered.`
    : `All ${questions.length} questions are answered.`;
  el("submitDialog").showModal();
}

function normalizeAnswer(values) {
  return (values || []).map(value => String(value).trim()).sort().join("|");
}

function submitTest() {
  if (state.timerId) clearInterval(state.timerId);
  state.timerId = null;
  const score = questions.reduce((total, question, index) => total + (normalizeAnswer(state.answers[index]) === normalizeAnswer(question.answer) ? 1 : 0), 0);
  const answered = questions.filter((_, index) => isAnswered(index)).length;
  const used = DURATION_SECONDS - state.remaining;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ submitted: true, score, answered, used, savedAt: Date.now() }));
  showScreen("result");
  el("scoreValue").textContent = score;
  el("answeredValue").textContent = `${answered} / ${questions.length}`;
  el("timeUsedValue").textContent = formatTime(used);
  el("submitDialog").close();
  window.scrollTo(0, 0);
}

function startTimer() {
  if (state.timerId) clearInterval(state.timerId);
  updateTimer();
  state.timerId = setInterval(() => {
    state.remaining = Math.max(0, state.remaining - 1);
    updateTimer();
    if (state.remaining === 0) submitTest();
    else if (state.remaining % 5 === 0) saveState();
  }, 1000);
}

function updateTimer() {
  el("timer").textContent = state.timeHidden ? "--:--" : formatTime(state.remaining);
  el("timer").classList.toggle("warning", state.remaining <= 300);
  el("timeToggleLabel").textContent = state.timeHidden ? "Show Time" : "Hide Time";
}

el("startButton").addEventListener("click", () => beginTest(false));
el("resumeButton").addEventListener("click", () => beginTest(true));
el("answerToggle").addEventListener("click", () => {
  state.showAnswers = !state.showAnswers;
  renderQuestion(false);
});
el("timeToggle").addEventListener("click", () => { state.timeHidden = !state.timeHidden; updateTimer(); });
el("markCheckbox").addEventListener("change", event => { state.marked[state.current] = event.target.checked; saveState(); });
el("reviewButton").addEventListener("click", renderReview);
el("backButton").addEventListener("click", () => {
  if (state.screen === "review") { state.current = questions.length - 1; renderQuestion(); return; }
  if (state.current > 0) { state.current -= 1; renderQuestion(); }
});
el("nextButton").addEventListener("click", () => {
  if (state.screen === "review") { requestSubmit(); return; }
  if (state.current < questions.length - 1) { state.current += 1; renderQuestion(); }
  else renderReview();
});
el("confirmSubmit").addEventListener("click", event => { event.preventDefault(); submitTest(); });
el("retakeButton").addEventListener("click", () => beginTest(false));
window.addEventListener("beforeunload", saveState);

document.addEventListener("keydown", event => {
  if (state.screen !== "exam" || event.target.matches("input, button")) return;
  if (event.key === "ArrowLeft" && state.current > 0) { state.current -= 1; renderQuestion(); }
  if (event.key === "ArrowRight") {
    if (state.current < questions.length - 1) { state.current += 1; renderQuestion(); }
    else renderReview();
  }
});

const saved = loadSaved();
if (saved) {
  Object.assign(state, saved, { timerId: null, screen: "start", timeHidden: false, showAnswers: false });
  el("resumeButton").hidden = false;
}
el("timer").textContent = formatTime(DURATION_SECONDS);
