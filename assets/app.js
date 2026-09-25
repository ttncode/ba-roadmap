(() => {
  const STORAGE_KEY = "ba-dojo-progress";
  const DEFAULT_TAB = "intro";
  const MESSAGES = {
    vi: {
      readFailed: "Không đọc được tiến độ đã lưu:",
      saveFailed: "Không lưu được tiến độ:",
      renderFailed: "Không vẽ được sơ đồ:",
      confirmReset: "Xóa toàn bộ tiến độ đã đánh dấu?",
    },
    en: {
      readFailed: "Could not read saved progress:",
      saveFailed: "Could not save progress:",
      renderFailed: "Could not render diagram:",
      confirmReset: "Clear all marked progress?",
    },
  };
  const t = MESSAGES[document.documentElement.lang] ?? MESSAGES.vi;
  const LIGHT_DIAGRAM_THEME = {
    primaryColor: "#EBEFF4",
    primaryTextColor: "#26272B",
    primaryBorderColor: "#2F4B6E",
    secondaryColor: "#F6F0E3",
    tertiaryColor: "#FAF9F5",
    lineColor: "#8A8C93",
    clusterBkg: "#FAF9F5",
    clusterBorder: "#CFCABD",
    noteBkgColor: "#F6F0E3",
    noteBorderColor: "#94743A",
    fontSize: "14px",
  };

  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const panels = [...document.querySelectorAll('[role="tabpanel"]')];
  const checkboxes = [...document.querySelectorAll("input[data-step]")];

  const readProgress = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {};
    } catch (error) {
      console.warn(t.readFailed, error);
      return {};
    }
  };

  const writeProgress = (progress) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.warn(t.saveFailed, error);
    }
  };

  const prefersDark = () => {
    const forced = document.documentElement.dataset.theme;
    if (forced) return forced === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  };

  const mermaidAvailable = () => typeof window.mermaid !== "undefined";

  function initMermaid() {
    if (!mermaidAvailable()) return;
    const dark = prefersDark();
    window.mermaid.initialize({
      startOnLoad: false,
      securityLevel: "strict",
      theme: dark ? "dark" : "base",
      themeVariables: dark ? {} : LIGHT_DIAGRAM_THEME,
      fontFamily: '"Noto Sans", system-ui, sans-serif',
      flowchart: { curve: "basis" },
    });
  }

  // Mermaid sizes the svg to 100% of its box; pinning the natural width lets phones scroll a wide diagram instead of shrinking its text.
  function useNaturalWidth(node) {
    const svg = node.querySelector("svg");
    if (svg && svg.style.maxWidth) svg.style.width = svg.style.maxWidth;
  }

  // Serialized so two overlapping triggers (tab switch + "open all") never render the same node twice.
  let renderQueue = Promise.resolve();
  function renderDiagrams(root) {
    if (!mermaidAvailable() || !root) return;
    renderQueue = renderQueue
      .then(() => {
        const nodes = [...root.querySelectorAll("pre.mermaid:not([data-processed])")]
          .filter((node) => node.offsetParent !== null);
        return nodes.length > 0 ? window.mermaid.run({ nodes }).then(() => nodes.forEach(useNaturalWidth)) : undefined;
      })
      .catch((error) => console.error(t.renderFailed, error));
  }

  function activateTab(id) {
    const targetId = panels.some((panel) => panel.id === id) ? id : DEFAULT_TAB;
    tabs.forEach((tab) => {
      const selected = tab.dataset.target === targetId;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected) tab.scrollIntoView({ block: "nearest", inline: "nearest" });
    });
    panels.forEach((panel) => { panel.hidden = panel.id !== targetId; });
    history.replaceState(null, "", `#${targetId}`);
    syncLanguageLinks(targetId);
    renderDiagrams(document.getElementById(targetId));
  }

  // Keeps the open tab when switching language; both pages share panel ids.
  function syncLanguageLinks(targetId) {
    document.querySelectorAll("[data-lang-link]").forEach((link) => {
      link.hash = targetId;
    });
  }

  function openTab(id) {
    activateTab(id);
    window.scrollTo({ top: 0 });
  }

  function countDone(boxes) {
    return boxes.filter((box) => box.checked).length;
  }

  function paintProgress(scope, boxes) {
    const done = countDone(boxes);
    const percent = boxes.length === 0 ? 0 : Math.round((done / boxes.length) * 100);
    document.querySelectorAll(`[data-progress-bar="${scope}"]`).forEach((bar) => { bar.style.width = `${percent}%`; });
    document.querySelectorAll(`[data-progress-text="${scope}"]`).forEach((text) => { text.textContent = `${done}/${boxes.length}`; });
  }

  function updateProgress() {
    paintProgress("all", checkboxes);
    panels.forEach((panel) => paintProgress(panel.id, [...panel.querySelectorAll("input[data-step]")]));
  }

  function setAnswersOpen(panelId, open) {
    const panel = document.getElementById(panelId);
    panel.querySelectorAll("details.answer").forEach((details) => { details.open = open; });
    if (open) renderDiagrams(panel);
  }

  const normalizeText = (text) => text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d");

  function filterGlossary(query) {
    const needle = normalizeText(query.trim());
    let visibleCount = 0;
    document.querySelectorAll("[data-glossary] .terms").forEach((list) => {
      let visibleInList = 0;
      list.querySelectorAll(".term").forEach((term) => {
        const match = needle === "" || normalizeText(term.textContent).includes(needle);
        term.hidden = !match;
        if (match) visibleInList += 1;
      });
      list.hidden = visibleInList === 0;
      list.previousElementSibling.hidden = visibleInList === 0;
      visibleCount += visibleInList;
    });
    document.querySelector("[data-glossary-empty]").hidden = visibleCount > 0;
  }

  function bindTabs() {
    tabs.forEach((tab, index) => {
      tab.id = `tab-${tab.dataset.target}`;
      tab.setAttribute("aria-controls", tab.dataset.target);
      tab.addEventListener("click", () => openTab(tab.dataset.target));
      tab.addEventListener("keydown", (event) => {
        const moves = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: tabs.length - 1 };
        if (!(event.key in moves)) return;
        event.preventDefault();
        const next = tabs[(moves[event.key] + tabs.length) % tabs.length];
        activateTab(next.dataset.target);
        next.focus();
      });
    });
    panels.forEach((panel) => panel.setAttribute("aria-labelledby", `tab-${panel.id}`));
    document.querySelectorAll("[data-goto]").forEach((button) => {
      button.addEventListener("click", () => openTab(button.dataset.goto));
    });
  }

  function bindProgress() {
    const progress = readProgress();
    checkboxes.forEach((box) => {
      box.checked = Boolean(progress[box.dataset.step]);
      box.addEventListener("change", () => {
        writeProgress({ ...readProgress(), [box.dataset.step]: box.checked });
        updateProgress();
      });
    });
    document.querySelector("[data-reset]").addEventListener("click", () => {
      if (!window.confirm(t.confirmReset)) return;
      writeProgress({});
      checkboxes.forEach((box) => { box.checked = false; });
      updateProgress();
    });
    updateProgress();
  }

  function bindAnswers() {
    document.querySelectorAll("[data-expand]").forEach((button) => {
      button.addEventListener("click", () => setAnswersOpen(button.dataset.expand, true));
    });
    document.querySelectorAll("[data-collapse]").forEach((button) => {
      button.addEventListener("click", () => setAnswersOpen(button.dataset.collapse, false));
    });
    // "toggle" does not bubble, so listen in the capture phase.
    document.addEventListener("toggle", (event) => {
      if (event.target.open) renderDiagrams(event.target);
    }, true);
  }

  function bindGlossary() {
    const search = document.getElementById("glossary-search");
    search.addEventListener("input", () => filterGlossary(search.value));
  }

  bindTabs();
  bindProgress();
  bindAnswers();
  bindGlossary();
  initMermaid();

  const startTab = location.hash.slice(1) || DEFAULT_TAB;
  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
  fontsReady.then(() => openTab(startTab), () => openTab(startTab));
})();
