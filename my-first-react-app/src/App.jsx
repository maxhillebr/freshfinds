import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import FloatingActionButtons from "./Fab.jsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <FloatingActionButtons />
    </>
  );
}

export default App;
