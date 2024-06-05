import '../styles/DisplayConcerts.css'
import ConcertCard from './ConcertCard';
import { useState } from 'react';
import SearchBar from './SearchBar';
import LoadingPage from './LoadingPage';
import { useEffect } from 'react';

export default function DisplayConcerts({concertsArray, userInformation}) {
  const [arrayToShow, setArrayToShow] = useState(concertsArray);
  const [isLoading, setIsLoading] = useState(false);  
  const [genreFilters, setGenreFilters] = useState(concertsArray)
  const [genreFilter, setGenreFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")


  function triggerSearch(string) {
    const newArray = concertsArray.filter( element => {
      let genreToString = element.genre.join(" ")
      let allWords = element?.title + element.artist.name + element?.groupName + element.city + genreToString
      return allWords.toLowerCase().includes(string.toLowerCase())
    })
    setArrayToShow(newArray)
  }

  useEffect(() => {
    console.log(genreFilter)
    console.log(locationFilter)
    if(genreFilter === "all" && locationFilter === "all") {
      setArrayToShow(concertsArray)
      setGenreFilters(concertsArray)
    }
    if(genreFilter === "all" && locationFilter !== "all") {
        const newArray = concertsArray.filter(element => element.city.includes(locationFilter))
        setArrayToShow(newArray)
        setGenreFilters(newArray)    
    }
    if(genreFilter !== "all" && locationFilter === "all") {
        const newArray = concertsArray.filter(element => element.genre.includes(genreFilter))
        setArrayToShow(newArray)
    }
    if(genreFilter !== "all" && locationFilter !== "all") {
      const newArray = concertsArray.filter(element => element.genre.includes(genreFilter) && element.city.includes(locationFilter))
      setArrayToShow(newArray)
      const newGenreFilters = concertsArray.filter(element => element.city.includes(locationFilter))
      setGenreFilters(newGenreFilters)
  }
  }, [genreFilter, locationFilter])


  // useEffect(() => {
  //   console.log(genreFilter)
  //   console.log(locationFilter)
  //   if(genreFilter === "all" && locationFilter === "all") {
  //     setArrayToShow(concertsArray)
  //     setGenreFilters(concertsArray)
  //   }
  //   if(genreFilter === "all" && locationFilter !== "all") {
  //       const newArray = concertsArray.filter(element => element.city.includes(locationFilter))
  //       setArrayToShow(newArray)
  //       setGenreFilters(newArray)    
  //   }
  //   if(genreFilter !== "all" && locationFilter === "all") {
  //       const newArray = concertsArray.filter(element => element.genre.includes(genreFilter))
  //       setArrayToShow(newArray)
  //   }
  //   if(genreFilter !== "all" && locationFilter !== "all") {
  //     const newArray = concertsArray.filter(element => element.genre.includes(genreFilter) && element.city.includes(locationFilter))
  //     setArrayToShow(newArray)
  //     const newGenreFilters = concertsArray.filter(element => element.city.includes(locationFilter))
  //     setGenreFilters(newGenreFilters)
  // }
  // }, [locationFilter])

  // useEffect(() => {
  //   console.log(genreFilter)
  //   console.log(locationFilter)
  //   if(genreFilter === "all" && locationFilter === "all") {
  //     setArrayToShow(concertsArray)
  //     setGenreFilters(concertsArray)
  //   }
  //   if(genreFilter === "all" && locationFilter !== "all") {
  //       const newArray = concertsArray.filter(element => element.city.includes(locationFilter))
  //       setArrayToShow(newArray)
  //       setGenreFilters(newArray)    
  //   }
  //   if(genreFilter !== "all" && locationFilter === "all") {
  //       const newArray = concertsArray.filter(element => element.genre.includes(genreFilter))
  //       setArrayToShow(newArray)
  //   }
  //   if(genreFilter !== "all" && locationFilter !== "all") {
  //     const newArray = concertsArray.filter(element => element.genre.includes(genreFilter) && element.city.includes(locationFilter))
  //     setArrayToShow(newArray)
  //     const newGenreFilters = concertsArray.filter(element => element.city.includes(locationFilter))
  //     setGenreFilters(newGenreFilters)
  // }
  // }, [genreFilter])




  const genreArray = []
    genreFilters.map(element => {
        genreArray.push(element.genre)
      })
  const genreValues = genreArray.reduce((acc, arr) => acc.concat(arr), []);
  const uniqueGenres = genreValues.filter((value, index, self) => self.indexOf(value) === index);

  const cityArray = []
  concertsArray.map(element => {
    cityArray.push(element.city)
  })
  const cityValues = cityArray.reduce((acc, arr) => acc.concat(arr), []);
  const uniqueCities = cityValues.filter((value, index, self) => self.indexOf(value) === index);
  console.log(uniqueCities)

  return (
    <div id='display-elements'>
     
      <SearchBar triggerSearch={triggerSearch} />
      <div>
        <select name="city" id="city" defaultValue="all" onChange={(e) => {
          setLocationFilter(e.target.value)
        }}>
          <option value="all">All Cities</option>
          {uniqueCities.map(element => {
              return (<option value={element}>{element}</option>)
          })}
          </select>
        <select className="ml-2" name="genre" id="genre" defaultValue="all" onChange={(e) => {
          setGenreFilter(e.target.value)
        }}>
          <option value="all">All Genres</option>
          {uniqueGenres.map(element => {
              return (<option value={element}>{element}</option>)
          })}
        </select>
      </div>
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