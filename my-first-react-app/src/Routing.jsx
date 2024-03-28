import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import MenuAppBar from "./MenuAppBar";
import App from "./App";
import NewList from "./NewList";
import Account from "./Account";
import DBTest from "./DBTest";
import GroceryListPage from "./GroceryListsPage";
import SignUp from "./SignUp";
import FrontpageLoginSignUp from "./FrontpageLoginSignUp";

const Routing = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      {user && <MenuAppBar />}
      <Routes>
        {user ? (
          <>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<App />} />
            <Route path="/new" element={<NewList />} />
            <Route path="/account" element={<Account />} />
            <Route path="/test" element={<DBTest />} />
            <Route path="/grocerylists/:id" element={<GroceryListPage />} />
          </>
        ) : (
          <>
            <Route path="/" element={<FrontpageLoginSignUp />} />
            <Route path="/newuser" element={<SignUp />} />
          </>
        )}
        {!user && !loading && <Route path="*" element={<Navigate to="/" />} />}
      </Routes>
    </Router>
  );
};

export default Routing;
