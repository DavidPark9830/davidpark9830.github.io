const questions = TEST_CONFIG.questions;
const DURATION_SECONDS = TEST_CONFIG.durationSeconds;
const STORAGE_KEY = `verbal-practice-${TEST_CONFIG.testNumber}-state-v1`;

let state = {
  screen: "start",
  current: 0,
  answers: {},
  marked: {},
  remaining: DURATION_SECONDS,
  startedAt: null,
  timerId: null,
  timeHidden: false
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

function renderQuestion() {
  const question = questions[state.current];
  showScreen("exam");
  el("questionNumber").textContent = `Question ${state.current + 1} of ${questions.length}`;
  el("sectionBadge").textContent = `Section ${question.section} · Question ${question.sectionQuestion}`;
  el("markCheckbox").checked = Boolean(state.marked[state.current]);
  el("questionContent").innerHTML = questionHTML(question);
  bindAnswerInputs(question);
  el("backButton").disabled = state.current === 0;
  el("nextButton").textContent = state.current === questions.length - 1 ? "Review" : "Next";
  window.scrollTo(0, 0);
}

function questionHTML(question) {
  let html = `<div class="directions">${directionsFor(question)}</div>`;
  if (question.passage && question.passage.length) {
    html += `<article class="passage-card"><p class="passage-label">Passage</p>${question.passage.map(p => `<p>${p}</p>`).join("")}</article>`;
  }
  html += `<p class="question-stem">${question.prompt}</p>`;
  const selected = state.answers[state.current] || [];

  if (question.type === "blank") {
    html += `<div class="blank-groups">`;
    question.groups.forEach((group, groupIndex) => {
      html += `<section class="blank-group"><h3>Blank (${roman(groupIndex + 1)})</h3>`;
      group.forEach(choice => {
        html += `<label class="choice"><input type="radio" name="blank-${groupIndex}" value="${choice.key}" ${selected.includes(choice.key) ? "checked" : ""}><span class="choice-key">${choice.key}</span><span class="choice-text">${choice.text}</span></label>`;
      });
      html += `</section>`;
    });
    return html + `</div>`;
  }

  const isMulti = question.type === "multi";
  html += `<div class="choices${isMulti ? " multi" : ""}">`;
  question.choices.forEach(choice => {
    html += `<label class="choice"><input type="${isMulti ? "checkbox" : "radio"}" name="answer" value="${choice.key}" ${selected.includes(choice.key) ? "checked" : ""}><span class="choice-key">${choice.key}</span><span class="choice-text">${choice.text}</span></label>`;
  });
  return html + `</div>`;
}

function roman(number) {
  return ["i", "ii", "iii", "iv"][number - 1] || String(number);
}

function bindAnswerInputs(question) {
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
  if (state.screen !== "exam" || event.target.matches("input")) return;
  if (event.key === "ArrowLeft" && state.current > 0) { state.current -= 1; renderQuestion(); }
  if (event.key === "ArrowRight") {
    if (state.current < questions.length - 1) { state.current += 1; renderQuestion(); }
    else renderReview();
  }
});

const saved = loadSaved();
if (saved) {
  Object.assign(state, saved, { timerId: null, screen: "start", timeHidden: false });
  el("resumeButton").hidden = false;
}
el("timer").textContent = formatTime(DURATION_SECONDS);
