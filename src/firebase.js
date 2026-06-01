// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCNRahqVrvllCHCYaOhWP9uHQ0ISONQ200",
  authDomain: "chatapp-21067.firebaseapp.com",
  projectId: "chatapp-21067",
  storageBucket: "chatapp-21067.firebasestorage.app",
  messagingSenderId: "496447644895",
  appId: "1:496447644895:web:4d381eeecde42ab663f56a",
  measurementId: "G-R8ZLWQLB3X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);