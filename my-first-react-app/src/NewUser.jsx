import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const auth = getAuth();

const NewUser = () => {
  const [user, setUser] = useState(null);

  const navigate = useNavigate(); // Hook to access the navigation object

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
    alert("Changes saved. Redirect to Home.");
    navigate("/home");
  };

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  return (
    <div>
      {user ? (
        <div>
          <p>new User: {user.uid}</p>
          <TextField
            required
            id="username"
            label="Username"
            value={username}
            onChange={handleUsernameChange}
          />
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

export default NewUser;
