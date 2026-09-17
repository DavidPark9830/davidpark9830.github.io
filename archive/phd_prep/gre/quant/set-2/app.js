const DURATION_SECONDS = 26 * 60;
const STORAGE_KEY = "quant-practice-set-2-state-v1";

const qcChoices = [
  { key: "A", text: "Quantity A is greater." },
  { key: "B", text: "Quantity B is greater." },
  { key: "C", text: "The two quantities are equal." },
  { key: "D", text: "The relationship cannot be determined from the information given." }
];

const internetData = `
  <div class="data-block">
    <p class="data-title">INTERNET USE IN YEAR <i>X</i></p>
    <div class="internet-visuals">
      <div class="pie-panel">
        <p class="data-title">Distribution of Internet Users<br>Worldwide, by Region</p>
        <div class="pie-chart" role="img" aria-label="United States 51 percent, Europe 29 percent, Japan 5 percent, and rest of world 15 percent.">
          <span class="pie-label pie-us">United States<br>51%</span>
          <span class="pie-label pie-europe">Europe<br>29%</span>
          <span class="pie-label pie-japan">Japan<br>5%</span>
          <span class="pie-label pie-rest">Rest of World<br>15%</span>
        </div>
      </div>
      <div class="europe-panel">
        <p class="data-title">Number of Internet Users in Europe<br>Total: 27.3 million</p>
        <div class="internet-bars" role="img" aria-label="Bar graph of Internet users in seven European regions. Germany has approximately 6.5 million, France 5.9 million, Britain 5.0 million, Italy 1.5 million, Spain 1.0 million, Eastern Europe 1.8 million, and the rest of Europe 5.6 million.">
          <div class="y-label">Number of Internet Users (in millions)</div>
          <div class="plot">
            <div class="bar-wrap"><div class="bar" style="height:92.9%"></div><span>Germany</span></div>
            <div class="bar-wrap"><div class="bar" style="height:84.3%"></div><span>France</span></div>
            <div class="bar-wrap"><div class="bar" style="height:71.4%"></div><span>Britain</span></div>
            <div class="bar-wrap"><div class="bar" style="height:21.4%"></div><span>Italy</span></div>
            <div class="bar-wrap"><div class="bar" style="height:14.3%"></div><span>Spain</span></div>
            <div class="bar-wrap"><div class="bar" style="height:25.7%"></div><span>Eastern Europe</span></div>
            <div class="bar-wrap"><div class="bar" style="height:80%"></div><span>Rest of Europe</span></div>
          </div>
          <div class="x-label">European Regions</div>
        </div>
      </div>
    </div>
  </div>`;

