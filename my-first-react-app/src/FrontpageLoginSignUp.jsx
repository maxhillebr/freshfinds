import Button from "@mui/material/Button";

const FrontpageLoginSignUp = () => {
  return (
    <>
      <p>Hello to freshfinds!</p>
      <Button href="/signup" variant="contained">
        Sign up
      </Button>
      <Button href="/login" variant="contained">
        Login
      </Button>
    </>
  );
};
export default FrontpageLoginSignUp;
