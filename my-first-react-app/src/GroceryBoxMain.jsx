import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

// ++++++++++++++++++++++++++++++++
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
// ++++++++++++++++++++++++++++++++

export default function GroceryBoxMain() {
  const [color, setColor] = useState("#f1f1f1");

  const changeColor = (color) => {
    setColor(color);
  };

  // Define groceryLists state to store fetched data
  const [groceryLists, setGroceryLists] = useState([]);

  // Fetch data from Firestore inside useEffect
  useEffect(() => {
    const fetchGroceryLists = async () => {
      try {
        const colRef = collection(db, "groceryLists");
        const querySnapshot = await getDocs(colRef);
        const lists = [];

        querySnapshot.forEach((doc) => {
          lists.push({ ...doc.data(), id: doc.id });
        });

        setGroceryLists(lists);
        console.log(lists);
      } catch (error) {
        console.error("Error fetching grocery lists:", error);
      }
    };

    fetchGroceryLists();
  }, []); // Empty dependency array to fetch data only once on component mount

  return (
    <>
      {groceryLists.map(function (data) {
        return (
          <Link key={data.id} to={`/grocerylists/${data.id}`}>
            <div
              className="grocerybox"
              onClick={() => {
                const newColor = color === "#f1f1f1" ? "green" : "#f1f1f1";
                changeColor(newColor);
              }}
              style={{ backgroundColor: color, padding: "1em", margin: "1em" }}
            >
              <div>
                <p style={{ fontWeight: 600 }}>{data.title}</p>
                <p style={{ color: "grey" }}>{data.description}</p>
              </div>
              <div>
                <Button variant="contained">Edit</Button>
                <Button variant="outlined">Share</Button>
                <Button variant="outlined">Delete</Button>
              </div>
            </div>
          </Link>
        );
      })}
      ;
    </>
  );
}
