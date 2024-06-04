import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import uploadImage from "../services/file-upload.service";
import { AuthContext } from "../context/auth.context";

const API_URL = "http://localhost:5005";

function BookConcert(props) {
  const [isPublicChecked, setIsPublicChecked] = useState(false)
  const [newConcert, setNewConcert] = useState({});
  const [artistCost, setArtistCost] = useState(0)
  const [artist, setArtist] = useState({})
  const [street, setStreet] = useState("")
  const [houseNumber, setHouseNumber] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [city, setCity] = useState("")
  const [address, setAddress] = useState("")
  const [validationText, setValidationText] = useState("Please validate the address before booking the concert so we can place you on the map.")

  // get user ID from auth context
  const { userInformation } = useContext(AuthContext);

  // get artist from params
  const {artistId} = useParams()

  useEffect(() => {
    axios.get(`${API_URL}/artists/${artistId}`)
    .then(response => {
      setArtist(response.data)
      setArtistCost(0)
     })
    .catch(error => {console.log(error) })
  }, [])

  const [errorMessage, setErrorMessage] = useState(undefined);
  const navigate = useNavigate();

  const handleImage = (e) => {
    const uploadData = new FormData();
    uploadData.append("imageUrl", e.target.files[0]);
    
    uploadImage(uploadData)
      .then(response => {

        const newObject = {... newConcert};
        newObject.image = response.fileUrl;
        setNewConcert(newObject)
        return 
    })
    .catch(err => console.log("Error while uploading the file: ", err));    
  }

  const handleChange = (e) => {
    const newObject = { ...newConcert };
    newObject[e.target.name] = e.target.value;
    newObject["host"] = userInformation._id
    newObject["artist"] = artistId
    newObject["isPublic"] = isPublicChecked
    setNewConcert(newObject)
    console.log(newConcert)
  }

  const handleIsPublic = (e) => {
    setIsPublicChecked(!isPublicChecked)
  }

  useEffect(() => {
    const newObject = { ...newConcert };
    newObject.isPublic = isPublicChecked
    setNewConcert(newObject)
    console.log(isPublicChecked)
  }, [isPublicChecked])

  useEffect(() => {
    setArtistCost(artist.artistFee*newConcert.duration)
    const newObject = { ...newConcert };
    newObject["artistCost"] = artistCost
    setNewConcert(newObject)
  }, [newConcert.duration])

  useEffect(() => {
    const newObject = { ...newConcert };
    newObject["artistCost"] = artistCost
    setNewConcert(newObject)
  }, [artistCost])
 
  const handleGenre = (e) => {
    const newObject = { ...newConcert };
    const genreString = e.target.value
    const genreArray = genreString.split(",")
    let trimmedArray = genreArray.map(element => element.trim())
    newObject.genre = trimmedArray
    setNewConcert(newObject)
    console.log(newObject)
  }

  const handleStreet = (e) => {
    setStreet(e.target.value)
    console.log(e.target.value)
  }

  const handleHouseNumber = (e) => {
    setHouseNumber(e.target.value)
    console.log(e.target.value)
  }

  const handleZipcode = (e) => {
    setZipCode(e.target.value)
    console.log(e.target.value)
  }

  const handleCity = (e) => {
    const newObject = { ...newConcert };
    newObject["city"] = e.target.value
    setNewConcert(newObject)
    setCity(e.target.value)
    console.log(e.target.value)
  }


  const validateAddress = () => {
    const searchAddress = street+" "+houseNumber+" "+zipCode+" "+city
    console.log("validating address..."+searchAddress)
    setValidationText("Looking up the address in all the databases in the world... (this may take a while)")
    const formatAddress = encodeURI(searchAddress);
    const apiUrl = `https://nominatim.openstreetmap.org/search?q=${formatAddress}&format=json&limit=1`;

    axios.get(apiUrl)
      .then(response => {
        const data = response.data;
        if (data && data.length > 0) {
          console.log(data)
          const { lat, lon } = data[0];
          setValidationText(data[0].display_name)
          const newObject = { ...newConcert }
          newObject.location = [Number(lat), Number(lon)]
          newObject.address = {
            street: street,
            number: houseNumber,
            zipcode: zipCode
          }
          newObject.city = city
          console.log(newObject.address)
          console.log(newObject.location)
          setNewConcert(newObject)

        } else {
          console.log('Address not found');
        }
      })
      .catch(error => {
        console.error('Error fetching geocoordinates', error);
      });
  }


  const handleSignupSubmit = (e) => {
    e.preventDefault();

    // Make an axios request to the API
    // If POST request is successful redirect to login page
    // If the request resolves with an error, set the error message in the state
    console.log(newConcert)
    axios.post(`${API_URL}/concert`, newConcert)
      .then((response) => {
        navigate("/");

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
            <h2 className="text-base font-semibold leading-7 text-gray-900">Book {artist.name} for a Concert</h2>
            <h2 className="text-base font-normal leading-7 text-gray-900">Artist fee: {artist.artistFee} euro per hour played</h2>


            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label for="username" className="block text-sm font-medium leading-6 text-gray-900">Concert Title</label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    {/* <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">workcation.com/</span> */}
                    <input type="text" name="title" id="title" autocomplete="title" onChange={handleChange} className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" required />
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                <label for="description" className="block text-sm font-medium leading-6 text-gray-900">Concert Description</label>
                <div className="mt-2">
                  <textarea id="description" name="description" onChange={handleChange} rows="3" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" required></textarea>
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600">Let others know a bit more about the venue and event itself.</p>
              </div>

              <div className="sm:col-span-2 sm:col-start-1">
                <label for="city" className="block text-sm font-medium leading-6 text-gray-900">Street</label>
                <div className="mt-2">
                  <input type="text" name="street" id="street" onChange={handleStreet} valueautocomplete="address-level2" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" required />
                </div>
              </div>

              <div className="sm:col-span-1">
                <label for="city" className="block text-sm font-medium leading-6 text-gray-900">Number</label>
                <div className="mt-2">
                  <input type="string" name="string" id="number" onChange={handleHouseNumber} valueautocomplete="address-level2" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" required />
                </div>
              </div>

              <div className="sm:col-span-1">
                <label for="city" className="block text-sm font-medium leading-6 text-gray-900">Zip Code</label>
                <div className="mt-2">
                  <input type="string" name="string" id="zipcode" onChange={handleZipcode} valueautocomplete="address-level2" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" required />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label for="city" className="block text-sm font-medium leading-6 text-gray-900">City</label>
                <div className="mt-2">
                  <input type="text" name="city" id="city" onChange={handleCity} valueautocomplete="address-level2" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" required />
                </div>
              </div>

              <div className="flex items-center justify-start gap-x-6 border-0 sm:col-start-1">
              <button type="button" onClick={validateAddress} className="rounded-md h-9 bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Validate</button>
              </div>

              <div className="sm:col-span-5">
              <p className="mt-2 text-sm leading-6 text-gray-600">{validationText}</p>
              </div>
    
              <div className="sm:col-span-2 sm:col-start-1">
                <label for="date" className="block text-sm font-medium leading-6 text-gray-900">Date and Time</label>
                <div className="mt-2">
                  <input type="datetime-local" name="date" id="date" onChange={handleChange} valueautocomplete="address-level2" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" required />
                </div>
              </div>

              <div className="sm:col-span-2">
                  <label for="groupname" className="block text-sm font-medium leading-6 text-gray-900">Concert Duration (in hours)</label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      {/* <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">workcation.com/</span> */}
                      <input type="number" name="duration" id="duration" min="0" onChange={handleChange} autocomplete="groupname" className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" required/>
                    </div>
                  </div>
                </div>

              <div className="sm:col-span-2 sm:col-start-1">
                  <label for="groupname" className="block text-sm font-medium leading-6 text-gray-900">Entrance Fee (in €)</label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      {/* <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">workcation.com/</span> */}
                      <input type="number" name="prices" id="prices" onChange={handleChange} autocomplete="groupname" className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label for="groupname" className="block text-sm font-medium leading-6 text-gray-900">Genres</label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      {/* <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">workcation.com/</span> */}
                      <input type="string" name="genre" id="genre" min="0" onChange={handleGenre} autocomplete="groupname" className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="Rock, Pop, Indie, ..." required />
                    </div>
                  </div>
                </div>


              <div className="col-span-full">
                <div className="mt-2 space-y-6">
                  <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                      <input id="isArtist" name="isArtist" type="checkbox" checked={isPublicChecked} onChange={handleIsPublic} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                    </div>
                    <div className="text-sm leading-6">
                      <label for="isArtist" className="font-medium text-gray-900">Public Event</label>
                      <p className="text-gray-500">Note: Public events will be visible to all visitors of this website.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                <label for="photo" className="block text-sm font-medium leading-6 text-gray-900">Event Photo</label>
                <div className="mt-2 flex items-center gap-x-3">
                  <svg className="h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clip-rule="evenodd" />
                  </svg>
                  {/* <button type="button" className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Change</button> */}
                  <input type="file" onChange={handleImage} />
                </div>
              </div>

              {/* <div className="col-span-full">
                <label for="photo" className="block text-sm font-medium leading-6 text-gray-900">Photo</label>
                <div className="mt-2 flex items-center gap-x-3">
                  <svg className="h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clip-rule="evenodd" />
                  </svg>
                  <button type="button" className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Change</button>
                </div>
              </div> */}



            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-start gap-x-6">
          {/* <button type="button" className="text-sm font-semibold leading-6 text-gray-900">Cancel</button> */}
          <button type="submit" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Book Concert</button>
          {newConcert.duration && <p className="text-gray-500">I confirm the artist fee of {artistCost} € will be due to {artist.name} for playing this concert.</p>}
        </div>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </>





  )
}

export default BookConcert;