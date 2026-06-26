async function loadComponent(id, file) {
  const response = await fetch(file);
  const html = await response.text();
  document.getElementById(id).innerHTML = html;
}

loadComponent("nav-placeholder", "/components/nav.html");
loadComponent("footer-placeholder", "/components/footer.html");