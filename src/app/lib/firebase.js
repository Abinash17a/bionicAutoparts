// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDe3v5BNvUocWFNw07wzmTAmYCDAlqbDnI",
  authDomain: "bionicautoparts-e8d51.firebaseapp.com",
  projectId: "bionicautoparts-e8d51",
  storageBucket: "bionicautoparts-e8d51.appspot.com",
  messagingSenderId: "518007757980",
  appId: "1:518007757980:web:1915962aae3052c8e92159",
  measurementId: "G-JJB0YB8KCG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };