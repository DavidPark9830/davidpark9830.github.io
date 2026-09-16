const DURATION_SECONDS = 26 * 60;
const STORAGE_KEY = "quant-practice-set-4-state-v1";

const qcChoices = [
  { key: "A", text: "Quantity A is greater." },
  { key: "B", text: "Quantity B is greater." },
  { key: "C", text: "The two quantities are equal." },
  { key: "D", text: "The relationship cannot be determined from the information given." }
];

const normalDistribution = `
  <div class="normal-figure">
    <svg viewBox="0 0 760 270" role="img" aria-label="Standard normal distribution divided at negative 2, negative 1, 0, 1, and 2 standard deviations. The six regions contain approximately 2, 14, 34, 34, 14, and 2 percent.">
      <path d="M35 215 C100 213, 135 202, 190 165 C250 124, 285 55, 380 38 C475 55, 510 124, 570 165 C625 202, 660 213, 725 215" fill="none" stroke="#20262c" stroke-width="3"/>
      <line x1="35" y1="215" x2="725" y2="215" stroke="#20262c" stroke-width="3"/>
      <g stroke="#20262c" stroke-width="2">
        <line x1="145" y1="215" x2="145" y2="190"/><line x1="255" y1="215" x2="255" y2="108"/>
        <line x1="380" y1="215" x2="380" y2="38"/><line x1="505" y1="215" x2="505" y2="108"/>
        <line x1="615" y1="215" x2="615" y2="190"/>
      </g>
      <g font-family="Georgia" font-size="21" text-anchor="middle" fill="#20262c">
        <text x="92" y="190">2%</text><text x="198" y="177">14%</text><text x="316" y="116">34%</text>
        <text x="444" y="116">34%</text><text x="562" y="177">14%</text><text x="668" y="190">2%</text>
        <text x="145" y="244">−2</text><text x="255" y="244">−1</text><text x="380" y="244">0</text>
        <text x="505" y="244">1</text><text x="615" y="244">2</text>
      </g>
    </svg>
  </div>`;

