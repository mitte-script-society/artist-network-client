import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";



const AuthContext = React.createContext();

function AuthProviderWrapper(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isLogInWindow, setIsLogInWindow] = useState(false);
  const [userInformation, setUserInformation] = useState([])

  const socket = io(import.meta.env.VITE_API_URL);

  useEffect(() => {
    socket.on('connect', function() {
      socket.emit('join-main', userInformation?._id);
      console.log("joining room:", userInformation?._id)
    });
  }, [userInformation])
  
  const storeToken = (token) => {
    localStorage.setItem("authToken", token);
  }
  
  function  resetUserInformation(userId){
  axios.get(`${import.meta.env.VITE_API_URL}/user/${userId}`)
  .then( response => {
    setUserInformation(response.data)
  }) 
  .catch( error => {
    console.log(error)
    })
  }

  const authenticateUser = () => { 

    // Get the stored token from the localStorage
    const storedToken = localStorage.getItem("authToken");
    
    // If the token exists in the localStorage
    if (storedToken) {
      // We must send the JWT token in the request's "Authorization" Headers
      axios.get(`${import.meta.env.VITE_API_URL}/auth/verify`, 
        { headers: { Authorization: `Bearer ${storedToken}`} }
      )
      .then( response => {
        const user = response.data;
        return  axios.get(`${import.meta.env.VITE_API_URL}/user/${user._id}`)
      })
      .then( fullInformation => {
           // If the server verifies that JWT token is valid  ✅
           // Update state variables        
          setUserInformation(fullInformation.data)
          setIsLoggedIn(true);
          setIsLoading(false);
          setUser(user);
        })
      .catch((error) => {
        // If the server sends an error response (invalid token) ❌
        // Update state variables        
        setIsLoggedIn(false);
        setIsLoading(false);
        setUser(null);
        setUserInformation({})
        console.log("Error", error)
      });

    } else {
      // If the token is not available
      setIsLoggedIn(false);
      setIsLoading(false);
      setUser(null);
      setUserInformation({})
    }
  }

  const removeToken = () => {
    // Upon logout, remove the token from the localStorage
    localStorage.removeItem("authToken");
  }    
  
  const logOutUser = () => {
    setUserInformation({})
    removeToken();
    authenticateUser();
  }    

  useEffect(() => {
    // Run the function after the initial render,
    // after the components in the App render for the first time.
    authenticateUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, isLoading, user,
              storeToken, authenticateUser, logOutUser, 
              isLogInWindow, setIsLogInWindow,
              userInformation, resetUserInformation, socket
            }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}

export { AuthProviderWrapper, AuthContext };