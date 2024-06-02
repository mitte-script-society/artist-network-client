import '../styles/DisplayArtists.css'
import ArtistCard from './ArtistCard';
import { useEffect, useState } from 'react';
import photo from "../assets/7.png"


export default function DisplayArtists({artistsArray, userInformation}) {
  const [arrayToShow, setArrayToShow] = useState(artistsArray);
  const [isLoading, setIsLoading] = useState(false)
  const [yPos, setYPos] = useState("")
  
  useEffect( () => {
    setIsLoading(true);
    setTimeout( () => {
      setIsLoading(false);
      console.log(yPos)
      window.scrollTo({ top: yPos, behavior: 'smooth' });      
    } , 1)
  } , [userInformation]
  )

  return (
    <div id='display-elements'>

      <div id="search-bar-container">
        <input id="search-bar" type='text' placeholder='Search'/>
        <div id="search-filters">Filters</div>
      </div>

      <div className='list-elements-space'>

        {!isLoading?
        arrayToShow.map( (element, index) => {
          return (
            <div className='item-list' key={index} id={`artist_${index}`}> 
              <ArtistCard artistInfo={element} setYPos={setYPos} />
            </div>
          )
        })
        :
        <div>isLoading</div>
        }


      </div>
    </div>
  )
}