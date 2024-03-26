import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

function createData(id, name, amount) {
  return { id, name, amount };
}

const rows = [
  createData(0, "Frozen yoghurt", 159),
  createData(1, "Ice cream sandwich", 237),
  createData(2, "Eclair", 262),
  createData(3, "Cupcake", 305),
  createData(4, "Gingerbread", 356),
];
console.log(rows);

export default function GroceryTable() {
  const handleDelete = (id) => {
    // Delete product from rows array
    let findProduct = rows.find((product) => product.id === id);
    let index = rows.indexOf(findProduct);
    rows.splice(index, 1);

    console.log(rows);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Action</TableCell> {/* New cell for the delete button */}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
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
  );
}