const questions = [
  {
    type: "qc", context: "At a club meeting, there are 10 more club members than nonmembers. The number of club members at the meeting is <i>c</i>.",
    quantityA: "The total number of people at the club meeting", quantityB: "2<i>c</i> − 10",
    choices: qcChoices, answer: ["C"]
  },
  {
    type: "qc", context: "<i>n</i> is a positive integer that is greater than 3 and has <i>d</i> positive divisors.",
    quantityA: "<i>n</i>", quantityB: "2<sup><i>d</i> − 1</sup>", choices: qcChoices, answer: ["D"]
  },
  {
    type: "qc", context: "<i>m</i> = 10<sup>32</sup> + 2<br>When <i>m</i> is divided by 11, the remainder is <i>r</i>.",
    quantityA: "<i>r</i>", quantityB: "3", choices: qcChoices, answer: ["C"]
  },
  {
    type: "qc", context: "<i>xy</i> = 8 and <i>x</i> = <i>y</i> − 2",
    quantityA: "<i>y</i>", quantityB: "0", choices: qcChoices, answer: ["D"]
  },
  {
    type: "qc", context: "List <i>X</i>: 2, 5, <i>s</i>, <i>t</i><br>List <i>Y</i>: 2, 5, <i>t</i><br>The average (arithmetic mean) of the numbers in list <i>X</i> is equal to the average of the numbers in list <i>Y</i>.",
    quantityA: "<i>s</i>", quantityB: "0", choices: qcChoices, answer: ["D"]
  },
  {
    type: "qc", context: "The radius of circle <i>A</i> is 12 greater than the radius of circle <i>B</i>.",
    quantityA: "The circumference of circle <i>A</i> minus the circumference of circle <i>B</i>", quantityB: "72", choices: qcChoices, answer: ["A"]
  },
  {
    type: "single", prompt: "If 10<sup><i>x</i></sup> equals 0.1 percent of 10<sup><i>y</i></sup>, where <i>x</i> and <i>y</i> are integers, which of the following must be true?",
    choices: ["<i>y</i> = <i>x</i> + 2", "<i>y</i> = <i>x</i> + 3", "<i>x</i> = <i>y</i> + 3", "<i>y</i> = 1,000<i>x</i>", "<i>x</i> = 1,000<i>y</i>"].map((text, i) => ({ key: "ABCDE"[i], text })), answer: ["B"]
  },
  {
    type: "single", stimulus: normalDistribution, prompt: "The figure above shows the standard normal distribution, with mean 0 and standard deviation 1, including approximate percents of the distribution corresponding to the six regions shown.<br><br>The random variable <i>Y</i> is normally distributed with a mean of 470, and the value <i>Y</i> = 340 is at the 15th percentile of the distribution. Of the following, which is the best estimate of the standard deviation of the distribution?",
    choices: ["125", "135", "145", "155", "165"].map((text, i) => ({ key: "ABCDE"[i], text })), answer: ["A"]
  },
  {
    type: "single", prompt: "A car dealer received a shipment of cars, half of which were black, with the remainder consisting of equal numbers of blue, silver, and white cars. During the next month, 70 percent of the black cars, 80 percent of the blue cars, 30 percent of the silver cars, and 40 percent of the white cars were sold. What percent of the cars in the shipment were sold during that month?",
    choices: ["36%", "50%", "55%", "60%", "72%"].map((text, i) => ({ key: "ABCDE"[i], text })), answer: ["D"]
  },
  {
    type: "single", prompt: "If an investment of <i>P</i> dollars is made today and the value of the investment doubles every 7 years, what will be the value of the investment, in dollars, 28 years from today?",
    choices: ["8<i>P</i><sup>4</sup>", "<i>P</i><sup>4</sup>", "16<i>P</i>", "8<i>P</i>", "4<i>P</i>"].map((text, i) => ({ key: "ABCDE"[i], text })), answer: ["C"]
  },
  {
    type: "single", prompt: "The perimeter of a flat rectangular lawn is 42 meters. The width of the lawn is 75 percent of its length. What is the area of the lawn, in square meters?",
    choices: ["40.5", "96", "108", "192", "432"].map((text, i) => ({ key: "ABCDE"[i], text })), answer: ["C"]
  },
  {
    type: "single", prompt: "The greatest of the 21 positive integers in a certain list is 16. The median of the 21 integers is 10. What is the least possible average (arithmetic mean) of the 21 integers?",
    choices: ["4", "5", "6", "7", "8"].map((text, i) => ({ key: "ABCDE"[i], text })), answer: ["C"]
  },
  {
    type: "multi", prompt: "In a certain sequence of numbers, each term after the first term is found by multiplying the preceding term by 2 and then subtracting 3 from the product. If the 4th term in the sequence is 19, which of the following numbers are in the sequence?<br><br>Indicate <u>all</u> such numbers.",
    choices: ["5", "8", "11", "16", "22", "35"].map((text, i) => ({ key: "ABCDEF"[i], text })), answer: ["A", "C", "F"]
  },
  {
    type: "multi", prompt: "For a certain probability experiment, the probability that event <i>A</i> will occur is 1/2 and the probability that event <i>B</i> will occur is 1/3. Which of the following values could be the probability that the event <i>A</i> ∪ <i>B</i> (that is, the event <i>A</i> or <i>B</i>, or both) will occur?<br><br>Indicate <u>all</u> such values.",
    choices: ["1/3", "1/2", "3/4"].map((text, i) => ({ key: "ABC"[i], text })), answer: ["B", "C"]
  },
  {
    type: "numeric", prompt: "When the decimal point of a certain positive decimal number is moved six places to the right, the resulting number is 9 times the reciprocal of the original number. What is the original number?",
    answer: ["0.003"]
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
  el("headerQuestion").textContent = name === "exam" ? `Question ${state.current + 1} of ${questions.length}` : name === "review" ? "Review" : "Practice Set 4";
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
  html += `<div class="choices${isMulti ? " multi" : ""}>`;
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
  if (auto) document.title = "Time Expired · Quant Practice Set 4";
  else document.title = "Result · Quant Practice Set 4";
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
  document.title = "Quant Practice Set 4";
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
      name: "start_quant_practice_set_4",
      title: "Start Quant Practice Set 4",
      description: "Start a new 26-minute, 15-question Quant Practice Set 4 in the visible page.",
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
