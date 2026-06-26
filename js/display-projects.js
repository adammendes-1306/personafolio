// ======================================
// Firebase
// ======================================

import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


// ======================================
// Elements
// ======================================

const projectsContainer = document.getElementById("projectsContainer");


// ======================================
// Init
// ======================================

loadProjects();


// ======================================
// Load Projects
// ======================================

async function loadProjects() {

    try {

        projectsContainer.innerHTML = "";

        const snapshot = await getDocs(collection(db, "projects"));

        snapshot.forEach(docSnap => {

            const project = docSnap.data();

            const image = project.image || "../assets/project-placeholder.jpg";

            const card = document.createElement("div");

            card.className = "project-card";

            card.innerHTML = `

                <div
                    class="project-img"
                    style="background-image: url('${image}')">
                </div>

                <div class="project-body">

                    <div class="project-type">
                        ${project.type}
                    </div>

                    <div class="project-name">
                        ${project.name}
                    </div>

                    <p class="project-desc">
                        ${project.description}
                    </p>

                    <div class="project-stack">

                        ${(project.tags || []).map(tag => `
                            <span class="stack-tag">
                                ${tag}
                            </span>
                        `).join("")}

                    </div>

                    <div class="project-links">

                        ${(project.links || []).map(link => `
                            <a
                                href="${link.url}"
                                target="_blank"
                                class="project-link">

                                ${link.label} →

                            </a>
                        `).join("")}

                    </div>

                </div>

            `;

            projectsContainer.appendChild(card);

        });

    }

    catch (error) {

        console.error(error);

        projectsContainer.innerHTML = `
            <p>Unable to load projects.</p>
        `;

    }

}