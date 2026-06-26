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

const form = document.getElementById("experienceForm");

const startDateInput = document.getElementById("startDate");
const endDateInput = document.getElementById("endDate");

const currentCheckbox = document.getElementById("current");

const roleInput = document.getElementById("role");
const companyInput = document.getElementById("company");
const locationInput = document.getElementById("location");
const descriptionInput = document.getElementById("description");

const experienceList = document.getElementById("experienceList");

const toast = document.getElementById("toast");

let editingId = null;

let experiences = [];


// ======================================
// Init
// ======================================

loadExperience();

setupLogout();


// ======================================
// Current Job Checkbox
// ======================================

currentCheckbox.addEventListener("change", () => {

    endDateInput.disabled = currentCheckbox.checked;

    if (currentCheckbox.checked) {

        endDateInput.value = "";

    }

});


// ======================================
// Load Experience
// ======================================

async function loadExperience() {

    experiences = [];

    experienceList.innerHTML = "";

    const snapshot = await getDocs(collection(db, "experience"));

    snapshot.forEach((docSnap) => {

        const experience = {

            id: docSnap.id,

            ...docSnap.data()

        };

        experiences.push(experience);

        const card = document.createElement("div");

        card.className = "experience-card";

        card.innerHTML = `

            <div class="experience-body">

                <p class="experience-date">

                    ${formatMonth(experience.startDate)}

                    -

                   ${experience.current
                        ? "Present"
                        : formatMonth(experience.endDate)}

                </p>

                <h3 class="experience-role">

                    ${experience.role}

                </h3>

                <p class="experience-company">

                    ${experience.company}

                    •

                    ${experience.location}

                </p>

                <p class="experience-description">

                    ${experience.description}

                </p>

                <div class="experience-actions">

                    <button
                        class="edit-btn"
                        data-id="${experience.id}">

                        <i class="fa-solid fa-pen"></i>

                    </button>

                    <button
                        class="delete-btn"
                        data-id="${experience.id}">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            </div>

        `;

        experienceList.appendChild(card);

    });

    attachEvents();

}


// ======================================
// Save Experience
// ======================================

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const experience = {

        startDate: startDateInput.value,

        endDate: currentCheckbox.checked
            ? ""
            : endDateInput.value,

        current: currentCheckbox.checked,

        role: roleInput.value.trim(),

        company: companyInput.value.trim(),

        location: locationInput.value.trim(),

        description: descriptionInput.value.trim()

    };

    try {

        if (editingId) {

            await updateDoc(

                doc(db, "experience", editingId),

                experience

            );

            showToast("Experience updated successfully.");

        }

        else {

            await addDoc(

                collection(db, "experience"),

                experience

            );

            showToast("Experience added successfully.");

        }

        resetForm();

        loadExperience();

    }

    catch (error) {

        console.error(error);

        showToast("Something went wrong.");

    }

});

// ======================================
// Edit / Delete
// ======================================

function attachEvents() {

    document.querySelectorAll(".edit-btn").forEach(button => {

        button.onclick = () => {

            const experience = experiences.find(
                exp => exp.id === button.dataset.id
            );

            if (!experience) return;

            resetForm();

            editingId = experience.id;

            startDateInput.value = experience.startDate || "";

            currentCheckbox.checked = experience.current;

            endDateInput.disabled = experience.current;

            endDateInput.value = experience.current
                ? ""
                : experience.endDate || "";

            roleInput.value = experience.role || "";

            companyInput.value = experience.company || "";

            locationInput.value = experience.location || "";

            descriptionInput.value = experience.description || "";

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        };

    });

    document.querySelectorAll(".delete-btn").forEach(button => {

        button.onclick = async () => {

            if (!confirm("Delete this experience?")) return;

            await deleteDoc(
                doc(db, "experience", button.dataset.id)
            );

            showToast("Experience deleted.");

            loadExperience();

        };

    });

}


// ======================================
// Reset Form
// ======================================

function resetForm() {

    editingId = null;

    form.reset();

    currentCheckbox.checked = false;

    endDateInput.disabled = false;

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

    logoutBtn.onclick = () => {

        modal.classList.remove("hidden");

    };

    cancelBtn.onclick = () => {

        modal.classList.add("hidden");

    };

    confirmBtn.onclick = async () => {

        await signOut(auth);

        window.location.href = "login.html";

    };

}

// Format: Jun 2026 - Present
function formatMonth(date) {

    if (!date) return "";

    return new Date(date + "-01").toLocaleDateString("en-US", {

        month: "short",

        year: "numeric"

    });

}