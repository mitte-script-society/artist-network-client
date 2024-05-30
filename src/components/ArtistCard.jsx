import "../styles/ArtistCard.css"
import image from "../assets/artist2.jpg"

export default function ArtistCard() {

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
    console.log("Logic for booking")
    //if logged in => sendRequets? 
    //if not logged in => Activate SignUp Window 
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

