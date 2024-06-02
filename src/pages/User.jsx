import "../styles/User.css"
import { useContext, useState } from 'react';
import { AuthContext } from "../context/auth.context";
import { bookmarkUser } from "../services/user-services";

const User = () => {
  const { userInformation} = useContext(AuthContext);
  const [showArtist, setShowArtist] = useState(true);
  const [favArtist, setFavArtist] = useState(userInformation.followedArtists);
  const [favConcerts, setFavConcerts] = useState(userInformation.bookmarkedEvents);

  function handleDelete(array, setFunction, index, property, element) {
    bookmarkUser("$pull", userInformation._id, property, element)
    .then( () => {
      const newArray = [... array ]
      newArray.splice(index,1)
      setFunction(newArray)

    })
    .catch( error => {
      console.log(error)
    })
  }
  function handleDetails(route, id) {
    window.open(`${route}/${id}`, '_blank');
  }

  return (
    <div className="user-full-space">

      <div id="toggle-dashboard-cards" onClick={() => setShowArtist(!showArtist) }>
        {showArtist? "See Events" : "See Artists"}
      </div>
      
      {showArtist?
      <div className="user-fav-card">
      <h1 className="text-4xl font-extrabold text-gray-800 my-6">{favArtist.length === 0? "No artists added": "Favorite Artists"}</h1>
       {favArtist.map ( (element, index) => {
         return (
         <div key={index} className="fav-card-item">
           <div style={{flex:"1"}}>  
             <img src={element.picture} />
           </div>
           <div style={{flex:"2"}} >
             <div className="text-xl font-bold text-gray-800">{element.name}</div>
             <div className="text-sm text-gray-600 mt-2">{element.artistDescription}</div>
           </div>
           <div style={{flex:"1", marginLeft:"5px"}}>
             <button onClick={ () => handleDetails("see-artists", element._id)}>Details</button>
             <button onClick={() => handleDelete(favArtist, setFavArtist, index, "followedArtists", element._id )}>Delete</button>
           </div>
 
         </div>)
       })
       }

      </div>
      :
      <div className="user-fav-card">
       <h1 className="text-4xl font-extrabold text-gray-800 my-6">{favConcerts.length === 0? "No events added": "Favorite Events"}</h1>
       {favConcerts.map ( (element, index) => {
          return (
          <div key={index} className="fav-card-item">
            <div style={{flex:"1"}}>  
              <img src={element.image} />
            </div>
            <div style={{flex:"2"}} >
              <div className="text-xl font-bold text-gray-800">{element.title}</div>
              <div className="text-sm text-gray-600 mt-2">{element.description}</div>
              <div className="text-sm text-gray-600 mt-2">{element.date.slice(0,10)}</div>
            </div>
            <div style={{flex:"1"}}>
              <button onClick={ () => handleDetails("/", element._id)}>Details</button>
              <button onClick={() => handleDelete(favConcerts, setFavConcerts, index, "bookmarkedEvents", element._id )}>Delete</button>
            </div>
          </div>)
        })
        }     
      </div>   
      }

    </div>
  );
};

export default User;
