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
}) {
  const [error, setError] = useState("");

  const handleRecipeChange = (event, newValue) => {
    setSelectedRecipe(newValue);
  };

  // handle change of input and update state
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
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
      <div className="add-product-help-text">
        <p>
          Only add products/amount <strong>for 1 serving only</strong>. You can
          later change the servings.
        </p>
      </div>
      <div className="add-product-container">
        <p>Add Recipe</p>

        <Autocomplete
          id="recipe-autocomplete"
          options={recipes.map((recipe) => recipe.title)} // Assuming "recipeName" field
          value={selectedRecipe}
          onChange={handleRecipeChange}
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
          onChange={(e) => setServings(e.target.value)}
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
            // onClick={handleAddProducts}
          >
            Add
          </Button>
        </div>
      </div>
      {error && <div className="add-product-error-message">{error}</div>}
    </>
  );
}
