const DURATION_SECONDS = 26 * 60;
const STORAGE_KEY = "quant-practice-set-1-state-v1";

const qcChoices = [
  { key: "A", text: "Quantity A is greater." },
  { key: "B", text: "Quantity B is greater." },
  { key: "C", text: "The two quantities are equal." },
  { key: "D", text: "The relationship cannot be determined from the information given." }
];

const heightTable = `
  <div class="data-block">
    <p class="data-title">DISTRIBUTION OF THE HEIGHT OF 80 STUDENTS</p>
    <table class="data-table">
      <thead><tr><th>Height (centimeters)</th><th>Number of Students</th></tr></thead>
      <tbody>
        <tr><td>140–144</td><td>6</td></tr><tr><td>145–149</td><td>26</td></tr>
        <tr><td>150–154</td><td>32</td></tr><tr><td>155–159</td><td>12</td></tr>
        <tr><td>160–164</td><td>4</td></tr><tr><th>Total</th><th>80</th></tr>
      </tbody>
    </table>
  </div>`;

const greetingData = `
  <div class="data-block">
    <p class="data-title">SELECTED DATA FOR GREETING CARD SALES</p>
    <div class="data-layout">
      <div>
        <p class="data-title">Annual Revenue from All Greeting Card Sales, 1990–1993</p>
        <div class="bar-chart" role="img" aria-label="Annual revenue was approximately 4.7 billion dollars in 1990, 5.1 in 1991, 5.5 in 1992, and 6.0 in 1993.">
          <div class="y-label">Revenue (in billions of dollars)</div>
          <div class="plot">
            <div class="bar-wrap"><div class="bar" style="height:78.3%"></div><span>1990</span></div>
            <div class="bar-wrap"><div class="bar" style="height:85%"></div><span>1991</span></div>
            <div class="bar-wrap"><div class="bar" style="height:91.7%"></div><span>1992</span></div>
            <div class="bar-wrap"><div class="bar" style="height:100%"></div><span>1993</span></div>
          </div>
          <div class="x-label">Year</div>
        </div>
      </div>
      <div>
        <p class="data-title">Number of Greeting Cards Sold<br>for Ten Occasions in 1993</p>
        <table class="data-table">
          <thead><tr><th>Occasion</th><th>Number of Cards</th></tr></thead>
          <tbody>
            <tr><td>Christmas</td><td>2.4 billion</td></tr><tr><td>Valentine’s Day</td><td>900 million</td></tr>
            <tr><td>Easter</td><td>158 million</td></tr><tr><td>Mother’s Day</td><td>155 million</td></tr>
            <tr><td>Father’s Day</td><td>102 million</td></tr><tr><td>Graduation</td><td>81 million</td></tr>
            <tr><td>Thanksgiving</td><td>42 million</td></tr><tr><td>Halloween</td><td>32 million</td></tr>
            <tr><td>St. Patrick’s Day</td><td>18 million</td></tr><tr><td>Jewish New Year</td><td>12 million</td></tr>
            <tr><th>Total</th><th>3.9 billion</th></tr>
          </tbody>
        </table>
        <p class="data-note"><strong>Note:</strong> 1 billion = 1,000,000,000</p>
      </div>
    </div>
  </div>`;

