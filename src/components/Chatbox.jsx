import { useEffect, useRef, useState } from "react";
import "../styles/Chatbox.css";
import axios from "axios";


export default function Chatbox({ chatInformation, handleCloseChat}) {
  const [isLoading, setIsLoading] = useState(true)
  const [messagesArray, setMessagesArray] = useState([])
  const storedToken = localStorage.getItem("authToken");
  const [fetchAgain, setFetchAgain] = useState(false);
  const myRef = useRef();

  useEffect( () => {
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

  } , [fetchAgain]) 

  function handleSendMessage(e) {
    e.preventDefault();
    const textareaValue = document.getElementById('write-message').value; 
    if (textareaValue.length === 0 ) {return}
    const newMessage = {
        sender: chatInformation.idMe,
        content: textareaValue
      }

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
            <button onClick={handleCloseChat}>Close </button>
          </div>

          <div id="chat-messages" className="chat-messages" ref={myRef}>
            {messagesArray.map( (message, index) => {
              return  (
              <div key={index} className={ message.sender !== chatInformation.idOther? "message" :"message others" } > {message.content}</div>
              )
            })} 
          </div>

          <form onSubmit={handleSendMessage} className="chat-write-space">
            <textarea id="write-message" placeholder="Type..."></textarea>
            <button type="submit" id="send-message-button"> {`>>`} </button>
          </form>
      </>
      }
    </div>
  )
}