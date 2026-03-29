// lib/firebase.ts

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCOPrKeCed0bdsAQeQZhoINu5R3d3zIdRY",
  authDomain: "globaltiertesting.firebaseapp.com",
  projectId: "globaltiertesting",
  storageBucket: "globaltiertesting.firebasestorage.app",
  messagingSenderId: "19518013377",
  appId: "1:19518013377:web:8b4983856bf5904a6bf940"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
