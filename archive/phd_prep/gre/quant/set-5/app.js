const DURATION_SECONDS = 26 * 60;
const STORAGE_KEY = "quant-practice-set-5-state-v1";

const qcChoices = [
  { key: "A", text: "Quantity A is greater." },
  { key: "B", text: "Quantity B is greater." },
  { key: "C", text: "The two quantities are equal." },
  { key: "D", text: "The relationship cannot be determined from the information given." }
];

const coordinateFigure = `
  <div class="geometry-figure">
    <svg viewBox="0 0 560 330" role="img" aria-label="Coordinate plane with a point c comma d in the third quadrant. The segment from the point to the origin makes a 44 degree angle with the negative y-axis.">
      <defs><marker id="axisArrow" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0 0 L0 6 L7 3 Z" fill="#20262c"/></marker></defs>
      <line x1="70" y1="145" x2="500" y2="145" stroke="#20262c" stroke-width="3" marker-end="url(#axisArrow)"/>
      <line x1="320" y1="285" x2="320" y2="35" stroke="#20262c" stroke-width="3" marker-end="url(#axisArrow)"/>
      <line x1="320" y1="145" x2="145" y2="270" stroke="#20262c" stroke-width="3"/>
      <circle cx="145" cy="270" r="6" fill="#20262c"/>
      <path d="M320 205 A60 60 0 0 1 271 180" fill="none" stroke="#20262c" stroke-width="2"/>
      <g fill="#20262c" font-family="Georgia" font-size="23" font-style="italic">
        <text x="510" y="152">x</text><text x="310" y="27">y</text><text x="329" y="137">O</text><text x="100" y="300">(c, d)</text>
      </g>
      <text x="265" y="204" fill="#20262c" font-family="Georgia" font-size="23">44°</text>
    </svg>
  </div>`;

const triangleFigure = `
  <div class="geometry-figure triangle-figure">
    <svg viewBox="0 0 440 300" role="img" aria-label="Isosceles triangle ABC with AB equal to BC, vertex angle B equal to 40 degrees, and exterior angle x at A.">
      <line x1="45" y1="230" x2="365" y2="230" stroke="#20262c" stroke-width="3"/>
      <path d="M135 230 L230 45 L325 230" fill="none" stroke="#20262c" stroke-width="3"/>
      <path d="M207 89 A50 50 0 0 1 253 89" fill="none" stroke="#20262c" stroke-width="2"/>
      <g fill="#20262c" font-family="Georgia" font-size="23" font-style="italic">
        <text x="122" y="260">A</text><text x="222" y="34">B</text><text x="326" y="260">C</text><text x="92" y="220">x°</text>
      </g>
      <text x="213" y="102" fill="#20262c" font-family="Georgia" font-size="22">40°</text>
      <text x="182" y="290" fill="#20262c" font-family="Georgia" font-size="22" font-style="italic">AB = BC</text>
    </svg>
  </div>`;

