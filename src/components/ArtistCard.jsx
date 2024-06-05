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

        <div style={{height:"70%"}}>
          <div className="text-2xl font-bold text-gray-900 mb-2">{artistInfo.name}</div>
          <div className="text-lg text-gray-700 mb-1">{artistInfo.artistGenre}</div>
          <div className="text-md text-gray-600 mb-1">{artistInfo.city}</div>
          <div className="text-md text-gray-800 mt-2 font-semibold">Hourly rate: {artistInfo.artistFee} €</div>
        </div>

        <div id="card-concert-buttons-container" style={{height:"30%"}}>
          <button onClick={handleDetails}>Details</button>
          {  artistInfo._id !== userInformation._id && 
            <button onClick={handleBook}>Book</button>}
        </div>
      
      </div>

    </div>

  )
}