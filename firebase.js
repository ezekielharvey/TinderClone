// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCgzLqHpwmcZ5-EJygDBB4ZKV8fPYE7ig8",
    authDomain: "tinderclone2-95cde.firebaseapp.com",
    projectId: "tinderclone2-95cde",
    storageBucket: "tinderclone2-95cde.appspot.com",
    messagingSenderId: "1019193433856",
    appId: "1:1019193433856:web:2253e238fea92446c01de5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export { auth, db }