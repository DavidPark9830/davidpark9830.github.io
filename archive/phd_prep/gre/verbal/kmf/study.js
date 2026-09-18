const DATA = window.KMF_STUDY_DATA;
const params = new URLSearchParams(window.location.search);
const requestedType = params.get("type");
const type = DATA.types[requestedType] ? requestedType : Object.keys(DATA.types)[0];
const config = DATA.types[type];
const typeQuestions = DATA.questions.filter(question => question.type === type);
const STORAGE_KEY = `kmf-verbal-${type}-state-v1`;
const COMPLETED_KEY = "kmf-verbal-completed-v1";

let state = {
  level: "All",
  group: "All",
  currentId: null,
  answerVisible: false,
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
    currentId: filteredQuestions[currentIndex]?.id || null
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

function renderQuestion() {
  const question = filteredQuestions[currentIndex];
  if (!question) return;
  state.currentId = question.id;
  state.answerVisible = false;
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
  el("answerLoading").textContent = "해설 이미지를 불러오는 중...";
  loadImage(el("questionImage"), el("questionLoading"), question.question);
  el("questionScroll").scrollTo({ top: 0, left: 0 });
  updateProgress();
  applyZoom();
  saveState();
}

function updateAnswerVisibility() {
  const question = filteredQuestions[currentIndex];
  el("answerPanel").hidden = !state.answerVisible;
  el("answerToggle").classList.toggle("active", state.answerVisible);
  el("answerToggle").setAttribute("aria-pressed", String(state.answerVisible));
  el("answerToggleLabel").textContent = state.answerVisible ? "정답·해설 닫기" : "정답·해설 보기";
  if (!state.answerVisible || !question) return;

  if (question.answer) {
    el("answerMissing").hidden = true;
    loadImage(el("answerImage"), el("answerLoading"), question.answer);
  } else {
    el("answerLoading").hidden = true;
    el("answerImage").hidden = true;
    el("answerMissing").hidden = false;
  }
}

function toggleAnswer(force) {
  state.answerVisible = typeof force === "boolean" ? force : !state.answerVisible;
  updateAnswerVisibility();
  if (state.answerVisible) {
    requestAnimationFrame(() => el("answerPanel").scrollIntoView({ behavior: "smooth", block: "start" }));
  }
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
