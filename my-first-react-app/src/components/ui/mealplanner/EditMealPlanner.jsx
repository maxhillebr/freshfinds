import "/src/css/newform.css";
import "/src/css/main.css";

import React, { useState, useRef, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { useParams } from "react-router-dom";

import { db, storage } from "/src/components/auth/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
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

export default function EditMealPlanner() {
  // unique id
  const newId = generateUUID();

  // db, copy to clipboard path
  const mealPlanPath = "mealplan";

  // load user info
  const { user, username } = useFirebaseAuth();
  const { listId } = useParams(); // Extract the document ID from the URL

  const navigate = useNavigate();

  // state
  const [title, setTitle] = useState("");
  const [servings, setServings] = useState(1); // Default to 1 serving

  // navigation
  const [rows, setRows] = useState([]);
  const [instructions, setInstructions] = useState([]);

  const [instructionInput, setInstructionInput] = useState("");
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("");
  const [tag, setTag] = useState("");

  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null); // State for storing image URL
  const fileInputRef = useRef(null);
  const [imageId, setImageId] = useState("");
  const [fileName, setFileName] = useState("");

  const fetchRecipeData = async () => {
    try {
      const docRef = doc(db, "users", username, recipeListPath, listId);
      console.log("Document Reference:", docRef);

      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && data.products) {
          setRows(data.products);
          setTitle(data.title || "");
          setInstructions(data.instructions);
          setImageUrl(data.imageUrl);
          setImageId(data.imageId);
          setServings(data.servings);
          setInstructions(data.instructions);
          setTag(data.tag);
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

  const handleUploadImage = async (imageId) => {
    if (!image) {
      console.log("No image or new image selected.");
      return imageUrl; // Return null if no image is selected
    } else {
      try {
        const storageRef = ref(
          storage,
          `users/${username}/images/${recipeListPath}/${imageId}`
        );

        // Delete the old image if it exists
        try {
          await deleteObject(storageRef);
          console.log("Old image deleted successfully");
        } catch (deleteError) {
          console.error("Error deleting old image:", deleteError);
        }

        // Upload the new image if a new image is selected
        if (image) {
          await uploadBytes(storageRef, image);
          const url = await getDownloadURL(storageRef);
          console.log("Image URL:", url);
          setImageUrl(url);
          return url;
        } else {
          // If no new image is selected, return the existing imageUrl
          return imageUrl;
        }
      } catch (error) {
        console.error("Error uploading image: ", error);
        setImageUrl(null);
        return null;
      }
    }
  };

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

  const updateNewRecipe = async (title, rows, instructions, tag, servings) => {
    if (title === "" || rows.length === 0 || instructions.length === 0) {
      alert(
        "Title, Products, or Instructions are missing. Check your list again!"
      );
      return;
    }

    try {
      if (!user || !username) {
        console.error(
          "User is not authenticated or display name is undefined."
        );
        return;
      }

      const colRef = doc(db, "users", username, recipeListPath, listId);

      const updatedImageUrl = await handleUploadImage(imageId);

      const updateData = {
        title: title,
        products: rows,
        instructions: instructions,
        imageUrl: updatedImageUrl,
        imageId: imageId,
        tag: tag,
        servings: servings,
      };

      await setDoc(colRef, updateData);
      console.log("Document updated: ", listId);
      alert("Recipe updated");
      navigate(`/users/${username}/${recipeListPath}/${listId}`);
    } catch (error) {
      console.error("Error updating document: ", error);
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
        <div className="title-image">
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
            Update Image
          </Button>
          <div>{fileName}</div>
        </div>
        <div className="submit-event-btn">
          <Button
            id="submit-list"
            variant="contained"
            onClick={() =>
              updateNewRecipe(title, rows, instructions, tag, servings)
            }
          >
            Update Recipe
          </Button>
        </div>
      </div>

      <NavBottom />
    </>
  );
}
