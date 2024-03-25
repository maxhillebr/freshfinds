import React from "react";
import ReactDOM from "react-dom/client";
import MenuAppBar from "./MenuAppBar.jsx";
import Routing from "./Routing.jsx";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MenuAppBar />
    <Routing />
  </React.StrictMode>
);
