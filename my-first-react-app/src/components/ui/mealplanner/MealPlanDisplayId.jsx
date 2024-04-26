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
  const [itemColors, setItemColors] = useState({});
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
            fetchRecipes(data.recipes);
          }
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchRecipes = async (recipes) => {
      const recipesData = [];
      const colRef = collection(db, "users", username, recipeListPath);
      for (const recipe of recipes) {
        const recipeDoc = await getDoc(doc(colRef, recipe.recipeId));
        if (recipeDoc.exists()) {
          const recipeData = recipeDoc.data();
          recipeData.servings = recipe.servings; // Ensure servings are attached to recipe data
          recipesData.push(recipeData);
        }
      }
      setRecipes(recipesData);

      // Initialize item colors after setting recipes
      const initialColors = {};
      mealplan.products.forEach((product) => {
        initialColors[product.id] = "#fff6e3";
      });
      setItemColors(initialColors);
    };

    fetchMealplan();
  }, [username, listId]);

  useEffect(() => {
    console.log("Current Mealplan", mealplan);
    console.log("Current recipes", recipes);
  }, [mealplan, recipes]);

  const handleItemClick = (itemId) => {
    // Toggle color for the clicked item
    setItemColors((prevColors) => ({
      ...prevColors,
      [itemId]: prevColors[itemId] === "#fff6e3" ? "#74e3915e" : "#fff6e3",
    }));
  };

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
        {mealplan && recipes.length > 0 && (
          <>
            <h2>{mealplan?.title || "Loading Meal Plan..."}</h2>
            <p style={{ fontWeight: "bold" }}>Meals</p>
            {recipes.map((recipe, index) => (
              <p key={index + "a"}>{recipe.title}</p>
            ))}
            <div className="display-list-container">
              {recipes.map((recipe, index) => (
                <div key={index}>
                  {recipe.products.map((product) => (
                    <div
                      key={product.id}
                      className="display-list-container__box"
                      onClick={() => handleItemClick(product.id)}
                      style={{
                        backgroundColor: itemColors[product.id],
                        cursor: "pointer",
                      }}
                    >
                      <div className="display-list-container__product">
                        {product.name}
                      </div>
                      <div className="display-list-container__amount">
                        {parseFloat(product.amount) * recipe.servings}
                        {product.unit}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <NavBottom />
    </>
  );
};

export default MealPlanDisplayId;
