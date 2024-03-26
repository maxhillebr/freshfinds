import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function NewList() {
  // title and description
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  //add product and amount
  const [rows, setRows] = useState([]);
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");

  // get the value of all inputs

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleProductChange = (event) => {
    setProduct(event.target.value);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  // add product, amount to the list

  const handleAddProducts = () => {
    const newId = rows.length; // Assign unique IDs based on current length
    const newData = createData(newId, product, amount);

    // Update rows with the new data using the functional form of setRows
    setRows((prevRows) => [...prevRows, newData]);

    // Do something with the product and amount, such as adding them to the list
    console.log("Product:", product);
    console.log("Amount:", amount);

    // Clear the form fields after submission
    setProduct("");
    setAmount("");
  };

  // create the table with name and amount

  const createData = (id, name, amount) => {
    return { id, name, amount };
  };

  // function to see if title/description is updating

  // useEffect(() => {
  //   console.log("Updated rows:", rows);
  // }, [rows]);

  // useEffect(() => {
  //   console.log("Updated title, description:", title, description);
  // }, [title, description]);

  const handleDelete = (id) => {
    // Filter out the product with the given id from the rows array
    const updatedRows = rows.filter((product) => product.id !== id);

    // Update the state with the filtered rows
    setRows(updatedRows);
  };

  const handleSubmit = () => {
    if (title === "" || description === "" || rows.length === 0) {
      alert("No Title, Description or Product. Check your list again!");
    }

    console.log(title);
    console.log(description);
    console.log(rows);
  };

  return (
    <div className="main-content">
      <h2>Create New Grocery List</h2>
      <div className="form-box">
        <TextField
          required
          id="grocery-list-title"
          label="Title"
          value={title}
          onChange={handleTitleChange}
        />
        <TextField
          required
          id="grocery-list-description"
          label="Desciption"
          value={description}
          onChange={handleDescriptionChange}
        />
      </div>
      <h2>Add Products</h2>
      <div className="form-box">
        <TextField
          required
          id="grocery-list-product"
          label="Product"
          value={product}
          onChange={handleProductChange}
        />
        <TextField
          required
          id="grocery-list-amount"
          label="Amount"
          value={amount}
          onChange={handleAmountChange}
        />
      </div>
      <Button id="add-button" variant="contained" onClick={handleAddProducts}>
        Add
      </Button>
      {/* Main Table  */}
      <div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Action</TableCell>
                {/* New cell for the delete button */}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  id={"row" + row.id}
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell>{row.amount}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(row.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Button id="submit-list" variant="contained" onClick={handleSubmit}>
        Create List
      </Button>
    </div>
  );
}
