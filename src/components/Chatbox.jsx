import { useEffect, useState } from "react";
import "../styles/Chatbox.css";
import axios from "axios";
import closeButton from "../assets/closebutton.png"
import sendButton from "../assets/send.png"

export default function Chatbox({ chatInformation, handleCloseChat}) {
  const [isLoading, setIsLoading] = useState(true)
  const [messagesArray, setMessagesArray] = useState([])
  const storedToken = localStorage.getItem("authToken");
  const [fetchAgain, setFetchAgain] = useState(false);

  useEffect( () => {
    if (chatInformation.idConversation !== undefined)

    { 
      axios.get(`${import.meta.env.VITE_API_URL}/conversation/messages/${chatInformation.idConversation}`,
      { headers: { Authorization: `Bearer ${storedToken}`} }
      )
      .then( (response) => {
        setMessagesArray(response.data.messages)
        setIsLoading(false)
      })
      .catch( error => {
        console.log(error)
      })
    }
  } , [fetchAgain, chatInformation]) //¿Qué pasará cuando cambie el valor de chatInformation en creación de nuevo chat?

  function handleSendMessage(e) {
    e.preventDefault();
    const textareaValue = document.getElementById('write-message').value; 
    if (textareaValue.length === 0 ) {return}
    const newMessage = {
        sender: chatInformation.idMe,
        content: textareaValue
      }
    
    if (chatInformation.idConversation === undefined) {
        createChat(newMessage)
    } else {
      sendMessage(newMessage)
    }
  }
  
  //Creates a new chat and, if succesfull, invokes updateUsers
  function createChat(newMessage) {
    const body = {
      participants: [chatInformation.idMe, chatInformation.idOther],
      messages: [{
          content: newMessage,
          sender: chatInformation.idMe
          }]
      }
    axios.post(`${import.meta.env.VITE_API_URL}/conversation/create-conversation`, body)
    .then ( response => {
      response.data
      const conversationId = response.data._id
      updateUsers(conversationId)
    })
    .catch (error => {
      console.log(error)
    })
  }

  //Adds the newly created conversation to the corresponding users
  function updateUsers (conversationId) {
    const body = {
      userId: chatInformation.idMe,
      userId2: chatInformation.idOther,
      conversationId: conversationId
    }
    axios.put(`${import.meta.env.VITE_API_URL}/user/add-conversation`, body)
    .then( response => {
      console.log(response);
      chatInformation.idConversation = conversationId;
    } )
    .catch( error => {
      console.log(error)
    })
  }

  function sendMessage() {
    axios.put(`${import.meta.env.VITE_API_URL}/conversation/createMessage/${chatInformation.idConversation}`, newMessage,
      { headers: { Authorization: `Bearer ${storedToken}`} }
      )
    .then( (response) => {
      console.log(response.data)
      setFetchAgain(!fetchAgain)
      document.getElementById('write-message').value = '';
    })
    .catch( error => {
      console.log(error)
    })
  

  }

  return (
    <div id="chat-box">
      {isLoading?
      <div>Getting messages</div>
      :
      <>
          <div className="chat-header">
            <div>{chatInformation.name}</div>
            <img onClick={handleCloseChat} src={closeButton} />
          </div>

          <div id="chat-messages" className="chat-messages">
            {messagesArray.map( (message, index) => {
              return  (
              <div key={index} className={ message.sender !== chatInformation.idOther? "message" :"message others" } > {message.content}</div>
              )
            })} 
          </div>

          <form onSubmit={handleSendMessage} className="chat-write-space">
            <textarea id="write-message" placeholder="Type..."></textarea>
            <button type="submit" id="send-message-button"> <img src={sendButton} /> </button>
          </form>
      </>
      }
    </div>
  )
}