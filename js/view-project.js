// ======================================
// Firebase
// ======================================

import { db } from "./firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


// ======================================
// Elements
// ======================================

const container = document.getElementById("projectContainer");


// ======================================
// Init
// ======================================

loadProject();


// ======================================
// Load Project
// ======================================

async function loadProject() {

    try {

        const params = new URLSearchParams(window.location.search);

        const projectId = params.get("id");

        if (!projectId) {

            showError("Project not found.");

            return;

        }

        const snapshot = await getDoc(
            doc(db, "projects", projectId)
        );

        if (!snapshot.exists()) {

            showError("Project not found.");

            return;

        }

        const project = snapshot.data();

        renderProject(project);

    }

    catch (error) {

        console.error(error);

        showError("Unable to load project.");

    }

}


// ======================================
// Render Project
// ======================================

function renderProject(project) {

    const image =
        project.image || "../assets/project-placeholder.png";

    container.innerHTML = `

        <a href="projects.html" class="back-link">
            ← Back to Projects
        </a>

        <div class="project-type">
            ${project.type || ""}
        </div>

        <h1 class="project-title">
            ${project.name || ""}
        </h1>

        <p class="project-description">
            ${project.description || ""}
        </p>

        <div
            class="hero-image"
            style="background-image:url('${image}')">
        </div>

        <div class="tag-list">

            ${(project.tags || []).map(tag => `
                <span class="tag">
                    ${tag}
                </span>
            `).join("")}

        </div>

        <div class="links">

            ${(project.links || []).map(link => `
                <a
                    href="${link.url}"
                    target="_blank"
                    class="btn btn-outline">

                    ${link.label}

                </a>
            `).join("")}

        </div>

        ${renderProjectInfo(project)}

        ${renderFeatures(project)}

        ${renderGallery(project)}

    `;

}


// ======================================
// Project Information
// ======================================

function renderProjectInfo(project) {

    const rows = [];

    if (project.role) {

        rows.push(`
            <div class="info-item">
                <span class="info-label">Role</span>
                <span class="info-value">${project.role}</span>
            </div>
        `);

    }

    if (project.duration) {

        rows.push(`
            <div class="info-item">
                <span class="info-label">Duration</span>
                <span class="info-value">${project.duration}</span>
            </div>
        `);

    }

    if (project.status) {

        rows.push(`
            <div class="info-item">
                <span class="info-label">Status</span>
                <span class="info-value">${project.status}</span>
            </div>
        `);

    }

    if (rows.length === 0) {

        return "";

    }

    return `

        <section class="section-card">

            <h2 class="card-title">
                Project Information
            </h2>

            <div class="info-grid">

                ${rows.join("")}

            </div>

        </section>

    `;

}


// ======================================
// Features
// ======================================

function renderFeatures(project) {

    if (!project.features || project.features.length === 0) {

        return "";

    }

    return `

        <section class="section-card">

            <h2 class="card-title">
                Key Features
            </h2>

            <div class="feature-list">

                ${project.features.map(feature => `

                    <div class="feature-item">

                        <span class="feature-icon">

                            ✓

                        </span>

                        ${feature}

                    </div>

                `).join("")}

            </div>

        </section>

    `;

}


// ======================================
// Gallery
// ======================================

function renderGallery(project) {

    if (!project.gallery || project.gallery.length === 0) {

        return "";

    }

    return `

        <section class="section-card">

            <h2 class="card-title">
                Project Gallery
            </h2>

            <div class="gallery-grid">

                ${project.gallery.map(image => `

                    <div class="gallery-item">

                        <img
                            src="${image}"
                            alt="Project Screenshot">

                    </div>

                `).join("")}

            </div>

        </section>

    `;

}


// ======================================
// Error
// ======================================

function showError(message) {

    container.innerHTML = `

        <a href="projects.html" class="back-link">
            ← Back to Projects
        </a>

        <h1 class="section-title">
            ${message}
        </h1>

    `;

}