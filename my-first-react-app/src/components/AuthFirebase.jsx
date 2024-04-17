// auth.js
import { getAuth } from "firebase/auth";

export default function useFirebaseAuth() {
  const auth = getAuth();
  const user = auth.currentUser;
  const username = user ? user.displayName : null;
  return { user, username };
}
