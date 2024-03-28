import { getAuth } from "firebase/auth";

const auth = getAuth();

const Account = () => {
  const user = auth.currentUser;

  return (
    <div className="main-content">
      <h2>Your Account</h2>
      <p>Username: {user.displayName}</p>
      <p>Mail: {user.email}</p>
    </div>
  );
};

export default Account;
