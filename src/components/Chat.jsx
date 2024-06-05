import { useContext, useEffect, useState } from "react";
import "../styles/Chat.css";
import { AuthContext } from "../context/auth.context";
import LoadingPage from "./LoadingPage";
import { io } from "socket.io-client";
import Chatbox from "./Chatbox";
import axios from "axios";

const ENDPOINT = import.meta.env.VITE_API_URL;
var socket, selectedChatCompare;

export default function Chat() {
  const [socketConnected, setSocketConnected] = useState(false);
  const userData = {_id: "adfasdfasdf"}
  const { userInformation} = useContext(AuthContext);
  const [allConversations, setAllConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showingChatInfo, setShowingChatInfo] = useState(null);
  const [isSearch, setIsSearch] = useState(false)
  const [artistsArray, setArtistsArray] = useState([]);
  const [arrayToShow, setArrayToShow] = useState(artistsArray)

useEffect( ( () => {
  axios.get(`${import.meta.env.VITE_API_URL}/artists`)
    .then( (response) => {
      const newArray = response.data.sort((a, b) => a.name.localeCompare(b.name));
      setArtistsArray(newArray);
      console.log(allConversations)
      console.log(response.data)
      console.log("We just changed the value of artistsArray")
      console.log("UserInfo:", userInformation)
    })
    .catch( error => {
      console.log(error)
    })
}), [])

useEffect( (() => {
  setArrayToShow(artistsArray)
}), [artistsArray])

useEffect ( () => {
      const newArray = userInformation.conversations.map ( element => {
      const idConversation = element._id
      const participant = element.participants.filter ( person => person._id !== userInformation._id )
        return {
        idConversation,
        name: participant[0].name,
        picture: participant[0].picture,
        idOther: participant[0]._id,
        idMe: userInformation._id
        }    
       })
     setAllConversations(newArray)
     setIsLoading(false)
  } ,[userInformation])
  
  function handleSelectChat (index) {
    //With index I extract the information of the requested chat
    setIsSearch(false)
    setShowingChatInfo(allConversations[index]);
  }

  function handleCloseChat() {
    setShowingChatInfo(null)
  }

  function handleNewSearch () {
    setShowingChatInfo(null)
    setIsSearch(true)    
  }

  function createConversation(idOther, name, picture) {
    console.log("creating conversation with:", idOther, name )
    setShowingChatInfo({
      idConversation: "",
      name: name,
      picture: picture,
      idOther: idOther,
      idMe: userInformation._id
    })
    setIsSearch(false)
  }

  function handleSearch(e){
    e.preventDefault()
    triggerSearch(e.target.value);
    console.log(e.target.value)
  }

  function triggerSearch(string) {
    const newArray = artistsArray.filter( element => {
      let allNames = element.name
      return allNames.toLowerCase().includes(string.toLowerCase())
    })
    setArrayToShow(newArray)
  }

  return (

      <div className="chat-page">


        {isSearch &&
        <>

          <div className="find-new-conversation flex">
          <form id="search-bar-container">
              <input onChange={handleSearch} id="search-bar" type='text' placeholder='Find an artist to chat with'/>
            </form>
            {arrayToShow.map((element, index) => {
              return <div key={index} className="chat-list-row chat-partners" onClick={ () => createConversation(element._id, element.name, element.picture)}>
              <img src={element.picture}/>{element.name}
            </div>
            })}
          </div>
          </>
        }
        <div className="conversations-list"> 
          <h1 >My conversations</h1>
        <div onClick={handleNewSearch} className="chat-list-row max-w: 20%">New conversation</div>
          
          {allConversations.map( (element, index) => {
            return <div key={index} className="chat-list-row" onClick={ () => handleSelectChat(index)}>
              <img src={element.picture}/>{element.name}
            </div>
            })
          }
          
        </div>
        
        { showingChatInfo !== null &&
          <Chatbox chatInformation={showingChatInfo} handleCloseChat={handleCloseChat}/>
        }

      </div>

    ) 
} 

/*

  /* useEffect ( () => {
    socket = io(ENDPOINT);
    socket.emit("setup", userData);
    socket.on("connection", () => { setSocketConnected(true) 
    })
  } , [])

export default function Chat() {

  */