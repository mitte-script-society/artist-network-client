import { useEffect, useState } from "react";
import DisplayArtists from "../components/DisplayArtists";
import Login from '../components/Login'
import { AuthContext } from "../context/auth.context";
import { useContext } from "react";
import axios from "axios";

export default function SeeArtists() {
  const { isLogInWindow} = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [artistsArray, setArtistsArray] = useState(true);
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
        <div>Loading</div>
        :
        <DisplayArtists artistsArray={artistsArray}/>
      }
    </>
  )
}