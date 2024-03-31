import Button from "@mui/material/Button";
import { spacing } from "@mui/system";

const FrontpageLoginSignUp = () => {
  return (
    <>
      <div className="first-pages-flex-container">
        <div>
          <img
            src="\src\assets\freshfinds-logo.png"
            alt="freshfinds Logo"
            width={"200px"}
          />
        </div>
        <p>Hello to freshfinds!</p>
        <Button href="/signup" variant="contained" sx={{ m: 1 }}>
          Sign up
        </Button>
        <Button href="/login" variant="outlined" sx={{ m: 1 }}>
          Login
        </Button>
      </div>
    </>
  );
};
export default FrontpageLoginSignUp;
