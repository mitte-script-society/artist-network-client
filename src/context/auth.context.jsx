import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const AuthContext = React.createContext();

function AuthProviderWrapper(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isLogInWindow, setIsLogInWindow] = useState(false);
  const [userInformation, setUserInformation] = useState({});
  const socket = useRef(null)

  const storeToken = (token) => {
    localStorage.setItem("authToken", token);
  }
  
  function resetUserInformation(userId){
    if (userId === undefined) {
      userId = userInformation._id
    }
    if (userId === undefined)  {
      console.log("rejecting")
      return;}
    console.log("Calling:", userId)
    axios.get(`${import.meta.env.VITE_API_URL}/user/${userId}`)
  .then( response => {
    setUserInformation(response.data)
  }) 
  .catch( error => {
    console.log(error)
    })
  }

  const authenticateUser = async () => {
    // Get the stored token from the localStorage
    const storedToken = localStorage.getItem("authToken");

    // If the token exists in the localStorage
    if (storedToken) {
      try {
        // We must send the JWT token in the request's "Authorization" Headers
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/verify`, 
          { headers: { Authorization: `Bearer ${storedToken}` } }
        );

        setUser(response.data);
        const fullInformation = await axios.get(`${import.meta.env.VITE_API_URL}/user/${response.data._id}`);
        // If the server verifies that JWT token is valid  ✅
        // Update state variables
        setUserInformation(fullInformation.data);
        setIsLoggedIn(true);
        setIsLoading(false);
        connectSocket(fullInformation.data._id)

      } catch (error) {
        // If the server sends an error response (invalid token) ❌
        // Update state variables        
        setIsLoggedIn(false);
        setIsLoading(false);
        setUser(null);
        setUserInformation({});
        console.log("Error", error);
      }
    } else {
      // If the token is not available
      setIsLoggedIn(false);
      setIsLoading(false);
      setUser(null);
      setUserInformation({});
    }
  };

  const removeToken = () => {
    // Upon logout, remove the token from the localStorage
    localStorage.removeItem("authToken");
  }    
  
  const logOutUser = () => {
    setUserInformation({})
    removeToken();
    authenticateUser();
  }    

  function connectSocket(idUser) {
    console.log("Running connectSocket")

    socket.current = io(import.meta.env.VITE_API_URL);
    
    socket.current.on('connect', () => {
      socket.current.emit('create-user-room', idUser);
    } )

    socket.current.on('getNotification', ( {idConversation, recipientId, message}) => {
      console.log("From Context: Got notification")
      resetUserInformation(recipientId)
    });
  }

  useEffect(() => {
    authenticateUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, isLoading, user,
              storeToken, authenticateUser, logOutUser, 
              isLogInWindow, setIsLogInWindow,
              userInformation, resetUserInformation,
              setUserInformation, socket: socket.current
            }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}

export { AuthProviderWrapper, AuthContext };