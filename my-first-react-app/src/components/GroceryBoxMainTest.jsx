import { useState, useEffect, useId } from "react";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { db } from "/src/firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ShareIcon from "@mui/icons-material/Share";
import DeleteIcon from "@mui/icons-material/Delete";

export default function GroceryBoxMainTest() {
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

  // copy to clipboard for share
  const copyToClipboard = async (username, id) => {
    try {
      const url = `${window.location.host}/users/${username}/grocerylists/${id}`;

      await navigator.clipboard.writeText(url);
      alert("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
      alert("Failed to copy to clipboard");
    }
  };

  return (
    <>
      {groceryLists.map(function (data) {
        return (
          <div className="grocery-list-container__box" key={data.id}>
            <a href={`/users/${username}/grocerylists/${data.id}`}>
              <div className="grocery-list-container__tag-title">
                <p className="grocery-list-container__tag--main">List</p>
                <h3>{data.title}</h3>
                <p>{data.description}</p>
              </div>
            </a>
            <div className="grocery-list-container__action-btn">
              <Link to={`/users/${username}/grocerylists/${data.id}/edit`}>
                <div className="grocer-list-container__action-btn--edit">
                  <EditNoteIcon />
                </div>
              </Link>
              <div
                className="grocer-list-container__action-btn--share"
                onClick={() => copyToClipboard(username, data.id)}
              >
                <ShareIcon />
              </div>
              <div
                className="grocer-list-container__action-btn--del"
                onClick={() => handleDeleteDoc(data.id)}
              >
                <DeleteIcon />
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
