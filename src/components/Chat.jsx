import { useContext, useEffect, useState } from "react";
import "../styles/Chat.css";
import { AuthContext } from "../context/auth.context";
import LoadingPage from "./LoadingPage";
import { io } from "socket.io-client";
import Chatbox from "./Chatbox";

const ENDPOINT = import.meta.env.VITE_API_URL;
var socket, selectedChatCompare;

export default function Chat() {
  const [socketConnected, setSocketConnected] = useState(false);
  const userData = {_id: "adfasdfasdf"}
  const { userInformation} = useContext(AuthContext);
  const [allConversations, setAllConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showingChatInfo, setShowingChatInfo] = useState(null);

    useEffect ( () => {
    socket = io(ENDPOINT);
    socket.emit("setup", userData);
    socket.on("connection", () => { setSocketConnected(true) 
    })
  } , [])

  function handleSelectChat () {
    //With index I extract the information of the requested chat
    const chatInfo = {
      chatId: "adsfafas",
      myId: "adfasf",
      otherId: "afasfad",
    }
    setShowingChatInfo(chatInfo)
  }
  function handleCloseChat() {
    setShowingChatInfo(null)
  }



  if (isLoading) { return <LoadingPage/> }
    
  if (!isLoading) { return (

    <div className="chat-page">

        <div className="conversations-list">Conversations list
          {/* {allConversations.map( (element, index) => {
            return <div key={index} className="chat-list-row" onClick={ () => handleSelectChat(index)}>
              {element.name}, {element.picture}
            </div>
          })
          } */}
          <div onClick={handleSelectChat}  >Info Chat 1</div>
          <div>Info Chat 2</div>
          <div>Info Chat 3</div>
        </div>
        
        { showingChatInfo !== null &&
          <Chatbox showingChatInfo={showingChatInfo} handleCloseChat={handleCloseChat}/>
        }
     
    </div>
      

    ) 
  }
} 

/*

  /* useEffect ( () => {
    socket = io(ENDPOINT);
    socket.emit("setup", userData);
    socket.on("connection", () => { setSocketConnected(true) 
    })
  } , [])

export default function Chat() {

  useEffect ( () => {
      if (userInformation.conversations) {
        console.log("Evaluó positivo:", userInformation.length)
        const newArray = userInformation.conversations.map ( element => {
        const idConversation = element._id
        const participant = element.participants.filter ( person => person._id !== userInformation._id )
          return {
          idConversation,
          name: participant[0].name,
          picture: participant[0].picture,
          idOther: participant[0]._id
          }    
         })

       setAllConversations(newArray)
       setIsLoading(false)}
    } ,[userInformation])
    
   
}  */