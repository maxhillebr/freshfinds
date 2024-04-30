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
  }, []); // Run only once after the component mounts

  // const handleTitleChange = (event) => {
  //   setTitle(event.target.value);
  // };

  // const handleProductChange = (event) => {
  //   setProduct(event.target.value);
  // };

  // const handleAmountChange = (event) => {
  //   setAmount(event.target.value);
  // };

  // const createData = (id, name, amount) => {
  //   return { id, name, amount };
  // };

  // const handleDelete = (id) => {
  //   const updatedRows = rows.filter((product) => product.id !== id);
  //   setRows(updatedRows);
  // };

  // --------------------------------
  // --------------------------------

  // const onDragEnd = (result) => {
  //   if (!result.destination) return;

  //   const items = Array.from(rows);
  //   const [reorderedItem] = items.splice(result.source.index, 1);
  //   items.splice(result.destination.index, 0, reorderedItem);

  //   setRows(items);
  // };

  // // --------------------------------
  // // add products

  // const handleAddProducts = () => {
  //   const newData = createData(newId, product, amount);
  //   setRows((prevRows) => [...prevRows, newData]);
  //   setProduct("");
  //   setAmount("");
  //   console.log(rows);
  // };

  // --------------------------------

  const updateNewGroceryList = async (title, rows) => {
    if (title === "" || rows.length === 0) {
      alert("No Title or Product. Check your list again!");
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
      alert("Grocery list updated");
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
          <h1>Create New Grocery List</h1>
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
          <h2>List</h2>
        </div>
        <div className="product-list-container">
          <div className="product-list-container__header">
            <div>Amount</div>
            <div>Product</div>
            <div>Delete</div>
          </div>
          <DragDropProductList rows={rows} setRows={setRows} />
        </div>

        <div className="submit-event-btn">
          <Button
            id="submit-list"
            variant="contained"
            onClick={() => updateNewGroceryList(title, rows)}
          >
            Create List
          </Button>
        </div>
      </div>
      <NavBottom />
    </>
  );
}
