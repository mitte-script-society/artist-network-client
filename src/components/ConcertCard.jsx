import "../styles/ConcertCard.css";
import { AuthContext } from "../context/auth.context";
import { useContext, useState } from "react";
import { bookmarkUser } from "../services/user-services";

export default function ConcertCard({concertInfo}) {
  const { isLoggedIn, setIsLogInWindow, userInformation, resetUserInformation } = useContext(AuthContext);
  const property = "bookmarkedEvents";
  const date = concertInfo.date
  const dateObj = new Date(date);
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
      setIsLogInWindow(true);
    }
    else {
    let action = isBookmarked? "$pull" : "$push"
    bookmarkUser( action, userInformation._id, property , concertInfo._id)
        .then( response => {
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
        <img className="concert-photo-card object-cover h-80 w-full m-auto" src={concertInfo.image} /* src={concertInfo.image} *//>
      </div>

      <div className="concert-card-info-space">

        <div style={{minHeight:"80%"}}>
          <div className="text-xl font-bold text-gray-900 mb-2">{concertInfo.title}</div>
          <div className="flex items-center mb-2"><img src="/singer.png" className="h-5 w-5 mr-1"/><p className="text-lg mt-0">{concertInfo.name}</p></div>
          <div className="flex items-center mb-2"><img src="/genre.png" className="h-5 w-5 mr-1"/><p className="text-lg mt-0">{concertInfo.genre[0]}</p></div>
          <div className="flex items-center mb-2"><img src="/location.png" className="h-5 w-5 mr-1"/><p className="text-lg mt-0">{concertInfo.city}</p></div>
          <div className="flex items-center mb-2"><img src="/price.png" className="h-5 w-5 mr-1"/><p className="text-lg mt-0">{concertInfo.prices} €</p></div>
          
        </div>

        <div id="card-concert-buttons-container button">
          <button type="button" onClick={handleDetails} className="rounded-md bg-blue-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Details</button>
          <button type="button" onClick={handleBookmark} className="ml-2 rounded-md bg-pink-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">{isBookmarked? "Unfollow" : "Attend"}</button>
        </div>
      
      </div>

    </div>
    

  )
}