import DisplayConcerts from "../components/DiplayConcerts"
import MapView from "../components/MapView"
import { useState, useEffect } from "react"
import axios from "axios"

export default function Home() {

  const API_URL = "http://localhost:5005";
  const [concertData, setConcertData] = useState([])

  useEffect(() => {
    axios.get(`${API_URL}/concert/`)
    .then(response => {setConcertData(response.data) })
    .catch(error => {console.log(error) })
  }, [])

  return (
    <div className="concerts-main-space">
      <div className="display-concerts-wrapper">
        <DisplayConcerts/>
      </div>
      <div className="map-space">
        <MapView concertData={concertData}/>
      </div>
  
    </div>

  )

}