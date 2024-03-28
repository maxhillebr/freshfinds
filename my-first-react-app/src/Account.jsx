import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

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
    <div>
      <div className="main-content">
        <h2>Your Account</h2>
        <p>Username: {currentUser.displayName}</p>
        <p>Mail: nothing</p>
      </div>
      {user ? (
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
            Change
          </Button>
        </div>
      ) : (
        <p>User not logged in</p>
      )}
    </div>
  );
};

export default Account;
