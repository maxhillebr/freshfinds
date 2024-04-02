import React from "react";
import { Button } from "@mui/material";
import { db } from "./firebase";
import { collection, getDocs, addDoc, setDoc, doc } from "firebase/firestore";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
// collection ref
const colRef = collection(db, "groceryLists");

// get collection data
getDocs(colRef)
  .then((snapshot) => {
    // console.log(snapshot.docs);

    let groceryLists = [];
    snapshot.docs.forEach((doc) => {
      groceryLists.push({ ...doc.data(), id: doc.id });
    });
    // console.log(groceryLists);
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

  // ------------------------------------
  // ------------------------------------
  // user specific adding of data!

  const auth = getAuth();

  const username = auth.currentUser.displayName;
  console.log("current user: " + username);

  // Function to create new document
  // Add a new document in collection "cities"

  const addNewGroceryListUser = async (title, description, products) => {
    const colRefUser = collection(db, "users", username, "grocerylists");

    try {
      const docRef = await addDoc(colRefUser, {
        title: title,
        description: description,
        products: products,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  // ------------------------------------

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
      <Button
        onClick={() => addNewGroceryListUser(title, description, products)}
      >
        Test
      </Button>

      <p>Test</p>
    </>
  );
}
// +++++++++++++++++++++++++++++++++++++++++++++++
