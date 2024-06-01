import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ArtistDetail(){
  const {artistId} = useParams()
  const [isLoading, setIsLoading] = useState(true);
  const [artistInfo, setArtistInfo] = useState({});
  const API_URL = "http://localhost:5005";

  useEffect ( () => {
    axios.get(`${API_URL}/artists/${artistId}`)
    .then( response => {
      setArtistInfo(response.data);
      setIsLoading(false)
    })
    .catch( error => {
      console.log(error)
    })
  }, [])

  return (
    <div>

      {isLoading? 
      <div>Loading</div>
      :
      <div>
        <h1>Information of artist id. Params: {artistId}</h1>
        <h2>Name fetched from server: {artistInfo.name} </h2>
      </div>
      }

    </div>
  )
}