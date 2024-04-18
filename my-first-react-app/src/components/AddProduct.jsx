import { generateUUID } from "./UUIDGenerator";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function AddProduct({
  product,
  setProduct,
  amount,
  setAmount,
  rows,
  setRows,
}) {
  // update product and amount input
  const handleProductChange = (event) => {
    setProduct(event.target.value);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  // add products as array of objects to rows array
  const handleAddProducts = (product, amount) => {
    const newData = createData(generateUUID(), product, amount);
    setRows((prevRows) => [...prevRows, newData]);
    setProduct("");
    setAmount("");
  };

  // create object
  const createData = (id, name, amount) => {
    return { id, name, amount };
  };

  return (
    <div className="add-product-container">
      <TextField
        required
        id="grocery-list-amount"
        className="add-product-container__amount"
        label="Amount"
        value={amount}
        onChange={handleAmountChange}
      />
      <TextField
        required
        id="grocery-list-product"
        className="add-product-container__title"
        label="Product"
        value={product}
        onChange={handleProductChange}
      />
      <div className="add-product-btn">
        <Button
          id="add-button"
          variant="contained"
          onClick={() => handleAddProducts(product, amount)}
        >
          Add
        </Button>
      </div>
    </div>
  );
}
