import React from "react";
import ReactDOM from "react-dom/client";
import MenuAppBar from "../src/MenuAppBar.jsx";
import Routing from "../src/Routing.jsx";
import "./index.css";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5NbqVvvMRbelJnyh95k13NzCazeUUQ6g",
  authDomain: "freshfinds-3456a.firebaseapp.com",
  projectId: "freshfinds-3456a",
  storageBucket: "freshfinds-3456a.appspot.com",
  messagingSenderId: "1016837431826",
  appId: "1:1016837431826:web:3d73c232b3e47885e5eecb",
};

// init firebase
const app = initializeApp(firebaseConfig);

// init services
const db = getFirestore();

// collection ref
const colRef = collection(db, "groceryLists");

// get collection data
getDocs(colRef)
  .then((snapshot) => {
    console.log(snapshot.docs);

    let groceryLists = [];
    snapshot.docs.forEach((doc) => {
      groceryLists.push({ ...doc.data(), id: doc.id });
    });
    console.log(groceryLists);
  })
  .catch((err) => {
    console.log(err.message);
  });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MenuAppBar />
    <Routing />
  </React.StrictMode>
);
