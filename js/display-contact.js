import { db } from "./firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


// ======================================
// Elements
// ======================================

const email = document.getElementById("email");
const phone = document.getElementById("phone");

const linkedin = document.getElementById("linkedin");
const linkedinItem = document.getElementById("linkedinItem");

const resume = document.getElementById("resume");
const resumeItem = document.getElementById("resumeItem");


// ======================================
// Firestore
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

        // Email

        email.textContent = data.email;
        email.href = `mailto:${data.email}`;

        // Phone

        phone.textContent = data.phone;

        // LinkedIn

        if (data.linkedin) {

            linkedin.textContent = data.linkedin
                .replace("https://", "")
                .replace("http://", "");

            linkedin.href = data.linkedin;

        }

        else {

            linkedinItem.style.display = "none";

        }

        // Resume

        if (data.resume) {

            resume.href = data.resume;

        }

        else {

            resumeItem.style.display = "none";

        }

    }

    catch (error) {

        console.error("Unable to load contact.", error);

    }

}

loadContact();