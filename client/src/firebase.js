import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAmVZ42NFk0VX04b-_qeVf2anlH99gOppc",
  authDomain: "roomy-39c7c.firebaseapp.com",
  projectId: "roomy-39c7c",
  storageBucket: "roomy-39c7c.firebasestorage.app",
  messagingSenderId: "1006162710859",
  appId: "1:1006162710859:web:3263ab780fa7da301698ce",
  measurementId: "G-KLEJ2LKHPV"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);