const DURATION_SECONDS = 26 * 60;
const STORAGE_KEY = "quant-practice-set-3-state-v1";

const qcChoices = [
  { key: "A", text: "Quantity A is greater." },
  { key: "B", text: "Quantity B is greater." },
  { key: "C", text: "The two quantities are equal." },
  { key: "D", text: "The relationship cannot be determined from the information given." }
];

const coordinatePlane = `
  <div class="coordinate-plane">
    <svg viewBox="0 0 520 260" role="img" aria-label="Coordinate plane with point A at 1 comma 0 and point B at 6 comma 0.">
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#20262c"/></marker>
      </defs>
      <line x1="55" y1="205" x2="470" y2="205" stroke="#20262c" stroke-width="3" marker-end="url(#arrow)"/>
      <line x1="85" y1="232" x2="85" y2="22" stroke="#20262c" stroke-width="3" marker-end="url(#arrow)"/>
      <g stroke="#20262c" stroke-width="2" font-family="Arial" font-size="16" text-anchor="middle">
        <line x1="140" y1="198" x2="140" y2="212"/><text x="140" y="232" stroke="none" fill="#20262c">1</text>
        <line x1="195" y1="198" x2="195" y2="212"/><text x="195" y="232" stroke="none" fill="#20262c">2</text>
        <line x1="250" y1="198" x2="250" y2="212"/><text x="250" y="232" stroke="none" fill="#20262c">3</text>
        <line x1="305" y1="198" x2="305" y2="212"/><text x="305" y="232" stroke="none" fill="#20262c">4</text>
        <line x1="360" y1="198" x2="360" y2="212"/><text x="360" y="232" stroke="none" fill="#20262c">5</text>
        <line x1="415" y1="198" x2="415" y2="212"/><text x="415" y="232" stroke="none" fill="#20262c">6</text>
        <line x1="78" y1="170" x2="92" y2="170"/><text x="66" y="176" stroke="none" fill="#20262c">1</text>
        <line x1="78" y1="135" x2="92" y2="135"/><text x="66" y="141" stroke="none" fill="#20262c">2</text>
        <line x1="78" y1="100" x2="92" y2="100"/><text x="66" y="106" stroke="none" fill="#20262c">3</text>
        <line x1="78" y1="65" x2="92" y2="65"/><text x="66" y="71" stroke="none" fill="#20262c">4</text>
      </g>
      <circle cx="140" cy="205" r="6" fill="#20262c"/><text x="130" y="189" font-family="Georgia" font-size="22" font-style="italic">A</text>
      <circle cx="415" cy="205" r="6" fill="#20262c"/><text x="405" y="189" font-family="Georgia" font-size="22" font-style="italic">B</text>
      <text x="478" y="211" font-family="Georgia" font-size="22" font-style="italic">x</text>
      <text x="76" y="20" font-family="Georgia" font-size="22" font-style="italic">y</text>
      <text x="65" y="225" font-family="Georgia" font-size="18">O</text>
    </svg>
  </div>`;

const ratingTable = `
  <div class="data-block compact-data">
    <p class="data-title">AVERAGE RATING OF PRODUCT <i>X</i><br>GIVEN BY THREE GROUPS OF PEOPLE</p>
    <table class="data-table" aria-label="Average rating of Product X by group">
      <thead><tr><th>Group</th><th>Number of<br>People in Group</th><th>Average Rating</th></tr></thead>
      <tbody><tr><td><i>A</i></td><td>45</td><td>3.8</td></tr><tr><td><i>B</i></td><td>25</td><td>4.6</td></tr><tr><td><i>C</i></td><td>30</td><td>4.2</td></tr></tbody>
    </table>
  </div>`;

