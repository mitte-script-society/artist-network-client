import '../styles/DisplayArtists.css'
import ArtistCard from './ArtistCard';

export default function DisplayArtists({setShowLogIn}) {
  
  const arrayToShow = new Array(30).fill(undefined);
  
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
              <ArtistCard setShowLogIn={setShowLogIn}/>
            </div>
          )
        } ) }

      </div>

    </div>


  )
}