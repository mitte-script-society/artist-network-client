import { useEffect, useState } from "react";
import DisplayArtists from "../components/DisplayArtists";
import Login from '../components/Login'
import { AuthContext } from "../context/auth.context";
import { useContext } from "react";
import axios from "axios";
import LoadingPage from "../components/LoadingPage";

export default function SeeArtists() {
  const { isLogInWindow, userInformation} = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [artistsArray, setArtistsArray] = useState([]);
  const API_URL = "http://localhost:5005";

 useEffect( ( () => {
    axios.get(`${API_URL}/artists`)
      .then( (response) => {
        setArtistsArray(response.data);
        setIsLoading(false);
      })
      .catch( error => {
        console.log(error)
      })
  }), [])

  return ( 
    <>
      {isLogInWindow && 
        <Login/>
      }

      {isLoading?
        <LoadingPage/>
        :
        <DisplayArtists artistsArray={artistsArray} userInformation={userInformation} />
      }
    </>
  )
}