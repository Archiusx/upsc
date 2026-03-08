import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 🔥 REPLACE with your Firebase project config
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAkgKko5qRZxU8boI_2O-WPaz7_S-kK7oM",
  authDomain: "loginpage-d13a7.firebaseapp.com",
  databaseURL: "https://loginpage-d13a7-default-rtdb.firebaseio.com",
  projectId: "loginpage-d13a7",
  storageBucket: "loginpage-d13a7.firebasestorage.app",
  messagingSenderId: "865928476680",
  appId: "1:865928476680:web:5acd1373a023b02a03b9bd",
  measurementId: "G-HL03R0R5XY"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Admin emails — full dashboard + admin panel access
export const ADMIN_EMAILS = [
  "admin@upscportal.in",   // ← replace with your admin email(s)
];

// Premium exception emails — hardcoded premium access (no Firestore check needed)
// Add any student email here to give them permanent premium access
export const PREMIUM_EMAILS = [
  // "student@example.com",
];

export default app;
