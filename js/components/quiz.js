import { quizQuestions } from "../data/quiz.js";
import { el } from "../utils/dom.js";
import { load, save } from "../utils/storage.js";

const BEST_KEY = "anatomica-best-score";

export function initQuiz(root) {
  let index = 0;
  let score = 0;

  function renderQuestion() {
    const q = quizQuestions[index];
    const isLast = index === quizQuestions.length - 1;
    const feedback = el("p", { class: "quiz-feedback", "aria-live": "polite" });
    const next = el("button", { class: "btn btn-primary", type: "button", hidden: true }, isLast ? "See result" : "Next");
    const options = el("div", { class: "quiz-options" });

    q.options.forEach((text, i) => {
      const button = el("button", { class: "quiz-option", type: "button" }, text);
      button.addEventListener("click", () => {
        const buttons = [...options.children];
        buttons.forEach((b) => (b.disabled = true));
        buttons[q.answer].classList.add("correct");
        if (i === q.answer) {
          score += 1;
          feedback.textContent = `Correct! ${q.explanation}`;
        } else {
          button.classList.add("wrong");
          feedback.textContent = `Not quite. ${q.explanation}`;
        }
        next.hidden = false;
        next.focus();
      });
      options.append(button);
    });

    next.addEventListener("click", () => {
      index += 1;
      if (index < quizQuestions.length) renderQuestion();
      else renderResult();
    });

    root.replaceChildren(
      el("p", { class: "quiz-progress" }, `Question ${index + 1} of ${quizQuestions.length}`),
      el("h3", { class: "quiz-question" }, q.question),
      options,
      feedback,
      next
    );
  }

  function renderResult() {
    const best = Math.max(load(BEST_KEY, 0), score);
    save(BEST_KEY, best);

    const restart = el("button", { class: "btn btn-primary", type: "button" }, "Try again");
    restart.addEventListener("click", () => {
      index = 0;
      score = 0;
      renderQuestion();
    });

    root.replaceChildren(
      el("h3", {}, "Quiz complete"),
      el("p", { class: "quiz-score" }, `${score} / ${quizQuestions.length}`),
      el("p", {}, `Best score: ${best} / ${quizQuestions.length}`),
      restart
    );
  }

  renderQuestion();
}