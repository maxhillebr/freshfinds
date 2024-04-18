import "/src/css/newform.css";
import "/src/css/main.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { useState } from "react";

import { DragDropContext, Droppable } from "react-beautiful-dnd";

import { db } from "/src/firebase";
import { collection, addDoc } from "firebase/firestore";

import { useNavigate } from "react-router-dom";
import { generateUUID } from "./UUIDGenerator";

import AddProduct from "./AddProduct";
import ProductListDnd from "./ProductListDnd";
import HeadArrowBack from "./HeadArrowBack";
import NavBottom from "./NavBottom";
import useFirebaseAuth from "./AuthFirebase";

export default function NewList() {
  // load user info
  const { user, username } = useFirebaseAuth();

  // navigation
  const navigate = useNavigate();

  // state
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rows, setRows] = useState([]);

  // handle change of input and update state
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  // delete object in array rows
  const handleDelete = (id) => {
    const updatedRows = rows.filter((product) => product.id !== id);
    setRows(updatedRows);
  };

  //  reorder rows by drag and drop and update index in rows
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(rows);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setRows(items);
  };

  // create new doc in firebase collection with array of objects in rows
  const addNewGroceryList = async (title, description, rows) => {
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

      const colRef = collection(db, "users", username, "grocerylists");
      const docRef = await addDoc(colRef, {
        title: title,
        description: description,
        products: rows,
      });

      console.log("Document written with ID: ", docRef.id);
      alert("Grocery list sent to Database");
      navigate(`/users/${username}/grocerylists/${docRef.id}`);
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
            label="Description"
            value={description}
            onChange={handleDescriptionChange}
          />
        </div>
        <div className="title-add">
          <h2>Add Products</h2>
        </div>

        <AddProduct
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
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="rows">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {rows.map((row, index) => (
                    <ProductListDnd
                      key={row.id}
                      row={row}
                      index={index}
                      handleDelete={handleDelete}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        <div className="submit-event-btn">
          <Button
            id="submit-list"
            variant="contained"
            onClick={() => addNewGroceryList(title, description, rows)}
          >
            Create List
          </Button>
        </div>
      </div>
      <NavBottom />
    </>
  );
}
