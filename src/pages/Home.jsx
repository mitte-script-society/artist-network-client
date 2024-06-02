import axios from "axios"
import DisplayConcerts from "../components/DiplayConcerts"
import MapView from "../components/MapView"
import Login from '../components/Login'
import { AuthContext } from "../context/auth.context";
import { useContext } from "react";
import { useEffect, useState } from "react";

import { useState, useEffect } from "react"
import axios from "axios"

export default function Home() {
  const { isLogInWindow, userInformation} = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [concertsArray, setConcertsArray] = useState([]);
  const API_URL = "http://localhost:5005";

 useEffect( ( () => {
    axios.get(`${API_URL}/concert`)
      .then( (response) => {
        setConcertsArray(response.data.list);
        setIsLoading(false);
      })
      .catch( error => {
        console.log(error)
      })
  }), [])
  const API_URL = "http://localhost:5005";
  const [concertData, setConcertData] = useState([])

  useEffect(() => {
    axios.get(`${API_URL}/concert/`)
    .then(response => {setConcertData(response.data) })
    .catch(error => {console.log(error) })
  }, [])

  return (
    <>
      {isLogInWindow && 
        <Login/>
      }

      {isLoading?
        <div>Loading</div>
        :
        <div className="concerts-main-space">
        <div className="display-concerts-wrapper">
          <DisplayConcerts concertsArray={concertsArray} userInformation={userInformation}/>
        </div>
        <div className="map-space">
          <MapView concertData={concertData}/>
        </div>
    
      </div>

      }
    </>


  )

}