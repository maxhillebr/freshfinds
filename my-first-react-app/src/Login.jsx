import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

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
    <div className="first-pages-flex-container">
      <img
        src="/src/assets/freshfinds-logo.png"
        alt="freshfinds Logo"
        width={"200px"}
      />
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          required
          type="email"
          id="e-mail-input"
          label="E-Mail"
          name="email"
          margin="normal"
          fullWidth
          onChange={handleChange}
        />
        <TextField
          required
          type="password"
          id="password-input"
          label="Password"
          name="password"
          margin="normal"
          fullWidth
          onChange={handleChange}
        />

        <Button fullWidth type="submit" variant="contained">
          Login
        </Button>
        {error && <p>{errorMessage}</p>}
      </form>
    </div>

    // <h1>Login</h1>
    // <form className="signinContainer__box__form" onSubmit={handleSubmit}>
    //   <input
    //     type="email"
    //     placeholder="Email"
    //     name="email"
    //     onChange={handleChange}
    //   />
    //   <input
    //     type="password"
    //     placeholder="Password"
    //     name="password"
    //     onChange={handleChange}
    //   />
    //   <button type="submit">Login</button>
    //   {error && <p>{errorMessage}</p>}
    // </form>

    // <div className="signinContainer__box__signup">
    //   <p>
    //     Don't have an account? <Link to="/signup">Sign Up</Link>
    //   </p>
    // </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default Login;