const questions = [
  {
    type: "qc", context: coordinateFigure,
    quantityA: "<i>c</i>", quantityB: "<i>d</i>", choices: qcChoices, answer: ["A"]
  },
  {
    type: "qc", context: "<i>N</i> = 824<sup><i>x</i></sup>, where <i>x</i> is a positive integer.",
    quantityA: "The number of possible values of the units digit of <i>N</i>", quantityB: "4", choices: qcChoices, answer: ["B"]
  },
  {
    type: "qc", context: "<i>x</i> &gt; 0 and <i>x</i> ≠ 1.",
    quantityA: "(2<i>x</i><sup>−4</sup>)(3<i>x</i><sup>2</sup>)", quantityB: "24<i>x</i> / 4<i>x</i><sup>2</sup>", choices: qcChoices, answer: ["D"]
  },
  {
    type: "qc", context: "",
    quantityA: "The length of a leg of an isosceles right triangle with area <i>R</i>", quantityB: "The length of a side of a square with area <i>R</i>", choices: qcChoices, answer: ["A"]
  },
  {
    type: "qc", context: triangleFigure,
    quantityA: "<i>x</i>", quantityB: "120", choices: qcChoices, answer: ["B"]
  },
  {
    type: "qc", context: "<i>S</i> = {1, 2, 3, 4, 5, 6, 7, 8}",
    quantityA: "The number of 4-member subsets of <i>S</i>", quantityB: "The number of 5-member subsets of <i>S</i>", choices: qcChoices, answer: ["A"]
  },
  {
    type: "single", prompt: "The 5 letters in the list G, H, I, J, K are to be rearranged so that G is the 3rd letter in the list and H is <u>not</u> next to G. How many such rearrangements are there?",
    choices: ["60", "36", "24", "12", "6"].map((text, i) => ({ key: "ABCDE"[i], text })), answer: ["D"]
  },
  {
    type: "single", prompt: "If <i>j</i> and <i>k</i> are even integers and <i>j</i> &lt; <i>k</i>, which of the following equals the number of even integers that are greater than <i>j</i> and less than <i>k</i>?",
    choices: ["(<i>k</i> − <i>j</i> − 2) / 2", "(<i>k</i> − <i>j</i> − 1) / 2", "(<i>k</i> − <i>j</i>) / 2", "<i>k</i> − <i>j</i>", "<i>k</i> − <i>j</i> − 1"].map((text, i) => ({ key: "ABCDE"[i], text })), answer: ["A"]
  },
  {
    type: "single", prompt: "Which of the following is closest to √(2.3 × 10<sup>9</sup>)?",
    choices: ["50,000", "150,000", "500,000", "1,500,000", "5,000,000"].map((text, i) => ({ key: "ABCDE"[i], text })), answer: ["A"]
  },
  {
    type: "single", prompt: "The interior dimensions of a rectangular tank are as follows: length 110 centimeters, width 90 centimeters, and height 270 centimeters. The tank rests on level ground. Based on the assumption that the volume of water increases by 10 percent when it freezes, which of the following is closest to the maximum height, in centimeters, to which the tank can be filled with water so that when the water freezes, the ice would not rise above the top of the tank?",
    choices: ["230", "235", "240", "245", "250"].map((text, i) => ({ key: "ABCDE"[i], text })), answer: ["D"]
  },
  {
    type: "single", prompt: "If <i>x</i> and <i>y</i> are integers and <i>x</i> = [(2)(3)(4)(5)(7)(11)(13)] / (39<i>y</i>), which of the following could be the value of <i>y</i>?",
    choices: ["15", "28", "38", "64", "143"].map((text, i) => ({ key: "ABCDE"[i], text })), answer: ["B"]
  },
  {
    type: "single", prompt: "Of the 40 specimens of bacteria in a dish, 3 specimens have a certain trait. If 5 specimens are to be selected from the dish at random and without replacement, which of the following represents the probability that only 1 of the 5 specimens selected will have the trait?",
    choices: ["C(5,1) / C(40,3)", "C(5,1) / C(40,5)", "C(40,3) / C(40,5)", "C(3,1)C(37,4) / C(40,3)", "C(3,1)C(37,4) / C(40,5)"].map((text, i) => ({ key: "ABCDE"[i], text })), answer: ["E"]
  },
  {
    type: "multi", prompt: "In a factory, machine <i>A</i> operates on a cycle of 20 hours of work followed by 4 hours of rest, and machine <i>B</i> operates on a cycle of 40 hours of work followed by 8 hours of rest. Last week, the two machines began their respective cycles at 12 noon on Monday and continued until 12 noon on the following Saturday. On which days during that time period was there a time when both machines were at rest?<br><br>Indicate <u>all</u> such days.",
    choices: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((text, i) => ({ key: "ABCDEF"[i], text })), answer: ["C", "E"]
  },
  {
    type: "fraction", prompt: "The first term in a certain sequence is 1, the 2nd term in the sequence is 2, and, for all integers <i>n</i> ≥ 3, the <i>n</i>th term in the sequence is the average (arithmetic mean) of the first <i>n</i> − 1 terms in the sequence. What is the value of the 6th term in the sequence?<br><br>Give your answer as a fraction.",
    answer: ["3", "2"]
  },
  {
    type: "numeric", prompt: "From 2011 to 2012, Jack’s annual salary increased by 10 percent and Arnie’s annual salary decreased by 5 percent. If their annual salaries were equal in 2012, then Arnie’s annual salary in 2011 was what percent greater than Jack’s annual salary in 2011?<br><br>Give your answer to the <u>nearest 0.1 percent</u>.",
    suffix: "%", answer: ["15.8"]
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
  el("headerQuestion").textContent = name === "exam" ? `Question ${state.current + 1} of ${questions.length}` : name === "review" ? "Review" : "Practice Set 5";
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
    ? `<div class="directions">For Questions 1 to 6, select one of the following answer choices.</div>${question.context ? "" : ""}${question.type ? questionHTML(question) : ""}`
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
  if (question.type === "numeric") {
    if (!values?.length || String(values[0]).trim() === "") return false;
    const entered = Number(values[0]);
    const expected = Number(question.answer[0]);
    return Number.isFinite(entered) && entered === expected;
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
  if (auto) document.title = "Time Expired · Quant Practice Set 5";
  else document.title = "Result · Quant Practice Set 5";
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
  document.title = "Quant Practice Set 5";
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
      name: "start_quant_practice_set_5",
      title: "Start Quant Practice Set 5",
      description: "Start a new 26-minute, 15-question Quant Practice Set 5 in the visible page.",
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
