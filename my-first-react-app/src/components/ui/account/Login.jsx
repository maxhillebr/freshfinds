import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "/src/css/start.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  // Instantiate the auth service SDK
  const auth = getAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Sign in with email and password in firebase auth service
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // The signed-in user info
      const user = userCredential.user;
      console.log("Logged in as: " + user.uid);
      navigate("/home");
    } catch (err) {
      // Handle Errors here.
      const errorMessage = err.message;
      const errorCode = err.code;

      setError(true);
      console.log(errorCode);

      switch (errorCode) {
        case "auth/invalid-email":
          setErrorMessage("This email address is invalid.");
          break;
        case "auth/user-disabled":
          setErrorMessage(
            "This email address is disabled by the administrator."
          );
          break;
        case "auth/user-not-found":
          setErrorMessage("This email address is not registered.");
          break;
        case "auth/wrong-password":
          setErrorMessage(
            "The password is invalid or the user does not have a password."
          );
          break;
        default:
          setErrorMessage(errorMessage);
          break;
      }
    }
  };

  return (
    <div className="content">
      <h2>I've seen you before. Nice.</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-textfields">
          <TextField
            required
            type="email"
            id="e-mail-input"
            label="E-Mail"
            name="email"
            margin="dense"
            onChange={handleChange}
          />
          <TextField
            required
            type="password"
            id="password-input"
            label="Password"
            name="password"
            margin="dense"
            onChange={handleChange}
          />
        </div>
        <div className="submit-login-register">
          <Button type="submit" variant="contained">
            Login
          </Button>
        </div>
        {error && <p>{errorMessage}</p>}
        <p>
          No Account? <a href="/signup">Get one (for free).</a>
        </p>
      </form>
      <div className="bottom-illustration">
        <img src="/illustrations/undraw_barbecue_3x93.svg" alt="barbecue" />
      </div>
    </div>
  );
};

export default Login;
