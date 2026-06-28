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

const form = document.getElementById("projectForm");

const imageInput = document.getElementById("image");
const typeInput = document.getElementById("type");
const nameInput = document.getElementById("name");
const descriptionInput = document.getElementById("description");
const tagsInput = document.getElementById("tags");

// Display at view-project
const durationInput = document.getElementById("duration");
const statusInput = document.getElementById("status");
const featuresInput = document.getElementById("features");
const galleryInput = document.getElementById("gallery");

const linksContainer = document.getElementById("linksContainer");
const addLinkBtn = document.getElementById("addLinkBtn");

const projectsList = document.getElementById("projectsList");

const toast = document.getElementById("toast");

let editingId = null;

let projects = [];

// ======================================
// Init
// ======================================

loadProjects();

setupLogout();


// ======================================
// Load Projects
// ======================================

async function loadProjects() {

    // Reset array every reload
    projects = [];

    projectsList.innerHTML = "";

    const snapshot = await getDocs(collection(db, "projects"));

    snapshot.forEach((docSnap) => {

        const project = {
            id: docSnap.id,
            ...docSnap.data()
        };

        projects.push(project);

        const card = document.createElement("div");

        card.className = "project-card";

        card.innerHTML = `

            ${project.image ? `
                <img
                    class="project-thumbnail"
                    src="${project.image}"
                    alt="${project.name}">
                ` : ""}

            <div class="project-body">

                <p class="project-type">
                    ${project.type}
                </p>

                <h3 class="project-name">
                    ${project.name}
                </h3>

                <p class="project-desc">
                    ${project.description}
                </p>

                <div class="project-tags">

                    ${(project.tags || []).map(tag => `
                        <span class="stack-tag">${tag}</span>
                    `).join("")}

                </div>

                <div class="project-actions">

                    <button
                        class="edit-btn"
                        data-id="${project.id}">

                        <i class="fa-solid fa-pen"></i>

                    </button>

                    <button
                        class="delete-btn"
                        data-id="${project.id}">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            </div>

        `;

        projectsList.appendChild(card);

    });

    attachEvents();

}

// ======================================
// Add Link
// ======================================

function createLinkRow(label = "", url = "") {

    const row = document.createElement("div");

    row.className = "link-row";

    row.innerHTML = `
        <div class="form-group">

            <label>Link Name</label>

            <input
                type="text"
                class="link-label"
                placeholder="GitHub"
                value="${label}">

        </div>

        <div class="form-group">

            <label>Link URL</label>

            <input
                type="url"
                class="link-url"
                placeholder="https://"
                value="${url}">

        </div>

        <button
            type="button"
            class="remove-link">

            <i class="fa-solid fa-xmark"></i>

        </button>
    `;

    row.querySelector(".remove-link").onclick = () => {

        row.remove();

    };

    linksContainer.appendChild(row);

}

addLinkBtn.addEventListener("click", () => {

    createLinkRow();

});

function getLinks() {

    const links = [];

    document.querySelectorAll(".link-row").forEach(row => {

        const label = row.querySelector(".link-label").value.trim();

        const url = row.querySelector(".link-url").value.trim();

        if (label && url) {

            links.push({

                label,

                url

            });

        }

    });

    return links;

}

function getTags() {

    return tagsInput.value
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag !== "");

}

// Convert / Trim
function getTextareaArray(textarea) {

    return textarea.value
        .split("\n")
        .map(item => item.trim())
        .filter(item => item !== "");

}

// ======================================
// Save Project
// ======================================

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const project = {

        image: imageInput.value.trim(),
        type: typeInput.value.trim(),
        name: nameInput.value.trim(),
        description: descriptionInput.value.trim(),
        tags: getTags(),
        links: getLinks()

    };

    // Optional Fields

    if (durationInput.value.trim()) {
        project.duration = durationInput.value.trim();
    }

    if (statusInput.value.trim()) {
        project.status = statusInput.value.trim();
    }

    const features = getTextareaArray(featuresInput);

    if (features.length) {
        project.features = features;
    }

    const gallery = getTextareaArray(galleryInput);

    if (gallery.length) {
        project.gallery = gallery;
    }

    try {

        if (editingId) {

            await updateDoc(
                doc(db, "projects", editingId),
                project
            );

            showToast("Project updated successfully.");

        }

        else {

            await addDoc(
                collection(db, "projects"),
                project
            );

            showToast("Project added successfully.");

        }

        resetForm();

        // await means Wait until projects are fully loaded
        await loadProjects();

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

        // Directly find project inside project[] upon clicking Edit
        // No Firestore read
        button.onclick = () => {

            const project = projects.find(
                p => p.id === button.dataset.id
            );

            if (!project) return;

            resetForm();

            editingId = project.id;

            imageInput.value = project.image || "";

            typeInput.value = project.type || "";

            nameInput.value = project.name || "";

            descriptionInput.value = project.description || "";

            tagsInput.value = (project.tags || []).join(", ");
            
            durationInput.value = project.duration || "";

            statusInput.value = project.status || "";

            featuresInput.value = (project.features || []).join("\n");

            galleryInput.value = (project.gallery || []).join("\n");

            renderLinks(project.links || []);

            window.scrollTo({
                top: 0,
                behavior: "smooth"

            });

        };

    });

    document.querySelectorAll(".delete-btn").forEach(button => {

        button.onclick = async () => {

            if (!confirm("Delete this project?")) return;

            await deleteDoc(

                doc(db, "projects", button.dataset.id)

            );

            showToast("Project deleted.");

            await loadProjects();

        };

    });

}


// ======================================
// Render Links
// ======================================

function renderLinks(links) {

    linksContainer.innerHTML = "";

    if (links.length === 0) {

        addLinkBtn.click();

        return;

    }

    links.forEach(link => {

        createLinkRow(
            link.label,
            link.url
        );
    });
}


// ======================================
// Reset Form
// ======================================

function resetForm() {

    editingId = null;

    form.reset();

    durationInput.value = "";

    statusInput.value = "";

    featuresInput.value = "";

    galleryInput.value = "";

    linksContainer.innerHTML = "";

    // Call the helper directly
    createLinkRow();

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


// ======================================
// Initial Form
// ======================================

createLinkRow();