document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.card').forEach((card, i) => {
    card.style.animationDelay = (i * 0.06) + 's';
  });
});