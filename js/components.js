async function loadComponent(id, file) {
  try {
    const response = await fetch(file);

    if (!response.ok) {
      throw new Error(`Failed to load ${file}`);
    }

    const html = await response.text();
    document.getElementById(id).innerHTML = html;

    if (id === "nav-placeholder") {
      setupNavLinks();
    }

  } catch (error) {
    console.error(error);
  }
}

// Check if the current page is inside /pages/
const isPages = window.location.pathname.includes("/pages/");

// Choose the correct path
const componentPath = isPages ? "../components/" : "components/";

// Load components
loadComponent("nav-placeholder", `${componentPath}nav.html`);
loadComponent("footer-placeholder", `${componentPath}footer.html`);

function setupNavLinks() {
  const base = isPages ? "../" : "";

  document.getElementById("nav-logo").href = `${base}index.html`;
  document.getElementById("nav-home").href = `${base}index.html`;
  document.getElementById("nav-about").href = `${base}pages/about.html`;
  document.getElementById("nav-skills").href = `${base}pages/skills.html`;
  document.getElementById("nav-projects").href = `${base}pages/projects.html`;
  document.getElementById("nav-experience").href = `${base}pages/experience.html`;
  document.getElementById("nav-contact").href = `${base}pages/contact.html`;
}