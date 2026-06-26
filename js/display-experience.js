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

const experienceContainer = document.getElementById("experienceContainer");


// ======================================
// Init
// ======================================

loadExperience();


// ======================================
// Load Experience
// ======================================

async function loadExperience() {

    try {

        experienceContainer.innerHTML = "";
        const snapshot = await getDocs(collection(db, "experience"));
        const experiences = [];

        // Collect all documents into an array (push)
        snapshot.forEach(docSnap => {
            experiences.push(docSnap.data());
        });

        // Sort NEWEST first
        experiences.sort((a, b) => {
            return b.startDate.localeCompare(a.startDate);
        });

        // Display the sorted array
        experiences.forEach(experience => {
            const item = document.createElement("div");

            item.className = "exp-item";

            item.innerHTML = `

                <div class="exp-date">

                    ${formatMonth(experience.startDate)}

                    –

                    ${experience.current
                        ? "Present"
                        : formatMonth(experience.endDate)}

                </div>

                <div>

                    <div class="exp-role">

                        ${experience.role}

                    </div>

                    <div class="exp-company">

                        ${experience.company}

                        •

                        ${experience.location}

                    </div>

                    <p class="exp-desc">

                        ${experience.description}

                    </p>

                </div>

            `;

            experienceContainer.appendChild(item);

        });
    }

    catch (error) {

        console.error(error);

        experienceContainer.innerHTML = `

            <p>
                Unable to load experience.
            </p>

        `;

    }

}


// ======================================
// Format Month
// ======================================

function formatMonth(date) {

    if (!date) return "";

    return new Date(date + "-01").toLocaleDateString("en-US", {

        month: "short",

        year: "numeric"

    });

}