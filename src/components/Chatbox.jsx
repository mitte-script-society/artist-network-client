import { useEffect, useState, useRef } from "react";
import "../styles/Chatbox.css";
import axios from "axios";
import closeButton from "../assets/closebutton.png";
import sendButton from "../assets/send.png";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL);

export default function Chatbox({ chatInformation, handleCloseChat, addConversationToList, setShowAlert}) {
  const [isLoading, setIsLoading] = useState(true);
  const [messagesArray, setMessagesArray] = useState([]);
  const storedToken = localStorage.getItem("authToken");
  const [fetchAgain, setFetchAgain] = useState(false);
  const [typingEffect, setTypingEffect] = useState(false);

  socket.on('new message', (newMessage) => {
    console.log("user got message")
    if (newMessage.destiny === chatInformation.idMe) 
      {
      setFetchAgain(!fetchAgain)
      }
  })

  socket.on('user typing', (typingInfo) => {
    if (  typingInfo.destiny === chatInformation.idMe &&
          typingInfo.sender === chatInformation.idOther ) {
      timerTyping()
    }
  })

  function timerTyping() {
    setTypingEffect(true)
    setTimeout( () => {
      setTypingEffect(false)
    } , 2000)

  }

  function isTyping() {
    const typingInfo = {
      sender: chatInformation.idMe ,
      destiny: chatInformation.idOther
    }
    socket.emit('user typing', typingInfo)
  }

  function sendMessageToSocket (newMessage) {
    //Add destiny to the message: 
    newMessage.destiny = chatInformation.idOther;    
    socket.emit('new message', newMessage)
  }

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
    
    else {
    setIsLoading(false)
    }


  } , [fetchAgain, chatInformation])

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
      messages: [newMessage]
      }
    axios.post(`${import.meta.env.VITE_API_URL}/conversation/create-conversation`, body, 
    { headers: { Authorization: `Bearer ${storedToken}`} }
    )
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
    axios.put(`${import.meta.env.VITE_API_URL}/user/add-conversation`, body, 
    { headers: { Authorization: `Bearer ${storedToken}`} }
    )
    .then( response => {
      document.getElementById('write-message').value = '';
      chatInformation.idConversation = conversationId;
      setFetchAgain(!fetchAgain);     
      addConversationToList(chatInformation);
    } )
    .catch( error => {
      console.log(error)
    })
  }

  function sendMessage(newMessage) {
    axios.put(`${import.meta.env.VITE_API_URL}/conversation/createMessage/${chatInformation.idConversation}`, newMessage,
      { headers: { Authorization: `Bearer ${storedToken}`} }
      )
    .then( (response) => {
      document.getElementById('write-message').value = '';
      sendMessageToSocket(newMessage);
      setFetchAgain(!fetchAgain);
      
    })
    .catch( error => {
      console.log(error)
    })
  }

  const lastMessageRef = useRef(null);

  // This useEffect will run whenever messages change
  useEffect(() => {
    // Scroll to the last message
    if (lastMessageRef.current) {
      // Scroll to the last message
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesArray]);

  

  return (
    <div id="chat-box">
      {isLoading?
      <div className="getting-messages">
        <div className="circle-loading"></div>
      </div>
      :
      <>
          <div className="chat-header">
            <div style={{display:"flex"}}>
              <img src={chatInformation.picture} style={{marginRight:"10px", height:"30px", width:"30px", borderRadius:"50%"}}/>
              {typingEffect?
                <div className="typing-effect">
                  <div>Typing...</div>
                  <span className="mini-loading"></span>
                </div>
              :
                <div>{chatInformation.name}</div>
              }
            </div>
            <img onClick={handleCloseChat} src={closeButton} />
          </div>

          <div id="chat-messages" className="chat-messages">
            {messagesArray.map( (message, index) => {
              return  (
              <div key={index} ref={index === messagesArray.length - 1 ? lastMessageRef : null} className={ message.sender === chatInformation.idOther? "message" :"message others" } > {message.content}</div>
              )
            })}
          </div>

          <form onSubmit={handleSendMessage} className="chat-write-space">
            <input type="text" id="write-message" placeholder="Type..." onChange={isTyping}/>
            <button type="submit" id="send-message-button"> <img src={sendButton} /> </button>
          </form>
      </>
      }
    </div>
  )
}