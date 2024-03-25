import * as React from "react";
import { Link } from "react-router-dom";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";

export default function FloatingActionButtons() {
  return (
    <Link to="/new">
      <Fab variant="extended" color="primary" aria-label="add">
        NEW
        <AddIcon />
      </Fab>
    </Link>
  );
}
