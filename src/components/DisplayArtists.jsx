import ArtistCard from './ArtistCard';
import { useState } from 'react';
import SearchBar from './SearchBar';
import LoadingPage from './LoadingPage';

export default function DisplayArtists({artistsArray, userInformation}) {
  const [arrayToShow, setArrayToShow] = useState(artistsArray);
  const [isLoading, setIsLoading] = useState(false);

  function triggerSearch(string) {
    const newArray = artistsArray.filter( element => {
      let genreToString = element?.artistGenre.join(" ")
      let allWords = element?.title + element.name + element?.groupName + element.city + genreToString
      return allWords.toLowerCase().includes(string.toLowerCase())
    })
    setArrayToShow(newArray)
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
        <LoadingPage/>
        }
      </div>
    </div>
  )
}