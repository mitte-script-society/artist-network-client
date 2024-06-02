import '../styles/DisplayConcerts.css'
import ConcertCard from './ConcertCard';

export default function DisplayConcerts() {
  
  const arrayToShow = new Array(50).fill(undefined);
  
  return (
    <div id='display-elements'>
     
      <div id="search-bar-container">
        <input id="search-bar" type='text' placeholder='Search'/>
        <div id="search-filters">Filters</div>
      </div>

      <div className='list-elements-space'>
        {arrayToShow.map( (element, index) => {

          return (
            <div className='item-list' key={index}> 
              <ConcertCard/>
            </div>
          )
        } ) }

      </div>

    </div>


  )
}