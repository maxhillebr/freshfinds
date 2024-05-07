import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";

import { db } from "/src/components/auth/firebase";
import { doc, collection, addDoc, getDoc, setDoc } from "firebase/firestore";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  // instantiate the auth service SDK
  const auth = getAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
    if (name === "username") setUsername(value);
  };

  // Handle user sign up with email and password
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      updateProfile(auth.currentUser, {
        displayName: username,
      });

      navigate("/home");
    } catch (err) {
      // Handle errors here
      const errorMessage = err.message;
      const errorCode = err.code;

      setError(true);

      switch (errorCode) {
        case "auth/weak-password":
          setErrorMessage("Das Passwort ist zu schwach.");
          break;
        case "auth/email-already-in-use":
          setErrorMessage("Diese Mail wird bereits verwendet.");
        case "auth/invalid-email":
          setErrorMessage("Diese Mail ist nicht gültig.");
          break;
        case "auth/operation-not-allowed":
          setErrorMessage("Mail/Passwort sind nicht erlaubt.");
          break;
        default:
          setErrorMessage(errorMessage);
          break;
      }
    }
  };

  return (
    <div className="content">
      <h2>Nur eine schnelle Anmeldung, keine Angst</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-textfields">
          <TextField
            required
            type="email"
            id="e-mail-input"
            label="E-Mail"
            name="email"
            margin="dense"
            fullWidth
            onChange={handleChange}
          />
          <TextField
            required
            type="password"
            id="password-input"
            label="Passwort"
            name="password"
            margin="dense"
            fullWidth
            onChange={handleChange}
          />

          <TextField
            required
            type="text"
            id="username-input"
            label="Username"
            name="username"
            margin="dense"
            fullWidth
            onChange={handleChange}
          />
        </div>
        <div className="submit-login-register">
          <Button type="submit" variant="contained">
            Registrieren
          </Button>
        </div>
        {error && <p>{errorMessage}</p>}
        <p>
          Du hast schon einen Account? <a href="/login">Login.</a>
        </p>
      </form>
      <div className="bottom-illustration">
        <img src="/illustrations/undraw_cookie_love_re_lsjh.svg" alt="cookie" />
      </div>
    </div>
  );
};

export default SignUp;
