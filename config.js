// ============================================================
// config.js — UPSC Portal Configuration

export const APP_CONFIG = {
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
  portalLocked: false,           // Now handled by Firebase auth
  redirectAfterLogin: "modules.html",
  homeUrl: "https://upscportal.netlify.app",
  socialLinks: {
    telegram: "https://t.me/upscpreph",
    youtube: "https://youtube.com/@upscportal",
    instagram: "https://instagram.com/upscportal",
  },
  exams: ["UPSC CSE Prelims", "UPSC CSE Mains", "UPSC IFoS", "UPSC CAPF"],
};
