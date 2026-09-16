(() => {
  const STORAGE_KEY = "gre-vocabulary-progress-v1";
  const words = Array.isArray(window.GRE_WORDS) ? window.GRE_WORDS : [];
  const byId = new Map(words.map((word) => [String(word.id), word]));

  const els = {
    card: document.getElementById("card"),
    word: document.getElementById("wordText"),
    meaning: document.getElementById("meaningText"),
    meaningNote: document.getElementById("meaningNote"),
    note: document.getElementById("noteText"),
    day: document.getElementById("dayText"),
    known: document.getElementById("knownCount"),
    unknown: document.getElementById("unknownCount"),
    remaining: document.getElementById("remainingCount"),
    progressLabel: document.getElementById("progressLabel"),
    progressCount: document.getElementById("progressCount"),
    progressFill: document.getElementById("progressFill"),
    unknownLabel: document.querySelector(".unknown-label"),
    knownLabel: document.querySelector(".known-label"),
    controls: document.querySelector(".controls"),
    complete: document.getElementById("completePanel")
  };

  let state = loadState();
  let dragging = false;
  let pointerStart = 0;
  let pointerDelta = 0;
  let suppressClick = false;
  let animating = false;

  function shuffle(items) {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function freshState() {
    return {
      queue: shuffle(words.map((word) => String(word.id))),
      known: [],
      missed: {},
      startedAt: Date.now()
    };
  }

  function loadState() {
    if (!words.length) return freshState();
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!saved || !Array.isArray(saved.queue) || !Array.isArray(saved.known)) return freshState();
      const known = saved.known.map(String).filter((id) => byId.has(id));
      const knownSet = new Set(known);
      let queue = saved.queue.map(String).filter((id) => byId.has(id) && !knownSet.has(id));
      const missing = words.map((word) => String(word.id)).filter((id) => !knownSet.has(id) && !queue.includes(id));
      queue = [...queue, ...shuffle(missing)];
      return { queue, known, missed: saved.missed || {}, startedAt: saved.startedAt || Date.now() };
    } catch {
      return freshState();
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function currentWord() {
    return byId.get(String(state.queue[0]));
  }

  function render() {
    const knownSet = new Set(state.known.map(String));
    const missedIds = Object.keys(state.missed).filter((id) => !knownSet.has(id));
    const done = state.known.length;
    const total = words.length;
    const remaining = Math.max(0, total - done);
    const word = currentWord();

    els.known.textContent = done.toLocaleString("ko-KR");
    els.unknown.textContent = missedIds.length.toLocaleString("ko-KR");
    els.remaining.textContent = remaining.toLocaleString("ko-KR");
    els.progressCount.textContent = `${done.toLocaleString("ko-KR")} / ${total.toLocaleString("ko-KR")}`;
    els.progressFill.style.width = total ? `${(done / total) * 100}%` : "0%";
    els.progressLabel.textContent = total ? "전체 단어 믹스 학습" : "단어 데이터가 없습니다";

    const complete = total > 0 && !word;
    els.card.hidden = complete;
    els.complete.hidden = !complete;
    els.controls.hidden = complete || total === 0;

    if (!word) {
      if (!total) {
        els.word.textContent = "No words";
        els.meaning.textContent = "words.csv와 words.js에 단어 데이터를 넣어주세요.";
        els.meaningNote.hidden = true;
      }
      return;
    }

    els.card.classList.remove("is-flipped");
    els.card.style.transform = "";
    els.word.textContent = word.word;
    const meaningParts = String(word.meaning || "뜻이 입력되어 있지 않습니다.").split(/\n\s*\n/);
    const meaning = meaningParts.shift().trim();
    const note = meaningParts.join("\n\n").trim();
    els.meaning.textContent = meaning;
    els.note.textContent = note;
    els.meaningNote.hidden = !note;
    els.day.textContent = word.day ? `DAY ${String(word.day).padStart(2, "0")} · MEANING` : "MEANING";
    els.card.setAttribute("aria-label", `${word.word}. 눌러서 뜻 보기`);
  }

  function insertLater(id) {
    const min = 4;
    const max = Math.min(state.queue.length, 9);
    const position = Math.max(1, Math.floor(Math.random() * Math.max(1, max - min + 1)) + min);
    state.queue.splice(Math.min(position, state.queue.length), 0, id);
  }

  function classify(result) {
    if (animating || !currentWord()) return;
    animating = true;
    const id = String(state.queue.shift());
    const direction = result === "known" ? 1 : -1;
    els.unknownLabel.style.opacity = "0";
    els.knownLabel.style.opacity = "0";
    els.card.style.transition = "transform .26s ease, opacity .26s ease";
    els.card.style.transform = `translateX(${direction * 125}%) rotate(${direction * 12}deg)`;
    els.card.style.opacity = "0";

    if (result === "known") {
      if (!state.known.includes(id)) state.known.push(id);
      delete state.missed[id];
    } else {
      state.missed[id] = (state.missed[id] || 0) + 1;
      insertLater(id);
    }

    saveState();
    window.setTimeout(() => {
      els.card.style.transition = "none";
      els.card.style.transform = `translateX(${direction * -16}%)`;
      render();
      els.card.style.opacity = "0";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          els.card.style.transition = "transform .22s ease, opacity .22s ease";
          els.card.style.transform = "translateX(0)";
          els.card.style.opacity = "1";
          animating = false;
        });
      });
    }, 255);
  }

  function flip() {
    if (!currentWord() || suppressClick || animating) return;
    els.card.classList.toggle("is-flipped");
    const flipped = els.card.classList.contains("is-flipped");
    els.card.setAttribute("aria-label", flipped ? "뜻 카드. 눌러서 단어 보기" : `${currentWord().word}. 눌러서 뜻 보기`);
  }

  function resetDrag() {
    els.card.style.transition = "transform .2s ease";
    els.card.style.transform = "translateX(0) rotate(0)";
    els.unknownLabel.style.opacity = "0";
    els.knownLabel.style.opacity = "0";
    pointerDelta = 0;
  }

  els.card.addEventListener("pointerdown", (event) => {
    if (animating) return;
    dragging = true;
    pointerStart = event.clientX;
    pointerDelta = 0;
    els.card.setPointerCapture(event.pointerId);
    els.card.style.transition = "none";
  });

  els.card.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    pointerDelta = event.clientX - pointerStart;
    if (Math.abs(pointerDelta) > 5) suppressClick = true;
    const rotation = Math.max(-9, Math.min(9, pointerDelta / 20));
    els.card.style.transform = `translateX(${pointerDelta}px) rotate(${rotation}deg)`;
    els.unknownLabel.style.opacity = String(Math.max(0, Math.min(1, -pointerDelta / 100)));
    els.knownLabel.style.opacity = String(Math.max(0, Math.min(1, pointerDelta / 100)));
  });

  els.card.addEventListener("pointerup", () => {
    if (!dragging) return;
    dragging = false;
    if (pointerDelta <= -85) classify("unknown");
    else if (pointerDelta >= 85) classify("known");
    else resetDrag();
    window.setTimeout(() => { suppressClick = false; }, 80);
  });

  els.card.addEventListener("pointercancel", () => {
    dragging = false;
    resetDrag();
  });

  els.card.addEventListener("click", flip);
  document.getElementById("unknownButton").addEventListener("click", () => classify("unknown"));
  document.getElementById("knownButton").addEventListener("click", () => classify("known"));
  document.getElementById("shuffleButton").addEventListener("click", () => {
    state.queue = shuffle(state.queue);
    saveState();
    render();
  });
  document.getElementById("resetButton").addEventListener("click", () => {
    if (!window.confirm("모든 학습 기록을 지우고 처음부터 시작할까요?")) return;
    state = freshState();
    saveState();
    render();
  });
  document.getElementById("restartButton").addEventListener("click", () => {
    state = freshState();
    saveState();
    render();
  });

  window.addEventListener("keydown", (event) => {
    const tag = event.target?.tagName?.toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select") return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      classify("unknown");
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      classify("known");
    }
    if (event.key === " " && tag !== "button") {
      event.preventDefault();
      flip();
    }
  });

  window.startVocabularySession = () => {
    state.queue = shuffle(state.queue);
    saveState();
    render();
    return { total: words.length, remaining: words.length - state.known.length };
  };

  const modelContext = typeof document === "undefined" ? undefined : document.modelContext;
  if (modelContext?.registerTool) {
    const lifecycle = new AbortController();
    try {
      void Promise.resolve(modelContext.registerTool({
        name: "shuffle_remaining_words",
        title: "Shuffle remaining GRE words",
        description: "Shuffle the words that remain in the current vocabulary study session and show the next card.",
        inputSchema: { type: "object", properties: {}, additionalProperties: false },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute() {
          state.queue = shuffle(state.queue);
          saveState();
          render();
          return { remaining: words.length - state.known.length, currentWord: currentWord()?.word || null };
        }
      }, { signal: lifecycle.signal })).catch(() => {});
    } catch {}
  }

  render();
})();
