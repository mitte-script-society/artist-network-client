import { AuthContext } from "../context/auth.context";
import { useContext, useState } from "react";
import { bookmarkUser } from "../services/user-services";

export default function ConcertCard({concertInfo, setYPos }) {
  const { isLoggedIn, setIsLogInWindow, setRoutePostLogin, userInformation, resetUserInformation } = useContext(AuthContext);
  const property = "bookmarkedEvents";

  const [isBookmarked, setIsBookmarked] = useState( () => {
    if (!isLoggedIn) { //if nog logged in, return false
    return false
    }
    return userInformation.bookmarkedEvents.some( element => element === concertInfo._id);
  })

  function handleBookmark() {
    if (!isLoggedIn) {  
      setRoutePostLogin("");
      setIsLogInWindow(true);
    }
    else {
    let action = isBookmarked? "$pull" : "$push"
    bookmarkUser( action, userInformation._id, property , concertInfo._id)
        .then( response => {
          setYPos(window.scrollY)
          resetUserInformation(userInformation._id);
        })
        .catch( error => {
          alert("Unable to update data. Server error", error)
        })    
    }
  }
  
  function handleDetails() {
    window.open(`/concerts/${concertInfo._id}`, '_blank');
  }

  return (
    <div className="artist-card">
      <div className="fav-icon">Date</div>

      <div className="artist-card-photo-space">      
        <img className="artist-photo-card" src={concertInfo.image}/>
      </div>

      <div className="artist-card-info-space">

        <div style={{height:"70%"}}>
          <div className="text-2xl font-bold text-gray-900 mb-2">{concertInfo.artist}</div>
          <div className="text-lg text-gray-700 mb-1">{concertInfo.title}</div>
          <div className="text-lg text-gray-700 mb-1">{concertInfo.description}</div>
          <div className="text-md text-gray-600 mb-1">{concertInfo.city}</div>
          <div className="text-md text-gray-800 mt-2 font-semibold">{concertInfo.prices} €</div>
        </div>

        <div id="card-concert-buttons-container" style={{height:"30%"}}>
          <button onClick={handleDetails}>Details</button>
          <button onClick={handleBookmark}>{isBookmarked? "Unfollow" : "Join"}</button>
        </div>
      
      </div>

    </div>
    

  )
}