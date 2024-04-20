import "/src/css/newform.css";
import "/src/css/main.css";

import React, { useState, useId, useRef } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { db, storage } from "/src/components/auth/firebase";

import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import useFirebaseAuth from "/src/components/auth/AuthFirebase";

// ------------------
import { useNavigate } from "react-router-dom";
import { generateUUID } from "../../common/UUIDGenerator";

import AddProductRecipe from "../common/AddProductRecipe";
import HeadArrowBack from "../nav/HeadArrowBack";
import NavBottom from "../nav/NavBottom";
import DragDropProductRecipe from "../common/DragDropProductRecipe";

// ------------------

export default function NewRecipe() {
  // unique id
  const newId = generateUUID();

  // load user info
  const { user, username } = useFirebaseAuth();

  // navigation
  const navigate = useNavigate();

  // state
  const [title, setTitle] = useState("");

  const [rows, setRows] = useState([]);
  const [instructions, setInstructions] = useState([]);

  const [instructionInput, setInstructionInput] = useState("");
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("");

  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(""); // Set to placeholder by default
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");

  // image change and upload
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
      setImageUrl(placeholderImageUrl);
      return null;
    }
  };

  // handle change of input and update state
  const handleInstructionChange = (event) => {
    setInstructionInput(event.target.value);
  };

  const handleAddInstruction = () => {
    const newData = createInstruction(newId, instructionInput);
    setInstructions((prevInstructions) => [...prevInstructions, newData]);
    setInstructionInput("");
  };

  const createInstruction = (id, instruction) => {
    return { id, instruction };
  };

  const handleDeleteInstruction = (id) => {
    const updatedInstructions = instructions.filter(
      (instruction) => instruction.id !== id
    );
    setInstructions(updatedInstructions);
  };

  // --------------------------------
  // --------------------------------

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

        <AddProductRecipe
          title={title}
          setTitle={setTitle}
          product={product}
          setProduct={setProduct}
          amount={amount}
          setAmount={setAmount}
          rows={rows}
          setRows={setRows}
          unit={unit}
          setUnit={setUnit}
        />

        <div className="title-product-list">
          <h2>Item List</h2>
        </div>
        <div className="product-list-container">
          <div className="product-list-container__header">
            <div>Product</div>
            <div>Amount</div>
            <div>Delete</div>
          </div>
          <DragDropProductRecipe rows={rows} setRows={setRows} />
        </div>
        {/* Instructions */}
        <div className="title-instruction">
          <h2>Instructions</h2>
        </div>
        <div className="add-instruction-container">
          <p>Add Instructions</p>
          <TextField
            required
            id="recipe-instruction"
            className="add-instruction-container__title"
            label="Instruction"
            value={instructionInput}
            fullWidth
            onChange={handleInstructionChange}
          />
          <div className="add-instruction-btn">
            <Button
              id="add-button"
              variant="contained"
              onClick={handleAddInstruction}
            >
              Add
            </Button>
          </div>
        </div>

        <div className="title-instruction">
          <h2>List</h2>
        </div>
        <div className="instruction-container-recipe">
          <div className="instruction-container-recipe__header">
            <div>Instruction</div>
            <div>Delete</div>
          </div>
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
                            <div>
                              <IconButton
                                aria-label="delete"
                                onClick={() =>
                                  handleDeleteInstruction(instruction.id)
                                }
                              >
                                <DeleteIcon />
                              </IconButton>
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

          <div className="title-instruction">
            <h2>Add Image</h2>
            <div className="add-product-help-text">
              <p>
                No image? You don't have to upload yet. You can set the image
                later.
              </p>
            </div>
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
            <div>{fileName}</div>
          </div>
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
