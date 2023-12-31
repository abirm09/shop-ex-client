import { useEffect, useState } from "react";
import { createContext } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import app from "../../Util/Firebase/Firebase.config";
export const ExContext = createContext();
export const BaseUrl = "http://localhost:5000";
const ShopExProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);

  //create user will email and password
  const emailPassCreation = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  //login user with email and password
  const emailPassLogin = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  //log out user
  const logOutUser = async () => {
    return signOut(auth)
      .then()
      .catch(err => console.log(err));
  };
  //observe user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser?.email) {
        const url = `${BaseUrl}/jwt?email=${currentUser.email}`;
        fetch(url)
          .then(res => res.json())
          .then(data => {
            localStorage.setItem("access_token", data.token);
          })
          .catch(err => console.log(err));
      }
    });
    return () => {
      return unsubscribe();
    };
  }, [auth]);
  const data = {
    name: "Md. Abir mahmud",
    user,
    setUser,
    emailPassLogin,
    emailPassCreation,
    loading,
    logOutUser,
  };
  return <ExContext.Provider value={data}>{children}</ExContext.Provider>;
};

export default ShopExProvider;
