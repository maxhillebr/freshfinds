import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import NewList from "./NewList";
import Account from "./Account";
import DBTest from "./DBTest";
import GroceryListPage from "./GroceryListsPage";

export default function Routing() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/new" element={<NewList />} />
        <Route path="/account" element={<Account />} />
        <Route path="/test" element={<DBTest />} />
        <Route path="/grocerylists/:id" element={<GroceryListPage />} />
      </Routes>
    </Router>
  );
}
