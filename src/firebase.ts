// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBLUz-8ESn1VDGK2bBDenHbvXyk40qwJek",
  authDomain: "nwitter-loaded.firebaseapp.com",
  projectId: "nwitter-loaded",
  storageBucket: "nwitter-loaded.appspot.com",
  messagingSenderId: "926510171714",
  appId: "1:926510171714:web:f4917883561f497d8ccfdb",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
