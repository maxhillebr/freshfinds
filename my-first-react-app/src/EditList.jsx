import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

import { useParams } from "react-router-dom";

import { db } from "./firebase";
import { doc, updateDoc, addDoc, setDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import { useNavigate } from "react-router-dom";

export default function EditList() {
  // check if the user is logged in?
  const auth = getAuth();
  const user = auth.currentUser;

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rows, setRows] = useState([]);
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");

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

  const handleAddProducts = () => {
    const newId = rows.length + "edit";
    const newData = createData(newId, product, amount);
    setRows((prevRows) => [...prevRows, newData]);
    setProduct("");
    setAmount("");
    console.log(rows);
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
          id="submit-update"
          variant="contained"
          onClick={() => updateNewGroceryList(title, description, rows)}
        >
          Update
        </Button>
      </div>
    </div>
  );
}
