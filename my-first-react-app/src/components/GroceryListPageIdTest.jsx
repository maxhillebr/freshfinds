// grocery list rending for user specific data

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "/src/firebase";
import { doc, getDoc } from "firebase/firestore";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import HeadArrowBack from "./HeadArrowBack";
import NavBottom from "./NavBottom";
import "/src/css/main.css";
import "/src/css/grocerylistpageidtest.css";

const GroceryListPageIdTest = () => {
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

  const backgroundColor = () => {
    return;
  };

  return (
    <>
      <div className="content">
        <HeadArrowBack />
        {/* Render grocery list data */}
        {groceryList && (
          <>
            <h2>{groceryList.title}</h2>
            <p>{groceryList.description}</p>
            <div className="display-list-container">
              {groceryList.products.map((product) => (
                <div className="display-list-container__box">
                  <div className="display-list-container__checkbox">
                    <Checkbox
                      aria-label={product.id}
                      onChange={() => backgroundColor()}
                    />
                  </div>
                  <div className="display-list-container__product">
                    {product.name}
                  </div>
                  <div className="display-list-container__amount">
                    {product.amount}
                  </div>
                </div>
              ))}
            </div>
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

      <NavBottom />
    </>
  );
};

export default GroceryListPageIdTest;
