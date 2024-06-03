export default function SearchBar({ triggerSearch}) {

  const handleSubmit = (e) => {
    e.preventDefault()
    const inputValue = e.target.elements['search-bar'].value;
    console.log(inputValue);
    triggerSearch(inputValue);
  }

  return (
      <form onSubmit={ (e) => handleSubmit(e)} id="search-bar-container">
        <input id="search-bar" type='text' placeholder='Search'/>
        <div id="search-filters">Filters</div>
        

        <button type="submit">Search</button>
      </form>
  )
}