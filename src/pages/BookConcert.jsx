import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5005";

function BookConcert(props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [isPublic, setIsPublic] = useState(false)
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");
  const [prices, setPrices] = useState("")
  // get artist from params and host/user from context
  const artist = "123"
  const host = "456"

  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();

  // const handleEmail = (e) => setEmail(e.target.value);
  // const handlePassword = (e) => setPassword(e.target.value);
  // const handleName = (e) => setName(e.target.value);

  const handleIsPublic = (e) => {
    setIsPublic(!isPublic)
    console.log(isPublic)
  }


  const handleSignupSubmit = (e) => {
    e.preventDefault();

    // Create an object representing the request body
    const requestBody = { title, description, image, isPublic, prices, city, date, artist, host };
    console.log(requestBody)
    // Make an axios request to the API
    // If POST request is successful redirect to login page
    // If the request resolves with an error, set the error message in the state
    axios.post(`${API_URL}/concert/`, requestBody)
      .then((response) => {
        navigate("/login");

      })
      .catch((error) => {
        const errorDescription = error.response.data.message;
        setErrorMessage(errorDescription);
      })
  };


  return (
    <>
      <form className="max-w-3xl m-auto p-2" onSubmit={handleSignupSubmit} t>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Book (Artist Name) for a Concert</h2>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label for="username" className="block text-sm font-medium leading-6 text-gray-900">Concert Title</label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    {/* <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">workcation.com/</span> */}
                    <input type="text" name="title" id="title" autocomplete="title" value={title} onChange={(e) => setTitle(e.target.value)} className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" required />
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                <label for="description" className="block text-sm font-medium leading-6 text-gray-900">Concert Description</label>
                <div className="mt-2">
                  <textarea id="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" required></textarea>
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600">Let others know a bit more about the venue and event itself.</p>
              </div>

              <div className="sm:col-span-2 sm:col-start-1">
                <label for="city" className="block text-sm font-medium leading-6 text-gray-900">Location (City)</label>
                <div className="mt-2">
                  <input type="text" name="city" id="city" value={city} onChange={(e) => setCity(e.target.value)} valueautocomplete="address-level2" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" required />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label for="date" className="block text-sm font-medium leading-6 text-gray-900">Date</label>
                <div className="mt-2">
                  <input type="date" class="mt-1 block w-full" value={date} onChange={(e) => setDate(e.target.value)} valueautocomplete="address-level2" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" required />
                </div>
              </div>

              <div className="sm:col-span-2 sm:col-start-1">
                  <label for="groupname" className="block text-sm font-medium leading-6 text-gray-900">Ticket Fee in €</label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      {/* <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">workcation.com/</span> */}
                      <input type="number" name="artistFee" id="artistFee" onChange={(e) => setPrices(e.target.value)} autocomplete="groupname" className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" />
                    </div>
                  </div>
                </div>

              <div className="col-span-full">
                <div className="mt-6 space-y-6">
                  <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                      <input id="isArtist" name="isArtist" type="checkbox" checked={isPublic} onChange={handleIsPublic} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                    </div>
                    <div className="text-sm leading-6">
                      <label for="isArtist" className="font-medium text-gray-900">Public Event</label>
                      <p className="text-gray-500">Note: Public events will be visible to all visitors of this website.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                <label for="photo" className="block text-sm font-medium leading-6 text-gray-900">Photo</label>
                <div className="mt-2 flex items-center gap-x-3">
                  <svg className="h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clip-rule="evenodd" />
                  </svg>
                  <button type="button" className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Change</button>
                </div>
              </div>



            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-start gap-x-6">
          {/* <button type="button" className="text-sm font-semibold leading-6 text-gray-900">Cancel</button> */}
          <button type="submit" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Book Concert</button>
          <p className="text-gray-500">I confirm the artist fee of XY Euro to book this concert.</p>
        </div>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </>





  )
}

export default BookConcert;