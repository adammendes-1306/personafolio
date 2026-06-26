// ======================================
// Firebase
// ======================================

import { db, auth } from "../../js/firebase.js";

import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


// ======================================
// Elements
// ======================================

const form = document.getElementById("skillForm");

const categoryInput = document.getElementById("category");
const tagInput = document.getElementById("tag");

const skillsList = document.getElementById("skillsList");

const toast = document.getElementById("toast");

let editingId = null;


// ======================================
// Init
// ======================================

loadSkills();

setupLogout();


// ======================================
// Load Skills
// ======================================

async function loadSkills() {

    skillsList.innerHTML = "";

    const snapshot = await getDocs(collection(db, "skills"));

    const grouped = {};

    snapshot.forEach(docSnap => {

        const skill = docSnap.data();

        if (!grouped[skill.category]) {
            grouped[skill.category] = [];
        }

        grouped[skill.category].push({
            id: docSnap.id,
            tag: skill.tag
        });

    });

    Object.keys(grouped)
        .sort()
        .forEach(category => {

            const card = document.createElement("div");

            card.className = "skill-card";

            card.innerHTML = `
                <div class="skill-category">
                    ${category}
                </div>

                <div class="skill-tags">
                    ${grouped[category].map(skill => `
                        <div class="admin-skill">

                            <span class="skill-tag">
                                ${skill.tag}
                            </span>

                            <button
                                class="edit-btn"
                                data-id="${skill.id}"
                                data-category="${category}"
                                data-tag="${skill.tag}">
                                <i class="fa-solid fa-pen"></i>
                            </button>

                            <button
                                class="delete-btn"
                                data-id="${skill.id}">
                                <i class="fa-solid fa-trash"></i>
                            </button>

                        </div>
                    `).join("")}
                </div>
            `;

            skillsList.appendChild(card);

        });

    attachEvents();

}


// ======================================
// Save Skill
// ======================================

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const data = {

        category: categoryInput.value.trim(),

        tag: tagInput.value.trim()

    };

    if (editingId) {

        await updateDoc(doc(db, "skills", editingId), data);

        showToast("Skill updated successfully.");

    } else {

        await addDoc(collection(db, "skills"), data);

        showToast("Skill added successfully.");

    }

    form.reset();

    editingId = null;

    loadSkills();

});


// ======================================
// Edit / Delete
// ======================================

function attachEvents() {

    document.querySelectorAll(".edit-btn").forEach(button => {

        button.onclick = () => {

            editingId = button.dataset.id;

            categoryInput.value = button.dataset.category;

            tagInput.value = button.dataset.tag;

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        };

    });

    document.querySelectorAll(".delete-btn").forEach(button => {

        button.onclick = async () => {

            if (!confirm("Delete this skill?")) return;

            await deleteDoc(doc(db, "skills", button.dataset.id));

            showToast("Skill deleted.");

            loadSkills();

        };

    });

}


// ======================================
// Toast
// ======================================

function showToast(message) {

    toast.textContent = message;

    toast.classList.remove("hidden");

    setTimeout(() => {

        toast.classList.add("hidden");

    }, 2500);

}


// ======================================
// Logout
// ======================================

function setupLogout() {

    const logoutBtn = document.getElementById("logoutBtn");
    const modal = document.getElementById("logoutModal");

    const cancelBtn = document.getElementById("cancelLogout");
    const confirmBtn = document.getElementById("confirmLogout");

    logoutBtn.addEventListener("click", () => {

        modal.classList.remove("hidden");

    });

    cancelBtn.addEventListener("click", () => {

        modal.classList.add("hidden");

    });

    confirmBtn.addEventListener("click", async () => {

        await signOut(auth);

        window.location.href = "login.html";

    });

}