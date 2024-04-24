import "/src/css/newform.css";
import "/src/css/main.css";

import React, { useState, useRef, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { useParams } from "react-router-dom";

import { db, storage } from "/src/components/auth/firebase";
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  collection,
  addDoc,
} from "firebase/firestore";
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
import AddMealPlan from "../common/AddMealPlan";

// ------------------

export default function NewMealPlan() {
  // unique id
  const newId = generateUUID();

  // db, copy to clipboard path
  const mealplanListPath = "mealplan";
  const recipeListPath = "recipes";

  // load user info
  const { user, username } = useFirebaseAuth();
  const { listId } = useParams(); // Extract the document ID from the URL

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

  // ------------fetch---------------------------
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const fetchAllRecipeLists = async () => {
    try {
      const colRef = doc(db, "users", username); // Reference to the user document

      // Query the "recipes" collection directly under the user's document
      const recipesQuerySnapshot = await getDocs(collection(colRef, "recipes"));

      const allRecipes = [];
      recipesQuerySnapshot.forEach((doc) => {
        allRecipes.push({ title: doc.title, ...doc.data() });
      });

      // Now you have all recipes for the user in allRecipes
      setRecipes(allRecipes);
      console.log("All Recipes:", allRecipes);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  useEffect(() => {
    fetchAllRecipeLists();
  }, []);
  // -------------------------------------------

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

      const colRef = collection(db, "users", username, mealplanListPath);
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
      navigate(`/users/${username}/${mealplanListPath}/${docRef.id}`);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <>
      <div className="content">
        <HeadArrowBack />
        <div className="title-welcome">
          <h1>Create Meal Plan</h1>
        </div>

        <AddMealPlan
          title={title}
          setTitle={setTitle}
          recipes={recipes}
          setRecipes={setRecipes}
          selectedRecipe={selectedRecipe}
          setSelectedRecipe={setSelectedRecipe}
          servings={servings}
          setServings={setServings}
        />
        <div className="product-list-container">
          <div className="product-list-container__header">
            <div>Product</div>
            <div>Amount</div>
            <div>Delete</div>
          </div>
          {/* <DragDropProductRecipe rows={rows} setRows={setRows} /> */}
        </div>
        {/* Instructions
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
        </div> */}
        <div className="submit-event-btn">
          <Button
            id="submit-list"
            variant="contained"
            // onClick={() =>
            //   addNewRecipe(title, rows, instructions, tag, servings)
            // }
          >
            Create Mealplan
          </Button>
        </div>
      </div>

      <NavBottom />
    </>
  );
}