const questions = [
  {
    type: "qc", context: "<i>x</i> &lt; 0",
    quantityA: "<i>x</i><sup>5</sup>", quantityB: "<i>x</i><sup>4</sup>",
    choices: qcChoices, answer: ["B"]
  },
  {
    type: "qc", context: "",
    quantityA: "(<i>x</i> + 4)(<i>y</i> + 3)", quantityB: "(<i>x</i> + 3)(<i>y</i> + 4)", choices: qcChoices, answer: ["D"]
  },
  {
    type: "qc", context: "0.<span style='text-decoration:overline'>b</span> represents the decimal in which the digit <i>b</i> is repeated without end.",
    quantityA: "0.<span style='text-decoration:overline'>3</span> + 0.<span style='text-decoration:overline'>7</span>", quantityB: "1.0", choices: qcChoices, answer: ["A"]
  },
  {
    type: "qc", context: "A company plans to manufacture two types of hammers, type <i>R</i> and type <i>S</i>. The cost of manufacturing each hammer of type <i>S</i> is $0.05 less than twice the cost of manufacturing each hammer of type <i>R</i>.",
    quantityA: "The cost of manufacturing 1,000 hammers of type <i>R</i> and 1,000 hammers of type <i>S</i>", quantityB: "The cost of manufacturing 1,500 hammers of type <i>S</i>", choices: qcChoices, answer: ["A"]
  },
  {
    type: "qc", context: "",
    quantityA: "[(1/4)<sup>−1</sup> + (1/4)<sup>−2</sup> + (1/4)<sup>−3</sup>] / 4", quantityB: "21", choices: qcChoices, answer: ["C"]
  },
  {
    type: "single", prompt: "In right triangle <i>ABC</i>, the ratio of the lengths of the two legs is 2 to 5. If the area of triangle <i>ABC</i> is 20, what is the length of the hypotenuse?",
    choices: ["7", "10", "4√5", "√29", "2√29"].map((text, i) => ({ key: "ABCDE"[i], text })), answer: ["E"]
  },
  {
    type: "single", prompt: "According to surveys at a company, 20 percent of the employees owned cell phones in 1994, and 60 percent of the employees owned cell phones in 1998. From 1994 to 1998, what was the percent increase in the fraction of employees who owned cell phones?",
    choices: ["3%", "20%", "30%", "200%", "300%"].map((text, i) => ({ key: "ABCDE"[i], text })), answer: ["D"]
  },
  {
    type: "single", prompt: "If <i>t</i> is an integer and 8<i>m</i> = 16<sup><i>t</i></sup>, which of the following expresses <i>m</i> in terms of <i>t</i>?",
    choices: ["2<sup><i>t</i></sup>", "2<sup><i>t</i>−3</sup>", "2<sup>3(<i>t</i>−3)</sup>", "2<sup>4<i>t</i>−3</sup>", "2<sup>4(<i>t</i>−3)</sup>"].map((text, i) => ({ key: "ABCDE"[i], text })), answer: ["D"]
  },
  {
    type: "single", prompt: "Three pumps, <i>P</i>, <i>R</i>, and <i>T</i>, working simultaneously at their respective constant rates, can fill a tank in 5 hours. Pumps <i>P</i> and <i>R</i>, working simultaneously at their respective constant rates, can fill the tank in 7 hours. How many hours will it take pump <i>T</i>, working alone at its constant rate, to fill the tank?",
    choices: ["1.7", "10.0", "15.0", "17.5", "30.0"].map((text, i) => ({ key: "ABCDE"[i], text })), answer: ["D"]
  },
  {
    type: "multi", prompt: "Two different positive integers <i>x</i> and <i>y</i> are selected from the odd integers that are less than 10. If <i>z</i> = <i>x</i> + <i>y</i> and <i>z</i> is less than 10, which of the following integers could be the sum of <i>x</i>, <i>y</i>, and <i>z</i>?<br><br>Indicate <u>all</u> such integers.",
    choices: ["8", "9", "10", "12", "14", "15", "16", "18"].map((text, i) => ({ key: "ABCDEFGH"[i], text })), answer: ["A", "D", "G"]
  },
  {
    type: "fraction", prompt: "If <i>a</i> and <i>b</i> are the two solutions of the equation <i>x</i><sup>2</sup> − 5<i>x</i> + 4 = 0, what is the value of ((1 + <i>a</i>)/<i>a</i>)((1 + <i>b</i>)/<i>b</i>)?<br><br>Give your answer as a fraction.",
    answer: ["5", "2"]
  },
  {
    type: "single", stimulus: internetData,
    prompt: "Which of the following is closest to the percent of Internet users in Europe who were in countries other than Germany, France, Britain, Italy, and Spain?",
    choices: ["30%", "34%", "38%", "42%", "46%"].map((text, i) => ({ key: "ABCDE"[i], text })), answer: ["A"]
  },
  {
    type: "single", stimulus: internetData,
    prompt: "Approximately what was the range of the numbers of Internet users in the seven regions of Europe shown in the bar graph?",
    choices: ["6.5 million", "5.5 million", "3.5 million", "3.0 million", "2.5 million"].map((text, i) => ({ key: "ABCDE"[i], text })), answer: ["B"]
  },
  {
    type: "single", stimulus: internetData,
    prompt: "The number of Internet users in the United States was approximately how many times the number of Internet users in Italy?",
    choices: ["5", "15", "20", "25", "35"].map((text, i) => ({ key: "ABCDE"[i], text })), answer: ["E"]
  },
  {
    type: "multi", stimulus: internetData,
    prompt: "Based on the information given, which of the following statements about Internet use in year <i>X</i> must be true?<br><br>Indicate <u>all</u> such statements.",
    choices: [
      "The United States had more Internet users than all other countries in the world combined.",
      "Spain had fewer Internet users than any country in Eastern Europe.",
      "Germany and France combined had more than 1/3 of the Internet users in Europe."
    ].map((text, i) => ({ key: "ABC"[i], text })), answer: ["A", "C"]
  }
];

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
  el("headerQuestion").textContent = name === "exam" ? `Question ${state.current + 1} of ${questions.length}` : name === "review" ? "Review" : "Practice Set 2";
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
  if (question.type === "qc") return "Compare Quantity A and Quantity B, and select one answer choice.";
  if (question.type === "multi") return "Select all the answer choices that apply.";
  if (question.type === "numeric") return "Enter your answer in the box.";
  if (question.type === "fraction") return "Enter the numerator and denominator in the boxes.";
  return "Select one answer choice.";
}

