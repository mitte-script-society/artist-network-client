import '../styles/DisplayArtists.css'
import ArtistCard from './ArtistCard';
import { useState } from 'react';
import SearchBar from './SearchBar';

export default function DisplayArtists({artistsArray, userInformation}) {
  const [arrayToShow, setArrayToShow] = useState(artistsArray);
  const [isLoading, setIsLoading] = useState(false);

  function triggerSearch(string) {
    //Using concertsArray, we find the elements that match the searched string
    console.log("Word:", string)
    //
    //setArrayToShow(/* The elements that match the criteria */)
  }


  return (
    <div id='display-elements'>
      
      <SearchBar triggerSearch={triggerSearch} />

      <div className='list-elements-space'>

        {!isLoading?
        arrayToShow.map( (element, index) => {
          return (
            <div className='item-list' key={index} > 
              <ArtistCard artistInfo={element} />
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