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
  rows,
  setRows,
  selectedMealplan,
  setSelectedMealplan,
  title,
  setTitle,
  product,
  setProduct,
  amount,
  setAmount,
}) {
  // -------------------------------------------------
  // db, copy to clipboard path
  // load user info
  const { username } = useFirebaseAuth();

  const recipeListPath = "recipes";
  const mealplanListPath = "mealplan";

  const [mealplan, setMealplan] = useState(null);

  const [aggregatedProducts, setAggregatedProducts] = useState([]);

  // ------------------------------
  // handle change of input and update state
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  // update product and amount input
  const handleProductChange = (event) => {
    setProduct(event.target.value);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  // add products as array of objects to rows array
  const handleAddProducts = (product, amount, unit) => {
    const newData = createData(generateUUID(), product, amount, unit);
    setRows((prevRows) => [...prevRows, newData]);
    setProduct("");
    setAmount("");
  };

  // create object
  const createData = (id, name, amount, unit) => {
    return { id, name, amount, unit };
  };

  // fetch mealplan
  useEffect(() => {
    const fetchMealplan = async () => {
      try {
        const colRef = collection(db, "users", username, mealplanListPath);
        const querySnapshot = await getDocs(colRef);
        const mealplanSnapshot = [];

        querySnapshot.forEach((doc) => {
          mealplanSnapshot.push({ docId: doc.id, ...doc.data() });
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
    console.log("Component re-rendering...");
  }, [aggregatedProducts, mealplan, selectedMealplan]);

  // Function to handle meal plan selection
  const handleMealplanSelect = (event) => {
    if (event.target.value === "No Mealplan") {
      setSelectedMealplan(null);
      setAggregatedProducts([]); // Clear aggregated products if any
      return console.log("No mealplan selected");
    } else {
      const selectedPlan = mealplan.find(
        (plan) => plan.title === event.target.value
      );
      setSelectedMealplan(selectedPlan);
      console.log("Selected", selectedMealplan);
    }
  };

  const fetchRecipes = async (mealPlanRecipes) => {
    console.log("fetchRecipes called");
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
    console.log("aggregatedProductsArray: ", aggregatedProductsArray);
    setAggregatedProducts(aggregatedProductsArray);
  };

  //-------------------------------------
  useEffect(() => {
    if (aggregatedProducts.length > 0) {
      const combinedData = [
        ...rows,
        ...aggregatedProducts.map((product) => ({
          id: product.id,
          name: product.name,
          amount: product.amount,
          unit: product.unit,
        })),
      ];
      setRows(combinedData);
      setAggregatedProducts([]);
      console.log("combinedData", combinedData);
      alert("Added Mealplan Items to the list");
    }
  }, [aggregatedProducts, rows]);
  //-------------------------------------

  return (
    <>
      <div className="title-desc-container">
        <p>Title</p>
        <TextField
          required
          id="grocery-list-title"
          className="title-desc-container__title"
          label="Title"
          value={title}
          fullWidth
          onChange={handleTitleChange}
        />
      </div>
      <div className="add-product-help-text">
        <p>
          Optional: Choose a mealplan and press "ADD". All items from the
          mealplan will be added to the list.{" "}
          <strong>Don't add the same mealplan 2 times!</strong>
        </p>
      </div>
      <div className="create-mealplan-container">
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
            onClick={() => {
              if (selectedMealplan && selectedMealplan.recipes) {
                fetchRecipes(selectedMealplan.recipes);
              } else {
                console.log("No mealplan selected or mealplan has no recipes.");
                // Optionally, alert the user that no mealplan has been selected or there are no recipes
              }
            }}
          >
            Add
          </Button>
        </div>
      </div>
      <div className="add-product-container">
        <p>Add Product</p>
        <TextField
          required
          id="grocery-list-product"
          className="add-product-container__title"
          label="Product"
          value={product}
          fullWidth
          onChange={handleProductChange}
        />
        <TextField
          required
          id="grocery-list-amount"
          className="add-product-container__amount"
          label="Amount"
          value={amount}
          fullWidth
          onChange={handleAmountChange}
        />
        <div className="add-product-btn">
          <Button
            id="add-button"
            variant="contained"
            onClick={() => handleAddProducts(product, amount, "")}
          >
            Add
          </Button>
        </div>
      </div>
    </>
  );
}
