import React from "react";
import ReactDOM from "react-dom/client";
import MenuAppBar from "../src/MenuAppBar.jsx";
import Routing from "../src/Routing.jsx";
import "./index.css";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MenuAppBar />
    <Routing />
  </React.StrictMode>
);
