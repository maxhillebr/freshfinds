import { generateUUID } from "../../common/UUIDGenerator";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Autocomplete } from "@mui/material";
import { useState } from "react";
import { productsList } from "../recipe/ProductsList";
import { tagList } from "../recipe/TagList";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

export default function AddMealPlan({
  title,
  setTitle,
  product,
  setProduct,
  amount,
  setAmount,
  rows,
  setRows,
  unit,
  setUnit,
  servings,
  setServings,
  tag,
  setTag,
}) {
  const [error, setError] = useState("");

  // handle change of input and update state
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  // handle change of input and update state
  const handleTagChange = (event) => {
    setTag(event.target.value);
  };

  const handleProductChange = (event, value) => {
    if (value) {
      setProduct(value);
      const selectedProduct = productsList.find(
        (item) => item.product.toLowerCase() === value.toLowerCase()
      );
      if (selectedProduct) {
        setUnit(selectedProduct.unit);
      } else {
        setUnit("");
      }
    } else {
      setProduct(""); // Clear product if value is not selected
      setUnit(""); // Clear unit if product is cleared
    }
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  // validate if the product is in the productsList
  const validateProduct = () => {
    if (!product) {
      setError("Product cannot be empty.");
      return false;
    }

    const productExists = productsList.some(
      (item) => item.product.toLowerCase() === product.toLowerCase()
    );
    if (!productExists) {
      setError("Product not found in the list.");
      setProduct("");
      setAmount("");
      setUnit("");
      return false;
    }
    return true;
  };

  // add products as array of objects to rows array
  const handleAddProducts = () => {
    // Validate product before adding
    if (!validateProduct()) {
      return;
    }
    const newData = createData(generateUUID(), product, amount, unit);
    setRows((prevRows) => [...prevRows, newData]);
    console.log(rows);
    setProduct("");
    setAmount("");
    setUnit("");
    setError(""); // Clear error message after successful addition
  };

  // create object
  const createData = (id, name, amount, unit) => {
    return { id, name, amount, unit };
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
        <p>Tag</p>
        <Select
          labelId="select-tag-label"
          id="select-tag"
          fullWidth
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        >
          {tagList.map((tagItem) => (
            <MenuItem key={tagItem.tag} value={tagItem.tag}>
              {tagItem.tag}
            </MenuItem>
          ))}
        </Select>
        <p>Servings</p>
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
      </div>
      <div className="title-product-list">
        <h2>Ingredients</h2>
      </div>
      <div className="add-product-help-text">
        <p>
          Only add products/amount <strong>for 1 serving only</strong>. You can
          later change the servings.
        </p>
      </div>
      <div className="add-product-container">
        <p>Add Product</p>

        <Autocomplete
          id="grocery-list-product"
          className="add-product-container__title"
          freeSolo
          options={productsList.map((option) => option.product)}
          renderInput={(params) => <TextField {...params} label="Product*" />}
          value={product}
          onChange={handleProductChange}
          inputValue={product || ""} // Reflect the input value
          onInputChange={(event, newInputValue) => {
            setProduct(newInputValue);
            const selectedProduct = productsList.find(
              (item) =>
                item.product.toLowerCase() === newInputValue.toLowerCase()
            );
            if (selectedProduct) {
              setUnit(selectedProduct.unit);
            } else {
              setUnit("");
            }
          }}
          fullWidth
        />
        <TextField
          required
          id="grocery-list-amount"
          className="add-product-container__amount"
          label={`Amount (${unit})`}
          value={amount}
          fullWidth
          onChange={handleAmountChange}
        />
        <div className="add-product-btn">
          <Button
            id="add-button"
            variant="contained"
            onClick={handleAddProducts}
          >
            Add
          </Button>
        </div>
      </div>
      {error && <div className="add-product-error-message">{error}</div>}
    </>
  );
}
