import axios from "axios"
import DisplayConcerts from "../components/DiplayConcerts"
import MapView from "../components/MapView"
import Login from '../components/Login'
import { AuthContext } from "../context/auth.context";
import { useContext } from "react";
import { useEffect, useState } from "react";
import LoadingPage from "../components/LoadingPage";

export default function Home() {
  const { isLogInWindow, userInformation} = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [concertsArray, setConcertsArray] = useState([]);
  

  useEffect( ( () => {
    axios.get(`${import.meta.env.VITE_API_URL}/concert`)
      .then( (response) => 
        {
      function shuffleArray(array) {
          for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
          }}

        shuffleArray(response.data.list);
        setConcertsArray(response.data.list);      
        setIsLoading(false);
      })
      .catch( error => {
        console.log(error)
      })
  }), [])

 
  const identifyItem = (itemInfo) => {
    //Find the item 
  }

  return (
    <>
      {isLogInWindow && 
        <Login/>
      }

      {isLoading?
        <LoadingPage/>
        :
        <div className="concerts-main-space">
        <div className="display-concerts-wrapper">
          <DisplayConcerts concertsArray={concertsArray} userInformation={userInformation}/>
        </div>
        <div className="map-space">
          <MapView concertData={concertsArray} identifyItem={identifyItem}/>
        </div>
    
      </div>

      }
    </>


  )

}