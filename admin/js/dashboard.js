import { auth } from "../../js/firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const loadingOverlay = document.getElementById("loadingOverlay");

const logoutBtn = document.getElementById("logoutBtn");

const logoutModal = document.getElementById("logoutModal");

const cancelLogout = document.getElementById("cancelLogout");

const confirmLogout = document.getElementById("confirmLogout");


// ==============================
// Authentication Guard
// ==============================

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "login.html?message=login-required";

        return;

    }

    loadingOverlay.style.display = "none";

});


// ==============================
// Logout Modal
// ==============================

logoutBtn.addEventListener("click", () => {

    logoutModal.classList.remove("hidden");

});

cancelLogout.addEventListener("click", () => {

    logoutModal.classList.add("hidden");

});


// Close modal when clicking outside

logoutModal.addEventListener("click", (e) => {

    if (e.target === logoutModal) {

        logoutModal.classList.add("hidden");

    }

});


// ==============================
// Logout
// ==============================

confirmLogout.addEventListener("click", async () => {

    try {

        await signOut(auth);

        window.location.href = "login.html";

    }

    catch (error) {

        alert(error.message);

    }

});