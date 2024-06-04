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
  

 useEffect( ( () => {
    axios.get(`${import.meta.env.VITE_API_URL}/artists`)
      .then( (response) => {
        function shuffleArray(array) {
          for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
          }}

        shuffleArray(response.data);        
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