import "../styles/ConcertCard.css"

export default function ConcertCard() {

  //Required elements: isLogged, activation of log in window

  const object = {
    title: "Magic Jazz evening",
    description: "",
    image: "url",
    isPublic: true,
    city: "Berlin",
    date: "2024-07-20T19:30:00.000+00:00",
    prices: 20, 
    artist: "reference", 
    host: "reference",
    _id: "adfladkaldfkads"
  }

  function handleJoin () {
    console.log("Logic for joining")
    //if logged in => sendRequets? 

    //if not logged in => Activate SignUp Window 
  }
  
  function handleDetails() {
    window.open(`/concerts/${object._id}`, '_blank');
  }
  
  return(
    <div className="concert-card">
      <img src="https://res.cloudinary.com/deckhnump/image/upload/v1717240360/artist2_gerp3h.jpg"/>
      <div>Get name of the artist</div>
      <div>{object.title}</div>
      <div>{object.description}</div>
      <div>{object.date}</div>
      <div>Adress</div>
      <div>{object.city}</div>
      <div>Price: {object.prices}</div>
      <div id="card-concert-buttons-container">
        <button onClick={handleDetails}>Details</button>
        <button onClick={handleJoin}>Join</button>
      </div>
      
    </div>

  )

}

  /*
_id
title
description
image
isPublic
city
date
prices
artist
host

*/


/* moreThanOne
groupName
artistMembers
artistDescription
artistFee
artistPictures
artistVideos
artistAudio
artistWebsite
artistGenre
artistConcert
artistReferences */