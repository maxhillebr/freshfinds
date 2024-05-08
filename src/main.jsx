import React from "react";
import ReactDOM from "react-dom/client";
import Routing from "../src/Routing.jsx";
import "./index.css";

import { createTheme, ThemeProvider } from "@mui/material";

// Define a custom theme with your main color
const freshfindsTheme = createTheme({
  palette: {
    primary: {
      main: "#5556F1", // Your main color
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: "16px 38px", // Customize padding
          borderRadius: "24px", // Customize border radius
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  // Removed strictmode because of react-beautiful-dnd
  // <React.StrictMode>
  <ThemeProvider theme={freshfindsTheme}>
    <Routing />
  </ThemeProvider>
  // </React.StrictMode>
);
