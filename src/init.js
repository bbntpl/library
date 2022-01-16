// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-app.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDZ9y-XCN4Yd2z0f02tIYpzJhhAUEbK0as",
    authDomain: "library2022-b824d.firebaseapp.com",
    databaseURL: "https://library2022-b824d-default-rtdb.firebaseio.com",
    projectId: "library2022-b824d",
    storageBucket: "library2022-b824d.appspot.com",
    messagingSenderId: "132989817292",
    appId: "1:132989817292:web:d4fd651bd64ebc7073cd69",
    measurementId: "G-8KJ1VRWGCC"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export { app }