import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase configuration for Finance Tracker
const firebaseConfig = {
    apiKey: "AIzaSyAySKh7HUhfEHY6EeUUfqpPuTQ6nMXv-Uc",
    authDomain: "finance-tracker-web-7b008.firebaseapp.com",
    projectId: "finance-tracker-web-7b008",
    storageBucket: "finance-tracker-web-7b008.firebasestorage.app",
    messagingSenderId: "410174953094",
    appId: "1:410174953094:web:eb6ce627b1782c7d762307",
    measurementId: "G-BMLG3EPVL2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
