import "/src/css/newform.css";
import "/src/css/main.css";

import React, { useState, useRef } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

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
import DragDropProductInstructions from "../common/DragDropProductInstructions";

// ------------------

export default function NewMealPlan() {
  // unique id
  const newId = generateUUID();

  // db, copy to clipboard path
  const recipeListPath = "recipes";

  // load user info
  const { user, username } = useFirebaseAuth();

  // navigation
  const navigate = useNavigate();

  // state
  const [title, setTitle] = useState("");
  const [servings, setServings] = useState(1); // Default to 1 serving

  const [rows, setRows] = useState([]);
  const [instructions, setInstructions] = useState([]);

  const [instructionInput, setInstructionInput] = useState("");
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("");
  const [tag, setTag] = useState("");

  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");

  const placeholderImageUrl = "/illustrations/undraw_imagination_re_i0xi.svg";

  // image change and upload
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    console.log("Selected file:", file); // Check if the file object is retrieved
    setImage(file);
    setFileName(file.name); // Set the file name when a file is selected
  };

  const handleUploadImage = async () => {
    try {
      // Check if an image is selected
      if (!image) {
        console.log("No image selected. Placeholder selected.");
        setImageUrl(placeholderImageUrl);
        return; // Return null if no image is selected
      } else {
        const username = user.displayName;
        const storageRef = ref(
          storage,
          `users/${username}/images/${recipeListPath}/${newId}`
        );
        await uploadBytes(storageRef, image);
        const url = await getDownloadURL(storageRef);
        console.log("Image URL:", url);
        setImageUrl(url);
        return url;
      }
    } catch (error) {
      console.error("Error uploading image: ", error);
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

  const addNewRecipe = async (title, rows, instructions, tag, servings) => {
    if (title === "" || rows.length === 0 || instructions.length === 0) {
      alert(
        "Title, Products, or Instructions are missing. Check your list again!"
      );
      return;
    }

    // Check if imageUrl is truthy (meaning an image was uploaded)
    const imageUrl = await handleUploadImage();
    if (imageUrl === null) {
      // No image was uploaded, handle accordingly (optional)
      console.log("No image uploaded.");
    }

    try {
      if (!user || !username) {
        console.error(
          "User is not authenticated or display name is undefined."
        );
        return; // Exit the function early
      }

      const colRef = collection(db, "users", username, recipeListPath);
      const docRef = await addDoc(colRef, {
        title: title,
        products: rows,
        instructions: instructions,
        imageUrl: imageUrl || placeholderImageUrl, // Add imageUrl to the document
        imageId: newId,
        servings: servings,
        tag: tag,
      });

      console.log("Document written with ID: ", docRef.id);
      alert("Recipe sent to Database");
      navigate(`/users/${username}/${recipeListPath}/${docRef.id}`);
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
          servings={servings}
          setServings={setServings}
          tag={tag}
          setTag={setTag}
        />
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
        <div className="instruction-container-recipe">
          <div className="instruction-container-recipe__header">
            <div>Instruction</div>
            <div>Delete</div>
          </div>
          <DragDropProductInstructions
            instructions={instructions}
            setInstructions={setInstructions}
          />
        </div>
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
            onClick={() =>
              addNewRecipe(title, rows, instructions, tag, servings)
            }
          >
            Create Recipe
          </Button>
        </div>
      </div>

      <NavBottom />
    </>
  );
}
