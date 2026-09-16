(() => {
  const STORAGE_KEY = "gre-vocabulary-progress-v1";
  const PIPER_BUNDLE_URL = "./vendor/piper-tts.js?v=4";
  const words = Array.isArray(window.GRE_WORDS) ? window.GRE_WORDS : [];
  const byId = new Map(words.map((word) => [String(word.id), word]));
  const speechSupported = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;

  const els = {
    card: document.getElementById("card"),
    cardWrap: document.getElementById("cardWrap"),
    word: document.getElementById("wordText"),
    meaning: document.getElementById("meaningText"),
    meaningNote: document.getElementById("meaningNote"),
    note: document.getElementById("noteText"),
    pronounce: document.getElementById("pronounceButton"),
    pronounceText: document.getElementById("pronounceText"),
    pronunciationAudio: document.getElementById("pronunciationAudio"),
    voiceLoader: document.getElementById("voiceLoader"),
    voiceStatusTitle: document.getElementById("voiceStatusTitle"),
    voiceStatusDetail: document.getElementById("voiceStatusDetail"),
    voiceProgressText: document.getElementById("voiceProgressText"),
    voiceProgressFill: document.getElementById("voiceProgressFill"),
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
  let activeUtterance = null;
  let availableVoices = [];
  let piperSession = null;
  let piperStatus = "loading";
  let activeAudio = null;
  let preparedAudio = null;
  let preparationRequest = 0;
  let preparationQueue = Promise.resolve();
  let pronunciationBusy = false;
  let pronunciationRequest = 0;
  let voiceLoaderTimer = null;

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

  function refreshVoices() {
    if (!speechSupported) return [];
    availableVoices = window.speechSynthesis.getVoices();
    return availableVoices;
  }

  function stopPronunciation() {
    pronunciationRequest += 1;
    pronunciationBusy = false;
    if (activeAudio) {
      activeAudio.pause();
      activeAudio.currentTime = 0;
      activeAudio = null;
    }
    if (speechSupported) {
      const synthesis = window.speechSynthesis;
      if (activeUtterance || synthesis.speaking || synthesis.pending) synthesis.cancel();
    }
    activeUtterance = null;
    els.pronounce.classList.remove("is-speaking");
    els.pronounce.setAttribute("aria-pressed", "false");
    els.pronounceText.textContent = "발음";
  }

  function clearPreparedPronunciation() {
    preparationRequest += 1;
    if (preparedAudio) {
      preparedAudio.audio.pause();
      preparedAudio.audio.removeAttribute("src");
      preparedAudio.audio.load();
      URL.revokeObjectURL(preparedAudio.url);
      preparedAudio = null;
    }
    if (piperStatus === "ready") {
      els.pronounce.disabled = true;
      els.pronounceText.textContent = "준비 중";
    }
  }

  function setPronunciationActive(active) {
    els.pronounce.classList.toggle("is-speaking", active);
    els.pronounce.setAttribute("aria-pressed", String(active));
  }

  function updateVoiceLoader({ title, detail, label, progress, state = "loading" }) {
    window.clearTimeout(voiceLoaderTimer);
    els.voiceLoader.hidden = false;
    els.voiceLoader.classList.remove("is-leaving", "is-ready", "is-fallback", "has-progress");
    if (state === "ready") els.voiceLoader.classList.add("is-ready");
    if (state === "fallback") els.voiceLoader.classList.add("is-fallback");
    if (Number.isFinite(progress)) {
      els.voiceLoader.classList.add("has-progress");
      els.voiceProgressFill.style.width = `${Math.max(0, Math.min(100, progress))}%`;
    } else {
      els.voiceProgressFill.style.removeProperty("width");
    }
    els.voiceStatusTitle.textContent = title;
    els.voiceStatusDetail.textContent = detail;
    els.voiceProgressText.textContent = label;
  }

  function dismissVoiceLoader(delay) {
    window.clearTimeout(voiceLoaderTimer);
    voiceLoaderTimer = window.setTimeout(() => {
      els.voiceLoader.classList.add("is-leaving");
      window.setTimeout(() => { els.voiceLoader.hidden = true; }, 260);
    }, delay);
  }

  async function initializePiper() {
    try {
      const piper = await import(PIPER_BUNDLE_URL);
      const cached = await piper.isVoiceCached();
      updateVoiceLoader({
        title: cached ? "저장된 음성 모델 불러오는 중" : "음성 모델 다운로드 중",
        detail: cached ? "기기에 저장된 고품질 영어 음성을 준비하고 있어요." : "첫 실행에만 약 63MB를 내려받아요.",
        label: cached ? "준비 중" : "0%"
      });

      piperSession = await piper.createVoiceSession(({ loaded, total }) => {
        const megabytes = (loaded / 1024 / 1024).toFixed(1);
        if (total > 0) {
          const progress = Math.min(100, Math.round((loaded / total) * 100));
          updateVoiceLoader({
            title: progress >= 100 ? "음성 엔진 시작 중" : "음성 모델 다운로드 중",
            detail: progress >= 100 ? "다운로드를 마치고 음성을 준비하고 있어요." : `${megabytes}MB를 받았어요. 다음부터는 기기에 저장된 모델을 사용해요.`,
            label: `${progress}%`,
            progress
          });
        } else {
          updateVoiceLoader({
            title: "음성 모델 다운로드 중",
            detail: `${megabytes}MB를 받았어요. 다음부터는 기기에 저장된 모델을 사용해요.`,
            label: `${megabytes}MB`
          });
        }
      });

      piperStatus = "ready";
      els.pronounce.disabled = true;
      els.pronounce.title = "Piper 고품질 영어 음성";
      updateVoiceLoader({
        title: "음성 모델 준비 완료",
        detail: "이제 단어 발음을 기기에서 바로 만들 수 있어요.",
        label: "완료",
        progress: 100,
        state: "ready"
      });
      dismissVoiceLoader(1800);
      void preparePronunciation(currentWord());
    } catch (error) {
      console.error("Piper voice initialization failed", error);
      piperStatus = "fallback";
      els.pronounce.disabled = !speechSupported;
      els.pronounce.title = speechSupported ? "브라우저 기본 영어 음성" : "음성을 준비할 수 없습니다.";
      updateVoiceLoader({
        title: speechSupported ? "기본 음성으로 전환했어요" : "음성 모델을 준비하지 못했어요",
        detail: speechSupported ? "Piper를 불러오지 못해 브라우저 음성을 사용합니다." : "네트워크 연결을 확인한 뒤 페이지를 다시 열어주세요.",
        label: speechSupported ? "기본 음성" : "오류",
        state: "fallback"
      });
      dismissVoiceLoader(5000);
    }
  }

  function render() {
    stopPronunciation();
    clearPreparedPronunciation();
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
    els.cardWrap.hidden = complete;
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
    void preparePronunciation(word);
  }

  function insertLater(id) {
    const min = 4;
    const max = Math.min(state.queue.length, 9);
    const position = Math.max(1, Math.floor(Math.random() * Math.max(1, max - min + 1)) + min);
    state.queue.splice(Math.min(position, state.queue.length), 0, id);
  }

  function classify(result) {
    if (animating || !currentWord()) return;
    stopPronunciation();
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

  function finishPronunciation(requestId) {
    if (requestId !== pronunciationRequest) return;
    pronunciationBusy = false;
    activeAudio = null;
    activeUtterance = null;
    setPronunciationActive(false);
    els.pronounceText.textContent = "발음";
  }

  function useBrowserFallback(error, word, requestId) {
    if (requestId !== pronunciationRequest || piperStatus !== "ready") return;
    console.error("Piper pronunciation failed", error);
    piperStatus = "fallback";
    activeAudio = null;
    els.pronounce.disabled = !speechSupported;
    els.pronounce.title = speechSupported ? "브라우저 기본 영어 음성" : "음성을 재생할 수 없습니다.";
    updateVoiceLoader({
      title: speechSupported ? "기본 음성으로 전환했어요" : "음성을 재생하지 못했어요",
      detail: speechSupported ? "Piper 재생에 실패해 브라우저 음성을 사용합니다." : "페이지를 다시 열어 음성 모델을 준비해주세요.",
      label: speechSupported ? "기본 음성" : "오류",
      state: "fallback"
    });
    dismissVoiceLoader(5000);
    pronounceWithBrowser(word, requestId);
  }

  function preparePronunciation(word) {
    if (!word || piperStatus !== "ready") return Promise.resolve();
    const wordId = String(word.id);
    const requestId = ++preparationRequest;
    els.pronounce.disabled = true;
    els.pronounceText.textContent = "준비 중";

    preparationQueue = preparationQueue.catch(() => {}).then(async () => {
      if (requestId !== preparationRequest) return;
      try {
        const wav = await piperSession.predict(word.word);
        if (requestId !== preparationRequest || String(currentWord()?.id) !== wordId) return;

        const url = URL.createObjectURL(wav);
        const audio = els.pronunciationAudio;
        audio.preload = "auto";
        audio.src = url;
        audio.load();
        preparedAudio = { audio, url, wordId };
        els.pronounce.disabled = false;
        els.pronounceText.textContent = "발음";
      } catch (error) {
        if (requestId !== preparationRequest) return;
        console.error("Piper pronunciation preparation failed", error);
        piperStatus = "fallback";
        els.pronounce.disabled = !speechSupported;
        els.pronounceText.textContent = "발음";
        els.pronounce.title = speechSupported ? "브라우저 기본 영어 음성" : "음성을 재생할 수 없습니다.";
      }
    });
    return preparationQueue;
  }

  function pronounceWithPiper(word, requestId) {
    if (!preparedAudio || preparedAudio.wordId !== String(word.id)) {
      finishPronunciation(requestId);
      void preparePronunciation(word);
      return;
    }

    const audio = preparedAudio.audio;
    activeAudio = audio;
    audio.currentTime = 0;
    audio.onended = () => {
      if (activeAudio === audio) finishPronunciation(requestId);
    };
    audio.onerror = () => useBrowserFallback(new Error("Piper audio playback failed."), word, requestId);
    els.pronounceText.textContent = "재생 중";
    try {
      const playback = audio.play();
      if (playback?.catch) playback.catch((error) => useBrowserFallback(error, word, requestId));
    } catch (error) {
      useBrowserFallback(error, word, requestId);
    }
  }

  function pronounceWithBrowser(word, requestId) {
    if (!speechSupported) {
      finishPronunciation(requestId);
      return;
    }

    const synthesis = window.speechSynthesis;
    const utterance = new window.SpeechSynthesisUtterance(word.word);
    activeUtterance = utterance;
    utterance.lang = "en-US";
    utterance.rate = 0.82;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voices = availableVoices.length ? availableVoices : refreshVoices();
    const voice = voices.find((item) => item.lang === "en-US")
      || voices.find((item) => item.lang.startsWith("en"))
      || null;
    if (voice) utterance.voice = voice;

    els.pronounceText.textContent = "재생 중";
    const finish = () => {
      if (activeUtterance === utterance) finishPronunciation(requestId);
    };
    utterance.onend = finish;
    utterance.onerror = finish;
    try {
      synthesis.speak(utterance);
      if (synthesis.paused) synthesis.resume();
    } catch {
      finish();
    }
  }

  function pronounce() {
    const word = currentWord();
    if (!word || piperStatus === "loading") return;
    if (piperStatus === "ready" && (!preparedAudio || preparedAudio.wordId !== String(word.id))) {
      void preparePronunciation(word);
      return;
    }
    if (pronunciationBusy || activeAudio || activeUtterance) {
      stopPronunciation();
      return;
    }

    pronunciationBusy = true;
    const requestId = ++pronunciationRequest;
    setPronunciationActive(true);
    els.pronounceText.textContent = "재생 중";

    if (piperStatus !== "ready") {
      pronounceWithBrowser(word, requestId);
      return;
    }
    pronounceWithPiper(word, requestId);
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
  els.pronounce.addEventListener("click", pronounce);
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
    if (event.key.toLowerCase() === "s" && !event.metaKey && !event.ctrlKey && !event.altKey) {
      event.preventDefault();
      pronounce();
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

  if (speechSupported) {
    refreshVoices();
    window.speechSynthesis.addEventListener("voiceschanged", refreshVoices);
  }

  render();
  void initializePiper();
})();
