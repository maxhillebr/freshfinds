import { generateUUID } from "../../common/UUIDGenerator";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function AddProduct({
  title,
  setTitle,
  product,
  setProduct,
  amount,
  setAmount,
  rows,
  setRows,
}) {
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
        <TextField
          required
          id="grocery-list-amount"
          className="add-product-container__amount"
          label="Amount"
          value={amount}
          fullWidth
          onChange={handleAmountChange}
        />
        <TextField
          required
          id="grocery-list-product"
          className="add-product-container__title"
          label="Product"
          value={product}
          fullWidth
          onChange={handleProductChange}
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
