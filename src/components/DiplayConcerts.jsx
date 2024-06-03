import '../styles/DisplayConcerts.css'
import ConcertCard from './ConcertCard';
import { useState } from 'react';
import SearchBar from './SearchBar';
import LoadingPage from './LoadingPage';

export default function DisplayConcerts({concertsArray, userInformation}) {
  const [arrayToShow, setArrayToShow] = useState(concertsArray);
  const [isLoading, setIsLoading] = useState(false);

  //No idea if one search bar can handle the two sets of filters. 
  //THis example works only when se submit. Other possibility is to trigger the search after 
 // each letter change on the inputs. 
  function triggerSearch(string) {
    //Example for concerts: putting together all the terms of the fields where we search,

    // and checking if the string is included there. If it is, then we include the item

    //Using concertsArray, we find the elements that match the searched string
    console.log("Word to find:", string)   
    const newArray = concertsArray.filter( element => {
      let genreToString = element.genre.join(" ")
      let allWords = element.title + element.artist.name + element?.groupName + element.city + genreToString
      return allWords.toLowerCase().includes(string.toLowerCase())
    })
    console.log(newArray.length, newArray)
    console.log(newArray)
  
      /*Relevant properties to search: 
        Artists: 
          name
          gropuName
          artistGenre
          city

          Concerts: 
          title
          artist
          groupName
          city
          artistGenre      
      */

    // 

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