const birdData = `
  <div class="data-block bird-data">
    <p class="data-title">SIGHTINGS OF SELECTED BIRD SPECIES<br>IN PARK <i>H</i> IN 1999, BY SEASON</p>
    <div class="table-scroll"><table class="data-table" aria-label="Bird sightings in Park H by season">
      <thead><tr><th>Species</th><th>Winter</th><th>Spring</th><th>Summer</th><th>Fall</th></tr></thead>
      <tbody>
        <tr><td>Cardinal</td><td>30</td><td>18</td><td>11</td><td>20</td></tr>
        <tr><td>Goldfinch</td><td>6</td><td>12</td><td>6</td><td>9</td></tr>
        <tr><td>Junco</td><td>12</td><td>0</td><td>0</td><td>6</td></tr>
        <tr><td>Nuthatch</td><td>8</td><td>2</td><td>0</td><td>4</td></tr>
        <tr><td>Robin</td><td>6</td><td>12</td><td>28</td><td>18</td></tr>
        <tr><td>Sparrow</td><td>20</td><td>19</td><td>23</td><td>22</td></tr>
        <tr><td>Wren</td><td>0</td><td>18</td><td>30</td><td>12</td></tr>
      </tbody>
    </table></div>
  </div>`;

const questions = [
  {
    type: "qc", context: "<i>y</i> &lt; −6",
    quantityA: "<i>y</i>", quantityB: "−5",
    choices: qcChoices, answer: ["B"]
  },
  {
    type: "qc", context: "<i>x</i> is an integer, and 23 &lt; <i>x</i> &lt; 27.",
    quantityA: "The median of the five integers 23, 24, 26, 27, and <i>x</i>", quantityB: "25", choices: qcChoices, answer: ["D"]
  },
  {
    type: "qc", context: "<i>r</i> and <i>t</i> are consecutive integers and <i>p</i> = <i>r</i><sup>2</sup> + <i>t</i>.",
    quantityA: "(−1)<sup><i>p</i></sup>", quantityB: "−1", choices: qcChoices, answer: ["C"]
  },
  {
    type: "qc", context: "The function <i>f</i> is defined by <i>f</i>((<i>x</i> + 3)/2) = 3<i>x</i><sup>2</sup> − <i>x</i> + 5 for all numbers <i>x</i>.",
    quantityA: "<i>f</i>(4)", quantityB: "75", choices: qcChoices, answer: ["C"]
  },
  {
    type: "qc", context: "The sum of the annual salaries of the 21 teachers at School <i>X</i> is $781,200. Twelve of the 21 teachers have an annual salary that is less than $37,000.",
    quantityA: "The average (arithmetic mean) of the annual salaries of the teachers at School <i>X</i>", quantityB: "The median of the annual salaries of the teachers at School <i>X</i>", choices: qcChoices, answer: ["A"]
  },
  {
    type: "single", prompt: "The relationship between temperature <i>C</i>, in degrees Celsius, and temperature <i>F</i>, in degrees Fahrenheit, is given by the formula <i>F</i> = (9/5)<i>C</i> + 32. If a recipe calls for an oven temperature of 210 degrees Celsius, what is the oven temperature in degrees Fahrenheit?",
    choices: ["320", "350", "410", "420", "500"].map((text, i) => ({ key: "ABCDE"[i], text })), answer: ["C"]
  },
  {
    type: "single", prompt: "Of the students in a school, 20 percent are in the science club and 30 percent are in the band. If 25 percent of the students in the school are in the band but are not in the science club, what percent of the students who are in the science club are not in the band?",
    choices: ["5%", "20%", "25%", "60%", "75%"].map((text, i) => ({ key: "ABCDE"[i], text })), answer: ["E"]
  },
  {
    type: "single", prompt: "Each year, the members of a book club select novels and nonfiction books to read. The club meets 3 times to discuss each novel and 5 times to discuss each nonfiction book they select. Last year, the club met 52 times and discussed 12 books. How many novels did the club discuss last year?",
    choices: ["2", "4", "5", "7", "14"].map((text, i) => ({ key: "ABCDE"[i], text })), answer: ["B"]
  },
  {
    type: "single", prompt: "If −1 &lt; <i>x</i> &lt; <i>y</i> &lt; 0, which of the following shows the expressions <i>xy</i>, <i>x</i><sup>2</sup><i>y</i>, and <i>xy</i><sup>2</sup> listed in order from least to greatest?",
    choices: ["<i>xy</i>, <i>x</i><sup>2</sup><i>y</i>, <i>xy</i><sup>2</sup>", "<i>xy</i>, <i>xy</i><sup>2</sup>, <i>x</i><sup>2</sup><i>y</i>", "<i>xy</i><sup>2</sup>, <i>xy</i>, <i>x</i><sup>2</sup><i>y</i>", "<i>xy</i><sup>2</sup>, <i>x</i><sup>2</sup><i>y</i>, <i>xy</i>", "<i>x</i><sup>2</sup><i>y</i>, <i>xy</i><sup>2</sup>, <i>xy</i>"].map((text, i) => ({ key: "ABCDE"[i], text })), answer: ["E"]
  },
  {
    type: "multi", stimulus: coordinatePlane, prompt: "Points <i>A</i> and <i>B</i> are shown in the <i>xy</i>-plane above. Point <i>C</i> (not shown) is above the <i>x</i>-axis so that the area of triangle <i>ABC</i> is 10. Which of the following could be the coordinates of <i>C</i>?<br><br>Indicate <u>all</u> such coordinates.",
    choices: ["(0, 4)", "(1, 3)", "(2, 5)", "(3, 4)", "(4, 5)"].map((text, i) => ({ key: "ABCDE"[i], text })), answer: ["A", "D"]
  },
  {
    type: "numeric", stimulus: ratingTable, prompt: "Each of the people in three groups gave a rating of Product <i>X</i> on a scale from 1 through 5. For each of the groups, the table above shows the number of people in the group and the average (arithmetic mean) of their ratings. What is the average of the ratings of the product given by the 100 people in the three groups combined?<br><br>Give your answer to the <u>nearest 0.1</u>.",
    answer: ["4.1"]
  },
  {
    type: "single", stimulus: birdData,
    prompt: "In the winter, 2/3 of the cardinal sightings, 1/2 of the junco sightings, and 1/4 of the sparrow sightings were in January. What fraction of the total number of sightings of these three bird species in the winter were in January?",
    choices: ["1/4", "1/3", "1/2", "2/3", "3/4"].map((text, i) => ({ key: "ABCDE"[i], text })), answer: ["C"]
  },
  {
    type: "single", stimulus: birdData,
    prompt: "For which of the following bird species is the standard deviation of the numbers of sightings shown for the four seasons least?",
    choices: ["Cardinal", "Junco", "Robin", "Sparrow", "Wren"].map((text, i) => ({ key: "ABCDE"[i], text })), answer: ["D"]
  },
  {
    type: "single", stimulus: birdData,
    prompt: "Which of the following is closest to the average (arithmetic mean) number of cardinal sightings for the 4 seasons?",
    choices: ["12", "14", "16", "18", "20"].map((text, i) => ({ key: "ABCDE"[i], text })), answer: ["E"]
  },
  {
    type: "numeric", stimulus: birdData,
    prompt: "By what percent did the number of wren sightings increase from spring to summer?<br><br>Give your answer to the <u>nearest whole percent</u>.",
    suffix: "%", answer: ["67"]
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
  el("headerQuestion").textContent = name === "exam" ? `Question ${state.current + 1} of ${questions.length}` : name === "review" ? "Review" : "Practice Set 3";
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
  if (auto) document.title = "Time Expired · Quant Practice Set 3";
  else document.title = "Result · Quant Practice Set 3";
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
  document.title = "Quant Practice Set 3";
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
      name: "start_quant_practice_set_3",
      title: "Start Quant Practice Set 3",
      description: "Start a new 26-minute, 15-question Quant Practice Set 3 in the visible page.",
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
