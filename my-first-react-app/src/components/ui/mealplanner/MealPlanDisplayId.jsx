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
  // const [recipes, setRecipes] = useState([]);
  const [aggregatedProducts, setAggregatedProducts] = useState([]);

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

    const fetchRecipes = async (mealPlanRecipes) => {
      const recipesData = [];
      const productMap = {};
      const colRef = collection(db, "users", username, recipeListPath);
      for (const { recipeId, servings } of mealPlanRecipes) {
        const recipeDoc = await getDoc(doc(colRef, recipeId));
        if (recipeDoc.exists()) {
          const recipeData = recipeDoc.data();
          recipeData.mealPlanServings = servings;
          recipesData.push(recipeData);

          // Calculate and aggregate products
          recipeData.products.forEach((product) => {
            const normalizedAmount = parseFloat(
              product.amount.replace(",", ".")
            );
            const adjustedAmount =
              (normalizedAmount / recipeData.servings) * servings;
            if (productMap[product.name]) {
              productMap[product.name].amount += adjustedAmount;
            } else {
              productMap[product.name] = { ...product, amount: adjustedAmount };
            }
          });
        }
      }
      // Convert map to array for rendering
      const aggregatedProductsArray = Object.values(productMap).map(
        (product) => ({
          ...product,
          amount: product.amount.toFixed(2), // Adjust the amount to two decimal places
        })
      );
      setAggregatedProducts(aggregatedProductsArray);
    };

    fetchMealplan();
  }, [username, listId]);

  useEffect(() => {
    console.log("aggregated", aggregatedProducts);
    console.log("mealplan", mealplan);
  }, [aggregatedProducts]);

  useEffect(() => {
    // Reinitialize item colors whenever recipes change
    const initialColors = {};
    aggregatedProducts.forEach((product) => {
      initialColors[product.id] = "#fff6e3"; // Default color for all products
    });
    setItemColors(initialColors);
  }, [aggregatedProducts]);

  const handleItemClick = (itemId) => {
    // Toggle color for the clicked item
    setItemColors((prevColors) => ({
      ...prevColors,
      [itemId]: prevColors[itemId] === "#fff6e3" ? "#74e3915e" : "#fff6e3",
    }));
  };

  return (
    <>
      <div className="content">
        <HeadArrowBack />
        {/* Render grocery list data */}
        <h2>{mealplan?.title || "Loading Meal Plan..."}</h2>

        <div className="display-list-container">
          {aggregatedProducts.map((product, index) => (
            <div
              key={index}
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
                {product.amount} {product.unit}
              </div>
            </div>
          ))}
        </div>
      </div>
      <NavBottom />
    </>
  );
};

export default MealPlanDisplayId;
