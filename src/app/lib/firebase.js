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
  apiKey: "AIzaSyBOXBoXapIbxAstcNavve3xgDa5iajoWIg",
  authDomain: "bionicsusedparts.firebaseapp.com",
  projectId: "bionicsusedparts",
  storageBucket: "bionicsusedparts.appspot.com",
  messagingSenderId: "20512526525",
  appId: "1:20512526525:web:6f30d92e483ea1570f27d4",
  measurementId: "G-SC89HBDB7N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };


// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBOXBoXapIbxAstcNavve3xgDa5iajoWIg",
//   authDomain: "bionicsusedparts.firebaseapp.com",
//   projectId: "bionicsusedparts",
//   storageBucket: "bionicsusedparts.appspot.com",
//   messagingSenderId: "20512526525",
//   appId: "1:20512526525:web:6f30d92e483ea1570f27d4",
//   measurementId: "G-SC89HBDB7N"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);