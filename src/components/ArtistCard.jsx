import "../styles/ArtistCard.css"
import { AuthContext } from "../context/auth.context";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import bookmarkedimage from "../assets/1.png";
import notbookmarkedimage from "../assets/2.png";
import { bookmarkUser } from "../services/user-services";

export default function ArtistCard({artistInfo }) {
  const { isLoggedIn, setIsLogInWindow, userInformation, resetUserInformation } = useContext(AuthContext);
  const navigate = useNavigate();
  const property = "followedArtists";
  
  const [isBookmarked, setIsBookmarked] = useState( () => {
    if (!isLoggedIn) { //if nog logged in, return false
    return false
    }
    return userInformation.followedArtists.some(followedArtist => followedArtist._id === artistInfo._id);
  })

 function handleBookmark() {
    if (!isLoggedIn) {  
      setIsLogInWindow(true);
    }
    else {
    let action = isBookmarked? "$pull" : "$push"
    bookmarkUser( action, userInformation._id, property , artistInfo._id)
        .then( response => {
          resetUserInformation(userInformation._id);
          setIsBookmarked(!isBookmarked)
        })
        .catch( error => {
          alert("Unable to update data. Server error", error)
        })    
    }
  }  

  function handleBook () {
    if (isLoggedIn) {
      navigate(`/concerts/book/${artistInfo._id}`);
    } else {
      setIsLogInWindow(true);
    }
  }
  
  function handleDetails() {
    window.open(`/see-artists/${artistInfo._id}`, '_blank');
  }
  
  return(
    <div className="artist-card">
      <img className="fav-icon" src={isBookmarked? bookmarkedimage: notbookmarkedimage } onClick={handleBookmark}/>

      <div className="artist-card-photo-space">      
        <img className="artist-photo-card object-cover h-80 w-full m-auto" src={artistInfo.picture}/>
      </div>

      <div className="artist-card-info-space">

        <div style={{height:"80%"}}>
          <div className="text-xl font-bold text-gray-900 mb-2">{artistInfo.name}</div>
          <div className="flex items-center mb-2"><img src="/genre.png" className="h-5 w-5 mr-1"/><p className="text-lg mt-0">{artistInfo.artistGenre}</p></div>
          <div className="flex items-center mb-2"><img src="/location.png" className="h-5 w-5 mr-1"/><p className="text-lg mt-0">{artistInfo.city}</p></div>
          <div className="flex items-center mb-2"><img src="https://cdn-icons-png.flaticon.com/512/1420/1420341.png" className="h-5 w-5 mr-1"/><p className="text-lg mt-0">{artistInfo.artistFee} € / hour played</p></div>
        </div>

        <div id="card-concert-buttons-container button">
          <button type="button" onClick={handleDetails} className="ml-2 rounded-md bg-blue-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Details</button>
          {  artistInfo._id !== userInformation._id && 
            // <button onClick={handleBook}>Book</button>
            <button type="button" onClick={handleBook} className="ml-2 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Book</button>
            }
        </div>
      
      </div>

    </div>

  )
}