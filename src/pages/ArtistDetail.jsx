import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Spotify } from "react-spotify-embed";
import { AuthContext } from "../context/auth.context";

export default function ArtistDetail(){
  const { isLoggedIn, setIsLogInWindow, setRoutePostLogin, userInformation, resetUserInformation } = useContext(AuthContext);
  const {artistId} = useParams()
  const [isLoading, setIsLoading] = useState(true);
  const [artistInfo, setArtistInfo] = useState({});
  const API_URL = "http://localhost:5005";
  const [videoURL, setVideoURL] = useState("https://www.youtube.com/embed/r9jwGansp1E")
  const [audioURL, setAudioURL] = useState()
  const navigate = useNavigate();

  function handleBook () {
    if (isLoggedIn) {
      navigate(`/concerts/book/${artistInfo._id}`);
    } else {
      setRoutePostLogin(`/concerts/book/${artistInfo._id}`);
      setIsLogInWindow(true);
    }
  }

  useEffect ( () => {
    axios.get(`${API_URL}/artists/${artistId}`)
    .then( response => {
      setArtistInfo(response.data);
      console.log(response.data)
      if(response.data.artistAudio.length>0) setAudioURL(response.data.artistAudio)
      if(response.data.artistVideos[0].includes("www.youtube.com")) {
        let newArray = response.data.artistVideos[0].split("=");
        let embedURL = `https://www.youtube.com/embed/${newArray[1]}`
        setVideoURL(embedURL)
      }
      setIsLoading(false)
    })
    .catch( error => {
      console.log(error)
    })
  }, [])

  return (
    <div className="m-auto max-w-xl">

      {isLoading? 
      <div>Loading</div>
      :
      <div className="m-auto max-w:1/2 gap:3">
        <img src={artistInfo.picture} className="object-cover h-80 w-full m-auto"/>
        <div className="flex items-center mb-2"><p className="text-xl font-bold mt-2 mb-2">{artistInfo.name} ({artistInfo.artistFee} € / hr)</p><button type="button" onClick={handleBook} className="ml-2 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Book</button></div>
        <div className="flex items-center mb-2"><img src="/location.png" className="h-5 w-5 mr-1"/><p className="text-lg mt-0">{artistInfo.city}</p></div>
        <div className="flex items-center mb-2"><img src="/genre.png" className="h-5 w-5 mr-1"/><p className="text-lg mt-0">{artistInfo.artistGenre}</p></div>
        {artistInfo.artistWebsite && 
        <div className="flex items-center mb-2"><img src="/website.png" className="h-5 w-5 mr-1"/><a href={artistInfo.artistWebsite} className="text-lg mt-0" target="_blank">{artistInfo.artistWebsite}</a></div>
        }
        <p className="text-lg mb-2">{artistInfo.artistDescription}</p>
        {videoURL && 
        <div className="aspect-w-16 aspect-h-9 mb-2">
          <iframe src={videoURL} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        </div>
        }
        {audioURL && 
        <Spotify link={audioURL} className="w-full h-48 mb-2"/>
        }
      </div>
      }

    </div>
  )
}