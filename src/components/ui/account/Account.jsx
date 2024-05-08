import "/src/css/main.css";
import "/src/css/account.css";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import NavBottom from "../nav/NavBottom";
import HeadArrowBack from "../nav/HeadArrowBack";
import SignOut from "./SignOut";

const auth = getAuth();

const Account = () => {
  const currentUser = auth.currentUser;

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    // Cleanup function to unsubscribe from the listener
    return () => unsubscribe();
  }, []);

  return (
    <>
      <div className="content">
        <HeadArrowBack />
        <div className="account-container">
          <h1>Dein Account</h1>
          <h2>Username: {currentUser.displayName}</h2>
          <h2>Mail: {currentUser.email}</h2>
        </div>

        <SignOut />
      </div>
      <NavBottom />
    </>
  );
};

export default Account;