function renderQuestion() {
  const question = questions[state.current];
  showScreen("exam");
  el("questionNumber").textContent = `Question ${state.current + 1} of ${questions.length}`;
  el("markCheckbox").checked = Boolean(state.marked[state.current]);
  el("questionContent").innerHTML = question.type === "qc"
    ? `<div class="directions">For Questions 1 to 5, select one of the following answer choices.</div>${question.context ? "" : ""}${question.type ? questionHTML(question) : ""}`
    : questionHTML(question);
  bindAnswerInputs(question);
  el("backButton").disabled = state.current === 0;
  el("nextButton").textContent = state.current === questions.length - 1 ? "Review" : "Next";
  window.scrollTo(0, 0);
}

function questionHTML(question) {
  const index = state.current;
  let html = question.stimulus || "";
  if (question.type === "qc") {
    html += `<div class="qc-context">${question.context}</div><div class="quantity-grid"><div class="quantity-box"><strong>Quantity A</strong><span>${question.quantityA}</span></div><div class="quantity-box"><strong>Quantity B</strong><span>${question.quantityB}</span></div></div>`;
  } else {
    html += `<p class="question-stem"><span class="question-index">${index + 1}.</span>${question.prompt}</p>`;
  }
  if (question.type === "fraction") {
    const values = state.answers[index] || ["", ""];
    return `<div class="directions">Enter the numerator and denominator in the boxes.</div>${html}<div class="fraction-entry" aria-label="Fraction answer"><input id="fractionNumerator" inputmode="decimal" autocomplete="off" value="${values[0] || ""}" aria-label="Numerator"><span class="fraction-line"></span><input id="fractionDenominator" inputmode="decimal" autocomplete="off" value="${values[1] || ""}" aria-label="Denominator"></div>`;
  }
  if (question.type === "numeric") {
    const value = state.answers[index]?.[0] || "";
    return `<div class="directions">Enter your answer in the box.</div>${html}<label class="numeric-entry"><input id="numericAnswer" inputmode="decimal" autocomplete="off" value="${value}" aria-label="Numeric answer"><span>${question.suffix || ""}</span></label>`;
  }
  const isMulti = question.type === "multi";
  const selected = state.answers[index] || [];
  if (isMulti) html = `<div class="directions">Select all the answer choices that apply.</div>${html}`;
  else if (question.type !== "qc") html = `<div class="directions">Select one answer choice.</div>${html}`;
  html += `<div class="choices${isMulti ? " multi" : ""}">`;
  question.choices.forEach(choice => {
    html += `<label class="choice"><input type="${isMulti ? "checkbox" : "radio"}" name="answer" value="${choice.key}" ${selected.includes(choice.key) ? "checked" : ""}><span class="choice-key">${choice.key}</span><span class="choice-text">${choice.text}</span></label>`;
  });
  return html + "</div>";
}

