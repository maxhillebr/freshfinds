import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

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
          <>
            <Link key={data.id} to={`/grocerylists/${data.id}`}>
              <div
                className="grocerybox"
                onClick={() => {
                  const newColor = color === "#f1f1f1" ? "green" : "#f1f1f1";
                  changeColor(newColor);
                }}
                style={{
                  backgroundColor: color,
                  padding: "1em",
                  margin: "1em",
                }}
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
          </>
        );
      })}
    </>
  );
}
