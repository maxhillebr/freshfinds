import "/src/css/newlisttest.css";
import "/src/css/main.css";

import React, { useState, useId } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

import { db } from "/src/firebase";
import { collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import { useNavigate } from "react-router-dom";

import HeadArrowBack from "/src/components/HeadArrowBack";
import NavBottom from "./NavBottom";

export default function NewListTest() {
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

  // check if the user is logged in?
  const auth = getAuth();
  const user = auth.currentUser;

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rows, setRows] = useState([]);
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");

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

  const handleAddProducts = () => {
    const newData = createData(newId, product, amount);
    setRows((prevRows) => [...prevRows, newData]);
    setProduct("");
    setAmount("");
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
  // --------------------------------

  const addNewGroceryList = async (title, description, rows) => {
    if (title === "" || description === "" || rows.length === 0) {
      alert("No Title, Description or Product. Check your list again!");
      return;
    }

    try {
      const username = user.displayName;

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
              id="submit-list"
              variant="contained"
              onClick={() => addNewGroceryList(title, description, rows)}
            >
              Create List
            </Button>
          </div>
        </div>
      </div>
      <NavBottom />
    </>
  );
}
