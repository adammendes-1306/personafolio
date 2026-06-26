import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const skillsContainer = document.getElementById("skillsContainer");

loadSkills();

async function loadSkills() {

    try {

        const snapshot = await getDocs(collection(db, "skills"));

        const grouped = {};

        snapshot.forEach((doc) => {

            const skill = doc.data();

            if (!grouped[skill.category]) {
                grouped[skill.category] = [];
            }

            grouped[skill.category].push(skill.tag);

        });

        renderSkills(grouped);

    }

    catch (error) {

        console.error("Error loading skills:", error);

        skillsContainer.innerHTML = `
            <p>Unable to load skills.</p>
        `;

    }

}

function renderSkills(groupedSkills) {

    skillsContainer.innerHTML = "";

    Object.keys(groupedSkills)
        .sort()
        .forEach(category => {

            const card = document.createElement("div");

            card.className = "skill-card";

            card.innerHTML = `

                <div class="skill-category">
                    ${category}
                </div>

                <div class="skill-tags">

                    ${groupedSkills[category]
                        .sort()
                        .map(tag => `
                            <span class="skill-tag">${tag}</span>
                        `)
                        .join("")}

                </div>

            `;

            skillsContainer.appendChild(card);

        });

}