import Button from "@mui/material/Button";

const FrontpageLoginSignUp = () => {
  return (
    <>
      <div className="first-pages-flex-container">
        <div>
          <img
            src="/freshfinds-logo.png"
            alt="freshfinds Logo"
            style={{ width: "200px" }}
          />
        </div>
        <p>Hello to freshfinds!</p>
        <Button fullWidth href="/signup" variant="contained" sx={{ m: 1 }}>
          Sign up
        </Button>
        <Button fullWidth href="/login" variant="outlined" sx={{ m: 1 }}>
          Login
        </Button>
      </div>
    </>
  );
};
export default FrontpageLoginSignUp;
