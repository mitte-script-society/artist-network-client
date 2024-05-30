import { useState } from 'react'
import '../styles/DisplayElements.css'


export default function DisplayConcerts() {
  
  const arrayToShow = new Array(50).fill(undefined);

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
              {element}
            </div>
          )
        } ) }

      </div>

    </div>


  )
}