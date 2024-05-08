import "/src/css/newform.css";
import "/src/css/main.css";
import Button from "@mui/material/Button";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { db } from "/src/components/auth/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import useFirebaseAuth from "../../auth/AuthFirebase";

import HeadArrowBack from "../nav/HeadArrowBack";
import NavBottom from "../nav/NavBottom";
import DragDropProductList from "../common/DragDropProductList";
import AddProductMealplan from "../common/AddProductMealplan";

export default function EditList() {
  // load user info
  const { user, username } = useFirebaseAuth();

  // db, copy to clipboard path
  const groceryListPath = "grocerylists";

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [rows, setRows] = useState([]);
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");

  const [selectedMealplan, setSelectedMealplan] = useState(null);

  const { listId } = useParams(); // Extract the document ID from the URL

  const fetchGroceryList = async () => {
    try {
      const docRef = doc(db, "users", username, groceryListPath, listId);
      console.log("Document Reference:", docRef);

      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && data.products) {
          setRows(data.products);
          setTitle(data.title || "");
          setSelectedMealplan(data.mealplan);
          console.log(rows);
          console.log(selectedMealplan);
        } else {
          console.log("No products found in the document data.");
        }
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching grocery list:", error);
    }
  };

  useEffect(() => {
    fetchGroceryList();
  }, []);

  const updateNewGroceryList = async (title, rows) => {
    if (title === "" || rows.length === 0) {
      alert("Kein Titel oder Produkt. Ergänze diese Angaben!");
      return;
    }

    try {
      if (!user || !username) {
        console.error(
          "User is not authenticated or display name is undefined."
        );
        return; // Exit the function early
      }

      const colRef = doc(db, "users", username, groceryListPath, listId);
      const docRef = await setDoc(colRef, {
        title: title,
        products: rows,
        mealplan: selectedMealplan,
      });

      console.log("Document updated: ", listId);
      alert("Einkaufsliste geupdated");
      navigate(`/users/${username}/${groceryListPath}/${listId}`);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <>
      <div className="content">
        <HeadArrowBack />
        <div className="title-welcome">
          <h1>Neue Einkaufsliste</h1>
        </div>
        <AddProductMealplan
          selectedMealplan={selectedMealplan}
          setSelectedMealplan={setSelectedMealplan}
          title={title}
          setTitle={setTitle}
          product={product}
          setProduct={setProduct}
          amount={amount}
          setAmount={setAmount}
          rows={rows}
          setRows={setRows}
        />

        <div className="title-product-list">
          <h2>Liste</h2>
        </div>
        <div className="product-list-container">
          <div className="product-list-container__header">
            <div>Produkt</div>
            <div>Menge</div>
            <div>Löschen</div>
          </div>
          <DragDropProductList rows={rows} setRows={setRows} />
        </div>

        <div className="submit-event-btn">
          <Button
            id="submit-list"
            variant="contained"
            onClick={() => updateNewGroceryList(title, rows)}
          >
            Update
          </Button>
        </div>
      </div>
      <NavBottom />
    </>
  );
}
