import React from "react";
import { Button } from "@mui/material";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
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

export default function DBTest() {
  // Function to add a new entry with a unique ID
  const addNewGroceryList = async (title, description) => {
    try {
      const docRef = await addDoc(colRef, {
        title: title,
        description: description,
        products: products,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  // Example data
  const title = "New Grocery List";
  const description = "Description of the new grocery list";
  const products = [
    { id: 0, name: "apfel", amount: "2" },
    { id: 1, name: "banane", amount: "5" },
  ];

  return (
    <>
      <Button onClick={() => addNewGroceryList(title, description, products)}>
        Test
      </Button>
      <p>Test</p>
    </>
  );
}
