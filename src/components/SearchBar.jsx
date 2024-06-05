import { useState } from "react";
import "../styles/SearchBar.css"

export default function SearchBar({ triggerSearch}) {

  const handleSubmit = (e) => {
    e.preventDefault()
    triggerSearch(e.target.value);
  }

  return (
      <form id="search-bar-container">
        <input onChange={handleSubmit} id="search-bar" type='text' placeholder='Name, city, event, genre'/>
        {/* <button id="submit-search">Search</button> */}
        <div hidden id="search-filters">Filters</div> 

      </form>
  )
}