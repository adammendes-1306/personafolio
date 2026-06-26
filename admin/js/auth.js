import { auth } from "../../js/firebase.js";

import {
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


// ======================================
// Elements
// ======================================

const loginForm = document.getElementById("loginForm");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const loginBtn = document.getElementById("loginBtn");

const btnText = loginBtn.querySelector(".btn-text");
const btnLoader = loginBtn.querySelector(".btn-loader");

const loginError = document.getElementById("loginError");

const togglePassword = document.getElementById("togglePassword");
const toggleIcon = togglePassword.querySelector("i");

// ======================================
// Login
// ======================================

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    loginError.textContent = "";

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {

        loginError.textContent = "Please fill in all fields.";

        return;

    }

    setLoading(true);

    try {

        await signInWithEmailAndPassword(auth, email, password);

        window.location.href = "index.html";

    }

    catch (error) {

        loginError.textContent = getErrorMessage(error.code);

    }

    finally {

        setLoading(false);

    }

});

// ======================================
// Show Login Required Message
// ======================================

const params = new URLSearchParams(window.location.search);

if (params.get("message") === "login-required") {

    loginError.textContent = "Please sign in to continue.";

}

// ======================================
// Redirect if Already Logged In
// ======================================

onAuthStateChanged(auth, (user) => {

    if (user) {
        window.location.href = "index.html";
    }

});


// ======================================
// Show / Hide Password
// ======================================

togglePassword.addEventListener("click", () => {

    const isHidden = passwordInput.type === "password";

    passwordInput.type = isHidden ? "text" : "password";

    toggleIcon.classList.toggle("fa-eye");
    toggleIcon.classList.toggle("fa-eye-slash");

});


// ======================================
// Login
// ======================================

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    loginError.textContent = "";

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {

        loginError.textContent = "Please fill in all fields.";

        return;

    }

    setLoading(true);

    try {

        await signInWithEmailAndPassword(auth, email, password);

        window.location.href = "index.html";

    }

    catch (error) {

        loginError.textContent = getErrorMessage(error.code);

    }

    finally {

        setLoading(false);

    }

});


// ======================================
// Loading Button
// ======================================

function setLoading(isLoading) {

    loginBtn.disabled = isLoading;

    if (isLoading) {

        btnText.classList.add("hidden");
        btnLoader.classList.remove("hidden");

    }

    else {

        btnText.classList.remove("hidden");
        btnLoader.classList.add("hidden");

    }

}


// ======================================
// Friendly Firebase Errors
// ======================================

function getErrorMessage(code) {

    switch (code) {

        case "auth/invalid-credential":
            return "Invalid email or password.";

        case "auth/invalid-email":
            return "Please enter a valid email address.";

        case "auth/network-request-failed":
            return "Network error. Please check your connection.";

        case "auth/too-many-requests":
            return "Too many failed attempts. Please try again later.";

        default:
            return "Unable to sign in. Please try again.";

    }

}