function bindAnswerInputs(question) {
  if (question.type === "fraction") {
    const saveFraction = () => {
      state.answers[state.current] = [el("fractionNumerator").value.trim(), el("fractionDenominator").value.trim()];
      saveState();
    };
    el("fractionNumerator").addEventListener("input", saveFraction);
    el("fractionDenominator").addEventListener("input", saveFraction);
    return;
  }
  if (question.type === "numeric") {
    el("numericAnswer").addEventListener("input", event => {
      const value = event.target.value.trim();
      state.answers[state.current] = value ? [value] : [];
      saveState();
    });
    return;
  }
  document.querySelectorAll('input[name="answer"]').forEach(input => {
    input.addEventListener("change", () => {
      if (question.type === "multi") {
        state.answers[state.current] = [...document.querySelectorAll('input[name="answer"]:checked')].map(item => item.value);
      } else {
        state.answers[state.current] = [input.value];
      }
      saveState();
    });
  });
}

function isAnswered(index) {
  const values = state.answers[index];
  if (!Array.isArray(values)) return false;
  if (questions[index].type === "fraction") return values.length === 2 && values.every(value => String(value).trim() !== "");
  return values.some(value => String(value).trim() !== "");
}

function renderReview() {
  showScreen("review");
  const answered = questions.filter((_, index) => isAnswered(index)).length;
  const marked = questions.filter((_, index) => state.marked[index]).length;
  el("reviewSummary").textContent = `${answered} of ${questions.length} questions answered · ${marked} marked for review`;
  el("reviewGrid").replaceChildren();
  questions.forEach((_, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `review-question${isAnswered(index) ? " answered" : ""}${state.marked[index] ? " marked" : ""}`;
    button.textContent = `Question ${index + 1}`;
    button.addEventListener("click", () => { state.current = index; renderQuestion(); });
    el("reviewGrid").append(button);
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
    : "All 15 questions are answered.";
  el("submitDialog").showModal();
}

function normalizeAnswer(values) {
  return (values || []).map(value => String(value).trim()).sort().join("|");
}

function isCorrect(question, values) {
  if (question.type === "fraction") {
    const numerator = Number(values?.[0]);
    const denominator = Number(values?.[1]);
    const expectedNumerator = Number(question.answer[0]);
    const expectedDenominator = Number(question.answer[1]);
    return Number.isFinite(numerator) && Number.isFinite(denominator) && denominator !== 0 && numerator * expectedDenominator === denominator * expectedNumerator;
  }
  return normalizeAnswer(values) === normalizeAnswer(question.answer);
}

function submitTest(auto = false) {
  if (state.timerId) clearInterval(state.timerId);
  state.timerId = null;
  const score = questions.reduce((total, question, index) => total + (isCorrect(question, state.answers[index]) ? 1 : 0), 0);
  const answered = questions.filter((_, index) => isAnswered(index)).length;
  const used = DURATION_SECONDS - state.remaining;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ submitted: true, score, answered, used, savedAt: Date.now() }));
  showScreen("result");
  el("scoreValue").textContent = score;
  el("answeredValue").textContent = `${answered} / ${questions.length}`;
  el("timeUsedValue").textContent = formatTime(used);
  if (auto) document.title = "Time Expired · Quant Practice Set 2";
  else document.title = "Result · Quant Practice Set 2";
  window.scrollTo(0, 0);
}

function startTimer() {
  if (state.timerId) clearInterval(state.timerId);
  updateTimer();
  state.timerId = setInterval(() => {
    state.remaining -= 1;
    updateTimer();
    if (state.remaining % 5 === 0) saveState();
    if (state.remaining <= 0) submitTest(true);
  }, 1000);
}

function updateTimer() {
  el("timer").textContent = state.timeHidden ? "Time Hidden" : formatTime(state.remaining);
  el("timer").classList.toggle("warning", state.remaining <= 300);
  el("timeToggleLabel").textContent = state.timeHidden ? "Show Time" : "Hide Time";
}

function resetTest() {
  if (state.timerId) clearInterval(state.timerId);
  localStorage.removeItem(STORAGE_KEY);
  document.title = "Quant Practice Set 2";
  state = { screen: "start", current: 0, answers: {}, marked: {}, remaining: DURATION_SECONDS, startedAt: null, timerId: null, timeHidden: false };
  showScreen("start");
  el("timer").textContent = "26:00";
  el("resumeButton").hidden = true;
}

