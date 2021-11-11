import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase.js";
import { updateEmail, updatePassword } from "firebase/auth";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");

  function signup(email, password) {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  function logout() {
    setRole("");
    return auth.signOut();
  }

  function changePassword(newPassword) {
    return updatePassword(user, newPassword);
  }

  function changeEmail(newEmail) {
    return updateEmail(user, newEmail);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    signup,
    login,
    logout,
    changeEmail,
    changePassword,
    setRole,
    role,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