const questions = [
  {
    type: "qc",
    context: "Points <i>R</i>, <i>S</i>, and <i>T</i> lie on a number line, where <i>S</i> is between <i>R</i> and <i>T</i>. The distance between <i>R</i> and <i>S</i> is 6, and the distance between <i>R</i> and <i>T</i> is 15.",
    quantityA: "The distance between the midpoints of line segments <i>RS</i> and <i>ST</i>",
    quantityB: "The distance between <i>S</i> and <i>T</i>",
    choices: qcChoices, answer: ["B"]
  },
  {
    type: "qc", context: "<i>S</i> is a set of 8 numbers, of which 4 are negative and 4 are positive.",
    quantityA: "The average (arithmetic mean) of the numbers in <i>S</i>", quantityB: "The median of the numbers in <i>S</i>", choices: qcChoices, answer: ["D"]
  },
  {
    type: "qc", context: "The length of each side of rectangle <i>R</i> is an integer, and the area of <i>R</i> is 36.",
    quantityA: "The number of possible values of the perimeter of <i>R</i>", quantityB: "6", choices: qcChoices, answer: ["B"]
  },
  {
    type: "qc", context: "<div style='text-align:center'><i>x</i> = (<i>z</i> − 1)<sup>2</sup><br><i>y</i> = (<i>z</i> + 1)<sup>2</sup></div>",
    quantityA: "The average (arithmetic mean) of <i>x</i> and <i>y</i>", quantityB: "<i>z</i><sup>2</sup>", choices: qcChoices, answer: ["A"]
  },
  {
    type: "qc", context: "<i>x</i>, <i>y</i>, and <i>z</i> are the lengths of the sides of a triangle.",
    quantityA: "<i>x</i> + <i>y</i> + <i>z</i>", quantityB: "2<i>z</i>", choices: qcChoices, answer: ["A"]
  },
  {
    type: "single", prompt: "The area of circle <i>W</i> is 16π and the area of circle <i>Z</i> is 4π. What is the ratio of the circumference of <i>W</i> to the circumference of <i>Z</i>?",
    choices: ["2 to 1", "4 to 1", "8 to 1", "16 to 1", "32 to 1"].map((text, i) => ({ key: "ABCDE"[i], text })), answer: ["A"]
  },
  {
    type: "single", prompt: "In the <i>xy</i>-plane, a quadrilateral has vertices at (−1, 4), (7, 4), (7, −5), and (−1, −5). What is the perimeter of the quadrilateral?",
    choices: ["17", "18", "19", "32", "34"].map((text, i) => ({ key: "ABCDE"[i], text })), answer: ["E"]
  },
  {
    type: "single", stimulus: heightTable,
    prompt: "The table above shows the frequency distribution of the heights of 80 students. What is the least possible range of the heights of the 80 students?",
    choices: ["15", "16", "20", "24", "28"].map((text, i) => ({ key: "ABCDE"[i], text })), answer: ["B"]
  },
  {
    type: "single", prompt: "Which of the following functions <i>f</i> defined for all numbers <i>x</i> has the property that <i>f</i>(−<i>x</i>) = −<i>f</i>(<i>x</i>) for all numbers <i>x</i>?",
    choices: [
      "<i>f</i>(<i>x</i>) = <i>x</i><sup>3</sup> / (<i>x</i><sup>2</sup> + 1)",
      "<i>f</i>(<i>x</i>) = (<i>x</i><sup>2</sup> − 1) / (<i>x</i><sup>2</sup> + 1)",
      "<i>f</i>(<i>x</i>) = <i>x</i><sup>2</sup>(<i>x</i><sup>2</sup> − 1)",
      "<i>f</i>(<i>x</i>) = <i>x</i>(<i>x</i><sup>3</sup> − 1)",
      "<i>f</i>(<i>x</i>) = <i>x</i><sup>2</sup>(<i>x</i><sup>3</sup> − 1)"
    ].map((text, i) => ({ key: "ABCDE"[i], text })), answer: ["A"]
  },
  {
    type: "multi", prompt: "The distribution of the numbers of hours that students at a certain college studied for final exams has a mean of 12 hours and a standard deviation of 3 hours. Which of the following numbers of hours are within 2 standard deviations of the mean of the distribution?<br><br>Indicate <u>all</u> such numbers.",
    choices: ["2", "5", "10", "14", "16", "20"].map((text, i) => ({ key: "ABCDEF"[i], text })), answer: ["C", "D", "E"]
  },
  {
    type: "numeric", prompt: "In a single line of people waiting to purchase tickets for a movie, there are currently 10 people behind Shandra. If 3 of the people who are currently in line ahead of Shandra purchase tickets and leave the line, and no one else leaves the line, there will be 8 people ahead of Shandra in line. How many people are in the line currently?",
    suffix: "people", answer: ["22"]
  },
  {
    type: "single", stimulus: greetingData,
    prompt: "In 1993 the number of Valentine’s Day cards sold was approximately how many times the number of Thanksgiving cards sold?",
    choices: ["20", "30", "40", "50", "60"].map((text, i) => ({ key: "ABCDE"[i], text })), answer: ["A"]
  },
  {
    type: "single", stimulus: greetingData,
    prompt: "In 1993 a card company that sold 40 percent of the Mother’s Day cards that year priced its cards for that occasion between $1.00 and $8.00 each. If the revenue from sales of the company’s Mother’s Day cards in 1993 was <i>r</i> million dollars, which of the following indicates all possible values of <i>r</i>?",
    choices: ["155 &lt; <i>r</i> &lt; 1,240", "93 &lt; <i>r</i> &lt; 496", "93 &lt; <i>r</i> &lt; 326", "62 &lt; <i>r</i> &lt; 744", "62 &lt; <i>r</i> &lt; 496"].map((text, i) => ({ key: "ABCDE"[i], text })), answer: ["E"]
  },
  {
    type: "single", stimulus: greetingData,
    prompt: "Approximately what was the percent increase in the annual revenue from all greeting card sales from 1990 to 1993?",
    choices: ["50%", "45%", "39%", "28%", "20%"].map((text, i) => ({ key: "ABCDE"[i], text })), answer: ["D"]
  },
  {
    type: "multi", stimulus: greetingData,
    prompt: "In 1993 the average (arithmetic mean) price per card for all greeting cards sold was $1.25. For which of the following occasions was the number of cards sold in 1993 less than the total number of cards sold that year for occasions other than the ten occasions shown?<br><br>Indicate <u>all</u> such occasions.",
    choices: ["Christmas", "Valentine’s Day", "Easter", "Mother’s Day", "Father’s Day", "Graduation", "Thanksgiving", "Halloween"].map((text, i) => ({ key: "ABCDEFGH"[i], text })), answer: ["C", "D", "E", "F", "G", "H"]
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
  el("headerQuestion").textContent = name === "exam" ? `Question ${state.current + 1} of ${questions.length}` : name === "review" ? "Review" : "Practice Set 1";
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
  return "Select one answer choice.";
}

function renderHTML(question, index) {
  const stimulus = question.stimulus || "";
  const number = `<span class="question-index">${index + 1}.</span>`;
  let body = `<div class="directions">${directionsFor(question)}</div>${stimulus}`;
  if (question.type === "qc") {
    body += `<div class="qc-context">${question.context}</div>
      <div class="quantity-grid"><div class="quantity-box"><strong>Quantity A</strong><span>${question.quantityA}</span></div><div class="quantity-box"><strong>Quantity B</strong><span>${question.quantityB}</span></div></div>`;
  } else {
    body += `<p class="question-stem">${number}${question.prompt}</p>`;
  }
  if (question.type === "numeric") {
    const value = state.answers[index]?.[0] || "";
    return body + `<label class="numeric-entry"><input id="numericAnswer" inputmode="decimal" autocomplete="off" value="${value}" aria-label="Numeric answer"><span>${question.suffix || ""}</span></label>`;
  }
  const isMulti = question.type === "multi";
  const selected = state.answers[index] || [];
  body += `<div class="choices${isMulti ? " multi" : ""}>`;
  question.choices.forEach(choice => {
    body += `<label class="choice"><input type="${isMulti ? "checkbox" : "radio"}" name="answer" value="${choice.key}" ${selected.includes(choice.key) ? "checked" : ""}><span class="choice-key">${choice.key}</span><span class="choice-text">${choice.text}</span></label>`;
  });
  return body + "</div>";
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
  return Array.isArray(state.answers[index]) && state.answers[index].some(value => String(value).trim() !== "");
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

function submitTest(auto = false) {
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
  if (auto) document.title = "Time Expired · Quant Practice Set 1";
  else document.title = "Result · Quant Practice Set 1";
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
  document.title = "Quant Practice Set 1";
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
      name: "start_quant_practice_set_1",
      title: "Start Quant Practice Set 1",
      description: "Start a new 26-minute, 15-question Quant Practice Set 1 in the visible page.",
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
