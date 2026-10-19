import { el } from "../utils/dom.js";

export function renderStats(container, stats) {
  container.replaceChildren(
    ...stats.map((s) => el("li", { class: "stat" }, el("strong", {}, s.value), el("span", {}, s.label)))
  );
}

export function renderSystemGrid(container, systems, onSelect) {
  const cards = systems.map((system) => {
    const card = el(
      "button",
      { class: "card", type: "button", style: `--accent:${system.color}` },
      el("span", { class: "card-icon", "aria-hidden": "true" }, system.icon),
      el("h3", {}, system.name),
      el("p", {}, system.summary),
      el("span", { class: "card-link" }, "Learn more →")
    );
    card.addEventListener("click", () => onSelect(system));
    return card;
  });
  container.replaceChildren(...cards);
}