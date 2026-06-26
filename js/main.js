import { app } from "./firebase.js";

// Highlight active nav link based on current page
document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href').split('/').pop();

    if (href === page) {
      link.classList.add('active');
    }
  });
});