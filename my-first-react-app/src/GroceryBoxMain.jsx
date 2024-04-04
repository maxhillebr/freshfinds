import { useState, useEffect, useId } from "react";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { db } from "./firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function GroceryBoxMain() {
  const generateUUID = () => {
    let uuid = "";
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";

    for (let i = 0; i < 25; i++) {
      const randomNumber = Math.floor(Math.random() * chars.length);
      if (i === 8 || i === 13 || i === 18 || i === 23) {
        uuid += "-";
      }
      uuid += chars[randomNumber];
    }
    return uuid;
  };

  // unique id
  const newId = generateUUID();

  const auth = getAuth();
  const user = auth.currentUser;
  const username = user.displayName;

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
        if (!user || !username) {
          console.error(
            "User is not authenticated or display name is undefined."
          );
          return; // Exit the function early
        }

        fetchColGetDoc();
      } catch (error) {
        console.error("Error fetching grocery lists:", error);
      }
    };

    fetchGroceryLists();
  }, []); // Empty dependency array to fetch data only once on component mount

  const fetchColGetDoc = async () => {
    const colRef = collection(db, "users", username, "grocerylists");
    const querySnapshot = await getDocs(colRef);
    const lists = [];

    querySnapshot.forEach((doc) => {
      lists.push({ ...doc.data(), id: doc.id });
    });

    setGroceryLists(lists);
    console.log(lists);
  };

  const handleDeleteDoc = async (id) => {
    const colRef = doc(db, "users", username, "grocerylists", id);
    await deleteDoc(colRef);

    console.log("Document deleted", id);
    alert("Grocery List deleted");
    fetchColGetDoc();
  };

  return (
    <>
      {groceryLists.map(function (data) {
        return (
          <div key={newId}>
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
              <Link to={`/users/${username}/grocerylists/${data.id}`}>
                <div>
                  <p style={{ fontWeight: 600 }}>{data.title}</p>
                  <p style={{ color: "grey" }}>{data.description}</p>
                </div>
              </Link>
              <div>
                <Button
                  href={`/users/${username}/grocerylists/${data.id}/edit`}
                  variant="contained"
                >
                  Edit
                </Button>
                <Button variant="outlined">Share</Button>
                <Button
                  variant="outlined"
                  onClick={() => handleDeleteDoc(data.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
