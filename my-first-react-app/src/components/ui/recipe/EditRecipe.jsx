import "/src/css/newform.css";
import "/src/css/main.css";

import React, { useState, useId, useRef, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useParams } from "react-router-dom";

import { db, storage } from "/src/components/auth/firebase";

import { collection, addDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import { useNavigate } from "react-router-dom";

import HeadArrowBack from "/src/components/HeadArrowBack";
import NavBottom from "./NavBottom";

export default function EditRecipe() {
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

  // console.log("DB:", db);
  // console.log("Storage:", storage);

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

  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null); // State for storing image URL
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");

  const { username, listId } = useParams(); // Extract the document ID from the URL
  const [recipeData, setRecipeData] = useState(null);

  const fetchRecipeData = async () => {
    try {
      const docRef = doc(db, "users", username, "recipes", listId);
      console.log("Document Reference:", docRef);

      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && data.products) {
          setRows(data.products);
          setTitle(data.title || "");
          setInstructions(data.instructions);
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
    fetchRecipeData();
  }, []); // Run only once after the component mounts

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
        `users/${username}/images/recipes/${listId}`
      );

      // Delete the old image if it exists
      try {
        await deleteObject(storageRef);
        console.log("Old image deleted successfully");
      } catch (deleteError) {
        // If the old image doesn't exist or there's an error deleting it, log the error
        console.error("Error deleting old image:", deleteError);
      }

      // Upload the new image
      await uploadBytes(storageRef, image);

      // Get the download URL of the new image
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

  const updateNewRecipe = async (title, rows, instructions) => {
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

      const colRef = doc(db, "users", username, "recipes", listId);
      const docRef = await setDoc(colRef, {
        title: title,
        products: rows,
        instructions: instructions,
        imageUrl: imageUrl, // Add imageUrl to the document
      });

      console.log("Document updated: ", listId);
      alert("Recipe updated");
      navigate(`/users/${username}/recipes/${listId}`);
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
              onClick={() => updateNewRecipe(title, rows, instructions)}
            >
              Update Recipe
            </Button>
          </div>
        </div>
      </div>

      <NavBottom />
    </>
  );
}
