import { load, save } from "../utils/storage.js";

const KEY = "anatomica-theme";

function apply(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

export function initTheme(button) {
  const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  let theme = load(KEY, preferred);
  apply(theme);

  button.addEventListener("click", () => {
    theme = theme === "dark" ? "light" : "dark";
    apply(theme);
    save(KEY, theme);
  });
}