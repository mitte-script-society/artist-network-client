import "../styles/ArtistCard.css"
import { AuthContext } from "../context/auth.context";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

export default function ArtistCard({artistInfo}) {
  const { isLoggedIn, setIsLogInWindow, setRoutePostLogin } = useContext(AuthContext);
  const navigate = useNavigate();
 
  function handleBook () {
    if (isLoggedIn) {
      navigate(`/concerts/book/${artistInfo._id}`);
    } else {
      setRoutePostLogin(`/concerts/book/${artistInfo._id}`);
      setIsLogInWindow(true);
    }
  }
  
  function handleDetails() {
    window.open(`/see-artists/${artistInfo._id}`, '_blank');
  }
  
  return(

    <div className="concert-card">
      <img src={artistInfo.picture}/>
      <div>{artistInfo.name}</div>
      <div>{artistInfo.artistGenre}</div>
      <div>{artistInfo.city}</div>
      <div>Hourly rate: {artistInfo.artistFee} €</div>
      <div id="card-concert-buttons-container">
        <button onClick={handleDetails}>Details</button>
        <button onClick={handleBook}>Book</button>
      </div>
    </div>
  )

}

