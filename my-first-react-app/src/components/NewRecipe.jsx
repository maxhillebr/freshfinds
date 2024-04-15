import "/src/css/recipe.css";
import "/src/css/main.css";

import React, { useState, useId } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { db } from "/src/firebase";
import { collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import { useNavigate } from "react-router-dom";

import HeadArrowBack from "/src/components/HeadArrowBack";
import NavBottom from "./NavBottom";

export default function NewRecipe() {
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

  const [rows, setRows] = useState([]);
  const [instructions, setInstructions] = useState([]);

  const [instructionInput, setInstructionInput] = useState("");
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleInstructionChange = (event) => {
    setInstructionInput(event.target.value);
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

  const handleAddInstruction = () => {
    const newData = createInstruction(newId, instructionInput);
    setInstructions((prevInstructions) => [...prevInstructions, newData]);
    setInstructionInput("");
  };

  const createData = (id, name, amount) => {
    return { id, name, amount };
  };

  const createInstruction = (id, instruction) => {
    return { id, instruction };
  };

  const handleDelete = (id) => {
    const updatedRows = rows.filter((product) => product.id !== id);
    setRows(updatedRows);
  };

  const handleDeleteInstruction = (id) => {
    const updatedInstructions = instructions.filter(
      (instruction) => instruction.id !== id
    );
    setInstructions(updatedInstructions);
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

  const onDragEndInstructions = (result) => {
    if (!result.destination) return;

    const items = Array.from(instructions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setInstructions(items);
  };

  // --------------------------------
  // --------------------------------

  const addNewRecipe = async (title, rows, instructions) => {
    if (title === "" || rows.length === 0 || instructions.length === 0) {
      alert(
        "Title, Products, or Instructions are missing. Check your list again!"
      );
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

      const colRef = collection(db, "users", username, "recipes");
      const docRef = await addDoc(colRef, {
        title: title,
        products: rows,
        instructions: instructions, // Include instructions in the document
      });

      console.log("Document written with ID: ", docRef.id);
      alert("Recipe sent to Database");
      navigate(`/users/${username}/recipes/${docRef.id}`);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <>
      <div className="content">
        <HeadArrowBack />
        <div className="title-welcome-recipe-list">
          <h1>Create New Recipe</h1>
        </div>

        <div className="title-desc-container-recipe">
          <TextField
            required
            id="recipe-list-title"
            className="title-desc-container-recipe__title"
            label="Title"
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <div className="title-add-products-recipe">
          <h2>Add Products</h2>
        </div>

        <div className="add-product-container-recipe">
          <TextField
            required
            id="grocery-list-product-recipe"
            className="add-product-container-recipe__title"
            label="Product"
            value={product}
            onChange={handleProductChange}
          />
          <TextField
            required
            id="grocery-list-amount-recipe"
            className="add-product-container-recipe__amount"
            label="Amount"
            value={amount}
            onChange={handleAmountChange}
          />
        </div>
        <div className="add-product-btn-recipe">
          <Button
            id="add-button"
            variant="contained"
            onClick={handleAddProducts}
          >
            Add
          </Button>
        </div>
        <div className="title-product-list-recipe">
          <h2>List</h2>
        </div>
        <div className="product-list-container-recipe">
          <div className="product-list-container-recipe__header">
            <div className="product-list-container-recipe__header-product">
              Product
            </div>
            <div className="product-list-container-recipe__header-amount">
              Amount
            </div>
            <div className="product-list-container-recipe__header-del">
              Delete
            </div>
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
                          <div className="product-list-container-recipe__box">
                            <div className="product-list-container-recipe__product">
                              {row.name}
                            </div>
                            <div className="product-list-container-recipe__amount">
                              {row.amount}
                            </div>
                            {/* <div className="product-list-container__dnd-icon">
                            <DragIndicatorIcon />
                          </div> */}
                            <div className="product-list-container-recipe__del">
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
        </div>
        {/* Instructions */}
        <div className="title-add-instruction-recipe">
          <h2>Add Instruction</h2>
        </div>
        <div className="add-instruction-container-recipe">
          <TextField
            required
            id="recipe-instructin"
            className="add-instruction-container-recipe__title"
            label="Instruction"
            value={instructionInput}
            onChange={handleInstructionChange}
          />
        </div>
        <div className="add-instruction-btn-recipe">
          <Button
            id="add-button"
            variant="contained"
            onClick={handleAddInstruction}
          >
            Add
          </Button>
        </div>
        <div className="title-add-instruction-recipe">
          <h2>Instructions</h2>
        </div>
        <div className="instruction-container-recipe">
          <DragDropContext onDragEnd={onDragEndInstructions}>
            <Droppable droppableId="instructions">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {instructions.map((instruction, index) => (
                    <Draggable
                      key={instruction.id}
                      draggableId={instruction.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                        >
                          <div className="instruction-container-recipe__box">
                            <div className="instruction-container-recipe__instruction">
                              {instruction.instruction}
                            </div>
                            <div className="instruction-container-recipe__del">
                              <Button
                                size="small"
                                variant="contained"
                                color="error"
                                onClick={() =>
                                  handleDeleteInstruction(instruction.id)
                                }
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
          <div className="submit-list-btn-recipe">
            <Button
              id="submit-list"
              variant="contained"
              onClick={() => addNewRecipe(title, rows, instructions)}
            >
              Create Recipe
            </Button>
          </div>
        </div>
      </div>

      <NavBottom />
    </>
  );
}