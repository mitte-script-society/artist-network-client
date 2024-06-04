// src/components/IsPrivate.jsx

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/auth.context";
import { Navigate, useParams } from "react-router-dom";

function IsHost({ EditConcert }) {
  
const { isLoading, user } = useContext(AuthContext);

const [isHost, setIsHost] = useState(false)
const {concertId} = useParams()
const [concert, setConcert] = useState({})

function handleDataFromChild(data) {
  setConcert(data);
}

useEffect(() => {
    axios.get(`${API_URL}/concert/${concertId}`)
    .then(response => {
        setConcert(response.data)
        console.log(response.data)
    })
    .catch(error => {console.log(error) })
  }, [])

useEffect(() => {
    if(concert.host === user._id) 
        {console.log(success)}
    }, [])

//   console.log(">Value of isLoggedIn in isPrivate ----------------------------:", isHost)
//   // If the authentication is still loading 
//   if (isLoading) return <p>Loading ...</p>;

//   if (!isLoggedIn) {
//     console.log("Not logged in, redirecting to /")
//   // If the user is not logged in 
//     return <Navigate to="/" />;
//   } else {
  // If the user is logged in, allow to see the page 
    return (<EditConcert sendDataToParent={handleDataFromChild}/>)
//   }
}

export default IsHost;
