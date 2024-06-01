import '../styles/DisplayArtists.css'
import ArtistCard from './ArtistCard';
import { useState } from 'react';

export default function DisplayArtists({artistsArray}) {
  
  const [arrayToShow, setArrayToShow] = useState(artistsArray);

  return (
    <div id='display-elements'>

      <div id="search-bar-container">
        <input id="search-bar" type='text' placeholder='Search'/>
        <div id="search-filters">Filters</div>
      </div>

      <div id='list-elements-space'>
        {arrayToShow.map( (element, index) => {
          return (
            <div className='item-list' key={index}> 
              <ArtistCard artistInfo={element} />
            </div>
          )
        })}
      </div>
    </div>
  )
}