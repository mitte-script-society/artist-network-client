import "../styles/ConcertCard.css";
import { AuthContext } from "../context/auth.context";
import { useContext, useState } from "react";
import { bookmarkUser } from "../services/user-services";

export default function ConcertCard({concertInfo, setYPos }) {
  const { isLoggedIn, setIsLogInWindow, setRoutePostLogin, userInformation, resetUserInformation } = useContext(AuthContext);
  const property = "bookmarkedEvents";
  
  const date = concertInfo.date
  const dateStr = "2024-07-20T19:30:00.000Z";
  const dateObj = new Date(dateStr);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const dayNames = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ];
  const nameDay = dayNames[dateObj.getUTCDay()];
  const month = monthNames[dateObj.getUTCMonth()];
  const day = dateObj.getUTCDate();


  const [isBookmarked, setIsBookmarked] = useState( () => {
    if (!isLoggedIn) { //if nog logged in, return false
    return false
    }
    return userInformation.bookmarkedEvents.some( element => element._id === concertInfo._id);
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
          setIsBookmarked(!isBookmarked)
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
    <div className="concert-card">

      <div className="date-card-concert"> 
        <div>{nameDay.slice(0,2)}. {month.slice(0,3)}</div>
      
        <div className="concert-date-day">{day}</div>
      
      </div>

      <div className="concert-card-photo-space">      
        <img className="concert-photo-card" src={concertInfo.image} /* src={concertInfo.image} *//>
      </div>

      <div className="concert-card-info-space">

        <div style={{height:"70%"}}>
          <div className="text-2xl font-bold text-gray-900 mb-2">{concertInfo.artist.name}</div>
          <div className="text-lg text-gray-700 mb-1">{concertInfo.title}</div>
          <div className="text-lg text-gray-700 mb-1">{concertInfo.description}</div>
          <div className="text-md text-gray-600 mb-1">{concertInfo.city}</div>
          <div className="text-md text-gray-800 mt-2 font-semibold">{concertInfo.prices} €</div>
        </div>

        <div id="card-concert-buttons-container" style={{height:"30%"}}>
          <button onClick={handleDetails}>Details</button>
          <button onClick={handleBookmark}>{isBookmarked? "Unfollow" : "Attend"}</button>
        </div>
      
      </div>

    </div>
    

  )
}