import { initializeApp } from "firebase/app";
import {getFirestore } from 'firebase/firestore'
import {getAuth} from 'firebase/auth'
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "chat-app-2fbd0.firebaseapp.com",
  projectId: "chat-app-2fbd0",
  storageBucket: "chat-app-2fbd0.appspot.com",
  messagingSenderId: "957522664025",
  appId: "1:957522664025:web:78d9b72be5d329b29cef48",
  measurementId: "G-XLW83PBQYR"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app)
