import { auth, db } from "../../js/firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc,
    updateDoc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


// ======================================
// Authentication
// ======================================

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "login.html?message=login-required";
        return;

    }

    loadContact();

});


// ======================================
// Elements
// ======================================

const form = document.getElementById("contactForm");

const email = document.getElementById("email");
const phone = document.getElementById("phone");
const linkedin = document.getElementById("linkedin");
const resume = document.getElementById("resume");

const toast = document.getElementById("toast");

const logoutBtn = document.getElementById("logoutBtn");
const logoutModal = document.getElementById("logoutModal");
const cancelLogout = document.getElementById("cancelLogout");
const confirmLogout = document.getElementById("confirmLogout");


// ======================================
// Firestore Reference
// ======================================

const contactRef = doc(db, "contact", "info");


// ======================================
// Load Contact
// ======================================

async function loadContact() {

    try {

        const snapshot = await getDoc(contactRef);

        if (!snapshot.exists()) return;

        const data = snapshot.data();

        email.value = data.email || "";
        phone.value = data.phone || "";
        linkedin.value = data.linkedin || "";
        resume.value = data.resume || "";

    }

    catch (error) {

        console.error(error);

    }

}


// ======================================
// Save Contact
// ======================================

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const emailValue = email.value.trim();
    const phoneValue = phone.value.trim();
    const linkedinValue = linkedin.value.trim();
    const resumeValue = resume.value.trim();

    // Required Fields

    if (!emailValue || !phoneValue) {
        showToast("Email and phone number are required.");
        return;
    }

    try {

        await setDoc(contactRef, {

            email: emailValue,

            phone: phoneValue,

            linkedin: linkedinValue,

            resume: resumeValue,

            updatedAt: serverTimestamp()

        });

        showToast("Contact information updated.");

    }

    catch (error) {

        console.error(error);

        showToast("Unable to save changes.");

    }

});

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
// Logout Modal
// ======================================

logoutBtn.addEventListener("click", () => {

    logoutModal.classList.remove("hidden");

});

cancelLogout.addEventListener("click", () => {

    logoutModal.classList.add("hidden");

});

confirmLogout.addEventListener("click", async () => {

    await signOut(auth);

    window.location.href = "login.html";

});


// Close modal when clicking outside

logoutModal.addEventListener("click", (e) => {

    if (e.target === logoutModal) {

        logoutModal.classList.add("hidden");

    }

});