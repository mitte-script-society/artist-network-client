import '../styles/DisplayArtists.css'
import ArtistCard from './ArtistCard';
import { useEffect, useState } from 'react';

export default function DisplayArtists({artistsArray, userInformation}) {
  const [arrayToShow, setArrayToShow] = useState(artistsArray);
  const [isLoading, setIsLoading] = useState(false);
  const [triggerScroll, setTriggerScroll] = useState(false)
  const [yPos, setYPos] = useState(0);
  
  useEffect(() => {
    console.log("UseEffect requested, going to:", yPos);
      setIsLoading(true);
      setTimeout(() => {
      setIsLoading(false);
      setTriggerScroll( prev => !prev)
      }, 1);
  }, [userInformation]);

  useEffect ( () => {
    window.scrollTo({ top: yPos });
  }, [triggerScroll])

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
            <div className='item-list' key={index} > 
              <ArtistCard artistInfo={element} setYPos={setYPos} />
            </div>
          )
        })
        :
        <div>Loading</div>
        }
      </div>
    </div>
  )
}