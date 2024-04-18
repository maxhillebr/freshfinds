import "/src/css/main.css";
import "/src/css/account.css";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
// import TextField from "@mui/material/TextField";
// import Button from "@mui/material/Button";
import NavBottom from "../nav/NavBottom";
import HeadArrowBack from "../nav/HeadArrowBack";

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

  // change username
  const [username, setUsername] = useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  const updateUsername = () => {
    updateProfile(auth.currentUser, {
      displayName: username,
    })
      .then(() => {
        // Profile updated successfully
        console.log("Username updated successfully");

        // Fetch user data again to get the updated displayName
        onAuthStateChanged(auth, (user) => {
          if (user) {
            const displayName = user.displayName;
            console.log("Updated displayName:", displayName);
          }
        });
      })
      .catch((error) => {
        // An error occurred
        console.error("Error updating username:", error);
      });
    alert("Changes saved. Load the page to see the Changes.");
    // navigate("/home");
  };

  return (
    <>
      <div className="content">
        <HeadArrowBack />
        <div className="account-container">
          <h1>Your Account</h1>
          <h2>Username: {currentUser.displayName}</h2>
          <h2>Mail: {currentUser.email}</h2>
        </div>
        {/* {user ? (
          <div>
            <h3>Change Username</h3>
            <TextField
              required
              id="username"
              label="Username"
              value={username}
              onChange={handleUsernameChange}
            />
            <br />
            <br />
            <Button
              id="submit-new-user"
              variant="contained"
              onClick={() => updateUsername(username)}
            >
              Change Username
            </Button>
          </div>
        ) : (
          <p>User not logged in</p>
        )} */}
      </div>
      <NavBottom />
    </>
  );
};

export default Account;
