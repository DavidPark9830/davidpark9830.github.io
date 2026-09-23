(() => {
  "use strict";

  const $ = id => document.getElementById(id);
  const header = document.querySelector('.test-header');
  const tools = $('examTools');
  if (!header || !tools) return;

  const original = {
    review: $('reviewButton'),
    back: $('backButton'),
    next: $('nextButton'),
    mark: $('markCheckbox'),
    time: $('timeToggle'),
    calculator: $('calculatorButton'),
    answers: $('answerToggle')
  };

  function toolButton(kind, label, icon) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `header-button pp-tool pp-${kind}`;
    button.dataset.ppTool = kind;
    button.innerHTML = `<span class="pp-tool-label">${label}</span><span class="pp-tool-icon" aria-hidden="true">${icon}</span>`;
    return button;
  }

  const exit = toolButton('exit', 'Exit Section', '×');
  const mark = toolButton('mark', 'Mark', '⚑');
  const review = toolButton('review', 'Review', '☑');
  const help = toolButton('help', 'Help', '?');
  const back = toolButton('back', 'Back', '←');
  const next = toolButton('next', 'Next', '→');

  tools.replaceChildren();
  tools.append(exit);

  let calculatorButton = original.calculator;
  if (!calculatorButton && $('sectionName')) calculatorButton = toolButton('calc', 'Calc', '▦');
  if (calculatorButton) {
    calculatorButton.className = 'header-button pp-tool pp-calc';
    calculatorButton.dataset.ppTool = 'calc';
    calculatorButton.innerHTML = '<span class="pp-tool-label">Calc</span><span class="pp-tool-icon" aria-hidden="true">▦</span>';
    tools.append(calculatorButton);
  }

  if (original.answers) {
    original.answers.className = 'header-button answer-toggle pp-tool pp-answers';
    const label = $('answerToggleLabel');
    if (label) label.textContent = 'Answers';
    original.answers.insertAdjacentHTML('beforeend', '<span class="pp-tool-icon" aria-hidden="true">A</span>');
    tools.append(original.answers);
  }

  tools.append(mark, review, help, back, next);

  const status = document.querySelector('.question-status');
  if (status && original.time) {
    const timeWrap = document.createElement('div');
    timeWrap.className = 'pp-status-time';
    original.time.classList.add('pp-time-button');
    timeWrap.append(original.time);
    status.append(timeWrap);
  }

  const helpPanel = document.createElement('aside');
  helpPanel.className = 'pp-help-panel';
  helpPanel.hidden = true;
  helpPanel.innerHTML = '<button type="button" class="pp-help-close" aria-label="Close help">×</button><strong>Test controls</strong><p>Use Mark to flag a question, Review to check progress, and Back or Next to move between questions. In Quant sections, Calc opens a movable calculator.</p>';
  document.body.append(helpPanel);
  helpPanel.querySelector('button').addEventListener('click', () => { helpPanel.hidden = true; });

  function syncToolbar() {
    if (original.back) back.disabled = original.back.disabled;
    if (original.next) {
      const label = original.next.textContent.trim() || 'Next';
      next.querySelector('.pp-tool-label').textContent = label;
      next.querySelector('.pp-tool-icon').textContent = /submit|finish|review/i.test(label) ? '✓' : '→';
      next.disabled = original.next.disabled;
    }
    if (original.mark) {
      mark.classList.toggle('active', original.mark.checked);
      mark.setAttribute('aria-pressed', String(original.mark.checked));
    }
    if (calculatorButton && $('sectionName')) {
      calculatorButton.hidden = !/quantitative/i.test($('sectionName').textContent);
    }
  }

  mark.addEventListener('click', () => {
    if (!original.mark) return;
    original.mark.checked = !original.mark.checked;
    original.mark.dispatchEvent(new Event('change', { bubbles: true }));
    syncToolbar();
  });
  review.addEventListener('click', () => { original.review?.click(); setTimeout(syncToolbar); });
  back.addEventListener('click', () => { original.back?.click(); setTimeout(syncToolbar); });
  next.addEventListener('click', () => { original.next?.click(); setTimeout(syncToolbar); });
  help.addEventListener('click', () => {
    helpPanel.hidden = !helpPanel.hidden;
    if (!helpPanel.hidden) helpPanel.querySelector('button').focus();
  });
  exit.addEventListener('click', () => {
    if (!window.confirm('Exit this practice section? Your current progress will remain saved when supported.')) return;
    window.location.href = new URL('../index.html', window.location.href).href;
  });
  original.mark?.addEventListener('change', syncToolbar);

  const observed = [$('questionNumber'), $('sectionName'), original.next].filter(Boolean);
  const observer = new MutationObserver(() => queueMicrotask(syncToolbar));
  observed.forEach(node => observer.observe(node, { childList: true, subtree: true, characterData: true, attributes: true }));
  syncToolbar();

  if (!calculatorButton) return;

  let dialog = $('calculatorDialog');
  if (!dialog) {
    dialog = document.createElement('dialog');
    dialog.id = 'calculatorDialog';
    dialog.className = 'calculator pp-calculator';
    dialog.setAttribute('aria-label', 'Calculator');
    document.body.append(dialog);
  }
  dialog.classList.add('pp-calculator');
  dialog.innerHTML = `
    <div class="calculator-top" id="calculatorDragHandle">
      <strong>Calculator</strong>
      <button id="calculatorClose" type="button" aria-label="Close calculator">×</button>
    </div>
    <output id="calculatorDisplay" aria-live="polite">0.</output>
    <div class="calculator-grid" id="calculatorGrid">
      <button class="calc-function" data-action="memory-recall">MR</button>
      <button class="calc-function" data-action="memory-clear">MC</button>
      <button class="calc-function" data-action="memory-add">M+</button>
      <button class="calc-function" data-value="(">(</button>
      <button class="calc-function" data-value=")">)</button>
      <button data-value="7">7</button><button data-value="8">8</button><button data-value="9">9</button><button class="calc-operator" data-value="/">÷</button><button class="calc-clear" data-action="clear">C</button>
      <button data-value="4">4</button><button data-value="5">5</button><button data-value="6">6</button><button class="calc-operator" data-value="*">×</button><button class="calc-clear" data-action="clear-entry">CE</button>
      <button data-value="1">1</button><button data-value="2">2</button><button data-value="3">3</button><button class="calc-operator" data-value="-">−</button><button class="calc-operator" data-action="sqrt">√</button>
      <button class="calc-function" data-action="sign">±</button><button data-value="0">0</button><button data-value=".">.</button><button class="calc-operator" data-value="+">+</button><button class="equals" data-action="equals">=</button>
    </div>
    <button class="calculator-transfer" id="calculatorTransfer" type="button">Transfer Display</button>`;

  const display = $('calculatorDisplay');
  const grid = $('calculatorGrid');
  const close = $('calculatorClose');
  const transfer = $('calculatorTransfer');
  const handle = $('calculatorDragHandle');
  let expression = '';
  let shown = '0.';
  let memory = 0;
  let lastAnswerInput = null;

  document.addEventListener('focusin', event => {
    if (event.target.matches?.('.numeric-entry input, .fraction-entry input')) lastAnswerInput = event.target;
  });

  function safeCalculate(value) {
    if (!value || !/^[0-9+\-*/.() ]+$/.test(value)) return NaN;
    try {
      const result = Function(`"use strict"; return (${value})`)();
      return typeof result === 'number' && Number.isFinite(result) ? result : NaN;
    } catch { return NaN; }
  }
  function format(value) {
    if (!Number.isFinite(value)) return 'Error';
    const rounded = Number.parseFloat(value.toPrecision(12));
    return String(rounded).slice(0, 16);
  }
  function update(value) {
    shown = String(value).slice(0, 18);
    display.textContent = shown === '0' ? '0.' : shown;
  }
  function currentValue() {
    const value = safeCalculate(expression || shown.replace(/\.$/, ''));
    return Number.isFinite(value) ? value : 0;
  }
  function insert(value) {
    if (shown === 'Error') expression = '';
    expression += value;
    update(expression);
  }
  function clearEntry() {
    expression = expression.replace(/-?(?:\d+\.?\d*|\.\d+)$/, '');
    update(expression || '0.');
  }

  grid.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    const value = button.dataset.value;
    const action = button.dataset.action;
    if (value) insert(value);
    else if (action === 'clear') { expression = ''; update('0.'); }
    else if (action === 'clear-entry') clearEntry();
    else if (action === 'equals') {
      const result = safeCalculate(expression);
      expression = Number.isFinite(result) ? format(result) : '';
      update(Number.isFinite(result) ? expression : 'Error');
    } else if (action === 'sqrt') {
      const result = Math.sqrt(currentValue());
      expression = Number.isFinite(result) ? format(result) : '';
      update(Number.isFinite(result) ? expression : 'Error');
    } else if (action === 'sign') {
      const result = -currentValue(); expression = format(result); update(expression);
    } else if (action === 'memory-clear') memory = 0;
    else if (action === 'memory-recall') { expression = format(memory); update(expression); }
    else if (action === 'memory-add') memory += currentValue();
  });

  function openCalculator(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    if (!dialog.open) dialog.show();
    if (!dialog.dataset.positioned) {
      const width = Math.min(360, window.innerWidth - 24);
      dialog.style.left = `${Math.max(12, window.innerWidth - width - 28)}px`;
      dialog.style.top = `${Math.max(82, Math.round(window.innerHeight * .19))}px`;
      dialog.dataset.positioned = 'true';
    }
  }
  calculatorButton.addEventListener('click', openCalculator, true);
  close.addEventListener('click', () => dialog.close());
  transfer.addEventListener('click', () => {
    let input = lastAnswerInput;
    if (!input || !document.contains(input)) input = document.querySelector('.numeric-entry input, .fraction-entry input');
    if (!input) return;
    const value = shown === 'Error' ? '' : shown.replace(/\.$/, '');
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    input.focus();
  });

  let drag = null;
  handle.addEventListener('pointerdown', event => {
    if (event.target.closest('button')) return;
    const rect = dialog.getBoundingClientRect();
    drag = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    handle.setPointerCapture(event.pointerId);
    event.preventDefault();
  });
  handle.addEventListener('pointermove', event => {
    if (!drag) return;
    const maxLeft = Math.max(0, window.innerWidth - dialog.offsetWidth);
    const maxTop = Math.max(0, window.innerHeight - dialog.offsetHeight);
    dialog.style.left = `${Math.min(maxLeft, Math.max(0, event.clientX - drag.x))}px`;
    dialog.style.top = `${Math.min(maxTop, Math.max(0, event.clientY - drag.y))}px`;
  });
  handle.addEventListener('pointerup', event => {
    drag = null;
    if (handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId);
  });
})();
