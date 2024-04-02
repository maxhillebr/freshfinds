// grocery list rending for user specific data

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

const GroceryListPageTest = () => {
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

  return (
    <div>
      {/* Render grocery list data */}
      {groceryList && (
        <>
          <h2>{groceryList.title}</h2>
          <p>{groceryList.description}</p>
          <ul>
            {groceryList.products.map((product) => (
              <li key={product.id}>
                {product.name}: {product.amount}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default GroceryListPageTest;
