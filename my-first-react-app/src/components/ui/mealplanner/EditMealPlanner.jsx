import "/src/css/newform.css";
import "/src/css/main.css";

import React, { useState, useEffect } from "react";

import Button from "@mui/material/Button";

import { useParams } from "react-router-dom";

import { db } from "/src/components/auth/firebase";
import { doc, getDoc, getDocs, collection, setDoc } from "firebase/firestore";
import useFirebaseAuth from "/src/components/auth/AuthFirebase";

import { useNavigate } from "react-router-dom";
import { generateUUID } from "../../common/UUIDGenerator";

import HeadArrowBack from "../nav/HeadArrowBack";
import NavBottom from "../nav/NavBottom";
import DragDropMealPlan from "../common/DragDropMealPlan";
import AddMealPlan from "../common/AddMealPlan";

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

  // ------------fetch---------------------------
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const fetchAllRecipeLists = async () => {
    try {
      const colRef = doc(db, "users", username); // Reference to the user document

      // Query the "recipes" collection directly under the user's document
      const recipesQuerySnapshot = await getDocs(
        collection(colRef, recipeListPath)
      );

      const allRecipes = [];
      recipesQuerySnapshot.forEach((doc) => {
        const recipeData = doc.data();
        allRecipes.push({ id: doc.id, title: recipeData.title, ...recipeData });
      });

      // Now you have all recipes for the user in allRecipes
      setRecipes(allRecipes);

      console.log("All Recipes:", allRecipes);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const fetchMealplan = async () => {
    try {
      const docRef = doc(db, "users", username, mealplanListPath, listId);
      console.log("Document Reference:", docRef);

      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data) {
          setRows(data.recipes);
          setTitle(data.title || "");
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
    fetchAllRecipeLists();
    fetchMealplan();
  }, []);
  // -------------------------------------------

  const updateMealplan = async (title, rows) => {
    if (title === "" || rows.length === 0) {
      alert("No Title or Mealplan. Check your list again!");
      return;
    }

    try {
      if (!user || !username) {
        console.error("User is not authenticated or displayName is undefined.");
        return;
      }

      const colRef = doc(db, "users", username, mealplanListPath, listId);
      const updateData = {
        title: title,
        recipes: rows,
      };

      await setDoc(colRef, updateData);
      console.log("Document updated: ", listId);
      alert("Mealplan updated.");
      navigate(`/users/${username}/${mealplanListPath}/${listId}`);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <>
      <div className="content">
        <HeadArrowBack />
        <div className="title-welcome">
          <h1>Create Mealplan</h1>
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
          rows={rows}
          setRows={setRows}
        />
        <div className="product-list-container">
          <div className="product-list-container__header">
            <div>Recipe</div>
            <div>Servings</div>
            <div>Delete</div>
          </div>
          <DragDropMealPlan rows={rows} setRows={setRows} />
        </div>

        <div className="submit-event-btn">
          <Button
            id="submit-list"
            variant="contained"
            onClick={() => updateMealplan(title, rows)}
          >
            Update Mealplan
          </Button>
        </div>
      </div>

      <NavBottom />
    </>
  );
}
