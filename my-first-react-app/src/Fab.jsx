import * as React from "react";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";

export default function FloatingActionButtons() {
  return (
    <Fab variant="extended" color="primary" aria-label="add">
      NEW
      <AddIcon />
    </Fab>
  );
}
