import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const db = getFirestore();

const GroceryListPage = () => {
  const { id } = useParams(); // Extract the document ID from the URL
  const [groceryList, setGroceryList] = useState(null);

  useEffect(() => {
    const fetchGroceryList = async () => {
      try {
        const docRef = doc(db, "groceryLists", id);
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
  }, [id]); // Include id in the dependency array to fetch data when it changes

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

export default GroceryListPage;
