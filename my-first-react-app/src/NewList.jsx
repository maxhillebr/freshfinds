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
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5NbqVvvMRbelJnyh95k13NzCazeUUQ6g",
  authDomain: "freshfinds-3456a.firebaseapp.com",
  projectId: "freshfinds-3456a",
  storageBucket: "freshfinds-3456a.appspot.com",
  messagingSenderId: "1016837431826",
  appId: "1:1016837431826:web:3d73c232b3e47885e5eecb",
};

// init firebase
const app = initializeApp(firebaseConfig);

// init services
const db = getFirestore();

// collection ref
const colRef = collection(db, "groceryLists");
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function NewList() {
  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // send new grocery list to groceryLists db on firestore
  // Function to add a new entry with a unique ID
  const addNewGroceryList = async (title, description) => {
    if (title === "" || description === "" || rows.length === 0) {
      alert("No Title, Description or Product. Check your list again!");
      return;
    }

    try {
      const docRef = await addDoc(colRef, {
        title: title,
        description: description,
        products: rows,
      });
      console.log("Document written with ID: ", docRef.id);
      alert("Grocery list sent to Database");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };
  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

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

  const handleDelete = (id) => {
    // Filter out the product with the given id from the rows array
    const updatedRows = rows.filter((product) => product.id !== id);

    // Update the state with the filtered rows
    setRows(updatedRows);
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
      <Button
        id="submit-list"
        variant="contained"
        onClick={() => addNewGroceryList(title, description, rows)}
      >
        Create List
      </Button>
    </div>
  );
}
