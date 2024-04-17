import "/src/css/newform.css";
import "/src/css/main.css";

import React, { useState, useId, useRef } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { db, storage } from "/src/firebase";

import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// ------------------
import { useNavigate } from "react-router-dom";
import { generateUUID } from "./UUIDGenerator";

import AddProduct from "./AddProduct";
import ProductListDnd from "./ProductListDnd";
import HeadArrowBack from "./HeadArrowBack";
import NavBottom from "./NavBottom";
import useStateHook from "./StateHook";
import useFirebaseAuth from "./AuthFirebase";
// ------------------

export default function NewRecipe() {
  // unique id
  const newId = generateUUID();

  // load user info
  const { user, username } = useFirebaseAuth();

  // navigation
  const navigate = useNavigate();

  // state hook
  const [title, setTitle] = useState("");

  const [rows, setRows] = useState([]);
  const [instructions, setInstructions] = useState([]);

  const [instructionInput, setInstructionInput] = useState("");
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");

  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null); // State for storing image URL
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    console.log("Selected file:", file); // Check if the file object is retrieved
    setImage(file);
    setFileName(file.name); // Set the file name when a file is selected
  };

  const handleUploadImage = async () => {
    try {
      const username = user.displayName;
      const storageRef = ref(
        storage,
        `users/${username}/images/recipes/${newId}`
      );
      await uploadBytes(storageRef, image);
      const url = await getDownloadURL(storageRef);
      console.log("Image URL:", url);
      setImageUrl(url);
      return url;
    } catch (error) {
      console.error("Error uploading image: ", error);
      setImageUrl(null);
      return null;
    }
  };

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

    const imageUrl = await handleUploadImage();
    if (!imageUrl) {
      alert("Error uploading image. Recipe not created.");
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
        instructions: instructions,
        imageUrl: imageUrl, // Add imageUrl to the document
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
        <div className="title-welcome">
          <h1>Create New Recipe</h1>
        </div>

        <div className="title-desc-container">
          <TextField
            required
            id="recipe-list-title"
            className="title-desc-container__title"
            label="Title"
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <div className="add-image-container-recipe">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
          <Button
            variant="contained"
            onClick={() => fileInputRef.current.click()}
          >
            Upload Image
          </Button>
          {/* Show the file name below the button */}
          <div>{fileName}</div>
        </div>
        <div className="title-add">
          <h2>Add Products</h2>
        </div>

        <div className="add-product-container">
          <TextField
            required
            id="grocery-list-amount-recipe"
            className="add-product-container__amount"
            label="Amount"
            value={amount}
            onChange={handleAmountChange}
          />
          <TextField
            required
            id="grocery-list-product-recipe"
            className="add-product-container__title"
            label="Product"
            value={product}
            onChange={handleProductChange}
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
            <div>Product</div>
            <div>Amount</div>
            <div>Delete</div>
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
                            <div>{row.amount}</div>
                            <div>{row.name}</div>
                            <div>
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
        <div className="title-instruction">
          <h2>Add Instruction</h2>
        </div>
        <div className="add-instruction-container">
          <TextField
            required
            id="recipe-instruction"
            className="add-instruction-container__title"
            label="Instruction"
            value={instructionInput}
            onChange={handleInstructionChange}
          />
        </div>
        <div className="add-instruction-btn">
          <Button
            id="add-button"
            variant="contained"
            onClick={handleAddInstruction}
          >
            Add
          </Button>
        </div>
        <div className="title-instruction">
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
                            <div>{instruction.instruction}</div>
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
          <div className="submit-event-btn">
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
