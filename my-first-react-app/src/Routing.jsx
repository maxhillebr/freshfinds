import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import SignUp from "./components/ui/account/SignUp";
import Login from "./components/ui/account/Login";
import FrontpageLoginSignUp from "./components/ui/account/FrontpageLoginSignUp";
import GroceryListPageId from "./components/ui/lists/GroceryListPageId";
import EditList from "./components/ui/lists/EditList";
import Home from "./components/ui/home/Home";
import Account from "./components/ui/account/Account";
import NewList from "./components/ui/lists/NewList";
import NewRecipe from "./components/ui/recipe/NewRecipe";
import RecipePageId from "./components/ui/recipe/RecipePageId";
import EditRecipe from "./components/ui/recipe/EditRecipe";

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
      {/* {user && <MenuAppBar />} */}
      <Routes>
        {/* Routes accessible to both logged-in and not logged-in users */}
        <Route path="/" element={<FrontpageLoginSignUp />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        {/* Routes accessible only to logged-in users */}
        {user && (
          <>
            <Route path="/home" element={<Home />} />
            <Route path="/new" element={<NewList />} />
            <Route path="/newrecipe" element={<NewRecipe />} />

            <Route path="/account" element={<Account />} />

            <Route
              path="/users/:username/grocerylists/:listId"
              element={<GroceryListPageId />}
            />

            <Route
              path="/users/:username/recipes/:listId"
              element={<RecipePageId />}
            />
            <Route
              path="/users/:username/grocerylists/:listId/edit"
              element={
                <div>
                  <EditList />
                </div>
              }
            />
            <Route
              path="/users/:username/recipes/:listId/edit"
              element={
                <div>
                  <EditRecipe />
                </div>
              }
            />
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
