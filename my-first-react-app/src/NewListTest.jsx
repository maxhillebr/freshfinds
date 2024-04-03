import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import { useNavigate } from "react-router-dom";

export default function NewListTest() {
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
    const newId = rows.length;
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
    <div className="main-content">
      <h2>Create New Grocery List</h2>
      <div className="form-box">
        <TextField
          required
          id="grocery-list-title"
          label="Title"
          value={title}
          onChange={handleTitleChange}
        />
        <TextField
          required
          id="grocery-list-description"
          label="Desciption"
          value={description}
          onChange={handleDescriptionChange}
        />
      </div>
      <h2>Add Products</h2>
      <div className="form-box">
        <TextField
          required
          id="grocery-list-product"
          label="Product"
          value={product}
          onChange={handleProductChange}
        />
        <TextField
          required
          id="grocery-list-amount"
          label="Amount"
          value={amount}
          onChange={handleAmountChange}
        />
      </div>
      <Button id="add-button" variant="contained" onClick={handleAddProducts}>
        Add
      </Button>
      <br />
      <br />
      <div>
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
                        <div className="main-list">
                          {row.name}
                          {row.amount}
                          <DragIndicatorIcon />
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleDelete(row.id)}
                          >
                            Delete
                          </Button>
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

        <Button
          id="submit-list"
          variant="contained"
          onClick={() => addNewGroceryList(title, description, rows)}
        >
          Create List
        </Button>
      </div>
    </div>
  );
}
