import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { Spotify } from "react-spotify-embed";
import { AuthContext } from "../context/auth.context";

export default function ConcertDetail(){
  const { isLoggedIn, setIsLogInWindow, setRoutePostLogin, userInformation, resetUserInformation } = useContext(AuthContext);
  const {concertId} = useParams()
  const [isLoading, setIsLoading] = useState(true);
  const [concertInfo, setConcertInfo] = useState({});
  const API_URL = "http://localhost:5005";
  const [videoURL, setVideoURL] = useState("https://www.youtube.com/embed/r9jwGansp1E")
  const [audioURL, setAudioURL] = useState()
  const navigate = useNavigate();
  const [artistLink, setArtistLink] = useState("")
  const [editLink, setEditLink] = useState("")

//   function handleBook () {
//     if (isLoggedIn) {
//       navigate(`/concerts/book/${artistInfo._id}`);
//     } else {
//       setRoutePostLogin(`/concerts/book/${artistInfo._id}`);
//       setIsLogInWindow(true);
//     }
//   }




useEffect ( () => {
    axios.get(`${API_URL}/concert/${concertId}`)
    .then( response => {
      setConcertInfo(response.data);
      setArtistLink(`/see-artists/${response.data.artist._id}`)
      setEditLink(`/concerts/edit/${concertId}`)
      console.log(response.data)
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
        <img src={concertInfo.image} className="object-cover h-80 w-full m-auto"/>
        <div className="flex items-center mb-2">
            <p className="text-xl font-bold mt-2 mb-2">{concertInfo.title} ({concertInfo.prices} €)</p>
            <button type="button" className="ml-2 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Attend</button>
            <Link to={editLink}><button type="button" className="ml-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Edit</button></Link>
        </div>
        <div className="flex items-center mb-2"><img src="/schedule.png" className="h-5 w-5 mr-1"/><p className="text-lg mt-0">{new Date(concertInfo.date).toLocaleString('de-DE', {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'})}h</p></div>
        <div className="flex items-center mb-2"><img src="/location.png" className="h-5 w-5 mr-1"/><p className="text-lg mt-0">{concertInfo.address.street} {concertInfo.address.number}, {concertInfo.address.zipcode} {concertInfo.city}</p></div>
        <div className="flex items-center mb-2"><img src="/genre.png" className="h-5 w-5 mr-1"/><p className="text-lg mt-0">
            {concertInfo.genre.map( (element, index, array) => {
            return index!==array.length-1 ? element+", ": element})
            }
            </p></div>
        <p className="text-lg mb-2">{concertInfo.description}</p>
        <p className="text-lg font-bold mb-2">Line Up</p>
        <div className="flex justify-start items-center">
            <img src={concertInfo.artist.picture} className="object-cover h-28 w-28"/>
            <div className="flex flex-col">
            <p className="text-lg mb-2 ml-3">{concertInfo.artist.name}</p>
            <p className="text-lg mb-2 ml-3">from {concertInfo.artist.city}</p>
            <Link to={artistLink}><button type="button" className="ml-2 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">View Artist</button></Link>
            </div>
        </div>

        {/* {videoURL && 
        <div className="aspect-w-16 aspect-h-9 mb-2">
          <iframe src={videoURL} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        </div>
        }
        {audioURL && 
        <Spotify link={audioURL} className="w-full h-48 mb-2"/>
        } */}
      </div>
      }

    </div>
  )
}