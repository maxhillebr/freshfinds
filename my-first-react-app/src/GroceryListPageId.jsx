// grocery list rending for user specific data

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import Button from "@mui/material/Button";

import { useNavigate } from "react-router-dom";

const GroceryListPageId = () => {
  const { username, listId } = useParams(); // Extract the document ID from the URL
  const [groceryList, setGroceryList] = useState(null);

  const navigate = useNavigate();

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

  return (
    <div>
      {/* Render grocery list data */}
      {groceryList && (
        <>
          <h2>{groceryList.title}</h2>
          <p>{groceryList.description}</p>

          {groceryList.products.map((product) => (
            <div className="main-list" key={product.id}>
              {product.name}
              {product.amount}
            </div>
          ))}

          <Button
            id="edit"
            variant="contained"
            onClick={() =>
              navigate(`/users/${username}/grocerylists/${listId}/edit`)
            }
          >
            Edit
          </Button>
        </>
      )}
    </div>
  );
};

export default GroceryListPageId;
