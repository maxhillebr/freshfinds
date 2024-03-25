import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import NewList from "./NewList";

export default function Routing() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/new" element={<NewList />} />
      </Routes>
    </Router>
  );
}
