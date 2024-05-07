// grocery list rending for user specific data

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "/src/components/auth/firebase";
import { doc, getDoc } from "firebase/firestore";
import Button from "@mui/material/Button";
import ShareIcon from "@mui/icons-material/Share";
import EditNoteIcon from "@mui/icons-material/EditNote";
import HomeIcon from "@mui/icons-material/Home";
import HeadArrowBack from "../nav/HeadArrowBack";
import NavBottom from "../nav/NavBottom";
import "/src/css/main.css";
import "/src/css/displaylists.css";
import { copyToClipboard } from "../common/CopyToClipboard";

const GroceryListPageId = () => {
  const { username, listId } = useParams(); // Extract the document ID from the URL

  // db, copy to clipboard path
  const groceryListPath = "grocerylists";
  const mealplanListPath = "mealplan";

  const [groceryList, setGroceryList] = useState(null);
  const [itemColors, setItemColors] = useState({});

  useEffect(() => {
    const fetchGroceryList = async () => {
      try {
        const docRef = doc(db, "users", username, groceryListPath, listId);
        console.log("Document Reference:", docRef);

        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setGroceryList(docSnap.data());
          // Initialize item colors
          const initialColors = {};
          docSnap.data().products.forEach((product) => {
            initialColors[product.id] = "#fff6e3";
          });
          setItemColors(initialColors);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching grocery list:", error);
      }
    };

    fetchGroceryList();
  }, [listId, username]);

  const handleItemClick = (itemId) => {
    // Toggle color for the clicked item
    setItemColors((prevColors) => ({
      ...prevColors,
      [itemId]: prevColors[itemId] === "#fff6e3" ? "#74e3915e" : "#fff6e3",
    }));
  };

  return (
    <>
      <div className="content">
        <HeadArrowBack />
        {/* Render grocery list data */}
        {groceryList && (
          <>
            <h2>{groceryList.title}</h2>
            <div className="display-list-container">
              {groceryList.mealplan &&
                groceryList.mealplan.docId &&
                groceryList.mealplan.title && (
                  <div className="display-list-container__mealplan">
                    <h3>Ausgewählter Essensplan</h3>
                    <a
                      href={`/users/${username}/${mealplanListPath}/${groceryList.mealplan.docId}`}
                    >
                      {groceryList.mealplan.title}
                    </a>
                    <h3>Komplette Einkaufsliste</h3>
                  </div>
                )}

              {groceryList.products.map((product) => (
                <div
                  key={product.id}
                  className="display-list-container__box"
                  onClick={() => handleItemClick(product.id)}
                  style={{
                    backgroundColor: itemColors[product.id],
                    cursor: "pointer",
                  }}
                >
                  <div className="display-list-container__product">
                    {product.name}
                  </div>
                  <div className="display-list-container__amount">
                    {product.amount} {product.unit}
                  </div>
                </div>
              ))}
            </div>
            <div className="display-list-action-btn">
              <Button
                href={`/users/${username}/${groceryListPath}/${listId}/edit`}
                variant="contained"
              >
                <EditNoteIcon />
              </Button>
              <Button
                onClick={() =>
                  copyToClipboard(username, groceryListPath, listId)
                }
                variant="outlined"
              >
                <ShareIcon />
              </Button>
              <Button href="/home" variant="outlined">
                <HomeIcon />
              </Button>
            </div>
          </>
        )}
      </div>

      <NavBottom />
    </>
  );
};

export default GroceryListPageId;
