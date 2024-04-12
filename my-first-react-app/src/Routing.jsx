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
import SignUp from "./SignUp";
import Login from "./Login";
import FrontpageLoginSignUp from "./FrontpageLoginSignUp";
import GroceryListPageId from "./GroceryListPageId";
import EditList from "./EditList";
import EditListTest from "./components/EditListTest";
import HomeTest from "./components/HomeTest";
import NewListTest from "./components/NewListTest";
import GroceryListPageIdTest from "./components/GroceryListPageIdTest";
import AccountTest from "./components/AccountTest";

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
            <Route path="/home" element={<App />} />
            <Route path="/new" element={<NewList />} />
            <Route path="/account" element={<AccountTest />} />
            <Route path="/test" element={<DBTest />} />

            {/* <Route
              path="/users/:username/grocerylists/:listId"
              element={<GroceryListPageId />}
            /> */}
            <Route
              path="/users/:username/grocerylists/:listId/edit"
              element={
                <div>
                  <EditListTest />
                </div>
              }
            />
            {/* for testing purposes */}
            <Route path="/hometest" element={<HomeTest />} />
            <Route path="/newlisttest" element={<NewListTest />} />
            <Route
              path="/users/:username/grocerylists/:listId"
              element={<GroceryListPageIdTest />}
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
