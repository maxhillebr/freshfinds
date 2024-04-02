import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { db } from "./firebase";
import { collection, addDoc, getDoc, setDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function NewList() {
  // check if the user is logged in?
  const auth = getAuth();
  const user = auth.currentUser;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rows, setRows] = useState([]);
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");

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

  const handleAddProducts = () => {
    const newId = rows.length;
    const newData = createData(newId, product, amount);
    setRows((prevRows) => [...prevRows, newData]);
    setProduct("");
    setAmount("");
  };

  const createData = (id, name, amount) => {
    return { id, name, amount };
  };

  const handleDelete = (id) => {
    const updatedRows = rows.filter((product) => product.id !== id);
    setRows(updatedRows);
  };

  const addNewGroceryList = async () => {
    if (title === "" || description === "" || rows.length === 0) {
      alert("No Title, Description or Product. Check your list again!");
      return;
    }

    try {
      const username = user.displayName;

      if (!user || !username) {
        console.error(
          "User is not authenticated or display name is undefined."
        );
        return; // Exit the function early
      }

      const colRef = collection(db, "users", username, "grocerylists");
      const docRef = await addDoc(colRef, {
        title: title,
        description: description,
        products: [
          { id: 0, name: "Item 1", amount: "2" },
          { id: 1, name: "Item 2", amount: "5" },
        ],
      });

      console.log("Document written with ID: ", docRef.id);
      alert("Grocery list sent to Database");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
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
      <div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Action</TableCell>
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
      <Button id="submit-list" variant="contained" onClick={addNewGroceryList}>
        Create List
      </Button>
    </div>
  );
}
