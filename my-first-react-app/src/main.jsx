import React from "react";
import ReactDOM from "react-dom/client";
import Routing from "../src/Routing.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  // Removed strictmode because of react-beautiful-dnd
  // <React.StrictMode>
  <Routing />
  // </React.StrictMode>
);
