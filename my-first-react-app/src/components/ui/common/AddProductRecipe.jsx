import { generateUUID } from "../../common/UUIDGenerator";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Autocomplete } from "@mui/material";
import { useState } from "react";
import { productsList } from "../recipe/ProductsList";

export default function AddProductRecipe({
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
}) {
  const [error, setError] = useState("");

  // handle change of input and update state
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
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
        {error && <div className="error-message">{error}</div>}
      </div>
    </>
  );
}
