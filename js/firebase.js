import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDNb3_cxbDUD_K-ESn5kzJZ-iuAckowG-4",
  authDomain: "personafolio-5e550.firebaseapp.com",
  projectId: "personafolio-5e550",
  storageBucket: "personafolio-5e550.firebasestorage.app",
  messagingSenderId: "478189572507",
  appId: "1:478189572507:web:af57cecc539f716db4913e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };