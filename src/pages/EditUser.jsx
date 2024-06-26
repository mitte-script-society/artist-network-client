import { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import uploadImage from "../services/file-upload.service";
import { AuthContext } from "../context/auth.context";



function EditUser() {
  const [newUser, setNewUser] = useState({});
  const { userInformation } = useContext(AuthContext);
  const navigate = useNavigate();
  const location  = useLocation();

  useEffect( () => {
    axios.get(`${import.meta.env.VITE_API_URL}/user/${userInformation._id}`)
    .then( response => {
      setNewUser(response.data)
      setIsArtistChecked(response.data.isArtist)
      setShowGroupFields(response.data.moreThanOne)
    }) 
    .catch( error => {
      console.log(error)
    })
    }, [])


  const [isArtistChecked, setIsArtistChecked] = useState(false)
  const [isGroupChecked, setIsGroupChecked] = useState(0)
  const [showGroupFields, setShowGroupFields] = useState(false)
  const [errorMessage, setErrorMessage] = useState(undefined);

  const handleImage = (e) => {
    const uploadData = new FormData();
    uploadData.append("imageUrl", e.target.files[0]);
    
    uploadImage(uploadData)
      .then(response => {

        const newObject = {... newUser};
        newObject.picture = response.fileUrl;
        setNewUser(newObject)
        return 
    })
    .catch(err => console.log("Error while uploading the file: ", err));    
  }

  const handleArtistImage = (e) => {
    const uploadData = new FormData();
    uploadData.append("imageUrl", e.target.files[0]);
    
    uploadImage(uploadData)
      .then(response => {

        const newObject = {... newUser};
        newObject.artistPictures = response.fileUrl;
        setNewUser(newObject)
        return 
    })
    .catch(err => console.log("Error while uploading the file: ", err));    
  }

  const handleIsArtist = (e) => {
    setIsArtistChecked(!isArtistChecked)
  }

useEffect(() => {
  const newObject = { ...newUser };
  newObject.isArtist = isArtistChecked
  setNewUser(newObject)

}, [isArtistChecked])

  const handleIsGroup = (e) => {
    setIsGroupChecked(e.target.value)
  }

  useEffect(() => {
    const newObject = { ...newUser };
    newObject.isArtist = isGroupChecked
    setNewUser(newObject)
    if(isGroupChecked == 1) setShowGroupFields(true)
    if(isGroupChecked == 0) setShowGroupFields(false)
  }, [isGroupChecked])

  // new change handler

  const handleChange = (e) => {
    const newObject = { ...newUser };
    newObject[e.target.name] = e.target.value;
    newObject.isArtist = isArtistChecked
    newObject.moreThanOne = isGroupChecked
    setNewUser(newObject)
  }

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    const body = {
      userId: userInformation._id,
      userInfo: newUser
    }

    axios.put(`${import.meta.env.VITE_API_URL}/user`, body )
      .then((response) => {
        if (response.status === 200) {
          
          alert("User Information Updated!")
          navigate(location.state?.from || '/');
        }
        else
          alert("User not found. The programmers don´t really know what to do now")

      })
      .catch((error) => {
        const errorDescription = error.response.data.message;
        setErrorMessage(errorDescription);
        alert("Sorry, we could not update your information. Try later")
      })
  };


  return (
    <>
      <form className="max-w-3xl m-auto p-2" onSubmit={handleSignupSubmit}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Create Account</h2>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">Username*</label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input type="text" name="name" id="name" value={newUser.name} autoComplete="name" onChange={handleChange} className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" required />
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">Photo</label>
                <div className="mt-2 flex items-center gap-x-3">
                  <svg className="h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
                  </svg>
                  <input type="file" onChange={handleImage}/>
                </div>
              </div>

              <div className="sm:col-span-2 sm:col-start-1">
                <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">City*</label>
                <div className="mt-2">
                  <input type="text" name="city" id="city" onChange={handleChange} value={newUser.city} autoComplete="address-level2" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" required />
                </div>
              </div>

              <div className="col-span-full">
                <div className="mt-6 space-y-6">
                  <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                      <input id="isArtist" name="isArtist"   type="checkbox" checked={isArtistChecked} onChange={handleIsArtist} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                    </div>
                    <div className="text-sm leading-6">
                      <label htmlFor="isArtist" className="font-medium text-gray-900">Register as Artist</label>
                      <p className="text-gray-500">Note: You will need provide additional information to be listed as artist</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isArtistChecked &&
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">Artist Information</h2>

              <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                <div className="col-span-full">
                  <fieldset>
                    <div className="mt-6 space-y-6" onChange={handleIsGroup} >
                      <div className="flex items-center gap-x-3">
                        <input id="push-everything" name="isGroup" type="radio" value={0} defaultChecked={!showGroupFields} className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                        <label htmlFor="push-everything" className="block text-sm font-medium leading-6 text-gray-900">I am a solo artist</label>
                      </div>
                      <div className="flex items-center gap-x-3">
                        <input id="push-email" name="isGroup" type="radio" value={1} defaultChecked={showGroupFields} className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                        <label htmlFor="push-email" className="block text-sm font-medium leading-6 text-gray-900">We are a group</label>
                      </div>
                    </div>
                  </fieldset>
                </div>

        {showGroupFields && 

            <>
                <div className="sm:col-span-4">
                  <label htmlFor="groupName" className="block text-sm font-medium leading-6 text-gray-900">Group Name*</label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input type="text" name="groupName" id="groupName" onChange={handleChange} autoComplete="groupName" className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="Berlin Rockstars" required />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="groupname" className="block text-sm font-medium leading-6 text-gray-900">Members*</label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input type="text" name="artistMembers" id="artistMembers" onChange={handleChange} autoComplete="artistMembers" className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="Mary, John, Otto, ..." required/>
                    </div>
                  </div>
                </div>
            
            </>
                    }



                <div className="col-span-full">
                  <label htmlFor="artistDescription" className="block text-sm font-medium leading-6 text-gray-900">Description / Bio*</label>
                  <div className="mt-2">
                    <textarea id="artistDescription" name="artistDescription" value={newUser.artistDescription} onChange={handleChange} rows="3" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" required/>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-gray-600">Write a few sentences about yourself.</p>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="groupname" className="block text-sm font-medium leading-6 text-gray-900">Hourly Fee in €*</label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input type="number" name="artistFee" id="artistFee" onChange={handleChange} autoComplete="groupname" value={newUser.artistFee} className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" required/>
                    </div>
                  </div>
                </div>

              <div className="col-span-full">
                <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">Photo</label>
                <div className="mt-2 flex items-center gap-x-3">
                  <svg className="h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
                  </svg>
                  <input type="file" onChange={handleArtistImage} />
                </div>
              </div>

                <div className="sm:col-span-4">
                  <label htmlFor="artistVideos" className="block text-sm font-medium leading-6 text-gray-900">YouTube Video Link</label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input type="url" name="artistVideos" id="artistVideos" value={newUser.artistVideos} onChange={handleChange} autoComplete="groupname" className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="https://www.youtube.com/watch?v=pcVRrlmpcWk" />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="artistAudio" className="block text-sm font-medium leading-6 text-gray-900">Spotify Track Link</label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input type="url" name="artistAudio" id="artistAudio" value={newUser.artistAudio} onChange={handleChange} autoComplete="groupname" className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="https://open.spotify.com/track/5jTnYArqmGHFXpi7v4bjoa" />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="groupname" className="block text-sm font-medium leading-6 text-gray-900">Website</label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input type="url" name="artistWebsite" id="artistWebsite" value={newUser.artistWebsite} onChange={handleChange} autoComplete="groupname" className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="www.berlin-rockstars.com" />
                    </div>
                  </div>
                </div>


                <div className="sm:col-span-4">
                  <label htmlFor="groupname" className="block text-sm font-medium leading-6 text-gray-900">Genres</label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input type="text" name="artistGenre" id="artistGenres" value={newUser.artistGenre} onChange={handleChange} autoComplete="groupname" className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="Rock, Pop, Indie, ..." />
                    </div>
                  </div>
                </div>

              </div>
            </div>




          }

        </div>
        {errorMessage && 
        <div className="sm:col-span-3 bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4" role="alert">
          <p>{errorMessage}</p>
        </div>
        }

        <div className="mt-6 flex items-center justify-start gap-x-6">
          <button type="submit" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Save Changes</button>
          <p>Already have account?</p>
          <Link to={"/login"}> Login</Link>
        </div>
      </form>
    </>





  )
}

export default EditUser;