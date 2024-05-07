import { generateUUID } from "../../common/UUIDGenerator";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Autocomplete } from "@mui/material";
import { useState, useEffect } from "react";
import { productsList } from "../recipe/ProductsList";
import { tagList } from "../recipe/TagList";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

export default function AddMealPlan({
  title,
  setTitle,
  recipes,
  setRecipes,
  selectedRecipe,
  setSelectedRecipe,
  servings,
  setServings,
  rows,
  setRows,
}) {
  const [error, setError] = useState("");

  // handle change of input and update state
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleSelectedRecipeChange = (event, newValue) => {
    setSelectedRecipe(newValue); // Set the selected recipe
    if (newValue && newValue.servings) {
      setServings(newValue.servings); // Set servings based on the selected recipe
    } else {
      setServings(""); // Reset or default value if no servings info is available
    }
  };
  const handleServingsChange = (event) => {
    setServings(event.target.value);
  };

  // add products as array of objects to rows array
  const handleAddRecipes = () => {
    if (!selectedRecipe || !servings) {
      console.error("Recipe or servings are missing");
      setError("Recipe or servings are missing");
      return;
    }
    const newData = createData(
      generateUUID(),
      selectedRecipe.id,
      selectedRecipe.title,
      servings
    );
    setRows((prevRows) => [...(prevRows || []), newData]);
    setSelectedRecipe(null);
    setServings("");
    setError("");
  };
  useEffect(() => {
    console.log("Rows updated:", rows);
  }, [rows]);

  // create object
  const createData = (id, recipeId, title, servings) => {
    return { id, recipeId, title, servings };
  };

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
      <div className="title-product-list">
        <h2>Choose your Meals for the Week</h2>
      </div>
      <div className="add-product-container">
        <p>Add Recipe</p>

        <Autocomplete
          id="recipe-autocomplete"
          options={recipes}
          getOptionLabel={(option) => option.title}
          value={selectedRecipe}
          onChange={handleSelectedRecipeChange}
          renderInput={(params) => (
            <TextField {...params} label="Recipe" variant="outlined" />
          )}
          fullWidth
        />
        <p>Servings?</p>
        <Select
          labelId="select-servings-label"
          id="select-servings"
          fullWidth
          value={servings}
          onChange={handleServingsChange}
        >
          {[...Array(10).keys()].map((value) => (
            <MenuItem key={value + 1} value={value + 1}>
              {value + 1}
            </MenuItem>
          ))}
        </Select>
        <div className="add-product-btn">
          <Button
            id="add-button"
            variant="contained"
            onClick={handleAddRecipes}
          >
            Add
          </Button>
        </div>
      </div>
      {error && <div className="add-product-error-message">{error}</div>}
    </>
  );
}
