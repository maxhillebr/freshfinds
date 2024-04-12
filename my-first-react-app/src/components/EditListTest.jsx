import "/src/css/listtest.css";
import "/src/css/main.css";

import React, { useState, useEffect, useId } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

import { useParams } from "react-router-dom";

import { db } from "/src/firebase";
import { doc, updateDoc, addDoc, setDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import { useNavigate } from "react-router-dom";

import HeadArrowBack from "/src/components/HeadArrowBack";
import NavBottom from "./NavBottom";

export default function EditListTest() {
  // check if the user is logged in?
  const auth = getAuth();
  const user = auth.currentUser;

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rows, setRows] = useState([]);
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");

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

  const { username, listId } = useParams(); // Extract the document ID from the URL

  const fetchGroceryList = async () => {
    try {
      const docRef = doc(db, "users", username, "grocerylists", listId);
      console.log("Document Reference:", docRef);

      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && data.products) {
          setRows(data.products);
          setTitle(data.title || "");
          setDescription(data.description || "");
          console.log(rows);
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

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleProductChange = (event) => {
    setProduct(event.target.value);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const createData = (id, name, amount) => {
    return { id, name, amount };
  };

  const handleDelete = (id) => {
    const updatedRows = rows.filter((product) => product.id !== id);
    setRows(updatedRows);
  };

  // --------------------------------
  // --------------------------------

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(rows);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setRows(items);
  };

  // --------------------------------
  // add products

  const handleAddProducts = () => {
    const newData = createData(newId, product, amount);
    setRows((prevRows) => [...prevRows, newData]);
    setProduct("");
    setAmount("");
    console.log(rows);
  };

  // --------------------------------

  const updateNewGroceryList = async (title, description, rows) => {
    if (title === "" || description === "" || rows.length === 0) {
      alert("No Title, Description or Product. Check your list again!");
      return;
    }

    try {
      if (!user || !username) {
        console.error(
          "User is not authenticated or display name is undefined."
        );
        return; // Exit the function early
      }

      const colRef = doc(db, "users", username, "grocerylists", listId);
      const docRef = await setDoc(colRef, {
        title: title,
        description: description,
        products: rows,
      });

      console.log("Document updated: ", listId);
      alert("Grocery list updated");
      navigate(`/users/${username}/grocerylists/${listId}`);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <>
      <div className="content">
        <HeadArrowBack />
        <div className="title-welcome-grocery-list">
          <h1>Create New Grocery List</h1>
        </div>

        <div className="title-desc-container">
          <TextField
            required
            id="grocery-list-title"
            className="title-desc-container__title"
            label="Title"
            value={title}
            onChange={handleTitleChange}
          />
          <TextField
            required
            id="grocery-list-description"
            className="title-desc-container__desc"
            label="Desciption"
            value={description}
            onChange={handleDescriptionChange}
          />
        </div>
        <div className="title-add-products">
          <h2>Add Products</h2>
        </div>

        <div className="add-product-container">
          <TextField
            required
            id="grocery-list-product"
            className="add-product-container__title"
            label="Product"
            value={product}
            onChange={handleProductChange}
          />
          <TextField
            required
            id="grocery-list-amount"
            className="add-product-container__amount"
            label="Amount"
            value={amount}
            onChange={handleAmountChange}
          />
        </div>
        <div className="add-product-btn">
          <Button
            id="add-button"
            variant="contained"
            onClick={handleAddProducts}
          >
            Add
          </Button>
        </div>
        <div className="title-product-list">
          <h2>List</h2>
        </div>
        <div className="product-list-container">
          <div className="product-list-container__header">
            <div className="product-list-container__header-product">
              Product
            </div>
            <div className="product-list-container__header-amount">Amount</div>
            <div className="product-list-container__header-del">Delete</div>
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="rows">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {rows.map((row, index) => (
                    <Draggable
                      key={row.id}
                      draggableId={row.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                        >
                          <div className="product-list-container__box">
                            <div className="product-list-container__product">
                              {row.name}
                            </div>
                            <div className="product-list-container__amount">
                              {row.amount}
                            </div>
                            {/* <div className="product-list-container__dnd-icon">
                            <DragIndicatorIcon />
                          </div> */}
                            <div className="product-list-container__del">
                              <Button
                                size="small"
                                variant="contained"
                                color="error"
                                onClick={() => handleDelete(row.id)}
                              >
                                X
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <div className="submit-list-btn">
            <Button
              id="submit-update"
              variant="contained"
              onClick={() => updateNewGroceryList(title, description, rows)}
            >
              Update
            </Button>
          </div>
        </div>
      </div>
      <NavBottom />
    </>
  );
}
