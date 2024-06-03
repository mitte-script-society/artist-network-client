import '../styles/DisplayConcerts.css'
import ConcertCard from './ConcertCard';
import { useState } from 'react';
import SearchBar from './SearchBar';
import LoadingPage from './LoadingPage';

export default function DisplayConcerts({concertsArray, userInformation}) {
  const [arrayToShow, setArrayToShow] = useState(concertsArray);
  const [isLoading, setIsLoading] = useState(false);  

  function triggerSearch(string) {
    const newArray = concertsArray.filter( element => {
      let genreToString = element.genre.join(" ")
      let allWords = element?.title + element.artist.name + element?.groupName + element.city + genreToString
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
              <div className='item-list' key={index}> 
                <ConcertCard concertInfo={element}/>
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