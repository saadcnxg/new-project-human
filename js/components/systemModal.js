import { $, el } from "../utils/dom.js";

export function initSystemModal(dialog) {
  const body = $("#modalBody", dialog);

  $("#modalClose", dialog).addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  return function open(system) {
    dialog.style.setProperty("--accent", system.color);

    const organList = el("dl", { class: "organ-list" });
    system.organs.forEach((organ) => {
      organList.append(el("dt", {}, organ.name), el("dd", {}, organ.description));
    });

    const factList = el("ul", {});
    system.facts.forEach((fact) => factList.append(el("li", {}, fact)));

    body.replaceChildren(
      el("h2", { id: "modalTitle" }, `${system.icon} ${system.name}`),
      el("p", {}, system.summary),
      el("h3", {}, "Key organs"),
      organList,
      el("h3", {}, "Did you know?"),
      factList
    );

    dialog.showModal();
  };
}