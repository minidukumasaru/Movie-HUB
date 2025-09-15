
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQddW9hO1Ew6tgxl80FTkQ1ibyp77PFRQ",
  authDomain: "movie-hub-5aa4f.firebaseapp.com",
  projectId: "movie-hub-5aa4f",
  storageBucket: "movie-hub-5aa4f.firebasestorage.app",
  messagingSenderId: "257628004058",
  appId: "1:257628004058:web:6217d05922dcfd43a68fe3",
  measurementId: "G-ZYVVR0Q7GF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);

// Firestore
export const db = getFirestore(app);

// Storage (for book covers if needed)
export const storage = getStorage(app);
