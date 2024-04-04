// grocery list rending for user specific data

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";

const GroceryListPageId = () => {
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

  const { username, listId } = useParams(); // Extract the document ID from the URL
  const [groceryList, setGroceryList] = useState(null);

  useEffect(() => {
    const fetchGroceryList = async () => {
      try {
        const docRef = doc(db, "users", username, "grocerylists", listId);
        console.log("Document Reference:", docRef);

        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setGroceryList(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching grocery list:", error);
      }
    };

    fetchGroceryList();
  }, [listId, username]);

  // // checkbox
  // const [checkBox, setCheckBox] = useState("unchecked");

  // const handleCheckboxChange = (event) => {
  //   const parentDiv = event.target.parentElement.parentElement;

  //   // Toggle checkbox state
  //   const newCheckBoxState = checkBox === "checked" ? "unchecked" : "checked";
  //   setCheckBox(newCheckBoxState);

  //   // Update background color based on checkbox state
  //   parentDiv.style.backgroundColor =
  //     newCheckBoxState === "checked" ? "lightblue" : "";
  // };

  return (
    <div>
      {/* Render grocery list data */}
      {groceryList && (
        <>
          <h2>{groceryList.title}</h2>
          <p>{groceryList.description}</p>

          {groceryList.products.map((product) => (
            <div
              className="main-list"
              style={{ backgroundColor: "" }}
              key={product.id}
            >
              <Checkbox
                aria-label={product.id}
                // checked={!!checkedItems[product.id]} // Convert to boolean
                // onChange={() => handleCheckboxChange(product.id)}
              />
              {product.name}
              {product.amount}
            </div>
          ))}

          <Button
            href={`/users/${username}/grocerylists/${listId}/edit`}
            id="edit"
            variant="contained"
          >
            Edit
          </Button>
          <Button
            onClick={() => copyToClipboard(username, listId)}
            variant="outlined"
          >
            Share
          </Button>
          <Button href="/home" id="home-button" variant="outlined">
            Home
          </Button>
        </>
      )}
    </div>
  );
};

export default GroceryListPageId;
