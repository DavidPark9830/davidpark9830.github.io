const TEST = window.PRACTICE_SET;

let section = 0;
let current = 0;
let remaining = 0;
let timerId = null;
let answers = {};
let marked = {};
let incorrectItems = [];
let reviewIndex = 0;

const $ = id => document.getElementById(id);
const answerKey = () => `${section}-${current}`;
const escapeHTML = value => String(value ?? "").replace(/[&<>\"]/g, character => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"
})[character]);

function formatTime(value) {
  return `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
}

function show(id) {
  ["startScreen", "examScreen", "transitionScreen", "resultScreen", "reviewScreen"].forEach(screenId => {
    $(screenId).hidden = screenId !== id;
  });
  $("examTools").hidden = id !== "examScreen";
  $("testFooter").hidden = id !== "examScreen";
}

function begin() {
  clearInterval(timerId);
  section = 0;
  current = 0;
  answers = {};
  marked = {};
  incorrectItems = [];
  startSection();
}

function startSection() {
  remaining = TEST.sections[section].minutes * 60;
  show("examScreen");
  render();
  clearInterval(timerId);
  timerId = setInterval(() => {
    remaining = Math.max(0, remaining - 1);
    $("timer").textContent = formatTime(remaining);
    if (!remaining) finishSection();
  }, 1000);
}

function directions(question) {
  if (question.type === "blank") return "Select one answer choice for each blank.";
  if (question.type === "multi") return "Select all the answer choices that apply.";
  if (question.type === "qc") return "Compare Quantity A and Quantity B and select one answer choice.";
  if (question.type === "numeric" || question.type === "fraction") return "Enter your answer.";
  return "Select one answer choice.";
}

function choiceMarkup(choice, type, name, selected, review = false, correct = []) {
  const classes = ["choice"];
  if (review && correct.includes(choice.key)) classes.push("review-correct");
  if (review && selected.includes(choice.key) && !correct.includes(choice.key)) classes.push("review-incorrect");
  return `<label class="${classes.join(" ")}"><input type="${type}" name="${name}" value="${choice.key}" ${selected.includes(choice.key) ? "checked" : ""} ${review ? "disabled" : ""}><span class="choice-key">${choice.key}</span><span class="choice-text">${choice.text}</span></label>`;
}

function questionMarkup(question, selected = [], review = false) {
  let html = `<div class="directions">${directions(question)}</div>`;
  if (question.passage?.length) html += `<article class="passage-card">${question.passage.map(paragraph => `<p>${paragraph}</p>`).join("")}</article>`;
  if (question.stimulus) html += question.stimulus;
  if (question.context) html += `<div class="qc-context">${question.context}</div>`;
  if (question.type === "qc") {
    html += `<div class="quantity-grid"><div class="quantity-box"><strong>Quantity A</strong><span>${question.quantityA}</span></div><div class="quantity-box"><strong>Quantity B</strong><span>${question.quantityB}</span></div></div>`;
  }
  if (question.prompt) html += `<p class="question-stem">${question.prompt}</p>`;

  if (question.type === "blank") {
    html += '<div class="blank-groups">';
    question.groups.forEach((group, groupIndex) => {
      html += `<section class="blank-group"><h3>Blank ${groupIndex + 1}</h3>`;
      group.forEach(choice => { html += choiceMarkup(choice, "radio", `g${groupIndex}`, selected, review, question.answer); });
      html += "</section>";
    });
    html += "</div>";
  } else if (question.choices) {
    html += `<div class="choices ${question.type === "multi" ? "multi" : ""}">`;
    question.choices.forEach(choice => {
      html += choiceMarkup(choice, question.type === "multi" ? "checkbox" : "radio", "answer", selected, review, question.answer);
    });
    html += "</div>";
  } else if (question.type === "fraction") {
    html += `<div class="fraction-entry ${review ? "review-entry" : ""}"><input aria-label="Numerator" value="${escapeHTML(selected[0] || "")}" ${review ? "disabled" : ""}><span></span><input aria-label="Denominator" value="${escapeHTML(selected[1] || "")}" ${review ? "disabled" : ""}></div>`;
  } else {
    html += `<div class="numeric-entry ${review ? "review-entry" : ""}"><input aria-label="Numeric answer" value="${escapeHTML(selected[0] || "")}" ${review ? "disabled" : ""}>${question.suffix ? `<span>${question.suffix}</span>` : ""}</div>`;
  }
  return html;
}

function render() {
  const activeSection = TEST.sections[section];
  const question = activeSection.questions[current];
  const selected = answers[answerKey()] || [];
  $("sectionName").textContent = activeSection.name;
  $("headerQuestion").textContent = `Question ${current + 1} of ${activeSection.questions.length}`;
  $("questionNumber").textContent = `Section ${section + 1} of ${TEST.sections.length}  |  Question ${current + 1} of ${activeSection.questions.length}`;
  $("sourceLabel").textContent = question.source || "";
  $("timer").textContent = formatTime(remaining);
  $("markCheckbox").checked = Boolean(marked[answerKey()]);
  $("questionContent").innerHTML = questionMarkup(question, selected);
  bindInputs(question);
  $("backButton").disabled = current === 0;
  $("nextButton").textContent = current === activeSection.questions.length - 1 ? "Finish Section" : "Next";
}

function bindInputs(question) {
  document.querySelectorAll("#questionContent input[type=radio], #questionContent input[type=checkbox]").forEach(input => {
    input.onchange = () => {
      if (question.type === "blank" || question.type === "multi") {
        answers[answerKey()] = [...document.querySelectorAll("#questionContent input:checked")].map(item => item.value);
      } else answers[answerKey()] = [input.value];
    };
  });
  const inputs = [...document.querySelectorAll(".numeric-entry input, .fraction-entry input")];
  inputs.forEach(input => {
    input.oninput = () => { answers[answerKey()] = inputs.map(item => item.value.trim()); };
  });
}

function next() {
  const activeSection = TEST.sections[section];
  if (current < activeSection.questions.length - 1) {
    current += 1;
    render();
  } else finishSection();
}

function finishSection() {
  clearInterval(timerId);
  if (section < TEST.sections.length - 1) {
    section += 1;
    current = 0;
    show("transitionScreen");
    $("nextSectionTitle").textContent = TEST.sections[section].name;
    $("nextSectionCopy").textContent = `The next section has ${TEST.sections[section].questions.length} questions and a ${TEST.sections[section].minutes}-minute time limit.`;
  } else result();
}

function same(left, right) {
  return JSON.stringify([...(left || [])].sort()) === JSON.stringify([...(right || [])].sort());
}

function result() {
  show("resultScreen");
  let verbal = 0;
  let quant = 0;
  let total = 0;
  let verbalTotal = 0;
  let quantTotal = 0;
  incorrectItems = [];

  TEST.sections.forEach((activeSection, sectionIndex) => {
    const isVerbal = activeSection.name.startsWith("Verbal");
    activeSection.questions.forEach((question, questionIndex) => {
      const selected = answers[`${sectionIndex}-${questionIndex}`] || [];
      const correct = same(selected, question.answer);
      if (isVerbal) verbalTotal += 1;
      else quantTotal += 1;
      if (correct) {
        total += 1;
        if (isVerbal) verbal += 1;
        else quant += 1;
      } else incorrectItems.push({ activeSection, question, questionIndex, selected });
    });
  });

  $("scoreValue").textContent = total;
  $("verbalScore").textContent = `${verbal} / ${verbalTotal}`;
  $("quantScore").textContent = `${quant} / ${quantTotal}`;
  $("incorrectReviewButton").textContent = incorrectItems.length
    ? `Review ${incorrectItems.length} Incorrect Answer${incorrectItems.length === 1 ? "" : "s"}`
    : "No Incorrect Answers";
  $("incorrectReviewButton").disabled = incorrectItems.length === 0;
}

function allChoices(question) {
  return question.choices || question.groups?.flat() || [];
}

function answerLabel(question, values) {
  if (!values?.length || values.every(value => value === "")) return "No answer";
  const choices = allChoices(question);
  if (choices.length) {
    return values.map(value => {
      const choice = choices.find(item => item.key === value);
      return choice ? `${value}. ${choice.text}` : value;
    }).join(" · ");
  }
  return question.type === "fraction" ? values.join(" / ") : values.join(", ");
}

function renderReview() {
  const item = incorrectItems[reviewIndex];
  if (!item) return;
  $("reviewTitle").textContent = `${item.activeSection.name} · Question ${item.questionIndex + 1}`;
  $("reviewProgress").textContent = `${reviewIndex + 1} of ${incorrectItems.length}`;
  $("reviewQuestion").innerHTML = questionMarkup(item.question, item.selected, true);
  const vocabulary = item.question.vocabulary?.length
    ? `<div class="review-vocabulary"><h3>본문 어휘</h3><dl>${item.question.vocabulary.map(entry => `<div><dt>${escapeHTML(entry.term)}</dt><dd>${escapeHTML(entry.meaning)}</dd></div>`).join("")}</dl></div>` : "";
  const translation = item.question.translation
    ? `<div class="review-translation"><h3>문장 해석</h3><p>${escapeHTML(item.question.translation)}</p></div>` : "";
  $("reviewExplanation").innerHTML = `<div class="answer-comparison"><div><span>Your answer</span><strong>${escapeHTML(answerLabel(item.question, item.selected))}</strong></div><div><span>Correct answer</span><strong>${escapeHTML(answerLabel(item.question, item.question.answer))}</strong></div></div>${translation}${vocabulary}<div class="review-rationale"><h3>해설</h3><p>${escapeHTML(item.question.explanation || "정답과 문제의 조건을 다시 대조해 보세요.")}</p></div>`;
  $("reviewBackButton").disabled = reviewIndex === 0;
  $("reviewNextButton").textContent = reviewIndex === incorrectItems.length - 1 ? "Back to Result" : "Next";
}

function openIncorrectReview() {
  if (!incorrectItems.length) return;
  reviewIndex = 0;
  show("reviewScreen");
  renderReview();
}

$("startButton").onclick = begin;
$("continueButton").onclick = startSection;
$("nextButton").onclick = next;
$("backButton").onclick = () => { if (current) { current -= 1; render(); } };
$("markCheckbox").onchange = event => { marked[answerKey()] = event.target.checked; };
$("reviewButton").onclick = () => {
  const activeSection = TEST.sections[section];
  const unanswered = activeSection.questions.map((_, index) => answers[`${section}-${index}`]?.some(value => value !== "") ? null : index + 1).filter(Boolean);
  alert(unanswered.length ? `Unanswered: ${unanswered.join(", ")}` : "All questions in this section are answered.");
};
$("timeToggle").onclick = () => { $("timer").hidden = !$("timer").hidden; };
$("retakeButton").onclick = () => show("startScreen");
$("incorrectReviewButton").onclick = openIncorrectReview;
$("reviewDoneButton").onclick = () => show("resultScreen");
$("reviewBackButton").onclick = () => { if (reviewIndex > 0) { reviewIndex -= 1; renderReview(); } };
$("reviewNextButton").onclick = () => {
  if (reviewIndex < incorrectItems.length - 1) { reviewIndex += 1; renderReview(); }
  else show("resultScreen");
};

show("startScreen");
