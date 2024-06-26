// src/components/IsPrivate.jsx

import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { Navigate } from "react-router-dom";
import LoadingPage from "./LoadingPage";

function IsPrivate( { children } ) {
  
  const { isLoggedIn, isLoading } = useContext(AuthContext);
  
  // If the authentication is still loading
  if (isLoading) return <LoadingPage/>;

  if (!isLoggedIn) {
  // If the user is not logged in 
    return <Navigate to="/" />;
  } else {
  // If the user is logged in, allow to see the page 
    return children;
  }
}

export default IsPrivate;
