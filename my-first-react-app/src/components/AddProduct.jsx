import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import useStateHook from "./StateHook";

export default function AddProduct({ handleAddProducts }) {
  // initialize state of input
  const { product, setProduct, amount, setAmount } = useStateHook();

  // update product and amount input
  const handleProductChange = (event) => {
    setProduct(event.target.value);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
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