el("startButton").addEventListener("click", () => beginTest(false));
el("resumeButton").addEventListener("click", () => beginTest(true));
el("backButton").addEventListener("click", () => {
  if (state.screen === "review") { state.current = questions.length - 1; renderQuestion(); return; }
  if (state.current > 0) { state.current -= 1; renderQuestion(); saveState(); }
});
el("nextButton").addEventListener("click", () => {
  if (state.screen === "review") { requestSubmit(); return; }
  if (state.current < questions.length - 1) { state.current += 1; renderQuestion(); saveState(); }
  else renderReview();
});
el("reviewButton").addEventListener("click", renderReview);
el("markCheckbox").addEventListener("change", event => { state.marked[state.current] = event.target.checked; saveState(); });
el("confirmSubmit").addEventListener("click", () => submitTest(false));
el("retakeButton").addEventListener("click", resetTest);
el("timeToggle").addEventListener("click", () => { state.timeHidden = !state.timeHidden; updateTimer(); });

const calculator = { expression: "", display: "0", memory: 0 };
function safeCalculate(expression) {
  if (!/^[0-9+\-*/.() ]+$/.test(expression)) return NaN;
  try { return Function(`"use strict"; return (${expression})`)(); } catch { return NaN; }
}
function updateCalculator(value = calculator.display) {
  calculator.display = String(value).slice(0, 18);
  el("calculatorDisplay").textContent = calculator.display;
}
el("calculatorButton").addEventListener("click", () => el("calculatorDialog").showModal());
el("calculatorClose").addEventListener("click", () => el("calculatorDialog").close());
el("calculatorGrid").addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;
  const value = button.dataset.value;
  const action = button.dataset.action;
  if (value) {
    calculator.expression += value;
    updateCalculator(calculator.expression);
  } else if (action === "clear") {
    calculator.expression = ""; updateCalculator("0");
  } else if (action === "equals") {
    const result = safeCalculate(calculator.expression);
    calculator.expression = Number.isFinite(result) ? String(result) : "";
    updateCalculator(Number.isFinite(result) ? result : "Error");
  } else if (action === "sqrt") {
    const current = safeCalculate(calculator.expression || calculator.display);
    const result = current >= 0 ? Math.sqrt(current) : NaN;
    calculator.expression = Number.isFinite(result) ? String(result) : "";
    updateCalculator(Number.isFinite(result) ? result : "Error");
  } else if (action === "percent") {
    const current = safeCalculate(calculator.expression || calculator.display);
    calculator.expression = Number.isFinite(current) ? String(current / 100) : "";
    updateCalculator(Number.isFinite(current) ? current / 100 : "Error");
  } else if (action === "sign") {
    const current = safeCalculate(calculator.expression || calculator.display);
    calculator.expression = Number.isFinite(current) ? String(-current) : "";
    updateCalculator(Number.isFinite(current) ? -current : "Error");
  } else if (action === "memory-clear") calculator.memory = 0;
  else if (action === "memory-recall") { calculator.expression = String(calculator.memory); updateCalculator(calculator.memory); }
  else if (action === "memory-add") calculator.memory += Number(safeCalculate(calculator.expression || calculator.display)) || 0;
  else if (action === "memory-subtract") calculator.memory -= Number(safeCalculate(calculator.expression || calculator.display)) || 0;
});

const saved = loadSaved();
if (saved) {
  state = { ...state, ...saved, timerId: null, screen: "start" };
  el("resumeButton").hidden = false;
}
showScreen("start");
updateTimer();

function registerWebMCP() {
  const context = document.modelContext;
  if (!context?.registerTool) return;
  try {
    void Promise.resolve(context.registerTool({
      name: "start_quant_practice_set_2",
      title: "Start Quant Practice Set 2",
      description: "Start a new 26-minute, 15-question Quant Practice Set 2 in the visible page.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute() {
        if (state.screen !== "start") throw new Error("The practice set is already in progress or completed.");
        beginTest(false);
        return { status: "started", questions: questions.length, durationMinutes: 26 };
      }
    })).catch(() => {});
  } catch {}
}

registerWebMCP();
