import { el } from "../utils/dom.js";

export function initSearch(input, results, systems, onSelect) {
  const index = systems.flatMap((system) =>
    system.organs.map((organ) => ({ organ, system }))
  );

  function render(query) {
    results.replaceChildren();
    const q = query.trim().toLowerCase();
    if (!q) return;

    const matches = index.filter(
      ({ organ, system }) =>
        organ.name.toLowerCase().includes(q) ||
        organ.description.toLowerCase().includes(q) ||
        system.name.toLowerCase().includes(q)
    );

    if (!matches.length) {
      results.append(el("li", { class: "empty" }, "No organs found."));
      return;
    }

    matches.forEach(({ organ, system }) => {
      const button = el(
        "button",
        { class: "result-btn", type: "button", style: `--accent:${system.color}` },
        el("strong", {}, organ.name),
        el("span", {}, organ.description),
        el("small", {}, ` ${system.name}`)
      );
      button.addEventListener("click", () => onSelect(system));
      results.append(el("li", {}, button));
    });
  }

  input.addEventListener("input", () => render(input.value));
}