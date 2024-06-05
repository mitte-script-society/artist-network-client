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
    axios.get(`${import.meta.env.VITE_API_URL}/artists`)
      .then( (response) => {
        function shuffleArray(array) {
          for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
          }}
        shuffleArray(response.data);
        setArtistsArray(response.data);
        
        setIsSearch(true)

      })
      .catch( error => {
        console.log(error)
      })
    
  }

  return (

      <div className="chat-page">


        {isSearch &&
          <div className="find-new-conversation">

          </div>
        }

        <div className="conversations-list"> 
          <h1 >My conversations</h1>
        <div onClick={handleNewSearch} className="chat-list-row">New conversation</div>
          
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