// src/components/IsPrivate.jsx

import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { Navigate } from "react-router-dom";

function IsPrivate( { children } ) {
  
  const { isLoggedIn, isLoading } = useContext(AuthContext);
  
  console.log("Valor loggedin en Private:", isLoggedIn)
  // If the authentication is still loading
  if (isLoading) return <p>Loading ...</p>;

  if (!isLoggedIn) {
    console.log("Not logged in, redirecting to /")
  // If the user is not logged in 
    return <Navigate to="/" />;
  } else {
  // If the user is logged in, allow to see the page 
    return children;
  }
}

export default IsPrivate;
