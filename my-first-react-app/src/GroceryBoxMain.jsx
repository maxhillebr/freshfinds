import Button from "@mui/material/Button";

export default function GroceryBoxMain() {
  return (
    <>
      <div
        style={{ backgroundColor: "#f1f1f1", padding: "1em", margin: "1em" }}
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
