import * as React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import GroceryTable from "./GroceryTable";

export default function NewList() {
  return (
    <div>
      <h2>Create New Grocery List</h2>
      <div className="form-box">
        <TextField
          required
          id="grocery-list-title"
          label="Title"
          defaultValue=""
        />
        <TextField
          required
          id="grocery-list-description"
          label="Desciption"
          defaultValue=""
        />
      </div>
      <h2>Add Products</h2>
      <div className="form-box">
        <TextField
          required
          id="grocery-list-product"
          label="Product"
          defaultValue=""
        />
        <TextField
          required
          id="grocery-list-amount"
          label="Amount"
          defaultValue=""
        />
      </div>
      <Button variant="contained">Add</Button>

      <div>
        <GroceryTable />
      </div>
    </div>
  );
}
