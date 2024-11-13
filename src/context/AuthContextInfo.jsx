import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import React from "react";

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

function AuthContextInfo({ children }) {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });

  // this line is used to automatically include an authentication token in all requests made with axios.

// Why We Use It:
// Convenience: You don't have to manually add the Authorization header to every request; it's done automatically.
// Security: Ensures that all your API requests are authenticated.
// Why It's Useful:
// Consistency: Guarantees that every request sent from your application includes the necessary authentication, reducing the risk of unauthorized access errors.
// It sets up axios to automatically attach your authorization token to all outgoing API requests, ensuring they are authenticated.

  axios.defaults.headers.common["Authorization"] = auth?.token;

  
  useEffect(() => {
    const data = localStorage.getItem("auth");

    if (data) {
      const parseData = JSON.parse(data);
      setAuth({
        ...auth,
        user: parseData.user,
        token: parseData.token,
      });
    }
    //eslint-disable-next-line
  }, []);



  // The useEffect is used to ensure the code runs only once when the component mounts. It retrieves authentication data (user and token) from localStorage and updates the state with setAuth. Without useEffect, this code would run on every render, which is inefficient and could lead to unnecessary state updates. 

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextInfo;
