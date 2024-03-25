import { useState, useEffect } from "react";
import Button from "@mui/material/Button";

export default function GroceryBoxMain() {
  const [color, setColor] = useState("#f1f1f1");

  const changeColor = (color) => {
    setColor(color);
  };

  return (
    <>
      <div
        className="grocerybox"
        onClick={() => {
          changeColor("green");
        }}
        style={{ backgroundColor: color, padding: "1em", margin: "1em" }}
      >
        <div>
          <p style={{ fontWeight: 600 }}>Grocery for the weekend</p>
          <p style={{ color: "grey" }}>Add description here</p>
        </div>
        <div>
          <Button variant="contained">Edit</Button>
          <Button variant="outlined">Share</Button>
          <Button variant="outlined">Delete</Button>
        </div>
      </div>
    </>
  );
}
