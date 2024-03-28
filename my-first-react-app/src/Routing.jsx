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
import Login from "./Login";
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
        {/* Routes accessible to both logged-in and not logged-in users */}
        <Route path="/" element={<FrontpageLoginSignUp />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        {/* Routes accessible only to logged-in users */}
        {user && (
          <>
            <Route path="/home" element={<App />} />
            <Route path="/new" element={<NewList />} />
            <Route path="/account" element={<Account />} />
            <Route path="/test" element={<DBTest />} />
            <Route path="/grocerylists/:id" element={<GroceryListPage />} />
          </>
        )}

        {/* Redirect to home if user is logged in */}
        {user && <Route path="*" element={<Navigate to="/home" />} />}

        {/* Redirect to / if user is not logged in */}
        {!user && !loading && <Route path="*" element={<Navigate to="/" />} />}
      </Routes>
    </Router>
  );
};

export default Routing;
