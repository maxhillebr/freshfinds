// grocery list rending for user specific data

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db, storage } from "/src/components/auth/firebase";
import { doc, getDoc, collection } from "firebase/firestore";
import Button from "@mui/material/Button";
import ShareIcon from "@mui/icons-material/Share";
import EditNoteIcon from "@mui/icons-material/EditNote";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import HomeIcon from "@mui/icons-material/Home";
import HeadArrowBack from "../nav/HeadArrowBack";
import NavBottom from "../nav/NavBottom";
import "/src/css/main.css";
import "/src/css/displaylists.css";
import { copyToClipboard } from "../common/CopyToClipboard";

const MealPlanDisplayId = () => {
  const { username, listId } = useParams(); // Extract the document ID from the URL

  // db, copy to clipboard path
  const recipeListPath = "recipes";
  const mealplanListPath = "mealplan";

  const [mealplan, setMealplan] = useState(null);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchMealplan = async () => {
      try {
        const docRef = doc(db, "users", username, mealplanListPath, listId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setMealplan(data);
          if (data.recipes) {
            fetchRecipes(data.recipes.map((recipe) => recipe.recipeId));
          }
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchRecipes = async (recipeIds) => {
      const recipesData = [];
      const colRef = collection(db, "users", username, recipeListPath);
      for (const id of recipeIds) {
        const recipeDoc = await getDoc(doc(colRef, id));
        if (recipeDoc.exists()) {
          recipesData.push(recipeDoc.data());
        }
      }
      setRecipes(recipesData);
    };

    fetchMealplan();
  }, [username, listId]);

  useEffect(() => {
    console.log("Current Mealplan", mealplan);
    console.log("Current recipes", recipes);
  }, [mealplan, recipes]);

  // const handleItemClick = (itemId) => {
  //   // Toggle color for the clicked item
  //   setItemColors((prevColors) => ({
  //     ...prevColors,
  //     [itemId]: prevColors[itemId] === "#fff6e3" ? "#74e3915e" : "#fff6e3",
  //   }));
  // };

  // const handleServingsChange = (event) => {
  //   setSelectedServings(event.target.value);
  // };

  const normalizeAmount = (amount) => {
    // Replace commas with periods for consistent input handling
    return amount.replace(",", ".");
  };

  return (
    <>
      <div className="content">
        <HeadArrowBack />
        {/* Render grocery list data */}
      </div>
      <div className="content">
        <h2>{mealplan?.title || "Loading Meal Plan..."}</h2>
        <p style={{ fontWeight: "bold" }}>Meals</p>
        {recipes.map((recipe, index) => (
          <p key={index + "a"}>{recipe.title}</p>
        ))}
        <div className="recipes-container">
          {recipes.map((recipe, index) => (
            <div key={index}>
              {recipe.products.map((product) => (
                <p key={product.id}>
                  {product.name}: {product.amount}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
      <NavBottom />
    </>
  );
};

export default MealPlanDisplayId;
