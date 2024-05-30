import "../styles/ArtistCard.css"
import image from "../assets/artist2.jpg"
import { AuthContext } from "../context/auth.context";
import { useContext } from "react";


export default function ArtistCard({setShowLogIn}) {
  const { isLoggedIn, user } = useContext(AuthContext);

  //Required elements: isLogged.  

  let object = {
  city: "Dresden",
  moreThanOne: false,
  groupName: "The Mega Band",
  artistMembers: "Juan, Luis, Pedro",
  artistDescription: "Too good to be true. They are not true.",
  artistFee: 300,
  artistPictures: [], 
  artistVideos: [],
  artistAudio: [],
  artistWebsite: "",
  artistGenre: "Hevy Metal Cumbia",
  artistConcert: [], 
  artistReferences: [],
  _id: "alfaksfadfdkasl"
  }

  function handleBook () {  
    if (isLoggedIn) {
      console.log("Logic to book the artist, using the info stored in user:", user)
      console.log("Maybe here we can call the logic to Create a Concert")
    } else {
    setShowLogIn(true)
    }
  }
  
  function handleDetails() {
    window.open(`/see-artist/${object._id}`, '_blank');
  }
  
  return(
    <div className="concert-card">
      <img src={image}/>
      <div>{object.groupName}</div>
      <div>{object.artistDescription}</div>
      <div>{object.artistGenre}</div>
      <div>Based in: {object.city}</div>
      <div>Price: {object.artistFee}</div>
      <div id="card-concert-buttons-container">
        <button onClick={handleDetails}>Details</button>
        <button onClick={handleBook}>Book</button>
      </div>
      
    </div>

  )

}

