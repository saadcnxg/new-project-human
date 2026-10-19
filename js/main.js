import { $ } from "./utils/dom.js";
import { systems, heroStats } from "./data/index.js";
import { initHeader } from "./components/header.js";
import { initTheme } from "./components/theme.js";
import { renderStats, renderSystemGrid } from "./components/systemGrid.js";
import { initSystemModal } from "./components/systemModal.js";
import { initSearch } from "./components/search.js";
import { initQuiz } from "./components/quiz.js";

const openSystem = initSystemModal($("#systemModal"));

initHeader();
initTheme($("#themeToggle"));
renderStats($("#heroStats"), heroStats);
renderSystemGrid($("#systemGrid"), systems, openSystem);
initSearch($("#searchInput"), $("#searchResults"), systems, openSystem);
initQuiz($("#quizRoot"));