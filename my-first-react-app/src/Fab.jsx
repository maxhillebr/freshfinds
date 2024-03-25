import * as React from "react";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
// import { useState } from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import NewList from "./NewList.jsx";

export default function FloatingActionButtons() {
  return (
    <Fab variant="extended" color="primary" aria-label="add">
      <Router>
        <Link to="/new">New</Link>
        <AddIcon />

        <Switch>
          <Route path="/new">
            <NewList />
          </Route>
        </Switch>
      </Router>
    </Fab>
  );
}
