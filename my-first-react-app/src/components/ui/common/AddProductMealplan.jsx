import { generateUUID } from "../../common/UUIDGenerator";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import useFirebaseAuth from "../../auth/AuthFirebase";
import { db } from "/src/components/auth/firebase";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

export default function AddProductMealplan({
  aggregatedProducts,
  setAggregatedProducts,
  rows,
  setRows,
}) {
  // -------------------------------------------------
  // db, copy to clipboard path
  // load user info
  const { username } = useFirebaseAuth();

  const recipeListPath = "recipes";
  const mealplanListPath = "mealplan";

  const [mealplan, setMealplan] = useState(null);
  // const [aggregatedProducts, setAggregatedProducts] = useState([]);
  const [selectedMealplan, setSelectedMealplan] = useState(null);

  useEffect(() => {
    const fetchMealplan = async () => {
      try {
        const colRef = collection(db, "users", username, mealplanListPath);
        const querySnapshot = await getDocs(colRef);
        const mealplanSnapshot = [];

        querySnapshot.forEach((doc) => {
          mealplanSnapshot.push(doc.data());
        });
        setMealplan(mealplanSnapshot);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchMealplan();
  }, [username]);

  useEffect(() => {
    console.log("mealplan", mealplan);
    console.log("selected mealplan", selectedMealplan);
    console.log("aggregated", aggregatedProducts);
  }, [aggregatedProducts, mealplan, selectedMealplan]);

  // Function to handle meal plan selection
  const handleMealplanSelect = (event) => {
    const selectedPlan = mealplan.find(
      (plan) => plan.title === event.target.value
    );
    setSelectedMealplan(selectedPlan);
    console.log("Selected", selectedMealplan);
    if (selectedMealplan === null) {
      console.log("No mealplan selected");
      setAggregatedProducts([]);
      return;
    }
  };

  // // add products as array of objects to rows array
  // const handleAddMealplan = () => {
  //   fetchRecipes(selectedMealplan.recipes);
  // };

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
          const normalizedAmount = parseFloat(product.amount.replace(",", "."));
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

  const handleAddMealplanProducts = () => {
    fetchRecipes(selectedMealplan.recipes);

    const combinedData = [
      ...rows,
      ...aggregatedProducts.map((product) => ({
        id: product.id,
        name: product.name,
        amount: product.amount,
        unit: product.unit,
      })),
    ];

    // Set the combined data as the new rows state
    setRows(combinedData);

    // Clear the aggregatedProducts array
    setAggregatedProducts([]);

    console.log(combinedData);
    alert("Added Mealplan Items to the list");
  };

  return (
    <>
      <div className="mealplan-container">
        <p>Choose Mealplan?</p>
        <Select
          labelId="select-mealplan-label"
          id="select-mealplan"
          fullWidth
          value={selectedMealplan ? selectedMealplan.title : ""}
          onChange={handleMealplanSelect}
        >
          <MenuItem value="No Mealplan">No Mealplan</MenuItem>
          {mealplan &&
            mealplan.map((plan) => (
              <MenuItem key={plan.id} value={plan.title}>
                {plan.title}
              </MenuItem>
            ))}
        </Select>
        <div className="add-product-btn">
          <Button
            id="add-button"
            variant="contained"
            onClick={() => handleAddMealplanProducts()}
          >
            Add
          </Button>
        </div>
      </div>
    </>
  );
}
